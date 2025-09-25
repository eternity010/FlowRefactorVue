const axios = require('axios');

// API配置
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001';

// 模拟完整的节点风险关联流程测试
async function testCompleteNodeRiskEnrichment() {
  console.log('🚀 开始测试完整的节点风险数据关联流程...\n');

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
    
    // 分析获取到的节点数据
    const enhancement = nodeData.dataEnhancement || {};
    console.log(`📈 数据增强信息:`);
    console.log(`   - 包含子流程详情: ${enhancement.includesSubProcessDetails ? '是' : '否'}`);
    console.log(`   - 子流程节点数: ${enhancement.subProcessNodesFound || 0}`);

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
          console.log(`✅ 节点 ${riskNode.nodeId} 已关联完整子流程数据:`);
          console.log(`   - 描述: ${nodeDetails.description}`);
          console.log(`   - 子流程数量: ${nodeDetails.flowCount}`);
          console.log(`   - 主流程: ${nodeDetails.mermaidDefinition1 ? '存在' : '不存在'}`);
          console.log(`   - 备用流程: ${nodeDetails.mermaidDefinition2 ? '存在' : '不存在'}`);
        } else {
          console.log(`✅ 节点 ${riskNode.nodeId} 已关联基本数据`);
        }
      } else {
        console.log(`⚠️ 节点 ${riskNode.nodeId} 未找到对应的详细数据`);
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

    // 步骤4: 验证关联结果
    console.log('\n📊 === 步骤4: 验证关联结果 ===');
    
    console.log(`📈 关联统计:`);
    console.log(`   - 总关联节点数: ${totalEnriched}`);
    console.log(`   - 包含子流程详情节点数: ${subProcessEnriched}`);
    console.log(`   - 关联成功率: ${((totalEnriched / mockRiskData.highRiskNodes.length) * 100).toFixed(1)}%`);
    console.log(`   - 子流程覆盖率: ${((subProcessEnriched / totalEnriched) * 100).toFixed(1)}%`);

    // 步骤5: 展示最终的关联数据结构
    console.log('\n📊 === 步骤5: 最终关联数据示例 ===');
    
    const sampleNode = mockRiskData.highRiskNodes.find(node => node.nodeDetails && node.nodeDetails.flowCount > 0);
    if (sampleNode) {
      console.log(`🔍 示例节点 ${sampleNode.nodeId} 的完整数据结构:`);
      console.log(`📋 风险信息:`);
      console.log(`   - 节点名称: ${sampleNode.nodeName}`);
      console.log(`   - 风险等级: ${sampleNode.riskLevel}`);
      console.log(`   - 风险分数: ${sampleNode.riskScore}`);
      console.log(`   - 风险因子: ${sampleNode.riskFactors.join(', ')}`);
      
      console.log(`📋 节点详情:`);
      const details = sampleNode.nodeDetails;
      console.log(`   - ID: ${details.id}`);
      console.log(`   - 描述: ${details.description}`);
      console.log(`   - 子流程数量: ${details.flowCount}`);
      console.log(`   - 当前流程: ${details.currentFlowNumber}`);
      console.log(`   - 数据来源: ${details.source}`);
      
      if (details.mermaidDefinition1) {
        const mainFlowSteps = details.mermaidDefinition1.split('\n').filter(line => line.includes('[')).length;
        console.log(`   - 主流程步骤数: ${mainFlowSteps}`);
      }
      
      if (details.mermaidDefinition2) {
        const altFlowSteps = details.mermaidDefinition2.split('\n').filter(line => line.includes('[')).length;
        console.log(`   - 备用流程步骤数: ${altFlowSteps}`);
      }
    }

    // 步骤6: 生成最终测试报告
    console.log('\n📊 === 测试报告 ===');
    
    const testResults = {
      节点数据获取成功: nodeData.totalFound === nodeData.totalRequested,
      数据增强功能正常: enhancement.includesSubProcessDetails === true,
      节点关联成功率: totalEnriched / mockRiskData.highRiskNodes.length,
      子流程数据完整性: subProcessEnriched > 0,
      数据结构正确性: sampleNode && sampleNode.nodeDetails && sampleNode.nodeDetails.flowCount > 0
    };
    
    console.log('✅ 测试结果总览:');
    Object.entries(testResults).forEach(([key, value]) => {
      const status = typeof value === 'boolean' ? (value ? '✅ 通过' : '❌ 失败') : 
                   typeof value === 'number' ? `📊 ${(value * 100).toFixed(1)}%` : 
                   `📋 ${value}`;
      console.log(`   - ${key}: ${status}`);
    });
    
    const overallSuccess = Object.values(testResults).every(result => 
      typeof result === 'boolean' ? result : 
      typeof result === 'number' ? result > 0.8 : true
    );
    
    console.log(`\n🎯 总体测试结果: ${overallSuccess ? '✅ 成功' : '❌ 失败'}`);
    
    if (overallSuccess) {
      console.log('🎉 节点风险数据关联功能测试完全通过！');
      console.log('💡 现在可以在 ProcessOptimizationView 中使用包含完整子流程详情的节点风险数据了！');
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

  console.log('\n🎉 节点风险数据关联测试完成!');
}

// 运行测试
if (require.main === module) {
  testCompleteNodeRiskEnrichment();
}

module.exports = testCompleteNodeRiskEnrichment;
