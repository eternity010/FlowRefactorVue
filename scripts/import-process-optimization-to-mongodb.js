const { MongoClient } = require('mongodb');
const path = require('path');

// 导入数据
const processOptimizationFlowData = require('../src/data/processOptimizationFlowData.js');

// MongoDB 连接配置
const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'maintenance_system';
const COLLECTION_NAME = 'process_optimization_flows';

async function importProcessOptimizationToMongoDB() {
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
    
    // 处理 processOptimizationFlowData.default，因为是 ES6 模块导出
    const data = processOptimizationFlowData.default || processOptimizationFlowData;
    
    for (const [key, value] of Object.entries(data)) {
      const document = {
        id: key,
        data: value,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      documentsToInsert.push(document);
    }

    // 批量插入数据
    console.log(`正在插入 ${documentsToInsert.length} 条记录...`);
    const result = await collection.insertMany(documentsToInsert);
    console.log(`✅ 成功插入 ${result.insertedCount} 条记录`);

    // 验证数据
    const count = await collection.countDocuments();
    console.log(`📊 数据库中共有 ${count} 条记录`);

    // 显示插入的数据概览
    console.log('\n📋 插入的数据概览:');
    const docs = await collection.find({}, { projection: { id: 1, 'data.title': 1 } }).toArray();
    docs.forEach(doc => {
      console.log(`  - ${doc.id}: ${doc.data.title}`);
    });

    // 显示详细信息
    console.log('\n📊 流程优化详细信息:');
    for (const doc of docs) {
      const fullDoc = await collection.findOne({ id: doc.id });
      console.log(`\n🔸 ${doc.id}: ${doc.data.title}`);
      console.log(`   描述: ${fullDoc.data.description}`);
      console.log(`   流程步骤: 优化前 ${fullDoc.data.resourceChanges?.summary?.processSteps?.before || 'N/A'} 步 → 优化后 ${fullDoc.data.resourceChanges?.summary?.processSteps?.after || 'N/A'} 步`);
      console.log(`   新增功能: ${fullDoc.data.resourceChanges?.summary?.newFunctions || 'N/A'} 个`);
      console.log(`   甘特图任务: ${fullDoc.data.ganttData?.tasks?.length || 'N/A'} 个`);
      console.log(`   里程碑: ${fullDoc.data.ganttData?.milestones?.length || 'N/A'} 个`);
      
      // 显示简化版数据（如果存在）
      if (fullDoc.data.resourceChanges2) {
        console.log(`   简化版步骤: 优化前 ${fullDoc.data.resourceChanges2.summary.processSteps.before} 步 → 优化后 ${fullDoc.data.resourceChanges2.summary.processSteps.after} 步`);
        console.log(`   简化版任务: ${fullDoc.data.ganttData2?.tasks?.length || 'N/A'} 个`);
      }
    }

    // 创建索引以提高查询性能
    console.log('\n正在创建索引...');
    await collection.createIndex({ id: 1 }, { unique: true });
    await collection.createIndex({ 'data.title': 1 });
    await collection.createIndex({ 'data.description': 'text' }); // 全文搜索索引
    await collection.createIndex({ 'data.resourceChanges.summary.processSteps.before': 1 });
    await collection.createIndex({ 'data.resourceChanges.summary.processSteps.after': 1 });
    await collection.createIndex({ 'data.ganttData.tasks.priority': 1 });
    console.log('✅ 索引创建完成');

    console.log('\n🎉 流程优化数据导入完成！');
    
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
  importProcessOptimizationToMongoDB();
}

module.exports = { importProcessOptimizationToMongoDB }; 