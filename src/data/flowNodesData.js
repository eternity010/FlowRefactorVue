/**
 * 子流程节点详细信息数据
 * 按照流程类型(运维、采购、生产、营销)组织
 */

export const flowNodesData = {
  // 运维环节节点数据
  operation: {
    '101': {
      title: '里程数周期性维护',
      description: '根据设备运行里程数达到特定值时进行的计划性维护工作',
      responsibleDept: '设备维护部',
      cycleTime: '每5000小时或每季度',
      riskLevel: '中',
      // 更多字段可以根据需要添加
    },
    '102': {
      title: '客户整改需求',
      description: '响应客户提出的设备或服务改进需求',
      responsibleDept: '客户服务部',
      cycleTime: '根据合同约定',
      riskLevel: '低',
    },
    '103': {
      title: '故障报警',
      description: '设备监控系统发出的故障警报',
      responsibleDept: '监控中心',
      cycleTime: '实时',
      riskLevel: '高',
    },
    '104': {
      title: '安排维修人员',
      description: '根据故障类型分配合适的维修人员',
      responsibleDept: '维修调度中心',
      cycleTime: '2小时内',
      riskLevel: '中',
    },
    // 其他运维节点数据...
    '105': {
      title: '检查现场情况',
      description: '维修人员到达现场后的初步检查',
      responsibleDept: '现场维修组',
      cycleTime: '1小时内',
      riskLevel: '中',
    },
    '106': {
      title: '现场情况分析',
      description: '对故障原因进行专业分析',
      responsibleDept: '技术分析组',
      cycleTime: '2小时内',
      riskLevel: '中',
    },
    '107': {
      title: '设备维护',
      description: '对设备进行日常维护和保养',
      responsibleDept: '设备维护部',
      cycleTime: '按计划',
      riskLevel: '低',
    },
    '108': {
      title: '是否存在故障',
      description: '判断设备是否存在需要维修的故障',
      responsibleDept: '质检部',
      cycleTime: '30分钟内',
      riskLevel: '中',
    },
    '109': {
      title: '是否需要返厂',
      description: '评估故障是否需要返厂维修',
      responsibleDept: '技术部',
      cycleTime: '1小时内',
      riskLevel: '高',
    },
    '110': {
      title: '现场修',
      description: '在设备所在现场进行维修',
      responsibleDept: '现场维修组',
      cycleTime: '4-8小时',
      riskLevel: '中',
    },
    '111': {
      title: '返厂修',
      description: '将设备送回工厂进行维修',
      responsibleDept: '返修中心',
      cycleTime: '3-7天',
      riskLevel: '高',
    },
    '112': {
      title: '是否需要技术支持',
      description: '评估是否需要更高级别的技术支持',
      responsibleDept: '技术支持部',
      cycleTime: '2小时内',
      riskLevel: '中',
    }
  },

  // 采购环节节点数据
  purchase: {
    'p1': {
      title: '采购需求',
      description: '接收并确认内部采购需求',
      responsibleDept: '采购部',
      cycleTime: '1-3天',
      riskLevel: '低',
    },
    'p2': {
      title: '供应商选择',
      description: '筛选和评估潜在供应商',
      responsibleDept: '采购部',
      cycleTime: '3-7天',
      riskLevel: '中',
    },
    'p3': {
      title: '价格审批',
      description: '对采购价格进行内部审批',
      responsibleDept: '财务部',
      cycleTime: '1-2天',
      riskLevel: '中',
    },
    'p4': {
      title: '签订合同',
      description: '与供应商签订采购合同',
      responsibleDept: '法务部',
      cycleTime: '1-3天',
      riskLevel: '中',
    },
    'p5': {
      title: '货物接收',
      description: '接收供应商送达的货物',
      responsibleDept: '仓储部',
      cycleTime: '按合同',
      riskLevel: '低',
    },
    'p6': {
      title: '质量检验',
      description: '对收到的货物进行质量检验',
      responsibleDept: '质检部',
      cycleTime: '1-2天',
      riskLevel: '高',
    },
    'p7': {
      title: '入库',
      description: '将合格货物办理入库手续',
      responsibleDept: '仓储部',
      cycleTime: '1天内',
      riskLevel: '低',
    },
    'p8': {
      title: '退回处理',
      description: '处理不合格货物的退回流程',
      responsibleDept: '采购部',
      cycleTime: '3-7天',
      riskLevel: '中',
    }
  },

  // 生产环节节点数据
  production: {
    'prod1': {
      title: '生产计划制定',
      description: '根据订单制定生产计划',
      responsibleDept: '生产计划部',
      cycleTime: '1-2天',
      riskLevel: '中',
    },
    'prod2': {
      title: '原材料准备',
      description: '准备生产所需的原材料',
      responsibleDept: '物料部',
      cycleTime: '1-3天',
      riskLevel: '中',
    },
    'prod3': {
      title: '材料质检',
      description: '对生产原材料进行质量检验',
      responsibleDept: '质检部',
      cycleTime: '4-8小时',
      riskLevel: '高',
    },
    'prod4': {
      title: '生产加工',
      description: '执行产品生产加工工序',
      responsibleDept: '生产部',
      cycleTime: '1-5天',
      riskLevel: '中',
    },
    'prod5': {
      title: '产品质检',
      description: '对生产完成的产品进行质量检验',
      responsibleDept: '质检部',
      cycleTime: '1天',
      riskLevel: '高',
    },
    'prod6': {
      title: '包装入库',
      description: '对合格产品进行包装并入库',
      responsibleDept: '包装部',
      cycleTime: '1天',
      riskLevel: '低',
    },
    'prod7': {
      title: '返回处理',
      description: '对不合格原材料进行返工或退回处理',
      responsibleDept: '物料部',
      cycleTime: '1-3天',
      riskLevel: '中',
    },
    'prod8': {
      title: '不良品处理',
      description: '对不合格产品进行返工或报废处理',
      responsibleDept: '质检部',
      cycleTime: '1-2天',
      riskLevel: '中',
    }
  },

  // 营销环节节点数据
  marketing: {
    'm1': {
      title: '市场调研',
      description: '收集和分析市场数据',
      responsibleDept: '市场部',
      cycleTime: '2-4周',
      riskLevel: '中',
    },
    'm2': {
      title: '策略制定',
      description: '制定营销策略和计划',
      responsibleDept: '市场部',
      cycleTime: '1-2周',
      riskLevel: '高',
    },
    'm3': {
      title: '渠道开发',
      description: '开发和维护营销渠道',
      responsibleDept: '销售部',
      cycleTime: '2-4周',
      riskLevel: '高',
    },
    'm4': {
      title: '线上推广',
      description: '进行网络和社交媒体推广',
      responsibleDept: '数字营销部',
      cycleTime: '持续进行',
      riskLevel: '中',
    },
    'm5': {
      title: '线下推广',
      description: '进行线下活动和广告推广',
      responsibleDept: '品牌推广部',
      cycleTime: '按计划',
      riskLevel: '中',
    },
    'm6': {
      title: '效果评估',
      description: '评估营销活动的效果',
      responsibleDept: '市场分析部',
      cycleTime: '1-2周',
      riskLevel: '中',
    },
    'm7': {
      title: '调整优化',
      description: '根据评估结果调整营销策略',
      responsibleDept: '市场部',
      cycleTime: '1周',
      riskLevel: '中',
    }
  }
};

/**
 * 获取节点详细信息的工具函数
 * @param {string} type 流程类型：operation, purchase, production, marketing
 * @param {string} nodeId 节点ID
 * @returns {object|null} 节点详细信息或null
 */
export function getNodeDetails(type, nodeId) {
  if (!flowNodesData[type] || !flowNodesData[type][nodeId]) {
    return null;
  }
  return flowNodesData[type][nodeId];
} 