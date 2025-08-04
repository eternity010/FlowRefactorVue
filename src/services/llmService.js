const OpenAI = require('openai');

class LLMService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: '13c67fe3-4c11-4ed8-9f77-3aad5eafa06a',
      baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
    });
    
    this.model = 'ep-20250727172335-klkbs';
    this.defaultSystemMessage = '你是人工智能助手';
  }

  /**
   * 单轮对话
   * @param {string} userMessage - 用户消息
   * @param {string} systemMessage - 系统提示词 (可选)
   * @param {boolean} stream - 是否使用流式响应
   * @returns {Object} 大模型响应结果
   */
  async chat(userMessage, systemMessage = null, stream = false) {
    try {
      const messages = [
        { 
          role: "system", 
          content: systemMessage || this.defaultSystemMessage 
        },
        { 
          role: "user", 
          content: userMessage 
        }
      ];

      if (stream) {
        // 流式响应
        const streamResponse = await this.openai.chat.completions.create({
          messages: messages,
          model: this.model,
          temperature: 0.7,
          max_tokens: 2000,
          stream: true
        });

        return {
          success: true,
          data: {
            stream: streamResponse,
            model: this.model,
            timestamp: new Date().toISOString()
          }
        };
      } else {
        // 非流式响应
        const completion = await this.openai.chat.completions.create({
          messages: messages,
          model: this.model,
          temperature: 0.7,
          max_tokens: 2000
        });

        return {
          success: true,
          data: {
            content: completion.choices && completion.choices[0] && completion.choices[0].message && completion.choices[0].message.content,
            usage: completion.usage,
            model: completion.model,
            timestamp: new Date().toISOString()
          }
        };
      }
    } catch (error) {
      console.error('LLM API调用失败:', error);
      return {
        success: false,
        error: error.message || '大模型API调用失败'
      };
    }
  }

  /**
   * 多轮对话
   * @param {Array} messages - 对话历史消息数组
   * @param {boolean} stream - 是否使用流式响应
   * @returns {Object} 大模型响应结果
   */
  async chatWithHistory(messages, stream = false) {
    try {
      if (stream) {
        // 流式响应
        const streamResponse = await this.openai.chat.completions.create({
          messages: messages,
          model: this.model,
          temperature: 0.7,
          max_tokens: 2000,
          stream: true
        });

        return {
          success: true,
          data: {
            stream: streamResponse,
            model: this.model,
            timestamp: new Date().toISOString()
          }
        };
      } else {
        // 非流式响应
        const completion = await this.openai.chat.completions.create({
          messages: messages,
          model: this.model,
          temperature: 0.7,
          max_tokens: 2000
        });

        return {
          success: true,
          data: {
            content: completion.choices && completion.choices[0] && completion.choices[0].message && completion.choices[0].message.content,
            usage: completion.usage,
            model: completion.model,
            timestamp: new Date().toISOString()
          }
        };
      }
    } catch (error) {
      console.error('LLM API调用失败:', error);
      return {
        success: false,
        error: error.message || '大模型API调用失败'
      };
    }
  }

  /**
   * 流程分析专用接口
   * @param {Object} processData - 流程数据
   * @returns {Object} 分析结果
   */
  async analyzeProcess(processData) {
    const systemMessage = `你是业务流程分析师，分析流程数据并提供优化建议。`;
    const userMessage = `请分析以下流程数据：\n${JSON.stringify(processData, null, 2)}`;
    return await this.chat(userMessage, systemMessage);
  }

  /**
   * 风险评估专用接口
   * @param {Object} riskData - 风险数据
   * @returns {Object} 风险评估结果
   */
  async assessRisks(riskData) {
    const systemMessage = `你是风险评估专家，分析风险等级并提供应对建议。`;
    const userMessage = `请评估以下风险数据：\n${JSON.stringify(riskData, null, 2)}`;
    return await this.chat(userMessage, systemMessage);
  }

  /**
   * 智能推荐专用接口
   * @param {Object} contextData - 上下文数据
   * @returns {Object} 推荐结果
   */
  async getRecommendations(contextData) {
    const systemMessage = `你是智能推荐系统，提供具体可执行的业务流程优化建议。`;
    const userMessage = `基于以下数据，请提供优化推荐：\n${JSON.stringify(contextData, null, 2)}`;
    return await this.chat(userMessage, systemMessage);
  }

  /**
   * 检查API连接状态
   * @returns {Object} 连接状态
   */
  async checkConnection() {
    try {
      const testResult = await this.chat("你好", "你是人工智能助手");
      return {
        success: true,
        connected: testResult.success,
        message: testResult.success ? 'API连接正常' : 'API连接失败'
      };
    } catch (error) {
      return {
        success: false,
        connected: false,
        message: 'API连接测试失败',
        error: error.message
      };
    }
  }

  /**
   * 流式对话辅助方法 - 处理流式响应
   * @param {Object} stream - 流式响应对象
   * @returns {Promise<string>} 完整的响应内容
   */
  async processStreamResponse(stream) {
    let fullContent = '';
    try {
      for await (const part of stream) {
        const content = (part.choices && part.choices[0] && part.choices[0].delta && part.choices[0].delta.content) || '';
        fullContent += content;
      }
      return fullContent;
    } catch (error) {
      console.error('处理流式响应失败:', error);
      throw error;
    }
  }
}

module.exports = LLMService; 