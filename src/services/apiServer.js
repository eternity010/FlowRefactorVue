const express = require('express');
const cors = require('cors');
const FlowDataService = require('./flowDataService');
const PlanningTimeService = require('./planningTimeService');
const NeuralNetworkService = require('./neuralNetworkService');
const ProcessOptimizationService = require('./processOptimizationService');
const LLMApiServer = require('./llmApiServer');
const RiskDataService = require('./riskDataService');
const MySQLService = require('./mysqlService');
const Topic01Service = require('./topic01Service');
const Topic02Service = require('./topic02Service');
const Topic03Service = require('./topic03Service');
const Topic04Service = require('./topic04Service');

const app = express();
const PORT = 3001;

// 启用CORS，允许前端访问
app.use(cors());
app.use(express.json());

// 创建服务实例
const flowDataService = new FlowDataService();
const planningTimeService = new PlanningTimeService();
const neuralNetworkService = new NeuralNetworkService();
const processOptimizationService = new ProcessOptimizationService();
const riskDataService = new RiskDataService();
const mysqlService = new MySQLService();
const topic01Service = new Topic01Service();
const topic02Service = new Topic02Service();
const topic03Service = new Topic03Service();
const topic04Service = new Topic04Service();
const llmApiServer = new LLMApiServer({
  flowDataService: flowDataService,
  riskDataService: riskDataService
});

// 初始化数据库连接
async function initializeService() {
  try {
    await flowDataService.connect();
    await planningTimeService.connect();
    await neuralNetworkService.connect();
    await riskDataService.connect();
    await mysqlService.connect();
    await topic01Service.initialize();
    await topic02Service.initialize();
    await topic03Service.initialize();
    await topic04Service.initialize();
    await llmApiServer.initialize();
    console.log('✅ API服务已连接到MongoDB和MySQL，Topic01、Topic02、Topic03和Topic04服务已启动');
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
  }
}

// 统一响应处理函数
function sendResponse(res, result, errorMessage = '操作失败') {
  if (result.success) {
    res.json({
      success: true,
      data: result.data
    });
  } else {
    res.status(404).json({
      success: false,
      error: result.error || errorMessage
    });
  }
}

function sendError(res, error, statusCode = 500) {
  res.status(statusCode).json({
    success: false,
    error: error.message || '服务器内部错误'
  });
}

// API路由

// 获取所有流程数据
app.get('/api/flow-data', async (req, res) => {
  try {
    const result = await flowDataService.getAllFlowData();
    sendResponse(res, result, '获取流程数据失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 根据流程类型获取数据
app.get('/api/flow-data/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const result = await flowDataService.getFlowDataByType(type);
    sendResponse(res, result, `未找到类型为 ${type} 的流程数据`);
  } catch (error) {
    sendError(res, error);
  }
});

// 获取流程摘要
app.get('/api/flow-summary', async (req, res) => {
  try {
    const result = await flowDataService.getFlowSummary();
    sendResponse(res, result, '获取流程摘要失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 获取趋势分析
app.get('/api/flow-trends', async (req, res) => {
  try {
    const result = await flowDataService.getFlowTrendAnalysis();
    sendResponse(res, result, '获取趋势分析失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 获取指定流程的月度数据
app.get('/api/monthly-data/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const result = await flowDataService.getMonthlyDataByType(type);
    sendResponse(res, result, `获取类型为 ${type} 的月度数据失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 获取指定流程的关键指标
app.get('/api/panel-data/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const result = await flowDataService.getPanelDataByType(type);
    sendResponse(res, result, `获取类型为 ${type} 的关键指标失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 获取数据库统计信息
app.get('/api/database-stats', async (req, res) => {
  try {
    const result = await flowDataService.getDatabaseStats();
    sendResponse(res, result, '获取数据库统计信息失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 刷新数据接口
app.post('/api/refresh-data', async (req, res) => {
  try {
    // 可以在这里触发数据重新导入
    res.json({
      success: true,
      message: '数据刷新已触发'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 获取总数据
app.get('/api/total-data', async (req, res) => {
  try {
    const result = await flowDataService.getTotalData();
    sendResponse(res, result, '获取总数据失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 获取子流程数据
app.get('/api/sub-process-data', async (req, res) => {
  try {
    const result = await flowDataService.getSubProcessData();
    sendResponse(res, result, '获取子流程数据失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 获取指定类型的子流程数据
app.get('/api/sub-process-data/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const result = await flowDataService.getSubProcessDataByType(type);
    sendResponse(res, result, `获取类型为 ${type} 的子流程数据失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 获取Mermaid流程图数据
app.get('/api/mermaid-flow/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const result = await flowDataService.getMermaidFlowData(type);
    sendResponse(res, result, `获取类型为 ${type} 的Mermaid流程图数据失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 获取所有Mermaid流程图数据
app.get('/api/mermaid-flows', async (req, res) => {
  try {
    const result = await flowDataService.getAllMermaidFlowData();
    sendResponse(res, result, '获取所有Mermaid流程图数据失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 获取特定节点的数据
app.post('/api/mermaid-flow/:type/nodes', async (req, res) => {
  try {
    const { type } = req.params;
    const { nodeIds } = req.body;
    
    console.log(`🔍 获取 ${type} 流程中的节点数据:`, nodeIds);
    
    // 参数验证
    if (!nodeIds || !Array.isArray(nodeIds) || nodeIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: '参数错误：nodeIds必须是非空数组'
      });
    }
    
    // 验证流程类型
    const validTypes = ['purchase', 'production', 'marketing', 'operation'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: `无效的流程类型: ${type}。支持的类型: ${validTypes.join(', ')}`
      });
    }
    
    console.log(`📋 请求获取的节点ID: ${nodeIds.join(', ')}`);
    
    const result = await flowDataService.getNodeDataFromMermaid(type, nodeIds);
    
    if (result.success) {
      console.log(`✅ 成功获取节点数据: 请求${result.data.totalRequested}个，找到${result.data.totalFound}个`);
      res.json({
        success: true,
        data: result.data,
        message: `成功获取 ${type} 流程的节点数据`
      });
    } else {
      console.error(`❌ 获取节点数据失败:`, result.error);
      res.status(404).json({
        success: false,
        error: result.error
      });
    }
    
  } catch (error) {
    console.error('❌ 获取节点数据异常:', error);
    sendError(res, error);
  }
});

// 搜索流程数据
app.get('/api/search-flow', async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return sendError(res, new Error('搜索关键词不能为空'), 400);
    }
    const result = await flowDataService.searchFlowData(keyword);
    sendResponse(res, result, '搜索流程数据失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 按最新数值排序获取流程数据
app.get('/api/flow-data-by-latest', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const result = await flowDataService.getFlowDataByLatestValue(parseInt(limit));
    sendResponse(res, result, '按最新数值获取流程数据失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 获取包含特定面板指标的流程
app.get('/api/flows-by-panel', async (req, res) => {
  try {
    const { label } = req.query;
    if (!label) {
      return sendError(res, new Error('面板指标标签不能为空'), 400);
    }
    const result = await flowDataService.getFlowsByPanelLabel(label);
    sendResponse(res, result, '获取面板指标流程失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 批量获取多个流程类型的数据
app.get('/api/multiple-flow-data', async (req, res) => {
  try {
    const { types } = req.query;
    if (!types) {
      return sendError(res, new Error('流程类型参数不能为空'), 400);
    }
    const flowTypes = types.split(',');
    const result = await flowDataService.getMultipleFlowData(flowTypes);
    sendResponse(res, result, '批量获取流程数据失败');
  } catch (error) {
    sendError(res, error);
  }
});

// ==================== 规划时间数据 API 路由 ====================

// 获取完整的规划时间数据
app.get('/api/planning-time', async (req, res) => {
  try {
    const data = await planningTimeService.getPlanningTimeData();
    res.json({
      success: true,
      data: data,
      message: '获取规划时间数据成功'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 获取统计数据
app.get('/api/planning-time/statistics', async (req, res) => {
  try {
    const data = await planningTimeService.getStatistics();
    res.json({
      success: true,
      data: data,
      message: '获取统计数据成功'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 获取样本数据
app.get('/api/planning-time/sample-data', async (req, res) => {
  try {
    const data = await planningTimeService.getSampleData();
    res.json({
      success: true,
      data: data,
      message: '获取样本数据成功'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 获取预测方案数据
app.get('/api/planning-time/prediction-schemes', async (req, res) => {
  try {
    const data = await planningTimeService.getPredictionSchemes();
    res.json({
      success: true,
      data: data,
      message: '获取预测方案数据成功'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 获取指定预测方案
app.get('/api/planning-time/prediction-schemes/:schemeId', async (req, res) => {
  try {
    const { schemeId } = req.params;
    const data = await planningTimeService.getPredictionSchemeById(schemeId);
    res.json({
      success: true,
      data: data,
      message: `获取预测方案 ${schemeId} 成功`
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 获取控制台模板数据
app.get('/api/planning-time/console-template', async (req, res) => {
  try {
    const data = await planningTimeService.getConsoleTemplate();
    res.json({
      success: true,
      data: data,
      message: '获取控制台模板数据成功'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 获取流程配置数据
app.get('/api/planning-time/flow-configuration', async (req, res) => {
  try {
    const data = await planningTimeService.getFlowConfiguration();
    res.json({
      success: true,
      data: data,
      message: '获取流程配置数据成功'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 获取边数据
app.get('/api/planning-time/edges', async (req, res) => {
  try {
    const data = await planningTimeService.getEdgeData();
    res.json({
      success: true,
      data: data,
      message: '获取边数据成功'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 获取历史准确度数据 - 所有方案
app.get('/api/planning-time/accuracy-history', async (req, res) => {
  try {
    const data = await planningTimeService.getAccuracyHistory();
    res.json({
      success: true,
      data: data,
      message: '获取历史准确度数据成功'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 获取历史准确度数据 - 指定方案
app.get('/api/planning-time/accuracy-history/:schemeId', async (req, res) => {
  try {
    const { schemeId } = req.params;
    const data = await planningTimeService.getAccuracyHistory(schemeId);
    res.json({
      success: true,
      data: data,
      message: `获取方案 ${schemeId} 历史准确度成功`
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 更新预测方案准确度
app.put('/api/planning-time/prediction-schemes/:schemeId/accuracy', async (req, res) => {
  try {
    const { schemeId } = req.params;
    const { accuracy } = req.body;
    
    if (typeof accuracy !== 'number' || accuracy < 0 || accuracy > 100) {
      return res.status(400).json({
        success: false,
        error: '准确度必须是0-100之间的数字'
      });
    }
    
    const data = await planningTimeService.updatePredictionAccuracy(schemeId, accuracy);
    res.json({
      success: true,
      data: data,
      message: `更新预测方案 ${schemeId} 准确度成功`
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 获取数据概览
app.get('/api/planning-time/overview', async (req, res) => {
  try {
    const data = await planningTimeService.getDataOverview();
    res.json({
      success: true,
      data: data,
      message: '获取数据概览成功'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// ==================== 重构时机数据 API 路由 ====================

// 获取所有重构时机数据
app.get('/api/refactor-timing', async (req, res) => {
  try {
    const data = await planningTimeService.getRefactorTimingData();
    res.json({
      success: true,
      data: data,
      message: '获取重构时机数据成功'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 获取最新的重构时机数据
app.get('/api/refactor-timing/latest', async (req, res) => {
  try {
    const data = await planningTimeService.getLatestRefactorTimingData();
    res.json({
      success: true,
      data: data,
      message: '获取最新重构时机数据成功'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 根据系统状态获取重构时机数据
app.get('/api/refactor-timing/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const data = await planningTimeService.getRefactorTimingDataByStatus(status);
    res.json({
      success: true,
      data: data,
      message: `获取状态为 ${status} 的重构时机数据成功`
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 切换到下一个时机状态
app.post('/api/refactor-timing/switch-moment', async (req, res) => {
  try {
    const data = await planningTimeService.switchToNextMoment();
    res.json({
      success: true,
      data: data,
      message: `已切换到 ${data.switchedTo} 状态`
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 重置到初始状态
app.post('/api/refactor-timing/reset-moment', async (req, res) => {
  try {
    const data = await planningTimeService.resetToInitialMoment();
    res.json({
      success: true,
      data: data,
      message: '已重置到初始状态'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 获取当前状态信息
app.get('/api/refactor-timing/current-state', async (req, res) => {
  try {
    const data = planningTimeService.getCurrentMomentState();
    res.json({
      success: true,
      data: data,
      message: '获取当前状态成功'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// ==================== 大模型分析数据 API 路由 ====================

// 获取完整的大模型分析数据
app.get('/api/llm-analysis', async (req, res) => {
  try {
    const data = await planningTimeService.getLLMAnalysisData();
    res.json({
      success: true,
      data: data,
      message: '获取大模型分析数据成功'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 获取最新的大模型分析报告
app.get('/api/llm-analysis/latest', async (req, res) => {
  try {
    const data = await planningTimeService.getLatestLLMAnalysisReport();
    res.json({
      success: true,
      data: data,
      message: '获取最新大模型分析报告成功'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 获取环境分析数据
app.get('/api/llm-analysis/environment', async (req, res) => {
  try {
    const data = await planningTimeService.getEnvironmentAnalysis();
    res.json({
      success: true,
      data: data,
      message: '获取环境分析数据成功'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 获取相似流程检索结果
app.get('/api/llm-analysis/similar-processes', async (req, res) => {
  try {
    const data = await planningTimeService.getSimilarProcesses();
    res.json({
      success: true,
      data: data,
      message: '获取相似流程检索结果成功'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 获取节点分析数据
app.get('/api/llm-analysis/node-analysis', async (req, res) => {
  try {
    const data = await planningTimeService.getNodeAnalysis();
    res.json({
      success: true,
      data: data,
      message: '获取节点分析数据成功'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 获取时间预测数据
app.get('/api/llm-analysis/time-prediction', async (req, res) => {
  try {
    const data = await planningTimeService.getTimePrediction();
    res.json({
      success: true,
      data: data,
      message: '获取时间预测数据成功'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 获取智能建议
app.get('/api/llm-analysis/recommendations', async (req, res) => {
  try {
    const data = await planningTimeService.getRecommendations();
    res.json({
      success: true,
      data: data,
      message: '获取智能建议成功'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 获取完整模型输出内容
app.get('/api/llm-analysis/model-output', async (req, res) => {
  try {
    const data = await planningTimeService.getModelOutputContent();
    res.json({
      success: true,
      data: data,
      message: '获取模型输出内容成功'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 检查是否有大模型分析数据
app.get('/api/llm-analysis/has-data', async (req, res) => {
  try {
    const hasData = await planningTimeService.hasLLMAnalysisData();
    res.json({
      success: true,
      data: { hasData: hasData },
      message: hasData ? '存在大模型分析数据' : '暂无大模型分析数据'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// ==================== 神经网络参数 API 路由 ====================

// 获取所有参数配置
app.get('/api/neural-network/parameters', async (req, res) => {
  try {
    const data = await neuralNetworkService.getNeuralNetworkParameters();
    res.json({
      code: 200,
      message: '获取成功',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '获取神经网络参数失败',
      data: null,
      error: error.message
    });
  }
});

// 获取当前参数值
app.get('/api/neural-network/parameters/current', async (req, res) => {
  try {
    const data = await neuralNetworkService.getCurrentNeuralNetworkParameters();
    res.json({
      code: 200,
      message: '获取成功',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '获取当前参数值失败',
      data: null,
      error: error.message
    });
  }
});

// 获取默认参数配置
app.get('/api/neural-network/parameters/default', async (req, res) => {
  try {
    const data = await neuralNetworkService.getDefaultNeuralNetworkParameters();
    res.json({
      code: 200,
      message: '获取成功',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '获取默认参数配置失败',
      data: null,
      error: error.message
    });
  }
});

// 获取参数定义信息
app.get('/api/neural-network/parameters/definitions', async (req, res) => {
  try {
    const data = await neuralNetworkService.getNeuralNetworkParameterDefinitions();
    res.json({
      code: 200,
      message: '获取成功',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '获取参数定义失败',
      data: null,
      error: error.message
    });
  }
});

// 获取特定类别的参数
app.get('/api/neural-network/parameters/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const data = await neuralNetworkService.getNeuralNetworkParametersByCategory(category);
    
    if (!data) {
      return res.status(404).json({
        code: 404,
        message: '参数类别不存在',
        data: null
      });
    }
    
    res.json({
      code: 200,
      message: '获取成功',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: `获取类别为 ${req.params.category} 的参数失败`,
      data: null,
      error: error.message
    });
  }
});

// 更新参数配置
app.put('/api/neural-network/parameters', async (req, res) => {
  try {
    const { parameters } = req.body;
    
    if (!parameters || typeof parameters !== 'object') {
      return res.status(400).json({
        code: 400,
        message: '参数格式错误',
        data: null
      });
    }
    
    const data = await neuralNetworkService.updateNeuralNetworkParameters(parameters);
    res.json({
      code: 200,
      message: '参数更新成功',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '更新参数失败',
      data: null,
      error: error.message
    });
  }
});

// 重置参数为默认值
app.post('/api/neural-network/parameters/reset', async (req, res) => {
  try {
    const { parameter_keys } = req.body;
    const data = await neuralNetworkService.resetNeuralNetworkParameters(parameter_keys);
    
    res.json({
      code: 200,
      message: '参数重置成功',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '重置参数失败',
      data: null,
      error: error.message
    });
  }
});

// 保存参数配置
app.post('/api/neural-network/parameters/save', async (req, res) => {
  try {
    const { parameters, config_name, timestamp } = req.body;
    
    if (!parameters || !config_name) {
      return res.status(400).json({
        code: 400,
        message: '参数和配置名称不能为空',
        data: null
      });
    }
    
    const data = await neuralNetworkService.saveNeuralNetworkParameterConfig(parameters, config_name, timestamp);
    res.json({
      code: 200,
      message: '参数配置保存成功',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '保存参数配置失败',
      data: null,
      error: error.message
    });
  }
});

// 获取保存的参数配置列表
app.get('/api/neural-network/parameters/configs', async (req, res) => {
  try {
    const data = await neuralNetworkService.getSavedNeuralNetworkConfigs();
    res.json({
      code: 200,
      message: '获取成功',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '获取保存的配置列表失败',
      data: null,
      error: error.message
    });
  }
});

// 加载保存的参数配置
app.get('/api/neural-network/parameters/configs/:configName', async (req, res) => {
  try {
    const { configName } = req.params;
    const data = await neuralNetworkService.loadNeuralNetworkParameterConfig(configName);
    
    if (!data) {
      return res.status(404).json({
        code: 404,
        message: '配置不存在',
        data: null
      });
    }
    
    res.json({
      code: 200,
      message: '获取成功',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: `加载配置 ${req.params.configName} 失败`,
      data: null,
      error: error.message
    });
  }
});

// 删除保存的参数配置
app.delete('/api/neural-network/parameters/configs/:configName', async (req, res) => {
  try {
    const { configName } = req.params;
    const data = await neuralNetworkService.deleteNeuralNetworkParameterConfig(configName);
    
    res.json({
      code: 200,
      message: '配置删除成功',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: `删除配置 ${req.params.configName} 失败`,
      data: null,
      error: error.message
    });
  }
});

// 获取参数使用统计
app.get('/api/neural-network/parameters/stats', async (req, res) => {
  try {
    const data = await neuralNetworkService.getNeuralNetworkParameterStats();
    res.json({
      code: 200,
      message: '获取成功',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '获取参数统计失败',
      data: null,
      error: error.message
    });
  }
});

// 验证参数值
app.post('/api/neural-network/parameters/validate', async (req, res) => {
  try {
    const { parameters } = req.body;
    
    if (!parameters || typeof parameters !== 'object') {
      return res.status(400).json({
        code: 400,
        message: '参数格式错误',
        data: null
      });
    }
    
    const data = await neuralNetworkService.validateNeuralNetworkParameters(parameters);
    res.json({
      code: 200,
      message: '验证完成',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '参数验证失败',
      data: null,
      error: error.message
    });
  }
});



// 导出参数配置
app.get('/api/neural-network/parameters/export', async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    const data = await neuralNetworkService.exportNeuralNetworkParameters(format);
    
    // 设置下载文件头
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=neural_network_parameters_${new Date().toISOString().split('T')[0]}.json`);
    
    res.json(data);
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '导出参数配置失败',
      data: null,
      error: error.message
    });
  }
});

// 导入参数配置
app.post('/api/neural-network/parameters/import', async (req, res) => {
  try {
    const { config_data, overwrite = false } = req.body;
    
    if (!config_data) {
      return res.status(400).json({
        code: 400,
        message: '配置数据不能为空',
        data: null
      });
    }
    
    const data = await neuralNetworkService.importNeuralNetworkParameters(config_data, overwrite);
    res.json({
      code: 200,
      message: '参数配置导入成功',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '导入参数配置失败',
      data: null,
      error: error.message
    });
  }
});

// ==================== RAG配置 API 路由 ====================

// 获取完整RAG配置数据
app.get('/api/rag-config', async (req, res) => {
  try {
    const data = await neuralNetworkService.getRAGConfigData();
    res.json({
      code: 200,
      message: '获取成功',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '获取RAG配置失败',
      data: null,
      error: error.message
    });
  }
});

// 获取RAG启用状态
app.get('/api/rag-config/status', async (req, res) => {
  try {
    const data = await neuralNetworkService.getRAGEnabledStatus();
    res.json({
      code: 200,
      message: '获取成功',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '获取RAG启用状态失败',
      data: null,
      error: error.message
    });
  }
});

// 更新RAG启用状态
app.put('/api/rag-config/status', async (req, res) => {
  try {
    const { enabled_status } = req.body;
    
    if (!enabled_status || typeof enabled_status !== 'object') {
      return res.status(400).json({
        code: 400,
        message: '启用状态格式错误',
        data: null
      });
    }
    
    const data = await neuralNetworkService.updateRAGEnabledStatus(enabled_status);
    res.json({
      code: 200,
      message: 'RAG启用状态更新成功',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '更新RAG启用状态失败',
      data: null,
      error: error.message
    });
  }
});

// 获取特定RAG系统的数据源配置
app.get('/api/rag-config/data-sources/:ragType', async (req, res) => {
  try {
    const { ragType } = req.params;
    const data = await neuralNetworkService.getRAGDataSources(ragType);
    
    res.json({
      code: 200,
      message: '获取成功',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: `获取RAG类型 ${req.params.ragType} 的数据源失败`,
      data: null,
      error: error.message
    });
  }
});

// 更新完整RAG配置
app.put('/api/rag-config', async (req, res) => {
  try {
    const ragConfig = req.body;
    
    if (!ragConfig || typeof ragConfig !== 'object') {
      return res.status(400).json({
        code: 400,
        message: 'RAG配置格式错误',
        data: null
      });
    }
    
    const data = await neuralNetworkService.updateRAGConfig(ragConfig);
    res.json({
      code: 200,
      message: 'RAG配置更新成功',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '更新RAG配置失败',
      data: null,
      error: error.message
    });
  }
});

// 重置RAG配置为默认值
app.post('/api/rag-config/reset', async (req, res) => {
  try {
    const data = await neuralNetworkService.resetRAGConfig();
    res.json({
      code: 200,
      message: 'RAG配置重置成功',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '重置RAG配置失败',
      data: null,
      error: error.message
    });
  }
});

// 获取RAG配置统计信息
app.get('/api/rag-config/stats', async (req, res) => {
  try {
    const data = await neuralNetworkService.getRAGConfigStats();
    res.json({
      code: 200,
      message: '获取成功',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '获取RAG配置统计失败',
      data: null,
      error: error.message
    });
  }
});

// ========== 流程优化路由 (新增) ==========

// 获取所有优化案例
app.get('/api/process-optimization', async (req, res) => {
  try {
    const result = await processOptimizationService.getAllOptimizations();
    
    if (result.success) {
      res.json({
        code: 200,
        message: '获取优化案例成功',
        data: result.data
      });
    } else {
      res.status(404).json({
        code: 404,
        message: result.error,
        data: null
      });
    }
  } catch (error) {
    console.error('获取优化案例失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取优化案例失败',
      data: null,
      error: error.message
    });
  }
});

// 根据ID获取特定优化案例
app.get('/api/process-optimization/:id', async (req, res) => {
  try {
    const optimizationId = req.params.id;
    const result = await processOptimizationService.getOptimizationById(optimizationId);
    
    if (result.success) {
      res.json({
        code: 200,
        message: '获取优化案例成功',
        data: result.data
      });
    } else {
      res.status(404).json({
        code: 404,
        message: result.error,
        data: null
      });
    }
  } catch (error) {
    console.error('获取优化案例失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取优化案例失败',
      data: null,
      error: error.message
    });
  }
});

// 获取优化案例的流程图数据
app.get('/api/process-optimization/:id/flowcharts', async (req, res) => {
  try {
    const optimizationId = req.params.id;
    const result = await processOptimizationService.getOptimizationFlowcharts(optimizationId);
    
    if (result.success) {
      res.json({
        code: 200,
        message: '获取流程图数据成功',
        data: result.data
      });
    } else {
      res.status(404).json({
        code: 404,
        message: result.error,
        data: null
      });
    }
  } catch (error) {
    console.error('获取流程图数据失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取流程图数据失败',
      data: null,
      error: error.message
    });
  }
});

// 获取优化案例的资源变化分析
app.get('/api/process-optimization/:id/resources', async (req, res) => {
  try {
    const optimizationId = req.params.id;
    const result = await processOptimizationService.getOptimizationResources(optimizationId);
    
    if (result.success) {
      res.json({
        code: 200,
        message: '获取资源变化分析成功',
        data: result.data
      });
    } else {
      res.status(404).json({
        code: 404,
        message: result.error,
        data: null
      });
    }
  } catch (error) {
    console.error('获取资源变化分析失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取资源变化分析失败',
      data: null,
      error: error.message
    });
  }
});

// 获取优化案例的甘特图数据
app.get('/api/process-optimization/:id/gantt', async (req, res) => {
  try {
    const optimizationId = req.params.id;
    const result = await processOptimizationService.getOptimizationGantt(optimizationId);
    
    if (result.success) {
      res.json({
        code: 200,
        message: '获取甘特图数据成功',
        data: result.data
      });
    } else {
      res.status(404).json({
        code: 404,
        message: result.error,
        data: null
      });
    }
  } catch (error) {
    console.error('获取甘特图数据失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取甘特图数据失败',
      data: null,
      error: error.message
    });
  }
});

// 搜索优化案例
app.get('/api/process-optimization/search', async (req, res) => {
  try {
    const keyword = req.query.keyword;
    if (!keyword) {
      return res.status(400).json({
        code: 400,
        message: '搜索关键词不能为空',
        data: null
      });
    }

    const result = await processOptimizationService.searchOptimizations(keyword);
    
    if (result.success) {
      res.json({
        code: 200,
        message: '搜索优化案例成功',
        data: result.data
      });
    } else {
      res.status(404).json({
        code: 404,
        message: result.error,
        data: null
      });
    }
  } catch (error) {
    console.error('搜索优化案例失败:', error);
    res.status(500).json({
      code: 500,
      message: '搜索优化案例失败',
      data: null,
      error: error.message
    });
  }
});

// 获取优化数据统计
app.get('/api/process-optimization/stats', async (req, res) => {
  try {
    const result = await processOptimizationService.getOptimizationStats();
    
    if (result.success) {
      res.json({
        code: 200,
        message: '获取优化数据统计成功',
        data: result.data
      });
    } else {
      res.status(500).json({
        code: 500,
        message: result.error,
        data: null
      });
    }
  } catch (error) {
    console.error('获取优化数据统计失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取优化数据统计失败',
      data: null,
      error: error.message
    });
  }
});

// 检查数据库连接状态
app.get('/api/process-optimization/connection', async (req, res) => {
  try {
    const result = await processOptimizationService.checkConnection();
    
    if (result.success) {
      res.json({
        code: 200,
        message: '数据库连接正常',
        data: result.data
      });
    } else {
      res.status(503).json({
        code: 503,
        message: '数据库连接异常',
        data: result.data,
        error: result.error
      });
    }
  } catch (error) {
    console.error('检查数据库连接失败:', error);
    res.status(500).json({
      code: 500,
      message: '检查数据库连接失败',
      data: { connected: false },
      error: error.message
    });
  }
});

// ================================
// 风险数据相关API
// ================================

// 获取所有风险数据
app.get('/api/risk-data', async (req, res) => {
  try {
    const result = await riskDataService.getAllRiskData();
    sendResponse(res, result, '获取风险数据失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 检查风险数据库连接状态
app.get('/api/risk-data/connection', async (req, res) => {
  try {
    const result = await riskDataService.checkConnection();
    res.json({
      success: result.success,
      data: result.data,
      message: result.success ? '风险数据库连接正常' : '风险数据库连接异常'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// ================================
// MySQL数据库 API 路由
// ================================

// 检查MySQL数据库连接状态
app.get('/api/mysql/connection', async (req, res) => {
  try {
    const result = await mysqlService.checkConnection();
    res.json({
      success: result.success,
      data: result.data,
      message: result.success ? 'MySQL数据库连接正常' : 'MySQL数据库连接异常'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 获取所有数据库表
app.get('/api/mysql/tables', async (req, res) => {
  try {
    const result = await mysqlService.getAllTables();
    sendResponse(res, result, '获取数据库表列表失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 获取表结构
app.get('/api/mysql/tables/:tableName/structure', async (req, res) => {
  try {
    const { tableName } = req.params;
    const result = await mysqlService.getTableStructure(tableName);
    sendResponse(res, result, `获取表 ${tableName} 结构失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 获取表数据
app.get('/api/mysql/tables/:tableName/data', async (req, res) => {
  try {
    const { tableName } = req.params;
    const options = {
      limit: parseInt(req.query.limit) || 100,
      offset: parseInt(req.query.offset) || 0,
      columns: req.query.columns || '*',
      orderBy: req.query.orderBy || null
    };
    
    // 处理WHERE条件
    if (req.query.where_condition && req.query.where_params) {
      options.where = {
        condition: req.query.where_condition,
        params: JSON.parse(req.query.where_params)
      };
    }
    
    const result = await mysqlService.getTableData(tableName, options);
    sendResponse(res, result, `获取表 ${tableName} 数据失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 插入数据
app.post('/api/mysql/tables/:tableName/data', async (req, res) => {
  try {
    const { tableName } = req.params;
    const data = req.body;
    
    if (!data || typeof data !== 'object') {
      return res.status(400).json({
        success: false,
        error: '数据格式错误'
      });
    }
    
    const result = await mysqlService.insertData(tableName, data);
    sendResponse(res, result, `插入数据到表 ${tableName} 失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 更新数据
app.put('/api/mysql/tables/:tableName/data', async (req, res) => {
  try {
    const { tableName } = req.params;
    const { data, where } = req.body;
    
    if (!data || !where || typeof data !== 'object' || typeof where !== 'object') {
      return res.status(400).json({
        success: false,
        error: '数据或条件格式错误'
      });
    }
    
    const result = await mysqlService.updateData(tableName, data, where);
    sendResponse(res, result, `更新表 ${tableName} 数据失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 删除数据
app.delete('/api/mysql/tables/:tableName/data', async (req, res) => {
  try {
    const { tableName } = req.params;
    const { where } = req.body;
    
    if (!where || typeof where !== 'object') {
      return res.status(400).json({
        success: false,
        error: '删除条件不能为空'
      });
    }
    
    const result = await mysqlService.deleteData(tableName, where);
    sendResponse(res, result, `删除表 ${tableName} 数据失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 执行自定义SQL查询
app.post('/api/mysql/query', async (req, res) => {
  try {
    const { sql, params = [] } = req.body;
    
    if (!sql || typeof sql !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'SQL语句不能为空'
      });
    }
    
    // 安全检查：防止危险的SQL操作
    const upperSQL = sql.trim().toUpperCase();
    const dangerousOperations = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'CREATE', 'ALTER', 'TRUNCATE'];
    const isDangerous = dangerousOperations.some(op => upperSQL.startsWith(op));
    
    if (isDangerous) {
      return res.status(403).json({
        success: false,
        error: '出于安全考虑，不允许执行修改类SQL语句'
      });
    }
    
    const result = await mysqlService.executeCustomQuery(sql, params);
    sendResponse(res, result, 'SQL查询执行失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 获取数据库统计信息
app.get('/api/mysql/stats', async (req, res) => {
  try {
    const result = await mysqlService.getDatabaseStats();
    sendResponse(res, result, '获取数据库统计信息失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 批量插入数据
app.post('/api/mysql/tables/:tableName/bulk-insert', async (req, res) => {
  try {
    const { tableName } = req.params;
    const { data } = req.body;
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        success: false,
        error: '批量插入数据必须是非空数组'
      });
    }
    
    // 简单的批量插入实现 - 逐条插入
    const results = [];
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < data.length; i++) {
      try {
        const result = await mysqlService.insertData(tableName, data[i]);
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
        }
        results.push({ index: i, result: result });
      } catch (error) {
        errorCount++;
        results.push({ index: i, result: { success: false, error: error.message } });
      }
    }
    
    res.json({
      success: true,
      data: {
        total: data.length,
        successCount: successCount,
        errorCount: errorCount,
        results: results
      },
      message: `批量插入完成: 成功${successCount}条，失败${errorCount}条`
    });
  } catch (error) {
    sendError(res, error);
  }
});

// 导出表数据
app.get('/api/mysql/tables/:tableName/export', async (req, res) => {
  try {
    const { tableName } = req.params;
    const { limit = 1000 } = req.query;
    
    const result = await mysqlService.getTableData(tableName, {
      limit: parseInt(limit)
    });
    
    if (result.success) {
      // 设置下载文件头
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=${tableName}_export_${new Date().toISOString().split('T')[0]}.json`);
      
      res.json({
        success: true,
        data: {
          tableName: tableName,
          exportTime: new Date().toISOString(),
          recordCount: result.data.records.length,
          records: result.data.records
        },
        message: `表 ${tableName} 数据导出成功`
      });
    } else {
      sendResponse(res, result, `导出表 ${tableName} 数据失败`);
    }
  } catch (error) {
    sendError(res, error);
  }
});

// 获取表的索引信息
app.get('/api/mysql/tables/:tableName/indexes', async (req, res) => {
  try {
    const { tableName } = req.params;
    const sql = 'SHOW INDEX FROM ??';
    const result = await mysqlService.query(sql, [tableName]);
    sendResponse(res, result, `获取表 ${tableName} 索引信息失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 测试SQL语句（只读操作）
app.post('/api/mysql/test-query', async (req, res) => {
  try {
    const { sql, params = [] } = req.body;
    
    if (!sql || typeof sql !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'SQL语句不能为空'
      });
    }
    
    // 严格限制只能是SELECT语句
    const trimmedSQL = sql.trim().toUpperCase();
    if (!trimmedSQL.startsWith('SELECT')) {
      return res.status(403).json({
        success: false,
        error: '测试查询只允许SELECT语句'
      });
    }
    
    // 添加LIMIT限制防止大量数据返回
    let testSQL = sql;
    if (!trimmedSQL.includes('LIMIT')) {
      testSQL += ' LIMIT 100';
    }
    
    const result = await mysqlService.executeCustomQuery(testSQL, params);
    
    if (result.success) {
      res.json({
        success: true,
        data: {
          sql: testSQL,
          params: params,
          rowCount: result.data.length,
          executionTime: new Date().toISOString(),
          preview: result.data.slice(0, 10), // 只返回前10条记录作为预览
          hasMore: result.data.length > 10
        },
        message: '测试查询执行成功'
      });
    } else {
      sendResponse(res, result, 'SQL测试查询失败');
    }
  } catch (error) {
    sendError(res, error);
  }
});

// ================================
// Topic01 API 路由
// ================================

// 获取数据
app.get('/api/topic01/data', async (req, res) => {
  try {
    const result = await topic01Service.getData(req.query);
    sendResponse(res, result, '获取Topic01数据失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 保存数据
app.post('/api/topic01/data', async (req, res) => {
  try {
    const result = await topic01Service.saveData(req.body);
    sendResponse(res, result, '保存Topic01数据失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 更新数据
app.put('/api/topic01/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await topic01Service.saveData({ id, ...req.body });
    sendResponse(res, result, `更新Topic01数据${id}失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 删除数据
app.delete('/api/topic01/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await topic01Service.processData({ action: 'delete', id });
    sendResponse(res, result, `删除Topic01数据${id}失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 处理业务逻辑
app.post('/api/topic01/process', async (req, res) => {
  try {
    const result = await topic01Service.processData(req.body);
    sendResponse(res, result, 'Topic01业务处理失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 获取状态信息
app.get('/api/topic01/status', async (req, res) => {
  try {
    const result = {
      success: true,
      data: {
        service: 'Topic01Service',
        status: 'running',
        timestamp: new Date().toISOString()
      }
    };
    sendResponse(res, result, '获取Topic01状态失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 获取风险数据统计
app.get('/api/topic01/risk-statistics', async (req, res) => {
  try {
    const { processType } = req.query;
    const result = await topic01Service.getRiskStatistics(processType);
    sendResponse(res, result, '获取风险统计数据失败');
  } catch (error) {
    sendError(res, error);
  }
});

// Topic01 单个节点风险信息路由
app.get('/api/topic01/node-risk/:nodeId', async (req, res) => {
  try {
    const { nodeId } = req.params;
    console.log(`📥 收到获取节点风险信息请求: nodeId=${nodeId}`);
    
    const result = await topic01Service.getNodeRiskInfo(nodeId);
    
    if (result.success) {
      console.log(`✅ 节点风险信息获取成功: ${JSON.stringify({
        nodeId: result.data.nodeId,
        riskLevel: result.data.riskLevel,
        processType: result.data.processType
      })}`);
    }
    
    sendResponse(res, result, `获取节点 ${nodeId} 风险信息失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// ================================
// Topic02 API 路由
// ================================

// 获取数据
app.get('/api/topic02/data', async (req, res) => {
  try {
    const result = await topic02Service.getData(req.query);
    sendResponse(res, result, '获取Topic02数据失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 保存数据
app.post('/api/topic02/data', async (req, res) => {
  try {
    const result = await topic02Service.saveData(req.body);
    sendResponse(res, result, '保存Topic02数据失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 更新数据
app.put('/api/topic02/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await topic02Service.updateData(id, req.body);
    sendResponse(res, result, `更新Topic02数据${id}失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 删除数据
app.delete('/api/topic02/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await topic02Service.deleteData(id);
    sendResponse(res, result, `删除Topic02数据${id}失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 处理业务逻辑
app.post('/api/topic02/process', async (req, res) => {
  try {
    const result = await topic02Service.processData(req.body);
    sendResponse(res, result, 'Topic02业务处理失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 获取状态信息
app.get('/api/topic02/status', async (req, res) => {
  try {
    const result = await topic02Service.getStatus();
    sendResponse(res, result, '获取Topic02状态失败');
  } catch (error) {
    sendError(res, error);
  }
});

// ================================
// Topic04 API 路由 - 高铁运维订单数据
// ================================

// 获取所有状态为"进行中"的运维订单数据
app.get('/api/topic04/maintenance/ongoing', async (req, res) => {
  try {
    console.log('📥 收到获取进行中运维订单的请求');
    const result = await topic04Service.getOngoingMaintenanceOrders();
    
    if (result.success) {
      console.log(`✅ 成功返回 ${result.data.total} 条进行中的运维订单数据`);
      res.json({
        success: true,
        data: result.data,
        message: '获取进行中运维订单数据成功'
      });
    } else {
      res.status(404).json({
        success: false,
        error: result.error || '获取进行中运维订单数据失败'
      });
    }
  } catch (error) {
    console.error('❌ 获取进行中运维订单数据异常:', error);
    sendError(res, error);
  }
});

// 根据系统模块获取运维订单
app.get('/api/topic04/maintenance/system/:systemModule', async (req, res) => {
  try {
    const { systemModule } = req.params;
    console.log(`📥 收到获取系统 "${systemModule}" 运维订单的请求`);
    
    const result = await topic04Service.getMaintenanceOrdersBySystem(systemModule);
    sendResponse(res, result, `获取系统 ${systemModule} 运维订单失败`);
  } catch (error) {
    sendError(res, error);
  }
});


// 获取运维订单统计数据
app.get('/api/topic04/maintenance/statistics', async (req, res) => {
  try {
    console.log('📥 收到获取运维订单统计数据的请求');
    const result = await topic04Service.getMaintenanceStatistics();
    sendResponse(res, result, '获取运维订单统计数据失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 根据车站位置获取运维订单
app.get('/api/topic04/maintenance/station/:stationLocation', async (req, res) => {
  try {
    const { stationLocation } = req.params;
    console.log(`📥 收到获取车站 "${stationLocation}" 运维订单的请求`);
    
    // 使用与系统模块类似的逻辑，但这里我们需要自定义查询
    const sql = `
      SELECT * FROM dm_topic0402_input_train_maintenance 
      WHERE maintenance_status = '进行中' 
        AND station_location = ?
        AND del_flag = 0
      ORDER BY report_date DESC
    `;
    
    const result = await topic04Service.mysqlService.executeCustomQuery(sql, [stationLocation]);
    
    if (result.success) {
      const processedData = topic04Service.processMaintenanceData(result.data);
      res.json({
        success: true,
        data: {
          stationLocation: stationLocation,
          total: processedData.length,
          records: processedData,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      sendResponse(res, result, `获取车站 ${stationLocation} 运维订单失败`);
    }
  } catch (error) {
    sendError(res, error);
  }
});

// 根据列车编号获取运维订单
app.get('/api/topic04/maintenance/train/:trainId', async (req, res) => {
  try {
    const { trainId } = req.params;
    console.log(`📥 收到获取列车 "${trainId}" 运维订单的请求`);
    
    const sql = `
      SELECT * FROM dm_topic0402_input_train_maintenance 
      WHERE maintenance_status = '进行中' 
        AND train_id = ?
        AND del_flag = 0
      ORDER BY report_date DESC
    `;
    
    const result = await topic04Service.mysqlService.executeCustomQuery(sql, [trainId]);
    
    if (result.success) {
      const processedData = topic04Service.processMaintenanceData(result.data);
      res.json({
        success: true,
        data: {
          trainId: trainId,
          total: processedData.length,
          records: processedData,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      sendResponse(res, result, `获取列车 ${trainId} 运维订单失败`);
    }
  } catch (error) {
    sendError(res, error);
  }
});

// 根据维修类型获取运维订单
app.get('/api/topic04/maintenance/type/:maintenanceType', async (req, res) => {
  try {
    const { maintenanceType } = req.params;
    console.log(`📥 收到获取维修类型 "${maintenanceType}" 运维订单的请求`);
    
    const sql = `
      SELECT * FROM dm_topic0402_input_train_maintenance 
      WHERE maintenance_status = '进行中' 
        AND maintenance_type = ?
        AND del_flag = 0
      ORDER BY report_date DESC
    `;
    
    const result = await topic04Service.mysqlService.executeCustomQuery(sql, [maintenanceType]);
    
    if (result.success) {
      const processedData = topic04Service.processMaintenanceData(result.data);
      res.json({
        success: true,
        data: {
          maintenanceType: maintenanceType,
          total: processedData.length,
          records: processedData,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      sendResponse(res, result, `获取维修类型 ${maintenanceType} 运维订单失败`);
    }
  } catch (error) {
    sendError(res, error);
  }
});

// 根据责任班组获取运维订单
app.get('/api/topic04/maintenance/team/:responsibleTeam', async (req, res) => {
  try {
    const { responsibleTeam } = req.params;
    console.log(`📥 收到获取责任班组 "${responsibleTeam}" 运维订单的请求`);
    
    const sql = `
      SELECT * FROM dm_topic0402_input_train_maintenance 
      WHERE maintenance_status = '进行中' 
        AND responsible_team = ?
        AND del_flag = 0
      ORDER BY report_date DESC
    `;
    
    const result = await topic04Service.mysqlService.executeCustomQuery(sql, [responsibleTeam]);
    
    if (result.success) {
      const processedData = topic04Service.processMaintenanceData(result.data);
      res.json({
        success: true,
        data: {
          responsibleTeam: responsibleTeam,
          total: processedData.length,
          records: processedData,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      sendResponse(res, result, `获取责任班组 ${responsibleTeam} 运维订单失败`);
    }
  } catch (error) {
    sendError(res, error);
  }
});

// 获取运维订单详情
app.get('/api/topic04/maintenance/detail/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log(`📥 收到获取运维订单详情的请求: ${orderId}`);
    
    const sql = `
      SELECT * FROM dm_topic0402_input_train_maintenance 
      WHERE id = ? AND del_flag = 0
    `;
    
    const result = await topic04Service.mysqlService.executeCustomQuery(sql, [orderId]);
    
    if (result.success && result.data.length > 0) {
      const processedData = topic04Service.processMaintenanceData(result.data);
      res.json({
        success: true,
        data: processedData[0],
        message: '获取运维订单详情成功'
      });
    } else {
      res.status(404).json({
        success: false,
        error: `未找到ID为 ${orderId} 的运维订单`
      });
    }
  } catch (error) {
    sendError(res, error);
  }
});

// 搜索运维订单
app.get('/api/topic04/maintenance/search', async (req, res) => {
  try {
    const { keyword, system, type, status, dateFrom, dateTo } = req.query;
    console.log('📥 收到搜索运维订单的请求:', req.query);
    
    let sql = `
      SELECT * FROM dm_topic0402_input_train_maintenance 
      WHERE del_flag = 0
    `;
    const params = [];
    
    if (keyword) {
      sql += ` AND (train_id LIKE ? OR fault_description LIKE ? OR repair_code LIKE ?)`;
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }
    
    if (system) {
      sql += ` AND system_module = ?`;
      params.push(system);
    }
    
    if (type) {
      sql += ` AND maintenance_type = ?`;
      params.push(type);
    }
    
    if (status) {
      sql += ` AND maintenance_status = ?`;
      params.push(status);
    }
    
    if (dateFrom) {
      sql += ` AND report_date >= ?`;
      params.push(dateFrom);
    }
    
    if (dateTo) {
      sql += ` AND report_date <= ?`;
      params.push(dateTo);
    }
    
    sql += ` ORDER BY report_date DESC LIMIT 100`;
    
    const result = await topic04Service.mysqlService.executeCustomQuery(sql, params);
    
    if (result.success) {
      const processedData = topic04Service.processMaintenanceData(result.data);
      res.json({
        success: true,
        data: {
          searchParams: req.query,
          total: processedData.length,
          records: processedData,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      sendResponse(res, result, '搜索运维订单失败');
    }
  } catch (error) {
    sendError(res, error);
  }
});

// ================================
// Topic04 生产任务相关API路由
// ================================

// 获取生产任务数据
app.get('/api/topic04/production/tasks', async (req, res) => {
  try {
    const { model_run_batch } = req.query;
    console.log(`📥 收到获取生产任务数据的请求，批次: ${model_run_batch || '20240905'}`);
    
    const result = await topic04Service.getProductionTasks(model_run_batch);
    sendResponse(res, result, '获取生产任务数据失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 根据订单号获取生产任务
app.get('/api/topic04/production/tasks/order/:orderNo', async (req, res) => {
  try {
    const { orderNo } = req.params;
    console.log(`📥 收到获取订单 "${orderNo}" 生产任务的请求`);
    
    const result = await topic04Service.getProductionTasksByOrder(orderNo);
    sendResponse(res, result, `获取订单 ${orderNo} 生产任务失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 获取生产任务统计数据
app.get('/api/topic04/production/statistics', async (req, res) => {
  try {
    const { model_run_batch } = req.query;
    console.log(`📥 收到获取生产任务统计数据的请求，批次: ${model_run_batch || '20240905'}`);
    
    const result = await topic04Service.getProductionTaskStatistics(model_run_batch);
    sendResponse(res, result, '获取生产任务统计数据失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 根据产品名称获取生产任务
app.get('/api/topic04/production/tasks/product/:productName', async (req, res) => {
  try {
    const { productName } = req.params;
    console.log(`📥 收到获取产品 "${productName}" 生产任务的请求`);
    
    const sql = `
      SELECT * FROM dm_topic0401_input_task 
      WHERE product_name = ? AND del_flag = 0
      ORDER BY task_id, procedure_order
    `;
    
    const result = await topic04Service.mysqlService.executeCustomQuery(sql, [productName]);
    
    if (result.success) {
      const processedData = topic04Service.processProductionTaskData(result.data);
      res.json({
        success: true,
        data: {
          productName: productName,
          total: processedData.length,
          tasks: processedData,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      sendResponse(res, result, `获取产品 ${productName} 生产任务失败`);
    }
  } catch (error) {
    sendError(res, error);
  }
});

// 根据工序获取生产任务
app.get('/api/topic04/production/tasks/procedure/:procedureName', async (req, res) => {
  try {
    const { procedureName } = req.params;
    console.log(`📥 收到获取工序 "${procedureName}" 生产任务的请求`);
    
    const sql = `
      SELECT * FROM dm_topic0401_input_task 
      WHERE procedure_name = ? AND del_flag = 0
      ORDER BY task_id, procedure_order
    `;
    
    const result = await topic04Service.mysqlService.executeCustomQuery(sql, [procedureName]);
    
    if (result.success) {
      const processedData = topic04Service.processProductionTaskData(result.data);
      res.json({
        success: true,
        data: {
          procedureName: procedureName,
          total: processedData.length,
          tasks: processedData,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      sendResponse(res, result, `获取工序 ${procedureName} 生产任务失败`);
    }
  } catch (error) {
    sendError(res, error);
  }
});

// 根据操作员获取生产任务
app.get('/api/topic04/production/tasks/jockey/:jockeyName', async (req, res) => {
  try {
    const { jockeyName } = req.params;
    console.log(`📥 收到获取操作员 "${jockeyName}" 生产任务的请求`);
    
    const sql = `
      SELECT * FROM dm_topic0401_input_task 
      WHERE jockey_name = ? AND del_flag = 0
      ORDER BY task_id, procedure_order
    `;
    
    const result = await topic04Service.mysqlService.executeCustomQuery(sql, [jockeyName]);
    
    if (result.success) {
      const processedData = topic04Service.processProductionTaskData(result.data);
      res.json({
        success: true,
        data: {
          jockeyName: jockeyName,
          total: processedData.length,
          tasks: processedData,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      sendResponse(res, result, `获取操作员 ${jockeyName} 生产任务失败`);
    }
  } catch (error) {
    sendError(res, error);
  }
});

// 根据工作中心获取生产任务
app.get('/api/topic04/production/tasks/workcenter/:workCenterName', async (req, res) => {
  try {
    const { workCenterName } = req.params;
    console.log(`📥 收到获取工作中心 "${workCenterName}" 生产任务的请求`);
    
    const sql = `
      SELECT * FROM dm_topic0401_input_task 
      WHERE work_center_name = ? AND del_flag = 0
      ORDER BY task_id, procedure_order
    `;
    
    const result = await topic04Service.mysqlService.executeCustomQuery(sql, [workCenterName]);
    
    if (result.success) {
      const processedData = topic04Service.processProductionTaskData(result.data);
      res.json({
        success: true,
        data: {
          workCenterName: workCenterName,
          total: processedData.length,
          tasks: processedData,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      sendResponse(res, result, `获取工作中心 ${workCenterName} 生产任务失败`);
    }
  } catch (error) {
    sendError(res, error);
  }
});

// 搜索生产任务
app.get('/api/topic04/production/tasks/search', async (req, res) => {
  try {
    const { keyword, product, procedure, jockey, workCenter, dateFrom, dateTo } = req.query;
    console.log('📥 收到搜索生产任务的请求:', req.query);
    
    let sql = `
      SELECT * FROM dm_topic0401_input_task 
      WHERE del_flag = 0
    `;
    const params = [];
    
    if (keyword) {
      sql += ` AND (task_id LIKE ? OR work_no LIKE ? OR order_no LIKE ? OR product_name LIKE ?)`;
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }
    
    if (product) {
      sql += ` AND product_name = ?`;
      params.push(product);
    }
    
    if (procedure) {
      sql += ` AND procedure_name = ?`;
      params.push(procedure);
    }
    
    if (jockey) {
      sql += ` AND jockey_name = ?`;
      params.push(jockey);
    }
    
    if (workCenter) {
      sql += ` AND work_center_name = ?`;
      params.push(workCenter);
    }
    
    if (dateFrom) {
      sql += ` AND plan_start_time >= ?`;
      params.push(dateFrom);
    }
    
    if (dateTo) {
      sql += ` AND plan_end_time <= ?`;
      params.push(dateTo);
    }
    
    sql += ` ORDER BY task_id, procedure_order LIMIT 200`;
    
    const result = await topic04Service.mysqlService.executeCustomQuery(sql, params);
    
    if (result.success) {
      const processedData = topic04Service.processProductionTaskData(result.data);
      res.json({
        success: true,
        data: {
          searchParams: req.query,
          total: processedData.length,
          tasks: processedData,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      sendResponse(res, result, '搜索生产任务失败');
    }
  } catch (error) {
    sendError(res, error);
  }
});

// 获取Topic04状态信息
app.get('/api/topic04/status', async (req, res) => {
  try {
    const result = await topic04Service.getStatus();
    sendResponse(res, result, '获取Topic04状态失败');
  } catch (error) {
    sendError(res, error);
  }
});

// ================================
// Topic03 API路由 - 车辆和人员匹配度管理
// ================================

// 根据人员ID获取其对所有车辆的匹配度
app.get('/api/topic03/person-train-matches', async (req, res) => {
  try {
    const { person_id, sort_by, sort_order, page, page_size, min_match_score } = req.query;
    
    if (!person_id) {
      return res.status(400).json({
        success: false,
        error: '人员ID不能为空'
      });
    }

    const options = {
      sortBy: sort_by,
      sortOrder: sort_order,
      page: parseInt(page) || 1,
      pageSize: parseInt(page_size) || 20
    };

    if (min_match_score !== undefined) {
      options.minMatchScore = parseFloat(min_match_score);
    }

    const result = await topic03Service.getPersonTrainMatches(person_id, options);
    sendResponse(res, result, `获取人员 ${person_id} 的车辆匹配度失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 根据车辆ID获取所有人员对该车辆的匹配度
app.get('/api/topic03/train-person-matches', async (req, res) => {
  try {
    const { train_id, sort_by, sort_order, page, page_size, min_match_score } = req.query;
    
    if (!train_id) {
      return res.status(400).json({
        success: false,
        error: '车辆ID不能为空'
      });
    }

    const options = {
      sortBy: sort_by,
      sortOrder: sort_order,
      page: parseInt(page) || 1,
      pageSize: parseInt(page_size) || 20
    };

    if (min_match_score !== undefined) {
      options.minMatchScore = parseFloat(min_match_score);
    }

    const result = await topic03Service.getTrainPersonMatches(train_id, options);
    sendResponse(res, result, `获取车辆 ${train_id} 的人员匹配度失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 获取所有人员列表及其匹配度统计
app.get('/api/topic03/person-list', async (req, res) => {
  try {
    const { sort_by, sort_order, page, page_size } = req.query;

    const options = {
      sortBy: sort_by,
      sortOrder: sort_order,
      page: parseInt(page) || 1,
      pageSize: parseInt(page_size) || 50
    };

    const result = await topic03Service.getPersonList(options);
    sendResponse(res, result, '获取人员列表失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 获取所有车辆列表及其匹配度统计
app.get('/api/topic03/train-list', async (req, res) => {
  try {
    const { sort_by, sort_order, page, page_size } = req.query;

    const options = {
      sortBy: sort_by,
      sortOrder: sort_order,
      page: parseInt(page) || 1,
      pageSize: parseInt(page_size) || 50
    };

    const result = await topic03Service.getTrainList(options);
    sendResponse(res, result, '获取车辆列表失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 获取人员详细信息及匹配度数据
app.get('/api/topic03/person-detail/:personId', async (req, res) => {
  try {
    const { personId } = req.params;
    const result = await topic03Service.getPersonDetail(decodeURIComponent(personId));
    sendResponse(res, result, `获取人员 ${personId} 详细信息失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 获取车辆详细信息及匹配度数据
app.get('/api/topic03/train-detail/:trainId', async (req, res) => {
  try {
    const { trainId } = req.params;
    const result = await topic03Service.getTrainDetail(decodeURIComponent(trainId));
    sendResponse(res, result, `获取车辆 ${trainId} 详细信息失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 搜索匹配记录
app.get('/api/topic03/search-matches', async (req, res) => {
  try {
    const {
      personId,
      trainId,
      minScore,
      maxScore,
      dateFrom,
      dateTo,
      sort_by,
      sort_order,
      page,
      page_size
    } = req.query;

    const searchParams = {
      personId,
      trainId,
      minScore: minScore ? parseFloat(minScore) : undefined,
      maxScore: maxScore ? parseFloat(maxScore) : undefined,
      dateFrom,
      dateTo
    };

    const options = {
      sortBy: sort_by,
      sortOrder: sort_order,
      page: parseInt(page) || 1,
      pageSize: parseInt(page_size) || 20
    };

    const result = await topic03Service.searchMatches(searchParams, options);
    sendResponse(res, result, '搜索匹配记录失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 获取匹配度统计信息
app.get('/api/topic03/match-statistics', async (req, res) => {
  try {
    const { group_by } = req.query;
    
    const options = {
      groupBy: group_by
    };

    const result = await topic03Service.getMatchStatistics(options);
    sendResponse(res, result, '获取匹配度统计失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 获取推荐匹配
app.get('/api/topic03/recommendations', async (req, res) => {
  try {
    const { type, id, top_n, min_score } = req.query;

    if (!type || !id) {
      return res.status(400).json({
        success: false,
        error: '推荐类型和ID不能为空'
      });
    }

    if (!['person', 'train'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: '推荐类型必须是 person 或 train'
      });
    }

    const params = {
      type,
      id,
      topN: parseInt(top_n) || 10,
      minScore: parseFloat(min_score) || 0.6
    };

    const result = await topic03Service.getRecommendations(params);
    sendResponse(res, result, '获取推荐匹配失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 批量获取匹配度数据
app.post('/api/topic03/batch-matches', async (req, res) => {
  try {
    const { personIds, trainIds } = req.body;

    if (!personIds && !trainIds) {
      return res.status(400).json({
        success: false,
        error: '至少需要提供人员ID或车辆ID列表'
      });
    }

    const params = {
      personIds,
      trainIds
    };

    const result = await topic03Service.getBatchMatches(params);
    sendResponse(res, result, '批量获取匹配度数据失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 获取所有匹配数据
app.get('/api/topic03/matches', async (req, res) => {
  try {
    const { sort_by, sort_order, page, page_size } = req.query;

    const options = {
      sortBy: sort_by,
      sortOrder: sort_order,
      page: parseInt(page) || 1,
      pageSize: parseInt(page_size) || 100
    };

    const result = await topic03Service.getAllMatches(options);
    sendResponse(res, result, '获取所有匹配数据失败');
  } catch (error) {
    sendError(res, error);
  }
});


// 检查Topic03数据库连接状态
app.get('/api/topic03/connection', async (req, res) => {
  try {
    const result = await topic03Service.checkConnection();
    sendResponse(res, result, 'Topic03数据库连接检查失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 获取Topic03状态信息
app.get('/api/topic03/status', async (req, res) => {
  try {
    const result = {
      success: true,
      data: {
        service: 'Topic03Service',
        description: '车辆和人员匹配度管理服务',
        version: '1.0.0',
        status: 'running',
        features: [
          '人员车辆匹配度查询',
          '车辆人员匹配度查询',
          '匹配度统计分析',
          '推荐算法',
          '批量数据操作',
          '搜索功能',
          '数据管理'
        ],
        timestamp: new Date().toISOString()
      }
    };
    sendResponse(res, result, '获取Topic03状态失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 获取表结构信息
app.get('/api/topic03/table-structure', async (req, res) => {
  try {
    const result = await topic03Service.getTableStructure();
    sendResponse(res, result, '获取表结构信息失败');
  } catch (error) {
    sendError(res, error);
  }
});

// ================================
// LLM API服务初始化
// ================================
llmApiServer.setupRoutes(app);

// ================================
// 节点详情相关API
// ================================

// 获取节点的详细信息，包括当前流程编号
app.get('/api/node-detail/:nodeType/:nodeId', async (req, res) => {
  try {
    const { nodeType, nodeId } = req.params;
    const collectionName = `${nodeType}_flow_mermaid`;
    
    const result = await flowDataService.getNodeDetail(collectionName, nodeId);
    sendResponse(res, result, `获取节点 ${nodeId} 详情失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 获取节点的当前实现流程（根据currentFlowNumber自动获取对应的mermaidDefinition）
app.get('/api/node-current-flow/:nodeType/:nodeId', async (req, res) => {
  try {
    const { nodeType, nodeId } = req.params;
    const collectionName = `${nodeType}_flow_mermaid`;
    
    const result = await flowDataService.getNodeCurrentFlow(collectionName, nodeId);
    sendResponse(res, result, `获取节点 ${nodeId} 当前流程失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 获取节点指定编号的实现流程
app.get('/api/node-implementation/:nodeType/:nodeId', async (req, res) => {
  try {
    const { nodeType, nodeId } = req.params;
    const { flowNumber } = req.query;
    const collectionName = `${nodeType}_flow_mermaid`;
    
    if (!flowNumber) {
      return res.status(400).json({
        success: false,
        error: '流程编号不能为空'
      });
    }
    
    const result = await flowDataService.getNodeImplementation(collectionName, nodeId, parseInt(flowNumber));
    sendResponse(res, result, `获取节点 ${nodeId} 流程${flowNumber}失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 获取节点的所有流程数据
app.get('/api/node-all-flows/:nodeType/:nodeId', async (req, res) => {
  try {
    const { nodeType, nodeId } = req.params;
    const collectionName = `${nodeType}_flow_mermaid`;
    
    const result = await flowDataService.getNodeAllFlows(collectionName, nodeId);
    sendResponse(res, result, `获取节点 ${nodeId} 所有流程失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 切换节点的当前流程
app.put('/api/node-flow-switch/:nodeType/:nodeId', async (req, res) => {
  try {
    const { nodeType, nodeId } = req.params;
    const { currentFlowNumber } = req.body;
    const collectionName = `${nodeType}_flow_mermaid`;
    
    if (typeof currentFlowNumber !== 'number' || currentFlowNumber < 1) {
      return res.status(400).json({
        success: false,
        error: '流程编号必须是大于0的数字'
      });
    }
    
    const result = await flowDataService.switchNodeFlow(collectionName, nodeId, currentFlowNumber);
    sendResponse(res, result, `切换节点 ${nodeId} 流程失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 获取节点的所有可用流程列表
app.get('/api/node-flow-list/:nodeType/:nodeId', async (req, res) => {
  try {
    const { nodeType, nodeId } = req.params;
    const collectionName = `${nodeType}_flow_mermaid`;
    
    const result = await flowDataService.getNodeFlowList(collectionName, nodeId);
    sendResponse(res, result, `获取节点 ${nodeId} 流程列表失败`);
  } catch (error) {
    sendError(res, error);
  }
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend service is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 启动服务器
function startServer() {
  app.listen(PORT, async () => {
    console.log(`🚀 API服务器运行在 http://localhost:${PORT}`);
    await initializeService();
  });
}

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n🔄 正在关闭服务器...');
  await flowDataService.disconnect();
  await planningTimeService.disconnect();
  await neuralNetworkService.disconnect();
  await riskDataService.disconnect();
  await mysqlService.disconnect();
  await topic01Service.cleanup();
  await topic02Service.cleanup();
  await topic03Service.cleanup();
  await topic04Service.cleanup();
  process.exit(0);
});

// 导出启动函数
module.exports = { startServer, app }; 