const ProcessFlowDataService = require('../services/processFlowDataService');

/**
 * ProcessFlowDataService 使用示例
 * 展示如何在实际项目中使用各种数据获取方法
 */

// 示例1: 获取仪表板数据
async function getDashboardData() {
  const service = new ProcessFlowDataService();
  await service.connect();
  
  try {
    // 获取所有流程的摘要信息
    const summary = await service.getFlowSummary();
    
    // 获取趋势分析
    const trends = await service.getFlowTrendAnalysis();
    
    // 按最新数值排序
    const topFlows = await service.getFlowDataByLatestValue(4);
    
    const dashboardData = {
      summary: summary.data,
      trends: trends.data,
      topPerformers: topFlows.data
    };
    
    return dashboardData;
  } finally {
    await service.disconnect();
  }
}

// 示例2: 获取特定流程的详细数据（用于图表展示）
async function getFlowChartData(flowType) {
  const service = new ProcessFlowDataService();
  await service.connect();
  
  try {
    // 获取月度数据用于折线图
    const monthlyData = await service.getMonthlyDataByType(flowType);
    
    // 获取关键指标用于卡片展示
    const panelData = await service.getPanelDataByType(flowType);
    
    // 获取完整数据包含统计信息
    const fullData = await service.getFlowDataByType(flowType);
    
    return {
      chartData: monthlyData.data?.chartData || [],
      panels: panelData.data?.panelData || [],
      summary: fullData.data?.chartSummary || {},
      flowName: fullData.data?.flowName || flowType
    };
  } finally {
    await service.disconnect();
  }
}

// 示例3: 搜索和筛选功能
async function searchFlowData(keyword, panelKeyword) {
  const service = new ProcessFlowDataService();
  await service.connect();
  
  try {
    // 文本搜索
    const textResults = await service.searchFlowData(keyword);
    
    // 面板指标搜索
    const panelResults = await service.getFlowsByPanelLabel(panelKeyword);
    
    return {
      textSearch: textResults.data || [],
      panelSearch: panelResults.data || []
    };
  } finally {
    await service.disconnect();
  }
}

// 示例4: 业务分析报告生成
async function generateBusinessReport() {
  const service = new ProcessFlowDataService();
  await service.connect();
  
  try {
    // 获取所有流程数据
    const allData = await service.getAllFlowData();
    
    // 获取趋势分析
    const trends = await service.getFlowTrendAnalysis();
    
    const report = {
      timestamp: new Date().toISOString(),
      totalFlows: allData.count,
      performanceAnalysis: {},
      recommendations: []
    };
    
    // 分析各流程表现
    trends.data.forEach(trend => {
      report.performanceAnalysis[trend.flowType] = {
        name: trend.flowName,
        growthRate: trend.growthRate,
        trend: trend.trend,
        status: trend.growthRate > 20 ? '优秀' : trend.growthRate > 0 ? '良好' : '需改进'
      };
      
      // 生成建议
      if (trend.growthRate < 0 && trend.flowType !== 'maintenance') {
        report.recommendations.push(`${trend.flowName}增长率为负，建议分析原因并制定改进措施`);
      } else if (trend.growthRate > 50) {
        report.recommendations.push(`${trend.flowName}增长迅速，建议保持当前策略并扩大规模`);
      }
    });
    
    return report;
  } finally {
    await service.disconnect();
  }
}

// 示例5: 实时监控数据获取
async function getRealTimeMonitoringData() {
  const service = new ProcessFlowDataService();
  await service.connect();
  
  try {
    // 获取所有流程的最新数值
    const latestValues = await service.getFlowDataByLatestValue();
    
    // 获取关键指标（如完成率、效率等）
    const completionRates = await service.getFlowsByPanelLabel('完成率');
    const efficiencyMetrics = await service.getFlowsByPanelLabel('利用率');
    
    const monitoringData = {
      latestValues: latestValues.data,
      completionRates: completionRates.data,
      efficiencyMetrics: efficiencyMetrics.data,
      lastUpdated: new Date().toISOString()
    };
    
    return monitoringData;
  } finally {
    await service.disconnect();
  }
}

// 示例6: Vue组件中的使用示例
const VueComponentExample = {
  data() {
    return {
      flowData: null,
      loading: false,
      error: null
    };
  },
  
  async mounted() {
    await this.loadFlowData();
  },
  
  methods: {
    async loadFlowData() {
      this.loading = true;
      this.error = null;
      
      try {
        // 获取仪表板数据
        this.flowData = await getDashboardData();
      } catch (error) {
        this.error = '加载数据失败: ' + error.message;
        console.error('加载流程数据失败:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async loadSpecificFlow(flowType) {
      try {
        const chartData = await getFlowChartData(flowType);
        // 更新图表组件
        this.$refs.chart.updateData(chartData);
      } catch (error) {
        console.error(`加载${flowType}数据失败:`, error);
      }
    },
    
    async searchFlows(keyword) {
      try {
        const results = await searchFlowData(keyword, '');
        // 更新搜索结果
        this.searchResults = results.textSearch;
      } catch (error) {
        console.error('搜索失败:', error);
      }
    }
  }
};

// 示例7: 定时任务使用示例
class FlowDataScheduler {
  constructor() {
    this.service = new ProcessFlowDataService();
  }
  
  async startMonitoring(interval = 60000) { // 默认1分钟
    await this.service.connect();
    
    setInterval(async () => {
      try {
        const report = await generateBusinessReport();
        console.log('业务报告:', report);
        
        // 检查异常情况
        Object.values(report.performanceAnalysis).forEach(analysis => {
          if (analysis.status === '需改进') {
            console.warn(`警告: ${analysis.name} 表现需要改进`);
          }
        });
        
      } catch (error) {
        console.error('定时监控失败:', error);
      }
    }, interval);
  }
  
  async stop() {
    await this.service.disconnect();
  }
}

// 导出所有示例函数
module.exports = {
  getDashboardData,
  getFlowChartData,
  searchFlowData,
  generateBusinessReport,
  getRealTimeMonitoringData,
  VueComponentExample,
  FlowDataScheduler
};

// 如果直接运行此文件，执行演示
if (require.main === module) {
  (async () => {
    console.log('🚀 ProcessFlowDataService 使用示例演示\n');
    
    try {
      // 演示1: 仪表板数据
      console.log('📊 获取仪表板数据:');
      const dashboardData = await getDashboardData();
      console.log('成功获取仪表板数据，包含:', Object.keys(dashboardData));
      
      // 演示2: 特定流程图表数据
      console.log('\n📈 获取采购流程图表数据:');
      const chartData = await getFlowChartData('purchase');
      console.log(`${chartData.flowName}: ${chartData.chartData.length}个月数据, ${chartData.panels.length}个指标`);
      
      // 演示3: 业务分析报告
      console.log('\n📋 生成业务分析报告:');
      const report = await generateBusinessReport();
      console.log(`报告生成完成，涵盖${report.totalFlows}个流程，${report.recommendations.length}条建议`);
      
      console.log('\n✅ 所有演示完成！');
      
    } catch (error) {
      console.error('❌ 演示过程中发生错误:', error);
    }
  })();
} 