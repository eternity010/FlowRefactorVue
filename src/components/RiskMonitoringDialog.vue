<template>
  <el-dialog
    title="风险监控详情"
    :visible.sync="dialogVisible"
    width="80%"
    :before-close="handleClose">
    
    <div class="risk-dialog-content">
      <!-- 风险统计概览 -->
      <div class="risk-overview">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="overview-item">
              <div class="overview-title">总风险数</div>
              <div class="overview-value total">{{ riskData.totalRisks }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="overview-item">
              <div class="overview-title">高风险</div>
              <div class="overview-value high">{{ riskData.highRisks }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="overview-item">
              <div class="overview-title">中风险</div>
              <div class="overview-value medium">{{ riskData.mediumRisks }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="overview-item">
              <div class="overview-title">低风险</div>
              <div class="overview-value low">{{ riskData.lowRisks }}</div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 风险事项列表 -->
      <div class="risk-list">
        <div class="risk-list-header">
          <h3>风险事项清单</h3>
          <el-button type="text" @click="filterHighRisks">
            {{ showOnlyHighRisks ? '显示全部' : '仅显示高风险' }}
          </el-button>
        </div>
        
        <div class="risk-items">
          <div 
            v-for="risk in filteredRiskDetails" 
            :key="risk.id" 
            class="risk-item"
            :class="'risk-' + risk.level">
            
            <div class="risk-item-header">
              <div class="risk-title">
                <el-tag 
                  :type="getRiskTagType(risk.level)" 
                  size="small">
                  {{ getRiskLevelText(risk.level) }}
                </el-tag>
                <span class="risk-name">{{ risk.name }}</span>
                <span class="risk-type">{{ risk.type }}</span>
              </div>
              <div class="risk-meta">
                <span class="risk-probability">概率: {{ risk.probability }}</span>
                <span class="risk-dept">{{ risk.responsibleDept }}</span>
              </div>
            </div>
            
            <div class="risk-item-body">
              <div class="risk-description">{{ risk.description }}</div>
              <div class="risk-impact">
                <strong>影响:</strong> {{ risk.impact }}
              </div>
              <div class="risk-status-info">
                <el-tag size="mini" :type="getStatusTagType(risk.status)">
                  {{ risk.status }}
                </el-tag>
                <span class="detection-time">检测时间: {{ risk.detectionTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
      <el-button type="primary" @click="handleViewDetails">查看详情</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'RiskMonitoringDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    riskData: {
      type: Object,
      required: true,
      default: () => ({
        totalRisks: 0,
        highRisks: 0,
        mediumRisks: 0,
        lowRisks: 0,
        riskDetails: []
      })
    }
  },
  data() {
    return {
      showOnlyHighRisks: false
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit('update:visible', value);
      }
    },
    filteredRiskDetails() {
      if (this.showOnlyHighRisks) {
        return this.riskData.riskDetails.filter(risk => risk.level === 'high');
      }
      return this.riskData.riskDetails;
    }
  },
  methods: {
    // 关闭弹窗
    handleClose() {
      this.showOnlyHighRisks = false;
      this.$emit('update:visible', false);
      this.$emit('close');
    },
    // 筛选高风险
    filterHighRisks() {
      this.showOnlyHighRisks = !this.showOnlyHighRisks;
    },
    // 查看详情
    handleViewDetails() {
      this.$emit('view-details');
      this.handleClose();
    },
    // 获取风险等级标签类型
    getRiskTagType(level) {
      const tagTypes = {
        'high': 'danger',
        'medium': 'warning', 
        'low': 'success'
      };
      return tagTypes[level] || 'info';
    },
    // 获取风险等级文本
    getRiskLevelText(level) {
      const levelTexts = {
        'high': '高风险',
        'medium': '中风险',
        'low': '低风险'
      };
      return levelTexts[level] || '未知';
    },
    // 获取状态标签类型
    getStatusTagType(status) {
      const statusTypes = {
        '待处理': 'danger',
        '处理中': 'warning',
        '监控中': 'info',
        '制定应对方案': 'primary',
        '评估升级方案': 'warning',
        '寻找替代方案': 'warning',
        '多元化供应商开发': 'primary',
        '制定改进计划': 'primary',
        '已制定补充计划': 'success',
        '制定应对策略': 'primary',
        '安排培训计划': 'success',
        '制定弹性生产方案': 'success',
        '正常跟踪': 'success'
      };
      return statusTypes[status] || 'info';
    }
  }
}
</script>

<style scoped>
/* 风险弹窗样式 */
.risk-dialog-content {
  max-height: 70vh;
  overflow-y: auto;
}

.risk-overview {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.overview-item {
  text-align: center;
  padding: 10px;
}

.overview-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.overview-value {
  font-size: 24px;
  font-weight: bold;
}

.overview-value.total {
  color: #409EFF;
}

.overview-value.high {
  color: #F56C6C;
}

.overview-value.medium {
  color: #E6A23C;
}

.overview-value.low {
  color: #67C23A;
}

.risk-list {
  margin-top: 20px;
}

.risk-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #EBEEF5;
}

.risk-list-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.risk-items {
  max-height: 400px;
  overflow-y: auto;
}

.risk-item {
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 4px;
  border-left: 4px solid #DCDFE6;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.risk-item.risk-high {
  border-left-color: #F56C6C;
  background-color: #fef0f0;
}

.risk-item.risk-medium {
  border-left-color: #E6A23C;
  background-color: #fdf6ec;
}

.risk-item.risk-low {
  border-left-color: #67C23A;
  background-color: #f0f9eb;
}

.risk-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.risk-title {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.risk-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.risk-type {
  font-size: 12px;
  color: #909399;
  background-color: #F2F6FC;
  padding: 2px 8px;
  border-radius: 12px;
}

.risk-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  font-size: 12px;
  color: #606266;
}

.risk-probability {
  font-weight: 500;
}

.risk-dept {
  color: #909399;
}

.risk-item-body {
  line-height: 1.6;
}

.risk-description {
  color: #606266;
  margin-bottom: 8px;
  font-size: 14px;
}

.risk-impact {
  color: #303133;
  margin-bottom: 10px;
  font-size: 14px;
}

.risk-status-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detection-time {
  font-size: 12px;
  color: #909399;
}

.dialog-footer {
  text-align: right;
  padding-top: 15px;
  border-top: 1px solid #EBEEF5;
}
</style> 