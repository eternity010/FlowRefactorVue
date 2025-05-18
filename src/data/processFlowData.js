// 流程图数据配置文件

// 采购环节数据
export const purchaseData = {
  chart: [
    { month: '1月', value: 920000 },
    { month: '2月', value: 850000 },
    { month: '3月', value: 1100000 },
    { month: '4月', value: 980000 },
    { month: '5月', value: 1050000 },
    { month: '6月', value: 1256890 }
  ],
  panels: [
    { label: '当月采购总额', value: '¥1,256,890', unit: '' },
    { label: '未处理申请', value: '24', unit: '件' },
    { label: '合作供应商', value: '78', unit: '家' },
    { label: '采购完成率', value: '85.7', unit: '%' }
  ]
}

// 生产环节数据
export const productionData = {
  chart: [
    { month: '1月', value: 850 },
    { month: '2月', value: 920 },
    { month: '3月', value: 980 },
    { month: '4月', value: 1050 },
    { month: '5月', value: 1100 },
    { month: '6月', value: 1200 }
  ],
  panels: [
    { label: '当月产量', value: '1,200', unit: '件' },
    { label: '生产计划达成率', value: '92.5', unit: '%' },
    { label: '产品合格率', value: '98.3', unit: '%' },
    { label: '设备利用率', value: '86.7', unit: '%' }
  ]
}

// 营销环节数据
export const marketingData = {
  chart: [
    { month: '1月', value: 880000 },
    { month: '2月', value: 950000 },
    { month: '3月', value: 1050000 },
    { month: '4月', value: 1150000 },
    { month: '5月', value: 1250000 },
    { month: '6月', value: 1450000 }
  ],
  panels: [
    { label: '当月销售额', value: '¥1,450,000', unit: '' },
    { label: '新增客户数', value: '12', unit: '家' },
    { label: '销售增长率', value: '16.0', unit: '%' },
    { label: '销售目标完成率', value: '93.5', unit: '%' }
  ]
}

// 运维环节数据
export const maintenanceData = {
  chart: [
    { month: '1月', value: 24 },
    { month: '2月', value: 18 },
    { month: '3月', value: 21 },
    { month: '4月', value: 15 },
    { month: '5月', value: 12 },
    { month: '6月', value: 9 }
  ],
  panels: [
    { label: '故障响应时间', value: '2.5', unit: '小时' },
    { label: '当月故障数', value: '9', unit: '起' },
    { label: '维护计划完成率', value: '95.2', unit: '%' },
    { label: '设备完好率', value: '97.8', unit: '%' }
  ]
} 