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
    console.log('🚀 Process Data API Request:', (config.method && config.method.toUpperCase()) || 'UNKNOWN', config.url);
    return config;
  },
  (error) => {
    console.error('❌ Process Data API Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Process Data API Response:', response.status, response.config.url);
    return response.data;
  },
  (error) => {
    console.error('❌ Process Data API Response Error:', 
      (error.response && error.response.status) || 'UNKNOWN', 
      (error.config && error.config.url) || 'UNKNOWN', 
      error.message);
    return Promise.reject(error);
  }
);

/**
 * 流程数据管理 API 客户端
 */
export const processDataApi = {

  /**
   * 获取流程管理页面总览数据
   * @returns {Promise} 总览数据，包含生产数据、进度百分比、效率数据、风险项目
   */
  async getTotalData() {
    try {
      const response = await apiClient.get('/total-data');
      return {
        success: true,
        data: response.data || response,
        message: '获取总览数据成功'
      };
    } catch (error) {
      console.error('获取总览数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取总览数据失败'
      };
    }
  },

  /**
   * 获取所有流程数据
   * @returns {Promise} 所有流程数据
   */
  async getAllFlowData() {
    try {
      const response = await apiClient.get('/flow-data');
      return {
        success: true,
        data: response.data || response,
        message: '获取流程数据成功'
      };
    } catch (error) {
      console.error('获取流程数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取流程数据失败'
      };
    }
  },

  /**
   * 根据流程类型获取数据
   * @param {string} flowType - 流程类型 (purchase, production, marketing, maintenance)
   * @returns {Promise} 指定类型的流程数据
   */
  async getFlowDataByType(flowType) {
    try {
      const response = await apiClient.get(`/flow-data/${flowType}`);
      return {
        success: true,
        data: response.data || response,
        message: `获取${flowType}流程数据成功`
      };
    } catch (error) {
      console.error(`获取${flowType}流程数据失败:`, error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || `获取${flowType}流程数据失败`
      };
    }
  },

  /**
   * 获取流程摘要
   * @returns {Promise} 流程摘要数据
   */
  async getFlowSummary() {
    try {
      const response = await apiClient.get('/flow-summary');
      return {
        success: true,
        data: response.data || response,
        message: '获取流程摘要成功'
      };
    } catch (error) {
      console.error('获取流程摘要失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取流程摘要失败'
      };
    }
  },

  /**
   * 获取趋势分析
   * @returns {Promise} 趋势分析数据
   */
  async getFlowTrends() {
    try {
      const response = await apiClient.get('/flow-trends');
      return {
        success: true,
        data: response.data || response,
        message: '获取趋势分析成功'
      };
    } catch (error) {
      console.error('获取趋势分析失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取趋势分析失败'
      };
    }
  },

  /**
   * 获取指定流程的月度数据
   * @param {string} flowType - 流程类型
   * @returns {Promise} 月度数据
   */
  async getMonthlyDataByType(flowType) {
    try {
      const response = await apiClient.get(`/monthly-data/${flowType}`);
      return {
        success: true,
        data: response.data || response,
        message: `获取${flowType}月度数据成功`
      };
    } catch (error) {
      console.error(`获取${flowType}月度数据失败:`, error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || `获取${flowType}月度数据失败`
      };
    }
  },

  /**
   * 获取指定流程的关键指标
   * @param {string} flowType - 流程类型
   * @returns {Promise} 关键指标数据
   */
  async getPanelDataByType(flowType) {
    try {
      const response = await apiClient.get(`/panel-data/${flowType}`);
      return {
        success: true,
        data: response.data || response,
        message: `获取${flowType}关键指标成功`
      };
    } catch (error) {
      console.error(`获取${flowType}关键指标失败:`, error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || `获取${flowType}关键指标失败`
      };
    }
  },

  /**
   * 获取数据库统计信息
   * @returns {Promise} 数据库统计信息
   */
  async getDatabaseStats() {
    try {
      const response = await apiClient.get('/database-stats');
      return {
        success: true,
        data: response.data || response,
        message: '获取数据库统计信息成功'
      };
    } catch (error) {
      console.error('获取数据库统计信息失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取数据库统计信息失败'
      };
    }
  },

  /**
   * 批量获取多个流程类型的数据
   * @param {string[]} flowTypes - 流程类型数组
   * @returns {Promise} 批量流程数据
   */
  async getMultipleFlowData(flowTypes) {
    try {
      const promises = flowTypes.map(type => this.getFlowDataByType(type));
      const results = await Promise.all(promises);
      
      // 检查是否所有请求都成功
      const allSuccess = results.every(result => result.success);
      
      return {
        success: allSuccess,
        data: results.map(result => result.data),
        message: allSuccess ? '批量获取流程数据成功' : '部分流程数据获取失败'
      };
    } catch (error) {
      console.error('批量获取流程数据失败:', error);
      return {
        success: false,
        data: null,
        message: '批量获取流程数据失败'
      };
    }
  },

  /**
   * 批量获取多个流程类型的数据（优化版本）
   * @param {string[]} flowTypes - 流程类型数组
   * @returns {Promise} 批量流程数据
   */
  async getMultipleFlowDataByTypes(flowTypes) {
    try {
      const types = flowTypes.join(',');
      const response = await apiClient.get(`/multiple-flow-data?types=${encodeURIComponent(types)}`);
      return {
        success: true,
        data: response.data || response,
        message: '批量获取流程数据成功'
      };
    } catch (error) {
      console.error('批量获取流程数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '批量获取流程数据失败'
      };
    }
  },

  /**
   * 刷新数据
   * @returns {Promise} 刷新结果
   */
  async refreshData() {
    try {
      const response = await apiClient.post('/refresh-data');
      return {
        success: true,
        data: response.data || response,
        message: '刷新数据成功'
      };
    } catch (error) {
      console.error('刷新数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '刷新数据失败'
      };
    }
  },

  /**
   * 检查API服务器连接状态
   * @returns {Promise} 连接状态
   */
  async checkConnection() {
    try {
      await apiClient.get('/flow-summary');
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
   * 搜索流程数据
   * @param {string} keyword - 搜索关键词
   * @returns {Promise} 搜索结果
   */
  async searchFlowData(keyword) {
    try {
      const response = await apiClient.get(`/search-flow?keyword=${encodeURIComponent(keyword)}`);
      return {
        success: true,
        data: response.data || response,
        message: '搜索流程数据成功'
      };
    } catch (error) {
      console.error('搜索流程数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '搜索流程数据失败'
      };
    }
  },

  /**
   * 按最新数值排序获取流程数据
   * @param {number} limit - 限制返回数量
   * @returns {Promise} 排序后的流程数据
   */
  async getFlowDataByLatestValue(limit = 10) {
    try {
      const response = await apiClient.get(`/flow-data-by-latest?limit=${limit}`);
      return {
        success: true,
        data: response.data || response,
        message: '按最新数值获取流程数据成功'
      };
    } catch (error) {
      console.error('按最新数值获取流程数据失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '按最新数值获取流程数据失败'
      };
    }
  },

  /**
   * 获取包含特定面板指标的流程
   * @param {string} label - 面板指标标签
   * @returns {Promise} 面板指标流程数据
   */
  async getFlowsByPanelLabel(label) {
    try {
      const response = await apiClient.get(`/flows-by-panel?label=${encodeURIComponent(label)}`);
      return {
        success: true,
        data: response.data || response,
        message: '获取面板指标流程成功'
      };
    } catch (error) {
      console.error('获取面板指标流程失败:', error);
      return {
        success: false,
        data: null,
        message: (error.response && error.response.data && error.response.data.message) || '获取面板指标流程失败'
      };
    }
  }
};

export default processDataApi; 