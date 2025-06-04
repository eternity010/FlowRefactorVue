<template>
  <div class="process-optimization-container">
    <!-- 前置页面 -->
    <div v-if="!showMainContent && !showLoading" class="pre-page">
      <!-- 数据加载状态提示 -->
      <div v-if="dataLoading" class="data-loading-indicator">
        <el-card class="loading-indicator-card">
          <div class="loading-indicator-content">
            <i class="el-icon-loading" style="font-size: 24px; color: #409EFF;"></i>
            <p>正在加载流程优化数据...</p>
          </div>
        </el-card>
      </div>

      <!-- 数据加载错误提示 -->
      <div v-if="dataError && !dataLoading" class="data-error-indicator">
        <el-card class="error-indicator-card">
          <div class="error-indicator-content">
            <i class="el-icon-warning" style="font-size: 24px; color: #F56C6C;"></i>
            <p>数据加载失败: {{ dataError }}</p>
            <el-button type="primary" @click="reloadData" size="small">
              重新加载
            </el-button>
          </div>
        </el-card>
      </div>

      <!-- 主要操作卡片 -->
      <el-card class="pre-card" :class="{ 'disabled': dataLoading || dataError }">
        <div slot="header" class="pre-card-header">
          <span>流程重构优化系统</span>
          <el-tag size="small" type="primary">版本 1.0</el-tag>
        </div>
        <div class="pre-content">
          <h2 class="pre-title">流程重构优化系统</h2>
          <p class="pre-description">点击下方按钮开始流程重构分析</p>
          <el-button 
            type="primary" 
            size="large"
            @click="startRefactoring"
            :disabled="dataLoading || dataError || Object.keys(optPoints).length === 0"
            class="refactor-button">
            <span v-if="dataLoading">数据加载中...</span>
            <span v-else-if="dataError">数据加载失败</span>
            <span v-else-if="Object.keys(optPoints).length === 0">等待数据加载</span>
            <span v-else>点击重构</span>
          </el-button>
        </div>
      </el-card>

      <!-- 系统状态卡片 -->
      <SystemStatusCard />
    </div>

    <!-- 加载动画页面 -->
    <div v-if="showLoading" class="loading-page">
      <el-card class="loading-card">
        <div class="loading-content">
          <div class="neural-network">
            <div class="node-layer">
              <div class="node" v-for="i in 4" :key="'input-' + i"></div>
            </div>
            <div class="connection-layer">
              <div class="connection" v-for="i in 12" :key="'conn1-' + i"></div>
            </div>
            <div class="node-layer">
              <div class="node" v-for="i in 6" :key="'hidden1-' + i"></div>
            </div>
            <div class="connection-layer">
              <div class="connection" v-for="i in 18" :key="'conn2-' + i"></div>
            </div>
            <div class="node-layer">
              <div class="node" v-for="i in 6" :key="'hidden2-' + i"></div>
            </div>
            <div class="connection-layer">
              <div class="connection" v-for="i in 12" :key="'conn3-' + i"></div>
            </div>
            <div class="node-layer">
              <div class="node" v-for="i in 3" :key="'output-' + i"></div>
            </div>
          </div>
          <h3 class="loading-title">神经网络分析中</h3>
          <p class="loading-description">正在分析流程数据，识别优化点...</p>
          <div class="progress-dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 主要内容 -->
    <div v-if="showMainContent && !showLoading">
      <!-- 数据检查 -->
      <div v-if="Object.keys(optPoints).length === 0" class="no-data-warning">
        <el-card>
          <div class="no-data-content">
            <i class="el-icon-warning" style="font-size: 48px; color: #E6A23C;"></i>
            <h3>数据未加载</h3>
            <p>流程优化数据尚未加载完成，请返回重新加载数据。</p>
            <el-button type="primary" @click="goBackAndReload">
              返回并重新加载
            </el-button>
          </div>
        </el-card>
      </div>

      <!-- 正常内容 -->
      <el-card v-else class="main-card">
        <div slot="header" class="card-header">
          <span>流程重构优化</span>
          <div class="header-actions">
            <el-tag size="small" type="primary">版本: 1.0.0</el-tag>
            <el-button size="mini" @click="reloadData" :loading="dataLoading">
              <i class="el-icon-refresh"></i> 刷新数据
            </el-button>
          </div>
        </div>
      
      <!-- Mermaid图表区域 -->
      <div class="mermaid-container">
        <h3 class="section-title">流程优化</h3>
        <el-tabs v-model="activeOptTab" type="border-card">
          <el-tab-pane 
            v-for="(flowData, key) in optPoints" 
            :key="key"
            :label="flowData.title" 
            :name="key"
          >
            <!-- 优化策略描述 -->
            <div class="strategy-description">
              <el-alert
                :title="flowData.title"
                :description="flowData.description"
                type="info"
                :closable="false"
                show-icon>
              </el-alert>
            </div>
            
            <div class="opt-chart-group">
              <!-- 优化前后流程图 -->
              <div class="opt-chart-block">
                <div class="opt-chart-title">重构前流程</div>
                <div class="chart-container">
                  <MermaidChart :code="flowData.before" />
                </div>
              </div>
              <div class="opt-chart-block">
                <div class="opt-chart-title">重构后流程</div>
                <div class="chart-container">
                  <MermaidChart :code="flowData.after" />
                </div>
              </div>
            </div>

            <!-- 新增操作按钮 -->
            <div class="operation-buttons">
              <el-button 
                type="success" 
                size="small"
                @click="acceptChange(key)">
                接受优化方案
              </el-button>
              <el-button 
                type="danger" 
                size="small"
                @click="rejectChange(key)">
                拒绝优化方案
              </el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      </el-card>
      
      <!-- 资源变化确认对话框 -->
      <ResourceChangeConfirmation
        :visible.sync="showResourceDialog"
        :resource-data="currentResourceData"
        :optimization-key="currentOptimizationKey"
        @confirm="handleResourceConfirm"
        @cancel="handleResourceCancel"
      />
    </div>
  </div>
</template>

<script>
import MermaidChart from '@/components/MermaidChart.vue'
import SystemStatusCard from '@/components/SystemStatusCard.vue'
import ResourceChangeConfirmation from '@/components/ResourceChangeConfirmation.vue'
import { processOptimizationApi } from '@/api/processOptimizationApi.js'

export default {
  name: 'ProcessOptimizationView',
  components: { MermaidChart, SystemStatusCard, ResourceChangeConfirmation },
  data() {
    return {
      showMainContent: false, // 控制是否显示主要内容
      showLoading: false, // 控制是否显示加载动画
      activeOptTab: 'Optimization1',
      optPoints: {}, // 改为空对象，通过API获取
      showResourceDialog: false,
      currentOptimizationKey: null,
      dataLoading: false, // API数据加载状态
      dataError: null // API数据加载错误
    }
  },

  computed: {
    currentResourceData() {
      if (!this.currentOptimizationKey || !this.optPoints[this.currentOptimizationKey]) {
        return {};
      }
      return this.optPoints[this.currentOptimizationKey].resourceChanges || {};
    }
  },

  async mounted() {
    // 组件挂载时自动加载数据
    await this.loadOptimizationData();
  },

  methods: {
    // 新增：加载优化数据的方法
    async loadOptimizationData() {
      this.dataLoading = true;
      this.dataError = null;
      
      try {
        const response = await processOptimizationApi.getAllOptimizations();
        
        // 输出完整的response让用户查看
        console.log('=== API Response 完整数据 ===');
        console.log('完整 Response:', response);
        console.log('Response Status:', response.status);
        console.log('Response StatusText:', response.statusText);
        console.log('Response Data:', response.data);
        console.log('Response Data Code:', response.data.code);
        console.log('Response Data Message:', response.data.message);
        console.log('Response Data (业务数据):', response.data.data);
        console.log('业务数据类型:', typeof response.data.data);
        console.log('业务数据键数量:', Object.keys(response.data.data).length);
        console.log('业务数据所有键:', Object.keys(response.data.data));
        
        // 输出每个优化项目的详细信息
        Object.keys(response.data.data).forEach(key => {
          console.log(`=== ${key} 详细数据 ===`);
          console.log(`标题: ${response.data.data[key].title}`);
          console.log(`描述: ${response.data.data[key].description}`);
          console.log(`是否有资源变化数据: ${!!response.data.data[key].resourceChanges}`);
          if (response.data.data[key].resourceChanges) {
            console.log(`资源变化摘要:`, response.data.data[key].resourceChanges.summary);
          }
        });
        console.log('=== API Response 数据输出结束 ===');
        
        if (response.data.code === 200) {
          this.optPoints = response.data.data;
          console.log('流程优化数据加载成功:', this.optPoints);
        } else {
          throw new Error(response.data.message || '数据加载失败');
        }
      } catch (error) {
        this.dataError = error.message || '数据加载失败';
        console.error('加载流程优化数据失败:', error);
        this.$message.error('数据加载失败，请稍后重试');
      } finally {
        this.dataLoading = false;
      }
    },

    startRefactoring() {
      // 检查数据是否已加载
      if (Object.keys(this.optPoints).length === 0) {
        this.$message.warning('数据尚未加载完成，请稍候');
        return;
      }
      
      this.showLoading = true;
      // 模拟神经网络分析过程
      setTimeout(() => {
        this.showLoading = false;
        this.showMainContent = true;
      }, 3000); // 3秒加载时间
    },

    async acceptChange(optimizationKey) {
      // 检查数据是否存在
      if (!this.optPoints[optimizationKey]) {
        this.$message.error('优化数据不存在');
        return;
      }

      // 检查是否有资源变化数据
      const hasResourceChanges = this.optPoints[optimizationKey] && this.optPoints[optimizationKey].resourceChanges;
      
      if (hasResourceChanges) {
        // 有资源变化数据，显示详细的资源变化确认对话框
        this.currentOptimizationKey = optimizationKey;
        this.showResourceDialog = true;
      } else {
        // 没有资源变化数据，使用简单的确认对话框
        this.$confirm('确认采用该优化方案吗？', '操作确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message.success('优化方案已应用');
          // 这里可添加实际业务逻辑
        }).catch(() => {
          this.$message.info('已取消操作');
        });
      }
    },

    rejectChange(optimizationKey) {
      // 检查数据是否存在
      if (!this.optPoints[optimizationKey]) {
        this.$message.error('优化数据不存在');
        return;
      }

      this.$confirm('确认拒绝该优化方案吗？', '操作确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.info('优化方案已拒绝')
        // 这里可添加实际业务逻辑
      })
    },

    handleResourceConfirm() {
      this.$message.success('资源变化已确认')
      // 这里可添加实际业务逻辑
    },

    handleResourceCancel() {
      this.$message.info('资源变化取消')
      // 这里可添加实际业务逻辑
    },

    // 新增：重新加载数据的方法
    async reloadData() {
      await this.loadOptimizationData();
    },

    goBackAndReload() {
      this.showMainContent = false;
      this.showLoading = false;
      this.loadOptimizationData();
    }
  }
}
</script>

<style scoped>
.process-optimization-container {
  padding: 20px;
}

/* 前置页面样式 */
.pre-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  min-height: 70vh;
  padding: 20px 0;
}

/* 数据加载状态样式 */
.data-loading-indicator,
.data-error-indicator {
  width: 100%;
  max-width: 500px;
}

.loading-indicator-card,
.error-indicator-card {
  text-align: center;
}

.loading-indicator-content,
.error-indicator-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.loading-indicator-content p,
.error-indicator-content p {
  margin: 0;
  font-size: 14px;
  color: #606266;
}

.error-indicator-content p {
  color: #F56C6C;
}

.pre-card {
  width: 100%;
  max-width: 600px;
  text-align: center;
  transition: opacity 0.3s ease;
}

.pre-card.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.pre-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
}

.pre-content {
  padding: 40px 20px;
}

.pre-title {
  font-size: 28px;
  color: #303133;
  margin-bottom: 20px;
  font-weight: bold;
}

.pre-description {
  font-size: 16px;
  color: #606266;
  margin-bottom: 40px;
  line-height: 1.6;
}

.refactor-button {
  padding: 15px 40px;
  font-size: 18px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
}

.refactor-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

/* 加载动画页面样式 */
.loading-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.loading-card {
  width: 100%;
  max-width: 700px;
  text-align: center;
}

.loading-content {
  padding: 50px 20px;
}

.neural-network {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  height: 200px;
}

.node-layer {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  margin: 0 20px;
}

.node {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(45deg, #409EFF, #67C23A);
  animation: pulse 2s infinite;
  margin: 5px 0;
}

.connection-layer {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  width: 40px;
}

.connection {
  height: 1px;
  background: linear-gradient(90deg, transparent, #409EFF, transparent);
  animation: flow 1.5s infinite;
  margin: 2px 0;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

@keyframes flow {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateX(20px);
  }
}

.loading-title {
  font-size: 24px;
  color: #303133;
  margin-bottom: 15px;
  font-weight: bold;
}

.loading-description {
  font-size: 16px;
  color: #606266;
  margin-bottom: 30px;
}

.progress-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #409EFF;
  animation: bounce 1.4s infinite ease-in-out;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.main-card {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title {
  font-size: 18px;
  color: #303133;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 4px solid #409EFF;
}

.mermaid-container {
  margin: 20px 0;
}

.mermaid-chart { /* 应用于 <pre> 标签 */
  width: 100%;
  text-align: center; /* 尝试让Mermaid SVG居中 */
  /* background-color: white; */ /* 背景色由父容器 .chart-container 控制 */
  border-radius: 4px;
  /* padding: 10px; */ /* 内边距由父容器 .chart-container 控制 */
  overflow: auto; /* 确保 pre 标签也能滚动，尽管父容器也有 */
}

.error-message {
  color: red;
  font-weight: bold;
  padding: 10px;
  border: 1px solid red;
  background-color: #ffeeee;
  border-radius: 4px;
  text-align: left;
  white-space: pre-wrap;
}



.strategy-description {
  margin-bottom: 20px;
}

.strategy-description .el-alert {
  border-radius: 8px;
  text-align: center;
}

.strategy-description .el-alert__title {
  font-size: 16px;
  font-weight: bold;
  color: #409EFF;
  text-align: center !important;
}

.strategy-description .el-alert__description {
  font-size: 14px;
  line-height: 1.6;
  margin-top: 8px;
  text-align: center !important;
}

.strategy-description :deep(.el-alert__content) {
  text-align: center;
}

.strategy-description :deep(.el-alert__title) {
  text-align: center !important;
}

.strategy-description :deep(.el-alert__description) {
  text-align: center !important;
}

/* Mermaid图表通用样式 (使用 :deep() 穿透scoped CSS) */
:deep(.mermaid svg) { /* 直接针对生成的svg元素 */
  display: block; /* 尝试解决可能的额外空间 */
  margin: auto; /* 配合父容器的flex居中 */
  max-width: 100% !important; /* 确保SVG不会超出其容器 */
  height: auto !important; /* 保持宽高比 */
}

:deep(.node rect),
:deep(.node circle),
:deep(.node ellipse),
:deep(.node polygon) {
  fill: #f0f9ff !important;
  stroke: #3572b0 !important;
  stroke-width: 1px !important;
}

:deep(.edgePath .path) {
  stroke: #3572b0 !important;
  stroke-width: 1.5px !important;
}

:deep(.label) {
  font-family: 'Consolas', 'Menlo', monospace !important; /* 使用更适合代码的字体 */
  font-size: 13px !important; /* 调整字体大小 */
  color: #333 !important;
}

.opt-chart-group {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 10px;
}
.opt-chart-block {
  width: 100%;
}
.opt-chart-title {
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 8px;
  color: #3572b0;
  padding-left: 2px;
}
@media (min-width: 900px) {
  .opt-chart-group {
    flex-direction: row;
    gap: 40px;
  }
  .opt-chart-block {
    flex: 1;
  }
}
 /* 新增样式 */
.operation-buttons {
  margin-top: 20px;
  text-align: center;
  padding: 10px 0;
  border-top: 1px solid #ebeef5;
  
  .el-button {
    margin: 0 8px;
    min-width: 120px;
  }
}

.no-data-warning {
  text-align: center;
  padding: 20px;
}

.no-data-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.no-data-content i {
  font-size: 48px;
  color: #E6A23C;
}

.no-data-content h3 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
}

.no-data-content p {
  font-size: 16px;
  color: #606266;
}

.no-data-content .el-button {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
}

.no-data-content .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}
</style>