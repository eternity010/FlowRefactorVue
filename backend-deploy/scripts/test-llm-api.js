const LLMService = require('../src/services/llmService');

// 测试LLM API功能
async function testLLMAPI() {
  console.log('🧪 开始测试LLM API...\n');

  const llmService = new LLMService();

  try {
    // 测试1: 简单对话
    console.log('📝 测试1: 简单对话');
    const chatResult = await llmService.chat(
      '你好，请简单介绍一下你的功能',
      '你是一个专业的业务流程分析助手'
    );
    
    if (chatResult.success) {
      console.log('✅ 对话测试成功');
      console.log('💬 响应内容:', chatResult.data.content.substring(0, 100) + '...');
      console.log('📊 Token使用量:', chatResult.data.usage);
    } else {
      console.log('❌ 对话测试失败:', chatResult.error);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试2: 流程分析
    console.log('📊 测试2: 流程分析');
    const processData = {
      processName: '采购流程',
      steps: [
        { name: '需求确认', duration: 2, resources: ['采购专员'] },
        { name: '供应商选择', duration: 5, resources: ['采购经理'] },
        { name: '合同签署', duration: 3, resources: ['法务', '采购经理'] },
        { name: '验收入库', duration: 1, resources: ['仓管员'] }
      ],
      totalDuration: 11,
      totalCost: 50000
    };

    const analysisResult = await llmService.analyzeProcess(processData);
    
    if (analysisResult.success) {
      console.log('✅ 流程分析测试成功');
      console.log('📝 分析结果:', analysisResult.data.content.substring(0, 200) + '...');
    } else {
      console.log('❌ 流程分析测试失败:', analysisResult.error);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试3: 连接状态检查
    console.log('🔗 测试3: 连接状态检查');
    const connectionResult = await llmService.checkConnection();
    
    if (connectionResult.success) {
      console.log('✅ 连接检查成功');
      console.log('🌐 连接状态:', connectionResult.connected ? '已连接' : '未连接');
      console.log('📢 状态消息:', connectionResult.message);
    } else {
      console.log('❌ 连接检查失败:', connectionResult.error);
    }

  } catch (error) {
    console.error('💥 测试过程中发生错误:', error.message);
  }

  console.log('\n🏁 LLM API测试完成');
}

// 运行测试
if (require.main === module) {
  testLLMAPI().catch(console.error);
}

module.exports = { testLLMAPI }; 