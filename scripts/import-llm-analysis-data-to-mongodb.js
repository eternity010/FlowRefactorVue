const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB连接配置
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = 'maintenance_system';
const COLLECTION_NAME = 'llm_analysis_data';

// JSON数据文件路径
const JSON_FILE_PATH = path.join(__dirname, '..', 'maintenance_system.llm_analysis_data.json');

/**
 * 导入大模型分析数据到MongoDB
 */
async function importLLMAnalysisData() {
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
    const llmAnalysisData = JSON.parse(jsonContent);
    
    console.log(`📊 发现 ${llmAnalysisData.length} 条大模型分析数据记录`);
    
    // 清空集合（可选）
    console.log('🗑️  正在清空现有数据...');
    await collection.deleteMany({});
    
    // 插入数据
    console.log('💾 正在插入大模型分析数据...');
    const result = await collection.insertMany(llmAnalysisData);
    
    console.log(`✅ 成功插入 ${result.insertedCount} 条记录`);
    
    // 验证数据
    console.log('🔍 正在验证数据...');
    const count = await collection.countDocuments();
    console.log(`📊 集合中共有 ${count} 条记录`);
    
    // 显示数据概览
    const documents = await collection.find({}).limit(5).toArray();
    console.log('\n📋 数据概览:');
    documents.forEach((doc, index) => {
      console.log(`${index + 1}. ${doc.description} (状态: ${doc.analysisStatus || '未知'})`);
    });
    
    // 验证关键数据结构
    const sampleDoc = documents[0];
    if (sampleDoc) {
      console.log('\n🔍 数据结构验证:');
      console.log(`   - 流程信息: ${sampleDoc.processInfo ? '✅' : '❌'}`);
      console.log(`   - 环境分析: ${sampleDoc.environmentAnalysis ? '✅' : '❌'}`);
      console.log(`   - 相似流程: ${sampleDoc.similarProcesses ? '✅' : '❌'}`);
      console.log(`   - 节点分析: ${sampleDoc.nodeAnalysis ? '✅' : '❌'}`);
      console.log(`   - 时间预测: ${sampleDoc.timePrediction ? '✅' : '❌'}`);
      console.log(`   - 智能建议: ${sampleDoc.recommendations ? '✅' : '❌'}`);
      console.log(`   - 模型输出: ${sampleDoc.modelOutputContent ? '✅' : '❌'}`);
    }
    
    // 创建索引
    console.log('\n🔧 正在创建索引...');
    await collection.createIndex({ documentType: 1 });
    await collection.createIndex({ analysisStatus: 1 });
    await collection.createIndex({ timestamp: -1 });
    await collection.createIndex({ 'metadata.priority': 1 });
    await collection.createIndex({ 'processInfo.processId': 1 });
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
  console.log('🚀 开始导入大模型分析数据到MongoDB...\n');
  importLLMAnalysisData()
    .then(() => {
      console.log('\n🎉 大模型分析数据导入完成!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 导入过程中发生错误:', error);
      process.exit(1);
    });
}

module.exports = { importLLMAnalysisData }; 