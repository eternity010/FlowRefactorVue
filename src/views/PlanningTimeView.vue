<template>
  <div class="planning-time-container">
    <div class="page-header">
      <span>规划完成时间分析</span>
      <el-tag size="small" type="info">神经网络模型 v1.1.0</el-tag>
    </div>
    
    <!-- 数据流向神经网络可视化 -->
    <div class="neural-flow-section">
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
export default {
  name: 'PlanningTimeView',
  data() {
    return {
      // 统计数据
      stats: {
        processNodes: '156',
        monitoringRate: 85
      },
      modelOutputVisible: false,
      sampleData: {
        nodePath: ['S_21', 'S7', 'S15', 'S14', 'S15', 'S5'],
        nodeCount: 6,
        edgeCount: 5,
        edges: [
          { 
            id: '边1', 
            connection: 'S21 → S7', 
            type: 'mc', 
            riskFrom: 0.750, 
            riskTo: 0.793, 
            theoreticalTime: 59.42, 
            actualTime: 94.94,
            deviation: ((94.94 - 59.42) / 59.42 * 100).toFixed(1)
          },
          { 
            id: '边2', 
            connection: 'S7 → S15', 
            type: 'mc', 
            riskFrom: 0.793, 
            riskTo: 0.243, 
            theoreticalTime: 41.74, 
            actualTime: 46.04,
            deviation: ((46.04 - 41.74) / 41.74 * 100).toFixed(1)
          },
          { 
            id: '边3', 
            connection: 'S15 → S14', 
            type: 'mc', 
            riskFrom: 0.243, 
            riskTo: 0.579, 
            theoreticalTime: 84.50, 
            actualTime: 59.96,
            deviation: ((59.96 - 84.50) / 84.50 * 100).toFixed(1)
          },
          { 
            id: '边4', 
            connection: 'S14 → S15', 
            type: 'rpc', 
            riskFrom: 0.579, 
            riskTo: 0.243, 
            theoreticalTime: 41.84, 
            actualTime: 35.92,
            deviation: ((35.92 - 41.84) / 41.84 * 100).toFixed(1)
          },
          { 
            id: '边5', 
            connection: 'S15 → S5', 
            type: 'mc', 
            riskFrom: 0.243, 
            riskTo: 0.405, 
            theoreticalTime: 27.22, 
            actualTime: 18.04,
            deviation: ((18.04 - 27.22) / 27.22 * 100).toFixed(1)
          }
        ]
      },
      consoleStatus: 'pending',
      consoleLogs: [],
      runTime: 0,
      runTimeTimer: null,
      currentAccuracy: {
        lr: 99.22,   // 方案A-LR 当前准确度
        xgb: 99.33,  // 方案B-XGB 当前准确度  
        gcn: 84.37   // 方案C-GCN 当前准确度
      },
      accuracyHistory: {
        // 方案A-LR 历史数据 (围绕99.22上下浮动)
        lr: [97.2, 98.1, 97.8, 98.9, 99.1, 98.7, 99.3, 98.5, 99.0, 99.4, 98.8, 99.2, 99.1, 99.22],
        // 方案B-XGB 历史数据 (围绕99.33上下浮动)  
        xgb: [97.5, 98.2, 98.7, 99.1, 98.9, 99.4, 98.8, 99.2, 99.0, 99.5, 99.1, 99.3, 99.4, 99.33],
        // 方案C-GCN 历史数据 (围绕84.37上下浮动，准确度较低)
        gcn: [82.1, 83.2, 82.8, 83.9, 84.1, 83.7, 84.3, 83.5, 84.0, 84.4, 83.8, 84.2, 84.1, 84.37]
      }
    }
  },
  mounted() {
    // 启动数据流动动画
    this.startFlowAnimation();
  },
  methods: {
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
      // 模拟模型初始化
      setTimeout(() => {
        this.addLog('info', '正在加载神经网络模型...', null);
      }, 100);
      
      setTimeout(() => {
        this.addLog('info', '模型加载完成，开始预测...', null);
      }, 600);
      
      // 输出样本详细信息
      setTimeout(() => {
        this.addLog('info', '', null);
        this.addLog('success', '=== 样本详细信息 ===', null);
        this.addLog('info', "节点路径: ['S21', 'S_7', 'S15', 'S14', 'S 15', 'S 5']", null);
        this.addLog('info', '节点数量: 6 | 边数量: 5', null);
      }, 1200);
      
      // 输出边详情
      setTimeout(() => {
        this.addLog('info', '', null);
        this.addLog('success', '=== 边详情 ===', null);
      }, 1800);
      
      // 边1
      setTimeout(() => {
        this.addLog('info', '[边1] S_21 -> S_7', null);
        this.addLog('info', '类型: mc | 风险: 0.750/0.793', null);
        this.addLog('info', '理论耗时:  59.42 | 实际耗时:  94.94', null);
      }, 2200);
      
      // 边2
      setTimeout(() => {
        this.addLog('info', '', null);
        this.addLog('info', '[边2] S_7 -> S15', null);
        this.addLog('info', '类型: mc | 风险: 0.793/0.243', null);
        this.addLog('info', '理论耗时:  41.74 | 实际耗时:  46.04', null);
      }, 2700);
      
      // 边3
      setTimeout(() => {
        this.addLog('info', '', null);
        this.addLog('info', '[边3] S15 -> S14', null);
        this.addLog('info', '风险: 0.243/0.579', null);
        this.addLog('info', '理论耗时:  84.50 | 实际耗时:  59.96', null);
      }, 3200);
      
      // 边4
      setTimeout(() => {
        this.addLog('info', '', null);
        this.addLog('info', '[边4] S14 -> S 15', null);
        this.addLog('info', '类型: mc | 风险: 0.579/0.243', null);
        this.addLog('info', '理论耗时:  41.84 | 实际耗时:  35.92', null);
      }, 3700);
      
      // 边5
      setTimeout(() => {
        this.addLog('info', '', null);
        this.addLog('info', '[边5] S 15 -> S 5', null);
        this.addLog('info', '类型: rpc | 风险: 0.243/0.405', null);
        this.addLog('info', '理论耗时:  27.22 | 实际耗时:  18.04', null);
      }, 4200);
      
      // 预测结果
      setTimeout(() => {
        this.addLog('info', '', null);
        this.addLog('success', '=== 预测结果 ===', null);
        this.addLog('info', '实际总耗时: 254.91', null);
        this.addLog('info', '理论最优耗时: 254.71', null);
      }, 5000);
      
      setTimeout(() => {
        this.addLog('info', '', null);
        this.addLog('warning', '方案A-LR  预测: 252.92 (误差: -0.78%)', null);
        this.addLog('warning', '方案B-XGB 预测: 253.20 (误差: -0.67%)', null);
        this.addLog('error', '方案C-GCN 预测: 294.75 (误差: +15.63%)', null);
      }, 5600);
      
      // 决策结果
      setTimeout(() => {
        this.addLog('info', '', null);
        this.addLog('success', '[决策] 是否需要重构: 否', null);
      }, 6200);
      
      // 完成
      setTimeout(() => {
        this.addLog('info', '', null);
        this.addLog('success', '模型预测完成！', null);
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
      }, 6800);
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
</style> 