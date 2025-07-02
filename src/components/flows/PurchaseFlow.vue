<template>
  <div class="purchase-flow-container">
    <div class="mermaid-chart" ref="container" v-html="renderedSvg"></div>
  </div>
</template>

<script>
import purchaseFlowData from '@/data/subflow/purchaseFlowMermaid.json';

export default {
  name: 'PurchaseFlow',
  data() {
    return {
      mermaidLoaded: false,
      mermaidInitialized: false,
      renderedSvg: '',
      mermaidCode: purchaseFlowData.mermaidDefinition,
      flowData: purchaseFlowData
    }
  },
  mounted() {
    this.loadMermaidScript();
  },
  methods: {
    loadMermaidScript() {
      if (window.mermaid) {
        this.mermaidLoaded = true;
        this.initMermaid();
        this.renderMermaid();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/mermaid@10.6.1/dist/mermaid.min.js';
      script.onload = () => {
        this.mermaidLoaded = true;
        this.initMermaid();
        this.renderMermaid();
      };
      script.onerror = () => {
        console.error('Failed to load mermaid script');
      };
      document.head.appendChild(script);
    },
    
    initMermaid() {
      if (this.mermaidInitialized || !window.mermaid) return;
      
      window.mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: 'default',
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
          curve: 'basis',
          nodeSpacing: 50,
          rankSpacing: 80
        }
      });
      this.mermaidInitialized = true;
    },
    
    async renderMermaid() {
      if (!window.mermaid || !this.mermaidLoaded) return;
      
      const container = this.$refs.container;
      if (!container) return;
      
      try {
        const id = `mermaid-purchase-flow-${Date.now()}`;
        
        // 使用新的mermaid API
        const { svg } = await window.mermaid.render(id, this.mermaidCode);
        this.renderedSvg = svg;
        
        // 添加点击事件监听
        this.$nextTick(() => {
          this.addNodeClickEvents();
        });
        
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        container.innerHTML = '<div class="error-message">流程图渲染失败</div>';
      }
    },
    
    addNodeClickEvents() {
      const container = this.$refs.container;
      if (!container) return;

      // 查找所有mermaid节点
      const nodes = container.querySelectorAll('.node');
      
      nodes.forEach(node => {
        node.style.cursor = 'pointer';
        node.addEventListener('click', (event) => {
          // 获取节点ID
          const nodeId = node.id || '';
          const flowNode = this.flowData.nodes.find(n => nodeId.includes(n.id));
          
          if (flowNode) {
            console.log('节点被点击:', flowNode);
        
            // 跳转到详情页面
        this.$router.push({
          path: '/node-detail',
          query: {
                id: flowNode.id,
                title: flowNode.text,
            type: 'purchase'
          }
            });
          }
        });
        
        // 添加hover效果
        node.addEventListener('mouseenter', () => {
          node.style.opacity = '0.8';
        });
        
        node.addEventListener('mouseleave', () => {
          node.style.opacity = '1';
        });
      });
    }
  },
  
  beforeUnmount() {
    // 清理事件监听器
    const container = this.$refs.container;
    if (container) {
      const nodes = container.querySelectorAll('.node');
      nodes.forEach(node => {
        node.removeEventListener('click', null);
        node.removeEventListener('mouseenter', null);
        node.removeEventListener('mouseleave', null);
      });
    }
  }
};
</script>

<style scoped>
.purchase-flow-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px;
  box-sizing: border-box;
  overflow-x: auto;
}

.mermaid-chart {
  width: 100%;
  min-height: 400px;
  min-width: 800px;
  text-align: center;
  overflow: auto;
  overflow-x: auto;
  overflow-y: hidden;
}

.error-message {
  color: #ff4757;
  font-size: 16px;
  padding: 20px;
  border: 1px solid #ff4757;
  border-radius: 4px;
  background-color: #fff5f5;
}

/* 全局样式，影响mermaid渲染的SVG */
:deep(.node) {
  cursor: pointer !important;
  transition: all 0.3s ease;
}

:deep(.node:hover) {
  opacity: 0.8;
  transform: scale(1.05);
}

:deep(.node rect) {
  stroke-width: 2px;
}

:deep(.node.clickable rect) {
  stroke: #409EFF;
}

:deep(.edgeLabel) {
  background-color: white;
  padding: 2px 4px;
  border-radius: 2px;
  font-size: 12px;
}
</style> 