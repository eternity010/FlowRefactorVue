<template>
  <div class="container" ref="container"></div>
</template>

<script>
import LogicFlow from "@logicflow/core";
import "@logicflow/core/lib/style/index.css";

export default {
  name: 'MarketingFlow',
  data() {
    return {
      lf: null,
      renderData: {
        // 节点数据
        nodes: [
          {
            id: 'm1',
            type: 'rect',
            x: 100,
            y: 150,
            text: '市场调研',
            properties: {
              width: 100,
              height: 60,
            }
          },
          {
            id: 'm2',
            type: 'rect',
            x: 300,
            y: 150,
            text: '策略制定',
            properties: {
              width: 100,
              height: 60,
            }
          },
          {
            id: 'm3',
            type: 'rect',
            x: 500,
            y: 150,
            text: '渠道开发',
            properties: {
              width: 100,
              height: 60,
            }
          },
          {
            id: 'm4',
            type: 'rect',
            x: 700,
            y: 80,
            text: '线上推广',
            properties: {
              width: 100,
              height: 60,
            }
          },
          {
            id: 'm5',
            type: 'rect',
            x: 700,
            y: 220,
            text: '线下推广',
            properties: {
              width: 100,
              height: 60,
            }
          },
          {
            id: 'm6',
            type: 'diamond',
            x: 900,
            y: 150,
            text: '效果评估',
            properties: {
              width: 100,
              height: 60,
            }
          },
          {
            id: 'm7',
            type: 'rect',
            x: 1100,
            y: 150,
            text: '调整优化',
            properties: {
              width: 100,
              height: 60,
            }
          }
        ],
        // 边数据
        edges: [
          {
            id: 'me1',
            type: 'polyline',
            sourceNodeId: 'm1',
            targetNodeId: 'm2',
          },
          {
            id: 'me2',
            type: 'polyline',
            sourceNodeId: 'm2',
            targetNodeId: 'm3',
          },
          {
            id: 'me3',
            type: 'polyline',
            sourceNodeId: 'm3',
            targetNodeId: 'm4',
          },
          {
            id: 'me4',
            type: 'polyline',
            sourceNodeId: 'm3',
            targetNodeId: 'm5',
          },
          {
            id: 'me5',
            type: 'polyline',
            sourceNodeId: 'm4',
            targetNodeId: 'm6',
          },
          {
            id: 'me6',
            type: 'polyline',
            sourceNodeId: 'm5',
            targetNodeId: 'm6',
          },
          {
            id: 'me7',
            type: 'polyline',
            sourceNodeId: 'm6',
            targetNodeId: 'm7',
          },
          {
            id: 'me8',
            type: 'polyline',
            sourceNodeId: 'm7',
            targetNodeId: 'm3',
            text: '循环优化'
          }
        ],
      }
    }
  },
  mounted() {
    this.initFlow();
  },
  methods: {
    initFlow() {
      this.lf = new LogicFlow({
        container: this.$refs.container,
        grid: true,
        style: {
          rect: {
            fill: '#F0F5FF',
            stroke: '#1890FF',
            strokeWidth: 1,
          },
          diamond: {
            fill: '#F0F5FF',
            stroke: '#1890FF',
          },
        }
      });
      
      this.lf.render(this.renderData);

      // 监听节点点击事件
      this.lf.on('node:click', ({ data }) => {
        console.log('节点被点击:', data);
        alert(`节点 ${data.id} 被点击！\n文本内容: ${data.text}\n自定义属性: ${JSON.stringify(data.properties)}`);
      });
    }
  },
  beforeUnmount() {
    if (this.lf) {
      this.lf.dispose();
    }
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style> 