const { MongoClient } = require('mongodb');
const path = require('path');

// 导入数据
const { operationImplementation } = require('../src/data/implementations/operationImpl.js');

// MongoDB 连接配置
const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'maintenance_system';
const COLLECTION_NAME = 'operation_implementations';

async function importDataToMongoDB() {
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
    
    for (const [key, value] of Object.entries(operationImplementation)) {
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

    // 创建索引以提高查询性能
    console.log('\n正在创建索引...');
    await collection.createIndex({ id: 1 }, { unique: true });
    await collection.createIndex({ 'data.title': 1 });
    await collection.createIndex({ 'data.steps': 1 });
    console.log('✅ 索引创建完成');

    console.log('\n🎉 数据导入完成！');
    
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
  importDataToMongoDB();
}

module.exports = { importDataToMongoDB }; 