import axios from 'axios';

// 获取API基础URL
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001';

class LLMApi {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 30000; // 30秒超时，因为大模型响应可能较慢
  }

  /**
   * 发送HTTP请求的基础方法
   * @param {string} method - HTTP方法
   * @param {string} endpoint - API端点
   * @param {Object} data - 请求数据
   * @returns {Promise<Object>} 响应结果
   */
  async request(method, endpoint, data = null) {
    try {
      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error(`LLM API请求失败 [${method} ${endpoint}]:`, error);
      
      // 处理网络错误
      if (error.code === 'ECONNABORTED') {
        throw new Error('请求超时，请稍后重试');
      }
      
      // 处理HTTP错误
      if (error.response) {
        const { status, data } = error.response;
        throw new Error((data && data.error) || `HTTP ${status} 错误`);
      }
      
      // 处理其他错误
      throw new Error(error.message || '网络请求失败');
    }
  }

  /**
   * GET请求
   */
  async get(endpoint) {
    return await this.request('GET', endpoint);
  }

  /**
   * POST请求
   */
  async post(endpoint, data) {
    return await this.request('POST', endpoint, data);
  }

  /**
   * 单轮对话
   * @param {string} message - 用户消息
   * @param {string} systemMessage - 系统提示词 (可选)
   * @returns {Promise<Object>} 大模型响应
   */
  async chat(message, systemMessage = null) {
    return await this.post('/api/llm/chat', {
      message,
      systemMessage
    });
  }

  /**
   * 多轮对话
   * @param {Array} messages - 对话历史数组
   * @returns {Promise<Object>} 大模型响应
   */
  async chatWithHistory(messages) {
    return await this.post('/api/llm/chat-history', {
      messages
    });
  }

  /**
   * 流程分析
   * @param {Object} processData - 流程数据
   * @returns {Promise<Object>} 分析结果
   */
  async analyzeProcess(processData) {
    return await this.post('/api/llm/analyze-process', {
      processData
    });
  }

  /**
   * 风险评估
   * @param {Object} riskData - 风险数据
   * @returns {Promise<Object>} 风险评估结果
   */
  async assessRisks(riskData) {
    return await this.post('/api/llm/assess-risks', {
      riskData
    });
  }

  /**
   * 获取智能推荐
   * @param {Object} contextData - 上下文数据
   * @returns {Promise<Object>} 推荐结果
   */
  async getRecommendations(contextData) {
    return await this.post('/api/llm/recommendations', {
      contextData
    });
  }

  /**
   * 检查大模型API连接状态
   * @returns {Promise<Object>} 连接状态
   */
  async checkConnection() {
    return await this.get('/api/llm/connection');
  }

  /**
   * 风险数据结构化分析
   * @returns {Promise<Object>} 结构化分析结果
   */
  async analyzeRiskStructure() {
    return await this.post('/api/llm/analyze-risk-structure', {});
  }

  /**
   * 获取大模型使用统计
   * @returns {Promise<Object>} 使用统计数据
   */
  async getUsageStats() {
    return await this.get('/api/llm/usage-stats');
  }
}

// 创建实例并导出
const llmApi = new LLMApi();

export { llmApi };

// 也可以直接导出类，供其他地方创建新实例
export default LLMApi; 