<template>
  <el-card class="system-status-card">
    <div slot="header" class="status-header">
      <span>神经网络运行状态</span>
      <el-tag size="small" type="success">运行中</el-tag>
    </div>
    <div class="status-grid">
      <div class="status-item">
        <div class="status-label">响应时间</div>
        <div class="status-value">{{ systemStatus.responseTime }}ms</div>
        <div class="response-chart">
          <div class="response-bar" :style="{ height: (40 - systemStatus.responseTime) + 'px' }"></div>
        </div>
      </div>
      <div class="status-item">
        <div class="status-label">处理吞吐量</div>
        <div class="status-value">{{ systemStatus.throughput }}/s</div>
        <div class="throughput-indicator">
          <div class="throughput-wave" :style="{ width: ((systemStatus.throughput - 180) / 50 * 100) + '%' }"></div>
        </div>
      </div>
      <div class="status-item">
        <div class="status-label">GPU利用率</div>
        <div class="status-value">{{ systemStatus.gpuUtilization }}%</div>
        <el-progress 
          :percentage="systemStatus.gpuUtilization" 
          :color="systemStatus.gpuUtilization > 85 ? '#F56C6C' : '#67C23A'"
          :stroke-width="6">
        </el-progress>
      </div>
      <div class="status-item">
        <div class="status-label">内存使用率</div>
        <div class="status-value">{{ systemStatus.memoryUsage }}%</div>
        <el-progress 
          :percentage="systemStatus.memoryUsage" 
          :color="systemStatus.memoryUsage > 85 ? '#F56C6C' : '#67C23A'"
          :stroke-width="6">
        </el-progress>
      </div>
      <div class="status-item">
        <div class="status-label">活跃连接</div>
        <div class="status-value">{{ systemStatus.activeConnections }}</div>
        <div class="connection-visualization">
          <div class="connection-dots">
            <div class="conn-dot" v-for="i in Math.min(8, Math.floor(systemStatus.activeConnections / 8))" :key="i"></div>
          </div>
        </div>
      </div>
      <div class="status-item">
        <div class="status-label">模型运行时间</div>
        <div class="status-value">{{ systemStatus.modelUptime }}</div>
        <div class="status-indicator good"></div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'SystemStatusCard',
  data() {
    return {
      systemStatus: {
        responseTime: 0,
        throughput: 0,
        gpuUtilization: 0,
        memoryUsage: 0,
        activeConnections: 0,
        modelUptime: '00:00:00'
      }
    }
  },
  mounted() {
    this.updateSystemStatus();
    // 每秒更新系统状态
    this.statusInterval = setInterval(this.updateSystemStatus, 1000);
  },
  beforeDestroy() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
  },
  methods: {
    updateSystemStatus() {
      // 模拟生产环境神经网络推理状态数据
      this.systemStatus.responseTime = Math.floor(Math.random() * 20) + 15; // 15-35ms (推理响应时间)
      this.systemStatus.throughput = Math.floor(Math.random() * 50) + 180; // 180-230 requests/sec
      this.systemStatus.gpuUtilization = Math.floor(Math.random() * 15) + 65; // 65-80% GPU使用率
      this.systemStatus.memoryUsage = Math.floor(Math.random() * 10) + 70; // 70-80% 内存使用率
      this.systemStatus.activeConnections = Math.floor(Math.random() * 20) + 45; // 45-65 活跃连接
      
      // 模拟模型运行时间
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      this.systemStatus.modelUptime = `${hours}:${minutes}:${seconds}`;
    }
  }
}
</script>

<style scoped>
/* 系统状态卡片样式 */
.system-status-card {
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 10px 0;
}

.status-item {
  text-align: center;
  padding: 15px;
  border-radius: 8px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.status-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.status-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
  font-weight: 500;
}

.status-value {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin: 0 auto;
  margin-top: 8px;
  position: relative;
}

.status-indicator.good {
  background-color: #67C23A;
  box-shadow: 0 0 6px rgba(103, 194, 58, 0.6);
}

.status-indicator.warning {
  background-color: #E6A23C;
  box-shadow: 0 0 6px rgba(230, 162, 60, 0.6);
}

.status-indicator.error {
  background-color: #F56C6C;
  box-shadow: 0 0 6px rgba(245, 108, 108, 0.6);
}

/* 生产环境神经网络监控组件样式 */
.response-chart {
  height: 20px;
  width: 80px;
  margin: 0 auto;
  background: linear-gradient(to bottom, #f0f0f0, #e0e0e0);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.response-bar {
  background: linear-gradient(to top, #67C23A, #85CE61);
  width: 100%;
  border-radius: 0 0 4px 4px;
  transition: height 0.3s ease;
  position: absolute;
  bottom: 0;
  max-height: 20px;
}

.throughput-indicator {
  height: 8px;
  width: 80px;
  margin: 0 auto;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.throughput-wave {
  height: 100%;
  background: linear-gradient(90deg, #409EFF, #79BBFF);
  border-radius: 4px;
  transition: width 0.5s ease;
  position: relative;
}

.throughput-wave::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: throughputFlow 1.5s infinite;
}

@keyframes throughputFlow {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.connection-visualization {
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.connection-dots {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
  justify-content: center;
}

.conn-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: linear-gradient(45deg, #409EFF, #67C23A);
  animation: connectionPulse 2s infinite;
}

.conn-dot:nth-child(odd) {
  animation-delay: 0.2s;
}

.conn-dot:nth-child(even) {
  animation-delay: 0.4s;
}

@keyframes connectionPulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

/* 状态指示器增强 */
.status-indicator::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: inherit;
  opacity: 0.3;
  animation: ripple 2s infinite;
}

@keyframes ripple {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0.5;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .status-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .status-item {
    padding: 12px;
  }
  
  .status-value {
    font-size: 16px;
  }
  
  .response-chart,
  .throughput-indicator {
    width: 60px;
  }
  
  .connection-dots {
    gap: 2px;
  }
  
  .conn-dot {
    width: 3px;
    height: 3px;
  }
}
</style> 