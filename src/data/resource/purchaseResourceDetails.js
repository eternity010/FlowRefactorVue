/**
 * 采购环节节点资源详细信息
 * 包含采购环节各节点的详细资源数据
 */

// 采购环节的节点资源详情
const purchaseResourceDetails = {
  // 采购需求节点
  p1: {
    documents: {
      items: [
        { name: '采购需求表', type: '需求文档', format: 'DOCX', lastUpdate: '2023-10-15', size: '2.5MB', description: '记录详细的采购需求' },
        { name: '物料清单', type: '清单', format: 'XLSX', lastUpdate: '2023-10-16', size: '1.8MB', description: '采购物料详细清单' },
        { name: '需求评估报告', type: '报告', format: 'PDF', lastUpdate: '2023-10-17', size: '3.2MB', description: '采购需求合理性评估' }
      ]
    },
    personnel: {
      items: [
        { name: '张三', role: '采购经理', department: '采购部', contact: '13800138001', responsibility: '审批采购需求' },
        { name: '李四', role: '需求分析师', department: '采购部', contact: '13800138002', responsibility: '分析采购需求合理性' }
      ]
    },
    systems: {
      items: [
        { name: '采购需求管理系统', type: '业务系统', version: 'v2.5', access: 'http://erp.company.com/purchase', description: '记录和管理采购需求' }
      ]
    }
  },
  
  // 供应商选择节点
  p2: {
    documents: {
      items: [
        { name: '供应商清单', type: '清单', format: 'XLSX', lastUpdate: '2023-09-20', size: '1.5MB', description: '合格供应商列表' },
        { name: '供应商评估表', type: '评估文档', format: 'DOCX', lastUpdate: '2023-09-25', size: '1.2MB', description: '供应商评估标准和结果' }
      ]
    },
    personnel: {
      items: [
        { name: '王五', role: '供应商管理员', department: '采购部', contact: '13800138003', responsibility: '管理供应商关系' },
        { name: '赵六', role: '评估专员', department: '采购部', contact: '13800138004', responsibility: '评估供应商资质' }
      ]
    },
    systems: {
      items: [
        { name: '供应商管理系统', type: '业务系统', version: 'v3.0', access: 'http://erp.company.com/supplier', description: '管理供应商资质和评级' }
      ]
    }
  },
  
  // 价格审批节点
  p3: {
    documents: {
      items: [
        { name: '价格比较表', type: '分析文档', format: 'XLSX', lastUpdate: '2023-10-10', size: '1.1MB', description: '不同供应商价格比较' },
        { name: '价格审批单', type: '审批文档', format: 'PDF', lastUpdate: '2023-10-12', size: '0.8MB', description: '采购价格审批记录' }
      ]
    },
    personnel: {
      items: [
        { name: '陈七', role: '财务主管', department: '财务部', contact: '13800138005', responsibility: '审批采购价格' },
        { name: '林八', role: '成本分析师', department: '财务部', contact: '13800138006', responsibility: '分析采购成本合理性' }
      ]
    },
    systems: {
      items: [
        { name: '预算管理系统', type: '财务系统', version: 'v2.1', access: 'http://erp.company.com/budget', description: '管理采购预算和支出' }
      ]
    }
  },
  
  // 签订合同节点
  p4: {
    documents: {
      items: [
        { name: '采购合同模板', type: '合同文档', format: 'DOCX', lastUpdate: '2023-08-15', size: '1.3MB', description: '标准采购合同模板' },
        { name: '法律审核意见', type: '审核文档', format: 'PDF', lastUpdate: '2023-10-18', size: '0.9MB', description: '法务部门对合同的审核意见' }
      ]
    },
    personnel: {
      items: [
        { name: '吴九', role: '法务专员', department: '法务部', contact: '13800138007', responsibility: '合同审核' },
        { name: '郑十', role: '采购总监', department: '采购部', contact: '13800138008', responsibility: '合同签署授权' }
      ]
    },
    systems: {
      items: [
        { name: '合同管理系统', type: '法务系统', version: 'v1.8', access: 'http://erp.company.com/contract', description: '管理所有合同的签署和履行' }
      ]
    }
  },
  
  // 货物接收节点
  p5: {
    documents: {
      items: [
        { name: '入库单模板', type: '操作文档', format: 'DOCX', lastUpdate: '2023-07-20', size: '0.7MB', description: '货物入库记录表格' },
        { name: '货物验收标准', type: '标准文档', format: 'PDF', lastUpdate: '2023-07-25', size: '1.5MB', description: '各类货物的验收标准' }
      ]
    },
    personnel: {
      items: [
        { name: '马一', role: '仓库管理员', department: '物流部', contact: '13800138009', responsibility: '接收和入库货物' },
        { name: '胡二', role: '质检员', department: '质量部', contact: '13800138010', responsibility: '检查货物是否符合要求' }
      ]
    },
    equipment: {
      items: [
        { name: '叉车', type: '运输设备', model: 'FL2000', status: '正常', location: '主仓库', description: '用于搬运大型货物' },
        { name: '手持扫描器', type: '识别设备', model: 'SC100', status: '正常', location: '入库区', description: '用于扫描货物条码' }
      ]
    }
  },
  
  // 质量检验节点
  p6: {
    documents: {
      items: [
        { name: '质检标准手册', type: '标准文档', format: 'PDF', lastUpdate: '2023-06-10', size: '2.8MB', description: '详细的质量检验标准' },
        { name: '质检报告模板', type: '报告模板', format: 'DOCX', lastUpdate: '2023-06-15', size: '0.9MB', description: '质量检验结果报告模板' }
      ]
    },
    personnel: {
      items: [
        { name: '冯三', role: '质检主管', department: '质量部', contact: '13800138011', responsibility: '负责质量检验流程' },
        { name: '朱四', role: '质检工程师', department: '质量部', contact: '13800138012', responsibility: '执行具体检验工作' }
      ]
    },
    equipment: {
      items: [
        { name: '光谱分析仪', type: '检测设备', model: 'SA2000', status: '正常', location: '质检实验室', description: '用于材料成分分析' },
        { name: '硬度计', type: '检测设备', model: 'HD100', status: '维护中', location: '质检实验室', description: '测量材料硬度' },
        { name: '显微镜', type: '检测设备', model: 'MS500', status: '正常', location: '质检实验室', description: '观察材料微观结构' }
      ]
    },
    systems: {
      items: [
        { name: '质量管理系统', type: '业务系统', version: 'v2.3', access: 'http://erp.company.com/quality', description: '记录和分析质检数据' }
      ]
    }
  },
  
  // 入库节点
  p7: {
    documents: {
      items: [
        { name: '库存管理制度', type: '规章制度', format: 'PDF', lastUpdate: '2023-05-20', size: '1.6MB', description: '仓库管理的规章制度' },
        { name: '库存盘点表', type: '操作文档', format: 'XLSX', lastUpdate: '2023-05-25', size: '1.2MB', description: '库存盘点记录表' }
      ]
    },
    personnel: {
      items: [
        { name: '沈五', role: '仓库主管', department: '物流部', contact: '13800138013', responsibility: '负责仓库整体管理' },
        { name: '韩六', role: '入库员', department: '物流部', contact: '13800138014', responsibility: '执行货物入库操作' }
      ]
    },
    equipment: {
      items: [
        { name: '条码打印机', type: '标识设备', model: 'BP200', status: '正常', location: '入库区', description: '打印货物标签' },
        { name: '货架', type: '存储设备', model: 'SH500', status: '正常', location: '主仓库', description: '用于存放货物' }
      ]
    },
    systems: {
      items: [
        { name: '仓库管理系统', type: '业务系统', version: 'v3.2', access: 'http://erp.company.com/warehouse', description: '管理仓库库存和位置' }
      ]
    }
  },
  
  // 退回处理节点
  p8: {
    documents: {
      items: [
        { name: '退货处理流程', type: '流程文档', format: 'PDF', lastUpdate: '2023-04-15', size: '1.4MB', description: '处理退货的标准流程' },
        { name: '退货申请单', type: '申请文档', format: 'DOCX', lastUpdate: '2023-04-20', size: '0.8MB', description: '申请退货的表单' }
      ]
    },
    personnel: {
      items: [
        { name: '魏七', role: '退货专员', department: '采购部', contact: '13800138015', responsibility: '处理退货事宜' },
        { name: '秦八', role: '供应商协调员', department: '采购部', contact: '13800138016', responsibility: '与供应商协调退货事宜' }
      ]
    },
    systems: {
      items: [
        { name: '退货管理系统', type: '业务系统', version: 'v1.5', access: 'http://erp.company.com/return', description: '管理退货流程和记录' }
      ]
    }
  }
};

// 导出采购环节资源详情对象
export default purchaseResourceDetails; 