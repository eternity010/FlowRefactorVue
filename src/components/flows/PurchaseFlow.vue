<template>
  <div class="container" ref="container"></div>
</template>

<script>
import LogicFlow from "@logicflow/core";
import "@logicflow/core/lib/style/index.css";

export default {
  name: 'PurchaseFlow',
  data() {
    return {
      lf: null,
      renderData: {
        // 节点数据
        nodes: [
          {
            id: 'p1',
            type: 'rect',
            x: 100,
            y: 100,
            text: '采购需求',
            properties: {
              width: 100,
              height: 60,
            }
          },
          {
            id: 'p2',
            type: 'rect',
            x: 300,
            y: 100,
            text: '供应商选择',
            properties: {
              width: 100,
              height: 60,
            }
          },
          {
            id: 'p3',
            type: 'diamond',
            x: 500,
            y: 100,
            text: '价格审批',
            properties: {
              width: 100,
              height: 60,
            }
          },
          {
            id: 'p4',
            type: 'rect',
            x: 700,
            y: 100,
            text: '签订合同',
            properties: {
              width: 100,
              height: 60,
            }
          },
          {
            id: 'p5',
            type: 'rect',
            x: 900,
            y: 100,
            text: '货物接收',
            properties: {
              width: 100,
              height: 60,
            }
          },
          {
            id: 'p6',
            type: 'diamond',
            x: 1100,
            y: 100,
            text: '质量检验',
            properties: {
              width: 100,
              height: 60,
            }
          },
          {
            id: 'p7',
            type: 'rect',
            x: 1300,
            y: 100,
            text: '入库',
            properties: {
              width: 100,
              height: 60,
            }
          },
          {
            id: 'p8',
            type: 'rect',
            x: 1100,
            y: 250,
            text: '退回处理',
            properties: {
              width: 100,
              height: 60,
            }
          }
        ],
        // 边数据
        edges: [
          {
            id: 'e1',
            type: 'polyline',
            sourceNodeId: 'p1',
            targetNodeId: 'p2',
          },
          {
            id: 'e2',
            type: 'polyline',
            sourceNodeId: 'p2',
            targetNodeId: 'p3',
          },
          {
            id: 'e3',
            type: 'polyline',
            text: '通过',
            sourceNodeId: 'p3',
            targetNodeId: 'p4',
          },
          {
            id: 'e4',
            type: 'polyline',
            sourceNodeId: 'p4',
            targetNodeId: 'p5',
          },
          {
            id: 'e5',
            type: 'polyline',
            sourceNodeId: 'p5',
            targetNodeId: 'p6',
          },
          {
            id: 'e6',
            type: 'polyline',
            text: '合格',
            sourceNodeId: 'p6',
            targetNodeId: 'p7',
          },
          {
            id: 'e7',
            type: 'polyline',
            text: '不合格',
            sourceNodeId: 'p6',
            targetNodeId: 'p8',
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
            fill: '#FFEFD5',
            stroke: '#FF8C00',
            strokeWidth: 1,
          },
          diamond: {
            fill: '#FFEFD5',
            stroke: '#FF8C00',
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
            type: 'purchase'
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