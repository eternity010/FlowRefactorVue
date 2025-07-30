const RiskDataService = require('../src/services/riskDataService');
const LLMService = require('../src/services/llmService');

async function testStructuredRiskAnalysis() {
  console.log('🧪 开始测试结构化风险分析...\n');
  
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
    
    // 步骤2: 分析多个置信度等级的数据
    console.log('\n=== 步骤2: 准备多样本分析数据 ===');
    
    // 先分析置信度分布
    const confidenceLevels = riskData.map(r => parseInt(r.confidence)).sort((a, b) => a - b);
    console.log(`📊 置信度范围: ${confidenceLevels[0]}% - ${confidenceLevels[confidenceLevels.length - 1]}%`);
    
    // 选择不同置信度的样本（更灵活的查找策略）
    const highConfidenceRecord = riskData.find(r => parseInt(r.confidence) >= 95) || 
                                 riskData.find(r => parseInt(r.confidence) >= 90) ||
                                 riskData[riskData.length - 1]; // 最后一个作为备选
    
    const mediumConfidenceRecord = riskData.find(r => parseInt(r.confidence) >= 85 && parseInt(r.confidence) < 95) ||
                                   riskData.find(r => parseInt(r.confidence) >= 85 && parseInt(r.confidence) < 98) ||
                                   riskData[Math.floor(riskData.length / 2)]; // 中间一个作为备选
    
    const lowConfidenceRecord = riskData.find(r => parseInt(r.confidence) < 90) ||
                                riskData[0]; // 第一个作为备选
    
    // 验证是否成功找到记录
    if (!highConfidenceRecord || !mediumConfidenceRecord || !lowConfidenceRecord) {
      throw new Error('无法找到足够的样本数据进行分析');
    }
    
    console.log(`📊 高置信度样本: ${highConfidenceRecord.confidence}`);
    console.log(`📊 中置信度样本: ${mediumConfidenceRecord.confidence}`);
    console.log(`📊 低置信度样本: ${lowConfidenceRecord.confidence}`);
    
    // 步骤3: 使用特殊的系统提示词要求固定格式输出
    console.log('\n=== 步骤3: 结构化风险分类分析 ===');
    
    const structuredAnalysisData = {
      analysisRequest: "请分析采购流程各环节的风险等级",
      sampleData: [
        {
          confidence: highConfidenceRecord.confidence,
          purchaseSteps: highConfidenceRecord.purchase
        },
        {
          confidence: mediumConfidenceRecord.confidence,
          purchaseSteps: mediumConfidenceRecord.purchase
        },
        {
          confidence: lowConfidenceRecord.confidence,
          purchaseSteps: lowConfidenceRecord.purchase
        }
      ],
      formatRequirement: "请严格按照以下JSON格式输出分析结果"
    };
    
    // 创建特殊的系统提示词
    const systemMessage = `你是专业的风险评估专家。请分析采购流程数据，并严格按照以下JSON格式输出结果：

{
  "riskClassification": {
    "highRisk": {
      "threshold": "风险值范围",
      "steps": ["环节1", "环节2", "环节3"],
      "description": "高风险特征描述"
    },
    "mediumRisk": {
      "threshold": "风险值范围", 
      "steps": ["环节1", "环节2"],
      "description": "中风险特征描述"
    },
    "lowRisk": {
      "threshold": "风险值范围",
      "steps": ["环节1", "环节2", "环节3"],
      "description": "低风险特征描述"
    }
  },
  "summary": {
    "totalSteps": 8,
    "highRiskCount": 0,
    "mediumRiskCount": 0, 
    "lowRiskCount": 0,
    "criticalStep": "风险最高的环节",
    "recommendation": "主要建议"
  }
}

请只输出JSON格式，不要添加任何其他文字说明。`;

    console.log('🤖 正在进行结构化风险分析...');
    const analysisResult = await llmService.chat(
      `请分析以下采购流程风险数据：\n${JSON.stringify(structuredAnalysisData, null, 2)}`,
      systemMessage
    );
    
    if (analysisResult.success) {
      console.log('✅ 结构化分析成功!\n');
      console.log('📋 === 大模型结构化输出 ===');
      console.log(analysisResult.data.content);
      
      // 尝试解析JSON
      try {
        const parsedResult = JSON.parse(analysisResult.data.content);
        console.log('\n✅ JSON解析成功！');
        console.log('\n🎯 === 风险分类结果 ===');
        
        // 高风险环节
        console.log(`\n🔴 高风险环节 (${parsedResult.riskClassification.highRisk.threshold}):`);
        parsedResult.riskClassification.highRisk.steps.forEach((step, index) => {
          console.log(`   ${index + 1}. ${step}`);
        });
        console.log(`   特征: ${parsedResult.riskClassification.highRisk.description}`);
        
        // 中风险环节
        console.log(`\n🟡 中风险环节 (${parsedResult.riskClassification.mediumRisk.threshold}):`);
        parsedResult.riskClassification.mediumRisk.steps.forEach((step, index) => {
          console.log(`   ${index + 1}. ${step}`);
        });
        console.log(`   特征: ${parsedResult.riskClassification.mediumRisk.description}`);
        
        // 低风险环节
        console.log(`\n🟢 低风险环节 (${parsedResult.riskClassification.lowRisk.threshold}):`);
        parsedResult.riskClassification.lowRisk.steps.forEach((step, index) => {
          console.log(`   ${index + 1}. ${step}`);
        });
        console.log(`   特征: ${parsedResult.riskClassification.lowRisk.description}`);
        
        // 总结信息
        console.log('\n📊 === 分析总结 ===');
        console.log(`总步骤数: ${parsedResult.summary.totalSteps}`);
        console.log(`高风险环节: ${parsedResult.summary.highRiskCount} 个`);
        console.log(`中风险环节: ${parsedResult.summary.mediumRiskCount} 个`);
        console.log(`低风险环节: ${parsedResult.summary.lowRiskCount} 个`);
        console.log(`最关键环节: ${parsedResult.summary.criticalStep}`);
        console.log(`主要建议: ${parsedResult.summary.recommendation}`);
        
      } catch (parseError) {
        console.log('⚠️ JSON解析失败，大模型输出格式可能不标准');
        console.log('原始输出内容:', analysisResult.data.content);
      }
      
      console.log('\n📊 === Token使用情况 ===');
      if (analysisResult.data.usage) {
        console.log(JSON.stringify(analysisResult.data.usage, null, 2));
      }
    } else {
      throw new Error('结构化分析失败: ' + analysisResult.error);
    }
    
    // 步骤4: 尝试简化的格式要求
    console.log('\n=== 步骤4: 简化格式分析 ===');
    
    const simpleFormatData = {
      analysisType: "采购流程风险等级分类",
      purchaseSteps: highConfidenceRecord.purchase,
      confidence: highConfidenceRecord.confidence
    };
    
    const simpleSystemMessage = `你是风险评估专家。请分析采购流程数据，按照以下格式输出：

高风险环节（风险值>300）：
- 环节名称1 (风险值)
- 环节名称2 (风险值)

中风险环节（风险值100-300）：
- 环节名称1 (风险值)
- 环节名称2 (风险值)

低风险环节（风险值<100）：
- 环节名称1 (风险值)
- 环节名称2 (风险值)

关键建议：
总结1-2条最重要的改进建议`;

    console.log('🤖 正在进行简化格式分析...');
    const simpleResult = await llmService.chat(
      `请分析以下采购流程风险数据：\n${JSON.stringify(simpleFormatData, null, 2)}`,
      simpleSystemMessage
    );
    
    if (simpleResult.success) {
      console.log('✅ 简化格式分析成功!\n');
      console.log('📋 === 简化格式输出 ===');
      console.log(simpleResult.data.content);
      
      console.log('\n📊 === Token使用情况 ===');
      if (simpleResult.data.usage) {
        console.log(JSON.stringify(simpleResult.data.usage, null, 2));
      }
    } else {
      console.log('⚠️ 简化格式分析失败: ' + simpleResult.error);
    }
    
    // 步骤5: 表格格式输出
    console.log('\n=== 步骤5: 表格格式分析 ===');
    
    const tableFormatData = {
      analysisType: "采购流程风险分类表格",
      allSteps: highConfidenceRecord.purchase
    };
    
    const tableSystemMessage = `你是风险评估专家。请将采购流程各环节按风险等级分类，并以表格格式输出：

| 风险等级 | 环节名称 | 风险值 | 风险描述 |
|---------|---------|-------|----------|
| 高风险   | 环节1   | 数值   | 简要描述 |
| 中风险   | 环节2   | 数值   | 简要描述 |
| 低风险   | 环节3   | 数值   | 简要描述 |

风险等级标准：
- 高风险：>300
- 中风险：100-300  
- 低风险：<100`;

    console.log('🤖 正在进行表格格式分析...');
    const tableResult = await llmService.chat(
      `请分析以下采购流程风险数据：\n${JSON.stringify(tableFormatData, null, 2)}`,
      tableSystemMessage
    );
    
    if (tableResult.success) {
      console.log('✅ 表格格式分析成功!\n');
      console.log('📋 === 表格格式输出 ===');
      console.log(tableResult.data.content);
      
      console.log('\n📊 === Token使用情况 ===');
      if (tableResult.data.usage) {
        console.log(JSON.stringify(tableResult.data.usage, null, 2));
      }
    } else {
      console.log('⚠️ 表格格式分析失败: ' + tableResult.error);
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
console.log('🚀 开始结构化风险分析测试...\n');
testStructuredRiskAnalysis().then(() => {
  console.log('\n🎉 结构化风险分析测试完成!');
}).catch(error => {
  console.error('\n💥 测试失败:', error);
  process.exit(1);
}); 