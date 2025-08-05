/**
 * 测试流程节点风险分析API
 * 演示如何使用新的analyzeProcessNodeRisk API
 */

const { llmApi } = require('./src/api/llmApi.js');

async function testProcessNodeRiskAPI() {
  console.log('🚀 开始测试流程节点风险分析API...\n');

  try {
    // 模拟风险数据
    const mockRiskData = {
      totalRecords: 150,
      riskFactors: [
        {
          risk_id: "risk_01_quality_issues",
          description: "质量问题风险",
          avgValue: 0.75,
          affectedNodes: ["PU13", "PU15", "PU27"]
        },
        {
          risk_id: "risk_02_communication_coordination",
          description: "沟通协调问题", 
          avgValue: 0.68,
          affectedNodes: ["PU1", "PU2", "PU13"]
        },
        {
          risk_id: "risk_03_technical_complexity",
          description: "技术复杂度过高",
          avgValue: 0.72,
          affectedNodes: ["PU3", "PU6", "PU15"]
        },
        {
          risk_id: "risk_04_price_volatility",
          description: "价格波动风险",
          avgValue: 0.65,
          affectedNodes: ["PU13", "PU14", "PU21"]
        },
        {
          risk_id: "risk_05_urgent_requirement_changes",
          description: "紧急需求变更",
          avgValue: 0.69,
          affectedNodes: ["PU3", "PU15", "PU26"]
        }
      ],
      highRiskThreshold: 0.7
    };

    // 模拟整体流程结构数据
    const mockProcessStructure = {
      processName: "采购流程",
      totalNodes: 28,
      nodes: [
        { id: "PU1", name: "计划整合确定", dependencies: [], criticalPath: true },
        { id: "PU2", name: "品类管理", dependencies: ["PU1"], criticalPath: true },
        { id: "PU3", name: "技术规格拆解", dependencies: ["PU2"], criticalPath: true },
        { id: "PU6", name: "生产物资供应商准入管理", dependencies: ["PU3"], criticalPath: false },
        { id: "PU13", name: "采购申请", dependencies: ["PU6"], criticalPath: true },
        { id: "PU14", name: "采购限价制定", dependencies: ["PU13"], criticalPath: false },
        { id: "PU15", name: "采购文件制定", dependencies: ["PU13"], criticalPath: true },
        { id: "PU21", name: "招投标公示", dependencies: ["PU15"], criticalPath: false },
        { id: "PU26", name: "物料入库", dependencies: ["PU21"], criticalPath: true },
        { id: "PU27", name: "物料验收", dependencies: ["PU26"], criticalPath: true }
      ],
      flowConnections: [
        { from: "PU1", to: "PU2", type: "sequential" },
        { from: "PU2", to: "PU3", type: "sequential" },
        { from: "PU3", to: "PU6", type: "parallel" },
        { from: "PU6", to: "PU13", type: "convergent" },
        { from: "PU13", to: "PU14", type: "parallel" },
        { from: "PU13", to: "PU15", type: "parallel" },
        { from: "PU15", to: "PU21", type: "sequential" },
        { from: "PU21", to: "PU26", type: "sequential" },
        { from: "PU26", to: "PU27", type: "sequential" }
      ]
    };

    // 构建分析参数
    const analysisParams = {
      riskData: mockRiskData,
      processStructure: mockProcessStructure,
      analysisScope: "critical_path_focus", // 关注关键路径
      riskThreshold: 0.7 // 风险阈值
    };

    console.log('📊 分析参数:');
    console.log('- 风险数据记录数:', mockRiskData.totalRecords);
    console.log('- 风险因子数量:', mockRiskData.riskFactors.length);
    console.log('- 流程节点数量:', mockProcessStructure.totalNodes);
    console.log('- 风险阈值:', analysisParams.riskThreshold);
    console.log('- 分析范围:', analysisParams.analysisScope);

    console.log('\n🤖 正在调用流程节点风险分析API...');

    // 调用API
    const result = await llmApi.analyzeProcessNodeRisk(analysisParams);

    if (result.success) {
      console.log('✅ API调用成功!\n');
      
      const analysis = result.data.analysis;
      
      console.log('📋 === 高危节点分析结果 ===');
      console.log('🔴 高危节点 (风险值 ≥ 0.7):');
      if (analysis.highRiskNodes && analysis.highRiskNodes.length > 0) {
        analysis.highRiskNodes.forEach((node, index) => {
          console.log(`   ${index + 1}. ${node.nodeId} - ${node.nodeName}`);
          console.log(`      风险值: ${node.riskScore}`);
          console.log(`      影响因子: ${node.riskFactors.join(', ')}`);
          console.log(`      风险描述: ${node.riskDescription}`);
          if (node.criticalPath) {
            console.log(`      🚨 关键路径节点`);
          }
          console.log('');
        });
      }

      console.log('🟡 中等风险节点:');
      if (analysis.mediumRiskNodes && analysis.mediumRiskNodes.length > 0) {
        analysis.mediumRiskNodes.forEach((node, index) => {
          console.log(`   ${index + 1}. ${node.nodeId} - ${node.nodeName} (${node.riskScore})`);
        });
      }

      console.log('\n📊 === 分析总结 ===');
      if (analysis.summary) {
        console.log('总节点数:', analysis.summary.totalNodes);
        console.log('高危节点数:', analysis.summary.highRiskCount);
        console.log('中等风险节点数:', analysis.summary.mediumRiskCount);
        console.log('最关键节点:', analysis.summary.mostCriticalNode);
        console.log('主要建议:', analysis.summary.recommendation);
      }

      console.log('\n📈 === API调用信息 ===');
      console.log('模型:', result.data.model);
      console.log('时间戳:', result.data.timestamp);
      if (result.data.usage) {
        console.log('Token使用:', JSON.stringify(result.data.usage, null, 2));
      }

    } else {
      console.log('❌ API调用失败:', result.error);
    }

  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error.message);
  }
}

// 添加命令行参数处理
const args = process.argv.slice(2);
const showHelp = args.includes('--help') || args.includes('-h');

if (showHelp) {
  console.log('📖 流程节点风险分析API测试工具');
  console.log('');
  console.log('用法:');
  console.log('  node test-process-node-risk-api.js [选项]');
  console.log('');
  console.log('选项:');
  console.log('  --help, -h     显示此帮助信息');
  console.log('');
  console.log('功能:');
  console.log('  • 测试流程节点风险分析API');
  console.log('  • 基于风险数据和流程结构分析高危节点');
  console.log('  • 识别关键路径上的风险节点');
  console.log('  • 提供风险缓解建议');
  process.exit(0);
}

// 运行测试
testProcessNodeRiskAPI()
  .then(() => {
    console.log('\n🎉 流程节点风险分析API测试完成!');
  })
  .catch(error => {
    console.error('💥 测试失败:', error.message);
    process.exit(1);
  });