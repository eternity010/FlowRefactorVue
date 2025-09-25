const { MongoClient } = require('mongodb');
const mongoConfig = require('../config/mongodb.config');

class RiskDataService {
  constructor() {
    this.client = null;
    this.db = null;
    this.collection = null;
    this.mongoUrl = mongoConfig.getConnectionString();
    this.dbName = mongoConfig.getDatabaseName();
    this.connectionOptions = mongoConfig.getConnectionOptions();
    this.collectionName = 'risk_data';
  }

  async connect() {
    try {
      if (!this.client) {
        // 验证配置
        if (!mongoConfig.validateConfig()) {
          throw new Error('MongoDB配置验证失败');
        }

        console.log('🔗 正在连接MongoDB (风险数据服务)...');
        mongoConfig.showCurrentConfig();
        
        // 使用配置文件中的选项连接
        this.client = new MongoClient(this.mongoUrl, this.connectionOptions);
        await this.client.connect();
        this.db = this.client.db(this.dbName);
        this.collection = this.db.collection(this.collectionName);
        console.log('✅ 风险数据服务已连接到MongoDB');
      }
      return { success: true };
    } catch (error) {
      console.error('❌ 风险数据服务连接失败:', error);
      return { success: false, error: error.message };
    }
  }

  async disconnect() {
    try {
      if (this.client) {
        await this.client.close();
        this.client = null;
        this.db = null;
        this.collection = null;
        console.log('✅ 风险数据服务已断开连接');
      }
    } catch (error) {
      console.error('❌ 风险数据服务断开连接失败:', error);
    }
  }

  /**
   * 获取所有风险数据
   * @returns {Object} 包含所有风险数据的结果
   */
  async getAllRiskData() {
    try {
      await this.connect();
      
      const riskData = await this.collection.find({}).toArray();
      
      if (!riskData || riskData.length === 0) {
        return {
          success: false,
          error: '未找到风险数据'
        };
      }

      return {
        success: true,
        data: riskData
      };
    } catch (error) {
      console.error('获取风险数据失败:', error);
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
      const count = await this.collection.countDocuments();
      return {
        success: true,
        data: {
          connected: true,
          collectionName: this.collectionName,
          documentCount: count
        }
      };
    } catch (error) {
      return {
        success: false,
        data: {
          connected: false,
          collectionName: this.collectionName,
          documentCount: 0
        },
        error: error.message
      };
    }
  }
}

module.exports = RiskDataService; 