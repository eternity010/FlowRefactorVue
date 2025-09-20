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

          <!-- 显示来自数据库的风险信息 -->
          <template v-if="riskInfo">
            <el-divider content-position="left">风险评估信息</el-divider>
            
            <div class="risk-info-section">
              <!-- 风险等级突出显示 -->
              <div class="risk-level-header">
                <div class="risk-level-indicator" :class="riskInfo.riskLevelClass">
                  <div class="risk-circle">
                    <div class="risk-dot"></div>
                  </div>
                  <div class="risk-level-text">
                    <div class="risk-level-title">{{ riskInfo.riskLevel }}风险</div>
                    <div class="risk-level-subtitle">{{ riskInfo.nodeName }}</div>
                  </div>
                </div>
              </div>
              
              <!-- 详细信息 -->
              <div class="risk-details">
                <div class="info-item">
                  <span class="label">
                    <i class="el-icon-document"></i>
                    风险描述：
                  </span>
                  <span class="value risk-description">{{ riskInfo.riskDescription }}</span>
                </div>
                
                <div class="info-item">
                  <span class="label">
                    <i class="el-icon-s-operation"></i>
                    所属流程：
                  </span>
                  <span class="value">{{ getFlowTypeName(riskInfo.processType) }}</span>
                </div>
                
                <div class="info-item" v-if="riskInfo.updateTime">
                  <span class="label">
                    <i class="el-icon-time"></i>
                    更新时间：
                  </span>
                  <span class="value">{{ formatDate(riskInfo.updateTime) }}</span>
                </div>
              </div>
            </div>
          </template>
          
          <!-- 风险信息加载中 -->
          <template v-else-if="riskLoading">
            <el-divider content-position="left">风险评估信息</el-divider>
            <div class="risk-loading">
              <i class="el-icon-loading"></i>
              <span>正在加载风险信息...</span>
            </div>
          </template>
          
          <!-- 风险信息加载失败 -->
          <template v-else-if="riskError">
            <el-divider content-position="left">风险评估信息</el-divider>
            <div class="risk-error">
              <i class="el-icon-warning"></i>
              <span>{{ riskError }}</span>
              <el-button type="text" size="mini" @click="loadRiskInfo">重新加载</el-button>
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
    
    <!-- 重构操作区域 -->
    <el-divider content-position="left">节点重构</el-divider>
    <div class="refactor-section">
      <el-card class="refactor-card" shadow="hover">
        <div class="refactor-content">
          <div class="refactor-info">
            <div class="refactor-icon">
              <i class="el-icon-setting"></i>
            </div>
            <div class="refactor-details">
              <h4>启动节点重构</h4>
              <p>基于风险评估结果和流程分析，重构当前节点以提升效率和降低风险</p>
              <div class="refactor-benefits">
                <el-tag size="small" type="success">效率提升</el-tag>
                <el-tag size="small" type="warning">风险降低</el-tag>
                <el-tag size="small" type="info">流程优化</el-tag>
              </div>
            </div>
          </div>
          
          <div class="refactor-actions">
            <el-button 
              type="primary" 
              size="large"
              icon="el-icon-cpu"
              :loading="refactorLoading"
              @click="startRefactor">
              {{ refactorLoading ? '正在启动重构...' : '启动重构' }}
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
    
  </div>
</template>

<script>
import { nodeDetailApi } from '@/api/nodeDetailApi';
import { topic01Api } from '@/api/topic01Api';
import MermaidChart from '@/components/MermaidChart.vue';

export default {
  name: 'NodeDetailView',
  components: {
    MermaidChart
  },
  data() {
    return {
      nodeId: '',
      nodeTitle: '',
      nodeType: '',
      nodeDetails: null,
      riskInfo: null,          // 节点风险信息
      riskLoading: false,      // 风险信息加载状态
      riskError: null,         // 风险信息加载错误
      currentFlowData: null,
      loading: false,
      dataLoaded: false,  // 标记数据是否加载完成
      hasError: false,    // 标记是否有加载错误
      refactorLoading: false   // 重构操作加载状态
    }
  },

  async created() {
    // 从路由查询参数中获取节点ID和标题
    this.nodeId = this.$route.query.id || '';
    this.nodeTitle = this.$route.query.title || '节点详情';
    this.nodeType = this.$route.query.type || '';
    
    // 并行加载节点数据和风险信息
    await Promise.all([
      this.loadNodeData(),
      this.loadRiskInfo()
    ]);
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    getFlowTypeName(type) {
      // 将流程类型转换为中文名称，支持传入参数或使用当前组件的nodeType
      const flowType = type || this.nodeType;
      const typeMap = {
        'operation': '运维环节',
        'purchase': '采购环节',
        'production': '生产环节',
        'marketing': '营销环节'
      };
      return typeMap[flowType] || '未知环节';
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
    },

    // 加载节点风险信息
    async loadRiskInfo() {
      if (!this.nodeId) {
        console.warn('⚠️ 节点ID为空，跳过风险信息加载');
        return;
      }

      this.riskLoading = true;
      this.riskError = null;

      try {
        console.log('🔄 开始加载节点风险信息:', { nodeId: this.nodeId });
        
        const response = await topic01Api.getNodeRiskInfo(this.nodeId);
        console.log('📥 节点风险信息API响应:', response);
        
        if (response.success && response.data) {
          this.riskInfo = response.data;
          console.log('✅ 节点风险信息加载成功:', {
            nodeId: response.data.nodeId,
            riskLevel: response.data.riskLevel,
            processType: response.data.processType
          });
        } else {
          const errorMsg = response.error || '获取风险信息失败';
          console.warn('⚠️ 获取节点风险信息失败:', errorMsg);
          this.riskError = errorMsg;
          
          // 显示警告信息但不阻止页面运行
          this.$message({
            type: 'warning',
            message: `节点 ${this.nodeId} 风险信息加载失败: ${errorMsg}`,
            duration: 3000
          });
        }
      } catch (error) {
        console.error('❌ 加载节点风险信息失败:', error);
        this.riskError = error.message;
        
        this.$message({
          type: 'warning',
          message: `节点风险信息加载失败: ${error.message}`,
          duration: 3000
        });
      } finally {
        this.riskLoading = false;
      }
    },

    // 获取风险等级的CSS类名（支持两种数据源）
    getRiskLevelClass(level) {
      // 如果有风险信息数据，优先使用其中的riskLevelClass
      if (this.riskInfo && this.riskInfo.riskLevelClass) {
        return this.riskInfo.riskLevelClass;
      }
      
      // 根据风险等级返回对应的CSS类名（兼容原有逻辑）
      const classMap = {
        '高': 'risk-high',
        '中': 'risk-medium', 
        '低': 'risk-low'
      };
      return classMap[level] || 'risk-unknown';
    },

    // 格式化日期显示
    formatDate(dateString) {
      if (!dateString) return '未知';
      
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return dateString; // 如果无法解析，返回原字符串
        }
        
        // 格式化为 YYYY-MM-DD HH:mm:ss
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      } catch (error) {
        console.warn('日期格式化失败:', error);
        return dateString;
      }
    },

    // 启动节点重构
    async startRefactor() {
      console.log('🔧 启动节点重构:', { nodeId: this.nodeId, nodeType: this.nodeType });
      
      // 先进行重构前确认
      const confirmResult = await this.$confirm(
        `确定要启动节点 ${this.nodeId} 的重构吗？\n\n重构将基于当前的风险评估和流程分析进行优化。`,
        '确认重构操作',
        {
          confirmButtonText: '开始重构',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: false
        }
      ).catch(() => false);

      if (!confirmResult) {
        console.log('ℹ️ 用户取消重构操作');
        return;
      }

      this.refactorLoading = true;

      try {
        // 显示开始重构的提示
        this.$message({
          type: 'info',
          message: '正在启动重构流程，请稍候...',
          duration: 2000
        });

        // 模拟重构API调用
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 重构成功提示
        this.$notify({
          title: '重构启动成功',
          message: `节点 ${this.nodeId} 的重构流程已成功启动，系统将在后台进行优化分析。`,
          type: 'success',
          duration: 5000
        });

        console.log('✅ 节点重构启动成功');

        // 根据节点类型跳转到对应的重构页面
        this.navigateToRefactorPage();

      } catch (error) {
        console.error('❌ 启动重构失败:', error);
        this.$message({
          type: 'error',
          message: `重构启动失败: ${error.message}`,
          duration: 5000
        });
      } finally {
        this.refactorLoading = false;
      }
    },

    // 根据节点类型导航到对应的重构页面
    navigateToRefactorPage() {
      const routeMap = {
        'marketing': 'MarketingRefactor',
        'purchase': 'PurchaseRefactor',
        'production': 'ProductionRefactor',
        'operation': 'OperationRefactor'
      };

      const routeName = routeMap[this.nodeType];
      
      if (routeName) {
        console.log(`🔀 跳转到${this.nodeType}环节重构页面:`, routeName);
        
        this.$router.push({
          name: routeName,
          query: {
            nodeId: this.nodeId,
            nodeTitle: this.nodeTitle,
            nodeType: this.nodeType
          }
        });
      } else {
        console.warn('⚠️ 未找到对应的重构页面，节点类型:', this.nodeType);
        this.$message({
          type: 'warning',
          message: `暂不支持${this.nodeType}类型节点的重构页面`,
          duration: 3000
        });
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

/* 风险信息样式 */
.risk-info-section {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 12px;
  padding: 0;
  margin-top: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

/* 风险等级头部区域 */
.risk-level-header {
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-bottom: 1px solid #e2e8f0;
}

.risk-level-indicator {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 风险圆形指示器 */
.risk-circle {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.risk-circle::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 50%;
  opacity: 0.3;
  animation: pulse 2s infinite;
}

.risk-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
  position: relative;
}

.risk-dot::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 6px;
  height: 6px;
  background: rgba(255,255,255,0.9);
  border-radius: 50%;
}

/* 高风险 - 红色 */
.risk-level-indicator.risk-high .risk-circle {
  background: linear-gradient(135deg, #ff4757 0%, #ff3742 100%);
}

.risk-level-indicator.risk-high .risk-circle::before {
  background: linear-gradient(135deg, #ff4757 0%, #ff3742 100%);
}

.risk-level-indicator.risk-high .risk-level-title {
  color: #ff4757;
}

/* 中风险 - 黄色 */
.risk-level-indicator.risk-medium .risk-circle {
  background: linear-gradient(135deg, #ffa502 0%, #ff9500 100%);
}

.risk-level-indicator.risk-medium .risk-circle::before {
  background: linear-gradient(135deg, #ffa502 0%, #ff9500 100%);
}

.risk-level-indicator.risk-medium .risk-level-title {
  color: #ffa502;
}

/* 低风险 - 绿色 */
.risk-level-indicator.risk-low .risk-circle {
  background: linear-gradient(135deg, #2ed573 0%, #1dd1a1 100%);
}

.risk-level-indicator.risk-low .risk-circle::before {
  background: linear-gradient(135deg, #2ed573 0%, #1dd1a1 100%);
}

.risk-level-indicator.risk-low .risk-level-title {
  color: #2ed573;
}

/* 未知风险 - 灰色 */
.risk-level-indicator.risk-unknown .risk-circle {
  background: linear-gradient(135deg, #747d8c 0%, #57606f 100%);
}

.risk-level-indicator.risk-unknown .risk-circle::before {
  background: linear-gradient(135deg, #747d8c 0%, #57606f 100%);
}

.risk-level-indicator.risk-unknown .risk-level-title {
  color: #747d8c;
}

/* 风险等级文字 */
.risk-level-text {
  flex: 1;
}

.risk-level-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
}

.risk-level-subtitle {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

/* 风险详细信息区域 */
.risk-details {
  padding: 20px 24px;
}

.risk-details .info-item {
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.risk-details .info-item:last-child {
  margin-bottom: 0;
}

.risk-details .label {
  font-weight: 600;
  color: #374151;
  min-width: 120px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.risk-details .label i {
  color: #6b7280;
  font-size: 16px;
}

.risk-details .value {
  flex: 1;
  color: #1f2937;
  line-height: 1.5;
  font-size: 14px;
}

.risk-description {
  background-color: #f1f5f9;
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
  font-style: italic;
}

/* 动画效果 */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.2;
  }
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
}

/* 悬停效果 */
.risk-level-indicator:hover .risk-circle {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.risk-loading, .risk-error {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 12px;
  margin-top: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.risk-loading {
  color: #1890ff;
  border-left: 4px solid #1890ff;
}

.risk-loading i {
  font-size: 20px;
  animation: spin 1s linear infinite;
}

.risk-error {
  color: #ff4757;
  background: linear-gradient(135deg, #fff2f0 0%, #ffffff 100%);
  border-left: 4px solid #ff4757;
}

.risk-error i {
  font-size: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  
  .risk-level-header {
    padding: 16px 20px;
  }
  
  .risk-circle {
    width: 48px;
    height: 48px;
  }
  
  .risk-dot {
    width: 20px;
    height: 20px;
  }
  
  .risk-level-title {
    font-size: 18px;
  }
  
  .risk-level-subtitle {
    font-size: 13px;
  }
  
  .risk-details {
    padding: 16px 20px;
  }
  
  .risk-details .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    margin-bottom: 14px;
  }
  
  .risk-details .label {
    min-width: auto;
    font-size: 13px;
  }
  
  .risk-details .value {
    font-size: 13px;
  }
  
  .risk-loading, .risk-error {
    padding: 16px 20px;
    gap: 10px;
  }
}

/* ==================== 重构操作区域样式 ==================== */

.refactor-section {
  margin-top: 30px;
  margin-bottom: 30px;
}

.refactor-card {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.refactor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: #6366f1;
}

.refactor-card /deep/ .el-card__body {
  padding: 32px;
}

.refactor-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
}

/* 重构信息区域 */
.refactor-info {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.refactor-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
  position: relative;
  overflow: hidden;
}

.refactor-icon::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
  animation: shimmer 3s infinite;
}

.refactor-icon i {
  font-size: 36px;
  color: white;
  z-index: 1;
}

.refactor-details {
  flex: 1;
}

.refactor-details h4 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
}

.refactor-details p {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.refactor-benefits {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.refactor-benefits .el-tag {
  font-weight: 500;
  border-radius: 6px;
  padding: 4px 8px;
}

/* 重构操作按钮区域 */
.refactor-actions {
  display: flex;
  align-items: center;
  justify-content: center;
}

.refactor-actions .el-button {
  min-width: 160px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.refactor-actions .el-button--primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
  font-size: 16px;
  padding: 14px 28px;
}

.refactor-actions .el-button--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.refactor-actions .el-button--primary:active {
  transform: translateY(0);
}

/* 动画效果 */
@keyframes shimmer {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .refactor-content {
    flex-direction: column;
    text-align: center;
    gap: 24px;
  }
  
  .refactor-info {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .refactor-icon {
    width: 64px;
    height: 64px;
  }
  
  .refactor-icon i {
    font-size: 28px;
  }
  
  .refactor-details h4 {
    font-size: 20px;
  }
  
  .refactor-details p {
    font-size: 14px;
  }
  
  .refactor-actions .el-button {
    width: 100%;
    max-width: 280px;
  }
  
  .refactor-card /deep/ .el-card__body {
    padding: 24px;
  }
}
</style> 