<template>
  <div class="llm-chat-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>
        <i class="el-icon-chat-line-square"></i>
        大模型对话
      </h2>
      <p class="header-desc">与AI助手进行智能对话，获取流程分析和优化建议</p>
    </div>

    <!-- 连接状态卡片 -->
    <el-card class="status-card" shadow="never">
      <div class="status-info">
        <div class="status-item">
          <span class="status-label">连接状态:</span>
          <el-tag :type="connectionStatus ? 'success' : 'danger'" size="small">
            {{ connectionStatus ? '已连接' : '未连接' }}
          </el-tag>
        </div>
        <div class="status-item">
          <span class="status-label">模型:</span>
          <el-tag type="info" size="small">DeepSeek Chat</el-tag>
        </div>
        <el-button 
          type="primary" 
          size="mini" 
          :loading="checkingConnection"
          @click="checkConnection">
          测试连接
        </el-button>
      </div>
    </el-card>

    <!-- 聊天界面 -->
    <el-card class="chat-card" shadow="never">
      <!-- 消息历史区域 -->
      <div class="chat-messages" ref="chatMessages">
        <div v-if="messages.length === 0" class="welcome-message">
          <div class="welcome-content">
            <i class="el-icon-chat-line-square welcome-icon"></i>
            <h3>欢迎使用AI助手</h3>
            <p>我可以帮助您进行：</p>
            <ul>
              <li>• 流程分析和优化建议</li>
              <li>• 风险评估和预防措施</li>
              <li>• 资源配置优化</li>
              <li>• 业务流程咨询</li>
            </ul>
            <p>请输入您的问题开始对话...</p>
          </div>
        </div>

        <div v-for="(message, index) in messages" :key="index" class="message-item">
          <div :class="['message', message.role === 'user' ? 'user-message' : 'ai-message']">
            <div class="message-avatar">
              <i :class="message.role === 'user' ? 'el-icon-user' : 'el-icon-cpu'"></i>
            </div>
            <div class="message-content">
              <div class="message-header">
                <span class="message-sender">
                  {{ message.role === 'user' ? '您' : 'AI助手' }}
                </span>
                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
              </div>
              <div class="message-text" v-html="formatMessage(message.content)"></div>
            </div>
          </div>
        </div>

        <!-- 加载中指示器 -->
        <div v-if="loading" class="message-item">
          <div class="message ai-message">
            <div class="message-avatar">
              <i class="el-icon-cpu"></i>
            </div>
            <div class="message-content">
              <div class="message-header">
                <span class="message-sender">AI助手</span>
                <span class="message-time">正在思考...</span>
              </div>
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="chat-input-area">
        <div class="input-controls">
          <el-button size="small" @click="clearChat" :disabled="loading">清空对话</el-button>
        </div>
        
        <div class="input-wrapper">
          <el-input
            type="textarea"
            v-model="inputMessage"
            placeholder="请输入您的问题... (按Ctrl+Enter发送)"
            :rows="3"
            :disabled="loading"
            @keydown.ctrl.enter="sendMessage"
            maxlength="1000"
            show-word-limit>
          </el-input>
          <el-button 
            type="primary" 
            :loading="loading"
            :disabled="!inputMessage.trim() || !connectionStatus"
            @click="sendMessage"
            class="send-button">
            发送
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { llmApi } from '@/services';

export default {
  name: 'LLMChatView',
  data() {
    return {
      // 连接状态
      connectionStatus: false,
      checkingConnection: false,
      
      // 消息相关
      messages: [],
      inputMessage: '',
      loading: false
    };
  },
  
  mounted() {
    this.checkConnection();
  },
  
  methods: {
    // 检查连接状态
    async checkConnection() {
      this.checkingConnection = true;
      try {
        const result = await llmApi.checkConnection();
        this.connectionStatus = result.connected;
        
        if (result.connected) {
          this.$message.success('大模型API连接正常');
        } else {
          this.$message.error('大模型API连接失败，请检查配置');
        }
      } catch (error) {
        this.connectionStatus = false;
        this.$message.error('连接测试失败: ' + error.message);
      } finally {
        this.checkingConnection = false;
      }
    },
    
    // 发送消息
    async sendMessage() {
      if (!this.inputMessage.trim()) return;
      if (!this.connectionStatus) {
        this.$message.warning('请先检查API连接状态');
        return;
      }
      
      const userMessage = this.inputMessage.trim();
      
      // 添加用户消息
      this.messages.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      });
      
      // 清空输入
      this.inputMessage = '';
      this.loading = true;
      
      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      
      try {
        // 构建对话历史
        const chatHistory = this.buildChatHistory();
        
        // 调用大模型API
        const result = await llmApi.chatWithHistory(chatHistory);
        
        if (result.success) {
          // 添加AI回复
          this.messages.push({
            role: 'assistant',
            content: result.data.content,
            timestamp: new Date(),
            usage: result.data.usage
          });
        } else {
          throw new Error(result.error || '对话失败');
        }
      } catch (error) {
        console.error('对话API调用失败:', error);
        this.$message.error('对话失败: ' + error.message);
        
        // 添加包含具体错误信息的消息
        this.messages.push({
          role: 'assistant',
          content: `抱歉，调用大模型时出现错误：${error.message}`,
          timestamp: new Date(),
          error: true
        });
      } finally {
        this.loading = false;
        this.$nextTick(() => {
          this.forceScrollToBottom(); // 使用强制滚动确保长消息能正确显示
        });
      }
    },
    
    // 构建对话历史
    buildChatHistory() {
      const chatMessages = this.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      return chatMessages;
    },
    
    // 清空对话
    clearChat() {
      this.$confirm('确定要清空所有对话记录吗？', '确认清空', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.messages = [];
        this.$message.success('对话已清空');
      });
    },
    
    // 格式化消息内容
    formatMessage(content) {
      if (!content) return '';
      
      // 简单的markdown转换
      return content
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
    },
    
    // 格式化时间
    formatTime(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return date.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    },
    
    // 滚动到底部
    scrollToBottom() {
      const chatMessages = this.$refs.chatMessages;
      if (chatMessages) {
        // 使用setTimeout确保DOM完全更新后再滚动
        setTimeout(() => {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
      }
    },

    // 强制滚动到底部（用于长消息）
    forceScrollToBottom() {
      const chatMessages = this.$refs.chatMessages;
      if (chatMessages) {
        // 多次尝试滚动，确保长内容能正确滚动
        const scrollAttempts = [0, 100, 300, 500];
        scrollAttempts.forEach(delay => {
          setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
          }, delay);
        });
      }
    },


  },
  
  watch: {
    // 监听消息数组变化，自动滚动到底部
    messages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.llm-chat-container {
  padding: 20px;
  background-color: #f5f7fa;
  height: calc(100vh - 60px);
  max-height: calc(100vh - 60px); /* 确保绝对不会超出 */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative; /* 为绝对定位提供参考 */
}

.page-header {
  margin-bottom: 16px;
  flex-shrink: 0; /* 防止被压缩 */
  height: 70px; /* 稍微增加头部高度 */
}

.page-header h2 {
  color: #303133;
  margin: 0 0 8px 0;
  font-size: 24px;
}

.page-header h2 i {
  margin-right: 8px;
  color: #409eff;
}

.header-desc {
  color: #606266;
  margin: 0;
  font-size: 14px;
}

.status-card {
  margin-bottom: 16px;
  flex-shrink: 0; /* 防止被压缩 */
  min-height: 70px; /* 稍微增加状态卡片高度 */
}

.status-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-label {
  color: #606266;
  font-size: 14px;
}

.chat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 确保flex子元素能够正确收缩 */
  max-height: calc(100vh - 270px); /* 严格限制最大高度，进一步缩小聊天卡片区域 */
  overflow: hidden; /* 防止溢出 */
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  background-color: #fafbfc;
  border-radius: 4px;
  min-height: 0; /* 允许收缩 */
  max-height: calc(100vh - 450px); /* 严格限制高度：进一步缩小聊天区域，为输入区域留出更多空间 */
  width: 100%;
  box-sizing: border-box; /* 包含padding在宽度内 */
}

.welcome-message {
  text-align: center;
  padding: 40px 20px;
  color: #909399;
}

.welcome-content .welcome-icon {
  font-size: 48px;
  color: #409eff;
  margin-bottom: 16px;
}

.welcome-content h3 {
  color: #303133;
  margin-bottom: 16px;
}

.welcome-content ul {
  text-align: left;
  display: inline-block;
  margin: 16px 0;
}

.message-item {
  margin-bottom: 20px;
  width: 100%;
  overflow: hidden; /* 防止子元素溢出 */
}

.message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  max-width: 100%;
  overflow: hidden; /* 防止溢出 */
}

.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: white;
  flex-shrink: 0;
}

.user-message .message-avatar {
  background-color: #409eff;
}

.ai-message .message-avatar {
  background-color: #67c23a;
}

.message-content {
  max-width: 70%;
  min-width: 0; /* 允许内容收缩 */
  background-color: white;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-wrap: break-word; /* 强制换行 */
  word-break: break-word; /* 兼容性更好的换行 */
}

.user-message .message-content {
  background-color: #409eff;
  color: white;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
}

.user-message .message-header {
  color: rgba(255, 255, 255, 0.8);
}

.ai-message .message-header {
  color: #909399;
}

.message-sender {
  font-weight: bold;
}

.message-text {
  line-height: 1.6;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap; /* 保留换行和空格 */
  max-width: 100%;
  overflow: hidden; /* 防止溢出 */
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #409eff;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.chat-input-area {
  padding: 20px;
  border-top: 1px solid #ebeef5;
  background-color: white;
  flex-shrink: 0; /* 防止被压缩 */
  min-height: 160px; /* 增加输入区域高度，给输入框更多空间 */
  max-height: 200px; /* 限制最大高度 */
}

.input-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 12px;
}



.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.input-wrapper .el-textarea {
  flex: 1;
}

.send-button {
  height: 40px;
}

/* 滚动条样式优化 */
.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
  margin: 4px 0;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

.chat-messages::-webkit-scrollbar-thumb:active {
  background: #606266;
}

/* 确保消息容器的滚动行为 */
.chat-messages {
  scroll-behavior: smooth;
}

/* 为Firefox提供滚动条样式 */
.chat-messages {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

/* 响应式设计 - 小屏幕优化 */
@media (max-width: 768px) {
  .message-content {
    max-width: 85%; /* 小屏幕上使用更大的宽度 */
  }
  
  .llm-chat-container {
    padding: 12px; /* 减少边距 */
    height: calc(100vh - 40px); /* 小屏幕调整高度 */
    max-height: calc(100vh - 40px);
  }
  
  .chat-messages {
    padding: 12px; /* 减少内边距 */
    max-height: calc(100vh - 360px); /* 小屏幕调整聊天区域高度，进一步缩小 */
  }
  
  .page-header {
    height: 50px; /* 小屏幕减少头部高度 */
  }
  
  .chat-input-area {
    min-height: 120px; /* 小屏幕减少输入区域高度 */
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .message-content {
    max-width: 90%; /* 更小屏幕上使用更大的宽度 */
  }
  
  .message {
    gap: 8px; /* 减少间距 */
  }
  
  .llm-chat-container {
    padding: 8px; /* 更小边距 */
    height: calc(100vh - 30px); /* 更小屏幕调整高度 */
    max-height: calc(100vh - 30px);
  }
  
  .chat-messages {
    padding: 8px; /* 更小内边距 */
    max-height: calc(100vh - 340px); /* 更小屏幕调整聊天区域高度，进一步缩小 */
  }
  
  .page-header {
    height: 45px; /* 更小屏幕进一步减少头部高度 */
  }
  
  .chat-input-area {
    min-height: 100px; /* 更小屏幕进一步减少输入区域高度 */
    padding: 10px;
  }
}
</style> 