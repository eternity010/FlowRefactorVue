<template>
  <div class="process-flow">
    <div class="flow-container">
      <div class="flow-step">
        <div class="parallelogram">
          <div class="step-content">
            <div class="step-title">采购环节</div>
            <div class="content-wrapper">
              <div class="data-panels">
                <div class="data-item">
                  <div class="data-label">当月采购总额</div>
                  <div class="data-value">¥1,256,890</div>
                </div>
                <div class="data-item">
                  <div class="data-label">未处理申请</div>
                  <div class="data-value">24<span class="data-unit">件</span></div>
                </div>
                <div class="data-item">
                  <div class="data-label">合作供应商</div>
                  <div class="data-value">78<span class="data-unit">家</span></div>
                </div>
                <div class="data-item">
                  <div class="data-label">采购完成率</div>
                  <div class="data-value">85.7%</div>
                </div>
              </div>
              <div class="chart-container" ref="purchaseChart"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="flow-step">
        <div class="parallelogram">
          <div class="step-content">
            <div class="step-title">生产环节</div>
          </div>
        </div>
      </div>
      <div class="flow-step">
        <div class="parallelogram">
          <div class="step-content">
            <div class="step-title">营销环节</div>
          </div>
        </div>
      </div>
      <div class="flow-step">
        <div class="parallelogram">
          <div class="step-content">
            <div class="step-title">运维环节</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'ProcessFlow',
  data() {
    return {
      purchaseChart: null,
      purchaseData: [
        { month: '1月', value: 920000 },
        { month: '2月', value: 850000 },
        { month: '3月', value: 1100000 },
        { month: '4月', value: 980000 },
        { month: '5月', value: 1050000 },
        { month: '6月', value: 1256890 }
      ]
    }
  },
  mounted() {
    this.initPurchaseChart()
    window.addEventListener('resize', this.resizeChart)
  },
  methods: {
    initPurchaseChart() {
      if (this.$refs.purchaseChart) {
        this.purchaseChart = echarts.init(this.$refs.purchaseChart)
        
        const option = {
          grid: {
            top: 30,
            right: 10,
            bottom: 20,
            left: 50
          },
          tooltip: {
            trigger: 'axis',
            formatter: '{b}: {c}元'
          },
          xAxis: {
            type: 'category',
            data: this.purchaseData.map(item => item.month),
            axisLabel: {
              fontSize: 10,
              color: '#666'
            },
            axisLine: {
              lineStyle: {
                color: '#ddd'
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              fontSize: 10,
              color: '#666',
              formatter: function(value) {
                return (value / 10000) + '万';
              }
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#eee'
              }
            }
          },
          series: [{
            data: this.purchaseData.map(item => item.value),
            type: 'line',
            name: '采购金额',
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              color: '#1890ff'
            },
            lineStyle: {
              width: 2,
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
        
        this.purchaseChart.setOption(option)
      }
    },
    resizeChart() {
      this.purchaseChart && this.purchaseChart.resize()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart)
    this.purchaseChart && this.purchaseChart.dispose()
  }
}
</script>

<style scoped>
/* 流程图容器：占满整个可用空间，垂直居中布局 */
.process-flow {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;  /* 纵向排列 */
  align-items: center;     /* 水平居中 */
  padding-top: 20px;       /* 顶部留白，避免覆盖分割线 */
}

/* 流程图标题样式 */
.flow-title {
  font-size: 18px;         /* 字体大小 */
  color: #333;             /* 字体颜色 */
  font-weight: 500;        /* 字体粗细 */
  margin-bottom: 30px;     /* 下方留白 */
}

/* 流程图步骤容器：垂直排列各步骤 */
.flow-container {
  display: flex;
  flex-direction: column;  /* 纵向排列 */
  align-items: center;     /* 水平居中 */
  width: 100%;
  gap: 30px;               /* 步骤之间的间距 */
}

/* 单个流程步骤容器 */
.flow-step {
  width: 100%;
  display: flex;
  justify-content: center; /* 水平居中 */
  position: relative;      /* 相对定位，用于放置箭头 */
}

/* 添加连接箭头 - 应用于除最后一个元素外的所有元素 */
.flow-step:not(:last-child) {
  margin-bottom: 20px;    /* 确保有足够空间放置箭头 */
}

/* 箭头样式 */
.flow-step:not(:last-child)::after {
  content: "";
  position: absolute;
  bottom: -30px;          /* 位置调整，放在元素下方 */
  left: 50%;              /* 水平居中 */
  transform: translateX(-50%);  /* 精确居中 */
  width: 0;
  height: 0;
  border-left: 20px solid transparent;   /* 创建三角形 */
  border-right: 20px solid transparent;  /* 创建三角形 */
  border-top: 20px solid #1890ff;        /* 箭头颜色 - 蓝色 */
  z-index: 2;             /* 确保箭头显示在上层 */
}

/* 第一个箭头的特殊颜色 - 蓝色 */
.flow-step:nth-child(1):not(:last-child)::after {
  border-top-color: #1890ff;  /* 从第一个元素来的箭头使用蓝色 */
}

/* 第二个箭头的特殊颜色 - 绿色 */
.flow-step:nth-child(2):not(:last-child)::after {
  border-top-color: #52c41a;  /* 从第二个元素来的箭头使用绿色 */
}

/* 平行四边形基础样式 */
.parallelogram {
  width: 90%;            /* 宽度 */
  height: 200px;            /* 高度 */
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  color: #1890ff;
  display: flex;
  align-items: center;     /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  font-weight: 500;
  position: relative;
  transform: skew(-40deg); /* 向左倾斜20度，形成平行四边形 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

/* 平行四边形背景伪元素 */
.parallelogram:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #e6f7ff;
  z-index: -1;             /* 放在内容下方 */
}

/* 平行四边形内容布局 */
.step-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: skew(40deg); /* 内容反向倾斜，抵消容器的倾斜效果 */
  width: 100%;
  height: 100%;
  position: relative;
}

/* 内容包装容器 */
.content-wrapper {
  display: flex;
  width: 90%;
  height: 70%;
  margin-top: 40px;
}

/* 环节标题样式 */
.step-title {
  position: absolute;
  top: 15px;
  left: 100px;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
}

/* 数据面板样式 */
.data-panels {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 60%;
  justify-content: flex-start;
  padding-left: 20px;
}

/* 图表容器样式 */
.chart-container {
  width: 40%;
  height: 100%;
}

/* 单个数据项样式 */
.data-item {
  margin: 3px;
  padding: 6px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  text-align: center;
  width: calc(40% - 10px);
}

/* 数据标签样式 */
.data-label {
  font-size: 11px;
  color: #666;
  margin-bottom: 1px;
}

/* 数据数值样式 */
.data-value {
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
}

/* 数据单位样式 */
.data-unit {
  font-size: 12px;
  margin-left: 2px;
  font-weight: normal;
}

/* 第一个流程步骤的样式：蓝色 */
.flow-step:nth-child(1) .parallelogram {
  background-color: #e6f7ff; /* 浅蓝色背景 */
  border-color: #91d5ff;     /* 蓝色边框 */
  color: #1890ff;            /* 蓝色文字 */
}

/* 第二个流程步骤的样式：绿色 */
.flow-step:nth-child(2) .parallelogram {
  background-color: #f6ffed; /* 浅绿色背景 */
  border-color: #b7eb8f;     /* 绿色边框 */
  color: #52c41a;            /* 绿色文字 */
}

/* 第三个流程步骤的样式：橙色 */
.flow-step:nth-child(3) .parallelogram {
  background-color: #fff7e6; /* 浅橙色背景 */
  border-color: #ffd591;     /* 橙色边框 */
  color: #fa8c16;            /* 橙色文字 */
}

/* 第四个流程步骤的样式：青色 */
.flow-step:nth-child(4) .parallelogram {
  background-color: #e6fffb; /* 浅青色背景 */
  border-color: #87e8de;     /* 青色边框 */
  color: #13c2c2;            /* 青色文字 */
}
</style> 