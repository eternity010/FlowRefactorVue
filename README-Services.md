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
├── riskDataService.js         # 风险数据服务
├── llmService.js             # 大模型服务
├── mysqlService.js           # MySQL数据库服务
├── topic01Service.js         # Topic01业务服务
├── topic02Service.js         # Topic02业务服务
├── topic03Service.js         # Topic03车辆人员匹配服务
├── topic04Service.js         # Topic04运维订单服务
├── apiServer.js              # Express API服务器
└── index.js                  # 服务层统一导出

src/api/
├── planningTimeApi.js        # 规划时间API客户端
├── processDataApi.js         # 流程数据API客户端
├── processOptimizationApi.js # 流程优化API客户端
├── subProcessDataApi.js      # 子流程数据API客户端
├── neuralNetworkApi.js       # 神经网络参数API客户端
├── riskDataApi.js           # 风险数据API客户端
├── llmApi.js                # 大模型API客户端
├── topic01Api.js            # Topic01 API客户端
├── topic02Api.js            # Topic02 API客户端
├── topic03Api.js            # Topic03 API客户端
└── topic04Api.js            # Topic04 API客户端
```

## 各文件职责

### 前端API客户端 (src/api/)
- **技术栈**: Axios HTTP客户端
- **职责**: 封装HTTP请求，提供前端组件调用的API方法，错误处理

### 后端服务层 (src/services/)
- **技术栈**: Node.js + Express + MongoDB + MySQL
- **职责**: 业务逻辑处理，数据库操作，API接口提供

#### 核心服务文件
- `flowDataService.js` - 流程数据管理 (MongoDB)
- `planningTimeService.js` - 规划时间数据 (MongoDB)
- `neuralNetworkService.js` - 神经网络参数 (MongoDB)
- `processOptimizationService.js` - 流程优化案例 (MongoDB)
- `riskDataService.js` - 风险数据管理 (MongoDB)
- `llmService.js` - 大模型服务 (火山引擎API)
- `mysqlService.js` - MySQL数据库服务
- `topic01Service.js` - Topic01业务逻辑
- `topic02Service.js` - Topic02业务逻辑
- `topic03Service.js` - 车辆人员匹配度管理 (MySQL)
- `topic04Service.js` - 运维订单管理 (MySQL)
- `apiServer.js` - Express API服务器

## 数据流向

```
前端组件 → API客户端 → Express服务器 → 后端服务 → 数据库
         ↓          ↓           ↓         ↓
    Vue.js组件   Axios API   apiServer.js  MongoDB/MySQL
```

## 主要API端点

### MongoDB数据服务
- `/api/flow-data/*` - 流程数据管理
- `/api/planning-time/*` - 规划时间数据
- `/api/neural-network/*` - 神经网络参数
- `/api/process-optimization/*` - 流程优化案例
- `/api/risk-data/*` - 风险数据管理

### MySQL数据服务
- `/api/topic01/*` - Topic01业务服务
- `/api/topic02/*` - Topic02业务服务
- `/api/topic03/*` - 车辆人员匹配度查询（只读）
- `/api/topic04/*` - 运维订单管理

### 智能服务
- `/api/llm/*` - 大模型服务

## 统一响应格式

```json
// 成功响应
{
  "success": true,
  "data": { ... }
}

// 错误响应
{
  "success": false,
  "error": "错误信息"
}
```

## 启动服务

```bash
# 启动API服务器
npm run api-server
# 或
node src/services/apiServer.js

# 健康检查
curl http://localhost:3001/health
```

## 配置要求

### 基础环境
- **Node.js**: 服务器运行环境
- **MongoDB**: 流程数据、参数配置、优化案例存储
- **MySQL**: Topic业务数据存储
- **端口**: API服务器默认3001端口

### 数据库集合
- **MongoDB**: `processflowdata`, `planning_time_data`, `neural_network_*`, `process_optimization_*`, `risk_data`
- **MySQL**: `dm_topic0305_output_train_person_match`, `dm_topic0402_input_train_maintenance`

### 环境变量
- `VUE_APP_API_URL`: 前端API基础URL配置
- 火山引擎API密钥（大模型服务） 