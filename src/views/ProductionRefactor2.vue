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
          <el-button type="primary" @click="loadData" size="small">重新加载</el-button>
        </el-alert>
      </div>

      <!-- 主要内容 -->
      <div v-else>
        <!-- 统计信息区域已移除 -->

        <!-- 员工卡片列表 -->
        <div class="users-section">
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
      
      // 数据状态
      loading: false,
      error: null,
      
      // 员工数据
      users: [],
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0
      },
      
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
    // 火车装配人员匹配固定使用TRAIN_ASSEMBLY_2025批次
    // 不使用路由参数，因为来自ProductionRefactor的batch是生产任务的批次(20240905)
    this.currentBatch = 'TRAIN_ASSEMBLY_2025'
    
    // 加载数据
    await this.loadData()
  },
  
  methods: {
    /**
     * 加载员工匹配数据
     */
    async loadData() {
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
        this.error = error.message || '加载数据失败，请稍后重试'
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
      await this.loadData()
    },
    
    /**
     * 设置排序方向
     */
    async setSortOrder(order) {
      if (this.sortOrder !== order) {
        this.sortOrder = order
        this.pagination.page = 1 // 重置到第一页
        await this.loadData()
      }
    },
    
    /**
     * 处理分页变化
     */
    async handlePageChange(page) {
      this.pagination.page = page
      await this.loadData()
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

/* 员工列表区域 */
.users-section {
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

  .user-card {
    padding: 12px;
  }
}
</style>
