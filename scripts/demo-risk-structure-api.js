const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

// 示例风险数据
const sampleRiskData = [
  {
    "_id": "6885da965159d67710eaa4da",
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
    }
  },
  {
    "_id": "6885da965159d67710eaa4db",
    "confidence": "85%",
    "purchase": {
      "项目制采购发起": 25.8073,
      "战略安全库存评估": 32.8006,
      "制定装备采购计划": 93.8172,
      "供应商资质核验与选择": 80.0614,
      "样件检验与签约": 233.035,
      "IQC与入库管理": 118.5907,
      "款项结算": 274.8573,
      "质量追溯与供应商管理": 132.403
    }
  }
];

async function demoRiskStructureAPI() {
  console.log('🎯 风险结构化分析API演示\n');
  
  try {
    console.log('📋 输入数据:');
    console.log(`- 风险记录数: ${sampleRiskData.length}`);
    console.log(`- 置信度范围: ${sampleRiskData.map(r => r.confidence).join(', ')}`);
    console.log(`- 采购步骤数: ${Object.keys(sampleRiskData[0].purchase).length}`);
    
    console.log('\n🤖 正在调用API...');
    
    const response = await axios.post(`${API_BASE_URL}/api/llm/analyze-risk-structure`, {
      riskData: sampleRiskData
    });
    
    if (response.data.success) {
      console.log('✅ API调用成功!\n');
      
      // 输出JSON格式的结果
      console.log('📊 === 结构化分析结果 (JSON格式) ===');
      console.log(JSON.stringify(response.data.data.riskAnalysis, null, 2));
      
      console.log('\n📈 === 快速预览 ===');
      const analysis = response.data.data.riskAnalysis;
      
      console.log(`🔴 高风险: ${analysis.riskClassification.highRisk.steps.length} 个环节`);
      console.log(`🟡 中风险: ${analysis.riskClassification.mediumRisk.steps.length} 个环节`);
      console.log(`🟢 低风险: ${analysis.riskClassification.lowRisk.steps.length} 个环节`);
      console.log(`⚠️  关键环节: ${analysis.summary.criticalStep}`);
      
    } else {
      console.log('❌ API调用失败:', response.data.error);
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ 无法连接到API服务器');
      console.log('💡 请先启动API服务器: npm run api-server');
    } else if (error.response) {
      console.log('❌ API错误:', error.response.data);
    } else {
      console.log('❌ 请求失败:', error.message);
    }
  }
}

// 显示API使用说明
console.log('🚀 风险结构化分析API演示');
console.log('===============================');
console.log('');
console.log('API端点: POST /api/llm/analyze-risk-structure');
console.log('');
console.log('请求格式:');
console.log('{');
console.log('  "riskData": [');
console.log('    {');
console.log('      "confidence": "99%",');
console.log('      "purchase": {');
console.log('        "环节1": 数值,');
console.log('        "环节2": 数值,');
console.log('        "...": "..."');
console.log('      }');
console.log('    }');
console.log('  ]');
console.log('}');
console.log('');
console.log('响应格式:');
console.log('{');
console.log('  "success": true,');
console.log('  "data": {');
console.log('    "riskAnalysis": {');
console.log('      "riskClassification": {');
console.log('        "highRisk": { "steps": [...], "threshold": "...", "description": "..." },');
console.log('        "mediumRisk": { "steps": [...], "threshold": "...", "description": "..." },');
console.log('        "lowRisk": { "steps": [...], "threshold": "...", "description": "..." }');
console.log('      },');
console.log('      "summary": {');
console.log('        "totalSteps": 8,');
console.log('        "highRiskCount": 3,');
console.log('        "criticalStep": "...",');
console.log('        "recommendation": "..."');
console.log('      }');
console.log('    }');
console.log('  }');
console.log('}');
console.log('');
console.log('===============================\n');

// 运行演示
demoRiskStructureAPI().then(() => {
  console.log('\n🎉 演示完成!');
}).catch(error => {
  console.error('\n💥 演示失败:', error);
}); 