<template>
  <div class="parameter-summary" v-if="visible">
    <el-alert
      title="当前神经网络参数配置"
      type="info"
      :closable="false"
      show-icon>
      <template slot="title">
        <span style="font-size: 14px; font-weight: bold;">当前参数配置</span>
        <span v-if="lastUpdated" style="font-size: 12px; color: #909399; font-weight: normal; margin-left: 10px;">
          (更新于: {{ formatDateTime(lastUpdated) }})
        </span>
      </template>
      <div class="param-summary-content" v-loading="loading">
        <span class="param-item">地缘政治影响: {{ params.geoPoliticalWeight }}</span>
        <span class="param-item">价格波动敏感度: {{ params.marketVolatilityFactor }}</span>
        <span class="param-item">备用供应商覆盖: {{ (params.backupSupplierRatio * 100).toFixed(0) }}%</span>
        <span class="param-item">路径重评估: {{ params.routeReevalFrequency }}天</span>
        <span class="param-item">成本延误权衡: {{ params.costDelayTradeoff }}</span>
        <span class="param-item">节拍波动容忍: ±{{ (params.taktTimeVariance * 100).toFixed(0) }}%</span>
        <span class="param-item">加班时长上限: {{ params.overtimeCostCap }}小时/月</span>
      </div>
    </el-alert>
  </div>
</template>

<script>
export default {
  name: 'ParameterSummary',
  props: {
    // 控制组件显示
    visible: {
      type: Boolean,
      default: false
    },
    // 神经网络参数对象
    params: {
      type: Object,
      default: () => ({
        geoPoliticalWeight: 1.0,
        marketVolatilityFactor: 0.8,
        backupSupplierRatio: 0.3,
        routeReevalFrequency: 7,
        costDelayTradeoff: 1.2,
        taktTimeVariance: 0.05,
        overtimeCostCap: 200
      })
    },
    // 最后更新时间
    lastUpdated: {
      type: [String, Date],
      default: null
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 格式化日期时间
    formatDateTime(dateString) {
      if (!dateString) return '未知';
      try {
        return new Date(dateString).toLocaleString('zh-CN');
      } catch (error) {
        return '未知';
      }
    }
  }
}
</script>

<style scoped>
.parameter-summary {
  margin-top: 25px;
  animation: fadeInUp 0.5s ease-out;
}

.param-summary-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 10px;
  padding: 0;
}

.param-item {
  font-size: 12px;
  color: #606266;
  background-color: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  border-left: 3px solid #409EFF;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 1024px) and (min-width: 769px) {
  .param-summary-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .param-summary-content {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .param-item {
    font-size: 11px;
  }
}
</style>
