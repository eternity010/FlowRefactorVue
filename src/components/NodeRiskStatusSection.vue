<template>
  <div class="node-risk-status-section">
    <el-divider content-position="left">
      <i class="el-icon-cpu"></i>
      <span>节点风险状态分析</span>
    </el-divider>

    <!-- 节点风险统计 -->
    <div class="node-risk-statistics">
      <div class="node-stat-card total-nodes">
        <div class="stat-icon">
          <i class="el-icon-data-analysis"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ riskStatistics.totalNodes }}</div>
          <div class="stat-label">总节点数</div>
        </div>
      </div>

      <div class="node-stat-card high-risk-nodes">
        <div class="stat-icon">
          <i class="el-icon-warning"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ riskStatistics.highRiskNodes }}</div>
          <div class="stat-label">高危节点</div>
        </div>
      </div>

      <div class="node-stat-card overall-risk">
        <div class="stat-icon">
          <i class="el-icon-pie-chart"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ riskStatistics.overallRiskLevel }}</div>
          <div class="stat-label">整体风险等级</div>
        </div>
      </div>
    </div>

    <!-- 高危节点列表 -->
    <div v-if="highRiskNodes && highRiskNodes.length > 0" class="high-risk-nodes-list">
      <h4 class="section-subtitle">🔴 高危节点详情</h4>
      <div class="high-risk-node-cards">
        <div
          v-for="node in highRiskNodes"
          :key="node.nodeId"
          class="risk-node-card high-risk">
          <div class="node-header">
            <span class="node-id">{{ node.nodeId }}</span>
            <span class="node-name">{{ node.nodeName }}</span>
            <el-tag size="mini" type="danger">{{ node.riskLevel }}</el-tag>
          </div>
          <div class="node-score">
            <span>风险评分: </span>
            <span class="score-value">{{ node.riskScore }}</span>
          </div>
          <div class="node-factors">
            <span>风险因子: </span>
            <el-tag
              v-for="factor in node.riskFactors"
              :key="factor"
              size="mini"
              type="warning"
              style="margin: 0 2px;">
              {{ factor }}
            </el-tag>
          </div>
          <div class="node-reason">{{ node.riskReason }}</div>
          <div class="node-recommendation">
            <strong>建议:</strong> {{ node.recommendation }}
          </div>
        </div>
      </div>
    </div>

    <!-- 关键风险路径 -->
    <div class="critical-path-section">
      <el-alert
        title="关键风险路径"
        type="warning"
        :closable="false"
        show-icon>
        <div class="critical-path-content">
          <div class="path-text">{{ criticalPath }}</div>
          <div class="main-recommendation">
            <strong>主要建议:</strong> {{ mainRecommendation }}
          </div>
        </div>
      </el-alert>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NodeRiskStatusSection',
  props: {
    // 风险统计数据
    riskStatistics: {
      type: Object,
      required: true,
      validator(value) {
        return typeof value === 'object' &&
               typeof value.totalNodes === 'number' &&
               typeof value.highRiskNodes === 'number' &&
               typeof value.overallRiskLevel !== 'undefined';
      }
    },
    // 高危节点列表
    highRiskNodes: {
      type: Array,
      default: () => []
    },
    // 关键风险路径
    criticalPath: {
      type: String,
      default: ''
    },
    // 主要建议
    mainRecommendation: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.node-risk-status-section {
  margin-top: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.section-subtitle {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin: 20px 0 15px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 节点风险统计卡片 */
.node-risk-statistics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

.node-stat-card {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.node-stat-card:hover {
  transform: translateY(-2px);
}

.node-stat-card.total-nodes {
  background: linear-gradient(135deg, #6c757d, #868e96);
  color: white;
}

.node-stat-card.high-risk-nodes {
  background: linear-gradient(135deg, #dc3545, #e55353);
  color: white;
}

.node-stat-card.overall-risk {
  background: linear-gradient(135deg, #ffc107, #ffcd39);
  color: white;
}

.stat-icon {
  margin-right: 15px;
}

.stat-icon i {
  font-size: 24px;
}

/* 高危节点卡片列表 */
.high-risk-nodes-list {
  margin-bottom: 25px;
}

.high-risk-node-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 15px;
}

.risk-node-card {
  padding: 20px;
  border-radius: 8px;
  background: white;
  border-left: 4px solid #dc3545;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.risk-node-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.risk-node-card.high-risk {
  border-left-color: #dc3545;
  background: linear-gradient(135deg, #fff 0%, #fff5f5 100%);
}

.node-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.node-id {
  font-weight: bold;
  color: #409EFF;
  background: #e3f2fd;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.node-name {
  flex: 1;
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.node-score {
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

.score-value {
  font-weight: bold;
  color: #dc3545;
}

.node-factors {
  margin-bottom: 10px;
  font-size: 13px;
  color: #606266;
}

.node-reason {
  margin-bottom: 10px;
  font-size: 13px;
  line-height: 1.5;
  color: #495057;
  background: #f8f9fa;
  padding: 8px;
  border-radius: 4px;
}

.node-recommendation {
  font-size: 13px;
  line-height: 1.5;
  color: #495057;
  background: #e8f5e9;
  padding: 8px;
  border-radius: 4px;
  border-left: 3px solid #28a745;
}

/* 关键风险路径区域 */
.critical-path-section {
  margin-top: 20px;
}

.critical-path-content {
  padding: 10px 0;
}

.path-text {
  font-weight: bold;
  color: #e67e22;
  margin-bottom: 10px;
  font-size: 14px;
}

.main-recommendation {
  color: #495057;
  line-height: 1.6;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .node-risk-statistics {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .high-risk-node-cards {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .node-stat-card {
    padding: 12px;
  }

  .risk-node-card {
    padding: 15px;
  }

  .node-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>
