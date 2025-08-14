<template>
  <div class="operation-flow-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载流程图数据...</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <div class="error-message">
        <i class="el-icon-warning"></i>
        <p>{{ error }}</p>
        <button @click="loadFlowData" class="retry-button">重试</button>
      </div>
    </div>
    
    <!-- 流程图内容 -->
    <div v-else class="mermaid-chart" ref="container" v-html="renderedSvg"></div>
  </div>
</template>

<script>
import { subProcessDataApi } from '@/api/subProcessDataApi';

export default {
  name: 'OperationFlow',
  data() {
    return {
      mermaidLoaded: false,
      mermaidInitialized: false,
      renderedSvg: '',
      mermaidCode: '',
      flowData: null,
      
      // 数据状态
      loading: false,
      error: null
    };
  },
  mounted() {
    // 确保组件挂载后再加载数据
    this.$nextTick(() => {
      this.loadFlowData().catch(error => {
        console.error('组件初始化失败:', error);
        this.error = '组件初始化失败，请刷新页面重试';
        this.loading = false;
      });
    });
  },
  methods: {
    // 从API加载流程图数据
    async loadFlowData() {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('🔄 OperationFlow组件开始从API加载运维流程图数据...');
        
        // 检查API连接
        const connectionStatus = await subProcessDataApi.checkConnection();
        if (!connectionStatus.connected) {
          throw new Error('API服务器未启动，请先运行: npm run api-server');
        }
        
        // 调用API服务
        const response = await subProcessDataApi.getMermaidFlowData('operation');
        
        // 验证API响应格式
        if (!response || !response.success) {
          throw new Error(response.message || 'API响应格式错误');
        }
        
        const data = response.data;
        
        // 验证数据结构
        if (!data || !data.mermaidDefinition) {
          throw new Error('流程图数据格式不正确');
        }
        
        this.mermaidCode = data.mermaidDefinition;
        this.flowData = {
          mermaidDefinition: data.mermaidDefinition,
          nodes: data.nodes || [],
          edges: data.edges || []
        };
        
        console.log('✅ OperationFlow组件运维流程图数据加载成功:', {
          mermaidCodeLength: this.mermaidCode.length,
          nodesCount: this.flowData.nodes.length,
          edgesCount: this.flowData.edges.length
        });
        
        // 确保DOM准备好后再渲染
        this.$nextTick(() => {
          this.loadMermaidScript();
        });
        
      } catch (error) {
        console.error('❌ OperationFlow组件从API加载运维流程图数据失败:', error);
        
        // 根据错误类型设置不同的错误信息
        if (error.message.includes('Network Error') || error.message.includes('timeout')) {
          this.error = '网络连接失败，请检查网络连接';
        } else if (error.message.includes('404')) {
          this.error = '流程图数据不存在，请联系管理员';
        } else if (error.message.includes('API服务器未启动')) {
          this.error = 'API服务器未启动，请联系管理员';
        } else {
          this.error = error.message || '数据加载失败，请重试';
        }
        
        // 显示错误提示
        this.$message({
          message: `运维流程图加载失败: ${this.error}`,
          type: 'error',
          duration: 5000
        });
        
      } finally {
        this.loading = false;
      }
    },
    
    loadMermaidScript() {
      // 检查全局Mermaid脚本状态
      if (window.mermaidLoading) {
        // 如果正在加载，等待加载完成
        const checkLoaded = () => {
          if (window.mermaid && !window.mermaidLoading) {
            this.mermaidLoaded = true;
            this.initMermaid();
            this.renderMermaid();
          } else if (!window.mermaidLoading) {
            // 加载失败，重新加载
            this.loadMermaidScriptInternal();
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
        return;
      }
      
      if (window.mermaid) {
        this.mermaidLoaded = true;
        this.initMermaid();
        this.renderMermaid();
        return;
      }
      
      this.loadMermaidScriptInternal();
    },
    
    loadMermaidScriptInternal() {
      // 设置全局加载标志
      window.mermaidLoading = true;
      
      const script = document.createElement('script');
      script.src = '/static/mermaid.min.js';
      script.onload = () => {
        window.mermaidLoading = false;
        this.mermaidLoaded = true;
        this.initMermaid();
        this.renderMermaid();
      };
      script.onerror = () => {
        window.mermaidLoading = false;
        console.error('Failed to load mermaid script');
        this.error = 'Mermaid脚本加载失败';
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
      
      // 确保DOM元素存在
      await this.$nextTick();
      
      const container = this.$refs.container;
      if (!container) {
        console.warn('Mermaid容器不存在，延迟渲染');
        setTimeout(() => this.renderMermaid(), 100);
        return;
      }
      
      try {
        const id = `mermaid-operation-flow-${Date.now()}`;
        
        // 使用新的mermaid API
        const { svg } = await window.mermaid.render(id, this.mermaidCode);
        this.renderedSvg = svg;
        
        // 添加点击事件监听
        this.$nextTick(() => {
          this.addNodeClickEvents();
        });
        
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        this.error = '流程图渲染失败';
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
            console.log('OperationFlow组件节点被点击:', flowNode);
        
            // 跳转到详情页面
        this.$router.push({
          path: '/node-detail',
          query: {
                id: flowNode.id,
                title: flowNode.text,
            type: 'operation'
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
    },
    
    /**
     * 刷新流程图数据
     */
    async refreshFlowData() {
      console.log('🔄 OperationFlow组件刷新数据');
      await this.loadFlowData();
    },
    
    /**
     * 检查API连接状态
     */
    async checkApiConnection() {
      try {
        const status = await subProcessDataApi.checkConnection();
        console.log('🔍 OperationFlow API连接检查:', status);
        return status;
      } catch (error) {
        console.error('❌ OperationFlow API连接检查失败:', error);
        return { success: false, connected: false, message: error.message };
      }
    },
    
    /**
     * 获取组件状态信息
     */
    getComponentStatus() {
      const status = {
        loading: this.loading,
        error: this.error,
        mermaidLoaded: this.mermaidLoaded,
        mermaidInitialized: this.mermaidInitialized,
        hasFlowData: !!this.flowData,
        hasMermaidCode: !!this.mermaidCode,
        hasRenderedSvg: !!this.renderedSvg,
        flowType: 'operation'
      };
      
      console.log('📊 OperationFlow组件状态:', status);
      return status;
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
.operation-flow-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px;
  box-sizing: border-box;
  overflow-x: auto;
}

/* 加载状态样式 */
.loading-container {
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态样式 */
.error-container {
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-message {
  text-align: center;
  color: #ff4757;
  padding: 20px;
  border: 1px solid #ff4757;
  border-radius: 8px;
  background-color: #fff5f5;
  max-width: 400px;
}

.error-message i {
  font-size: 24px;
  margin-bottom: 12px;
  display: block;
}

.error-message p {
  margin: 12px 0;
  font-size: 14px;
}

.retry-button {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background-color: #40a9ff;
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

/* 决策节点样式 */
:deep(.node polygon) {
  fill: #E6F7FF;
  stroke: #1890FF;
  stroke-width: 2px;
}

/* 普通节点样式 */
:deep(.node rect) {
  fill: #F6FFED;
  stroke: #52C41A;
  stroke-width: 2px;
}

/* 连接线样式 */
:deep(.edgePath path) {
  stroke: #8C8C8C;
  stroke-width: 2px;
}

:deep(.arrowheadPath) {
  fill: #8C8C8C;
}
</style> 