/**
 * 采购环节节点实现流程数据
 */

export const purchaseImplementation = {
  'p1': {  // 采购需求
    title: '采购需求实现流程',
    description: '从接收内部需求到生成采购申请的完整流程',
    isBackupEnabled: false,
    flowData: {
      nodes: [
        { id: 'start', type: 'circle', x: 100, y: 150, text: '开始', properties: { width: 60, height: 60 } },
        { id: 'step1', type: 'rect', x: 250, y: 150, text: '接收部门需求', properties: { width: 120, height: 60 } },
        { id: 'step2', type: 'rect', x: 400, y: 150, text: '需求分析整理', properties: { width: 120, height: 60 } },
        { id: 'step3', type: 'diamond', x: 550, y: 150, text: '预算审核', properties: { width: 100, height: 80 } },
        { id: 'step4', type: 'rect', x: 550, y: 280, text: '预算调整', properties: { width: 120, height: 60 } },
        { id: 'step5', type: 'rect', x: 700, y: 150, text: '生成采购申请', properties: { width: 120, height: 60 } },
        { id: 'end', type: 'circle', x: 850, y: 150, text: '结束', properties: { width: 60, height: 60 } }
      ],
      edges: [
        { id: 'e1', type: 'polyline', sourceNodeId: 'start', targetNodeId: 'step1' },
        { id: 'e2', type: 'polyline', sourceNodeId: 'step1', targetNodeId: 'step2' },
        { id: 'e3', type: 'polyline', sourceNodeId: 'step2', targetNodeId: 'step3' },
        { id: 'e4', type: 'polyline', text: '不通过', sourceNodeId: 'step3', targetNodeId: 'step4' },
        { id: 'e5', type: 'polyline', text: '通过', sourceNodeId: 'step3', targetNodeId: 'step5' },
        { id: 'e6', type: 'polyline', sourceNodeId: 'step4', targetNodeId: 'step2' },
        { id: 'e7', type: 'polyline', sourceNodeId: 'step5', targetNodeId: 'end' }
      ]
    },
    steps: {
      'step1': {
        title: '接收部门需求',
        description: '采购部接收各部门提交的采购需求单',
        duration: '1-2天',
        responsible: '采购专员',
        inputs: ['部门需求表', '物品清单'],
        outputs: ['需求接收单']
      },
      'step2': {
        title: '需求分析整理',
        description: '对采购需求进行分析，确认具体规格、数量和预算',
        duration: '1-2天',
        responsible: '采购分析师',
        inputs: ['需求接收单', '历史采购记录'],
        outputs: ['需求分析报告', '预算估算表']
      },
      'step3': {
        title: '预算审核',
        description: '财务部门对采购预算进行审核',
        duration: '1天',
        responsible: '财务经理',
        inputs: ['预算估算表', '部门预算计划'],
        outputs: ['预算审核结果']
      },
      'step4': {
        title: '预算调整',
        description: '根据审核反馈调整采购预算',
        duration: '1天',
        responsible: '采购经理',
        inputs: ['预算审核结果', '需求分析报告'],
        outputs: ['调整后的预算估算表']
      },
      'step5': {
        title: '生成采购申请',
        description: '生成正式的采购申请单',
        duration: '1天',
        responsible: '采购专员',
        inputs: ['预算审核结果', '需求分析报告'],
        outputs: ['采购申请单']
      }
    },
    // 备用流程
    backupImplementation: {
      title: '采购需求备用实现流程',
      description: '紧急情况下的采购需求简化处理流程',
      flowData: {
        nodes: [
          { id: 'start', type: 'circle', x: 100, y: 150, text: '开始', properties: { width: 60, height: 60 } },
          { id: 'step1', type: 'rect', x: 250, y: 100, text: '需求快速收集', properties: { width: 120, height: 60 } },
          { id: 'step2', type: 'rect', x: 250, y: 200, text: '紧急预算申请', properties: { width: 120, height: 60 } },
          { id: 'step3', type: 'rect', x: 400, y: 150, text: '综合审核', properties: { width: 120, height: 60 } },
          { id: 'step4', type: 'rect', x: 550, y: 150, text: '生成采购申请', properties: { width: 120, height: 60 } },
          { id: 'step5', type: 'rect', x: 700, y: 150, text: '同步通知供应商', properties: { width: 140, height: 60 } },
          { id: 'end', type: 'circle', x: 850, y: 150, text: '结束', properties: { width: 60, height: 60 } }
        ],
        edges: [
          { id: 'e1', type: 'polyline', sourceNodeId: 'start', targetNodeId: 'step1' },
          { id: 'e2', type: 'polyline', sourceNodeId: 'start', targetNodeId: 'step2' },
          { id: 'e3', type: 'polyline', sourceNodeId: 'step1', targetNodeId: 'step3' },
          { id: 'e4', type: 'polyline', sourceNodeId: 'step2', targetNodeId: 'step3' },
          { id: 'e5', type: 'polyline', sourceNodeId: 'step3', targetNodeId: 'step4' },
          { id: 'e6', type: 'polyline', sourceNodeId: 'step4', targetNodeId: 'step5' },
          { id: 'e7', type: 'polyline', sourceNodeId: 'step5', targetNodeId: 'end' }
        ]
      },
      steps: {
        'step1': {
          title: '需求快速收集',
          description: '直接收集各部门紧急采购需求，无需详细分析',
          duration: '1-2小时',
          responsible: '采购专员',
          inputs: ['紧急需求表'],
          outputs: ['紧急需求汇总']
        },
        'step2': {
          title: '紧急预算申请',
          description: '使用紧急预算额度，绕过常规预算审批流程',
          duration: '1小时',
          responsible: '采购经理',
          inputs: ['紧急预算配额'],
          outputs: ['紧急预算申请']
        },
        'step3': {
          title: '综合审核',
          description: '对需求和预算进行一站式综合审核',
          duration: '2小时',
          responsible: '采购总监',
          inputs: ['紧急需求汇总', '紧急预算申请'],
          outputs: ['综合审核结果']
        },
        'step4': {
          title: '生成采购申请',
          description: '基于审核结果生成紧急采购申请',
          duration: '1小时',
          responsible: '采购专员',
          inputs: ['综合审核结果'],
          outputs: ['紧急采购申请单']
        },
        'step5': {
          title: '同步通知供应商',
          description: '同步通知首选供应商准备发货',
          duration: '1小时',
          responsible: '采购专员',
          inputs: ['紧急采购申请单'],
          outputs: ['供应商通知']
        }
      }
    }
  },
  'p2': {  // 供应商选择
    title: '供应商选择实现流程',
    description: '筛选和评估潜在供应商的完整流程',
    isBackupEnabled: false,
    flowData: {
      nodes: [
        { id: 'start', type: 'circle', x: 100, y: 150, text: '开始', properties: { width: 60, height: 60 } },
        { id: 'step1', type: 'rect', x: 250, y: 150, text: '供应商调研', properties: { width: 120, height: 60 } },
        { id: 'step2', type: 'rect', x: 400, y: 150, text: '初步筛选', properties: { width: 120, height: 60 } },
        { id: 'step3', type: 'rect', x: 550, y: 150, text: '供应商评估', properties: { width: 120, height: 60 } },
        { id: 'step4', type: 'diamond', x: 700, y: 150, text: '合格评审', properties: { width: 100, height: 80 } },
        { id: 'step5', type: 'rect', x: 850, y: 150, text: '供应商入库', properties: { width: 120, height: 60 } },
        { id: 'step6', type: 'rect', x: 700, y: 280, text: '供应商淘汰', properties: { width: 120, height: 60 } },
        { id: 'end', type: 'circle', x: 1000, y: 150, text: '结束', properties: { width: 60, height: 60 } }
      ],
      edges: [
        { id: 'e1', type: 'polyline', sourceNodeId: 'start', targetNodeId: 'step1' },
        { id: 'e2', type: 'polyline', sourceNodeId: 'step1', targetNodeId: 'step2' },
        { id: 'e3', type: 'polyline', sourceNodeId: 'step2', targetNodeId: 'step3' },
        { id: 'e4', type: 'polyline', sourceNodeId: 'step3', targetNodeId: 'step4' },
        { id: 'e5', type: 'polyline', text: '通过', sourceNodeId: 'step4', targetNodeId: 'step5' },
        { id: 'e6', type: 'polyline', text: '不通过', sourceNodeId: 'step4', targetNodeId: 'step6' },
        { id: 'e7', type: 'polyline', sourceNodeId: 'step5', targetNodeId: 'end' },
        { id: 'e8', type: 'polyline', sourceNodeId: 'step6', targetNodeId: 'end' }
      ]
    },
    steps: {
      'step1': {
        title: '供应商调研',
        description: '收集市场上潜在供应商信息',
        duration: '1-2周',
        responsible: '采购专员',
        inputs: ['市场报告', '行业目录'],
        outputs: ['供应商清单']
      },
      'step2': {
        title: '初步筛选',
        description: '根据基本条件筛选潜在供应商',
        duration: '3-5天',
        responsible: '采购经理',
        inputs: ['供应商清单', '筛选标准'],
        outputs: ['初筛供应商名单']
      },
      'step3': {
        title: '供应商评估',
        description: '对筛选后的供应商进行全面评估',
        duration: '1-2周',
        responsible: '评估小组',
        inputs: ['初筛供应商名单', '评估表'],
        outputs: ['供应商评估报告']
      },
      'step4': {
        title: '合格评审',
        description: '评审小组决定供应商是否合格',
        duration: '1天',
        responsible: '评审委员会',
        inputs: ['供应商评估报告'],
        outputs: ['评审结果']
      },
      'step5': {
        title: '供应商入库',
        description: '将合格供应商纳入企业供应商库',
        duration: '1-2天',
        responsible: '采购专员',
        inputs: ['评审结果', '供应商资料'],
        outputs: ['供应商档案']
      },
      'step6': {
        title: '供应商淘汰',
        description: '记录不合格供应商信息',
        duration: '1天',
        responsible: '采购专员',
        inputs: ['评审结果', '不合格原因'],
        outputs: ['淘汰记录']
      }
    }
  },
  'p3': {  // 价格审批
    title: '价格审批实现流程',
    description: '对采购价格进行内部审批的详细流程',
    isBackupEnabled: false,
    flowData: {
      nodes: [
        { id: 'start', type: 'circle', x: 100, y: 150, text: '开始', properties: { width: 60, height: 60 } },
        { id: 'step1', type: 'rect', x: 250, y: 150, text: '提交价格申请', properties: { width: 120, height: 60 } },
        { id: 'step2', type: 'rect', x: 400, y: 150, text: '财务审核', properties: { width: 120, height: 60 } },
        { id: 'step3', type: 'diamond', x: 550, y: 150, text: '管理层审批', properties: { width: 100, height: 80 } },
        { id: 'step4', type: 'rect', x: 550, y: 280, text: '补充材料', properties: { width: 120, height: 60 } },
        { id: 'step5', type: 'rect', x: 700, y: 150, text: '审批通过', properties: { width: 120, height: 60 } },
        { id: 'end', type: 'circle', x: 850, y: 150, text: '结束', properties: { width: 60, height: 60 } }
      ],
      edges: [
        { id: 'e1', type: 'polyline', sourceNodeId: 'start', targetNodeId: 'step1' },
        { id: 'e2', type: 'polyline', sourceNodeId: 'step1', targetNodeId: 'step2' },
        { id: 'e3', type: 'polyline', sourceNodeId: 'step2', targetNodeId: 'step3' },
        { id: 'e4', type: 'polyline', text: '不通过', sourceNodeId: 'step3', targetNodeId: 'step4' },
        { id: 'e5', type: 'polyline', text: '通过', sourceNodeId: 'step3', targetNodeId: 'step5' },
        { id: 'e6', type: 'polyline', sourceNodeId: 'step4', targetNodeId: 'step1' },
        { id: 'e7', type: 'polyline', sourceNodeId: 'step5', targetNodeId: 'end' }
      ]
    },
    steps: {
      'step1': {
        title: '提交价格申请',
        description: '采购专员根据需求分析报告填写价格申请表并提交',
        duration: '0.5天',
        responsible: '采购专员',
        inputs: ['需求分析报告', '预算估算表'],
        outputs: ['价格申请表']
      },
      'step2': {
        title: '财务审核',
        description: '财务部门对价格申请进行合理性审核',
        duration: '1天',
        responsible: '财务经理',
        inputs: ['价格申请表'],
        outputs: ['财务审核意见']
      },
      'step3': {
        title: '管理层审批',
        description: '管理层对价格及财务意见进行最终审批',
        duration: '1天',
        responsible: '管理层',
        inputs: ['财务审核意见'],
        outputs: ['审批结果']
      },
      'step4': {
        title: '补充材料',
        description: '如审批未通过，补充相关材料后重新提交',
        duration: '1天',
        responsible: '采购专员',
        inputs: ['审批意见'],
        outputs: ['补充材料']
      },
      'step5': {
        title: '审批通过',
        description: '审批通过后进入后续采购流程',
        duration: '0.5天',
        responsible: '采购专员',
        inputs: ['审批结果'],
        outputs: ['通过标记']
      }
    }
  },
  'p4': {  // 签订合同
    title: '签订合同实现流程',
    description: '与供应商签订采购合同的详细流程',
    isBackupEnabled: false,
    flowData: {
      nodes: [
        { id: 'start', type: 'circle', x: 100, y: 150, text: '开始', properties: { width: 60, height: 60 } },
        { id: 'step1', type: 'rect', x: 250, y: 150, text: '合同草拟', properties: { width: 120, height: 60 } },
        { id: 'step2', type: 'rect', x: 400, y: 150, text: '法务审核', properties: { width: 120, height: 60 } },
        { id: 'step3', type: 'rect', x: 550, y: 150, text: '双方确认', properties: { width: 120, height: 60 } },
        { id: 'step4', type: 'rect', x: 700, y: 150, text: '合同签署', properties: { width: 120, height: 60 } },
        { id: 'end', type: 'circle', x: 850, y: 150, text: '结束', properties: { width: 60, height: 60 } }
      ],
      edges: [
        { id: 'e1', type: 'polyline', sourceNodeId: 'start', targetNodeId: 'step1' },
        { id: 'e2', type: 'polyline', sourceNodeId: 'step1', targetNodeId: 'step2' },
        { id: 'e3', type: 'polyline', sourceNodeId: 'step2', targetNodeId: 'step3' },
        { id: 'e4', type: 'polyline', sourceNodeId: 'step3', targetNodeId: 'step4' },
        { id: 'e5', type: 'polyline', sourceNodeId: 'step4', targetNodeId: 'end' }
      ]
    },
    steps: {
      'step1': {
        title: '合同草拟',
        description: '采购专员根据审批通过的内容起草合同',
        duration: '1天',
        responsible: '采购专员',
        inputs: ['审批通过内容'],
        outputs: ['合同草稿']
      },
      'step2': {
        title: '法务审核',
        description: '法务部门对合同草稿进行合法性审核',
        duration: '1天',
        responsible: '法务专员',
        inputs: ['合同草稿'],
        outputs: ['法务审核意见']
      },
      'step3': {
        title: '双方确认',
        description: '采购方与供应商双方确认合同条款',
        duration: '1天',
        responsible: '采购经理/供应商代表',
        inputs: ['法务审核意见'],
        outputs: ['确认后的合同']
      },
      'step4': {
        title: '合同签署',
        description: '双方正式签署合同',
        duration: '0.5天',
        responsible: '采购经理/供应商代表',
        inputs: ['确认后的合同'],
        outputs: ['正式合同']
      }
    }
  },
  'p5': {  // 货物接收
    title: '货物接收实现流程',
    description: '接收供应商送达货物的详细流程',
    isBackupEnabled: false,
    flowData: {
      nodes: [
        { id: 'start', type: 'circle', x: 100, y: 150, text: '开始', properties: { width: 60, height: 60 } },
        { id: 'step1', type: 'rect', x: 250, y: 150, text: '到货通知', properties: { width: 120, height: 60 } },
        { id: 'step2', type: 'rect', x: 400, y: 150, text: '货物验收', properties: { width: 120, height: 60 } },
        { id: 'step3', type: 'rect', x: 550, y: 150, text: '入库登记', properties: { width: 120, height: 60 } },
        { id: 'end', type: 'circle', x: 700, y: 150, text: '结束', properties: { width: 60, height: 60 } }
      ],
      edges: [
        { id: 'e1', type: 'polyline', sourceNodeId: 'start', targetNodeId: 'step1' },
        { id: 'e2', type: 'polyline', sourceNodeId: 'step1', targetNodeId: 'step2' },
        { id: 'e3', type: 'polyline', sourceNodeId: 'step2', targetNodeId: 'step3' },
        { id: 'e4', type: 'polyline', sourceNodeId: 'step3', targetNodeId: 'end' }
      ]
    },
    steps: {
      'step1': {
        title: '到货通知',
        description: '供应商发出到货通知，采购部准备接收',
        duration: '0.5天',
        responsible: '供应商/采购专员',
        inputs: ['发货单'],
        outputs: ['到货通知']
      },
      'step2': {
        title: '货物验收',
        description: '仓储部对到货货物进行数量和外观验收',
        duration: '1天',
        responsible: '仓储专员',
        inputs: ['到货通知', '采购合同'],
        outputs: ['验收单']
      },
      'step3': {
        title: '入库登记',
        description: '合格货物办理入库登记手续',
        duration: '0.5天',
        responsible: '仓储专员',
        inputs: ['验收单'],
        outputs: ['入库单']
      }
    }
  },
  'p6': {  // 质量检验
    title: '质量检验实现流程',
    description: '对收到的货物进行质量检验的详细流程',
    isBackupEnabled: false,
    flowData: {
      nodes: [
        { id: 'start', type: 'circle', x: 100, y: 150, text: '开始', properties: { width: 60, height: 60 } },
        { id: 'step1', type: 'rect', x: 250, y: 150, text: '检验准备', properties: { width: 120, height: 60 } },
        { id: 'step2', type: 'rect', x: 400, y: 150, text: '检验执行', properties: { width: 120, height: 60 } },
        { id: 'step3', type: 'diamond', x: 550, y: 150, text: '结果记录', properties: { width: 100, height: 80 } },
        { id: 'step4', type: 'rect', x: 700, y: 150, text: '合格', properties: { width: 120, height: 60 } },
        { id: 'step5', type: 'rect', x: 700, y: 280, text: '不合格', properties: { width: 120, height: 60 } },
        { id: 'end', type: 'circle', x: 850, y: 150, text: '结束', properties: { width: 60, height: 60 } }
      ],
      edges: [
        { id: 'e1', type: 'polyline', sourceNodeId: 'start', targetNodeId: 'step1' },
        { id: 'e2', type: 'polyline', sourceNodeId: 'step1', targetNodeId: 'step2' },
        { id: 'e3', type: 'polyline', sourceNodeId: 'step2', targetNodeId: 'step3' },
        { id: 'e4', type: 'polyline', text: '合格', sourceNodeId: 'step3', targetNodeId: 'step4' },
        { id: 'e5', type: 'polyline', text: '不合格', sourceNodeId: 'step3', targetNodeId: 'step5' },
        { id: 'e6', type: 'polyline', sourceNodeId: 'step4', targetNodeId: 'end' },
        { id: 'e7', type: 'polyline', sourceNodeId: 'step5', targetNodeId: 'end' }
      ]
    },
    steps: {
      'step1': {
        title: '检验准备',
        description: '准备检验所需的工具和文件',
        duration: '0.5天',
        responsible: '质检员',
        inputs: ['到货通知', '检验标准'],
        outputs: ['检验准备完成']
      },
      'step2': {
        title: '检验执行',
        description: '根据标准执行质量检验',
        duration: '1天',
        responsible: '质检员',
        inputs: ['检验准备完成'],
        outputs: ['检验结果']
      },
      'step3': {
        title: '结果记录',
        description: '记录检验结果并决定是否合格',
        duration: '0.5天',
        responsible: '质检员',
        inputs: ['检验结果'],
        outputs: ['合格标记', '不合格标记']
      }
    }
  },
  'p7': {  // 入库
    title: '入库实现流程',
    description: '将合格货物办理入库手续的详细流程',
    isBackupEnabled: false,
    flowData: {
      nodes: [
        { id: 'start', type: 'circle', x: 100, y: 150, text: '开始', properties: { width: 60, height: 60 } },
        { id: 'step1', type: 'rect', x: 250, y: 150, text: '入库准备', properties: { width: 120, height: 60 } },
        { id: 'step2', type: 'rect', x: 400, y: 150, text: '入库登记', properties: { width: 120, height: 60 } },
        { id: 'end', type: 'circle', x: 550, y: 150, text: '结束', properties: { width: 60, height: 60 } }
      ],
      edges: [
        { id: 'e1', type: 'polyline', sourceNodeId: 'start', targetNodeId: 'step1' },
        { id: 'e2', type: 'polyline', sourceNodeId: 'step1', targetNodeId: 'step2' },
        { id: 'e3', type: 'polyline', sourceNodeId: 'step2', targetNodeId: 'end' }
      ]
    },
    steps: {
      'step1': {
        title: '入库准备',
        description: '准备入库所需的文件和工具',
        duration: '0.5天',
        responsible: '仓储员',
        inputs: ['合格标记'],
        outputs: ['入库准备完成']
      },
      'step2': {
        title: '入库登记',
        description: '登记入库信息并完成入库',
        duration: '0.5天',
        responsible: '仓储员',
        inputs: ['入库准备完成'],
        outputs: ['入库单']
      }
    }
  },
  'p8': {  // 退回处理
    title: '退回处理实现流程',
    description: '处理不合格货物的退回流程的详细流程',
    isBackupEnabled: false,
    flowData: {
      nodes: [
        { id: 'start', type: 'circle', x: 100, y: 150, text: '开始', properties: { width: 60, height: 60 } },
        { id: 'step1', type: 'rect', x: 250, y: 150, text: '退回申请', properties: { width: 120, height: 60 } },
        { id: 'step2', type: 'rect', x: 400, y: 150, text: '退回执行', properties: { width: 120, height: 60 } },
        { id: 'end', type: 'circle', x: 550, y: 150, text: '结束', properties: { width: 60, height: 60 } }
      ],
      edges: [
        { id: 'e1', type: 'polyline', sourceNodeId: 'start', targetNodeId: 'step1' },
        { id: 'e2', type: 'polyline', sourceNodeId: 'step1', targetNodeId: 'step2' },
        { id: 'e3', type: 'polyline', sourceNodeId: 'step2', targetNodeId: 'end' }
      ]
    },
    steps: {
      'step1': {
        title: '退回申请',
        description: '申请退回不合格货物',
        duration: '0.5天',
        responsible: '采购专员',
        inputs: ['不合格标记'],
        outputs: ['退回申请单']
      },
      'step2': {
        title: '退回执行',
        description: '执行退回流程并确认退回',
        duration: '1天',
        responsible: '仓储员',
        inputs: ['退回申请单'],
        outputs: ['退回确认']
      }
    }
  },
  // 其他节点实现流程可以继续添加...
}; 