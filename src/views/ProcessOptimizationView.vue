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

            <!-- 节点风险状态分析区域 -->
            <div v-if="nodeRiskStatusData" class="node-risk-status-section">
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
                    <div class="stat-number">{{ nodeRiskStatusData.riskStatistics.totalNodes }}</div>
                    <div class="stat-label">总节点数</div>
                  </div>
                </div>
                
                <div class="node-stat-card high-risk-nodes">
                  <div class="stat-icon">
                    <i class="el-icon-warning"></i>
                  </div>
                  <div class="stat-content">
                    <div class="stat-number">{{ nodeRiskStatusData.riskStatistics.highRiskNodes }}</div>
                    <div class="stat-label">高危节点</div>
                  </div>
                </div>
                
                <div class="node-stat-card overall-risk">
                  <div class="stat-icon">
                    <i class="el-icon-pie-chart"></i>
                  </div>
                  <div class="stat-content">
                    <div class="stat-number">{{ nodeRiskStatusData.riskStatistics.overallRiskLevel }}</div>
                    <div class="stat-label">整体风险等级</div>
                  </div>
                </div>
              </div>

              <!-- 高危节点列表 -->
              <div v-if="nodeRiskStatusData.nodesByRiskLevel.HIGH.length > 0" class="high-risk-nodes-list">
                <h4 class="section-subtitle">🔴 高危节点详情</h4>
                <div class="high-risk-node-cards">
                  <div 
                    v-for="node in nodeRiskStatusData.nodesByRiskLevel.HIGH" 
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
                    <div class="path-text">{{ nodeRiskStatusData.criticalPath }}</div>
                    <div class="main-recommendation">
                      <strong>主要建议:</strong> {{ nodeRiskStatusData.mainRecommendation }}
                    </div>
                  </div>
                </el-alert>
              </div>
            </div>

            <!-- 节点风险分析加载状态 -->
            <div v-if="nodeRiskAnalysisLoading" class="node-risk-loading">
              <el-card class="loading-card">
                <div class="loading-content">
                  <i class="el-icon-loading loading-icon"></i>
                  <h4>正在分析节点风险状态...</h4>
                  <p>大模型正在结合风险数据和流程结构进行深度分析</p>
                </div>
              </el-card>
            </div>

            <!-- 节点风险分析错误状态 -->
            <div v-if="nodeRiskAnalysisError" class="node-risk-error">
              <el-alert
                title="节点风险分析失败"
                :description="nodeRiskAnalysisError"
                type="error"
                show-icon
                :closable="false">
                <el-button type="primary" size="small" @click="retryNodeRiskAnalysis">
                  重新分析
                </el-button>
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
          <el-button 
            v-if="!nodeRiskStatusData && !nodeRiskAnalysisLoading"
            type="primary" 
            @click="analyzeNodeRiskStatus" 
            :disabled="!riskAnalysisData">
            继续优化分析
          </el-button>
          
          <el-button 
            v-if="nodeRiskStatusData"
            type="success" 
            @click="proceedToOptimization">
            进入流程优化
          </el-button>
          
          <el-button @click="goBackToStart">
            返回
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 流程优化内容 -->
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
        <!-- 风险数据状态指示器 -->
        <div v-if="nodeRiskStatusData" class="risk-data-indicator">
          <el-tag size="small" type="success">
            <i class="el-icon-check"></i>
            节点风险数据已加载
          </el-tag>
          <span class="risk-data-summary">
            ({{ nodeRiskStatusData.riskStatistics.highRiskNodes }}个高危节点)
          </span>
          <!-- 导出按钮 -->
          <el-button 
            type="primary" 
            size="mini"
            icon="el-icon-download"
            @click="exportEnrichedDataToJson"
            :loading="exportLoading"
            class="export-button-inline">
            导出数据
          </el-button>
        </div>
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
                  <MermaidChart :code="flowData.before" />
                </div>
              </div>
              
              <!-- 根据选择的方案显示对应的重构流程 -->
              <div v-if="selectedSolution === 'balanced'" class="opt-chart-block">
                <div class="opt-chart-title">强化学习平衡方案重构流程</div>
                <div class="chart-container">
                  <MermaidChart :code="flowData.after" />
                </div>
              </div>
              
              <div v-if="selectedSolution === 'resource-first'" class="opt-chart-block">
                <div class="opt-chart-title">强化学习资源优先重构流程</div>
                <div class="chart-container">
                  <MermaidChart :code="flowData.after2" />
                </div>
              </div>
              
              <!-- LLM智能重构流程放在最右边 -->
              <div class="opt-chart-block">
                <div class="opt-chart-title">
                  <span>LLM智能重构流程</span>
                  <el-tag size="mini" type="success" style="margin-left: 8px;">AI生成</el-tag>
                </div>
                <div class="chart-container">
                  <MermaidChart :code="flowData.llm" />
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

      <!-- 高危节点风险分析展示区域 -->
      <div v-if="nodeRiskStatusData && nodeRiskStatusData.highRiskNodes.length > 0" class="high-risk-nodes-section">
        <el-card class="risk-nodes-card">
          <div slot="header" class="risk-nodes-header">
            <span>🔴 高危节点风险分析</span>
            <el-tag size="small" type="danger">{{ nodeRiskStatusData.highRiskNodes.length }}个高危节点</el-tag>
          </div>
          
          <!-- 高危节点概览 -->
          <div class="risk-nodes-overview">
            <el-alert
              title="风险路径分析"
              :description="`关键风险路径: ${nodeRiskStatusData.criticalPath || '未识别'}`"
              type="warning"
              :closable="false"
              show-icon>
            </el-alert>
          </div>

          <!-- 高危节点标签页 -->
          <el-tabs v-model="activeRiskNodeTab" type="border-card" class="risk-nodes-tabs">
            <el-tab-pane 
              v-for="(node, index) in nodeRiskStatusData.highRiskNodes" 
              :key="node.nodeId"
              :label="`${node.nodeId} - ${node.nodeName}`" 
              :name="node.nodeId"
            >
              <!-- 节点风险信息 -->
              <div class="risk-node-info">
                <div class="node-risk-summary">
                  <div class="risk-score-display">
                    <div class="score-circle" :class="getRiskLevelClass(node.riskLevel)">
                      <span class="score-value">{{ (node.riskScore * 100).toFixed(0) }}</span>
                      <span class="score-label">风险评分</span>
                    </div>
                    <div class="risk-details">
                      <h4 class="node-title">{{ node.nodeName }}</h4>
                      <div class="risk-factors">
                        <span class="factors-label">风险因素:</span>
                        <el-tag 
                          v-for="factor in node.riskFactors" 
                          :key="factor"
                          size="mini" 
                          type="warning" 
                          class="factor-tag">
                          {{ factor }}
                        </el-tag>
                      </div>
                      <div class="risk-reason">
                        <strong>风险原因:</strong> {{ node.riskReason }}
                      </div>
                      <div class="risk-recommendation">
                        <strong>改进建议:</strong> {{ node.recommendation }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 子流程Mermaid图表 -->
                <div v-if="node.nodeDetails && node.nodeDetails.flowCount > 0" class="node-subflow-section">
                  <h4 class="subflow-title">
                    <i class="el-icon-share"></i>
                    子流程详情 ({{ node.nodeDetails.flowCount }}个流程版本)
                  </h4>
                  
                  <div class="subflow-charts">
                    <!-- 主流程 -->
                    <div v-if="node.nodeDetails.mermaidDefinition1" class="subflow-chart-block">
                      <div class="subflow-chart-header">
                        <span class="chart-title">主流程 (标准流程)</span>
                        <el-tag size="mini" type="primary">推荐方案</el-tag>
                      </div>
                      <div class="chart-container subflow-chart">
                        <MermaidChart :code="node.nodeDetails.mermaidDefinition1" />
                      </div>
                    </div>

                    <!-- 备用流程 -->
                    <div v-if="node.nodeDetails.mermaidDefinition2" class="subflow-chart-block">
                      <div class="subflow-chart-header">
                        <span class="chart-title">备用流程 (快速流程)</span>
                        <el-tag size="mini" type="info">备选方案</el-tag>
                      </div>
                      <div class="chart-container subflow-chart">
                        <MermaidChart :code="node.nodeDetails.mermaidDefinition2" />
                      </div>
                    </div>
                  </div>

                  <!-- 子流程选择器 -->
                  <div class="subflow-selector" v-if="node.nodeDetails && node.nodeDetails.flowCount > 0">
                    <el-form inline label-width="100px">
                      <el-form-item :label="`选择流程`">
                        <el-select
                          v-model="nodeFlowSelections[node.nodeId]"
                          :placeholder="`当前：流程${node.nodeDetails.currentFlowNumber || 1}`"
                          size="small"
                          style="min-width: 160px;"
                        >
                          <el-option
                            v-for="i in (node.nodeDetails.flowCount || 1)"
                            :key="i"
                            :label="`流程${i}`"
                            :value="i"
                          />
                        </el-select>
                      </el-form-item>
                      <el-form-item>
                        <el-button
                          type="primary"
                          size="small"
                          :disabled="!nodeFlowSelections[node.nodeId] || nodeFlowSelections[node.nodeId] === (node.nodeDetails.currentFlowNumber || 1)"
                          @click="applyNodeFlowSelection('purchase', node.nodeId)"
                        >
                          应用
                        </el-button>
                      </el-form-item>
                    </el-form>
                  </div>

                  
                </div>

                <!-- 无子流程时的提示 -->
                <div v-else class="no-subflow-notice">
                  <el-alert
                    title="子流程信息"
                    description="该节点暂无详细子流程定义"
                    type="info"
                    :closable="false"
                    show-icon>
                  </el-alert>
                </div>
              </div>
              
              <!-- 操作按钮区域 -->
              <div class="node-action-buttons">
                <el-button 
                  type="warning" 
                  size="medium"
                  icon="el-icon-refresh"
                  @click="useBackupSolution(node.nodeId)">
                  使用备用方案
                </el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
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
import MermaidChart from '@/components/MermaidChart.vue'
import ResourceChangeConfirmation from '@/components/ResourceChangeConfirmation.vue'
import { processOptimizationApi } from '@/api/processOptimizationApi.js'
import { neuralNetworkApi } from '@/api/neuralNetworkApi'
import { llmApi } from '@/api/llmApi.js'
import { subProcessDataApi } from '@/api/subProcessDataApi.js'
import { nodeDetailApi } from '@/api/nodeDetailApi.js'

export default {
  name: 'ProcessOptimizationView',
  components: { 
    ResourceChangeConfirmation,
    MermaidChart
  },
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

      // 风险分析相关属性
      riskAnalysisLoading: false,
      riskAnalysisData: null,
      riskAnalysisError: null,
      activeRiskTab: 'high', // 默认显示高风险环节
      // 保存风险数据用于后续分析
      savedRiskData: null,
      savedAnalysisData: null,
      // 流程节点风险分析结果
      processNodeRiskAnalysis: null,
      // 节点风险状态数据（格式化后的）
      nodeRiskStatusData: null,
      // 节点风险分析加载状态
      nodeRiskAnalysisLoading: false,
      // 节点风险分析错误
      nodeRiskAnalysisError: null,
      
      // 高危节点数据
      highRiskNodeData: null, // 高危节点的详细数据
      highRiskNodeIds: [], // 高危节点ID列表
      nodeDataLoading: false, // 节点数据加载状态
      nodeDataError: null, // 节点数据加载错误
      exportLoading: false, // 导出功能加载状态
      
      // 高危节点展示相关状态
      activeRiskNodeTab: '', // 当前激活的高危节点标签页
      // 子流程选择：按节点保存选中的流程编号
      nodeFlowSelections: {}
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

    // 应用节点的子流程选择
    async applyNodeFlowSelection(nodeType, nodeId) {
      try {
        const selected = this.nodeFlowSelections[nodeId];
        if (!selected) {
          this.$message.warning('请先选择流程');
          return;
        }
        // 调用后端切换当前流程
        const res = await nodeDetailApi.switchNodeFlow(nodeType, nodeId, selected);
        if (res && res.success) {
          this.$message.success(`节点 ${nodeId} 已切换到流程 ${selected}`);
          // 同步更新本地展示数据：更新对应高危节点的 currentFlowNumber
          if (this.nodeRiskStatusData && Array.isArray(this.nodeRiskStatusData.highRiskNodes)) {
            const target = this.nodeRiskStatusData.highRiskNodes.find(n => n.nodeId === nodeId);
            if (target && target.nodeDetails) {
              target.nodeDetails.currentFlowNumber = selected;
            }
          }
          // 可选：重新获取该节点当前流程的Mermaid定义以确保一致
          try {
            const currentFlow = await nodeDetailApi.getNodeCurrentFlow(nodeType, nodeId);
            if (currentFlow && currentFlow.success && currentFlow.data) {
              // 根据 currentFlowNumber 覆盖对应的 mermaid 定义，方便立即预览
              const targetList = this.nodeRiskStatusData && this.nodeRiskStatusData.highRiskNodes
                ? this.nodeRiskStatusData.highRiskNodes
                : [];
              const target = targetList.find(n => n.nodeId === nodeId);
              if (target && target.nodeDetails) {
                // 不区分1/2字段名，这里仅同步编号，图形以当前展示为准
                target.nodeDetails.currentFlowNumber = currentFlow.data.currentFlowNumber;
              }
            }
          } catch (e) {
            // 忽略刷新失败
          }
          this.$forceUpdate();
        } else {
          this.$message.error((res && res.error) || '切换流程失败');
        }
      } catch (error) {
        this.$message.error(`切换流程失败：${error.message}`);
      }
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

    // 分析节点风险状态（新方法）
    async analyzeNodeRiskStatus() {
      try {
        // 检查是否有保存的风险数据
        if (!this.savedRiskData || !this.savedAnalysisData) {
          this.$message.warning('缺少风险数据，无法进行流程节点风险分析');
          return;
        }

        // 开始加载
        this.nodeRiskAnalysisLoading = true;
        this.nodeRiskAnalysisError = null;
        this.$message.info('正在进行流程节点风险分析...');
        
        // 调用节点风险状态分析API
        const riskStatusData = await this.getNodeRiskStatus();
        
        if (riskStatusData) {
          // 保存格式化后的节点风险状态数据
          this.nodeRiskStatusData = riskStatusData;
          console.log('✅ 节点风险状态数据已保存:', riskStatusData);
          
          // 调用API将原始API结果保存到MongoDB
          try {
            console.log('🔄 开始将原始节点风险状态数据保存到MongoDB...');
            
            // 使用原始API结果而不是格式化后的数据
            const originalApiResult = this.processNodeRiskAnalysis;
            console.log('📋 准备保存的原始API数据:', originalApiResult);
            
            const saveResult = await llmApi.saveNodeRiskStatusData(originalApiResult);
            
            if (saveResult.success) {
              console.log('✅ 原始节点风险状态数据已成功保存到MongoDB:', saveResult.data);
              this.$message.success('节点风险状态分析完成，原始数据已保存到数据库');
            } else {
              console.warn('⚠️ 原始节点风险状态数据保存到MongoDB失败:', saveResult.error);
              this.$message.warning('节点风险状态分析完成，但原始数据保存失败: ' + saveResult.error);
            }
          } catch (saveError) {
            console.error('❌ 保存原始节点风险状态数据到MongoDB异常:', saveError);
            this.$message.warning('节点风险状态分析完成，但原始数据保存异常: ' + saveError.message);
          }
          
          // 自动获取高危节点的详细数据
          await this.fetchHighRiskNodeData();
        } else {
          throw new Error('未能获取到节点风险状态数据');
        }
        
      } catch (error) {
        console.error('❌ 节点风险状态分析失败:', error);
        this.nodeRiskAnalysisError = error.message || '节点风险状态分析失败';
        this.$message.error('节点风险状态分析失败: ' + error.message);
      } finally {
        this.nodeRiskAnalysisLoading = false;
      }
    },

    // 重试节点风险分析
    async retryNodeRiskAnalysis() {
      await this.analyzeNodeRiskStatus();
    },

    // 获取高危节点的详细数据
    async fetchHighRiskNodeData() {
      try {
        console.log('🔍 开始获取高危节点的详细数据...');
        
        // 检查是否有高危节点数据
        if (!this.nodeRiskStatusData || !this.nodeRiskStatusData.highRiskNodes) {
          console.log('⚠️ 没有高危节点数据，跳过获取详细数据');
          return;
        }
        
        // 提取高危节点ID列表
        const highRiskNodeIds = this.nodeRiskStatusData.highRiskNodes.map(node => node.nodeId);
        
        if (highRiskNodeIds.length === 0) {
          console.log('⚠️ 没有高危节点ID，跳过获取详细数据');
          return;
        }
        
        this.nodeDataLoading = true;
        this.nodeDataError = null;
        this.highRiskNodeIds = highRiskNodeIds;
        
        console.log(`📋 准备获取高危节点数据: ${highRiskNodeIds.join(', ')}`);
        this.$message.info(`正在获取 ${highRiskNodeIds.length} 个高危节点的详细数据...`);
        
        // 调用API获取采购流程中的节点数据
        const nodeDataResult = await subProcessDataApi.getNodeDataFromMermaid('purchase', highRiskNodeIds);
        
        if (nodeDataResult.success) {
          this.highRiskNodeData = nodeDataResult.data;
          
          console.log('✅ 成功获取高危节点详细数据:', {
            totalRequested: nodeDataResult.data.totalRequested,
            totalFound: nodeDataResult.data.totalFound,
            notFoundNodes: nodeDataResult.data.notFoundNodes
          });
          
          // 显示获取结果
          const foundCount = nodeDataResult.data.totalFound;
          const totalCount = nodeDataResult.data.totalRequested;
          
          if (foundCount === totalCount) {
            this.$message.success(`成功获取所有 ${foundCount} 个高危节点的详细数据`);
          } else {
            this.$message.warning(`获取了 ${foundCount}/${totalCount} 个高危节点的详细数据，${nodeDataResult.data.notFoundNodes.length} 个节点未找到`);
            
            if (nodeDataResult.data.notFoundNodes.length > 0) {
              console.log('⚠️ 未找到的节点:', nodeDataResult.data.notFoundNodes);
            }
          }
          
          // 将节点数据与风险数据关联
          this.enrichRiskDataWithNodeData();
          
        } else {
          this.nodeDataError = nodeDataResult.error || '获取节点数据失败';
          console.error('❌ 获取高危节点数据失败:', nodeDataResult.error);
          this.$message.error('获取高危节点数据失败: ' + nodeDataResult.error);
        }
        
      } catch (error) {
        this.nodeDataError = error.message || '获取节点数据异常';
        console.error('❌ 获取高危节点数据异常:', error);
        this.$message.error('获取高危节点数据异常: ' + error.message);
      } finally {
        this.nodeDataLoading = false;
      }
    },

    // 将节点数据与风险数据关联（增强版本，支持完整子流程信息）
    enrichRiskDataWithNodeData() {
      try {
        if (!this.highRiskNodeData || !this.nodeRiskStatusData) {
          console.log('⚠️ 缺少必要的数据进行关联');
          return;
        }
        
        console.log('🔗 开始关联节点数据与风险数据（包含子流程详情）...');
        
        const nodeDataMap = this.highRiskNodeData.nodeDataMap || {};
        const enhancementInfo = this.highRiskNodeData.dataEnhancement || {};
        
        console.log('📊 数据关联概览:', {
          可关联节点数: Object.keys(nodeDataMap).length,
          包含子流程详情: enhancementInfo.includesSubProcessDetails,
          子流程节点数: enhancementInfo.subProcessNodesFound
        });
        
        let totalEnriched = 0;
        let subProcessEnriched = 0;
        
        // 为每个高危节点添加详细的节点数据
        if (this.nodeRiskStatusData.highRiskNodes) {
          this.nodeRiskStatusData.highRiskNodes.forEach(riskNode => {
            const nodeData = nodeDataMap[riskNode.nodeId];
            if (nodeData) {
              riskNode.nodeDetails = nodeData;
              totalEnriched++;
              
              // 检查是否包含子流程信息
              const hasSubProcess = nodeData.flowCount && nodeData.flowCount > 0;
              if (hasSubProcess) {
                subProcessEnriched++;
                console.log(`✅ 为节点 ${riskNode.nodeId} 关联了完整数据（含${nodeData.flowCount}个子流程）:`, {
                  基本信息: {
                    id: nodeData.id,
                    label: nodeData.label || nodeData.description,
                    type: nodeData.type
                  },
                  子流程信息: {
                    description: nodeData.description,
                    flowCount: nodeData.flowCount,
                    currentFlowNumber: nodeData.currentFlowNumber,
                    hasMainFlow: !!nodeData.mermaidDefinition1,
                    hasAltFlow: !!nodeData.mermaidDefinition2
                  }
                });
              } else {
                console.log(`✅ 为节点 ${riskNode.nodeId} 关联了基本数据:`, {
                  id: nodeData.id,
                  label: nodeData.label || nodeData.text,
                  type: nodeData.type,
                  source: nodeData.source
                });
              }
            } else {
              console.log(`⚠️ 节点 ${riskNode.nodeId} 没有找到对应的详细数据`);
            }
          });
        }
        
        // 为按风险等级分组的节点也添加详细数据
        if (this.nodeRiskStatusData.nodesByRiskLevel) {
          ['HIGH', 'MEDIUM', 'LOW'].forEach(level => {
            const nodes = this.nodeRiskStatusData.nodesByRiskLevel[level];
            if (nodes && Array.isArray(nodes)) {
              nodes.forEach(riskNode => {
                const nodeData = nodeDataMap[riskNode.nodeId];
                if (nodeData) {
                  riskNode.nodeDetails = nodeData;
                }
              });
            }
          });
        }
        
        console.log('✅ 节点数据与风险数据关联完成');
        console.log('📈 关联统计:', {
          总关联节点数: totalEnriched,
          包含子流程详情节点数: subProcessEnriched,
          关联成功率: `${((totalEnriched / ((this.nodeRiskStatusData.highRiskNodes && this.nodeRiskStatusData.highRiskNodes.length) || 1)) * 100).toFixed(1)}%`
        });
        
        // 根据关联结果显示不同的消息
        if (subProcessEnriched > 0) {
          this.$message.success(`节点数据关联完成！${totalEnriched}个节点已关联，其中${subProcessEnriched}个包含完整子流程详情。您可以使用左上角的导出按钮获取完整数据格式。`);
        } else if (totalEnriched > 0) {
          this.$message.success(`节点数据关联完成！${totalEnriched}个节点已关联基本信息。您可以使用左上角的导出按钮获取完整数据格式。`);
        } else {
          this.$message.warning('节点数据关联完成，但未找到匹配的节点详情。您可以使用左上角的导出按钮获取当前数据格式。');
        }
        
      } catch (error) {
        console.error('❌ 关联节点数据与风险数据失败:', error);
        this.$message.warning('关联节点数据失败: ' + error.message);
      }
    },

    // 导出关联后的数据到JSON文件
    exportEnrichedDataToJson() {
      this.exportLoading = true;
      try {
        // 创建导出数据对象
        const exportData = {
          // 元数据
          metadata: {
            exportTime: new Date().toISOString(),
            exportSource: 'ProcessOptimizationView',
            dataVersion: '1.0.0',
            description: '节点风险状态分析与节点详细数据关联后的完整数据'
          },
          
          // 关联统计信息
          enrichmentStats: {
            totalHighRiskNodes: this.nodeRiskStatusData.highRiskNodes.length,
            totalEnriched: 0,
            subProcessEnriched: 0,
            enrichmentRate: 0,
            subProcessCoverage: 0
          },
          
          // 原始风险分析数据
          originalRiskAnalysis: this.processNodeRiskAnalysis,
          
          // 格式化后的风险状态数据
          nodeRiskStatusData: this.nodeRiskStatusData,
          
          // 高危节点详细数据
          highRiskNodeData: this.highRiskNodeData,
          
          // 数据增强信息
          dataEnhancement: {
            includesSubProcessDetails: false,
            subProcessNodesFound: 0,
            enhancementSource: 'purchase_flow_mermaid'
          }
        };

        // 计算统计信息
        let totalEnriched = 0;
        let subProcessEnriched = 0;
        
        this.nodeRiskStatusData.highRiskNodes.forEach(node => {
          if (node.nodeDetails) {
            totalEnriched++;
            if (node.nodeDetails.flowCount && node.nodeDetails.flowCount > 0) {
              subProcessEnriched++;
            }
          }
        });

        exportData.enrichmentStats.totalEnriched = totalEnriched;
        exportData.enrichmentStats.subProcessEnriched = subProcessEnriched;
        exportData.enrichmentStats.enrichmentRate = totalEnriched / this.nodeRiskStatusData.highRiskNodes.length;
        exportData.enrichmentStats.subProcessCoverage = totalEnriched > 0 ? subProcessEnriched / totalEnriched : 0;

        // 检查数据增强情况
        if (this.highRiskNodeData && this.highRiskNodeData.dataEnhancement) {
          exportData.dataEnhancement = this.highRiskNodeData.dataEnhancement;
        }

        // 创建并下载JSON文件
        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `node-risk-enriched-data-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('📁 关联数据已导出到JSON文件:', link.download);
        this.$message.success('关联数据已导出到JSON文件供参考');
        
      } catch (error) {
        console.error('❌ 导出JSON文件失败:', error);
        this.$message.error('导出JSON文件失败: ' + error.message);
      } finally {
        this.exportLoading = false;
      }
    },

    // 进入流程优化（修改后的方法）
    async proceedToOptimization() {
      try {
        // 检查是否已完成节点风险分析
        if (!this.nodeRiskStatusData) {
          this.$message.warning('请先完成节点风险状态分析');
          return;
        }

        this.$message.info('进入流程优化界面...');
        
        // 确保节点风险数据已保存到组件状态中
        console.log('💾 保存节点风险分析数据供后续使用:', {
          nodeRiskStatusData: this.nodeRiskStatusData,
          processNodeRiskAnalysis: this.processNodeRiskAnalysis,
          savedRiskData: this.savedRiskData,
          savedAnalysisData: this.savedAnalysisData
        });
        
        // 直接进入主要内容页面，保留所有风险分析数据
        this.showRiskAnalysis = false;
        this.showMainContent = true;
        
        // 在主要内容页面中，这些数据仍然可用：
        // - this.nodeRiskStatusData (格式化后的节点风险数据)
        // - this.processNodeRiskAnalysis (原始API返回数据)
        // - this.savedRiskData (原始风险数据)
        // - this.savedAnalysisData (风险分析结果)
        
      } catch (error) {
        console.error('❌ 进入流程优化失败:', error);
        this.$message.error('进入流程优化失败: ' + error.message);
      }
    },

    // 返回开始页面
    goBackToStart() {
      this.showRiskAnalysis = false;
      this.showMainContent = false;
      // 重置风险分析数据
      this.riskAnalysisData = null;
      this.riskAnalysisError = null;
      // 重置节点风险分析数据
      this.nodeRiskStatusData = null;
      this.nodeRiskAnalysisLoading = false;
      this.nodeRiskAnalysisError = null;
      // 重置保存的数据
      this.savedRiskData = null;
      this.savedAnalysisData = null;
      this.processNodeRiskAnalysis = null;
      
      // 重置高危节点数据
      this.highRiskNodeData = null;
      this.highRiskNodeIds = [];
      this.nodeDataLoading = false;
      this.nodeDataError = null;
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

    // 获取节点风险状态数据 - 统一的风险分析函数
    async getNodeRiskStatus(forceRefresh = false) {
      try {
        // 如果已有数据且不强制刷新，直接返回格式化的数据
        if (this.processNodeRiskAnalysis && !forceRefresh) {
          console.log('📋 使用缓存的节点风险状态数据');
          const formattedData = this.formatNodeRiskData(this.processNodeRiskAnalysis.nodeRiskAnalysis);
          return formattedData;
        }

        // 检查是否有必要的风险数据
        if (!this.savedRiskData || !this.savedRiskData.length) {
          console.warn('⚠️ 缺少风险数据，无法获取节点风险状态');
          this.$message.warning('请先进行风险分析以获取风险数据');
          return null;
        }

        console.log('🔄 开始流程节点风险分析...');
        this.$message.info('正在分析节点风险状态...');

        // 准备分析参数 - 只传入风险数据，流程结构由后端从数据库获取
        const analysisParams = {
          riskData: this.savedRiskData // 来自 analyzeRiskStructure 的原始风险数据
        };

        console.log('📊 分析参数:', {
          '风险数据记录数': (this.savedRiskData && this.savedRiskData.length) || 0,
          '流程结构数据源': '后端从数据库自动获取'
        });

        // 调用API
        const response = await llmApi.analyzeProcessNodeRisk(analysisParams);
        
        if (!response.success) {
          throw new Error(response.error || '流程节点风险分析失败');
        }

        console.log('✅ 流程节点风险分析完成:', response.data);
        
        // 保存原始API结果到组件状态中
        this.processNodeRiskAnalysis = response.data;

        if (response.data && response.data.nodeRiskAnalysis) {
          // 处理和格式化节点风险状态数据
          const formattedData = this.formatNodeRiskData(response.data.nodeRiskAnalysis);
          
          console.log('✅ 节点风险状态数据获取成功:', formattedData);
          this.$message.success('节点风险状态分析完成');
          
          return formattedData;
        } else {
          throw new Error('API返回数据格式不正确');
        }

      } catch (error) {
        console.error('❌ 获取节点风险状态失败:', error);
        this.$message.error('获取节点风险状态失败: ' + error.message);
        return null;
      }
    },

    // 格式化节点风险数据
    formatNodeRiskData(nodeRiskAnalysis) {
      if (!nodeRiskAnalysis) {
        return null;
      }

      return {
        // 高危节点列表
        highRiskNodes: nodeRiskAnalysis.highRiskNodes || [],
        
        // 分析摘要
        summary: nodeRiskAnalysis.summary || {},
        
        // 按风险等级分组的节点
        nodesByRiskLevel: {
          HIGH: (nodeRiskAnalysis.highRiskNodes || []).filter(node => node.riskLevel === 'HIGH'),
          MEDIUM: (nodeRiskAnalysis.highRiskNodes || []).filter(node => node.riskLevel === 'MEDIUM'),
          LOW: (nodeRiskAnalysis.highRiskNodes || []).filter(node => node.riskLevel === 'LOW')
        },
        
        // 节点风险映射表（便于快速查找）
        nodeRiskMap: this.createNodeRiskMap(nodeRiskAnalysis.highRiskNodes || []),
        
        // 关键风险路径
        criticalPath: (nodeRiskAnalysis.summary && nodeRiskAnalysis.summary.criticalPath) || '',
        
        // 主要建议
        mainRecommendation: (nodeRiskAnalysis.summary && nodeRiskAnalysis.summary.mainRecommendation) || '',
        
        // 风险统计
        riskStatistics: {
          totalNodes: (nodeRiskAnalysis.summary && nodeRiskAnalysis.summary.totalNodes) || 0,
          highRiskNodes: (nodeRiskAnalysis.summary && nodeRiskAnalysis.summary.highRiskNodes) || 0,
          mediumRiskNodes: (nodeRiskAnalysis.summary && nodeRiskAnalysis.summary.mediumRiskNodes) || 0,
          lowRiskNodes: (nodeRiskAnalysis.summary && nodeRiskAnalysis.summary.lowRiskNodes) || 0,
          overallRiskLevel: (nodeRiskAnalysis.summary && nodeRiskAnalysis.summary.overallRiskLevel) || 'UNKNOWN'
        }
      };
    },

    // 创建节点风险映射表
    createNodeRiskMap(nodes) {
      const riskMap = {};
      
      if (Array.isArray(nodes)) {
        nodes.forEach(node => {
          if (node.nodeId) {
            riskMap[node.nodeId] = {
              riskLevel: node.riskLevel,
              riskScore: node.riskScore,
              riskFactors: node.riskFactors || [],
              riskReason: node.riskReason || '',
              recommendation: node.recommendation || ''
            };
          }
        });
      }
      
      return riskMap;
    },

    // 根据节点ID获取风险状态
    getNodeRiskById(nodeId) {
      if (!this.processNodeRiskAnalysis || !nodeId) {
        return null;
      }

      const formattedData = this.formatNodeRiskData(this.processNodeRiskAnalysis.nodeRiskAnalysis);
      return (formattedData && formattedData.nodeRiskMap && formattedData.nodeRiskMap[nodeId]) || null;
    },

    // 获取高危节点列表
    getHighRiskNodes() {
      if (!this.processNodeRiskAnalysis) {
        return [];
      }

      const formattedData = this.formatNodeRiskData(this.processNodeRiskAnalysis.nodeRiskAnalysis);
      return (formattedData && formattedData.nodesByRiskLevel && formattedData.nodesByRiskLevel.HIGH) || [];
    },

    // 检查节点是否为高危节点
    isHighRiskNode(nodeId) {
      const nodeRisk = this.getNodeRiskById(nodeId);
      return nodeRisk && nodeRisk.riskLevel === 'HIGH';
    },

    // 获取风险统计信息
    getRiskStatistics() {
      if (!this.processNodeRiskAnalysis) {
        return null;
      }

      const formattedData = this.formatNodeRiskData(this.processNodeRiskAnalysis.nodeRiskAnalysis);
      return (formattedData && formattedData.riskStatistics) || null;
    },

    // 获取风险等级的CSS类名
    getRiskLevelClass(riskLevel) {
      switch (riskLevel) {
        case 'HIGH':
          return 'high-risk-score';
        case 'MEDIUM':
          return 'medium-risk-score';
        case 'LOW':
          return 'low-risk-score';
        default:
          return 'unknown-risk-score';
      }
    },

    // 使用备用方案
    useBackupSolution(nodeId) {
      console.log('使用备用方案按钮被点击，节点ID:', nodeId);
      // TODO: 在这里实现使用备用方案的具体功能
      this.$message.info(`节点 ${nodeId} 的备用方案功能待实现`);
    },




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

/* 导出按钮样式 */
.export-button-inline {
  margin-left: 10px;
  background: linear-gradient(135deg, #409EFF, #67C23A);
  border: none;
  color: white;
  font-weight: 500;
  font-size: 12px;
  padding: 4px 8px;
  box-shadow: 0 1px 4px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
}

.export-button-inline:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.4);
}

.export-button-inline:active {
  transform: translateY(0);
}

.risk-data-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
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

.risk-data-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.risk-data-summary {
  font-size: 12px;
  color: #67c23a;
  font-weight: 500;
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



/* 节点风险状态分析区域样式 */
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

/* 节点风险分析加载状态 */
.node-risk-loading {
  margin: 20px 0;
}

.loading-card {
  text-align: center;
  border: 2px dashed #409EFF;
}

.loading-content {
  padding: 30px;
}

.loading-icon {
  font-size: 32px;
  color: #409EFF;
  margin-bottom: 15px;
}

.loading-content h4 {
  color: #303133;
  margin-bottom: 10px;
}

.loading-content p {
  color: #606266;
  font-size: 14px;
}

/* 节点风险分析错误状态 */
.node-risk-error {
  margin: 20px 0;
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

/* 高危节点风险分析展示区域样式 */
.high-risk-nodes-section {
  margin-top: 30px;
}

.risk-nodes-card {
  border: 2px solid #f56c6c;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.2);
}

.risk-nodes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  color: #f56c6c;
}

.risk-nodes-overview {
  margin-bottom: 20px;
}

.risk-nodes-tabs {
  min-height: 600px;
}

/* 节点风险信息样式 */
.risk-node-info {
  padding: 20px 0;
}

.node-risk-summary {
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #fff5f5 0%, #ffeaea 100%);
  border-radius: 8px;
  border-left: 4px solid #f56c6c;
}

.risk-score-display {
  display: flex;
  align-items: center;
  gap: 20px;
}

.score-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  font-weight: bold;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.score-circle.high-risk-score {
  background: linear-gradient(135deg, #f56c6c, #f78989);
}

.score-circle.medium-risk-score {
  background: linear-gradient(135deg, #e6a23c, #f1c40f);
}

.score-circle.low-risk-score {
  background: linear-gradient(135deg, #67c23a, #85ce61);
}

.score-circle.unknown-risk-score {
  background: linear-gradient(135deg, #909399, #b4bccc);
}

.score-value {
  font-size: 20px;
  line-height: 1;
}

.score-label {
  font-size: 10px;
  margin-top: 2px;
  opacity: 0.9;
}

.risk-details {
  flex: 1;
}

.node-title {
  font-size: 18px;
  color: #303133;
  margin-bottom: 12px;
  font-weight: bold;
}

.risk-factors {
  margin-bottom: 12px;
}

.factors-label {
  font-weight: 500;
  color: #606266;
  margin-right: 8px;
}

.factor-tag {
  margin: 0 4px 4px 0;
}

.risk-reason, .risk-recommendation {
  margin-bottom: 12px;
  line-height: 1.6;
  color: #606266;
}

.risk-reason strong, .risk-recommendation strong {
  color: #f56c6c;
}

/* 子流程图表样式 */
.node-subflow-section {
  margin-top: 30px;
}

.subflow-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #303133;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f2f5;
}

.subflow-title i {
  color: #409eff;
  font-size: 18px;
}

.subflow-charts {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 20px;
}

.subflow-chart-block {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.subflow-chart-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.subflow-chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e4e7ed;
}

.chart-title {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.subflow-chart {
  background: white;
  min-height: 300px;
  padding: 16px;
}

.subflow-chart .mermaid-chart {
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 子流程图表特殊样式 */
.subflow-chart :deep(.mermaid-chart svg) {
  max-width: 100% !important;
  height: auto !important;
  display: block;
  margin: 0 auto;
}

.subflow-chart :deep(.mermaid-chart .node rect),
.subflow-chart :deep(.mermaid-chart .node circle),
.subflow-chart :deep(.mermaid-chart .node ellipse),
.subflow-chart :deep(.mermaid-chart .node polygon) {
  fill: #e3f2fd !important;
  stroke: #1976d2 !important;
  stroke-width: 2px !important;
}

.subflow-chart :deep(.mermaid-chart .edgePath .path) {
  stroke: #1976d2 !important;
  stroke-width: 2px !important;
}

.subflow-chart :deep(.mermaid-chart .label) {
  font-family: 'Microsoft YaHei', sans-serif !important;
  font-size: 12px !important;
  color: #333 !important;
  font-weight: 500 !important;
}



/* 无子流程提示样式 */
.no-subflow-notice {
  margin-top: 20px;
  text-align: center;
}

/* 节点操作按钮样式 */
.node-action-buttons {
  margin-top: 20px;
  padding: 15px 0;
  border-top: 1px solid #ebeef5;
  text-align: center;
}

.node-action-buttons .el-button {
  min-width: 120px;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(230, 162, 60, 0.3);
  transition: all 0.3s ease;
}

.node-action-buttons .el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.4);
}

.node-action-buttons .el-button i {
  margin-right: 6px;
}

/* 高危节点响应式设计 */
@media (max-width: 768px) {
  .risk-score-display {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .score-circle {
    width: 70px;
    height: 70px;
  }
  
  .score-value {
    font-size: 18px;
  }
  
  .subflow-charts {
    gap: 20px;
  }
  
  .subflow-chart {
    padding: 12px;
  }
  
  .subflow-chart-header {
    padding: 10px 12px;
  }
  
  .chart-title {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .risk-nodes-header {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  
  .node-risk-summary {
    padding: 15px;
  }
  
  .node-title {
    font-size: 16px;
  }
  
  .subflow-title {
    font-size: 14px;
  }
  
  .factors-label {
    display: block;
    margin-bottom: 4px;
  }
}
</style> 