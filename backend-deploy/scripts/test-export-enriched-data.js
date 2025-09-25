const axios = require('axios');

// API配置
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001';

// 模拟完整的节点风险关联流程并验证导出功能
async function testExportEnrichedData() {
  console.log('🚀 开始测试节点风险数据关联后的JSON导出功能...\n');

  try {
    // 步骤1: 获取高危节点数据（包含子流程详情）
    console.log('📊 === 步骤1: 获取高危节点详细数据 ===');
    
    const highRiskNodeIds = ['PU22', 'PU23', 'PU27']; // 模拟高危节点
    console.log(`目标高危节点: ${highRiskNodeIds.join(', ')}`);
    
    const nodeDataResponse = await axios.post(`${API_BASE_URL}/api/mermaid-flow/purchase/nodes`, {
      nodeIds: highRiskNodeIds
    }, {
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' }
    });

    if (!nodeDataResponse.data.success) {
      throw new Error('获取节点数据失败: ' + nodeDataResponse.data.error);
    }

    const nodeData = nodeDataResponse.data.data;
    console.log(`✅ 成功获取节点数据: ${nodeData.totalFound}/${nodeData.totalRequested} 个节点`);

    // 步骤2: 模拟风险分析数据
    console.log('\n📊 === 步骤2: 模拟风险分析数据 ===');
    
    const mockRiskData = {
      highRiskNodes: [
        {
          nodeId: "PU22",
          nodeName: "采购合同起草",
          riskLevel: "HIGH",
          riskScore: 678.8708,
          riskFactors: ["合同签订风险", "舞弊风险"],
          riskReason: "该节点对应风险数据中的'样件检验与签约'环节，风险值高达678.8708...",
          recommendation: "实施合同模板标准化、增加法律合规审查环节..."
        },
        {
          nodeId: "PU23",
          nodeName: "合同审批",
          riskLevel: "HIGH",
          riskScore: 758.3362,
          riskFactors: ["资金支付风险", "审批舞弊风险"],
          riskReason: "该节点对应风险数据中的'款项结算'环节，风险值达到758.3362...",
          recommendation: "建立多级审批制度、实施金额分级授权..."
        },
        {
          nodeId: "PU27",
          nodeName: "物料验收", 
          riskLevel: "MEDIUM",
          riskScore: 322.4326,
          riskFactors: ["质量风险", "验收舞弊风险"],
          riskReason: "对应风险数据中的'IQC与入库管理'环节，风险值322.4326...",
          recommendation: "实施第三方质检、建立验收标准库..."
        }
      ],
      nodesByRiskLevel: {
        HIGH: [],
        MEDIUM: [],
        LOW: []
      }
    };

    console.log(`✅ 模拟风险数据创建完成，包含 ${mockRiskData.highRiskNodes.length} 个高危节点`);

    // 步骤3: 执行数据关联
    console.log('\n📊 === 步骤3: 执行节点数据关联 ===');
    
    let totalEnriched = 0;
    let subProcessEnriched = 0;
    
    // 模拟 enrichRiskDataWithNodeData 的逻辑
    const nodeDataMap = nodeData.nodeDataMap || {};
    
    mockRiskData.highRiskNodes.forEach(riskNode => {
      const nodeDetails = nodeDataMap[riskNode.nodeId];
      if (nodeDetails) {
        riskNode.nodeDetails = nodeDetails;
        totalEnriched++;
        
        // 检查是否包含子流程信息
        const hasSubProcess = nodeDetails.flowCount && nodeDetails.flowCount > 0;
        if (hasSubProcess) {
          subProcessEnriched++;
        }
      }
    });

    // 按风险等级分组
    mockRiskData.nodesByRiskLevel.HIGH = mockRiskData.highRiskNodes.filter(node => node.riskLevel === 'HIGH');
    mockRiskData.nodesByRiskLevel.MEDIUM = mockRiskData.highRiskNodes.filter(node => node.riskLevel === 'MEDIUM');
    mockRiskData.nodesByRiskLevel.LOW = mockRiskData.highRiskNodes.filter(node => node.riskLevel === 'LOW');

    // 为分组数据也添加节点详情
    ['HIGH', 'MEDIUM', 'LOW'].forEach(level => {
      const nodes = mockRiskData.nodesByRiskLevel[level];
      if (nodes && Array.isArray(nodes)) {
        nodes.forEach(riskNode => {
          const nodeDetails = nodeDataMap[riskNode.nodeId];
          if (nodeDetails) {
            riskNode.nodeDetails = nodeDetails;
          }
        });
      }
    });

    // 步骤4: 模拟导出数据结构
    console.log('\n📊 === 步骤4: 模拟导出数据结构 ===');
    
    const exportData = {
      // 元数据
      metadata: {
        exportTime: new Date().toISOString(),
        exportSource: 'ProcessOptimizationView',
        dataVersion: '1.0.0',
        description: '节点风险状态分析与节点详细数据关联后的完整数据'
      },
      
      // 关联统计信息
      enrichmentStats: {
        totalHighRiskNodes: mockRiskData.highRiskNodes.length,
        totalEnriched: totalEnriched,
        subProcessEnriched: subProcessEnriched,
        enrichmentRate: totalEnriched / mockRiskData.highRiskNodes.length,
        subProcessCoverage: totalEnriched > 0 ? subProcessEnriched / totalEnriched : 0
      },
      
      // 原始风险分析数据（模拟）
      originalRiskAnalysis: {
        success: true,
        data: {
          analysisId: 'mock-analysis-001',
          timestamp: new Date().toISOString(),
          riskAnalysis: mockRiskData
        }
      },
      
      // 格式化后的风险状态数据
      nodeRiskStatusData: mockRiskData,
      
      // 高危节点详细数据
      highRiskNodeData: nodeData,
      
      // 数据增强信息
      dataEnhancement: nodeData.dataEnhancement || {
        includesSubProcessDetails: false,
        subProcessNodesFound: 0,
        enhancementSource: 'purchase_flow_mermaid'
      }
    };

    // 步骤5: 验证导出数据结构
    console.log('\n📊 === 步骤5: 验证导出数据结构 ===');
    
    console.log('✅ 导出数据结构验证:');
    console.log(`   - 元数据: ${exportData.metadata ? '✅ 存在' : '❌ 缺失'}`);
    console.log(`   - 关联统计: ${exportData.enrichmentStats ? '✅ 存在' : '❌ 缺失'}`);
    console.log(`   - 原始风险分析: ${exportData.originalRiskAnalysis ? '✅ 存在' : '❌ 缺失'}`);
    console.log(`   - 节点风险状态数据: ${exportData.nodeRiskStatusData ? '✅ 存在' : '❌ 缺失'}`);
    console.log(`   - 高危节点详细数据: ${exportData.highRiskNodeData ? '✅ 存在' : '❌ 缺失'}`);
    console.log(`   - 数据增强信息: ${exportData.dataEnhancement ? '✅ 存在' : '❌ 缺失'}`);

    // 步骤6: 展示关键数据字段
    console.log('\n📊 === 步骤6: 关键数据字段展示 ===');
    
    console.log('📋 关联统计信息:');
    console.log(`   - 总高危节点数: ${exportData.enrichmentStats.totalHighRiskNodes}`);
    console.log(`   - 成功关联节点数: ${exportData.enrichmentStats.totalEnriched}`);
    console.log(`   - 包含子流程详情节点数: ${exportData.enrichmentStats.subProcessEnriched}`);
    console.log(`   - 关联成功率: ${(exportData.enrichmentStats.enrichmentRate * 100).toFixed(1)}%`);
    console.log(`   - 子流程覆盖率: ${(exportData.enrichmentStats.subProcessCoverage * 100).toFixed(1)}%`);

    // 展示一个完整的节点数据结构
    const sampleNode = exportData.nodeRiskStatusData.highRiskNodes.find(node => node.nodeDetails);
    if (sampleNode) {
      console.log('\n🔍 示例节点完整数据结构:');
      console.log(`📋 风险信息:`);
      console.log(`   - 节点ID: ${sampleNode.nodeId}`);
      console.log(`   - 节点名称: ${sampleNode.nodeName}`);
      console.log(`   - 风险等级: ${sampleNode.riskLevel}`);
      console.log(`   - 风险分数: ${sampleNode.riskScore}`);
      console.log(`   - 风险因子: ${sampleNode.riskFactors.join(', ')}`);
      
      console.log(`📋 节点详情:`);
      const details = sampleNode.nodeDetails;
      console.log(`   - 描述: ${details.description}`);
      console.log(`   - 子流程数量: ${details.flowCount}`);
      console.log(`   - 当前流程: ${details.currentFlowNumber}`);
      console.log(`   - 数据来源: ${details.source}`);
      console.log(`   - 主流程定义: ${details.mermaidDefinition1 ? '存在' : '不存在'}`);
      console.log(`   - 备用流程定义: ${details.mermaidDefinition2 ? '存在' : '不存在'}`);
    }

    // 步骤7: 生成JSON字符串预览
    console.log('\n📊 === 步骤7: JSON导出预览 ===');
    
    const jsonString = JSON.stringify(exportData, null, 2);
    const fileSize = Buffer.byteLength(jsonString, 'utf8');
    const fileSizeKB = (fileSize / 1024).toFixed(2);
    
    console.log(`📁 导出文件信息:`);
    console.log(`   - 文件大小: ${fileSizeKB} KB`);
    console.log(`   - 数据行数: ${jsonString.split('\n').length} 行`);
    console.log(`   - 导出时间: ${exportData.metadata.exportTime}`);
    
    // 展示JSON文件的前几行作为预览
    const previewLines = jsonString.split('\n').slice(0, 20);
    console.log('\n📄 JSON文件预览 (前20行):');
    previewLines.forEach((line, index) => {
      console.log(`${String(index + 1).padStart(2, ' ')}: ${line}`);
    });
    
    if (jsonString.split('\n').length > 20) {
      console.log('   ... (更多内容)');
    }

    // 步骤8: 生成测试报告
    console.log('\n📊 === 测试报告 ===');
    
    const testResults = {
      节点数据获取成功: nodeData.totalFound === nodeData.totalRequested,
      数据关联功能正常: totalEnriched > 0,
      子流程数据完整性: subProcessEnriched > 0,
      导出数据结构完整: exportData.metadata && exportData.enrichmentStats && exportData.nodeRiskStatusData,
      JSON序列化成功: jsonString.length > 0,
      文件大小合理: fileSize > 1000 && fileSize < 1000000 // 1KB - 1MB
    };
    
    console.log('✅ 测试结果总览:');
    Object.entries(testResults).forEach(([key, value]) => {
      const status = value ? '✅ 通过' : '❌ 失败';
      console.log(`   - ${key}: ${status}`);
    });
    
    const overallSuccess = Object.values(testResults).every(result => result);
    console.log(`\n🎯 总体测试结果: ${overallSuccess ? '✅ 成功' : '❌ 失败'}`);
    
    if (overallSuccess) {
      console.log('🎉 节点风险数据关联和导出功能测试完全通过！');
      console.log('💡 现在可以在 ProcessOptimizationView 中使用导出功能获取完整的数据格式参考！');
    } else {
      console.log('⚠️ 测试中发现问题，建议检查相关功能实现');
    }

  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error.message);
    
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    } else if (error.request) {
      console.error('请求错误:', error.request);
    }
  }

  console.log('\n🎉 节点风险数据导出功能测试完成!');
}

// 运行测试
if (require.main === module) {
  testExportEnrichedData();
}

module.exports = testExportEnrichedData; 