/**
 * 运维环节节点实现流程数据
 */

export const operationImplementation = {
  'o1': {  // 里程数周期性维护
    title: '里程数周期性维护实现流程',
    description: '基于里程数进行设备周期性维护的完整流程',
    isBackupEnabled: false,
    flowData: {
      nodes: [
        { id: 'start', type: 'circle', x: 100, y: 100, text: '开始', properties: { width: 60, height: 60 } },
        { id: 'step1', type: 'rect', x: 250, y: 100, text: '里程数检查', properties: { width: 120, height: 60 } },
        { id: 'step2', type: 'diamond', x: 400, y: 100, text: '是否到维护期', properties: { width: 120, height: 80 } },
        { id: 'step3', type: 'rect', x: 550, y: 100, text: '制定维护计划', properties: { width: 120, height: 60 } },
        { id: 'step4', type: 'rect', x: 700, y: 100, text: '安排维护人员', properties: { width: 120, height: 60 } },
        { id: 'step5', type: 'rect', x: 850, y: 100, text: '执行维护作业', properties: { width: 120, height: 60 } },
        { id: 'step6', type: 'rect', x: 1000, y: 100, text: '维护记录', properties: { width: 120, height: 60 } },
        { id: 'step7', type: 'rect', x: 1150, y: 100, text: '更新维护档案', properties: { width: 120, height: 60 } },
        { id: 'step8', type: 'rect', x: 400, y: 250, text: '继续监控', properties: { width: 120, height: 60 } },
        { id: 'end', type: 'circle', x: 1300, y: 100, text: '结束', properties: { width: 60, height: 60 } }
      ],
      edges: [
        { id: 'e1', type: 'polyline', sourceNodeId: 'start', targetNodeId: 'step1' },
        { id: 'e2', type: 'polyline', sourceNodeId: 'step1', targetNodeId: 'step2' },
        { id: 'e3', type: 'polyline', text: '是', sourceNodeId: 'step2', targetNodeId: 'step3' },
        { id: 'e4', type: 'polyline', text: '否', sourceNodeId: 'step2', targetNodeId: 'step8' },
        { id: 'e5', type: 'polyline', sourceNodeId: 'step3', targetNodeId: 'step4' },
        { id: 'e6', type: 'polyline', sourceNodeId: 'step4', targetNodeId: 'step5' },
        { id: 'e7', type: 'polyline', sourceNodeId: 'step5', targetNodeId: 'step6' },
        { id: 'e8', type: 'polyline', sourceNodeId: 'step6', targetNodeId: 'step7' },
        { id: 'e9', type: 'polyline', sourceNodeId: 'step7', targetNodeId: 'end' },
        { id: 'e10', type: 'polyline', sourceNodeId: 'step8', targetNodeId: 'end' }
      ]
    },
    steps: {
      'step1': {
        title: '里程数检查',
        description: '定期检查设备当前里程数，确认是否接近维护周期',
        duration: '0.5天',
        responsible: '运维专员',
        inputs: ['设备里程记录', '维护周期表'],
        outputs: ['里程数检查报告']
      },
      'step2': {
        title: '是否到维护期',
        description: '根据里程数和维护周期判断是否需要进行维护',
        duration: '0.5天',
        responsible: '运维专员',
        inputs: ['里程数检查报告', '维护标准'],
        outputs: ['维护需求判断']
      },
      'step3': {
        title: '制定维护计划',
        description: '根据设备状况制定详细的维护计划',
        duration: '1天',
        responsible: '运维主管',
        inputs: ['维护需求判断', '设备技术手册'],
        outputs: ['维护计划书']
      },
      'step4': {
        title: '安排维护人员',
        description: '根据维护计划安排合适的维护人员',
        duration: '0.5天',
        responsible: '运维主管',
        inputs: ['维护计划书', '人员排班表'],
        outputs: ['人员安排表']
      },
      'step5': {
        title: '执行维护作业',
        description: '按照维护计划执行具体的维护作业',
        duration: '1-3天',
        responsible: '维护技师',
        inputs: ['维护计划书', '维护工具'],
        outputs: ['维护作业记录']
      },
      'step6': {
        title: '维护记录',
        description: '详细记录维护过程和结果',
        duration: '0.5天',
        responsible: '维护技师',
        inputs: ['维护作业记录'],
        outputs: ['维护记录表']
      },
      'step7': {
        title: '更新维护档案',
        description: '将维护记录更新到设备档案中',
        duration: '0.5天',
        responsible: '运维专员',
        inputs: ['维护记录表'],
        outputs: ['更新后的设备档案']
      },
      'step8': {
        title: '继续监控',
        description: '未到维护期时继续监控设备状态',
        duration: '持续',
        responsible: '运维专员',
        inputs: ['里程数检查报告'],
        outputs: ['监控记录']
      }
    },
    // 备用流程
    backupImplementation: {
      title: '紧急维护实现流程',
      description: '设备出现紧急故障时的快速维护流程',
      flowData: {
        nodes: [
          { id: 'start', type: 'circle', x: 100, y: 150, text: '开始', properties: { width: 60, height: 60 } },
          { id: 'step1', type: 'rect', x: 250, y: 150, text: '故障报告', properties: { width: 120, height: 60 } },
          { id: 'step2', type: 'rect', x: 400, y: 150, text: '紧急响应', properties: { width: 120, height: 60 } },
          { id: 'step3', type: 'rect', x: 550, y: 150, text: '现场诊断', properties: { width: 120, height: 60 } },
          { id: 'step4', type: 'diamond', x: 700, y: 150, text: '故障严重程度', properties: { width: 120, height: 80 } },
          { id: 'step5', type: 'rect', x: 850, y: 100, text: '现场修复', properties: { width: 120, height: 60 } },
          { id: 'step6', type: 'rect', x: 850, y: 200, text: '设备停机', properties: { width: 120, height: 60 } },
          { id: 'step7', type: 'rect', x: 1000, y: 150, text: '维护记录', properties: { width: 120, height: 60 } },
          { id: 'end', type: 'circle', x: 1150, y: 150, text: '结束', properties: { width: 60, height: 60 } }
        ],
        edges: [
          { id: 'e1', type: 'polyline', sourceNodeId: 'start', targetNodeId: 'step1' },
          { id: 'e2', type: 'polyline', sourceNodeId: 'step1', targetNodeId: 'step2' },
          { id: 'e3', type: 'polyline', sourceNodeId: 'step2', targetNodeId: 'step3' },
          { id: 'e4', type: 'polyline', sourceNodeId: 'step3', targetNodeId: 'step4' },
          { id: 'e5', type: 'polyline', text: '轻微', sourceNodeId: 'step4', targetNodeId: 'step5' },
          { id: 'e6', type: 'polyline', text: '严重', sourceNodeId: 'step4', targetNodeId: 'step6' },
          { id: 'e7', type: 'polyline', sourceNodeId: 'step5', targetNodeId: 'step7' },
          { id: 'e8', type: 'polyline', sourceNodeId: 'step6', targetNodeId: 'step7' },
          { id: 'e9', type: 'polyline', sourceNodeId: 'step7', targetNodeId: 'end' }
        ]
      },
      steps: {
        'step1': {
          title: '故障报告',
          description: '接收设备故障报告并记录',
          duration: '0.5小时',
          responsible: '运维值班员',
          inputs: ['故障报告'],
          outputs: ['故障记录']
        },
        'step2': {
          title: '紧急响应',
          description: '立即启动紧急响应程序',
          duration: '0.5小时',
          responsible: '运维主管',
          inputs: ['故障记录'],
          outputs: ['响应指令']
        },
        'step3': {
          title: '现场诊断',
          description: '技术人员到现场进行故障诊断',
          duration: '1小时',
          responsible: '维护技师',
          inputs: ['响应指令'],
          outputs: ['诊断报告']
        },
        'step4': {
          title: '故障严重程度',
          description: '评估故障的严重程度',
          duration: '0.5小时',
          responsible: '维护技师',
          inputs: ['诊断报告'],
          outputs: ['严重程度评估']
        },
        'step5': {
          title: '现场修复',
          description: '对轻微故障进行现场修复',
          duration: '2-4小时',
          responsible: '维护技师',
          inputs: ['严重程度评估'],
          outputs: ['修复记录']
        },
        'step6': {
          title: '设备停机',
          description: '严重故障时安全停机并安排返厂维修',
          duration: '1小时',
          responsible: '维护技师',
          inputs: ['严重程度评估'],
          outputs: ['停机记录']
        },
        'step7': {
          title: '维护记录',
          description: '记录紧急维护的全过程',
          duration: '0.5小时',
          responsible: '运维专员',
          inputs: ['修复记录', '停机记录'],
          outputs: ['紧急维护记录']
        }
      }
    }
  },
  'o2': {  // 客户整改需求
    title: '客户整改需求实现流程',
    description: '处理客户提出的设备整改需求的完整流程',
    isBackupEnabled: false,
    flowData: {
      nodes: [
        { id: 'start', type: 'circle', x: 100, y: 150, text: '开始', properties: { width: 60, height: 60 } },
        { id: 'step1', type: 'rect', x: 250, y: 150, text: '需求接收', properties: { width: 120, height: 60 } },
        { id: 'step2', type: 'rect', x: 400, y: 150, text: '需求分析', properties: { width: 120, height: 60 } },
        { id: 'step3', type: 'rect', x: 550, y: 150, text: '可行性评估', properties: { width: 120, height: 60 } },
        { id: 'step4', type: 'diamond', x: 700, y: 150, text: '是否可行', properties: { width: 100, height: 80 } },
        { id: 'step5', type: 'rect', x: 850, y: 150, text: '制定整改方案', properties: { width: 120, height: 60 } },
        { id: 'step6', type: 'rect', x: 1000, y: 150, text: '执行整改', properties: { width: 120, height: 60 } },
        { id: 'step7', type: 'rect', x: 700, y: 280, text: '需求反馈', properties: { width: 120, height: 60 } },
        { id: 'end', type: 'circle', x: 1150, y: 150, text: '结束', properties: { width: 60, height: 60 } }
      ],
      edges: [
        { id: 'e1', type: 'polyline', sourceNodeId: 'start', targetNodeId: 'step1' },
        { id: 'e2', type: 'polyline', sourceNodeId: 'step1', targetNodeId: 'step2' },
        { id: 'e3', type: 'polyline', sourceNodeId: 'step2', targetNodeId: 'step3' },
        { id: 'e4', type: 'polyline', sourceNodeId: 'step3', targetNodeId: 'step4' },
        { id: 'e5', type: 'polyline', text: '是', sourceNodeId: 'step4', targetNodeId: 'step5' },
        { id: 'e6', type: 'polyline', text: '否', sourceNodeId: 'step4', targetNodeId: 'step7' },
        { id: 'e7', type: 'polyline', sourceNodeId: 'step5', targetNodeId: 'step6' },
        { id: 'e8', type: 'polyline', sourceNodeId: 'step6', targetNodeId: 'end' },
        { id: 'e9', type: 'polyline', sourceNodeId: 'step7', targetNodeId: 'end' }
      ]
    },
    steps: {
      'step1': {
        title: '需求接收',
        description: '接收客户提出的整改需求',
        duration: '0.5天',
        responsible: '客服专员',
        inputs: ['客户需求单'],
        outputs: ['需求接收单']
      },
      'step2': {
        title: '需求分析',
        description: '分析客户需求的具体内容和技术要求',
        duration: '1天',
        responsible: '技术分析师',
        inputs: ['需求接收单'],
        outputs: ['需求分析报告']
      },
      'step3': {
        title: '可行性评估',
        description: '评估整改需求的技术可行性和成本',
        duration: '1-2天',
        responsible: '技术专家',
        inputs: ['需求分析报告'],
        outputs: ['可行性评估报告']
      },
      'step4': {
        title: '是否可行',
        description: '根据评估结果决定是否执行整改',
        duration: '0.5天',
        responsible: '技术主管',
        inputs: ['可行性评估报告'],
        outputs: ['可行性决定']
      },
      'step5': {
        title: '制定整改方案',
        description: '制定详细的整改实施方案',
        duration: '2-3天',
        responsible: '技术团队',
        inputs: ['可行性决定'],
        outputs: ['整改方案']
      },
      'step6': {
        title: '执行整改',
        description: '按照方案执行设备整改',
        duration: '3-7天',
        responsible: '维护技师',
        inputs: ['整改方案'],
        outputs: ['整改完成报告']
      },
      'step7': {
        title: '需求反馈',
        description: '向客户反馈不可行的原因',
        duration: '0.5天',
        responsible: '客服专员',
        inputs: ['可行性决定'],
        outputs: ['反馈报告']
      }
    }
  },
  'o3': {  // 故障报警
    title: '故障报警实现流程',
    description: '处理设备故障报警的完整响应流程',
    isBackupEnabled: false,
    flowData: {
      nodes: [
        { id: 'start', type: 'circle', x: 100, y: 150, text: '开始', properties: { width: 60, height: 60 } },
        { id: 'step1', type: 'rect', x: 250, y: 150, text: '报警接收', properties: { width: 120, height: 60 } },
        { id: 'step2', type: 'rect', x: 400, y: 150, text: '报警分析', properties: { width: 120, height: 60 } },
        { id: 'step3', type: 'diamond', x: 550, y: 150, text: '紧急程度', properties: { width: 100, height: 80 } },
        { id: 'step4', type: 'rect', x: 700, y: 100, text: '紧急处理', properties: { width: 120, height: 60 } },
        { id: 'step5', type: 'rect', x: 700, y: 200, text: '常规处理', properties: { width: 120, height: 60 } },
        { id: 'step6', type: 'rect', x: 850, y: 150, text: '故障排除', properties: { width: 120, height: 60 } },
        { id: 'step7', type: 'rect', x: 1000, y: 150, text: '报警记录', properties: { width: 120, height: 60 } },
        { id: 'end', type: 'circle', x: 1150, y: 150, text: '结束', properties: { width: 60, height: 60 } }
      ],
      edges: [
        { id: 'e1', type: 'polyline', sourceNodeId: 'start', targetNodeId: 'step1' },
        { id: 'e2', type: 'polyline', sourceNodeId: 'step1', targetNodeId: 'step2' },
        { id: 'e3', type: 'polyline', sourceNodeId: 'step2', targetNodeId: 'step3' },
        { id: 'e4', type: 'polyline', text: '紧急', sourceNodeId: 'step3', targetNodeId: 'step4' },
        { id: 'e5', type: 'polyline', text: '一般', sourceNodeId: 'step3', targetNodeId: 'step5' },
        { id: 'e6', type: 'polyline', sourceNodeId: 'step4', targetNodeId: 'step6' },
        { id: 'e7', type: 'polyline', sourceNodeId: 'step5', targetNodeId: 'step6' },
        { id: 'e8', type: 'polyline', sourceNodeId: 'step6', targetNodeId: 'step7' },
        { id: 'e9', type: 'polyline', sourceNodeId: 'step7', targetNodeId: 'end' }
      ]
    },
    steps: {
      'step1': {
        title: '报警接收',
        description: '监控系统接收设备故障报警信号',
        duration: '实时',
        responsible: '监控系统',
        inputs: ['设备报警信号'],
        outputs: ['报警记录']
      },
      'step2': {
        title: '报警分析',
        description: '分析报警信息确定故障类型和位置',
        duration: '0.5小时',
        responsible: '运维值班员',
        inputs: ['报警记录'],
        outputs: ['故障分析报告']
      },
      'step3': {
        title: '紧急程度',
        description: '评估故障的紧急程度',
        duration: '0.5小时',
        responsible: '运维值班员',
        inputs: ['故障分析报告'],
        outputs: ['紧急程度评级']
      },
      'step4': {
        title: '紧急处理',
        description: '启动紧急响应程序',
        duration: '1小时',
        responsible: '应急小组',
        inputs: ['紧急程度评级'],
        outputs: ['紧急处理记录']
      },
      'step5': {
        title: '常规处理',
        description: '按常规流程安排维修',
        duration: '2-4小时',
        responsible: '维护团队',
        inputs: ['紧急程度评级'],
        outputs: ['常规处理记录']
      },
      'step6': {
        title: '故障排除',
        description: '执行故障排除和修复',
        duration: '1-8小时',
        responsible: '维护技师',
        inputs: ['紧急处理记录', '常规处理记录'],
        outputs: ['故障排除记录']
      },
      'step7': {
        title: '报警记录',
        description: '记录整个报警处理过程',
        duration: '0.5小时',
        responsible: '运维专员',
        inputs: ['故障排除记录'],
        outputs: ['完整报警记录']
      }
    }
  }
}; 