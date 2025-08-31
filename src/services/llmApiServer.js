const LLMService = require('./llmService');
const FlowDataService = require('./flowDataService');
const RiskDataService = require('./riskDataService');

/**
 * LLM API服务器
 * 处理所有大模型相关的API请求
 */
class LLMApiServer {
  constructor(services = {}) {
    // 如果传入已连接的服务实例，则使用它们；否则创建新的实例
    this.llmService = services.llmService || new LLMService();
    this.flowDataService = services.flowDataService || new FlowDataService();
    this.riskDataService = services.riskDataService || new RiskDataService();

    // 如果使用默认实例，需要连接数据库
    this.needsConnection = !services.flowDataService || !services.riskDataService;
  }

  /**
   * 初始化服务连接（仅当使用默认实例时需要）
   */
  async initialize() {
    if (this.needsConnection) {
      try {
        if (this.flowDataService.connect) {
          await this.flowDataService.connect();
        }
        if (this.riskDataService.connect) {
          await this.riskDataService.connect();
        }
        console.log('✅ LLMApiServer服务连接成功');
      } catch (error) {
        console.error('❌ LLMApiServer服务连接失败:', error);
        throw error;
      }
    }
  }

  /**
   * 统一响应处理函数
   */
  sendResponse(res, result, errorMessage = '操作失败') {
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

  /**
   * 统一错误处理函数
   */
  sendError(res, error, statusCode = 500) {
    res.status(statusCode).json({
      success: false,
      error: error.message || '服务器内部错误'
    });
  }

  /**
   * 设置LLM相关的路由
   */
  setupRoutes(app) {
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

        const result = await this.llmService.chat(message, systemMessage);
        this.sendResponse(res, result, '对话失败');
      } catch (error) {
        this.sendError(res, error);
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

        const result = await this.llmService.chatWithHistory(messages);
        this.sendResponse(res, result, '多轮对话失败');
      } catch (error) {
        this.sendError(res, error);
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

        const result = await this.llmService.analyzeProcess(processData);
        this.sendResponse(res, result, '流程分析失败');
      } catch (error) {
        this.sendError(res, error);
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

        const result = await this.llmService.assessRisks(riskData);
        this.sendResponse(res, result, '风险评估失败');
      } catch (error) {
        this.sendError(res, error);
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

        const result = await this.llmService.getRecommendations(contextData);
        this.sendResponse(res, result, '获取推荐失败');
      } catch (error) {
        this.sendError(res, error);
      }
    });

    // 检查连接状态
    app.get('/api/llm/connection', async (req, res) => {
      try {
        const result = await this.llmService.checkConnection();
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
        const riskDataResult = await this.riskDataService.getAllRiskData();

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
        const systemMessage = `你是专业的风险评估专家。请分析采购流程数据，并严格按照以下JSON格式输出结果，风险值范围应该在0-300之间：

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

        const analysisResult = await this.llmService.chat(
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
        this.sendError(res, error);
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
        const processStructureResult = await this.flowDataService.getMermaidFlowData('purchase');

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
    "overallRiskLevel": "HIGH/MEDIUM/LOW",
    "criticalPath": "关键风险路径",
    "mainRecommendation": "主要建议"
  }
}`;

        // 调用大模型分析
        const analysisResult = await this.llmService.chat(
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
        this.sendError(res, error);
      }
    });

    // 保存节点风险状态数据到MongoDB（原始API结果）
    app.post('/api/llm/save-node-risk-status', async (req, res) => {
      try {
        console.log('🔄 开始保存节点风险状态数据（原始API结果）...');

        const { nodeRiskStatusData } = req.body;

        // 参数验证
        if (!nodeRiskStatusData) {
          return res.status(400).json({
            success: false,
            error: '缺少节点风险状态数据'
          });
        }

        console.log('✅ 节点风险状态数据验证通过');
        console.log('📋 数据类型:', typeof nodeRiskStatusData);
        console.log('📋 数据结构:', {
          hasNodeRiskAnalysis: !!nodeRiskStatusData.nodeRiskAnalysis,
          hasAnalysis: !!nodeRiskStatusData.analysis,
          hasInputInfo: !!nodeRiskStatusData.inputInfo,
          keys: Object.keys(nodeRiskStatusData)
        });

        // 准备保存到MongoDB的数据
        const timestamp = new Date();
        const dataToSave = {
          _id: timestamp.toISOString(), // 使用时间作为ID
          timestamp: timestamp,
          createdAt: timestamp,
          originalApiResult: nodeRiskStatusData, // 明确标记为原始API结果
          dataType: 'original_api_result', // 数据类型标记
          version: '1.0.0',
          source: 'ProcessOptimizationView'
        };

        console.log('📝 准备保存数据:', {
          id: dataToSave._id,
          timestamp: dataToSave.timestamp,
          dataType: dataToSave.dataType,
          source: dataToSave.source,
          originalDataKeys: Object.keys(nodeRiskStatusData)
        });

        // 使用flowDataService保存到maintenance_system数据库的node_risk_status_data集合
        const saveResult = await this.flowDataService.saveToCollection('node_risk_status_data', dataToSave);

        if (saveResult.success) {
          console.log('✅ 节点风险状态数据（原始API结果）保存成功');
          res.json({
            success: true,
            data: {
              id: dataToSave._id,
              timestamp: dataToSave.timestamp,
              dataType: dataToSave.dataType,
              message: '节点风险状态数据（原始API结果）保存成功'
            }
          });
        } else {
          console.error('❌ 保存失败:', saveResult.error);
          res.status(500).json({
            success: false,
            error: '保存节点风险状态数据失败: ' + saveResult.error
          });
        }

      } catch (error) {
        this.sendError(res, error);
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
        this.sendError(res, error);
      }
    });
  }
}

module.exports = LLMApiServer;
