<template>
  <div class="production-refactor3">
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
        <el-tag type="info">装配批次：{{ currentBatch }}</el-tag>
        <el-tag type="primary" v-if="nodeId">节点ID：{{ nodeId }}</el-tag>
        <el-tag type="success">第三阶段</el-tag>
      </div>
    </div>
    
    <!-- 数据状态卡片 - 始终显示在页面顶部 -->
    <div class="data-status-section">
      <div class="status-cards">
        <div class="status-card">
          <div class="card-icon">
            <i class="el-icon-user"></i>
          </div>
          <div class="card-content">
            <h4>员工匹配度数据</h4>
            <div class="status-indicator">
              <el-progress
                type="circle"
                :percentage="userLoadingProgress"
                :width="60"
                :stroke-width="6"
                color="#409EFF">
              </el-progress>
              <p class="status-text" :class="{ 'loaded': userDataLoaded }">
                {{ userDataLoaded ? '已加载完成' : '加载中...' }}
              </p>
            </div>
          </div>
        </div>

        <div class="status-card">
          <div class="card-icon">
            <i class="el-icon-setting"></i>
          </div>
          <div class="card-content">
            <h4>设备健康度数据</h4>
            <div class="status-indicator">
              <el-progress
                type="circle"
                :percentage="equipmentLoadingProgress"
                :width="60"
                :stroke-width="6"
                color="#E6A23C">
              </el-progress>
              <p class="status-text" :class="{ 'loaded': equipmentDataLoaded }">
                {{ equipmentDataLoaded ? '已加载完成' : '加载中...' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="page-content">
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

      <div v-else>
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

        <!-- 生产重构操作区域 -->
        <div class="refactor-operation-section" v-if="!refactorCompleted">
          <el-card class="refactor-operation-card" shadow="hover">
            <div class="refactor-operation-content">
              <div class="refactor-operation-info">
                <div class="refactor-operation-icon">
                  <i class="el-icon-setting"></i>
                </div>
                <div class="refactor-operation-details">
                  <h4>生产重构优化</h4>
                  <p>基于当前的生产排产数据，进行智能优化分析和重构，生成更高效的生产流程</p>
                  <div class="refactor-operation-benefits">
                    <el-tag size="small" type="success">生产效率提升</el-tag>
                    <el-tag size="small" type="warning">资源利用优化</el-tag>
                    <el-tag size="small" type="info">流程自动化</el-tag>
                  </div>
                </div>
              </div>

              <div class="refactor-operation-actions">
                <el-button
                  type="primary"
                  size="large"
                  icon="el-icon-cpu"
                  :loading="refactorLoading"
                  @click="startRefactorProcess"
                  class="refactor-start-btn">
                  {{ refactorLoading ? '正在重构中...' : '开始生产重构' }}
                </el-button>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 重构后的流程甘特图 -->
        <div v-if="refactorCompleted" class="optimized-timeline">
          <h3>重构优化后的生产流程</h3>

          <!-- 时间轴刻度 -->
          <div class="timeline-scale">
            <div class="time-scale-track">
              <div
                v-for="tick in optimizedTimelineTicks"
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
            <div v-for="(schedule, index) in optimizedSchedules" :key="index" class="machine-row optimized">
              <div class="machine-header">
                <h4>设备ID: {{ schedule.equipment_id }}</h4>
                <span class="work-center-info">
                  工作中心: {{ schedule.work_center_id }} - {{ schedule.work_center_name }}
                </span>
                <div class="optimization-badge">
                  <el-tag type="success" size="mini">已优化</el-tag>
                </div>
              </div>
              <div class="timeline-track">
                <div
                  v-for="assignment in schedule.assignments"
                  :key="assignment.id"
                  class="task-timeline-block optimized"
                  :style="getOptimizedTaskBlockStyle(assignment, schedule.assignments)"
                >
                  <el-tooltip
                    :content="`优化任务${assignment.task_id} - ${assignment.procedure_name} | ${assignment.jockey_name} | ${assignment.plan_start_time} ~ ${assignment.plan_end_time}`"
                    placement="top"
                  >
                    <div class="task-content">
                      <span class="task-id">{{ assignment.task_id }}</span>
                      <span class="task-procedure">{{ assignment.procedure_name }}</span>
                      <span class="optimization-indicator">✓</span>
                    </div>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>

          <!-- 重构效果可视化图表 -->
          <div class="refactor-effects-charts">
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="chart-card">
                  <h4>生产效率趋势对比</h4>
                  <div class="chart-container">
                    <div id="efficiencyChart" class="chart-content"></div>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="chart-card">
                  <h4>资源利用率变化</h4>
                  <div class="chart-container">
                    <div id="resourceChart" class="chart-content"></div>
                  </div>
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="20" style="margin-top: 20px;">
              <el-col :span="12">
                <div class="chart-card">
                  <h4>成本节约分析</h4>
                  <div class="chart-container">
                    <div id="costChart" class="chart-content"></div>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="chart-card">
                  <h4>质量提升指标</h4>
                  <div class="chart-container">
                    <div id="qualityChart" class="chart-content"></div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>

          <!-- 重构统计信息 -->
          <div class="refactor-stats">
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="stat-card">
                  <div class="stat-value">{{ optimizedStats.totalTasks }}</div>
                  <div class="stat-label">总任务数</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="stat-card">
                  <div class="stat-value">{{ optimizedStats.efficiencyGain }}%</div>
                  <div class="stat-label">效率提升</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="stat-card">
                  <div class="stat-value">{{ optimizedStats.resourceUtilization }}%</div>
                  <div class="stat-label">资源利用率</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="stat-card">
                  <div class="stat-value">{{ optimizedStats.totalDuration }}h</div>
                  <div class="stat-label">总工时</div>
                </div>
              </el-col>
            </el-row>
          </div>

          <!-- 回到主界面按钮 -->
          <div class="back-to-home-section">
            <el-button
              type="primary"
              size="large"
              @click="backToHome"
              icon="el-icon-s-home"
              class="back-home-btn">
              回到主界面
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import topic04Api from '@/api/topic04Api'
import * as echarts from 'echarts'

export default {
  name: 'ProductionRefactor3',
  data() {
    return {
      currentBatch: 'TRAIN_ASSEMBLY_2025',
      nodeId: '', // 节点ID
      nodeTitle: '', // 节点标题
      nodeType: '', // 节点类型
      allTasks: [],
      loading: false,
      error: null,

      // 数据加载状态
      userDataLoaded: false,
      equipmentDataLoaded: false,
      dataLoaded: false,

      // 加载进度
      userLoadingProgress: 0,
      equipmentLoadingProgress: 0,

      // 重构相关状态
      refactorLoading: false,
      refactorCompleted: false,
      optimizedSchedules: [],
      optimizedStats: {
        totalTasks: 0,
        efficiencyGain: 0,
        resourceUtilization: 0,
        totalDuration: 0
      }
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
    machineSchedules() {
      if (!this.allTasks || this.allTasks.length === 0) {
        return []
      }

      const schedules = {}
      this.allTasks.forEach(task => {
        // 从原始任务数据中获取设备ID
        const equipmentIds = task.equipment_ids || ''

        // 解析设备ID（可能逗号分隔）
        const equipmentIdList = equipmentIds ? equipmentIds.split(',').map(id => id.trim()).filter(id => id && id !== '-1') : []

        // 如果没有有效设备ID，使用默认设备
        if (equipmentIdList.length === 0) {
          const defaultEquipmentId = 'DEFAULT-001'
          if (!schedules[defaultEquipmentId]) {
            schedules[defaultEquipmentId] = {
              equipment_id: defaultEquipmentId,
              work_center_id: task.work_center_id || '',
              work_center_name: task.work_center_name || '',
              assignments: []
            }
          }
          schedules[defaultEquipmentId].assignments.push(this.convertTaskToAssignment(task))
        } else {
          // 为每个设备ID创建条目
          equipmentIdList.forEach(equipmentId => {
          if (!schedules[equipmentId]) {
            schedules[equipmentId] = {
              equipment_id: equipmentId,
              work_center_id: task.work_center_id || '',
              work_center_name: task.work_center_name || '',
              assignments: []
            }
          }
            schedules[equipmentId].assignments.push(this.convertTaskToAssignment(task))
          })
        }
      })

      // 按开始时间排序每台设备（机器）的任务
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

      // 基于数据库任务时间范围进行优化
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
    },
    optimizedTimelineTicks() {
      if (!this.optimizedSchedules.length) return []

      // 获取所有任务的时间范围
      let minTime = Infinity
      let maxTime = -Infinity

      this.optimizedSchedules.forEach(machine => {
        machine.assignments.forEach(assignment => {
          const startTime = new Date(assignment.plan_start_time).getTime()
          const endTime = new Date(assignment.plan_end_time).getTime()
          minTime = Math.min(minTime, startTime)
          maxTime = Math.max(maxTime, endTime)
        })
      })

      if (minTime === Infinity || maxTime === -Infinity) return []

      // 基于数据库任务时间范围进行优化
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
    }
  },

  created() {
    // 从路由参数获取节点信息
    this.nodeId = this.$route.query.nodeId || ''
    this.nodeTitle = this.$route.query.nodeTitle || ''
    this.nodeType = this.$route.query.nodeType || ''
    
    // ProductionRefactor3 使用生产任务数据，硬编码批次为20240905
    // 不使用路由参数，因为前面的页面传递的是人员匹配批次
    this.currentBatch = '20240905'

    console.log('📋 进入生产重构页面，节点信息:', {
      nodeId: this.nodeId,
      nodeTitle: this.nodeTitle,
      nodeType: this.nodeType,
      batch: this.currentBatch
    })

    // 先自动加载前一阶段的数据
    this.autoLoadPreviousData()
  },

  methods: {
    /**
     * 自动加载前一阶段的数据
     */
    async autoLoadPreviousData() {
      console.log('🔄 开始自动加载前一阶段数据...')

      // 同时开始加载两个数据源（模拟1秒加载时间）
      const userLoadPromise = this.loadUserData()
      const equipmentLoadPromise = this.loadEquipmentData()

      await Promise.all([userLoadPromise, equipmentLoadPromise])

      console.log('✅ 前一阶段数据加载完成，开始加载生产任务数据')

      // 加载生产任务数据
      await this.loadData()
    },

    /**
     * 模拟加载员工匹配度数据
     */
    async loadUserData() {
      const totalSteps = 10
      const interval = 100 // 100ms 间隔，总共1秒

      for (let i = 1; i <= totalSteps; i++) {
        await new Promise(resolve => setTimeout(resolve, interval))
        this.userLoadingProgress = (i / totalSteps) * 100
      }

      this.userDataLoaded = true
      console.log('✅ 员工匹配度数据加载完成')
    },

    /**
     * 模拟加载设备健康度数据
     */
    async loadEquipmentData() {
      const totalSteps = 10
      const interval = 100 // 100ms 间隔，总共1秒

      for (let i = 1; i <= totalSteps; i++) {
        await new Promise(resolve => setTimeout(resolve, interval))
        this.equipmentLoadingProgress = (i / totalSteps) * 100
      }

      this.equipmentDataLoaded = true
      console.log('✅ 设备健康度数据加载完成')
    },

    /**
     * 返回上一步
     */
    goBack() {
      console.log('🔙 返回上一步')
      this.$router.go(-1)
    },

    async loadData() {
      this.loading = true
      this.error = null

      try {
        console.log('🔄 开始加载生产任务数据...')

        // 从API获取生产任务输出数据（从output_task表）
        const response = await topic04Api.getProductionOutputTasks(this.currentBatch)

        if (response.success && response.data) {
          this.allTasks = response.data.tasks || []
          console.log(`✅ 成功加载 ${this.allTasks.length} 条生产任务数据`)

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

    /**
     * 将任务数据转换为甘特图分配格式
     */
    convertTaskToAssignment(task) {
      return {
        id: task.id,
        task_id: task.task_id,
        order_no: task.order_no,
        procedure_name: task.procedure_name,
        equipment_desc: task.work_center_name, // 使用工作中心名称作为设备描述
        jockey_name: task.jockey_name,
        plan_start_time: this.formatDate(task.plan_start_time),
        plan_end_time: this.formatDate(task.plan_end_time),
        remark: task.remark || `${task.procedure_name}工序 - 订单${task.order_no}`
      }
    },

    /**
     * 获取任务块样式
     */
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
    },

    /**
     * 开始生产重构过程
     */
    async startRefactorProcess() {
      console.log('🔧 开始生产重构过程')

      this.refactorLoading = true

      try {
        // 模拟1秒重构过程
        await new Promise(resolve => setTimeout(resolve, 1000))

        // 生成优化的生产排产数据
        await this.generateOptimizedSchedule()

        // 计算重构统计信息
        this.calculateOptimizedStats()

        this.refactorCompleted = true

        // 初始化重构效果图表
        this.$nextTick(() => {
          this.initRefactorEffectCharts()
        })

        this.$message({
          type: 'success',
          message: '生产重构完成！已生成优化后的生产流程',
          duration: 3000
        })

        console.log('✅ 生产重构完成')
      } catch (error) {
        console.error('❌ 生产重构失败:', error)
        this.$message({
          type: 'error',
          message: `重构失败: ${error.message}`,
          duration: 5000
        })
      } finally {
        this.refactorLoading = false
      }
    },

    /**
     * 生成优化的生产排产计划
     */
    async generateOptimizedSchedule() {
      // 基于原始数据生成优化的排产计划
      const optimizedTasks = []

      // 复制原始任务并进行优化调整
      this.allTasks.forEach(task => {
        const optimizedTask = { ...task }

        // 模拟优化：减少准备时间，提高工作效率
        optimizedTask.procedure_plan_preparation_time = Math.floor(task.procedure_plan_preparation_time * 0.8)
        optimizedTask.procedure_plan_work_time = Math.floor(task.procedure_plan_work_time * 0.9)

        // 重新计算计划时间
        const startTime = new Date(task.plan_start_time)
        const endTime = new Date(startTime.getTime() +
          (optimizedTask.procedure_plan_preparation_time + optimizedTask.procedure_plan_work_time) * 60 * 1000)

        optimizedTask.plan_start_time = this.formatDate(startTime.toISOString())
        optimizedTask.plan_end_time = this.formatDate(endTime.toISOString())

        optimizedTasks.push(optimizedTask)
      })

      // 生成优化的甘特图数据
      this.optimizedSchedules = this.generateOptimizedMachineSchedules(optimizedTasks)
    },

    /**
     * 生成优化的机器排产计划
     */
    generateOptimizedMachineSchedules(tasks) {
      const schedules = {}

      tasks.forEach(task => {
        const equipmentIds = task.equipment_ids || ''
        const equipmentIdList = equipmentIds ? equipmentIds.split(',').map(id => id.trim()).filter(id => id && id !== '-1') : []

        if (equipmentIdList.length === 0) {
          const defaultEquipmentId = 'OPTIMIZED-001'
          if (!schedules[defaultEquipmentId]) {
            schedules[defaultEquipmentId] = {
              equipment_id: defaultEquipmentId,
              work_center_id: task.work_center_id || '',
              work_center_name: task.work_center_name || '',
              assignments: []
            }
          }
          schedules[defaultEquipmentId].assignments.push(this.convertTaskToAssignment(task))
        } else {
          equipmentIdList.forEach(equipmentId => {
            if (!schedules[equipmentId]) {
              schedules[equipmentId] = {
                equipment_id: equipmentId,
                work_center_id: task.work_center_id || '',
                work_center_name: task.work_center_name || '',
                assignments: []
              }
            }
            schedules[equipmentId].assignments.push(this.convertTaskToAssignment(task))
          })
        }
      })

      // 按开始时间排序每台设备（机器）的任务
      Object.values(schedules).forEach(machine => {
        machine.assignments.sort((a, b) => new Date(a.plan_start_time) - new Date(b.plan_start_time))
      })

      return Object.values(schedules)
    },

    /**
     * 计算重构统计信息
     */
    calculateOptimizedStats() {
      const totalTasks = this.optimizedSchedules.reduce((sum, schedule) => sum + schedule.assignments.length, 0)

      // 计算总工时（小时）
      let totalDuration = 0
      this.optimizedSchedules.forEach(schedule => {
        schedule.assignments.forEach(assignment => {
          const start = new Date(assignment.plan_start_time)
          const end = new Date(assignment.plan_end_time)
          const duration = (end - start) / (1000 * 60 * 60) // 转换为小时
          totalDuration += duration
        })
      })

      // 模拟优化效果
      const efficiencyGain = Math.floor(Math.random() * 15) + 10 // 10-25%的效率提升
      const resourceUtilization = Math.floor(Math.random() * 11) + 70 // 70-80%的资源利用率

      this.optimizedStats = {
        totalTasks,
        efficiencyGain,
        resourceUtilization,
        totalDuration: totalDuration.toFixed(1)
      }
    },

    /**
     * 回到主界面
     */
    backToHome() {
      console.log('🏠 回到主界面')

      // 跳转到主界面（Dashbord）
      this.$router.push({
        name: 'Dashbord'
      })
    },

    /**
     * 获取优化的任务块样式
     */
    getOptimizedTaskBlockStyle(assignment, allAssignments) {
      // 使用优化后的时间范围计算属性
      const schedules = this.optimizedSchedules
      let minTime = Infinity
      let maxTime = -Infinity

      schedules.forEach(machine => {
        machine.assignments.forEach(assignment => {
          const startTime = new Date(assignment.plan_start_time).getTime()
          const endTime = new Date(assignment.plan_end_time).getTime()
          minTime = Math.min(minTime, startTime)
          maxTime = Math.max(maxTime, endTime)
        })
      })

      const totalDuration = maxTime - minTime

      // 如果没有有效的时间范围，返回默认样式
      if (totalDuration === 0) {
        return {
          left: '0%',
          width: '100%',
          backgroundColor: '#67C23A',
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

      // 根据工序类型设置颜色（保持原有颜色）
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
    },

    /**
     * 初始化重构效果图表
     */
    initRefactorEffectCharts() {
      this.initEfficiencyChart()
      this.initResourceChart()
      this.initCostChart()
      this.initQualityChart()
    },

    /**
     * 初始化生产效率趋势图表
     */
    initEfficiencyChart() {
      const chartDom = document.getElementById('efficiencyChart')
      if (!chartDom) return

      const myChart = echarts.init(chartDom)

      // 模拟生产效率数据
      const option = {
        title: {
          text: '生产效率对比',
          left: 'center',
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['原始效率', '优化效率'],
          top: 30
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
        },
        yAxis: {
          type: 'value',
          name: '效率 (%)',
          min: 60,
          max: 100
        },
        series: [
          {
            name: '原始效率',
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 2,
              color: '#E6A23C'
            },
            itemStyle: {
              color: '#E6A23C'
            },
            areaStyle: {
              color: 'rgba(230, 162, 60, 0.1)'
            },
            data: [75, 78, 72, 80, 76, 74, 79, 77, 73]
          },
          {
            name: '优化效率',
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 3,
              color: '#409EFF'
            },
            itemStyle: {
              color: '#409EFF'
            },
            areaStyle: {
              color: 'rgba(64, 158, 255, 0.15)'
            },
            data: [82, 85, 88, 90, 87, 89, 91, 88, 86]
          }
        ]
      }

      myChart.setOption(option)

      // 响应式调整
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },

    /**
     * 初始化资源利用率图表
     */
    initResourceChart() {
      const chartDom = document.getElementById('resourceChart')
      if (!chartDom) return

      const myChart = echarts.init(chartDom)

      const option = {
        title: {
          text: '资源利用率变化',
          left: 'center',
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['设备A', '设备B', '设备C', '设备D', '设备E']
        },
        yAxis: {
          type: 'value',
          name: '利用率 (%)',
          min: 0,
          max: 100
        },
        series: [
          {
            name: '原始利用率',
            type: 'bar',
            barWidth: '30%',
            itemStyle: {
              color: '#E6A23C',
              borderRadius: [2, 2, 0, 0]
            },
            data: [65, 70, 68, 72, 66]
          },
          {
            name: '优化利用率',
            type: 'bar',
            barWidth: '30%',
            itemStyle: {
              color: '#67C23A',
              borderRadius: [2, 2, 0, 0]
            },
            data: [85, 88, 82, 90, 87]
          }
        ]
      }

      myChart.setOption(option)

      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },

    /**
     * 初始化成本节约分析图表
     */
    initCostChart() {
      const chartDom = document.getElementById('costChart')
      if (!chartDom) return

      const myChart = echarts.init(chartDom)

      const option = {
        title: {
          text: '成本节约分析',
          left: 'center',
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}% ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '成本构成',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 35, name: '人力成本', itemStyle: { color: '#409EFF' } },
              { value: 25, name: '设备成本', itemStyle: { color: '#67C23A' } },
              { value: 20, name: '材料成本', itemStyle: { color: '#E6A23C' } },
              { value: 12, name: '其他成本', itemStyle: { color: '#F56C6C' } },
              { value: 8, name: '节约金额', itemStyle: { color: '#909399' } }
            ]
          }
        ]
      }

      myChart.setOption(option)

      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },

    /**
     * 初始化质量提升指标图表
     */
    initQualityChart() {
      const chartDom = document.getElementById('qualityChart')
      if (!chartDom) return

      const myChart = echarts.init(chartDom)

      const option = {
        title: {
          text: '质量提升指标',
          left: 'center',
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['合格率', '返工率', '废品率'],
          top: 30
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周']
        },
        yAxis: {
          type: 'value',
          name: '百分比 (%)',
          min: 0,
          max: 100
        },
        series: [
          {
            name: '合格率',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
              width: 2,
              color: '#67C23A'
            },
            itemStyle: {
              color: '#67C23A'
            },
            data: [92, 94, 95, 96, 97, 98]
          },
          {
            name: '返工率',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
              width: 2,
              color: '#E6A23C'
            },
            itemStyle: {
              color: '#E6A23C'
            },
            data: [6, 4, 3, 2, 2, 1]
          },
          {
            name: '废品率',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
              width: 2,
              color: '#F56C6C'
            },
            itemStyle: {
              color: '#F56C6C'
            },
            data: [2, 2, 2, 2, 1, 1]
          }
        ]
      }

      myChart.setOption(option)

      window.addEventListener('resize', () => {
        myChart.resize()
      })
    }
  }
}
</script>

<style scoped>
.production-refactor3 {
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

/* 数据状态区域 - 始终显示在页面顶部 */
.data-status-section {
  margin: 20px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.status-cards {
  display: flex;
  gap: 40px;
  justify-content: center;
  align-items: center;
}

.status-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  min-width: 280px;
  border: 1px solid #e9ecef;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.status-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.card-icon .el-icon-user {
  color: #409EFF;
  background: rgba(64, 158, 255, 0.1);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon .el-icon-setting {
  color: #E6A23C;
  background: rgba(230, 162, 60, 0.1);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-content {
  flex: 1;
}

.card-content h4 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-text {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.status-text.loaded {
  color: #67C23A;
  font-weight: 500;
}

/* 内容占位区域 */
.content-placeholder {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 40px 30px;
  text-align: center;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.placeholder-icon {
  font-size: 80px;
  color: #409EFF;
  margin-bottom: 24px;
}

.content-placeholder h3 {
  font-size: 28px;
  color: #303133;
  margin: 0 0 16px 0;
  font-weight: 600;
}

.content-placeholder p {
  font-size: 16px;
  color: #606266;
  margin: 0 0 24px 0;
  line-height: 1.6;
  max-width: 600px;
}

.content-placeholder ul {
  text-align: left;
  max-width: 500px;
  margin: 0 0 32px 0;
  padding: 0;
  list-style: none;
}

.content-placeholder li {
  font-size: 15px;
  color: #606266;
  margin-bottom: 12px;
  padding-left: 20px;
  position: relative;
  line-height: 1.5;
}

.content-placeholder li::before {
  content: '•';
  color: #409EFF;
  font-weight: bold;
  font-size: 18px;
  position: absolute;
  left: 0;
  top: -2px;
}

.placeholder-status {
  margin-top: 16px;
}

.placeholder-status .el-tag {
  font-size: 14px;
  padding: 8px 16px;
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

.work-center-info {
  font-size: 12px;
  color: #606266;
  background-color: #f0f2f5;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  margin-left: 10px;
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

/* ==================== 重构操作区域样式 ==================== */

.refactor-operation-section {
  margin: 30px 0;
}

.refactor-operation-card {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.refactor-operation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: #6366f1;
}

.refactor-operation-card /deep/ .el-card__body {
  padding: 32px;
}

.refactor-operation-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
}

/* 重构信息区域 */
.refactor-operation-info {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.refactor-operation-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
  position: relative;
  overflow: hidden;
}

.refactor-operation-icon::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
  animation: shimmer 3s infinite;
}

.refactor-operation-icon i {
  font-size: 36px;
  color: white;
  z-index: 1;
}

.refactor-operation-details {
  flex: 1;
}

.refactor-operation-details h4 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
}

.refactor-operation-details p {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.refactor-operation-benefits {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.refactor-operation-benefits .el-tag {
  font-weight: 500;
  border-radius: 6px;
  padding: 4px 8px;
}

/* 重构操作按钮区域 */
.refactor-operation-actions {
  display: flex;
  align-items: center;
  justify-content: center;
}

.refactor-start-btn {
  min-width: 160px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.refactor-start-btn /deep/ .el-button--primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
  font-size: 16px;
  padding: 14px 28px;
}

.refactor-start-btn:hover:not(.is-loading) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.refactor-start-btn:active:not(.is-loading) {
  transform: translateY(0);
}

/* ==================== 优化甘特图样式 ==================== */

.optimized-timeline {
  margin-top: 30px;
  margin-bottom: 30px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.optimized-timeline h3 {
  font-size: 20px;
  color: #303133;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.optimized-timeline h3::before {
  content: '🚀';
  margin-right: 8px;
}

.machine-row.optimized .machine-header {
  border-left-color: #67C23A;
}

.optimization-badge {
  margin-left: auto;
}

.task-timeline-block.optimized {
  position: relative;
}

.task-timeline-block.optimized::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.2) 100%);
  border-radius: 4px;
  pointer-events: none;
}

.task-timeline-block.optimized:hover {
  box-shadow: 0 6px 16px rgba(103, 194, 58, 0.25) !important;
}

.optimization-indicator {
  color: #67C23A;
  font-weight: bold;
  font-size: 12px;
  margin-left: 2px;
}

/* ==================== 重构效果图表样式 ==================== */

.refactor-effects-charts {
  margin-top: 30px;
}

.chart-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  height: 320px;
  display: flex;
  flex-direction: column;
}

.chart-card h4 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}

.chart-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-content {
  width: 100%;
  height: 250px;
}

/* ==================== 重构统计信息样式 ==================== */

.refactor-stats {
  margin-top: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

/* ==================== 回到主界面按钮样式 ==================== */

.back-to-home-section {
  margin-top: 40px;
  padding: 30px;
  text-align: center;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.back-home-btn {
  font-size: 16px;
  font-weight: 600;
  padding: 14px 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #409EFF 0%, #66B1FF 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
}

.back-home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.4);
}

.back-home-btn:active {
  transform: translateY(0);
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 4px;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

/* 动画效果 */
@keyframes shimmer {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

/* 响应式设计 */
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

  .data-status-section {
    margin: 15px 0;
    padding: 16px;
  }

  .status-cards {
    flex-direction: column;
    gap: 20px;
  }

  .status-card {
    min-width: 250px;
    padding: 20px;
  }

  .card-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .card-content h4 {
    font-size: 15px;
  }

  .content-placeholder {
    padding: 40px 20px;
    min-height: 400px;
  }

  .placeholder-icon {
    font-size: 60px;
    margin-bottom: 20px;
  }

  .content-placeholder h3 {
    font-size: 24px;
  }

  .content-placeholder p {
    font-size: 15px;
  }

  .content-placeholder li {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .production-refactor3 {
    padding: 12px;
  }

  .data-status-section {
    margin: 12px 0;
    padding: 12px;
  }

  .status-cards {
    gap: 16px;
  }

  .status-card {
    min-width: 200px;
    padding: 16px;
  }

  .card-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .card-content h4 {
    font-size: 14px;
  }

  .content-placeholder {
    padding: 30px 16px;
  }

  .placeholder-icon {
    font-size: 50px;
    margin-bottom: 16px;
  }

  .content-placeholder h3 {
    font-size: 20px;
  }

  .content-placeholder p {
    font-size: 14px;
  }

  .machine-timeline {
    padding: 16px;
  }

  .machine-timeline h3 {
    font-size: 18px;
  }

  .machine-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .work-center-info {
    margin-left: 0;
  }

  .refactor-operation-content {
    flex-direction: column;
    text-align: center;
    gap: 24px;
  }

  .refactor-operation-info {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .refactor-operation-icon {
    width: 64px;
    height: 64px;
  }

  .refactor-operation-icon i {
    font-size: 28px;
  }

  .refactor-operation-details h4 {
    font-size: 20px;
  }

  .refactor-operation-details p {
    font-size: 14px;
  }

  .refactor-start-btn {
    width: 100%;
    max-width: 280px;
  }

  .refactor-start-btn /deep/ .el-button--primary {
    font-size: 14px;
    padding: 14px 24px;
  }

  .optimized-timeline {
    padding: 16px;
  }

  .optimized-timeline h3 {
    font-size: 18px;
  }

  .refactor-stats {
    padding: 16px;
  }

  .stat-card {
    padding: 12px;
  }

  .stat-value {
    font-size: 20px;
  }

  .chart-card {
    height: 280px;
    padding: 12px;
  }

  .chart-card h4 {
    font-size: 14px;
    margin-bottom: 12px;
  }

  .chart-content {
    height: 200px;
  }

  .refactor-effects-charts .el-col {
    margin-bottom: 16px;
  }
}
</style>
