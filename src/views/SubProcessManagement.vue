<template>
  <div class="sub-process-management">
    <div class="page-header">
      <span class="page-title">子流程数据</span>
      <!-- 数据状态指示器 -->
      <div class="data-status">
        <span v-if="loading" class="status-loading">
          <i class="el-icon-loading"></i> 正在加载数据...
        </span>
        <span v-else-if="error" class="status-error">
          <i class="el-icon-warning"></i> 使用备用数据 ({{ error }})
        </span>
        <span v-else class="status-success">
          <i class="el-icon-success"></i> 数据已从MongoDB加载
        </span>
        
        <!-- 刷新按钮 -->
        <el-button 
          size="mini" 
          type="primary" 
          @click="refreshData"
          :loading="loading"
          style="margin-left: 10px;">
          <i class="el-icon-refresh"></i> 刷新
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载子流程数据，请稍候...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error && !processData" class="error-container">
      <div class="error-message">
        <i class="el-icon-warning"></i>
        <p>{{ error }}</p>
        <el-button 
          type="primary" 
          @click="refreshData"
          :loading="loading">
          重新加载
        </el-button>
      </div>
    </div>

    <!-- 主要内容 - 只在数据加载完成后渲染 -->
    <div v-else-if="dataLoaded" class="content-container">
      <!-- ==================== 上半部分 ==================== -->
      <div class="upper-section">
        <!-- 上半部分内容：四个信息卡片 -->
        <div class="info-blocks-container">
          <el-card class="info-block" shadow="hover">
            <div class="info-block-content">
              <div class="card-title">{{ currentData.productionTitle }}</div>
              <div ref="productionChart" class="chart-container"></div>
            </div>
          </el-card>
          
          <el-card class="info-block" shadow="hover">
            <div class="info-block-content">
              <div class="card-title">当月目标完成百分比</div>
              <div class="progress-container">
                <div ref="progressChart" class="progress-chart"></div>
                <div class="progress-compare">较昨日<span class="progress-up">{{ currentData.progressChange }}</span></div>
              </div>
            </div>
          </el-card>
          
          <el-card class="info-block" shadow="hover">
            <div class="info-block-content">
              <div class="card-title">风险事项</div>
              <div class="risk-items">
                <div 
                  v-for="(risk, index) in currentData.risks" 
                  :key="index"
                  :class="['risk-item', risk.level]"
                >
                  <i class="el-icon-warning"></i>
                  <span>{{ risk.text }}</span>
                </div>
              </div>
            </div>
          </el-card>
          
          <el-card class="info-block" shadow="hover">
            <div class="info-block-content">
              <div class="card-title">{{ currentData.efficiency.title }}</div>
              <div class="efficiency-container">
                <div class="efficiency-metrics">
                  <div class="metric-item" v-for="(metric, index) in currentData.efficiency.metrics" :key="index">
                    <div class="metric-value">{{ metric.value }}<span class="metric-unit">{{ metric.unit }}</span></div>
                    <div class="metric-label">{{ metric.label }}</div>
                    <div class="metric-trend" :class="{ 'positive': metric.isPositive, 'negative': !metric.isPositive }">
                      <i :class="metric.isPositive ? 'el-icon-top' : 'el-icon-bottom'"></i>
                      {{ metric.trend }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <!-- ==================== 分隔线 ==================== -->
      <div class="divider"></div>
      <!-- ==================== 下半部分 ==================== -->
      <div class="lower-section">
        <!-- 下半部分内容：子流程流程图 -->
        <sub-process-flow @process-changed="handleProcessChange"></sub-process-flow>
      </div>
    </div>

    <!-- 无数据状态 -->
    <div v-else class="no-data-container">
      <div class="no-data-message">
        <i class="el-icon-info"></i>
        <p>暂无子流程数据</p>
        <el-button 
          type="primary" 
          @click="refreshData"
          :loading="loading">
          加载数据
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import SubProcessFlow from '@/components/SubProcessFlow.vue'
import { subProcessDataApi } from '@/api/subProcessDataApi'
import { processCardsData } from '@/data/subProcessCardsData'

export default {
  name: 'SubProcessManagement',
  components: {
    SubProcessFlow
  },
  data() {
    return {
      currentProcess: 'purchase', // 默认选择采购环节
      productionChart: null,
      progressChart: null,
      
      // 数据状态
      loading: false,
      error: null,
      
      // 从API获取的数据
      processData: null,
      
      // 备用静态数据
      fallbackData: processCardsData
    }
  },
  computed: {
    // 判断数据是否已加载完成
    dataLoaded() {
      return !this.loading && (this.processData || this.error);
    },
    
    // 当前选中环节的数据
    currentData() {
      if (this.processData && this.processData[this.currentProcess]) {
        return this.processData[this.currentProcess];
      }
      // 如果API数据不可用，使用备用数据
      return this.fallbackData[this.currentProcess] || this.fallbackData.purchase;
    }
  },
  watch: {
    // 监听数据加载状态变化
    dataLoaded(newVal) {
      if (newVal && this.processData) {
        console.log('📊 SubProcessManagement组件数据加载完成，准备初始化图表');
        this.$nextTick(() => {
          this.initCharts();
        });
      }
    },
    
    // 监听当前流程变化
    currentProcess(newVal, oldVal) {
      if (newVal !== oldVal && this.dataLoaded) {
        console.log(`🔄 SubProcessManagement组件流程切换: ${oldVal} -> ${newVal}`);
        this.$nextTick(() => {
          this.updateCharts();
        });
      }
    }
  },
  async mounted() {
    await this.loadData();
    
    // 数据加载完成后，等待DOM更新再初始化图表
    if (this.dataLoaded) {
      this.$nextTick(() => {
        this.initCharts();
      });
    }
  },
  methods: {
    // 从API加载数据
    async loadData() {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('🔄 SubProcessManagement组件开始从API加载子流程数据...');
        
        // 检查API连接
        const connectionStatus = await subProcessDataApi.checkConnection();
        if (!connectionStatus.connected) {
          throw new Error('API服务器未启动，请先运行: npm run api-server');
        }
        
        const result = await subProcessDataApi.getSubProcessData();
        
        if (result.success && result.data) {
          this.processData = result.data;
          console.log('✅ SubProcessManagement组件子流程数据加载成功:', {
            dataKeys: Object.keys(result.data),
            message: result.message
          });
        } else {
          throw new Error(result.message || '获取子流程数据失败');
        }
      } catch (error) {
        console.error('❌ SubProcessManagement组件从API加载子流程数据失败:', error);
        this.error = error.message;
        this.processData = null;
        
        // 显示错误提示
        this.$message({
          message: `子流程数据加载失败: ${error.message}`,
          type: 'error',
          duration: 5000
        });
      } finally {
        this.loading = false;
      }
    },
    
    // 处理子流程变化事件
    async handleProcessChange(processKey) {
      console.log(`🔄 SubProcessManagement组件切换到: ${processKey}`);
      this.currentProcess = processKey;
      
      // 如果当前数据不可用，尝试重新加载
      if (!this.processData || !this.processData[processKey]) {
        console.log(`⚠️  ${processKey}数据不可用，尝试重新加载...`);
        await this.loadData();
      }
      
      this.$nextTick(() => {
        this.updateCharts();
        console.log(`✅ ${processKey}图表更新完成`);
      });
    },
    
    // 初始化所有图表
    initCharts() {
      if (!this.dataLoaded) {
        console.warn('⚠️  SubProcessManagement组件数据未加载完成，跳过图表初始化');
        return;
      }
      
      if (!this.$refs.productionChart || !this.$refs.progressChart) {
        console.warn('⚠️  SubProcessManagement组件DOM元素未准备好，延迟初始化图表');
        this.$nextTick(() => {
          this.initCharts();
        });
        return;
      }
      
      console.log('📈 SubProcessManagement组件开始初始化图表');
      this.initProductionChart();
      this.initProgressChart();
      console.log('✅ SubProcessManagement组件图表初始化完成');
    },
    
    // 更新所有图表
    updateCharts() {
      console.log('📈 SubProcessManagement组件开始更新图表', {
        currentProcess: this.currentProcess,
        hasProgressChart: !!this.progressChart,
        hasProductionChart: !!this.productionChart,
        progressPercent: this.currentData.progressPercent,
        productionDataCount: this.currentData.productionData.length
      });
      
      // 更新进度图表
      if (this.progressChart) {
        const option = this.progressChart.getOption();
        option.series[0].data[0].value = this.currentData.progressPercent;
        this.progressChart.setOption(option);
        console.log('✅ 进度图表更新完成:', this.currentData.progressPercent + '%');
      }
      
      // 更新生产图表
      if (this.productionChart) {
        const option = this.productionChart.getOption();
        option.xAxis[0].data = this.currentData.productionData.map(item => item.month);
        option.series[0].data = this.currentData.productionData.map(item => item.value);
        
        // 根据不同环节调整Y轴
        let yAxisConfig = { min: 80, max: 150 }; // 默认值
        if (this.currentProcess === 'operation') {
          yAxisConfig = { min: 10, max: 30 };
        } else if (this.currentProcess === 'marketing') {
          yAxisConfig = { min: 60, max: 180 };
        }
        
        option.yAxis[0].min = yAxisConfig.min;
        option.yAxis[0].max = yAxisConfig.max;
        
        this.productionChart.setOption(option);
        console.log('✅ 生产图表更新完成:', {
          process: this.currentProcess,
          yAxis: yAxisConfig,
          dataPoints: this.currentData.productionData.length
        });
      }
    },
    
    initProductionChart() {
      this.productionChart = echarts.init(this.$refs.productionChart)
      
      const option = {
        grid: {
          top: 10,
          right: 10,
          bottom: 35,
          left: 30
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b}: {c}台'
        },
        xAxis: {
          type: 'category',
          data: this.currentData.productionData.map(item => item.month),
          axisLabel: {
            show: true,
            fontSize: 12,
            color: '#333',
            interval: 0,
          },
          axisLine: {
            lineStyle: {
              color: '#666'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '数量',
          nameTextStyle: {
            fontSize: 10,
            color: '#666',
          },
          min: 80,
          max: 150,
          interval: 20,
          axisLabel: {
            fontSize: 10,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#666'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#ddd'
            }
          }
        },
        series: [{
          data: this.currentData.productionData.map(item => item.value),
          type: 'line',
          name: '数量',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#1890ff'
          },
          lineStyle: {
            width: 3,
            color: '#1890ff'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, 
                color: 'rgba(24, 144, 255, 0.3)'
              }, {
                offset: 1, 
                color: 'rgba(24, 144, 255, 0.1)'
              }]
            }
          }
        }]
      }
      
      // 应用选项
      this.productionChart.setOption(option)
      
      // 添加窗口调整监听
      window.addEventListener('resize', this.resizeChart)
    },
    
    initProgressChart() {
      // 创建ECharts实例
      this.progressChart = echarts.init(this.$refs.progressChart)
      
      // 设置图表选项
      const option = {
        series: [
          {
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            radius: '100%',
            center: ['50%', '50%'],
            pointer: {
              show: false
            },
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#1a98ff'
                    },
                    {
                      offset: 1,
                      color: '#6fdaff'
                    }
                  ]
                }
              }
            },
            axisLine: {
              lineStyle: {
                width: 12,
                color: [
                  [1, '#eee']
                ]
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            data: [
              {
                value: this.currentData.progressPercent,
                name: '',
                detail: {
                  show: true,
                  offsetCenter: ['0%', '0%'],
                  width: 50,
                  height: 14,
                  fontSize: 28,
                  color: '#1890ff',
                  formatter: '{value}%'
                }
              }
            ]
          }
        ]
      }
      
      // 应用选项
      this.progressChart.setOption(option)
      
      // 添加窗口调整监听
      window.addEventListener('resize', this.resizeProgressChart)
    },
    
    resizeChart() {
      this.productionChart && this.productionChart.resize()
    },
    
    resizeProgressChart() {
      this.progressChart && this.progressChart.resize()
    },
    
    /**
     * 刷新子流程数据
     */
    async refreshData() {
      console.log('🔄 SubProcessManagement组件开始刷新数据');
      this.$message({
        message: '正在刷新子流程数据...',
        type: 'info',
        duration: 2000
      });
      
      await this.loadData();
      
      if (!this.error && this.processData) {
        this.$nextTick(() => {
          // 如果图表还未初始化，先初始化
          if (!this.productionChart || !this.progressChart) {
            this.initCharts();
          } else {
            // 否则只更新图表数据
            this.updateCharts();
          }
        });
      }
    },
    
    /**
     * 检查API连接状态
     */
    async checkApiConnection() {
      try {
        const status = await subProcessDataApi.checkConnection();
        console.log('🔍 SubProcessManagement API连接检查:', status);
        return status;
      } catch (error) {
        console.error('❌ SubProcessManagement API连接检查失败:', error);
        return { success: false, connected: false, message: error.message };
      }
    },
    
    /**
     * 获取特定类型的子流程数据
     */
    async loadSpecificProcessData(type) {
      try {
        console.log(`🔄 加载特定子流程数据: ${type}`);
        const result = await subProcessDataApi.getSubProcessDataByType(type);
        
        if (result.success && result.data) {
          if (!this.processData) {
            this.processData = {};
          }
          this.processData[type] = result.data;
          
          console.log(`✅ ${type}子流程数据加载成功`);
          return result.data;
        } else {
          throw new Error(result.message || `获取${type}子流程数据失败`);
        }
      } catch (error) {
        console.error(`❌ 加载${type}子流程数据失败:`, error);
        this.$message({
          message: `加载${type}数据失败: ${error.message}`,
          type: 'error',
          duration: 3000
        });
        return null;
      }
    },
    
    /**
     * 获取组件状态信息
     */
    getComponentStatus() {
      const status = {
        loading: this.loading,
        error: this.error,
        currentProcess: this.currentProcess,
        hasProcessData: !!this.processData,
        availableProcesses: this.processData ? Object.keys(this.processData) : [],
        chartsInitialized: !!(this.productionChart && this.progressChart),
        usingFallbackData: !this.processData,
        apiMode: true
      };
      
      console.log('📊 SubProcessManagement组件状态:', status);
      return status;
    }
  },
  beforeDestroy() {
    // 清除监听和图表实例
    window.removeEventListener('resize', this.resizeChart)
    window.removeEventListener('resize', this.resizeProgressChart)
    this.productionChart && this.productionChart.dispose()
    this.progressChart && this.progressChart.dispose()
  }
}
</script>

<style scoped>
.sub-process-management {
  padding: 0;
  position: relative;
  height: 100%;
}

.page-header {
  text-align: left;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
}

.page-title {
  font-size: 14px;
  color: #000000;
  font-weight: 500;
}

/* 数据状态指示器样式 */
.data-status {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.status-loading {
  color: #1890ff;
}

.status-loading i {
  margin-right: 4px;
}

.status-error {
  color: #f5222d;
}

.status-error i {
  margin-right: 4px;
}

.status-success {
  color: #52c41a;
}

.status-success i {
  margin-right: 4px;
}

.content-container {
  height: calc(100% - 40px);
  display: flex;
  flex-direction: column;
}

.upper-section {
  height: 30%;
  padding: 20px 0;
  display: flex;
  align-items: center;
  overflow: auto;
}

.info-blocks-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 0 15px;
  gap: 15px;
}

.info-block {
  width: 24%;
  height: 200px;
  margin: 0;
  border-radius: 8px !important;
  background-color: #ffffff !important;
  border: 1px solid #91d5ff !important;
  transition: all 0.3s ease;
}

.info-block:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1) !important;
}

/* 覆盖Element UI卡片的内部样式 */
.info-block /deep/ .el-card__body {
  padding: 15px;
  height: 100%;
  background-color: #ffffff;
  border-radius: 8px;
}

.info-block-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title {
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

.chart-container {
  flex: 1;
  width: 100%;
}

.lower-section {
  height: 70%;
  padding: 30px 0;
  overflow: auto;
}

.divider {
  height: 5px;
  width: 100%;
  background-color: #dcdfe6;
  margin: 0;
}

h2 {
  color: #303133;
  margin: 0;
}

.progress-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.progress-chart {
  width: 120px;
  height: 120px;
}

.progress-compare {
  margin-top: 0px;
  font-size: 14px;
  color: #666;
}

.progress-up {
  color: #1a98ff;
  font-weight: 500;
}

.risk-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 92%;
  padding: 10px 0;
  flex: 1;
  justify-content: flex-start;
}

.risk-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
}

.risk-item i {
  font-size: 16px;
}

.risk-item.warning {
  background-color: #fff7e6;
  color: #fa8c16;
}

.risk-item.danger {
  background-color: #fff1f0;
  color: #f5222d;
}

.status-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 92%;
  padding: 10px 0;
  flex: 1;
  justify-content: flex-start;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
}

.status-item i {
  font-size: 16px;
}

.status-item.success {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-item.warning {
  background-color: #fff7e6;
  color: #fa8c16;
}

.status-item.error {
  background-color: #fff1f0;
  color: #f5222d;
}

/* 效率指标卡片样式 */
.efficiency-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px 0;
}

.efficiency-metrics {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  width: 100%;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  width: 100%;
}

.metric-value {
  font-size: 24px;
  font-weight: 600;
  color: #1890ff;
  line-height: 1.2;
}

.metric-unit {
  font-size: 12px;
  font-weight: normal;
  margin-left: 2px;
}

.metric-label {
  font-size: 13px;
  color: #666;
  margin: 6px 0;
}

.metric-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.metric-trend.positive {
  color: #52c41a;
}

.metric-trend.negative {
  color: #f5222d;
}

/* 加载状态样式 */
.loading-container {
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
  background-color: #fafafa;
  border-radius: 8px;
  margin: 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  font-size: 16px;
  margin: 0;
}

/* 错误状态样式 */
.error-container {
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
}

.error-message {
  text-align: center;
  color: #ff4757;
  padding: 40px;
  border: 2px solid #ff4757;
  border-radius: 12px;
  background-color: #fff5f5;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(255, 71, 87, 0.1);
}

.error-message i {
  font-size: 48px;
  margin-bottom: 20px;
  display: block;
  color: #ff4757;
}

.error-message p {
  margin: 20px 0;
  font-size: 16px;
  line-height: 1.5;
}

/* 无数据状态样式 */
.no-data-container {
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
}

.no-data-message {
  text-align: center;
  color: #8c8c8c;
  padding: 40px;
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  background-color: #fafafa;
  max-width: 400px;
}

.no-data-message i {
  font-size: 48px;
  margin-bottom: 20px;
  display: block;
  color: #8c8c8c;
}

.no-data-message p {
  margin: 20px 0;
  font-size: 16px;
  line-height: 1.5;
}
</style> 