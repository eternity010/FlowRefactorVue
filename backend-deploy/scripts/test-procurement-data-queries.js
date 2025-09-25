const { MongoClient } = require('mongodb');

// MongoDB连接配置
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'maintenance_system';
const collectionName = 'procurement_data';

async function testProcurementDataQueries() {
  let client;
  
  try {
    // 连接MongoDB
    console.log('🔗 正在连接MongoDB...');
    client = new MongoClient(mongoUrl);
    await client.connect();
    
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    console.log('✅ MongoDB连接成功\n');
    
    // 1. 基本统计查询
    console.log('📊 1. 基本统计信息:');
    const totalRecords = await collection.countDocuments();
    console.log(`   - 总记录数: ${totalRecords}`);
    
    const processInstances = await collection.distinct("process_instance_id");
    console.log(`   - 流程实例数: ${processInstances.length}`);
    
    const nodeTypes = await collection.distinct("node.id");
    console.log(`   - 节点类型数: ${nodeTypes.length}`);
    console.log(`   - 节点类型: ${nodeTypes.join(', ')}`);
    
    // 2. 按项目类型统计
    console.log('\n📈 2. 按项目类型统计:');
    const projectTypeStats = await collection.aggregate([
      {
        $group: {
          _id: "$contextual_variables.project_type",
          count: { $sum: 1 },
          avgExecutionTime: { $avg: { $subtract: ["$execution_timestamps.end_utc", "$execution_timestamps.start_utc"] } }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();
    
    projectTypeStats.forEach(stat => {
      console.log(`   - ${stat._id}: ${stat.count} 条记录, 平均执行时间: ${Math.round(stat.avgExecutionTime/1000)} 秒`);
    });
    
    // 3. 按采购类别统计
    console.log('\n🛒 3. 按采购类别统计:');
    const categoryStats = await collection.aggregate([
      {
        $group: {
          _id: "$contextual_variables.procurement_category",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();
    
    categoryStats.forEach(stat => {
      console.log(`   - ${stat._id}: ${stat.count} 条记录`);
    });
    
    // 4. 风险因素分析
    console.log('\n⚠️  4. 风险因素分析:');
    const riskStats = await collection.aggregate([
      { $unwind: "$active_risk_factors" },
      {
        $group: {
          _id: "$active_risk_factors.risk_id",
          description: { $first: "$active_risk_factors.description" },
          count: { $sum: 1 },
          avgRiskValue: { $avg: "$active_risk_factors.value" },
          maxRiskValue: { $max: "$active_risk_factors.value" }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();
    
    riskStats.forEach(risk => {
      console.log(`   - ${risk.description} (${risk._id}): ${risk.count} 次, 平均风险值: ${risk.avgRiskValue.toFixed(2)}, 最高风险值: ${risk.maxRiskValue.toFixed(2)}`);
    });
    
    // 5. 流程执行时间分析
    console.log('\n⏱️  5. 流程执行时间分析:');
    const executionTimeStats = await collection.aggregate([
      {
        $addFields: {
          executionTimeSeconds: {
            $divide: [
              { $subtract: ["$execution_timestamps.end_utc", "$execution_timestamps.start_utc"] },
              1000
            ]
          }
        }
      },
      {
        $group: {
          _id: "$node.id",
          nodeName: { $first: "$node.name" },
          avgExecutionTime: { $avg: "$executionTimeSeconds" },
          minExecutionTime: { $min: "$executionTimeSeconds" },
          maxExecutionTime: { $max: "$executionTimeSeconds" },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgExecutionTime: -1 } }
    ]).toArray();
    
    console.log('   节点执行时间统计 (按平均时间降序):');
    executionTimeStats.forEach(stat => {
      console.log(`   - ${stat.nodeName} (${stat._id}): 平均 ${Math.round(stat.avgExecutionTime)}s, 范围 ${Math.round(stat.minExecutionTime)}-${Math.round(stat.maxExecutionTime)}s, ${stat.count} 次`);
    });
    
    // 6. 特定流程实例查询
    console.log('\n🔍 6. 特定流程实例查询:');
    const sampleProcessId = processInstances[0];
    const processInstanceData = await collection.find({ "process_instance_id": sampleProcessId }).toArray();
    console.log(`   流程实例 ${sampleProcessId} 包含 ${processInstanceData.length} 个节点`);
    
    processInstanceData.forEach(node => {
      const executionTime = Math.round((new Date(node.execution_timestamps.end_utc) - new Date(node.execution_timestamps.start_utc)) / 1000);
      console.log(`   - ${node.node.name} (${node.node.id}): ${executionTime}s`);
    });
    
    // 7. 高风险节点查询
    console.log('\n🚨 7. 高风险节点查询 (风险值 > 0.8):');
    const highRiskNodes = await collection.find({
      "active_risk_factors": {
        $elemMatch: { "value": { $gt: 0.8 } }
      }
    }).limit(5).toArray();
    
    highRiskNodes.forEach(node => {
      const highRisks = node.active_risk_factors.filter(risk => risk.value > 0.8);
      console.log(`   - ${node.node.name} (${node.node.id}): ${highRisks.map(r => `${r.description}(${r.value.toFixed(2)})`).join(', ')}`);
    });
    
    // 8. 预算金额分析
    console.log('\n💰 8. 预算金额分析:');
    const budgetStats = await collection.aggregate([
      {
        $match: {
          "contextual_variables.budget_amount_cny": { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          avgBudget: { $avg: "$contextual_variables.budget_amount_cny" },
          minBudget: { $min: "$contextual_variables.budget_amount_cny" },
          maxBudget: { $max: "$contextual_variables.budget_amount_cny" },
          totalBudget: { $sum: "$contextual_variables.budget_amount_cny" },
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    
    if (budgetStats.length > 0) {
      const stats = budgetStats[0];
      console.log(`   - 平均预算: ¥${Math.round(stats.avgBudget).toLocaleString()}`);
      console.log(`   - 预算范围: ¥${Math.round(stats.minBudget).toLocaleString()} - ¥${Math.round(stats.maxBudget).toLocaleString()}`);
      console.log(`   - 总预算: ¥${Math.round(stats.totalBudget).toLocaleString()}`);
      console.log(`   - 有预算记录的节点数: ${stats.count}`);
    }
    
  } catch (error) {
    console.error('❌ 查询测试失败:', error.message);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 MongoDB连接已关闭');
    }
  }
}

// 运行测试
console.log('🚀 开始测试采购数据查询...\n');
testProcurementDataQueries().then(() => {
  console.log('\n🎉 查询测试完成!');
}).catch(error => {
  console.error('\n💥 测试过程发生错误:', error);
  process.exit(1);
}); 