<template>
  <div class="purchase-refactor3-container">
    <!-- 顶部标题 -->
    <div class="header">
      <el-page-header @back="goBack" content="采购优化结果展示" />
    </div>

    <!-- 页面内容区域 -->
    <div class="content-section">
      <!-- 优化结果汇总卡片 -->
      <el-card class="summary-card" v-if="optimizationSummary">
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
      <el-card class="data-card">
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
      <el-card class="order-stats-card" v-if="optimizationSummary && optimizationSummary.orderGroups">
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

    // 自动加载优化数据
    this.loadOptimizationData();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
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
}
</style>
