// 节点风险数据
export const nodeRiskData = {
  // 采购环节
  purchase: {
    highRisk: {
      count: 3,
      title: '高风险节点',
      color: '#f5222d',
      bgColor: '#fff1f0',
      icon: 'el-icon-warning-outline',
      nodes: ['供应商选择', '价格谈判', '合同签署']
    },
    mediumRisk: {
      count: 5,
      title: '中风险节点',
      color: '#fa8c16', 
      bgColor: '#fff7e6',
      icon: 'el-icon-warning',
      nodes: ['需求确认', '采购申请', '供应商评估', '交付跟进', '质量检验']
    },
    normal: {
      count: 12,
      title: '正常节点',
      color: '#52c41a',
      bgColor: '#f6ffed',
      icon: 'el-icon-success',
      nodes: []
    },
    total: 20
  },
  
  // 生产环节
  production: {
    highRisk: {
      count: 2,
      title: '高风险节点',
      color: '#f5222d',
      bgColor: '#fff1f0',
      icon: 'el-icon-warning-outline',
      nodes: ['设备故障', '质量控制']
    },
    mediumRisk: {
      count: 4,
      title: '中风险节点',
      color: '#fa8c16',
      bgColor: '#fff7e6', 
      icon: 'el-icon-warning',
      nodes: ['生产计划', '人员调度', '物料配送', '进度监控']
    },
    normal: {
      count: 14,
      title: '正常节点',
      color: '#52c41a',
      bgColor: '#f6ffed',
      icon: 'el-icon-success',
      nodes: []
    },
    total: 20
  },
  
  // 营销环节
  marketing: {
    highRisk: {
      count: 4,
      title: '高风险节点',
      color: '#f5222d',
      bgColor: '#fff1f0',
      icon: 'el-icon-warning-outline',
      nodes: ['市场分析', '竞争对手', '定价策略', '渠道管理']
    },
    mediumRisk: {
      count: 6,
      title: '中风险节点',
      color: '#fa8c16',
      bgColor: '#fff7e6',
      icon: 'el-icon-warning',
      nodes: ['客户开发', '产品推广', '销售预测', '客户满意度', '合同管理', '回款跟进']
    },
    normal: {
      count: 10,
      title: '正常节点',
      color: '#52c41a',
      bgColor: '#f6ffed',
      icon: 'el-icon-success',
      nodes: []
    },
    total: 20
  },
  
  // 运营环节
  operation: {
    highRisk: {
      count: 1,
      title: '高风险节点',
      color: '#f5222d',
      bgColor: '#fff1f0',
      icon: 'el-icon-warning-outline',
      nodes: ['系统故障']
    },
    mediumRisk: {
      count: 3,
      title: '中风险节点',
      color: '#fa8c16',
      bgColor: '#fff7e6',
      icon: 'el-icon-warning',
      nodes: ['数据备份', '权限管理', '流程优化']
    },
    normal: {
      count: 16,
      title: '正常节点',
      color: '#52c41a',
      bgColor: '#f6ffed',
      icon: 'el-icon-success',
      nodes: []
    },
    total: 20
  }
};
