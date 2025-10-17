<template>
  <div class="purchase-refactor3-container">
    <!-- 顶部标题 -->
    <div class="header">
      <el-page-header @back="goBack" content="采购优化结果展示" />
    </div>

    <!-- 页面内容区域 -->
    <div class="content-section">
      <!-- 采购优化操作卡片 -->
      <el-card class="optimization-action-card" v-if="!showOptimizationResults" shadow="hover">
        <div class="optimization-action-content">
          <!-- 标题区域 -->
          <div class="action-header">
            <div class="header-icon-wrapper">
              <div class="header-icon">
                <i class="el-icon-cpu"></i>
              </div>
            </div>
            <h2 class="action-title">智能采购优化分析</h2>
            <p class="action-subtitle">基于供应商稳定性和价格对比的智能决策支持系统</p>
          </div>

          <!-- 分隔线 -->
          <el-divider></el-divider>

          <!-- 功能特性区域 -->
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon supplier-icon">
                <i class="el-icon-connection"></i>
              </div>
              <div class="feature-content">
                <h4>供应商切换建议</h4>
                <p>智能推荐最优供应商</p>
              </div>
            </div>

            <div class="feature-card">
              <div class="feature-icon cost-icon">
                <i class="el-icon-coin"></i>
              </div>
              <div class="feature-content">
                <h4>成本节省分析</h4>
                <p>精确计算优化收益</p>
              </div>
            </div>

            <div class="feature-card">
              <div class="feature-icon stats-icon">
                <i class="el-icon-data-line"></i>
              </div>
              <div class="feature-content">
                <h4>优化效果统计</h4>
                <p>全面展示优化成果</p>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="action-button-wrapper">
            <el-button 
              type="primary" 
              size="large"
              @click="startOptimization"
              :loading="optimizationLoading"
              icon="el-icon-video-play"
              class="start-button"
            >
              {{ optimizationLoading ? '正在分析优化方案...' : '开始优化分析' }}
            </el-button>
            <p class="button-hint" v-if="!optimizationLoading">
              <i class="el-icon-info"></i> 点击按钮启动智能分析引擎
            </p>
          </div>
        </div>
      </el-card>

      <!-- 优化结果汇总卡片 -->
      <el-card class="summary-card" v-if="optimizationSummary && showOptimizationResults">
        <template #header>
          <div class="card-header">
            <i class="el-icon-data-analysis"></i>
            <span>采购优化效果汇总</span>
            <div class="header-actions">
              <el-tag type="success" size="small">
                节省成本: ¥{{ formatNumber(optimizationSummary.totalSavings) }}
              </el-tag>
              <el-tag type="info" size="small">
                优化覆盖率: {{ optimizationSummary.optimizationRate }}%
              </el-tag>
            </div>
          </div>
        </template>

        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-value">{{ optimizationSummary.totalItems }}</div>
            <div class="summary-label">总物料数</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">¥{{ formatNumber(optimizationSummary.totalAmount) }}</div>
            <div class="summary-label">总金额</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">¥{{ formatNumber(optimizationSummary.totalSavings) }}</div>
            <div class="summary-label">节省成本</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">{{ optimizationSummary.supplierChangedCount }}</div>
            <div class="summary-label">供应商切换</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">{{ optimizationSummary.orderCount }}</div>
            <div class="summary-label">采购订单</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">{{ optimizationSummary.supplierCount }}</div>
            <div class="summary-label">涉及供应商</div>
          </div>
        </div>
      </el-card>

      <!-- 优化结果详细数据 -->
      <el-card class="data-card" v-if="showOptimizationResults">
        <template #header>
          <div class="card-header">
            <i class="el-icon-s-order"></i>
            <span>供应商切换优化详情</span>
            <div class="header-actions">
              <el-button 
                type="primary" 
                size="small" 
                @click="loadOptimizationData"
                :loading="loading"
                icon="el-icon-refresh"
              >
                刷新数据
              </el-button>
            </div>
          </div>
        </template>

        <!-- 数据表格 -->
        <el-table 
          :data="optimizationData" 
          stripe 
          style="width: 100%"
          v-loading="loading"
          empty-text="暂无优化数据"
          :default-sort="{prop: 'priceSavings', order: 'descending'}"
        >
          <el-table-column prop="poNo" label="采购订单" width="150" />
          
          <el-table-column prop="materialName" label="物料名称" min-width="150" show-overflow-tooltip />
          
          <el-table-column prop="specModel" label="规格型号" width="180" show-overflow-tooltip />
          
          <el-table-column label="供应商变更" width="200">
            <template #default="scope">
              <div class="supplier-change">
                <div class="supplier-old" v-if="scope.row.oldSupplierId">
                  <el-tag size="mini" type="warning">原: {{ scope.row.oldSupplierId }}</el-tag>
                </div>
                <div class="supplier-arrow" v-if="scope.row.supplierChanged">
                  <i class="el-icon-right"></i>
                </div>
                <div class="supplier-new">
                  <el-tag size="mini" :type="scope.row.supplierChanged ? 'success' : 'info'">
                    {{ scope.row.supplierChanged ? '新' : '现' }}: {{ scope.row.newSupplierName }}
                  </el-tag>
                </div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="价格对比" width="150">
            <template #default="scope">
              <div class="price-comparison">
                <div class="price-old" v-if="scope.row.oldUnitPrice">
                  <span class="price-label">原价:</span>
                  <span class="price-value">¥{{ scope.row.oldUnitPrice }}</span>
                </div>
                <div class="price-new">
                  <span class="price-label">现价:</span>
                  <span class="price-value">¥{{ scope.row.unitPrice }}</span>
                </div>
                <div class="price-change" v-if="scope.row.priceChangePercent > 0">
                  <el-tag size="mini" type="success">
                    -{{ scope.row.priceChangePercent }}%
                  </el-tag>
                </div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="qty" label="数量" width="100">
            <template #default="scope">
              {{ formatNumber(scope.row.qty) }} {{ scope.row.unit }}
            </template>
          </el-table-column>
          
          <el-table-column prop="priceSavings" label="节省金额" width="120" sortable>
            <template #default="scope">
              <span :class="['savings-amount', { 'positive': scope.row.priceSavings > 0 }]">
                ¥{{ formatNumber(scope.row.priceSavings) }}
              </span>
            </template>
          </el-table-column>
          
          <el-table-column prop="newBuyerName" label="采购员" width="100" />
          
          <el-table-column prop="remark" label="优化说明" min-width="200" show-overflow-tooltip />
        </el-table>
      </el-card>

      <!-- 按订单分组的优化统计 -->
      <el-card class="order-stats-card" v-if="optimizationSummary && optimizationSummary.orderGroups && showOptimizationResults">
        <template #header>
          <div class="card-header">
            <i class="el-icon-pie-chart"></i>
            <span>按订单优化统计</span>
          </div>
        </template>

        <div class="order-groups">
          <div 
            v-for="order in optimizationSummary.orderGroups" 
            :key="order.poNo"
            class="order-group-item"
          >
            <div class="order-header">
              <span class="order-no">{{ order.poNo }}</span>
              <div class="order-stats">
                <el-tag size="small" type="info">{{ order.items.length }} 项</el-tag>
                <el-tag size="small" type="success">节省 ¥{{ formatNumber(order.totalSavings) }}</el-tag>
              </div>
            </div>
            <div class="order-progress">
              <el-progress 
                :percentage="getOrderSavingsRate(order)" 
                :color="getProgressColor(getOrderSavingsRate(order))"
                :show-text="false"
              />
            </div>
          </div>
        </div>
      </el-card>

      <!-- 操作按钮区域 -->
      <div class="action-buttons" v-if="showOptimizationResults">
        <el-button 
          type="primary" 
          size="medium"
          @click="goToHome"
          icon="el-icon-house"
        >
          返回主页面
        </el-button>
        <el-button 
          size="medium"
          @click="goBack"
          icon="el-icon-back"
        >
          返回上一步
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import topic04Api from '@/api/topic04Api';

export default {
  name: 'PurchaseRefactor3',
  data() {
    return {
      nodeId: '',
      nodeTitle: '',
      nodeType: '',
      modelRunBatch: '',
      loading: false,
      optimizationLoading: false,
      showOptimizationResults: false,
      optimizationData: [],
      optimizationSummary: null
    };
  },
  created() {
    // 获取路由参数
    this.nodeId = this.$route.query.nodeId || '';
    this.nodeTitle = this.$route.query.nodeTitle || '';
    this.nodeType = this.$route.query.nodeType || '';
    this.modelRunBatch = this.$route.query.modelRunBatch || '2025-10-12_TSY_HSR_01';

    console.log('📋 采购优化结果展示页面参数:', {
      nodeId: this.nodeId,
      nodeTitle: this.nodeTitle,
      nodeType: this.nodeType,
      modelRunBatch: this.modelRunBatch
    });

    // 不再自动加载优化数据，等待用户点击按钮
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },

    /**
     * 返回主页面
     */
    goToHome() {
      console.log('🏠 返回主页面');
      this.$router.push({
        name: 'Dashbord',
        path: '/home'
      });
    },

    /**
     * 开始采购优化分析
     */
    async startOptimization() {
      try {
        this.optimizationLoading = true;
        console.log('🚀 开始采购优化分析');

        // 显示开始分析的消息
        this.$message({
          message: '正在启动智能采购优化分析...',
          type: 'info',
          duration: 1000
        });

        // 模拟1秒加载时间
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 加载优化数据
        await this.loadOptimizationData();

        // 显示优化结果
        this.showOptimizationResults = true;

        console.log('✅ 采购优化分析完成');
        this.$message({
          message: '采购优化分析完成！为您找到了最佳的供应商优化方案',
          type: 'success',
          duration: 3000
        });

      } catch (error) {
        console.error('❌ 采购优化分析失败:', error);
        this.$message({
          message: '采购优化分析失败，请重试',
          type: 'error',
          duration: 3000
        });
      } finally {
        this.optimizationLoading = false;
      }
    },

    /**
     * 加载采购优化结果数据
     */
    async loadOptimizationData() {
      try {
        this.loading = true;
        console.log('🔍 开始加载采购优化结果数据, 批次:', this.modelRunBatch);

        const response = await topic04Api.getPurchaseOptimizationResults(this.modelRunBatch);

        if (response.success) {
          this.optimizationData = response.data.records || [];
          this.optimizationSummary = response.data.summary || null;

          console.log('✅ 采购优化结果数据加载成功:', {
            total: this.optimizationData.length,
            totalSavings: this.optimizationSummary && this.optimizationSummary.totalSavings || 0,
            optimizationRate: this.optimizationSummary && this.optimizationSummary.optimizationRate || 0
          });

          this.$message({
            message: `成功加载 ${this.optimizationData.length} 条采购优化结果`,
            type: 'success',
            duration: 2000
          });
        } else {
          console.error('❌ 采购优化结果数据加载失败:', response.error);
          this.$message({
            message: response.error || '加载采购优化结果失败',
            type: 'error',
            duration: 3000
          });
        }
      } catch (error) {
        console.error('❌ 加载采购优化结果数据异常:', error);
        this.$message({
          message: '加载数据时发生异常',
          type: 'error',
          duration: 3000
        });
      } finally {
        this.loading = false;
      }
    },

    /**
     * 格式化数字显示
     */
    formatNumber(value) {
      if (value === null || value === undefined) return '0';
      return Number(value).toLocaleString('zh-CN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    },

    /**
     * 计算订单节省率
     */
    getOrderSavingsRate(order) {
      if (!order.totalAmount || order.totalAmount === 0) return 0;
      return Math.round((order.totalSavings / order.totalAmount) * 100);
    },

    /**
     * 根据节省率获取进度条颜色
     */
    getProgressColor(percentage) {
      if (percentage >= 10) return '#67c23a'; // 绿色
      if (percentage >= 5) return '#e6a23c';  // 橙色
      if (percentage > 0) return '#409eff';   // 蓝色
      return '#f56c6c'; // 红色
    }
  }
};
</script>

<style scoped>
.purchase-refactor3-container {
  padding: 20px;
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  margin-bottom: 20px;
}

.content-section {
  max-width: 1400px;
  margin: 0 auto;
}

/* 卡片通用样式 */
.optimization-action-card,
.summary-card,
.data-card,
.order-stats-card {
  margin-bottom: 20px;
}

.card-header {
  font-weight: 600;
  color: #409eff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.card-header i {
  font-size: 18px;
  margin-right: 8px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 汇总统计样式 */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.summary-item {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.summary-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 5px;
}

.summary-label {
  font-size: 14px;
  color: #666;
}

/* 供应商变更样式 */
.supplier-change {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.supplier-arrow {
  color: #67c23a;
  font-weight: bold;
}

/* 价格对比样式 */
.price-comparison {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.price-old,
.price-new {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
}

.price-label {
  color: #909399;
  min-width: 30px;
}

.price-value {
  font-weight: 500;
}

.price-old .price-value {
  color: #f56c6c;
  text-decoration: line-through;
}

.price-new .price-value {
  color: #67c23a;
}

.price-change {
  margin-top: 2px;
}

/* 节省金额样式 */
.savings-amount {
  font-weight: bold;
  color: #909399;
}

.savings-amount.positive {
  color: #67c23a;
}

/* 订单统计样式 */
.order-groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.order-group-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.order-no {
  font-weight: 600;
  color: #409eff;
}

.order-stats {
  display: flex;
  gap: 8px;
}

.order-progress {
  margin-top: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .purchase-refactor3-container {
    padding: 10px;
  }
  
  .content-section {
    max-width: 100%;
  }
  
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .order-groups {
    grid-template-columns: 1fr;
  }
  
  .supplier-change {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .price-comparison {
    font-size: 11px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .action-buttons .el-button {
    width: 100%;
  }
  
  /* 优化操作卡片移动端样式 */
  .optimization-action-content {
    padding: 30px 20px;
  }
  
  .header-icon {
    width: 80px;
    height: 80px;
    font-size: 36px;
  }
  
  .action-title {
    font-size: 22px;
  }
  
  .action-subtitle {
    font-size: 14px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .feature-card {
    padding: 20px 15px;
  }
  
  .feature-icon {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }
  
  .start-button {
    min-width: 100%;
    font-size: 16px;
    height: 50px;
  }
  
  .button-hint {
    font-size: 12px;
  }
}

/* 优化操作卡片样式 */
.optimization-action-card {
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
}

.optimization-action-content {
  padding: 40px 30px;
}

/* 标题区域样式 */
.action-header {
  text-align: center;
  margin-bottom: 30px;
}

.header-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.header-icon {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
  }
}

.action-title {
  margin: 0 0 10px 0;
  font-size: 28px;
  color: #303133;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.action-subtitle {
  margin: 0;
  font-size: 16px;
  color: #909399;
  line-height: 1.6;
}

/* 功能特性网格 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 30px 0;
}

.feature-card {
  background: white;
  padding: 25px 20px;
  border-radius: 12px;
  border: 2px solid #e4e7ed;
  text-align: center;
  transition: all 0.3s ease;
  cursor: default;
}

.feature-card:hover {
  border-color: #409eff;
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.15);
}

.feature-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 15px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.supplier-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.cost-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stats-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.feature-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #303133;
  font-weight: 600;
}

.feature-content p {
  margin: 0;
  font-size: 13px;
  color: #909399;
  line-height: 1.5;
}

/* 操作按钮区域 */
.action-button-wrapper {
  text-align: center;
  margin-top: 40px;
}

.start-button {
  min-width: 240px;
  height: 56px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.start-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
}

.start-button:active {
  transform: translateY(-1px);
}

.button-hint {
  margin: 15px 0 0 0;
  font-size: 13px;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.button-hint i {
  font-size: 14px;
  color: #409eff;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  padding: 20px 0;
}

.action-buttons .el-button {
  min-width: 140px;
  height: 40px;
  font-size: 14px;
  font-weight: 500;
}
</style>
