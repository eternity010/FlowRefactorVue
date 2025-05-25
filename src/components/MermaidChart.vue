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
      script.src = 'https://unpkg.com/mermaid@8.5.0/dist/mermaid.min.js';
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
    renderMermaid() {
      if (!window.mermaid || !this.mermaidLoaded) return;
      const container = this.$refs.container;
      if (!container) return;
      const id = `mermaid-${Date.now()}`;
      container.innerHTML = '';
      window.mermaid.render(id, this.code, (svgCode) => {
        container.innerHTML = svgCode;
      });
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