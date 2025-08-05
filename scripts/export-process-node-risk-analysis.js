const axios = require('axios');
const fs = require('fs');
const path = require('path');

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

async function exportProcessNodeRiskAnalysis() {
  console.log('🚀 开始流程节点风险分析并导出结果...\n');

  try {
    // 准备分析数据
    const analysisData = {
      riskData: mockRiskData
    };

    console.log('📊 分析数据准备完成:');
    console.log(`- 风险数据记录数: ${analysisData.riskData.length}`);
    console.log(`- 数据置信度: ${analysisData.riskData[0].confidence}`);
    console.log(`- 包含风险分类: ${Object.keys(analysisData.riskData[0].riskClassification).length} 个等级`);
    console.log(`- 采购环节数量: ${Object.keys(analysisData.riskData[0].purchase).length} 个`);
    console.log(`- 流程结构数据源: 后端从数据库自动获取\n`);

    // 调用流程节点风险分析API
    console.log('🔄 正在调用流程节点风险分析API...');
    const response = await axios.post(`${API_BASE_URL}/api/llm/analyze-process-node-risk`, analysisData, {
      timeout: 60000, // 60秒超时
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200 && response.data.success) {
      const result = response.data.data;
      console.log('✅ API调用成功!\n');

      // 准备导出数据
      const exportData = {
        metadata: {
          exportTime: new Date().toISOString(),
          apiEndpoint: '/api/llm/analyze-process-node-risk',
          dataSource: '数据库采购流程',
          version: '1.0.0'
        },
        inputData: {
          riskData: analysisData.riskData,
          inputInfo: result.inputInfo
        },
        analysisResult: result.nodeRiskAnalysis,
        apiInfo: {
          model: result.analysis.model,
          timestamp: result.analysis.timestamp,
          usage: result.analysis.usage
        }
      };

      // 生成文件名（包含时间戳）
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                       new Date().toISOString().replace(/[:.]/g, '-').split('T')[1].split('.')[0];
      const fileName = `process-node-risk-analysis_${timestamp}.json`;
      const filePath = path.join(__dirname, fileName);

      // 写入JSON文件
      fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2), 'utf8');
      
      console.log('📁 === 文件导出成功 ===');
      console.log(`文件名: ${fileName}`);
      console.log(`文件路径: ${filePath}`);
      console.log(`文件大小: ${(fs.statSync(filePath).size / 1024).toFixed(2)} KB\n`);

      // 显示分析结果摘要
      const analysis = result.nodeRiskAnalysis;
      if (analysis.highRiskNodes && analysis.summary) {
        console.log('📋 === 分析结果摘要 ===');
        console.log(`总节点数: ${analysis.summary.totalNodes}`);
        console.log(`高危节点: ${analysis.summary.highRiskNodes} 个`);
        console.log(`中风险节点: ${analysis.summary.mediumRiskNodes} 个`);
        console.log(`低风险节点: ${analysis.summary.lowRiskNodes} 个`);
        console.log(`整体风险等级: ${analysis.summary.overallRiskLevel}`);
        console.log(`关键风险路径: ${analysis.summary.criticalPath}`);
        
        console.log('\n🔴 高危节点列表:');
        analysis.highRiskNodes.forEach((node, index) => {
          console.log(`   ${index + 1}. ${node.nodeId} - ${node.nodeName}`);
          console.log(`      风险等级: ${node.riskLevel}`);
          console.log(`      风险评分: ${node.riskScore}`);
        });
      }

      console.log('\n📊 === API调用信息 ===');
      console.log(`模型: ${result.analysis.model}`);
      console.log(`时间戳: ${result.analysis.timestamp}`);
      if (result.analysis.usage) {
        console.log(`Token使用: ${result.analysis.usage.total_tokens} (提示: ${result.analysis.usage.prompt_tokens}, 完成: ${result.analysis.usage.completion_tokens})`);
      }

    } else {
      console.error('❌ API调用失败');
      console.error('响应状态:', response.status);
      console.error('错误信息:', response.data.error || '未知错误');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ 导出过程中出现错误:', error.message);
    
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    } else if (error.request) {
      console.error('请求失败: 无法连接到API服务器');
      console.error('请确保API服务器正在运行在', API_BASE_URL);
    }
    
    process.exit(1);
  }

  console.log('\n🎉 流程节点风险分析结果导出完成!');
}

// 如果直接运行此脚本
if (require.main === module) {
  exportProcessNodeRiskAnalysis();
}

module.exports = {
  exportProcessNodeRiskAnalysis
};