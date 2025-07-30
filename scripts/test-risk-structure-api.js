const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

// 配置选项
const SHOW_FULL_OUTPUT = process.argv.includes('--full') || process.argv.includes('-f');
const SHOW_SAMPLE_DATA = process.argv.includes('--sample') || process.argv.includes('-s');

async function testRiskStructureAPI() {
  console.log('🧪 开始测试风险结构化分析API...\n');
  
  try {
    // 步骤1: 直接调用统一的结构化分析API
    console.log('=== 步骤1: 调用风险结构化分析API ===');
    console.log('🤖 正在调用API进行风险结构化分析（API内部会自动获取风险数据）...');
    
    const apiResponse = await axios.post(`${API_BASE_URL}/api/llm/analyze-risk-structure`);
    
    if (apiResponse.data.success) {
      console.log('✅ API调用成功!\n');
      
      const responseData = apiResponse.data.data;
      const riskAnalysis = responseData.analysis.riskAnalysis;
      
      console.log(`📊 数据来源: ${responseData.dataInfo.dataSource}`);
      console.log(`📊 分析数据量: ${responseData.dataInfo.totalRecords} 条记录`);
      
      // 显示原始风险数据（前3条作为示例）
      if (SHOW_SAMPLE_DATA) {
        console.log('\n📋 === 原始风险数据示例（前3条） ===');
        const sampleData = responseData.originalData.slice(0, 3);
        sampleData.forEach((record, index) => {
          console.log(`\n记录 ${index + 1}:`);
          console.log(`  置信度: ${record.confidence}`);
          console.log(`  采购流程: ${JSON.stringify(record.purchase, null, 4)}`);
        });
      }
      
      // 显示完整的API输出内容
      if (SHOW_FULL_OUTPUT) {
        console.log('\n📄 === 完整API输出内容 ===');
        console.log(JSON.stringify(apiResponse.data, null, 2));
      } else {
        console.log('\n💡 提示: 使用 --full 或 -f 参数查看完整API输出内容');
        console.log('💡 提示: 使用 --sample 或 -s 参数查看原始数据示例');
      }
      
      console.log('\n📋 === 结构化风险分析结果 ===');
      
      // 高风险环节
      console.log(`\n🔴 高风险环节 (${riskAnalysis.riskClassification.highRisk.threshold}):`);
      riskAnalysis.riskClassification.highRisk.steps.forEach((step, index) => {
        console.log(`   ${index + 1}. ${step}`);
      });
      console.log(`   特征: ${riskAnalysis.riskClassification.highRisk.description}`);
      
      // 中风险环节
      console.log(`\n🟡 中风险环节 (${riskAnalysis.riskClassification.mediumRisk.threshold}):`);
      riskAnalysis.riskClassification.mediumRisk.steps.forEach((step, index) => {
        console.log(`   ${index + 1}. ${step}`);
      });
      console.log(`   特征: ${riskAnalysis.riskClassification.mediumRisk.description}`);
      
      // 低风险环节
      console.log(`\n🟢 低风险环节 (${riskAnalysis.riskClassification.lowRisk.threshold}):`);
      riskAnalysis.riskClassification.lowRisk.steps.forEach((step, index) => {
        console.log(`   ${index + 1}. ${step}`);
      });
      console.log(`   特征: ${riskAnalysis.riskClassification.lowRisk.description}`);
      
      // 总结信息
      console.log('\n📊 === 分析总结 ===');
      console.log(`总步骤数: ${riskAnalysis.summary.totalSteps}`);
      console.log(`高风险环节: ${riskAnalysis.summary.highRiskCount} 个`);
      console.log(`中风险环节: ${riskAnalysis.summary.mediumRiskCount} 个`);
      console.log(`低风险环节: ${riskAnalysis.summary.lowRiskCount} 个`);
      console.log(`最关键环节: ${riskAnalysis.summary.criticalStep}`);
      console.log(`主要建议: ${riskAnalysis.summary.recommendation}`);
      
      // API调用信息
      console.log('\n📊 === API调用信息 ===');
      console.log(`模型: ${responseData.analysis.model}`);
      console.log(`时间戳: ${responseData.analysis.timestamp}`);
      if (responseData.analysis.usage) {
        console.log(`Token使用情况: ${JSON.stringify(responseData.analysis.usage, null, 2)}`);
      }
      
    } else {
      console.log('❌ API调用失败:', apiResponse.data.error);
      if (apiResponse.data.rawContent) {
        console.log('原始输出内容:', apiResponse.data.rawContent);
      }
    }
    
    // 步骤2: 测试API健壮性
    console.log('\n=== 步骤2: 测试API健壮性 ===');
    console.log('🔄 再次调用API验证稳定性...');
    
    try {
      const secondResponse = await axios.post(`${API_BASE_URL}/api/llm/analyze-risk-structure`);
      if (secondResponse.data.success) {
        console.log('✅ API稳定性测试通过');
      } else {
        console.log('⚠️ API稳定性测试失败:', secondResponse.data.error);
      }
    } catch (error) {
      if (error.response) {
        console.log('❌ API稳定性测试失败:', error.response.data);
      } else {
        console.log('❌ 请求失败:', error.message);
      }
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ 无法连接到API服务器');
      console.log('💡 请确保API服务器正在运行: npm run api-server');
    } else {
      console.error('❌ 测试过程中发生错误:', error.message);
    }
  }
}

// 显示使用说明
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('📖 风险结构化分析API测试脚本使用说明:');
  console.log('');
  console.log('基本用法:');
  console.log('  node scripts/test-risk-structure-api.js');
  console.log('');
  console.log('可选参数:');
  console.log('  --full, -f     显示完整的API输出内容');
  console.log('  --sample, -s   显示原始风险数据示例');
  console.log('  --help, -h     显示此帮助信息');
  console.log('');
  console.log('示例:');
  console.log('  node scripts/test-risk-structure-api.js --full');
  console.log('  node scripts/test-risk-structure-api.js --sample');
  console.log('  node scripts/test-risk-structure-api.js --full --sample');
  console.log('');
  process.exit(0);
}

// 运行测试
console.log('🚀 开始测试风险结构化分析API...\n');
testRiskStructureAPI().then(() => {
  console.log('\n🎉 风险结构化分析API测试完成!');
}).catch(error => {
  console.error('\n💥 测试失败:', error);
  process.exit(1);
}); 