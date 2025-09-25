const LLMService = require('../src/services/llmService');

async function testLLMService() {
  console.log('开始测试 LLM 服务...\n');
  
  const llmService = new LLMService();
  
  // 检查配置
  console.log('配置信息:');
  console.log('- Base URL:', llmService.openai.baseURL);
  console.log('- Model:', llmService.model);
  console.log('- 默认系统消息:', llmService.defaultSystemMessage);
  console.log('\n');
  
  // 注意：如果您还没有设置正确的端点ID，以下测试会失败
  if (llmService.model === '{TEMPLATE_ENDPOINT_ID}') {
    console.log('⚠️  警告: 请先在 src/services/llmService.js 中设置您的实际端点ID');
    console.log('   将 {TEMPLATE_ENDPOINT_ID} 替换为您的实际端点ID，例如: ep-20241215103502-8dlw9');
    console.log('\n');
    return;
  }
  
  try {
    console.log('----- 标准请求测试 -----');
    const result = await llmService.chat('你好');
    if (result.success) {
      console.log('✅ 连接成功!');
      console.log('回复:', result.data.content);
      console.log('使用情况:', result.data.usage);
    } else {
      console.log('❌ 请求失败:', result.error);
    }
    console.log('\n');
    
    console.log('----- 流式请求测试 -----');
    const streamResult = await llmService.chat('请简单介绍一下你自己', null, true);
    if (streamResult.success) {
      console.log('✅ 流式连接成功!');
      console.log('开始接收流式响应:');
      
      // 处理流式响应
      const fullContent = await llmService.processStreamResponse(streamResult.data.stream);
      console.log('完整回复:', fullContent);
    } else {
      console.log('❌ 流式请求失败:', streamResult.error);
    }
    console.log('\n');
    
    console.log('----- 专业功能测试 -----');
    // 测试流程分析功能
    const processData = {
      name: '用户注册流程',
      steps: ['填写信息', '验证邮箱', '创建账户'],
      estimatedTime: 300
    };
    
    const analysisResult = await llmService.analyzeProcess(processData);
    if (analysisResult.success) {
      console.log('✅ 流程分析功能正常');
      console.log('分析结果:', analysisResult.data.content);
    } else {
      console.log('❌ 流程分析失败:', analysisResult.error);
    }
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
  }
}

// 运行测试
testLLMService().then(() => {
  console.log('\n测试完成!');
}).catch(error => {
  console.error('测试失败:', error);
}); 