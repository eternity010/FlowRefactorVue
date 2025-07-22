const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = 'maintenance_system';
const COLLECTION_NAME = 'rag_config_data';

async function importRAGConfigData() {
  let client;
  
  try {
    console.log('🔗 连接到MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    console.log('📂 读取RAG配置数据文件...');
    const filePath = path.join(__dirname, '..', 'rag_config_data.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    
    const document = jsonData.document;
    document.created_at = new Date().toISOString();
    document.updated_at = new Date().toISOString();
    document.metadata.import_date = new Date().toISOString();
    
    console.log('🗑️ 清理现有数据...');
    await collection.deleteMany({});
    
    console.log('📥 导入RAG配置数据...');
    const result = await collection.insertOne(document);
    
    console.log('✅ RAG配置数据导入成功!');
    console.log(`   - 文档ID: ${result.insertedId}`);
    console.log(`   - RAG系统数量: ${Object.keys(document.rag_systems).length}`);
    console.log(`   - 数据源总数: ${document.usage_statistics.total_data_sources}`);
    
    const stats = await collection.countDocuments();
    console.log(`📊 集合统计: ${stats} 个文档`);
    
  } catch (error) {
    console.error('❌ 导入失败:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 MongoDB连接已关闭');
    }
  }
}

if (require.main === module) {
  importRAGConfigData();
}

module.exports = { importRAGConfigData }; 