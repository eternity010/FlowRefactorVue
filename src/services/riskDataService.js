const { MongoClient } = require('mongodb');

class RiskDataService {
  constructor() {
    this.client = null;
    this.db = null;
    this.collection = null;
    this.mongoUrl = 'mongodb://localhost:27017';
    this.dbName = 'maintenance_system';
    this.collectionName = 'risk_data';
  }

  async connect() {
    try {
      if (!this.client) {
        this.client = new MongoClient(this.mongoUrl);
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