const { MongoClient } = require('mongodb');

// MongoDB 连接配置
const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'maintenance_system';
const COLLECTION_NAME = 'flow_nodes';

async function testFlowNodesDataQueries() {
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

    console.log('\n🧪 开始测试流程节点数据查询...\n');

    // 测试1: 基本统计
    console.log('📊 测试1 - 基本统计:');
    const totalCount = await collection.countDocuments();
    console.log(`  总节点数: ${totalCount}`);

    // 按流程类型统计
    const flowTypeStats = await collection.aggregate([
      { $group: { _id: "$flowType", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('  按流程类型统计:');
    const flowTypeNames = {
      operation: '运维流程',
      purchase: '采购流程', 
      production: '生产流程',
      marketing: '营销流程'
    };
    
    flowTypeStats.forEach(stat => {
      console.log(`    ${flowTypeNames[stat._id] || stat._id}: ${stat.count} 个节点`);
    });

    // 测试2: 按风险等级查询
    console.log('\n⚠️ 测试2 - 风险等级分析:');
    const riskStats = await collection.aggregate([
      { $group: { _id: "$riskLevel", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    riskStats.forEach(risk => {
      console.log(`  ${risk._id}风险: ${risk.count} 个节点`);
    });

    // 查询高风险节点
    const highRiskNodes = await collection.find(
      { riskLevel: "高" },
      { projection: { nodeId: 1, flowType: 1, title: 1, responsibleDept: 1 } }
    ).toArray();
    
    console.log(`\n  高风险节点详情 (${highRiskNodes.length} 个):`);
    highRiskNodes.forEach(node => {
      console.log(`    - [${node.flowType}] ${node.nodeId}: ${node.title} (${node.responsibleDept})`);
    });

    // 测试3: 按责任部门统计
    console.log('\n🏢 测试3 - 责任部门统计:');
    const deptStats = await collection.aggregate([
      { $group: { _id: "$responsibleDept", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();
    
    deptStats.forEach(dept => {
      console.log(`  ${dept._id}: ${dept.count} 个节点`);
    });

    // 测试4: 特定流程类型查询
    console.log('\n🔧 测试4 - 运维流程节点查询:');
    const operationNodes = await collection.find(
      { flowType: "operation" },
      { projection: { nodeId: 1, title: 1, cycleTime: 1, riskLevel: 1 } }
    ).sort({ nodeId: 1 }).toArray();
    
    console.log(`  运维流程共有 ${operationNodes.length} 个节点:`);
    operationNodes.forEach(node => {
      console.log(`    - ${node.nodeId}: ${node.title} (${node.cycleTime}, ${node.riskLevel}风险)`);
    });

    // 测试5: 文本搜索测试
    console.log('\n🔍 测试5 - 文本搜索测试:');
    const searchResults = await collection.find(
      { $text: { $search: "维修" } },
      { projection: { nodeId: 1, flowType: 1, title: 1, description: 1 } }
    ).toArray();
    
    console.log(`  搜索"维修"相关节点 (${searchResults.length} 个):`);
    searchResults.forEach(node => {
      console.log(`    - [${node.flowType}] ${node.nodeId}: ${node.title}`);
    });

    // 测试6: 复合查询 - 查询特定部门的中高风险节点
    console.log('\n🎯 测试6 - 复合查询 (质检部的中高风险节点):');
    const complexQuery = await collection.find(
      { 
        responsibleDept: "质检部",
        riskLevel: { $in: ["中", "高"] }
      },
      { projection: { nodeId: 1, flowType: 1, title: 1, riskLevel: 1, cycleTime: 1 } }
    ).toArray();
    
    console.log(`  质检部中高风险节点 (${complexQuery.length} 个):`);
    complexQuery.forEach(node => {
      console.log(`    - [${node.flowType}] ${node.nodeId}: ${node.title} (${node.riskLevel}风险, ${node.cycleTime})`);
    });

    // 测试7: 聚合查询 - 各流程类型的平均风险分布
    console.log('\n📈 测试7 - 各流程类型风险分布:');
    const riskDistribution = await collection.aggregate([
      { 
        $group: {
          _id: { flowType: "$flowType", riskLevel: "$riskLevel" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.flowType": 1, "_id.riskLevel": 1 } }
    ]).toArray();
    
    // 整理数据格式
    const riskMatrix = {};
    riskDistribution.forEach(item => {
      const flowType = item._id.flowType;
      const riskLevel = item._id.riskLevel;
      if (!riskMatrix[flowType]) {
        riskMatrix[flowType] = {};
      }
      riskMatrix[flowType][riskLevel] = item.count;
    });
    
    Object.entries(riskMatrix).forEach(([flowType, risks]) => {
      console.log(`  ${flowTypeNames[flowType]}:`);
      Object.entries(risks).forEach(([level, count]) => {
        console.log(`    ${level}风险: ${count} 个`);
      });
    });

    // 测试8: 查询特定节点详情
    console.log('\n🔎 测试8 - 特定节点详情查询:');
    const specificNode = await collection.findOne({ nodeId: "101" });
    if (specificNode) {
      console.log(`  节点 ${specificNode.nodeId} 详情:`);
      console.log(`    标题: ${specificNode.title}`);
      console.log(`    描述: ${specificNode.description}`);
      console.log(`    流程类型: ${flowTypeNames[specificNode.flowType]}`);
      console.log(`    责任部门: ${specificNode.responsibleDept}`);
      console.log(`    周期时间: ${specificNode.cycleTime}`);
      console.log(`    风险等级: ${specificNode.riskLevel}`);
    } else {
      console.log('  未找到节点 101');
    }

    console.log('\n✅ 所有测试查询完成！');
    
  } catch (error) {
    console.error('❌ 测试查询时发生错误:', error);
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
  testFlowNodesDataQueries();
}

module.exports = { testFlowNodesDataQueries }; 