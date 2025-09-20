import axios from 'axios';

// 获取API基础URL
const API_BASE_URL = process.env.VUE_APP_API_URL || '';

class Topic02Api {
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
        if (method === 'GET') {
          config.params = data;
        } else {
          config.data = data;
        }
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error(`Topic02 API请求失败 [${method} ${endpoint}]:`, error);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('请求超时，请稍后重试');
      }
      
      if (error.response) {
        const { status, data } = error.response;
        throw new Error((data && data.error) || `HTTP ${status} 错误`);
      }
      
      throw new Error(error.message || 'Topic02 请求失败');
    }
  }

  /**
   * GET请求
   */
  async get(endpoint, params = null) {
    return await this.request('GET', endpoint, params);
  }

  /**
   * POST请求
   */
  async post(endpoint, data) {
    return await this.request('POST', endpoint, data);
  }

  /**
   * PUT请求
   */
  async put(endpoint, data) {
    return await this.request('PUT', endpoint, data);
  }

  /**
   * DELETE请求
   */
  async delete(endpoint, data = null) {
    return await this.request('DELETE', endpoint, data);
  }

  /**
   * 获取数据
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 数据结果
   */
  async getData(params = {}) {
    return await this.get('/api/topic02/data', params);
  }

  /**
   * 保存数据
   * @param {Object} data - 要保存的数据
   * @returns {Promise<Object>} 保存结果
   */
  async saveData(data) {
    return await this.post('/api/topic02/data', data);
  }

  /**
   * 更新数据
   * @param {string} id - 数据ID
   * @param {Object} data - 要更新的数据
   * @returns {Promise<Object>} 更新结果
   */
  async updateData(id, data) {
    return await this.put(`/api/topic02/data/${id}`, data);
  }

  /**
   * 删除数据
   * @param {string} id - 数据ID
   * @returns {Promise<Object>} 删除结果
   */
  async deleteData(id) {
    return await this.delete(`/api/topic02/data/${id}`);
  }

  /**
   * 处理业务逻辑
   * @param {Object} input - 输入数据
   * @returns {Promise<Object>} 处理结果
   */
  async processData(input) {
    return await this.post('/api/topic02/process', input);
  }

  /**
   * 获取状态信息
   * @returns {Promise<Object>} 状态信息
   */
  async getStatus() {
    return await this.get('/api/topic02/status');
  }
}

// 创建并导出API实例
const topic02Api = new Topic02Api();

export { Topic02Api, topic02Api };
export default topic02Api;
