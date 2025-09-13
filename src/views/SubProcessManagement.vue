<template>
  <div class="sub-process-management">
    <div class="page-header">
      <span class="page-title">子流程数据</span>
      <!-- 数据状态指示器 -->
      <div class="data-status">
        <span v-if="loading" class="status-loading">
          <i class="el-icon-loading"></i> 正在加载数据...
        </span>
        <span v-else-if="error" class="status-error">
          <i class="el-icon-warning"></i> 使用备用数据 ({{ error }})
        </span>
        <span v-else class="status-success">
          <i class="el-icon-success"></i> 数据已从MongoDB加载
        </span>
        
        <!-- 刷新按钮 -->
        <el-button 
          size="mini" 
          type="primary" 
          @click="refreshData"
          :loading="loading"
          style="margin-left: 10px;">
          <i class="el-icon-refresh"></i> 刷新
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载子流程数据，请稍候...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error && !processData" class="error-container">
      <div class="error-message">
        <i class="el-icon-warning"></i>
        <p>{{ error }}</p>
        <el-button 
          type="primary" 
          @click="refreshData"
          :loading="loading">
          重新加载
        </el-button>
      </div>
    </div>

    <!-- 主要内容 - 只在数据加载完成后渲染 -->
    <div v-else-if="dataLoaded" class="content-container">
      <!-- ==================== 上半部分 ==================== -->
      <div class="upper-section">
        <!-- 上半部分内容：三个风险级别卡片 -->
        <div class="info-blocks-container">
          <!-- 高风险节点卡片 -->
          <el-card class="info-block risk-high" shadow="hover">
            <div class="info-block-content">
              <div class="card-title">
                <i :class="currentRiskData.highRisk.icon"></i>
                {{ currentRiskData.highRisk.title }}
              </div>
              <div class="risk-count-container">
                <div class="risk-count">{{ currentRiskData.highRisk.count }}</div>
                <div class="risk-total">/ {{ currentRiskData.total }}</div>
              </div>
              <div class="risk-percentage">
                {{ getPercentage(currentRiskData.highRisk.count, currentRiskData.total) }}%
              </div>
              <div class="risk-nodes-list" v-if="currentRiskData.highRisk.nodes.length > 0">
                <div 
                  v-for="(node, index) in currentRiskData.highRisk.nodes.slice(0, 3)" 
                  :key="index"
                  class="risk-node-item"
                >
                  {{ node }}
                </div>
                <div v-if="currentRiskData.highRisk.nodes.length > 3" class="more-nodes">
                  +{{ currentRiskData.highRisk.nodes.length - 3 }}更多
                </div>
              </div>
            </div>
          </el-card>
          
          <!-- 中风险节点卡片 -->
          <el-card class="info-block risk-medium" shadow="hover">
            <div class="info-block-content">
              <div class="card-title">
                <i :class="currentRiskData.mediumRisk.icon"></i>
                {{ currentRiskData.mediumRisk.title }}
              </div>
              <div class="risk-count-container">
                <div class="risk-count">{{ currentRiskData.mediumRisk.count }}</div>
                <div class="risk-total">/ {{ currentRiskData.total }}</div>
              </div>
              <div class="risk-percentage">
                {{ getPercentage(currentRiskData.mediumRisk.count, currentRiskData.total) }}%
              </div>
              <div class="risk-nodes-list" v-if="currentRiskData.mediumRisk.nodes.length > 0">
                <div 
                  v-for="(node, index) in currentRiskData.mediumRisk.nodes.slice(0, 3)" 
                  :key="index"
                  class="risk-node-item"
                >
                  {{ node }}
                </div>
                <div v-if="currentRiskData.mediumRisk.nodes.length > 3" class="more-nodes">
                  +{{ currentRiskData.mediumRisk.nodes.length - 3 }}更多
                </div>
              </div>
            </div>
          </el-card>
          
          <!-- 正常节点卡片 -->
          <el-card class="info-block risk-normal" shadow="hover">
            <div class="info-block-content">
              <div class="card-title">
                <i :class="currentRiskData.normal.icon"></i>
                {{ currentRiskData.normal.title }}
              </div>
              <div class="risk-count-container">
                <div class="risk-count">{{ currentRiskData.normal.count }}</div>
                <div class="risk-total">/ {{ currentRiskData.total }}</div>
              </div>
              <div class="risk-percentage">
                {{ getPercentage(currentRiskData.normal.count, currentRiskData.total) }}%
              </div>
              <div class="normal-status">
                <div class="status-item success">
                  <i class="el-icon-success"></i>
                  <span>运行正常</span>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <!-- ==================== 分隔线 ==================== -->
      <div class="divider"></div>
      <!-- ==================== 下半部分 ==================== -->
      <div class="lower-section">
        <!-- 下半部分内容：子流程流程图 -->
        <sub-process-flow @process-changed="handleProcessChange"></sub-process-flow>
      </div>
    </div>

    <!-- 无数据状态 -->
    <div v-else class="no-data-container">
      <div class="no-data-message">
        <i class="el-icon-info"></i>
        <p>暂无子流程数据</p>
        <el-button 
          type="primary" 
          @click="refreshData"
          :loading="loading">
          加载数据
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import SubProcessFlow from '@/components/SubProcessFlow.vue'
import { subProcessDataApi } from '@/api/subProcessDataApi'
import { processCardsData } from '@/data/subProcessCardsData'
import { nodeRiskData } from '@/data/node_risk_data'

export default {
  name: 'SubProcessManagement',
  components: {
    SubProcessFlow
  },
  data() {
    return {
      currentProcess: 'purchase', // 默认选择采购环节
      
      // 数据状态
      loading: false,
      error: null,
      
      // 从API获取的数据
      processData: null,
      
      // 备用静态数据
      fallbackData: processCardsData,
      
      // 节点风险数据
      riskData: nodeRiskData
    }
  },
  computed: {
    // 判断数据是否已加载完成
    dataLoaded() {
      return !this.loading && (this.processData || this.error);
    },
    
    // 当前选中环节的数据
    currentData() {
      if (this.processData && this.processData[this.currentProcess]) {
        return this.processData[this.currentProcess];
      }
      // 如果API数据不可用，使用备用数据
      return this.fallbackData[this.currentProcess] || this.fallbackData.purchase;
    },
    
    // 当前选中环节的风险数据
    currentRiskData() {
      return this.riskData[this.currentProcess] || this.riskData.purchase;
    }
  },
  watch: {
    // 监听当前流程变化
    currentProcess(newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log(`🔄 SubProcessManagement组件流程切换: ${oldVal} -> ${newVal}`);
      }
    }
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    // 计算百分比
    getPercentage(count, total) {
      if (total === 0) return 0;
      return Math.round((count / total) * 100);
    },
    
    // 从API加载数据
    async loadData() {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('🔄 SubProcessManagement组件开始从API加载子流程数据...');
        
        // 检查API连接
        const connectionStatus = await subProcessDataApi.checkConnection();
        if (!connectionStatus.connected) {
          throw new Error('API服务器未启动，请先运行: npm run api-server');
        }
        
        const result = await subProcessDataApi.getSubProcessData();
        
        if (result.success && result.data) {
          this.processData = result.data;
          console.log('✅ SubProcessManagement组件子流程数据加载成功:', {
            dataKeys: Object.keys(result.data),
            message: result.message
          });
        } else {
          throw new Error(result.message || '获取子流程数据失败');
        }
      } catch (error) {
        console.error('❌ SubProcessManagement组件从API加载子流程数据失败:', error);
        this.error = error.message;
        this.processData = null;
        
        // 显示错误提示
        this.$message({
          message: `子流程数据加载失败: ${error.message}`,
          type: 'error',
          duration: 5000
        });
      } finally {
        this.loading = false;
      }
    },
    
    // 处理子流程变化事件
    async handleProcessChange(processKey) {
      console.log(`🔄 SubProcessManagement组件切换到: ${processKey}`);
      this.currentProcess = processKey;
      
      // 如果当前数据不可用，尝试重新加载
      if (!this.processData || !this.processData[processKey]) {
        console.log(`⚠️  ${processKey}数据不可用，尝试重新加载...`);
        await this.loadData();
      }
      
      console.log(`✅ ${processKey}风险数据切换完成`);
    },
    
    
    
    
    
    
    /**
     * 刷新子流程数据
     */
    async refreshData() {
      console.log('🔄 SubProcessManagement组件开始刷新数据');
      this.$message({
        message: '正在刷新子流程数据...',
        type: 'info',
        duration: 2000
      });
      
      await this.loadData();
      
      if (!this.error && this.processData) {
        console.log('✅ 子流程数据刷新完成');
        this.$message({
          message: '子流程数据刷新成功',
          type: 'success',
          duration: 2000
        });
      }
    },
    
    /**
     * 检查API连接状态
     */
    async checkApiConnection() {
      try {
        const status = await subProcessDataApi.checkConnection();
        console.log('🔍 SubProcessManagement API连接检查:', status);
        return status;
      } catch (error) {
        console.error('❌ SubProcessManagement API连接检查失败:', error);
        return { success: false, connected: false, message: error.message };
      }
    },
    
    /**
     * 获取特定类型的子流程数据
     */
    async loadSpecificProcessData(type) {
      try {
        console.log(`🔄 加载特定子流程数据: ${type}`);
        const result = await subProcessDataApi.getSubProcessDataByType(type);
        
        if (result.success && result.data) {
          if (!this.processData) {
            this.processData = {};
          }
          this.processData[type] = result.data;
          
          console.log(`✅ ${type}子流程数据加载成功`);
          return result.data;
        } else {
          throw new Error(result.message || `获取${type}子流程数据失败`);
        }
      } catch (error) {
        console.error(`❌ 加载${type}子流程数据失败:`, error);
        this.$message({
          message: `加载${type}数据失败: ${error.message}`,
          type: 'error',
          duration: 3000
        });
        return null;
      }
    },
    
    /**
     * 获取组件状态信息
     */
    getComponentStatus() {
      const status = {
        loading: this.loading,
        error: this.error,
        currentProcess: this.currentProcess,
        hasProcessData: !!this.processData,
        availableProcesses: this.processData ? Object.keys(this.processData) : [],
        chartsInitialized: !!(this.productionChart && this.progressChart),
        usingFallbackData: !this.processData,
        apiMode: true
      };
      
      console.log('📊 SubProcessManagement组件状态:', status);
      return status;
    }
  },
  beforeDestroy() {
    // 清除监听
    console.log('🔄 SubProcessManagement组件销毁');
  }
}
</script>

<style scoped>
.sub-process-management {
  padding: 0;
  position: relative;
  height: 100%;
}

.page-header {
  text-align: left;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
}

.page-title {
  font-size: 14px;
  color: #000000;
  font-weight: 500;
}

/* 数据状态指示器样式 */
.data-status {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.status-loading {
  color: #1890ff;
}

.status-loading i {
  margin-right: 4px;
}

.status-error {
  color: #f5222d;
}

.status-error i {
  margin-right: 4px;
}

.status-success {
  color: #52c41a;
}

.status-success i {
  margin-right: 4px;
}

.content-container {
  height: calc(100% - 40px);
  display: flex;
  flex-direction: column;
}

.upper-section {
  height: 30%;
  padding: 20px 0;
  display: flex;
  align-items: center;
  overflow: auto;
}

.info-blocks-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 0 15px;
  gap: 15px;
}

.info-block {
  width: 30%;
  height: 200px;
  margin: 0;
  border-radius: 8px !important;
  background-color: #ffffff !important;
  border: 1px solid #91d5ff !important;
  transition: all 0.3s ease;
}

.info-block:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1) !important;
}

/* 风险级别卡片样式 */
.info-block.risk-high {
  border: 2px solid #f5222d !important;
}

.info-block.risk-medium {
  border: 2px solid #fa8c16 !important;
}

.info-block.risk-normal {
  border: 2px solid #52c41a !important;
}

/* 覆盖Element UI卡片的内部样式 */
.info-block /deep/ .el-card__body {
  padding: 15px;
  height: 100%;
  background-color: #ffffff;
  border-radius: 8px;
}

.info-block-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title {
  font-size: 12px;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-title i {
  font-size: 14px;
}

/* 风险计数容器样式 */
.risk-count-container {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin: 15px 0 10px 0;
}

.risk-count {
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
}

.risk-high .risk-count {
  color: #f5222d;
}

.risk-medium .risk-count {
  color: #fa8c16;
}

.risk-normal .risk-count {
  color: #52c41a;
}

.risk-total {
  font-size: 16px;
  color: #8c8c8c;
  margin-left: 5px;
}

/* 风险百分比样式 */
.risk-percentage {
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
}

.risk-high .risk-percentage {
  color: #f5222d;
}

.risk-medium .risk-percentage {
  color: #fa8c16;
}

.risk-normal .risk-percentage {
  color: #52c41a;
}

/* 风险节点列表样式 */
.risk-nodes-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 60px;
  overflow: hidden;
}

.risk-node-item {
  font-size: 11px;
  color: #666;
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-nodes {
  font-size: 10px;
  color: #999;
  text-align: center;
  font-style: italic;
}

/* 正常状态样式 */
.normal-status {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.lower-section {
  height: 70%;
  padding: 30px 0;
  overflow: auto;
}

.divider {
  height: 5px;
  width: 100%;
  background-color: #dcdfe6;
  margin: 0;
}

h2 {
  color: #303133;
  margin: 0;
}

.risk-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 92%;
  padding: 10px 0;
  flex: 1;
  justify-content: flex-start;
}

.risk-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
}

.risk-item i {
  font-size: 16px;
}

.risk-item.warning {
  background-color: #fff7e6;
  color: #fa8c16;
}

.risk-item.danger {
  background-color: #fff1f0;
  color: #f5222d;
}

.status-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 92%;
  padding: 10px 0;
  flex: 1;
  justify-content: flex-start;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
}

.status-item i {
  font-size: 16px;
}

.status-item.success {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-item.warning {
  background-color: #fff7e6;
  color: #fa8c16;
}

.status-item.error {
  background-color: #fff1f0;
  color: #f5222d;
}


/* 加载状态样式 */
.loading-container {
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
  background-color: #fafafa;
  border-radius: 8px;
  margin: 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  font-size: 16px;
  margin: 0;
}

/* 错误状态样式 */
.error-container {
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
}

.error-message {
  text-align: center;
  color: #ff4757;
  padding: 40px;
  border: 2px solid #ff4757;
  border-radius: 12px;
  background-color: #fff5f5;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(255, 71, 87, 0.1);
}

.error-message i {
  font-size: 48px;
  margin-bottom: 20px;
  display: block;
  color: #ff4757;
}

.error-message p {
  margin: 20px 0;
  font-size: 16px;
  line-height: 1.5;
}

/* 无数据状态样式 */
.no-data-container {
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
}

.no-data-message {
  text-align: center;
  color: #8c8c8c;
  padding: 40px;
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  background-color: #fafafa;
  max-width: 400px;
}

.no-data-message i {
  font-size: 48px;
  margin-bottom: 20px;
  display: block;
  color: #8c8c8c;
}

.no-data-message p {
  margin: 20px 0;
  font-size: 16px;
  line-height: 1.5;
}
</style> 