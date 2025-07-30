const LLMService = require('../src/services/llmService');

async function testChatHistory() {
  console.log('开始测试多轮对话功能...\n');
  
  const llmService = new LLMService();
  
  // 测试1: 基本多轮对话
  console.log('=== 测试1: 基本多轮对话 ===');
  const messages1 = [
    { role: 'system', content: '你是人工智能助手' },
    { role: 'user', content: '你好' },
    { role: 'assistant', content: '你好！有什么我可以帮助你的吗？' },
    { role: 'user', content: '我刚才问了什么？' }
  ];
  
  try {
    const result1 = await llmService.chatWithHistory(messages1);
    console.log('✅ 测试1结果:');
    console.log('成功:', result1.success);
    if (result1.success) {
      console.log('回复:', result1.data.content);
      console.log('模型:', result1.data.model);
      console.log('使用情况:', result1.data.usage);
    } else {
      console.log('错误:', result1.error);
    }
  } catch (error) {
    console.log('❌ 测试1异常:', error.message);
  }
  
  console.log('\n=== 测试2: 空消息数组 ===');
  
  try {
    const result2 = await llmService.chatWithHistory([]);
    console.log('✅ 测试2结果:');
    console.log('成功:', result2.success);
    if (!result2.success) {
      console.log('错误:', result2.error);
    }
  } catch (error) {
    console.log('❌ 测试2异常:', error.message);
  }
  
  console.log('\n=== 测试3: 单条消息 ===');
  const messages3 = [
    { role: 'user', content: '现在是几点？' }
  ];
  
  try {
    const result3 = await llmService.chatWithHistory(messages3);
    console.log('✅ 测试3结果:');
    console.log('成功:', result3.success);
    if (result3.success) {
      console.log('回复:', result3.data.content);
    } else {
      console.log('错误:', result3.error);
    }
  } catch (error) {
    console.log('❌ 测试3异常:', error.message);
  }
  
  console.log('\n=== 测试4: 流式多轮对话 ===');
  const messages4 = [
    { role: 'user', content: '请简单介绍一下Vue.js' }
  ];
  
  try {
    const result4 = await llmService.chatWithHistory(messages4, true);
    console.log('✅ 测试4结果:');
    console.log('成功:', result4.success);
    if (result4.success) {
      console.log('开始接收流式响应...');
      const content = await llmService.processStreamResponse(result4.data.stream);
      console.log('完整回复:', content);
    } else {
      console.log('错误:', result4.error);
    }
  } catch (error) {
    console.log('❌ 测试4异常:', error.message);
  }
  
  console.log('\n=== 测试5: 错误消息格式 ===');
  
  try {
    const result5 = await llmService.chatWithHistory("这不是数组");
    console.log('✅ 测试5结果:');
    console.log('成功:', result5.success);
    if (!result5.success) {
      console.log('错误:', result5.error);
    }
  } catch (error) {
    console.log('❌ 测试5异常:', error.message);
  }
}

// 运行测试
testChatHistory().then(() => {
  console.log('\n测试完成!');
}).catch(error => {
  console.error('测试失败:', error);
}); 