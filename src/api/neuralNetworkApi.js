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
    console.log('🚀 Neural Network API Request:', (config.method && config.method.toUpperCase()) || 'UNKNOWN', config.url);
    return config;
  },
  (error) => {
    console.error('❌ Neural Network API Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Neural Network API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Neural Network API Response Error:', 
      (error.response && error.response.status) || 'UNKNOWN', 
      (error.config && error.config.url) || 'UNKNOWN', 
      error.message);
    return Promise.reject(error);
  }
);



/**
 * 神经网络参数 API 客户端
 */
export const neuralNetworkApi = {
  
  /**
   * 获取所有参数配置
   * @returns {Promise} 完整的参数配置数据
   */
  async getAllParameters() {
    try {
      const response = await apiClient.get('/neural-network/parameters');
      return response;
    } catch (error) {
      console.error('❌ 神经网络参数服务不可用:', error.message);
      throw new Error('无法连接到参数服务器，请检查网络连接或联系系统管理员');
    }
  },

  /**
   * 获取当前参数值
   * @returns {Promise} 当前参数值
   */
  async getCurrentParameters() {
    try {
      const response = await apiClient.get('/neural-network/parameters/current');
      return response;
    } catch (error) {
      console.error('❌ 当前参数获取失败:', error.message);
      throw new Error('无法获取当前参数设置，请检查服务器连接');
    }
  },

  /**
   * 获取参数定义信息
   * @returns {Promise} 参数定义和元数据
   */
  async getParameterDefinitions() {
    try {
      const response = await apiClient.get('/neural-network/parameters/definitions');
      return response;
    } catch (error) {
      console.error('❌ 参数定义服务不可用:', error.message);
      throw new Error('无法获取参数定义，请检查服务器连接');
    }
  },

  /**
   * 获取默认参数配置
   * @returns {Promise} 默认参数配置
   */
  async getDefaultParameters() {
    try {
      const response = await apiClient.get('/neural-network/parameters/default');
      return response;
    } catch (error) {
      console.error('❌ 默认参数获取失败:', error.message);
      throw new Error('无法获取默认参数设置，请检查服务器连接');
    }
  },

  /**
   * 获取特定类别的参数
   * @param {string} category - 参数类别 (risk_assessment, supply_chain_management, operation_optimization)
   * @returns {Promise} 指定类别的参数配置
   */
  async getParametersByCategory(category) {
    try {
      const response = await apiClient.get(`/neural-network/parameters/category/${category}`);
      return response;
    } catch (error) {
      console.error('❌ 分类参数服务不可用:', error.message);
      throw new Error('无法获取分类参数，请检查服务器连接');
    }
  },

  /**
   * 更新参数配置
   * @param {Object} parameters - 要更新的参数对象
   * @returns {Promise} 更新结果
   */
  async updateParameters(parameters) {
    try {
      const response = await apiClient.put('/neural-network/parameters', { parameters });
      return response;
    } catch (error) {
      console.error('❌ 参数更新失败:', error.message);
      throw new Error('无法更新参数设置，请检查服务器连接');
    }
  },

  /**
   * 重置参数为默认值
   * @param {Array} parameterKeys - 要重置的参数键数组，如果为空则重置所有参数
   * @returns {Promise} 重置结果
   */
  async resetParameters(parameterKeys = null) {
    try {
      const payload = parameterKeys ? { parameter_keys: parameterKeys } : {};
      const response = await apiClient.post('/neural-network/parameters/reset', payload);
      return response;
    } catch (error) {
      console.error('❌ 参数重置失败:', error.message);
      throw new Error('无法重置参数设置，请检查服务器连接');
    }
  },

  /**
   * 保存参数配置到服务器
   * @param {Object} parameters - 完整的参数配置
   * @param {string} configName - 配置名称
   * @returns {Promise} 保存结果
   */
  async saveParameterConfig(parameters, configName = 'default') {
    return await apiClient.post('/neural-network/parameters/save', {
      parameters,
      config_name: configName,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * 获取保存的参数配置列表
   * @returns {Promise} 配置列表
   */
  async getSavedConfigs() {
    return await apiClient.get('/neural-network/parameters/configs');
  },

  /**
   * 加载保存的参数配置
   * @param {string} configName - 配置名称
   * @returns {Promise} 配置数据
   */
  async loadParameterConfig(configName) {
    return await apiClient.get(`/neural-network/parameters/configs/${configName}`);
  },

  /**
   * 验证参数值
   * @param {Object} parameters - 要验证的参数
   * @returns {Promise} 验证结果
   */
  async validateParameters(parameters) {
    return await apiClient.post('/neural-network/parameters/validate', { parameters });
  },

  /**
   * 获取参数使用统计
   * @returns {Promise} 使用统计数据
   */
  async getParameterStats() {
    return await apiClient.get('/neural-network/parameters/stats');
  },



  /**
   * 导出参数配置
   * @param {string} format - 导出格式
   * @returns {Promise} 导出数据
   */
  async exportParameters(format = 'json') {
    return await apiClient.get(`/neural-network/parameters/export?format=${format}`);
  },

  /**
   * 导入参数配置
   * @param {Object} configData - 配置数据
   * @param {boolean} overwrite - 是否覆盖
   * @returns {Promise} 导入结果
   */
  async importParameters(configData, overwrite = false) {
    return await apiClient.post('/neural-network/parameters/import', {
      config_data: configData,
      overwrite: overwrite
    });
  },

  // ==================== RAG配置相关API ====================

  /**
   * 获取RAG配置数据
   * @returns {Promise} RAG配置数据
   */
  async getRAGConfig() {
    try {
      const response = await apiClient.get('/rag-config');
      return response;
    } catch (error) {
      console.error('❌ RAG配置获取失败:', error.message);
      throw new Error('无法获取RAG配置，请检查服务器连接');
    }
  },

  /**
   * 获取RAG启用状态
   * @returns {Promise} RAG启用状态
   */
  async getRAGEnabledStatus() {
    try {
      const response = await apiClient.get('/rag-config/status');
      return response;
    } catch (error) {
      console.error('❌ RAG启用状态获取失败:', error.message);
      throw new Error('无法获取RAG启用状态，请检查服务器连接');
    }
  },

  /**
   * 更新RAG启用状态
   * @param {Object} enabledStatus - RAG启用状态对象
   * @returns {Promise} 更新结果
   */
  async updateRAGEnabledStatus(enabledStatus) {
    try {
      const response = await apiClient.put('/rag-config/status', { enabled_status: enabledStatus });
      return response;
    } catch (error) {
      console.error('❌ RAG启用状态更新失败:', error.message);
      throw new Error('无法更新RAG启用状态，请检查服务器连接');
    }
  },

  /**
   * 获取RAG数据源配置
   * @param {string} ragType - RAG类型 (process_optimization)
   * @returns {Promise} 数据源配置
   */
  async getRAGDataSources(ragType) {
    try {
      const response = await apiClient.get(`/rag-config/data-sources/${ragType}`);
      return response;
    } catch (error) {
      console.error('❌ RAG数据源获取失败:', error.message);
      throw new Error('无法获取RAG数据源配置，请检查服务器连接');
    }
  },

  /**
   * 更新RAG配置
   * @param {Object} ragConfig - RAG配置数据
   * @returns {Promise} 更新结果
   */
  async updateRAGConfig(ragConfig) {
    try {
      const response = await apiClient.put('/rag-config', ragConfig);
      return response;
    } catch (error) {
      console.error('❌ RAG配置更新失败:', error.message);
      throw new Error('无法更新RAG配置，请检查服务器连接');
    }
  },

  /**
   * 重置RAG配置为默认值
   * @returns {Promise} 重置结果
   */
  async resetRAGConfig() {
    try {
      const response = await apiClient.post('/rag-config/reset');
      return response;
    } catch (error) {
      console.error('❌ RAG配置重置失败:', error.message);
      throw new Error('无法重置RAG配置，请检查服务器连接');
    }
  }
}; 