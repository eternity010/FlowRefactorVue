<template>
  <div class="production-refactor-container">
    <div class="page-header">
      <el-page-header @back="goBack" content="生产环节重构" />
    </div>
    
    <div class="content">
      <el-card class="refactor-card">
        <div class="refactor-title">
          <h1>生产环节重构</h1>
          <p class="subtitle">Production Process Refactoring</p>
        </div>
        
        <div class="node-info" v-if="nodeInfo">
          <el-tag type="info" size="medium">节点ID: {{ nodeInfo.nodeId }}</el-tag>
          <el-tag type="primary" size="medium">节点名称: {{ nodeInfo.nodeTitle }}</el-tag>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductionRefactorSimple',
  data() {
    return {
      nodeInfo: null
    }
  },
  created() {
    // 从路由参数中获取节点信息
    this.nodeInfo = {
      nodeId: this.$route.query.nodeId || '',
      nodeTitle: this.$route.query.nodeTitle || '未知节点',
      nodeType: this.$route.query.nodeType || 'production'
    }
    
    console.log('🏭 生产环节重构页面初始化:', this.nodeInfo);
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.production-refactor-container {
  padding: 20px;
  height: 100%;
}

.page-header {
  margin-bottom: 20px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.refactor-card {
  text-align: center;
  padding: 40px 20px;
}

.refactor-title h1 {
  font-size: 32px;
  color: #1f2937;
  margin: 0 0 8px 0;
  font-weight: 700;
}

.refactor-title .subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 24px 0;
  font-style: italic;
}

.node-info {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.node-info .el-tag {
  font-size: 14px;
  padding: 8px 16px;
}
</style>
