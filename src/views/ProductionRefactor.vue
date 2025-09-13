<template>
  <div class="production-refactor">
    <div class="page-header">
      <h2>生产重构</h2>
      <div class="header-info">
        <el-tag type="info">批次：{{ currentBatch }}</el-tag>
        <el-tag type="success">总订单数：{{ orderSummary.totalOrders }}</el-tag>
        <el-tag type="warning">总任务数：{{ orderSummary.totalTasks }}</el-tag>
      </div>
    </div>
    
    <div class="page-content">
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
                :style="{ left: tick.position + '%' }"
              >
                <div class="tick-line"></div>
                <div class="tick-label">{{ tick.label }}</div>
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
         <h3>排产明细</h3>
         <el-table :data="filteredProductionAssignments" style="width: 100%" border stripe>
           <el-table-column prop="id" label="分配ID" width="80"></el-table-column>
           <el-table-column prop="task_id" label="任务ID" width="100"></el-table-column>
           <el-table-column prop="order_no" label="订单号" width="120"></el-table-column>
           <el-table-column prop="procedure_name" label="工序名称" width="120"></el-table-column>
           <el-table-column prop="equipment_desc" label="设备名称" width="150"></el-table-column>
           <el-table-column prop="jockey_name" label="操作员" width="100"></el-table-column>
           <el-table-column prop="plan_start_time" label="计划开始时间" width="180"></el-table-column>
           <el-table-column prop="plan_end_time" label="计划结束时间" width="180"></el-table-column>
           <el-table-column prop="remark" label="备注"></el-table-column>
         </el-table>
       </div>
    </div>
  </div>
</template>

<script>
import taskData from '@/data/task_data.json'
import productionAssignData from '@/data/production_assign_data.json' // 导入排产数据

export default {
  name: 'ProductionRefactor',
  data() {
    return {
      currentBatch: '2025-09-11_TSY_0401_COMPLEX_C', // 修改为排产数据的批次
      allTasks: [],
      productionAssignments: [] // 新增排产数据
    }
  },
  computed: {
    orderSummary() {
      const uniqueOrderNos = [...new Set(this.allTasks.map(task => task.order.order_no))]
      return {
        totalOrders: uniqueOrderNos.length,
        totalTasks: this.allTasks.length
      }
    },
    orderStats() {
      const orderGroups = {}
      
      this.allTasks.forEach(task => {
        const orderNo = task.order.order_no
        if (!orderGroups[orderNo]) {
          orderGroups[orderNo] = {
            orderNo: orderNo,
            productName: task.product.name,
            needNum: task.order.order_need_num,
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
          switch(task.procedure.code) {
            case '101':
              dispatchCounts.cutting++
              break
            case '102':
              dispatchCounts.rough++
              break
            case '103':
              dispatchCounts.fine++
              break
            case '106':
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
      // 进一步处理排产数据，使其适合表格展示
      return this.productionAssignments.map(item => ({
        id: item.id,
        task_id: item.task_id,
        order_no: (item.remark.match(/订单(ORD\d+)/) || [])[1] || 'N/A', // 从remark中提取订单号
        procedure_name: (item.remark.match(/(\S+)工序/) || [])[1] || 'N/A', // 从remark中提取工序名称
        equipment_desc: item.equipment_desc,
        jockey_name: item.jockey_name,
        plan_start_time: this.formatDate(item.plan_start_time.$date),
        plan_end_time: this.formatDate(item.plan_end_time.$date),
        remark: item.remark
      }))
    },
    machineSchedules() {
      const schedules = {}
      this.filteredProductionAssignments.forEach(assignment => {
        const equipmentDesc = assignment.equipment_desc
        const foundItem = this.productionAssignments.find(item => item.equipment_desc === equipmentDesc)
        const equipmentCode = foundItem ? foundItem.equipment_code : ''

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

      const totalDuration = maxTime - minTime
      const ticks = []

      // 根据时间跨度决定刻度间隔
      let intervalMinutes = 60 // 默认1小时

      if (totalDuration <= 2 * 60 * 60 * 1000) { // 2小时以内
        intervalMinutes = 30 // 30分钟
      } else if (totalDuration <= 8 * 60 * 60 * 1000) { // 8小时以内
        intervalMinutes = 60 // 1小时
      } else if (totalDuration <= 24 * 60 * 60 * 1000) { // 24小时以内
        intervalMinutes = 120 // 2小时
      } else {
        intervalMinutes = 240 // 4小时
      }

      // 生成时间刻度
      const startTime = new Date(minTime)
      startTime.setMinutes(Math.floor(startTime.getMinutes() / intervalMinutes) * intervalMinutes, 0, 0)

      const endTime = new Date(maxTime)
      endTime.setMinutes(Math.ceil(endTime.getMinutes() / intervalMinutes) * intervalMinutes, 0, 0)

      for (let time = startTime.getTime(); time <= endTime.getTime(); time += intervalMinutes * 60 * 1000) {
        const position = ((time - minTime) / totalDuration) * 100
        if (position >= -5 && position <= 105) { // 稍微超出边界以确保显示完整
          const date = new Date(time)
          const hours = date.getHours().toString().padStart(2, '0')
          const minutes = date.getMinutes().toString().padStart(2, '0')
          ticks.push({
            time: time,
            position: position,
            label: `${hours}:${minutes}`
          })
        }
      }

      return ticks
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      // 加载任务数据，过滤指定批次 (使用原始批次)
      this.allTasks = taskData.filter(task =>
        task.model_run_batch === '20240905'
      )
      // 加载排产数据，过滤指定批次
      this.productionAssignments = productionAssignData.filter(item =>
        item.model_run_batch === this.currentBatch
      )
    },
    getOrderStatusType(status) {
      const types = {
        '已排产': 'success',
        '排产中': 'warning',
        '未开始': 'info'
      }
      return types[status] || 'default'
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      return new Date(dateString).toLocaleString('zh-CN', options).replace(/\//g, '-');
    },
    getTaskBlockStyle(assignment, allAssignments) {
      // 计算这台机器所有任务的时间范围
      const startTimes = allAssignments.map(a => new Date(a.plan_start_time))
      const endTimes = allAssignments.map(a => new Date(a.plan_end_time))
      const machineStart = Math.min(...startTimes)
      const machineEnd = Math.max(...endTimes)
      const totalDuration = machineEnd - machineStart

      // 计算当前任务的位置和宽度
      const taskStart = new Date(assignment.plan_start_time)
      const taskEnd = new Date(assignment.plan_end_time)
      const taskDuration = taskEnd - taskStart

      const leftPercent = ((taskStart - machineStart) / totalDuration) * 100
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
        width: Math.max(widthPercent, 5) + '%', // 最小宽度5%，确保可见
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
        border: '1px solid rgba(255,255,255,0.2)'
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
  
  .header-info {
    flex-wrap: wrap;
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
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.production-schedule h3 {
  font-size: 20px;
  color: #303133;
  margin-bottom: 15px;
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
