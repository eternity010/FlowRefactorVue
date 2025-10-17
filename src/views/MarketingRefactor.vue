<template>
  <div class="marketing-refactor-container">
    <!-- 页面头部 -->
    <div class="header">
      <el-page-header @back="goBack" :content="pageTitle" />
    </div>
    
    <!-- 页面内容 -->
    <div class="content">
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <span>营销环节重构</span>
            <el-tag type="primary" size="medium">{{ nodeType === 'marketing' ? '营销环节' : nodeType }}</el-tag>
          </div>
        </template>
        
        <div class="node-info">
          <div class="node-summary">
            <div class="node-title">{{ nodeTitle || nodeId }}</div>
            <div class="node-meta">
              <el-tag size="small" type="primary">{{ getNodeTypeName() }}</el-tag>
              <el-tag size="small" type="warning">准备中</el-tag>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 筛选控制区域 -->
    <div class="filter-section">
      <el-card class="filter-card">
        <template #header>
          <div class="filter-header">
            <span>数据筛选</span>
          </div>
        </template>
        
        <div class="filter-controls">
          <div class="filter-item">
            <label class="filter-label">模型批次：</label>
            <el-select 
              v-model="selectedBatch" 
              @change="onBatchChange"
              placeholder="请选择模型批次"
              size="medium"
              style="width: 200px">
              <el-option
                v-for="batch in batchOptions"
                :key="batch.value"
                :label="batch.label"
                :value="batch.value">
                <span style="float: left">{{ batch.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ batch.description }}</span>
              </el-option>
            </el-select>
          </div>
          
          <div class="filter-item">
            <label class="filter-label">显示数量：</label>
            <el-select 
              v-model="pageSize" 
              @change="onPageSizeChange"
              size="medium"
              style="width: 100px">
              <el-option label="10" :value="10"></el-option>
              <el-option label="20" :value="20"></el-option>
              <el-option label="50" :value="50"></el-option>
              <el-option label="100" :value="100"></el-option>
            </el-select>
          </div>
          
          <div class="filter-actions">
            <el-button 
              @click="loadCustomerList" 
              type="primary" 
              size="medium"
              :loading="loading">
              <i class="el-icon-search"></i>
              查询客户列表
            </el-button>
            <el-button 
              @click="resetFilters" 
              size="medium">
              <i class="el-icon-refresh-left"></i>
              重置
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 客户线索展示区域 -->
    <div class="customer-leads-section">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-loading :text="loadingText" />
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="error-container">
        <el-alert
          :title="error"
          type="error"
          :closable="false"
          show-icon>
          <template slot="default">
            <p>获取客户列表数据失败，请稍后重试。</p>
            <el-button @click="loadCustomerList" type="primary" size="small">重新加载</el-button>
          </template>
        </el-alert>
      </div>
      
      <!-- 客户列表数据展示 -->
      <div v-else-if="customersData" class="customers-display">
        <!-- 统计信息 -->
        <el-card class="stats-card">
          <div class="stats-info">
            <div class="stats-item">
              <div class="stats-number">{{ customersData.pagination.total }}</div>
              <div class="stats-label">客户总数</div>
            </div>
            <div class="stats-item">
              <div class="stats-number">{{ getCustomerTypeStats('战略客户') }}</div>
              <div class="stats-label">战略客户</div>
            </div>
            <div class="stats-item">
              <div class="stats-number">{{ getCustomerTypeStats('重点客户') }}</div>
              <div class="stats-label">重点客户</div>
            </div>
            <div class="stats-item">
              <div class="stats-number">{{ getCustomerTypeStats('一般客户') }}</div>
              <div class="stats-label">一般客户</div>
            </div>
            <div class="stats-item">
              <div class="stats-number">{{ getCustomerTypeStats('潜在客户') }}</div>
              <div class="stats-label">潜在客户</div>
            </div>
          </div>
        </el-card>

        <!-- 客户列表 -->
        <el-card class="customers-card">
          <template #header>
            <div class="customers-header">
              <h4>
                <i class="el-icon-user"></i>
                客户列表（批次：{{ selectedBatch }}）
              </h4>
            </div>
          </template>
          
          <!-- 客户卡片列表 -->
          <div v-if="customersData.customers && customersData.customers.length > 0" class="customers-list">
            <div 
              v-for="customer in customersData.customers" 
              :key="customer.id" 
              class="customer-item-card"
              @click="viewCustomerDetails(customer)">
              <div class="customer-item-header">
                <div class="customer-name">
                  <i class="el-icon-user"></i>
                  {{ customer.customer_name }}
                </div>
                <div class="customer-code">{{ customer.customer_code }}</div>
              </div>
              
              <div class="customer-item-content">
                <div class="customer-info-row">
                  <div class="info-item">
                    <span class="info-label">负责人：</span>
                    <span class="info-value">{{ customer.biz_owner_name || '未指定' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">类型：</span>
                    <el-tag 
                      :type="getCustomerTypeColor(customer.customer_type)" 
                      size="mini">
                      {{ customer.customer_type }}
                    </el-tag>
                  </div>
                </div>
                
                <div class="customer-info-row">
                  <div class="info-item">
                    <span class="info-label">历史合同：</span>
                    <span class="info-value">{{ customer.hist_contract_cnt }}个</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">合同金额：</span>
                    <span class="info-value">{{ formatMoney(customer.hist_contract_amount) }}万</span>
                  </div>
                </div>
                
                <div class="customer-info-row">
                  <div class="info-item">
                    <span class="info-label">回款：</span>
                    <span class="info-value">{{ formatMoney(customer.received_amount) }}万</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">逾期：</span>
                    <span class="info-value" :class="{ 'overdue-warning': customer.overdue_amount > 0 }">
                      {{ formatMoney(customer.overdue_amount) }}万
                      <el-tag 
                        v-if="customer.overdue_amount > 0" 
                        type="warning" 
                        size="mini">
                        ⚠️
                      </el-tag>
                    </span>
                  </div>
                </div>
                
                <div v-if="customer.customer_address" class="customer-address">
                  <i class="el-icon-location"></i>
                  {{ customer.customer_address }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- 无客户提示 -->
          <div v-else class="no-customers">
            <el-empty 
              description="该批次暂无客户数据" 
              image-size="100">
            </el-empty>
          </div>
        </el-card>

        <!-- 分页 -->
        <div v-if="customersData.pagination.totalPages > 1" class="pagination-wrapper">
          <el-pagination
            @current-change="onCurrentPageChange"
            :current-page="customersData.pagination.page"
            :page-size="customersData.pagination.pageSize"
            :total="customersData.pagination.total"
            layout="total, prev, pager, next, jumper"
            background>
          </el-pagination>
        </div>
      </div>
      
      <!-- 演示提示 -->
      <div v-else class="demo-notice">
        <el-alert
          title="欢迎使用营销环节重构"
          type="info"
          :closable="false"
          show-icon>
          <template slot="default">
            <p>请选择模型批次，然后点击"查询客户列表"按钮加载该批次下的所有客户信息。</p>
            <p><strong>当前设置：</strong>批次 {{ selectedBatch }}，显示数量 {{ pageSize }}</p>
            <el-button @click="loadCustomerList" type="primary" size="small">加载客户列表</el-button>
          </template>
        </el-alert>
      </div>
    </div>
  </div>
</template>

<script>
import topic03Api from '@/api/topic03Api'

export default {
  name: 'MarketingRefactor',
  data() {
    return {
      nodeId: '',
      nodeTitle: '',
      nodeType: '',
      pageTitle: '营销环节重构',
      
      // 数据状态
      loading: false,
      refreshing: false,
      error: null,
      loadingText: '正在加载客户列表...',
      customersData: null,
      currentPage: 1,
      pageSize: 20,
      
      // 筛选条件
      selectedBatch: '20251013A',
      batchOptions: [
        {
          value: '20251013A',
          label: '20251013A',
          description: '2025年10月13日批次A'
        },
        {
          value: '20251014A',
          label: '20251014A',
          description: '2025年10月14日批次A'
        },
        {
          value: '20251015A',
          label: '20251015A',
          description: '2025年10月15日批次A'
        },
        {
          value: '20251016A',
          label: '20251016A',
          description: '2025年10月16日批次A'
        }
      ]
    }
  },
  
  created() {
    // 从路由查询参数中获取节点信息
    this.nodeId = this.$route.query.nodeId || '';
    this.nodeTitle = this.$route.query.nodeTitle || '';
    this.nodeType = this.$route.query.nodeType || '';
    
    // 如果有节点标题，更新页面标题
    if (this.nodeTitle) {
      this.pageTitle = `${this.nodeTitle} - 营销环节重构`;
    }
    
    console.log('📋 MarketingRefactor页面初始化:', {
      nodeId: this.nodeId,
      nodeTitle: this.nodeTitle,
      nodeType: this.nodeType
    });

    // 自动加载演示数据
    this.$nextTick(() => {
      this.loadCustomerList();
    });
  },
  
  methods: {
    // 返回上一页
    goBack() {
      console.log('🔙 返回上一页');
      this.$router.go(-1);
    },
    
    // 获取节点类型中文名称
    getNodeTypeName() {
      const typeMap = {
        'marketing': '营销环节',
        'purchase': '采购环节',
        'production': '生产环节',
        'operation': '运维环节'
      };
      return typeMap[this.nodeType] || this.nodeType || '未知环节';
    },

    // 加载客户列表
    async loadCustomerList(page = null) {
      try {
        this.loading = true;
        this.error = null;
        this.loadingText = '正在加载客户列表...';

        const targetPage = page || this.currentPage;
        const targetBatch = this.selectedBatch;

        console.log('🔄 开始加载客户列表:', {
          batch: targetBatch,
          page: targetPage,
          pageSize: this.pageSize
        });

        // 获取客户列表
        const result = await topic03Api.getCustomerList({
          modelRunBatch: targetBatch,
          page: targetPage,
          pageSize: this.pageSize,
          sortBy: 'customer_code',
          sortOrder: 'asc'
        });

        if (result.success) {
          this.customersData = result.data;
          this.currentPage = targetPage;
          console.log('✅ 客户列表加载成功:', this.customersData);
          this.$message.success(`成功加载 ${this.customersData.pagination.total} 个客户 (批次: ${targetBatch})`);
        } else {
          throw new Error(result.error || '获取客户列表失败');
        }
      } catch (error) {
        console.error('❌ 加载客户列表失败:', error);
        this.error = error.message || '加载客户列表失败';
        this.customersData = null;
      } finally {
        this.loading = false;
      }
    },

    // 批次变化处理
    onBatchChange(newBatch) {
      console.log('📋 批次变化:', newBatch);
      // 批次变化时自动重新加载数据
      this.currentPage = 1; // 重置到第一页
      this.loadCustomerList(1);
    },

    // 页面大小变化处理
    onPageSizeChange(newPageSize) {
      console.log('📏 页面大小变化:', newPageSize);
      this.currentPage = 1; // 重置到第一页
      this.loadCustomerList(1);
    },

    // 当前页变化处理
    onCurrentPageChange(newPage) {
      console.log('📖 页码变化:', newPage);
      this.loadCustomerList(newPage);
    },

    // 重置筛选条件
    resetFilters() {
      this.selectedBatch = '20251013A';
      this.pageSize = 20;
      this.currentPage = 1;
      this.customersData = null;
      this.error = null;
      this.$message.info('筛选条件已重置');
    },

    // 查看客户详情
    viewCustomerDetails(customer) {
      console.log('👁️ 查看客户详情:', customer);
      this.$message.info(`点击查看客户 ${customer.customer_name} 的详细信息`);
      // 这里可以跳转到客户详情页面或弹出详情对话框
    },

    // 获取客户类型统计
    getCustomerTypeStats(type) {
      if (!this.customersData || !this.customersData.customers) {
        return 0;
      }
      return this.customersData.customers.filter(customer => customer.customer_type === type).length;
    },

    // 获取客户类型颜色
    getCustomerTypeColor(type) {
      const colorMap = {
        '战略客户': 'danger',
        '重点客户': 'warning', 
        '一般客户': 'primary',
        '潜在客户': 'info'
      };
      return colorMap[type] || 'default';
    },

    // 获取线索状态颜色
    getLeadStatusColor(status) {
      const colorMap = {
        '新建': 'info',
        '跟进中': 'primary',
        '已转化': 'success',
        '已关闭': 'default',
        '暂停': 'warning'
      };
      return colorMap[status] || 'default';
    },

    // 格式化金额
    formatMoney(amount) {
      if (!amount && amount !== 0) return '0.00';
      return parseFloat(amount).toFixed(2);
    },

    // 格式化日期时间
    formatDateTime(dateTime) {
      if (!dateTime) return '未知';
      try {
        const date = new Date(dateTime);
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return dateTime;
      }
    }
  }
}
</script>

<style scoped>
.marketing-refactor-container {
  padding: 20px;
  height: 100%;
  background-color: #f5f7fa;
}

.header {
  margin-bottom: 24px;
}

.content {
  margin-bottom: 24px;
}

.info-card {
  width: 100%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.node-info {
  padding: 24px 0;
}

.node-summary {
  text-align: center;
}

.node-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.node-meta {
  display: flex;
  justify-content: center;
  gap: 8px;
}

/* 筛选区域样式 */
.filter-section {
  margin-top: 24px;
  margin-bottom: 24px;
}

.filter-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.filter-header {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  white-space: nowrap;
}

.filter-actions {
  display: flex;
  gap: 12px;
  margin-left: auto;
}

/* 客户列表展示样式 */
.customer-leads-section {
  margin-top: 24px;
}

.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.error-container {
  margin-bottom: 20px;
}

.demo-notice {
  margin-bottom: 20px;
}

.customers-display {
  width: 100%;
}

/* 统计信息样式 */
.stats-card {
  margin-bottom: 24px;
  border-radius: 8px;
}

.stats-info {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.stats-item {
  flex: 1;
}

.stats-number {
  font-size: 28px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 4px;
}

.stats-label {
  font-size: 14px;
  color: #606266;
}

/* 客户列表样式 */
.customers-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.customers-header h4 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.customers-header i {
  color: #409eff;
}

.customers-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.customer-item-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  background-color: #fafbfc;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid #409eff;
}

.customer-item-card:hover {
  background-color: #f5f7fa;
  border-left-color: #e6a23c;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.customer-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.customer-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 6px;
}

.customer-name i {
  color: #409eff;
}

.customer-code {
  font-size: 13px;
  color: #909399;
  background-color: #f0f2f5;
  padding: 2px 8px;
  border-radius: 4px;
}

.customer-item-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.customer-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.info-label {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
}

.info-value {
  font-size: 13px;
  color: #303133;
}

.overdue-warning {
  color: #f56c6c !important;
  font-weight: 600;
}

.customer-address {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f0f2f5;
  display: flex;
  align-items: center;
  gap: 4px;
}

.customer-address i {
  color: #c0c4cc;
}

.no-customers {
  text-align: center;
  padding: 40px 20px;
}

/* 分页样式 */
.pagination-wrapper {
  margin-top: 24px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .marketing-refactor-container {
    padding: 16px;
  }
  
  .node-title {
    font-size: 16px;
  }
  
  .card-header {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .node-meta {
    flex-wrap: wrap;
    gap: 6px;
  }

  /* 移动端筛选区域样式调整 */
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .filter-item {
    justify-content: space-between;
  }
  
  .filter-actions {
    margin-left: 0;
    justify-content: center;
    flex-wrap: wrap;
  }

  /* 移动端客户列表样式调整 */
  .stats-info {
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .stats-item {
    min-width: 80px;
  }
  
  .stats-number {
    font-size: 24px;
  }
  
  .customers-list {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .customer-item-card {
    padding: 12px;
  }
  
  .customer-item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .customer-name {
    font-size: 15px;
  }
  
  .customer-info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .info-item {
    justify-content: space-between;
    width: 100%;
  }
  
  .customers-header h4 {
    font-size: 16px;
  }
  
  .pagination-wrapper {
    margin-top: 16px;
  }
}
</style>