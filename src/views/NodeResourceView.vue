<template>
  <div class="resource-view">
    <div class="page-header">
      <el-page-header @back="goBack" :content="`${nodeTitle} 的资源详情`"></el-page-header>
    </div>
    
    <div class="resource-selector">
      <el-form :inline="true" class="selector-form">
        <el-form-item label="环节">
          <el-select v-model="selectedType" placeholder="选择环节" @change="handleTypeChange">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="节点">
          <el-select v-model="selectedNodeId" placeholder="选择节点" @change="handleNodeChange">
            <el-option v-for="item in nodeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="resource-content">
      <template v-if="selectedType && selectedNodeId">
        <node-resources :type="selectedType" :nodeId="selectedNodeId"></node-resources>
        
        <!-- 资源详细信息区 -->
        <div class="resource-details-section" v-if="resourceDetails">
          <el-divider content-position="left">详细信息</el-divider>
          
          <el-tabs type="border-card">
            <!-- 文档资源详情 -->
            <el-tab-pane label="文档资源" v-if="hasResourceType('documents')">
              <div class="detail-section-title">
                <i class="el-icon-document"></i> 文档资源详情
              </div>
              
              <el-table :data="resourceDetails.documents.items" border style="width: 100%">
                <el-table-column prop="name" label="文档名称" width="200"></el-table-column>
                <el-table-column prop="type" label="类型" width="120"></el-table-column>
                <el-table-column prop="format" label="格式" width="100"></el-table-column>
                <el-table-column prop="lastUpdate" label="最后更新" width="150"></el-table-column>
                <el-table-column prop="size" label="大小" width="100"></el-table-column>
                <el-table-column prop="description" label="说明"></el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-download">下载</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            
            <!-- 人力资源详情 -->
            <el-tab-pane label="人力资源" v-if="hasResourceType('personnel')">
              <div class="detail-section-title">
                <i class="el-icon-user"></i> 人力资源详情
              </div>
              
              <el-table :data="resourceDetails.personnel.items" border style="width: 100%">
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
              
              <el-table :data="resourceDetails.systems.items" border style="width: 100%">
                <el-table-column prop="name" label="系统名称" width="180"></el-table-column>
                <el-table-column prop="type" label="类型" width="120"></el-table-column>
                <el-table-column prop="version" label="版本" width="100"></el-table-column>
                <el-table-column prop="access" label="访问方式" width="180"></el-table-column>
                <el-table-column prop="description" label="说明"></el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-link">访问</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            
            <!-- 设备资源详情 -->
            <el-tab-pane label="设备资源" v-if="hasResourceType('equipment')">
              <div class="detail-section-title">
                <i class="el-icon-cpu"></i> 设备资源详情
              </div>
              
              <el-table :data="resourceDetails.equipment.items" border style="width: 100%">
                <el-table-column prop="name" label="设备名称" width="180"></el-table-column>
                <el-table-column prop="type" label="类型" width="120"></el-table-column>
                <el-table-column prop="model" label="型号" width="150"></el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                  <template slot-scope="scope">
                    <el-tag 
                      :type="scope.row.status === '正常' ? 'success' : scope.row.status === '维护中' ? 'warning' : 'danger'">
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
      </template>
      <template v-else>
        <div class="select-tip">
          <el-empty description="请选择环节和节点以查看资源"></el-empty>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import NodeResources from '@/components/NodeResources.vue';
import { purchaseResources, getNodeResourceDetails } from '@/data/resource';

export default {
  name: 'NodeResourceView',
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
      resourceDetails: null
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
      if (type === 'purchase') {
        const nodes = Object.keys(purchaseResources);
        nodes.forEach(nodeId => {
          // 设置节点显示名称，可以从其他数据源获取
          let nodeLabel = nodeId;
          
          // 临时映射，实际应该从节点数据中获取
          const nodeLabels = {
            'p1': '采购需求',
            'p2': '供应商选择',
            'p3': '价格审批',
            'p4': '签订合同',
            'p5': '货物接收',
            'p6': '质量检验',
            'p7': '入库',
            'p8': '退回处理'
          };
          
          if (nodeLabels[nodeId]) {
            nodeLabel = nodeLabels[nodeId];
          }
          
          this.nodeOptions.push({
            value: nodeId,
            label: `${nodeId} - ${nodeLabel}`
          });
        });
      }
      // 将来可以添加其他环节的节点加载
    },
    
    loadResourceDetails() {
      if (this.selectedType && this.selectedNodeId) {
        // 加载资源详情数据，改用resource目录下的getNodeResourceDetails函数
        this.resourceDetails = getNodeResourceDetails(this.selectedType, this.selectedNodeId);
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
}

.page-header {
  margin-bottom: 20px;
}

.resource-selector {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.selector-form {
  display: flex;
  align-items: center;
}

.resource-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  min-height: 400px;
}

.select-tip {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.resource-details-section {
  margin-top: 30px;
}

.detail-section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #409EFF;
}
</style> 