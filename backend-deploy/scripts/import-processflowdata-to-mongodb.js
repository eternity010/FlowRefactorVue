const { MongoClient } = require('mongodb');
const path = require('path');

// 导入数据
const { 
  purchaseData, 
  productionData, 
  marketingData, 
  maintenanceData 
} = require('../src/data/processFlowData.js');

// MongoDB 连接配置
const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'maintenance_system';
const COLLECTION_NAME = 'process_flow_data';

async function importProcessFlowDataToMongoDB() {
  let client;
  
  try {
    // 连接到 MongoDB
    console.log('正在连接到 MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ 成功连接到 MongoDB');

    // 选择数据库和集合
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // 清空现有数据（可选）
    console.log('正在清空现有数据...');
    await collection.deleteMany({});
    console.log('✅ 已清空现有数据');

    // 准备导入数据
    const documentsToInsert = [];
    
    // 数据映射
    const dataMapping = {
      purchase: {
        name: '采购环节',
        data: purchaseData,
        description: '采购流程相关的月度数据和关键指标'
      },
      production: {
        name: '生产环节',
        data: productionData,
        description: '生产流程相关的月度数据和关键指标'
      },
      marketing: {
        name: '营销环节',
        data: marketingData,
        description: '营销流程相关的月度数据和关键指标'
      },
      maintenance: {
        name: '运维环节',
        data: maintenanceData,
        description: '运维流程相关的月度数据和关键指标'
      }
    };

    // 处理每个数据模块
    for (const [flowType, info] of Object.entries(dataMapping)) {
      const document = {
        flowType: flowType,
        flowName: info.name,
        description: info.description,
        chartData: info.data.chart,
        panelData: info.data.panels,
        // 计算一些统计信息
        chartSummary: {
          totalMonths: info.data.chart.length,
          latestValue: info.data.chart[info.data.chart.length - 1].value,
          earliestValue: info.data.chart[0].value,
          averageValue: Math.round(info.data.chart.reduce((sum, item) => sum + item.value, 0) / info.data.chart.length),
          maxValue: Math.max(...info.data.chart.map(item => item.value)),
          minValue: Math.min(...info.data.chart.map(item => item.value))
        },
        panelSummary: {
          totalPanels: info.data.panels.length,
          panels: info.data.panels.map(panel => ({
            label: panel.label,
            value: panel.value,
            unit: panel.unit,
            numericValue: parseFloat(panel.value.replace(/[^\d.-]/g, '')) || 0
          }))
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      documentsToInsert.push(document);
    }

    // 批量插入数据
    console.log(`正在插入 ${documentsToInsert.length} 条记录...`);
    const result = await collection.insertMany(documentsToInsert);
    console.log(`✅ 成功插入 ${result.insertedCount} 条记录`);

    // 验证数据
    const count = await collection.countDocuments();
    console.log(`📊 数据库中共有 ${count} 条记录`);

    // 显示插入的数据概览
    console.log('\n📋 插入的数据概览:');
    
    for (const doc of documentsToInsert) {
      console.log(`\n  ${doc.flowName} (${doc.flowType}):`);
      console.log(`    描述: ${doc.description}`);
      console.log(`    月度数据: ${doc.chartSummary.totalMonths} 个月`);
      console.log(`    数据范围: ${doc.chartSummary.minValue.toLocaleString()} - ${doc.chartSummary.maxValue.toLocaleString()}`);
      console.log(`    最新数值: ${doc.chartSummary.latestValue.toLocaleString()}`);
      console.log(`    关键指标: ${doc.panelSummary.totalPanels} 个`);
      
      // 显示面板数据
      doc.panelData.forEach(panel => {
        console.log(`      - ${panel.label}: ${panel.value}${panel.unit}`);
      });
    }

    // 创建索引以提高查询性能
    console.log('\n正在创建索引...');
    await collection.createIndex({ flowType: 1 }, { unique: true });
    await collection.createIndex({ flowName: 1 });
    await collection.createIndex({ 'chartSummary.latestValue': -1 });
    await collection.createIndex({ 'panelData.label': 1 });
    await collection.createIndex({ description: "text", flowName: "text" });
    console.log('✅ 索引创建完成');

    // 显示统计信息
    console.log('\n📊 数据统计分析:');
    
    // 各流程最新数值对比
    console.log('\n  各流程最新数值:');
    const docs = await collection.find({}, { 
      projection: { 
        flowName: 1, 
        'chartSummary.latestValue': 1,
        'chartData.0.month': 1
      } 
    }).toArray();
    
    docs.forEach(doc => {
      console.log(`    ${doc.flowName}: ${doc.chartSummary.latestValue.toLocaleString()}`);
    });

    // 数据趋势分析
    console.log('\n  数据趋势分析:');
    for (const doc of documentsToInsert) {
      const growthRate = ((doc.chartSummary.latestValue - doc.chartSummary.earliestValue) / doc.chartSummary.earliestValue * 100).toFixed(1);
      const trend = growthRate > 0 ? '↗️' : growthRate < 0 ? '↘️' : '➡️';
      console.log(`    ${doc.flowName}: ${trend} ${growthRate}% (${doc.chartSummary.earliestValue.toLocaleString()} → ${doc.chartSummary.latestValue.toLocaleString()})`);
    }

    console.log('\n🎉 流程数据导入完成！');
    
  } catch (error) {
    console.error('❌ 导入数据时发生错误:', error);
  } finally {
    // 关闭连接
    if (client) {
      await client.close();
      console.log('🔌 已关闭 MongoDB 连接');
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  importProcessFlowDataToMongoDB();
}

module.exports = { importProcessFlowDataToMongoDB }; 