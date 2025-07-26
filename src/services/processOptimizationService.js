const { MongoClient } = require('mongodb');

class ProcessOptimizationService {
  constructor() {
    this.uri = 'mongodb://localhost:27017';
    this.dbName = 'maintenance_system';
    this.collectionName = 'process_optimization_flow_data';
    this.client = null;
  }

  async connect() {
    if (!this.client) {
      this.client = new MongoClient(this.uri);
      await this.client.connect();
    }
    return this.client.db(this.dbName);
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
  }

  // 获取所有流程优化案例
  async getAllOptimizations() {
    try {
      const db = await this.connect();
      const collection = db.collection(this.collectionName);
      
      const optimizations = await collection.find({}).toArray();
      
      // 转换数据格式为前端期望的结构
      const result = {};
      optimizations.forEach(opt => {
        result[opt.id] = {
          title: opt.title,
          description: opt.description,
          before: opt.flowcharts?.before || '',
          after: opt.flowcharts?.after || '',
          after2: opt.flowcharts?.after2 || '',
          llm: opt.flowcharts?.llm || '',
          resourceChanges: opt.resourceChanges,
          resourceChanges2: opt.resourceChanges2,
          ganttData: opt.ganttData,
          ganttData2: opt.ganttData2
        };
      });

      console.log(`✅ 获取到 ${optimizations.length} 个流程优化案例`);
      return { success: true, data: result };

    } catch (error) {
      console.error('❌ 获取流程优化数据失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 根据ID获取特定的优化案例
  async getOptimizationById(optimizationId) {
    try {
      const db = await this.connect();
      const collection = db.collection(this.collectionName);
      
      const optimization = await collection.findOne({ id: optimizationId });
      
      if (!optimization) {
        return { success: false, error: '优化案例不存在' };
      }

      const result = {
        title: optimization.title,
        description: optimization.description,
        before: optimization.flowcharts?.before || '',
        after: optimization.flowcharts?.after || '',
        after2: optimization.flowcharts?.after2 || '',
        llm: optimization.flowcharts?.llm || '',
        resourceChanges: optimization.resourceChanges,
        resourceChanges2: optimization.resourceChanges2,
        ganttData: optimization.ganttData,
        ganttData2: optimization.ganttData2
      };

      console.log(`✅ 获取优化案例成功: ${optimizationId}`);
      return { success: true, data: result };

    } catch (error) {
      console.error(`❌ 获取优化案例失败 (${optimizationId}):`, error);
      return { success: false, error: error.message };
    }
  }

  // 获取优化案例的流程图数据
  async getOptimizationFlowcharts(optimizationId) {
    try {
      const db = await this.connect();
      const collection = db.collection(this.collectionName);
      
      const optimization = await collection.findOne(
        { id: optimizationId },
        { projection: { flowcharts: 1, title: 1 } }
      );
      
      if (!optimization) {
        return { success: false, error: '优化案例不存在' };
      }

      const result = {
        title: optimization.title,
        flowcharts: optimization.flowcharts || {}
      };

      console.log(`✅ 获取流程图数据成功: ${optimizationId}`);
      return { success: true, data: result };

    } catch (error) {
      console.error(`❌ 获取流程图数据失败 (${optimizationId}):`, error);
      return { success: false, error: error.message };
    }
  }

  // 获取优化案例的资源变化分析
  async getOptimizationResources(optimizationId) {
    try {
      const db = await this.connect();
      const collection = db.collection(this.collectionName);
      
      const optimization = await collection.findOne(
        { id: optimizationId },
        { projection: { resourceChanges: 1, resourceChanges2: 1, title: 1 } }
      );
      
      if (!optimization) {
        return { success: false, error: '优化案例不存在' };
      }

      const result = {
        title: optimization.title,
        resourceChanges: optimization.resourceChanges,
        resourceChanges2: optimization.resourceChanges2
      };

      console.log(`✅ 获取资源变化分析成功: ${optimizationId}`);
      return { success: true, data: result };

    } catch (error) {
      console.error(`❌ 获取资源变化分析失败 (${optimizationId}):`, error);
      return { success: false, error: error.message };
    }
  }

  // 获取优化案例的甘特图数据
  async getOptimizationGantt(optimizationId) {
    try {
      const db = await this.connect();
      const collection = db.collection(this.collectionName);
      
      const optimization = await collection.findOne(
        { id: optimizationId },
        { projection: { ganttData: 1, ganttData2: 1, title: 1 } }
      );
      
      if (!optimization) {
        return { success: false, error: '优化案例不存在' };
      }

      const result = {
        title: optimization.title,
        ganttData: optimization.ganttData,
        ganttData2: optimization.ganttData2
      };

      console.log(`✅ 获取甘特图数据成功: ${optimizationId}`);
      return { success: true, data: result };

    } catch (error) {
      console.error(`❌ 获取甘特图数据失败 (${optimizationId}):`, error);
      return { success: false, error: error.message };
    }
  }

  // 搜索优化案例
  async searchOptimizations(keyword) {
    try {
      const db = await this.connect();
      const collection = db.collection(this.collectionName);
      
      const searchQuery = {
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } }
        ]
      };
      
      const optimizations = await collection.find(searchQuery).toArray();
      
      const result = {};
      optimizations.forEach(opt => {
        result[opt.id] = {
          title: opt.title,
          description: opt.description,
          before: opt.flowcharts?.before || '',
          after: opt.flowcharts?.after || '',
          after2: opt.flowcharts?.after2 || '',
          llm: opt.flowcharts?.llm || '',
          resourceChanges: opt.resourceChanges,
          resourceChanges2: opt.resourceChanges2,
          ganttData: opt.ganttData,
          ganttData2: opt.ganttData2
        };
      });

      console.log(`✅ 搜索到 ${optimizations.length} 个相关优化案例`);
      return { success: true, data: result };

    } catch (error) {
      console.error('❌ 搜索优化案例失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 获取数据库统计信息
  async getOptimizationStats() {
    try {
      const db = await this.connect();
      const collection = db.collection(this.collectionName);
      
      const totalCount = await collection.countDocuments();
      const optimizations = await collection.find({}).toArray();
      
      let withResourceAnalysis = 0;
      let withGanttData = 0;
      let withLLMFlowchart = 0;
      
      optimizations.forEach(opt => {
        if (opt.resourceChanges) withResourceAnalysis++;
        if (opt.ganttData) withGanttData++;
        if (opt.flowcharts && opt.flowcharts.llm) withLLMFlowchart++;
      });

      const stats = {
        totalOptimizations: totalCount,
        withResourceAnalysis,
        withGanttData,
        withLLMFlowchart,
        lastUpdated: new Date().toISOString()
      };

      console.log('✅ 获取优化数据统计成功:', stats);
      return { success: true, data: stats };

    } catch (error) {
      console.error('❌ 获取优化数据统计失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 检查数据库连接状态
  async checkConnection() {
    try {
      const db = await this.connect();
      const collection = db.collection(this.collectionName);
      
      // 尝试获取集合状态
      const stats = await collection.stats();
      
      return { 
        success: true, 
        data: { 
          connected: true,
          database: this.dbName,
          collection: this.collectionName,
          documentCount: stats.count,
          avgObjSize: stats.avgObjSize,
          storageSize: stats.storageSize
        } 
      };

    } catch (error) {
      console.error('❌ 数据库连接检查失败:', error);
      return { 
        success: false, 
        data: { connected: false },
        error: error.message 
      };
    }
  }
}

module.exports = ProcessOptimizationService; 