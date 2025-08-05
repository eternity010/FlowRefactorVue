const express = require('express');
const cors = require('cors');
const FlowDataService = require('./flowDataService');
const PlanningTimeService = require('./planningTimeService');
const NeuralNetworkService = require('./neuralNetworkService');
const ProcessOptimizationService = require('./processOptimizationService');
const LLMService = require('./llmService');
const RiskDataService = require('./riskDataService');

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
const llmService = new LLMService();
const riskDataService = new RiskDataService();

// 初始化数据库连接
async function initializeService() {
  try {
    await flowDataService.connect();
    await planningTimeService.connect();
    await neuralNetworkService.connect();
    await riskDataService.connect();
    console.log('✅ API服务已连接到MongoDB');
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
// LLM大模型相关API
// ================================

// 单轮对话
app.post('/api/llm/chat', async (req, res) => {
  try {
    const { message, systemMessage } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: '消息内容不能为空'
      });
    }

    const result = await llmService.chat(message, systemMessage);
    sendResponse(res, result, '对话失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 多轮对话
app.post('/api/llm/chat-history', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: '消息历史格式不正确，需要提供消息数组'
      });
    }

    if (messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: '消息数组不能为空，至少需要包含一条消息'
      });
    }

    // 验证消息格式
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (!msg.role || !msg.content) {
        return res.status(400).json({
          success: false,
          error: `消息${i + 1}格式错误，需要包含role和content字段`
        });
      }
    }

    const result = await llmService.chatWithHistory(messages);
    sendResponse(res, result, '多轮对话失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 流程分析
app.post('/api/llm/analyze-process', async (req, res) => {
  try {
    const { processData } = req.body;
    
    if (!processData) {
      return res.status(400).json({
        success: false,
        error: '流程数据不能为空'
      });
    }

    const result = await llmService.analyzeProcess(processData);
    sendResponse(res, result, '流程分析失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 风险评估
app.post('/api/llm/assess-risks', async (req, res) => {
  try {
    const { riskData } = req.body;
    
    if (!riskData) {
      return res.status(400).json({
        success: false,
        error: '风险数据不能为空'
      });
    }

    const result = await llmService.assessRisks(riskData);
    sendResponse(res, result, '风险评估失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 智能推荐
app.post('/api/llm/recommendations', async (req, res) => {
  try {
    const { contextData } = req.body;
    
    if (!contextData) {
      return res.status(400).json({
        success: false,
        error: '上下文数据不能为空'
      });
    }

    const result = await llmService.getRecommendations(contextData);
    sendResponse(res, result, '获取推荐失败');
  } catch (error) {
    sendError(res, error);
  }
});

// 检查连接状态
app.get('/api/llm/connection', async (req, res) => {
  try {
    const result = await llmService.checkConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      connected: false,
      message: '连接检查失败',
      error: error.message
    });
  }
});

// 风险数据结构化分析
app.post('/api/llm/analyze-risk-structure', async (req, res) => {
  try {
    console.log('🔄 开始执行风险数据结构化分析...');
    
    // 1. 从数据库获取风险数据
    const riskDataResult = await riskDataService.getAllRiskData();
    
    if (!riskDataResult.success) {
      return res.status(500).json({
        success: false,
        error: '获取风险数据失败: ' + riskDataResult.error
      });
    }

    const riskData = riskDataResult.data;
    console.log(`✅ 成功获取 ${riskData.length} 条风险数据`);
    
    if (!riskData || !Array.isArray(riskData) || riskData.length === 0) {
      return res.status(400).json({
        success: false,
        error: '数据库中没有风险数据'
      });
    }

    // 选择一个高置信度样本进行分析
    const highConfidenceRecord = riskData
      .sort((a, b) => parseInt(b.confidence) - parseInt(a.confidence))[0];

    if (!highConfidenceRecord || !highConfidenceRecord.purchase) {
      return res.status(400).json({
        success: false,
        error: '风险数据格式不正确，缺少purchase字段'
      });
    }

    const analysisData = {
      analysisRequest: "请分析采购流程各环节的风险等级",
      purchaseSteps: highConfidenceRecord.purchase,
      confidence: highConfidenceRecord.confidence
    };

    // 系统提示词，要求严格JSON输出
    const systemMessage = `你是专业的风险评估专家。请分析采购流程数据，并严格按照以下JSON格式输出结果：

{
  "riskClassification": {
    "highRisk": {
      "threshold": "风险值范围",
      "steps": ["环节1", "环节2"],
      "description": "高风险特征描述"
    },
    "mediumRisk": {
      "threshold": "风险值范围", 
      "steps": ["环节1", "环节2"],
      "description": "中风险特征描述"
    },
    "lowRisk": {
      "threshold": "风险值范围",
      "steps": ["环节1", "环节2"],
      "description": "低风险特征描述"
    }
  },
  "summary": {
    "totalSteps": 8,
    "highRiskCount": 0,
    "mediumRiskCount": 0, 
    "lowRiskCount": 0,
    "criticalStep": "风险最高的环节",
    "recommendation": "主要建议"
  }
}

请只输出JSON格式，不要添加任何其他文字说明。`;

    const analysisResult = await llmService.chat(
      `请分析以下采购流程风险数据：\n${JSON.stringify(analysisData, null, 2)}`,
      systemMessage
    );

    if (analysisResult.success) {
      try {
        // 尝试解析JSON
        let parsedResult;
        let rawContent = analysisResult.data.content.trim();

        // 直接尝试解析
        try {
          parsedResult = JSON.parse(rawContent);
        } catch (e1) {
          // 去除```包裹以及```json标记
          const cleaned = rawContent
            .replace(/```json\s*/gi, '')
            .replace(/```/g, '')
            .trim();
          parsedResult = JSON.parse(cleaned); // 如果仍然失败会抛异常交给外层catch
        }
        
        res.json({
          success: true,
          data: {
            originalData: riskData,
            analysis: {
              riskAnalysis: parsedResult,
              usage: analysisResult.data.usage,
              model: analysisResult.data.model,
              timestamp: analysisResult.data.timestamp
            },
            dataInfo: {
              totalRecords: riskData.length,
              dataSource: '风险数据库',
              analyzedRecord: {
                confidence: highConfidenceRecord.confidence,
                hasData: true
              }
            }
          }
        });
      } catch (parseError) {
        // 如果JSON解析失败，返回原始内容
        res.json({
          success: false,
          error: 'LLM输出格式不是有效的JSON',
          rawContent: analysisResult.data.content,
          usage: analysisResult.data.usage
        });
      }
    } else {
      res.status(500).json({
        success: false,
        error: analysisResult.error
      });
    }

  } catch (error) {
    sendError(res, error);
  }
});

// 流程节点风险分析
app.post('/api/llm/analyze-process-node-risk', async (req, res) => {
  try {
    console.log('🔄 开始执行流程节点风险分析...');
    
    const { riskData } = req.body;
    
    // 参数验证
    if (!riskData || !Array.isArray(riskData) || riskData.length === 0) {
      return res.status(400).json({
        success: false,
        error: '缺少有效的风险数据'
      });
    }
    
    console.log(`✅ 风险数据验证通过: ${riskData.length} 条风险记录`);
    
    // 从数据库获取采购流程结构数据
    console.log('🔄 正在从数据库获取采购流程结构数据...');
    const processStructureResult = await flowDataService.getMermaidFlowData('purchase');
    
    if (!processStructureResult.success) {
      return res.status(500).json({
        success: false,
        error: '获取流程结构数据失败: ' + processStructureResult.error
      });
    }
    
    const processStructure = processStructureResult.data;
    console.log(`✅ 成功获取流程结构数据: ${processStructure.length} 个采购流程节点`);
    
    // 准备分析请求数据
    const analysisRequest = {
      riskData: riskData,
      processStructure: processStructure
    };
    
    // 构建系统提示词
    const systemMessage = `你是一个专业的流程风险分析专家。请基于提供的风险数据和流程结构，分析出在风险数据影响下处于高危状态的流程节点。

分析要求：
1. 仔细分析风险数据中的风险因子和风险值
2. 对照流程结构，识别哪些节点与高风险因子相关
3. 确定高危节点并提供详细的风险分析理由

请以以下JSON格式输出结果：
{
  "highRiskNodes": [
    {
      "nodeId": "节点ID",
      "nodeName": "节点名称", 
      "riskLevel": "HIGH/MEDIUM/LOW",
      "riskScore": 0.85,
      "riskFactors": ["相关风险因子1", "相关风险因子2"],
      "riskReason": "详细风险分析原因",
      "recommendation": "风险缓解建议"
    }
  ],
  "summary": {
    "totalNodes": 总节点数,
    "highRiskNodes": 高危节点数,
    "mediumRiskNodes": 中风险节点数,
    "lowRiskNodes": 低风险节点数,
    "overallRiskLevel": "整体风险等级",
    "criticalPath": "关键风险路径",
    "mainRecommendation": "主要建议"
  }
}`;

    // 调用大模型分析
    const analysisResult = await llmService.chat(
      `请分析以下风险数据和流程结构，识别高危节点：

风险数据：
${JSON.stringify(analysisRequest.riskData, null, 2)}

流程结构：
${JSON.stringify(analysisRequest.processStructure, null, 2)}`,
      systemMessage
    );

    if (analysisResult.success) {
      try {
        // 尝试解析JSON
        let parsedResult;
        let rawContent = analysisResult.data.content.trim();

        // 直接尝试解析
        try {
          parsedResult = JSON.parse(rawContent);
        } catch (e1) {
          // 去除```包裹以及```json标记
          const cleaned = rawContent
            .replace(/```json\s*/gi, '')
            .replace(/```/g, '')
            .trim();
          parsedResult = JSON.parse(cleaned);
        }
        
        res.json({
          success: true,
          data: {
            nodeRiskAnalysis: parsedResult,
            analysis: {
              usage: analysisResult.data.usage,
              model: analysisResult.data.model,
              timestamp: analysisResult.data.timestamp
            },
            inputInfo: {
              riskDataCount: riskData.length,
              processNodeCount: processStructure.length,
              dataSource: '数据库采购流程'
            }
          }
        });
      } catch (parseError) {
        // 如果JSON解析失败，返回原始内容
        res.json({
          success: false,
          error: 'LLM输出格式不是有效的JSON',
          rawContent: analysisResult.data.content,
          usage: analysisResult.data.usage
        });
      }
    } else {
      res.status(500).json({
        success: false,
        error: analysisResult.error
      });
    }

  } catch (error) {
    sendError(res, error);
  }
});

// 获取使用统计（占位符，后续可扩展）
app.get('/api/llm/usage-stats', async (req, res) => {
  try {
    // 这里可以后续添加使用统计逻辑
    res.json({
      success: true,
      data: {
        totalCalls: 0,
        totalTokens: 0,
        todayCalls: 0,
        todayTokens: 0,
        message: '统计功能待开发'
      }
    });
  } catch (error) {
    sendError(res, error);
  }
});

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
  process.exit(0);
});

// 导出启动函数
module.exports = { startServer, app }; 