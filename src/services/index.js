// 服务层统一导出文件

// 前端API客户端
export { planningTimeApi } from '../api/planningTimeApi';
export { processDataApi } from '../api/processDataApi';
export { subProcessDataApi } from '../api/subProcessDataApi';

// 后端数据库服务类
const FlowDataService = require('./flowDataService');
const PlanningTimeService = require('./planningTimeService');
const NeuralNetworkService = require('./neuralNetworkService');
const ProcessOptimizationService = require('./processOptimizationService');

module.exports = {
  FlowDataService,
  PlanningTimeService,
  NeuralNetworkService,
  ProcessOptimizationService
};

// API服务器
export { startServer, app } from './apiServer';

// 服务层说明
/**
 * 服务层架构说明：
 * 
 * 1. 专门的API客户端文件 (planningTimeApi.js, processDataApi.js, subProcessDataApi.js)
 *    - 运行在浏览器环境
 *    - 使用axios发送HTTP请求
 *    - 为Vue组件提供专门的API调用接口
 * 
 * 2. flowDataService.js - 流程数据库服务
 *    - 运行在Node.js环境
 *    - 直接操作MongoDB数据库
 *    - 提供流程数据查询和操作方法
 * 
 * 3. apiServer.js - API服务器
 *    - 运行在Node.js环境
 *    - 使用Express.js提供REST API
 *    - 连接前端客户端和数据库服务
 * 
 * 数据流向：
 * Vue组件 → 专门API客户端 → apiServer.js → flowDataService.js → MongoDB
 */ 