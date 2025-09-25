const { MongoClient } = require('mongodb');
const path = require('path');

// 导入流程优化数据
const processOptimizationFlowDataPath = path.join(__dirname, '../src/data/processOptimizationFlowData.js');
const processOptimizationFlowData = require(processOptimizationFlowDataPath).default;

// MongoDB连接配置
const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'maintenance_system';
const COLLECTION_NAME = 'process_optimization_flow_data';

async function importProcessOptimizationData() {
  let client;
  
  try {
    console.log('🔗 连接到MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    console.log('🗑️ 清空现有流程优化数据...');
    await collection.deleteMany({});
    
    // 转换数据格式 - 将每个优化案例作为单独的文档存储
    const documents = [];
    
    Object.keys(processOptimizationFlowData).forEach(optimizationId => {
      const optimizationData = processOptimizationFlowData[optimizationId];
      
      const document = {
        _id: optimizationId,
        id: optimizationId,
        title: optimizationData.title,
        description: optimizationData.description,
        flowcharts: {
          before: optimizationData.before,
          after: optimizationData.after,
          after2: optimizationData.after2,
          llm: optimizationData.llm
        },
        resourceChanges: optimizationData.resourceChanges || null,
        resourceChanges2: optimizationData.resourceChanges2 || null,
        ganttData: optimizationData.ganttData || null,
        ganttData2: optimizationData.ganttData2 || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'processOptimizationFlowData.js',
        version: '1.0'
      };
      
      documents.push(document);
    });
    
    console.log(`📦 准备导入 ${documents.length} 个流程优化案例...`);
    
    // 批量插入文档
    if (documents.length > 0) {
      const result = await collection.insertMany(documents);
      console.log(`✅ 成功导入 ${result.insertedCount} 个流程优化案例`);
      
      // 显示导入的案例详情
      documents.forEach((doc, index) => {
        console.log(`   ${index + 1}. ${doc.id}: ${doc.title}`);
      });
    }
    
    // 创建索引
    console.log('🔍 创建索引...');
    await collection.createIndex({ id: 1 }, { unique: true });
    await collection.createIndex({ title: 1 });
    await collection.createIndex({ createdAt: 1 });
    console.log('✅ 索引创建完成');
    
    // 验证数据
    console.log('🔎 验证导入的数据...');
    const count = await collection.countDocuments();
    console.log(`📊 数据库中共有 ${count} 个流程优化案例`);
    
    // 显示部分数据示例
    const sampleDoc = await collection.findOne({ id: 'Optimization1' });
    if (sampleDoc) {
      console.log('📄 数据示例 (Optimization1):');
      console.log(`   - 标题: ${sampleDoc.title}`);
      console.log(`   - 描述: ${sampleDoc.description.substring(0, 50)}...`);
      console.log(`   - 流程图数量: ${Object.keys(sampleDoc.flowcharts).length}`);
      console.log(`   - 是否包含资源分析: ${sampleDoc.resourceChanges ? '是' : '否'}`);
      console.log(`   - 是否包含甘特图: ${sampleDoc.ganttData ? '是' : '否'}`);
    }
    
    console.log('🎉 流程优化数据导入完成！');
    
  } catch (error) {
    console.error('❌ 导入过程中发生错误:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
      console.log('🔐 MongoDB连接已关闭');
    }
  }
}

// 数据验证和统计函数
async function verifyAndAnalyzeData() {
  let client;
  
  try {
    console.log('\n📊 开始数据验证和分析...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // 基础统计
    const totalCount = await collection.countDocuments();
    console.log(`📈 总优化案例数: ${totalCount}`);
    
    // 按类型统计
    const optimizations = await collection.find({}).toArray();
    
    let withResourceAnalysis = 0;
    let withGanttData = 0;
    let withLLMFlowchart = 0;
    
    optimizations.forEach(opt => {
      if (opt.resourceChanges) withResourceAnalysis++;
      if (opt.ganttData) withGanttData++;
      if (opt.flowcharts && opt.flowcharts.llm) withLLMFlowchart++;
    });
    
    console.log(`📋 包含资源分析的案例: ${withResourceAnalysis}/${totalCount}`);
    console.log(`📅 包含甘特图数据的案例: ${withGanttData}/${totalCount}`);
    console.log(`🤖 包含LLM流程图的案例: ${withLLMFlowchart}/${totalCount}`);
    
    // 数据完整性检查
    console.log('\n🔍 数据完整性检查:');
    for (const opt of optimizations) {
      const issues = [];
      
      if (!opt.title) issues.push('缺少标题');
      if (!opt.description) issues.push('缺少描述');
      if (!opt.flowcharts || !opt.flowcharts.before) issues.push('缺少原始流程图');
      if (!opt.flowcharts || !opt.flowcharts.after) issues.push('缺少优化后流程图');
      
      if (issues.length > 0) {
        console.log(`   ⚠️ ${opt.id}: ${issues.join(', ')}`);
      } else {
        console.log(`   ✅ ${opt.id}: 数据完整`);
      }
    }
    
    console.log('\n✅ 数据验证完成');
    
  } catch (error) {
    console.error('❌ 数据验证过程中发生错误:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  (async () => {
    try {
      await importProcessOptimizationData();
      await verifyAndAnalyzeData();
    } catch (error) {
      console.error('❌ 脚本执行失败:', error);
      process.exit(1);
    }
  })();
}

module.exports = {
  importProcessOptimizationData,
  verifyAndAnalyzeData
}; 