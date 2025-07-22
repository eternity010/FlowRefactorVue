<template>
  <div class="planning-time-container">
    <div class="page-header">
      <span>规划完成时间分析</span>
      <div class="header-right">
        <el-tag size="small" type="info">神经网络模型 v1.1.0</el-tag>
        <el-button 
          v-if="!isLoading" 
          size="mini" 
          icon="el-icon-refresh" 
          @click="refreshData"
          :loading="isLoading"
          class="refresh-btn">
          刷新数据
        </el-button>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner">
        <i class="el-icon-loading"></i>
      </div>
      <div class="loading-text">{{ loadingText }}</div>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="hasError" class="error-container">
      <div class="error-icon">
        <i class="el-icon-warning"></i>
      </div>
      <div class="error-text">{{ errorMessage }}</div>
      <el-button type="primary" @click="loadPlanningTimeData" class="retry-btn">重新加载</el-button>
    </div>
    
    <!-- 数据流向神经网络可视化 -->
    <div v-else class="neural-flow-section">
      <h3 class="section-title">数据输入流向分析</h3>
      <div class="flow-diagram">
        <!-- 三个输入数据源 -->
        <div class="input-nodes">
          <!-- 输入节点1 - 流程数据 -->
          <div class="input-node node-1">
            <div class="node-circle input-circle" data-label="流程数据">
              <i class="el-icon-s-operation"></i>
            </div>
            <div class="node-label">流程数据</div>
          </div>
          
          <!-- 输入节点2 - 风险数据 -->
          <div class="input-node node-2">
            <div class="node-circle input-circle" data-label="风险数据">
              <i class="el-icon-warning"></i>
            </div>
            <div class="node-label">风险数据</div>
          </div>
          
          <!-- 输入节点3 - 实时监控数据 -->
          <div class="input-node node-3">
            <div class="node-circle input-circle" data-label="实时监控数据">
              <i class="el-icon-monitor"></i>
            </div>
            <div class="node-label">实时监控数据</div>
          </div>
        </div>
        
        <!-- 数据流箭头 -->
        <div class="flow-arrows">
          <!-- 主汇聚箭头 -->
          <div class="main-arrow">
            <!-- 主箭头主体 -->
            <div class="arrow-body">
              <div class="arrow-shaft">
                <div class="energy-flow"></div>
                <div class="energy-flow delay-1"></div>
                <div class="energy-flow delay-2"></div>
              </div>
              <div class="arrow-head-large">
                <div class="head-core"></div>
                <div class="head-glow"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 中央神经网络模型 -->
        <div class="neural-network">
          <div class="network-circle">
            <div class="network-core">
              <i class="el-icon-cpu"></i>
              <div class="network-text">神经网络</div>
              <div class="network-subtext">预测模型</div>
            </div>
            <div class="network-ring"></div>
            <div class="network-ring ring-2"></div>
          </div>
          <div class="network-label">深度学习模型</div>
        </div>
        
        <!-- 数据流动效果 -->
        <div class="data-particles">
          <div class="particle particle-1"></div>
          <div class="particle particle-2"></div>
          <div class="particle particle-3"></div>
          <div class="particle particle-4"></div>
          <div class="particle particle-5"></div>
          <div class="particle particle-6"></div>
        </div>
      </div>
      
      <!-- 神经网络模型输出 -->
      <div class="model-output-section">
        <el-button 
          type="primary" 
          size="medium" 
          icon="el-icon-view"
          @click="showModelOutput"
          class="output-trigger-btn">
          查看神经网络模型输出
        </el-button>
      </div>
      
      <!-- 数据统计信息 -->
      <div class="flow-stats">
        <div class="stat-item">
          <div class="stat-value">{{ stats.processNodes }}</div>
          <div class="stat-label">流程节点数量</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.monitoringRate }}ms</div>
          <div class="stat-label">监控响应速度</div>
        </div>
        
        <!-- 三种方案预测准确度历史 -->
        <div class="prediction-accuracy-section">
          <h4 class="accuracy-title">预测方案准确度历史</h4>
          <div class="accuracy-schemes">
            <div class="scheme-item scheme-lr">
              <div class="scheme-header">
                <span class="scheme-name">方案A-LR</span>
                <span class="current-accuracy">{{ currentAccuracy.lr }}%</span>
              </div>
              <div class="accuracy-history">
                <div 
                  v-for="(accuracy, index) in accuracyHistory.lr" 
                  :key="index"
                  class="history-point lr-point"
                  :title="`第${index + 1}次: ${accuracy}%`"
                  :style="{ 
                    left: (index * (100 / (accuracyHistory.lr.length - 1))) + '%',
                    bottom: ((accuracy - 96) / 4 * 100) + '%'
                  }">
                </div>
                <div class="trend-line lr-line"></div>
              </div>
              <div class="accuracy-trend">
                <span class="trend-text">趋势: {{ getTrendText('lr') }}</span>
              </div>
            </div>
            
            <div class="scheme-item scheme-xgb">
              <div class="scheme-header">
                <span class="scheme-name">方案B-XGB</span>
                <span class="current-accuracy">{{ currentAccuracy.xgb }}%</span>
              </div>
              <div class="accuracy-history">
                <div 
                  v-for="(accuracy, index) in accuracyHistory.xgb" 
                  :key="index"
                  class="history-point xgb-point"
                  :title="`第${index + 1}次: ${accuracy}%`"
                  :style="{ 
                    left: (index * (100 / (accuracyHistory.xgb.length - 1))) + '%',
                    bottom: ((accuracy - 96) / 4 * 100) + '%'
                  }">
                </div>
                <div class="trend-line xgb-line"></div>
              </div>
              <div class="accuracy-trend">
                <span class="trend-text">趋势: {{ getTrendText('xgb') }}</span>
              </div>
            </div>
            
            <div class="scheme-item scheme-gcn">
              <div class="scheme-header">
                <span class="scheme-name">方案C-GCN</span>
                <span class="current-accuracy">{{ currentAccuracy.gcn }}%</span>
              </div>
              <div class="accuracy-history">
                <div 
                  v-for="(accuracy, index) in accuracyHistory.gcn" 
                  :key="index"
                  class="history-point gcn-point"
                  :title="`第${index + 1}次: ${accuracy}%`"
                  :style="{ 
                    left: (index * (100 / (accuracyHistory.gcn.length - 1))) + '%',
                    bottom: ((accuracy - 80) / 8 * 100) + '%'
                  }">
                </div>
                <div class="trend-line gcn-line"></div>
              </div>
              <div class="accuracy-trend">
                <span class="trend-text">趋势: {{ getTrendText('gcn') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 神经网络模型输出对话框 -->
    <el-dialog
      title="神经网络模型运行控制台"
      :visible.sync="modelOutputVisible"
      width="90%"
      :close-on-click-modal="false"
      class="model-console-dialog">
      
      <div class="console-container">
        <!-- 控制台头部 -->
        <div class="console-header">
          <div class="console-title">
            <i class="el-icon-cpu"></i>
            <span>深度学习模型运行控制台</span>
            <el-tag v-if="consoleStatus === 'running'" type="warning" size="small">运行中</el-tag>
            <el-tag v-else-if="consoleStatus === 'completed'" type="success" size="small">已完成</el-tag>
            <el-tag v-else type="info" size="small">待启动</el-tag>
          </div>
          <div class="console-controls">
            <el-button v-if="consoleStatus !== 'running'" 
                       type="primary" 
                       size="mini" 
                       @click="startModelRun"
                       icon="el-icon-video-play">
              启动模型
            </el-button>
            <el-button size="mini" @click="clearConsole" icon="el-icon-delete">清空</el-button>
          </div>
        </div>
        
        <!-- 控制台主体 -->
        <div class="console-body" ref="consoleBody">
          <div class="console-output">
            <div v-for="(log, index) in consoleLogs" 
                 :key="index" 
                 :class="['log-line', log.type]"
                 :style="{ animationDelay: index * 0.1 + 's' }">
              <span class="log-timestamp">{{ log.timestamp }}</span>
              <span class="log-level" :class="log.level">{{ log.level.toUpperCase() }}</span>
              <span class="log-message">{{ log.message }}</span>
              <span v-if="log.value" class="log-value">{{ log.value }}</span>
            </div>
            
            <!-- 光标闪烁 -->
            <div v-if="consoleStatus === 'running'" class="cursor-line">
              <span class="cursor">█</span>
            </div>
          </div>
        </div>
        
        <!-- 控制台底部状态栏 -->
        <div class="console-footer">
          <div class="status-info">
            <span>状态: {{ getStatusText() }}</span>
            <span v-if="consoleStatus === 'running'">运行时间: {{ formatRunTime(runTime) }}</span>
            <span>日志行数: {{ consoleLogs.length }}</span>
          </div>
        </div>
      </div>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="modelOutputVisible = false">关闭</el-button>
        <el-button v-if="consoleStatus === 'completed'" 
                   type="primary" 
                   @click="exportLogs">导出日志</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { planningTimeApi } from '@/api/planningTimeApi';

export default {
  name: 'PlanningTimeView',
  data() {
    return {
      // 加载状态
      isLoading: true,
      loadingText: '正在加载规划时间数据...',
      hasError: false,
      errorMessage: '',
      
      // 从API获取的数据
      stats: {
        processNodes: 0,
        monitoringRate: 0
      },
      sampleData: {
        nodePath: [],
        nodeCount: 0,
        edgeCount: 0,
        edges: []
      },
      currentAccuracy: {
        lr: 0,
        xgb: 0,
        gcn: 0
      },
      accuracyHistory: {
        lr: [],
        xgb: [],
        gcn: []
      },
      consoleTemplate: null,
      flowConfiguration: null,
      
      // 控制台相关状态
      modelOutputVisible: false,
      consoleStatus: 'pending',
      consoleLogs: [],
      runTime: 0,
      runTimeTimer: null
    }
  },
  async mounted() {
    // 加载数据
    await this.loadPlanningTimeData();
    
    // 启动数据流动动画
    this.startFlowAnimation();
  },
  
  beforeDestroy() {
    // 清理定时器
    if (this.runTimeTimer) {
      clearInterval(this.runTimeTimer);
    }
  },
  methods: {
    /**
     * 加载规划时间数据
     */
    async loadPlanningTimeData() {
      this.isLoading = true;
      this.hasError = false;
      this.loadingText = '正在加载规划时间数据...';
      
      try {
        // 并行获取所有需要的数据
        const [
          statisticsResult,
          sampleDataResult,
          predictionSchemesResult,
          consoleTemplateResult,
          flowConfigResult
        ] = await Promise.all([
          planningTimeApi.getStatistics(),
          planningTimeApi.getSampleData(),
          planningTimeApi.getPredictionSchemes(),
          planningTimeApi.getConsoleTemplate(),
          planningTimeApi.getFlowConfiguration()
        ]);

        // 检查所有请求是否成功
        if (!statisticsResult.success) {
          throw new Error(statisticsResult.message || '获取统计数据失败');
        }
        if (!sampleDataResult.success) {
          throw new Error(sampleDataResult.message || '获取样本数据失败');
        }
        if (!predictionSchemesResult.success) {
          throw new Error(predictionSchemesResult.message || '获取预测方案失败');
        }
        if (!consoleTemplateResult.success) {
          throw new Error(consoleTemplateResult.message || '获取控制台模板失败');
        }
        if (!flowConfigResult.success) {
          throw new Error(flowConfigResult.message || '获取流程配置失败');
        }

        // 设置统计数据
        this.stats = {
          processNodes: statisticsResult.data.processNodes || 0,
          monitoringRate: statisticsResult.data.monitoringRate || 0
        };

        // 设置样本数据
        this.sampleData = {
          nodePath: sampleDataResult.data.nodePath || [],
          nodeCount: sampleDataResult.data.nodeCount || 0,
          edgeCount: sampleDataResult.data.edgeCount || 0,
          edges: sampleDataResult.data.edges || []
        };

        // 设置预测方案数据
        const schemes = predictionSchemesResult.data || [];
        
        // 重置准确度数据
        this.currentAccuracy = { lr: 0, xgb: 0, gcn: 0 };
        this.accuracyHistory = { lr: [], xgb: [], gcn: [] };
        
        // 处理每个预测方案
        schemes.forEach(scheme => {
          switch (scheme.schemeId) {
            case 'scheme_lr':
              this.currentAccuracy.lr = scheme.currentAccuracy || 0;
              this.accuracyHistory.lr = scheme.accuracyHistory || [];
              break;
            case 'scheme_xgb':
              this.currentAccuracy.xgb = scheme.currentAccuracy || 0;
              this.accuracyHistory.xgb = scheme.accuracyHistory || [];
              break;
            case 'scheme_gcn':
              this.currentAccuracy.gcn = scheme.currentAccuracy || 0;
              this.accuracyHistory.gcn = scheme.accuracyHistory || [];
              break;
          }
        });

        // 设置控制台模板和流程配置
        this.consoleTemplate = consoleTemplateResult.data;
        this.flowConfiguration = flowConfigResult.data;

        console.log('✅ 规划时间数据加载成功', {
          stats: this.stats,
          sampleData: this.sampleData,
          schemes: schemes.length,
          consoleSteps: (this.consoleTemplate && this.consoleTemplate.executionSteps) ? this.consoleTemplate.executionSteps.length : 0
        });

      } catch (error) {
        console.error('❌ 加载规划时间数据失败:', error);
        this.hasError = true;
        this.errorMessage = error.message || '加载数据失败';
        
        this.$message({
          message: `加载规划时间数据失败: ${this.errorMessage}`,
          type: 'error',
          duration: 5000
        });
      } finally {
        this.isLoading = false;
      }
    },
    
    startFlowAnimation() {
      // 模拟数据流动效果
      setInterval(() => {
        // 可以在这里添加动态更新逻辑
      }, 3000);
    },
    showModelOutput() {
      this.modelOutputVisible = true;
    },
    startModelRun() {
      this.consoleStatus = 'running';
      this.consoleLogs = [];
      this.runTime = 0;
      
      this.startModelPrediction();
      this.startRunTimeCounter();
    },
    
    clearConsole() {
      this.consoleStatus = 'pending';
      this.consoleLogs = [];
      this.runTime = 0;
      
      // 清除定时器
      if (this.runTimeTimer) {
        clearInterval(this.runTimeTimer);
      }
    },
    
    exportLogs() {
      this.$message({
        message: '控制台日志已导出',
        type: 'success'
      });
    },
    
    startModelPrediction() {
      if (!this.consoleTemplate || !this.consoleTemplate.executionSteps) {
        this.addLog('error', '控制台模板未加载，无法启动模型预测', null);
        return;
      }

      // 使用从API获取的控制台模板执行步骤
      const steps = this.consoleTemplate.executionSteps;
      
      steps.forEach((step, index) => {
        setTimeout(() => {
          this.addLog(step.logLevel, step.message, step.value || null);
          
          // 如果是最后一步，设置完成状态
          if (index === steps.length - 1) {
            this.consoleStatus = 'completed';
            
            // 清除运行时间计时器
            if (this.runTimeTimer) {
              clearInterval(this.runTimeTimer);
            }
            
            // 自动滚动到底部
            this.$nextTick(() => {
              const consoleBody = this.$refs.consoleBody;
              if (consoleBody) {
                consoleBody.scrollTop = consoleBody.scrollHeight;
              }
            });
          }
        }, step.delay);
      });
    },
    
    startRunTimeCounter() {
      this.runTimeTimer = setInterval(() => {
        this.runTime++;
      }, 1000);
    },
    
    addLog(level, message, value = null) {
      this.consoleLogs.push({
        type: level,
        level: level,
        message: message,
        value: value,
        timestamp: this.getCurrentTimestamp()
      });
    },
    
    getCurrentTimestamp() {
      const now = new Date();
      return now.toTimeString().split(' ')[0];
    },
    
    getStatusText() {
      if (this.consoleStatus === 'running') {
        return '运行中';
      } else if (this.consoleStatus === 'completed') {
        return '已完成';
      } else {
        return '待启动';
      }
    },
    
    formatRunTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
    
    getTrendText(scheme) {
      const history = this.accuracyHistory[scheme];
      if (history.length < 2) return '稳定';
      
      // 计算最近几次的趋势
      const recentCount = Math.min(5, history.length);
      const recentData = history.slice(-recentCount);
      const firstValue = recentData[0];
      const lastValue = recentData[recentData.length - 1];
      const diff = lastValue - firstValue;
      
      if (diff > 0.5) return '上升';
      if (diff < -0.5) return '下降';
      return '稳定';
    },
    
    /**
     * 刷新数据
     */
    async refreshData() {
      this.$message({
        message: '正在刷新规划时间数据...',
        type: 'info',
        duration: 1000
      });
      
      await this.loadPlanningTimeData();
    }
  }
}
</script>

<style scoped>
.planning-time-container {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.refresh-btn {
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  transform: scale(1.05);
}

.neural-flow-section {
  padding: 30px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.section-title {
  text-align: center;
  color: #303133;
  margin-bottom: 40px;
  font-size: 24px;
  font-weight: bold;
}

.flow-diagram {
  position: relative;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
}

.input-nodes {
  position: absolute;
  left: 50px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.input-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.input-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  animation: pulse 2s infinite;
}

.input-circle:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
}

.node-label {
  font-size: 12px;
  color: #606266;
  text-align: center;
  font-weight: 500;
}

.neural-network {
  position: absolute;
  right: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.network-circle {
  position: relative;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.network-core {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 3;
  box-shadow: 0 10px 30px rgba(245, 87, 108, 0.3);
  animation: networkPulse 3s infinite;
}

.network-core i {
  font-size: 32px;
  margin-bottom: 5px;
}

.network-text {
  font-size: 14px;
  font-weight: bold;
}

.network-subtext {
  font-size: 10px;
  opacity: 0.9;
}

.network-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(245, 87, 108, 0.3);
  border-radius: 50%;
  animation: ringExpand 2s infinite;
}

.ring-2 {
  animation-delay: 1s;
}

.network-label {
  font-size: 14px;
  color: #303133;
  font-weight: 600;
}

.flow-arrows {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.main-arrow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 60px;
  pointer-events: none;
}

.arrow-body {
  position: relative;
  width: 100%;
  height: 100%;
}

.arrow-shaft {
  position: absolute;
  top: 50%;
  left: 0;
  width: 80%;
  height: 12px;
  transform: translateY(-50%);
  background: linear-gradient(90deg, #667eea, #f093fb, #f5576c);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(240, 147, 251, 0.6);
  animation: arrowPulse 2s infinite;
}

.energy-flow {
  position: absolute;
  top: 0;
  left: -30px;
  width: 30px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent);
  animation: energyFlow 1.5s infinite;
}

.energy-flow.delay-1 {
  animation-delay: 0.3s;
}

.energy-flow.delay-2 {
  animation-delay: 0.6s;
}

.arrow-head-large {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 30px solid #f5576c;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  filter: drop-shadow(0 0 15px rgba(245, 87, 108, 0.8));
  animation: headGlow 2s infinite;
}

.head-core {
  position: absolute;
  top: 50%;
  right: -10px;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(255,255,255,0.9);
  animation: coreFlicker 1s infinite;
}

.head-glow {
  position: absolute;
  top: 50%;
  right: -25px;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, rgba(245, 87, 108, 0.6) 0%, transparent 70%);
  border-radius: 50%;
  animation: glowExpand 2s infinite;
}

.data-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #667eea;
  border-radius: 50%;
  opacity: 0;
}

.particle-1, .particle-2 {
  top: 25%;
  animation: particleFlow1 3s infinite;
}

.particle-3, .particle-4 {
  top: 50%;
  animation: particleFlow2 3s infinite 0.5s;
}

.particle-5, .particle-6 {
  top: 75%;
  animation: particleFlow3 3s infinite 1s;
}

.flow-stats {
  display: flex;
  justify-content: space-around;
  background: linear-gradient(135deg, #ffeaa7, #fab1a0);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 40px;
}

.stat-item {
  text-align: center;
  min-width: 120px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #2d3436;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: #636e72;
}

/* 预测准确度历史样式 */
.prediction-accuracy-section {
  width: 100%;
  margin-top: 20px;
}

.accuracy-title {
  text-align: center;
  color: #2d3436;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}

.accuracy-schemes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.scheme-item {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.scheme-item:hover {
  transform: translateY(-3px);
}

.scheme-lr {
  border-left: 4px solid #27ae60;
}

.scheme-xgb {
  border-left: 4px solid #3498db;
}

.scheme-gcn {
  border-left: 4px solid #e74c3c;
}

.scheme-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.scheme-name {
  font-weight: bold;
  color: #2c3e50;
  font-size: 14px;
}

.current-accuracy {
  font-size: 16px;
  font-weight: bold;
  color: #27ae60;
}

.scheme-xgb .current-accuracy {
  color: #3498db;
}

.scheme-gcn .current-accuracy {
  color: #e74c3c;
}

.accuracy-history {
  position: relative;
  height: 60px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 10px;
  overflow: hidden;
}

.history-point {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #27ae60;
  transform: translate(-50%, 50%);
  transition: all 0.3s ease;
}

.scheme-xgb .history-point {
  background: #3498db;
}

.scheme-gcn .history-point {
  background: #e74c3c;
}

.history-point:hover {
  transform: translate(-50%, 50%) scale(1.5);
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
}

.trend-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  opacity: 0.6;
  border-radius: 1px;
}

.lr-line {
  background: linear-gradient(90deg, rgba(39, 174, 96, 0.3), #27ae60);
}

.xgb-line {
  background: linear-gradient(90deg, rgba(52, 152, 219, 0.3), #3498db);
}

.gcn-line {
  background: linear-gradient(90deg, rgba(231, 76, 60, 0.3), #e74c3c);
}

.accuracy-trend {
  text-align: center;
}

.trend-text {
  font-size: 12px;
  color: #7f8c8d;
  font-weight: 500;
}

/* 动画效果 */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes networkPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 10px 30px rgba(245, 87, 108, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 15px 40px rgba(245, 87, 108, 0.5);
  }
}

@keyframes ringExpand {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

@keyframes arrowPulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(240, 147, 251, 0.6);
  }
  50% {
    box-shadow: 0 0 30px rgba(240, 147, 251, 0.9);
  }
}

@keyframes energyFlow {
  0% {
    left: -30px;
  }
  100% {
    left: 100%;
  }
}

@keyframes headGlow {
  0% {
    filter: drop-shadow(0 0 15px rgba(245, 87, 108, 0.8));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(245, 87, 108, 1));
  }
  100% {
    filter: drop-shadow(0 0 15px rgba(245, 87, 108, 0.8));
  }
}

@keyframes coreFlicker {
  0% {
    box-shadow: 0 0 15px rgba(255,255,255,0.9);
  }
  50% {
    box-shadow: 0 0 20px rgba(255,255,255,1);
  }
  100% {
    box-shadow: 0 0 15px rgba(255,255,255,0.9);
  }
}

@keyframes glowExpand {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.2);
  }
}

@keyframes particleFlow1 {
  0% {
    left: 15%;
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    left: 65%;
    opacity: 0;
  }
}

@keyframes particleFlow2 {
  0% {
    left: 15%;
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    left: 65%;
    opacity: 0;
  }
}

@keyframes particleFlow3 {
  0% {
    left: 15%;
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    left: 65%;
    opacity: 0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .planning-time-container {
    padding: 10px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
    padding: 15px;
  }
  
  .neural-flow-section {
    padding: 20px 15px;
  }
  
  .flow-diagram {
    height: 300px;
  }
  
  .input-circle {
    width: 60px;
    height: 60px;
    font-size: 18px;
  }
  
  .network-core {
    width: 100px;
    height: 100px;
  }
  
  .flow-stats {
    flex-direction: column;
    gap: 15px;
  }
  
  .accuracy-schemes {
    grid-template-columns: 1fr;
  }
  
  .console-container {
    height: 60vh;
  }
  
  .console-header {
    padding: 10px 15px;
  }
  
  .console-body {
    padding: 15px;
  }
}

/* 模型输出组件样式 */
.model-output-section {
  text-align: center;
  margin: 30px 0 40px 0;
  padding: 20px;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.output-trigger-btn {
  font-size: 16px;
  padding: 12px 30px;
  border-radius: 25px;
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  border: none;
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
  transition: all 0.3s ease;
}

.output-trigger-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(25, 118, 210, 0.4);
}

/* 对话框样式 */
.model-console-dialog {
  .el-dialog__body {
    padding: 0;
  }
}

.console-container {
  height: 70vh;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  color: #fff;
  font-family: 'Courier New', monospace;
  border-radius: 8px;
  overflow: hidden;
}

.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #2c3e50, #34495e);
  border-bottom: 1px solid #4a4a4a;
}

.console-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ecf0f1;
  font-weight: bold;
}

.console-title i {
  color: #3498db;
  font-size: 18px;
}

.console-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.console-body {
  flex: 1;
  padding: 20px;
  background: #1e1e1e;
  overflow-y: auto;
  min-height: 400px;
}

.console-output {
  min-height: 100%;
}

.log-line {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 8px;
  padding: 4px 0;
  border-radius: 4px;
  opacity: 0;
  animation: slideIn 0.3s ease-out forwards;
}

.log-line:hover {
  background: rgba(255, 255, 255, 0.05);
}

.log-timestamp {
  color: #7f8c8d;
  font-size: 12px;
  min-width: 80px;
  font-weight: normal;
}

.log-level {
  font-weight: bold;
  min-width: 60px;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  text-align: center;
}

.log-level.info {
  background: #3498db;
  color: white;
}

.log-level.success {
  background: #27ae60;
  color: white;
}

.log-level.warning {
  background: #f39c12;
  color: white;
}

.log-level.error {
  background: #e74c3c;
  color: white;
}

.log-message {
  color: #ecf0f1;
  flex: 1;
}

.log-value {
  color: #2ecc71;
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

.cursor-line {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.cursor {
  color: #2ecc71;
  font-weight: bold;
  animation: blink 1s step-end infinite;
}

.console-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #2c3e50;
  border-top: 1px solid #4a4a4a;
  font-size: 12px;
}

.status-info {
  display: flex;
  gap: 20px;
  color: #bdc3c7;
}

.status-info span {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 动画效果 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

/* 滚动条样式 */
.console-body::-webkit-scrollbar {
  width: 8px;
}

.console-body::-webkit-scrollbar-track {
  background: #2c3e50;
}

.console-body::-webkit-scrollbar-thumb {
  background: #4a4a4a;
  border-radius: 4px;
}

.console-body::-webkit-scrollbar-thumb:hover {
  background: #5a5a5a;
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin: 20px 0;
}

.loading-spinner {
  margin-bottom: 20px;
}

.loading-spinner i {
  font-size: 40px;
  color: #409EFF;
  animation: loading-rotate 2s linear infinite;
}

.loading-text {
  font-size: 16px;
  color: #606266;
  font-weight: 500;
}

@keyframes loading-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 错误状态样式 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin: 20px 0;
  text-align: center;
}

.error-icon {
  margin-bottom: 20px;
}

.error-icon i {
  font-size: 48px;
  color: #F56C6C;
}

.error-text {
  font-size: 16px;
  color: #F56C6C;
  margin-bottom: 30px;
  max-width: 500px;
  line-height: 1.5;
}

.retry-btn {
  padding: 12px 24px;
  font-size: 14px;
}
</style> 