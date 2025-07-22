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

// 模拟网络延迟
const mockDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// 简化的默认参数配置（用于离线模式）
const getDefaultParameters = () => {
  return {
    geoPoliticalWeight: 1.0,
    marketVolatilityFactor: 0.8,
    backupSupplierRatio: 0.3,
    routeReevalFrequency: 7,
    minimumInventoryRatio: 0.15,
    costDelayTradeoff: 1.2,
    taktTimeVariance: 0.05,
    overtimeCostCap: 200
  };
};

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
      console.warn('🔄 神经网络参数服务不可用，使用本地存储数据');
      await mockDelay();
      
      const savedParams = JSON.parse(localStorage.getItem('neuralNetworkParams') || '{}');
      const defaultParams = getDefaultParameters();
      const currentParams = { ...defaultParams, ...savedParams };
      
      return {
        data: {
          code: 200,
          message: '获取成功（离线模式）',
          data: {
            current_values: currentParams,
            last_updated: localStorage.getItem('neuralNetworkParams_lastModified') || new Date().toISOString(),
            offline_mode: true
          }
        },
        status: 200,
        statusText: 'OK'
      };
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
      console.warn('🔄 参数服务不可用，使用本地存储数据');
      await mockDelay();
      
      const savedParams = JSON.parse(localStorage.getItem('neuralNetworkParams') || '{}');
      const defaultParams = getDefaultParameters();
      const currentParams = { ...defaultParams, ...savedParams };
      
      return {
        data: {
          code: 200,
          message: '获取成功（离线模式）',
          data: currentParams
        },
        status: 200,
        statusText: 'OK'
      };
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
      console.warn('🔄 参数定义服务不可用');
      await mockDelay();
      
      return {
        data: {
          code: 503,
          message: '参数定义服务不可用，请检查服务器连接',
          data: null
        },
        status: 503,
        statusText: 'Service Unavailable'
      };
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
      console.warn('🔄 分类参数服务不可用');
      await mockDelay();
      
      return {
        data: {
          code: 503,
          message: '分类参数服务不可用，请检查服务器连接',
          data: null
        },
        status: 503,
        statusText: 'Service Unavailable'
      };
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
      console.warn('🔄 参数更新服务不可用，使用本地存储');
      await mockDelay();
      
      // 保存到localStorage（简单验证）
      if (!parameters || typeof parameters !== 'object') {
        return {
          data: {
            code: 400,
            message: '参数格式错误',
            data: null
          },
          status: 400,
          statusText: 'Bad Request'
        };
      }
      
      const savedParams = JSON.parse(localStorage.getItem('neuralNetworkParams') || '{}');
      const updatedParams = { ...savedParams, ...parameters };
      localStorage.setItem('neuralNetworkParams', JSON.stringify(updatedParams));
      localStorage.setItem('neuralNetworkParams_lastModified', new Date().toISOString());
      
      return {
        data: {
          code: 200,
          message: '参数更新成功（离线模式）',
          data: {
            updated_parameters: parameters,
            all_parameters: updatedParams,
            updated_at: new Date().toISOString(),
            offline_mode: true
          }
        },
        status: 200,
        statusText: 'OK'
      };
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
      console.warn('🔄 参数重置服务不可用，使用本地操作');
      await mockDelay();
      
      const defaultParams = getDefaultParameters();
      let resetParams;
      
      if (parameterKeys && Array.isArray(parameterKeys)) {
        // 重置指定参数
        resetParams = {};
        parameterKeys.forEach(key => {
          if (defaultParams.hasOwnProperty(key)) {
            resetParams[key] = defaultParams[key];
          }
        });
        
        const savedParams = JSON.parse(localStorage.getItem('neuralNetworkParams') || '{}');
        const updatedParams = { ...savedParams, ...resetParams };
        localStorage.setItem('neuralNetworkParams', JSON.stringify(updatedParams));
      } else {
        // 重置所有参数
        resetParams = defaultParams;
        localStorage.setItem('neuralNetworkParams', JSON.stringify(resetParams));
      }
      
      localStorage.setItem('neuralNetworkParams_lastModified', new Date().toISOString());
      
      return {
        data: {
          code: 200,
          message: '参数重置成功（离线模式）',
          data: {
            reset_parameters: resetParams,
            reset_count: Object.keys(resetParams).length,
            reset_at: new Date().toISOString(),
            offline_mode: true
          }
        },
        status: 200,
        statusText: 'OK'
      };
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
   * 获取参数历史记录
   * @param {number} limit - 限制数量
   * @param {number} offset - 偏移量
   * @returns {Promise} 历史记录
   */
  async getParameterHistory(limit = 10, offset = 0) {
    return await apiClient.get(`/neural-network/parameters/history?limit=${limit}&offset=${offset}`);
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
  }
};

// 导出默认值，供离线模式使用
export { getDefaultParameters }; 