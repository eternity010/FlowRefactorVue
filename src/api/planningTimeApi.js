import axios from 'axios';

// API 基础URL
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001/api';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    console.log('🚀 Planning Time API Request:', (config.method && config.method.toUpperCase()) || 'UNKNOWN', config.url);
    return config;
  },
  (error) => {
    console.error('❌ Planning Time API Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Planning Time API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Planning Time API Response Error:', 
      (error.response && error.response.status) || 'UNKNOWN', 
      (error.config && error.config.url) || 'UNKNOWN', 
      error.message);
    return Promise.reject(error);
  }
);

/**
 * 规划时间数据 API 客户端
 */
export const planningTimeApi = {
  
  /**
   * 获取规划时间分析数据
   * @returns {Promise} 规划时间分析数据
   */
  async getPlanningTimeData() {
    try {
      const response = await apiClient.get('/planning-time');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('获取规划时间数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取规划时间数据失败'
      };
    }
  },

  /**
   * 获取统计数据
   * @returns {Promise} 统计数据
   */
  async getStatistics() {
    try {
      const response = await apiClient.get('/planning-time/statistics');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('获取统计数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取统计数据失败'
      };
    }
  },

  /**
   * 获取样本数据
   * @returns {Promise} 样本数据
   */
  async getSampleData() {
    try {
      const response = await apiClient.get('/planning-time/sample-data');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('获取样本数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取样本数据失败'
      };
    }
  },

  /**
   * 获取预测方案数据
   * @returns {Promise} 预测方案数据
   */
  async getPredictionSchemes() {
    try {
      const response = await apiClient.get('/planning-time/prediction-schemes');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('获取预测方案数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取预测方案数据失败'
      };
    }
  },

  /**
   * 获取控制台模板数据
   * @returns {Promise} 控制台模板数据
   */
  async getConsoleTemplate() {
    try {
      const response = await apiClient.get('/planning-time/console-template');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('获取控制台模板数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取控制台模板数据失败'
      };
    }
  },

  /**
   * 获取流程配置数据
   * @returns {Promise} 流程配置数据
   */
  async getFlowConfiguration() {
    try {
      const response = await apiClient.get('/planning-time/flow-configuration');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('获取流程配置数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取流程配置数据失败'
      };
    }
  },

  /**
   * 获取指定预测方案的详细信息
   * @param {string} schemeId 方案ID
   * @returns {Promise} 预测方案详细信息
   */
  async getPredictionSchemeById(schemeId) {
    try {
      const response = await apiClient.get(`/planning-time/prediction-schemes/${schemeId}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error(`获取预测方案 ${schemeId} 失败:`, error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || `获取预测方案 ${schemeId} 失败`
      };
    }
  },

  /**
   * 获取边数据
   * @returns {Promise} 边数据
   */
  async getEdgeData() {
    try {
      const response = await apiClient.get('/planning-time/edges');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('获取边数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取边数据失败'
      };
    }
  },

  /**
   * 更新预测方案准确度
   * @param {string} schemeId 方案ID
   * @param {number} accuracy 新的准确度
   * @returns {Promise} 更新结果
   */
  async updatePredictionAccuracy(schemeId, accuracy) {
    try {
      const response = await apiClient.put(`/planning-time/prediction-schemes/${schemeId}/accuracy`, {
        accuracy: accuracy
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error(`更新预测方案 ${schemeId} 准确度失败:`, error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || `更新预测方案 ${schemeId} 准确度失败`
      };
    }
  },

  /**
   * 获取历史准确度数据
   * @param {string} schemeId 方案ID（可选，不传则获取所有方案）
   * @returns {Promise} 历史准确度数据
   */
  async getAccuracyHistory(schemeId) {
    try {
      const url = schemeId ? 
        `/planning-time/accuracy-history/${schemeId}` : 
        '/planning-time/accuracy-history';
      const response = await apiClient.get(url);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('获取历史准确度数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取历史准确度数据失败'
      };
    }
  },

  /**
   * 获取重构时机数据
   * @returns {Promise} 重构时机数据
   */
  async getRefactorTimingData() {
    try {
      const response = await apiClient.get('/refactor-timing');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('获取重构时机数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取重构时机数据失败'
      };
    }
  },

  /**
   * 获取最新的重构时机数据
   * @returns {Promise} 最新重构时机数据
   */
  async getLatestRefactorTimingData() {
    try {
      const response = await apiClient.get('/refactor-timing/latest');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('获取最新重构时机数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取最新重构时机数据失败'
      };
    }
  },

  /**
   * 根据系统状态获取重构时机数据
   * @param {string} status 系统状态 (needs_refactor, stable)
   * @returns {Promise} 重构时机数据
   */
  async getRefactorTimingDataByStatus(status) {
    try {
      const response = await apiClient.get(`/refactor-timing/status/${status}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error(`获取状态为 ${status} 的重构时机数据失败:`, error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || `获取状态为 ${status} 的重构时机数据失败`
      };
    }
  },

  /**
   * 切换到下一个时机状态的数据
   * @returns {Promise} 切换后的数据
   */
  async switchToNextMoment() {
    try {
      const response = await apiClient.post('/refactor-timing/switch-moment');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('切换重构时机状态失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '切换重构时机状态失败'
      };
    }
  },

  /**
   * 重置到初始状态
   * @returns {Promise} 重置后的数据
   */
  async resetToInitialMoment() {
    try {
      const response = await apiClient.post('/refactor-timing/reset-moment');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('重置重构时机状态失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '重置重构时机状态失败'
      };
    }
  },

  // ==================== 大模型分析数据相关方法 ====================

  /**
   * 获取完整的大模型分析数据
   * @returns {Promise} 大模型分析数据
   */
  async getLLMAnalysisData() {
    try {
      const response = await apiClient.get('/llm-analysis');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('获取大模型分析数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取大模型分析数据失败'
      };
    }
  },

  /**
   * 获取最新的大模型分析报告
   * @returns {Promise} 最新的大模型分析报告
   */
  async getLatestLLMAnalysisReport() {
    try {
      const response = await apiClient.get('/llm-analysis/latest');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('获取最新大模型分析报告失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取最新大模型分析报告失败'
      };
    }
  },

  /**
   * 获取环境分析数据
   * @returns {Promise} 环境分析数据
   */
  async getEnvironmentAnalysis() {
    try {
      const response = await apiClient.get('/llm-analysis/environment');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('获取环境分析数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取环境分析数据失败'
      };
    }
  },

  /**
   * 获取相似流程检索结果
   * @returns {Promise} 相似流程检索结果
   */
  async getSimilarProcesses() {
    try {
      const response = await apiClient.get('/llm-analysis/similar-processes');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('获取相似流程检索结果失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取相似流程检索结果失败'
      };
    }
  },

  /**
   * 获取节点分析数据
   * @returns {Promise} 节点分析数据
   */
  async getNodeAnalysis() {
    try {
      const response = await apiClient.get('/llm-analysis/node-analysis');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('获取节点分析数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取节点分析数据失败'
      };
    }
  },

  /**
   * 获取时间预测数据
   * @returns {Promise} 时间预测数据
   */
  async getTimePrediction() {
    try {
      const response = await apiClient.get('/llm-analysis/time-prediction');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('获取时间预测数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取时间预测数据失败'
      };
    }
  },

  /**
   * 获取智能建议
   * @returns {Promise} 智能建议
   */
  async getLLMRecommendations() {
    try {
      const response = await apiClient.get('/llm-analysis/recommendations');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('获取智能建议失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取智能建议失败'
      };
    }
  },

  /**
   * 获取完整模型输出内容
   * @returns {Promise} 模型输出内容
   */
  async getModelOutputContent() {
    try {
      const response = await apiClient.get('/llm-analysis/model-output');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('获取模型输出内容失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取模型输出内容失败'
      };
    }
  },

  /**
   * 检查是否有大模型分析数据
   * @returns {Promise} 是否存在数据
   */
  async hasLLMAnalysisData() {
    try {
      const response = await apiClient.get('/llm-analysis/has-data');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('检查大模型分析数据失败:', error);
      return {
        success: false,
        data: { hasData: false },
        message: (error.response && error.response.data && error.response.data.message) || '检查大模型分析数据失败'
      };
    }
  }
};

export default planningTimeApi; 