<template>
    <div class="container" ref="container"></div>
  </template>
  
  <script>
    import LogicFlow from "@logicflow/core";
    import "@logicflow/core/lib/style/index.css";
  
    export default {
      name: 'lf-Demo',
      data() {
        return {
          renderData: {
            // 节点数据
            nodes: [
              {
                id: '101', // 节点ID，需要全局唯一，不传入内部会自动生成一个ID
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
                id: '102',
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
                id: '103',
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
                id: '104',
                type: 'rect',
                x: 300,
                y: 250,
                text: '安排维修人员',
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
                sourceNodeId: '102', // 起始节点Id
                targetNodeId: '104', // 目标节点Id
              },
              {
                id: 'rect-2-circle', // 边ID，性质与节点ID一样
                type: 'polyline', // 边类型
                sourceNodeId: '103', // 起始节点Id
                targetNodeId: '104', // 目标节点Id
              }
            ],
          }
        }
      },
      mounted() {
        this.lf = new LogicFlow({
          container: this.$refs.container,
          grid: true,
          style: {
            rect: {
              fill: 'lightskyblue',
              stroke: '#_000000_', // 您可以根据需要修改边框颜色
              strokeWidth: 1,
            },
            // 如果您有其他类型的节点，也可以在这里为它们设置默认样式
            // circle: {
            //   fill: 'lightgreen',
            //   stroke: '#_333333_',
            // }
          }
        });
        this.lf.render(this.renderData);

        // 监听节点点击事件
        this.lf.on('node:click', ({ data }) => {
          // data 对象包含了被点击节点的信息
          console.log('节点被点击:', data);
          // 在这里实现您的弹窗逻辑
          // 例如，显示一个简单的 alert
          alert(`节点 ${data.id} 被点击！\n文本内容: ${data.text}\n自定义属性: ${JSON.stringify(data.properties)}`);

          // 如果您使用UI库（如Element UI, Vuetify, Ant Design Vue等），
          // 您可以在这里调用相应的弹窗组件API，并将节点数据传递给弹窗组件。
          // 例如 (假设您有一个名为 myDialog 的弹窗组件的引用，并且它有一个 open 方法):
          // this.$refs.myDialog.open(data);
        });
      },
    };
  </script>
  
  <style scoped>
    .container {
      width: 1000px;
      height: 500px;
    }
  </style>