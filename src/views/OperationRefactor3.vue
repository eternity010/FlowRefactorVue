<template>
  <div class="operation-refactor3-container">
    <!-- 返回按钮 -->
    <div class="page-header">
      <el-button
        type="primary"
        icon="el-icon-back"
        @click="goBack"
        class="back-btn">
        返回上一步
      </el-button>
    </div>

    <!-- 数据加载状态卡片 -->
    <div class="data-status-section">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="status-card" shadow="hover">
            <div class="status-content">
              <div class="status-icon" :class="smartMaintenanceStatus.type">
                <i :class="smartMaintenanceStatus.icon" v-if="smartMaintenanceStatus.status !== 'loading'"></i>
                <i class="el-icon-loading card-loading-icon" v-else></i>
              </div>
              <div class="status-info">
                <h4 class="status-title">智能维修建议</h4>
                <span class="status-badge" :class="smartMaintenanceStatus.type">{{ smartMaintenanceStatus.text }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="status-card" shadow="hover">
            <div class="status-content">
              <div class="status-icon" :class="personnelMatchingStatus.type">
                <i :class="personnelMatchingStatus.icon" v-if="personnelMatchingStatus.status !== 'loading'"></i>
                <i class="el-icon-loading card-loading-icon" v-else></i>
              </div>
              <div class="status-info">
                <h4 class="status-title">人员匹配度</h4>
                <span class="status-badge" :class="personnelMatchingStatus.type">{{ personnelMatchingStatus.text }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 运维计划重构卡片 -->
    <div class="refactor-section">
      <el-card class="refactor-card" shadow="hover">
        <div slot="header" class="card-header">
          <div class="header-content">
            <span class="card-title">
              <i class="el-icon-setting"></i>
              运维计划重构
            </span>
            <div class="date-range-header">
              <i class="el-icon-date"></i>
              <span>分析期间：2025.6.1 - 2025.6.3</span>
            </div>
          </div>
        </div>
        <div class="refactor-content">
          <!-- 初始状态 - 开始按钮 -->
          <div v-if="!refactorStarted" class="start-content">
            <i class="el-icon-s-operation start-icon"></i>
            <p class="start-text">准备开始运维计划重构分析</p>
            <p class="start-desc">基于智能维修建议和人员匹配度数据</p>
            <el-button 
              type="primary" 
              size="large" 
              @click="startRefactor"
              class="start-btn">
              <i class="el-icon-caret-right"></i>
              开始重构分析
            </el-button>
          </div>
          
          <!-- 加载状态 -->
          <div v-else-if="loading" class="loading-content">
            <i class="el-icon-loading loading-icon"></i>
            <p class="loading-text">正在分析重构效果...</p>
            <div class="loading-progress">
              <div class="progress-bar"></div>
            </div>
          </div>
          
          <!-- 重构效果展示 -->
          <div v-else-if="refactorData" class="effect-display">
            <!-- 时间对比展示 -->
            <div class="time-comparison">
              <div class="comparison-header">
                <h4 class="comparison-title">
                  <i class="el-icon-time"></i>
                  重构对比分析
                </h4>
              </div>
              
              <!-- 维修时间对比 -->
              <div class="comparison-content">
                <div class="comparison-row">
                  <div class="comparison-label">
                    <i class="el-icon-time"></i>
                    <span>维修时间</span>
                  </div>
                  <div class="time-item original">
                    <div class="time-label">重构前</div>
                    <div class="time-value">{{ refactorData.原总维修时间小时 }}</div>
                    <div class="time-unit">小时</div>
                  </div>
                  
                  <div class="comparison-arrow">
                    <i class="el-icon-right"></i>
                  </div>
                  
                  <div class="time-item optimized">
                    <div class="time-label">重构后</div>
                    <div class="time-value">{{ refactorData.现总维修时间小时 }}</div>
                    <div class="time-unit">小时</div>
                  </div>
                  
                  <div class="improvement-indicator">
                    <div class="improvement-badge">
                      <i class="el-icon-bottom"></i>
                      <span>节省 {{ refactorData.总维修时间节省小时 }} 小时</span>
                    </div>
                    <div class="improvement-percentage">
                      优化率：{{ timeImprovementRate }}%
                    </div>
                  </div>
                </div>
                
                <!-- 故障间隔时间对比 -->
                <div class="comparison-row">
                  <div class="comparison-label">
                    <i class="el-icon-warning-outline"></i>
                    <span>保障运行时间</span>
                  </div>
                  <div class="time-item original">
                    <div class="time-label">重构前</div>
                    <div class="time-value">{{ refactorData.原总故障间隔时间小时 }}</div>
                    <div class="time-unit">小时</div>
                  </div>
                  
                  <div class="comparison-arrow">
                    <i class="el-icon-right"></i>
                  </div>
                  
                  <div class="time-item optimized">
                    <div class="time-label">重构后</div>
                    <div class="time-value">{{ refactorData.现总故障间隔时间小时 }}</div>
                    <div class="time-unit">小时</div>
                  </div>
                  
                    <div class="improvement-indicator">
                      <div class="improvement-badge positive">
                        <i class="el-icon-top"></i>
                        <span>延长 {{ refactorData.总故障间隔延长小时 }} 小时</span>
                      </div>
                      <div class="optimization-stats">
                        <div class="optimization-item">
                          <span class="optimization-label">最大优化率</span>
                          <span class="optimization-value">{{ refactorData.最大优化率 }}%</span>
                        </div>
                        <div class="optimization-item">
                          <span class="optimization-label">平均优化率</span>
                          <span class="optimization-value">{{ refactorData.平均优化率 }}%</span>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
            
            <div class="effect-details">
              <div class="detail-item">
                <i class="el-icon-success detail-icon"></i>
                <span>{{ refactorData.总记录数 }} 条维修记录完成重构分析</span>
              </div>
              <div class="detail-item">
                <i class="el-icon-timer detail-icon"></i>
                <span>平均每条记录节省 {{ averageTimeSaved }} 小时</span>
              </div>
              <div class="detail-item">
                <i class="el-icon-user detail-icon"></i>
                <span>{{ refactorData.人员重新分配率 }}% 的记录进行了人员优化</span>
              </div>
            </div>
            
            <div class="summary-section">
              <div class="summary-title">重构效果评估</div>
              <div class="summary-content">
                <el-tag 
                  :type="getEffectTagType(refactorSummary.重构效果)" 
                  size="medium">
                  {{ refactorSummary.重构效果 }}
                </el-tag>
                <p class="summary-text">{{ refactorSummary.建议 }}</p>
              </div>
            </div>
            
            <!-- 详细记录展开列表 -->
            <div class="detailed-records-section">
              <div class="detailed-header" @click="showDetailedRecords = !showDetailedRecords">
                <div class="detailed-title">
                  <i class="el-icon-document"></i>
                  详细重构记录
                  <span class="record-count" v-if="detailedRecords">
                    ({{ detailedRecords.length }} 条改进记录)
                  </span>
                </div>
                <div class="expand-icon">
                  <i :class="showDetailedRecords ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </div>
              </div>
              
              <div v-show="showDetailedRecords" class="detailed-content">
                <div v-if="detailedRecords && detailedRecords.length > 0" class="records-list">
                  <div 
                    v-for="(record, index) in detailedRecords" 
                    :key="index" 
                    class="record-item">
                    <!-- 基本信息 -->
                    <div class="record-header">
                      <div class="train-info">
                        <span class="train-id">{{ record.trainId }}</span>
                        <span class="carriage">{{ record.carriageNo }}</span>
                        <span class="system">{{ record.systemModule }}</span>
                      </div>
                      <div class="date-info">{{ record.reportDate }}</div>
                    </div>
                    
                    <!-- 变化对比 -->
                    <div class="changes-grid">
                      <!-- 人员变化 -->
                      <div class="change-item">
                        <div class="change-label">
                          <i class="el-icon-user"></i>
                          维修人员
                        </div>
                        <div class="change-comparison" v-if="record.personChanged">
                          <span class="old-value">{{ record.oldPerson }}</span>
                          <i class="el-icon-right arrow"></i>
                          <span class="new-value">{{ record.newPerson }}</span>
                          <el-tag size="mini" type="success">人员调整</el-tag>
                        </div>
                        <div class="no-change-display" v-else>
                          <span class="current-value">{{ record.oldPerson || record.newPerson }}</span>
                          <el-tag size="mini" type="info">无人员变化</el-tag>
                        </div>
                      </div>
                      
                      <!-- 维修时间变化 -->
                      <div class="change-item" v-if="record.repairTimeImproved">
                        <div class="change-label">
                          <i class="el-icon-time"></i>
                          维修时间
                        </div>
                        <div class="change-comparison">
                          <span class="old-value">{{ record.oldRepairTime }}h</span>
                          <i class="el-icon-right arrow"></i>
                          <span class="new-value">{{ record.newRepairTime }}h</span>
                          <el-tag size="mini" type="success">
                            节省 {{ record.repairTimeSaved }}h
                          </el-tag>
                        </div>
                      </div>
                      
                      <!-- 故障间隔变化 -->
                      <div class="change-item" v-if="record.failureTimeImproved">
                        <div class="change-label">
                          <i class="el-icon-warning-outline"></i>
                          故障间隔
                        </div>
                        <div class="change-comparison">
                          <span class="old-value">{{ record.oldFailureTime }}h</span>
                          <i class="el-icon-right arrow"></i>
                          <span class="new-value">{{ record.newFailureTime }}h</span>
                          <el-tag size="mini" type="warning">
                            延长 {{ record.failureTimeIncreased }}h
                          </el-tag>
                        </div>
                      </div>
                      
                      <!-- 匹配度变化 -->
                      <div class="change-item" v-if="record.matchScoreImproved">
                        <div class="change-label">
                          <i class="el-icon-star-on"></i>
                          匹配度
                        </div>
                        <div class="change-comparison">
                          <span class="old-value">{{ (record.oldMatchScore * 100).toFixed(1) }}%</span>
                          <i class="el-icon-right arrow"></i>
                          <span class="new-value">{{ (record.newMatchScore * 100).toFixed(1) }}%</span>
                          <el-tag size="mini" type="primary">匹配提升</el-tag>
                        </div>
                      </div>
                    </div>
                    
                    <!-- 故障描述 -->
                    <div class="fault-description">
                      <i class="el-icon-warning"></i>
                      {{ record.faultDescription }}
                    </div>
                  </div>
                </div>
                
                <div v-else class="no-records">
                  <i class="el-icon-document-remove"></i>
                  <p>暂无改进记录</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 错误状态 -->
          <div v-else-if="error" class="error-content">
            <i class="el-icon-warning error-icon"></i>
            <p class="error-text">数据加载失败</p>
            <p class="error-desc">{{ error }}</p>
            <el-button @click="loadRefactorData" type="primary" size="small">
              重新加载
            </el-button>
          </div>
          
          <!-- 错误状态 -->
          <div v-else-if="error" class="error-content">
            <i class="el-icon-warning error-icon"></i>
            <p class="error-text">数据加载失败</p>
            <p class="error-desc">{{ error }}</p>
            <el-button @click="startRefactor" type="primary" size="small">
              重新分析
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 回到主界面按钮 -->
    <div class="page-footer">
      <div class="footer-content">
        <el-button
          v-if="refactorData"
          type="primary"
          size="large"
          @click="goHome"
          class="home-btn">
          <i class="el-icon-house"></i>
          回到主界面
        </el-button>
        <div v-else class="next-hint">
          <i class="el-icon-info"></i>
          请先完成运维计划重构分析
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { operationRefactorApi } from '@/api/operationRefactorApi'

export default {
  name: 'OperationRefactor3',
  data() {
    return {
      // 路由参数
      routeParams: this.$route.params,
      routeQuery: this.$route.query,
      
      // 数据状态
      loading: false,
      error: null,
      refactorData: null,
      refactorSummary: null,
      detailedRecords: null,
      
      // 重构流程控制
      refactorStarted: false,
      
      // 状态卡片状态
      smartMaintenanceStatus: {
        status: 'loading',
        type: 'loading',
        icon: 'el-icon-check',
        text: '加载中...'
      },
      personnelMatchingStatus: {
        status: 'loading',
        type: 'loading',
        icon: 'el-icon-check',
        text: '加载中...'
      },
      
      // 展开列表控制
      showDetailedRecords: false,
      
      // 默认查询参数
      defaultParams: {
        start_date: '2025-06-01',
        end_date: '2025-06-03'
      }
    }
  },
  
  computed: {
    // 计算平均每条记录节省的时间
    averageTimeSaved() {
      if (!this.refactorData || this.refactorData.维修时间缩短记录数 === 0) {
        return '0.00'
      }
      const average = this.refactorData.总维修时间节省小时 / this.refactorData.维修时间缩短记录数
      return average.toFixed(2)
    },
    
    // 计算时间改进率
    timeImprovementRate() {
      if (!this.refactorData || !this.refactorData.原总维修时间小时 || this.refactorData.原总维修时间小时 === 0) {
        return '0.00'
      }
      const rate = (this.refactorData.总维修时间节省小时 / this.refactorData.原总维修时间小时) * 100
      return rate.toFixed(2)
    },
    
    // 计算故障间隔改进率
    failureImprovementRate() {
      if (!this.refactorData || !this.refactorData.原总故障间隔时间小时 || this.refactorData.原总故障间隔时间小时 === 0) {
        return '0.00'
      }
      const rate = (this.refactorData.总故障间隔延长小时 / this.refactorData.原总故障间隔时间小时) * 100
      return rate.toFixed(2)
    }
  },
  
  mounted() {
    console.log('📍 OperationRefactor3 页面已加载')
    // 模拟状态卡片的加载过程
    this.simulateCardLoading()
  },
  
  methods: {
    /**
     * 模拟状态卡片加载过程
     */
    simulateCardLoading() {
      // 智能维修建议卡片 - 2秒后完成
      setTimeout(() => {
        this.smartMaintenanceStatus = {
          status: 'success',
          type: 'success',
          icon: 'el-icon-check',
          text: '加载成功'
        }
      }, 2000)
      
      // 人员匹配度卡片 - 3秒后完成
      setTimeout(() => {
        this.personnelMatchingStatus = {
          status: 'success',
          type: 'success',
          icon: 'el-icon-check',
          text: '加载成功'
        }
      }, 3000)
    },
    
    /**
     * 开始重构分析
     */
    async startRefactor() {
      this.refactorStarted = true
      
      // 模拟1.5秒的加载过程
      setTimeout(() => {
        this.loadRefactorData()
      }, 1500)
    },
    
    /**
     * 加载重构数据
     */
    async loadRefactorData() {
      try {
        this.loading = true
        this.error = null
        
        console.log('🔄 开始加载重构数据...', this.defaultParams)
        
        // 调用API获取重构分析数据
        const result = await operationRefactorApi.getRefactorAnalysis(this.defaultParams)
        
        if (result.success) {
          this.refactorData = result.data.effectStats
          this.refactorSummary = result.data.summary
          this.detailedRecords = result.data.detailedRecords
          
          console.log('✅ 重构数据加载成功:', result.data)
          console.log('📊 详细记录数量:', (this.detailedRecords && this.detailedRecords.length) || 0)
          
          // 显示成功消息
          this.$message.success('重构分析数据加载完成')
          
          // 更新上方状态卡片为已完成状态
          this.updateStatusCards()
        } else {
          throw new Error(result.error || '获取重构数据失败')
        }
      } catch (error) {
        console.error('❌ 加载重构数据失败:', error)
        this.error = error.message || '加载重构数据时发生错误'
        
        // 显示错误消息
        this.$message.error('重构数据加载失败: ' + this.error)
      } finally {
        this.loading = false
      }
    },
    
    /**
     * 更新状态卡片
     */
    updateStatusCards() {
      // 这里可以添加逻辑来更新上方两个状态卡片的显示
      console.log('🔄 更新状态卡片显示')
    },
    
    /**
     * 获取效果标签类型
     */
    getEffectTagType(effect) {
      switch (effect) {
        case '显著':
          return 'success'
        case '良好':
          return 'warning'
        case '一般':
          return 'info'
        default:
          return 'info'
      }
    },
    
    /**
     * 返回上一页
     */
    goBack() {
      console.log('🔙 返回上一页')
      this.$router.push({
        name: 'OperationRefactor2',
        params: this.routeParams,
        query: this.routeQuery
      })
    },

    /**
     * 回到主界面
     */
    goHome() {
      console.log('🏠 回到主界面')
      this.$router.push({
        name: 'Dashbord',
        query: {}
      })
    },
    
    /**
     * 导出重构报告
     */
    exportReport() {
      if (!this.refactorData) {
        this.$message.warning('暂无数据可导出')
        return
      }
      
      // 这里可以添加导出报告的逻辑
      console.log('📋 导出重构报告', this.refactorData)
      this.$message.success('重构报告导出中...')
    },
    
    /**
     * 查看详细分析
     */
    viewDetailedAnalysis() {
      if (!this.refactorData) {
        this.$message.warning('暂无数据可查看')
        return
      }
      
      // 这里可以添加跳转到详细分析页面的逻辑
      console.log('🔍 查看详细分析')
      this.$message.info('详细分析功能开发中...')
    }
  }
}
</script>

<style scoped>
.operation-refactor3-container {
  padding: 16px;
  background-color: #f8f8f8;
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.back-btn {
  margin-right: 16px;
  border: 1px solid #d9d9d9;
  background: #f5f5f5;
  color: #333;
}

.back-btn:hover {
  background: #e8e8e8;
  border-color: #cccccc;
}

/* 页脚样式 */
.page-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.next-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #909399;
  font-weight: 500;
}

.next-hint i {
  color: #409EFF;
  font-size: 16px;
}

.home-btn {
  background: linear-gradient(135deg, #409EFF, #66B1FF);
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
}

.home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

.home-btn i {
  margin-right: 8px;
}

/* 数据状态卡片样式 */
.data-status-section {
  margin-bottom: 30px;
}

.status-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.status-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.status-content {
  display: flex;
  align-items: center;
  padding: 16px;
}

.status-icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 18px;
  color: white;
}

.status-icon.success {
  background: linear-gradient(135deg, #67C23A, #85CE61);
}

.status-icon.loading {
  background: linear-gradient(135deg, #409EFF, #66B1FF);
}

.card-loading-icon {
  animation: rotate 2s linear infinite;
}

.status-info {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.status-badge {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.status-badge.success {
  background: #f0f9ff;
  color: #67C23A;
  border: 1px solid #e7f4e7;
}

.status-badge.loading {
  background: #e6f7ff;
  color: #409EFF;
  border: 1px solid #d6e4ff;
}

/* 运维计划重构卡片样式 */
.refactor-section {
  margin-bottom: 30px;
}

.refactor-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.refactor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.card-title i {
  margin-right: 8px;
  color: #409EFF;
}

.refactor-content {
  padding: 40px 20px;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-content {
  text-align: center;
  color: #909399;
}

.empty-icon {
  font-size: 48px;
  color: #c0c4cc;
  margin-bottom: 16px;
  display: block;
}

.empty-text {
  font-size: 16px;
  color: #606266;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.empty-desc {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

/* 开始状态样式 */
.start-content {
  text-align: center;
  color: #606266;
  padding: 40px 20px;
}

.start-icon {
  font-size: 64px;
  color: #1890ff;
  margin-bottom: 20px;
  display: block;
}

.start-text {
  font-size: 18px;
  color: #2c3e50;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.start-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 24px 0;
}

.start-btn {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  transition: all 0.3s ease;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
}

.start-btn i {
  margin-right: 8px;
}

/* 加载状态样式 */
.loading-content {
  text-align: center;
  color: #409EFF;
  padding: 40px 20px;
}

.loading-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 16px;
  margin: 0 0 16px 0;
  font-weight: 500;
}

.loading-progress {
  width: 200px;
  height: 4px;
  background: #f0f0f0;
  border-radius: 2px;
  margin: 0 auto;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #1890ff, #40a9ff);
  width: 0%;
  animation: progress 1.5s ease-in-out;
}

@keyframes progress {
  from { width: 0%; }
  to { width: 100%; }
}

/* 错误状态样式 */
.error-content {
  text-align: center;
  color: #F56C6C;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

.error-text {
  font-size: 16px;
  color: #F56C6C;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.error-desc {
  font-size: 14px;
  color: #909399;
  margin: 0 0 16px 0;
}

/* 重构效果展示样式 */
.effect-display {
  width: 100%;
}


.main-metric {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #409EFF, #67C23A);
  border-radius: 12px;
  color: white;
}

.metric-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-size: 24px;
}

.metric-content {
  text-align: left;
}

.metric-value {
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 14px;
  opacity: 0.9;
}

.effect-details {
  margin-bottom: 32px;
  padding: 24px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid #e8e8e8;
  font-size: 18px;
  color: #2c3e50;
  font-weight: 600;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-icon {
  width: 40px;
  height: 40px;
  margin-right: 16px;
  color: #52c41a;
  font-size: 20px;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.summary-section {
  padding: 28px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.summary-title {
  font-size: 20px;
  font-weight: 700;
  color: #1890ff;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-title::before {
  content: "📊";
  font-size: 22px;
}

.summary-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.summary-text {
  flex: 1;
  font-size: 16px;
  color: #2c3e50;
  margin: 0;
  line-height: 1.8;
  font-weight: 500;
}

.summary-content .el-tag {
  font-size: 16px !important;
  padding: 8px 16px !important;
  height: auto !important;
  line-height: 1.4 !important;
  font-weight: 600 !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .operation-refactor3-container {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .back-btn {
    margin-right: 0;
    align-self: flex-start;
    background: #f5f5f5;
    border-color: #d9d9d9;
    color: #333;
  }

  .back-btn:hover {
    background: #e8e8e8;
    border-color: #cccccc;
  }

  .page-footer {
    padding: 12px;
    margin-top: 16px;
  }

  .footer-content {
    align-items: center;
  }

  .home-btn {
    padding: 8px 16px;
    font-size: 14px;
  }

  .next-hint {
    font-size: 13px;
  }

  .data-status-section .el-col {
    margin-bottom: 16px;
  }

  .status-card {
    margin-bottom: 12px;
  }

  .status-content {
    padding: 12px;
  }

  .status-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
    margin-right: 12px;
  }

  .status-title {
    font-size: 14px;
  }

  .status-badge {
    font-size: 11px;
    padding: 3px 8px;
  }

  .refactor-content {
    padding: 30px 16px;
    min-height: 120px;
  }

  .start-content {
    padding: 30px 16px;
  }
  
  .start-icon {
    font-size: 56px;
    margin-bottom: 16px;
  }
  
  .start-text {
    font-size: 16px;
  }
  
  .start-desc {
    font-size: 13px;
    margin-bottom: 20px;
  }
  
  .start-btn {
    padding: 10px 20px;
    font-size: 15px;
  }
  
  .loading-content {
    padding: 30px 16px;
  }
  
  .loading-icon {
    font-size: 40px;
    margin-bottom: 12px;
  }
  
  .loading-text {
    font-size: 14px;
  }
  
  .loading-progress {
    width: 160px;
    height: 3px;
  }
  
  .main-metric {
    flex-direction: column;
    text-align: center;
    padding: 16px;
  }
  
  .metric-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
    margin-right: 0;
    margin-bottom: 12px;
  }
  
  .metric-value {
    font-size: 28px;
  }
  
  .detail-item {
    font-size: 16px;
    padding: 16px 0;
  }
  
  .detail-icon {
    width: 36px;
    height: 36px;
    font-size: 18px;
    margin-right: 14px;
  }
  
  .summary-section {
    padding: 20px;
  }
  
  .summary-title {
    font-size: 18px;
  }
  
  .summary-content {
    flex-direction: column;
    gap: 12px;
  }
  
  .summary-text {
    font-size: 15px;
  }
  
  .summary-content .el-tag {
    font-size: 15px !important;
    padding: 7px 14px !important;
  }
}

@media (max-width: 480px) {
  .operation-refactor3-container {
    padding: 8px;
  }

  .status-content {
    padding: 10px;
    flex-direction: column;
    text-align: center;
  }

  .status-icon {
    width: 36px;
    height: 36px;
    font-size: 14px;
    margin-right: 0;
    margin-bottom: 8px;
  }

  .status-info {
    flex-direction: column;
    gap: 6px;
  }

  .refactor-content {
    padding: 20px 12px;
    min-height: 100px;
  }
  
  .start-content {
    padding: 20px 12px;
  }
  
  .start-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }
  
  .start-text {
    font-size: 15px;
  }
  
  .start-desc {
    font-size: 12px;
    margin-bottom: 16px;
  }
  
  .start-btn {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  .loading-content {
    padding: 20px 12px;
  }
  
  .loading-icon {
    font-size: 32px;
    margin-bottom: 8px;
  }
  
  .loading-text {
    font-size: 13px;
  }
  
  .loading-progress {
    width: 120px;
    height: 3px;
  }
  
  .main-metric {
    padding: 12px;
  }
  
  .metric-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
    margin-bottom: 8px;
  }
  
  .metric-value {
    font-size: 24px;
  }
  
  .metric-label {
    font-size: 12px;
  }
  
  .detail-item {
    font-size: 15px;
    padding: 14px 0;
  }
  
  .detail-icon {
    width: 32px;
    height: 32px;
    font-size: 16px;
    margin-right: 12px;
  }
  
  .summary-section {
    padding: 16px;
  }
  
  .summary-title {
    font-size: 17px;
  }
  
  .summary-text {
    font-size: 14px;
  }
  
  .summary-content .el-tag {
    font-size: 14px !important;
    padding: 6px 12px !important;
  }

  .page-footer {
    padding: 12px;
    margin-top: 16px;
  }

  .footer-content {
    align-items: center;
  }

  .home-btn {
    padding: 8px 16px;
    font-size: 14px;
  }

  .next-hint {
    font-size: 12px;
  }
}

/* 卡片头部样式 */
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.date-range-header {
  color: #666;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(24, 144, 255, 0.1);
  padding: 6px 12px;
  border-radius: 16px;
  border: 1px solid #e0e0e0;
}

.date-range-header i {
  color: #1890ff;
}

/* 时间对比样式 */
.time-comparison {
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.comparison-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.comparison-title {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.comparison-title i {
  color: #1890ff;
  font-size: 20px;
}


.comparison-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.comparison-row {
  display: grid;
  grid-template-columns: 120px 1fr auto 1fr auto;
  gap: 20px;
  align-items: center;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.comparison-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
  text-align: center;
}

.comparison-label i {
  font-size: 20px;
  color: #1890ff;
}

.time-item {
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  background: #fff;
  border: 2px solid #e1e8f5;
  transition: all 0.3s ease;
}

.time-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.time-item.original {
  border-color: #d9d9d9;
  background: #f5f5f5;
}

.time-item.optimized {
  border-color: #d9d9d9;
  background: #f5f5f5;
}

.time-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.time-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 4px;
}

.time-item.original .time-value {
  color: #333;
}

.time-item.optimized .time-value {
  color: #333;
}

.time-unit {
  font-size: 14px;
  color: #999;
}

.comparison-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #1890ff;
  background: #e6f7ff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin: 0 auto;
}

.improvement-indicator {
  text-align: center;
  padding: 16px;
  background: #f0f0f0;
  border-radius: 10px;
  border: 1px solid #d9d9d9;
}

.improvement-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 8px;
}

.improvement-badge i {
  transform: rotate(90deg);
  color: #52c41a;
}

.improvement-badge.positive {
  color: #52c41a;
}

.improvement-badge.positive i {
  transform: rotate(-90deg);
  color: #52c41a;
}

.improvement-percentage {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.optimization-stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.optimization-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background: #e8e8e8;
  border-radius: 4px;
  border: 1px solid #cccccc;
}

.optimization-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.optimization-value {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .date-range-header {
    font-size: 12px;
    padding: 4px 8px;
  }
  
  .time-comparison {
    padding: 16px;
  }
  
  .comparison-header {
    margin-bottom: 16px;
  }
  
  .comparison-row {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto auto;
    gap: 16px;
    text-align: center;
  }
  
  .comparison-label {
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 8px;
  }
  
  .comparison-arrow {
    transform: rotate(90deg);
  }
  
  .time-value {
    font-size: 24px;
  }
  
  .time-item {
    padding: 16px;
  }
  
  .optimization-item {
    padding: 3px 6px;
  }
  
  .optimization-label {
    font-size: 11px;
  }
  
  .optimization-value {
    font-size: 12px;
  }
}

/* 详细记录展开列表样式 */
.detailed-records-section {
  margin-top: 24px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.detailed-header {
  padding: 20px 24px;
  background: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s ease;
}

.detailed-header:hover {
  background: #ebebeb;
}

.detailed-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
}

.detailed-title i {
  color: #1890ff;
  font-size: 20px;
}

.record-count {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  margin-left: 8px;
}

.expand-icon {
  font-size: 16px;
  color: #1890ff;
  transition: transform 0.3s ease;
}

.detailed-content {
  max-height: 600px;
  overflow-y: auto;
}

.records-list {
  padding: 0;
}

.record-item {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s ease;
}

.record-item:hover {
  background: #f0f0f0;
}

.record-item:last-child {
  border-bottom: none;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.train-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.train-id {
  font-weight: 600;
  color: #2c3e50;
  font-size: 16px;
}

.carriage {
  background: #e8e8e8;
  color: #666;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.system {
  background: #e8e8e8;
  color: #666;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.date-info {
  color: #666;
  font-size: 14px;
}

.changes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.change-item {
  background: #f9f9f9;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 14px;
}

.change-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.change-label i {
  color: #1890ff;
}

.change-comparison {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.no-change-display {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.current-value {
  background: #f0f0f0;
  color: #666;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #cccccc;
}

.old-value {
  background: #f0f0f0;
  color: #666;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #cccccc;
}

.new-value {
  background: #f0f0f0;
  color: #666;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #cccccc;
}

.arrow {
  color: #1890ff;
  font-size: 12px;
}

.fault-description {
  background: #f5f5f5;
  border-left: 3px solid #d9d9d9;
  padding: 12px 16px;
  color: #666;
  font-size: 14px;
  border-radius: 0 4px 4px 0;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.fault-description i {
  color: #999;
  margin-top: 2px;
  flex-shrink: 0;
}

.no-records {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.no-records i {
  font-size: 48px;
  color: #ddd;
  margin-bottom: 16px;
  display: block;
}

.no-records p {
  margin: 0;
  font-size: 16px;
}

/* 响应式设计 - 详细记录 */
@media (max-width: 768px) {
  .detailed-header {
    padding: 16px 20px;
  }
  
  .detailed-title {
    font-size: 16px;
  }
  
  .record-count {
    font-size: 13px;
  }
  
  .record-item {
    padding: 16px 20px;
  }
  
  .record-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .train-info {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .train-id {
    font-size: 15px;
  }
  
  .changes-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .change-item {
    padding: 12px;
  }
  
  .change-comparison {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  
  .no-change-display {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  
  .fault-description {
    padding: 10px 12px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .detailed-header {
    padding: 12px 16px;
  }
  
  .detailed-title {
    font-size: 15px;
  }
  
  .record-item {
    padding: 12px 16px;
  }
  
  .train-id {
    font-size: 14px;
  }
  
  .carriage, .system {
    font-size: 11px;
    padding: 1px 6px;
  }
  
  .change-label {
    font-size: 13px;
  }
  
  .old-value, .new-value {
    font-size: 12px;
    padding: 3px 6px;
  }
  
  .current-value {
    font-size: 12px;
    padding: 3px 6px;
  }
}
</style>
