<template>
  <div class="container" ref="container"></div>
</template>

<script>
import LogicFlow from "@logicflow/core";
import "@logicflow/core/lib/style/index.css";

export default {
  name: 'ProductionFlow',
  data() {
    return {
      lf: null,
      renderData: {
        // 节点数据
        nodes: [
          {
            id: 'prod1',
            type: 'rect',
            x: 100,
            y: 150,
            text: '生产计划制定',
            properties: {
              width: 120,
              height: 60,
            }
          },
          {
            id: 'prod2',
            type: 'rect',
            x: 300,
            y: 150,
            text: '原材料准备',
            properties: {
              width: 120,
              height: 60,
            }
          },
          {
            id: 'prod3',
            type: 'diamond',
            x: 500,
            y: 150,
            text: '材料质检',
            properties: {
              width: 100,
              height: 60,
            }
          },
          {
            id: 'prod4',
            type: 'rect',
            x: 700,
            y: 150,
            text: '生产加工',
            properties: {
              width: 120,
              height: 60,
            }
          },
          {
            id: 'prod5',
            type: 'diamond',
            x: 900,
            y: 150,
            text: '产品质检',
            properties: {
              width: 100,
              height: 60,
            }
          },
          {
            id: 'prod6',
            type: 'rect',
            x: 1100,
            y: 150,
            text: '包装入库',
            properties: {
              width: 120,
              height: 60,
            }
          },
          {
            id: 'prod7',
            type: 'rect',
            x: 500,
            y: 300,
            text: '返回处理',
            properties: {
              width: 120,
              height: 60,
            }
          },
          {
            id: 'prod8',
            type: 'rect',
            x: 900,
            y: 300,
            text: '不良品处理',
            properties: {
              width: 120,
              height: 60,
            }
          }
        ],
        // 边数据
        edges: [
          {
            id: 'pe1',
            type: 'polyline',
            sourceNodeId: 'prod1',
            targetNodeId: 'prod2',
          },
          {
            id: 'pe2',
            type: 'polyline',
            sourceNodeId: 'prod2',
            targetNodeId: 'prod3',
          },
          {
            id: 'pe3',
            type: 'polyline',
            text: '合格',
            sourceNodeId: 'prod3',
            targetNodeId: 'prod4',
          },
          {
            id: 'pe4',
            type: 'polyline',
            text: '不合格',
            sourceNodeId: 'prod3',
            targetNodeId: 'prod7',
          },
          {
            id: 'pe5',
            type: 'polyline',
            sourceNodeId: 'prod4',
            targetNodeId: 'prod5',
          },
          {
            id: 'pe6',
            type: 'polyline',
            text: '合格',
            sourceNodeId: 'prod5',
            targetNodeId: 'prod6',
          },
          {
            id: 'pe7',
            type: 'polyline',
            text: '不合格',
            sourceNodeId: 'prod5',
            targetNodeId: 'prod8',
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
            fill: '#E0F5E9',
            stroke: '#52c41a',
            strokeWidth: 1,
          },
          diamond: {
            fill: '#E0F5E9',
            stroke: '#52c41a',
          },
        }
      });
      
      this.lf.render(this.renderData);

      // 监听节点点击事件
      this.lf.on('node:click', ({ data }) => {
        console.log('节点被点击:', data);
        
        // 对所有节点实现点击跳转到详情页面
        this.$router.push({
          path: '/node-detail',
          query: {
            id: data.id,
            title: data.text,
            type: 'production'
          }
        });
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