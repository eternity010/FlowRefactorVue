const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB 连接配置
const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'maintenance_system';
const COLLECTION_NAME = 'marketing_flow_mermaid';

// 读取 JSON 文件
function loadMarketingFlowMermaidData() {
  try {
    const filePath = path.join(__dirname, '../src/data/subflow/marketingFlowMermaid.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('读取 marketingFlowMermaid.json 文件失败:', error);
    throw error;
  }
}

async function importMarketingFlowMermaidData() {
  let client;
  
  try {
    console.log('正在连接 MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    console.log(`连接到数据库: ${DB_NAME}`);
    console.log(`目标集合: ${COLLECTION_NAME}`);
    
    // 读取数据
    console.log('正在读取 marketingFlowMermaid.json 文件...');
    const mermaidData = loadMarketingFlowMermaidData();
    
    // 清空现有数据
    console.log('清空现有数据...');
    await collection.deleteMany({});
    
    // 准备导入数据
    const importData = {
      ...mermaidData,
      importedAt: new Date(),
      source: 'marketingFlowMermaid.json',
      description: '营销流程 Mermaid 图表数据 - 包含节点、边和流程图定义',
      flowType: 'marketing',
      version: '1.0'
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
    console.log(`- Mermaid 定义: ${mermaidData.mermaidDefinition.length} 字符`);
    console.log(`- 节点数量: ${mermaidData.nodes.length} 个`);
    console.log(`- 边数量: ${mermaidData.edges.length} 个`);
    
    console.log('\n🎯 节点类型统计:');
    const nodeTypes = {};
    mermaidData.nodes.forEach(node => {
      nodeTypes[node.type] = (nodeTypes[node.type] || 0) + 1;
    });
    Object.entries(nodeTypes).forEach(([type, count]) => {
      console.log(`- ${type}: ${count} 个`);
    });
    
    console.log('\n🔗 边类型统计:');
    const edgeTypes = {};
    mermaidData.edges.forEach(edge => {
      edgeTypes[edge.type] = (edgeTypes[edge.type] || 0) + 1;
    });
    Object.entries(edgeTypes).forEach(([type, count]) => {
      console.log(`- ${type}: ${count} 个`);
    });
    
    // 显示节点信息
    console.log('\n📋 节点详情:');
    mermaidData.nodes.forEach((node, index) => {
      console.log(`${index + 1}. ${node.id}: ${node.text} (${node.type})`);
    });
    
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
  importMarketingFlowMermaidData();
}

module.exports = { importMarketingFlowMermaidData }; 