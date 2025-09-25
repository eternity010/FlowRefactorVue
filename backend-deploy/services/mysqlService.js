const mysql = require('mysql2/promise');
const mysqlConfig = require('../config/mysql.config');

class MySQLService {
  constructor() {
    this.pool = null;
    this.config = mysqlConfig;
  }

  /**
   * 创建数据库连接池
   */
  async connect() {
    try {
      if (!this.pool) {
        this.pool = mysql.createPool(this.config);
        console.log('✅ MySQL数据库连接池已创建');
      }
      return { success: true };
    } catch (error) {
      console.error('❌ MySQL数据库连接失败:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 关闭数据库连接池
   */
  async disconnect() {
    try {
      if (this.pool) {
        await this.pool.end();
        this.pool = null;
        console.log('✅ MySQL数据库连接池已关闭');
      }
    } catch (error) {
      console.error('❌ MySQL数据库断开连接失败:', error);
    }
  }

  /**
   * 执行查询
   * @param {string} sql - SQL查询语句
   * @param {Array} params - 查询参数
   * @returns {Object} 查询结果
   */
  async query(sql, params = []) {
    try {
      await this.connect();
      const [rows, fields] = await this.pool.execute(sql, params);
      return {
        success: true,
        data: rows,
        fields: fields
      };
    } catch (error) {
      console.error('MySQL查询失败:', error);
      return {
        success: false,
        error: error.message,
        sql: sql
      };
    }
  }

  /**
   * 获取所有表信息
   * @returns {Object} 数据库表列表
   */
  async getAllTables() {
    try {
      const sql = 'SHOW TABLES';
      const result = await this.query(sql);
      
      if (result.success) {
        const tables = result.data.map(row => Object.values(row)[0]);
        return {
          success: true,
          data: tables
        };
      }
      
      return result;
    } catch (error) {
      console.error('获取表信息失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取表结构
   * @param {string} tableName - 表名
   * @returns {Object} 表结构信息
   */
  async getTableStructure(tableName) {
    try {
      const sql = 'DESCRIBE ??';
      const result = await this.query(sql, [tableName]);
      return result;
    } catch (error) {
      console.error(`获取表 ${tableName} 结构失败:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取表数据
   * @param {string} tableName - 表名
   * @param {Object} options - 查询选项
   * @returns {Object} 表数据
   */
  async getTableData(tableName, options = {}) {
    try {
      const { 
        limit = 100, 
        offset = 0, 
        where = null, 
        orderBy = null,
        columns = '*'
      } = options;

      let sql = `SELECT ${columns} FROM ??`;
      let params = [tableName];

      if (where) {
        sql += ' WHERE ' + where.condition;
        params.push(...(where.params || []));
      }

      if (orderBy) {
        sql += ' ORDER BY ' + orderBy;
      }

      sql += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const result = await this.query(sql, params);
      
      if (result.success) {
        // 获取总记录数
        const countSql = where 
          ? `SELECT COUNT(*) as total FROM ?? WHERE ${where.condition}`
          : 'SELECT COUNT(*) as total FROM ??';
        const countParams = where 
          ? [tableName, ...(where.params || [])]
          : [tableName];
        
        const countResult = await this.query(countSql, countParams);
        const total = countResult.success ? countResult.data[0].total : 0;

        return {
          success: true,
          data: {
            records: result.data,
            pagination: {
              total: total,
              limit: limit,
              offset: offset,
              hasMore: offset + limit < total
            }
          }
        };
      }

      return result;
    } catch (error) {
      console.error(`获取表 ${tableName} 数据失败:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 插入数据
   * @param {string} tableName - 表名
   * @param {Object} data - 要插入的数据
   * @returns {Object} 插入结果
   */
  async insertData(tableName, data) {
    try {
      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = new Array(values.length).fill('?').join(',');
      
      const sql = `INSERT INTO ?? (${columns.join(',')}) VALUES (${placeholders})`;
      const params = [tableName, ...values];
      
      const result = await this.query(sql, params);
      
      if (result.success) {
        return {
          success: true,
          data: {
            insertId: result.data.insertId,
            affectedRows: result.data.affectedRows
          }
        };
      }
      
      return result;
    } catch (error) {
      console.error(`插入数据到表 ${tableName} 失败:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 更新数据
   * @param {string} tableName - 表名
   * @param {Object} data - 要更新的数据
   * @param {Object} where - 更新条件
   * @returns {Object} 更新结果
   */
  async updateData(tableName, data, where) {
    try {
      const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = Object.values(data);
      
      const sql = `UPDATE ?? SET ${setClause} WHERE ${where.condition}`;
      const params = [tableName, ...values, ...(where.params || [])];
      
      const result = await this.query(sql, params);
      
      if (result.success) {
        return {
          success: true,
          data: {
            affectedRows: result.data.affectedRows,
            changedRows: result.data.changedRows
          }
        };
      }
      
      return result;
    } catch (error) {
      console.error(`更新表 ${tableName} 数据失败:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 删除数据
   * @param {string} tableName - 表名
   * @param {Object} where - 删除条件
   * @returns {Object} 删除结果
   */
  async deleteData(tableName, where) {
    try {
      const sql = `DELETE FROM ?? WHERE ${where.condition}`;
      const params = [tableName, ...(where.params || [])];
      
      const result = await this.query(sql, params);
      
      if (result.success) {
        return {
          success: true,
          data: {
            affectedRows: result.data.affectedRows
          }
        };
      }
      
      return result;
    } catch (error) {
      console.error(`删除表 ${tableName} 数据失败:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 检查数据库连接状态
   * @returns {Object} 连接状态
   */
  async checkConnection() {
    try {
      await this.connect();
      const result = await this.query('SELECT 1 as test');
      
      if (result.success) {
        // 获取数据库信息
        const dbInfo = await this.query('SELECT DATABASE() as current_db, VERSION() as version');
        const tableCount = await this.query('SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = DATABASE()');
        
        return {
          success: true,
          data: {
            connected: true,
            database: dbInfo.success ? dbInfo.data[0].current_db : this.config.database,
            version: dbInfo.success ? dbInfo.data[0].version : 'Unknown',
            tableCount: tableCount.success ? tableCount.data[0].table_count : 0,
            connectionConfig: {
              host: this.config.host,
              port: this.config.port,
              user: this.config.user,
              database: this.config.database
            }
          }
        };
      }
      
      return {
        success: false,
        data: {
          connected: false,
          database: this.config.database
        },
        error: '连接测试失败'
      };
    } catch (error) {
      return {
        success: false,
        data: {
          connected: false,
          database: this.config.database
        },
        error: error.message
      };
    }
  }

  /**
   * 执行自定义SQL查询
   * @param {string} sql - SQL语句
   * @param {Array} params - 参数
   * @returns {Object} 查询结果
   */
  async executeCustomQuery(sql, params = []) {
    try {
      const result = await this.query(sql, params);
      return result;
    } catch (error) {
      console.error('执行自定义SQL失败:', error);
      return {
        success: false,
        error: error.message,
        sql: sql
      };
    }
  }

  /**
   * 获取数据库统计信息
   * @returns {Object} 数据库统计
   */
  async getDatabaseStats() {
    try {
      const tables = await this.getAllTables();
      if (!tables.success) {
        return tables;
      }

      const stats = {
        tableCount: tables.data.length,
        tables: []
      };

      // 获取每个表的统计信息
      for (const tableName of tables.data) {
        const countResult = await this.query('SELECT COUNT(*) as count FROM ??', [tableName]);
        const sizeResult = await this.query(`
          SELECT 
            ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
          FROM information_schema.tables 
          WHERE table_schema = DATABASE() AND table_name = ?
        `, [tableName]);

        stats.tables.push({
          name: tableName,
          rowCount: countResult.success ? countResult.data[0].count : 0,
          sizeMB: sizeResult.success ? sizeResult.data[0].size_mb : 0
        });
      }

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('获取数据库统计信息失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = MySQLService;
