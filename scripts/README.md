# MongoDB 数据导入和查询脚本

这个目录包含用于将运维流程数据和流程优化数据导入 MongoDB 和测试查询功能的脚本。

## 前提条件

1. **确保 MongoDB 已安装并运行**
   ```bash
   # 检查 MongoDB 是否运行
   mongosh --eval "db.adminCommand('ismaster')"
   ```

2. **确保项目依赖已安装**
   ```bash
   npm install
   ```

## 脚本说明

### 运维流程数据脚本

#### 1. `import-to-mongodb.js` - 运维流程数据导入脚本

**功能：**
- 从 `src/data/implementations/operationImpl.js` 读取运维流程数据
- 将数据导入到 MongoDB 数据库
- 创建必要的索引以提高查询性能
- 清空现有数据（避免重复）

**数据结构：**
```javascript
{
  _id: ObjectId("..."),
  id: "o1",  // 原始的键值 (o1, o2, o3, ...)
  data: {    // 完整的流程数据
    title: "里程数周期性维护实现流程",
    description: "...",
    flowData: { nodes: [...], edges: [...] },
    steps: { ... },
    ganttData: { ... },
    backupImplementation: { ... }
  },
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

#### 2. `test-mongodb-queries.js` - 运维流程查询测试脚本

**功能：**
- 验证数据导入是否成功
- 展示各种查询方式
- 提供复杂聚合查询示例

**查询示例：**
- 基本查询：根据 ID 查询流程
- 文本搜索：查找包含特定关键词的流程
- 嵌套查询：查询步骤和任务信息
- 聚合查询：统计和分析数据

### 流程优化数据脚本

#### 3. `import-process-optimization-to-mongodb.js` - 流程优化数据导入脚本

**功能：**
- 从 `src/data/processOptimizationFlowData.js` 读取流程优化数据
- 将数据导入到 MongoDB 数据库（process_optimization_flows 集合）
- 创建必要的索引以提高查询性能
- 显示详细的导入信息和资源变化分析

**数据结构：**
```javascript
{
  _id: ObjectId("..."),
  id: "Optimization1",  // 优化方案ID
  data: {              // 完整的优化数据
    title: "采购流程重构优化",
    description: "...",
    before: "...",     // 优化前流程图
    after: "...",      // 优化后流程图
    after2: "...",     // 简化版流程图
    resourceChanges: { // 资源变化分析
      summary: {...},
      newResourceTypes: {...},
      existingResourceEnhancements: {...}
    },
    resourceChanges2: {}, // 简化版资源分析
    ganttData: {...},     // 甘特图数据
    ganttData2: {...}     // 简化版甘特图
  },
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

#### 4. `test-process-optimization-queries.js` - 流程优化查询测试脚本

**功能：**
- 验证流程优化数据导入是否成功
- 展示复杂的聚合查询示例
- 提供资源变化分析查询
- 对比完整版与简化版方案

**查询示例：**
- 资源变化分析：查询人员、系统、文档变化
- 甘特图分析：任务优先级、时长统计
- 流程复杂度对比：优化前后步骤变化
- 完整版vs简化版对比分析

## 使用方法

### 方法一：使用 npm 脚本（推荐）

```bash
# 导入运维流程数据到 MongoDB
npm run import-data

# 测试运维流程查询功能
npm run test-db

# 导入流程优化数据到 MongoDB
npm run import-optimization

# 测试流程优化查询功能
npm run test-optimization
```

### 方法二：直接运行脚本

```bash
# 导入运维流程数据
node scripts/import-to-mongodb.js

# 测试运维流程查询
node scripts/test-mongodb-queries.js

# 导入流程优化数据
node scripts/import-process-optimization-to-mongodb.js

# 测试流程优化查询
node scripts/test-process-optimization-queries.js
```

## 数据库配置

默认配置：
- **数据库URI：** `mongodb://localhost:27017`
- **数据库名：** `maintenance_system`
- **运维流程集合：** `operation_implementations`
- **流程优化集合：** `process_optimization_flows`

如需修改配置，请编辑脚本文件顶部的常量：
```javascript
const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'maintenance_system';
const COLLECTION_NAME = 'operation_implementations';
```

## 常见查询示例

### 1. 查询特定流程
```javascript
db.operation_implementations.findOne({ id: "o1" })
```

### 2. 查询流程标题
```javascript
db.operation_implementations.find(
  { "data.title": { $regex: "维护", $options: "i" } },
  { id: 1, "data.title": 1 }
)
```

### 3. 查询特定步骤
```javascript
db.operation_implementations.findOne(
  { id: "o1" },
  { "data.steps.step1": 1 }
)
```

### 4. 查询甘特图任务
```javascript
db.operation_implementations.aggregate([
  { $match: { id: "o1" } },
  { $unwind: "$data.ganttData.tasks" },
  { $match: { "data.ganttData.tasks.priority": "critical" } }
])
```

### 5. 查询流程优化数据
```javascript
// 查询流程优化记录
db.process_optimization_flows.findOne({ id: "Optimization1" })

// 查询资源变化分析
db.process_optimization_flows.find(
  {},
  { "data.resourceChanges.summary": 1 }
)

// 查询流程步骤变化最大的优化方案
db.process_optimization_flows.aggregate([
  {
    $addFields: {
      stepIncrease: {
        $subtract: [
          "$data.resourceChanges.summary.processSteps.after",
          "$data.resourceChanges.summary.processSteps.before"
        ]
      }
    }
  },
  { $sort: { stepIncrease: -1 } }
])
```

## 索引说明

脚本自动创建以下索引以提高查询性能：
- `{ id: 1 }` - 唯一索引，用于快速查找特定流程
- `{ "data.title": 1 }` - 用于标题搜索
- `{ "data.steps": 1 }` - 用于步骤查询

**流程优化数据索引：**
- `{ id: 1 }` - 唯一索引，用于快速查找特定优化方案
- `{ "data.title": 1 }` - 用于标题搜索
- `{ "data.description": "text" }` - 全文搜索索引
- `{ "data.resourceChanges.summary.processSteps.before": 1 }` - 优化前步骤查询
- `{ "data.resourceChanges.summary.processSteps.after": 1 }` - 优化后步骤查询
- `{ "data.ganttData.tasks.priority": 1 }` - 任务优先级查询

## 故障排除

### 连接失败
1. 确保 MongoDB 服务正在运行
2. 检查连接URI是否正确
3. 确认防火墙设置

### 导入失败
1. 检查源文件路径是否正确
2. 确认数据格式是否有效
3. 查看控制台错误信息

### 查询问题
1. 确保数据已正确导入
2. 检查字段名称是否正确
3. 注意大小写敏感性

## 使用 MongoDB Compass 查看数据

1. 下载并安装 [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. 连接到 `mongodb://localhost:27017`
3. 选择 `maintenance_system` 数据库
4. 浏览集合：
   - `operation_implementations` - 运维流程数据
   - `process_optimization_flows` - 流程优化数据

这样可以可视化地查看和编辑数据。

## 数据概览

### 运维流程数据（6条记录）
- `o1`: 里程数周期性维护实现流程
- `o2`: 客户整改需求实现流程  
- `o3`: 故障报警实现流程
- `o4`: 设备状态检查实现流程
- `o5`: 系统升级维护实现流程
- `o6`: 安全巡检实现流程

### 流程优化数据（4条记录）
- `Optimization1`: 采购流程重构优化（人员风险管控）
- `Optimization2`: 供应商选择流程重构优化（应对关税战）
- `Optimization3`: 故障报警流程重构优化（AI智能分析）
- `Optimization4`: 客户整改需求流程重构优化（政策合规）

每个优化方案都包含：
- 优化前后流程对比（Mermaid图）
- 详细的资源变化分析
- 完整版和简化版实施方案
- 甘特图项目计划
- 人员、系统、文档、设备需求分析 