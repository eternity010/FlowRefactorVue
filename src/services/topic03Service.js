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
    this.trainAssemblyTableName = 'dm_topic0301_output_user_2';
    this.equipmentTableName = 'dm_topic0302_output_equipment_2';
    this.customerBaseTableName = 'dm_topic0304_input_customer_base';
    this.leadTableName = 'dm_topic0304_input_lead';
    this.optimizationMetricsTableName = 'dm_topic0306_output_optimization_metrics';
    this.salesCustomerMatchTableName = 'dm_topic0306_output_sales_customer_match';
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

  // ============= 火车装配人员匹配方法 =============

  /**
   * 获取火车装配人员列表及其任务匹配度统计
   * @param {Object} options - 查询选项
   */
  async getTrainAssemblyUsers(options = {}) {
    try {
      const {
        sortBy = 'avg_match_rate',
        sortOrder = 'desc',
        page = 1,
        pageSize = 20,
        modelRunBatch = 'TRAIN_ASSEMBLY_2025'
      } = options;

      // 验证和格式化参数
      const validSortFields = ['avg_match_rate', 'task_count', 'user_id', 'high_match_count', 'max_match_rate'];
      const validSortOrders = ['asc', 'desc'];
      
      const orderField = validSortFields.includes(sortBy) ? sortBy : 'avg_match_rate';
      const orderDirection = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'DESC';
      
      // 确保参数是数值类型
      const pageNum = parseInt(page) || 1;
      const pageSizeNum = parseInt(pageSize) || 20;
      const offset = (pageNum - 1) * pageSizeNum;

      const sql = `
        SELECT 
          user_id,
          COUNT(*) as task_count,
          AVG(rate_percent) as avg_match_rate,
          MAX(rate_percent) as max_match_rate,
          MIN(rate_percent) as min_match_rate,
          SUM(CASE WHEN rate_percent > 0.70 THEN 1 ELSE 0 END) as high_match_count,
          MAX(update_time) as last_update_time,
          model_run_batch
        FROM ${this.trainAssemblyTableName}
        WHERE del_flag = 0 AND model_run_batch = '${modelRunBatch}'
        GROUP BY user_id, model_run_batch
        ORDER BY ${orderField} ${orderDirection}
        LIMIT ${pageSizeNum} OFFSET ${offset}
      `;

      const result = await this.mysqlService.query(sql);

      if (!result.success) {
        throw new Error(result.error);
      }

      // 获取总用户数
      const countSql = `
        SELECT COUNT(DISTINCT user_id) as total 
        FROM ${this.trainAssemblyTableName} 
        WHERE del_flag = 0 AND model_run_batch = '${modelRunBatch}'
      `;
      const countResult = await this.mysqlService.query(countSql);
      const total = countResult.success ? countResult.data[0].total : 0;

      return {
        success: true,
        data: {
          users: result.data.map(user => ({
            ...user,
            avg_match_rate: parseFloat(parseFloat(user.avg_match_rate).toFixed(3)),
            max_match_rate: parseFloat(parseFloat(user.max_match_rate).toFixed(3)),
            min_match_rate: parseFloat(parseFloat(user.min_match_rate).toFixed(3))
          })),
          pagination: {
            page: pageNum,
            pageSize: pageSizeNum,
            total,
            totalPages: Math.ceil(total / pageSizeNum)
          },
          modelRunBatch
        }
      };
    } catch (error) {
      console.error('获取火车装配人员列表失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取特定火车装配人员的详细任务匹配信息
   * @param {number} userId - 用户ID
   * @param {Object} options - 查询选项
   */
  async getTrainAssemblyUserDetail(userId, options = {}) {
    try {
      const {
        modelRunBatch = 'TRAIN_ASSEMBLY_2025',
        sortBy = 'rate_percent',
        sortOrder = 'desc'
      } = options;

      // 获取用户的所有任务匹配数据
      const detailSql = `
        SELECT 
          id,
          user_id,
          task_id,
          rate_percent,
          remark,
          create_time,
          update_time,
          model_run_batch
        FROM ${this.trainAssemblyTableName}
        WHERE user_id = ${parseInt(userId)} 
          AND model_run_batch = '${modelRunBatch}' 
          AND del_flag = 0
        ORDER BY ${sortBy === 'rate_percent' ? 'rate_percent' : 'task_id'} ${sortOrder.toUpperCase()}
      `;

      const result = await this.mysqlService.query(detailSql);

      if (!result.success) {
        throw new Error(result.error);
      }

      if (result.data.length === 0) {
        return {
          success: false,
          error: '未找到该用户的匹配数据'
        };
      }

      // 计算统计信息
      const matches = result.data;
      const matchRates = matches.map(m => m.rate_percent);
      const avgMatchRate = matchRates.reduce((sum, rate) => sum + rate, 0) / matchRates.length;
      const maxMatchRate = Math.max(...matchRates);
      const minMatchRate = Math.min(...matchRates);
      const highMatchCount = matches.filter(m => m.rate_percent > 0.70).length;

      // 获取匹配度分布统计
      const distributionSql = `
        SELECT 
          CASE 
            WHEN rate_percent >= 0.85 THEN '优秀 (0.85-1.0)'
            WHEN rate_percent >= 0.70 THEN '良好 (0.70-0.85)'
            WHEN rate_percent >= 0.55 THEN '一般 (0.55-0.70)'
            ELSE '较低 (<0.55)'
          END as score_range,
          COUNT(*) as count
        FROM ${this.trainAssemblyTableName}
        WHERE user_id = ${parseInt(userId)} 
          AND model_run_batch = '${modelRunBatch}' 
          AND del_flag = 0
        GROUP BY 
          CASE 
            WHEN rate_percent >= 0.85 THEN '优秀 (0.85-1.0)'
            WHEN rate_percent >= 0.70 THEN '良好 (0.70-0.85)'
            WHEN rate_percent >= 0.55 THEN '一般 (0.55-0.70)'
            ELSE '较低 (<0.55)'
          END
        ORDER BY MIN(rate_percent) DESC
      `;

      const distributionResult = await this.mysqlService.query(distributionSql);

      // 获取前3个最佳匹配任务
      const topMatches = matches
        .sort((a, b) => b.rate_percent - a.rate_percent)
        .slice(0, 3);

      return {
        success: true,
        data: {
          userId: parseInt(userId),
          modelRunBatch,
          statistics: {
            total_tasks: matches.length,
            avg_match_rate: parseFloat(avgMatchRate.toFixed(3)),
            max_match_rate: parseFloat(maxMatchRate.toFixed(3)),
            min_match_rate: parseFloat(minMatchRate.toFixed(3)),
            high_match_count: highMatchCount,
            last_update_time: matches[0].update_time
          },
          distribution: distributionResult.success ? distributionResult.data : [],
          topMatches: topMatches,
          allMatches: matches
        }
      };
    } catch (error) {
      console.error('获取火车装配人员详细信息失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取火车装配任务匹配统计
   * @param {Object} options - 查询选项
   */
  async getTrainAssemblyStatistics(options = {}) {
    try {
      const { modelRunBatch = 'TRAIN_ASSEMBLY_2025' } = options;

      // 总体统计
      const overallSql = `
        SELECT 
          COUNT(*) as total_matches,
          COUNT(DISTINCT user_id) as total_users,
          COUNT(DISTINCT task_id) as total_tasks,
          AVG(rate_percent) as avg_match_rate,
          MAX(rate_percent) as max_match_rate,
          MIN(rate_percent) as min_match_rate,
          SUM(CASE WHEN rate_percent > 0.70 THEN 1 ELSE 0 END) as high_match_count
        FROM ${this.trainAssemblyTableName}
        WHERE del_flag = 0 AND model_run_batch = '${modelRunBatch}'
      `;

      const overallResult = await this.mysqlService.query(overallSql);

      // 匹配度分布统计
      const scoreSql = `
        SELECT 
          CASE 
            WHEN rate_percent >= 0.85 THEN '优秀 (0.85-1.0)'
            WHEN rate_percent >= 0.70 THEN '良好 (0.70-0.85)'
            WHEN rate_percent >= 0.55 THEN '一般 (0.55-0.70)'
            ELSE '较低 (<0.55)'
          END as score_range,
          COUNT(*) as count,
          AVG(rate_percent) as avg_score
        FROM ${this.trainAssemblyTableName}
        WHERE del_flag = 0 AND model_run_batch = '${modelRunBatch}'
        GROUP BY 
          CASE 
            WHEN rate_percent >= 0.85 THEN '优秀 (0.85-1.0)'
            WHEN rate_percent >= 0.70 THEN '良好 (0.70-0.85)'
            WHEN rate_percent >= 0.55 THEN '一般 (0.55-0.70)'
            ELSE '较低 (<0.55)'
          END
        ORDER BY MIN(rate_percent) DESC
      `;

      const scoreResult = await this.mysqlService.query(scoreSql);

      // 按任务统计
      const taskSql = `
        SELECT 
          task_id,
          COUNT(*) as match_count,
          AVG(rate_percent) as avg_match_rate,
          MAX(rate_percent) as max_match_rate,
          MIN(rate_percent) as min_match_rate
        FROM ${this.trainAssemblyTableName}
        WHERE del_flag = 0 AND model_run_batch = '${modelRunBatch}'
        GROUP BY task_id
        ORDER BY avg_match_rate DESC
      `;

      const taskResult = await this.mysqlService.query(taskSql);

      let result = {};

      if (overallResult.success) {
        result.overall = {
          ...overallResult.data[0],
          avg_match_rate: parseFloat(parseFloat(overallResult.data[0].avg_match_rate).toFixed(3)),
          max_match_rate: parseFloat(parseFloat(overallResult.data[0].max_match_rate).toFixed(3)),
          min_match_rate: parseFloat(parseFloat(overallResult.data[0].min_match_rate).toFixed(3))
        };
      }

      if (scoreResult.success) {
        result.scoreDistribution = scoreResult.data.map(item => ({
          ...item,
          avg_score: parseFloat(parseFloat(item.avg_score).toFixed(3))
        }));
      }

      if (taskResult.success) {
        result.taskStatistics = taskResult.data.map(item => ({
          ...item,
          avg_match_rate: parseFloat(parseFloat(item.avg_match_rate).toFixed(3)),
          max_match_rate: parseFloat(parseFloat(item.max_match_rate).toFixed(3)),
          min_match_rate: parseFloat(parseFloat(item.min_match_rate).toFixed(3))
        }));
      }

      return {
        success: true,
        data: {
          ...result,
          modelRunBatch
        }
      };
    } catch (error) {
      console.error('获取火车装配统计失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 搜索火车装配人员匹配记录
   * @param {Object} searchParams - 搜索参数
   * @param {Object} options - 查询选项
   */
  async searchTrainAssemblyMatches(searchParams = {}, options = {}) {
    try {
      const {
        userId,
        taskId,
        minRate,
        maxRate,
        modelRunBatch = 'TRAIN_ASSEMBLY_2025'
      } = searchParams;

      const {
        sortBy = 'rate_percent',
        sortOrder = 'desc',
        page = 1,
        pageSize = 20
      } = options;

      // 构建 WHERE 条件
      let whereConditions = ['del_flag = 0', `model_run_batch = '${modelRunBatch}'`];

      if (userId) {
        whereConditions.push(`user_id = ${parseInt(userId)}`);
      }

      if (taskId) {
        whereConditions.push(`task_id = ${parseInt(taskId)}`);
      }

      if (minRate !== undefined) {
        whereConditions.push(`rate_percent >= ${parseFloat(minRate)}`);
      }

      if (maxRate !== undefined) {
        whereConditions.push(`rate_percent <= ${parseFloat(maxRate)}`);
      }

      // 构建排序条件
      const validSortFields = ['rate_percent', 'user_id', 'task_id', 'create_time', 'update_time'];
      const orderField = validSortFields.includes(sortBy) ? sortBy : 'rate_percent';
      const orderDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

      // 确保参数是数值类型
      const pageNum = parseInt(page) || 1;
      const pageSizeNum = parseInt(pageSize) || 20;
      const offset = (pageNum - 1) * pageSizeNum;

      // 主查询
      const sql = `
        SELECT 
          id,
          user_id,
          task_id,
          rate_percent,
          remark,
          create_time,
          update_time,
          model_run_batch
        FROM ${this.trainAssemblyTableName}
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
        FROM ${this.trainAssemblyTableName} 
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
          searchParams,
          modelRunBatch
        }
      };
    } catch (error) {
      console.error('搜索火车装配匹配记录失败:', error);
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

  // ========================================
  // 列车最终装配设备健康度管理
  // ========================================

  /**
   * 获取设备健康度列表
   * @param {Object} options - 查询选项
   */
  async getTrainAssemblyEquipment(options = {}) {
    try {
      const {
        sortBy = 'rate_percent',
        sortOrder = 'desc',
        page = 1,
        pageSize = 10,
        modelRunBatch = 'TRAIN_ASSEMBLY_2025'
      } = options;

      // 验证和格式化参数
      const validSortFields = ['rate_percent', 'equipment_id', 'create_time', 'update_time'];
      const validSortOrders = ['asc', 'desc'];

      const orderField = validSortFields.includes(sortBy) ? sortBy : 'rate_percent';
      const orderDirection = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'DESC';

      // 确保参数是数值类型
      const pageNum = parseInt(page) || 1;
      const pageSizeNum = parseInt(pageSize) || 10;
      const offset = (pageNum - 1) * pageSizeNum;

      const sql = `
        SELECT
          id,
          equipment_id,
          rate_percent,
          remark,
          create_time,
          update_time,
          model_run_batch
        FROM ${this.equipmentTableName}
        WHERE del_flag = 0 AND model_run_batch = '${modelRunBatch}'
        ORDER BY ${orderField} ${orderDirection}
        LIMIT ${pageSizeNum} OFFSET ${offset}
      `;

      const result = await this.mysqlService.query(sql);

      if (!result.success) {
        throw new Error(result.error);
      }

      // 获取总设备数
      const countSql = `
        SELECT COUNT(*) as total
        FROM ${this.equipmentTableName}
        WHERE del_flag = 0 AND model_run_batch = '${modelRunBatch}'
      `;

      const countResult = await this.mysqlService.query(countSql);

      if (!countResult.success) {
        throw new Error(countResult.error);
      }

      const total = countResult.data[0]?.total || 0;
      const totalPages = Math.ceil(total / pageSizeNum);

      return {
        success: true,
        data: {
          equipment: result.data || [],
          pagination: {
            page: pageNum,
            pageSize: pageSizeNum,
            total: total,
            totalPages: totalPages
          },
          sortBy: orderField,
          sortOrder: orderDirection.toLowerCase()
        }
      };

    } catch (error) {
      console.error('获取设备健康度列表失败:', error);
      return {
        success: false,
        error: error.message || '获取设备健康度列表失败'
      };
    }
  }

  /**
   * 获取设备健康度统计信息
   * @param {Object} options - 查询选项
   */
  async getTrainAssemblyEquipmentStatistics(options = {}) {
    try {
      const { modelRunBatch = 'TRAIN_ASSEMBLY_2025' } = options;

      const sql = `
        SELECT
          COUNT(*) as total_equipment,
          AVG(rate_percent) as avg_health_rate,
          MAX(rate_percent) as max_health_rate,
          MIN(rate_percent) as min_health_rate,
          SUM(CASE WHEN rate_percent >= 0.90 THEN 1 ELSE 0 END) as excellent_count,
          SUM(CASE WHEN rate_percent >= 0.75 AND rate_percent < 0.90 THEN 1 ELSE 0 END) as good_count,
          SUM(CASE WHEN rate_percent >= 0.60 AND rate_percent < 0.75 THEN 1 ELSE 0 END) as warning_count,
          SUM(CASE WHEN rate_percent < 0.60 THEN 1 ELSE 0 END) as poor_count
        FROM ${this.equipmentTableName}
        WHERE del_flag = 0 AND model_run_batch = '${modelRunBatch}'
      `;

      const result = await this.mysqlService.query(sql);

      if (!result.success) {
        throw new Error(result.error);
      }

      const stats = result.data[0] || {};

      return {
        success: true,
        data: {
          overall: {
            total_equipment: stats.total_equipment || 0,
            avg_health_rate: parseFloat(stats.avg_health_rate || 0).toFixed(3),
            max_health_rate: parseFloat(stats.max_health_rate || 0).toFixed(3),
            min_health_rate: parseFloat(stats.min_health_rate || 0).toFixed(3)
          },
          distribution: {
            excellent: stats.excellent_count || 0,
            good: stats.good_count || 0,
            warning: stats.warning_count || 0,
            poor: stats.poor_count || 0
          }
        }
      };

    } catch (error) {
      console.error('获取设备健康度统计失败:', error);
      return {
        success: false,
        error: error.message || '获取设备健康度统计失败'
      };
    }
  }

  /**
   * 根据设备ID获取设备详情
   * @param {string} equipmentId - 设备ID
   * @param {Object} options - 查询选项
   */
  async getTrainAssemblyEquipmentDetail(equipmentId, options = {}) {
    try {
      const { modelRunBatch = 'TRAIN_ASSEMBLY_2025' } = options;

      const sql = `
        SELECT
          id,
          equipment_id,
          rate_percent,
          remark,
          create_time,
          update_time,
          model_run_batch
        FROM ${this.equipmentTableName}
        WHERE del_flag = 0
          AND equipment_id = '${equipmentId}'
          AND model_run_batch = '${modelRunBatch}'
        LIMIT 1
      `;

      const result = await this.mysqlService.query(sql);

      if (!result.success) {
        throw new Error(result.error);
      }

      if (!result.data || result.data.length === 0) {
        return {
          success: false,
          error: '设备不存在'
        };
      }

      const equipment = result.data[0];

      return {
        success: true,
        data: {
          ...equipment,
          rate_percent: parseFloat(equipment.rate_percent || 0),
          create_time: equipment.create_time,
          update_time: equipment.update_time
        }
      };

    } catch (error) {
      console.error('获取设备详情失败:', error);
      return {
        success: false,
        error: error.message || '获取设备详情失败'
      };
    }
  }

  /**
   * 搜索设备
   * @param {Object} searchParams - 搜索参数
   */
  async searchTrainAssemblyEquipment(searchParams = {}) {
    try {
      const {
        keyword = '',
        healthLevel = '',
        page = 1,
        pageSize = 10,
        modelRunBatch = 'TRAIN_ASSEMBLY_2025'
      } = searchParams;

      // 确保参数是数值类型
      const pageNum = parseInt(page) || 1;
      const pageSizeNum = parseInt(pageSize) || 10;
      const offset = (pageNum - 1) * pageSizeNum;

      let whereConditions = [
        'del_flag = 0',
        `model_run_batch = '${modelRunBatch}'`
      ];

      // 关键词搜索
      if (keyword && keyword.trim()) {
        const searchKeyword = keyword.trim();
        whereConditions.push(`(
          equipment_id LIKE '%${searchKeyword}%' OR
          remark LIKE '%${searchKeyword}%'
        )`);
      }

      // 健康度等级筛选
      if (healthLevel && ['excellent', 'good', 'warning', 'poor'].includes(healthLevel)) {
        let rateCondition = '';
        switch (healthLevel) {
          case 'excellent':
            rateCondition = 'rate_percent >= 0.90';
            break;
          case 'good':
            rateCondition = 'rate_percent >= 0.75 AND rate_percent < 0.90';
            break;
          case 'warning':
            rateCondition = 'rate_percent >= 0.60 AND rate_percent < 0.75';
            break;
          case 'poor':
            rateCondition = 'rate_percent < 0.60';
            break;
        }
        if (rateCondition) {
          whereConditions.push(rateCondition);
        }
      }

      const whereClause = whereConditions.join(' AND ');

      const sql = `
        SELECT
          id,
          equipment_id,
          rate_percent,
          remark,
          create_time,
          update_time,
          model_run_batch
        FROM ${this.equipmentTableName}
        WHERE ${whereClause}
        ORDER BY rate_percent DESC, equipment_id ASC
        LIMIT ${pageSizeNum} OFFSET ${offset}
      `;

      const result = await this.mysqlService.query(sql);

      if (!result.success) {
        throw new Error(result.error);
      }

      // 获取总数量
      const countSql = `
        SELECT COUNT(*) as total
        FROM ${this.equipmentTableName}
        WHERE ${whereClause}
      `;

      const countResult = await this.mysqlService.query(countSql);

      if (!countResult.success) {
        throw new Error(countResult.error);
      }

      const total = countResult.data[0]?.total || 0;
      const totalPages = Math.ceil(total / pageSizeNum);

      return {
        success: true,
        data: {
          equipment: result.data || [],
          pagination: {
            page: pageNum,
            pageSize: pageSizeNum,
            total: total,
            totalPages: totalPages
          },
          searchParams: {
            keyword: keyword || '',
            healthLevel: healthLevel || ''
          }
        }
      };

    } catch (error) {
      console.error('搜索设备失败:', error);
      return {
        success: false,
        error: error.message || '搜索设备失败'
      };
    }
  }

  /**
   * 获取供应商分类数据
   * @param {string} modelRunBatch - 模型运行批次
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 供应商分类数据
   */
  async getSupplierClassifications(modelRunBatch = '2025-10-12_TSY_HSR_01', options = {}) {
    try {
      console.log(`🔍 开始获取供应商分类数据, 批次: ${modelRunBatch}`);
      
      const {
        sortBy = 'supplier_id',
        sortOrder = 'asc',
        classLabel = '',
        supplierId = '',
        materialCode = ''
      } = options;

      // 构建查询条件
      let whereConditions = ['model_run_batch = ? AND del_flag = 0'];
      let queryParams = [modelRunBatch];

      if (classLabel) {
        whereConditions.push('class_label = ?');
        queryParams.push(classLabel);
      }

      if (supplierId) {
        whereConditions.push('supplier_id = ?');
        queryParams.push(parseInt(supplierId));
      }

      if (materialCode) {
        whereConditions.push('material_code LIKE ?');
        queryParams.push(`%${materialCode}%`);
      }

      const whereClause = whereConditions.join(' AND ');
      
      // 验证排序字段
      const validSortFields = ['id', 'supplier_id', 'material_code', 'class_label', 'create_time'];
      const sortField = validSortFields.includes(sortBy) ? sortBy : 'supplier_id';
      const sortDirection = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

      // 查询供应商分类数据
      const sql = `
        SELECT 
          id, model_run_batch, supplier_id, material_code, class_label, remark,
          create_time, update_time
        FROM dm_topic0303_output_supplier_class 
        WHERE ${whereClause}
        ORDER BY ${sortField} ${sortDirection}
      `;

      console.log('🔍 执行SQL查询:', sql);
      console.log('📊 查询参数:', queryParams);

      const result = await this.mysqlService.executeCustomQuery(sql, queryParams);
      
      if (!result.success) {
        throw new Error(result.error || '查询供应商分类数据失败');
      }

      const records = result.data || [];
      
      // 处理数据格式
      const processedRecords = records.map(record => ({
        id: record.id,
        modelRunBatch: record.model_run_batch,
        supplierId: record.supplier_id,
        materialCode: record.material_code,
        classLabel: record.class_label,
        remark: record.remark || '',
        createTime: record.create_time,
        updateTime: record.update_time
      }));

      // 计算分类汇总
      const classificationSummary = {};
      processedRecords.forEach(record => {
        const label = record.classLabel || '未分类';
        classificationSummary[label] = (classificationSummary[label] || 0) + 1;
      });

      console.log(`✅ 成功获取 ${processedRecords.length} 条供应商分类数据`);

      return {
        success: true,
        data: {
          total: processedRecords.length,
          records: processedRecords,
          summary: {
            classificationCounts: classificationSummary,
            modelRunBatch: modelRunBatch,
            queryOptions: options
          },
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('❌ 获取供应商分类数据失败:', error);
      return {
        success: false,
        error: error.message || '获取供应商分类数据失败'
      };
    }
  }

  // ========================================
  // 营销环节 - 客户线索管理
  // ========================================

  /**
   * 获取客户基础信息
   * @param {number} customerId - 客户ID
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 客户信息
   */
  async getCustomerBase(customerId, options = {}) {
    try {
      const { modelRunBatch = '20251013A' } = options;

      const sql = `
        SELECT 
          id,
          model_run_batch,
          customer_name,
          customer_code,
          customer_address,
          contact_name,
          biz_owner_id,
          biz_owner_name,
          customer_type,
          hist_contract_cnt,
          hist_contract_amount,
          received_amount,
          overdue_amount,
          remark,
          create_time,
          update_time
        FROM ${this.customerBaseTableName}
        WHERE id = ${parseInt(customerId)} 
          AND model_run_batch = '${modelRunBatch}' 
          AND del_flag = 0
        LIMIT 1
      `;

      const result = await this.mysqlService.query(sql);

      if (!result.success) {
        throw new Error(result.error);
      }

      if (!result.data || result.data.length === 0) {
        return {
          success: false,
          error: '客户不存在'
        };
      }

      const customer = result.data[0];

      return {
        success: true,
        data: {
          ...customer,
          hist_contract_amount: parseFloat(customer.hist_contract_amount || 0),
          received_amount: parseFloat(customer.received_amount || 0),
          overdue_amount: parseFloat(customer.overdue_amount || 0)
        }
      };

    } catch (error) {
      console.error('获取客户基础信息失败:', error);
      return {
        success: false,
        error: error.message || '获取客户基础信息失败'
      };
    }
  }

  /**
   * 获取客户的线索列表
   * @param {number} customerId - 客户ID
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 线索列表
   */
  async getCustomerLeads(customerId, options = {}) {
    try {
      const { 
        modelRunBatch = '20251013A',
        sortBy = 'create_time',
        sortOrder = 'desc',
        page = 1,
        pageSize = 10
      } = options;

      // 验证排序参数
      const validSortFields = ['lead_code', 'lead_title', 'lead_type', 'lead_status', 'create_time', 'update_time'];
      const orderField = validSortFields.includes(sortBy) ? sortBy : 'create_time';
      const orderDirection = ['asc', 'desc'].includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'DESC';

      // 确保参数是数值类型
      const pageNum = parseInt(page) || 1;
      const pageSizeNum = parseInt(pageSize) || 10;
      const offset = (pageNum - 1) * pageSizeNum;

      const sql = `
        SELECT 
          id,
          model_run_batch,
          customer_id,
          lead_code,
          lead_title,
          lead_type,
          lead_source,
          lead_status,
          lead_detail,
          remark,
          create_time,
          update_time
        FROM ${this.leadTableName}
        WHERE customer_id = ${parseInt(customerId)} 
          AND model_run_batch = '${modelRunBatch}' 
          AND del_flag = 0
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
        FROM ${this.leadTableName} 
        WHERE customer_id = ${parseInt(customerId)} 
          AND model_run_batch = '${modelRunBatch}' 
          AND del_flag = 0
      `;
      const countResult = await this.mysqlService.query(countSql);
      const total = countResult.success ? countResult.data[0].total : 0;

      return {
        success: true,
        data: {
          leads: result.data || [],
          pagination: {
            page: pageNum,
            pageSize: pageSizeNum,
            total,
            totalPages: Math.ceil(total / pageSizeNum)
          },
          customerId: parseInt(customerId)
        }
      };

    } catch (error) {
      console.error('获取客户线索列表失败:', error);
      return {
        success: false,
        error: error.message || '获取客户线索列表失败'
      };
    }
  }

  /**
   * 获取客户及其线索的完整信息
   * @param {number} customerId - 客户ID
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 客户及线索信息
   */
  async getCustomerWithLeads(customerId, options = {}) {
    try {
      // 获取客户基础信息
      const customerResult = await this.getCustomerBase(customerId, options);
      if (!customerResult.success) {
        return customerResult;
      }

      // 获取客户线索列表
      const leadsResult = await this.getCustomerLeads(customerId, options);
      if (!leadsResult.success) {
        return leadsResult;
      }

      return {
        success: true,
        data: {
          customer: customerResult.data,
          leads: leadsResult.data.leads,
          leadCount: leadsResult.data.pagination.total,
          pagination: leadsResult.data.pagination
        }
      };

    } catch (error) {
      console.error('获取客户完整信息失败:', error);
      return {
        success: false,
        error: error.message || '获取客户完整信息失败'
      };
    }
  }

  /**
   * 根据客户编号获取客户信息
   * @param {string} customerCode - 客户编号
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 客户信息
   */
  async getCustomerByCode(customerCode, options = {}) {
    try {
      const { modelRunBatch = '20251013A' } = options;

      const sql = `
        SELECT 
          id,
          model_run_batch,
          customer_name,
          customer_code,
          customer_address,
          contact_name,
          biz_owner_id,
          biz_owner_name,
          customer_type,
          hist_contract_cnt,
          hist_contract_amount,
          received_amount,
          overdue_amount,
          remark,
          create_time,
          update_time
        FROM ${this.customerBaseTableName}
        WHERE customer_code = '${customerCode}' 
          AND model_run_batch = '${modelRunBatch}' 
          AND del_flag = 0
        LIMIT 1
      `;

      const result = await this.mysqlService.query(sql);

      if (!result.success) {
        throw new Error(result.error);
      }

      if (!result.data || result.data.length === 0) {
        return {
          success: false,
          error: '客户不存在'
        };
      }

      const customer = result.data[0];

      return {
        success: true,
        data: {
          ...customer,
          hist_contract_amount: parseFloat(customer.hist_contract_amount || 0),
          received_amount: parseFloat(customer.received_amount || 0),
          overdue_amount: parseFloat(customer.overdue_amount || 0)
        }
      };

    } catch (error) {
      console.error('根据客户编号获取客户信息失败:', error);
      return {
        success: false,
        error: error.message || '根据客户编号获取客户信息失败'
      };
    }
  }

  /**
   * 获取客户列表
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 客户列表
   */
  async getCustomerList(options = {}) {
    try {
      const {
        modelRunBatch = '20251013A',
        sortBy = 'customer_code',
        sortOrder = 'asc',
        page = 1,
        pageSize = 20,
        customerType = '',
        bizOwnerName = ''
      } = options;

      // 构建查询条件
      let whereConditions = [`model_run_batch = '${modelRunBatch}'`, 'del_flag = 0'];
      
      if (customerType) {
        whereConditions.push(`customer_type = '${customerType}'`);
      }
      
      if (bizOwnerName) {
        whereConditions.push(`biz_owner_name = '${bizOwnerName}'`);
      }

      // 验证排序参数
      const validSortFields = ['customer_code', 'customer_name', 'customer_type', 'biz_owner_name', 'hist_contract_amount', 'create_time'];
      const orderField = validSortFields.includes(sortBy) ? sortBy : 'customer_code';
      const orderDirection = ['asc', 'desc'].includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'ASC';

      // 确保参数是数值类型
      const pageNum = parseInt(page) || 1;
      const pageSizeNum = parseInt(pageSize) || 20;
      const offset = (pageNum - 1) * pageSizeNum;

      const sql = `
        SELECT 
          id,
          model_run_batch,
          customer_name,
          customer_code,
          customer_address,
          contact_name,
          biz_owner_id,
          biz_owner_name,
          customer_type,
          hist_contract_cnt,
          hist_contract_amount,
          received_amount,
          overdue_amount,
          remark,
          create_time,
          update_time
        FROM ${this.customerBaseTableName}
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
        FROM ${this.customerBaseTableName} 
        WHERE ${whereConditions.join(' AND ')}
      `;
      const countResult = await this.mysqlService.query(countSql);
      const total = countResult.success ? countResult.data[0].total : 0;

      return {
        success: true,
        data: {
          customers: result.data.map(customer => ({
            ...customer,
            hist_contract_amount: parseFloat(customer.hist_contract_amount || 0),
            received_amount: parseFloat(customer.received_amount || 0),
            overdue_amount: parseFloat(customer.overdue_amount || 0)
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
      console.error('获取客户列表失败:', error);
      return {
        success: false,
        error: error.message || '获取客户列表失败'
      };
    }
  }

  /**
   * 获取优化指标数据
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 查询结果
   */
  async getOptimizationMetrics(options = {}) {
    try {
      console.log('📊 获取优化指标数据');
      
      const { 
        sortBy = 'customer_id',
        sortOrder = 'asc',
        limit = 1000
      } = options;

      const validSortFields = [
        'customer_id', 'customer_name', 'lead_conversion_prob', 
        'avg_task_per_lead', 'assignment_cost', 'overdue_ratio'
      ];
      const orderField = validSortFields.includes(sortBy) ? sortBy : 'customer_id';
      const orderDirection = ['asc', 'desc'].includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'ASC';

      const sql = `
        SELECT 
          customer_id,
          customer_name,
          lead_conversion_prob,
          avg_task_per_lead,
          assignment_cost,
          overdue_ratio
        FROM ${this.optimizationMetricsTableName}
        ORDER BY ${orderField} ${orderDirection}
        LIMIT ${parseInt(limit)}
      `;

      const result = await this.mysqlService.query(sql);

      if (!result.success) {
        throw new Error(result.error);
      }

      return {
        success: true,
        data: (result.data || []).map(item => ({
          ...item,
          lead_conversion_prob: parseFloat(item.lead_conversion_prob || 0),
          avg_task_per_lead: parseFloat(item.avg_task_per_lead || 0),
          assignment_cost: parseFloat(item.assignment_cost || 0),
          overdue_ratio: parseFloat(item.overdue_ratio || 0)
        }))
      };

    } catch (error) {
      console.error('获取优化指标数据失败:', error);
      return {
        success: false,
        error: error.message || '获取优化指标数据失败'
      };
    }
  }

  /**
   * 获取销售-客户匹配度数据
   * @param {Object} options - 查询选项
   * @param {string} options.groupBy - 分组方式：'owner' 或 'customer'
   * @param {string} options.ownerName - 指定销售人员名称（可选）
   * @param {number} options.customerId - 指定客户ID（可选）
   * @returns {Promise<Object>} 包含匹配度数据的结果对象
   */
  async getSalesCustomerMatch(options = {}) {
    try {
      console.log('📊 获取销售-客户匹配度数据');
      
      const { 
        groupBy = 'owner',
        ownerName = null,
        customerId = null,
        limit = 10000
      } = options;

      let sql = `
        SELECT 
          owner_name,
          customer_id,
          customer_name,
          sales_customer_match
        FROM ${this.salesCustomerMatchTableName}
        WHERE 1=1
      `;

      // 添加过滤条件
      if (ownerName) {
        sql += ` AND owner_name = '${ownerName}'`;
      }
      if (customerId) {
        sql += ` AND customer_id = ${parseInt(customerId)}`;
      }

      sql += ` ORDER BY owner_name, sales_customer_match DESC LIMIT ${parseInt(limit)}`;

      const result = await this.mysqlService.query(sql);

      if (!result.success) {
        throw new Error(result.error);
      }

      const rawData = (result.data || []).map(item => ({
        ...item,
        sales_customer_match: parseFloat(item.sales_customer_match || 0)
      }));

      // 根据groupBy参数进行数据分组和统计
      if (groupBy === 'owner') {
        // 按销售人员分组
        const groupedData = {};
        
        rawData.forEach(item => {
          if (!groupedData[item.owner_name]) {
            groupedData[item.owner_name] = {
              owner_name: item.owner_name,
              customers: [],
              statistics: {
                total_customers: 0,
                avg_match_score: 0,
                high_match_count: 0,  // 匹配度 >= 0.8
                medium_match_count: 0, // 0.6 <= 匹配度 < 0.8
                low_match_count: 0,   // 匹配度 < 0.6
                max_match_score: 0,
                min_match_score: 1
              }
            };
          }

          const match = item.sales_customer_match;
          groupedData[item.owner_name].customers.push({
            customer_id: item.customer_id,
            customer_name: item.customer_name,
            match_score: match
          });

          // 更新统计信息
          const stats = groupedData[item.owner_name].statistics;
          stats.total_customers++;
          if (match >= 0.8) stats.high_match_count++;
          else if (match >= 0.6) stats.medium_match_count++;
          else stats.low_match_count++;
          
          stats.max_match_score = Math.max(stats.max_match_score, match);
          stats.min_match_score = Math.min(stats.min_match_score, match);
        });

        // 计算平均匹配度
        Object.values(groupedData).forEach(owner => {
          const totalScore = owner.customers.reduce((sum, c) => sum + c.match_score, 0);
          owner.statistics.avg_match_score = owner.customers.length > 0 
            ? totalScore / owner.customers.length 
            : 0;
          
          // 排序客户列表（按匹配度降序）
          owner.customers.sort((a, b) => b.match_score - a.match_score);
        });

        return {
          success: true,
          data: Object.values(groupedData)
        };
      } else {
        // 返回原始数据
        return {
          success: true,
          data: rawData
        };
      }

    } catch (error) {
      console.error('获取销售-客户匹配度数据失败:', error);
      return {
        success: false,
        error: error.message || '获取销售-客户匹配度数据失败'
      };
    }
  }
}

module.exports = Topic03Service;
