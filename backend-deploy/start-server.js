#!/usr/bin/env node
/**
 * 后端API服务器启动脚本
 * 生产环境启动入口
 */

const { startServer } = require('./services/apiServer');

// 设置生产环境
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

console.log('🚀 正在启动后端API服务器...');
console.log(`📍 环境: ${process.env.NODE_ENV}`);
console.log(`📂 工作目录: ${process.cwd()}`);
console.log(`⏰ 启动时间: ${new Date().toISOString()}`);

// 启动服务器
startServer();

// 错误处理
process.on('uncaughtException', (error) => {
  console.error('❌ 未捕获异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ 未处理的Promise拒绝:', reason);
  process.exit(1);
});
