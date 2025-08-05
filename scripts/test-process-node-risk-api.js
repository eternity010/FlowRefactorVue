const axios = require('axios');

// API配置
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001';

// 基于实际风险分析结果的测试数据
const mockRiskData = [
  {
    "_id": "6885da965159d67710eaa4e8",
    "confidence": "99%",
    "purchase": {
      "项目制采购发起": 46.7968,
      "战略安全库存评估": 69.4312,
      "制定装备采购计划": 173.7064,
      "供应商资质核验与选择": 126.6235,
      "样件检验与签约": 678.8708,
      "IQC与入库管理": 322.4326,
      "款项结算": 758.3362,
      "质量追溯与供应商管理": 264.6366
    },
    // 风险分类分析结果（来自实际API测试）
    "riskClassification": {
      "highRisk": {
        "threshold": ">500",
        "steps": [
          "样件检验与签约",
          "款项结算"
        ],
        "description": "风险值极高，涉及合同签订和资金支付，存在重大舞弊风险"
      },
      "mediumRisk": {
        "threshold": "200-500",
        "steps": [
          "IQC与入库管理",
          "质量追溯与供应商管理",
          "制定装备采购计划"
        ],
        "description": "风险值中等，涉及物资验收和供应商评估环节"
      },
      "lowRisk": {
        "threshold": "<200",
        "steps": [
          "项目制采购发起",
          "战略安全库存评估",
          "供应商资质核验与选择"
        ],
        "description": "风险值较低，属于前期准备和资质审核环节"
      }
    },
    "summary": {
      "totalSteps": 8,
      "highRiskCount": 2,
      "mediumRiskCount": 3,
      "lowRiskCount": 3,
      "criticalStep": "款项结算",
      "recommendation": "加强付款环节的审批控制和资金监管，实施双人复核机制"
    }
  }
];

// 注意：流程结构数据现在由后端从数据库中的purchase_flow_mermaid集合自动获取，无需在前端提供

async function testProcessNodeRiskAPI() {
  console.log('🚀 开始测试流程节点风险分析API...\n');

  try {
    // 准备测试数据 - 只传入风险数据，流程结构由后端从数据库获取
    const testData = {
      riskData: mockRiskData
    };

    console.log('📊 测试数据准备完成:');
    console.log(`- 风险数据记录数: ${testData.riskData.length}`);
    console.log(`- 数据置信度: ${testData.riskData[0].confidence}`);
    console.log(`- 包含风险分类: ${Object.keys(testData.riskData[0].riskClassification).length} 个等级`);
    console.log(`- 采购环节数量: ${Object.keys(testData.riskData[0].purchase).length} 个`);
    console.log(`- 流程结构数据源: 后端从数据库自动获取\n`);

    // 调用API
    console.log('🔄 正在调用流程节点风险分析API...');
    const response = await axios.post(`${API_BASE_URL}/api/llm/analyze-process-node-risk`, testData, {
      timeout: 60000, // 60秒超时
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      console.log('✅ API调用成功!\n');
      
      const result = response.data.data;
      const nodeAnalysis = result.nodeRiskAnalysis;
      
      console.log('📋 === 流程节点风险分析结果 ===\n');
      
      if (nodeAnalysis.highRiskNodes && nodeAnalysis.highRiskNodes.length > 0) {
        console.log('🔴 高危节点:');
        nodeAnalysis.highRiskNodes.forEach((node, index) => {
          console.log(`   ${index + 1}. ${node.nodeId} - ${node.nodeName}`);
          console.log(`      风险等级: ${node.riskLevel}`);
          console.log(`      风险评分: ${node.riskScore}`);
          console.log(`      风险因子: ${node.riskFactors ? node.riskFactors.join(', ') : '未指定'}`);
          console.log(`      风险原因: ${node.riskReason}`);
          console.log(`      建议措施: ${node.recommendation}\n`);
        });
      }
      
      if (nodeAnalysis.summary) {
        console.log('📊 === 分析总结 ===');
        console.log(`总节点数: ${nodeAnalysis.summary.totalNodes || '未知'}`);
        console.log(`高危节点: ${nodeAnalysis.summary.highRiskNodes || 0} 个`);
        console.log(`中风险节点: ${nodeAnalysis.summary.mediumRiskNodes || 0} 个`);
        console.log(`低风险节点: ${nodeAnalysis.summary.lowRiskNodes || 0} 个`);
        console.log(`整体风险等级: ${nodeAnalysis.summary.overallRiskLevel || '未知'}`);
        console.log(`关键风险路径: ${nodeAnalysis.summary.criticalPath || '未识别'}`);
        console.log(`主要建议: ${nodeAnalysis.summary.mainRecommendation || '无'}\n`);
      }
      
      console.log('📊 === API调用信息 ===');
      console.log(`模型: ${result.analysis.model}`);
      console.log(`时间戳: ${result.analysis.timestamp}`);
      console.log(`输入信息:`, {
        风险数据数量: result.inputInfo.riskDataCount,
        流程节点数量: result.inputInfo.processNodeCount,
        数据源: result.inputInfo.dataSource
      });
      
      if (result.analysis.usage) {
        console.log('Token使用情况:', JSON.stringify(result.analysis.usage, null, 2));
      }
      
    } else {
      console.error('❌ API调用失败:', response.data.error);
      if (response.data.rawContent) {
        console.log('原始输出:', response.data.rawContent);
      }
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

  console.log('\n🎉 流程节点风险分析API测试完成!');
}

// 支持命令行参数
const args = process.argv.slice(2);
const showHelp = args.includes('--help') || args.includes('-h');

if (showHelp) {
  console.log(`
🔧 流程节点风险分析API测试工具

用法:
  node scripts/test-process-node-risk-api.js [选项]

选项:
  --help, -h    显示帮助信息

说明:
  该脚本会测试流程节点风险分析API，通过模拟风险数据和流程结构数据，
  调用大模型分析在风险影响下处于高危状态的流程节点。

示例:
  node scripts/test-process-node-risk-api.js
`);
} else {
  // 运行测试
  testProcessNodeRiskAPI();
}