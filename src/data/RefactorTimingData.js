// 重构时机判断数据

// 时刻1数据
export const moment1Data = {
  // 风险数据
  riskData: {
    totalRisks: 24,
    highRisks: 5,
    mediumRisks: 12,
    lowRisks: 7
  },
  
  // 子流程数据
  subprocessData: {
    totalSubprocesses: 32,
    operationCount: 8,
    purchaseCount: 7,
    productionCount: 10,
    marketingCount: 7
  },
  
  // 重构复杂度数据
  complexityData: {
    overallScore: 7.2,
    codeComplexity: 6.5,
    businessCoupling: 8.3,
    resourceUsage: 6.8
  },

  // 模型运行状态
  modelStatus: {
    isRunning: true,
    runningTime: "6小时42分钟",
    cpuUsage: 68,
    memoryUsage: "4.2GB / 8GB",
    processingSpeed: "125流程/秒"
  },

  // 分析结果
  analysisResults: {
    refactorNecessity: 81,
    recommendedPriority: 85,
    resourceRequirement: 65,
    implementationDifficulty: 58
  },

  // 重构建议
  recommendations: [
    {
      priority: "优先",
      type: "danger",
      content: "采购子流程节点实现重构"
    },
    {
      priority: "重要",
      type: "warning",
      content: "合并运维环节重复节点"
    },
    {
      priority: "重要",
      type: "warning",
      content: "简化生产流程分支逻辑"
    },
    {
      priority: "建议",
      type: "info",
      content: "调整营销环节资源分配"
    }
  ],

  // 总体建议
  overallRecommendation: "当前流程存在明显优化空间，建议在3个月内完成重构。可优先解决采购子流程的节点顺序问题，预计可提升整体效率23%。"
};

// 时刻2数据 - 系统状态良好
export const moment2Data = {
  // 风险数据 - 风险较少
  riskData: {
    totalRisks: 12,
    highRisks: 1,
    mediumRisks: 4,
    lowRisks: 7
  },
  
  // 子流程数据 - 数量合理
  subprocessData: {
    totalSubprocesses: 28,
    operationCount: 7,
    purchaseCount: 6,
    productionCount: 9,
    marketingCount: 6
  },
  
  // 重构复杂度数据 - 复杂度低
  complexityData: {
    overallScore: 3.5,
    codeComplexity: 3.2,
    businessCoupling: 3.8,
    resourceUsage: 3.6
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
