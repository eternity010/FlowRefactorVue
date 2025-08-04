<template>
  <div class="node-detail-container">
    <div class="header">
      <el-page-header @back="goBack" :content="nodeTitle" />
    </div>
    
    <div class="content">
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">
            <span>节点详细信息</span>
          </div>
        </template>
        
        <div class="detail-info">
          <div class="info-item">
            <span class="label">节点ID：</span>
            <span class="value">{{ nodeId }}</span>
          </div>
          <div class="info-item">
            <span class="label">节点标题：</span>
            <span class="value">{{ nodeTitle }}</span>
          </div>
          <div class="info-item">
            <span class="label">所属流程：</span>
            <span class="value">{{ getFlowTypeName() }}</span>
          </div>
          
          <!-- 显示节点详细信息 -->
          <template v-if="nodeDetails">
            <div class="info-item">
              <span class="label">节点描述：</span>
              <span class="value">{{ nodeDetails.description }}</span>
            </div>
            
            <div class="info-item">
              <span class="label">负责部门：</span>
              <span class="value">{{ nodeDetails.responsibleDept }}</span>
            </div>
            
            <div class="info-item">
              <span class="label">周期时间：</span>
              <span class="value">{{ nodeDetails.cycleTime }}</span>
            </div>
            
            <div class="info-item">
              <span class="label">风险等级：</span>
              <span class="value" :class="getRiskLevelClass(nodeDetails.riskLevel)">
                {{ nodeDetails.riskLevel }}
              </span>
            </div>
            
            <!-- 如果有步骤信息，则显示步骤列表 -->
            <div class="info-item steps-container" v-if="nodeDetails.steps && nodeDetails.steps.length">
              <span class="label">执行步骤：</span>
              <div class="steps-list">
                <div v-for="(step, index) in nodeDetails.steps" :key="index" class="step-item">
                  <div class="step-number">{{ index + 1 }}</div>
                  <div class="step-text">{{ step }}</div>
                </div>
              </div>
            </div>
          </template>
          
          <!-- 这里可以添加更多节点详细信息 -->
        </div>
      </el-card>
    </div>
    
    <!-- 添加实现流程图区域 -->
    <el-divider content-position="left">实现流程</el-divider>
    
    <!-- 数据加载中 -->
    <div v-if="loading" class="loading-section">
      <el-card class="loading-card">
        <div class="loading-content">
          <i class="el-icon-loading"></i>
          <p>正在加载实现流程数据...</p>
        </div>
      </el-card>
    </div>
    
    <!-- 加载出错 -->
    <div v-else-if="hasError" class="error-section">
      <el-card class="error-card">
        <div class="error-content">
          <i class="el-icon-warning"></i>
          <p>数据加载失败</p>
          <el-button type="primary" size="small" @click="loadNodeData">重新加载</el-button>
        </div>
      </el-card>
    </div>
    
    <!-- 数据加载完成且有流程数据 -->
    <div v-else-if="dataLoaded && currentFlowData && currentFlowData.mermaidDefinition" class="flow-section">
      <div class="mermaid-container">
        <div class="flow-header">
          <h3>{{ nodeTitle }} - 实现流程</h3>
          <p v-if="currentFlowData.description" class="flow-description">
            {{ currentFlowData.description }}
          </p>
        </div>
        
        <!-- 确保Mermaid定义有效后再渲染 -->
        <mermaid-chart 
          v-if="currentFlowData.mermaidDefinition && currentFlowData.mermaidDefinition.trim()"
          :code="currentFlowData.mermaidDefinition"
          class="node-flow-chart"
        />
        <div v-else class="invalid-mermaid">
          <el-alert title="流程图数据格式错误" type="warning" show-icon :closable="false"></el-alert>
        </div>
        
        <div class="flow-info" v-if="nodeDetails">
          <el-tag size="small" type="info">
            节点ID: {{ nodeDetails.nodeId }}
          </el-tag>
          <el-tag size="small" type="primary" v-if="nodeDetails.description">
            {{ nodeDetails.description }}
          </el-tag>
        </div>
      </div>
    </div>
    
    <!-- 数据加载完成但无流程数据 -->
    <div v-else-if="dataLoaded" class="empty-flow-section">
      <el-empty description="该节点暂无实现流程图">
        <el-button type="primary" size="small" @click="loadFlowData">重新加载流程数据</el-button>
      </el-empty>
    </div>
    
    <!-- 添加甘特图区域 -->
    <el-divider content-position="left">项目计划时间图</el-divider>
    <div v-if="ganttData" class="gantt-section">
      <gantt-chart :ganttData="ganttData" />
    </div>
    <div v-else class="empty-gantt-section">
      <el-empty description="该节点暂无甘特图数据"></el-empty>
    </div>
    
    <!-- 添加节点资源区域 -->
    <el-divider content-position="left">节点资源</el-divider>
    <div class="resource-section">
      <node-resources :type="nodeType" :nodeId="nodeId"></node-resources>
      
      <div class="view-more-resources">
        <el-button 
          type="primary" 
          size="small" 
          icon="el-icon-view" 
          @click="viewDetailedResources">
          查看详细资源信息
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { nodeDetailApi } from '@/api/nodeDetailApi';
import MermaidChart from '@/components/MermaidChart.vue';
import NodeResources from '@/components/NodeResources.vue';
import GanttChart from '@/components/GanttChart.vue';

export default {
  name: 'NodeDetailView',
  components: {
    MermaidChart,
    NodeResources,
    GanttChart
  },
  data() {
    return {
      nodeId: '',
      nodeTitle: '',
      nodeType: '',
      nodeDetails: null,
      currentFlowData: null,
      ganttData: null,
      loading: false,
      dataLoaded: false,  // 标记数据是否加载完成
      hasError: false     // 标记是否有加载错误
    }
  },

  async created() {
    // 从路由查询参数中获取节点ID和标题
    this.nodeId = this.$route.query.id || '';
    this.nodeTitle = this.$route.query.title || '节点详情';
    this.nodeType = this.$route.query.type || '';
    
    // 加载节点数据
    await this.loadNodeData();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    getFlowTypeName() {
      // 将流程类型转换为中文名称
      const typeMap = {
        'operation': '运维环节',
        'purchase': '采购环节',
        'production': '生产环节',
        'marketing': '营销环节'
      };
      return typeMap[this.nodeType] || '未知环节';
    },
    getRiskLevelClass(level) {
      // 根据风险等级返回对应的CSS类名
      const classMap = {
        '高': 'risk-high',
        '中': 'risk-medium',
        '低': 'risk-low'
      };
      return classMap[level] || '';
    },

    viewDetailedResources() {
      // 跳转到资源详情页面
      this.$router.push({
        path: '/home/resource',
        query: {
          type: this.nodeType,
          id: this.nodeId,
          title: this.nodeTitle
        }
      });
    },
    
    // 加载节点数据
    async loadNodeData() {
      this.loading = true;
      this.hasError = false;
      this.dataLoaded = false;
      
      try {
        // 先加载节点详情，再加载流程数据
        console.log('🔄 开始加载节点数据...');
        
        // 第一步：加载节点基本信息
        await this.loadNodeDetails();
        
        // 第二步：只有节点详情加载成功后，才加载流程数据
        if (this.nodeDetails) {
          await this.loadFlowData();
          this.dataLoaded = true;
          console.log('✅ 节点数据加载完成');
        } else {
          console.warn('⚠️ 节点详情加载失败，跳过流程数据加载');
          this.hasError = true;
        }
        
      } catch (error) {
        console.error('❌ 加载节点数据失败:', error);
        this.hasError = true;
        this.$message({
          type: 'error',
          message: '加载节点数据失败: ' + (error.message || '未知错误')
        });
      } finally {
        this.loading = false;
      }
    },
    
    // 加载节点基本信息
    async loadNodeDetails() {
      try {
        console.log('🔄 开始加载节点详情:', { nodeType: this.nodeType, nodeId: this.nodeId });
        const response = await nodeDetailApi.getNodeDetail(this.nodeType, this.nodeId);
        console.log('📥 节点详情API响应:', response);
        
        if (response.success) {
          this.nodeDetails = response.data;
          console.log('✅ 节点详情加载成功:', this.nodeDetails);
        } else {
          console.error('获取节点详情失败:', response.error);
          this.$message.error('获取节点详情失败: ' + response.error);
        }
      } catch (error) {
        console.error('加载节点详情失败:', error);
        this.$message.error('加载节点详情失败: ' + error.message);
      }
    },
    
    // 加载流程数据
    async loadFlowData() {
      try {
        console.log('🔄 开始加载流程数据:', { nodeType: this.nodeType, nodeId: this.nodeId });
        
        // 获取当前流程数据
        const currentResponse = await nodeDetailApi.getNodeCurrentFlow(this.nodeType, this.nodeId);
        console.log('📥 当前流程API响应:', currentResponse);
        
        if (currentResponse.success && currentResponse.data) {
          // 验证返回的数据结构
          const data = currentResponse.data;
          if (data.mermaidDefinition && typeof data.mermaidDefinition === 'string') {
            this.currentFlowData = data;
            console.log('✅ 当前流程数据加载成功:', {
              nodeId: data.nodeId,
              description: data.description,
              hasValidMermaid: !!data.mermaidDefinition.trim()
            });
          } else {
            console.warn('⚠️ 流程数据格式不正确:', data);
            throw new Error('流程图数据格式不正确');
          }
        } else {
          const errorMsg = currentResponse.error || '服务器返回空数据';
          console.error('获取当前流程失败:', errorMsg);
          throw new Error(errorMsg);
        }
      } catch (error) {
        console.error('❌ 加载流程数据失败:', error);
        // 不在这里直接抛出错误，让上层方法处理
        throw error;
      }
    }
  }
}
</script>

<style scoped>
.node-detail-container {
  padding: 20px;
  height: 100%;
}

.header {
  margin-bottom: 20px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-card {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-info {
  padding: 10px 0;
}

.info-item {
  display: flex;
  margin-bottom: 15px;
}

.label {
  font-weight: bold;
  width: 100px;
}

.value {
  flex: 1;
}

.empty-content {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.risk-high {
  color: #f56c6c;
  font-weight: bold;
}

.risk-medium {
  color: #e6a23c;
  font-weight: bold;
}

.risk-low {
  color: #67c23a;
  font-weight: bold;
}

.steps-container {
  display: block;
  margin-top: 20px;
}

.steps-list {
  margin-top: 10px;
  padding-left: 20px;
}

.step-item {
  display: flex;
  margin-bottom: 10px;
  align-items: flex-start;
}

.step-number {
  width: 24px;
  height: 24px;
  background-color: #409eff;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  flex-shrink: 0;
}

.step-text {
  line-height: 24px;
}

.flow-section {
  margin-top: 20px;
}

.empty-flow-section {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}



.resource-section {
  position: relative;
}

.view-more-resources {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

/* 流程图切换动画 */
.flow-fade-enter-active,
.flow-fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.flow-fade-enter {
  opacity: 0;
  transform: translateY(10px);
}

.flow-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.gantt-section {
  margin-top: 20px;
}

.empty-gantt-section {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

/* 加载状态样式 */
.loading-section {
  margin-top: 20px;
}

.loading-card {
  text-align: center;
}

.loading-content {
  padding: 40px 20px;
  color: #909399;
}

.loading-content i {
  font-size: 24px;
  margin-bottom: 16px;
  display: block;
}

.loading-content p {
  margin: 0;
  font-size: 14px;
}

/* 错误状态样式 */
.error-section {
  margin-top: 20px;
}

.error-card {
  text-align: center;
}

.error-content {
  padding: 40px 20px;
  color: #F56C6C;
}

.error-content i {
  font-size: 24px;
  margin-bottom: 16px;
  display: block;
}

.error-content p {
  margin: 0 0 16px 0;
  font-size: 14px;
}

/* 无效Mermaid数据样式 */
.invalid-mermaid {
  margin: 20px 0;
}

/* Mermaid 图表容器样式 */
.mermaid-container {
  width: 100%;
  background-color: #FAFAFA;
  border: 1px solid #EBEEF5;
  border-radius: 6px;
  padding: 20px;
  margin-top: 16px;
}

.flow-header {
  text-align: center;
  margin-bottom: 20px;
}

.flow-header h3 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 18px;
  font-weight: 500;
}

.flow-description {
  margin: 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.node-flow-chart {
  min-height: 300px;
  border: 1px solid #E4E7ED;
  border-radius: 4px;
  background-color: white;
  padding: 10px;
}

.flow-info {
  margin-top: 16px;
  text-align: center;
}

.flow-info .el-tag {
  margin: 0 4px;
}

/* 优化 Mermaid 图表内的样式 */
.mermaid-container ::v-deep .mermaid-chart svg {
  max-width: 100%;
  height: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mermaid-container {
    padding: 12px;
  }
  
  .flow-header h3 {
    font-size: 16px;
  }
  
  .flow-description {
    font-size: 13px;
  }
  
  .node-flow-chart {
    min-height: 250px;
  }
  
  .flow-info .el-tag {
    margin: 2px;
    font-size: 11px;
  }
}
</style> 