const { MongoClient } = require('mongodb');

// MongoDB 连接配置
const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'maintenance_system';

class FlowDataService {
  constructor() {
    this.client = null;
    this.db = null;
  }

  // 连接到MongoDB
  async connect() {
    try {
      this.client = new MongoClient(MONGODB_URI);
      await this.client.connect();
      this.db = this.client.db(DATABASE_NAME);
      console.log('✅ 流程数据服务成功连接到 MongoDB');
      return true;
    } catch (error) {
      console.error('❌ 流程数据服务连接 MongoDB 失败:', error);
      return false;
    }
  }

  // 关闭连接
  async disconnect() {
    if (this.client) {
      await this.client.close();
      console.log('🔌 流程数据服务已关闭 MongoDB 连接');
    }
  }

  // 获取集合实例
  getCollection(collectionName) {
    if (!this.db) {
      throw new Error('流程数据服务数据库未连接');
    }
    return this.db.collection(collectionName);
  }

  // ==================== 流程数据相关方法 ====================

  // 获取所有流程数据
  async getAllFlowData() {
    try {
      const collection = this.getCollection('process_flow_data');
      const result = await collection.find({}).toArray();
      return {
        success: true,
        data: result,
        count: result.length
      };
    } catch (error) {
      console.error('获取所有流程数据失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 根据流程类型获取数据
  async getFlowDataByType(flowType) {
    try {
      const collection = this.getCollection('process_flow_data');
      const result = await collection.findOne({ flowType: flowType });
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error(`获取 ${flowType} 流程数据失败:`, error);
      return { success: false, error: error.message };
    }
  }

  // 获取所有流程的基本信息
  async getFlowSummary() {
    try {
      const collection = this.getCollection('process_flow_data');
      const result = await collection.find({}, {
        projection: {
          flowType: 1,
          flowName: 1,
          description: 1,
          'chartSummary.latestValue': 1,
          'chartSummary.totalMonths': 1,
          'panelSummary.totalPanels': 1
        }
      }).toArray();
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('获取流程摘要失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 获取流程趋势分析
  async getFlowTrendAnalysis() {
    try {
      const collection = this.getCollection('process_flow_data');
      const result = await collection.aggregate([
        {
          $project: {
            flowType: 1,
            flowName: 1,
            chartSummary: 1,
            growthRate: {
              $multiply: [
                {
                  $divide: [
                    { $subtract: ["$chartSummary.latestValue", "$chartSummary.earliestValue"] },
                    "$chartSummary.earliestValue"
                  ]
                },
                100
              ]
            },
            trend: {
              $cond: {
                if: { $gt: ["$chartSummary.latestValue", "$chartSummary.earliestValue"] },
                then: "上升",
                else: {
                  $cond: {
                    if: { $lt: ["$chartSummary.latestValue", "$chartSummary.earliestValue"] },
                    then: "下降",
                    else: "平稳"
                  }
                }
              }
            }
          }
        },
        { $sort: { growthRate: -1 } }
      ]).toArray();

      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('获取趋势分析失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 获取指定流程的月度数据
  async getMonthlyDataByType(flowType) {
    try {
      const collection = this.getCollection('process_flow_data');
      const result = await collection.findOne(
        { flowType: flowType },
        { projection: { flowName: 1, chartData: 1 } }
      );
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error(`获取 ${flowType} 月度数据失败:`, error);
      return { success: false, error: error.message };
    }
  }

  // 获取指定流程的关键指标
  async getPanelDataByType(flowType) {
    try {
      const collection = this.getCollection('process_flow_data');
      const result = await collection.findOne(
        { flowType: flowType },
        { projection: { flowName: 1, panelData: 1 } }
      );
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error(`获取 ${flowType} 关键指标失败:`, error);
      return { success: false, error: error.message };
    }
  }

  // 按最新数值排序获取流程数据
  async getFlowDataByLatestValue(limit = 10) {
    try {
      const collection = this.getCollection('process_flow_data');
      const result = await collection.find({}, {
        projection: {
          flowType: 1,
          flowName: 1,
          'chartSummary.latestValue': 1
        }
      }).sort({ 'chartSummary.latestValue': -1 }).limit(limit).toArray();
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('按最新数值排序获取数据失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 搜索包含特定关键词的流程
  async searchFlowData(keyword) {
    try {
      const collection = this.getCollection('process_flow_data');
      const result = await collection.find({
        $text: { $search: keyword }
      }).toArray();
      
      return {
        success: true,
        data: result,
        keyword: keyword
      };
    } catch (error) {
      console.error(`搜索关键词 "${keyword}" 失败:`, error);
      return { success: false, error: error.message };
    }
  }

  // 获取包含特定面板指标的流程
  async getFlowsByPanelLabel(labelKeyword) {
    try {
      const collection = this.getCollection('process_flow_data');
      const result = await collection.find({
        "panelData.label": { $regex: labelKeyword, $options: "i" }
      }, {
        projection: {
          flowType: 1,
          flowName: 1,
          panelData: {
            $elemMatch: { label: { $regex: labelKeyword, $options: "i" } }
          }
        }
      }).toArray();
      
      return {
        success: true,
        data: result,
        searchLabel: labelKeyword
      };
    } catch (error) {
      console.error(`搜索面板指标 "${labelKeyword}" 失败:`, error);
      return { success: false, error: error.message };
    }
  }

  // 批量获取多个流程类型的数据
  async getMultipleFlowData(flowTypes) {
    try {
      const collection = this.getCollection('process_flow_data');
      const result = await collection.find({
        flowType: { $in: flowTypes }
      }).toArray();
      
      return {
        success: true,
        data: result,
        requestedTypes: flowTypes
      };
    } catch (error) {
      console.error('批量获取流程数据失败:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== 子流程数据相关方法 ====================

  // 获取子流程数据
  async getSubProcessData() {
    try {
      const collection = this.getCollection('sub_process_data');
      const data = await collection.findOne({}, { sort: { importedAt: -1 } });
      
      if (!data) {
        return { success: false, error: '未找到子流程数据' };
      }
      
      return {
        success: true,
        data: data.processCardsData
      };
    } catch (error) {
      console.error('获取子流程数据失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 获取指定类型的子流程数据
  async getSubProcessDataByType(type) {
    try {
      const collection = this.getCollection('sub_process_data');
      const data = await collection.findOne({}, { sort: { importedAt: -1 } });
      
      if (!data || !data.processCardsData[type]) {
        return { success: false, error: `未找到类型为 ${type} 的子流程数据` };
      }
      
      return {
        success: true,
        data: data.processCardsData[type]
      };
    } catch (error) {
      console.error(`获取类型为 ${type} 的子流程数据失败:`, error);
      return { success: false, error: error.message };
    }
  }

  // ==================== Mermaid流程图数据相关方法 ====================

  // 获取Mermaid流程图数据
  async getMermaidFlowData(type) {
    try {
      const collectionName = `${type}_flow_mermaid`;
      const collection = this.getCollection(collectionName);
      
      const data = await collection.findOne({}, { sort: { importedAt: -1 } });
      
      if (!data) {
        return { success: false, error: `未找到类型为 ${type} 的Mermaid流程图数据` };
      }
      
      return {
        success: true,
        data: {
          mermaidDefinition: data.mermaidDefinition,
          nodes: data.nodes,
          edges: data.edges
        }
      };
    } catch (error) {
      console.error(`获取类型为 ${type} 的Mermaid流程图数据失败:`, error);
      return { success: false, error: error.message };
    }
  }

  // 获取所有Mermaid流程图数据
  async getAllMermaidFlowData() {
    try {
      const mermaidTypes = ['purchase', 'production', 'marketing', 'operation'];
      const results = {};
      
      for (const type of mermaidTypes) {
        const result = await this.getMermaidFlowData(type);
        if (result.success) {
          results[type] = result.data;
        }
      }
      
      return {
        success: true,
        data: results
      };
    } catch (error) {
      console.error('获取所有Mermaid流程图数据失败:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== 总数据相关方法 ====================

  // 获取总数据
  async getTotalData() {
    try {
      const collection = this.getCollection('total_data');
      const data = await collection.find({})
        .sort({ updatedAt: -1 })
        .limit(1)
        .next();
      
      if (!data) {
        return { success: false, error: '未找到总数据' };
      }
      
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('获取总数据失败:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== 通用数据库方法 ====================

  // 获取数据库统计信息
  async getDatabaseStats() {
    try {
      const collections = [
        'process_flow_data',
        'sub_process_data',
        'total_data',
        'purchase_flow_mermaid',
        'production_flow_mermaid',
        'marketing_flow_mermaid',
        'operation_flow_mermaid'
      ];
      
      const stats = {};
      
      for (const collectionName of collections) {
        try {
          const collection = this.getCollection(collectionName);
          const count = await collection.countDocuments();
          stats[collectionName] = count;
        } catch (error) {
          stats[collectionName] = 0; // 集合不存在
        }
      }
      
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('获取数据库统计信息失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 通用查询方法
  async queryCollection(collectionName, query = {}, options = {}) {
    try {
      const collection = this.getCollection(collectionName);
      const result = await collection.find(query, options).toArray();
      
      return {
        success: true,
        data: result,
        count: result.length
      };
    } catch (error) {
      console.error(`查询集合 ${collectionName} 失败:`, error);
      return { success: false, error: error.message };
    }
  }

  // 通用聚合查询方法
  async aggregateCollection(collectionName, pipeline) {
    try {
      const collection = this.getCollection(collectionName);
      const result = await collection.aggregate(pipeline).toArray();
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error(`聚合查询集合 ${collectionName} 失败:`, error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = FlowDataService; 