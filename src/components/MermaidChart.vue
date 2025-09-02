<template>
  <div class="mermaid-chart" ref="container"></div>
</template>

<script>
export default {
  name: 'MermaidChart',
  props: {
    code: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      mermaidLoaded: false,
      mermaidInitialized: false
    }
  },
  watch: {
    code: {
      handler() {
        this.renderMermaid();
      },
      immediate: true
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
      script.src = '/static/mermaid.min.js';
      script.onload = () => {
        this.mermaidLoaded = true;
        this.initMermaid();
        this.renderMermaid();
      };
      document.head.appendChild(script);
    },
    initMermaid() {
      if (this.mermaidInitialized || !window.mermaid) return;
      window.mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: 'default'
      });
      this.mermaidInitialized = true;
    },
    async renderMermaid() {
      if (!window.mermaid || !this.mermaidLoaded) {
        console.warn('Mermaid 未加载，跳过渲染');
        return;
      }

      if (!this.code || this.code.trim() === '') {
        console.warn('Mermaid 代码为空，跳过渲染');
        return;
      }

      await this.$nextTick();
      const container = this.$refs.container;
      if (!container) {
        console.warn('Mermaid 容器不存在');
        return;
      }

      const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      container.innerHTML = '';

      try {
        console.log('开始渲染 Mermaid 图表:', id);

        const renderRes = window.mermaid.render(id, this.code);

        // Mermaid v10 及以上返回 Promise
        if (renderRes instanceof Promise) {
          const { svg } = await renderRes;
          container.innerHTML = svg;
          console.log('Mermaid 图表渲染完成 (Promise):', id);
        } else {
          // 兼容旧版本 callback 写法
          window.mermaid.render(id, this.code, (svgCode) => {
            container.innerHTML = svgCode;
            console.log('Mermaid 图表渲染完成 (Callback):', id);
          });
        }
      } catch (error) {
        console.error('Mermaid 渲染失败:', error);
        container.innerHTML = `<div style="color: #f56c6c; text-align: center; padding: 20px;">图表渲染失败: ${error.message}</div>`;
      }
    }
  }
}
</script>

<style scoped>
.mermaid-chart {
  width: 100%;
  min-height: 100px;
  text-align: center;
}
</style> 