# 服务层架构文档

## 概述

本项目采用三层架构设计，服务层位于前端和后端之间，提供统一的数据访问接口。

## 文件结构

```
src/services/
├── flowDataService.js         # 流程数据库服务
├── planningTimeService.js     # 规划时间数据服务
├── neuralNetworkService.js    # 神经网络参数服务
├── processOptimizationService.js # 流程优化服务
├── riskDataService.js         # 风险数据服务 (新增)
├── llmService.js             # 大模型服务 (新增)
├── apiServer.js              # Express API服务器
└── index.js                  # 服务层统一导出

src/api/
├── planningTimeApi.js        # 规划时间API客户端
├── processDataApi.js         # 流程数据API客户端
├── processOptimizationApi.js # 流程优化API客户端
├── subProcessDataApi.js      # 子流程数据API客户端
├── neuralNetworkApi.js       # 神经网络参数API客户端
├── riskDataApi.js           # 风险数据API客户端 (新增)
└── llmApi.js                # 大模型API客户端 (新增)
```

## 各文件职责

### 前端API客户端 (src/api/)

#### 1. API客户端通用特性
- **运行环境**: 浏览器 (Vue.js)
- **技术栈**: Axios
- **主要职责**:
  - 封装HTTP请求
  - 提供前端组件调用的API方法
  - 处理请求/响应拦截
  - 错误处理和重试机制
  - 离线模式支持

#### 2. `processDataApi.js` - 流程数据API客户端
- 流程数据获取和管理
- 趋势分析和统计查询
- 数据库连接状态检查

#### 3. `planningTimeApi.js` - 规划时间API客户端
- 规划时间数据管理
- 预测方案和准确度分析
- 历史数据查询

#### 4. `neuralNetworkApi.js` - 神经网络参数API客户端
- 参数配置管理
- 参数验证和更新
- 配置导入导出
- 离线模式支持

#### 5. `processOptimizationApi.js` - 流程优化API客户端 (新增)
- 流程优化案例数据获取
- 流程图数据管理（before、after、after2、llm）
- 资源变化分析数据
- 甘特图数据管理
- 优化案例搜索功能

#### 6. `subProcessDataApi.js` - 子流程数据API客户端
- 子流程数据获取
- Mermaid流程图数据管理

#### 7. `riskDataApi.js` - 风险数据API客户端 (新增)
- 风险数据获取和管理
- 风险数据库连接状态检查
- 风险数据统计和分析

#### 8. `llmApi.js` - 大模型API客户端 (新增)
- 单轮和多轮对话功能
- 流程分析和风险评估调用
- 智能推荐获取
- 大模型连接状态检查
- 使用统计获取

### 后端服务层 (src/services/)

#### 1. `flowDataService.js` - 流程数据库服务
- **运行环境**: Node.js
- **技术栈**: MongoDB Driver
- **主要职责**:
  - 流程数据、子流程数据的CRUD操作
  - Mermaid流程图数据管理
  - 数据聚合和分析
  - 搜索和查询功能

#### 2. `planningTimeService.js` - 规划时间数据服务
- **运行环境**: Node.js
- **技术栈**: MongoDB Driver
- **主要职责**:
  - 规划时间数据管理
  - 重构时机数据处理
  - 大模型分析数据管理
  - 预测方案和准确度跟踪

#### 3. `neuralNetworkService.js` - 神经网络参数服务
- **运行环境**: Node.js
- **技术栈**: MongoDB Driver
- **主要职责**:
  - 神经网络参数CRUD操作
  - 参数验证和历史记录
  - 配置管理和导入导出
  - 统计信息生成

#### 4. `processOptimizationService.js` - 流程优化服务
- **运行环境**: Node.js
- **技术栈**: MongoDB Driver
- **主要职责**:
  - 流程优化案例CRUD操作
  - 流程图数据管理（before、after、after2、llm版本）
  - 资源变化分析数据处理
  - 甘特图数据管理
  - 优化案例搜索和统计

#### 5. `riskDataService.js` - 风险数据服务 (新增)
- **运行环境**: Node.js
- **技术栈**: MongoDB Driver
- **主要职责**:
  - 风险数据提取和管理
  - 连接maintenance_system数据库的risk_data集合
  - 风险数据统一访问接口
  - 数据库连接状态监控

#### 6. `llmService.js` - 大模型服务 (新增)
- **运行环境**: Node.js
- **技术栈**: OpenAI SDK, 火山引擎Ark API
- **主要职责**:
  - 单轮和多轮对话管理
  - 流程分析和风险评估
  - 智能推荐和优化建议
  - 流式响应处理
  - API连接状态检查

#### 7. `apiServer.js` - Express API服务器
- **运行环境**: Node.js
- **技术栈**: Express.js, CORS
- **主要职责**:
  - 提供RESTful API接口
  - 路由管理和中间件配置
  - 统一响应格式处理
  - 错误处理和日志记录
  - 服务器生命周期管理

## 数据流向

```
前端组件
    ↓
API客户端 (processDataApi, planningTimeApi, neuralNetworkApi, processOptimizationApi, subProcessDataApi, riskDataApi, llmApi)
    ↓
apiServer.js (Express API服务器)
    ↓
后端服务 (flowDataService, planningTimeService, neuralNetworkService, processOptimizationService, riskDataService, llmService)
    ↓
MongoDB数据库 / 火山引擎Ark API
```

### 具体数据流

#### 流程数据流
```
Vue组件 → processDataApi → apiServer → flowDataService → MongoDB
```

#### 规划时间数据流
```
Vue组件 → planningTimeApi → apiServer → planningTimeService → MongoDB
```

#### 神经网络参数流
```
Vue组件 → neuralNetworkApi → apiServer → neuralNetworkService → MongoDB
```

#### 流程优化数据流
```
Vue组件 → processOptimizationApi → apiServer → processOptimizationService → MongoDB
```

#### 风险数据流 (新增)
```
Vue组件 → riskDataApi → apiServer → riskDataService → MongoDB(risk_data)
```

#### 大模型服务流 (新增)
```
Vue组件 → llmApi → apiServer → llmService → 火山引擎Ark API
```

## API端点列表

### 流程数据API (flowDataService)

| 端点 | 方法 | 描述 | 后端方法 |
|------|------|------|----------|
| `/api/flow-data` | GET | 获取所有流程数据 | `getAllFlowData()` |
| `/api/flow-data/:type` | GET | 根据类型获取流程数据 | `getFlowDataByType()` |
| `/api/flow-summary` | GET | 获取流程摘要 | `getFlowSummary()` |
| `/api/flow-trends` | GET | 获取趋势分析 | `getFlowTrendAnalysis()` |
| `/api/monthly-data/:type` | GET | 获取指定流程月度数据 | `getMonthlyDataByType()` |
| `/api/panel-data/:type` | GET | 获取指定流程关键指标 | `getPanelDataByType()` |
| `/api/database-stats` | GET | 获取数据库统计信息 | `getDatabaseStats()` |
| `/api/sub-process-data` | GET | 获取子流程数据 | `getSubProcessData()` |
| `/api/sub-process-data/:type` | GET | 获取指定类型子流程数据 | `getSubProcessDataByType()` |
| `/api/mermaid-flow/:type` | GET | 获取Mermaid流程图数据 | `getMermaidFlowData()` |
| `/api/mermaid-flows` | GET | 获取所有Mermaid流程图数据 | `getAllMermaidFlowData()` |
| `/api/total-data` | GET | 获取总数据 | `getTotalData()` |
| `/api/search-flow` | GET | 搜索流程数据 | `searchFlowData()` |
| `/api/flow-data-by-latest` | GET | 按最新数值排序获取数据 | `getFlowDataByLatestValue()` |
| `/api/flows-by-panel` | GET | 获取包含特定面板指标的流程 | `getFlowsByPanelLabel()` |
| `/api/multiple-flow-data` | GET | 批量获取多个流程类型数据 | `getMultipleFlowData()` |
| `/api/refresh-data` | POST | 触发数据刷新 | 系统操作 |

### 规划时间API (planningTimeService)

| 端点 | 方法 | 描述 | 后端方法 |
|------|------|------|----------|
| `/api/planning-time` | GET | 获取完整规划时间数据 | `getPlanningTimeData()` |
| `/api/planning-time/statistics` | GET | 获取统计数据 | `getStatistics()` |
| `/api/planning-time/sample-data` | GET | 获取样本数据 | `getSampleData()` |
| `/api/planning-time/prediction-schemes` | GET | 获取预测方案数据 | `getPredictionSchemes()` |
| `/api/planning-time/prediction-schemes/:id` | GET | 获取指定预测方案 | `getPredictionSchemeById()` |
| `/api/planning-time/accuracy-history` | GET | 获取历史准确度数据 | `getAccuracyHistory()` |
| `/api/refactor-timing` | GET | 获取重构时机数据 | `getRefactorTimingData()` |
| `/api/refactor-timing/latest` | GET | 获取最新重构时机数据 | `getLatestRefactorTimingData()` |
| `/api/llm-analysis` | GET | 获取大模型分析数据 | `getLLMAnalysisData()` |
| `/api/llm-analysis/latest` | GET | 获取最新大模型分析报告 | `getLatestLLMAnalysisReport()` |

### 神经网络参数API (neuralNetworkService)

| 端点 | 方法 | 描述 | 后端方法 |
|------|------|------|----------|
| `/api/neural-network/parameters` | GET | 获取所有参数配置 | `getNeuralNetworkParameters()` |
| `/api/neural-network/parameters/current` | GET | 获取当前参数值 | `getCurrentNeuralNetworkParameters()` |
| `/api/neural-network/parameters/default` | GET | 获取默认参数配置 | `getDefaultNeuralNetworkParameters()` |
| `/api/neural-network/parameters/definitions` | GET | 获取参数定义信息 | `getNeuralNetworkParameterDefinitions()` |
| `/api/neural-network/parameters/category/:category` | GET | 获取特定类别参数 | `getNeuralNetworkParametersByCategory()` |
| `/api/neural-network/parameters` | PUT | 更新参数配置 | `updateNeuralNetworkParameters()` |
| `/api/neural-network/parameters/reset` | POST | 重置参数为默认值 | `resetNeuralNetworkParameters()` |
| `/api/neural-network/parameters/save` | POST | 保存参数配置 | `saveNeuralNetworkParameterConfig()` |
| `/api/neural-network/parameters/configs` | GET | 获取保存的配置列表 | `getSavedNeuralNetworkConfigs()` |
| `/api/neural-network/parameters/configs/:name` | GET | 加载保存的配置 | `loadNeuralNetworkParameterConfig()` |
| `/api/neural-network/parameters/configs/:name` | DELETE | 删除保存的配置 | `deleteNeuralNetworkParameterConfig()` |
| `/api/neural-network/parameters/stats` | GET | 获取参数使用统计 | `getNeuralNetworkParameterStats()` |
| `/api/neural-network/parameters/validate` | POST | 验证参数值 | `validateNeuralNetworkParameters()` |
| `/api/neural-network/parameters/history` | GET | 获取参数历史记录 | `getNeuralNetworkParameterHistory()` |
| `/api/neural-network/parameters/export` | GET | 导出参数配置 | `exportNeuralNetworkParameters()` |
| `/api/neural-network/parameters/import` | POST | 导入参数配置 | `importNeuralNetworkParameters()` |

### 流程优化API (processOptimizationService)

| 端点 | 方法 | 描述 | 后端方法 |
|------|------|------|----------|
| `/api/process-optimization` | GET | 获取所有优化案例 | `getAllOptimizations()` |
| `/api/process-optimization/:id` | GET | 获取特定优化案例 | `getOptimizationById()` |
| `/api/process-optimization/:id/flowcharts` | GET | 获取流程图数据 | `getOptimizationFlowcharts()` |
| `/api/process-optimization/:id/resources` | GET | 获取资源变化分析 | `getOptimizationResources()` |
| `/api/process-optimization/:id/gantt` | GET | 获取甘特图数据 | `getOptimizationGantt()` |
| `/api/process-optimization/search` | GET | 搜索优化案例 | `searchOptimizations()` |
| `/api/process-optimization/stats` | GET | 获取优化数据统计 | `getOptimizationStats()` |
| `/api/process-optimization/connection` | GET | 检查数据库连接 | `checkConnection()` |

### 风险数据API (riskDataService) - 新增

| 端点 | 方法 | 描述 | 后端方法 |
|------|------|------|----------|
| `/api/risk-data` | GET | 获取所有风险数据 | `getAllRiskData()` |
| `/api/risk-data/connection` | GET | 检查数据库连接状态 | `checkConnection()` |

### 大模型API (llmService) - 新增

| 端点 | 方法 | 描述 | 后端方法 |
|------|------|------|----------|
| `/api/llm/chat` | POST | 单轮对话 | `chat()` |
| `/api/llm/chat-history` | POST | 多轮对话 | `chatWithHistory()` |
| `/api/llm/analyze-process` | POST | 流程分析 | `analyzeProcess()` |
| `/api/llm/assess-risks` | POST | 风险评估 | `assessRisks()` |
| `/api/llm/recommendations` | POST | 智能推荐 | `getRecommendations()` |
| `/api/llm/connection` | GET | 检查连接状态 | `checkConnection()` |
| `/api/llm/usage-stats` | GET | 获取使用统计 | 统计功能 |

## 统一响应格式

所有API端点都返回统一的响应格式：

### 成功响应
```json
{
  "success": true,
  "data": { ... }
}
```

### 错误响应
```json
{
  "success": false,
  "error": "错误信息"
}
```

## 使用示例

### 前端使用 (Vue组件)
```javascript
import { processDataApi } from '@/api/processDataApi'
import { subProcessDataApi } from '@/api/subProcessDataApi'
import { planningTimeApi } from '@/api/planningTimeApi'
import { neuralNetworkApi } from '@/api/neuralNetworkApi'
import { processOptimizationApi } from '@/api/processOptimizationApi'
import { riskDataApi } from '@/api/riskDataApi'
import { llmApi } from '@/api/llmApi'

// 获取流程数据
const flowData = await processDataApi.getFlowDataByType('purchase')

// 获取子流程数据  
const subProcessData = await subProcessDataApi.getSubProcessDataByType('purchase')

// 获取Mermaid流程图数据
const mermaidData = await subProcessDataApi.getMermaidFlowData('purchase')

// 获取规划时间数据
const planningData = await planningTimeApi.getPlanningTimeData()

// 获取神经网络参数
const currentParams = await neuralNetworkApi.getCurrentParameters()

// 获取默认参数配置
const defaultParams = await neuralNetworkApi.getDefaultParameters()

// 更新神经网络参数
const updateResult = await neuralNetworkApi.updateParameters({
  geoPoliticalWeight: 1.5,
  marketVolatilityFactor: 0.9
})

// 获取参数统计
const stats = await neuralNetworkApi.getParameterStats()

// 检查连接状态
const connectionStatus = await processDataApi.checkConnection()

// 获取流程优化案例
const optimizations = await processOptimizationApi.getAllOptimizations()

// 获取特定优化案例
const optimization1 = await processOptimizationApi.getOptimizationById('Optimization1')

// 获取流程图数据
const flowcharts = await processOptimizationApi.getOptimizationFlowcharts('Optimization1')

// 获取资源变化分析
const resources = await processOptimizationApi.getOptimizationResources('Optimization1')

// 获取甘特图数据
const ganttData = await processOptimizationApi.getOptimizationGantt('Optimization1')

// 搜索优化案例
const searchResults = await processOptimizationApi.searchOptimizations('采购流程')

// 获取优化数据统计
const stats = await processOptimizationApi.getOptimizationStats()

// 获取风险数据
const riskData = await riskDataApi.getAllRiskData()

// 检查风险数据库连接
const riskConnection = await riskDataApi.checkConnection()

// 大模型对话
const chatResult = await llmApi.chat('分析采购流程风险', '你是专业的风险评估专家')

// 多轮对话
const historyResult = await llmApi.chatWithHistory([
  { role: 'user', content: '你好' },
  { role: 'assistant', content: '你好！我可以帮您分析流程风险。' },
  { role: 'user', content: '分析一下采购流程的主要风险点' }
])

// 流程分析
const processAnalysis = await llmApi.analyzeProcess({
  processName: '采购流程',
  steps: ['需求确认', '供应商选择', '合同签订', '验收入库'],
  riskFactors: ['质量风险', '交期风险', '成本风险']
})

// 风险评估
const riskAssessment = await llmApi.assessRisks({
  riskData: riskData,
  analysisType: '采购流程风险评估'
})

// 智能推荐
const recommendations = await llmApi.getRecommendations({
  currentRiskLevel: '高风险',
  targetRiskLevel: '中风险',
  constraints: ['成本控制', '时间限制']
})

// 检查大模型连接
const llmConnection = await llmApi.checkConnection()

// 获取使用统计
const llmStats = await llmApi.getUsageStats()
```

### 后端使用 (API服务器)
```javascript
const FlowDataService = require('./flowDataService')
const PlanningTimeService = require('./planningTimeService')
const NeuralNetworkService = require('./neuralNetworkService')
const ProcessOptimizationService = require('./processOptimizationService')
const RiskDataService = require('./riskDataService')
const LLMService = require('./llmService')

// 创建服务实例
const flowDataService = new FlowDataService()
const planningTimeService = new PlanningTimeService()
const neuralNetworkService = new NeuralNetworkService()
const processOptimizationService = new ProcessOptimizationService()
const riskDataService = new RiskDataService()
const llmService = new LLMService()

// 流程数据操作
const flowResult = await flowDataService.getFlowDataByType('purchase')
const mermaidResult = await flowDataService.getMermaidFlowData('purchase')
const dbStats = await flowDataService.getDatabaseStats()

// 规划时间数据操作
const planningData = await planningTimeService.getPlanningTimeData()
const refactorTiming = await planningTimeService.getRefactorTimingData()
const llmAnalysis = await planningTimeService.getLLMAnalysisData()

// 神经网络参数操作
const currentParams = await neuralNetworkService.getCurrentNeuralNetworkParameters()
const defaultParams = await neuralNetworkService.getDefaultNeuralNetworkParameters()
const updateResult = await neuralNetworkService.updateNeuralNetworkParameters({
  geoPoliticalWeight: 1.5
})
const paramStats = await neuralNetworkService.getNeuralNetworkParameterStats()

// 流程优化数据操作
const allOptimizations = await processOptimizationService.getAllOptimizations()
const optimization1 = await processOptimizationService.getOptimizationById('Optimization1')
const flowchartData = await processOptimizationService.getOptimizationFlowcharts('Optimization1')
const resourceData = await processOptimizationService.getOptimizationResources('Optimization1')
const ganttData = await processOptimizationService.getOptimizationGantt('Optimization1')
const searchResults = await processOptimizationService.searchOptimizations('采购')
const optimizationStats = await processOptimizationService.getOptimizationStats()

// 风险数据操作
const allRiskData = await riskDataService.getAllRiskData()
const riskConnection = await riskDataService.checkConnection()

// 大模型服务操作
const chatResult = await llmService.chat('你好', '你是人工智能助手')
const chatHistory = await llmService.chatWithHistory([
  { role: 'user', content: '你好' },
  { role: 'assistant', content: '你好！有什么可以帮助你的？' },
  { role: 'user', content: '分析一下采购流程' }
])
const processAnalysis = await llmService.analyzeProcess({
  processName: '采购流程',
  steps: ['需求确认', '供应商选择', '合同签订', '验收入库']
})
const riskAssessment = await llmService.assessRisks({
  riskFactors: ['供应商风险', '质量风险', '交期风险']
})
const recommendations = await llmService.getRecommendations({
  currentState: '流程存在瓶颈',
  targetState: '提高效率'
})
const llmConnection = await llmService.checkConnection()
```

## 错误处理

### 前端错误处理
```javascript
// 流程数据API错误处理
try {
  const data = await processDataApi.getFlowDataByType('purchase')
  // 处理成功响应
} catch (error) {
  console.error('流程数据API调用失败:', error.message)
  // 处理错误
}

// 神经网络参数API错误处理
try {
  const result = await neuralNetworkApi.updateParameters({
    geoPoliticalWeight: 1.5
  })
  
  if (result.data.code === 200) {
    console.log('参数更新成功:', result.data.data)
  } else {
    console.warn('参数更新失败:', result.data.message)
  }
} catch (error) {
  console.error('神经网络参数API调用失败:', error.message)
  // 在离线模式下仍可能成功
  if (error.response?.status === 503) {
    console.log('服务器不可用，但可能已使用离线模式')
  }
}
```

### 后端错误处理
```javascript
// 流程数据服务错误处理
const flowResult = await flowDataService.getFlowDataByType('purchase')
if (flowResult.success) {
  res.json({ success: true, data: flowResult.data })
} else {
  res.status(404).json({ success: false, error: flowResult.error })
}

// 神经网络参数服务错误处理
try {
  const paramResult = await neuralNetworkService.updateNeuralNetworkParameters({
    geoPoliticalWeight: 1.5
  })
  res.json({
    code: 200,
    message: '参数更新成功',
    data: paramResult
  })
} catch (error) {
  res.status(500).json({
    code: 500,
    message: '更新参数失败',
    data: null,
    error: error.message
  })
}

// 规划时间服务错误处理
try {
  const planningData = await planningTimeService.getPlanningTimeData()
  res.json({
    success: true,
    data: planningData,
    message: '获取规划时间数据成功'
  })
} catch (error) {
  res.status(500).json({
    success: false,
    error: error.message
  })
}
```

## 启动服务

### 启动API服务器
```bash
# 使用npm脚本
npm run api-server

# 或直接运行
node src/services/apiServer.js
```

### 数据导入和测试
```bash
# 导入风险数据
npm run import-risk-data

# 测试风险数据API
npm run test-risk-data

# 测试大模型服务
npm run test-llm-service

# 测试风险数据分析
npm run test-risk-analysis

# 测试结构化风险分析
npm run test-structured-risk
```

### 检查服务状态
```bash
# 检查流程数据API
curl http://localhost:3001/api/flow-summary

# 检查规划时间API
curl http://localhost:3001/api/planning-time/overview

# 检查神经网络参数API
curl http://localhost:3001/api/neural-network/parameters/current

# 检查服务器健康状态
curl http://localhost:3001/api/database-stats

# 检查风险数据API
curl http://localhost:3001/api/risk-data/connection

# 检查大模型API
curl http://localhost:3001/api/llm/connection
```

## 注意事项

### 基础配置
1. **数据库连接**: 确保MongoDB服务正在运行
2. **端口配置**: API服务器默认运行在3001端口
3. **CORS配置**: 已配置允许前端跨域访问
4. **环境变量**: 可通过 `VUE_APP_API_URL` 配置API基础URL

### 服务特性
5. **服务分离**: 六个独立的后端服务管理不同类型的数据
6. **错误处理**: 所有API调用都有统一的错误处理机制
7. **响应格式**: 流程数据使用 `{success, data}` 格式，神经网络参数使用 `{code, message, data}` 格式
8. **离线支持**: 神经网络参数API支持离线模式，使用localStorage作为备份
9. **大模型集成**: 支持火山引擎Ark API，提供智能分析能力
10. **风险数据管理**: 专门的风险数据服务，支持批量数据提取

### 数据库集合
9. **流程数据集合**: `processflowdata`, `subprocesscardsdata`, `mermaid_flows`
10. **规划时间集合**: `planning_time_data`, `refactor_timing_data`, `llm_analysis_data`
11. **参数配置集合**: `neural_network_parameters`, `neural_network_parameter_history`, `neural_network_saved_configs`
12. **流程优化集合**: `process_optimization_flow_data`
13. **风险数据集合**: `risk_data` (新增)

### 开发建议
12. **渐进增强**: 前端应优雅处理API服务不可用的情况
13. **参数验证**: 神经网络参数在前后端都有验证机制
14. **历史记录**: 参数变更会自动记录历史，便于追踪
15. **配置管理**: 支持导入导出参数配置，便于环境迁移
16. **大模型使用**: 建议设置合理的超时时间和重试机制
17. **风险数据分析**: 结合大模型服务进行智能风险分析
18. **API密钥管理**: 妥善保管火山引擎API密钥，避免泄露

## 服务架构图

```
┌─────────────────────────────────────────────────────────────┐
│                    前端 Vue.js 应用                          │
├─────────────────────────────────────────────────────────────┤
│  ProcessFlow.vue  │  PlanningTimeView.vue  │  NeuralNetwork │
│  SubProcessView   │  RefactorTimingView    │  SettingsView  │
└─────────────┬───────────────┬───────────────────┬───────────┘
              │               │                   │
┌─────────────▼───────────────▼───────────────────▼───────────┐
│                    API客户端层                              │
├─────────────────────────────────────────────────────────────┤
│ processDataApi │ planningTimeApi │ neuralNetworkApi │ ...    │
└─────────────┬───────────────┬───────────────────┬───────────┘
              │               │                   │
              │        HTTP Requests              │
              │         (Port 3001)               │
              │               │                   │
┌─────────────▼───────────────▼───────────────────▼───────────┐
│                   Express API服务器                         │
│                   (apiServer.js)                           │
├─────────────────────────────────────────────────────────────┤
│  路由管理  │  中间件  │  错误处理  │  响应格式化  │  CORS     │
└─────────────┬───────────────┬───────────────────┬───────────┘
              │               │                   │
┌─────────────▼───────────────▼───────────────────▼───────────┐
│                   后端服务层                                │
├─────────────────────────────────────────────────────────────┤
│flowDataService │planningTimeService│neuralNetworkService│processOptimizationService│riskDataService│llmService   │
│  流程数据管理  │    规划时间管理    │   参数配置管理      │     流程优化管理        │  风险数据管理  │ 大模型服务   │
└─────────────┬───────────────┬───────────────────┬───────────┘
              │               │                   │
┌─────────────▼───────────────▼───────────────────▼───────────┐
│                    MongoDB 数据库                           │
├─────────────────────────────────────────────────────────────┤
│ processflowdata │ planning_time_data │ neural_network_*     │ process_optimization_* │ risk_data            │
│ subprocessdata  │ refactor_timing    │ parameter_history    │ flow_data             │                      │
│ mermaid_flows   │ llm_analysis_data  │ saved_configs        │                       │                      │
└─────────────────────────────────────────────────────────────┘
```

### 数据流向说明

1. **前端组件** 调用对应的API客户端
2. **API客户端** 发送HTTP请求到Express服务器
3. **Express服务器** 根据路由分发到相应的后端服务
4. **后端服务** 执行业务逻辑并操作MongoDB
5. **响应数据** 按相反路径返回到前端组件 