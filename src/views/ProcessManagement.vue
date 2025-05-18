<template>
  <div class="process-management">
    <div class="page-header">
      <span class="page-title">流程数据</span>
    </div>
    <div class="content-container">
      <div class="upper-section">
        <!-- 上半部分内容 -->
        <div class="info-blocks-container">
          <el-card class="info-block production-card" shadow="hover">
            <div class="info-block-content">
              <div class="card-title">设备生产数量</div>
              <div ref="productionChart" class="chart-container"></div>
            </div>
          </el-card>
          
          <el-card class="info-block progress-card" shadow="hover">
            <div class="info-block-content">
              <div class="card-title">当月目标完成百分比</div>
              <div class="progress-container">
                <div ref="progressChart" class="progress-chart"></div>
                <div class="progress-compare">较昨日<span class="progress-up">+4%</span></div>
              </div>
            </div>
          </el-card>
          
          <el-card class="info-block risk-card" shadow="hover">
            <div class="info-block-content">
              <div class="card-title">风险事项</div>
              <div class="risk-items">
                <div class="risk-item warning">
                  <i class="el-icon-warning"></i>
                  <span>员工离职</span>
                </div>
                <div class="risk-item danger">
                  <i class="el-icon-warning"></i>
                  <span>供应商A缺货</span>
                </div>
              </div>
            </div>
          </el-card>
          
          <el-card class="info-block efficiency-card" shadow="hover">
            <div class="info-block-content">
              <div class="card-title">流程效率指标</div>
              <div class="efficiency-metrics">
                <div class="metric-item">
                  <div class="metric-value">93.2<span class="unit">%</span></div>
                  <div class="metric-label">流程完成率</div>
                  <div class="metric-trend up">
                    <i class="el-icon-top"></i> 2.1%
                  </div>
                </div>
                <div class="metric-divider"></div>
                <div class="metric-item">
                  <div class="metric-value">24.6<span class="unit">小时</span></div>
                  <div class="metric-label">平均周转时间</div>
                  <div class="metric-trend down">
                    <i class="el-icon-bottom"></i> 1.8小时
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <div class="divider"></div>
      <div class="lower-section">
        <process-flow></process-flow>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import ProcessFlow from '@/components/ProcessFlow.vue'

export default {
  name: 'ProcessManagement',
  components: {
    ProcessFlow
  },
  data() {
    return {
      productionChart: null,
      progressChart: null,
      progressPercent: 60,
      productionData: [
        { month: '3月', value: 112 },
        { month: '4月', value: 113 },
        { month: '5月', value: 150 },
        { month: '6月', value: 120 },
        { month: '7月', value: 130 },
        { month: '8月', value: 140 },
        { month: '9月', value: 150 },
        { month: '10月', value: 160 },
        { month: '11月', value: 170 },
      ],
      efficiencyData: {
        completionRate: {
          value: 93.2,
          trend: 2.1,
          isUp: true
        },
        turnaroundTime: {
          value: 24.6,
          trend: 1.8,
          isUp: false
        }
      }
    }
  },
  mounted() {
    this.initProductionChart()
    this.initProgressChart()
  },
  methods: {
    initProductionChart() {
      this.productionChart = echarts.init(this.$refs.productionChart)
      
      const option = {
        /* 图表区域设置
         * 调整这些值可以改变图表显示区域的大小
         * 确保坐标轴和标签完整显示
         */
        grid: {
          top: 10,      // 上边距，可增大确保顶部标签显示
          right: 10,    // 右边距，可增大确保右侧标签显示
          bottom: 35,   // 下边距，可增大确保底部标签显示
          left: 30      // 左边距，可增大确保左侧标签显示
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b}: {c}台'
        },
        /* X轴设置
         * 调整这些值可以优化月份标签的显示
         */
        xAxis: {
          type: 'category',
          data: this.productionData.map(item => item.month),
          axisLabel: {
            show: true,
            fontSize: 12,
            color: '#333',
            interval: 0,    // 显示所有标签
            // rotate: 30,   // 标签旋转角度，可防止标签重叠
            // margin: 10,   // 标签与轴线的距离
          },
          axisLine: {
            lineStyle: {
              color: '#666'
            }
          }
        },
        /* Y轴设置
         * 调整这些值可以优化数值标签的显示
         */
        yAxis: {
          type: 'value',
          name: '数量',
          nameTextStyle: {
            fontSize: 10,
            color: '#666',
            // padding: [0, 0, 0, 40]  // 调整"数量"标签的位置
          },
          min: 100,        // 设置最小值
          max: 180,        // 设置最大值
          interval: 20,    // 设置刻度间隔
          axisLabel: {
            fontSize: 10,
            // margin: 8,    // 调整数值标签与轴线的距离
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
          data: this.productionData.map(item => item.value),
          type: 'line',
          name: '生产数量',
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
                value: this.progressPercent,
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
.process-management {
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
  border: 1px solid #ebeef5 !important;
  transition: all 0.3s ease;
}

.info-block:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1) !important;
}

/* 修改卡片样式，添加边框和不同背景色 */
.info-block.production-card {
  background-color: #ffffff !important;
  border-color: #91d5ff !important;
}

.info-block.progress-card {
  background-color: #ffffff !important;
  border-color: #91d5ff !important;
}

.info-block.risk-card {
  background-color: #ffffff !important;
  border-color: #91d5ff !important;
}

.info-block.efficiency-card {
  background-color: #ffffff !important;
  border-color: #91d5ff !important;
}

/* 覆盖Element UI卡片的内部样式 */
.info-block.production-card /deep/ .el-card__body {
  background-color: #ffffff;
}

.info-block.progress-card /deep/ .el-card__body {
  background-color: #ffffff;
}

.info-block.risk-card /deep/ .el-card__body {
  background-color: #ffffff;
}

.info-block.efficiency-card /deep/ .el-card__body {
  background-color: #ffffff;
}

/* 通用卡片内部样式 */
.info-block /deep/ .el-card__body {
  padding: 15px;
  height: 100%;
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
  height: 75%;                /* 占据页面75%高度 */
  padding: 30px 0;            /* 上下留出30px内边距，避免内容紧贴分隔线 */
  overflow: auto;             /* 内容过多时显示滚动条 */
}

.divider {
  height: 5px;
  width: 100%;
  background-color: #dcdfe6;  /* 浅灰色 */
  margin: 0;                  /* 移除外边距，确保分隔线占满宽度 */
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

/* 流程效率指标卡片样式 */
.efficiency-metrics {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  padding: 10px 0;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 45%;
  height: 100%;
}

.metric-value {
  font-size: 28px;
  font-weight: 600;
  color: #722ed1;
  line-height: 1.2;
}

.unit {
  font-size: 12px;
  font-weight: normal;
  margin-left: 2px;
}

.metric-label {
  font-size: 12px;
  color: #666;
  margin: 6px 0;
}

.metric-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.metric-trend.up {
  color: #52c41a;
}

.metric-trend.down {
  color: #f5222d;
}

.metric-divider {
  width: 1px;
  height: 80%;
  background-color: #d3adf7;
}
</style> 