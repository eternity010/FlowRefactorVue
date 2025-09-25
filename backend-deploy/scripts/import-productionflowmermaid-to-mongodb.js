const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB 连接配置
const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'maintenance_system';
const COLLECTION_NAME = 'production_flow_mermaid';

// 读取 JSON 文件
function loadProductionFlowMermaidData() {
  try {
    const filePath = path.join(__dirname, '../src/data/subflow/productionFlowMermaid.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('读取 productionFlowMermaid.json 文件失败:', error);
    throw error;
  }
}

async function importProductionFlowMermaidData() {
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
    console.log('正在读取 productionFlowMermaid.json 文件...');
    const mermaidData = loadProductionFlowMermaidData();
    
    // 清空现有数据
    console.log('清空现有数据...');
    await collection.deleteMany({});
    
    // 准备导入数据
    const importData = {
      ...mermaidData,
      importedAt: new Date(),
      source: 'productionFlowMermaid.json',
      description: '生产流程 Mermaid 图表数据 - 包含生产计划、材料质检、生产加工、产品质检等流程',
      flowType: 'production',
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
    
    // 显示带标签的边
    console.log('\n🔗 带标签的边:');
    const labeledEdges = mermaidData.edges.filter(edge => edge.text && edge.text.trim() !== '');
    if (labeledEdges.length > 0) {
      labeledEdges.forEach((edge, index) => {
        console.log(`${index + 1}. ${edge.sourceNodeId} -> ${edge.targetNodeId}: "${edge.text}"`);
      });
    } else {
      console.log('没有带标签的边');
    }
    
    // 分析流程特点
    console.log('\n🔍 流程特点分析:');
    const decisionNodes = mermaidData.nodes.filter(node => node.type === 'diamond');
    const actionNodes = mermaidData.nodes.filter(node => node.type === 'rect');
    
    console.log(`- 决策节点: ${decisionNodes.length} 个`);
    console.log(`- 操作节点: ${actionNodes.length} 个`);
    console.log(`- 决策节点占比: ${((decisionNodes.length / mermaidData.nodes.length) * 100).toFixed(1)}%`);
    
    // 显示决策节点
    if (decisionNodes.length > 0) {
      console.log('\n❓ 决策节点列表:');
      decisionNodes.forEach((node, index) => {
        console.log(`${index + 1}. ${node.id}: ${node.text}`);
      });
    }
    
    // 分析生产流程阶段
    console.log('\n🏭 生产流程阶段分析:');
    const processStages = [
      { stage: '计划阶段', nodes: ['prod1'] },
      { stage: '准备阶段', nodes: ['prod2'] },
      { stage: '质检阶段', nodes: ['prod3', 'prod5'] },
      { stage: '生产阶段', nodes: ['prod4'] },
      { stage: '完成阶段', nodes: ['prod6'] },
      { stage: '异常处理', nodes: ['prod7', 'prod8'] }
    ];
    
    processStages.forEach(stage => {
      const stageNodes = mermaidData.nodes.filter(node => stage.nodes.includes(node.id));
      console.log(`- ${stage.stage}: ${stageNodes.map(n => n.text).join(', ')}`);
    });
    
    // 分析质量检查点
    console.log('\n🔍 质量检查点分析:');
    const qualityCheckNodes = mermaidData.nodes.filter(node => 
      node.text.includes('质检') || node.text.includes('检查')
    );
    if (qualityCheckNodes.length > 0) {
      qualityCheckNodes.forEach((node, index) => {
        console.log(`${index + 1}. ${node.id}: ${node.text}`);
      });
    }
    
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
  importProductionFlowMermaidData();
}

module.exports = { importProductionFlowMermaidData }; 