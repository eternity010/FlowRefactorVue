// 后端服务类统一导出文件 (仅用于Node.js环境)

const FlowDataService = require('./flowDataService');
const PlanningTimeService = require('./planningTimeService');
const NeuralNetworkService = require('./neuralNetworkService');
const ProcessOptimizationService = require('./processOptimizationService');
const LLMService = require('./llmService');

module.exports = {
  FlowDataService,
  PlanningTimeService,
  NeuralNetworkService,
  ProcessOptimizationService,
  LLMService
}; 