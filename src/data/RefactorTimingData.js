// 重构时机判断数据

// 时刻1数据 - 系统状态需要重构
export const moment1Data = {
  // 风险数据
  riskData: {
    totalRisks: 24,
    highRisks: 5,
    mediumRisks: 12,
    lowRisks: 7,
    // 添加详细风险事项列表
    riskDetails: [
      {
        id: 'R001',
        name: '采购流程人员风险管控缺失',
        level: 'high',
        type: '采购风险',
        description: '采购流程缺乏人员风险管控机制，人员不足时无应急预案，影响流程连续性',
        impact: '人员短缺导致采购中断，预计影响交付周期20-30天',
        probability: '85%',
        detectionTime: '2024-01-15 10:30',
        responsibleDept: '采购部',
        status: '待处理'
      },
      {
        id: 'R002',
        name: '供应链关税风险暴露',
        level: 'high',
        type: '采购风险',
        description: '供应商过度依赖美国，面临关税风险，缺乏多元化供应链布局',
        impact: '关税成本上升15-25%，供应链中断风险高',
        probability: '90%',
        detectionTime: '2024-01-16 14:20',
        responsibleDept: '供应链管理部',
        status: '制定多元化方案'
      },
      {
        id: 'R003',
        name: '故障分析单一化风险',
        level: 'high',
        type: '运维风险',
        description: '故障报警仅依赖人工分析，缺乏AI智能分析验证，可靠性不足',
        impact: '误判率高达30%，紧急故障响应延迟，损失约200万/次',
        probability: '70%',
        detectionTime: '2024-01-14 09:00',
        responsibleDept: '运维部',
        status: '评估AI方案'
      },
      {
        id: 'R004',
        name: '政策合规检查缺失',
        level: 'high',
        type: '合规风险',
        description: '客户整改流程缺乏政策合规检查，新政策影响评估不足',
        impact: '合规风险增加，可能面临监管处罚和业务中断',
        probability: '82%',
        detectionTime: '2024-01-13 16:45',
        responsibleDept: '合规部',
        status: '建立合规机制'
      },
      {
        id: 'R005',
        name: '流程智能化程度低',
        level: 'high',
        type: '运维风险',
        description: '缺乏智能化派单和自动记录系统，依赖人工操作效率低',
        impact: '处理效率低下25%，人工成本增加，错误率高',
        probability: '75%',
        detectionTime: '2024-01-12 11:15',
        responsibleDept: '信息技术部',
        status: '规划智能化升级'
      },
      {
        id: 'R006',
        name: '人员培训机制不完善',
        level: 'medium',
        type: '人力资源风险',
        description: '缺乏快速培训和人员调动机制，新员工上岗周期长',
        impact: '人员替换效率低，影响业务连续性15-20%',
        probability: '90%',
        detectionTime: '2024-01-17 08:30',
        responsibleDept: '人力资源部',
        status: '优化培训体系'
      },
      {
        id: 'R007',
        name: '应急预案执行力不足',
        level: 'medium',
        type: '管理风险',
        description: '各部门应急预案缺乏统一标准，执行效率和协调性待提升',
        impact: '应急响应时间延长30%，处理效果不理想',
        probability: '65%',
        detectionTime: '2024-01-16 13:20',
        responsibleDept: '运营管理部',
        status: '完善应急机制'
      },
      {
        id: 'R008',
        name: '流程标准化程度不够',
        level: 'medium',
        type: '流程风险',
        description: '各业务流程标准化程度参差不齐，影响自动化改造进度',
        impact: '智能化升级困难，改造成本增加25%',
        probability: '60%',
        detectionTime: '2024-01-15 15:45',
        responsibleDept: '流程管理部',
        status: '推进标准化'
      }
    ]
  },
  
  // 子流程数据
  subprocessData: {
    totalSubprocesses: 32,
    operationCount: 8,
    purchaseCount: 7,
    productionCount: 10,
    marketingCount: 7
  },
  
  // 预测运行时间数据
  predictionData: {
    planTime: 268,
    actualTime: 254.91,
    schemeA: {
      time: 252.92,
      error: "-0.78%"
    },
    schemeB: {
      time: 253.20,
      error: "-0.67%"  
    },
    schemeC: {
      time: 294.75,
      error: "15.63%"
    }
  },

  // 模型运行状态
  modelStatus: {
    isRunning: true,
    runningTime: "6小时42分钟",
    cpuUsage: 68,
    memoryUsage: "4.2GB / 8GB",
    processingSpeed: "125流程/秒"
  },

  // 分析结果 - 需要重构
  analysisResults: {
    refactorNecessity: 81,
    recommendedPriority: 85,
    resourceRequirement: 65,
    implementationDifficulty: 58
  },

  // 重构建议 - 重构需求高
  recommendations: [
    {
      priority: "优先",
      type: "danger",
      content: "采购流程重构优化 - 增加人员风险管控环节，建立应急预案机制"
    },
    {
      priority: "优先", 
      type: "danger",
      content: "供应商选择流程重构 - 应对关税风险，建立多元化供应链策略"
    },
    {
      priority: "重要",
      type: "warning",
      content: "故障报警流程重构 - 引入AI智能分析，建立双重验证机制"
    },
    {
      priority: "重要",
      type: "warning", 
      content: "客户整改需求流程重构 - 增加政策合规检查和风险评估环节"
    },
    {
      priority: "建议",
      type: "info",
      content: "优化人员调动和培训机制，提升流程连续性"
    },
    {
      priority: "建议",
      type: "info", 
      content: "建立智能化派单和自动记录系统"
    }
  ],

  // 总体建议 - 需要重构
  overallRecommendation: "当前流程存在明显优化空间，建议在3个月内完成重构。优先解决采购流程人员风险管控和供应链多元化问题，引入AI智能分析提升故障处理效率，加强政策合规检查机制。预计重构后可提升整体效率35%，降低风险事件发生率40%。"
};

// 时刻2数据 - 重构后状态良好
export const moment2Data = {
  // 风险数据 - 风险较少
  riskData: {
    totalRisks: 12,
    highRisks: 1,
    mediumRisks: 4,
    lowRisks: 7,
    // 时刻2的风险事项列表 - 风险较少且等级较低
    riskDetails: [
      {
        id: 'R001',
        name: '供应商备件库存不足',
        level: 'high',
        type: '采购风险',
        description: '部分备件供应商库存水平偏低，需要关注补充',
        impact: '可能影响设备维护时效，预计影响轻微',
        probability: '45%',
        detectionTime: '2024-01-18 09:15',
        responsibleDept: '采购部',
        status: '已制定补充计划'
      },
      {
        id: 'R002',
        name: '市场竞争加剧',
        level: 'medium',
        type: '营销风险',
        description: '竞争对手推出新产品，市场竞争程度有所加剧',
        impact: '可能影响市场份额，需要关注产品竞争力',
        probability: '55%',
        detectionTime: '2024-01-17 14:30',
        responsibleDept: '市场部',
        status: '制定应对策略'
      },
      {
        id: 'R003',
        name: '运维人员技能更新需求',
        level: 'medium',
        type: '运维风险',
        description: '随着设备智能化升级，运维人员需要技能培训',
        impact: '短期内可能影响运维效率，需要培训支持',
        probability: '60%',
        detectionTime: '2024-01-16 11:20',
        responsibleDept: '人力资源部',
        status: '安排培训计划'
      },
      {
        id: 'R004',
        name: '季节性需求波动',
        level: 'medium',
        type: '生产风险',
        description: '预计下季度订单可能出现季节性波动',
        impact: '需要调整生产计划以适应需求变化',
        probability: '50%',
        detectionTime: '2024-01-15 16:00',
        responsibleDept: '生产计划部',
        status: '制定弹性生产方案'
      },
      {
        id: 'R005',
        name: '新产品研发进度',
        level: 'low',
        type: '研发风险',
        description: '新产品研发项目进度正常，需要定期跟踪',
        impact: '进度正常，按计划推进即可',
        probability: '30%',
        detectionTime: '2024-01-14 10:45',
        responsibleDept: '研发部',
        status: '正常跟踪'
      }
    ]
  },
  
  // 子流程数据 - 数量合理
  subprocessData: {
    totalSubprocesses: 28,
    operationCount: 7,
    purchaseCount: 6,
    productionCount: 9,
    marketingCount: 6
  },
  
  // 预测运行时间数据 - 优化后的数据
  predictionData: {
    planTime: 268,
    actualTime: 264.71,
    schemeA: {
      time: 262.84,
      error: "-0.78%"
    },
    schemeB: {
      time: 263.14,
      error: "-0.67%"  
    },
    schemeC: {
      time: 306.31,
      error: "15.63%"
    }
  },

  // 模型运行状态 - 状态良好
  modelStatus: {
    isRunning: true,
    runningTime: "8小时15分钟",
    cpuUsage: 42,
    memoryUsage: "3.1GB / 8GB",
    processingSpeed: "168流程/秒"
  },

  // 分析结果 - 无需重构
  analysisResults: {
    refactorNecessity: 25,
    recommendedPriority: 22,
    resourceRequirement: 30,
    implementationDifficulty: 45
  },

  // 重构建议 - 只有小优化
  recommendations: [
    {
      priority: "建议",
      type: "info",
      content: "定期检查采购流程性能"
    },
    {
      priority: "建议",
      type: "info",
      content: "优化资源分配策略"
    },
    {
      priority: "可选",
      type: "success",
      content: "文档更新与维护"
    },
    {
      priority: "可选",
      type: "success",
      content: "考虑增加新业务场景支持"
    }
  ],

  // 总体建议 - 系统状态良好
  overallRecommendation: "当前流程运行良好，各指标均在正常范围内。暂不需要进行重构，可考虑针对性能和维护性进行小幅优化。建议6个月后重新评估。"
};

// 导出默认当前数据
export default moment1Data; 