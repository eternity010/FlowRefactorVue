import axios from 'axios';

// 获取API基础URL
const API_BASE_URL = process.env.VUE_APP_API_URL || '';

class Topic04Api {
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
      console.error(`Topic04 API请求失败 [${method} ${endpoint}]:`, error);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('请求超时，请稍后重试');
      }
      
      if (error.response) {
        const { status, data } = error.response;
        throw new Error((data && data.error) || `HTTP ${status} 错误`);
      }
      
      throw new Error(error.message || 'Topic04 请求失败');
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
   * 获取所有状态为"进行中"的运维订单数据
   * @returns {Promise<Object>} 进行中的运维订单列表
   */
  async getOngoingMaintenanceOrders() {
    return await this.get('/api/topic04/maintenance/ongoing');
  }

  /**
   * 根据系统模块获取运维订单
   * @param {string} systemModule - 系统模块名称
   * @returns {Promise<Object>} 指定系统的运维订单
   */
  async getMaintenanceOrdersBySystem(systemModule) {
    if (!systemModule) {
      throw new Error('系统模块名称不能为空');
    }
    return await this.get(`/api/topic04/maintenance/system/${encodeURIComponent(systemModule)}`);
  }


  /**
   * 获取运维订单统计数据
   * @returns {Promise<Object>} 统计结果
   */
  async getMaintenanceStatistics() {
    return await this.get('/api/topic04/maintenance/statistics');
  }

  /**
   * 根据车站位置获取运维订单
   * @param {string} stationLocation - 车站位置
   * @returns {Promise<Object>} 指定车站的运维订单
   */
  async getMaintenanceOrdersByStation(stationLocation) {
    if (!stationLocation) {
      throw new Error('车站位置不能为空');
    }
    return await this.get('/api/topic04/maintenance/station/${encodeURIComponent(stationLocation)}');
  }

  /**
   * 根据列车编号获取运维订单
   * @param {string} trainId - 列车编号
   * @returns {Promise<Object>} 指定列车的运维订单
   */
  async getMaintenanceOrdersByTrain(trainId) {
    if (!trainId) {
      throw new Error('列车编号不能为空');
    }
    return await this.get(`/api/topic04/maintenance/train/${encodeURIComponent(trainId)}`);
  }

  /**
   * 根据维修类型获取运维订单
   * @param {string} maintenanceType - 维修类型: 定检、临修、加改修
   * @returns {Promise<Object>} 指定类型的运维订单
   */
  async getMaintenanceOrdersByType(maintenanceType) {
    if (!maintenanceType) {
      throw new Error('维修类型不能为空');
    }
    return await this.get(`/api/topic04/maintenance/type/${encodeURIComponent(maintenanceType)}`);
  }

  /**
   * 根据责任班组获取运维订单
   * @param {string} responsibleTeam - 责任班组
   * @returns {Promise<Object>} 指定班组的运维订单
   */
  async getMaintenanceOrdersByTeam(responsibleTeam) {
    if (!responsibleTeam) {
      throw new Error('责任班组不能为空');
    }
    return await this.get(`/api/topic04/maintenance/team/${encodeURIComponent(responsibleTeam)}`);
  }

  /**
   * 获取运维订单详情
   * @param {number} orderId - 订单ID
   * @returns {Promise<Object>} 订单详情
   */
  async getMaintenanceOrderDetail(orderId) {
    if (!orderId) {
      throw new Error('订单ID不能为空');
    }
    return await this.get(`/api/topic04/maintenance/detail/${orderId}`);
  }

  /**
   * 搜索运维订单
   * @param {Object} searchParams - 搜索参数
   * @param {string} searchParams.keyword - 搜索关键词
   * @param {string} searchParams.system - 系统模块
   * @param {string} searchParams.type - 维修类型
   * @param {string} searchParams.status - 维修状态
   * @param {string} searchParams.dateFrom - 开始日期
   * @param {string} searchParams.dateTo - 结束日期
   * @returns {Promise<Object>} 搜索结果
   */
  async searchMaintenanceOrders(searchParams = {}) {
    return await this.get('/api/topic04/maintenance/search', searchParams);
  }

  /**
   * 获取运维订单趋势数据
   * @param {Object} params - 查询参数
   * @param {string} params.period - 时间周期: day, week, month
   * @param {number} params.limit - 返回数量限制
   * @returns {Promise<Object>} 趋势数据
   */
  async getMaintenanceTrends(params = {}) {
    return await this.get('/api/topic04/maintenance/trends', params);
  }

  /**
   * 获取系统模块列表
   * @returns {Promise<Object>} 系统模块列表
   */
  async getSystemModules() {
    return await this.get('/api/topic04/maintenance/systems');
  }

  /**
   * 获取车站位置列表
   * @returns {Promise<Object>} 车站位置列表
   */
  async getStationLocations() {
    return await this.get('/api/topic04/maintenance/stations');
  }

  /**
   * 获取责任班组列表
   * @returns {Promise<Object>} 责任班组列表
   */
  async getResponsibleTeams() {
    return await this.get('/api/topic04/maintenance/teams');
  }

  /**
   * 获取服务状态信息
   * @returns {Promise<Object>} 状态信息
   */
  async getStatus() {
    return await this.get('/api/topic04/status');
  }

  /**
   * 获取实时运维订单数量
   * @returns {Promise<Object>} 实时数量统计
   */
  async getRealTimeCount() {
    return await this.get('/api/topic04/maintenance/realtime-count');
  }

  /**
   * 获取运维订单性能指标
   * @returns {Promise<Object>} 性能指标数据
   */
  async getPerformanceMetrics() {
    return await this.get('/api/topic04/maintenance/performance');
  }
}

// 创建并导出API实例
const topic04Api = new Topic04Api();

export { Topic04Api, topic04Api };
export default topic04Api;
