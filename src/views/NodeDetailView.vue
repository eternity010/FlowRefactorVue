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
    
    <div v-if="implementationData" class="flow-section">
      <div class="flow-control">
        <div v-if="hasBackupFlow" class="backup-flow-switch">
          <span class="switch-label">{{ showBackupFlow ? '备用流程' : '主流程' }}</span>
          <el-switch
            v-model="showBackupFlow"
            active-color="#13ce66"
            inactive-color="#409EFF"
            @change="handleFlowTypeChange"
          ></el-switch>
        </div>
        <el-tag v-if="showBackupFlow" type="success" effect="dark" size="small" class="backup-tag">
          <i class="el-icon-info"></i> 当前显示备用实现流程
        </el-tag>
      </div>
      
      <transition name="flow-fade" mode="out-in">
        <implementation-flow-chart
          :key="showBackupFlow ? 'backup' : 'main'"
          :flowData="currentFlowData.flowData"
          :stepsData="currentFlowData.steps"
          :title="currentFlowData.title"
          :description="currentFlowData.description"
        />
      </transition>
    </div>
    <div v-else class="empty-flow-section">
      <el-empty description="该节点暂无实现流程图"></el-empty>
    </div>
    
    <!-- 添加甘特图区域 -->
    <el-divider content-position="left">项目计划甘特图</el-divider>
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
import { getNodeDetails } from '@/data/flowNodesData';
import { 
  getNodeImplementation, 
  getNodeBackupImplementation, 
  hasNodeBackupImplementation, 
  updateBackupFlowStatus,
  getBackupFlowStatus 
} from '@/data/implementations';
import ImplementationFlowChart from '@/components/ImplementationFlowChart.vue';
import NodeResources from '@/components/NodeResources.vue';
import GanttChart from '@/components/GanttChart.vue';

export default {
  name: 'NodeDetailView',
  components: {
    ImplementationFlowChart,
    NodeResources,
    GanttChart
  },
  data() {
    return {
      nodeId: '',
      nodeTitle: '',
      nodeType: '',
      nodeDetails: null,
      implementationData: null,
      backupImplementationData: null,
      showBackupFlow: false,
      hasBackupFlow: false,
      ganttData: null
    }
  },
  computed: {
    currentFlowData() {
      return this.showBackupFlow ? this.backupImplementationData : this.implementationData;
    }
  },
  created() {
    // 从路由查询参数中获取节点ID和标题
    this.nodeId = this.$route.query.id || '';
    this.nodeTitle = this.$route.query.title || '节点详情';
    this.nodeType = this.$route.query.type || '';
    // 获取节点详细信息
    this.nodeDetails = getNodeDetails(this.nodeType, this.nodeId);
    
    // 获取节点实现流程数据
    this.implementationData = getNodeImplementation(this.nodeType, this.nodeId);
    
    // 获取甘特图数据
    if (this.implementationData && this.implementationData.ganttData) {
      this.ganttData = this.implementationData.ganttData;
    }
    
    // 检查并获取备用实现流程
    this.hasBackupFlow = hasNodeBackupImplementation(this.nodeType, this.nodeId);
    if (this.hasBackupFlow) {
      this.backupImplementationData = getNodeBackupImplementation(this.nodeType, this.nodeId);
      
      // 根据当前数据状态设置开关状态
      if (this.implementationData && this.implementationData.isBackupEnabled) {
        this.showBackupFlow = true;
      }
    }
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
    handleFlowTypeChange(val) {
      // 切换流程类型时的处理逻辑
      console.log('切换到' + (val ? '备用流程' : '主流程'));
      
      // 更新数据模型中的备用流程状态
      const success = updateBackupFlowStatus(this.nodeType, this.nodeId, val);
      
      if (success) {
        // 提示用户
        this.$message({
          type: 'success',
          message: '已' + (val ? '启用' : '禁用') + '备用流程'
        });
      } else {
        // 如果更新失败，回滚UI状态
        this.showBackupFlow = !val;
        this.$message({
          type: 'error',
          message: '更新备用流程状态失败'
        });
      }
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

.flow-control {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.backup-flow-switch {
  display: flex;
  align-items: center;
}

.switch-label {
  margin-right: 10px;
  font-weight: 500;
}

.backup-tag {
  margin-left: 10px;
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
</style> 