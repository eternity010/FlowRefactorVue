/**
 * 采购环节各节点实现流程使用的简化资源数据
 */

export const purchaseResources = {
  // 采购需求节点
  'p1': {
    // 资源类型及数量
    resources: {
      forms: 3,          // 表单数量
      templates: 2,      // 模板数量
      guidelines: 2,     // 指南数量
      systems: 1         // 系统数量
    },
    // 所需属性
    attributes: [
      '采购单号', 
      '申请部门',
      '申请日期',
      '物品名称',
      '规格型号',
      '数量',
      '预算金额',
      '审批状态'
    ]
  },
  
  // 供应商选择节点
  'p2': {
    resources: {
      forms: 2,
      templates: 1,
      databases: 1,
      evaluationTools: 1
    },
    attributes: [
      '供应商编号',
      '供应商名称',
      '联系人',
      '联系电话',
      '主营业务',
      '资质等级',
      '评估得分'
    ]
  },
  
  // 价格审批节点
  'p3': {
    resources: {
      forms: 1,
      approvalSystems: 1,
      priceDatabase: 1
    },
    attributes: [
      '审批编号',
      '申请人',
      '申请日期',
      '采购总额',
      '审批级别',
      '审批状态',
      '审批意见'
    ]
  },
  
  // 签订合同节点
  'p4': {
    resources: {
      contractTemplates: 2,
      legalDatabase: 1
    },
    attributes: [
      '合同编号',
      '签订日期',
      '合同金额',
      '合同期限',
      '付款方式',
      '违约条款'
    ]
  },
  
  // 货物接收节点
  'p5': {
    resources: {
      receiptForms: 1,
      inventorySystems: 1
    },
    attributes: [
      '入库单号',
      '到货日期',
      '物品名称',
      '数量',
      '验收人',
      '验收状态'
    ]
  },
  
  // 质量检验节点
  'p6': {
    resources: {
      inspectionForms: 2,
      qualityStandards: 3,
      testingEquipment: 4
    },
    attributes: [
      '检验单号',
      '检验日期',
      '检验项目',
      '检验结果',
      '合格率',
      '处理意见'
    ]
  },
  
  // 入库节点
  'p7': {
    resources: {
      storageForms: 1,
      inventorySystems: 1
    },
    attributes: [
      '入库单号',
      '入库日期',
      '货位编号',
      '物品编码',
      '数量',
      '保管人'
    ]
  },
  
  // 退回处理节点
  'p8': {
    resources: {
      returnForms: 1,
      processingGuidelines: 1
    },
    attributes: [
      '退回单号',
      '退回日期',
      '退回原因',
      '处理方式',
      '处理人',
      '处理结果'
    ]
  }
}; 