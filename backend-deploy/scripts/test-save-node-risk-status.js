const axios = require('axios');

// API配置
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001';

// 模拟原始API结果数据（从llmApi.analyzeProcessNodeRisk返回的原始数据）
const mockOriginalApiResult = {
  // 节点风险分析结果
  nodeRiskAnalysis: {
    highRiskNodes: [
      {
        nodeId: "PU22",
        nodeName: "采购合同起草",
        riskLevel: "HIGH",
        riskScore: 678.8708,
        riskFactors: ["合同签订风险", "舞弊风险"],
        riskReason: "该节点对应风险数据中的'样件检验与签约'环节，风险值高达678.8708，属于高风险阈值(>500)。合同起草环节涉及法律条款和商业条款的确定，存在重大舞弊和合规风险。",
        recommendation: "实施合同模板标准化、增加法律合规审查环节、建立双人复核机制"
      },
      {
        nodeId: "PU23",
        nodeName: "合同审批",
        riskLevel: "HIGH",
        riskScore: 758.3362,
        riskFactors: ["资金支付风险", "审批舞弊风险"],
        riskReason: "该节点对应风险数据中的'款项结算'环节，风险值达到758.3362，是流程中最高风险点。合同审批直接关联资金支付，存在支付错误、舞弊和违规审批的高风险。",
        recommendation: "建立多级审批制度、实施金额分级授权、加强审批痕迹管理、与财务系统集成验证"
      },
      {
        nodeId: "PU27",
        nodeName: "物料验收",
        riskLevel: "MEDIUM",
        riskScore: 322.4326,
        riskFactors: ["质量风险", "验收舞弊风险"],
        riskReason: "对应风险数据中的'IQC与入库管理'环节，风险值322.4326属于中等风险区间(200-500)。物料验收环节存在质量把关不严和验收舞弊的风险。",
        recommendation: "实施第三方质检、建立验收标准库、加强验收过程记录"
      }
    ],
    summary: {
      totalNodes: 28,
      highRiskNodes: 2,
      mediumRiskNodes: 3,
      lowRiskNodes: 23,
      overallRiskLevel: "MEDIUM",
      criticalPath: "采购合同起草→合同审批→物料验收",
      mainRecommendation: "重点加强合同管理和支付审批环节的风险控制，建议：1)实施合同全生命周期管理系统 2)建立支付审批双人复核机制 3)对高风险环节实施专项审计"
    }
  },
  
  // API调用分析信息
  analysis: {
    model: "deepseek-v3-250324",
    timestamp: "2025-01-20T10:30:45.516Z",
    usage: {
      completion_tokens: 531,
      prompt_tokens: 3908,
      total_tokens: 4439,
      prompt_tokens_details: {
        cached_tokens: 0
      },
      completion_tokens_details: {
        reasoning_tokens: 0
      }
    }
  },
  
  // 输入信息
  inputInfo: {
    riskDataCount: 1,
    processNodeCount: 28,
    dataSource: "数据库采购流程"
  }
};

async function testSaveNodeRiskStatus() {
  console.log('🚀 开始测试保存节点风险状态数据功能...\n');

  try {
    // 准备测试数据（使用原始API结果）
    const testData = {
      nodeRiskStatusData: mockOriginalApiResult
    };

    console.log('📊 原始API结果数据准备完成:');
    console.log(`- 数据类型: 原始API结果`);
    console.log(`- 包含节点风险分析: ${!!testData.nodeRiskStatusData.nodeRiskAnalysis}`);
    console.log(`- 包含分析信息: ${!!testData.nodeRiskStatusData.analysis}`);
    console.log(`- 包含输入信息: ${!!testData.nodeRiskStatusData.inputInfo}`);
    console.log(`- 高危节点数量: ${testData.nodeRiskStatusData.nodeRiskAnalysis.highRiskNodes.length}`);
    console.log(`- 总节点数: ${testData.nodeRiskStatusData.nodeRiskAnalysis.summary.totalNodes}`);
    console.log(`- 整体风险等级: ${testData.nodeRiskStatusData.nodeRiskAnalysis.summary.overallRiskLevel}`);
    console.log(`- 关键风险路径: ${testData.nodeRiskStatusData.nodeRiskAnalysis.summary.criticalPath}`);
    console.log(`- 使用的模型: ${testData.nodeRiskStatusData.analysis.model}`);
    console.log(`- Token使用量: ${testData.nodeRiskStatusData.analysis.usage.total_tokens}\n`);

    // 调用API保存原始数据
    console.log('🔄 正在调用保存节点风险状态数据API（原始API结果）...');
    const response = await axios.post(`${API_BASE_URL}/api/llm/save-node-risk-status`, testData, {
      timeout: 30000, // 30秒超时
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      console.log('✅ API调用成功!\n');
      
      const result = response.data.data;
      
      console.log('📋 === 保存结果 ===');
      console.log(`数据ID: ${result.id}`);
      console.log(`保存时间: ${result.timestamp}`);
      console.log(`数据类型: ${result.dataType}`);
      console.log(`消息: ${result.message}\n`);
      
      console.log('📊 === 保存的原始API数据概要 ===');
      console.log(`- 节点风险分析数据: ✅ 已保存`);
      console.log(`- API分析信息: ✅ 已保存`);
      console.log(`- 输入信息: ✅ 已保存`);
      console.log(`- 高危节点数量: ${mockOriginalApiResult.nodeRiskAnalysis.highRiskNodes.length}`);
      console.log(`- 使用的AI模型: ${mockOriginalApiResult.analysis.model}`);
      console.log(`- Token统计信息: ${JSON.stringify(mockOriginalApiResult.analysis.usage, null, 2)}\n`);
      
    } else {
      console.error('❌ API调用失败:', response.data.error);
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

  console.log('\n🎉 节点风险状态数据（原始API结果）保存功能测试完成!');
}

// 支持命令行参数
const args = process.argv.slice(2);
const showHelp = args.includes('--help') || args.includes('-h');

if (showHelp) {
  console.log(`
🔧 节点风险状态数据保存功能测试工具

用法:
  node scripts/test-save-node-risk-status.js [选项]

选项:
  --help, -h    显示帮助信息

说明:
  该脚本会测试保存节点风险状态数据（原始API结果）到MongoDB的功能，
  验证原始数据是否能正确保存到maintenance_system数据库下的node_risk_status_data集合中。
  
  保存的数据包括：
  - nodeRiskAnalysis: 节点风险分析结果
  - analysis: API调用信息（模型、时间戳、Token使用等）
  - inputInfo: 输入信息（风险数据数量、流程节点数等）

示例:
  node scripts/test-save-node-risk-status.js
`);
} else {
  // 运行测试
  testSaveNodeRiskStatus();
}
