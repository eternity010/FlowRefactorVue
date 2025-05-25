<template>
  <div class="container" ref="container"></div>
</template>

<script>
import LogicFlow from "@logicflow/core";
import "@logicflow/core/lib/style/index.css";

export default {
  name: 'OperationFlow',
  data() {
    return {
      lf: null,
      renderData: {
        // 节点数据
        nodes: [
          {
            id: 'o1', // 节点ID，需要全局唯一，不传入内部会自动生成一个ID
            type: 'rect', // 节点类型，可以传入LogicFlow内置的7种节点类型，也可以注册自定义节点后传入自定义类型
            x: 100, // 节点形状中心在x轴位置
            y: 100, // 节点形状中心在y轴的位置
            text: '里程数周期性维护', // 节点文本
            properties: { // 自定义属性，用于存储需要这个节点携带的信息，可以传入宽高以重设节点的宽高
              width: 100,
              height: 60,
            }
          },
          {
            id: 'o2',
            type: 'rect',
            x: 100,
            y: 200,
            text: '客户整改需求',
            properties: {
              width: 100,
              height: 50,
            }
          },
          {
            id: 'o3',
            type: 'rect',
            x: 100,
            y: 300,
            text: '故障报警',
            properties: {
              width: 100,
              height: 50,
            }
          },
          {
            id: 'o4',
            type: 'rect',
            x: 300,
            y: 250,
            text: '安排维修人员',
            properties: {
              width: 100,
              height: 50,
            }
          },
          {
            id: 'o5',
            type: 'rect',
            x: 500,
            y: 250,
            text: '检查现场情况',
            properties: {
              width: 100,
              height: 50,
            }
          },
          {
            id: 'o6',
            type: 'rect',
            x: 700,
            y: 250,
            text: '现场情况分析',
            properties: {
              width: 100,
              height: 50,
            }
          },
          {
            id: 'o7',
            type: 'rect',
            x: 900,
            y: 100,
            text: '设备维护',
            properties: {
              width: 100,
              height: 50,
            }
          },
          {
            id: 'o8',
            type: 'diamond',
            x: 900,
            y: 250,
            text: '是否存在故障',
            properties: { 
              width: 100,
              height: 50,
            }
          },
          {
            id: 'o9',
            type: 'diamond',
            x: 1100,
            y: 250,
            text: '是否需要返厂',
            properties: {
              width: 100,
              height: 50,
            }
          },
          {
            id: 'o10',
            type: 'rect',
            x: 1300,
            y: 100,
            text: '现场修',
            properties: {
              width: 100,
              height: 50,
            }
          },
          {
            id: 'o11',
            type: 'rect',
            x: 1300,
            y: 250, 
            text: '返厂修',
            properties: {
              width: 100,
              height: 50,
            }
          },
          {
            id: 'o12',
            type: 'diamond',
            x: 100,
            y: 450,
            text: '是否需要技术支持',
            properties: {
              width: 100,
              height: 50,
            }
          }
        ],
        // 边数据
        edges: [
          {
            id: 'rect-2-circle', // 边ID，性质与节点ID一样
            type: 'polyline', // 边类型
            sourceNodeId: 'o2', // 起始节点Id
            targetNodeId: 'o4', // 目标节点Id
          },
          {
            id: 'rect-3-circle', // 边ID，性质与节点ID一样
            type: 'polyline', // 边类型
            sourceNodeId: 'o3', // 起始节点Id
            targetNodeId: 'o4', // 目标节点Id
          },
          {
            id: 'rect-4-circle', // 边ID，性质与节点ID一样
            type: 'polyline', // 边类型
            sourceNodeId: 'o4', // 起始节点Id
            targetNodeId: 'o5', // 目标节点Id
          },
          {
            id: 'rect-5-circle', // 边ID，性质与节点ID一样
            type: 'polyline', // 边类型
            sourceNodeId: 'o5', // 起始节点Id
            targetNodeId: 'o6', // 目标节点Id
          },
          {
            id: 'rect-6-circle', // 边ID，性质与节点ID一样
            type: 'polyline', // 边类型
            sourceNodeId: 'o6', // 起始节点Id
            targetNodeId: 'o8', // 目标节点Id
          },
          {
            id: 'rect-7-circle', // 边ID，性质与节点ID一样
            type: 'polyline', // 边类型
            text: '否',
            sourceNodeId: 'o8', // 起始节点Id
            targetNodeId: 'o7', // 目标节点Id
          },
          {
            id: 'rect-8-circle', // 边ID，性质与节点ID一样
            type: 'polyline', // 边类型
            sourceNodeId: 'o1', // 起始节点Id
            targetNodeId: 'o7', // 目标节点Id
          },
          {
            id: 'rect-9-circle', // 边ID，性质与节点ID一样
            type: 'polyline', // 边类型
            sourceNodeId: 'o7', // 起始节点Id
            targetNodeId: 'o9', // 目标节点Id
          },
          {
            id: 'rect-10-circle', // 边ID，性质与节点ID一样
            type: 'polyline', // 边类型
            text: '是',
            sourceNodeId: 'o8', // 起始节点Id
            targetNodeId: 'o9', // 目标节点Id
          },
          {
            id: 'rect-11-circle', // 边ID，性质与节点ID一样
            type: 'line', // 边类型
            text: '否',
            sourceNodeId: 'o9', // 起始节点Id
            targetNodeId: 'o10', // 目标节点Id
          },
          {
            id: 'rect-12-circle', // 边ID，性质与节点ID一样
            type: 'polyline', // 边类型
            text: '是',
            sourceNodeId: 'o9', // 起始节点Id
            targetNodeId: 'o11', // 目标节点Id
          },
          {
            id: 'rect-13-circle', // 边ID，性质与节点ID一样
            type: 'polyline', // 边类型
            sourceNodeId: 'o10', // 起始节点Id
            targetNodeId: 'o12', // 目标节点Id
          },
          {
            id: 'rect-14-circle', // 边ID，性质与节点ID一样
            type: 'polyline', // 边类型
            sourceNodeId: 'o11', // 起始节点Id
            targetNodeId: 'o12', // 目标节点Id
          },
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
            fill: 'lightblue',
            stroke: '#000000',
            strokeWidth: 1,
          },
          diamond: {
            fill: 'lightblue',
            stroke: '#333333',
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
            type: 'operation'
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