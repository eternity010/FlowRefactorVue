<template>
  <div class="process-optimization-container">
    <!-- 前置页面 -->
    <div v-if="!showMainContent && !showRiskAnalysis" class="pre-page">
      <!-- 数据加载错误提示 -->
      <div v-if="dataError" class="data-error-indicator">
        <el-card class="error-indicator-card">
          <div class="error-indicator-content">
            <i class="el-icon-warning" style="font-size: 24px; color: #F56C6C;"></i>
            <p>数据加载失败: {{ dataError }}</p>
            <el-button type="primary" @click="reloadData" size="small">
              重新加载
            </el-button>
          </div>
        </el-card>
      </div>

      <!-- 主要操作卡片 -->
      <el-card class="pre-card" :class="{ 'disabled': dataError }">
        <div slot="header" class="pre-card-header">
          <span>流程重构优化系统</span>
          <el-tag size="small" type="primary">版本 1.0</el-tag>
        </div>
        <div class="pre-content">
          <h2 class="pre-title">流程重构优化系统</h2>
          <p class="pre-description">点击下方按钮开始流程重构分析</p>
          
                    <div class="action-buttons">
          <el-button 
            type="primary" 
            size="large"
            @click="startRefactoring"
              :disabled="dataError || Object.keys(filteredOptPoints).length === 0"
            class="refactor-button">
              <i class="el-icon-cpu"></i>
              <span v-if="dataError">数据加载失败</span>
            <span v-else-if="Object.keys(filteredOptPoints).length === 0">等待数据加载</span>
              <span v-else>开始重构分析</span>
            </el-button>
            
            <div class="secondary-buttons">
            <el-button 
              type="warning" 
              size="medium"
              @click="showNeuralNetworkSettings"
              class="settings-button">
              <i class="el-icon-setting"></i>
              设置参数
          </el-button>
          
          <el-button 
            type="success" 
            size="medium"
            @click="configureRAG"
            class="rag-button">
            <i class="el-icon-document"></i>
            配置RAG
          </el-button>
            </div>
          </div>
          
          <div class="parameter-summary" v-if="showParameterSummary">
            <el-alert
              title="当前神经网络参数配置"
              type="info"
              :closable="false"
              show-icon>
              <template slot="title">
                <span style="font-size: 14px; font-weight: bold;">当前参数配置</span>
                <span v-if="parameterLastUpdated" style="font-size: 12px; color: #909399; font-weight: normal; margin-left: 10px;">
                  (更新于: {{ formatDateTime(parameterLastUpdated) }})
                </span>
              </template>
              <div class="param-summary-content" v-loading="parameterLoading">
                <span class="param-item">地缘政治影响: {{ neuralNetworkParams.geoPoliticalWeight }}</span>
                <span class="param-item">价格波动敏感度: {{ neuralNetworkParams.marketVolatilityFactor }}</span>
                <span class="param-item">备用供应商覆盖: {{ (neuralNetworkParams.backupSupplierRatio * 100).toFixed(0) }}%</span>
                <span class="param-item">路径重评估: {{ neuralNetworkParams.routeReevalFrequency }}天</span>
                <span class="param-item">成本延误权衡: {{ neuralNetworkParams.costDelayTradeoff }}</span>
                <span class="param-item">节拍波动容忍: ±{{ (neuralNetworkParams.taktTimeVariance * 100).toFixed(0) }}%</span>
                <span class="param-item">加班时长上限: {{ neuralNetworkParams.overtimeCostCap }}小时/月</span>
              </div>
            </el-alert>
          </div>
          
          <div class="rag-summary" v-if="showRAGSummary">
            <el-alert
              title="已启用的RAG配置"
              type="success"
              :closable="false"
              show-icon>
              <template slot="title">
                <span style="font-size: 14px; font-weight: bold;">已启用的RAG配置</span>
                <span v-if="ragLastUpdated" style="font-size: 12px; color: #909399; font-weight: normal; margin-left: 10px;">
                  (更新于: {{ formatDateTime(ragLastUpdated) }})
                </span>
              </template>
              <div class="rag-summary-content" v-loading="ragConfigLoading">
                 <div class="rag-status-grid">
                   <div class="rag-status-item">
                     <i class="el-icon-pie-chart"></i>
                     <span class="rag-label">启用状态:</span>
                     <el-tag size="mini" :type="ragConfig.enabledCount > 0 ? 'success' : 'info'">
                       {{ ragConfig.enabledCount }}/{{ ragConfig.totalCount }} 已启用
                     </el-tag>
                   </div>
                   <div class="rag-status-item">
                     <i class="el-icon-share"></i>
                     <span class="rag-label">多场景决策模型及知识图谱:</span>
                     <el-tag size="mini" :type="ragConfig.processOptimization ? 'success' : 'danger'">
                       {{ ragConfig.processOptimization ? '已启用' : '未启用' }}
                     </el-tag>
                   </div>
                 </div>
               </div>
            </el-alert>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 风险分析前置界面 -->
    <div v-if="showRiskAnalysis && riskAnalysisLoading" class="risk-pre-page">
      <el-card class="risk-pre-card">
        <div class="risk-pre-content">
          <div class="neural-network">
            <div class="node-layer">
              <div class="node" v-for="i in 4" :key="'input-' + i"></div>
            </div>
            <div class="connection-layer">
              <div class="connection" v-for="i in 12" :key="'conn1-' + i"></div>
            </div>
            <div class="node-layer">
              <div class="node" v-for="i in 6" :key="'hidden1-' + i"></div>
            </div>
            <div class="connection-layer">
              <div class="connection" v-for="i in 18" :key="'conn2-' + i"></div>
            </div>
            <div class="node-layer">
              <div class="node" v-for="i in 6" :key="'hidden2-' + i"></div>
            </div>
            <div class="connection-layer">
              <div class="connection" v-for="i in 12" :key="'conn3-' + i"></div>
            </div>
            <div class="node-layer">
              <div class="node" v-for="i in 3" :key="'output-' + i"></div>
            </div>
          </div>
          <h3 class="loading-title">风险数据分析中</h3>
          <p class="loading-description">大模型正在对流程风险进行结构化分析...</p>
          <div class="progress-dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 风险分析中间态页面 -->
    <div v-if="showRiskAnalysis && !riskAnalysisLoading" class="risk-analysis-page">
      <el-card class="risk-analysis-card">
        <div slot="header" class="risk-analysis-header">
          <span>风险数据结构化分析</span>
          <el-tag size="small" type="success">AI分析</el-tag>
        </div>
        
        <div class="risk-analysis-content">
          <!-- 风险分析结果 -->
          <div v-if="riskAnalysisData" class="risk-analysis-result">
            <!-- 风险等级统计 -->
            <div class="risk-statistics">
              <div class="stat-card high-risk">
                <div class="stat-icon">
                  <i class="el-icon-warning"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ riskAnalysisData.highRiskCount }}</div>
                  <div class="stat-label">高风险环节</div>
                </div>
              </div>
              
              <div class="stat-card medium-risk">
                <div class="stat-icon">
                  <i class="el-icon-info"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ riskAnalysisData.mediumRiskCount }}</div>
                  <div class="stat-label">中风险环节</div>
                </div>
              </div>
              
              <div class="stat-card low-risk">
                <div class="stat-icon">
                  <i class="el-icon-success"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ riskAnalysisData.lowRiskCount }}</div>
                  <div class="stat-label">低风险环节</div>
                </div>
              </div>
              
              <div class="stat-card total">
                <div class="stat-icon">
                  <i class="el-icon-data-analysis"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ riskAnalysisData.totalSteps }}</div>
                  <div class="stat-label">总环节数</div>
                </div>
              </div>
            </div>

            <!-- 风险详情 -->
            <div class="risk-details">
              <el-tabs v-model="activeRiskTab" type="border-card">
                <el-tab-pane label="高风险环节" name="high">
                  <div class="risk-step-list">
                    <div v-for="step in riskAnalysisData.highRiskSteps" :key="step.id" class="risk-step-item high">
                      <div class="step-header">
                        <span class="step-id">{{ step.id }}</span>
                        <span class="step-name">{{ step.name }}</span>
                        <el-tag size="mini" type="danger">高风险</el-tag>
                      </div>
                      <div class="step-description">{{ step.description }}</div>
                    </div>
                  </div>
                </el-tab-pane>
                
                <el-tab-pane label="中风险环节" name="medium">
                  <div class="risk-step-list">
                    <div v-for="step in riskAnalysisData.mediumRiskSteps" :key="step.id" class="risk-step-item medium">
                      <div class="step-header">
                        <span class="step-id">{{ step.id }}</span>
                        <span class="step-name">{{ step.name }}</span>
                        <el-tag size="mini" type="warning">中风险</el-tag>
                      </div>
                      <div class="step-description">{{ step.description }}</div>
                    </div>
                  </div>
                </el-tab-pane>
                
                <el-tab-pane label="低风险环节" name="low">
                  <div class="risk-step-list">
                    <div v-for="step in riskAnalysisData.lowRiskSteps" :key="step.id" class="risk-step-item low">
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
                    <strong>关键风险环节:</strong> {{ riskAnalysisData.criticalStep }}
                  </div>
                  <div class="recommendation-item">
                    <strong>主要建议:</strong> {{ riskAnalysisData.recommendation }}
                  </div>
                </div>
              </el-alert>
            </div>
          </div>

          <!-- 错误状态 -->
          <div v-else-if="riskAnalysisError" class="risk-error">
            <div class="error-content">
              <i class="el-icon-warning" style="font-size: 48px; color: #F56C6C;"></i>
              <h3>风险分析失败</h3>
              <p>{{ riskAnalysisError }}</p>
              <el-button type="primary" @click="retryRiskAnalysis">
                重新分析
              </el-button>
            </div>
          </div>
        </div>

        <!-- 底部操作按钮 -->
        <div class="risk-analysis-actions">
          <el-button type="primary" @click="proceedToOptimization" :disabled="!riskAnalysisData">
            继续优化分析
          </el-button>
          <el-button @click="goBackToStart">
            返回
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 主要内容 -->
    <div v-if="showMainContent && !showRiskAnalysis">
      <!-- 数据检查 -->
      <div v-if="Object.keys(filteredOptPoints).length === 0" class="no-data-warning">
        <el-card>
          <div class="no-data-content">
            <i class="el-icon-warning" style="font-size: 48px; color: #E6A23C;"></i>
            <h3>数据未加载</h3>
            <p>流程优化数据尚未加载完成，请返回重新加载数据。</p>
            <el-button type="primary" @click="goBackAndReload">
              返回并重新加载
            </el-button>
          </div>
        </el-card>
      </div>

      <!-- 正常内容 -->
      <el-card v-else class="main-card">
      <div slot="header" class="card-header">
        <span>流程重构优化</span>
          <div class="header-actions">
        <el-tag size="small" type="primary">版本: 1.0.0</el-tag>
          </div>
      </div>
      
      <!-- Mermaid图表区域 -->
      <div class="mermaid-container">
        <h3 class="section-title">流程优化</h3>
        
        <!-- 方案选择器 -->
        <div class="solution-selector">
          <div class="selector-header">
            <h4 class="selector-title">选择优化方案</h4>
            <p class="selector-description">
              页面将始终显示重构前流程和LLM智能重构流程，请选择要对比的强化学习重构方案
            </p>
          </div>
                  <el-select 
          v-model="selectedSolution" 
          placeholder="选择优化方案"
          @change="handleSolutionChange"
          size="medium"
          class="solution-select">
          <el-option
            label="强化学习平衡方案"
            value="balanced"
            :disabled="false">
            <span>强化学习平衡方案</span>
            <span style="color: #8492a6; font-size: 13px; float: right;">综合考虑功能与资源</span>
          </el-option>
          <el-option
            label="强化学习资源优先"
            value="resource-first"
            :disabled="false">
            <span>强化学习资源优先</span>
            <span style="color: #8492a6; font-size: 13px; float: right;">最小化资源投入</span>
          </el-option>
        </el-select>
        </div>
        
        <el-tabs v-model="activeOptTab" type="border-card">
          <el-tab-pane 
            v-for="(flowData, key) in filteredOptPoints" 
            :key="key"
            :label="flowData.title" 
            :name="key"
          >
            <!-- 优化策略描述 -->
            <div class="strategy-description">
              <el-alert
                :title="getFlowTitle(key)"
                :description="getFlowDescription(key)"
                type="info"
                :closable="false"
                show-icon>
              </el-alert>
            </div>
            
            <div class="opt-chart-group">
              <!-- 重构前流程图 -->
              <div class="opt-chart-block">
                <div class="opt-chart-title">重构前流程</div>
                <div class="chart-container">
                  <div :ref="`chart-before-${key}`" class="mermaid-chart" v-html="getRenderedChart(key, 'before')"></div>
                </div>
              </div>
              
              <!-- 根据选择的方案显示对应的重构流程 -->
              <div v-if="selectedSolution === 'balanced'" class="opt-chart-block">
                <div class="opt-chart-title">强化学习平衡方案重构流程</div>
                <div class="chart-container">
                  <div :ref="`chart-after-${key}`" class="mermaid-chart" v-html="getRenderedChart(key, 'after')"></div>
                </div>
              </div>
              
              <div v-if="selectedSolution === 'resource-first'" class="opt-chart-block">
                <div class="opt-chart-title">强化学习资源优先重构流程</div>
                <div class="chart-container">
                  <div :ref="`chart-after2-${key}`" class="mermaid-chart" v-html="getRenderedChart(key, 'after2')"></div>
                </div>
              </div>
              
              <!-- LLM智能重构流程放在最右边 -->
              <div class="opt-chart-block">
                <div class="opt-chart-title">
                  <span>LLM智能重构流程</span>
                  <el-tag size="mini" type="success" style="margin-left: 8px;">AI生成</el-tag>
                </div>
                <div class="chart-container">
                  <div :ref="`chart-llm-${key}`" class="mermaid-chart" v-html="getRenderedChart(key, 'llm')"></div>
                </div>
              </div>
            </div>

            <!-- 新增操作按钮 -->
            <div class="operation-buttons">
              <el-button 
                type="success" 
                size="small"
                @click="acceptChange(key)">
                接受优化方案
              </el-button>
              <el-button 
                type="danger" 
                size="small"
                @click="rejectChange(key)">
                拒绝优化方案
              </el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      </el-card>
      
      <!-- 资源变化确认对话框 -->
      <ResourceChangeConfirmation
        :visible.sync="showResourceDialog"
        :resource-data="currentResourceData"
        :optimization-key="currentOptimizationKey"
        @confirm="handleResourceConfirm"
        @cancel="handleResourceCancel"
      />
      </div>
  </div>
</template>

<script>
// import MermaidChart from '@/components/MermaidChart.vue'
import ResourceChangeConfirmation from '@/components/ResourceChangeConfirmation.vue'
import { processOptimizationApi } from '@/api/processOptimizationApi.js'
import { neuralNetworkApi } from '@/api/neuralNetworkApi'
import { llmApi } from '@/api/llmApi.js'

export default {
  name: 'ProcessOptimizationView',
  components: { ResourceChangeConfirmation },
  data() {
    return {
      showMainContent: false, // 控制是否显示主要内容
      showRiskAnalysis: false, // 控制是否显示风险分析中间态页面
      activeOptTab: 'Optimization1',
      optPoints: {}, // 改为空对象，通过API获取
      showResourceDialog: false,
      currentOptimizationKey: null,
      dataLoading: false, // API数据加载状态
      dataError: null, // API数据加载错误
      selectedSolution: 'balanced', // 默认选择强化学习平衡方案
      neuralNetworkParams: {
        geoPoliticalWeight: 1.0,
        marketVolatilityFactor: 0.8,
        backupSupplierRatio: 0.3,
        routeReevalFrequency: 7,
        costDelayTradeoff: 1.2,
        taktTimeVariance: 0.05,
        overtimeCostCap: 200
      },
      showParameterSummary: false,
      showRAGSummary: false,
      ragConfig: {
        processOptimization: false,
        enabledCount: 0,
        totalCount: 1
      },
      // 加载状态
      parameterLoading: false,
      ragConfigLoading: false,
      parameterLastUpdated: null,
      ragLastUpdated: null,
      // 添加mermaid相关属性
      mermaidLoaded: false,
      mermaidInitialized: false,
      renderedCharts: {}, // 存储渲染的图表
      // 风险分析相关属性
      riskAnalysisLoading: false,
      riskAnalysisData: null,
      riskAnalysisError: null,
      activeRiskTab: 'high', // 默认显示高风险环节
      // 保存风险数据用于后续分析
      savedRiskData: null,
      savedAnalysisData: null,
      // 流程节点风险分析结果
      processNodeRiskAnalysis: null
    }
  },

  computed: {
    // 过滤后的优化项目，根据RAG启用状态决定是否显示
    filteredOptPoints() {
      const filtered = {};
      
      for (const [key, flowData] of Object.entries(this.optPoints)) {
        // Optimization5需要多场景决策模型及知识图谱RAG启用才显示
        if (key === 'Optimization5') {
          if (this.ragConfig.processOptimization) {
            filtered[key] = flowData;
          }
          // 如果未启用多场景决策模型及知识图谱RAG，则不显示Optimization5
        } else {
          // 其他优化项目正常显示
          filtered[key] = flowData;
        }
      }
      
      return filtered;
    },

    currentResourceData() {
      if (!this.currentOptimizationKey || !this.optPoints[this.currentOptimizationKey]) {
        return {};
      }
      // 根据选择的方案返回对应的资源数据
      const optimizationData = this.optPoints[this.currentOptimizationKey];
      
      if (this.selectedSolution === 'balanced') {
        return {
          ...optimizationData.resourceChanges,
          ganttData: optimizationData.ganttData
        };
      } else if (this.selectedSolution === 'resource-first') {
        return {
          ...optimizationData.resourceChanges2,
          ganttData: optimizationData.ganttData2
        };
      }
      
        // 默认返回强化学习平衡方案
      return {
        ...optimizationData.resourceChanges,
        ganttData: optimizationData.ganttData
      };
    }
  },

  async mounted() {
    // 组件挂载时自动加载数据
    await this.loadOptimizationData();
    // 加载已保存的神经网络参数
    await this.loadNeuralNetworkParams();
    // 加载已保存的RAG配置
    await this.loadRAGConfig();
    // 加载mermaid脚本
    this.loadMermaidScript();
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
    },

    // Mermaid相关方法
    loadMermaidScript() {
      if (window.mermaid) {
        this.mermaidLoaded = true;
        this.initMermaid();
        this.renderAllCharts();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/mermaid@10.6.1/dist/mermaid.min.js';
      script.onload = () => {
        this.mermaidLoaded = true;
        this.initMermaid();
        this.renderAllCharts();
      };
      script.onerror = () => {
        console.error('Failed to load mermaid script');
      };
      document.head.appendChild(script);
    },
    
    initMermaid() {
      if (this.mermaidInitialized || !window.mermaid) return;
      
      window.mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: 'default',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis'
        }
      });
      this.mermaidInitialized = true;
    },
    
    async renderMermaidChart(code, chartId) {
      if (!window.mermaid || !this.mermaidLoaded || !code) return '';
      
      try {
        const id = `mermaid-${chartId}-${Date.now()}`;
        const { svg } = await window.mermaid.render(id, code);
        return svg;
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        return '<div class="error-message">流程图渲染失败</div>';
      }
    },
    
    async renderAllCharts() {
      if (!this.mermaidLoaded || Object.keys(this.optPoints).length === 0) return;
      
      for (const [key, flowData] of Object.entries(this.filteredOptPoints)) {
        if (flowData.before) {
          this.renderedCharts[`${key}-before`] = await this.renderMermaidChart(flowData.before, `${key}-before`);
        }
        if (flowData.after) {
          this.renderedCharts[`${key}-after`] = await this.renderMermaidChart(flowData.after, `${key}-after`);
        }
        if (flowData.after2) {
          this.renderedCharts[`${key}-after2`] = await this.renderMermaidChart(flowData.after2, `${key}-after2`);
        }
        if (flowData.llm) {
          this.renderedCharts[`${key}-llm`] = await this.renderMermaidChart(flowData.llm, `${key}-llm`);
        }
      }
      
      // 强制更新视图
      this.$forceUpdate();
    },
    
    getRenderedChart(key, type) {
      const chartKey = `${key}-${type}`;
      return this.renderedCharts[chartKey] || '<div class="loading-message">图表加载中...</div>';
    },

    // 加载神经网络参数
    async loadNeuralNetworkParams() {
      this.parameterLoading = true;
      try {
        // 从API获取当前神经网络参数
        const response = await neuralNetworkApi.getCurrentParameters();
        if (response.data && response.data.code === 200) {
          const data = response.data.data;
          
          // 更新参数，排除last_updated字段
          const { last_updated, ...params } = data;
          this.neuralNetworkParams = { ...this.neuralNetworkParams, ...params };
          this.parameterLastUpdated = last_updated;
          this.showParameterSummary = true;
          
          console.log('✅ 神经网络参数加载成功:', this.neuralNetworkParams);
        }
        } catch (error) {
        console.error('❌ 加载神经网络参数失败:', error);
        this.$message.warning('参数配置加载失败，使用默认值');
        
        // 发生错误时显示默认参数但不显示摘要
        this.showParameterSummary = false;
      } finally {
        this.parameterLoading = false;
      }
    },

    // 加载RAG配置
    async loadRAGConfig() {
      this.ragConfigLoading = true;
      try {
        // 从API获取RAG启用状态
        const response = await neuralNetworkApi.getRAGEnabledStatus();
        if (response.data && response.data.code === 200) {
          const data = response.data.data;
          const ragStatus = data.enabled_status;
          
          // 计算启用的RAG数量
          const enabledCount = Object.values(ragStatus).filter(status => status).length;
          const totalCount = Object.keys(ragStatus).length;
          
          this.ragConfig = {
            processOptimization: ragStatus.process_optimization || false,
            enabledCount: enabledCount,
            totalCount: totalCount
          };
          
          this.ragLastUpdated = data.last_updated;
          
          // 只要数据加载成功就显示RAG摘要，无论是否启用
            this.showRAGSummary = true;
          
          console.log('✅ RAG配置加载成功:', this.ragConfig);
        }
        } catch (error) {
        console.error('❌ 加载RAG配置失败:', error);
        this.$message.warning('RAG配置加载失败，使用默认值');
        
        // 发生错误时使用默认值且不显示摘要
        this.ragConfig = {
          processOptimization: false,
          enabledCount: 0,
          totalCount: 1
        };
        this.showRAGSummary = false;
      } finally {
        this.ragConfigLoading = false;
      }
    },

    // 新增：加载优化数据的方法
    async loadOptimizationData() {
      this.dataLoading = true;
      this.dataError = null;
      
      try {
        const response = await processOptimizationApi.getAllOptimizations();
        
        // 输出完整的response让用户查看
        console.log('=== API Response 完整数据 ===');
        console.log('完整 Response:', response);
        console.log('Response Status:', response.status);
        console.log('Response StatusText:', response.statusText);
        console.log('Response Data:', response.data);
        console.log('Response Data Code:', response.data.code);
        console.log('Response Data Message:', response.data.message);
        console.log('Response Data (业务数据):', response.data.data);
        console.log('业务数据类型:', typeof response.data.data);
        console.log('业务数据键数量:', Object.keys(response.data.data).length);
        console.log('业务数据所有键:', Object.keys(response.data.data));
        
        // 输出每个优化项目的详细信息
        Object.keys(response.data.data).forEach(key => {
          console.log(`=== ${key} 详细数据 ===`);
          console.log(`标题: ${response.data.data[key].title}`);
          console.log(`描述: ${response.data.data[key].description}`);
          console.log(`是否有资源变化数据: ${!!response.data.data[key].resourceChanges}`);
          if (response.data.data[key].resourceChanges) {
            console.log(`资源变化摘要:`, response.data.data[key].resourceChanges.summary);
          }
        });
        console.log('=== API Response 数据输出结束 ===');
        
        if (response.data.code === 200) {
          this.optPoints = response.data.data;
          console.log('流程优化数据加载成功:', this.optPoints);
          // 数据加载成功后渲染图表
          if (this.mermaidLoaded) {
            this.renderAllCharts();
          }
        } else {
          throw new Error(response.data.message || '数据加载失败');
        }
      } catch (error) {
        this.dataError = error.message || '数据加载失败';
        console.error('加载流程优化数据失败:', error);
        this.$message.error('数据加载失败，请稍后重试');
      } finally {
        this.dataLoading = false;
      }
    },

    startRefactoring() {
      // 检查数据是否已加载
      if (Object.keys(this.filteredOptPoints).length === 0) {
        this.$message.warning('数据尚未加载完成，或相关RAG功能未启用，请检查RAG配置');
        return;
      }
      
      // 直接进入风险分析页面，隐藏主要操作卡片
      this.showRiskAnalysis = true;
      // 开始风险分析
      this.performRiskAnalysis();
    },

    async acceptChange(optimizationKey) {
      // 检查数据是否存在
      if (!this.optPoints[optimizationKey]) {
        this.$message.error('优化数据不存在');
        return;
      }

      // 检查是否有资源变化数据
      const hasResourceChanges = this.optPoints[optimizationKey] && this.optPoints[optimizationKey].resourceChanges;
      
      if (hasResourceChanges) {
        // 有资源变化数据，显示详细的资源变化确认对话框
        this.currentOptimizationKey = optimizationKey;
        this.showResourceDialog = true;
      } else {
        // 没有资源变化数据，使用简单的确认对话框
        this.$confirm('确认采用该优化方案吗？', '操作确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message.success('优化方案已应用');
          // 这里可添加实际业务逻辑
        }).catch(() => {
          this.$message.info('已取消操作');
        });
      }
    },

    rejectChange(optimizationKey) {
      // 检查数据是否存在
      if (!this.optPoints[optimizationKey]) {
        this.$message.error('优化数据不存在');
        return;
      }

      this.$confirm('确认拒绝该优化方案吗？', '操作确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.info('优化方案已拒绝')
        // 这里可添加实际业务逻辑
      })
    },

    handleResourceConfirm() {
      this.$message.success('资源变化已确认')
      // 这里可添加实际业务逻辑
    },

    handleResourceCancel() {
      this.$message.info('资源变化取消')
      // 这里可添加实际业务逻辑
    },

    // 新增：重新加载数据的方法
    async reloadData() {
      await this.loadOptimizationData();
    },

    goBackAndReload() {
      this.showMainContent = false;
      this.showRiskAnalysis = false;
      this.loadOptimizationData();
    },

    handleSolutionChange(value) {
      // 处理方案选择的逻辑
      console.log('Selected solution:', value);
      // 强制更新视图以重新渲染对应的图表
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },

    getFlowTitle(key) {
      if (this.optPoints[key]) {
        return this.optPoints[key].title;
      }
      return '未命名流程';
    },

    getFlowDescription(key) {
      if (this.optPoints[key]) {
        return this.optPoints[key].description;
      }
      return '该流程没有描述';
    },

    getAfterTitle() {
      if (this.selectedSolution === 'balanced') {
        return '强化学习平衡方案后的流程';
      } else if (this.selectedSolution === 'resource-first') {
        return '强化学习资源优先方案后的流程';
      }
      return '强化学习重构方案';
    },

    getAfterFlowData(key) {
      if (this.selectedSolution === 'balanced') {
        return this.optPoints[key].after;
      } else if (this.selectedSolution === 'resource-first') {
        return this.optPoints[key].after2;
      }
      return this.optPoints[key].before;
    },

    // 神经网络参数处理方法
    handleParameterChange(params) {
      // 实时更新参数
      this.neuralNetworkParams = { ...this.neuralNetworkParams, ...params };
      console.log('神经网络参数更新:', this.neuralNetworkParams);
    },

    handleApplySettings(params) {
      // 应用参数设置
      this.neuralNetworkParams = { ...this.neuralNetworkParams, ...params };
      console.log('应用神经网络参数:', params);
      console.log('当前所有参数:', this.neuralNetworkParams);
      
      // 显示参数摘要
      this.showParameterSummary = true;
      
      // 这里可以添加实际应用参数的逻辑
      // 比如重新加载数据、重新分析等
      
      // 显示参数设置摘要
      const paramSummary = [
        `地缘政治影响: ${params.geoPoliticalWeight}`,
        `价格波动敏感度: ${params.marketVolatilityFactor}`,
        `备用供应商覆盖: ${(params.backupSupplierRatio * 100).toFixed(0)}%`,
        `路径重评估: ${params.routeReevalFrequency}天`,
        `成本延误权衡: ${params.costDelayTradeoff}`,
        `节拍波动容忍: ±${(params.taktTimeVariance * 100).toFixed(0)}%`,
        `加班时长上限: ${params.overtimeCostCap}小时/月`
      ].join('；');
      
      this.$message.success({
        message: `神经网络参数已全部应用：${paramSummary}`,
        duration: 6000,
        showClose: true
      });
    },

    // 显示神经网络设置
    showNeuralNetworkSettings() {
      // 跳转到神经网络参数设置页面
      this.$router.push('/home/neural-network-settings');
    },

    // 配置RAG
    configureRAG() {
      // 跳转到RAG配置页面
      this.$router.push('/home/rag-config');
    },

    // 重新加载参数配置
    async reloadParameterConfig() {
      await this.loadNeuralNetworkParams();
    },

    // 重新加载RAG配置
    async reloadRAGConfig() {
      await this.loadRAGConfig();
    },

    // 重新加载所有配置
    async reloadAllConfigs() {
      await Promise.all([
        this.loadNeuralNetworkParams(),
        this.loadRAGConfig()
      ]);
    },

    // 执行风险分析
    async performRiskAnalysis() {
      this.riskAnalysisLoading = true;
      this.riskAnalysisError = null;
      
      try {
        // 使用llmApi的风险分析接口
        const response = await llmApi.analyzeRiskStructure();
        
        if (!response.success) {
          throw new Error(response.error || '风险分析失败');
        }

        const analysisData = response.data;
        const analysis = analysisData.analysis.riskAnalysis;

        // 保存完整的风险数据和分析数据，用于后续的流程节点风险分析
        this.savedRiskData = analysisData.originalData; // 原始风险数据
        this.savedAnalysisData = analysisData; // 完整的分析数据

        // 处理风险分析数据
        this.riskAnalysisData = {
          totalSteps: analysis.summary.totalSteps,
          highRiskCount: analysis.riskClassification.highRisk.steps.length,
          mediumRiskCount: analysis.riskClassification.mediumRisk.steps.length,
          lowRiskCount: analysis.riskClassification.lowRisk.steps.length,
          // 转换步骤数组为对象格式，包含id、name、description
          highRiskSteps: this.transformStepsArray(analysis.riskClassification.highRisk.steps, analysis.riskClassification.highRisk.description),
          mediumRiskSteps: this.transformStepsArray(analysis.riskClassification.mediumRisk.steps, analysis.riskClassification.mediumRisk.description),
          lowRiskSteps: this.transformStepsArray(analysis.riskClassification.lowRisk.steps, analysis.riskClassification.lowRisk.description),
          criticalStep: analysis.summary.criticalStep,
          recommendation: analysis.summary.recommendation
        };

        console.log('✅ 风险分析完成:', this.riskAnalysisData);
        console.log('💾 已保存风险数据供后续分析使用');
        this.$message.success('风险分析完成');
      } catch (error) {
        console.error('❌ 风险分析失败:', error);
        this.riskAnalysisError = error.message || '风险分析失败';
        this.$message.error('风险分析失败: ' + error.message);
      } finally {
        this.riskAnalysisLoading = false;
      }
    },

    // 重试风险分析
    async retryRiskAnalysis() {
      await this.performRiskAnalysis();
    },

    // 继续进入优化分析
    async proceedToOptimization() {
      try {
        // 检查是否有保存的风险数据
        if (!this.savedRiskData || !this.savedAnalysisData) {
          this.$message.warning('缺少风险数据，无法进行流程节点风险分析');
          this.showRiskAnalysis = false;
          this.showMainContent = true;
          return;
        }

        this.$message.info('正在进行流程节点风险分析...');
        
        // 调用流程节点风险分析API
        await this.analyzeProcessNodeRisk();
        
        // 进入主要内容页面
        this.showRiskAnalysis = false;
        this.showMainContent = true;
      } catch (error) {
        console.error('❌ 流程节点风险分析失败:', error);
        this.$message.error('流程节点风险分析失败，继续进入优化页面');
        // 即使失败也继续进入主要内容
        this.showRiskAnalysis = false;
        this.showMainContent = true;
      }
    },

    // 返回开始页面
    goBackToStart() {
      this.showRiskAnalysis = false;
      this.showMainContent = false;
      // 重置风险分析数据
      this.riskAnalysisData = null;
      this.riskAnalysisError = null;
      // 重置保存的数据
      this.savedRiskData = null;
      this.savedAnalysisData = null;
      this.processNodeRiskAnalysis = null;
    },

    // 转换步骤数组为对象格式
    transformStepsArray(stepsArray, description) {
      if (!Array.isArray(stepsArray)) {
        return [];
      }
      
      return stepsArray.map((stepName, index) => {
        // 智能生成步骤ID，基于步骤名称判断类型
        let stepId = '';
        const procurementKeywords = ['采购', '供应商', '签约', '验收', '结算', '入库', '质量', 'IQC'];
        const isProcurementRelated = procurementKeywords.some(keyword => stepName.includes(keyword));
        
        if (isProcurementRelated) {
          stepId = `PU${String(index + 1).padStart(2, '0')}`;
        } else {
          stepId = `STEP${String(index + 1).padStart(2, '0')}`;
        }
        
        return {
          id: stepId,
          name: stepName,
          description: description || `${stepName}环节的详细说明`
        };
      });
    },

    // 流程节点风险分析
    async analyzeProcessNodeRisk() {
      try {
        console.log('🔄 开始流程节点风险分析...');
        
        // 准备分析参数 - 只传入风险数据，流程结构由后端从数据库获取
        const analysisParams = {
          riskData: this.savedRiskData // 来自 analyzeRiskStructure 的原始风险数据
        };

        console.log('📊 分析参数:', {
          '风险数据记录数': (this.savedRiskData && this.savedRiskData.length) || 0,
          '流程结构数据源': '后端从数据库自动获取'
        });

        // 调用新的API
        const response = await llmApi.analyzeProcessNodeRisk(analysisParams);
        
        if (!response.success) {
          throw new Error(response.error || '流程节点风险分析失败');
        }

        console.log('✅ 流程节点风险分析完成:', response.data);
        this.$message.success('流程节点风险分析完成');
        
        // 可以将分析结果保存到组件状态中，供后续使用
        this.processNodeRiskAnalysis = response.data;
        
        return response.data;
      } catch (error) {
        console.error('❌ 流程节点风险分析失败:', error);
        throw error;
      }
    }
  }
}
</script>

<style scoped>
.process-optimization-container {
  padding: 20px;
}

/* 前置页面样式 */
.pre-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  min-height: 70vh;
  padding: 20px 0;
}

/* 数据加载状态样式 */
.data-error-indicator {
  width: 100%;
  max-width: 500px;
}

.error-indicator-card {
  text-align: center;
}

.error-indicator-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.error-indicator-content p {
  margin: 0;
  font-size: 14px;
  color: #F56C6C;
}

.pre-card {
  width: 100%;
  max-width: 1000px;
  text-align: center;
  transition: opacity 0.3s ease;
}

.pre-card.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.pre-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
}

.pre-content {
  padding: 40px 20px;
}

.pre-title {
  font-size: 28px;
  color: #303133;
  margin-bottom: 20px;
  font-weight: bold;
}

.pre-description {
  font-size: 16px;
  color: #606266;
  margin-bottom: 40px;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin: 30px 0;
}

.secondary-buttons {
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: center;
}

.refactor-button {
  padding: 15px 40px;
  font-size: 18px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
  min-width: 220px;
}

.refactor-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

.refactor-button i {
  margin-right: 8px;
}

.settings-button {
  padding: 10px 25px;
  font-size: 14px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(230, 162, 60, 0.3);
  transition: all 0.3s ease;
  min-width: 180px;
}

.settings-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.4);
}

.settings-button i {
  margin-right: 6px;
}

.rag-button {
  padding: 10px 25px;
  font-size: 14px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.3);
  transition: all 0.3s ease;
  min-width: 140px;
}

.rag-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.4);
}

.rag-button i {
  margin-right: 6px;
}

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

.rag-summary {
  margin-top: 20px;
  animation: fadeInUp 0.6s ease-out;
}

.rag-summary-content {
  margin-top: 10px;
  padding: 0;
}

.rag-status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.rag-status-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #606266;
  background-color: #f0f9ff;
  padding: 6px 10px;
  border-radius: 4px;
  border-left: 3px solid #67C23A;
}

.rag-status-item i {
  color: #67C23A;
  font-size: 14px;
}

.rag-label {
  font-weight: 500;
  white-space: nowrap;
}

.rag-value {
  font-weight: 600;
  color: #303133;
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

@media (max-width: 1024px) and (min-width: 769px) {
  .param-summary-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .rag-status-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .secondary-buttons {
    gap: 12px;
  }
  
  .settings-button {
    min-width: 160px;
  }
  
  .rag-button {
    min-width: 130px;
  }
}

@media (max-width: 768px) {
  .action-buttons {
    gap: 10px;
  }
  
  .secondary-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .refactor-button {
    padding: 12px 30px;
    font-size: 16px;
    min-width: 180px;
  }
  
  .settings-button {
    padding: 8px 20px;
    font-size: 13px;
    min-width: 150px;
  }
  
  .rag-button {
    padding: 8px 20px;
    font-size: 13px;
    min-width: 120px;
  }
  
  .param-summary-content {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  
  .param-item {
    font-size: 11px;
  }
  
  .rag-status-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .rag-status-item {
    font-size: 11px;
    padding: 5px 8px;
  }
  
  .rag-status-item i {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .secondary-buttons {
    gap: 8px;
  }
  
  .settings-button {
    padding: 6px 15px;
    font-size: 12px;
    min-width: 120px;
  }
  
  .rag-button {
    padding: 6px 15px;
    font-size: 12px;
    min-width: 100px;
  }
}

/* 风险分析前置界面样式 */
.risk-pre-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.risk-pre-card {
  width: 100%;
  max-width: 700px;
  text-align: center;
}

.risk-pre-content {
  padding: 50px 20px;
}

.neural-network {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  height: 200px;
}

.node-layer {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  margin: 0 20px;
}

.node {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(45deg, #409EFF, #67C23A);
  animation: pulse 2s infinite;
  margin: 5px 0;
}

.connection-layer {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  width: 40px;
}

.connection {
  height: 1px;
  background: linear-gradient(90deg, transparent, #409EFF, transparent);
  animation: flow 1.5s infinite;
  margin: 2px 0;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

@keyframes flow {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateX(20px);
  }
}

.loading-title {
  font-size: 24px;
  color: #303133;
  margin-bottom: 15px;
  font-weight: bold;
}

.loading-description {
  font-size: 16px;
  color: #606266;
  margin-bottom: 30px;
}

.progress-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #409EFF;
  animation: bounce 1.4s infinite ease-in-out;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.main-card {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title {
  font-size: 18px;
  color: #303133;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 4px solid #409EFF;
}

.mermaid-container {
  margin: 20px 0;
}

.mermaid-chart { /* 应用于 <pre> 标签 */
  width: 100%;
  text-align: center; /* 尝试让Mermaid SVG居中 */
  /* background-color: white; */ /* 背景色由父容器 .chart-container 控制 */
  border-radius: 4px;
  /* padding: 10px; */ /* 内边距由父容器 .chart-container 控制 */
  overflow: auto; /* 确保 pre 标签也能滚动，尽管父容器也有 */
}

.error-message {
  color: red;
  font-weight: bold;
  padding: 10px;
  border: 1px solid red;
  background-color: #ffeeee;
  border-radius: 4px;
  text-align: left;
  white-space: pre-wrap;
}

.strategy-description {
  margin-bottom: 20px;
}

.strategy-description .el-alert {
  border-radius: 8px;
  text-align: center;
}

.strategy-description .el-alert__title {
  font-size: 16px;
  font-weight: bold;
  color: #409EFF;
  text-align: center !important;
}

.strategy-description .el-alert__description {
  font-size: 14px;
  line-height: 1.6;
  margin-top: 8px;
  text-align: center !important;
}

.strategy-description :deep(.el-alert__content) {
  text-align: center;
}

.strategy-description :deep(.el-alert__title) {
  text-align: center !important;
}

.strategy-description :deep(.el-alert__description) {
  text-align: center !important;
}

/* Mermaid图表样式 */
.mermaid-chart {
  width: 100%;
  min-height: 200px;
  text-align: center;
  overflow: auto;
}

.loading-message {
  color: #909399;
  font-size: 14px;
  padding: 20px;
  text-align: center;
  background-color: #f5f7fa;
  border-radius: 4px;
  border: 1px dashed #dcdfe6;
}

.error-message {
  color: #F56C6C;
  font-size: 14px;
  padding: 20px;
  text-align: center;
  background-color: #fef0f0;
  border-radius: 4px;
  border: 1px solid #fbc4c4;
}

/* Mermaid图表通用样式 (使用 :deep() 穿透scoped CSS) */
:deep(.mermaid-chart svg) { /* 直接针对生成的svg元素 */
  display: block; /* 尝试解决可能的额外空间 */
  margin: auto; /* 配合父容器的flex居中 */
  max-width: 100% !important; /* 确保SVG不会超出其容器 */
  height: auto !important; /* 保持宽高比 */
}

:deep(.mermaid-chart .node rect),
:deep(.mermaid-chart .node circle),
:deep(.mermaid-chart .node ellipse),
:deep(.mermaid-chart .node polygon) {
  fill: #f0f9ff !important;
  stroke: #3572b0 !important;
  stroke-width: 1px !important;
}

:deep(.mermaid-chart .edgePath .path) {
  stroke: #3572b0 !important;
  stroke-width: 1.5px !important;
}

:deep(.mermaid-chart .label) {
  font-family: 'Consolas', 'Menlo', monospace !important; /* 使用更适合代码的字体 */
  font-size: 13px !important; /* 调整字体大小 */
  color: #333 !important;
}

/* 为不同类型的图表添加特定样式 */
:deep(.mermaid-chart .risk) {
  fill: #f9e3d3 !important;
  stroke: #f66 !important;
}

:deep(.mermaid-chart .policy) {
  fill: #e8f5e9 !important;
  stroke: #2e7d32 !important;
}

:deep(.mermaid-chart .ai) {
  fill: #e3f2fd !important;
  stroke: #2196f3 !important;
}

:deep(.mermaid-chart .human) {
  fill: #fff8e1 !important;
  stroke: #ffc107 !important;
}

.opt-chart-group {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 10px;
}

.comparison-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.opt-chart-block {
  width: 100%;
}
.opt-chart-title {
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 8px;
  color: #3572b0;
  padding-left: 2px;
  display: flex;
  align-items: center;
}

.opt-chart-title::before {
  content: '';
  width: 4px;
  height: 16px;
  background-color: #409EFF;
  margin-right: 8px;
  border-radius: 2px;
}

@media (min-width: 900px) {
  .opt-chart-group {
    flex-direction: row;
    gap: 40px;
  }
  .comparison-view {
    flex-direction: row;
    gap: 40px;
  }
  .opt-chart-block {
    flex: 1;
  }
}
 /* 新增样式 */
.operation-buttons {
  margin-top: 20px;
  text-align: center;
  padding: 10px 0;
  border-top: 1px solid #ebeef5;
  
  .el-button {
    margin: 0 8px;
    min-width: 120px;
  }
}

.no-data-warning {
  text-align: center;
  padding: 20px;
}

.no-data-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.no-data-content i {
  font-size: 48px;
  color: #E6A23C;
}

.no-data-content h3 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
}

.no-data-content p {
  font-size: 16px;
  color: #606266;
}

.no-data-content .el-button {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
}

.no-data-content .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

.solution-selector {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.solution-select {
  width: 100%;
  max-width: 400px;
}

.solution-selector ::v-deep .el-select .el-input__inner {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
}

.solution-selector ::v-deep .el-select-dropdown__item {
  height: auto;
  line-height: 1.5;
  padding: 12px 15px;
}

.solution-selector ::v-deep .el-select-dropdown__item span:first-child {
  font-weight: 600;
}

.selector-header {
  margin-bottom: 10px;
}

.selector-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.selector-description {
  font-size: 14px;
  color: #606266;
}

/* LLM重构流程特殊样式 */
.opt-chart-title .el-tag {
  font-size: 10px;
  height: 20px;
  line-height: 18px;
  padding: 0 6px;
  border-radius: 10px;
  background: linear-gradient(45deg, #67C23A, #85ce61);
  border: none;
  color: white;
  animation: glow 2s infinite alternate;
}

@keyframes glow {
  from {
    box-shadow: 0 0 5px rgba(103, 194, 58, 0.5);
  }
  to {
    box-shadow: 0 0 10px rgba(103, 194, 58, 0.8);
  }
}

/* LLM版本图表容器特殊效果 */
.opt-chart-group .opt-chart-block:has(.el-tag) .chart-container {
  border: 2px solid #67C23A;
  border-radius: 8px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
  position: relative;
  overflow: hidden;
}

.opt-chart-group .opt-chart-block:has(.el-tag) .chart-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(103, 194, 58, 0.1), transparent);
  animation: shine 3s infinite;
  z-index: 1;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* 风险分析中间态页面样式 */
.risk-analysis-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 20px;
}

.risk-analysis-card {
  width: 100%;
  max-width: 1200px;
}

.risk-analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
}

.risk-analysis-content {
  padding: 20px 0;
}

/* 风险分析加载状态 */
.risk-loading {
  text-align: center;
  padding: 60px 20px;
}

.risk-loading-spinner {
  margin-bottom: 20px;
}

.risk-loading-spinner i {
  font-size: 48px;
  color: #409EFF;
  animation: spin 1s linear infinite;
}

.risk-loading h3 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
}

.risk-loading p {
  font-size: 16px;
  color: #606266;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 风险统计卡片 */
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

/* 风险详情 */
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

/* 风险建议 */
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

/* 错误状态 */
.risk-error {
  text-align: center;
  padding: 60px 20px;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.error-content h3 {
  font-size: 24px;
  color: #303133;
  margin: 0;
}

.error-content p {
  font-size: 16px;
  color: #606266;
  margin: 0;
}

/* 底部操作按钮 */
.risk-analysis-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.risk-analysis-actions .el-button {
  min-width: 120px;
  padding: 12px 24px;
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
  
  .risk-analysis-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .risk-analysis-actions .el-button {
    width: 100%;
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