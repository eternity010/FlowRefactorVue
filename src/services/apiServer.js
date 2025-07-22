const express = require('express');
const cors = require('cors');
const FlowDataService = require('./flowDataService');
const PlanningTimeService = require('./planningTimeService');
const NeuralNetworkService = require('./neuralNetworkService');

const app = express();
const PORT = 3001;

// 启用CORS，允许前端访问
app.use(cors());
app.use(express.json());

// 创建服务实例
const flowDataService = new FlowDataService();
const planningTimeService = new PlanningTimeService();
const neuralNetworkService = new NeuralNetworkService();

// 初始化数据库连接
async function initializeService() {
  try {
    await flowDataService.connect();
    await planningTimeService.connect();
    await neuralNetworkService.connect();
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

// 获取参数历史记录
app.get('/api/neural-network/parameters/history', async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const data = await neuralNetworkService.getNeuralNetworkParameterHistory(parseInt(limit), parseInt(offset));
    
    res.json({
      code: 200,
      message: '获取成功',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '获取参数历史记录失败',
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
  process.exit(0);
});

// 导出启动函数
module.exports = { startServer, app }; 