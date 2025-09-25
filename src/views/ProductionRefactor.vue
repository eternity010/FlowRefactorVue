<template>
  <div class="production-refactor">
    <div class="page-header">
      <div class="header-left">
        <el-button
          type="primary"
          icon="el-icon-arrow-left"
          @click="goBack"
          size="small"
          class="back-btn">
          返回上一步
        </el-button>
        <h2>生产重构</h2>
      </div>
      <div class="header-info">
        <el-tag type="info">批次：{{ currentBatch }}</el-tag>
        <el-tag type="success">总订单数：{{ orderSummary.totalOrders }}</el-tag>
        <el-tag type="warning">总任务数：{{ orderSummary.totalTasks }}</el-tag>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-loading-wrap>
        <div style="text-align: center; padding: 50px;">
          <i class="el-icon-loading" style="font-size: 24px; color: #409EFF;"></i>
          <p style="margin-top: 15px; color: #606266;">正在加载生产任务数据...</p>
        </div>
      </el-loading-wrap>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <el-alert
        title="数据加载失败"
        :description="error"
        type="error"
        show-icon
        :closable="false">
        <el-button 
          type="primary" 
          size="small" 
          @click="loadData"
          style="margin-top: 10px;">
          重新加载
        </el-button>
      </el-alert>
    </div>
    
    <div v-else class="page-content">
       <!-- 订单统计概览 -->
       <div class="order-overview">
         <el-row :gutter="16">
           <el-col :span="6" v-for="order in orderStats" :key="order.orderNo">
             <el-card class="order-stat-card" shadow="hover">
               <!-- 头部信息 -->
               <div class="card-header">
                 <div class="order-title">
                   <span class="order-no">{{ order.orderNo }}</span>
                   <el-tag :type="getOrderStatusType(order.status)" size="mini">
                     {{ order.status }}
                   </el-tag>
                 </div>
                 <div class="product-basic">
                   <span class="product-name">{{ order.productName }}</span>
                   <span class="quantity">{{ order.needNum }}件</span>
                 </div>
               </div>
               
               <!-- 派工单统计 -->
               <div class="dispatch-summary">
                 <div class="dispatch-row">
                   <div class="dispatch-item">
                     <span class="count cutting">{{ order.dispatchCounts.cutting }}</span>
                     <span class="label">下料</span>
                   </div>
                   <div class="dispatch-item">
                     <span class="count rough">{{ order.dispatchCounts.rough }}</span>
                     <span class="label">粗加工</span>
                   </div>
                   <div class="dispatch-item">
                     <span class="count fine">{{ order.dispatchCounts.fine }}</span>
                     <span class="label">精加工</span>
                   </div>
                   <div class="dispatch-item">
                     <span class="count check">{{ order.dispatchCounts.check }}</span>
                     <span class="label">检验</span>
                   </div>
                 </div>
                 <div class="total-line">
                   <span class="total-text">总计 {{ order.totalDispatches }} 份</span>
                 </div>
               </div>
             </el-card>
           </el-col>
         </el-row>
       </div>

        <!-- 机器运转甘特图 -->
        <div class="machine-timeline">
          <h3>机器运转甘特图</h3>

          <!-- 时间轴刻度 -->
          <div class="timeline-scale">
            <div class="time-scale-track">
              <div
                v-for="tick in timelineTicks"
                :key="tick.time"
                class="time-tick"
                :class="{ 'hour-tick': tick.isHourMark }"
                :style="{ left: tick.position + '%' }"
              >
                <div class="tick-line" :class="{ 'hour-line': tick.isHourMark }"></div>
                <div class="tick-label" :class="{ 'hour-label': tick.isHourMark }">{{ tick.label }}</div>
              </div>
            </div>
          </div>

          <div class="timeline-container">
            <div v-for="(schedule, index) in machineSchedules" :key="index" class="machine-row">
              <div class="machine-header">
                <h4>{{ schedule.equipment_desc }}</h4>
                <span class="machine-code">{{ schedule.equipment_code }}</span>
              </div>
              <div class="timeline-track">
                <div
                  v-for="assignment in schedule.assignments"
                  :key="assignment.id"
                  class="task-timeline-block"
                  :style="getTaskBlockStyle(assignment, schedule.assignments)"
                >
                  <el-tooltip
                    :content="`任务${assignment.task_id} - ${assignment.procedure_name} | ${assignment.jockey_name} | ${assignment.plan_start_time} ~ ${assignment.plan_end_time}`"
                    placement="top"
                  >
                    <div class="task-content">
                      <span class="task-id">{{ assignment.task_id }}</span>
                      <span class="task-procedure">{{ assignment.procedure_name }}</span>
                    </div>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 排产明细展示 -->
       <div class="production-schedule">
         <div class="schedule-header" @click="toggleScheduleExpanded">
           <h3>
             <i :class="scheduleExpanded ? 'el-icon-arrow-down' : 'el-icon-arrow-right'" class="expand-icon"></i>
             排产明细
             <span class="task-count">({{ filteredProductionAssignments.length }}条任务)</span>
           </h3>
           <el-button size="mini" type="text">
             {{ scheduleExpanded ? '收起' : '展开' }}
           </el-button>
         </div>
         
         <el-collapse-transition>
           <div v-show="scheduleExpanded" class="schedule-content">
             <!-- 按订单分组的排产明细 -->
             <div v-for="group in groupedAssignments" :key="group.orderNo" class="order-group">
               <div class="order-group-header" @click="toggleOrderGroup(group.orderNo)">
                 <div class="order-info">
                   <i :class="group.expanded ? 'el-icon-arrow-down' : 'el-icon-arrow-right'" class="group-expand-icon"></i>
                   <span class="order-title">订单 {{ group.orderNo }}</span>
                   <el-tag size="mini" :type="getOrderStatusType(group.status)">{{ group.status }}</el-tag>
                   <span class="product-info">{{ group.productName }} ({{ group.taskCount }}个任务)</span>
                 </div>
                 <div class="order-summary">
                   <span class="time-range">{{ group.timeRange }}</span>
                 </div>
               </div>
               
               <el-collapse-transition>
                 <div v-show="group.expanded" class="order-tasks">
                   <div v-for="task in group.tasks" :key="task.id" class="task-card">
                     <div class="task-header">
                       <div class="task-basic-info">
                         <span class="task-id">任务 {{ task.task_id }}</span>
                         <el-tag size="mini" :type="getProcedureType(task.procedure_name)">
                           {{ task.procedure_name }}
                         </el-tag>
                       </div>
                       <div class="task-time">
                         {{ task.plan_start_time }} ~ {{ task.plan_end_time }}
                       </div>
                     </div>
                     <div class="task-details">
                       <div class="detail-row">
                         <span class="detail-label">设备：</span>
                         <span class="detail-value">{{ task.equipment_desc }}</span>
                       </div>
                       <div class="detail-row">
                         <span class="detail-label">操作员：</span>
                         <span class="detail-value">{{ task.jockey_name }}</span>
                       </div>
                       <div class="detail-row" v-if="task.remark">
                         <span class="detail-label">备注：</span>
                         <span class="detail-value">{{ task.remark }}</span>
                       </div>
                     </div>
                   </div>
                 </div>
               </el-collapse-transition>
             </div>
           </div>
         </el-collapse-transition>
       </div>
       
       <!-- 下一步按钮 -->
       <div class="next-step-container">
         <el-button 
           type="primary" 
           size="medium" 
           @click="goToNextStep"
           icon="el-icon-arrow-right">
           下一步
         </el-button>
       </div>
    </div>
  </div>
</template>

<script>
import topic04Api from '@/api/topic04Api' // 导入Topic04 API

export default {
  name: 'ProductionRefactor',
  data() {
    return {
      currentBatch: '20240905', // 使用数据库中的模型运行批次
      allTasks: [],
      productionAssignments: [], // 排产数据
      loading: false,
      error: null,
      scheduleExpanded: false, // 排产明细展开状态
      orderGroupStates: {} // 订单组展开状态
    }
  },
  computed: {
    orderSummary() {
      if (!this.allTasks || this.allTasks.length === 0) {
        return {
          totalOrders: 0,
          totalTasks: 0
        }
      }
      
      const uniqueOrderNos = [...new Set(this.allTasks.map(task => task.order_no))]
      return {
        totalOrders: uniqueOrderNos.length,
        totalTasks: this.allTasks.length
      }
    },
    orderStats() {
      if (!this.allTasks || this.allTasks.length === 0) {
        return []
      }
      
      const orderGroups = {}
      
      this.allTasks.forEach(task => {
        const orderNo = task.order_no
        if (!orderGroups[orderNo]) {
          orderGroups[orderNo] = {
            orderNo: orderNo,
            productName: task.product_name,
            needNum: task.order_need_num,
            tasks: [],
            status: '进行中'
          }
        }
        orderGroups[orderNo].tasks.push(task)
      })
      
      return Object.values(orderGroups).map(order => {
        // 统计各工序的派工单数量
        const dispatchCounts = {
          cutting: 0,   // 下料
          rough: 0,     // 粗加工
          fine: 0,      // 精加工
          check: 0      // 检验包装
        }
        
        order.tasks.forEach(task => {
          switch(task.procedure_code) {
            case 101:
              dispatchCounts.cutting++
              break
            case 102:
              dispatchCounts.rough++
              break
            case 103:
              dispatchCounts.fine++
              break
            case 106:
              dispatchCounts.check++
              break
          }
        })
        
        const totalDispatches = Object.values(dispatchCounts).reduce((a, b) => a + b, 0)
        const hasAllProcedures = dispatchCounts.cutting > 0 && 
                                dispatchCounts.rough > 0 && 
                                dispatchCounts.fine > 0 && 
                                dispatchCounts.check > 0
        
        return {
          ...order,
          dispatchCounts,
          totalDispatches,
          status: hasAllProcedures ? '已排产' : '排产中'
        }
      })
    },
    filteredProductionAssignments() {
      // 将生产任务数据转换为表格展示格式
      if (!this.allTasks || this.allTasks.length === 0) {
        return []
      }
      
      return this.allTasks.map(task => ({
        id: task.id,
        task_id: task.task_id,
        order_no: task.order_no,
        procedure_name: task.procedure_name,
        equipment_desc: task.work_center_name, // 使用工作中心名称作为设备描述
        jockey_name: task.jockey_name,
        plan_start_time: this.formatDate(task.plan_start_time),
        plan_end_time: this.formatDate(task.plan_end_time),
        remark: task.remark || `${task.procedure_name}工序 - 订单${task.order_no}`
      }))
    },
    machineSchedules() {
      if (!this.filteredProductionAssignments || this.filteredProductionAssignments.length === 0) {
        return []
      }
      
      const schedules = {}
      this.filteredProductionAssignments.forEach(assignment => {
        const equipmentDesc = assignment.equipment_desc
        // 从任务中获取工作中心编码
        const task = this.allTasks.find(t => t.id === assignment.id)
        const equipmentCode = task ? task.work_center_code : ''

        if (!schedules[equipmentDesc]) {
          schedules[equipmentDesc] = {
            equipment_desc: equipmentDesc,
            equipment_code: equipmentCode,
            assignments: []
          }
        }
        schedules[equipmentDesc].assignments.push(assignment)
      })

      // 按开始时间排序每台机器的任务
      Object.values(schedules).forEach(machine => {
        machine.assignments.sort((a, b) => new Date(a.plan_start_time) - new Date(b.plan_start_time))
      })

      return Object.values(schedules)
    },
    timelineTicks() {
      if (!this.machineSchedules.length) return []

      // 获取所有任务的时间范围
      let minTime = Infinity
      let maxTime = -Infinity

      this.machineSchedules.forEach(machine => {
        machine.assignments.forEach(assignment => {
          const startTime = new Date(assignment.plan_start_time).getTime()
          const endTime = new Date(assignment.plan_end_time).getTime()
          minTime = Math.min(minTime, startTime)
          maxTime = Math.max(maxTime, endTime)
        })
      })

      if (minTime === Infinity || maxTime === -Infinity) return []

      // 基于数据库任务时间范围（08:00-17:30，约9.5小时）进行优化
      const totalDuration = maxTime - minTime
      const totalHours = totalDuration / (60 * 60 * 1000)
      const ticks = []

      // 针对生产任务时间特点调整刻度策略
      let intervalMinutes
      let showMinutes = false

      if (totalHours <= 2) {
        intervalMinutes = 15 // 15分钟间隔，适合短时间任务
        showMinutes = true
      } else if (totalHours <= 4) {
        intervalMinutes = 30 // 30分钟间隔
        showMinutes = true
      } else if (totalHours <= 10) {
        intervalMinutes = 60 // 1小时间隔，适合一个工作日的任务
        showMinutes = false
      } else if (totalHours <= 24) {
        intervalMinutes = 120 // 2小时间隔
        showMinutes = false
      } else {
        intervalMinutes = 240 // 4小时间隔
        showMinutes = false
      }

      // 从整点开始生成刻度，更符合生产计划的习惯
      const startTime = new Date(minTime)
      if (!showMinutes) {
        // 从整点开始
        startTime.setMinutes(0, 0, 0)
        // 如果起始时间早于任务开始时间，向前调整一个间隔
        if (startTime.getTime() > minTime) {
          startTime.setTime(startTime.getTime() - intervalMinutes * 60 * 1000)
        }
      } else {
        // 从15分钟的倍数开始
        const minutes = startTime.getMinutes()
        const roundedMinutes = Math.floor(minutes / intervalMinutes) * intervalMinutes
        startTime.setMinutes(roundedMinutes, 0, 0)
      }

      const endTime = new Date(maxTime)
      if (!showMinutes) {
        endTime.setMinutes(59, 59, 999) // 扩展到小时结束
      } else {
        const minutes = endTime.getMinutes()
        const roundedMinutes = Math.ceil(minutes / intervalMinutes) * intervalMinutes
        endTime.setMinutes(roundedMinutes, 0, 0)
      }

      // 生成时间刻度
      for (let time = startTime.getTime(); time <= endTime.getTime(); time += intervalMinutes * 60 * 1000) {
        const position = ((time - minTime) / totalDuration) * 100
        if (position >= -10 && position <= 110) { // 允许稍微超出边界
          const date = new Date(time)
          const hours = date.getHours().toString().padStart(2, '0')
          const minutes = date.getMinutes().toString().padStart(2, '0')
          
          let label
          if (showMinutes || minutes !== '00') {
            label = `${hours}:${minutes}`
          } else {
            label = `${hours}:00`
          }
          
          ticks.push({
            time: time,
            position: position,
            label: label,
            isHourMark: minutes === '00' // 标记整点
          })
        }
      }

      return ticks
    },
    groupedAssignments() {
      if (!this.filteredProductionAssignments || this.filteredProductionAssignments.length === 0) {
        return []
      }
      
      const groups = {}
      
      // 按订单号分组
      this.filteredProductionAssignments.forEach(task => {
        const orderNo = task.order_no
        if (!groups[orderNo]) {
          const orderTask = this.allTasks.find(t => t.order_no === orderNo)
          groups[orderNo] = {
            orderNo: orderNo,
            productName: orderTask ? orderTask.product_name : '未知产品',
            tasks: [],
            expanded: this.orderGroupStates[orderNo] || false,
            status: '已排产'
          }
        }
        groups[orderNo].tasks.push(task)
      })
      
      // 计算每个组的统计信息
      Object.values(groups).forEach(group => {
        group.taskCount = group.tasks.length
        
        // 排序任务按时间
        group.tasks.sort((a, b) => new Date(a.plan_start_time) - new Date(b.plan_start_time))
        
        // 计算时间范围
        if (group.tasks.length > 0) {
          const firstTask = group.tasks[0]
          const lastTask = group.tasks[group.tasks.length - 1]
          const startTime = firstTask.plan_start_time.split(' ')[1].substring(0, 5)
          const endTime = lastTask.plan_end_time.split(' ')[1].substring(0, 5)
          group.timeRange = `${startTime} ~ ${endTime}`
        } else {
          group.timeRange = ''
        }
      })
      
      return Object.values(groups).sort((a, b) => a.orderNo.localeCompare(b.orderNo))
    },
    globalTimeRange() {
      // 计算全局时间范围，用于甘特图任务块定位
      let minTime = Infinity
      let maxTime = -Infinity

      this.machineSchedules.forEach(machine => {
        machine.assignments.forEach(assignment => {
          const startTime = new Date(assignment.plan_start_time).getTime()
          const endTime = new Date(assignment.plan_end_time).getTime()
          minTime = Math.min(minTime, startTime)
          maxTime = Math.max(maxTime, endTime)
        })
      })

      return {
        minTime: minTime === Infinity ? 0 : minTime,
        maxTime: maxTime === -Infinity ? 0 : maxTime,
        totalDuration: (maxTime === -Infinity || minTime === Infinity) ? 0 : maxTime - minTime
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    goBack() {
      console.log('🔙 返回上一步')
      this.$router.go(-1)
    },
    goToNextStep() {
      console.log('🔜 跳转到下一步')
      this.$router.push({
        name: 'ProductionRefactor2',
        query: {
          batch: this.currentBatch
        }
      })
    },
    async loadData() {
      this.loading = true
      this.error = null
      
      try {
        console.log('🔄 开始加载生产任务数据...')
        
        // 从API获取生产任务数据
        const response = await topic04Api.getProductionTasks(this.currentBatch)
        
        if (response.success && response.data) {
          this.allTasks = response.data.tasks || []
          console.log(`✅ 成功加载 ${this.allTasks.length} 条生产任务数据`)
          
          // 清空排产数据，因为我们现在使用任务数据
          this.productionAssignments = []
          
          this.$message({
            type: 'success',
            message: `成功加载${this.allTasks.length}条生产任务数据`,
            duration: 3000
          })
        } else {
          throw new Error(response.error || '获取生产任务数据失败')
        }
      } catch (error) {
        console.error('❌ 加载生产任务数据失败:', error)
        this.error = error.message
        this.allTasks = []
        this.productionAssignments = []
        
        this.$message({
          type: 'error',
          message: `加载数据失败: ${error.message}`,
          duration: 5000
        })
      } finally {
        this.loading = false
      }
    },
    getOrderStatusType(status) {
      const types = {
        '已排产': 'success',
        '排产中': 'warning',
        '未开始': 'info'
      }
      return types[status] || 'default'
    },
    getProcedureType(procedureName) {
      const types = {
        '下料': 'primary',
        '粗加工': 'warning',
        '精加工': 'info',
        '检验包装': 'success'
      }
      return types[procedureName] || 'default'
    },
    toggleScheduleExpanded() {
      this.scheduleExpanded = !this.scheduleExpanded
    },
    toggleOrderGroup(orderNo) {
      this.$set(this.orderGroupStates, orderNo, !this.orderGroupStates[orderNo])
      // 同时更新groupedAssignments中的状态
      const group = this.groupedAssignments.find(g => g.orderNo === orderNo)
      if (group) {
        group.expanded = this.orderGroupStates[orderNo]
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      
      // 处理数据库返回的日期格式 (可能是字符串或者对象)
      let date
      if (typeof dateString === 'object' && dateString.$date) {
        date = new Date(dateString.$date)
      } else {
        date = new Date(dateString)
      }
      
      if (isNaN(date.getTime())) {
        return dateString // 如果无法解析，返回原始字符串
      }
      
      const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
      }
      return date.toLocaleString('zh-CN', options).replace(/\//g, '-')
    },
    getTaskBlockStyle(assignment, allAssignments) {
      // 使用全局时间范围计算属性，与时间轴刻度保持一致
      const { minTime, maxTime, totalDuration } = this.globalTimeRange

      // 如果没有有效的时间范围，返回默认样式
      if (totalDuration === 0) {
        return {
          left: '0%',
          width: '100%',
          backgroundColor: '#909399',
          position: 'absolute',
          height: '30px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px'
        }
      }

      // 计算当前任务的位置和宽度
      const taskStart = new Date(assignment.plan_start_time).getTime()
      const taskEnd = new Date(assignment.plan_end_time).getTime()
      const taskDuration = taskEnd - taskStart

      // 基于全局时间轴计算位置和宽度
      const leftPercent = ((taskStart - minTime) / totalDuration) * 100
      const widthPercent = (taskDuration / totalDuration) * 100

      // 根据工序类型设置颜色
      const procedureColors = {
        '下料': '#409EFF',
        '粗加工': '#E6A23C',
        '精加工': '#909399',
        '检验包装': '#67C23A'
      }

      return {
        left: leftPercent + '%',
        width: Math.max(widthPercent, 2) + '%', // 最小宽度2%，确保可见
        backgroundColor: procedureColors[assignment.procedure_name] || '#909399',
        position: 'absolute',
        height: '30px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        zIndex: 1
      }
    }
  }
}
</script>

<style scoped>
.production-refactor {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.loading-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.error-container {
  margin: 20px 0;
}

.page-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.back-btn {
  font-weight: 500;
  border-radius: 6px;
}

.page-header h2 {
  font-size: 24px;
  color: #303133;
  margin: 0;
  padding: 0;
}

.header-info {
  display: flex;
  gap: 10px;
}

.header-info .el-tag {
  font-size: 14px;
  font-weight: 500;
  padding: 8px 12px;
}

.page-content {
  background-color: transparent;
  padding: 0;
}

/* 订单概览样式 */
.order-overview {
  margin-bottom: 20px;
}

.order-stat-card {
  height: 140px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
}

.order-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* 卡片头部样式 */
.card-header {
  padding: 12px 16px 8px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafbfc;
}

.order-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.order-no {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.product-basic {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-name {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

.quantity {
  font-size: 12px;
  color: #67C23A;
  font-weight: 600;
}

/* 派工单统计样式 */
.dispatch-summary {
  padding: 12px 16px 8px;
}

.dispatch-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}

.dispatch-item {
  text-align: center;
  padding: 4px 2px;
}

.dispatch-item .count {
  display: block;
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 2px;
}

.dispatch-item .label {
  font-size: 10px;
  color: #909399;
  font-weight: 500;
}

.count.cutting {
  color: #409EFF;
}

.count.rough {
  color: #E6A23C;
}

.count.fine {
  color: #909399;
}

.count.check {
  color: #67C23A;
}

.total-line {
  text-align: center;
  padding-top: 6px;
  border-top: 1px solid #f0f0f0;
}

.total-text {
  font-size: 12px;
  color: #409EFF;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .order-stat-card {
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .header-left {
    width: 100%;
    justify-content: space-between;
  }

  .header-info {
    flex-wrap: wrap;
    width: 100%;
  }
}

/* 自定义标签颜色 */
.el-tag--success {
  background-color: #f0f9eb;
  border-color: #c2e7b0;
  color: #67c23a;
}

.el-tag--warning {
  background-color: #fdf6ec;
  border-color: #f5dab1;
  color: #e6a23c;
}

.el-tag--info {
  background-color: #f4f4f5;
  border-color: #e9e9eb;
  color: #909399;
}

.production-schedule {
  margin-top: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 排产明细头部 */
.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e6ebf0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.schedule-header:hover {
  background-color: #f0f2f5;
}

.schedule-header h3 {
  font-size: 18px;
  color: #303133;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.expand-icon {
  font-size: 14px;
  color: #606266;
  transition: transform 0.2s ease;
}

.task-count {
  font-size: 14px;
  color: #909399;
  font-weight: normal;
}

/* 排产明细内容 */
.schedule-content {
  padding: 0;
}

/* 订单分组样式 */
.order-group {
  border-bottom: 1px solid #f0f0f0;
}

.order-group:last-child {
  border-bottom: none;
}

.order-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #fafbfc;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.order-group-header:hover {
  background-color: #f5f7fa;
}

.order-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.group-expand-icon {
  font-size: 12px;
  color: #909399;
  transition: transform 0.2s ease;
}

.order-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.product-info {
  font-size: 14px;
  color: #606266;
}

.order-summary {
  display: flex;
  align-items: center;
  gap: 15px;
}

.time-range {
  font-size: 13px;
  color: #909399;
  font-family: 'Courier New', monospace;
  background-color: #f0f2f5;
  padding: 4px 8px;
  border-radius: 4px;
}

/* 任务列表样式 */
.order-tasks {
  padding: 0 20px 16px;
}

.task-card {
  background-color: #fff;
  border: 1px solid #e6ebf0;
  border-radius: 6px;
  margin-bottom: 12px;
  transition: box-shadow 0.2s ease;
}

.task-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-card:last-child {
  margin-bottom: 0;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #fafbfc;
  border-bottom: 1px solid #f0f0f0;
}

.task-basic-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.task-id {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.task-time {
  font-size: 13px;
  color: #606266;
  font-family: 'Courier New', monospace;
}

.task-details {
  padding: 12px 16px;
}

.detail-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-size: 13px;
  color: #909399;
  width: 60px;
  flex-shrink: 0;
}

.detail-value {
  font-size: 13px;
  color: #303133;
  flex: 1;
}

/* 下一步按钮样式 */
.next-step-container {
  margin-top: 30px;
  padding: 20px;
  text-align: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 机器运转时间轴样式 */
.machine-timeline {
  margin-top: 30px;
  margin-bottom: 30px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.machine-timeline h3 {
  font-size: 20px;
  color: #303133;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.machine-timeline h3::before {
  content: '📊';
  margin-right: 8px;
}

/* 时间轴刻度样式 */
.timeline-scale {
  margin-bottom: 20px;
  position: relative;
}

.time-scale-track {
  position: relative;
  height: 40px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e6ebf0;
  margin: 10px 12px;
}

.time-tick {
  position: absolute;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tick-line {
  width: 1px;
  height: 20px;
  background-color: #909399;
  margin-bottom: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}

.tick-line.hour-line {
  width: 2px;
  height: 25px;
  background-color: #409EFF;
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.3);
}

.tick-label {
  font-size: 11px;
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
  transform: rotate(-45deg);
  transform-origin: center top;
  margin-top: 2px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 1px 4px;
  border-radius: 3px;
  border: 1px solid #e6ebf0;
  transition: all 0.2s ease;
}

.tick-label.hour-label {
  font-size: 12px;
  color: #409EFF;
  font-weight: 600;
  background-color: rgba(64, 158, 255, 0.1);
  border: 1px solid #409EFF;
  transform: rotate(-30deg); /* 稍微减少旋转角度，更易读 */
  z-index: 10;
}

.timeline-container {
  padding: 10px 0;
}

.machine-row {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #e6e6e6;
}

.machine-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.machine-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #409EFF;
}

.machine-header h4 {
  font-size: 16px;
  color: #303133;
  margin: 0;
  font-weight: 600;
}

.machine-code {
  font-size: 12px;
  color: #909399;
  background-color: #e9ecef;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.timeline-track {
  position: relative;
  height: 40px;
  background-color: #f5f7fa;
  border-radius: 8px;
  border: 1px solid #e6ebf0;
  margin: 10px 12px;
  overflow: visible;
}

.task-timeline-block {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.task-timeline-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
  z-index: 10;
}

.task-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2px 4px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
}

.task-id {
  font-weight: 600;
  font-size: 11px;
  line-height: 1;
}

.task-procedure {
  font-size: 10px;
  opacity: 0.9;
  line-height: 1;
}
</style>
