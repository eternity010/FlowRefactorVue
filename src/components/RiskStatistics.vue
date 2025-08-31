<template>
  <div class="risk-statistics-container">
    <!-- 风险等级统计 -->
    <div class="risk-statistics">
      <!-- 高风险统计卡片 -->
      <div class="stat-card high-risk">
        <div class="stat-icon">
          <i class="el-icon-warning"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.highRiskCount }}</div>
          <div class="stat-label">高风险因素</div>
        </div>
      </div>

      <!-- 中风险统计卡片 -->
      <div class="stat-card medium-risk">
        <div class="stat-icon">
          <i class="el-icon-info"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.mediumRiskCount }}</div>
          <div class="stat-label">中风险因素</div>
        </div>
      </div>

      <!-- 低风险统计卡片 -->
      <div class="stat-card low-risk">
        <div class="stat-icon">
          <i class="el-icon-success"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.lowRiskCount }}</div>
          <div class="stat-label">低风险因素</div>
        </div>
      </div>

      <!-- 总风险统计卡片 -->
      <div class="stat-card total">
        <div class="stat-icon">
          <i class="el-icon-data-analysis"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalSteps }}</div>
          <div class="stat-label">总风险因素数</div>
        </div>
      </div>
    </div>

    <!-- 风险详情 -->
    <div class="risk-details">
      <el-tabs v-model="activeRiskTab" type="border-card">
        <el-tab-pane label="高风险因素" name="high">
          <div class="risk-step-list">
            <div v-for="step in riskData.highRiskSteps" :key="step.id" class="risk-step-item high">
              <div class="step-header">
                <span class="step-id">{{ step.id }}</span>
                <span class="step-name">{{ step.name }}</span>
                <el-tag size="mini" type="danger">高风险</el-tag>
              </div>
              <div class="step-description">{{ step.description }}</div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="中风险因素" name="medium">
          <div class="risk-step-list">
            <div v-for="step in riskData.mediumRiskSteps" :key="step.id" class="risk-step-item medium">
              <div class="step-header">
                <span class="step-id">{{ step.id }}</span>
                <span class="step-name">{{ step.name }}</span>
                <el-tag size="mini" type="warning">中风险</el-tag>
              </div>
              <div class="step-description">{{ step.description }}</div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="低风险因素" name="low">
          <div class="risk-step-list">
            <div v-for="step in riskData.lowRiskSteps" :key="step.id" class="risk-step-item low">
              <div class="step-header">
                <span class="step-id">{{ step.id }}</span>
                <span class="step-name">{{ step.name }}</span>
                <el-tag size="mini" type="success">低风险</el-tag>
              </div>
              <div class="step-description">{{ step.description }}</div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 分析建议 -->
    <div class="risk-recommendations">
      <el-alert
        title="优化建议"
        type="info"
        :closable="false"
        show-icon>
        <div class="recommendation-content">
          <div class="recommendation-item">
            <strong>关键风险环节:</strong> {{ riskData.criticalStep }}
          </div>
          <div class="recommendation-item">
            <strong>主要建议:</strong> {{ riskData.recommendation }}
          </div>
        </div>
      </el-alert>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RiskStatistics',
  props: {
    // 风险统计数据
    stats: {
      type: Object,
      required: true,
      validator(value) {
        return typeof value === 'object' &&
               typeof value.highRiskCount === 'number' &&
               typeof value.mediumRiskCount === 'number' &&
               typeof value.lowRiskCount === 'number' &&
               typeof value.totalSteps === 'number';
      }
    },
    // 风险详情数据
    riskData: {
      type: Object,
      required: true,
      validator(value) {
        return typeof value === 'object' &&
               Array.isArray(value.highRiskSteps) &&
               Array.isArray(value.mediumRiskSteps) &&
               Array.isArray(value.lowRiskSteps) &&
               typeof value.criticalStep === 'string' &&
               typeof value.recommendation === 'string';
      }
    },
    // 默认激活的标签页
    defaultActiveTab: {
      type: String,
      default: 'high'
    }
  },
  data() {
    return {
      activeRiskTab: this.defaultActiveTab
    }
  },
  watch: {
    defaultActiveTab(newVal) {
      this.activeRiskTab = newVal;
    }
  }
}
</script>

<style scoped>
.risk-statistics-container {
  width: 100%;
}

/* 风险统计卡片区域 */
.risk-statistics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card.high-risk {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
}

.stat-card.medium-risk {
  background: linear-gradient(135deg, #ffa726, #ffb74d);
  color: white;
}

.stat-card.low-risk {
  background: linear-gradient(135deg, #66bb6a, #81c784);
  color: white;
}

.stat-card.total {
  background: linear-gradient(135deg, #42a5f5, #64b5f6);
  color: white;
}

.stat-icon {
  margin-right: 15px;
}

.stat-icon i {
  font-size: 32px;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .risk-statistics {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .stat-card {
    padding: 15px;
  }

  .stat-icon i {
    font-size: 24px;
  }

  .stat-number {
    font-size: 20px;
  }

  .stat-label {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .risk-statistics {
    grid-template-columns: 1fr;
  }
}

/* 风险详情区域 */
.risk-details {
  margin-bottom: 30px;
}

.risk-step-list {
  max-height: 400px;
  overflow-y: auto;
}

.risk-step-item {
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  border-left: 4px solid;
  background-color: #f8f9fa;
}

.risk-step-item.high {
  border-left-color: #f56c6c;
  background-color: #fef0f0;
}

.risk-step-item.medium {
  border-left-color: #e6a23c;
  background-color: #fdf6ec;
}

.risk-step-item.low {
  border-left-color: #67c23a;
  background-color: #f0f9ff;
}

.step-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.step-id {
  font-weight: bold;
  color: #409EFF;
  margin-right: 10px;
  min-width: 60px;
}

.step-name {
  flex: 1;
  font-weight: 600;
  color: #303133;
}

.step-description {
  color: #606266;
  line-height: 1.5;
  font-size: 14px;
}

/* 分析建议区域 */
.risk-recommendations {
  margin-bottom: 30px;
}

.recommendation-content {
  padding: 10px 0;
}

.recommendation-item {
  margin-bottom: 10px;
  line-height: 1.6;
}

.recommendation-item:last-child {
  margin-bottom: 0;
}

.recommendation-item strong {
  color: #409EFF;
}

/* 响应式设计更新 */
@media (max-width: 768px) {
  .risk-statistics {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .stat-card {
    padding: 15px;
  }

  .stat-icon i {
    font-size: 24px;
  }

  .stat-number {
    font-size: 20px;
  }

  .stat-label {
    font-size: 12px;
  }

  .step-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .step-id {
    margin-right: 0;
  }
}

@media (max-width: 480px) {
  .risk-statistics {
    grid-template-columns: 1fr;
  }

  .step-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .step-id {
    margin-right: 0;
  }
}
</style>
