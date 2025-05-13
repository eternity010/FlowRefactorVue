<template>
  <div class="node-detail-info-container">
    <div class="header">
      <el-page-header @back="goBack" :content="title" />
    </div>
    
    <div class="content">
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <span>节点资源信息</span>
            <el-tag size="medium" :type="getTagType()">{{ getFlowTypeName() }}</el-tag>
          </div>
        </template>
        
        <div class="basic-info">
          <div class="info-item">
            <span class="label">节点ID：</span>
            <span class="value">{{ nodeId }}</span>
          </div>
          <div class="info-item">
            <span class="label">节点名称：</span>
            <span class="value">{{ nodeName }}</span>
          </div>
        </div>
        
        <el-divider content-position="left">资源统计</el-divider>
        
        <!-- 资源统计部分 -->
        <div v-if="resourcesData && resourcesData.resources" class="resources-section">
          <div class="resource-stats">
            <el-row :gutter="20">
              <el-col :span="6" v-for="(value, key) in resourcesData.resources" :key="key">
                <el-card shadow="hover" class="resource-card">
                  <div class="resource-type">{{ formatResourceType(key) }}</div>
                  <div class="resource-count">{{ value }}</div>
                </el-card>
              </el-col>
            </el-row>
          </div>
          
          <!-- 资源统计图表 -->
          <div class="chart-container" ref="resourceChart"></div>
        </div>
        
        <div v-else class="empty-resources">
          <el-empty description="暂无资源信息"></el-empty>
        </div>
        
        <el-divider content-position="left">属性列表</el-divider>
        
        <!-- 属性列表部分 -->
        <div v-if="resourcesData && resourcesData.attributes && resourcesData.attributes.length" class="attributes-section">
          <el-table
            :data="attributesTableData"
            stripe
            style="width: 100%">
            <el-table-column
              prop="index"
              label="序号"
              width="80">
            </el-table-column>
            <el-table-column
              prop="name"
              label="属性名称">
            </el-table-column>
          </el-table>
        </div>
        
        <div v-else class="empty-attributes">
          <el-empty description="暂无属性信息"></el-empty>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { getNodeResources } from '@/data/resource';

export default {
  name: 'NodeResourceDetailView',
  data() {
    return {
      nodeId: '',
      nodeName: '',
      nodeType: '',
      title: '节点资源详情',
      resourcesData: null,
      resourceChart: null
    }
  },
  computed: {
    attributesTableData() {
      if (!this.resourcesData || !this.resourcesData.attributes) {
        return [];
      }
      
      return this.resourcesData.attributes.map((attr, index) => {
        return {
          index: index + 1,
          name: attr
        };
      });
    }
  },
  created() {
    // 从路由参数获取节点信息
    this.nodeId = this.$route.query.id || '';
    this.nodeName = this.$route.query.name || '未知节点';
    this.nodeType = this.$route.query.type || '';
    
    // 获取节点资源数据
    this.loadResourcesData();
  },
  mounted() {
    this.$nextTick(() => {
      if (this.resourcesData && this.resourcesData.resources) {
        this.initResourceChart();
      }
    });
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    loadResourcesData() {
      this.resourcesData = getNodeResources(this.nodeType, this.nodeId);
      if (!this.resourcesData) {
        console.warn(`未找到节点 ${this.nodeId} 的资源数据`);
      }
    },
    getFlowTypeName() {
      // 将流程类型转换为中文名称
      const typeMap = {
        'operation': '运维环节',
        'purchase': '采购环节',
        'production': '生产环节',
        'marketing': '营销环节'
      };
      return typeMap[this.nodeType] || '未知环节';
    },
    getTagType() {
      // 根据环节类型返回标签类型
      const typeMap = {
        'operation': 'info',
        'purchase': 'warning',
        'production': 'success',
        'marketing': 'danger'
      };
      return typeMap[this.nodeType] || 'info';
    },
    formatResourceType(type) {
      // 格式化资源类型名称
      const typeMap = {
        'forms': '表单',
        'templates': '模板',
        'guidelines': '指南',
        'systems': '系统',
        'databases': '数据库',
        'evaluationTools': '评估工具',
        'approvalSystems': '审批系统',
        'priceDatabase': '价格库',
        'contractTemplates': '合同模板',
        'legalDatabase': '法律库',
        'receiptForms': '接收表',
        'inventorySystems': '库存系统',
        'inspectionForms': '检验表',
        'qualityStandards': '质量标准',
        'testingEquipment': '测试设备',
        'storageForms': '入库表',
        'returnForms': '退回表',
        'processingGuidelines': '处理指南'
      };
      return typeMap[type] || type;
    },
    initResourceChart() {
      // 初始化资源统计图表
      if (this.$refs.resourceChart) {
        this.resourceChart = echarts.init(this.$refs.resourceChart);
        
        const resources = this.resourcesData.resources;
        const data = Object.keys(resources).map(key => {
          return {
            name: this.formatResourceType(key),
            value: resources[key]
          };
        });
        
        const option = {
          title: {
            text: '资源分布',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: data.map(item => item.name)
          },
          series: [
            {
              name: '资源数量',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: data,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        
        this.resourceChart.setOption(option);
      }
    }
  },
  beforeDestroy() {
    if (this.resourceChart) {
      this.resourceChart.dispose();
    }
  }
}
</script>

<style scoped>
.node-detail-info-container {
  padding: 20px;
  height: 100%;
}

.header {
  margin-bottom: 20px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.basic-info {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  margin-bottom: 15px;
}

.label {
  font-weight: bold;
  width: 100px;
}

.value {
  flex: 1;
}

.resources-section {
  margin-bottom: 30px;
}

.resource-stats {
  margin-bottom: 20px;
}

.resource-card {
  text-align: center;
  padding: 10px;
  margin-bottom: 15px;
}

.resource-type {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.resource-count {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.chart-container {
  height: 300px;
  margin-top: 20px;
}

.empty-resources,
.empty-attributes {
  margin: 30px 0;
}

.attributes-section {
  margin-top: 20px;
}
</style> 