const RiskDataService = require('../src/services/riskDataService');
const LLMService = require('../src/services/llmService');

async function testRiskAnalysisWithLLM() {
  console.log('🧪 开始测试风险数据的大模型分析...\n');
  
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
    
    // 步骤2: 数据预处理和分析
    console.log('\n=== 步骤2: 风险数据预处理 ===');
    
    // 计算置信度分布
    const confidenceStats = {};
    const purchaseStepStats = {};
    
    riskData.forEach(record => {
      // 置信度统计
      const confidence = record.confidence;
      confidenceStats[confidence] = (confidenceStats[confidence] || 0) + 1;
      
      // 采购步骤风险值统计
      if (record.purchase) {
        Object.entries(record.purchase).forEach(([step, value]) => {
          if (!purchaseStepStats[step]) {
            purchaseStepStats[step] = { total: 0, count: 0, max: 0, min: Infinity };
          }
          purchaseStepStats[step].total += value;
          purchaseStepStats[step].count += 1;
          purchaseStepStats[step].max = Math.max(purchaseStepStats[step].max, value);
          purchaseStepStats[step].min = Math.min(purchaseStepStats[step].min, value);
        });
      }
    });
    
    // 计算平均值
    Object.keys(purchaseStepStats).forEach(step => {
      const stats = purchaseStepStats[step];
      stats.average = stats.total / stats.count;
    });
    
    console.log('📊 数据统计完成');
    console.log(`   - 置信度范围: ${Object.keys(confidenceStats).sort().join(', ')}`);
    console.log(`   - 采购流程步骤: ${Object.keys(purchaseStepStats).length} 个`);
    
    // 步骤3: 准备发送给大模型的数据
    console.log('\n=== 步骤3: 准备大模型分析数据 ===');
    
    // 选择代表性样本进行分析（选择高、中、低置信度的数据）
    const highConfidenceData = riskData.filter(r => parseInt(r.confidence) >= 95);
    const mediumConfidenceData = riskData.filter(r => parseInt(r.confidence) >= 90 && parseInt(r.confidence) < 95);
    const lowConfidenceData = riskData.filter(r => parseInt(r.confidence) < 90);
    
    const analysisData = {
      totalRecords: riskData.length,
      confidenceDistribution: confidenceStats,
      sampleData: {
        highConfidence: highConfidenceData.slice(0, 2),
        mediumConfidence: mediumConfidenceData.slice(0, 2),
        lowConfidence: lowConfidenceData.slice(0, 2)
      },
      purchaseStepStatistics: purchaseStepStats
    };
    
    console.log('✅ 分析数据准备完成');
    
    // 步骤4: 使用大模型进行风险分析
    console.log('\n=== 步骤4: 大模型风险分析 ===');
    console.log('🤖 正在调用大模型进行风险分析...');
    
    const analysisResult = await llmService.assessRisks(analysisData);
    
    if (analysisResult.success) {
      console.log('✅ 大模型分析成功!\n');
      console.log('📋 === 大模型分析结果 ===');
      console.log(analysisResult.data.content);
      console.log('\n📊 === 调用统计信息 ===');
      if (analysisResult.data.usage) {
        console.log(`Token使用情况: ${JSON.stringify(analysisResult.data.usage, null, 2)}`);
      }
      console.log(`模型: ${analysisResult.data.model}`);
      console.log(`时间戳: ${analysisResult.data.timestamp}`);
    } else {
      throw new Error('大模型分析失败: ' + analysisResult.error);
    }
    
    // 步骤5: 进行流程分析
    console.log('\n=== 步骤5: 大模型流程分析 ===');
    console.log('🤖 正在调用大模型进行流程分析...');
    
    const processAnalysisData = {
      processName: '采购流程风险评估',
      steps: Object.keys(purchaseStepStats),
      riskMetrics: purchaseStepStats,
      confidenceLevels: Object.keys(confidenceStats).sort(),
      totalDataPoints: riskData.length
    };
    
    const processResult = await llmService.analyzeProcess(processAnalysisData);
    
    if (processResult.success) {
      console.log('✅ 流程分析成功!\n');
      console.log('📋 === 大模型流程分析结果 ===');
      console.log(processResult.data.content);
      console.log('\n📊 === 调用统计信息 ===');
      if (processResult.data.usage) {
        console.log(`Token使用情况: ${JSON.stringify(processResult.data.usage, null, 2)}`);
      }
    } else {
      throw new Error('流程分析失败: ' + processResult.error);
    }
    
    // 步骤6: 获取优化建议
    console.log('\n=== 步骤6: 大模型优化建议 ===');
    console.log('🤖 正在获取优化建议...');
    
    const recommendationData = {
      currentRiskProfile: analysisData,
      criticalSteps: Object.entries(purchaseStepStats)
        .sort((a, b) => b[1].average - a[1].average)
        .slice(0, 3)
        .map(([step, stats]) => ({ step, averageRisk: stats.average, maxRisk: stats.max })),
      improvementGoals: '降低采购流程风险，提高流程效率'
    };
    
    const recommendationResult = await llmService.getRecommendations(recommendationData);
    
    if (recommendationResult.success) {
      console.log('✅ 优化建议获取成功!\n');
      console.log('📋 === 大模型优化建议 ===');
      console.log(recommendationResult.data.content);
      console.log('\n📊 === 调用统计信息 ===');
      if (recommendationResult.data.usage) {
        console.log(`Token使用情况: ${JSON.stringify(recommendationResult.data.usage, null, 2)}`);
      }
    } else {
      console.log('⚠️ 优化建议获取失败: ' + recommendationResult.error);
    }
    
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
console.log('🚀 开始风险数据大模型分析测试...\n');
testRiskAnalysisWithLLM().then(() => {
  console.log('\n🎉 风险数据大模型分析测试完成!');
}).catch(error => {
  console.error('\n💥 测试失败:', error);
  process.exit(1);
}); 