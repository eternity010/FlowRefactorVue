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
    // 甘特图数据
    ganttData: {
      title: '里程数周期性维护项目计划',
      tasks: [
        { id: 1, name: '里程数检查', start: '2024-01-15', end: '2024-01-15', duration: 0.5, responsible: '运维专员', priority: 'medium' },
        { id: 2, name: '维护期判断', start: '2024-01-16', end: '2024-01-16', duration: 0.5, responsible: '运维专员', priority: 'medium', dependencies: [1] },
        { id: 3, name: '制定维护计划', start: '2024-01-17', end: '2024-01-17', duration: 1, responsible: '运维主管', priority: 'high', dependencies: [2] },
        { id: 4, name: '安排维护人员', start: '2024-01-18', end: '2024-01-18', duration: 0.5, responsible: '运维主管', priority: 'high', dependencies: [3] },
        { id: 5, name: '执行维护作业', start: '2024-01-19', end: '2024-01-21', duration: 3, responsible: '维护技师', priority: 'critical', dependencies: [4] },
        { id: 6, name: '维护记录', start: '2024-01-22', end: '2024-01-22', duration: 0.5, responsible: '维护技师', priority: 'medium', dependencies: [5] },
        { id: 7, name: '更新维护档案', start: '2024-01-23', end: '2024-01-23', duration: 0.5, responsible: '运维专员', priority: 'medium', dependencies: [6] }
      ],
      milestones: [
        { id: 'm1', name: '维护计划确认', date: '2024-01-17', type: 'planning' },
        { id: 'm2', name: '维护作业开始', date: '2024-01-19', type: 'execution' },
        { id: 'm3', name: '维护完成', date: '2024-01-23', type: 'completion' }
      ]
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
    },
    // 甘特图数据
    ganttData: {
      title: '客户整改需求处理计划',
      tasks: [
        { id: 1, name: '需求接收', start: '2024-01-15', end: '2024-01-15', duration: 0.5, responsible: '客服专员', priority: 'medium' },
        { id: 2, name: '需求分析', start: '2024-01-16', end: '2024-01-16', duration: 1, responsible: '技术分析师', priority: 'high', dependencies: [1] },
        { id: 3, name: '可行性评估', start: '2024-01-17', end: '2024-01-18', duration: 2, responsible: '技术专家', priority: 'high', dependencies: [2] },
        { id: 4, name: '制定整改方案', start: '2024-01-19', end: '2024-01-21', duration: 3, responsible: '技术团队', priority: 'critical', dependencies: [3] },
        { id: 5, name: '执行整改', start: '2024-01-22', end: '2024-01-28', duration: 7, responsible: '维护技师', priority: 'critical', dependencies: [4] }
      ],
      milestones: [
        { id: 'm1', name: '需求确认', date: '2024-01-16', type: 'planning' },
        { id: 'm2', name: '方案批准', date: '2024-01-21', type: 'planning' },
        { id: 'm3', name: '整改完成', date: '2024-01-28', type: 'completion' }
      ]
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
    },
    // 甘特图数据
    ganttData: {
      title: '故障报警处理计划',
      tasks: [
        { id: 1, name: '报警接收', start: '2024-01-15', end: '2024-01-15', duration: 0.1, responsible: '监控系统', priority: 'critical' },
        { id: 2, name: '报警分析', start: '2024-01-15', end: '2024-01-15', duration: 0.5, responsible: '运维值班员', priority: 'critical', dependencies: [1] },
        { id: 3, name: '紧急程度评估', start: '2024-01-15', end: '2024-01-15', duration: 0.5, responsible: '运维值班员', priority: 'critical', dependencies: [2] },
        { id: 4, name: '故障排除', start: '2024-01-15', end: '2024-01-16', duration: 1.5, responsible: '维护技师', priority: 'critical', dependencies: [3] },
        { id: 5, name: '报警记录', start: '2024-01-16', end: '2024-01-16', duration: 0.5, responsible: '运维专员', priority: 'medium', dependencies: [4] }
      ],
      milestones: [
        { id: 'm1', name: '故障确认', date: '2024-01-15', type: 'execution' },
        { id: 'm2', name: '故障解决', date: '2024-01-16', type: 'completion' }
      ]
    }
  },
  'o4': {  // 设备状态检查
    title: '设备状态检查实现流程',
    description: '定期对设备状态进行全面检查和评估的流程',
    isBackupEnabled: false,
    flowData: {
      nodes: [
        { id: 'start', type: 'circle', x: 100, y: 150, text: '开始', properties: { width: 60, height: 60 } },
        { id: 'step1', type: 'rect', x: 250, y: 150, text: '制定检查计划', properties: { width: 120, height: 60 } },
        { id: 'step2', type: 'rect', x: 400, y: 150, text: '设备外观检查', properties: { width: 120, height: 60 } },
        { id: 'step3', type: 'rect', x: 550, y: 150, text: '性能参数测试', properties: { width: 120, height: 60 } },
        { id: 'step4', type: 'rect', x: 700, y: 150, text: '运行数据分析', properties: { width: 120, height: 60 } },
        { id: 'step5', type: 'diamond', x: 850, y: 150, text: '是否正常', properties: { width: 100, height: 80 } },
        { id: 'step6', type: 'rect', x: 1000, y: 100, text: '生成检查报告', properties: { width: 120, height: 60 } },
        { id: 'step7', type: 'rect', x: 1000, y: 200, text: '记录异常情况', properties: { width: 120, height: 60 } },
        { id: 'step8', type: 'rect', x: 1150, y: 150, text: '归档记录', properties: { width: 120, height: 60 } },
        { id: 'end', type: 'circle', x: 1300, y: 150, text: '结束', properties: { width: 60, height: 60 } }
      ],
      edges: [
        { id: 'e1', type: 'polyline', sourceNodeId: 'start', targetNodeId: 'step1' },
        { id: 'e2', type: 'polyline', sourceNodeId: 'step1', targetNodeId: 'step2' },
        { id: 'e3', type: 'polyline', sourceNodeId: 'step2', targetNodeId: 'step3' },
        { id: 'e4', type: 'polyline', sourceNodeId: 'step3', targetNodeId: 'step4' },
        { id: 'e5', type: 'polyline', sourceNodeId: 'step4', targetNodeId: 'step5' },
        { id: 'e6', type: 'polyline', text: '正常', sourceNodeId: 'step5', targetNodeId: 'step6' },
        { id: 'e7', type: 'polyline', text: '异常', sourceNodeId: 'step5', targetNodeId: 'step7' },
        { id: 'e8', type: 'polyline', sourceNodeId: 'step6', targetNodeId: 'step8' },
        { id: 'e9', type: 'polyline', sourceNodeId: 'step7', targetNodeId: 'step8' },
        { id: 'e10', type: 'polyline', sourceNodeId: 'step8', targetNodeId: 'end' }
      ]
    },
    steps: {
      'step1': {
        title: '制定检查计划',
        description: '根据设备类型和检查标准制定详细的检查计划',
        duration: '0.5天',
        responsible: '运维主管',
        inputs: ['设备清单', '检查标准'],
        outputs: ['检查计划书']
      },
      'step2': {
        title: '设备外观检查',
        description: '检查设备外观是否有破损、腐蚀等问题',
        duration: '1天',
        responsible: '检查员',
        inputs: ['检查计划书'],
        outputs: ['外观检查记录']
      },
      'step3': {
        title: '性能参数测试',
        description: '使用专业设备测试各项性能参数',
        duration: '2天',
        responsible: '技术员',
        inputs: ['外观检查记录', '测试设备'],
        outputs: ['参数测试报告']
      },
      'step4': {
        title: '运行数据分析',
        description: '分析设备近期运行数据，识别潜在问题',
        duration: '1天',
        responsible: '数据分析师',
        inputs: ['参数测试报告', '历史运行数据'],
        outputs: ['运行数据分析报告']
      },
      'step5': {
        title: '是否正常',
        description: '综合评估设备状态是否正常',
        duration: '0.5天',
        responsible: '技术主管',
        inputs: ['运行数据分析报告'],
        outputs: ['状态评估结果']
      },
      'step6': {
        title: '生成检查报告',
        description: '设备状态正常时生成标准检查报告',
        duration: '0.5天',
        responsible: '运维专员',
        inputs: ['状态评估结果'],
        outputs: ['正常状态报告']
      },
      'step7': {
        title: '记录异常情况',
        description: '详细记录发现的异常情况并制定处理建议',
        duration: '1天',
        responsible: '运维专员',
        inputs: ['状态评估结果'],
        outputs: ['异常情况报告']
      },
      'step8': {
        title: '归档记录',
        description: '将检查结果归档到设备档案中',
        duration: '0.5天',
        responsible: '档案管理员',
        inputs: ['正常状态报告', '异常情况报告'],
        outputs: ['归档完成确认']
      }
    }
  },
  'o5': {  // 系统升级维护
    title: '系统升级维护实现流程',
    description: '对系统软件和硬件进行升级维护的完整流程',
    isBackupEnabled: false,
    flowData: {
      nodes: [
        { id: 'start', type: 'circle', x: 100, y: 150, text: '开始', properties: { width: 60, height: 60 } },
        { id: 'step1', type: 'rect', x: 250, y: 150, text: '升级需求评估', properties: { width: 120, height: 60 } },
        { id: 'step2', type: 'rect', x: 400, y: 150, text: '制定升级方案', properties: { width: 120, height: 60 } },
        { id: 'step3', type: 'rect', x: 550, y: 150, text: '系统备份', properties: { width: 120, height: 60 } },
        { id: 'step4', type: 'rect', x: 700, y: 150, text: '测试环境验证', properties: { width: 120, height: 60 } },
        { id: 'step5', type: 'diamond', x: 850, y: 150, text: '验证通过', properties: { width: 100, height: 80 } },
        { id: 'step6', type: 'rect', x: 1000, y: 150, text: '生产环境升级', properties: { width: 120, height: 60 } },
        { id: 'step7', type: 'rect', x: 1150, y: 150, text: '系统功能测试', properties: { width: 120, height: 60 } },
        { id: 'step8', type: 'rect', x: 850, y: 280, text: '方案调整', properties: { width: 120, height: 60 } },
        { id: 'end', type: 'circle', x: 1300, y: 150, text: '结束', properties: { width: 60, height: 60 } }
      ],
      edges: [
        { id: 'e1', type: 'polyline', sourceNodeId: 'start', targetNodeId: 'step1' },
        { id: 'e2', type: 'polyline', sourceNodeId: 'step1', targetNodeId: 'step2' },
        { id: 'e3', type: 'polyline', sourceNodeId: 'step2', targetNodeId: 'step3' },
        { id: 'e4', type: 'polyline', sourceNodeId: 'step3', targetNodeId: 'step4' },
        { id: 'e5', type: 'polyline', sourceNodeId: 'step4', targetNodeId: 'step5' },
        { id: 'e6', type: 'polyline', text: '是', sourceNodeId: 'step5', targetNodeId: 'step6' },
        { id: 'e7', type: 'polyline', text: '否', sourceNodeId: 'step5', targetNodeId: 'step8' },
        { id: 'e8', type: 'polyline', sourceNodeId: 'step6', targetNodeId: 'step7' },
        { id: 'e9', type: 'polyline', sourceNodeId: 'step7', targetNodeId: 'end' },
        { id: 'e10', type: 'polyline', sourceNodeId: 'step8', targetNodeId: 'step2' }
      ]
    },
    steps: {
      'step1': {
        title: '升级需求评估',
        description: '评估系统升级的必要性和可行性',
        duration: '1-2天',
        responsible: '系统架构师',
        inputs: ['升级需求单', '当前系统状态'],
        outputs: ['需求评估报告']
      },
      'step2': {
        title: '制定升级方案',
        description: '制定详细的系统升级实施方案',
        duration: '2-3天',
        responsible: '技术团队',
        inputs: ['需求评估报告'],
        outputs: ['升级方案书']
      },
      'step3': {
        title: '系统备份',
        description: '对现有系统进行完整备份',
        duration: '0.5-1天',
        responsible: '运维工程师',
        inputs: ['升级方案书'],
        outputs: ['系统备份文件']
      },
      'step4': {
        title: '测试环境验证',
        description: '在测试环境中验证升级方案',
        duration: '2-3天',
        responsible: '测试工程师',
        inputs: ['升级方案书', '系统备份文件'],
        outputs: ['测试验证报告']
      },
      'step5': {
        title: '验证通过',
        description: '评估测试结果是否达到升级要求',
        duration: '0.5天',
        responsible: '技术主管',
        inputs: ['测试验证报告'],
        outputs: ['验证结果']
      },
      'step6': {
        title: '生产环境升级',
        description: '在生产环境执行系统升级',
        duration: '1-2天',
        responsible: '运维工程师',
        inputs: ['验证结果'],
        outputs: ['升级实施记录']
      },
      'step7': {
        title: '系统功能测试',
        description: '测试升级后系统的各项功能',
        duration: '1天',
        responsible: '测试工程师',
        inputs: ['升级实施记录'],
        outputs: ['功能测试报告']
      },
      'step8': {
        title: '方案调整',
        description: '根据测试结果调整升级方案',
        duration: '1-2天',
        responsible: '技术团队',
        inputs: ['测试验证报告'],
        outputs: ['调整后方案']
      }
    },
    backupImplementation: {
      title: '紧急回滚流程',
      description: '升级失败时的紧急回滚恢复流程',
      flowData: {
        nodes: [
          { id: 'start', type: 'circle', x: 100, y: 150, text: '开始', properties: { width: 60, height: 60 } },
          { id: 'step1', type: 'rect', x: 250, y: 150, text: '问题确认', properties: { width: 120, height: 60 } },
          { id: 'step2', type: 'rect', x: 400, y: 150, text: '启动回滚', properties: { width: 120, height: 60 } },
          { id: 'step3', type: 'rect', x: 550, y: 150, text: '恢复备份', properties: { width: 120, height: 60 } },
          { id: 'step4', type: 'rect', x: 700, y: 150, text: '系统验证', properties: { width: 120, height: 60 } },
          { id: 'step5', type: 'rect', x: 850, y: 150, text: '服务恢复', properties: { width: 120, height: 60 } },
          { id: 'end', type: 'circle', x: 1000, y: 150, text: '结束', properties: { width: 60, height: 60 } }
        ],
        edges: [
          { id: 'e1', type: 'polyline', sourceNodeId: 'start', targetNodeId: 'step1' },
          { id: 'e2', type: 'polyline', sourceNodeId: 'step1', targetNodeId: 'step2' },
          { id: 'e3', type: 'polyline', sourceNodeId: 'step2', targetNodeId: 'step3' },
          { id: 'e4', type: 'polyline', sourceNodeId: 'step3', targetNodeId: 'step4' },
          { id: 'e5', type: 'polyline', sourceNodeId: 'step4', targetNodeId: 'step5' },
          { id: 'e6', type: 'polyline', sourceNodeId: 'step5', targetNodeId: 'end' }
        ]
      },
      steps: {
        'step1': {
          title: '问题确认',
          description: '确认升级过程中出现的问题',
          duration: '0.5小时',
          responsible: '运维主管',
          inputs: ['问题报告'],
          outputs: ['问题确认书']
        },
        'step2': {
          title: '启动回滚',
          description: '立即启动系统回滚程序',
          duration: '0.5小时',
          responsible: '运维工程师',
          inputs: ['问题确认书'],
          outputs: ['回滚启动记录']
        },
        'step3': {
          title: '恢复备份',
          description: '从备份文件恢复系统到升级前状态',
          duration: '1-2小时',
          responsible: '运维工程师',
          inputs: ['回滚启动记录', '系统备份文件'],
          outputs: ['恢复完成记录']
        },
        'step4': {
          title: '系统验证',
          description: '验证回滚后系统功能是否正常',
          duration: '1小时',
          responsible: '测试工程师',
          inputs: ['恢复完成记录'],
          outputs: ['系统验证报告']
        },
        'step5': {
          title: '服务恢复',
          description: '恢复对外服务，通知相关人员',
          duration: '0.5小时',
          responsible: '运维工程师',
          inputs: ['系统验证报告'],
          outputs: ['服务恢复通知']
        }
      }
    }
  },
  'o6': {  // 安全巡检
    title: '安全巡检实现流程',
    description: '定期进行安全巡检，确保系统和设备安全运行的流程',
    isBackupEnabled: false,
    flowData: {
      nodes: [
        { id: 'start', type: 'circle', x: 100, y: 150, text: '开始', properties: { width: 60, height: 60 } },
        { id: 'step1', type: 'rect', x: 250, y: 150, text: '制定巡检路线', properties: { width: 120, height: 60 } },
        { id: 'step2', type: 'rect', x: 400, y: 150, text: '设备安全检查', properties: { width: 120, height: 60 } },
        { id: 'step3', type: 'rect', x: 550, y: 150, text: '环境安全检查', properties: { width: 120, height: 60 } },
        { id: 'step4', type: 'rect', x: 700, y: 150, text: '网络安全检查', properties: { width: 120, height: 60 } },
        { id: 'step5', type: 'diamond', x: 850, y: 150, text: '发现隐患', properties: { width: 100, height: 80 } },
        { id: 'step6', type: 'rect', x: 1000, y: 100, text: '隐患处理', properties: { width: 120, height: 60 } },
        { id: 'step7', type: 'rect', x: 1000, y: 200, text: '正常记录', properties: { width: 120, height: 60 } },
        { id: 'step8', type: 'rect', x: 1150, y: 150, text: '巡检总结', properties: { width: 120, height: 60 } },
        { id: 'end', type: 'circle', x: 1300, y: 150, text: '结束', properties: { width: 60, height: 60 } }
      ],
      edges: [
        { id: 'e1', type: 'polyline', sourceNodeId: 'start', targetNodeId: 'step1' },
        { id: 'e2', type: 'polyline', sourceNodeId: 'step1', targetNodeId: 'step2' },
        { id: 'e3', type: 'polyline', sourceNodeId: 'step2', targetNodeId: 'step3' },
        { id: 'e4', type: 'polyline', sourceNodeId: 'step3', targetNodeId: 'step4' },
        { id: 'e5', type: 'polyline', sourceNodeId: 'step4', targetNodeId: 'step5' },
        { id: 'e6', type: 'polyline', text: '是', sourceNodeId: 'step5', targetNodeId: 'step6' },
        { id: 'e7', type: 'polyline', text: '否', sourceNodeId: 'step5', targetNodeId: 'step7' },
        { id: 'e8', type: 'polyline', sourceNodeId: 'step6', targetNodeId: 'step8' },
        { id: 'e9', type: 'polyline', sourceNodeId: 'step7', targetNodeId: 'step8' },
        { id: 'e10', type: 'polyline', sourceNodeId: 'step8', targetNodeId: 'end' }
      ]
    },
    steps: {
      'step1': {
        title: '制定巡检路线',
        description: '根据区域和设备分布制定巡检路线',
        duration: '0.5天',
        responsible: '安全主管',
        inputs: ['设备分布图', '安全检查清单'],
        outputs: ['巡检路线图']
      },
      'step2': {
        title: '设备安全检查',
        description: '检查设备运行状态和安全防护措施',
        duration: '1-2天',
        responsible: '安全巡检员',
        inputs: ['巡检路线图'],
        outputs: ['设备安全检查记录']
      },
      'step3': {
        title: '环境安全检查',
        description: '检查工作环境的安全状况',
        duration: '1天',
        responsible: '安全巡检员',
        inputs: ['设备安全检查记录'],
        outputs: ['环境安全检查记录']
      },
      'step4': {
        title: '网络安全检查',
        description: '检查网络系统的安全状况',
        duration: '1天',
        responsible: '网络安全专员',
        inputs: ['环境安全检查记录'],
        outputs: ['网络安全检查记录']
      },
      'step5': {
        title: '发现隐患',
        description: '评估是否发现安全隐患',
        duration: '0.5天',
        responsible: '安全主管',
        inputs: ['各项检查记录'],
        outputs: ['隐患评估结果']
      },
      'step6': {
        title: '隐患处理',
        description: '对发现的安全隐患进行处理',
        duration: '1-3天',
        responsible: '相关技术人员',
        inputs: ['隐患评估结果'],
        outputs: ['隐患处理记录']
      },
      'step7': {
        title: '正常记录',
        description: '记录巡检正常情况',
        duration: '0.5天',
        responsible: '安全巡检员',
        inputs: ['隐患评估结果'],
        outputs: ['正常巡检记录']
      },
      'step8': {
        title: '巡检总结',
        description: '汇总巡检结果并形成总结报告',
        duration: '0.5天',
        responsible: '安全主管',
        inputs: ['隐患处理记录', '正常巡检记录'],
        outputs: ['巡检总结报告']
      }
    }
  }
}; 