<template>
  <div class="subprocess-container">
    <!-- 环节选择区域 -->
    <div class="process-tabs">
      <div 
        v-for="tab in processTabs" 
        :key="tab.key"
        :class="['process-tab', { active: currentProcess === tab.key }]"
        @click="switchProcess(tab.key)"
      >
        {{ tab.label }}
      </div>
    </div>
    
    <!-- 流程图展示区域 -->
    <div class="flow-container">
      <!-- 运维环节 -->
      <operation-flow v-if="currentProcess === 'operation'"></operation-flow>
      
      <!-- 采购环节 -->
      <purchase-flow v-if="currentProcess === 'purchase'"></purchase-flow>
      
      <!-- 生产环节 -->
      <production-flow v-if="currentProcess === 'production'"></production-flow>
      
      <!-- 营销环节 -->
      <marketing-flow v-if="currentProcess === 'marketing'"></marketing-flow>
    </div>
  </div>
</template>

<script>
import OperationFlow from './flows/OperationFlow.vue';
import PurchaseFlow from './flows/PurchaseFlow.vue';
import ProductionFlow from './flows/ProductionFlow.vue';
import MarketingFlow from './flows/MarketingFlow.vue';

export default {
  name: 'SubProcessFlow',
  components: {
    OperationFlow,
    PurchaseFlow,
    ProductionFlow,
    MarketingFlow
  },
  data() {
    return {
      currentProcess: 'purchase',
      processTabs: [
        { key: 'purchase', label: '采购环节' },
        { key: 'production', label: '生产环节' },
        { key: 'marketing', label: '营销环节' },
        { key: 'operation', label: '运维环节' }
      ]
    }
  },
  mounted() {
    // 组件挂载时通知父组件当前选中的环节
    this.$emit('process-changed', this.currentProcess);
  },
  methods: {
    switchProcess(processKey) {
      this.currentProcess = processKey;
      // 触发事件通知父组件
      this.$emit('process-changed', processKey);
    }
  }
};
</script>

<style scoped>
.subprocess-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.process-tabs {
  display: flex;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 20px;
}

.process-tab {
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 2px solid transparent;
  font-size: 14px;
}

.process-tab:hover {
  color: #409eff;
}

.process-tab.active {
  color: #409eff;
  border-bottom-color: #409eff;
  font-weight: 500;
}

.flow-container {
  flex: 1;
  position: relative;
}
</style>