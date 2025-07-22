const { MongoClient } = require('mongodb');
const { processCardsData } = require('../src/data/subProcessCardsData.js');

// MongoDB 连接配置
const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'maintenance_system';
const COLLECTION_NAME = 'sub_process_data';

async function importSubProcessCardsData() {
  let client;
  
  try {
    console.log('正在连接 MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    console.log(`连接到数据库: ${DB_NAME}`);
    console.log(`目标集合: ${COLLECTION_NAME}`);
    
    // 清空现有数据
    console.log('清空现有数据...');
    await collection.deleteMany({});
    
    // 准备导入数据
    const importData = {
      processCardsData: processCardsData,
      importedAt: new Date(),
      source: 'subProcessCardsData.js',
      description: '子流程信息卡片数据 - 包含采购、生产、营销、运维四个子流程的详细数据'
    };
    
    // 插入数据
    console.log('正在导入数据...');
    const result = await collection.insertOne(importData);
    
    console.log('✅ 数据导入成功!');
    console.log(`插入的文档 ID: ${result.insertedId}`);
    
    // 验证导入结果
    const count = await collection.countDocuments();
    console.log(`集合中共有 ${count} 个文档`);
    
    // 显示导入的数据概览
    console.log('\n📊 导入的数据概览:');
    console.log(`- 采购流程: ${Object.keys(processCardsData.purchase).length} 个字段`);
    console.log(`- 生产流程: ${Object.keys(processCardsData.production).length} 个字段`);
    console.log(`- 营销流程: ${Object.keys(processCardsData.marketing).length} 个字段`);
    console.log(`- 运维流程: ${Object.keys(processCardsData.operation).length} 个字段`);
    
    console.log('\n🎯 各流程进度百分比:');
    console.log(`- 采购: ${processCardsData.purchase.progressPercent}%`);
    console.log(`- 生产: ${processCardsData.production.progressPercent}%`);
    console.log(`- 营销: ${processCardsData.marketing.progressPercent}%`);
    console.log(`- 运维: ${processCardsData.operation.progressPercent}%`);
    
  } catch (error) {
    console.error('❌ 导入失败:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB 连接已关闭');
    }
  }
}

// 运行导入
if (require.main === module) {
  importSubProcessCardsData();
}

module.exports = { importSubProcessCardsData }; 