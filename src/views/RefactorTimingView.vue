<template>
  <div class="refactor-timing-container">
    
    <!-- 顶部信息卡片区域 -->
    <el-card class="overview-card">
      <div slot="header" class="overview-header">
        <span>全局监控数据</span>
        <el-tag size="small" type="info">更新时间: {{ currentDate }}</el-tag>
      </div>
      <el-row :gutter="20" class="info-cards">
        <!-- 风险数据卡片 -->
        <el-col :span="8">
          <div class="data-panel risk-panel clickable" @click="showRiskDialog">
            <div class="card-header">
              <i class="el-icon-warning"></i>
              <span>风险监控</span>
            </div>
            <div class="card-content">
              <div class="main-value">{{ riskData.totalRisks }}</div>
              <div class="sub-info">
                <div class="info-item">
                  <span class="label">高风险:</span>
                  <span class="value high-risk">{{ riskData.highRisks }}</span>
                </div>
                <div class="info-item">
                  <span class="label">中风险:</span>
                  <span class="value medium-risk">{{ riskData.mediumRisks }}</span>
                </div>
                <div class="info-item">
                  <span class="label">低风险:</span>
                  <span class="value low-risk">{{ riskData.lowRisks }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        
        <!-- 子流程数据卡片 -->
        <el-col :span="8">
          <div class="data-panel subprocess-panel clickable" @click="goToSubProcessManagement">
            <div class="card-header">
              <i class="el-icon-s-operation"></i>
              <span>子流程数据</span>
            </div>
            <div class="card-content">
              <div class="main-value">{{ subprocessData.totalSubprocesses }}</div>
              <div class="sub-info">
                <div class="info-item">
                  <span class="label">运维环节:</span>
                  <span class="value">{{ subprocessData.operationCount }}</span>
                </div>
                <div class="info-item">
                  <span class="label">采购环节:</span>
                  <span class="value">{{ subprocessData.purchaseCount }}</span>
                </div>
                <div class="info-item">
                  <span class="label">生产环节:</span>
                  <span class="value">{{ subprocessData.productionCount }}</span>
                </div>
                <div class="info-item">
                  <span class="label">营销环节:</span>
                  <span class="value">{{ subprocessData.marketingCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        
        <!-- 重构复杂度数据卡片 -->
        <el-col :span="8">
          <div class="data-panel complexity-panel">
            <div class="card-header">
              <i class="el-icon-time"></i>
              <span>重构复杂度</span>
            </div>
            <div class="card-content">
              <div class="main-value">{{ complexityData.overallScore }}/10</div>
              <div class="sub-info">
                <div class="info-item">
                  <span class="label">代码复杂度:</span>
                  <span class="value">{{ complexityData.codeComplexity }}/10</span>
                </div>
                <div class="info-item">
                  <span class="label">业务耦合度:</span>
                  <span class="value">{{ complexityData.businessCoupling }}/10</span>
                </div>
                <div class="info-item">
                  <span class="label">资源消耗:</span>
                  <span class="value">{{ complexityData.resourceUsage }}/10</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 数据流向指示区域 -->
    <div class="data-flow-container">
      <div class="arrow-wrapper">
        <i class="el-icon-arrow-down arrow-icon main-arrow"></i>
        <i class="el-icon-arrow-down arrow-icon echo-arrow1"></i>
        <i class="el-icon-arrow-down arrow-icon echo-arrow2"></i>
      </div>
    </div>

    <!-- 神经网络展示区域 -->
    <el-card class="neural-network-card">
      <div slot="header" class="neural-header">
        <span>神经网络分析结果</span>
        <el-tag size="small" type="success">算法版本: v2.5.1</el-tag>
      </div>
      
      <div class="neural-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="network-info-panel">
              <div class="panel-header">
                <i class="el-icon-monitor"></i>
                <span>模型运行状态</span>
              </div>
              <div class="panel-content">
                <div class="info-row">
                  <span class="info-label">当前状态:</span>
                  <span class="info-value status-active">
                    <i class="el-icon-success"></i> {{ modelStatus.isRunning ? '正在运行' : '已停止' }}
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">运行时长:</span>
                  <span class="info-value">{{ modelStatus.runningTime }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">CPU使用率:</span>
                  <span class="info-value">
                    <el-progress :percentage="modelStatus.cpuUsage" :stroke-width="10"></el-progress>
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">内存使用:</span>
                  <span class="info-value">{{ modelStatus.memoryUsage }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">处理速度:</span>
                  <span class="info-value">{{ modelStatus.processingSpeed }}</span>
                </div>
              </div>
            </div>
          </el-col>
          
          <el-col :span="8">
            <div class="network-result-panel">
              <div class="panel-header">
                <i class="el-icon-data-analysis"></i>
                <span>分析结果</span>
              </div>
              <div class="panel-content">
                <div class="result-item">
                  <div class="progress-label">
                    <span>重构必要性:</span>
                    <span class="progress-value high">{{ analysisResults.refactorNecessity }}%</span>
                  </div>
                  <el-progress :percentage="analysisResults.refactorNecessity" :color="'#F56C6C'" :show-text="false"></el-progress>
                </div>
                <div class="result-item">
                  <div class="progress-label">
                    <span>推荐优先级:</span>
                    <span class="progress-value high">高</span>
                  </div>
                  <el-progress :percentage="analysisResults.recommendedPriority" :color="'#F56C6C'" :show-text="false"></el-progress>
                </div>
                <div class="result-item">
                  <div class="progress-label">
                    <span>资源需求:</span>
                    <span class="progress-value medium">中等</span>
                  </div>
                  <el-progress :percentage="analysisResults.resourceRequirement" :color="'#E6A23C'" :show-text="false"></el-progress>
                </div>
                <div class="result-item">
                  <div class="progress-label">
                    <span>实施难度:</span>
                    <span class="progress-value medium">中等</span>
                  </div>
                  <el-progress :percentage="analysisResults.implementationDifficulty" :color="'#E6A23C'" :show-text="false"></el-progress>
                </div>
              </div>
            </div>
          </el-col>
          
          <el-col :span="8">
            <div class="network-recommendation-panel clickable" @click="goToProcessOptimization">
              <div class="panel-header">
                <i class="el-icon-s-claim"></i>
                <span>重构建议</span>
                <i class="el-icon-right header-arrow"></i>
              </div>
              <div class="panel-content">
                <div class="recommendation-list">
                  <div class="recommendation-item" v-for="(item, index) in recommendations" :key="index">
                    <el-tag size="small" :type="item.type" effect="dark">{{ item.priority }}</el-tag>
                    <span>{{ item.content }}</span>
                  </div>
                </div>
                <div class="recommendation-summary">
                  <div class="summary-title">总体建议</div>
                  <div class="summary-content">
                    {{ overallRecommendation }}
                  </div>
                </div>
              </div>
              <!-- 添加点击提示 -->
              <div class="click-hint">
                <i class="el-icon-right"></i>
                <span>点击查看流程重构优化</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    
    <!-- 底部按钮区域 -->
    <div class="action-footer">
      <el-button type="primary" size="large" icon="el-icon-refresh" @click="handleManualAnalysis">
        手动分析重构时机
      </el-button>
      <el-button size="large" icon="el-icon-document" @click="exportAnalysisReport">
        导出分析报告
      </el-button>
    </div>

    <!-- 风险监控弹窗组件 -->
    <RiskMonitoringDialog
      :visible.sync="riskDialogVisible"
      :risk-data="riskData"
      @view-details="goToRiskMonitoring"
      @close="handleCloseRiskDialog" />
  </div>
</template>

<script>
import moment1Data from '@/data/RefactorTimingData';
import { moment2Data } from '@/data/RefactorTimingData';
import RiskMonitoringDialog from '@/components/RiskMonitoringDialog.vue';

export default {
  name: 'RefactorTimingView',
  components: {
    RiskMonitoringDialog
  },
  data() {
    return {
      currentDate: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      // 从数据文件中导入时刻1数据
      riskData: moment1Data.riskData,
      subprocessData: moment1Data.subprocessData,
      complexityData: moment1Data.complexityData,
      modelStatus: moment1Data.modelStatus,
      analysisResults: moment1Data.analysisResults,
      recommendations: moment1Data.recommendations,
      overallRecommendation: moment1Data.overallRecommendation,
      // 弹窗相关
      riskDialogVisible: false
    }
  },
  methods: {
    // 显示风险弹窗
    showRiskDialog() {
      this.riskDialogVisible = true;
    },
    // 关闭风险弹窗
    handleCloseRiskDialog() {
      this.riskDialogVisible = false;
    },
    // 跳转到风险监控页面
    goToRiskMonitoring() {
      this.$router.push('/home/risk');
    },
    goToSubProcessManagement() {
      this.$router.push('/home/sub-process');
    },
    // 跳转到流程重构优化页面
    goToProcessOptimization() {
      this.$router.push('/home/process-optimization');
    },
    handleManualAnalysis() {
      this.$message({
        message: '正在启动手动分析...',
        type: 'info',
        duration: 1000
      });
      
      // 显示加载状态
      const loading = this.$loading({
        lock: true,
        text: '神经网络分析中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      
      // 模拟分析过程
      setTimeout(() => {
        // 更新为时刻2数据
        this.riskData = moment2Data.riskData;
        this.subprocessData = moment2Data.subprocessData;
        this.complexityData = moment2Data.complexityData;
        this.modelStatus = moment2Data.modelStatus;
        this.analysisResults = moment2Data.analysisResults;
        this.recommendations = moment2Data.recommendations;
        this.overallRecommendation = moment2Data.overallRecommendation;
        
        // 关闭加载状态
        loading.close();
        
        // 显示成功消息
        this.$message({
          message: '重构时机分析完成',
          type: 'success'
        });
      }, 2000);
    },
    exportAnalysisReport() {
      this.$message({
        message: '分析报告已导出',
        type: 'success'
      });
    }
  }
}
</script>

<style scoped>
.refactor-timing-container {
  padding-top: 10px;
  padding-right: 5px;
  padding-bottom: 10px;
  padding-left: 5px;
}

.overview-card {
  top: 0;
  width: 100%;
  margin-bottom: 20px;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-cards {
  margin: 10px 0;
}

.data-panel {
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 15px;
  height: 100%;
  border-left: 4px solid #dcdfe6;
}

.risk-panel {
  border-left-color: #F56C6C;
}

.subprocess-panel {
  border-left-color: #409EFF;
}

.complexity-panel {
  border-left-color: #E6A23C;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
}

.card-header i {
  margin-right: 8px;
  font-size: 20px;
}

.card-content {
  padding: 0 10px;
}

.main-value {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
}

.sub-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
}

.label {
  color: #606266;
}

.value {
  font-weight: 500;
}

.high-risk {
  color: #F56C6C;
}

.medium-risk {
  color: #E6A23C;
}

.low-risk {
  color: #67C23A;
}

/* 卡片主题颜色 */
.risk-panel .card-header i {
  color: #F56C6C;
}

.subprocess-panel .card-header i {
  color: #409EFF;
}

.complexity-panel .card-header i {
  color: #E6A23C;
}

.content-area {
  margin-top: 20px;
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.clickable {
  cursor: pointer;
  transition: all 0.3s;
}

.clickable:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.data-flow-container {
  text-align: center;
  margin: -5px 0 -5px;
  padding: 0;
  position: relative;
}

.arrow-wrapper {
  position: relative;
  height: 20px;
  width: 20px;
  margin: -10px auto -5px;
}

.arrow-icon {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: #409EFF;
}

.main-arrow {
  font-size: 40px;
  z-index: 3;
  animation: pulse 2s infinite;
}

.echo-arrow1 {
  font-size: 40px;
  opacity: 0.6;
  z-index: 2;
  animation: echo1 2s infinite;
}

.echo-arrow2 {
  font-size: 40px;
  opacity: 0.3;
  z-index: 1;
  animation: echo2 2s infinite;
}

@keyframes pulse {
  0% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(10px);
  }
  100% {
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes echo1 {
  0% {
    transform: translateX(-50%) translateY(-5px);
    opacity: 0;
  }
  30% {
    transform: translateX(-50%) translateY(5px);
    opacity: 0.6;
  }
  60%, 100% {
    transform: translateX(-50%) translateY(15px);
    opacity: 0;
  }
}

@keyframes echo2 {
  0% {
    transform: translateX(-50%) translateY(-8px);
    opacity: 0;
  }
  40% {
    transform: translateX(-50%) translateY(8px); 
    opacity: 0.3;
  }
  70%, 100% {
    transform: translateX(-50%) translateY(20px);
    opacity: 0;
  }
}

.neural-network-card {
  margin-top: 20px;
}

.neural-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.neural-content {
  padding: 10px 0;
}

.network-info-panel,
.network-result-panel,
.network-recommendation-panel {
  height: 100%;
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 15px;
  border-left: 4px solid #dcdfe6;
}

.network-info-panel {
  border-left-color: #409EFF;
}

.network-result-panel {
  border-left-color: #E6A23C;
}

.network-recommendation-panel {
  border-left-color: #67C23A;
  position: relative;
  transition: all 0.3s ease;
}

.network-recommendation-panel.clickable:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(103, 194, 58, 0.15);
  cursor: pointer;
}

.click-hint {
  position: absolute;
  bottom: 8px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #67C23A;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.network-recommendation-panel.clickable:hover .click-hint {
  opacity: 1;
}

.click-hint i {
  font-size: 10px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
}

.panel-header > span {
  margin-left: 8px;
  flex: 1;
}

.header-arrow {
  color: #67C23A;
  font-size: 14px;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.network-recommendation-panel.clickable:hover .header-arrow {
  opacity: 1;
  transform: translateX(3px);
}

.panel-header i {
  margin-right: 8px;
  font-size: 20px;
}

.network-info-panel .panel-header i {
  color: #409EFF;
}

.network-result-panel .panel-header i {
  color: #E6A23C;
}

.network-recommendation-panel .panel-header i {
  color: #67C23A;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.info-label {
  color: #606266;
}

.info-value {
  font-weight: 500;
}

.accuracy {
  color: #409EFF;
  font-weight: bold;
}

.result-item {
  margin-bottom: 15px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.progress-value {
  font-weight: bold;
}

.progress-value.high {
  color: #F56C6C;
}

.progress-value.medium {
  color: #E6A23C;
}

.progress-value.low {
  color: #67C23A;
}

.recommendation-list {
  margin-bottom: 15px;
}

.recommendation-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.recommendation-summary {
  background-color: #f0f9eb;
  padding: 10px;
  border-radius: 4px;
  border-left: 3px solid #67C23A;
}

.summary-title {
  font-weight: bold;
  color: #67C23A;
  margin-bottom: 5px;
}

.summary-content {
  font-size: 13px;
  line-height: 1.5;
  color: #606266;
}

.status-active {
  color: #67C23A;
  display: flex;
  align-items: center;
}

.status-active i {
  margin-right: 5px;
}

.action-footer {
  margin-top: 30px;
  text-align: center;
  padding: 20px 0;
  border-top: 1px dashed #DCDFE6;
}


</style> 