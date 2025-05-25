<template>
  <div class="resource-view">
    <div class="page-header">
      <el-page-header @back="goBack" :content="`${nodeTitle} 的资源详情`" class="custom-page-header"></el-page-header>
    </div>
    
    <el-card class="resource-selector-card">
      <div class="resource-selector">
        <el-form :inline="true" class="selector-form">
          <el-form-item label="环节">
            <el-select v-model="selectedType" placeholder="选择环节" @change="handleTypeChange" class="selector-input">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="节点">
            <el-select v-model="selectedNodeId" placeholder="选择节点" @change="handleNodeChange" class="selector-input">
              <el-option v-for="item in nodeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    
    <transition name="fade">
      <div class="resource-content-wrapper">
        <el-card class="resource-content-card">
          <template v-if="selectedType && selectedNodeId">
            <div class="node-resources-container">
              <node-resources :type="selectedType" :nodeId="selectedNodeId"></node-resources>
            </div>
            
            <!-- 资源详细信息区 -->
            <transition name="slide-fade">
              <div class="resource-details-section" v-if="resourceDetails">
                <el-divider content-position="left">
                  <span class="divider-title">详细信息</span>
                </el-divider>
                
                <el-tabs type="border-card" class="custom-tabs">
                  <!-- 文档资源详情 -->
                  <el-tab-pane label="文档资源" v-if="hasResourceType('documents')">
                    <div class="detail-section-title">
                      <i class="el-icon-document"></i> 文档资源详情
                    </div>
                    
                    <el-table 
                      :data="resourceDetails.documents.items" 
                      border 
                      style="width: 100%"
                      class="custom-table"
                      v-loading="loading"
                      element-loading-text="加载文档资源中..."
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(255, 255, 255, 0.8)">
                      <el-table-column prop="name" label="文档名称" width="200"></el-table-column>
                      <el-table-column prop="type" label="类型" width="120"></el-table-column>
                      <el-table-column prop="format" label="格式" width="100"></el-table-column>
                      <el-table-column prop="lastUpdate" label="最后更新" width="150"></el-table-column>
                      <el-table-column prop="size" label="大小" width="100"></el-table-column>
                      <el-table-column prop="description" label="说明"></el-table-column>
                      <el-table-column label="操作" width="120">
                        <template slot-scope="scope">
                          <el-button size="mini" type="primary" icon="el-icon-download" class="action-button">下载</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                  
                  <!-- 人力资源详情 -->
                  <el-tab-pane label="人力资源" v-if="hasResourceType('personnel')">
                    <div class="detail-section-title">
                      <i class="el-icon-user"></i> 人力资源详情
                    </div>
                    
                    <el-table 
                      :data="resourceDetails.personnel.items" 
                      border 
                      style="width: 100%"
                      class="custom-table"
                      v-loading="loading"
                      element-loading-text="加载人力资源中..."
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(255, 255, 255, 0.8)">
                      <el-table-column prop="name" label="姓名" width="120"></el-table-column>
                      <el-table-column prop="role" label="角色" width="120"></el-table-column>
                      <el-table-column prop="department" label="部门" width="150"></el-table-column>
                      <el-table-column prop="contact" label="联系方式" width="150"></el-table-column>
                      <el-table-column prop="responsibility" label="职责描述"></el-table-column>
                    </el-table>
                  </el-tab-pane>
                  
                  <!-- 系统资源详情 -->
                  <el-tab-pane label="系统资源" v-if="hasResourceType('systems')">
                    <div class="detail-section-title">
                      <i class="el-icon-monitor"></i> 系统资源详情
                    </div>
                    
                    <el-table 
                      :data="resourceDetails.systems.items" 
                      border 
                      style="width: 100%"
                      class="custom-table"
                      v-loading="loading"
                      element-loading-text="加载系统资源中..."
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(255, 255, 255, 0.8)">
                      <el-table-column prop="name" label="系统名称" width="180"></el-table-column>
                      <el-table-column prop="type" label="类型" width="120"></el-table-column>
                      <el-table-column prop="version" label="版本" width="100"></el-table-column>
                      <el-table-column prop="access" label="访问方式" width="180"></el-table-column>
                      <el-table-column prop="description" label="说明"></el-table-column>
                      <el-table-column label="操作" width="120">
                        <template slot-scope="scope">
                          <el-button size="mini" type="primary" icon="el-icon-link" class="action-button">访问</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                  
                  <!-- 设备资源详情 -->
                  <el-tab-pane label="设备资源" v-if="hasResourceType('equipment')">
                    <div class="detail-section-title">
                      <i class="el-icon-cpu"></i> 设备资源详情
                    </div>
                    
                    <el-table 
                      :data="resourceDetails.equipment.items" 
                      border 
                      style="width: 100%"
                      class="custom-table"
                      v-loading="loading"
                      element-loading-text="加载设备资源中..."
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(255, 255, 255, 0.8)">
                      <el-table-column prop="name" label="设备名称" width="180"></el-table-column>
                      <el-table-column prop="type" label="类型" width="120"></el-table-column>
                      <el-table-column prop="model" label="型号" width="150"></el-table-column>
                      <el-table-column prop="status" label="状态" width="100">
                        <template slot-scope="scope">
                          <el-tag 
                            :type="scope.row.status === '正常' ? 'success' : scope.row.status === '维护中' ? 'warning' : 'danger'"
                            effect="light"
                            class="status-tag">
                            {{ scope.row.status }}
                          </el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column prop="location" label="位置" width="150"></el-table-column>
                      <el-table-column prop="description" label="说明"></el-table-column>
                    </el-table>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </transition>
          </template>
          <template v-else>
            <div class="select-tip">
              <el-empty description="请选择环节和节点以查看资源" :image-size="200"></el-empty>
            </div>
          </template>
        </el-card>
      </div>
    </transition>
  </div>
</template>

<script>
import NodeResources from '@/components/NodeResources.vue';
import { 
  purchaseResources, 
  operationResources,
  productionResources, 
  marketingResources,
  getNodeResourceDetails, 
  getNodesMap 
} from '@/data/resource';

export default {
  name: 'ResourceManagement',
  components: {
    NodeResources
  },
  data() {
    return {
      selectedType: '',
      selectedNodeId: '',
      nodeTitle: '',
      typeOptions: [
        { value: 'purchase', label: '采购环节' },
        { value: 'production', label: '生产环节' },
        { value: 'marketing', label: '营销环节' },
        { value: 'operation', label: '运维环节' }
      ],
      nodeOptions: [],
      resourceDetails: null,
      loading: false
    }
  },
  created() {
    // 从路由查询参数中获取节点信息
    const routeType = this.$route.query.type;
    const routeId = this.$route.query.id;
    const routeTitle = this.$route.query.title;
    
    if (routeType && routeId) {
      this.selectedType = routeType;
      this.loadNodeOptions(routeType);
      this.selectedNodeId = routeId;
      this.nodeTitle = routeTitle || routeId;
      this.loadResourceDetails();
    } else {
      // 默认显示采购环节的第一个节点
      this.selectedType = 'purchase';
      this.loadNodeOptions('purchase');
      this.selectedNodeId = 'p1';
      this.nodeTitle = '采购需求';
      this.loadResourceDetails();
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    
    handleTypeChange(type) {
      this.selectedNodeId = '';
      this.resourceDetails = null;
      this.loadNodeOptions(type);
    },
    
    handleNodeChange(nodeId) {
      this.loadResourceDetails();
    },
    
    loadNodeOptions(type) {
      // 根据选择的环节类型加载对应的节点选项
      this.nodeOptions = [];
      
      // 获取对应环节的资源数据
      let resourceData = null;
      switch(type) {
        case 'purchase':
          resourceData = purchaseResources;
          break;
        case 'operation':
          resourceData = operationResources;
          break;
        case 'production':
          resourceData = productionResources;
          break;
        case 'marketing':
          resourceData = marketingResources;
          break;
      }
      
      if (resourceData) {
        const nodes = Object.keys(resourceData);
        const nodesMap = getNodesMap(type);
        
        nodes.forEach(nodeId => {
          let nodeLabel = nodeId;
          
          // 从节点映射中获取节点名称
          if (nodesMap && nodesMap[nodeId]) {
            nodeLabel = nodesMap[nodeId];
          }
          
          this.nodeOptions.push({
            value: nodeId,
            label: `${nodeId} - ${nodeLabel}`
          });
        });
      }
    },
    
    loadResourceDetails() {
      if (this.selectedType && this.selectedNodeId) {
        // 加载资源详情数据，改用resource目录下的getNodeResourceDetails函数
        this.loading = true;
        setTimeout(() => {
          this.resourceDetails = getNodeResourceDetails(this.selectedType, this.selectedNodeId);
          this.loading = false;
        }, 500); // 添加500ms延迟以显示加载效果
      } else {
        this.resourceDetails = null;
      }
    },
    
    hasResourceType(type) {
      return this.resourceDetails && this.resourceDetails[type] && this.resourceDetails[type].items.length > 0;
    }
  }
}
</script>

<style scoped>
.resource-view {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.page-header {
  margin-bottom: 20px;
}

.custom-page-header {
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  background-color: #fff;
}

.resource-selector-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.resource-selector-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.resource-selector {
  padding: 10px;
}

.selector-form {
  display: flex;
  align-items: center;
}

.selector-input {
  width: 200px;
}

.resource-content-wrapper {
  margin-bottom: 20px;
}

.resource-content-card {
  border-radius: 8px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.resource-content-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
}

.node-resources-container {
  padding: 10px 0;
}

.select-tip {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  padding: 40px;
}

.resource-details-section {
  margin-top: 30px;
  padding: 0 5px;
}

.divider-title {
  font-size: 16px;
  font-weight: 600;
  color: #606266;
}

.detail-section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #409EFF;
  padding: 5px 0;
  border-bottom: 1px dashed #ebeef5;
}

.custom-tabs {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.custom-table {
  margin-top: 10px;
}

.action-button {
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.4);
}

.status-tag {
  padding: 3px 8px;
  border-radius: 4px;
}

/* 动画过渡效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

/* 适配移动设备 */
@media screen and (max-width: 768px) {
  .resource-view {
    padding: 10px;
  }
  
  .selector-form {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .selector-input {
    width: 100%;
  }
  
  .el-form-item {
    margin-bottom: 10px;
    width: 100%;
  }
}
</style> 