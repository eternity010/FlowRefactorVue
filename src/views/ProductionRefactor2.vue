<template>
  <div class="production-refactor2">
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
        <h2>火车装配人员匹配分析</h2>
      </div>
      <div class="header-info">
        <el-tag type="info">装配批次：{{ currentBatch }}</el-tag>
        <el-tag type="primary" v-if="nodeId">节点ID：{{ nodeId }}</el-tag>
        <el-tag type="success" v-if="users.length > 0">{{ users.length }}名员工</el-tag>
      </div>
    </div>
    
    <div class="page-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-loading-directive 
          text="正在加载员工匹配数据..."
          spinner="el-icon-loading"
          background="rgba(0, 0, 0, 0.8)">
        </el-loading-directive>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-container">
        <el-alert
          :title="error"
          type="error"
          show-icon
          :closable="false">
          <el-button type="primary" @click="handleReload" size="small">重新加载</el-button>
        </el-alert>
      </div>

      <!-- 主要内容 -->
      <div v-else>
        <!-- 数据获取按钮区域 -->
        <div v-if="!userDataLoaded || !equipmentDataLoaded" class="load-data-section">
          <div class="load-data-container">
            <!-- 员工匹配度按钮 -->
            <div class="load-button-group">
              <el-button
                type="primary"
                size="large"
                :loading="loadingUserData"
                @click="loadUserMatchData"
                :disabled="userDataLoaded"
                class="load-match-btn">
                <i class="el-icon-user"></i>
                {{ loadingUserData ? '正在分析匹配度...' : userDataLoaded ? '员工匹配度已获取' : '获取员工匹配度' }}
              </el-button>
              <p class="load-tip">点击按钮开始分析员工与装配任务的匹配程度</p>
            </div>

            <!-- 设备健康度按钮 -->
            <div class="load-button-group">
              <el-button
                type="success"
                size="large"
                :loading="loadingEquipmentData"
                @click="loadEquipmentHealthData"
                :disabled="equipmentDataLoaded"
                class="load-match-btn">
                <i class="el-icon-setting"></i>
                {{ loadingEquipmentData ? '正在检测健康度...' : equipmentDataLoaded ? '设备健康度已获取' : '获取设备健康度' }}
              </el-button>
              <p class="load-tip">点击按钮开始检测装配设备的健康状态</p>
            </div>
          </div>
        </div>

        <!-- 统计信息区域已移除 -->

        <!-- 员工卡片列表 -->
        <div v-if="userDataLoaded" class="users-section">
          <div class="section-header">
            <h3>员工匹配度概览</h3>
            <div class="section-controls">
              <el-select 
                v-model="sortBy" 
                @change="handleSortChange" 
                size="small"
                style="width: 150px;">
                <el-option label="按匹配度排序" value="avg_match_rate"></el-option>
                <el-option label="按任务数排序" value="task_count"></el-option>
                <el-option label="按员工ID排序" value="user_id"></el-option>
                <el-option label="按高匹配数排序" value="high_match_count"></el-option>
              </el-select>
              <el-button-group size="small" style="margin-left: 10px;">
                <el-button 
                  :type="sortOrder === 'desc' ? 'primary' : ''"
                  @click="setSortOrder('desc')"
                  icon="el-icon-sort-down">
                  降序
                </el-button>
                <el-button 
                  :type="sortOrder === 'asc' ? 'primary' : ''"
                  @click="setSortOrder('asc')"
                  icon="el-icon-sort-up">
                  升序
                </el-button>
              </el-button-group>
            </div>
          </div>

          <div class="users-grid">
            <div 
              v-for="user in users" 
              :key="user.user_id"
              class="user-card"
              @click="viewUserDetail(user)"
              :class="{ 'high-match': user.avg_match_rate > 0.70 }">
              <div class="user-header">
                <div class="user-info">
                  <div class="user-name">{{ getUserName(user.user_id) }}</div>
                  <div class="user-id">ID: {{ user.user_id }}</div>
                </div>
                <div class="match-score">
                  <div class="score-value">{{ (user.avg_match_rate * 100).toFixed(1) }}%</div>
                  <div class="score-label">平均匹配度</div>
                </div>
              </div>
              
              <div class="user-stats">
                <div class="stat-row">
                  <span class="stat-name">任务数量：</span>
                  <span class="stat-value">{{ user.task_count }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-name">高匹配任务：</span>
                  <span class="stat-value highlight">{{ user.high_match_count }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-name">最高匹配度：</span>
                  <span class="stat-value">{{ (user.max_match_rate * 100).toFixed(1) }}%</span>
                </div>
              </div>

              <div class="user-progress">
                <el-progress
                  :percentage="user.avg_match_rate * 100"
                  :color="getProgressColor(user.avg_match_rate)"
                  :stroke-width="6"
                  :show-text="false">
                </el-progress>
              </div>

              <div class="user-actions">
                <el-button type="text" size="small" icon="el-icon-view">
                  查看详情
                </el-button>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div class="pagination-container" v-if="pagination.total > pagination.pageSize">
            <el-pagination
              @current-change="handlePageChange"
              :current-page="pagination.page"
              :page-size="pagination.pageSize"
              layout="total, prev, pager, next"
              :total="pagination.total">
            </el-pagination>
          </div>

        </div>

        <!-- 设备健康度部分 -->
        <div v-if="equipmentDataLoaded" class="equipment-section">
          <div class="section-header">
            <h3>装配设备健康度监控</h3>
            <div class="section-controls">
              <el-select
                v-model="equipmentSortBy"
                @change="handleEquipmentSortChange"
                size="small"
                style="width: 150px;">
                <el-option label="按设备ID排序" value="equipment_id"></el-option>
                <el-option label="按健康度排序" value="rate_percent"></el-option>
                <el-option label="按创建时间排序" value="create_time"></el-option>
              </el-select>
              <el-button-group size="small" style="margin-left: 10px;">
                <el-button
                  :type="equipmentSortOrder === 'desc' ? 'primary' : ''"
                  @click="setEquipmentSortOrder('desc')"
                  icon="el-icon-sort-down">
                  降序
                </el-button>
                <el-button
                  :type="equipmentSortOrder === 'asc' ? 'primary' : ''"
                  @click="setEquipmentSortOrder('asc')"
                  icon="el-icon-sort-up">
                  升序
                </el-button>
              </el-button-group>
            </div>
          </div>

          <div class="equipment-grid">
            <div 
              v-for="equipment in equipmentList" 
              :key="equipment.equipment_id"
              class="equipment-card"
              :class="{ 
                'excellent-health': equipment.rate_percent >= 0.90,
                'good-health': equipment.rate_percent >= 0.75 && equipment.rate_percent < 0.90,
                'warning-health': equipment.rate_percent >= 0.60 && equipment.rate_percent < 0.75,
                'poor-health': equipment.rate_percent < 0.60
              }">
              <div class="equipment-header">
                <div class="equipment-info">
                  <div class="equipment-id">{{ equipment.equipment_id }}</div>
                  <div class="equipment-name">{{ getEquipmentName(equipment.equipment_id) }}</div>
                </div>
                <div class="health-score">
                  <div class="health-value">{{ (equipment.rate_percent * 100).toFixed(1) }}%</div>
                  <div class="health-label">健康度</div>
                </div>
              </div>

              <div class="equipment-progress">
                <el-progress
                  :percentage="equipment.rate_percent * 100"
                  :color="getHealthColor(equipment.rate_percent)"
                  :stroke-width="8"
                  :show-text="false">
                </el-progress>
              </div>

              <div class="equipment-status">
                <el-tag 
                  :type="getHealthTagType(equipment.rate_percent)"
                  size="small">
                  {{ getHealthStatus(equipment.rate_percent) }}
                </el-tag>
              </div>

              <div class="equipment-remark" v-if="equipment.remark">
                <p>{{ equipment.remark }}</p>
              </div>

              <div class="equipment-actions">
                <el-button type="text" size="small" icon="el-icon-info">
                  设备详情
                </el-button>
              </div>
            </div>
          </div>

          <!-- 设备分页 -->
          <div class="pagination-container" v-if="equipmentPagination.total > equipmentPagination.pageSize">
            <el-pagination
              @current-change="handleEquipmentPageChange"
              :current-page="equipmentPagination.page"
              :page-size="equipmentPagination.pageSize"
              layout="total, prev, pager, next"
              :total="equipmentPagination.total">
            </el-pagination>
          </div>

        </div>

        <!-- 下一步按钮（当两个数据都加载完成时显示） -->
        <div v-if="userDataLoaded && equipmentDataLoaded" class="next-step-container">
          <el-button
            type="primary"
            size="large"
            @click="handleNextStep"
            class="next-step-btn"
            icon="el-icon-arrow-right">
            下一步
          </el-button>
          <p class="next-step-tip">{{ getNextStepTip() }}</p>
        </div>
      </div>
    </div>

    <!-- 员工详情对话框 -->
    <el-dialog
      :title="`${selectedUser ? getUserName(selectedUser.userId) : ''} - 任务匹配详情`"
      :visible.sync="showUserDetail"
      width="80%"
      :before-close="closeUserDetail">
      
      <div v-if="userDetail" class="user-detail-content">
        <!-- 员工统计信息 -->
        <div class="detail-stats">
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="detail-stat-item">
                <div class="detail-stat-value">{{ userDetail.statistics.total_tasks }}</div>
                <div class="detail-stat-label">总任务数</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="detail-stat-item">
                <div class="detail-stat-value">{{ (userDetail.statistics.avg_match_rate * 100).toFixed(1) }}%</div>
                <div class="detail-stat-label">平均匹配度</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="detail-stat-item">
                <div class="detail-stat-value">{{ (userDetail.statistics.max_match_rate * 100).toFixed(1) }}%</div>
                <div class="detail-stat-label">最高匹配度</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="detail-stat-item">
                <div class="detail-stat-value">{{ userDetail.statistics.high_match_count }}</div>
                <div class="detail-stat-label">高匹配任务</div>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 匹配度分布 -->
        <div class="distribution-section" v-if="userDetail.distribution && userDetail.distribution.length > 0">
          <h4>匹配度分布</h4>
          <div class="distribution-chart">
            <div 
              v-for="dist in userDetail.distribution" 
              :key="dist.score_range"
              class="distribution-item">
              <div class="distribution-label">{{ dist.score_range }}</div>
              <div class="distribution-bar">
                <div 
                  class="distribution-fill"
                  :style="{ width: (dist.count / userDetail.statistics.total_tasks * 100) + '%' }">
                </div>
                <span class="distribution-count">{{ dist.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 最佳匹配任务 -->
        <div class="top-matches-section" v-if="userDetail.topMatches && userDetail.topMatches.length > 0">
          <h4>最佳匹配任务</h4>
          <div class="top-matches-list">
            <div 
              v-for="match in userDetail.topMatches" 
              :key="match.task_id"
              class="top-match-item">
              <div class="task-info">
                <div class="task-name">{{ getTaskName(match.task_id) }}</div>
                <div class="task-id">任务ID: {{ match.task_id }}</div>
              </div>
              <div class="match-rate">
                <el-tag 
                  :type="getMatchTagType(match.rate_percent)"
                  size="medium">
                  {{ (match.rate_percent * 100).toFixed(1) }}%
                </el-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- 详细任务列表 -->
        <div class="all-tasks-section">
          <h4>所有任务匹配详情</h4>
          <el-table 
            :data="userDetail.allMatches" 
            style="width: 100%"
            size="small">
            <el-table-column prop="task_id" label="任务ID" width="80"></el-table-column>
            <el-table-column label="任务名称" width="150">
              <template slot-scope="scope">
                {{ getTaskName(scope.row.task_id) }}
              </template>
            </el-table-column>
            <el-table-column label="匹配度" width="120">
              <template slot-scope="scope">
                <el-tag 
                  :type="getMatchTagType(scope.row.rate_percent)"
                  size="small">
                  {{ (scope.row.rate_percent * 100).toFixed(1) }}%
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
            <el-table-column label="更新时间" width="150">
              <template slot-scope="scope">
                {{ formatDate(scope.row.update_time) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div v-else-if="loadingUserDetail" class="detail-loading">
        <el-loading-directive text="加载员工详情中..."></el-loading-directive>
      </div>

      <div v-else-if="userDetailError" class="detail-error">
        <el-alert :title="userDetailError" type="error" show-icon></el-alert>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import topic03Api from '@/api/topic03Api'

export default {
  name: 'ProductionRefactor2',
  data() {
    return {
      // 基础信息
      currentBatch: 'TRAIN_ASSEMBLY_2025',
      nodeId: '', // 节点ID
      nodeTitle: '', // 节点标题
      nodeType: '', // 节点类型
      
      // 数据状态
      loading: false,
      error: null,
      userDataLoaded: false,
      equipmentDataLoaded: false,
      loadingUserData: false,
      loadingEquipmentData: false,
      
      // 员工数据
      users: [],
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0
      },

      // 设备数据
      equipmentList: [],
      equipmentPagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0
      },
      
      // 设备排序选项
      equipmentSortBy: 'equipment_id',
      equipmentSortOrder: 'asc',
      
      // 排序选项
      sortBy: 'avg_match_rate',
      sortOrder: 'desc',
      
      // 员工详情对话框
      showUserDetail: false,
      selectedUser: null,
      userDetail: null,
      loadingUserDetail: false,
      userDetailError: null,
      
      // 任务和用户名称映射
      taskNames: {
        2001: '主车体焊接',
        2002: '侧面板安装', 
        2003: '车顶安装',
        2004: '电气布线',
        2005: '制动系统',
        2006: '内饰安装',
        2007: '涂装准备',
        2008: '质量检查',
        2009: '调试测试',
        2010: '最终验收'
      },
      userNames: {
        1: '车体装配专家',
        2: '电气工程师',
        3: '制动系统专家',
        4: '内饰装配工',
        5: '涂装技师',
        6: '质量检验员',
        7: '调试工程师',
        8: '验收工程师',
        9: '装配学徒',
        10: '技术主管'
      }
    }
  },
  
  async created() {
    // 从路由参数获取节点信息
    this.nodeId = this.$route.query.nodeId || ''
    this.nodeTitle = this.$route.query.nodeTitle || ''
    this.nodeType = this.$route.query.nodeType || ''
    
    // 火车装配人员匹配固定使用TRAIN_ASSEMBLY_2025批次
    // 不使用路由参数，因为来自ProductionRefactor的batch是生产任务的批次(20240905)
    this.currentBatch = 'TRAIN_ASSEMBLY_2025'

    console.log('📋 进入人员匹配分析页面，节点信息:', {
      nodeId: this.nodeId,
      nodeTitle: this.nodeTitle,
      nodeType: this.nodeType,
      batch: this.currentBatch
    })

    // 不再自动加载数据，等待用户点击按钮
  },
  
  methods: {
    /**
     * 获取员工匹配度数据
     */
    async loadUserMatchData() {
      this.loadingUserData = true
      this.error = null

      try {
        // 模拟1秒加载时间
        await new Promise(resolve => setTimeout(resolve, 1000))

        // 加载员工数据
        await this.loadUserData()

        // 设置员工数据已加载
        this.userDataLoaded = true

        console.log('✅ 员工匹配度获取完成')

      } catch (error) {
        console.error('❌ 获取员工匹配度失败:', error)
        this.error = error.message || '获取员工匹配度失败，请稍后重试'
      } finally {
        this.loadingUserData = false
      }
    },

    /**
     * 获取设备健康度数据
     */
    async loadEquipmentHealthData() {
      this.loadingEquipmentData = true
      this.error = null

      try {
        // 模拟1秒加载时间
        await new Promise(resolve => setTimeout(resolve, 1000))

        // 加载设备数据
        await this.loadEquipmentData()

        // 设置设备数据已加载
        this.equipmentDataLoaded = true

        console.log('✅ 设备健康度获取完成')

      } catch (error) {
        console.error('❌ 获取设备健康度失败:', error)
        this.error = error.message || '获取设备健康度失败，请稍后重试'
      } finally {
        this.loadingEquipmentData = false
      }
    },

    /**
     * 加载员工匹配数据
     */
    async loadUserData() {
      this.loading = true
      this.error = null
      
      try {
        // 加载用户列表数据（统计信息已移除）
        const usersResult = await topic03Api.getTrainAssemblyUsers({
          sortBy: this.sortBy,
          sortOrder: this.sortOrder,
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          modelRunBatch: this.currentBatch
        })

        if (usersResult.success) {
          this.users = usersResult.data.users || []
          this.pagination = usersResult.data.pagination || this.pagination
        } else {
          throw new Error(usersResult.error || '获取用户列表失败')
        }

        console.log('✅ 员工匹配数据加载完成:', {
          usersCount: this.users.length
        })
        
      } catch (error) {
        console.error('❌ 加载员工匹配数据失败:', error)
        this.error = error.message || '加载员工数据失败，请稍后重试'
      } finally {
        this.loading = false
      }
    },
    
    /**
     * 查看员工详情
     */
    async viewUserDetail(user) {
      this.selectedUser = user
      this.showUserDetail = true
      this.loadingUserDetail = true
      this.userDetailError = null
      this.userDetail = null
      
      try {
        const result = await topic03Api.getTrainAssemblyUserDetail(user.user_id, {
          modelRunBatch: this.currentBatch
        })
        
        if (result.success) {
          this.userDetail = result.data
          console.log('✅ 员工详情加载完成:', this.userDetail)
        } else {
          throw new Error(result.error || '获取员工详情失败')
        }
        
      } catch (error) {
        console.error('❌ 加载员工详情失败:', error)
        this.userDetailError = error.message || '加载员工详情失败'
      } finally {
        this.loadingUserDetail = false
      }
    },
    
    /**
     * 关闭员工详情对话框
     */
    closeUserDetail() {
      this.showUserDetail = false
      this.selectedUser = null
      this.userDetail = null
      this.userDetailError = null
    },
    
    /**
     * 处理排序变化
     */
    async handleSortChange() {
      this.pagination.page = 1 // 重置到第一页
      await this.loadUserData()
    },
    
    /**
     * 设置排序方向
     */
    async setSortOrder(order) {
      if (this.sortOrder !== order) {
        this.sortOrder = order
        this.pagination.page = 1 // 重置到第一页
        await this.loadUserData()
      }
    },
    
    /**
     * 处理分页变化
     */
    async handlePageChange(page) {
      this.pagination.page = page
      await this.loadUserData()
    },
    
    /**
     * 获取用户名称
     */
    getUserName(userId) {
      return this.userNames[userId] || `员工${userId}`
    },
    
    /**
     * 获取任务名称
     */
    getTaskName(taskId) {
      return this.taskNames[taskId] || `任务${taskId}`
    },
    
    /**
     * 获取进度条颜色
     */
    getProgressColor(rate) {
      if (rate >= 0.85) return '#67c23a' // 绿色 - 优秀
      if (rate >= 0.70) return '#e6a23c' // 橙色 - 良好
      if (rate >= 0.55) return '#f56c6c' // 红色 - 一般
      return '#909399' // 灰色 - 较低
    },
    
    /**
     * 获取匹配度标签类型
     */
    getMatchTagType(rate) {
      if (rate >= 0.85) return 'success'
      if (rate >= 0.70) return 'warning'
      if (rate >= 0.55) return 'danger'
      return 'info'
    },
    
    /**
     * 格式化日期
     */
    formatDate(dateStr) {
      if (!dateStr) return '-'
      const date = new Date(dateStr)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    /**
     * 加载设备健康度数据
     */
    async loadEquipmentData() {
      try {
        // 从API获取设备健康度数据
        const result = await topic03Api.getTrainAssemblyEquipment({
          sortBy: this.equipmentSortBy,
          sortOrder: this.equipmentSortOrder,
          page: this.equipmentPagination.page,
          pageSize: this.equipmentPagination.pageSize,
          modelRunBatch: this.currentBatch
        })

        if (result.success) {
          this.equipmentList = result.data.equipment || []
          this.equipmentPagination = result.data.pagination || this.equipmentPagination

          console.log('✅ 设备健康度数据加载完成:', {
            total: this.equipmentPagination.total,
            currentPage: this.equipmentPagination.page,
            pageSize: this.equipmentPagination.pageSize
          })
        } else {
          throw new Error(result.error || '获取设备健康度数据失败')
        }

      } catch (error) {
        console.error('❌ 加载设备健康度数据失败:', error)
        throw error
      }
    },

    /**
     * 处理设备排序变化
     */
    async handleEquipmentSortChange() {
      this.equipmentPagination.page = 1
      await this.loadEquipmentData()
    },

    /**
     * 设置设备排序方向
     */
    async setEquipmentSortOrder(order) {
      if (this.equipmentSortOrder !== order) {
        this.equipmentSortOrder = order
        this.equipmentPagination.page = 1
        await this.loadEquipmentData()
      }
    },

    /**
     * 处理设备分页变化
     */
    async handleEquipmentPageChange(page) {
      this.equipmentPagination.page = page
      await this.loadEquipmentData()
    },

    /**
     * 获取设备名称
     */
    getEquipmentName(equipmentId) {
      const equipmentNames = {
        // 装配机器人系列
        'ROBOT-001': '高速装配机器人A1型',
        'ROBOT-002': '高速装配机器人A1型',
        'ROBOT-003': '高速装配机器人A1型',
        'ROBOT-004': '焊接机器人B2型',
        'ROBOT-005': '焊接机器人B2型',
        'ROBOT-006': '物料搬运机器人C3型',
        'ROBOT-007': '物料搬运机器人C3型',
        'ROBOT-008': '物料搬运机器人C3型',

        // 检测设备系列
        'DETECT-001': 'X光检测设备D1型',
        'DETECT-002': '质量检测设备D2型',
        'DETECT-003': '自动化测试台D3型',
        'DETECT-004': '扭矩测试仪D4型',
        'DETECT-005': '振动测试台D5型',
        'DETECT-006': '精密测量仪D6型',

        // 传送系统系列
        'CONVEY-001': '智能传送带E1型',
        'CONVEY-002': '智能传送带E1型',
        'CONVEY-003': '物料传送带E2型',
        'CONVEY-004': '仓储机器人E3型',
        'CONVEY-005': '智能仓储系统E4型',
        'CONVEY-006': 'AGV小车E5型',

        // 加工设备系列
        'PROCESS-001': '激光切割设备F1型',
        'PROCESS-002': '车体焊接设备F2型',
        'PROCESS-003': '涂装设备F3型',
        'PROCESS-004': '涂装设备F3型',
        'PROCESS-005': 'CNC加工中心F4型',
        'PROCESS-006': '磨床设备F5型'
      }
      return equipmentNames[equipmentId] || equipmentId
    },

    /**
     * 获取设备健康度颜色
     */
    getHealthColor(rate) {
      if (rate >= 0.90) return '#67c23a' // 绿色 - 优秀
      if (rate >= 0.75) return '#e6a23c' // 橙色 - 良好
      if (rate >= 0.60) return '#f56c6c' // 红色 - 一般
      return '#c0392b' // 深红色 - 较差
    },

    /**
     * 获取设备健康度标签类型
     */
    getHealthTagType(rate) {
      if (rate >= 0.90) return 'success'
      if (rate >= 0.75) return 'warning'
      if (rate >= 0.60) return 'danger'
      return 'danger'
    },

    /**
     * 获取设备健康度状态
     */
    getHealthStatus(rate) {
      if (rate >= 0.90) return '优秀'
      if (rate >= 0.75) return '良好'
      if (rate >= 0.60) return '一般'
      return '需维护'
    },

    /**
     * 处理重新加载
     */
    async handleReload() {
      // 重置状态
      this.userDataLoaded = false
      this.equipmentDataLoaded = false
      this.error = null

      // 用户可以选择重新获取哪部分数据
      console.log('🔄 重置数据状态，用户可重新选择加载数据')
    },

    /**
     * 获取下一步提示文字
     */
    getNextStepTip() {
      return '人员匹配度和设备健康度分析已全部完成，可以进入下一阶段'
    },

    /**
     * 处理下一步 - 跳转到ProductionRefactor3
     */
    handleNextStep() {
      console.log('🔜 跳转到生产重构页面')
      this.$router.push({
        name: 'ProductionRefactor3',
        query: {
          batch: this.currentBatch,
          nodeId: this.nodeId,
          nodeTitle: this.nodeTitle,
          nodeType: this.nodeType
        }
      })
    },

    /**
     * 返回上一步
     */
    goBack() {
      console.log('🔙 返回上一步')
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.production-refactor2 {
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

/* 加载和错误状态 */
.loading-container, .error-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 50px;
  text-align: center;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 统计信息区域样式已移除 */

/* 获取数据按钮区域 */
.load-data-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.load-data-container {
  text-align: center;
  padding: 40px;
  width: 100%;
  max-width: 800px;
}

.load-button-group {
  margin-bottom: 40px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.load-button-group:last-child {
  margin-bottom: 0;
}

.load-match-btn {
  font-size: 16px;
  padding: 16px 32px;
  border-radius: 8px;
  font-weight: 600;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.load-match-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.3);
}

.load-tip {
  color: #606266;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
}

/* 员工列表区域 */
.users-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

/* 设备健康度区域 */
.equipment-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.section-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.section-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 员工卡片网格 */
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.user-card {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.user-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #409eff;
}

.user-card.high-match {
  border-left: 4px solid #67c23a;
}

.user-card.high-match::before {
  content: '高匹配';
  position: absolute;
  top: 8px;
  right: 8px;
  background: #67c23a;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.user-info .user-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.user-info .user-id {
  font-size: 12px;
  color: #909399;
}

.match-score {
  text-align: right;
}

.score-value {
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
  line-height: 1;
}

.score-label {
  font-size: 11px;
  color: #606266;
  margin-top: 2px;
}

.user-stats {
  margin-bottom: 12px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 13px;
}

.stat-name {
  color: #606266;
}

.stat-value {
  color: #303133;
  font-weight: 500;
}

.stat-value.highlight {
  color: #e6a23c;
  font-weight: 600;
}

.user-progress {
  margin-bottom: 12px;
}

.user-actions {
  text-align: center;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

/* 分页 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

/* 设备卡片网格 */
.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.equipment-card {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.equipment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.equipment-card.excellent-health {
  border-left: 4px solid #67c23a;
}

.equipment-card.good-health {
  border-left: 4px solid #e6a23c;
}

.equipment-card.warning-health {
  border-left: 4px solid #f56c6c;
}

.equipment-card.poor-health {
  border-left: 4px solid #c0392b;
}

.equipment-card.excellent-health::before {
  content: '优秀';
  position: absolute;
  top: 8px;
  right: 8px;
  background: #67c23a;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.equipment-card.good-health::before {
  content: '良好';
  position: absolute;
  top: 8px;
  right: 8px;
  background: #e6a23c;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.equipment-card.warning-health::before {
  content: '一般';
  position: absolute;
  top: 8px;
  right: 8px;
  background: #f56c6c;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.equipment-card.poor-health::before {
  content: '需维护';
  position: absolute;
  top: 8px;
  right: 8px;
  background: #c0392b;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.equipment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.equipment-info .equipment-id {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.equipment-info .equipment-name {
  font-size: 12px;
  color: #909399;
}

.health-score {
  text-align: right;
}

.health-value {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
  line-height: 1;
}

.health-label {
  font-size: 11px;
  color: #606266;
  margin-top: 2px;
}

.equipment-progress {
  margin-bottom: 12px;
}

.equipment-status {
  margin-bottom: 12px;
  text-align: center;
}

.equipment-remark {
  margin-bottom: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
}

.equipment-remark p {
  margin: 0;
  font-size: 12px;
  color: #606266;
  line-height: 1.4;
}

.equipment-actions {
  text-align: center;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

/* 下一步按钮 */
.next-step-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.next-step-btn {
  font-size: 16px;
  padding: 16px 32px;
  border-radius: 6px;
  font-weight: 500;
  margin-bottom: 12px;
  transition: all 0.2s ease;
}

.next-step-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.next-step-tip {
  color: #6c757d;
  font-size: 14px;
  margin: 0;
  font-weight: 400;
  text-align: center;
  line-height: 1.5;
}

/* 员工详情对话框 */
.user-detail-content {
  max-height: 70vh;
  overflow-y: auto;
}

.detail-stats {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-stat-item {
  text-align: center;
}

.detail-stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 4px;
}

.detail-stat-label {
  font-size: 14px;
  color: #606266;
}

.distribution-section,
.top-matches-section,
.all-tasks-section {
  margin-bottom: 24px;
}

.distribution-section h4,
.top-matches-section h4,
.all-tasks-section h4 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 2px solid #409eff;
  padding-bottom: 8px;
}

/* 匹配度分布图表 */
.distribution-chart {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
  border: 1px solid #e4e7ed;
}

.distribution-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.distribution-label {
  min-width: 120px;
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

.distribution-bar {
  flex: 1;
  height: 20px;
  background: #f5f7fa;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.distribution-fill {
  height: 100%;
  background: linear-gradient(90deg, #409eff, #67c23a);
  border-radius: 10px;
  transition: width 0.6s ease;
}

.distribution-count {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  color: #303133;
  font-weight: 600;
}

/* 最佳匹配任务列表 */
.top-matches-list {
  display: grid;
  gap: 12px;
}

.top-match-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.top-match-item:hover {
  border-color: #409eff;
  background: #f0f9ff;
}

.task-info .task-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
}

.task-info .task-id {
  font-size: 12px;
  color: #909399;
}

.detail-loading,
.detail-error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
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

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .users-grid {
    grid-template-columns: 1fr;
  }

  .equipment-grid {
    grid-template-columns: 1fr;
  }

  .load-data-section {
    min-height: 400px;
    padding: 20px;
  }

  .load-button-group {
    margin-bottom: 30px;
    padding: 20px;
  }

  .load-data-container {
    padding: 30px 20px;
  }

  .load-match-btn {
    font-size: 14px;
    padding: 14px 24px;
  }

  .next-step-container {
    margin-top: 24px;
    padding: 20px;
  }

  .next-step-btn {
    font-size: 14px;
    padding: 14px 24px;
  }

  .distribution-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .distribution-label {
    min-width: auto;
  }

  .top-match-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .production-refactor2 {
    padding: 12px;
  }

  .users-section {
    padding: 16px;
  }

  .equipment-section {
    padding: 16px;
  }

  .user-card {
    padding: 12px;
  }

  .equipment-card {
    padding: 12px;
  }
}
</style>
