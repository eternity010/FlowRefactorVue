import axios from 'axios';

// 获取API基础URL（生产默认走前端Nginx反代）
const API_BASE_URL = process.env.VUE_APP_API_URL || '';

class MySQLApi {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 15000; // 15秒超时，MySQL查询可能需要更长时间
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
      console.error(`MySQL API请求失败 [${method} ${endpoint}]:`, error);
      
      // 处理网络错误
      if (error.code === 'ECONNABORTED') {
        throw new Error('请求超时，请检查数据库连接或稍后重试');
      }
      
      // 处理HTTP错误
      if (error.response) {
        const { status, data } = error.response;
        throw new Error((data && data.error) || `HTTP ${status} 错误`);
      }
      
      // 处理其他错误
      throw new Error(error.message || 'MySQL数据库请求失败');
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
   * 检查MySQL数据库连接状态
   * @returns {Promise<Object>} 连接状态信息
   */
  async checkConnection() {
    return await this.get('/api/mysql/connection');
  }

  /**
   * 获取所有数据库表
   * @returns {Promise<Object>} 数据库表列表
   */
  async getAllTables() {
    return await this.get('/api/mysql/tables');
  }

  /**
   * 获取表结构
   * @param {string} tableName - 表名
   * @returns {Promise<Object>} 表结构信息
   */
  async getTableStructure(tableName) {
    return await this.get(`/api/mysql/tables/${tableName}/structure`);
  }

  /**
   * 获取表数据
   * @param {string} tableName - 表名
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 表数据
   */
  async getTableData(tableName, options = {}) {
    return await this.get(`/api/mysql/tables/${tableName}/data`, options);
  }

  /**
   * 插入数据
   * @param {string} tableName - 表名
   * @param {Object} data - 要插入的数据
   * @returns {Promise<Object>} 插入结果
   */
  async insertData(tableName, data) {
    return await this.post(`/api/mysql/tables/${tableName}/data`, data);
  }

  /**
   * 更新数据
   * @param {string} tableName - 表名
   * @param {Object} data - 要更新的数据
   * @param {Object} where - 更新条件
   * @returns {Promise<Object>} 更新结果
   */
  async updateData(tableName, data, where) {
    return await this.put(`/api/mysql/tables/${tableName}/data`, { data, where });
  }

  /**
   * 删除数据
   * @param {string} tableName - 表名
   * @param {Object} where - 删除条件
   * @returns {Promise<Object>} 删除结果
   */
  async deleteData(tableName, where) {
    return await this.delete(`/api/mysql/tables/${tableName}/data`, { where });
  }

  /**
   * 执行自定义SQL查询
   * @param {string} sql - SQL语句
   * @param {Array} params - 查询参数
   * @returns {Promise<Object>} 查询结果
   */
  async executeQuery(sql, params = []) {
    return await this.post('/api/mysql/query', { sql, params });
  }

  /**
   * 获取数据库统计信息
   * @returns {Promise<Object>} 数据库统计
   */
  async getDatabaseStats() {
    return await this.get('/api/mysql/stats');
  }

  /**
   * 获取表的分页数据
   * @param {string} tableName - 表名
   * @param {number} page - 页码 (从1开始)
   * @param {number} pageSize - 每页记录数
   * @param {Object} filters - 过滤条件
   * @param {string} sortBy - 排序字段
   * @param {string} sortOrder - 排序方向 ('ASC' | 'DESC')
   * @returns {Promise<Object>} 分页数据
   */
  async getTableDataPaginated(tableName, page = 1, pageSize = 20, filters = {}, sortBy = null, sortOrder = 'ASC') {
    const offset = (page - 1) * pageSize;
    const options = {
      limit: pageSize,
      offset: offset
    };

    // 构建WHERE条件
    if (Object.keys(filters).length > 0) {
      const conditions = [];
      const params = [];
      
      Object.entries(filters).forEach(([column, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          if (typeof value === 'string') {
            conditions.push(`${column} LIKE ?`);
            params.push(`%${value}%`);
          } else {
            conditions.push(`${column} = ?`);
            params.push(value);
          }
        }
      });

      if (conditions.length > 0) {
        options.where = {
          condition: conditions.join(' AND '),
          params: params
        };
      }
    }

    // 添加排序
    if (sortBy) {
      options.orderBy = `${sortBy} ${sortOrder}`;
    }

    return await this.getTableData(tableName, options);
  }

  /**
   * 搜索表数据
   * @param {string} tableName - 表名
   * @param {string} searchTerm - 搜索关键词
   * @param {Array} searchColumns - 要搜索的列名数组
   * @param {number} limit - 结果限制
   * @returns {Promise<Object>} 搜索结果
   */
  async searchTableData(tableName, searchTerm, searchColumns = [], limit = 50) {
    if (!searchTerm || searchColumns.length === 0) {
      return await this.getTableData(tableName, { limit });
    }

    const conditions = searchColumns.map(column => `${column} LIKE ?`);
    const params = new Array(searchColumns.length).fill(`%${searchTerm}%`);

    const options = {
      where: {
        condition: conditions.join(' OR '),
        params: params
      },
      limit: limit
    };

    return await this.getTableData(tableName, options);
  }

  /**
   * 批量插入数据
   * @param {string} tableName - 表名
   * @param {Array} dataArray - 要插入的数据数组
   * @returns {Promise<Object>} 批量插入结果
   */
  async bulkInsertData(tableName, dataArray) {
    return await this.post(`/api/mysql/tables/${tableName}/bulk-insert`, { data: dataArray });
  }

  /**
   * 备份表数据 (导出为JSON)
   * @param {string} tableName - 表名
   * @returns {Promise<Object>} 备份数据
   */
  async exportTableData(tableName) {
    return await this.get(`/api/mysql/tables/${tableName}/export`);
  }

  /**
   * 获取表的索引信息
   * @param {string} tableName - 表名
   * @returns {Promise<Object>} 索引信息
   */
  async getTableIndexes(tableName) {
    return await this.get(`/api/mysql/tables/${tableName}/indexes`);
  }

  /**
   * 测试SQL语句（只读操作）
   * @param {string} sql - SQL语句
   * @param {Array} params - 查询参数
   * @returns {Promise<Object>} 测试结果
   */
  async testQuery(sql, params = []) {
    return await this.post('/api/mysql/test-query', { sql, params });
  }
}

// 创建并导出API实例
const mysqlApi = new MySQLApi();

export { MySQLApi, mysqlApi };
export default mysqlApi;
