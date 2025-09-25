const { MongoClient } = require('mongodb');
const mongoConfig = require('../../config/mongodb.config');

// 使用统一的MongoDB配置
const MONGODB_URI = mongoConfig.getConnectionString();
const DATABASE_NAME = mongoConfig.getDatabaseName();
const CONNECTION_OPTIONS = mongoConfig.getConnectionOptions();
const COLLECTION_NAME = 'planning_time_data';
const REFACTOR_TIMING_COLLECTION = 'refactor_timing_data';
const LLM_ANALYSIS_COLLECTION = 'llm_analysis_data';

/**
 * 规划时间数据服务类
 */
class PlanningTimeService {
  constructor() {
    this.client = null;
    this.db = null;
    this.collection = null;
    this.refactorTimingCollection = null;
    this.llmAnalysisCollection = null;
    this.isConnected = false;
    this.currentMomentState = null; // 用于跟踪当前的时机状态
  }

  /**
   * 连接到MongoDB
   */
  async connect() {
    try {
      if (this.isConnected) {
        return;
      }

      // 验证配置
      if (!mongoConfig.validateConfig()) {
        throw new Error('MongoDB配置验证失败');
      }

      console.log('🔗 正在连接MongoDB (规划时间服务)...');
      mongoConfig.showCurrentConfig();
      
      // 使用配置文件中的选项连接
      this.client = new MongoClient(MONGODB_URI, CONNECTION_OPTIONS);
      await this.client.connect();
      
      this.db = this.client.db(DATABASE_NAME);
      this.collection = this.db.collection(COLLECTION_NAME);
      this.refactorTimingCollection = this.db.collection(REFACTOR_TIMING_COLLECTION);
      this.llmAnalysisCollection = this.db.collection(LLM_ANALYSIS_COLLECTION);
      this.isConnected = true;
      
      console.log(`✅ MongoDB连接成功: ${DATABASE_NAME}.${COLLECTION_NAME}`);
    } catch (error) {
      console.error('❌ MongoDB连接失败:', error);
      throw error;
    }
  }

  /**
   * 断开MongoDB连接
   */
  async disconnect() {
    try {
      if (this.client && this.isConnected) {
        await this.client.close();
        this.isConnected = false;
        console.log('🔌 MongoDB连接已关闭');
      }
    } catch (error) {
      console.error('❌ 关闭MongoDB连接失败:', error);
    }
  }

  /**
   * 确保连接
   */
  async ensureConnection() {
    if (!this.isConnected) {
      await this.connect();
    }
  }

  /**
   * 获取完整的规划时间数据
   * @returns {Promise<Object>} 规划时间数据
   */
  async getPlanningTimeData() {
    try {
      await this.ensureConnection();
      
      const document = await this.collection.findOne(
        { documentType: 'planning_time_analysis' },
        { sort: { createdAt: -1 } }
      );

      if (!document) {
        throw new Error('未找到规划时间数据');
      }

      return document;
    } catch (error) {
      console.error('获取规划时间数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取统计数据
   * @returns {Promise<Object>} 统计数据
   */
  async getStatistics() {
    try {
      await this.ensureConnection();
      
      const document = await this.collection.findOne(
        { documentType: 'planning_time_analysis' },
        { 
          projection: { statistics: 1 },
          sort: { createdAt: -1 }
        }
      );

      if (!document || !document.statistics) {
        throw new Error('未找到统计数据');
      }

      return document.statistics;
    } catch (error) {
      console.error('获取统计数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取样本数据
   * @returns {Promise<Object>} 样本数据
   */
  async getSampleData() {
    try {
      await this.ensureConnection();
      
      const document = await this.collection.findOne(
        { documentType: 'planning_time_analysis' },
        { 
          projection: { sampleData: 1 },
          sort: { createdAt: -1 }
        }
      );

      if (!document || !document.sampleData) {
        throw new Error('未找到样本数据');
      }

      return document.sampleData;
    } catch (error) {
      console.error('获取样本数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取预测方案数据
   * @returns {Promise<Array>} 预测方案数据
   */
  async getPredictionSchemes() {
    try {
      await this.ensureConnection();
      
      const document = await this.collection.findOne(
        { documentType: 'planning_time_analysis' },
        { 
          projection: { predictionSchemes: 1 },
          sort: { createdAt: -1 }
        }
      );

      if (!document || !document.predictionSchemes) {
        throw new Error('未找到预测方案数据');
      }

      return document.predictionSchemes;
    } catch (error) {
      console.error('获取预测方案数据失败:', error);
      throw error;
    }
  }

  /**
   * 根据ID获取指定预测方案
   * @param {string} schemeId 方案ID
   * @returns {Promise<Object>} 预测方案数据
   */
  async getPredictionSchemeById(schemeId) {
    try {
      await this.ensureConnection();
      
      const document = await this.collection.findOne(
        { 
          documentType: 'planning_time_analysis',
          'predictionSchemes.schemeId': schemeId
        },
        { 
          projection: { 
            'predictionSchemes.$': 1 
          },
          sort: { createdAt: -1 }
        }
      );

      if (!document || !document.predictionSchemes || document.predictionSchemes.length === 0) {
        throw new Error(`未找到预测方案: ${schemeId}`);
      }

      return document.predictionSchemes[0];
    } catch (error) {
      console.error(`获取预测方案 ${schemeId} 失败:`, error);
      throw error;
    }
  }

  /**
   * 获取控制台模板数据
   * @returns {Promise<Object>} 控制台模板数据
   */
  async getConsoleTemplate() {
    try {
      await this.ensureConnection();
      
      const document = await this.collection.findOne(
        { documentType: 'planning_time_analysis' },
        { 
          projection: { consoleTemplate: 1 },
          sort: { createdAt: -1 }
        }
      );

      if (!document || !document.consoleTemplate) {
        throw new Error('未找到控制台模板数据');
      }

      return document.consoleTemplate;
    } catch (error) {
      console.error('获取控制台模板数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取流程配置数据
   * @returns {Promise<Object>} 流程配置数据
   */
  async getFlowConfiguration() {
    try {
      await this.ensureConnection();
      
      const document = await this.collection.findOne(
        { documentType: 'planning_time_analysis' },
        { 
          projection: { flowConfiguration: 1 },
          sort: { createdAt: -1 }
        }
      );

      if (!document || !document.flowConfiguration) {
        throw new Error('未找到流程配置数据');
      }

      return document.flowConfiguration;
    } catch (error) {
      console.error('获取流程配置数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取边数据
   * @returns {Promise<Array>} 边数据
   */
  async getEdgeData() {
    try {
      await this.ensureConnection();
      
      const document = await this.collection.findOne(
        { documentType: 'planning_time_analysis' },
        { 
          projection: { 'sampleData.edges': 1 },
          sort: { createdAt: -1 }
        }
      );

      if (!document || !document.sampleData || !document.sampleData.edges) {
        throw new Error('未找到边数据');
      }

      return document.sampleData.edges;
    } catch (error) {
      console.error('获取边数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取历史准确度数据
   * @param {string} schemeId 方案ID（可选）
   * @returns {Promise<Object|Array>} 历史准确度数据
   */
  async getAccuracyHistory(schemeId = null) {
    try {
      await this.ensureConnection();
      
      if (schemeId) {
        // 获取指定方案的历史准确度
        const document = await this.collection.findOne(
          { 
            documentType: 'planning_time_analysis',
            'predictionSchemes.schemeId': schemeId
          },
          { 
            projection: { 
              'predictionSchemes.$': 1 
            },
            sort: { createdAt: -1 }
          }
        );

        if (!document || !document.predictionSchemes || document.predictionSchemes.length === 0) {
          throw new Error(`未找到预测方案: ${schemeId}`);
        }

        return {
          schemeId: schemeId,
          accuracyHistory: document.predictionSchemes[0].accuracyHistory,
          currentAccuracy: document.predictionSchemes[0].currentAccuracy
        };
      } else {
        // 获取所有方案的历史准确度
        const document = await this.collection.findOne(
          { documentType: 'planning_time_analysis' },
          { 
            projection: { predictionSchemes: 1 },
            sort: { createdAt: -1 }
          }
        );

        if (!document || !document.predictionSchemes) {
          throw new Error('未找到预测方案数据');
        }

        return document.predictionSchemes.map(scheme => ({
          schemeId: scheme.schemeId,
          schemeName: scheme.schemeName,
          accuracyHistory: scheme.accuracyHistory,
          currentAccuracy: scheme.currentAccuracy
        }));
      }
    } catch (error) {
      console.error('获取历史准确度数据失败:', error);
      throw error;
    }
  }

  /**
   * 更新预测方案准确度
   * @param {string} schemeId 方案ID
   * @param {number} accuracy 新的准确度
   * @returns {Promise<Object>} 更新结果
   */
  async updatePredictionAccuracy(schemeId, accuracy) {
    try {
      await this.ensureConnection();
      
      // 先获取当前文档
      const document = await this.collection.findOne(
        { 
          documentType: 'planning_time_analysis',
          'predictionSchemes.schemeId': schemeId
        }
      );

      if (!document) {
        throw new Error(`未找到包含方案 ${schemeId} 的文档`);
      }

      // 更新准确度和历史记录
      const result = await this.collection.updateOne(
        { 
          _id: document._id,
          'predictionSchemes.schemeId': schemeId
        },
        { 
          $set: {
            'predictionSchemes.$.currentAccuracy': accuracy,
            'predictionSchemes.$.performance.lastUpdated': new Date(),
            updatedAt: new Date()
          },
          $push: {
            'predictionSchemes.$.accuracyHistory': accuracy
          }
        }
      );

      if (result.matchedCount === 0) {
        throw new Error(`未找到预测方案: ${schemeId}`);
      }

      return {
        schemeId: schemeId,
        newAccuracy: accuracy,
        updated: result.modifiedCount > 0
      };
    } catch (error) {
      console.error(`更新预测方案 ${schemeId} 准确度失败:`, error);
      throw error;
    }
  }

  /**
   * 获取数据概览
   * @returns {Promise<Object>} 数据概览
   */
  async getDataOverview() {
    try {
      await this.ensureConnection();
      
      const totalCount = await this.collection.countDocuments({ documentType: 'planning_time_analysis' });
      const latestDocument = await this.collection.findOne(
        { documentType: 'planning_time_analysis' },
        { 
          projection: { _id: 1, createdAt: 1, version: 1, statistics: 1 },
          sort: { createdAt: -1 }
        }
      );

      return {
        totalDocuments: totalCount,
        latestDocument: latestDocument,
        hasData: totalCount > 0
      };
    } catch (error) {
      console.error('获取数据概览失败:', error);
      throw error;
    }
  }

  // ==================== 重构时机数据相关方法 ====================

  /**
   * 获取所有重构时机数据
   * @returns {Promise<Array>} 重构时机数据列表
   */
  async getRefactorTimingData() {
    try {
      await this.ensureConnection();
      
      const documents = await this.refactorTimingCollection.find({})
        .sort({ timestamp: -1 })
        .toArray();

      if (!documents || documents.length === 0) {
        throw new Error('未找到重构时机数据');
      }

      return documents;
    } catch (error) {
      console.error('获取重构时机数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取最新的重构时机数据
   * @returns {Promise<Object>} 最新的重构时机数据
   */
  async getLatestRefactorTimingData() {
    try {
      await this.ensureConnection();
      
      // 首先检查当前状态
      if (this.currentMomentState) {
        // 如果有状态记录，根据状态获取对应数据
        const document = await this.refactorTimingCollection.findOne({
          'metadata.systemStatus': this.currentMomentState
        });
        
        if (document) {
          return document;
        }
      }

      // 默认返回最新的数据（按时间戳排序）
      const document = await this.refactorTimingCollection.findOne(
        {},
        { sort: { timestamp: -1 } }
      );

      if (!document) {
        throw new Error('未找到重构时机数据');
      }

      return document;
    } catch (error) {
      console.error('获取最新重构时机数据失败:', error);
      throw error;
    }
  }

  /**
   * 根据系统状态获取重构时机数据
   * @param {string} status 系统状态 (needs_refactor, stable)
   * @returns {Promise<Object>} 重构时机数据
   */
  async getRefactorTimingDataByStatus(status) {
    try {
      await this.ensureConnection();
      
      const document = await this.refactorTimingCollection.findOne({
        'metadata.systemStatus': status
      });

      if (!document) {
        throw new Error(`未找到状态为 ${status} 的重构时机数据`);
      }

      return document;
    } catch (error) {
      console.error(`获取状态为 ${status} 的重构时机数据失败:`, error);
      throw error;
    }
  }

  /**
   * 切换到下一个时机状态
   * @returns {Promise<Object>} 切换后的数据
   */
  async switchToNextMoment() {
    try {
      await this.ensureConnection();
      
      // 获取当前状态
      const currentStatus = this.currentMomentState || 'needs_refactor';
      
      // 切换逻辑：needs_refactor -> stable -> needs_refactor
      const nextStatus = currentStatus === 'needs_refactor' ? 'stable' : 'needs_refactor';
      
      // 获取目标状态的数据
      const document = await this.refactorTimingCollection.findOne({
        'metadata.systemStatus': nextStatus
      });

      if (!document) {
        throw new Error(`未找到状态为 ${nextStatus} 的重构时机数据`);
      }

      // 更新当前状态
      this.currentMomentState = nextStatus;

      return {
        ...document,
        switchedFrom: currentStatus,
        switchedTo: nextStatus
      };
    } catch (error) {
      console.error('切换重构时机状态失败:', error);
      throw error;
    }
  }

  /**
   * 重置到初始状态
   * @returns {Promise<Object>} 重置后的数据
   */
  async resetToInitialMoment() {
    try {
      await this.ensureConnection();
      
      // 重置到初始状态（needs_refactor）
      this.currentMomentState = 'needs_refactor';
      
      const document = await this.refactorTimingCollection.findOne({
        'metadata.systemStatus': 'needs_refactor'
      });

      if (!document) {
        throw new Error('未找到初始状态的重构时机数据');
      }

      return {
        ...document,
        resetToInitial: true
      };
    } catch (error) {
      console.error('重置重构时机状态失败:', error);
      throw error;
    }
  }

  /**
   * 获取当前状态信息
   * @returns {Object} 当前状态信息
   */
  getCurrentMomentState() {
    return {
      currentState: this.currentMomentState || 'needs_refactor',
      isInitialState: !this.currentMomentState || this.currentMomentState === 'needs_refactor'
    };
  }

  /**
   * 设置当前状态
   * @param {string} state 状态 (needs_refactor, stable)
   */
  setCurrentMomentState(state) {
    this.currentMomentState = state;
  }

  // ==================== 大模型分析数据相关方法 ====================

  /**
   * 获取大模型分析数据
   * @returns {Promise<Object>} 大模型分析数据
   */
  async getLLMAnalysisData() {
    try {
      await this.ensureConnection();
      
      const document = await this.llmAnalysisCollection.findOne(
        { documentType: 'llm_analysis_output' },
        { sort: { timestamp: -1 } }
      );

      if (!document) {
        throw new Error('未找到大模型分析数据');
      }

      return document;
    } catch (error) {
      console.error('获取大模型分析数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取最新的大模型分析报告
   * @returns {Promise<Object>} 最新的大模型分析报告
   */
  async getLatestLLMAnalysisReport() {
    try {
      await this.ensureConnection();
      
      const document = await this.llmAnalysisCollection.findOne(
        { 
          documentType: 'llm_analysis_output',
          analysisStatus: 'completed'
        },
        { sort: { timestamp: -1 } }
      );

      if (!document) {
        throw new Error('未找到已完成的大模型分析报告');
      }

      return document;
    } catch (error) {
      console.error('获取最新大模型分析报告失败:', error);
      throw error;
    }
  }

  /**
   * 获取环境分析数据
   * @returns {Promise<Object>} 环境分析数据
   */
  async getEnvironmentAnalysis() {
    try {
      await this.ensureConnection();
      
      const document = await this.llmAnalysisCollection.findOne(
        { documentType: 'llm_analysis_output' },
        { 
          projection: { environmentAnalysis: 1 },
          sort: { timestamp: -1 }
        }
      );

      if (!document || !document.environmentAnalysis) {
        throw new Error('未找到环境分析数据');
      }

      return document.environmentAnalysis;
    } catch (error) {
      console.error('获取环境分析数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取相似流程检索结果
   * @returns {Promise<Object>} 相似流程检索结果
   */
  async getSimilarProcesses() {
    try {
      await this.ensureConnection();
      
      const document = await this.llmAnalysisCollection.findOne(
        { documentType: 'llm_analysis_output' },
        { 
          projection: { similarProcesses: 1 },
          sort: { timestamp: -1 }
        }
      );

      if (!document || !document.similarProcesses) {
        throw new Error('未找到相似流程检索数据');
      }

      return document.similarProcesses;
    } catch (error) {
      console.error('获取相似流程检索结果失败:', error);
      throw error;
    }
  }

  /**
   * 获取节点分析数据
   * @returns {Promise<Object>} 节点分析数据
   */
  async getNodeAnalysis() {
    try {
      await this.ensureConnection();
      
      const document = await this.llmAnalysisCollection.findOne(
        { documentType: 'llm_analysis_output' },
        { 
          projection: { nodeAnalysis: 1 },
          sort: { timestamp: -1 }
        }
      );

      if (!document || !document.nodeAnalysis) {
        throw new Error('未找到节点分析数据');
      }

      return document.nodeAnalysis;
    } catch (error) {
      console.error('获取节点分析数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取时间预测数据
   * @returns {Promise<Object>} 时间预测数据
   */
  async getTimePrediction() {
    try {
      await this.ensureConnection();
      
      const document = await this.llmAnalysisCollection.findOne(
        { documentType: 'llm_analysis_output' },
        { 
          projection: { timePrediction: 1 },
          sort: { timestamp: -1 }
        }
      );

      if (!document || !document.timePrediction) {
        throw new Error('未找到时间预测数据');
      }

      return document.timePrediction;
    } catch (error) {
      console.error('获取时间预测数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取智能建议
   * @returns {Promise<Object>} 智能建议
   */
  async getRecommendations() {
    try {
      await this.ensureConnection();
      
      const document = await this.llmAnalysisCollection.findOne(
        { documentType: 'llm_analysis_output' },
        { 
          projection: { recommendations: 1 },
          sort: { timestamp: -1 }
        }
      );

      if (!document || !document.recommendations) {
        throw new Error('未找到智能建议数据');
      }

      return document.recommendations;
    } catch (error) {
      console.error('获取智能建议失败:', error);
      throw error;
    }
  }

  /**
   * 获取完整模型输出内容
   * @returns {Promise<Object>} 模型输出内容
   */
  async getModelOutputContent() {
    try {
      await this.ensureConnection();
      
      const document = await this.llmAnalysisCollection.findOne(
        { documentType: 'llm_analysis_output' },
        { 
          projection: { modelOutputContent: 1 },
          sort: { timestamp: -1 }
        }
      );

      if (!document || !document.modelOutputContent) {
        throw new Error('未找到模型输出内容');
      }

      return document.modelOutputContent;
    } catch (error) {
      console.error('获取模型输出内容失败:', error);
      throw error;
    }
  }

  /**
   * 检查是否有大模型分析数据
   * @returns {Promise<boolean>} 是否存在数据
   */
  async hasLLMAnalysisData() {
    try {
      await this.ensureConnection();
      
      const count = await this.llmAnalysisCollection.countDocuments({
        documentType: 'llm_analysis_output',
        analysisStatus: 'completed'
      });

      return count > 0;
    } catch (error) {
      console.error('检查大模型分析数据失败:', error);
      return false;
    }
  }
}

module.exports = PlanningTimeService; 