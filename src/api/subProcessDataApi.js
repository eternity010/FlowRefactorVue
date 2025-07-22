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
    console.log('🚀 Sub Process Data API Request:', (config.method && config.method.toUpperCase()) || 'UNKNOWN', config.url);
    return config;
  },
  (error) => {
    console.error('❌ Sub Process Data API Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Sub Process Data API Response:', response.status, response.config.url);
    return response.data;
  },
  (error) => {
    console.error('❌ Sub Process Data API Response Error:', 
      (error.response && error.response.status) || 'UNKNOWN', 
      (error.config && error.config.url) || 'UNKNOWN', 
      error.message);
    return Promise.reject(error);
  }
);

/**
 * 子流程数据管理 API 客户端
 */
export const subProcessDataApi = {

  /**
   * 获取所有子流程数据
   * @returns {Promise} 所有子流程数据
   */
  async getSubProcessData() {
    try {
      const response = await apiClient.get('/sub-process-data');
      return {
        success: true,
        data: response.data || response,
        message: '获取子流程数据成功'
      };
    } catch (error) {
      console.error('获取子流程数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取子流程数据失败'
      };
    }
  },

  /**
   * 根据类型获取指定的子流程数据
   * @param {string} type - 子流程类型 (purchase, production, marketing, operation)
   * @returns {Promise} 指定类型的子流程数据
   */
  async getSubProcessDataByType(type) {
    try {
      const response = await apiClient.get(`/sub-process-data/${type}`);
      return {
        success: true,
        data: response.data || response,
        message: `获取${type}子流程数据成功`
      };
    } catch (error) {
      console.error(`获取${type}子流程数据失败:`, error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || `获取${type}子流程数据失败`
      };
    }
  },

  /**
   * 获取Mermaid流程图数据
   * @param {string} type - 流程类型 (purchase, production, marketing, operation)
   * @returns {Promise} Mermaid流程图数据
   */
  async getMermaidFlowData(type) {
    try {
      const response = await apiClient.get(`/mermaid-flow/${type}`);
      return {
        success: true,
        data: response.data || response,
        message: `获取${type}流程图数据成功`
      };
    } catch (error) {
      console.error(`获取${type}流程图数据失败:`, error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || `获取${type}流程图数据失败`
      };
    }
  },

  /**
   * 获取所有Mermaid流程图数据
   * @returns {Promise} 所有Mermaid流程图数据
   */
  async getAllMermaidFlowData() {
    try {
      const response = await apiClient.get('/mermaid-flows');
      return {
        success: true,
        data: response.data || response,
        message: '获取所有流程图数据成功'
      };
    } catch (error) {
      console.error('获取所有流程图数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取所有流程图数据失败'
      };
    }
  },

  /**
   * 批量获取多个子流程类型的数据
   * @param {string[]} types - 子流程类型数组
   * @returns {Promise} 批量子流程数据
   */
  async getMultipleSubProcessData(types) {
    try {
      const promises = types.map(type => this.getSubProcessDataByType(type));
      const results = await Promise.all(promises);
      
      // 检查是否所有请求都成功
      const allSuccess = results.every(result => result.success);
      
      return {
        success: allSuccess,
        data: results.reduce((acc, result, index) => {
          if (result.success) {
            acc[types[index]] = result.data;
          }
          return acc;
        }, {}),
        message: allSuccess ? '批量获取子流程数据成功' : '部分子流程数据获取失败'
      };
    } catch (error) {
      console.error('批量获取子流程数据失败:', error);
      return {
        success: false,
        data: null,
        message: '批量获取子流程数据失败'
      };
    }
  },

  /**
   * 刷新子流程数据
   * @returns {Promise} 刷新结果
   */
  async refreshSubProcessData() {
    try {
      const response = await apiClient.post('/refresh-sub-process-data');
      return {
        success: true,
        data: response.data || response,
        message: '刷新子流程数据成功'
      };
    } catch (error) {
      console.error('刷新子流程数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '刷新子流程数据失败'
      };
    }
  },

  /**
   * 检查API服务器连接状态
   * @returns {Promise} 连接状态
   */
  async checkConnection() {
    try {
      await apiClient.get('/sub-process-data');
      return {
        success: true,
        connected: true,
        message: 'API服务器连接正常'
      };
    } catch (error) {
      console.error('API服务器连接检查失败:', error);
      return {
        success: false,
        connected: false,
        message: `API服务器连接失败: ${error.message}`
      };
    }
  },

  /**
   * 搜索子流程数据
   * @param {string} keyword - 搜索关键词
   * @returns {Promise} 搜索结果
   */
  async searchSubProcessData(keyword) {
    try {
      const response = await apiClient.get(`/search-sub-process?keyword=${encodeURIComponent(keyword)}`);
      return {
        success: true,
        data: response.data || response,
        message: '搜索子流程数据成功'
      };
    } catch (error) {
      console.error('搜索子流程数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '搜索子流程数据失败'
      };
    }
  },

  /**
   * 获取子流程统计信息
   * @returns {Promise} 统计信息
   */
  async getSubProcessStats() {
    try {
      const response = await apiClient.get('/sub-process-stats');
      return {
        success: true,
        data: response.data || response,
        message: '获取子流程统计信息成功'
      };
    } catch (error) {
      console.error('获取子流程统计信息失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取子流程统计信息失败'
      };
    }
  },

  /**
   * 更新子流程数据
   * @param {string} type - 子流程类型
   * @param {Object} data - 更新数据
   * @returns {Promise} 更新结果
   */
  async updateSubProcessData(type, data) {
    try {
      const response = await apiClient.put(`/sub-process-data/${type}`, data);
      return {
        success: true,
        data: response.data || response,
        message: `更新${type}子流程数据成功`
      };
    } catch (error) {
      console.error(`更新${type}子流程数据失败:`, error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || `更新${type}子流程数据失败`
      };
    }
  },

  /**
   * 获取子流程性能指标
   * @param {string} type - 子流程类型
   * @returns {Promise} 性能指标数据
   */
  async getSubProcessMetrics(type) {
    try {
      const response = await apiClient.get(`/sub-process-metrics/${type}`);
      return {
        success: true,
        data: response.data || response,
        message: `获取${type}性能指标成功`
      };
    } catch (error) {
      console.error(`获取${type}性能指标失败:`, error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || `获取${type}性能指标失败`
      };
    }
  },

  /**
   * 获取子流程风险评估
   * @param {string} type - 子流程类型
   * @returns {Promise} 风险评估数据
   */
  async getSubProcessRiskAssessment(type) {
    try {
      const response = await apiClient.get(`/sub-process-risk/${type}`);
      return {
        success: true,
        data: response.data || response,
        message: `获取${type}风险评估成功`
      };
    } catch (error) {
      console.error(`获取${type}风险评估失败:`, error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || `获取${type}风险评估失败`
      };
    }
  }
};

export default subProcessDataApi; 