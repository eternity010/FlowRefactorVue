const { MongoClient } = require('mongodb');

// MongoDB 连接配置
const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'maintenance_system';
const COLLECTION_NAME = 'process_flow_data';

class ProcessFlowDataService {
  constructor() {
    this.client = null;
    this.db = null;
    this.collection = null;
  }

  // 连接到MongoDB
  async connect() {
    try {
      this.client = new MongoClient(MONGODB_URI);
      await this.client.connect();
      this.db = this.client.db(DATABASE_NAME);
      this.collection = this.db.collection(COLLECTION_NAME);
      console.log('✅ 成功连接到 MongoDB');
      return true;
    } catch (error) {
      console.error('❌ 连接 MongoDB 失败:', error);
      return false;
    }
  }

  // 关闭连接
  async disconnect() {
    if (this.client) {
      await this.client.close();
      console.log('🔌 已关闭 MongoDB 连接');
    }
  }

  // 获取所有流程数据
  async getAllFlowData() {
    try {
      const result = await this.collection.find({}).toArray();
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
      const result = await this.collection.findOne({ flowType: flowType });
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
      const result = await this.collection.find({}, {
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
      const result = await this.collection.aggregate([
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
      const result = await this.collection.findOne(
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
      const result = await this.collection.findOne(
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
      const result = await this.collection.find({}, {
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
      const result = await this.collection.find({
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
      const result = await this.collection.find({
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

  // 获取数据库统计信息
  async getDatabaseStats() {
    try {
      const totalCount = await this.collection.countDocuments();
      const flowTypes = await this.collection.distinct('flowType');
      
      const stats = {
        totalRecords: totalCount,
        flowTypes: flowTypes,
        flowTypeCount: flowTypes.length
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('获取数据库统计信息失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 批量获取多个流程类型的数据
  async getMultipleFlowData(flowTypes) {
    try {
      const result = await this.collection.find({
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
}

module.exports = ProcessFlowDataService; 