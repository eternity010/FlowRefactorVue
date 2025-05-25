<template>
  <div class="process-optimization-container">
    <!-- 简单Mermaid示例卡片 -->
    <el-card class="simple-example-card">
      <div slot="header" class="card-header">
        <span>Mermaid简单示例</span>
        <el-tag size="small" type="success">基础演示</el-tag>
      </div>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="code-section">
            <h4>示例代码</h4>
            <el-input
              type="textarea"
              :rows="10"
              v-model="simpleMermaidCode">
            </el-input>
            <div class="code-controls">
              <el-button size="small" type="primary" @click="refreshSimpleExample">渲染图表</el-button>
              <el-button size="small" @click="resetSimpleExample">重置代码</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="preview-section">
            <h4>渲染预览</h4>
            <div class="simple-chart-container">
              <MermaidChart :code="simpleMermaidCode" v-if="showSimpleChart" />
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="main-card">
      <div slot="header" class="card-header">
        <span>流程重构优化</span>
        <el-tag size="small" type="primary">版本: 1.0.0</el-tag>
      </div>
      
      <!-- Mermaid图表区域 -->
      <div class="mermaid-container">
        <h3 class="section-title">流程优化示例</h3>
        
        <el-tabs v-model="activeTab" type="border-card">
          <el-tab-pane label="优化前流程" name="before">
            <div class="chart-container">
              <MermaidChart :code="beforeProcessChart" v-if="activeTab==='before'" />
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="优化后流程" name="after">
            <div class="chart-container">
              <MermaidChart :code="afterProcessChart" v-if="activeTab==='after'" />
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="效益对比" name="comparison">
            <div class="chart-container">
              <MermaidChart :code="comparisonChart" v-if="activeTab==='comparison'" />
            </div>
          </el-tab-pane>
        </el-tabs>
        
        <div class="chart-controls">
          <el-button size="small" type="primary" @click="refreshCharts">刷新图表</el-button>
          <el-button size="small" @click="exportImage">导出为图片</el-button>
        </div>
      </div>
      
      <!-- 优化策略区域 -->
      <div class="strategy-section">
        <h3 class="section-title">重构优化策略</h3>
        <el-collapse v-model="activeStrategy">
          <el-collapse-item title="并行化处理" name="1">
            <div class="strategy-content">
              <p>将串行流程改为并行处理，减少等待时间，提高整体流程效率。</p>
            </div>
          </el-collapse-item>
          <el-collapse-item title="冗余环节消除" name="2">
            <div class="strategy-content">
              <p>识别并消除流程中的冗余步骤和重复审批环节，简化流程结构。</p>
            </div>
          </el-collapse-item>
          <el-collapse-item title="自动化替代" name="3">
            <div class="strategy-content">
              <p>用自动化系统替代手动操作环节，提高准确性并减少人为干预。</p>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
  </div>
</template>

<script>
import MermaidChart from '@/components/MermaidChart.vue'

export default {
  name: 'ProcessOptimizationView',
  components: { MermaidChart },
  data() {
    return {
      simpleMermaidCode: `graph TD\n    A[开始] --> B[流程1]\n    B --> C[流程2]\n    C --> D{判断条件}\n    D -->|是| E[流程3]\n    D -->|否| F[流程4]\n    E --> G[结束]\n    F --> G`,
      defaultSimpleMermaidCode: `graph TD\n    A[开始] --> B[流程1]\n    B --> C[流程2]\n    C --> D{判断条件}\n    D -->|是| E[流程3]\n    D -->|否| F[流程4]\n    E --> G[结束]\n    F --> G`,
      showSimpleChart: true,
      activeTab: 'before',
      activeStrategy: ['1'],
      beforeProcessChart: `graph TB\n          A[开始] --> B[需求收集]\n          B --> C[需求分析]\n          C --> D{需求评审}\n          D -->|通过| E[设计方案]\n          D -->|不通过| B\n          E --> F[方案评审]\n          F -->|通过| G[开发实施]\n          F -->|不通过| E\n          G --> H[测试验收]\n          H -->|通过| I[完成部署]\n          H -->|不通过| G\n          I --> J[结束]\n      `,
      afterProcessChart: `graph TB\n          A[开始] --> B[需求收集与分析]\n          B --> C{需求评审}\n          C -->|通过| D[设计与开发]\n          C -->|调整| B\n          D --> E[集成测试]\n          E -->|通过| F[完成部署]\n          E -->|不通过| D\n          F --> G[结束]\n          \n          style D fill:#bbf,stroke:#33f,stroke-width:2px\n          style B fill:#bfb,stroke:#3f3,stroke-width:2px\n      `,
      comparisonChart: `pie title \"流程优化效益对比\"\n          \"时间节省\" : 45\n          \"资源节约\" : 30\n          \"错误减少\" : 15\n          \"用户体验提升\" : 10\n      `
    }
  },
  methods: {
    refreshSimpleExample() {
      // 通过切换showSimpleChart强制MermaidChart重新渲染
      this.showSimpleChart = false;
      this.$nextTick(() => {
        this.showSimpleChart = true;
      });
    },
    resetSimpleExample() {
      this.simpleMermaidCode = this.defaultSimpleMermaidCode;
      this.refreshSimpleExample();
    },
    refreshCharts() {
      // 选项卡内MermaidChart会自动响应activeTab和code变化，无需手动刷新
      this.activeTab = this.activeTab; // 触发watch
    },
    exportImage() {
      this.$message({
        message: '导出功能待实现',
        type: 'info'
      });
    }
  }
}
</script>

<style scoped>
.process-optimization-container {
  padding: 20px;
}

/* 简单示例卡片样式 */
.simple-example-card {
  margin-bottom: 20px;
}

.code-section, 
.preview-section {
  height: 100%;
  padding: 10px;
}

.code-section h4,
.preview-section h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #606266;
  border-left: 3px solid #409EFF;
  padding-left: 10px;
}

.code-controls {
  margin-top: 10px;
  text-align: right;
}

.simple-chart-container,
.chart-container { /* 合并样式 */
  min-height: 250px; /* 保证最小高度 */
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px dashed #dcdfe6;
  display: flex; /* 用于居中 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中，如果内容较小 */
  overflow: auto; /* 如果图表过大，允许滚动 */
}

.main-card {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.chart-controls {
  margin-top: 20px;
  text-align: right;
}

.strategy-section {
  margin-top: 30px;
}

.strategy-content {
  padding: 10px;
  background-color: #f9f9f9;
}

/* Mermaid图表通用样式 (使用 :deep() 穿透scoped CSS) */
:deep(.mermaid svg) { /* 直接针对生成的svg元素 */
  display: block; /* 尝试解决可能的额外空间 */
  margin: auto; /* 配合父容器的flex居中 */
  max-width: 100% !important; /* 确保SVG不会超出其容器 */
  height: auto !important; /* 保持宽高比 */
}

:deep(.node rect),
:deep(.node circle),
:deep(.node ellipse),
:deep(.node polygon) {
  fill: #f0f9ff !important;
  stroke: #3572b0 !important;
  stroke-width: 1px !important;
}

:deep(.edgePath .path) {
  stroke: #3572b0 !important;
  stroke-width: 1.5px !important;
}

:deep(.label) {
  font-family: 'Consolas', 'Menlo', monospace !important; /* 使用更适合代码的字体 */
  font-size: 13px !important; /* 调整字体大小 */
  color: #333 !important;
}
</style> 