import axios from 'axios';

// 获取API基础URL
const API_BASE_URL = process.env.VUE_APP_API_URL || '';

class Topic04Api {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 10000; // 10秒超时
    this.modelRunBatch = '20240905'; // 全局模型运行批次变量
  }

  /**
   * 设置全局模型运行批次
   * @param {string} batch - 新的批次号
   */
  setModelRunBatch(batch) {
    if (!batch || typeof batch !== 'string') {
      throw new Error('批次号不能为空且必须是字符串');
    }
    this.modelRunBatch = batch;
    console.log(`🔄 Topic04 API 批次已设置为: ${batch}`);
  }

  /**
   * 获取当前模型运行批次
   * @returns {string} 当前批次号
   */
  getModelRunBatch() {
    return this.modelRunBatch;
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

  // ===== 生产任务相关API =====

  /**
   * 获取生产任务数据
   * @param {string} modelRunBatch - 模型运行批次 (可选，默认使用全局批次)
   * @returns {Promise<Object>} 生产任务列表
   */
  async getProductionTasks(modelRunBatch = null) {
    const batch = modelRunBatch || this.modelRunBatch;
    return await this.get('/api/topic04/production/tasks', { model_run_batch: batch });
  }

  /**
   * 根据订单号获取生产任务
   * @param {string} orderNo - 订单号
   * @returns {Promise<Object>} 指定订单的生产任务
   */
  async getProductionTasksByOrder(orderNo) {
    if (!orderNo) {
      throw new Error('订单号不能为空');
    }
    return await this.get(`/api/topic04/production/tasks/order/${encodeURIComponent(orderNo)}`);
  }

  /**
   * 获取生产任务统计数据
   * @param {string} modelRunBatch - 模型运行批次 (可选，默认使用全局批次)
   * @returns {Promise<Object>} 统计结果
   */
  async getProductionTaskStatistics(modelRunBatch = null) {
    const batch = modelRunBatch || this.modelRunBatch;
    return await this.get('/api/topic04/production/statistics', { model_run_batch: batch });
  }

  /**
   * 根据产品名称获取生产任务
   * @param {string} productName - 产品名称
   * @returns {Promise<Object>} 指定产品的生产任务
   */
  async getProductionTasksByProduct(productName) {
    if (!productName) {
      throw new Error('产品名称不能为空');
    }
    return await this.get(`/api/topic04/production/tasks/product/${encodeURIComponent(productName)}`);
  }

  /**
   * 根据工序获取生产任务
   * @param {string} procedureName - 工序名称
   * @returns {Promise<Object>} 指定工序的生产任务
   */
  async getProductionTasksByProcedure(procedureName) {
    if (!procedureName) {
      throw new Error('工序名称不能为空');
    }
    return await this.get(`/api/topic04/production/tasks/procedure/${encodeURIComponent(procedureName)}`);
  }

  /**
   * 根据操作员获取生产任务
   * @param {string} jockeyName - 操作员姓名
   * @returns {Promise<Object>} 指定操作员的生产任务
   */
  async getProductionTasksByJockey(jockeyName) {
    if (!jockeyName) {
      throw new Error('操作员姓名不能为空');
    }
    return await this.get(`/api/topic04/production/tasks/jockey/${encodeURIComponent(jockeyName)}`);
  }

  /**
   * 根据工作中心获取生产任务
   * @param {string} workCenterName - 工作中心名称
   * @returns {Promise<Object>} 指定工作中心的生产任务
   */
  async getProductionTasksByWorkCenter(workCenterName) {
    if (!workCenterName) {
      throw new Error('工作中心名称不能为空');
    }
    return await this.get(`/api/topic04/production/tasks/workcenter/${encodeURIComponent(workCenterName)}`);
  }

  /**
   * 搜索生产任务
   * @param {Object} searchParams - 搜索参数
   * @param {string} searchParams.keyword - 搜索关键词
   * @param {string} searchParams.product - 产品名称
   * @param {string} searchParams.procedure - 工序名称
   * @param {string} searchParams.jockey - 操作员
   * @param {string} searchParams.workCenter - 工作中心
   * @param {string} searchParams.dateFrom - 开始日期
   * @param {string} searchParams.dateTo - 结束日期
   * @returns {Promise<Object>} 搜索结果
   */
  async searchProductionTasks(searchParams = {}) {
    return await this.get('/api/topic04/production/tasks/search', searchParams);
  }
}

// 创建并导出API实例
const topic04Api = new Topic04Api();

// 使用示例：
// // 设置全局批次
// topic04Api.setModelRunBatch('20240905');
//
// // 获取当前批次
// const currentBatch = topic04Api.getModelRunBatch();
//
// // 使用全局批次调用API
// const tasks = await topic04Api.getProductionTasks();
// const stats = await topic04Api.getProductionTaskStatistics();
//
// // 或者指定特定的批次（覆盖全局设置）
// const specificTasks = await topic04Api.getProductionTasks('20240906');

export { Topic04Api, topic04Api };
export default topic04Api;
