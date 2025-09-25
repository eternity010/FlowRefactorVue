const RiskDataService = require('../src/services/riskDataService');
const LLMService = require('../src/services/llmService');

async function testSingleRiskAnalysis() {
  console.log('🧪 开始测试单个风险数据的大模型分析...\n');
  
  const riskDataService = new RiskDataService();
  const llmService = new LLMService();
  
  try {
    // 步骤1: 获取风险数据
    console.log('=== 步骤1: 提取风险数据 ===');
    const riskResult = await riskDataService.getAllRiskData();
    
    if (!riskResult.success) {
      throw new Error('获取风险数据失败: ' + riskResult.error);
    }
    
    const riskData = riskResult.data;
    console.log(`✅ 成功获取 ${riskData.length} 条风险数据`);
    
    // 选择一个高风险的样本（置信度最高的一个）
    const highestConfidenceRecord = riskData
      .sort((a, b) => parseInt(b.confidence) - parseInt(a.confidence))[0];
    
    console.log(`📊 选择分析样本: 置信度 ${highestConfidenceRecord.confidence}`);
    
    // 步骤2: 分析单个风险记录
    console.log('\n=== 步骤2: 单个风险记录分析 ===');
    
    const singleRiskAnalysis = {
      analysisType: '单个风险记录深度分析',
      riskRecord: {
        confidence: highestConfidenceRecord.confidence,
        riskValues: highestConfidenceRecord.purchase
      },
      analysisQuestions: [
        '这个置信度水平意味着什么？',
        '哪个采购步骤风险最高？',
        '风险值的分布特征是什么？',
        '可能的风险来源有哪些？'
      ]
    };
    
    console.log('🤖 正在进行单个风险记录分析...');
    const analysisResult = await llmService.assessRisks(singleRiskAnalysis);
    
    if (analysisResult.success) {
      console.log('✅ 单个风险分析成功!\n');
      console.log('📋 === 大模型分析结果 ===');
      console.log(analysisResult.data.content);
      console.log('\n📊 === Token使用情况 ===');
      if (analysisResult.data.usage) {
        console.log(JSON.stringify(analysisResult.data.usage, null, 2));
      }
    } else {
      throw new Error('单个风险分析失败: ' + analysisResult.error);
    }
    
    // 步骤3: 对比分析（高风险 vs 低风险）
    console.log('\n=== 步骤3: 对比分析 ===');
    
    const lowestConfidenceRecord = riskData
      .sort((a, b) => parseInt(a.confidence) - parseInt(b.confidence))[0];
    
    const comparisonAnalysis = {
      analysisType: '风险对比分析',
      highRisk: {
        confidence: highestConfidenceRecord.confidence,
        purchase: highestConfidenceRecord.purchase
      },
      lowRisk: {
        confidence: lowestConfidenceRecord.confidence,
        purchase: lowestConfidenceRecord.purchase
      },
      comparisonFocus: '分析高风险和低风险情况下各采购步骤的差异，识别关键风险因素'
    };
    
    console.log(`🤖 正在对比分析 ${highestConfidenceRecord.confidence} vs ${lowestConfidenceRecord.confidence} 置信度...`);
    const comparisonResult = await llmService.analyzeProcess(comparisonAnalysis);
    
    if (comparisonResult.success) {
      console.log('✅ 对比分析成功!\n');
      console.log('📋 === 大模型对比分析结果 ===');
      console.log(comparisonResult.data.content);
      console.log('\n📊 === Token使用情况 ===');
      if (comparisonResult.data.usage) {
        console.log(JSON.stringify(comparisonResult.data.usage, null, 2));
      }
    } else {
      console.log('⚠️ 对比分析失败: ' + comparisonResult.error);
    }
    
    // 步骤4: 针对性建议
    console.log('\n=== 步骤4: 针对性改进建议 ===');
    
    // 找出风险最高的3个步骤
    const riskSteps = Object.entries(highestConfidenceRecord.purchase)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    const recommendationData = {
      focusArea: '高风险采购流程优化',
      currentHighRiskScenario: {
        confidence: highestConfidenceRecord.confidence,
        topRiskSteps: riskSteps.map(([step, value]) => ({ step, riskValue: value }))
      },
      optimizationGoal: '将风险降低到中等水平',
      constraints: '在保持采购效率的前提下降低风险'
    };
    
    console.log('🤖 正在获取针对性改进建议...');
    const recommendationResult = await llmService.getRecommendations(recommendationData);
    
    if (recommendationResult.success) {
      console.log('✅ 改进建议获取成功!\n');
      console.log('📋 === 大模型改进建议 ===');
      console.log(recommendationResult.data.content);
      console.log('\n📊 === Token使用情况 ===');
      if (recommendationResult.data.usage) {
        console.log(JSON.stringify(recommendationResult.data.usage, null, 2));
      }
    } else {
      console.log('⚠️ 改进建议获取失败: ' + recommendationResult.error);
    }
    
    // 总结分析结果
    console.log('\n=== 分析总结 ===');
    console.log(`📊 分析的风险记录置信度: ${highestConfidenceRecord.confidence}`);
    console.log(`🎯 最高风险步骤: ${riskSteps[0][0]} (风险值: ${riskSteps[0][1].toFixed(2)})`);
    console.log(`📈 风险分布: ${Object.keys(highestConfidenceRecord.purchase).length} 个采购步骤`);
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
    console.error('详细错误信息:', error);
  } finally {
    // 清理资源
    await riskDataService.disconnect();
    console.log('\n🔌 风险数据服务连接已关闭');
  }
}

// 运行测试
console.log('🚀 开始单个风险数据大模型分析测试...\n');
testSingleRiskAnalysis().then(() => {
  console.log('\n🎉 单个风险数据大模型分析测试完成!');
}).catch(error => {
  console.error('\n💥 测试失败:', error);
  process.exit(1);
}); 