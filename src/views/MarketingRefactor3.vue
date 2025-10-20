<template>
  <div class="marketing-refactor3-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-page-header @back="goBack" content="营销重构 - 第三阶段">
        <template slot="content">
          <span class="page-title">营销重构 - 第三阶段</span>
        </template>
      </el-page-header>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 数据加载状态区域 -->
      <div class="data-loading-section">
        <!-- 客户线索数据加载状态 -->
        <el-card class="loading-card">
          <div slot="header" class="card-header">
            <span class="header-title">
              <i class="el-icon-s-data"></i>
              客户线索数据
            </span>
            <el-tag 
              :type="customerDataStatus === 'loading' ? 'info' : customerDataStatus === 'success' ? 'success' : 'danger'" 
              size="small">
              {{ getStatusText('customer') }}
            </el-tag>
          </div>
          
          <div class="loading-content">
            <div class="loading-info">
              <div class="data-icon">
                <i v-if="customerDataStatus === 'loading'" class="el-icon-loading"></i>
                <i v-else-if="customerDataStatus === 'success'" class="el-icon-success"></i>
                <i v-else class="el-icon-error"></i>
              </div>
              <div class="data-details">
                <p class="data-description">
                  {{ customerDataStatus === 'loading' ? '正在加载客户优化指标数据...' : 
                     customerDataStatus === 'success' ? '客户数据加载完成' : '数据加载失败' }}
                </p>
                <div v-if="customerDataStatus === 'success'" class="data-summary">
                  <span>数据条数：{{ customerDataCount }}个</span>
                  <span class="separator">|</span>
                  <span>耗时：{{ customerLoadTime }}ms</span>
                </div>
              </div>
            </div>
            
            <!-- 加载进度条 -->
            <div v-if="customerDataStatus === 'loading'" class="progress-section">
              <el-progress 
                :percentage="customerProgress" 
                :show-text="false"
                :stroke-width="6"
                color="#409EFF">
              </el-progress>
            </div>
          </div>
        </el-card>

        <!-- 人员匹配度数据加载状态 -->
        <el-card class="loading-card">
          <div slot="header" class="card-header">
            <span class="header-title">
              <i class="el-icon-user"></i>
              人员匹配度数据
            </span>
            <el-tag 
              :type="staffDataStatus === 'loading' ? 'info' : staffDataStatus === 'success' ? 'success' : 'danger'" 
              size="small">
              {{ getStatusText('staff') }}
            </el-tag>
          </div>
          
          <div class="loading-content">
            <div class="loading-info">
              <div class="data-icon">
                <i v-if="staffDataStatus === 'loading'" class="el-icon-loading"></i>
                <i v-else-if="staffDataStatus === 'success'" class="el-icon-success"></i>
                <i v-else class="el-icon-error"></i>
              </div>
              <div class="data-details">
                <p class="data-description">
                  {{ staffDataStatus === 'loading' ? '正在加载销售人员匹配度数据...' : 
                     staffDataStatus === 'success' ? '人员数据加载完成' : '数据加载失败' }}
                </p>
                <div v-if="staffDataStatus === 'success'" class="data-summary">
                  <span>人员数量：{{ staffDataCount }}人</span>
                  <span class="separator">|</span>
                  <span>耗时：{{ staffLoadTime }}ms</span>
                </div>
              </div>
            </div>
            
            <!-- 加载进度条 -->
            <div v-if="staffDataStatus === 'loading'" class="progress-section">
              <el-progress 
                :percentage="staffProgress" 
                :show-text="false"
                :stroke-width="6"
                color="#409EFF">
              </el-progress>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 数据加载完成后的操作区域 -->
      <div v-if="allDataLoaded" class="next-actions-section">
        <el-card class="actions-card">
          <div class="actions-content">
            <div class="actions-info">
              <h4>
                <i class="el-icon-finished"></i>
                数据加载完成
              </h4>
              <p>客户线索数据和人员匹配度数据已成功加载，可以进行下一步操作</p>
            </div>
            <div class="actions-buttons">
              <!-- 暂时不需要按钮 -->
            </div>
          </div>
        </el-card>
      </div>

      <!-- 流程重构操作区域 -->
      <div v-if="allDataLoaded && !refactorCompleted" class="refactor-action-section">
        <el-card class="refactor-card">
          <div class="refactor-content">
            <div class="refactor-info">
              <h4>
                <i class="el-icon-setting"></i>
                流程优化与重构
              </h4>
              <p>基于已加载的数据进行流程分析和优化重构</p>
            </div>
            <div class="refactor-actions">
              <el-button 
                type="primary" 
                size="medium"
                @click="startProcessRefactor"
                :loading="refactorLoading">
                <i class="el-icon-s-operation"></i>
                {{ refactorLoading ? '处理中...' : '进行流程重构' }}
              </el-button>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 流程重构结果展示区域 -->
      <div v-if="refactorCompleted && refactorStats" class="refactor-results-section">
        <!-- 重构统计总览 -->
        <el-card class="results-overview-card">
          <div slot="header" class="results-header">
            <span>
              <i class="el-icon-data-analysis"></i>
              重构分析结果
            </span>
            <el-tag type="success" size="small">分析完成</el-tag>
          </div>
          
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-icon total">
                <i class="el-icon-s-data"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ refactorStats.totalComparisons }}</div>
                <div class="stat-label">总客户数</div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon changed">
                <i class="el-icon-refresh"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ refactorStats.assignmentChanges }}</div>
                <div class="stat-label">分配变更</div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon improved">
                <i class="el-icon-trend-charts"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ refactorStats.matchScoreImprovements }}</div>
                <div class="stat-label">匹配度提升</div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon conversion">
                <i class="el-icon-pie-chart"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ refactorStats.conversionImprovements }}</div>
                <div class="stat-label">转化率提升</div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon cost">
                <i class="el-icon-coin"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ refactorStats.costReductions }}</div>
                <div class="stat-label">成本节约</div>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 优化效果详情 -->
        <el-card class="effects-detail-card">
          <div slot="header">
            <span>
              <i class="el-icon-s-marketing"></i>
              优化效果详情
            </span>
          </div>
          
          <div class="effects-grid">
            <div class="effect-item">
              <div class="effect-title">优化覆盖率</div>
              <div class="effect-progress">
                <el-progress 
                  :percentage="((refactorStats.assignmentChanges / refactorStats.totalComparisons) * 100)" 
                  :show-text="false"
                  :stroke-width="8"
                  color="#1890ff">
                </el-progress>
                <span class="effect-value">
                  {{ ((refactorStats.assignmentChanges / refactorStats.totalComparisons) * 100).toFixed(1) }}%
                </span>
              </div>
            </div>
            
            <div class="effect-item">
              <div class="effect-title">总匹配度提升</div>
              <div class="effect-progress">
                <el-progress 
                  :percentage="Math.min(parseFloat(refactorStats.totalMatchScoreImprovement) * 100, 100)" 
                  :show-text="false"
                  :stroke-width="8"
                  color="#52c41a">
                </el-progress>
                <span class="effect-value">
                  +{{ refactorStats.totalMatchScoreImprovement.toFixed(3) }}
                </span>
              </div>
            </div>
            
            <div class="effect-item">
              <div class="effect-title">平均转化率提升率</div>
              <div class="effect-progress">
                <el-progress 
                  :percentage="Math.min(parseFloat(refactorStats.averageConversionImprovement) * 100, 100)" 
                  :show-text="false"
                  :stroke-width="8"
                  color="#faad14">
                </el-progress>
                <span class="effect-value">
                  +{{ (refactorStats.averageConversionImprovement * 100).toFixed(1) }}%
                </span>
              </div>
            </div>
          </div>
          
          <div class="summary-metrics">
            <div class="metric-item">
              <span class="metric-label">平均匹配度提升:</span>
              <span class="metric-value positive">{{ refactorStats.averageMatchScoreImprovement }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">平均转化率提升:</span>
              <span class="metric-value positive">{{ (refactorStats.averageConversionImprovement * 100).toFixed(1) }}%</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">总成本节约:</span>
              <span class="metric-value positive">{{ refactorStats.totalCostReduction.toFixed(2) }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">客户ID范围:</span>
              <span class="metric-value">{{ refactorStats.idRange.startId }} - {{ refactorStats.idRange.endId }}</span>
            </div>
          </div>
        </el-card>

        <!-- 客户分配对比列表 -->
        <el-card class="comparison-list-card">
          <div slot="header">
            <span>
              <i class="el-icon-s-order"></i>
              客户分配对比详情
            </span>
            <span class="list-count">共 {{ comparisonData.length }} 个客户</span>
          </div>
          
          <el-table 
            :data="paginatedComparisonData" 
            stripe
            size="medium"
            style="width: 100%"
            :row-class-name="tableRowClassName">
            
            <el-table-column label="客户信息" min-width="200">
              <template slot-scope="scope">
                <div class="table-customer-info">
                  <div class="table-customer-name">{{ scope.row.customerName }}</div>
                  <div class="table-customer-id">ID: {{ scope.row.customerId }}</div>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="原负责人" width="100" align="center">
              <template slot-scope="scope">
                <span class="owner-badge original">{{ scope.row.originalAssignment.ownerName }}</span>
              </template>
            </el-table-column>
            
            <el-table-column label="新负责人" width="100" align="center">
              <template slot-scope="scope">
                <span class="owner-badge" :class="scope.row.assignmentChanged ? 'optimized' : 'original'">
                  {{ scope.row.optimizedAssignment.ownerName }}
                </span>
              </template>
            </el-table-column>
            
            <el-table-column label="匹配度变化" width="140" align="center">
              <template slot-scope="scope">
                <div class="metric-change">
                  <div class="metric-values">
                    <span class="old-value">{{ (scope.row.originalAssignment.salesCustomerMatch * 100).toFixed(1) }}%</span>
                    <i class="el-icon-right arrow-icon"></i>
                    <span class="new-value" :class="{ 'improved': scope.row.improvements.hasMatchImprovement }">
                      {{ (scope.row.optimizedAssignment.salesCustomerMatch * 100).toFixed(1) }}%
                    </span>
                  </div>
                  <div v-if="scope.row.comparison.matchScoreChange > 0" class="change-indicator positive">
                    <i class="el-icon-top"></i>
                    +{{ (scope.row.comparison.matchScoreChange * 100).toFixed(2) }}%
                  </div>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="转化率变化" width="140" align="center">
              <template slot-scope="scope">
                <div class="metric-change">
                  <div class="metric-values">
                    <span class="old-value">{{ (scope.row.originalAssignment.conversionProb * 100).toFixed(1) }}%</span>
                    <i class="el-icon-right arrow-icon"></i>
                    <span class="new-value" :class="{ 'improved': scope.row.improvements.hasConversionImprovement }">
                      {{ (scope.row.optimizedAssignment.conversionProb * 100).toFixed(1) }}%
                    </span>
                  </div>
                  <div v-if="scope.row.comparison.conversionChange > 0" class="change-indicator positive">
                    <i class="el-icon-top"></i>
                    +{{ (scope.row.comparison.conversionChange * 100).toFixed(1) }}%
                  </div>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="成本变化" width="120" align="center">
              <template slot-scope="scope">
                <div class="metric-change">
                  <div class="metric-values">
                    <span class="old-value">{{ scope.row.originalAssignment.assignmentCost.toFixed(2) }}</span>
                    <i class="el-icon-right arrow-icon"></i>
                    <span class="new-value" :class="{ 'improved': scope.row.improvements.hasCostReduction }">
                      {{ scope.row.optimizedAssignment.assignmentCost.toFixed(2) }}
                    </span>
                  </div>
                  <div v-if="scope.row.comparison.costChange > 0" class="change-indicator positive">
                    <i class="el-icon-bottom"></i>
                    -{{ scope.row.comparison.costChange.toFixed(2) }}
                  </div>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="状态" width="90" align="center">
              <template slot-scope="scope">
                <el-tag 
                  :type="scope.row.assignmentChanged ? 'success' : 'info'"
                  size="small">
                  {{ scope.row.assignmentChanged ? '已优化' : '保持' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页组件 -->
          <div v-if="comparisonData.length > pageSize" class="table-pagination">
            <el-pagination
              @current-change="handlePageChange"
              @size-change="handleSizeChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="pageSize"
              :total="comparisonData.length"
              layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </div>
        </el-card>
      </div>

      <!-- 返回主页面按钮 -->
      <div v-if="refactorCompleted" class="back-home-section">
        <el-card class="back-home-card">
          <div class="back-home-content">
            <div class="back-home-info">
              <h4>
                <i class="el-icon-house"></i>
                重构分析完成
              </h4>
              <p>营销流程重构分析已完成，可以返回主页面查看其他功能</p>
            </div>
            <div class="back-home-actions">
              <el-button 
                type="primary" 
                size="medium"
                @click="goToHomePage">
                <i class="el-icon-house"></i>
                返回主页面
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import marketingRefactorApi from '@/api/marketingRefactorApi'

export default {
  name: 'MarketingRefactor3',
  
  data() {
    return {
      // 客户数据状态
      customerDataStatus: 'loading',  // loading, success, error
      customerProgress: 0,
      customerDataCount: 0,
      customerLoadTime: 0,
      
      // 人员数据状态  
      staffDataStatus: 'loading',     // loading, success, error
      staffProgress: 0,
      staffDataCount: 0,
      staffLoadTime: 0,
      
      // 路由参数
      routeParams: {},
      
      // 流程重构状态
      refactorLoading: false,
      refactorCompleted: false,
      refactorResults: null,
      
      // 重构统计数据
      refactorStats: null,
      comparisonData: [],
      
      // 分页相关
      currentPage: 1,
      pageSize: 10
    };
  },
  
  computed: {
    // 判断是否所有数据都加载完成
    allDataLoaded() {
      return this.customerDataStatus === 'success' && this.staffDataStatus === 'success';
    },
    
    // 分页后的对比数据
    paginatedComparisonData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.comparisonData.slice(start, end);
    }
  },
  
  mounted() {
    console.log('📄 MarketingRefactor3 页面已加载');
    
    // 获取路由参数
    this.routeParams = this.$route.query;
    console.log('📊 接收到的路由参数:', this.routeParams);
    
    // 开始模拟数据加载
    this.startDataLoading();
  },
  
  methods: {
    // 返回上一页
    goBack() {
      console.log('📤 从MarketingRefactor3页面返回上一页');
      this.$router.go(-1);
    },
    
    // 获取状态文本
    getStatusText(type) {
      const status = type === 'customer' ? this.customerDataStatus : this.staffDataStatus;
      
      switch (status) {
        case 'loading': return '加载中';
        case 'success': return '加载完成';  
        case 'error': return '加载失败';
        default: return '未知状态';
      }
    },
    
    // 开始模拟数据加载
    async startDataLoading() {
      console.log('🚀 开始模拟数据加载');
      
      // 同时启动两个数据加载任务
      const customerTask = this.loadCustomerData();
      const staffTask = this.loadStaffData();
      
      // 等待所有任务完成
      try {
        await Promise.all([customerTask, staffTask]);
        console.log('✅ 所有数据加载完成');
        this.$message.success('数据加载完成，可以进行下一步操作');
      } catch (error) {
        console.error('❌ 数据加载出错:', error);
        this.$message.error('数据加载失败');
      }
    },
    
    // 模拟加载客户数据
    async loadCustomerData() {
      console.log('📊 开始加载客户数据');
      const startTime = Date.now();
      
      // 重置状态
      this.customerDataStatus = 'loading';
      this.customerProgress = 0;
      
      // 模拟进度更新
      const progressInterval = setInterval(() => {
        if (this.customerProgress < 95) {
          this.customerProgress += Math.random() * 15;
        }
      }, 50);
      
      // 等待1秒
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 清除进度更新
      clearInterval(progressInterval);
      this.customerProgress = 100;
      
      // 完成加载
      setTimeout(() => {
        this.customerDataStatus = 'success';
        this.customerDataCount = parseInt(this.routeParams.customerAnalysisCount) || 200;
        this.customerLoadTime = Date.now() - startTime;
        
        console.log('✅ 客户数据加载完成:', {
          count: this.customerDataCount,
          loadTime: this.customerLoadTime
        });
      }, 200);
    },
    
    // 模拟加载人员数据
    async loadStaffData() {
      console.log('👥 开始加载人员数据');
      const startTime = Date.now();
      
      // 重置状态
      this.staffDataStatus = 'loading';
      this.staffProgress = 0;
      
      // 模拟进度更新
      const progressInterval = setInterval(() => {
        if (this.staffProgress < 95) {
          this.staffProgress += Math.random() * 12;
        }
      }, 60);
      
      // 等待1秒
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 清除进度更新
      clearInterval(progressInterval);
      this.staffProgress = 100;
      
      // 完成加载
      setTimeout(() => {
        this.staffDataStatus = 'success';
        this.staffDataCount = parseInt(this.routeParams.staffAnalysisCount) || 5;
        this.staffLoadTime = Date.now() - startTime;
        
        console.log('✅ 人员数据加载完成:', {
          count: this.staffDataCount,
          loadTime: this.staffLoadTime
        });
      }, 200);
    },
    
    // 开始流程重构
    async startProcessRefactor() {
      console.log('🔧 开始流程重构 - 调用销售分配对比API');
      
      this.refactorLoading = true;
      
      try {
        // 模拟加载延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 调用销售分配对比API
        const result = await marketingRefactorApi.getSalesAssignmentComparison({
          start_id: 1,
          end_id: 30
        });
        
        if (result.success) {
          console.log('✅ 流程重构数据获取成功:', result.data);
          
          // 保存重构结果到组件数据
          this.refactorResults = result.data;
          this.refactorStats = result.data.statistics;
          this.comparisonData = result.data.comparisonData || [];
          this.refactorCompleted = true;
          
          // 重置分页状态
          this.currentPage = 1;
          
          this.$message.success(`流程重构完成！成功优化了${this.refactorStats.assignmentChanges}个客户的分配方案`);
          
        } else {
          console.error('❌ 流程重构失败:', result.error);
          this.$message.error('流程重构失败：' + (result.error || '未知错误'));
        }
        
      } catch (error) {
        console.error('❌ 流程重构异常:', error);
        this.$message.error('流程重构异常：' + error.message);
      } finally {
        this.refactorLoading = false;
      }
    },
    
    // 表格行样式
    tableRowClassName({ row, rowIndex }) {
      return row.assignmentChanged ? 'row-changed' : '';
    },
    
    // 处理页码变化
    handlePageChange(page) {
      console.log('📄 切换页码:', page);
      this.currentPage = page;
    },
    
    // 处理每页条数变化
    handleSizeChange(size) {
      console.log('📏 切换每页条数:', size);
      this.pageSize = size;
      this.currentPage = 1; // 重置到第一页
    },
    
    // 返回主页面
    goToHomePage() {
      console.log('🏠 返回主页面');
      this.$router.push({
        name: 'Dashbord'
      });
      this.$message.success('正在跳转到主页面...');
    }
  }
};
</script>

<style scoped>
.marketing-refactor3-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.page-header {
  background: #fff;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.main-content {
  width: 100%;
}

/* 数据加载区域 */
.data-loading-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.loading-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #262626;
}

.header-title i {
  font-size: 18px;
  color: #1890ff;
}

.loading-content {
  padding: 16px 0;
}

.loading-info {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.data-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.data-icon i {
  font-size: 24px;
}

.data-icon .el-icon-loading {
  color: #1890ff;
  animation: rotating 1s linear infinite;
}

.data-icon .el-icon-success {
  color: #52c41a;
}

.data-icon .el-icon-error {
  color: #ff4d4f;
}

.data-details {
  flex: 1;
}

.data-description {
  font-size: 14px;
  color: #595959;
  margin: 0 0 8px 0;
  line-height: 1.6;
}

.data-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #8c8c8c;
}

.data-summary .separator {
  color: #d9d9d9;
}

.progress-section {
  margin-top: 8px;
}

/* 操作区域 */
.next-actions-section {
  margin-top: 24px;
}

.actions-card {
  border-radius: 8px;
  border: 2px solid #b7eb8f;
  background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
}

.actions-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.actions-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #389e0d;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.actions-info h4 i {
  color: #52c41a;
}

.actions-info p {
  font-size: 14px;
  color: #237804;
  margin: 0;
  line-height: 1.5;
}

.actions-buttons {
  display: flex;
  align-items: center;
}

/* 流程重构操作区域 */
.refactor-action-section {
  margin-top: 20px;
}

.refactor-card {
  border-radius: 8px;
  border: 2px solid #d9d9d9;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
}

.refactor-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.refactor-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #595959;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.refactor-info h4 i {
  color: #bfbfbf;
}

.refactor-info p {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
  line-height: 1.5;
}

.refactor-actions {
  display: flex;
  align-items: center;
}

/* 动画效果 */
@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .marketing-refactor3-container {
    padding: 12px;
  }
  
  .page-header {
    padding: 12px 16px;
  }
  
  .data-loading-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .loading-info {
    gap: 12px;
  }
  
  .data-icon {
    width: 40px;
    height: 40px;
  }
  
  .data-icon i {
    font-size: 20px;
  }
  
  .actions-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .actions-buttons .el-button {
    width: 180px;
  }
  
  .refactor-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .refactor-actions .el-button {
    width: 180px;
  }
}

@media (max-width: 576px) {
  .data-loading-section {
    gap: 12px;
  }
  
  .loading-content {
    padding: 12px 0;
  }
}

/* ==================== 流程重构结果展示样式 ==================== */

/* 重构结果区域 */
.refactor-results-section {
  margin-top: 20px;
}

/* 统计总览卡片 */
.results-overview-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #262626;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  padding: 16px 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  flex-shrink: 0;
}

.stat-icon.total {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
}

.stat-icon.changed {
  background: linear-gradient(135deg, #faad14 0%, #ffc53d 100%);
}

.stat-icon.improved {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}

.stat-icon.conversion {
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
}

.stat-icon.cost {
  background: linear-gradient(135deg, #eb2f96 0%, #f759ab 100%);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  margin-bottom: 4px;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
}

/* 效果详情卡片 */
.effects-detail-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.effects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.effect-item {
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  background: #fafafa;
}

.effect-title {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 12px;
}

.effect-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.effect-progress .el-progress {
  flex: 1;
}

.effect-value {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  min-width: 60px;
  text-align: right;
}

/* 汇总指标 */
.summary-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.metric-label {
  color: #595959;
  font-weight: 500;
}

.metric-value {
  font-weight: 600;
  color: #262626;
}

.metric-value.positive {
  color: #52c41a;
}

/* 对比列表卡片 */
.comparison-list-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.comparison-list-card .el-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-count {
  font-size: 12px;
  color: #8c8c8c;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
}

/* 表格行样式 */
::v-deep .row-changed {
  background: #fff7e6 !important;
}

::v-deep .row-changed:hover > td {
  background: #ffe7ba !important;
}

/* 客户信息列 */
.table-customer-info {
  padding: 4px 0;
}

.table-customer-name {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 4px;
}

.table-customer-id {
  font-size: 12px;
  color: #8c8c8c;
}

/* 负责人徽章 */
.owner-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.owner-badge.original {
  background: #f5f5f5;
  color: #595959;
  border: 1px solid #d9d9d9;
}

.owner-badge.optimized {
  background: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

/* 指标变化 */
.metric-change {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.metric-values {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.old-value {
  color: #8c8c8c;
}

.new-value {
  color: #262626;
  font-weight: 600;
}

.new-value.improved {
  color: #52c41a;
}

.arrow-icon {
  color: #bfbfbf;
  font-size: 12px;
}

.change-indicator {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 3px;
}

.change-indicator.positive {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

/* 表格分页 */
.table-pagination {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  border-top: 1px solid #f0f0f0;
  margin-top: 16px;
}

::v-deep .table-pagination .el-pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}

::v-deep .table-pagination .el-pagination__total {
  font-size: 13px;
  color: #595959;
}

/* 返回主页面区域 */
.back-home-section {
  margin-top: 20px;
}

.back-home-card {
  border-radius: 8px;
  border: 2px solid #1890ff;
  background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
}

.back-home-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.back-home-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-home-info h4 i {
  color: #40a9ff;
}

.back-home-info p {
  font-size: 14px;
  color: #096dd9;
  margin: 0;
  line-height: 1.5;
}

.back-home-actions {
  display: flex;
  align-items: center;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }
  
  .stat-item {
    padding: 12px;
    gap: 8px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  
  .stat-value {
    font-size: 24px;
  }
  
  .effects-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .summary-metrics {
    grid-template-columns: 1fr;
  }
  
  .back-home-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .back-home-actions .el-button {
    width: 180px;
  }
}

@media (max-width: 576px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
