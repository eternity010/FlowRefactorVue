const { MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');

// MongoDB连接配置
const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'maintenance_system';
const COLLECTION_NAME = 'planning_time_data';

// 导入规划时间数据到MongoDB
async function importPlanningTimeDataToMongoDB() {
  let client;
  
  try {
    console.log('🚀 开始导入规划时间数据到MongoDB...');
    
    // 1. 读取JSON数据文件
    console.log('📖 读取规划时间数据文件...');
    const jsonFilePath = path.resolve(__dirname, '../src/data/planningTimeData.json');
    
    if (!fs.existsSync(jsonFilePath)) {
      throw new Error(`JSON文件不存在: ${jsonFilePath}`);
    }
    
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    const planningTimeData = JSON.parse(jsonData);
    
    console.log('✅ 数据文件读取成功:');
    console.log(`   - 文档ID: ${planningTimeData._id}`);
    console.log(`   - 文档类型: ${planningTimeData.documentType}`);
    console.log(`   - 版本: ${planningTimeData.version}`);
    console.log(`   - 创建时间: ${planningTimeData.createdAt}`);
    
    // 2. 转换时间字符串为Date对象
    console.log('🔄 转换时间格式...');
    planningTimeData.createdAt = new Date(planningTimeData.createdAt);
    planningTimeData.updatedAt = new Date(planningTimeData.updatedAt);
    planningTimeData.metadata.lastAnalysisDate = new Date(planningTimeData.metadata.lastAnalysisDate);
    planningTimeData.metadata.nextScheduledAnalysis = new Date(planningTimeData.metadata.nextScheduledAnalysis);
    
    // 转换预测方案中的时间
    planningTimeData.predictionSchemes.forEach(scheme => {
      scheme.performance.lastUpdated = new Date(scheme.performance.lastUpdated);
    });
    
    console.log('✅ 时间格式转换完成');
    
    // 3. 连接MongoDB
    console.log('🔗 连接MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // 4. 检查是否已存在相同ID的文档
    console.log('🔍 检查现有数据...');
    const existingDocument = await collection.findOne({ _id: planningTimeData._id });
    
    if (existingDocument) {
      console.log('⚠️  发现现有文档，将替换...');
      
      // 删除现有文档
      const deleteResult = await collection.deleteOne({ _id: planningTimeData._id });
      console.log(`   删除了 ${deleteResult.deletedCount} 个现有文档`);
    }
    
    // 5. 插入新数据
    console.log('💾 插入规划时间数据...');
    const insertResult = await collection.insertOne(planningTimeData);
    
    // 6. 验证插入结果
    console.log('✅ 数据导入完成！');
    console.log(`   - 插入的文档ID: ${insertResult.insertedId}`);
    
    // 7. 查询验证
    console.log('\n🔍 验证导入数据...');
    const verifyDocument = await collection.findOne({ _id: planningTimeData._id });
    
    if (verifyDocument) {
      console.log('✅ 数据验证成功:');
      console.log(`   - 文档类型: ${verifyDocument.documentType}`);
      console.log(`   - 版本: ${verifyDocument.version}`);
      console.log(`   - 统计数据 - 流程节点: ${verifyDocument.statistics.processNodes}`);
      console.log(`   - 统计数据 - 监控速度: ${verifyDocument.statistics.monitoringRate}ms`);
      console.log(`   - 预测方案数量: ${verifyDocument.predictionSchemes.length}`);
      console.log(`   - 样本数据 - 边数量: ${verifyDocument.sampleData.edges.length}`);
      console.log(`   - 控制台步骤数量: ${verifyDocument.consoleTemplate.executionSteps.length}`);
      
      // 显示预测方案概览
      console.log('\n📊 预测方案概览:');
      verifyDocument.predictionSchemes.forEach((scheme, index) => {
        console.log(`   ${index + 1}. ${scheme.schemeName} (${scheme.schemeId})`);
        console.log(`      - 当前准确度: ${scheme.currentAccuracy}%`);
        console.log(`      - 模型类型: ${scheme.modelType}`);
        console.log(`      - 可靠性: ${scheme.performance.reliability}`);
      });
      
    } else {
      throw new Error('数据验证失败：未找到导入的文档');
    }
    
    // 8. 创建索引
    console.log('\n📊 创建索引...');
    await collection.createIndex({ documentType: 1 });
    await collection.createIndex({ createdAt: -1 });
    await collection.createIndex({ version: 1 });
    await collection.createIndex({ 'predictionSchemes.schemeId': 1 });
    await collection.createIndex({ 'sampleData.sampleId': 1 });
    console.log('   ✅ 索引创建完成');
    
    // 9. 数据统计
    console.log('\n📈 数据统计:');
    const totalDocuments = await collection.countDocuments();
    const planningDocuments = await collection.countDocuments({ documentType: 'planning_time_analysis' });
    
    console.log(`   - 集合总文档数: ${totalDocuments}`);
    console.log(`   - 规划时间分析文档数: ${planningDocuments}`);
    
    console.log('\n🎉 规划时间数据导入MongoDB成功完成！');
    console.log(`\n📋 数据概览:`);
    console.log(`   - 数据库: ${DATABASE_NAME}`);
    console.log(`   - 集合: ${COLLECTION_NAME}`);
    console.log(`   - 文档ID: ${planningTimeData._id}`);
    console.log(`   - 神经网络模型版本: v1.1.0`);
    console.log(`   - 数据创建时间: ${planningTimeData.createdAt.toLocaleString('zh-CN')}`);
    
  } catch (error) {
    console.error('❌ 导入规划时间数据失败:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 MongoDB连接已关闭');
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  importPlanningTimeDataToMongoDB()
    .then(() => {
      console.log('🚀 脚本执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 脚本执行失败:', error);
      process.exit(1);
    });
}

module.exports = {
  importPlanningTimeDataToMongoDB
}; 