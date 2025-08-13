import axios from 'axios';

// 获取API基础URL（生产默认走前端Nginx反代）
const API_BASE_URL = process.env.VUE_APP_API_URL || '';

class RiskDataApi {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 10000; // 10秒超时
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
      console.error(`风险数据API请求失败 [${method} ${endpoint}]:`, error);
      
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
   * 获取所有风险数据
   * @returns {Promise<Object>} 风险数据列表
   */
  async getAllRiskData() {
    return await this.get('/api/risk-data');
  }

  /**
   * 检查风险数据库连接状态
   * @returns {Promise<Object>} 连接状态信息
   */
  async checkConnection() {
    return await this.get('/api/risk-data/connection');
  }


}

// 创建并导出API实例
const riskDataApi = new RiskDataApi();

export { riskDataApi };
export default riskDataApi; 