const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB 连接配置
const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'maintenance_system';
const COLLECTION_NAME = 'purchase_flow_mermaid';

// 读取 JSON 文件
function loadPurchaseFlowMermaidData() {
  try {
    const filePath = path.join(__dirname, '../src/data/subflow/purchaseFlowMermaid.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('读取 purchaseFlowMermaid.json 文件失败:', error);
    throw error;
  }
}

async function importPurchaseFlowMermaidData() {
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
    console.log('正在读取 purchaseFlowMermaid.json 文件...');
    const mermaidData = loadPurchaseFlowMermaidData();
    
    // 清空现有数据
    console.log('清空现有数据...');
    await collection.deleteMany({});
    
    // 准备导入数据
    const importData = {
      ...mermaidData,
      importedAt: new Date(),
      source: 'purchaseFlowMermaid.json',
      description: '采购流程 Mermaid 图表数据 - 包含采购需求、供应商选择、价格审批、质量检验等流程',
      flowType: 'purchase',
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
    const labeledEdges = mermaidData.edges.filter(edge => edge.label && edge.label.trim() !== '');
    if (labeledEdges.length > 0) {
      labeledEdges.forEach((edge, index) => {
        console.log(`${index + 1}. ${edge.source} -> ${edge.target}: "${edge.label}"`);
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
    
    // 分析采购流程阶段
    console.log('\n🛒 采购流程阶段分析:');
    const processStages = [
      { stage: '需求阶段', nodes: ['p1'] },
      { stage: '选择阶段', nodes: ['p2'] },
      { stage: '审批阶段', nodes: ['p3'] },
      { stage: '合同阶段', nodes: ['p4'] },
      { stage: '接收阶段', nodes: ['p5'] },
      { stage: '检验阶段', nodes: ['p6'] },
      { stage: '完成阶段', nodes: ['p7'] },
      { stage: '异常处理', nodes: ['p8'] }
    ];
    
    processStages.forEach(stage => {
      const stageNodes = mermaidData.nodes.filter(node => stage.nodes.includes(node.id));
      console.log(`- ${stage.stage}: ${stageNodes.map(n => n.text).join(', ')}`);
    });
    
    // 分析审批和检验点
    console.log('\n✅ 审批和检验点分析:');
    const approvalNodes = mermaidData.nodes.filter(node => 
      node.text.includes('审批') || node.text.includes('检验')
    );
    if (approvalNodes.length > 0) {
      approvalNodes.forEach((node, index) => {
        console.log(`${index + 1}. ${node.id}: ${node.text}`);
      });
    }
    
    // 分析流程风险点
    console.log('\n⚠️ 流程风险点分析:');
    const riskNodes = mermaidData.nodes.filter(node => 
      node.text.includes('退回') || node.text.includes('处理')
    );
    if (riskNodes.length > 0) {
      riskNodes.forEach((node, index) => {
        console.log(`${index + 1}. ${node.id}: ${node.text}`);
      });
    }
    
    // 分析流程效率
    console.log('\n⚡ 流程效率分析:');
    const sequentialNodes = mermaidData.nodes.filter(node => 
      !node.text.includes('审批') && !node.text.includes('检验') && !node.text.includes('退回')
    );
    console.log(`- 主要操作节点: ${sequentialNodes.length} 个`);
    console.log(`- 审批节点: ${approvalNodes.length} 个`);
    console.log(`- 异常处理节点: ${riskNodes.length} 个`);
    
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
  importPurchaseFlowMermaidData();
}

module.exports = { importPurchaseFlowMermaidData }; 