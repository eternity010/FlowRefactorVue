/**
 * 采购环节各节点实现流程使用的资源数据
 * 简化版：仅包含资源属性和数量
 */

export const purchaseResources = {
  // 采购需求节点
  'p1': {
    // 文档资源
    documents: {
      count: 3,
      types: ['模板', '指南', '标准'],
      formats: ['excel', 'pdf', 'pdf']
    },
    // 人力资源
    personnel: {
      count: 2,
      roles: ['采购专员', '财务经理']
    },
    // 系统资源
    systems: {
      count: 2,
      types: ['需求管理系统', '预算审核系统']
    },
    // 其他资源
    others: {
      meetingRooms: 1,
      reviewSessions: 2
    }
  },
  
  // 供应商选择节点
  'p2': {
    documents: {
      count: 2,
      types: ['评估表', '选择标准'],
      formats: ['excel', 'pdf']
    },
    personnel: {
      count: 3,
      roles: ['采购经理', '供应商关系经理', '质量评估员']
    },
    systems: {
      count: 1,
      types: ['供应商管理系统']
    },
    others: {
      meetingRooms: 1,
      evaluationTools: 2
    }
  },
  
  // 价格审批节点
  'p3': {
    documents: {
      count: 2,
      types: ['价格申请表', '审批表'],
      formats: ['excel', 'pdf']
    },
    personnel: {
      count: 2,
      roles: ['财务经理', '采购总监']
    },
    systems: {
      count: 1,
      types: ['财务审批系统']
    },
    others: {
      approvalLevels: 2
    }
  },
  
  // 签订合同节点
  'p4': {
    documents: {
      count: 3,
      types: ['合同模板', '法律条款清单', '签约指南'],
      formats: ['word', 'pdf', 'pdf']
    },
    personnel: {
      count: 3,
      roles: ['法务专员', '采购经理', '供应商代表']
    },
    systems: {
      count: 1,
      types: ['合同管理系统']
    }
  },
  
  // 货物接收节点
  'p5': {
    documents: {
      count: 2,
      types: ['验收单', '入库单'],
      formats: ['pdf', 'pdf']
    },
    personnel: {
      count: 2,
      roles: ['仓储员', '质检员']
    },
    equipment: {
      count: 3,
      types: ['扫码枪', '叉车', '检测设备']
    }
  },
  
  // 质量检验节点
  'p6': {
    documents: {
      count: 2,
      types: ['检验标准', '不合格处理流程'],
      formats: ['pdf', 'pdf']
    },
    personnel: {
      count: 2,
      roles: ['质检员', '质量经理']
    },
    equipment: {
      count: 4,
      types: ['测量工具', '检测设备', '标准样品', '记录设备']
    }
  },
  
  // 入库节点
  'p7': {
    documents: {
      count: 1,
      types: ['入库记录表'],
      formats: ['excel']
    },
    personnel: {
      count: 1,
      roles: ['仓储员']
    },
    systems: {
      count: 1,
      types: ['库存管理系统']
    }
  },
  
  // 退回处理节点
  'p8': {
    documents: {
      count: 2,
      types: ['退货单', '质量问题记录表'],
      formats: ['pdf', 'excel']
    },
    personnel: {
      count: 2,
      roles: ['采购专员', '质检员']
    },
    systems: {
      count: 1,
      types: ['退货管理系统']
    }
  }
}; 