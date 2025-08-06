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

  // 获取特定节点的数据
  async getNodeDataFromMermaid(type, nodeIds) {
    try {
      const collectionName = `${type}_flow_mermaid`;
      const collection = this.getCollection(collectionName);
      
      console.log(`🔍 正在从 ${collectionName} 集合获取节点数据（包含子流程详情）...`);
      console.log(`📋 目标节点ID: ${nodeIds.join(', ')}`);
      
      // 获取最新的主流程图数据
      const flowData = await collection.findOne(
        { mermaidDefinition: { $exists: true } }, 
        { sort: { importedAt: -1 } }
      );
      
      if (!flowData) {
        return {
          success: false,
          error: `未找到 ${type} 流程的主Mermaid数据`
        };
      }
      
      console.log(`✅ 找到主流程数据，ID: ${flowData._id}`);
      
      // 提取节点信息
      const nodeDataMap = {};
      const notFoundNodes = [];
      
      // 遍历每个节点ID，获取完整的节点信息
      for (const nodeId of nodeIds) {
        let nodeData = null;
        
        // 1. 首先在主流程的nodes数组中查找基本信息
        if (flowData.nodes && Array.isArray(flowData.nodes)) {
          const basicNode = flowData.nodes.find(node => 
            node.id === nodeId || 
            node.nodeId === nodeId || 
            node.key === nodeId
          );
          
          if (basicNode) {
            nodeData = {
              ...basicNode,
              source: collectionName,
              _foundPath: `nodes[${flowData.nodes.findIndex(n => n.id === nodeId || n.nodeId === nodeId || n.key === nodeId)}]`
            };
            console.log(`✅ 在主流程nodes数组中找到节点 ${nodeId}:`, {
              id: basicNode.id,
              text: basicNode.text,
              type: basicNode.type
            });
          }
        }
        
        // 2. 如果在主流程nodes数组中没找到，尝试从mermaidDefinition中解析
        if (!nodeData && flowData.mermaidDefinition) {
          const mermaidText = flowData.mermaidDefinition;
          const nodeRegex = new RegExp(`${nodeId}\\[([^\\]]+)\\]|${nodeId}\\(([^\\)]+)\\)`, 'g');
          const match = nodeRegex.exec(mermaidText);
          
          if (match) {
            const nodeLabel = match[1] || match[2];
            nodeData = {
              id: nodeId,
              label: nodeLabel,
              type: 'extracted_from_mermaid',
              source: collectionName,
              _foundPath: 'mermaidDefinition'
            };
            console.log(`✅ 从主流程mermaidDefinition中解析节点 ${nodeId}:`, nodeData);
          }
        }
        
        // 3. 查找该节点的详细子流程信息
        try {
          console.log(`🔍 查找节点 ${nodeId} 的子流程详细信息...`);
          const nodeDetailQuery = { nodeId: nodeId };
          const nodeDetail = await collection.findOne(nodeDetailQuery);
          
          if (nodeDetail) {
            console.log(`✅ 找到节点 ${nodeId} 的子流程详细信息:`, {
              description: nodeDetail.description,
              flowCount: nodeDetail.flowCount,
              hasMainFlow: !!nodeDetail.mermaidDefinition1,
              hasAltFlow: !!nodeDetail.mermaidDefinition2
            });
            
            // 合并基本信息和详细信息
            if (nodeData) {
              // 如果已有基本信息，合并详细信息
              nodeData = {
                ...nodeData,
                ...nodeDetail,
                // 保留基本信息中的关键字段，避免被覆盖
                id: nodeData.id || nodeDetail.nodeId,
                label: nodeData.text || nodeData.label || nodeDetail.description,
                type: nodeData.type || 'process_node'
              };
            } else {
              // 如果没有基本信息，使用详细信息创建
              nodeData = {
                ...nodeDetail,
                id: nodeDetail.nodeId,
                label: nodeDetail.description,
                type: 'process_node',
                source: collectionName,
                _foundPath: 'individual_node_record'
              };
            }
            
            console.log(`📋 节点 ${nodeId} 完整信息已合并，包含子流程数量: ${nodeDetail.flowCount || 0}`);
          } else {
            console.log(`⚠️ 未找到节点 ${nodeId} 的子流程详细信息`);
          }
        } catch (detailError) {
          console.error(`❌ 查找节点 ${nodeId} 详细信息时出错:`, detailError.message);
        }
        
        // 4. 如果找到了节点数据，添加到结果中
        if (nodeData) {
          nodeDataMap[nodeId] = nodeData;
          console.log(`✅ 成功获取节点 ${nodeId} 的完整信息（${nodeData.flowCount ? '包含子流程' : '仅基本信息'}）`);
        } else {
          // 5. 如果都没找到，尝试递归搜索整个主流程文档
          const foundInObject = this.findNodeInObject(flowData, nodeId);
          if (foundInObject) {
            nodeDataMap[nodeId] = foundInObject;
            console.log(`✅ 在主流程对象中找到节点 ${nodeId}，路径: ${foundInObject._foundPath}`);
          } else {
            // 最终没找到，添加到未找到列表
            notFoundNodes.push(nodeId);
            console.log(`❌ 未找到节点 ${nodeId} 的任何信息`);
          }
        }
      }
      
      const totalRequested = nodeIds.length;
      const totalFound = Object.keys(nodeDataMap).length;
      const subProcessCount = Object.values(nodeDataMap).filter(node => node.flowCount > 0).length;
      
      console.log(`📊 节点数据获取完成:`);
      console.log(`   - 请求节点数: ${totalRequested}`);
      console.log(`   - 找到节点数: ${totalFound}`);
      console.log(`   - 包含子流程详情: ${subProcessCount}`);
      
      if (notFoundNodes.length > 0) {
        console.log(`⚠️ 未找到的节点: ${notFoundNodes.join(', ')}`);
      }
      
      const result = {
        success: true,
        data: {
          nodeDataMap,
          notFoundNodes,
          totalRequested: nodeIds.length,
          totalFound: Object.keys(nodeDataMap).length,
          source: collectionName,
          timestamp: new Date().toISOString(),
          originalFlowData: {
            _id: flowData._id,
            importedAt: flowData.importedAt,
            dataStructure: this.analyzeDataStructure(flowData)
          },
          dataEnhancement: {
            includesSubProcessDetails: true,
            subProcessNodesFound: subProcessCount,
            subProcessFieldsIncluded: ['mermaidDefinition1', 'mermaidDefinition2', 'flowCount', 'currentFlowNumber', 'description'],
            enhancementTimestamp: new Date().toISOString()
          }
        }
      };
      
      return result;
      
    } catch (error) {
      console.error(`获取 ${type} 流程节点数据失败:`, error);
      return { success: false, error: error.message };
    }
  }

  // 辅助方法：在对象中递归查找节点
  findNodeInObject(obj, nodeId, path = '') {
    if (!obj || typeof obj !== 'object') return null;
    
    // 检查当前对象是否是目标节点
    if (obj.id === nodeId || obj.nodeId === nodeId || obj.key === nodeId) {
      return { ...obj, _foundPath: path };
    }
    
    // 递归搜索子对象
    for (const [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          const result = this.findNodeInObject(value[i], nodeId, `${path}.${key}[${i}]`);
          if (result) return result;
        }
      } else if (typeof value === 'object' && value !== null) {
        const result = this.findNodeInObject(value, nodeId, `${path}.${key}`);
        if (result) return result;
      }
    }
    
    return null;
  }

  // 辅助方法：分析数据结构
  analyzeDataStructure(data) {
    const structure = {
      hasNodes: !!data.nodes,
      hasMermaidDefinition: !!data.mermaidDefinition,
      hasEdges: !!data.edges,
      topLevelKeys: Object.keys(data).filter(key => !key.startsWith('_'))
    };
    
    if (data.nodes && Array.isArray(data.nodes)) {
      structure.nodesCount = data.nodes.length;
      structure.sampleNodeKeys = data.nodes.length > 0 ? Object.keys(data.nodes[0]) : [];
    }
    
    if (data.edges && Array.isArray(data.edges)) {
      structure.edgesCount = data.edges.length;
    }
    
    return structure;
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

  // ==================== 节点详情相关方法 ====================

  // 获取节点的详细信息，包括当前流程编号
  async getNodeDetail(collectionName, nodeId) {
    try {
      const collection = this.getCollection(collectionName);
      const result = await collection.findOne(
        { nodeId: nodeId },
        { 
          projection: {
            nodeId: 1,
            description: 1,
            flowCount: 1,
            currentFlowNumber: 1,
            createdAt: 1
          }
        }
      );
      
      if (!result) {
        return { success: false, error: `节点 ${nodeId} 不存在` };
      }
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error(`获取节点 ${nodeId} 详情失败:`, error);
      return { success: false, error: error.message };
    }
  }

  // 获取节点的当前实现流程（根据currentFlowNumber自动获取对应的mermaidDefinition）
  async getNodeCurrentFlow(collectionName, nodeId) {
    try {
      const collection = this.getCollection(collectionName);
      
      // 先获取节点的当前流程编号
      const nodeInfo = await collection.findOne(
        { nodeId: nodeId },
        { 
          projection: {
            currentFlowNumber: 1,
            flowCount: 1,
            description: 1
          }
        }
      );
      
      if (!nodeInfo) {
        return { success: false, error: `节点 ${nodeId} 不存在` };
      }
      
      // 根据 currentFlowNumber 构建字段名
      const mermaidField = `mermaidDefinition${nodeInfo.currentFlowNumber}`;
      
      // 获取对应的Mermaid定义
      const flowData = await collection.findOne(
        { nodeId: nodeId },
        { 
          projection: {
            [mermaidField]: 1,
            currentFlowNumber: 1,
            flowCount: 1,
            description: 1
          }
        }
      );
      
      return {
        success: true,
        data: {
          mermaidDefinition: flowData[mermaidField],
          currentFlowNumber: nodeInfo.currentFlowNumber,
          flowCount: nodeInfo.flowCount,
          description: nodeInfo.description,
          nodeId: nodeId
        }
      };
    } catch (error) {
      console.error(`获取节点 ${nodeId} 当前流程失败:`, error);
      return { success: false, error: error.message };
    }
  }

  // 获取节点指定编号的实现流程
  async getNodeImplementation(collectionName, nodeId, flowNumber) {
    try {
      const collection = this.getCollection(collectionName);
      
      // 构建动态字段名
      const mermaidField = `mermaidDefinition${flowNumber}`;
      
      // 先验证流程编号是否有效
      const nodeInfo = await collection.findOne(
        { nodeId: nodeId },
        { 
          projection: {
            flowCount: 1,
            description: 1
          }
        }
      );
      
      if (!nodeInfo) {
        return { success: false, error: `节点 ${nodeId} 不存在` };
      }
      
      if (flowNumber > nodeInfo.flowCount) {
        return { success: false, error: `无效的流程编号 ${flowNumber}，该节点只有 ${nodeInfo.flowCount} 个流程` };
      }
      
      // 获取指定流程的Mermaid定义
      const flowData = await collection.findOne(
        { nodeId: nodeId },
        { 
          projection: {
            [mermaidField]: 1,
            flowCount: 1,
            description: 1
          }
        }
      );
      
      if (!flowData[mermaidField]) {
        return { success: false, error: `流程${flowNumber}的定义不存在` };
      }
      
      return {
        success: true,
        data: {
          mermaidDefinition: flowData[mermaidField],
          flowNumber: flowNumber,
          flowCount: nodeInfo.flowCount,
          description: nodeInfo.description,
          nodeId: nodeId
        }
      };
    } catch (error) {
      console.error(`获取节点 ${nodeId} 流程${flowNumber}失败:`, error);
      return { success: false, error: error.message };
    }
  }

  // 获取节点的所有流程数据
  async getNodeAllFlows(collectionName, nodeId) {
    try {
      const collection = this.getCollection(collectionName);
      const result = await collection.findOne({ nodeId: nodeId });
      
      if (!result) {
        return { success: false, error: `节点 ${nodeId} 不存在` };
      }
      
      // 提取所有的mermaidDefinition字段
      const flows = {};
      for (let i = 1; i <= result.flowCount; i++) {
        const fieldName = `mermaidDefinition${i}`;
        if (result[fieldName]) {
          flows[`flow${i}`] = {
            flowNumber: i,
            mermaidDefinition: result[fieldName],
            isActive: i === result.currentFlowNumber
          };
        }
      }
      
      return {
        success: true,
        data: {
          nodeId: nodeId,
          description: result.description,
          flowCount: result.flowCount,
          currentFlowNumber: result.currentFlowNumber,
          flows: flows,
          createdAt: result.createdAt
        }
      };
    } catch (error) {
      console.error(`获取节点 ${nodeId} 所有流程失败:`, error);
      return { success: false, error: error.message };
    }
  }

  // 切换节点的当前流程
  async switchNodeFlow(collectionName, nodeId, currentFlowNumber) {
    try {
      const collection = this.getCollection(collectionName);
      
      // 验证流程编号是否有效
      const nodeData = await collection.findOne(
        { nodeId: nodeId },
        { projection: { flowCount: 1 } }
      );
      
      if (!nodeData) {
        return { success: false, error: `节点 ${nodeId} 不存在` };
      }
      
      if (currentFlowNumber > nodeData.flowCount) {
        return { success: false, error: `无效的流程编号 ${currentFlowNumber}，该节点只有 ${nodeData.flowCount} 个流程` };
      }
      
      // 更新数据库中的 currentFlowNumber
      const updateResult = await collection.updateOne(
        { nodeId: nodeId },
        { 
          $set: { 
            currentFlowNumber: currentFlowNumber,
            updatedAt: new Date()
          } 
        }
      );
      
      if (updateResult.modifiedCount > 0) {
        return {
          success: true,
          data: {
            nodeId: nodeId,
            currentFlowNumber: currentFlowNumber,
            message: `已切换到流程${currentFlowNumber}`
          }
        };
      } else {
        return { success: false, error: '流程切换失败，没有修改任何数据' };
      }
    } catch (error) {
      console.error(`切换节点 ${nodeId} 流程失败:`, error);
      return { success: false, error: error.message };
    }
  }

  // 获取节点的所有可用流程列表
  async getNodeFlowList(collectionName, nodeId) {
    try {
      const collection = this.getCollection(collectionName);
      const result = await collection.findOne(
        { nodeId: nodeId },
        { 
          projection: {
            flowCount: 1,
            currentFlowNumber: 1,
            description: 1
          }
        }
      );
      
      if (!result) {
        return { success: false, error: `节点 ${nodeId} 不存在` };
      }
      
      // 生成流程列表
      const flowList = [];
      for (let i = 1; i <= result.flowCount; i++) {
        flowList.push({
          flowNumber: i,
          name: `流程${i}`,
          isActive: i === result.currentFlowNumber,
          type: i === 1 ? 'main' : 'backup'
        });
      }
      
      return {
        success: true,
        data: {
          nodeId: nodeId,
          description: result.description,
          currentFlowNumber: result.currentFlowNumber,
          totalFlows: result.flowCount,
          flowList: flowList
        }
      };
    } catch (error) {
      console.error(`获取节点 ${nodeId} 流程列表失败:`, error);
      return { success: false, error: error.message };
    }
  }

  // ==================== 通用保存方法 ====================

  // 保存数据到指定集合
  async saveToCollection(collectionName, data) {
    try {
      const collection = this.getCollection(collectionName);
      
      // 如果数据有_id字段，使用upsert操作（更新或插入）
      if (data._id) {
        const result = await collection.replaceOne(
          { _id: data._id },
          data,
          { upsert: true }
        );
        
        console.log(`✅ 数据保存到 ${collectionName} 集合成功:`, {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
          upsertedCount: result.upsertedCount,
          upsertedId: result.upsertedId
        });
        
        return { 
          success: true, 
          data: {
            _id: data._id,
            operation: result.upsertedCount > 0 ? 'inserted' : 'updated',
            result: result
          }
        };
      } else {
        // 如果没有_id，使用普通插入
        const result = await collection.insertOne(data);
        
        console.log(`✅ 数据插入到 ${collectionName} 集合成功:`, {
          insertedId: result.insertedId,
          acknowledged: result.acknowledged
        });
        
        return { 
          success: true, 
          data: {
            _id: result.insertedId,
            operation: 'inserted',
            result: result
          }
        };
      }
    } catch (error) {
      console.error(`❌ 保存数据到 ${collectionName} 集合失败:`, error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = FlowDataService; 