const { MongoClient } = require('mongodb');
const path = require('path');

// 导入数据
const { flowNodesData } = require('../src/data/flowNodesData.js');

// MongoDB 连接配置
const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'maintenance_system';
const COLLECTION_NAME = 'flow_nodes';

async function importFlowNodesDataToMongoDB() {
  let client;
  
  try {
    // 连接到 MongoDB
    console.log('正在连接到 MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ 成功连接到 MongoDB');

    // 选择数据库和集合
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // 清空现有数据（可选）
    console.log('正在清空现有数据...');
    await collection.deleteMany({});
    console.log('✅ 已清空现有数据');

    // 准备导入数据
    const documentsToInsert = [];
    
    // 遍历每个流程类型
    for (const [flowType, nodes] of Object.entries(flowNodesData)) {
      // 遍历每个流程类型下的节点
      for (const [nodeId, nodeData] of Object.entries(nodes)) {
        const document = {
          nodeId: nodeId,
          flowType: flowType,
          title: nodeData.title,
          description: nodeData.description,
          responsibleDept: nodeData.responsibleDept,
          cycleTime: nodeData.cycleTime,
          riskLevel: nodeData.riskLevel,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        documentsToInsert.push(document);
      }
    }

    // 批量插入数据
    console.log(`正在插入 ${documentsToInsert.length} 条记录...`);
    const result = await collection.insertMany(documentsToInsert);
    console.log(`✅ 成功插入 ${result.insertedCount} 条记录`);

    // 验证数据
    const count = await collection.countDocuments();
    console.log(`📊 数据库中共有 ${count} 条记录`);

    // 显示插入的数据概览，按流程类型分组
    console.log('\n📋 插入的数据概览:');
    
    const flowTypes = ['operation', 'purchase', 'production', 'marketing'];
    const flowTypeNames = {
      operation: '运维流程',
      purchase: '采购流程', 
      production: '生产流程',
      marketing: '营销流程'
    };

    for (const flowType of flowTypes) {
      const docs = await collection.find(
        { flowType: flowType }, 
        { projection: { nodeId: 1, title: 1, riskLevel: 1 } }
      ).toArray();
      
      console.log(`\n  ${flowTypeNames[flowType]} (${docs.length} 个节点):`);
      docs.forEach(doc => {
        console.log(`    - ${doc.nodeId}: ${doc.title} [风险等级: ${doc.riskLevel}]`);
      });
    }

    // 创建索引以提高查询性能
    console.log('\n正在创建索引...');
    await collection.createIndex({ nodeId: 1, flowType: 1 }, { unique: true });
    await collection.createIndex({ flowType: 1 });
    await collection.createIndex({ riskLevel: 1 });
    await collection.createIndex({ responsibleDept: 1 });
    await collection.createIndex({ title: "text", description: "text" });
    console.log('✅ 索引创建完成');

    // 显示统计信息
    console.log('\n📊 统计信息:');
    for (const flowType of flowTypes) {
      const count = await collection.countDocuments({ flowType: flowType });
      console.log(`  ${flowTypeNames[flowType]}: ${count} 个节点`);
    }

    // 风险等级统计
    console.log('\n⚠️ 风险等级分布:');
    const riskLevels = await collection.aggregate([
      { $group: { _id: "$riskLevel", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    riskLevels.forEach(risk => {
      console.log(`  ${risk._id}风险: ${risk.count} 个节点`);
    });

    console.log('\n🎉 流程节点数据导入完成！');
    
  } catch (error) {
    console.error('❌ 导入数据时发生错误:', error);
  } finally {
    // 关闭连接
    if (client) {
      await client.close();
      console.log('🔌 已关闭 MongoDB 连接');
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  importFlowNodesDataToMongoDB();
}

module.exports = { importFlowNodesDataToMongoDB }; 