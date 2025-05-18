<template>
  <div class="implementation-flow-container">
    <h3 class="flow-title">{{ title }}</h3>
    <div class="flow-description">{{ description }}</div>
    <div ref="flowContainer" class="flow-chart"></div>
    
    <!-- 步骤详情弹窗 -->
    <el-dialog 
      :title="currentStep ? currentStep.title : '步骤详情'" 
      :visible.sync="dialogVisible"
      width="50%">
      <div v-if="currentStep" class="step-detail">
        <div class="detail-item">
          <span class="label">描述：</span>
          <span class="value">{{ currentStep.description }}</span>
        </div>
        
        <div class="detail-item">
          <span class="label">耗时：</span>
          <span class="value">{{ currentStep.duration }}</span>
        </div>
        
        <div class="detail-item">
          <span class="label">负责人：</span>
          <span class="value">{{ currentStep.responsible }}</span>
        </div>
        
        <div v-if="currentStep.inputs && currentStep.inputs.length" class="detail-item">
          <span class="label">输入：</span>
          <div class="value-list">
            <el-tag 
              v-for="(input, index) in currentStep.inputs" 
              :key="'input-'+index"
              size="small"
              effect="plain"
              class="tag-item">
              {{ input }}
            </el-tag>
          </div>
        </div>
        
        <div v-if="currentStep.outputs && currentStep.outputs.length" class="detail-item">
          <span class="label">输出：</span>
          <div class="value-list">
            <el-tag 
              v-for="(output, index) in currentStep.outputs" 
              :key="'output-'+index"
              size="small"
              type="success"
              effect="plain"
              class="tag-item">
              {{ output }}
            </el-tag>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import LogicFlow from "@logicflow/core";
import "@logicflow/core/lib/style/index.css";

export default {
  name: 'ImplementationFlowChart',
  props: {
    flowData: {
      type: Object,
      required: true
    },
    stepsData: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: '实现流程图'
    },
    description: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      lf: null,
      dialogVisible: false,
      currentStep: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initFlowChart();
    });
  },
  methods: {
    initFlowChart() {
      // 初始化 LogicFlow 实例
      this.lf = new LogicFlow({
        container: this.$refs.flowContainer,
        grid: true,
        // 禁止编辑，只用于查看
        isSilentMode: true,
        nodeTextEdit: false,
        edgeTextEdit: false,
        // 禁用滚轮缩放
        stopScrollGraph: true,
        stopZoomGraph: true,
        // 禁止拖动画布
        stopMoveGraph: true,
        style: {
          circle: {
            fill: '#f6ffed',
            stroke: '#52c41a',
            strokeWidth: 2
          },
          rect: {
            fill: '#FFEFD5', // 采购环节特有的配色
            stroke: '#FF8C00',
            strokeWidth: 2,
            radius: 8
          },
          polygon: {
            fill: '#f5f0ff',
            stroke: '#722ed1',
            strokeWidth: 2
          },
          diamond: {
            fill: '#FFEFD5', // 采购环节特有的配色
            stroke: '#FF8C00',
            strokeWidth: 2
          }
        }
      });
      
      // 渲染流程图
      if (this.flowData) {
        this.lf.render(this.flowData);
        
        // 自动调整视图以适应内容
        this.lf.fitView();
        
        // 添加节点点击事件
        this.lf.on('node:click', ({ data }) => {
          const stepId = data.id;
          if (this.stepsData && this.stepsData[stepId]) {
            this.currentStep = this.stepsData[stepId];
            this.dialogVisible = true;
          }
        });
      }
    },
    
    // 重新渲染流程图
    updateFlowChart() {
      if (!this.lf) {
        this.initFlowChart();
        return;
      }
      
      // 清除旧数据
      this.lf.clearData();
      
      // 渲染新数据
      if (this.flowData) {
        this.lf.render(this.flowData);
        this.lf.fitView();
      }
    }
  },
  // 监听数据变化，重新渲染图表
  watch: {
    flowData: {
      handler(newVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.updateFlowChart();
          });
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    if (this.lf) {
      this.lf.dispose();
    }
  }
}
</script>

<style scoped>
.implementation-flow-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.flow-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #FF8C00; /* 采购环节特有的配色 */
}

.flow-description {
  color: #666;
  margin-bottom: 15px;
}

.flow-chart {
  width: 100%;
  height: 400px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  margin-bottom: 20px;
}

.step-detail {
  padding: 10px;
}

.detail-item {
  margin-bottom: 15px;
}

.label {
  font-weight: bold;
  color: #606266;
  display: block;
  margin-bottom: 5px;
}

.value {
  color: #303133;
}

.value-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 5px;
}

.tag-item {
  margin-right: 5px;
}
</style> 