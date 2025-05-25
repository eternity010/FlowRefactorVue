/**
 * 运维环节节点资源详细信息
 * 包含运维环节各节点的详细资源数据
 */

// 运维环节的节点资源详情
const operationResourceDetails = {
  // 里程数周期性维护节点
  'o1': {
    documents: {
      items: [
        { name: '设备维护手册', type: '技术文档', format: 'PDF', lastUpdate: '2023-11-15', size: '4.2MB', description: '设备维护的详细指导手册' },
        { name: '周期性维护规程', type: '操作指南', format: 'PDF', lastUpdate: '2023-11-10', size: '2.8MB', description: '里程数周期性维护的标准操作流程' },
        { name: '维护记录表', type: '表格文档', format: 'XLSX', lastUpdate: '2023-11-18', size: '1.5MB', description: '设备维护记录的电子表格' }
      ]
    },
    personnel: {
      items: [
        { name: '王维修', role: '设备工程师', department: '运维部', contact: '13900139001', responsibility: '负责设备维护的技术指导和问题排查' },
        { name: '李技术', role: '维护技术员', department: '运维部', contact: '13900139002', responsibility: '执行里程数周期性维护工作' }
      ]
    },
    systems: {
      items: [
        { name: '设备管理系统', type: '业务系统', version: 'v3.5', access: 'http://erp.company.com/equipment', description: '管理设备信息和维护计划' },
        { name: '维护追踪系统', type: '运维系统', version: 'v2.1', access: 'http://erp.company.com/maintenance', description: '记录和追踪维护进度和历史' }
      ]
    },
    equipment: {
      items: [
        { name: '多功能诊断仪', type: '诊断工具', model: 'DT2000', status: '正常', location: '维修车间', description: '用于诊断设备运行状态' },
        { name: '精密测量仪', type: '测量设备', model: 'PM500', status: '正常', location: '维修车间', description: '测量设备关键部件参数' },
        { name: '专业维修工具套装', type: '维修工具', model: 'TS100', status: '正常', location: '工具室', description: '用于设备拆装和维修的专用工具' }
      ]
    }
  },
  
  // 客户整改需求
  'o2': {
    documents: {
      items: [
        { name: '客户整改需求表', type: '业务表单', format: 'PDF', lastUpdate: '2023-11-12', size: '2.1MB', description: '记录客户提出的整改需求详情' },
        { name: '客户反馈记录表', type: '客户服务', format: 'XLSX', lastUpdate: '2023-11-20', size: '1.8MB', description: '客户反馈意见和建议的汇总表格' }
      ]
    },
    personnel: {
      items: [
        { name: '张客服', role: '客户经理', department: '客户服务部', contact: '13900139003', responsibility: '负责客户关系维护和需求收集' },
        { name: '刘运维', role: '运维专员', department: '运维部', contact: '13900139004', responsibility: '评估客户整改需求的技术可行性' }
      ]
    },
    systems: {
      items: [
        { name: '客户关系管理系统', type: '业务系统', version: 'v4.2', access: 'http://crm.company.com', description: '管理客户信息和服务跟踪' }
      ]
    }
  },
  
  // 故障报警
  'o3': {
    documents: {
      items: [
        { name: '故障报告单模板', type: '业务表单', format: 'PDF', lastUpdate: '2023-10-25', size: '1.5MB', description: '记录故障详情的标准表单' },
        { name: '紧急响应流程指南', type: '操作手册', format: 'PDF', lastUpdate: '2023-09-30', size: '3.2MB', description: '针对不同级别故障的响应流程' }
      ]
    },
    personnel: {
      items: [
        { name: '赵监控', role: '监控员', department: '运维中心', contact: '13900139005', responsibility: '24小时监控系统运行状态，及时处理告警信息' },
        { name: '钱主管', role: '运维主管', department: '运维部', contact: '13900139006', responsibility: '评估故障等级并协调处理资源' }
      ]
    },
    systems: {
      items: [
        { name: '报警监控系统', type: '运维系统', version: 'v5.1', access: 'http://monitor.company.com', description: '实时监控设备状态并发出告警' },
        { name: '故障分类系统', type: '辅助系统', version: 'v2.3', access: 'http://faults.company.com', description: '对故障进行分类和严重程度评估' }
      ]
    },
    equipment: {
      items: [
        { name: '故障报警终端', type: '监控设备', model: 'AL300', status: '正常', location: '控制室', description: '接收和显示设备故障报警信息' }
      ]
    }
  },
  
  // 安排维修人员
  'o4': {
    documents: {
      items: [
        { name: '技术人员排班表', type: '管理文档', format: 'XLSX', lastUpdate: '2023-11-21', size: '1.2MB', description: '维修人员的排班安排' },
        { name: '技能矩阵评估表', type: '人力资源', format: 'PDF', lastUpdate: '2023-10-15', size: '2.5MB', description: '维修人员技能评估矩阵' }
      ]
    },
    personnel: {
      items: [
        { name: '孙经理', role: '运维经理', department: '运维部', contact: '13900139007', responsibility: '负责维修团队管理和任务分配' },
        { name: '周调度', role: '调度员', department: '运维中心', contact: '13900139008', responsibility: '根据故障类型和技能匹配分配维修人员' },
        { name: '吴工程师', role: '维修工程师', department: '运维部', contact: '13900139009', responsibility: '执行现场维修任务' }
      ]
    },
    systems: {
      items: [
        { name: '人员调度系统', type: '管理系统', version: 'v3.0', access: 'http://dispatch.company.com', description: '管理维修人员资源和调度安排' }
      ]
    }
  },
  
  // 检查现场情况
  'o5': {
    documents: {
      items: [
        { name: '现场勘查记录表', type: '业务表单', format: 'PDF', lastUpdate: '2023-10-20', size: '1.8MB', description: '记录现场设备状态和环境条件' },
        { name: '设备布局CAD图', type: '技术图纸', format: 'DWG', lastUpdate: '2023-08-15', size: '5.2MB', description: '详细的设备安装布局图' }
      ]
    },
    personnel: {
      items: [
        { name: '郑工程', role: '现场工程师', department: '运维部', contact: '13900139010', responsibility: '负责现场勘查和初步问题诊断' },
        { name: '王安全', role: '安全检查员', department: '安全部', contact: '13900139011', responsibility: '确保维修作业符合安全规范' }
      ]
    },
    equipment: {
      items: [
        { name: '便携式检测设备', type: '检测工具', model: 'PT200', status: '正常', location: '工具室', description: '用于现场参数检测' },
        { name: '高清记录设备', type: '记录工具', model: 'RC100', status: '正常', location: '设备仓库', description: '记录现场状况和问题点' }
      ]
    }
  },
  
  // 现场情况分析
  'o6': {
    documents: {
      items: [
        { name: '故障分析表', type: '技术文档', format: 'XLSX', lastUpdate: '2023-11-05', size: '2.3MB', description: '记录问题现象、原因分析和解决方案' },
        { name: '历史故障记录库', type: '知识库', format: 'PDF', lastUpdate: '2023-10-10', size: '8.5MB', description: '汇总历史故障案例和解决方案' },
        { name: '设备技术说明书', type: '技术文档', format: 'PDF', lastUpdate: '2023-07-20', size: '12.5MB', description: '设备厂商提供的技术规格和操作指南' }
      ]
    },
    personnel: {
      items: [
        { name: '李专家', role: '技术专家', department: '技术支持部', contact: '13900139012', responsibility: '提供专业技术分析和解决方案' },
        { name: '陈工程师', role: '资深工程师', department: '运维部', contact: '13900139013', responsibility: '现场问题诊断和分析' }
      ]
    },
    equipment: {
      items: [
        { name: '故障分析仪', type: '分析工具', model: 'FA500', status: '正常', location: '技术部', description: '用于深入分析设备故障原因' },
        { name: '参数测试仪', type: '测试设备', model: 'TS300', status: '正常', location: '维修车间', description: '测试设备运行参数是否符合标准' }
      ]
    }
  },
  
  // 设备维护
  'o7': {
    documents: {
      items: [
        { name: '设备维护指南', type: '技术文档', format: 'PDF', lastUpdate: '2023-11-08', size: '5.6MB', description: '详细的设备维护步骤和标准' },
        { name: '日常维护记录表', type: '业务表单', format: 'XLSX', lastUpdate: '2023-11-22', size: '1.9MB', description: '记录日常维护工作和发现的问题' },
        { name: '设备参数标准表', type: '参考文档', format: 'PDF', lastUpdate: '2023-09-15', size: '2.2MB', description: '各类设备的标准参数范围' }
      ]
    },
    personnel: {
      items: [
        { name: '马技师', role: '维修技师', department: '运维部', contact: '13900139014', responsibility: '执行设备维护和保养工作' },
        { name: '黄质检', role: '质量控制员', department: '质量部', contact: '13900139015', responsibility: '检查维护工作质量和效果' }
      ]
    },
    equipment: {
      items: [
        { name: '通用维修工具箱', type: '常规工具', model: 'TK100', status: '正常', location: '工具室', description: '日常维修所需的基本工具' },
        { name: '专用维修工具', type: '专用工具', model: 'SK200', status: '正常', location: '工具室', description: '特定设备维修的专用工具' },
        { name: '自动润滑设备', type: '润滑设备', model: 'LB150', status: '正常', location: '维修车间', description: '用于设备关键部位的润滑' },
        { name: '工业吸尘器', type: '清洁工具', model: 'VC300', status: '正常', location: '清洁间', description: '用于设备清洁和环境维护' }
      ]
    }
  },
  
  // 是否存在故障
  'o8': {
    documents: {
      items: [
        { name: '故障判断标准手册', type: '技术文档', format: 'PDF', lastUpdate: '2023-10-05', size: '3.8MB', description: '各类故障的判断标准和方法' },
        { name: '故障决策流程图', type: '流程文档', format: 'PDF', lastUpdate: '2023-09-20', size: '1.5MB', description: '故障判断和处理的决策流程' }
      ]
    },
    personnel: {
      items: [
        { name: '朱主管', role: '技术主管', department: '运维部', contact: '13900139016', responsibility: '负责最终故障判定和处理方案决策' }
      ]
    },
    systems: {
      items: [
        { name: '故障决策支持系统', type: '辅助系统', version: 'v2.5', access: 'http://decision.company.com', description: '基于历史数据辅助故障判断和决策' }
      ]
    }
  },
  
  // 是否需要返厂
  'o9': {
    documents: {
      items: [
        { name: '返厂维修评估表', type: '业务表单', format: 'PDF', lastUpdate: '2023-10-12', size: '2.1MB', description: '评估设备是否需要返厂维修的标准表单' },
        { name: '现场维修能力清单', type: '参考文档', format: 'XLSX', lastUpdate: '2023-09-10', size: '1.6MB', description: '列出现场可处理的维修类型和范围' }
      ]
    },
    personnel: {
      items: [
        { name: '冯总监', role: '技术总监', department: '技术部', contact: '13900139017', responsibility: '评估技术难度并决定是否需要返厂' },
        { name: '董采购', role: '采购专员', department: '采购部', contact: '13900139018', responsibility: '负责返厂维修的合同和物流安排' }
      ]
    },
    systems: {
      items: [
        { name: '供应商管理系统', type: '业务系统', version: 'v3.2', access: 'http://supplier.company.com', description: '管理设备供应商信息和返厂维修流程' }
      ]
    }
  },
  
  // 现场修
  'o10': {
    documents: {
      items: [
        { name: '现场维修作业指导书', type: '操作指南', format: 'PDF', lastUpdate: '2023-11-10', size: '4.5MB', description: '现场维修的详细操作步骤' },
        { name: '常用备件清单', type: '库存文档', format: 'XLSX', lastUpdate: '2023-11-15', size: '2.3MB', description: '现场维修常用备件的库存清单' }
      ]
    },
    personnel: {
      items: [
        { name: '徐工程', role: '现场维修工程师', department: '运维部', contact: '13900139019', responsibility: '执行现场维修工作' },
        { name: '何仓管', role: '备件管理员', department: '物资部', contact: '13900139020', responsibility: '负责维修备件的供应和管理' }
      ]
    },
    equipment: {
      items: [
        { name: '专业维修工具套装', type: '维修工具', model: 'RT500', status: '正常', location: '工具室', description: '现场维修所需的专业工具' },
        { name: '电子测试仪器', type: '测试仪器', model: 'ET300', status: '正常', location: '维修车间', description: '用于电气系统测试和故障定位' },
        { name: '移动备件箱', type: '备件存储', model: 'PB200', status: '正常', location: '物资仓库', description: '现场维修常用备件的移动存储箱' }
      ]
    }
  },
  
  // 返厂修
  'o11': {
    documents: {
      items: [
        { name: '设备返厂申请表', type: '业务表单', format: 'PDF', lastUpdate: '2023-10-08', size: '1.8MB', description: '申请设备返厂维修的标准表单' },
        { name: '设备运输安全指南', type: '操作指南', format: 'PDF', lastUpdate: '2023-09-05', size: '3.2MB', description: '设备返厂运输的安全注意事项' },
        { name: '设备交接记录表', type: '业务表单', format: 'XLSX', lastUpdate: '2023-10-20', size: '1.5MB', description: '设备返厂和返回的交接记录' }
      ]
    },
    personnel: {
      items: [
        { name: '高物流', role: '物流专员', department: '物流部', contact: '13900139021', responsibility: '负责设备返厂的物流安排' },
        { name: '林协调', role: '维修协调员', department: '运维部', contact: '13900139022', responsibility: '协调厂商维修进度和技术支持' }
      ]
    },
    systems: {
      items: [
        { name: '物流追踪系统', type: '业务系统', version: 'v2.8', access: 'http://logistics.company.com', description: '追踪返厂设备的物流状态' }
      ]
    }
  },
  
  // 是否需要技术支持
  'o12': {
    documents: {
      items: [
        { name: '技术支持申请表', type: '业务表单', format: 'PDF', lastUpdate: '2023-11-02', size: '1.6MB', description: '申请技术支持的标准表单' },
        { name: '技术问题描述模板', type: '文档模板', format: 'DOCX', lastUpdate: '2023-10-25', size: '1.2MB', description: '详细描述技术问题的标准模板' }
      ]
    },
    personnel: {
      items: [
        { name: '程支持', role: '技术支持专员', department: '技术支持部', contact: '13900139023', responsibility: '提供远程技术支持和问题解答' },
        { name: '易工程', role: '研发工程师', department: '研发部', contact: '13900139024', responsibility: '解决复杂技术问题和产品改进' }
      ]
    },
    systems: {
      items: [
        { name: '技术知识库系统', type: '知识管理', version: 'v4.0', access: 'http://kb.company.com', description: '存储和检索技术问题解决方案' }
      ]
    }
  }
};

// 导出运维环节资源详情对象
export default operationResourceDetails; 