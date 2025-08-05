const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB连接配置
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'maintenance_system';
const collectionName = 'procurement_data';

async function importProcurementData() {
  let client;
  
  try {
    // 连接MongoDB
    console.log('🔗 正在连接MongoDB...');
    client = new MongoClient(mongoUrl);
    await client.connect();
    
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    // 读取采购数据集文件
    const dataFilePath = path.join(__dirname, '..', 'procurement_dataset.json');
    console.log('📁 正在读取采购数据集文件:', dataFilePath);
    
    if (!fs.existsSync(dataFilePath)) {
      throw new Error('采购数据集文件不存在: ' + dataFilePath);
    }
    
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    const procurementData = JSON.parse(rawData);
    
    console.log(`📊 准备导入 ${procurementData.length} 条采购流程记录`);
    
    // 清空现有数据
    console.log('🗑️  正在清空现有采购数据...');
    await collection.deleteMany({});
    
    // 为每条记录添加导入时间戳
    const enrichedData = procurementData.map(record => ({
      ...record,
      import_timestamp: new Date(),
      data_source: 'procurement_dataset.json'
    }));
    
    // 插入新数据
    console.log('💾 正在插入采购数据...');
    const result = await collection.insertMany(enrichedData);
    
    console.log('✅ 采购数据导入成功!');
    console.log(`   - 已插入 ${result.insertedCount} 条记录`);
    console.log(`   - 数据库: ${dbName}`);
    console.log(`   - 集合: ${collectionName}`);
    
    // 验证导入结果
    const count = await collection.countDocuments();
    console.log(`📈 验证结果: 集合中共有 ${count} 条记录`);
    
    // 创建索引以提高查询性能
    console.log('🔍 正在创建索引...');
    await collection.createIndex({ "process_instance_id": 1 });
    await collection.createIndex({ "node.id": 1 });
    await collection.createIndex({ "execution_timestamps.start_utc": 1 });
    await collection.createIndex({ "active_risk_factors.risk_id": 1 });
    await collection.createIndex({ "contextual_variables.project_type": 1 });
    await collection.createIndex({ "contextual_variables.procurement_category": 1 });
    console.log('✅ 索引创建完成');
    
    // 显示示例数据
    const sampleData = await collection.findOne();
    console.log('📋 示例数据:');
    console.log(JSON.stringify(sampleData, null, 2));
    
    // 显示数据统计信息
    console.log('\n📊 数据统计信息:');
    
    // 统计流程实例数量
    const processInstances = await collection.distinct("process_instance_id");
    console.log(`   - 流程实例数量: ${processInstances.length}`);
    
    // 统计节点类型
    const nodeTypes = await collection.distinct("node.id");
    console.log(`   - 节点类型数量: ${nodeTypes.length}`);
    console.log(`   - 节点类型: ${nodeTypes.join(', ')}`);
    
    // 统计项目类型
    const projectTypes = await collection.distinct("contextual_variables.project_type");
    console.log(`   - 项目类型: ${projectTypes.join(', ')}`);
    
    // 统计采购类别
    const procurementCategories = await collection.distinct("contextual_variables.procurement_category");
    console.log(`   - 采购类别: ${procurementCategories.join(', ')}`);
    
    // 统计风险因素
    const riskFactors = await collection.distinct("active_risk_factors.risk_id");
    console.log(`   - 风险因素类型: ${riskFactors.length} 种`);
    
  } catch (error) {
    console.error('❌ 采购数据导入失败:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 MongoDB连接已关闭');
    }
  }
}

// 运行导入
console.log('🚀 开始导入采购数据到MongoDB...\n');
importProcurementData().then(() => {
  console.log('\n🎉 采购数据导入完成!');
}).catch(error => {
  console.error('\n💥 导入过程发生错误:', error);
  process.exit(1);
}); 