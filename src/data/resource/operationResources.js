/**
 * 运维环节节点资源信息
 * 包含运维环节各节点的基本资源数据
 */
 
// 运维环节节点ID和名称映射
export const operationNodesMap = {
  'o1': '里程数周期性维护',
  'o2': '客户整改需求',
  'o3': '故障报警',
  'o4': '安排维修人员',
  'o5': '检查现场情况',
  'o6': '现场情况分析',
  'o7': '设备维护',
  'o8': '是否存在故障',
  'o9': '是否需要返厂',
  'o10': '现场修',
  'o11': '返厂修',
  'o12': '是否需要技术支持'
};
 
// 运维环节的节点资源信息
export const operationResources = {
  // 里程数周期性维护
  'o1': {
    // 文档资源
    documents: {
      count: 3,
      types: ['维护手册', '操作规程', '检查表'],
      formats: ['pdf', 'pdf', 'excel']
    },
    // 人力资源
    personnel: {
      count: 2,
      roles: ['设备工程师', '维护技术员']
    },
    // 系统资源
    systems: {
      count: 2,
      types: ['设备管理系统', '维护追踪系统']
    },
    // 设备资源
    equipment: {
      count: 3,
      types: ['诊断工具', '测量仪器', '专用维修工具']
    }
  },
  
  // 客户整改需求
  'o2': {
    documents: {
      count: 2,
      types: ['整改需求单', '客户反馈表'],
      formats: ['pdf', 'excel']
    },
    personnel: {
      count: 2,
      roles: ['客户经理', '运维专员']
    },
    systems: {
      count: 1,
      types: ['客户关系管理系统']
    }
  },
  
  // 故障报警
  'o3': {
    documents: {
      count: 2,
      types: ['故障报告单', '紧急响应流程'],
      formats: ['pdf', 'pdf']
    },
    personnel: {
      count: 2,
      roles: ['监控员', '运维主管']
    },
    systems: {
      count: 2,
      types: ['报警监控系统', '故障分类系统']
    },
    equipment: {
      count: 1,
      types: ['故障报警器']
    }
  },
  
  // 安排维修人员
  'o4': {
    documents: {
      count: 2,
      types: ['人员排班表', '技能矩阵'],
      formats: ['excel', 'pdf']
    },
    personnel: {
      count: 3,
      roles: ['运维经理', '调度员', '维修工程师']
    },
    systems: {
      count: 1,
      types: ['人员调度系统']
    }
  },
  
  // 检查现场情况
  'o5': {
    documents: {
      count: 2,
      types: ['现场勘查表', '设备布局图'],
      formats: ['pdf', 'cad']
    },
    personnel: {
      count: 2,
      roles: ['现场工程师', '安全检查员']
    },
    equipment: {
      count: 2,
      types: ['检测设备', '记录工具']
    }
  },
  
  // 现场情况分析
  'o6': {
    documents: {
      count: 3,
      types: ['问题分析表', '历史故障记录', '设备说明书'],
      formats: ['excel', 'pdf', 'pdf']
    },
    personnel: {
      count: 2,
      roles: ['技术专家', '资深工程师']
    },
    equipment: {
      count: 2,
      types: ['分析工具', '测试设备']
    }
  },
  
  // 设备维护
  'o7': {
    documents: {
      count: 3,
      types: ['维护手册', '维护记录表', '设备参数表'],
      formats: ['pdf', 'excel', 'pdf']
    },
    personnel: {
      count: 2,
      roles: ['维修技师', '质量控制员']
    },
    equipment: {
      count: 4,
      types: ['常规工具', '专用工具', '润滑设备', '清洁工具']
    }
  },
  
  // 是否存在故障
  'o8': {
    documents: {
      count: 2,
      types: ['故障判断标准', '决策流程'],
      formats: ['pdf', 'pdf']
    },
    personnel: {
      count: 1,
      roles: ['技术主管']
    },
    systems: {
      count: 1,
      types: ['决策支持系统']
    }
  },
  
  // 是否需要返厂
  'o9': {
    documents: {
      count: 2,
      types: ['返厂评估表', '维修能力清单'],
      formats: ['pdf', 'excel']
    },
    personnel: {
      count: 2,
      roles: ['技术总监', '采购专员']
    },
    systems: {
      count: 1,
      types: ['供应商管理系统']
    }
  },
  
  // 现场修
  'o10': {
    documents: {
      count: 2,
      types: ['现场维修指南', '备件清单'],
      formats: ['pdf', 'excel']
    },
    personnel: {
      count: 2,
      roles: ['现场维修工程师', '备件管理员']
    },
    equipment: {
      count: 3,
      types: ['维修工具套装', '测试仪器', '备件箱']
    }
  },
  
  // 返厂修
  'o11': {
    documents: {
      count: 3,
      types: ['返厂申请单', '运输指南', '设备交接表'],
      formats: ['pdf', 'pdf', 'excel']
    },
    personnel: {
      count: 2,
      roles: ['物流专员', '维修协调员']
    },
    systems: {
      count: 1,
      types: ['物流追踪系统']
    }
  },
  
  // 是否需要技术支持
  'o12': {
    documents: {
      count: 2,
      types: ['技术支持申请表', '问题描述模板'],
      formats: ['pdf', 'word']
    },
    personnel: {
      count: 2,
      roles: ['技术支持专员', '研发工程师']
    },
    systems: {
      count: 1,
      types: ['知识库系统']
    }
  }
}; 