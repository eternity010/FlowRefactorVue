<template>
  <div class="purchase-refactor2-container">
    <div class="header">
      <el-page-header @back="goBack" content="供应商画像分析" />
    </div>

    <!-- 页面内容待开发 -->
  </div>
</template>

<script>
export default {
  name: 'PurchaseRefactor2',
  data() {
    return {
      nodeId: '',
      nodeTitle: '',
      nodeType: '',
      modelRunBatch: ''
    };
  },
  created() {
    // 获取路由参数
    this.nodeId = this.$route.query.nodeId || '';
    this.nodeTitle = this.$route.query.nodeTitle || '';
    this.nodeType = this.$route.query.nodeType || '';
    this.modelRunBatch = this.$route.query.modelRunBatch || '2025-10-12_TSY_HSR_01';
    
    console.log('📋 供应商画像页面参数:', {
      nodeId: this.nodeId,
      nodeTitle: this.nodeTitle,
      nodeType: this.nodeType,
      modelRunBatch: this.modelRunBatch
    });
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.purchase-refactor2-container {
  padding: 20px;
  height: 100%;
  background: #f5f7fa;
}

.header {
  margin-bottom: 20px;
}
</style>

