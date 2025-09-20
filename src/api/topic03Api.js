import axios from 'axios';

// 获取API基础URL
const API_BASE_URL = process.env.VUE_APP_API_URL || '';

class Topic03Api {
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
      console.error(`Topic03 API请求失败 [${method} ${endpoint}]:`, error);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('请求超时，请稍后重试');
      }
      
      if (error.response) {
        const { status, data } = error.response;
        throw new Error((data && data.error) || `HTTP ${status} 错误`);
      }
      
      throw new Error(error.message || 'Topic03 请求失败');
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

  // ============= 车辆和人员匹配度相关API =============

  /**
   * 根据人员ID获取其对所有车辆的匹配度
   * @param {string} personId - 人员ID (如"王工")
   * @param {Object} options - 查询选项
   * @param {string} options.sortBy - 排序字段 (match_score, train_id, create_time)
   * @param {string} options.sortOrder - 排序方向 (asc, desc)
   * @param {number} options.page - 页码
   * @param {number} options.pageSize - 每页大小
   * @param {number} options.minMatchScore - 最小匹配度筛选
   * @returns {Promise<Object>} 匹配度列表数据
   */
  async getPersonTrainMatches(personId, options = {}) {
    if (!personId) {
      throw new Error('人员ID不能为空');
    }

    const params = {
      person_id: personId,
      sort_by: options.sortBy || 'match_score',
      sort_order: options.sortOrder || 'desc',
      page: options.page || 1,
      page_size: options.pageSize || 20,
      ...options
    };

    if (options.minMatchScore !== undefined) {
      params.min_match_score = options.minMatchScore;
    }

    return await this.get('/api/topic03/person-train-matches', params);
  }

  /**
   * 获取所有人员列表及其匹配度统计
   * @param {Object} options - 查询选项
   * @param {string} options.sortBy - 排序字段 (person_id, avg_match_score, match_count)
   * @param {string} options.sortOrder - 排序方向
   * @param {number} options.page - 页码
   * @param {number} options.pageSize - 每页大小
   * @returns {Promise<Object>} 人员列表及统计数据
   */
  async getPersonList(options = {}) {
    const params = {
      sort_by: options.sortBy || 'avg_match_score',
      sort_order: options.sortOrder || 'desc',
      page: options.page || 1,
      page_size: options.pageSize || 50,
      ...options
    };

    return await this.get('/api/topic03/person-list', params);
  }

  /**
   * 获取所有车辆列表及其匹配度统计
   * @param {Object} options - 查询选项
   * @param {string} options.sortBy - 排序字段 (train_id, avg_match_score, match_count)
   * @param {string} options.sortOrder - 排序方向
   * @param {number} options.page - 页码
   * @param {number} options.pageSize - 每页大小
   * @returns {Promise<Object>} 车辆列表及统计数据
   */
  async getTrainList(options = {}) {
    const params = {
      sort_by: options.sortBy || 'avg_match_score',
      sort_order: options.sortOrder || 'desc',
      page: options.page || 1,
      page_size: options.pageSize || 50,
      ...options
    };

    return await this.get('/api/topic03/train-list', params);
  }

  /**
   * 根据车辆ID获取所有人员对该车辆的匹配度
   * @param {string} trainId - 车辆ID (如"CR200J-2004")
   * @param {Object} options - 查询选项
   * @param {string} options.sortBy - 排序字段 (match_score, person_id, create_time)
   * @param {string} options.sortOrder - 排序方向 (asc, desc)
   * @param {number} options.page - 页码
   * @param {number} options.pageSize - 每页大小
   * @param {number} options.minMatchScore - 最小匹配度筛选
   * @returns {Promise<Object>} 匹配度列表数据
   */
  async getTrainPersonMatches(trainId, options = {}) {
    if (!trainId) {
      throw new Error('车辆ID不能为空');
    }

    const params = {
      train_id: trainId,
      sort_by: options.sortBy || 'match_score',
      sort_order: options.sortOrder || 'desc',
      page: options.page || 1,
      page_size: options.pageSize || 20,
      ...options
    };

    if (options.minMatchScore !== undefined) {
      params.min_match_score = options.minMatchScore;
    }

    return await this.get('/api/topic03/train-person-matches', params);
  }

  /**
   * 获取匹配度统计信息
   * @param {Object} options - 查询选项
   * @param {string} options.groupBy - 分组方式 (person, train, score_range)
   * @returns {Promise<Object>} 统计数据
   */
  async getMatchStatistics(options = {}) {
    const params = {
      group_by: options.groupBy || 'score_range',
      ...options
    };

    return await this.get('/api/topic03/match-statistics', params);
  }

  /**
   * 搜索匹配记录
   * @param {Object} searchParams - 搜索参数
   * @param {string} searchParams.personId - 人员ID (可选)
   * @param {string} searchParams.trainId - 车辆ID (可选)
   * @param {number} searchParams.minScore - 最小匹配度
   * @param {number} searchParams.maxScore - 最大匹配度
   * @param {string} searchParams.dateFrom - 开始日期 (YYYY-MM-DD)
   * @param {string} searchParams.dateTo - 结束日期 (YYYY-MM-DD)
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 搜索结果
   */
  async searchMatches(searchParams = {}, options = {}) {
    const params = {
      ...searchParams,
      sort_by: options.sortBy || 'match_score',
      sort_order: options.sortOrder || 'desc',
      page: options.page || 1,
      page_size: options.pageSize || 20
    };

    return await this.get('/api/topic03/search-matches', params);
  }

  /**
   * 获取人员详细信息及匹配度数据
   * @param {string} personId - 人员ID
   * @returns {Promise<Object>} 人员详细信息
   */
  async getPersonDetail(personId) {
    if (!personId) {
      throw new Error('人员ID不能为空');
    }

    return await this.get(`/api/topic03/person-detail/${encodeURIComponent(personId)}`);
  }

  /**
   * 获取车辆详细信息及匹配度数据
   * @param {string} trainId - 车辆ID
   * @returns {Promise<Object>} 车辆详细信息
   */
  async getTrainDetail(trainId) {
    if (!trainId) {
      throw new Error('车辆ID不能为空');
    }

    return await this.get(`/api/topic03/train-detail/${encodeURIComponent(trainId)}`);
  }

  /**
   * 获取推荐匹配
   * 根据人员或车辆获取推荐的匹配对象
   * @param {Object} params - 推荐参数
   * @param {string} params.type - 推荐类型 ('person' | 'train')
   * @param {string} params.id - 人员ID或车辆ID
   * @param {number} params.topN - 返回前N个推荐结果
   * @param {number} params.minScore - 最小匹配度阈值
   * @returns {Promise<Object>} 推荐结果
   */
  async getRecommendations(params) {
    const { type, id, topN = 10, minScore = 0.6 } = params;
    
    if (!type || !id) {
      throw new Error('推荐类型和ID不能为空');
    }

    if (!['person', 'train'].includes(type)) {
      throw new Error('推荐类型必须是 person 或 train');
    }

    const queryParams = {
      type,
      id,
      top_n: topN,
      min_score: minScore
    };

    return await this.get('/api/topic03/recommendations', queryParams);
  }

  /**
   * 批量获取匹配度数据
   * @param {Object} params - 批量查询参数
   * @param {string[]} params.personIds - 人员ID列表
   * @param {string[]} params.trainIds - 车辆ID列表
   * @returns {Promise<Object>} 批量匹配度数据
   */
  async getBatchMatches(params) {
    if (!params.personIds && !params.trainIds) {
      throw new Error('至少需要提供人员ID或车辆ID列表');
    }

    return await this.post('/api/topic03/batch-matches', params);
  }

  // ============= 数据管理相关API =============

  /**
   * 获取所有匹配数据
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 数据结果
   */
  async getAllMatches(options = {}) {
    const params = {
      sort_by: options.sortBy || 'create_time',
      sort_order: options.sortOrder || 'desc',
      page: options.page || 1,
      page_size: options.pageSize || 100,
      ...options
    };

    return await this.get('/api/topic03/matches', params);
  }


  /**
   * 获取API状态信息
   * @returns {Promise<Object>} 状态信息
   */
  async getStatus() {
    return await this.get('/api/topic03/status');
  }
}

// 创建并导出API实例
const topic03Api = new Topic03Api();

export { Topic03Api, topic03Api };
export default topic03Api;
