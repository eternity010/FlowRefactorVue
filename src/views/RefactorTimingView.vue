<template>
  <div class="refactor-timing-container">
    
    <!-- 顶部信息卡片区域 -->
    <el-card class="overview-card">
      <div slot="header" class="overview-header">
        <span>全局监控数据</span>
        <el-tag size="small" type="info">更新时间: {{ currentDate }}</el-tag>
      </div>
      <el-row :gutter="20" class="info-cards">
        <!-- 大模型联网状态卡片 -->
        <el-col :span="6">
          <div class="data-panel ai-status-panel clickable" @click="handleAIDataCollection">
            <div class="card-header">
              <i class="el-icon-connection"></i>
              <span>大模型联网收集数据</span>
            </div>
            <div class="card-content">
              <div class="main-value">
                <el-tag :type="aiCollectionStatus.enabled ? 'success' : 'info'" size="medium">
                  {{ aiCollectionStatus.enabled ? '已启用' : '未启用' }}
                </el-tag>
              </div>
              <div class="sub-info">
                <div class="info-item">
                  <span class="label">最后收集时间:</span>
                  <span class="value">{{ aiCollectionStatus.lastCollectionTime }}</span>
                </div>
                <div class="info-item">
                  <span class="label">收集的信息源:</span>
                  <span class="value">{{ aiCollectionStatus.collectedSources }}个</span>
                </div>
                <div class="info-item">
                  <span class="label">数据状态:</span>
                  <span class="value" :class="aiCollectionStatus.dataFreshness === '最新' ? 'prediction-good' : 'prediction-poor'">{{ aiCollectionStatus.dataFreshness }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        
        <!-- 风险数据卡片 -->
        <el-col :span="6">
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
        <el-col :span="6">
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
        
        <!-- 业务态势全景感知卡片 -->
        <el-col :span="6">
          <div class="data-panel business-situation-panel clickable" @click="goToBusinessSituation">
            <div class="card-header">
              <i class="el-icon-view"></i>
              <span>业务态势全景感知</span>
            </div>
            <div class="card-content">
              <div class="main-value">{{ businessSituationData.overallScore }}%</div>
              <div class="sub-info">
                <div class="info-item">
                  <span class="label">市场活跃度:</span>
                  <span class="value" :class="getScoreClass(businessSituationData.marketActivity)">{{ businessSituationData.marketActivity }}%</span>
                </div>
                <div class="info-item">
                  <span class="label">运营效率:</span>
                  <span class="value" :class="getScoreClass(businessSituationData.operationEfficiency)">{{ businessSituationData.operationEfficiency }}%</span>
                </div>
                <div class="info-item">
                  <span class="label">系统健康度:</span>
                  <span class="value" :class="getScoreClass(businessSituationData.systemHealth)">{{ businessSituationData.systemHealth }}%</span>
                </div>
                <div class="info-item">
                  <span class="label">预警级别:</span>
                  <span class="value" :class="getAlertClass(businessSituationData.alertLevel)">{{ businessSituationData.alertLevel }}</span>
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
        <div class="header-right">
        <el-tag size="small" type="success">算法版本: v0.3.0</el-tag>
        </div>
      </div>
      
      <div class="neural-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="network-planning-panel clickable" @click="goToPlanningTime">
              <div class="panel-header">
                <i class="el-icon-stopwatch"></i>
                <span>规划完成时间</span>
                <i class="el-icon-right header-arrow"></i>
              </div>
              <div class="panel-content">
                <div class="main-value">{{ predictionData.planTime }}s</div>
                <div class="sub-info">
                  <div class="info-item">
                    <span class="label">上一轮实际运行时间:</span>
                    <span class="value">{{ predictionData.actualTime }}s</span>
                </div>
                  <div class="info-item">
                    <span class="label">方案A-LR预测本轮时间:</span>
                    <span class="value prediction-good">{{ predictionData.schemeA.time }}s ({{ predictionData.schemeA.error }})</span>
                </div>
                  <div class="info-item">
                    <span class="label">方案B-XGB预测本轮时间:</span>
                    <span class="value prediction-good">{{ predictionData.schemeB.time }}s ({{ predictionData.schemeB.error }})</span>
                </div>
                  <div class="info-item">
                    <span class="label">方案C-GCN预测本轮时间:</span>
                    <span class="value prediction-poor">{{ predictionData.schemeC.time }}s ({{ predictionData.schemeC.error }})</span>
                </div>
                </div>
              </div>
              <!-- 添加点击提示 -->
              <div class="click-hint">
                <i class="el-icon-right"></i>
                <span>点击查看详细时间数据</span>
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

    <!-- 大模型分析结果展示区域 -->
    <el-card class="llm-analysis-card">
      <div slot="header" class="llm-analysis-header">
        <span>大模型分析结果</span>
        <div class="header-right">
          <el-tag size="small" :type="llmAnalysisData.hasData ? 'success' : 'warning'">
            分析状态: {{ llmAnalysisData.hasData ? '已完成' : '待分析' }}
          </el-tag>
        </div>
      </div>
      
      <div class="llm-analysis-content">
        <!-- 空状态 -->
        <div v-if="!llmAnalysisData.hasData" class="empty-state">
          <div class="empty-icon">
            <i class="el-icon-document-copy"></i>
          </div>
          <div class="empty-text">
            <div class="empty-title">暂无分析结果</div>
            <div class="empty-description">点击下方按钮开始大模型分析</div>
          </div>
        </div>
        
        <!-- 有数据时的展示 -->
        <transition name="fade-in" appear>
          <div v-if="llmAnalysisData.hasData" class="analysis-data">
          <!-- 流程信息 -->
          <div class="section process-section">
            <div class="section-title">
              <i class="el-icon-s-operation"></i>
              <span>当前流程分析</span>
            </div>
            <div class="process-info">
              <div class="process-flow">{{ llmAnalysisData.processInfo.currentProcess }}</div>
              <div class="process-id">流程实例 ID: {{ llmAnalysisData.processInfo.processId }}</div>
            </div>
          </div>
          
          <!-- 外部环境感知 -->
          <el-row :gutter="20" class="main-content">
            <el-col :span="12">
                             <div class="section environment-section">
                 <div class="section-title">
                   <i class="el-icon-globe"></i>
                   <span>外部环境智能感知</span>
                 </div>
                 
                 <!-- 文本内容展示 -->
                 <div class="environment-text-content">
                   <pre class="environment-text">{{ llmAnalysisData.environmentAnalysisText }}</pre>
                 </div>
               </div>
            </el-col>
            
            <el-col :span="12">
              <!-- 相似流程检索 -->
              <div class="section similarity-section">
                <div class="section-title">
                  <i class="el-icon-search"></i>
                  <span>相似历史流程检索</span>
                </div>
                <div class="similarity-table">
                  <div class="table-header">
                    <div class="col">排名</div>
                    <div class="col">历史流程ID</div>
                    <div class="col">路径匹配度</div>
                    <div class="col">综合相似度</div>
                  </div>
                  <div v-for="process in llmAnalysisData.similarProcesses" :key="process.rank" 
                       class="table-row" :class="{ 'reference-row': process.isReference }">
                    <div class="col">{{ process.rank }}</div>
                    <div class="col process-id">{{ process.id }}</div>
                    <div class="col">{{ (process.pathMatch * 100).toFixed(0) }}%</div>
                    <div class="col">
                      {{ (process.overall * 100).toFixed(0) }}%
                      <el-tag v-if="process.isReference" size="mini" type="warning">★</el-tag>
                    </div>
                  </div>
                </div>
                <div class="reference-time">
                  参考流程总耗时: {{ llmAnalysisData.referenceProcessTime }} s
                </div>
              </div>
              
              <!-- 时间预测 -->
              <div class="section prediction-section">
                <div class="section-title">
                  <i class="el-icon-time"></i>
                  <span>流程总耗时预测</span>
                </div>
                <div class="prediction-content">
                  <div class="prediction-item">
                    <span class="label">节点耗时合计（风险加权）:</span>
                    <span class="value">{{ llmAnalysisData.timePrediction.totalTime }} s</span>
                  </div>
                  <div class="prediction-item">
                    <span class="label">统计置信区间 (95% CI):</span>
                    <span class="value">{{ llmAnalysisData.timePrediction.confidenceInterval }}</span>
                  </div>
                  <div class="prediction-item">
                    <span class="label">相对参考流程差异:</span>
                    <span class="value">{{ llmAnalysisData.timePrediction.difference }}</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          
          <!-- 节点分析 -->
          <div class="section nodes-section">
            <div class="section-title">
              <i class="el-icon-cpu"></i>
              <span>节点级风险评估 & 耗时预测</span>
            </div>
            <div class="nodes-table">
              <div class="table-header">
                <div class="col">序号</div>
                <div class="col">节点名称</div>
                <div class="col">主要风险因子</div>
                <div class="col">风险得分</div>
                <div class="col">预测耗时(s)</div>
              </div>
              <div v-for="node in llmAnalysisData.nodeAnalysis" :key="node.seq" class="table-row">
                <div class="col">{{ node.seq }}</div>
                <div class="col">{{ node.name }}</div>
                <div class="col risk-factor">{{ node.riskFactor }}</div>
                <div class="col">
                  <el-tag size="mini" :type="getRiskTagType(node.riskScore)">
                    {{ node.riskScore }}
                  </el-tag>
                </div>
                <div class="col">{{ node.duration }}</div>
              </div>
            </div>
          </div>
          
          <!-- 建议 -->
          <div class="section recommendations-section">
            <div class="section-title">
              <i class="el-icon-warning"></i>
              <span>建议</span>
            </div>
            <div class="recommendations-list">
              <div v-for="(rec, index) in llmAnalysisData.recommendations" :key="index" class="recommendation-item">
                <span class="recommendation-number">{{ index + 1 }}.</span>
                <span class="recommendation-text">{{ rec }}</span>
              </div>
            </div>
          </div>
          </div>
        </transition>
      </div>
    </el-card>
    
    <!-- 底部按钮区域 -->
    <div class="action-footer">
      <el-button type="success" size="large" @click="showModelOutput" class="ai-analysis-btn">
        <span class="btn-text">
          <i class="el-icon-magic-stick btn-icon"></i>
          {{ llmAnalysisData.hasData ? '查看分析结果' : '大模型智能分析' }}
        </span>
      </el-button>
      <el-button type="primary" size="large" icon="el-icon-refresh" @click="handleManualAnalysis" class="manual-analysis-btn">
        手动分析重构时机
      </el-button>
    </div>

    <!-- 风险监控弹窗组件 -->
    <RiskMonitoringDialog
      :visible.sync="riskDialogVisible"
      :risk-data="riskData"
      @view-details="goToRiskMonitoring"
      @close="handleCloseRiskDialog" />
      
    <!-- 模型输出弹窗 -->
    <el-dialog
      title="流程智能分析报告"
      :visible.sync="modelOutputDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="85%"
      class="model-output-dialog"
      @close="stopAnimation"
    >
      <div class="model-output-content">
        <!-- 加载状态 -->
        <div v-if="isLoadingModelOutput" class="loading-container">
          <i class="el-icon-loading loading-icon"></i>
          <div class="loading-text">{{ loadingText }}</div>
          <div class="loading-progress">
            <div class="progress-bar"></div>
          </div>
        </div>
        
        <!-- 模型输出内容 -->
        <div v-else>
          <pre class="output-text">{{ displayedContent }}</pre>
          <div v-if="isAnimating" class="typing-cursor">|</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="copyToClipboard" :disabled="isAnimating || isLoadingModelOutput">复制到剪贴板</el-button>
        <el-button v-if="isAnimating && !isLoadingModelOutput" type="warning" @click="skipAnimation">跳过动画</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment1Data from '@/data/RefactorTimingData';
import { moment2Data } from '@/data/RefactorTimingData';
import RiskMonitoringDialog from '@/components/RiskMonitoringDialog.vue';

// 从localStorage获取存储的数据状态
function getStoredDataMoment() {
  const storedData = localStorage.getItem('refactorTimingData');
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error('解析localStorage数据失败:', error);
      return null;
    }
  }
  return null;
}

export default {
  name: 'RefactorTimingView',
  components: {
    RiskMonitoringDialog
  },
  data() {
    // 首先获取存储的数据状态
    const storedMoment = getStoredDataMoment();
    const useStoredData = storedMoment !== null;
    
    return {
      currentDate: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      // 标记当前使用的是哪个时刻的数据
      currentDataMoment: useStoredData ? 'moment2' : 'moment1',
      // 从数据文件中导入数据，根据存储的状态选择时刻
      riskData: useStoredData ? storedMoment.riskData : moment1Data.riskData,
      subprocessData: useStoredData ? storedMoment.subprocessData : moment1Data.subprocessData,
      predictionData: useStoredData ? storedMoment.predictionData : moment1Data.predictionData,
      analysisResults: useStoredData ? storedMoment.analysisResults : moment1Data.analysisResults,
      recommendations: useStoredData ? storedMoment.recommendations : moment1Data.recommendations,
      overallRecommendation: useStoredData ? storedMoment.overallRecommendation : moment1Data.overallRecommendation,
      // 业务态势全景感知数据
      businessSituationData: {
        overallScore: 78,
        marketActivity: 85,
        operationEfficiency: 72,
        systemHealth: 91,
        alertLevel: '中等'
      },
      // 大模型分析结果数据
      llmAnalysisData: {
        hasData: false,
        processInfo: {
          currentProcess: '弹性资源规划 ➜ 预测性补给模型 ➜ 需求波动预测 ➜ 贝叶斯网络建模 ➜ 安全库存计算 ➜ 补给路径仿真 ➜ 动态补给路线',
          processId: 'proc_run_20250701_XYZ123'
        },
                 environmentAnalysisText: `🔍 关联新闻事件（影响需求波动预测节点）：
• [BBC] 红海航运危机持续（2024-07-01）：全球30%集装箱船改道好望角，亚欧航线补给周期延长12-15天
• [Reuters] 中国制造业PMI超预期回升至51.8（2024-06-30），原材料进口需求激增
• [Al Jazeera] 中东地缘政治紧张升级，原油价格单周上涨8%（影响路径仿真燃料成本）

📊 关键市场指标（影响安全库存计算）：
┌──────────┬────────────┬──────────┬────────────┐
│ 数据源   │ 指标       │ 当前值   │ 72h波动率  │
├──────────┼────────────┼──────────┼────────────┤
│ NYSE     │ 零售业ETF(XRT) │ $78.42   │ +3.2% ▲   │
│ LME      │ 铜期货价格    │ $9,842/吨 │ +5.7% ▲   │
│ Forex    │ 美元指数(DXY) │ 104.85   │ -0.8% ▼   │
│ Oil      │ 布伦特原油    │ $89.12/桶 │ +8.1% ▲   │
└──────────┴────────────┴──────────┴────────────┘`,
        similarProcesses: [
          { rank: 1, id: 'proc_run_20250628_0f3925', pathMatch: 0.95, riskMatch: 0.91, overall: 0.93, isReference: true },
          { rank: 2, id: 'proc_run_20250628_144c4a', pathMatch: 0.95, riskMatch: 0.79, overall: 0.87, isReference: false },
          { rank: 3, id: 'proc_run_20250628_ce6dce', pathMatch: 0.95, riskMatch: 0.76, overall: 0.85, isReference: false }
        ],
        referenceProcessTime: '2 249',
        nodeAnalysis: [
          { seq: 1, name: '弹性资源规划', riskFactor: 'risk_02_cpu_pressure=0.62', riskScore: 0.62, duration: 260 },
          { seq: 2, name: '预测性补给模型', riskFactor: 'risk_06_config_drift=0.41', riskScore: 0.41, duration: 380 },
          { seq: 3, name: '需求波动预测', riskFactor: 'risk_07_source_api_latency=0.85', riskScore: 0.85, duration: 560 },
          { seq: 4, name: '贝叶斯网络建模', riskFactor: '（低风险）', riskScore: 0.2, duration: 490 },
          { seq: 5, name: '安全库存计算', riskFactor: 'risk_01_high_data_volume=0.48', riskScore: 0.48, duration: 300 },
          { seq: 6, name: '补给路径仿真', riskFactor: 'risk_03_memory_leak=0.70', riskScore: 0.70, duration: 120 },
          { seq: 7, name: '动态补给路线', riskFactor: 'risk_05_network_latency=0.55', riskScore: 0.55, duration: 240 }
        ],
        timePrediction: {
          totalTime: '2 350',
          confidenceInterval: '2 200 s – 2 500 s',
          difference: '+101 s (+4.5 %)'
        },
        recommendations: [
          '对 "需求波动预测" 节点（风险值最高 0.85）提前准备备用计算资源。',
          '若"补给路径仿真" 出现持续内存泄漏，可考虑拆分子任务或采用动态扩缩容。',
          '当总耗时超过 2 500 s 时触发告警并重评资源分配策略。'
        ]
      },
      // 大模型联网状态
      aiCollectionStatus: {
        enabled: false,
        lastCollectionTime: '未收集',
        collectedSources: 0,
        dataFreshness: '需要更新'
      },
      // 弹窗相关
      riskDialogVisible: false,
      modelOutputDialogVisible: false,
      displayedContent: '',
      isAnimating: false,
      animationTimer: null,
      contentLines: [],
      isLoadingModelOutput: false,
      loadingText: '正在加载联网数据...',
      loadingTimer: null,
      modelOutputContent: `==================== 流程智能分析报告 ====================  
当前待执行流程：弹性资源规划 ➜ 预测性补给模型 ➜ 需求波动预测 ➜ 贝叶斯网络建模 ➜ 安全库存计算 ➜ 补给路径仿真 ➜ 动态补给路线  
流程实例 ID      ：proc_run_20250701_XYZ123

📌 一、外部环境智能感知（大模型实时检索）
🔍 关联新闻事件（影响需求波动预测节点）：
• [BBC] 红海航运危机持续（2024-07-01）：全球30%集装箱船改道好望角，亚欧航线补给周期延长12-15天
• [Reuters] 中国制造业PMI超预期回升至51.8（2024-06-30），原材料进口需求激增
• [Al Jazeera] 中东地缘政治紧张升级，原油价格单周上涨8%（影响路径仿真燃料成本）

📊 关键市场指标（影响安全库存计算）：
┌──────────┬────────────┬──────────┬────────────┐
│ 数据源 │ 指标 │ 当前值 │ 72h波动率 │
├──────────┼────────────┼──────────┼────────────┤
│ NYSE │ 零售业ETF(XRT) │ $78.42 │ +3.2% ▲ │
│ LME │ 铜期货价格 │ $9,842/吨 │ +5.7% ▲ │
│ Forex │ 美元指数(DXY) │ 104.85 │ -0.8% ▼ │
│ Oil │ 布伦特原油 │ $89.12/桶 │ +8.1% ▲ │
└──────────┴────────────┴──────────┴────────────┘

📌 二、相似历史流程检索（基于路径、上下文变量、风险因子向量）  
┌────┬──────────────────────────┬──────────────┬──────────┬────────────┐  
│Rank│ 历史流程 ID               │ 路径匹配度   │ 风险向量相似度 │ 综合相似度 │  
├────┼──────────────────────────┼──────────────┼──────────┼────────────┤  
│ 1  │ proc_run_20250628_0f3925 │   0.95       │  0.91    │  0.93 ★    │  
│ 2  │ proc_run_20250628_144c4a │   0.95       │  0.79    │  0.87      │  
│ 3  │ proc_run_20250628_ce6dce │   0.95       │  0.76    │  0.85      │  
└────┴──────────────────────────┴──────────────┴──────────┴────────────┘  
（★ 作为最相似参考流程）

★ 参考流程总耗时：2 249 s（≈ 37 min 29 s）  

📌 三、节点级风险评估 & 耗时预测  
┌────┬────────────────┬──────────────┬──────────────────────────────┬────────────┐  
│序号│ 节点名称         │ 主要风险因子 │ 风险得分 (0-1)              │ 预测耗时(s) │  
├────┼────────────────┼──────────────┼──────────────────────────────┼────────────┤  
│ 1  │ 弹性资源规划     │ risk_02_cpu_pressure=0.62                │      260 │  
│ 2  │ 预测性补给模型   │ risk_06_config_drift=0.41                │      380 │  
│ 3  │ 需求波动预测     │ risk_07_source_api_latency=0.85, …       │      560 │  
│ 4  │ 贝叶斯网络建模   │ （低风险）                               │      490 │  
│ 5  │ 安全库存计算     │ risk_01_high_data_volume=0.48            │      300 │  
│ 6  │ 补给路径仿真     │ risk_03_memory_leak=0.70                 │      120 │  
│ 7  │ 动态补给路线     │ risk_05_network_latency=0.55             │      240 │  
└────┴────────────────┴──────────────┴──────────────────────────────┴────────────┘  

📌 四、流程总耗时预测  
• 节点耗时合计（风险加权）： 2 350 s  
• 统计置信区间 (95% CI)： 2 200 s  –  2 500 s  
• 相对最相似历史流程差异： +101 s (+4.5 %)

===========================================================  
⚠️ 建议  
1. 对 "需求波动预测" 节点（风险值最高 0.85）提前准备备用计算资源。  
2. 若"补给路径仿真" 出现持续内存泄漏，可考虑拆分子任务或采用动态扩缩容。  
3. 当总耗时超过 2 500 s 时触发告警并重评资源分配策略。`
    }
  },
  mounted() {
    this.checkAICollectionStatus();
  },
  activated() {
    // 页面激活时检查AI收集状态
    this.checkAICollectionStatus();
  },
  beforeDestroy() {
    // 清理定时器
    this.stopAnimation();
    if (this.loadingTimer) {
      clearInterval(this.loadingTimer);
      this.loadingTimer = null;
    }
  },
  methods: {
    // 检查AI收集状态
    checkAICollectionStatus() {
      const aiData = localStorage.getItem('aiCollectionData');
      if (aiData) {
        const data = JSON.parse(aiData);
        
        // 判断数据是否为最新：比较最后收集时间与当前时间的差值
        let dataFreshness = '需要更新';
        if (data.lastCollectionTime) {
          const lastCollectionDate = new Date(data.lastCollectionTime);
          const currentDate = new Date();
          const timeDiffInHours = (currentDate - lastCollectionDate) / (1000 * 60 * 60);
          
          // 如果时间差小于1小时，则认为数据是最新的
          if (timeDiffInHours < 1) {
            dataFreshness = '最新';
          }
        }
        
        this.aiCollectionStatus = {
          enabled: true,
          lastCollectionTime: data.lastCollectionTime || new Date().toLocaleString('zh-CN'),
          collectedSources: data.collectedSources || 0,
          dataFreshness: dataFreshness
        };
      }
    },
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
    // 大模型联网收集信息
    handleAIDataCollection() {
      this.$router.push('/home/ai-data-collection');
    },
    handleManualAnalysis() {
      const isCurrentlyMoment1 = this.currentDataMoment === 'moment1';
      
      this.$message({
        message: isCurrentlyMoment1 ? '正在启动手动分析...' : '正在重置到初始状态...',
        type: 'info',
        duration: 1000
      });
      
      // 显示加载状态
      const loading = this.$loading({
        lock: true,
        text: isCurrentlyMoment1 ? '神经网络分析中...' : '正在重置数据...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      
      // 模拟分析/重置过程
      setTimeout(() => {
        if (isCurrentlyMoment1) {
          // 当前是时刻一，切换到时刻二
        this.riskData = moment2Data.riskData;
        this.subprocessData = moment2Data.subprocessData;
        this.predictionData = moment2Data.predictionData;
        this.analysisResults = moment2Data.analysisResults;
        this.recommendations = moment2Data.recommendations;
        this.overallRecommendation = moment2Data.overallRecommendation;
        
          // 更新当前数据状态标记
          this.currentDataMoment = 'moment2';
          
          // 保存时刻2数据到localStorage
          this.saveDataToStorage();
        
        // 显示成功消息
        this.$message({
          message: '重构时机分析完成',
          type: 'success'
        });
        
        // 重置大模型分析结果状态（切换到时刻二时，保持原有的分析状态）
        // this.llmAnalysisData.hasData = true;
        } else {
          // 当前是时刻二，切换到时刻一
          this.riskData = moment1Data.riskData;
          this.subprocessData = moment1Data.subprocessData;
          this.predictionData = moment1Data.predictionData;
          this.analysisResults = moment1Data.analysisResults;
          this.recommendations = moment1Data.recommendations;
          this.overallRecommendation = moment1Data.overallRecommendation;
          
          // 更新当前数据状态标记
          this.currentDataMoment = 'moment1';
          
          // 清除localStorage中的数据，回到初始状态
          localStorage.removeItem('refactorTimingData');
          
          // 重置大模型分析结果状态
          this.llmAnalysisData.hasData = false;
          
          // 显示成功消息
          this.$message({
            message: '已重置到初始状态',
            type: 'success'
          });
        }
        
        // 关闭加载状态
        loading.close();
      }, 1000);
    },
    // 显示模型输出
    showModelOutput() {
      // 如果已经有分析结果，直接滚动到结果区域
      if (this.llmAnalysisData.hasData) {
        this.scrollToAnalysisResult();
        return;
      }
      
      // 显示加载提示
      this.$message({
        message: '正在启动大模型智能分析...',
        type: 'info',
        duration: 1000
      });
      
      // 显示加载状态
      const loading = this.$loading({
        lock: true,
        text: '大模型正在进行智能分析中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      
      // 模拟分析过程
      setTimeout(() => {
        // 更新大模型分析结果数据状态
        this.llmAnalysisData.hasData = true;
        
        // 关闭加载状态
        loading.close();
        
        // 显示成功消息
        this.$message({
          message: '大模型智能分析完成',
          type: 'success'
        });
          
        // 滚动到分析结果区域
        this.$nextTick(() => {
          this.scrollToAnalysisResult();
        });
      }, 2000); // 2秒模拟分析时间
    },
    
    // 滚动到分析结果区域
    scrollToAnalysisResult() {
      const analysisCard = document.querySelector('.llm-analysis-card');
      if (analysisCard) {
        analysisCard.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    },
    // 开始逐行显示动画
    startAnimation() {
      let currentLine = 0;
      this.displayedContent = '';
      
      this.animationTimer = setInterval(() => {
        if (currentLine < this.contentLines.length) {
          // 添加当前行
          if (currentLine === 0) {
            this.displayedContent = this.contentLines[currentLine];
          } else {
            this.displayedContent += '\n' + this.contentLines[currentLine];
          }
          currentLine++;
        } else {
          // 动画完成
          this.stopAnimation();
        }
      }, 150); // 每150毫秒显示一行
    },
    // 停止动画
    stopAnimation() {
      if (this.animationTimer) {
        clearInterval(this.animationTimer);
        this.animationTimer = null;
      }
      this.isAnimating = false;
      this.displayedContent = this.modelOutputContent; // 确保显示完整内容
    },
    // 跳过动画
    skipAnimation() {
      this.stopAnimation();
    },
    // 关闭弹窗
    closeDialog() {
      this.stopAnimation();
      // 清除加载定时器
      if (this.loadingTimer) {
        clearInterval(this.loadingTimer);
        this.loadingTimer = null;
      }
      this.isLoadingModelOutput = false;
      this.modelOutputDialogVisible = false;
    },
    // 复制到剪贴板
    copyToClipboard() {
      if (this.isAnimating || this.isLoadingModelOutput) {
      this.$message({
          message: this.isLoadingModelOutput ? '请等待数据加载完成后再复制' : '请等待动画完成后再复制',
          type: 'warning'
        });
        return;
      }
      
      // 创建临时textarea元素
      const textarea = document.createElement('textarea');
      textarea.value = this.modelOutputContent;
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        // 复制到剪贴板
        document.execCommand('copy');
        this.$message({
          message: '模型输出已复制到剪贴板',
        type: 'success'
      });
      } catch (err) {
        this.$message({
          message: '复制失败，请手动复制',
          type: 'error'
        });
      } finally {
        // 移除临时元素
        document.body.removeChild(textarea);
      }
    },
    // 跳转到规划完成时间页面
    goToPlanningTime() {
      this.$router.push('/home/planning-time');
    },
    // 跳转到业务态势全景感知页面
    goToBusinessSituation() {
      this.$message({
        message: '业务态势全景感知功能即将上线',
        type: 'info'
      });
    },
    // 根据分数获取样式类
    getScoreClass(score) {
      if (score >= 80) return 'prediction-good';
      if (score >= 60) return 'prediction-medium';
      return 'prediction-poor';
    },
    // 根据预警级别获取样式类
    getAlertClass(level) {
      switch (level) {
        case '高':
          return 'high-risk';
        case '中等':
          return 'medium-risk';
        case '低':
          return 'low-risk';
        default:
          return '';
      }
    },
    // 根据风险得分获取标签类型
    getRiskTagType(riskScore) {
      if (riskScore >= 0.7) return 'danger';
      if (riskScore >= 0.5) return 'warning';
      if (riskScore >= 0.3) return 'info';
      return 'success';
    },
    // 保存数据到localStorage
    saveDataToStorage() {
      const data = {
        riskData: this.riskData,
        subprocessData: this.subprocessData,
        predictionData: this.predictionData,
        analysisResults: this.analysisResults,
        recommendations: this.recommendations,
        overallRecommendation: this.overallRecommendation
      };
      localStorage.setItem('refactorTimingData', JSON.stringify(data));
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

.prediction-panel {
  border-left-color: #E6A23C;
}

.ai-status-panel {
  border-left-color: #67C23A;
}

.business-situation-panel {
  border-left-color: #909399;
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

.prediction-good {
  color: #67C23A;
}

.prediction-medium {
  color: #E6A23C;
}

.prediction-poor {
  color: #F56C6C;
}

/* 卡片主题颜色 */
.risk-panel .card-header i {
  color: #F56C6C;
}

.subprocess-panel .card-header i {
  color: #409EFF;
}

.prediction-panel .card-header i {
  color: #E6A23C;
}

.ai-status-panel .card-header i {
  color: #67C23A;
}

.business-situation-panel .card-header i {
  color: #909399;
}

.ai-status-panel .main-value {
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ai-status-panel .main-value .el-tag {
  font-size: 16px;
  padding: 8px 16px;
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

.llm-analysis-card {
  margin-top: 20px;
}

.neural-header,
.llm-analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.neural-content {
  padding: 10px 0;
}

.network-planning-panel,
.network-result-panel,
.network-recommendation-panel {
  height: 100%;
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 15px;
  border-left: 4px solid #dcdfe6;
}

.network-planning-panel {
  border-left-color: #E6A23C;
  position: relative;
  transition: all 0.3s ease;
}

.network-planning-panel.clickable:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(230, 162, 60, 0.15);
  cursor: pointer;
}

.network-result-panel {
  border-left-color: #409EFF;
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

.network-planning-panel .panel-header i {
  color: #E6A23C;
}

.network-result-panel .panel-header i {
  color: #409EFF;
}

.network-recommendation-panel .panel-header i {
  color: #67C23A;
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



.action-footer {
  margin-top: 30px;
  text-align: center;
  padding: 25px 0;
  border-top: 1px dashed #DCDFE6;
  display: flex;
  justify-content: center;
  gap: 20px;
}

/* 大模型分析按钮美化 */
.ai-analysis-btn {
  position: relative;
  background: linear-gradient(135deg, #67C23A 0%, #85CE61 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
  transition: all 0.3s ease;
  padding: 12px 24px;
  border-radius: 8px;
  overflow: hidden;
}

.ai-analysis-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.ai-analysis-btn:hover::before {
  left: 100%;
}

.ai-analysis-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(103, 194, 58, 0.4);
}

.ai-analysis-btn .btn-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.ai-analysis-btn .btn-icon {
  font-size: 16px;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
  50% {
    transform: rotate(180deg) scale(1.1);
    opacity: 0.8;
  }
}

/* 手动分析按钮美化 */
.manual-analysis-btn {
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
  transition: all 0.3s ease;
  padding: 12px 20px;
  border-radius: 6px;
}

.manual-analysis-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

/* 模型输出弹窗样式 */
.model-output-dialog .el-dialog__body {
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.model-output-content {
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  position: relative;
}

.output-text {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 16px;
  line-height: 1.8;
  color: #2c3e50;
  margin: 0;
  padding: 25px;
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #fff;
  border-radius: 6px;
  overflow-x: auto;
  min-height: 400px;
}

.dialog-footer {
  text-align: right;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.dialog-footer .el-button {
  margin-left: 10px;
}

/* 打字机光标样式 */
.typing-cursor {
  display: inline-block;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 16px;
  color: #409EFF;
  font-weight: bold;
  animation: blink 1s infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
}

.loading-icon {
  font-size: 40px;
  color: #409EFF;
  margin-bottom: 20px;
  animation: loading-rotate 2s linear infinite;
}

.loading-text {
  font-size: 18px;
  color: #606266;
  margin-bottom: 30px;
  font-weight: 500;
}

.loading-progress {
  width: 300px;
  height: 4px;
  background-color: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #409EFF, #67C23A);
  border-radius: 2px;
  animation: loading-progress 3.2s ease-in-out infinite;
}

@keyframes loading-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes loading-progress {
  0% {
    width: 0%;
    transform: translateX(-100%);
  }
  50% {
    width: 100%;
    transform: translateX(0%);
  }
  100% {
    width: 100%;
    transform: translateX(100%);
  }
}

/* 规划面板内容样式 */
.network-planning-panel .main-value {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
  color: #E6A23C;
}

.network-planning-panel .sub-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.network-planning-panel .info-item {
  display: flex;
  justify-content: space-between;
}

.network-planning-panel .label {
  color: #606266;
  font-size: 12px;
}

.network-planning-panel .value {
  font-weight: 500;
  font-size: 12px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 大模型分析结果区域样式 */
.llm-analysis-content {
  padding: 20px 0;
  min-height: 200px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
}

.empty-icon {
  margin-bottom: 20px;
}

.empty-icon i {
  font-size: 48px;
  color: #C0C4CC;
}

.empty-text {
  color: #606266;
}

.empty-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.empty-description {
  font-size: 14px;
  color: #909399;
}

/* 大模型分析结果展示样式 */
.analysis-data {
  padding: 0;
}

.section {
  margin-bottom: 25px;
  background-color: #fafafa;
  border-radius: 6px;
  padding: 20px;
  border-left: 4px solid #E6A23C;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 15px;
}

.section-title i {
  margin-right: 8px;
  color: #E6A23C;
  font-size: 18px;
}

/* 流程信息区域 */
.process-section {
  border-left-color: #409EFF;
}

.process-section .section-title i {
  color: #409EFF;
}

.process-flow {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 8px;
}

.process-id {
  font-size: 13px;
  color: #909399;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* 环境感知区域 */
.environment-section {
  border-left-color: #67C23A;
  height: fit-content;
}

.environment-section .section-title i {
  color: #67C23A;
}

.environment-text-content {
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #EBEEF5;
  overflow: hidden;
}

.environment-text {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.6;
  color: #606266;
  margin: 0;
  padding: 15px;
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #fafbfc;
  border: none;
}

/* 相似流程检索区域 */
.similarity-section {
  border-left-color: #909399;
  margin-bottom: 20px;
}

.similarity-section .section-title i {
  color: #909399;
}

.similarity-table,
.nodes-table {
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #EBEEF5;
}

.table-header {
  display: grid;
  grid-template-columns: 60px 1fr 100px 100px;
  background-color: #F5F7FA;
  border-bottom: 1px solid #EBEEF5;
}

.nodes-table .table-header {
  grid-template-columns: 60px 120px 1fr 80px 100px;
}

.table-header .col {
  padding: 12px 8px;
  font-size: 13px;
  font-weight: 600;
  color: #909399;
  text-align: center;
}

.table-row {
  display: grid;
  grid-template-columns: 60px 1fr 100px 100px;
  border-bottom: 1px solid #EBEEF5;
}

.nodes-table .table-row {
  grid-template-columns: 60px 120px 1fr 80px 100px;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row .col {
  padding: 10px 8px;
  font-size: 12px;
  color: #606266;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-row .process-id {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 11px;
}

.table-row .risk-factor {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 11px;
  text-align: left;
  justify-content: flex-start;
}

.reference-row {
  background-color: #FDF6EC;
}

.reference-time {
  margin-top: 10px;
  font-size: 12px;
  color: #E6A23C;
  font-weight: 500;
  text-align: center;
}

/* 时间预测区域 */
.prediction-section {
  border-left-color: #F56C6C;
}

.prediction-section .section-title i {
  color: #F56C6C;
}

.prediction-content {
  background-color: #fff;
  border-radius: 4px;
  padding: 15px;
  border: 1px solid #EBEEF5;
}

.prediction-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.prediction-item:last-child {
  margin-bottom: 0;
}

.prediction-item .label {
  font-size: 13px;
  color: #606266;
}

.prediction-item .value {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}

/* 节点分析区域 */
.nodes-section {
  border-left-color: #7C3AED;
}

.nodes-section .section-title i {
  color: #7C3AED;
}

/* 建议区域 */
.recommendations-section {
  border-left-color: #F56C6C;
}

.recommendations-section .section-title i {
  color: #F56C6C;
}

.recommendations-list {
  background-color: #fff;
  border-radius: 4px;
  padding: 15px;
  border: 1px solid #EBEEF5;
}

.recommendation-item {
  display: flex;
  margin-bottom: 12px;
  line-height: 1.5;
}

.recommendation-item:last-child {
  margin-bottom: 0;
}

.recommendation-number {
  font-weight: 600;
  color: #F56C6C;
  margin-right: 8px;
  flex-shrink: 0;
}

.recommendation-text {
  font-size: 13px;
  color: #606266;
}

.main-content {
  margin-bottom: 25px;
}

/* 分析结果淡入动画 */
.fade-in-enter-active {
  transition: all 0.6s ease;
}

.fade-in-enter {
  opacity: 0;
  transform: translateY(20px);
}

.fade-in-enter-to {
  opacity: 1;
  transform: translateY(0);
}

</style> 