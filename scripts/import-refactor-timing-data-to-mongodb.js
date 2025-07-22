const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB连接配置
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = 'maintenance_system';
const COLLECTION_NAME = 'refactor_timing_data';

// JSON数据文件路径
const JSON_FILE_PATH = path.join(__dirname, '..', 'maintenance_system.refactor_timing_data.json');

/**
 * 导入重构时机数据到MongoDB
 */
async function importRefactorTimingData() {
  let client;
  
  try {
    console.log('🔗 正在连接MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    console.log(`✅ 已连接到数据库: ${DATABASE_NAME}.${COLLECTION_NAME}`);
    
    // 读取JSON文件
    console.log('📖 正在读取JSON文件...');
    if (!fs.existsSync(JSON_FILE_PATH)) {
      throw new Error(`JSON文件不存在: ${JSON_FILE_PATH}`);
    }
    
    const jsonContent = fs.readFileSync(JSON_FILE_PATH, 'utf8');
    const refactorTimingData = JSON.parse(jsonContent);
    
    console.log(`📊 发现 ${refactorTimingData.length} 条重构时机数据记录`);
    
    // 清空集合（可选）
    console.log('🗑️  正在清空现有数据...');
    await collection.deleteMany({});
    
    // 插入数据
    console.log('💾 正在插入重构时机数据...');
    const result = await collection.insertMany(refactorTimingData);
    
    console.log(`✅ 成功插入 ${result.insertedCount} 条记录`);
    
    // 验证数据
    console.log('🔍 正在验证数据...');
    const count = await collection.countDocuments();
    console.log(`📊 集合中共有 ${count} 条记录`);
    
    // 显示数据概览
    const documents = await collection.find({}).limit(5).toArray();
    console.log('\n📋 数据概览:');
    documents.forEach((doc, index) => {
      console.log(`${index + 1}. ${doc.description} (状态: ${doc.metadata?.systemStatus || '未知'})`);
    });
    
    // 创建索引
    console.log('\n🔧 正在创建索引...');
    await collection.createIndex({ 'metadata.systemStatus': 1 });
    await collection.createIndex({ timestamp: -1 });
    await collection.createIndex({ 'metadata.priority': 1 });
    console.log('✅ 索引创建完成');
    
  } catch (error) {
    console.error('❌ 导入失败:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 数据库连接已关闭');
    }
  }
}

// 执行导入
if (require.main === module) {
  console.log('🚀 开始导入重构时机数据到MongoDB...\n');
  importRefactorTimingData()
    .then(() => {
      console.log('\n🎉 重构时机数据导入完成!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 导入过程中发生错误:', error);
      process.exit(1);
    });
}

module.exports = { importRefactorTimingData }; 