/**
 * Topic03 后端服务 - 车辆和人员匹配度管理
 * 基于 dm_topic0305_output_train_person_match 表
 */
const MySQLService = require('./mysqlService');

class Topic03Service {
  constructor() {
    this.serviceName = 'Topic03Service';
    this.mysqlService = new MySQLService();
    this.tableName = 'dm_topic0305_output_train_person_match';
  }

  /**
   * 初始化服务
   */
  async initialize() {
    try {
      // 检查数据库连接
      const connectionResult = await this.checkConnection();
      if (!connectionResult.success) {
        throw new Error('数据库连接失败');
      }
      
      console.log(`✅ ${this.serviceName} 服务已初始化`);
      return { success: true };
    } catch (error) {
      console.error(`❌ ${this.serviceName} 初始化失败:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 检查数据库连接状态
   */
  async checkConnection() {
    try {
      const result = await this.mysqlService.query('SELECT 1 as status');
      return {
        success: true,
        data: {
          status: 'connected',
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('数据库连接检查失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ============= 核心查询方法 =============

  /**
   * 根据人员ID获取其对所有车辆的匹配度
   * @param {string} personId - 人员ID
   * @param {Object} options - 查询选项
   */
  async getPersonTrainMatches(personId, options = {}) {
    try {
      const {
        sortBy = 'match_score',
        sortOrder = 'desc',
        page = 1,
        pageSize = 20,
        minMatchScore
      } = options;

      // 构建 WHERE 条件
      let whereConditions = [`person_id = '${personId}'`, 'del_flag = 0'];

      if (minMatchScore !== undefined) {
        whereConditions.push(`match_score > ${parseFloat(minMatchScore)}`); // 高匹配阈值：大于0.67
      }

      // 构建排序条件
      const validSortFields = ['match_score', 'train_id', 'create_time', 'update_time'];
      const validSortOrders = ['asc', 'desc'];
      
      const orderField = validSortFields.includes(sortBy) ? sortBy : 'match_score';
      const orderDirection = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'DESC';

      // 确保参数是数值类型
      const pageNum = parseInt(page) || 1;
      const pageSizeNum = parseInt(pageSize) || 20;
      const offset = (pageNum - 1) * pageSizeNum;

      // 主查询
      const sql = `
        SELECT 
          id,
          train_id,
          person_id,
          match_score,
          remark,
          create_time,
          update_time
        FROM ${this.tableName}
        WHERE ${whereConditions.join(' AND ')}
        ORDER BY ${orderField} ${orderDirection}
        LIMIT ${pageSizeNum} OFFSET ${offset}
      `;

      const result = await this.mysqlService.query(sql);

      if (!result.success) {
        throw new Error(result.error);
      }

      // 获取总数
      const countSql = `
        SELECT COUNT(*) as total 
        FROM ${this.tableName} 
        WHERE ${whereConditions.join(' AND ')}
      `;
      const countResult = await this.mysqlService.query(countSql);

      const total = countResult.success ? countResult.data[0].total : 0;

      return {
        success: true,
        data: {
          matches: result.data,
          pagination: {
            page: pageNum,
            pageSize: pageSizeNum,
            total,
            totalPages: Math.ceil(total / pageSizeNum)
          },
          personId,
          matchCount: result.data.length
        }
      };
    } catch (error) {
      console.error('获取人员车辆匹配度失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 根据车辆ID获取所有人员对该车辆的匹配度
   * @param {string} trainId - 车辆ID
   * @param {Object} options - 查询选项
   */
  async getTrainPersonMatches(trainId, options = {}) {
    try {
      const {
        sortBy = 'match_score',
        sortOrder = 'desc',
        page = 1,
        pageSize = 20,
        minMatchScore
      } = options;

      // 构建 WHERE 条件
      let whereConditions = [`train_id = '${trainId}'`, 'del_flag = 0'];

      if (minMatchScore !== undefined) {
        whereConditions.push(`match_score > ${parseFloat(minMatchScore)}`); // 高匹配阈值：大于0.67
      }

      // 构建排序条件
      const validSortFields = ['match_score', 'person_id', 'create_time', 'update_time'];
      const validSortOrders = ['asc', 'desc'];
      
      const orderField = validSortFields.includes(sortBy) ? sortBy : 'match_score';
      const orderDirection = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'DESC';

      // 确保参数是数值类型
      const pageNum = parseInt(page) || 1;
      const pageSizeNum = parseInt(pageSize) || 20;
      const offset = (pageNum - 1) * pageSizeNum;

      // 主查询
      const sql = `
        SELECT 
          id,
          train_id,
          person_id,
          match_score,
          remark,
          create_time,
          update_time
        FROM ${this.tableName}
        WHERE ${whereConditions.join(' AND ')}
        ORDER BY ${orderField} ${orderDirection}
        LIMIT ${pageSizeNum} OFFSET ${offset}
      `;

      const result = await this.mysqlService.query(sql);

      if (!result.success) {
        throw new Error(result.error);
      }

      // 获取总数
      const countSql = `
        SELECT COUNT(*) as total 
        FROM ${this.tableName} 
        WHERE ${whereConditions.join(' AND ')}
      `;
      const countResult = await this.mysqlService.query(countSql);

      const total = countResult.success ? countResult.data[0].total : 0;

      return {
        success: true,
        data: {
          matches: result.data,
          pagination: {
            page: pageNum,
            pageSize: pageSizeNum,
            total,
            totalPages: Math.ceil(total / pageSizeNum)
          },
          trainId,
          matchCount: result.data.length
        }
      };
    } catch (error) {
      console.error('获取车辆人员匹配度失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取所有人员列表及其匹配度统计
   * @param {Object} options - 查询选项
   */
  async getPersonList(options = {}) {
    try {
      const {
        sortBy = 'avg_match_score',
        sortOrder = 'desc',
        page = 1,
        pageSize = 50
      } = options;

      // 验证和格式化参数
      const validSortFields = ['avg_match_score', 'match_count', 'person_id', 'high_match_count'];
      const validSortOrders = ['asc', 'desc'];
      
      const orderField = validSortFields.includes(sortBy) ? sortBy : 'avg_match_score';
      const orderDirection = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'DESC';
      
      // 确保参数是数值类型
      const pageNum = parseInt(page) || 1;
      const pageSizeNum = parseInt(pageSize) || 50;
      const offset = (pageNum - 1) * pageSizeNum;

      const sql = `
        SELECT 
          person_id,
          COUNT(*) as match_count,
          AVG(match_score) as avg_match_score,
          MAX(match_score) as max_match_score,
          MIN(match_score) as min_match_score,
          SUM(CASE WHEN match_score > 0.67 THEN 1 ELSE 0 END) as high_match_count, -- 高匹配：匹配度大于0.67
          MAX(update_time) as last_update_time
        FROM ${this.tableName}
        WHERE del_flag = 0
        GROUP BY person_id
        ORDER BY ${orderField} ${orderDirection}
        LIMIT ${pageSizeNum} OFFSET ${offset}
      `;

      const result = await this.mysqlService.query(sql);

      if (!result.success) {
        throw new Error(result.error);
      }

      // 获取总人员数
      const countSql = `
        SELECT COUNT(DISTINCT person_id) as total 
        FROM ${this.tableName} 
        WHERE del_flag = 0
      `;
      const countResult = await this.mysqlService.query(countSql);
      const total = countResult.success ? countResult.data[0].total : 0;

      return {
        success: true,
        data: {
          persons: result.data.map(person => ({
            ...person,
            avg_match_score: parseFloat(parseFloat(person.avg_match_score).toFixed(3)),
            max_match_score: parseFloat(parseFloat(person.max_match_score).toFixed(3)),
            min_match_score: parseFloat(parseFloat(person.min_match_score).toFixed(3))
          })),
          pagination: {
            page: pageNum,
            pageSize: pageSizeNum,
            total,
            totalPages: Math.ceil(total / pageSizeNum)
          }
        }
      };
    } catch (error) {
      console.error('获取人员列表失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取所有车辆列表及其匹配度统计
   * @param {Object} options - 查询选项
   */
  async getTrainList(options = {}) {
    try {
      const {
        sortBy = 'avg_match_score',
        sortOrder = 'desc',
        page = 1,
        pageSize = 50
      } = options;

      // 验证和格式化参数
      const validSortFields = ['avg_match_score', 'match_count', 'train_id'];
      const validSortOrders = ['asc', 'desc'];
      
      const orderField = validSortFields.includes(sortBy) ? sortBy : 'avg_match_score';
      const orderDirection = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'DESC';
      
      // 确保参数是数值类型
      const pageNum = parseInt(page) || 1;
      const pageSizeNum = parseInt(pageSize) || 50;
      const offset = (pageNum - 1) * pageSizeNum;

      const sql = `
        SELECT 
          train_id,
          COUNT(*) as match_count,
          AVG(match_score) as avg_match_score,
          MAX(match_score) as max_match_score,
          MIN(match_score) as min_match_score,
          MAX(update_time) as last_update_time
        FROM ${this.tableName}
        WHERE del_flag = 0
        GROUP BY train_id
        ORDER BY ${orderField} ${orderDirection}
        LIMIT ${pageSizeNum} OFFSET ${offset}
      `;

      const result = await this.mysqlService.query(sql);

      if (!result.success) {
        throw new Error(result.error);
      }

      // 获取总车辆数
      const countSql = `
        SELECT COUNT(DISTINCT train_id) as total 
        FROM ${this.tableName} 
        WHERE del_flag = 0
      `;
      const countResult = await this.mysqlService.query(countSql);
      const total = countResult.success ? countResult.data[0].total : 0;

      return {
        success: true,
        data: {
          trains: result.data.map(train => ({
            ...train,
            avg_match_score: parseFloat(parseFloat(train.avg_match_score).toFixed(3)),
            max_match_score: parseFloat(parseFloat(train.max_match_score).toFixed(3)),
            min_match_score: parseFloat(parseFloat(train.min_match_score).toFixed(3))
          })),
          pagination: {
            page: pageNum,
            pageSize: pageSizeNum,
            total,
            totalPages: Math.ceil(total / pageSizeNum)
          }
        }
      };
    } catch (error) {
      console.error('获取车辆列表失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取人员详细信息及匹配度数据
   * @param {string} personId - 人员ID
   */
  async getPersonDetail(personId) {
    try {
      // 获取人员统计信息
      const statsSql = `
        SELECT 
          person_id,
          COUNT(*) as total_matches,
          AVG(match_score) as avg_match_score,
          MAX(match_score) as max_match_score,
          MIN(match_score) as min_match_score,
          MAX(update_time) as last_update_time
        FROM ${this.tableName}
        WHERE person_id = '${personId}' AND del_flag = 0
        GROUP BY person_id
      `;

      const statsResult = await this.mysqlService.query(statsSql);

      if (!statsResult.success || statsResult.data.length === 0) {
        return {
          success: false,
          error: '未找到该人员的匹配数据'
        };
      }

      const stats = statsResult.data[0];

      // 获取匹配度分布统计
      const distributionSql = `
        SELECT 
          CASE 
            WHEN match_score >= 0.8 THEN '优秀 (0.8-1.0)'
            WHEN match_score >= 0.7 THEN '良好 (0.7-0.8)'
            WHEN match_score >= 0.6 THEN '一般 (0.6-0.7)'
            ELSE '较低 (<0.6)'
          END as score_range,
          COUNT(*) as count
        FROM ${this.tableName}
        WHERE person_id = '${personId}' AND del_flag = 0
        GROUP BY 
          CASE 
            WHEN match_score >= 0.8 THEN '优秀 (0.8-1.0)'
            WHEN match_score >= 0.7 THEN '良好 (0.7-0.8)'
            WHEN match_score >= 0.6 THEN '一般 (0.6-0.7)'
            ELSE '较低 (<0.6)'
          END
        ORDER BY MIN(match_score) DESC
      `;

      const distributionResult = await this.mysqlService.query(distributionSql);

      // 获取前5个最佳匹配车辆
      const topMatchesSql = `
        SELECT 
          train_id,
          match_score,
          remark,
          update_time
        FROM ${this.tableName}
        WHERE person_id = '${personId}' AND del_flag = 0
        ORDER BY match_score DESC
        LIMIT 5
      `;

      const topMatchesResult = await this.mysqlService.query(topMatchesSql);

      return {
        success: true,
        data: {
          personId,
          statistics: {
            ...stats,
            avg_match_score: parseFloat(parseFloat(stats.avg_match_score).toFixed(3)),
            max_match_score: parseFloat(parseFloat(stats.max_match_score).toFixed(3)),
            min_match_score: parseFloat(parseFloat(stats.min_match_score).toFixed(3))
          },
          distribution: distributionResult.success ? distributionResult.data : [],
          topMatches: topMatchesResult.success ? topMatchesResult.data : []
        }
      };
    } catch (error) {
      console.error('获取人员详细信息失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取车辆详细信息及匹配度数据
   * @param {string} trainId - 车辆ID
   */
  async getTrainDetail(trainId) {
    try {
      // 获取车辆统计信息
      const statsSql = `
        SELECT 
          train_id,
          COUNT(*) as total_matches,
          AVG(match_score) as avg_match_score,
          MAX(match_score) as max_match_score,
          MIN(match_score) as min_match_score,
          MAX(update_time) as last_update_time
        FROM ${this.tableName}
        WHERE train_id = '${trainId}' AND del_flag = 0
        GROUP BY train_id
      `;

      const statsResult = await this.mysqlService.query(statsSql);

      if (!statsResult.success || statsResult.data.length === 0) {
        return {
          success: false,
          error: '未找到该车辆的匹配数据'
        };
      }

      const stats = statsResult.data[0];

      // 获取匹配度分布统计
      const distributionSql = `
        SELECT 
          CASE 
            WHEN match_score >= 0.8 THEN '优秀 (0.8-1.0)'
            WHEN match_score >= 0.7 THEN '良好 (0.7-0.8)'
            WHEN match_score >= 0.6 THEN '一般 (0.6-0.7)'
            ELSE '较低 (<0.6)'
          END as score_range,
          COUNT(*) as count
        FROM ${this.tableName}
        WHERE train_id = '${trainId}' AND del_flag = 0
        GROUP BY 
          CASE 
            WHEN match_score >= 0.8 THEN '优秀 (0.8-1.0)'
            WHEN match_score >= 0.7 THEN '良好 (0.7-0.8)'
            WHEN match_score >= 0.6 THEN '一般 (0.6-0.7)'
            ELSE '较低 (<0.6)'
          END
        ORDER BY MIN(match_score) DESC
      `;

      const distributionResult = await this.mysqlService.query(distributionSql);

      // 获取前5个最佳匹配人员
      const topMatchesSql = `
        SELECT 
          person_id,
          match_score,
          remark,
          update_time
        FROM ${this.tableName}
        WHERE train_id = '${trainId}' AND del_flag = 0
        ORDER BY match_score DESC
        LIMIT 5
      `;

      const topMatchesResult = await this.mysqlService.query(topMatchesSql);

      return {
        success: true,
        data: {
          trainId,
          statistics: {
            ...stats,
            avg_match_score: parseFloat(parseFloat(stats.avg_match_score).toFixed(3)),
            max_match_score: parseFloat(parseFloat(stats.max_match_score).toFixed(3)),
            min_match_score: parseFloat(parseFloat(stats.min_match_score).toFixed(3))
          },
          distribution: distributionResult.success ? distributionResult.data : [],
          topMatches: topMatchesResult.success ? topMatchesResult.data : []
        }
      };
    } catch (error) {
      console.error('获取车辆详细信息失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 搜索匹配记录
   * @param {Object} searchParams - 搜索参数
   * @param {Object} options - 查询选项
   */
  async searchMatches(searchParams = {}, options = {}) {
    try {
      const {
        personId,
        trainId,
        minScore,
        maxScore,
        dateFrom,
        dateTo
      } = searchParams;

      const {
        sortBy = 'match_score',
        sortOrder = 'desc',
        page = 1,
        pageSize = 20
      } = options;

      // 构建 WHERE 条件
      let whereConditions = ['del_flag = 0'];
      let params = [];

      if (personId) {
        whereConditions.push('person_id LIKE ?');
        params.push(`%${personId}%`);
      }

      if (trainId) {
        whereConditions.push('train_id LIKE ?');
        params.push(`%${trainId}%`);
      }

      if (minScore !== undefined) {
        whereConditions.push('match_score >= ?');
        params.push(minScore);
      }

      if (maxScore !== undefined) {
        whereConditions.push('match_score <= ?');
        params.push(maxScore);
      }

      if (dateFrom) {
        whereConditions.push('create_time >= ?');
        params.push(dateFrom);
      }

      if (dateTo) {
        whereConditions.push('create_time <= ?');
        params.push(dateTo + ' 23:59:59');
      }

      // 构建排序条件
      const validSortFields = ['match_score', 'person_id', 'train_id', 'create_time', 'update_time'];
      const orderField = validSortFields.includes(sortBy) ? sortBy : 'match_score';
      const orderDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

      // 确保参数是数值类型
      const pageNum = parseInt(page) || 1;
      const pageSizeNum = parseInt(pageSize) || 20;
      const offset = (pageNum - 1) * pageSizeNum;

      // 主查询
      const sql = `
        SELECT 
          id,
          train_id,
          person_id,
          match_score,
          remark,
          create_time,
          update_time
        FROM ${this.tableName}
        WHERE ${whereConditions.join(' AND ')}
        ORDER BY ${orderField} ${orderDirection}
        LIMIT ${pageSizeNum} OFFSET ${offset}
      `;

      const result = await this.mysqlService.query(sql);

      if (!result.success) {
        throw new Error(result.error);
      }

      // 获取总数
      const countSql = `
        SELECT COUNT(*) as total 
        FROM ${this.tableName} 
        WHERE ${whereConditions.join(' AND ')}
      `;
      const countResult = await this.mysqlService.query(countSql);

      const total = countResult.success ? countResult.data[0].total : 0;

      return {
        success: true,
        data: {
          matches: result.data,
          pagination: {
            page: pageNum,
            pageSize: pageSizeNum,
            total,
            totalPages: Math.ceil(total / pageSizeNum)
          },
          searchParams
        }
      };
    } catch (error) {
      console.error('搜索匹配记录失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取匹配度统计信息
   * @param {Object} options - 查询选项
   */
  async getMatchStatistics(options = {}) {
    try {
      const { groupBy = 'score_range' } = options;

      let result = {};

      // 总体统计
      const overallSql = `
        SELECT 
          COUNT(*) as total_matches,
          COUNT(DISTINCT person_id) as total_persons,
          COUNT(DISTINCT train_id) as total_trains,
          AVG(match_score) as avg_match_score,
          MAX(match_score) as max_match_score,
          MIN(match_score) as min_match_score
        FROM ${this.tableName}
        WHERE del_flag = 0
      `;

      const overallResult = await this.mysqlService.query(overallSql);
      
      if (overallResult.success) {
        result.overall = {
          ...overallResult.data[0],
          avg_match_score: parseFloat(parseFloat(overallResult.data[0].avg_match_score).toFixed(3))
        };
      }

      // 根据分组方式获取详细统计
      if (groupBy === 'score_range') {
        const scoreSql = `
          SELECT 
            CASE 
              WHEN match_score >= 0.8 THEN '优秀 (0.8-1.0)'
              WHEN match_score >= 0.7 THEN '良好 (0.7-0.8)'
              WHEN match_score >= 0.6 THEN '一般 (0.6-0.7)'
              ELSE '较低 (<0.6)'
            END as score_range,
            COUNT(*) as count,
            AVG(match_score) as avg_score
          FROM ${this.tableName}
          WHERE del_flag = 0
          GROUP BY 
            CASE 
              WHEN match_score >= 0.8 THEN '优秀 (0.8-1.0)'
              WHEN match_score >= 0.7 THEN '良好 (0.7-0.8)'
              WHEN match_score >= 0.6 THEN '一般 (0.6-0.7)'
              ELSE '较低 (<0.6)'
            END
          ORDER BY MIN(match_score) DESC
        `;

        const scoreResult = await this.mysqlService.query(scoreSql);
        if (scoreResult.success) {
          result.scoreDistribution = scoreResult.data.map(item => ({
            ...item,
            avg_score: parseFloat(parseFloat(item.avg_score).toFixed(3))
          }));
        }
      }

      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('获取匹配度统计失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取推荐匹配
   * @param {Object} params - 推荐参数
   */
  async getRecommendations(params) {
    try {
      const { type, id, topN = 10, minScore = 0.6 } = params;

      // 验证和格式化参数
      const limitNum = parseInt(topN) || 10;
      const scoreThreshold = parseFloat(minScore) || 0.6;

      if (type === 'person') {
        // 为人员推荐最匹配的车辆
        const sql = `
          SELECT 
            train_id,
            match_score,
            remark,
            update_time
          FROM ${this.tableName}
          WHERE person_id = '${id}' AND match_score >= ${scoreThreshold} AND del_flag = 0
          ORDER BY match_score DESC
          LIMIT ${limitNum}
        `;

        const result = await this.mysqlService.query(sql);

        return {
          success: true,
          data: {
            type: 'train',
            personId: id,
            recommendations: result.success ? result.data : []
          }
        };
      } else if (type === 'train') {
        // 为车辆推荐最匹配的人员
        const sql = `
          SELECT 
            person_id,
            match_score,
            remark,
            update_time
          FROM ${this.tableName}
          WHERE train_id = '${id}' AND match_score >= ${scoreThreshold} AND del_flag = 0
          ORDER BY match_score DESC
          LIMIT ${limitNum}
        `;

        const result = await this.mysqlService.query(sql);

        return {
          success: true,
          data: {
            type: 'person',
            trainId: id,
            recommendations: result.success ? result.data : []
          }
        };
      } else {
        throw new Error('推荐类型必须是 person 或 train');
      }
    } catch (error) {
      console.error('获取推荐匹配失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ============= 数据管理方法 =============

  /**
   * 获取所有匹配数据
   * @param {Object} options - 查询选项
   */
  async getAllMatches(options = {}) {
    try {
      const {
        sortBy = 'create_time',
        sortOrder = 'desc',
        page = 1,
        pageSize = 100
      } = options;

      // 验证排序参数
      const validSortFields = ['match_score', 'person_id', 'train_id', 'create_time', 'update_time'];
      const validSortOrders = ['asc', 'desc'];
      
      const orderField = validSortFields.includes(sortBy) ? sortBy : 'create_time';
      const orderDirection = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'DESC';
      
      // 确保参数是数值类型
      const pageNum = parseInt(page) || 1;
      const pageSizeNum = parseInt(pageSize) || 100;
      const offset = (pageNum - 1) * pageSizeNum;

      const sql = `
        SELECT 
          id,
          train_id,
          person_id,
          match_score,
          remark,
          del_flag,
          create_time,
          update_time
        FROM ${this.tableName}
        WHERE del_flag = 0
        ORDER BY ${orderField} ${orderDirection}
        LIMIT ${pageSizeNum} OFFSET ${offset}
      `;

      const result = await this.mysqlService.query(sql);

      if (!result.success) {
        throw new Error(result.error);
      }

      // 获取总数
      const countResult = await this.mysqlService.query(
        `SELECT COUNT(*) as total FROM ${this.tableName} WHERE del_flag = 0`
      );
      const total = countResult.success ? countResult.data[0].total : 0;

      return {
        success: true,
        data: {
          matches: result.data,
          pagination: {
            page: pageNum,
            pageSize: pageSizeNum,
            total,
            totalPages: Math.ceil(total / pageSizeNum)
          }
        }
      };
    } catch (error) {
      console.error('获取所有匹配数据失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 批量获取匹配度数据
   * @param {Object} params - 批量查询参数
   */
  async getBatchMatches(params) {
    try {
      const { personIds, trainIds } = params;
      let results = {};

      if (personIds && personIds.length > 0) {
        const personIdsList = personIds.map(id => `'${id}'`).join(',');
        const sql = `
          SELECT 
            person_id,
            train_id,
            match_score,
            remark,
            update_time
          FROM ${this.tableName}
          WHERE person_id IN (${personIdsList}) AND del_flag = 0
          ORDER BY person_id, match_score DESC
        `;

        const result = await this.mysqlService.query(sql);
        if (result.success) {
          results.personMatches = result.data;
        }
      }

      if (trainIds && trainIds.length > 0) {
        const trainIdsList = trainIds.map(id => `'${id}'`).join(',');
        const sql = `
          SELECT 
            train_id,
            person_id,
            match_score,
            remark,
            update_time
          FROM ${this.tableName}
          WHERE train_id IN (${trainIdsList}) AND del_flag = 0
          ORDER BY train_id, match_score DESC
        `;

        const result = await this.mysqlService.query(sql);
        if (result.success) {
          results.trainMatches = result.data;
        }
      }

      return {
        success: true,
        data: results
      };
    } catch (error) {
      console.error('批量获取匹配度数据失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }


  /**
   * 获取表结构信息
   */
  async getTableStructure() {
    try {
      const result = await this.mysqlService.getTableStructure(this.tableName);
      return result;
    } catch (error) {
      console.error('获取表结构失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 清理服务资源
   */
  async cleanup() {
    try {
      if (this.mysqlService) {
        await this.mysqlService.disconnect();
      }
      console.log(`✅ ${this.serviceName} 资源清理完成`);
      return { success: true };
    } catch (error) {
      console.error(`❌ ${this.serviceName} 资源清理失败:`, error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = Topic03Service;
