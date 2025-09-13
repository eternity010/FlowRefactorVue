<template>
  <div class="maintenance-plan-container">
    <div class="page-header">
      <h1 class="page-title">运维计划</h1>
      <div class="header-actions">
        <el-button icon="el-icon-refresh" @click="refreshData">刷新</el-button>
      </div>
    </div>
    
    <!-- 统计卡片区域 -->
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon high-priority">
              <i class="el-icon-warning"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ highPriorityCount }}</div>
              <div class="stat-label">高优先级</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon medium-priority">
              <i class="el-icon-info"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ mediumPriorityCount }}</div>
              <div class="stat-label">中优先级</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon low-priority">
              <i class="el-icon-success"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ lowPriorityCount }}</div>
              <div class="stat-label">低优先级</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon total">
              <i class="el-icon-document"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ totalPlans }}</div>
              <div class="stat-label">总计划数</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="filter-area">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索计划编码、列车号..."
            prefix-icon="el-icon-search"
            clearable
            @input="handleSearch">
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filterPriority" placeholder="优先级" clearable @change="handleFilter">
            <el-option label="高" value="高"></el-option>
            <el-option label="中" value="中"></el-option>
            <el-option label="低" value="低"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filterType" placeholder="维修类型" clearable @change="handleFilter">
            <el-option label="临修" value="临修"></el-option>
            <el-option label="定检" value="定检"></el-option>
            <el-option label="加改修" value="加改修"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filterStatus" placeholder="状态" clearable @change="handleFilter">
            <el-option label="待执行" value="待执行"></el-option>
            <el-option label="执行中" value="执行中"></el-option>
            <el-option label="已完成" value="已完成"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="resetFilters">重置</el-button>
        </el-col>
      </el-row>
    </div>
    
    <div class="content-area">
      <!-- 视图切换标签 -->
      <div class="view-tabs">
        <el-tabs v-model="activeView" @tab-click="handleTabClick">
          <el-tab-pane label="表格视图" name="table">
            <i class="el-icon-s-grid"></i>
          </el-tab-pane>
          <el-tab-pane label="甘特图" name="gantt">
            <i class="el-icon-date"></i>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="main-content" :class="{ 'with-detail': showDetailPanel }">
        <div class="table-container" v-if="activeView === 'table'">
          <!-- 维修计划表格 -->
          <el-table
            :data="filteredPlans"
            style="width: 100%"
            :loading="loading"
            @row-click="handleRowClick"
            stripe
            border
            highlight-current-row
            :current-row-key="selectedPlan ? selectedPlan.plan_id : null"
            row-key="plan_id">
            <el-table-column prop="plan_code" label="计划编码" width="140" fixed="left">
              <template slot-scope="scope">
                <el-link type="primary" @click="viewDetail(scope.row)">
                  {{ scope.row.plan_code }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column label="列车信息" width="120">
              <template slot-scope="scope">
                <div>{{ scope.row.train_info.train_id }}</div>
                <div class="sub-text">{{ scope.row.train_info.carriage_no }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="system_module" label="系统模块" width="120"></el-table-column>
            <el-table-column prop="maintenance_type" label="维修类型" width="100">
              <template slot-scope="scope">
                <el-tag :type="getTypeTagType(scope.row.maintenance_type)" size="small">
                  {{ scope.row.maintenance_type }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="priority" label="优先级" width="80">
              <template slot-scope="scope">
                <el-tag :type="getPriorityTagType(scope.row.priority)" size="small">
                  {{ scope.row.priority }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="计划时间" width="160">
              <template slot-scope="scope">
                <div>{{ formatDate(scope.row.schedule.plan_start_time) }}</div>
                <div class="sub-text">{{ formatDate(scope.row.schedule.plan_end_time) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="location.station_location" label="检修地点" width="120"></el-table-column>
            <el-table-column label="负责人" width="120">
              <template slot-scope="scope">
                <div>{{ scope.row.responsible.person }}</div>
                <div class="sub-text">{{ scope.row.responsible.team }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="risk_level" label="风险等级" width="80">
              <template slot-scope="scope">
                <el-tag :type="getRiskTagType(scope.row.risk_level)" size="small">
                  {{ scope.row.risk_level }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="预计停机" width="100">
              <template slot-scope="scope">
                {{ scope.row.schedule.predicted_downtime_hours }}h
              </template>
            </el-table-column>
            <el-table-column prop="plan_status" label="状态" width="80">
              <template slot-scope="scope">
                <el-tag :type="getStatusTagType(scope.row.plan_status)" size="small">
                  {{ scope.row.plan_status }}
                </el-tag>
              </template>
            </el-table-column>

          </el-table>
        </div>

        <!-- 甘特图视图 -->
        <div class="gantt-container" v-else-if="activeView === 'gantt'">
          <div class="gantt-chart">
            <!-- 甘特图标题行 -->
            <div class="gantt-header">
              <div class="gantt-tasks-header">任务信息</div>
              <div class="gantt-timeline-header">
                <div class="time-scale">
                  <div 
                    v-for="date in timeScale" 
                    :key="date" 
                    class="time-cell"
                    :style="{ width: cellWidth + 'px' }">
                    {{ formatGanttDate(date) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 甘特图内容区域 -->
            <div class="gantt-content">
              <div 
                v-for="plan in filteredPlans" 
                :key="plan.plan_id" 
                class="gantt-row"
                @click="handleRowClick(plan)">
                
                <!-- 任务信息列 -->
                <div class="gantt-task-info">
                  <div class="task-title">
                    <span class="plan-code">{{ plan.plan_code }}</span>
                    <el-tag :type="getPriorityTagType(plan.priority)" size="mini">
                      {{ plan.priority }}
                    </el-tag>
                  </div>
                  <div class="task-subtitle">
                    {{ plan.train_info.train_id }} - {{ plan.system_module }}
                  </div>
                </div>

                <!-- 时间轴区域 -->
                <div class="time-grid">
                  <div 
                    v-for="date in timeScale" 
                    :key="date" 
                    class="time-cell"
                    :style="{ width: cellWidth + 'px' }">
                  </div>
                  
                  <!-- 甘特条 -->
                  <div 
                    class="gantt-bar"
                    :class="[
                      'priority-' + plan.priority,
                      'type-' + plan.maintenance_type
                    ]"
                    :style="getGanttBarStyle(plan)"
                    @click.stop="viewDetail(plan)">
                    <div class="bar-content">
                      <div class="bar-text">{{ plan.plan_code }}</div>
                      <div class="bar-info">{{ plan.schedule.predicted_downtime_hours }}h</div>
                    </div>
                    <div v-if="plan.dependency_order_id" class="dependency-line"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 侧边详情面板 -->
        <div class="detail-panel" v-if="showDetailPanel && selectedPlan">
          <div class="detail-header">
            <h3 class="detail-title">计划详情</h3>
            <el-button 
              type="text" 
              icon="el-icon-close" 
              @click="closeDetailPanel"
              class="close-btn">
            </el-button>
          </div>
          
          <div class="detail-content">
            <!-- 基本信息 -->
            <div class="detail-section">
              <h4 class="section-title">
                <i class="el-icon-info"></i>
                基本信息
              </h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>计划编码:</label>
                  <span>{{ selectedPlan.plan_code }}</span>
                </div>
                <div class="info-item">
                  <label>列车编号:</label>
                  <span>{{ selectedPlan.train_info.train_id }}</span>
                </div>
                <div class="info-item">
                  <label>车厢号:</label>
                  <span>{{ selectedPlan.train_info.carriage_no }}</span>
                </div>
                <div class="info-item">
                  <label>系统模块:</label>
                  <span>{{ selectedPlan.system_module }}</span>
                </div>
                <div class="info-item">
                  <label>维修类型:</label>
                  <el-tag :type="getTypeTagType(selectedPlan.maintenance_type)" size="small">
                    {{ selectedPlan.maintenance_type }}
                  </el-tag>
                </div>
                <div class="info-item">
                  <label>优先级:</label>
                  <el-tag :type="getPriorityTagType(selectedPlan.priority)" size="small">
                    {{ selectedPlan.priority }}
                  </el-tag>
                </div>
                <div class="info-item">
                  <label>当前状态:</label>
                  <el-tag :type="getStatusTagType(selectedPlan.plan_status)" size="small">
                    {{ selectedPlan.plan_status }}
                  </el-tag>
                </div>
                <div class="info-item">
                  <label>风险等级:</label>
                  <el-tag :type="getRiskTagType(selectedPlan.risk_level)" size="small">
                    {{ selectedPlan.risk_level }}
                  </el-tag>
                </div>
              </div>
            </div>

            <!-- 时间安排 -->
            <div class="detail-section">
              <h4 class="section-title">
                <i class="el-icon-time"></i>
                时间安排
              </h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>计划开始:</label>
                  <span>{{ formatFullDate(selectedPlan.schedule.plan_start_time) }}</span>
                </div>
                <div class="info-item">
                  <label>计划结束:</label>
                  <span>{{ formatFullDate(selectedPlan.schedule.plan_end_time) }}</span>
                </div>
                <div class="info-item">
                  <label>预计停机:</label>
                  <span>{{ selectedPlan.schedule.predicted_downtime_hours }} 小时</span>
                </div>
                <div class="info-item">
                  <label>SLA截止:</label>
                  <span>{{ formatFullDate(selectedPlan.schedule.sla_deadline) }}</span>
                </div>
              </div>
            </div>

            <!-- 责任信息 -->
            <div class="detail-section">
              <h4 class="section-title">
                <i class="el-icon-user"></i>
                责任信息
              </h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>负责班组:</label>
                  <span>{{ selectedPlan.responsible.team }}</span>
                </div>
                <div class="info-item">
                  <label>负责人:</label>
                  <span>{{ selectedPlan.responsible.person }}</span>
                </div>
                <div class="info-item">
                  <label>联系方式:</label>
                  <span>{{ selectedPlan.responsible.contact }}</span>
                </div>
                <div class="info-item">
                  <label>检修地点:</label>
                  <span>{{ selectedPlan.location.station_location }}</span>
                </div>
              </div>
            </div>

            <!-- 资源需求 -->
            <div class="detail-section">
              <h4 class="section-title">
                <i class="el-icon-goods"></i>
                资源需求
              </h4>
              <div class="info-grid">
                <div class="info-item full-width">
                  <label>所需配件:</label>
                  <span>{{ selectedPlan.resources.required_parts }}</span>
                </div>
                <div class="info-item full-width">
                  <label>技能要求:</label>
                  <span>{{ selectedPlan.resources.required_skill }}</span>
                </div>
                <div class="info-item" v-if="selectedPlan.dependency_order_id">
                  <label>依赖工单:</label>
                  <span>{{ selectedPlan.dependency_order_id }}</span>
                </div>
              </div>
            </div>

            <!-- 备注信息 -->
            <div class="detail-section" v-if="selectedPlan.remark">
              <h4 class="section-title">
                <i class="el-icon-document"></i>
                备注信息
              </h4>
              <div class="remark-content">
                {{ selectedPlan.remark }}
              </div>
            </div>

            <!-- 创建信息 -->
            <div class="detail-section">
              <h4 class="section-title">
                <i class="el-icon-date"></i>
                创建信息
              </h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>创建时间:</label>
                  <span>{{ formatFullDate(selectedPlan.create.time) }}</span>
                </div>
                <div class="info-item">
                  <label>更新时间:</label>
                  <span>{{ formatFullDate(selectedPlan.update.time) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 导入维修计划数据
import maintenancePlanData from '@/data/maintenance_plan_data.json'

export default {
  name: 'MaintenancePlanView',
  data() {
    return {
      loading: false,
      maintenancePlans: [],
      filteredPlans: [],
      searchKeyword: '',
      filterPriority: '',
      filterType: '',
      filterStatus: '',
      selectedPlan: null,
      showDetailPanel: false,
      activeView: 'table', // 当前视图：table 或 gantt
      cellWidth: 100 // 甘特图每个时间单元的宽度
    }
  },
  computed: {
    // 统计高优先级计划数量
    highPriorityCount() {
      return this.maintenancePlans.filter(plan => plan.priority === '高').length
    },
    // 统计中优先级计划数量
    mediumPriorityCount() {
      return this.maintenancePlans.filter(plan => plan.priority === '中').length
    },
    // 统计低优先级计划数量
    lowPriorityCount() {
      return this.maintenancePlans.filter(plan => plan.priority === '低').length
    },
    // 总计划数
    totalPlans() {
      return this.maintenancePlans.length
    },
    
    // 甘特图时间轴
    timeScale() {
      if (!this.filteredPlans.length) return []
      
      // 找出所有计划的最早开始时间和最晚结束时间
      const startTimes = this.filteredPlans.map(plan => new Date(plan.schedule.plan_start_time.$date))
      const endTimes = this.filteredPlans.map(plan => new Date(plan.schedule.plan_end_time.$date))
      
      const minDate = new Date(Math.min(...startTimes))
      const maxDate = new Date(Math.max(...endTimes))
      
      // 生成日期数组（按天）
      const dates = []
      const currentDate = new Date(minDate)
      currentDate.setHours(0, 0, 0, 0) // 设置为当天开始
      
      while (currentDate <= maxDate) {
        dates.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }
      
      return dates
    },
    
    // 时间轴总宽度
    timelineWidth() {
      return this.timeScale.length * this.cellWidth
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    // 加载数据
    loadData() {
      this.loading = true
      try {
        // 模拟异步加载
        setTimeout(() => {
          this.maintenancePlans = maintenancePlanData
          this.filteredPlans = [...this.maintenancePlans]
          this.loading = false
        }, 500)
      } catch (error) {
        console.error('加载维修计划数据失败:', error)
        this.$message.error('加载数据失败')
        this.loading = false
      }
    },
    
    // 刷新数据
    refreshData() {
      this.loadData()
      this.$message.success('数据已刷新')
    },
    
    // 搜索处理
    handleSearch() {
      this.applyFilters()
    },
    
    // 筛选处理
    handleFilter() {
      this.applyFilters()
    },
    
    // 应用筛选条件
    applyFilters() {
      let filtered = [...this.maintenancePlans]
      
      // 关键词搜索
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase()
        filtered = filtered.filter(plan => 
          plan.plan_code.toLowerCase().includes(keyword) ||
          plan.train_info.train_id.toLowerCase().includes(keyword) ||
          plan.system_module.toLowerCase().includes(keyword)
        )
      }
      
      // 优先级筛选
      if (this.filterPriority) {
        filtered = filtered.filter(plan => plan.priority === this.filterPriority)
      }
      
      // 维修类型筛选
      if (this.filterType) {
        filtered = filtered.filter(plan => plan.maintenance_type === this.filterType)
      }
      
      // 状态筛选
      if (this.filterStatus) {
        filtered = filtered.filter(plan => plan.plan_status === this.filterStatus)
      }
      
      this.filteredPlans = filtered
    },
    
    // 重置筛选条件
    resetFilters() {
      this.searchKeyword = ''
      this.filterPriority = ''
      this.filterType = ''
      this.filterStatus = ''
      this.filteredPlans = [...this.maintenancePlans]
    },
    
    // 行点击处理
    handleRowClick(row) {
      this.selectedPlan = row
      this.showDetailPanel = true
    },
    
    // 查看详情
    viewDetail(row) {
      this.selectedPlan = row
      this.showDetailPanel = true
    },

    // 关闭详情面板
    closeDetailPanel() {
      this.showDetailPanel = false
      this.selectedPlan = null
    },

    // 格式化完整日期
    formatFullDate(dateObj) {
      if (!dateObj || !dateObj.$date) return '-'
      const date = new Date(dateObj.$date)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    },
    

    
    // 格式化日期
    formatDate(dateObj) {
      if (!dateObj || !dateObj.$date) return '-'
      const date = new Date(dateObj.$date)
      return date.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    // 获取优先级标签类型
    getPriorityTagType(priority) {
      const typeMap = {
        '高': 'danger',
        '中': 'warning', 
        '低': 'success'
      }
      return typeMap[priority] || ''
    },
    
    // 获取维修类型标签类型
    getTypeTagType(type) {
      const typeMap = {
        '临修': 'danger',
        '定检': 'primary',
        '加改修': 'warning'
      }
      return typeMap[type] || ''
    },
    
    // 获取风险等级标签类型
    getRiskTagType(risk) {
      const typeMap = {
        '高': 'danger',
        '中': 'warning',
        '低': 'success'
      }
      return typeMap[risk] || ''
    },
    
    // 获取状态标签类型
    getStatusTagType(status) {
      const typeMap = {
        '待执行': 'info',
        '执行中': 'warning',
        '已完成': 'success'
      }
      return typeMap[status] || ''
    },

    // 处理视图切换
    handleTabClick(tab) {
      this.activeView = tab.name
    },

    // 格式化甘特图日期
    formatGanttDate(date) {
      return date.toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit'
      })
    },

    // 计算甘特条样式
    getGanttBarStyle(plan) {
      if (!this.timeScale.length) return {}
      
      const startDate = new Date(plan.schedule.plan_start_time.$date)
      const endDate = new Date(plan.schedule.plan_end_time.$date)
      const minDate = this.timeScale[0]
      
      // 计算开始位置（距离左侧的天数）
      const startDays = Math.floor((startDate - minDate) / (1000 * 60 * 60 * 24))
      const startHours = startDate.getHours() + startDate.getMinutes() / 60
      const startPosition = startDays * this.cellWidth + (startHours / 24) * this.cellWidth
      
      // 计算宽度（任务持续时间）
      const durationMs = endDate - startDate
      const durationHours = durationMs / (1000 * 60 * 60)
      const width = (durationHours / 24) * this.cellWidth
      
      return {
        left: startPosition + 'px',
        width: Math.max(width, 60) + 'px' // 最小宽度60px
      }
    }
  }
}
</script>

<style scoped>
/* 页面容器样式 */
.maintenance-plan-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
  padding: 20px;
}

/* 页面标题区域 */
.page-header {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 统计卡片样式 */
.stats-cards {
  margin-bottom: 20px;
}

.stat-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 21, 41, 0.12);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
  color: #fff;
}

.stat-icon.high-priority {
  background: linear-gradient(135deg, #f56565, #e53e3e);
}

.stat-icon.medium-priority {
  background: linear-gradient(135deg, #ed8936, #dd6b20);
}

.stat-icon.low-priority {
  background: linear-gradient(135deg, #48bb78, #38a169);
}

.stat-icon.total {
  background: linear-gradient(135deg, #4299e1, #3182ce);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #2d3748;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #718096;
  font-weight: 500;
}

/* 筛选区域样式 */
.filter-area {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 21, 41, 0.08);
}

.filter-area .el-select {
  width: 100%;
}

/* 内容区域样式 */
.content-area {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 21, 41, 0.08);
  padding: 20px;
  overflow: hidden;
  position: relative;
}

.main-content {
  display: flex;
  height: 100%;
  transition: all 0.3s ease;
}

.main-content.with-detail .table-container {
  width: 60%;
  margin-right: 20px;
}

.table-container {
  width: 100%;
  transition: all 0.3s ease;
}

/* 侧边详情面板样式 */
.detail-panel {
  width: 40%;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  max-height: 600px;
  overflow: hidden;
}

.detail-header {
  padding: 16px 20px;
  background-color: #fff;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px 8px 0 0;
}

.detail-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.close-btn {
  padding: 4px;
  font-size: 16px;
  color: #909399;
}

.close-btn:hover {
  color: #f56c6c;
}

.detail-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #606266;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title i {
  color: #409eff;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item label {
  font-size: 12px;
  color: #909399;
  font-weight: 500;
}

.info-item span {
  font-size: 14px;
  color: #303133;
  word-break: break-all;
}

.remark-content {
  background-color: #fff;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

/* 详情面板滚动条样式 */
.detail-content::-webkit-scrollbar {
  width: 6px;
}

.detail-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.detail-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.detail-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 表格样式优化 */
.el-table {
  border-radius: 8px;
  overflow: hidden;
}

.el-table th {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
}

.el-table .el-table__row:hover > td {
  background-color: #f8f9fa;
}

/* 子文本样式 */
.sub-text {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

/* 标签样式优化 */
.el-tag {
  border-radius: 4px;
  font-weight: 500;
}

/* 链接样式 */
.el-link {
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content.with-detail .table-container {
    width: 55%;
  }
  
  .detail-panel {
    width: 45%;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .maintenance-plan-container {
    padding: 10px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .stats-cards .el-col {
    margin-bottom: 16px;
  }
  
  .filter-area .el-col {
    margin-bottom: 12px;
  }
  
  .main-content {
    flex-direction: column;
  }
  
  .main-content.with-detail .table-container {
    width: 100%;
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .detail-panel {
    width: 100%;
    max-height: 400px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

/* 加载状态样式 */
.el-loading-mask {
  border-radius: 8px;
}

/* 空状态样式 */
.el-table__empty-block {
  padding: 60px 0;
}

.el-table__empty-text {
  color: #909399;
  font-size: 14px;
}

/* 视图切换标签样式 */
.view-tabs {
  margin-bottom: 20px;
}

.view-tabs .el-tabs__header {
  margin: 0;
}

.view-tabs .el-tabs__item {
  font-weight: 600;
}

/* 甘特图容器样式 */
.gantt-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.gantt-chart {
  min-width: 100%;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
}

/* 甘特图标题行 */
.gantt-header {
  display: flex;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e4e7ed;
  position: sticky;
  top: 0;
  z-index: 10;
}

.gantt-tasks-header {
  width: 250px;
  min-width: 250px;
  padding: 12px 16px;
  font-weight: 600;
  color: #303133;
  border-right: 1px solid #e4e7ed;
  background-color: #f8f9fa;
}

.gantt-timeline-header {
  flex: 1;
  min-width: 0;
}

.time-scale {
  display: flex;
  border-bottom: 1px solid #e4e7ed;
}

.time-cell {
  border-right: 1px solid #f0f0f0;
  padding: 8px 4px;
  text-align: center;
  font-size: 12px;
  color: #606266;
  background-color: #f8f9fa;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 甘特图内容区域 */
.gantt-content {
  display: flex;
  flex-direction: column;
}

.gantt-row {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  min-height: 60px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.gantt-row:hover {
  background-color: #f8f9fa;
}

.gantt-task-info {
  width: 250px;
  min-width: 250px;
  padding: 12px 16px;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #fff;
}

.task-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.plan-code {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.task-subtitle {
  font-size: 12px;
  color: #909399;
}

.time-grid {
  flex: 1;
  position: relative;
  display: flex;
}

.time-cell {
  border-right: 1px solid #f0f0f0;
  min-height: 60px;
}

.gantt-bar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 32px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 5;
  display: flex;
  align-items: center;
  padding: 0 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.gantt-bar:hover {
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

/* 优先级颜色 */
.gantt-bar.priority-高 {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
}

.gantt-bar.priority-中 {
  background: linear-gradient(135deg, #ffa726, #ff9800);
  color: white;
}

.gantt-bar.priority-低 {
  background: linear-gradient(135deg, #66bb6a, #4caf50);
  color: white;
}

/* 维修类型样式 */
.gantt-bar.type-临修 {
  border-left: 4px solid #f56c6c;
}

.gantt-bar.type-定检 {
  border-left: 4px solid #409eff;
}

.gantt-bar.type-加改修 {
  border-left: 4px solid #e6a23c;
}

.bar-content {
  flex: 1;
  overflow: hidden;
}

.bar-text {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bar-info {
  font-size: 11px;
  opacity: 0.9;
  margin-top: 2px;
}

.dependency-line {
  position: absolute;
  right: -10px;
  top: 50%;
  width: 0;
  height: 0;
  border-left: 6px solid #909399;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  transform: translateY(-50%);
}

/* 甘特图滚动条样式 */
.gantt-chart::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.gantt-chart::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.gantt-chart::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.gantt-chart::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.gantt-chart::-webkit-scrollbar-corner {
  background: #f1f1f1;
}
</style>
