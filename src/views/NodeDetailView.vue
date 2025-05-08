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
          
          <!-- 这里可以添加更多节点详细信息 -->
          <div class="empty-content">
            <el-empty description="暂无更多详细信息" />
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NodeDetailView',
  data() {
    return {
      nodeId: '',
      nodeTitle: '',
      nodeType: ''
    }
  },
  created() {
    // 从路由查询参数中获取节点ID和标题
    this.nodeId = this.$route.query.id || '';
    this.nodeTitle = this.$route.query.title || '节点详情';
    this.nodeType = this.$route.query.type || '';
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
</style> 