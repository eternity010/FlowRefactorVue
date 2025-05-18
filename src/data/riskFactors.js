// Risk factors data based on the Bayesian network model from the research document
export const riskFactors = [
  // Unstable and Uncertain Environment (不稳定不确定环境)
  { id: 'UUE01', name: '突发公共卫生事件', category: '不稳定不确定环境', enCategory: 'Unstable Environment' },
  { id: 'UUE02', name: '突发自然灾害', category: '不稳定不确定环境', enCategory: 'Unstable Environment' },
  { id: 'UUE03', name: '地缘政治紧张', category: '不稳定不确定环境', enCategory: 'Unstable Environment' },
  { id: 'UUE04', name: '宏观经济恶化', category: '不稳定不确定环境', enCategory: 'Unstable Environment' },
  
  // R&D Risk (研发风险)
  { id: 'RDR01', name: '高端装备研发人才流失', category: '研发风险', enCategory: 'R&D Risk' },
  { id: 'RDR02', name: '重大技术路线决策失误', category: '研发风险', enCategory: 'R&D Risk' },
  { id: 'RDR03', name: '关键研发设备投入不足', category: '研发风险', enCategory: 'R&D Risk' },
  { id: 'RDR04', name: '重大装备研发周期超期', category: '研发风险', enCategory: 'R&D Risk' },
  
  // Procurement Risk (采购风险)
  { id: 'PCR01', name: '核心零部件断供', category: '采购风险', enCategory: 'Procurement Risk' },
  { id: 'PCR02', name: '关键原材料依赖进口', category: '采购风险', enCategory: 'Procurement Risk' },
  { id: 'PCR03', name: '精密原材料质量不达标', category: '采购风险', enCategory: 'Procurement Risk' },
  { id: 'PCR04', name: '专用件交货时间延误', category: '采购风险', enCategory: 'Procurement Risk' },
  { id: 'PCR05', name: '关键战略材料价格上涨', category: '采购风险', enCategory: 'Procurement Risk' },
  { id: 'PCR06', name: '供应商集中度过高', category: '采购风险', enCategory: 'Procurement Risk' },
  { id: 'PCR07', name: '核心装备供应商破产', category: '采购风险', enCategory: 'Procurement Risk' },
  { id: 'PCR08', name: '项目采购需求不明确', category: '采购风险', enCategory: 'Procurement Risk' },
  { id: 'PCR09', name: '进口运费价格上涨', category: '采购风险', enCategory: 'Procurement Risk' },
  { id: 'PCR10', name: '供应商过于分散', category: '采购风险', enCategory: 'Procurement Risk' },
  { id: 'PCR11', name: '核心供应商信息缺失', category: '采购风险', enCategory: 'Procurement Risk' },
  { id: 'PCR12', name: '关键原材料贸易限制', category: '采购风险', enCategory: 'Procurement Risk' },
  { id: 'PCR13', name: '高额原材料库存积压', category: '采购风险', enCategory: 'Procurement Risk' },
  { id: 'PCR14', name: '供应商供货能力不足', category: '采购风险', enCategory: 'Procurement Risk' },
  { id: 'PCR15', name: '特种材料计量偏差', category: '采购风险', enCategory: 'Procurement Risk' },
  { id: 'PCR16', name: '专用件采购计划编制延误', category: '采购风险', enCategory: 'Procurement Risk' },
  
  // Production Risk (生产风险)
  { id: 'PDR01', name: '设备操作安全事故', category: '生产风险', enCategory: 'Production Risk' },
  { id: 'PDR02', name: '设备产能弹性不足', category: '生产风险', enCategory: 'Production Risk' },
  { id: 'PDR03', name: '智能制造设备迭代滞后', category: '生产风险', enCategory: 'Production Risk' },
  { id: 'PDR04', name: '精密加工设备故障', category: '生产风险', enCategory: 'Production Risk' },
  
  // Marketing Risk (营销风险)
  { id: 'MKR01', name: '重大装备需求萎缩', category: '营销风险', enCategory: 'Marketing Risk' },
  { id: 'MKR02', name: '市场信息更新不及时', category: '营销风险', enCategory: 'Marketing Risk' },
  { id: 'MKR03', name: '装备市场竞争加剧', category: '营销风险', enCategory: 'Marketing Risk' },
  { id: 'MKR04', name: '装备市场份额下降', category: '营销风险', enCategory: 'Marketing Risk' },
  
  // Operation & Maintenance Risk (运维风险)
  { id: 'OMR01', name: '智能运维系统技术滞后', category: '运维风险', enCategory: 'O&M Risk' },
  { id: 'OMR02', name: '全生命周期运维体系缺失', category: '运维风险', enCategory: 'O&M Risk' },
  { id: 'OMR03', name: '专用备件供应链断裂', category: '运维风险', enCategory: 'O&M Risk' },
  { id: 'OMR04', name: '运维服务响应延迟', category: '运维风险', enCategory: 'O&M Risk' },
  
  // Cash Flow (现金流)
  { id: 'CFD', name: '现金流恶化', category: '财务风险', enCategory: 'Financial Risk' }
];

// Business activity data linked to risk factors
export const businessActivities = [
  { 
    id: 'BA001', 
    name: '项目制采购发起', 
    process: '采购', 
    enProcess: 'Procurement',
    relatedRiskFactors: ['PCR08'] 
  },
  { 
    id: 'BA002', 
    name: '战略安全库存评估', 
    process: '采购', 
    enProcess: 'Procurement',
    relatedRiskFactors: ['PCR13', 'PCR15'] 
  },
  { 
    id: 'BA003', 
    name: '制定装备采购计划', 
    process: '采购', 
    enProcess: 'Procurement',
    relatedRiskFactors: ['PCR11', 'PCR16'] 
  },
  { 
    id: 'BA004', 
    name: '供应商资质核验与选择', 
    process: '采购', 
    enProcess: 'Procurement',
    relatedRiskFactors: ['PCR02', 'PCR06', 'PCR07', 'PCR12'] 
  },
  { 
    id: 'BA005', 
    name: '样件核验与签约', 
    process: '采购', 
    enProcess: 'Procurement',
    relatedRiskFactors: ['PCR05', 'PCR09'] 
  },
  { 
    id: 'BA006', 
    name: '质检验收', 
    process: '采购', 
    enProcess: 'Procurement',
    relatedRiskFactors: ['PCR01', 'PCR03', 'PCR04', 'PCR14'] 
  },
  { 
    id: 'BA007', 
    name: '款项结算', 
    process: '采购', 
    enProcess: 'Procurement',
    relatedRiskFactors: ['CFD'] 
  },
  { 
    id: 'BA008', 
    name: '质量追溯与供应商管理', 
    process: '采购', 
    enProcess: 'Procurement',
    relatedRiskFactors: ['PCR06', 'PCR07', 'PCR10'] 
  },
  { 
    id: 'BA009', 
    name: '生产计划制定', 
    process: '生产', 
    enProcess: 'Production',
    relatedRiskFactors: ['PDR02', 'PDR03'] 
  },
  { 
    id: 'BA010', 
    name: '设备操作与监控', 
    process: '生产', 
    enProcess: 'Production',
    relatedRiskFactors: ['PDR01', 'PDR04'] 
  },
  { 
    id: 'BA011', 
    name: '市场需求分析', 
    process: '营销', 
    enProcess: 'Marketing',
    relatedRiskFactors: ['MKR01', 'MKR02'] 
  },
  { 
    id: 'BA012', 
    name: '销售策略制定', 
    process: '营销', 
    enProcess: 'Marketing',
    relatedRiskFactors: ['MKR03', 'MKR04'] 
  },
  { 
    id: 'BA013', 
    name: '设备运维规划', 
    process: '运维', 
    enProcess: 'Maintenance',
    relatedRiskFactors: ['OMR01', 'OMR02'] 
  },
  { 
    id: 'BA014', 
    name: '备件管理与故障响应', 
    process: '运维', 
    enProcess: 'Maintenance',
    relatedRiskFactors: ['OMR03', 'OMR04'] 
  },
  { 
    id: 'BA015', 
    name: '研发投入管理', 
    process: '研发', 
    enProcess: 'R&D',
    relatedRiskFactors: ['RDR03'] 
  },
  { 
    id: 'BA016', 
    name: '技术路线决策', 
    process: '研发', 
    enProcess: 'R&D',
    relatedRiskFactors: ['RDR02'] 
  },
  { 
    id: 'BA017', 
    name: '研发人才管理', 
    process: '研发', 
    enProcess: 'R&D',
    relatedRiskFactors: ['RDR01'] 
  },
  { 
    id: 'BA018', 
    name: '项目研发管理', 
    process: '研发', 
    enProcess: 'R&D',
    relatedRiskFactors: ['RDR04'] 
  }
];

// Risk network data representing relationships between risk factors
export const riskNetwork = [
  { source: 'UUE01', target: 'PCR01', weight: 0.75 },
  { source: 'UUE01', target: 'PCR04', weight: 0.68 },
  { source: 'UUE01', target: 'PCR14', weight: 0.72 },
  { source: 'UUE03', target: 'PCR02', weight: 0.85 },
  { source: 'UUE03', target: 'PCR12', weight: 0.91 },
  { source: 'UUE04', target: 'CFD', weight: 0.77 },
  { source: 'UUE04', target: 'PCR05', weight: 0.65 },
  { source: 'UUE04', target: 'PCR09', weight: 0.58 },
  { source: 'PCR01', target: 'PCR04', weight: 0.63 },
  { source: 'PCR02', target: 'PCR05', weight: 0.71 },
  { source: 'PCR06', target: 'PCR07', weight: 0.55 },
  { source: 'PCR11', target: 'PCR16', weight: 0.62 },
  { source: 'PCR13', target: 'PCR15', weight: 0.48 },
  { source: 'PCR03', target: 'PCR15', weight: 0.52 },
  { source: 'PDR02', target: 'PDR04', weight: 0.59 },
  { source: 'PDR03', target: 'OMR01', weight: 0.67 },
  { source: 'MKR01', target: 'MKR04', weight: 0.78 },
  { source: 'MKR03', target: 'MKR04', weight: 0.81 },
  { source: 'OMR03', target: 'OMR04', weight: 0.73 },
  { source: 'RDR01', target: 'RDR04', weight: 0.69 }
];

// Sample risk monitoring data
export const riskMonitoringData = [
  {
    riskFactorId: 'PCR01',
    timestamp: '2024-05-01T08:00:00',
    confidenceLevel: 0.78,
    trend: 'up',
    alertStatus: 'red',
    relatedBusinessActivities: ['BA006'],
    historicalData: [
      { date: '2024-04-30', value: 0.71 },
      { date: '2024-04-29', value: 0.69 },
      { date: '2024-04-28', value: 0.65 }
    ],
    cvarValue: 10.15,
    threshold: { warning: 0.65, alert: 0.75 }
  },
  {
    riskFactorId: 'PCR02',
    timestamp: '2024-05-01T08:00:00',
    confidenceLevel: 0.92,
    trend: 'up',
    alertStatus: 'red',
    relatedBusinessActivities: ['BA004'],
    historicalData: [
      { date: '2024-04-30', value: 0.89 },
      { date: '2024-04-29', value: 0.86 },
      { date: '2024-04-28', value: 0.84 }
    ],
    cvarValue: 8.91,
    threshold: { warning: 0.80, alert: 0.90 }
  },
  {
    riskFactorId: 'PCR05',
    timestamp: '2024-05-01T08:00:00',
    confidenceLevel: 0.83,
    trend: 'up',
    alertStatus: 'yellow',
    relatedBusinessActivities: ['BA005'],
    historicalData: [
      { date: '2024-04-30', value: 0.78 },
      { date: '2024-04-29', value: 0.76 },
      { date: '2024-04-28', value: 0.75 }
    ],
    cvarValue: 9.68,
    threshold: { warning: 0.75, alert: 0.85 }
  },
  {
    riskFactorId: 'PCR08',
    timestamp: '2024-05-01T08:00:00',
    confidenceLevel: 0.55,
    trend: 'down',
    alertStatus: 'normal',
    relatedBusinessActivities: ['BA001'],
    historicalData: [
      { date: '2024-04-30', value: 0.58 },
      { date: '2024-04-29', value: 0.61 },
      { date: '2024-04-28', value: 0.64 }
    ],
    cvarValue: 2.32,
    threshold: { warning: 0.60, alert: 0.75 }
  },
  {
    riskFactorId: 'PDR01',
    timestamp: '2024-05-01T08:00:00',
    confidenceLevel: 0.72,
    trend: 'up',
    alertStatus: 'yellow',
    relatedBusinessActivities: ['BA010'],
    historicalData: [
      { date: '2024-04-30', value: 0.69 },
      { date: '2024-04-29', value: 0.67 },
      { date: '2024-04-28', value: 0.65 }
    ],
    cvarValue: 7.43,
    threshold: { warning: 0.65, alert: 0.80 }
  },
  {
    riskFactorId: 'MKR01',
    timestamp: '2024-05-01T08:00:00',
    confidenceLevel: 0.68,
    trend: 'up',
    alertStatus: 'yellow',
    relatedBusinessActivities: ['BA011'],
    historicalData: [
      { date: '2024-04-30', value: 0.66 },
      { date: '2024-04-29', value: 0.64 },
      { date: '2024-04-28', value: 0.62 }
    ],
    cvarValue: 6.71,
    threshold: { warning: 0.65, alert: 0.80 }
  },
  {
    riskFactorId: 'UUE03',
    timestamp: '2024-05-01T08:00:00',
    confidenceLevel: 0.87,
    trend: 'up',
    alertStatus: 'red',
    relatedBusinessActivities: [],
    historicalData: [
      { date: '2024-04-30', value: 0.83 },
      { date: '2024-04-29', value: 0.79 },
      { date: '2024-04-28', value: 0.75 }
    ],
    cvarValue: 9.51,
    threshold: { warning: 0.75, alert: 0.85 }
  },
  {
    riskFactorId: 'OMR03',
    timestamp: '2024-05-01T08:00:00',
    confidenceLevel: 0.73,
    trend: 'up',
    alertStatus: 'yellow',
    relatedBusinessActivities: ['BA014'],
    historicalData: [
      { date: '2024-04-30', value: 0.71 },
      { date: '2024-04-29', value: 0.69 },
      { date: '2024-04-28', value: 0.67 }
    ],
    cvarValue: 6.49,
    threshold: { warning: 0.70, alert: 0.85 }
  },
  {
    riskFactorId: 'RDR01',
    timestamp: '2024-05-01T08:00:00',
    confidenceLevel: 0.61,
    trend: 'down',
    alertStatus: 'normal',
    relatedBusinessActivities: ['BA017'],
    historicalData: [
      { date: '2024-04-30', value: 0.64 },
      { date: '2024-04-29', value: 0.67 },
      { date: '2024-04-28', value: 0.70 }
    ],
    cvarValue: 3.82,
    threshold: { warning: 0.65, alert: 0.80 }
  },
  {
    riskFactorId: 'PCR03',
    timestamp: '2024-05-01T08:00:00',
    confidenceLevel: 0.66,
    trend: 'up',
    alertStatus: 'yellow',
    relatedBusinessActivities: ['BA006'],
    historicalData: [
      { date: '2024-04-30', value: 0.63 },
      { date: '2024-04-29', value: 0.60 },
      { date: '2024-04-28', value: 0.58 }
    ],
    cvarValue: 5.83,
    threshold: { warning: 0.60, alert: 0.75 }
  }
];

// Risk CVaR data at different confidence levels
export const riskCVaRData = {
  businessActivities: [
    'BA001', 'BA002', 'BA003', 'BA004', 'BA005', 'BA006', 'BA007', 'BA008'
  ],
  businessActivityNames: [
    '项目制采购发起', '战略安全库存评估', '制定装备采购计划', '供应商资质核验与选择', 
    '样件核验与签约', 'IQC与入库管理', '款项结算', '质量追溯与供应商管理'
  ],
  confidenceLevels: [
    85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99
  ],
  data: [
    [2.31795, 3.40296, 5.63024, 8.91364, 9.67907, 10.15421, 4.55203, 4.80109],
    [2.31875, 3.49092, 5.71688, 9.01003, 9.76764, 10.28519, 4.63683, 4.88292],
    [2.33219, 3.58947, 5.83104, 9.15066, 9.87932, 10.42840, 4.67800, 4.97644],
    [2.35857, 3.68327, 5.95621, 9.30751, 10.05011, 10.62763, 4.78275, 5.11044],
    [2.42411, 3.82440, 6.09839, 9.46004, 10.14248, 10.78741, 4.88046, 5.21773],
    [2.47927, 3.94683, 6.26621, 9.56067, 10.24519, 10.96671, 4.96101, 5.36631],
    [2.54567, 4.07323, 6.48192, 9.73551, 10.43225, 11.15559, 5.07275, 5.47683],
    [2.61760, 4.18351, 6.68775, 9.88772, 10.53635, 11.31697, 5.17119, 5.65341],
    [2.69780, 4.38168, 6.90102, 10.10227, 10.75382, 11.55924, 5.28432, 5.82315],
    [2.77608, 4.56622, 7.17005, 10.31720, 10.96108, 11.82861, 5.39300, 5.95598],
    [2.85767, 4.82554, 7.43791, 10.54790, 11.29070, 12.16922, 5.58618, 6.23506],
    [2.95817, 5.08506, 7.76906, 10.83719, 11.53783, 12.56044, 5.76219, 6.50316],
    [3.07161, 5.46895, 8.23044, 11.23038, 11.80670, 12.95386, 6.03185, 6.72912],
    [3.23918, 5.85515, 8.74261, 11.58486, 12.41768, 13.57896, 6.38172, 7.20559],
    [3.51654, 6.71137, 9.51116, 12.50415, 13.20852, 14.48203, 6.96396, 7.94459]
  ]
};

// Generate risk assessment report data
export const riskReportData = {
  timestamp: '2024-05-01T08:00:00',
  overallRiskLevel: 'High',
  riskDistribution: {
    red: 3,
    yellow: 5,
    normal: 2
  },
  topRisks: [
    {
      id: 'PCR02',
      name: '关键原材料依赖进口',
      confidenceLevel: 0.92,
      businessActivity: '供应商资质核验与选择',
      trend: 'up'
    },
    {
      id: 'UUE03',
      name: '地缘政治紧张',
      confidenceLevel: 0.87,
      businessActivity: '',
      trend: 'up'
    },
    {
      id: 'PCR05',
      name: '关键战略材料价格上涨',
      confidenceLevel: 0.83,
      businessActivity: '样件核验与签约',
      trend: 'up'
    }
  ],
  riskByProcess: {
    '采购': { red: 2, yellow: 3, normal: 1 },
    '生产': { red: 0, yellow: 1, normal: 0 },
    '营销': { red: 0, yellow: 1, normal: 0 },
    '运维': { red: 0, yellow: 1, normal: 0 },
    '研发': { red: 0, yellow: 0, normal: 1 },
    '环境': { red: 1, yellow: 0, normal: 0 }
  }
}; 