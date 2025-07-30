const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB连接配置
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'maintenance_system';
const collectionName = 'risk_data';

async function importRiskData() {
  let client;
  
  try {
    // 连接MongoDB
    console.log('🔗 正在连接MongoDB...');
    client = new MongoClient(mongoUrl);
    await client.connect();
    
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    // 读取风险数据文件
    const dataFilePath = path.join(__dirname, '..', 'maintenance_system.risk_data.json');
    console.log('📁 正在读取风险数据文件:', dataFilePath);
    
    if (!fs.existsSync(dataFilePath)) {
      throw new Error('风险数据文件不存在: ' + dataFilePath);
    }
    
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    const riskData = JSON.parse(rawData);
    
    console.log(`📊 准备导入 ${riskData.length} 条风险数据记录`);
    
    // 清空现有数据
    console.log('🗑️  正在清空现有风险数据...');
    await collection.deleteMany({});
    
    // 插入新数据
    console.log('💾 正在插入风险数据...');
    const result = await collection.insertMany(riskData);
    
    console.log('✅ 风险数据导入成功!');
    console.log(`   - 已插入 ${result.insertedCount} 条记录`);
    console.log(`   - 数据库: ${dbName}`);
    console.log(`   - 集合: ${collectionName}`);
    
    // 验证导入结果
    const count = await collection.countDocuments();
    console.log(`📈 验证结果: 集合中共有 ${count} 条记录`);
    
    // 显示示例数据
    const sampleData = await collection.findOne();
    console.log('📋 示例数据:');
    console.log(JSON.stringify(sampleData, null, 2));
    
  } catch (error) {
    console.error('❌ 风险数据导入失败:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 MongoDB连接已关闭');
    }
  }
}

// 运行导入
console.log('🚀 开始导入风险数据到MongoDB...\n');
importRiskData().then(() => {
  console.log('\n🎉 风险数据导入完成!');
}).catch(error => {
  console.error('\n💥 导入过程发生错误:', error);
  process.exit(1);
}); 