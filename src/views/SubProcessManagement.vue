<template>
  <div class="sub-process-management">
    <div class="page-header">
      <span class="page-title">子流程数据</span>
    </div>
    <div class="content-container">
      <div class="upper-section">
        <!-- 上半部分内容 -->
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
      <div class="divider"></div>
      <div class="lower-section">
        <sub-process-flow @process-changed="handleProcessChange"></sub-process-flow>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import SubProcessFlow from '@/components/SubProcessFlow.vue'
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
      
      // 使用外部数据源
      processData: processCardsData
    }
  },
  computed: {
    // 当前选中环节的数据
    currentData() {
      return this.processData[this.currentProcess] || this.processData.purchase;
    }
  },
  mounted() {
    this.initCharts();
  },
  methods: {
    // 处理子流程变化事件
    handleProcessChange(processKey) {
      this.currentProcess = processKey;
      this.$nextTick(() => {
        this.updateCharts();
      });
    },
    
    // 初始化所有图表
    initCharts() {
      this.initProductionChart();
      this.initProgressChart();
    },
    
    // 更新所有图表
    updateCharts() {
      // 更新进度图表
      if (this.progressChart) {
        const option = this.progressChart.getOption();
        option.series[0].data[0].value = this.currentData.progressPercent;
        this.progressChart.setOption(option);
      }
      
      // 更新生产图表
      if (this.productionChart) {
        const option = this.productionChart.getOption();
        option.xAxis[0].data = this.currentData.productionData.map(item => item.month);
        option.series[0].data = this.currentData.productionData.map(item => item.value);
        
        // 根据不同环节调整Y轴
        if (this.currentProcess === 'operation') {
          option.yAxis[0].min = 10;
          option.yAxis[0].max = 30;
        } else if (this.currentProcess === 'marketing') {
          option.yAxis[0].min = 60;
          option.yAxis[0].max = 180;
        } else {
          option.yAxis[0].min = 80;
          option.yAxis[0].max = 150;
        }
        
        this.productionChart.setOption(option);
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
}

.page-title {
  font-size: 14px;
  color: #000000;
  font-weight: 500;
}

.content-container {
  height: calc(100% - 40px);
  display: flex;
  flex-direction: column;
}

.upper-section {
  height: 25%;
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
  height: 75%;
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
</style> 