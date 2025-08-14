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
      if (!window.mermaid || !this.mermaidLoaded) return;
      await this.$nextTick();
      const container = this.$refs.container;
      if (!container) return;
      const id = `mermaid-${Date.now()}`;
      container.innerHTML = '';
      try {
        const renderRes = window.mermaid.render(id, this.code);
        // Mermaid v10 及以上返回 Promise
        if (renderRes instanceof Promise) {
          const { svg } = await renderRes;
          container.innerHTML = svg;
        } else {
          // 兼容旧版本 callback 写法
          window.mermaid.render(id, this.code, (svgCode) => {
            container.innerHTML = svgCode;
          });
        }
      } catch (error) {
        console.error('Mermaid 渲染失败:', error);
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