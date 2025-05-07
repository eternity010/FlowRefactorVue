<template>
    <div class="g6-container">
      <h3>Vue2 G6 流程图示例</h3>
      <div id="g6-canvas"></div>
    </div>
  </template>
  
  <script>
  import G6 from '@antv/g6';
  
  export default {
    name: 'G6Demo',
    data() {
      return {
        graph: null
      };
    },
    mounted() {
      this.initGraph();
      window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
      if (this.graph) {
        this.graph.destroy();
      }
      window.removeEventListener('resize', this.handleResize);
    },
    methods: {
      initGraph() {
        // 配置项
        const config = {
          container: 'g6-canvas',
          width: document.getElementById('g6-canvas')?.clientWidth || 800,
          height: document.getElementById('g6-canvas')?.clientHeight || 600,
          fitView: true,
          fitViewPadding: 30,
          modes: {
            default: ['drag-canvas', 'zoom-canvas', 'drag-node', 'click-select']
          },
          defaultNode: {
            type: 'circle',
            size: 40,
            style: {
              fill: '#6FB3D2',
              stroke: '#3B7E9A',
              lineWidth: 2
            },
            labelCfg: {
              position: 'center',
              style: {
                fill: '#fff',
                fontSize: 14
              }
            }
          },
          defaultEdge: {
            type: 'line',
            style: {
              stroke: '#A3B1BF',
              lineWidth: 2,
              endArrow: {
                path: 'M 0,0 L 8,4 L 8,-4 Z',
                fill: '#A3B1BF'
              }
            }
          },
          layout: {
            type: 'grid',
            cols: 3,
            preventOverlap: true,
            nodeSize: 40
          }
        };
  
        // 初始化图表
        this.graph = new G6.Graph(config);
  
        // 数据源
        const data = {
          nodes: [
            { id: 'start', label: '开始' },
            { id: 'process1', label: '流程1' },
            { id: 'process2', label: '流程2' },
            { id: 'decision', label: '判断' },
            { id: 'process3', label: '流程3' },
            { id: 'end', label: '结束' }
          ],
          edges: [
            { source: 'start', target: 'process1' },
            { source: 'process1', target: 'process2' },
            { source: 'process2', target: 'decision' },
            { source: 'decision', target: 'process3', label: '是' },
            { source: 'decision', target: 'end', label: '否' },
            { source: 'process3', target: 'end' }
          ]
        };
  
        // 渲染图表
        this.graph.data(data);
        this.graph.render();
        this.graph.fitView();
      },
      handleResize() {
        if (this.graph) {
          const container = document.getElementById('g6-canvas');
          this.graph.changeSize(
            container.clientWidth,
            container.clientHeight
          );
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .g6-container {
    padding: 20px;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
  
  #g6-canvas {
    flex: 1;
    width: 100%;
    border: 1px solid #ebedf0;
    border-radius: 4px;
    background: #fafafa;
  }
  </style>