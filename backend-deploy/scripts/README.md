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

### 流程数据脚本

#### 3. `import-processflowdata-to-mongodb.js` - 流程数据导入脚本

**功能：**
- 从 `src/data/processFlowData.js` 读取流程数据
- 将数据导入到 MongoDB 数据库（process_flow_data 集合）
- 支持四种流程：采购、生产、营销、运维
- 自动计算统计摘要和趋势分析
- 创建必要的索引以提高查询性能

**数据结构：**
```javascript
{
  _id: ObjectId("..."),
  flowType: "purchase",        // 流程类型
  flowName: "采购环节",         // 流程名称
  description: "采购流程相关的月度数据和关键指标",
  chartData: [                 // 月度图表数据
    { month: "1月", value: 920000 },
    { month: "2月", value: 850000 },
    // ...
  ],
  panelData: [                 // 关键指标面板数据
    { label: "当月采购总额", value: "¥1,256,890", unit: "" },
    { label: "未处理申请", value: "24", unit: "件" },
    // ...
  ],
  chartSummary: {              // 图表数据统计摘要
    totalMonths: 6,
    latestValue: 1256890,
    earliestValue: 920000,
    averageValue: 1026148,
    maxValue: 1256890,
    minValue: 850000
  },
  panelSummary: {              // 面板数据处理后的结构
    totalPanels: 4,
    panels: [...]
  },
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

### 流程节点数据脚本

#### 4. `import-flownodesdata-to-mongodb.js` - 流程节点数据导入脚本

**功能：**
- 从 `src/data/flowNodesData.js` 读取流程节点详细信息数据
- 将数据导入到 MongoDB 数据库（flow_nodes 集合）
- 支持四种流程类型：运维(operation)、采购(purchase)、生产(production)、营销(marketing)
- 创建必要的索引以提高查询性能
- 提供详细的统计分析和风险评估

**数据结构：**
```javascript
{
  _id: ObjectId("..."),
  nodeId: "101",           // 节点ID (如: 101, p1, prod1, m1)
  flowType: "operation",   // 流程类型
  title: "里程数周期性维护",    // 节点标题
  description: "根据设备运行里程数达到特定值时进行的计划性维护工作",
  responsibleDept: "设备维护部",  // 责任部门
  cycleTime: "每5000小时或每季度", // 周期时间
  riskLevel: "中",              // 风险等级 (低/中/高)
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

#### 5. `test-flownodesdata-queries.js` - 流程节点查询测试脚本

**功能：**
- 验证流程节点数据导入是否成功
- 按流程类型和风险等级进行统计分析
- 提供部门责任分布查询
- 支持全文搜索和复合查询
- 展示风险分布矩阵

**查询示例：**
- 基本统计：总节点数、各流程类型节点数
- 风险分析：高风险节点识别、风险等级分布
- 部门分析：各部门负责的节点统计
- 文本搜索：查找包含特定关键词的节点
- 复合查询：多条件组合查询（如：质检部的高风险节点）

### 流程优化数据脚本

#### 6. `import-process-optimization-to-mongodb.js` - 流程优化数据导入脚本

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

#### 7. `test-process-optimization-queries.js` - 流程优化查询测试脚本

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

# 导入流程节点数据到 MongoDB (NEW)
npm run import-flownodes

# 测试流程节点查询功能 (NEW)
npm run test-flownodes

# 导入流程数据到 MongoDB (NEW)
npm run import-processflow

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

# 导入流程节点数据
node scripts/import-flownodesdata-to-mongodb.js

# 测试流程节点查询
node scripts/test-flownodesdata-queries.js

# 导入流程数据
node scripts/import-processflowdata-to-mongodb.js

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
- **流程节点集合：** `flow_nodes`
- **流程数据集合：** `process_flow_data`
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

### 5. 查询流程节点数据
```javascript
// 查询特定节点
db.flow_nodes.findOne({ nodeId: "101" })

// 查询运维流程的所有节点
db.flow_nodes.find({ flowType: "operation" })

// 查询高风险节点
db.flow_nodes.find({ riskLevel: "高" })

// 查询质检部负责的节点
db.flow_nodes.find({ responsibleDept: "质检部" })

// 文本搜索：查找包含"维修"的节点
db.flow_nodes.find({ $text: { $search: "维修" } })

// 复合查询：质检部的中高风险节点
db.flow_nodes.find({
  responsibleDept: "质检部",
  riskLevel: { $in: ["中", "高"] }
})

// 聚合查询：各流程类型的风险分布
db.flow_nodes.aggregate([
  {
    $group: {
      _id: { flowType: "$flowType", riskLevel: "$riskLevel" },
      count: { $sum: 1 }
    }
  },
  { $sort: { "_id.flowType": 1, "_id.riskLevel": 1 } }
])
```

### 6. 查询流程数据
```javascript
// 查询特定流程数据
db.process_flow_data.findOne({ flowType: "purchase" })

// 查询所有流程的最新数值
db.process_flow_data.find(
  {},
  { flowName: 1, "chartSummary.latestValue": 1 }
)

// 查询增长率最高的流程
db.process_flow_data.aggregate([
  {
    $addFields: {
      growthRate: {
        $multiply: [
          {
            $divide: [
              { $subtract: ["$chartSummary.latestValue", "$chartSummary.earliestValue"] },
              "$chartSummary.earliestValue"
            ]
          },
          100
        ]
      }
    }
  },
  { $sort: { growthRate: -1 } }
])

// 查询特定面板指标
db.process_flow_data.find(
  { "panelData.label": { $regex: "完成率", $options: "i" } },
  { flowName: 1, "panelData.$": 1 }
)

// 查询月度数据范围
db.process_flow_data.find(
  { "chartSummary.maxValue": { $gte: 1000000 } },
  { flowName: 1, "chartSummary": 1 }
)
```

### 7. 查询流程优化数据
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

**流程节点数据索引：**
- `{ nodeId: 1, flowType: 1 }` - 唯一复合索引，用于快速查找特定流程的特定节点
- `{ flowType: 1 }` - 用于按流程类型查询
- `{ riskLevel: 1 }` - 用于风险等级查询
- `{ responsibleDept: 1 }` - 用于部门查询
- `{ title: "text", description: "text" }` - 全文搜索索引

**流程数据索引：**
- `{ flowType: 1 }` - 唯一索引，用于快速查找特定流程类型
- `{ flowName: 1 }` - 用于流程名称查询
- `{ "chartSummary.latestValue": -1 }` - 用于按最新数值排序
- `{ "panelData.label": 1 }` - 用于面板指标查询
- `{ description: "text", flowName: "text" }` - 全文搜索索引

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
   - `flow_nodes` - 流程节点数据
   - `process_flow_data` - 流程数据
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

### 流程节点数据（约30个节点）
包含四种流程类型的详细节点信息：

**运维流程节点（12个）：**
- 里程数周期性维护、客户整改需求、故障报警等维护相关节点
- 涵盖从故障检测到修复完成的完整流程
- 风险等级：低、中、高三个级别

**采购流程节点（8个）：**
- 采购需求、供应商选择、价格审批、合同签订等采购环节
- 包含质量检验、入库、退回处理等关键控制点

**生产流程节点（8个）：**
- 生产计划制定、原材料准备、生产加工、产品质检等生产环节
- 涵盖从计划到成品入库的完整生产链

**营销流程节点（7个）：**
- 市场调研、策略制定、渠道开发、线上线下推广等营销活动
- 包含效果评估和策略调整的闭环管理

### 流程数据（4条记录）
包含四种流程的月度数据和关键指标：

**采购环节数据：**
- 月度采购总额趋势（6个月数据：850,000 - 1,256,890）
- 关键指标：当月采购总额、未处理申请数、合作供应商数、采购完成率
- 增长趋势：36.6% ↗️

**生产环节数据：**
- 月度产量趋势（6个月数据：850 - 1,200件）
- 关键指标：当月产量、生产计划达成率、产品合格率、设备利用率
- 增长趋势：41.2% ↗️

**营销环节数据：**
- 月度销售额趋势（6个月数据：880,000 - 1,450,000）
- 关键指标：当月销售额、新增客户数、销售增长率、销售目标完成率
- 增长趋势：64.8% ↗️

**运维环节数据：**
- 月度故障数趋势（6个月数据：24 - 9起）
- 关键指标：故障响应时间、当月故障数、维护计划完成率、设备完好率
- 改善趋势：-62.5% ↘️（故障数减少表示改善）

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

### 流程节点数据特点
每个流程节点包含：
- 节点唯一标识和所属流程类型
- 详细的职责描述和负责部门
- 明确的执行周期和时间要求
- 科学的风险等级评估
- 便于查询和分析的标准化结构

**风险管理：**
- 高风险节点：需要重点监控和特殊处理
- 中风险节点：需要定期检查和预防措施
- 低风险节点：正常流程处理，减少管理成本

**部门协作：**
- 明确各部门职责分工
- 便于跨部门协调和沟通
- 支持责任追溯和绩效评估

### 流程数据特点
每个流程数据文档包含：
- 完整的月度时间序列数据（6个月）
- 关键业务指标的实时监控面板
- 自动计算的统计摘要信息
- 数据趋势分析和增长率计算
- 支持多维度查询和分析的索引结构

**业务价值：**
- 趋势分析：营销环节增长最快（64.8%），运维效率显著提升
- 绩效监控：生产和采购环节稳步增长，均超过35%
- 异常识别：运维故障数大幅下降，说明维护策略有效
- 决策支持：为管理层提供数据驱动的业务洞察

**数据应用：**
- 仪表板展示各流程的实时关键指标
- 趋势图表显示业务发展轨迹
- 对比分析不同流程的表现差异
- 预测分析基于历史数据预测未来趋势 

# 数据导入脚本说明

本目录包含了用于将项目数据导入到MongoDB数据库的各种脚本。

## 📁 脚本文件列表

### 流程数据导入脚本
- `import-flownodesdata-to-mongodb.js` - 导入流程节点数据
- `import-processflowdata-to-mongodb.js` - 导入流程数据
- `import-subprocesscardsdata-to-mongodb.js` - 导入子流程卡片数据

### Mermaid流程图导入脚本
- `import-marketingflowmermaid-to-mongodb.js` - 导入营销流程图
- `import-operationflowmermaid-to-mongodb.js` - 导入运营流程图
- `import-productionflowmermaid-to-mongodb.js` - 导入生产流程图
- `import-purchaseflowmermaid-to-mongodb.js` - 导入采购流程图

### 分析数据导入脚本
- `import-llm-analysis-data-to-mongodb.js` - 导入LLM分析数据
- `import-planning-time-data-to-mongodb.js` - 导入规划时间数据
- `import-refactor-timing-data-to-mongodb.js` - 导入重构时机数据
- `import-management-totaldata-to-mongodb.js` - 导入管理总数据

### 流程优化导入脚本 (新增)
- `import-process-optimization-to-mongodb.js` - 导入流程优化案例数据

### 通用导入脚本
- `import-to-mongodb.js` - 通用数据导入脚本

## 🚀 使用方法

### 单独运行脚本
```bash
# 导入流程优化数据
node scripts/import-process-optimization-to-mongodb.js

# 导入规划时间数据
node scripts/import-planning-time-data-to-mongodb.js

# 导入LLM分析数据
node scripts/import-llm-analysis-data-to-mongodb.js
```

### 批量运行脚本
```bash
# 运行所有导入脚本
node scripts/import-to-mongodb.js
```

## 📊 脚本功能说明

### `import-process-optimization-to-mongodb.js`
**新增的流程优化数据导入脚本**

**功能特性：**
- 导入5个流程优化案例（Optimization1-5）
- 包含完整的流程图数据（before、after、after2、llm版本）
- 包含详细的资源变化分析
- 包含甘特图和项目计划数据
- 自动数据验证和完整性检查
- 创建必要的数据库索引

**数据结构：**
```javascript
{
  _id: "Optimization1",
  id: "Optimization1",
  title: "采购流程重构优化",
  description: "原流程缺乏人员风险管控...",
  flowcharts: {
    before: "graph TD\n...",    // 原始流程图
    after: "graph TD\n...",     // 强化学习平衡方案
    after2: "graph TD\n...",    // 强化学习资源优先方案
    llm: "graph TD\n..."        // LLM智能重构方案
  },
  resourceChanges: { /* 详细资源变化分析 */ },
  resourceChanges2: { /* 简化版资源分析 */ },
  ganttData: { /* 甘特图数据 */ },
  ganttData2: { /* 简化版甘特图 */ },
  createdAt: ISODate,
  updatedAt: ISODate,
  source: "processOptimizationFlowData.js",
  version: "1.0"
}
```

**验证功能：**
- 数据完整性检查
- 统计包含资源分析的案例数量
- 统计包含甘特图的案例数量  
- 统计包含LLM流程图的案例数量

## 🗄️ 数据库集合

### 主要集合
- `processflowdata` - 流程数据
- `subprocesscardsdata` - 子流程卡片数据
- `planning_time_data` - 规划时间数据
- `refactor_timing_data` - 重构时机数据
- `llm_analysis_data` - LLM分析数据
- `process_optimization_flow_data` - 流程优化案例数据 (新增)

### Mermaid流程图集合
- `marketingflowmermaid` - 营销流程图
- `operationflowmermaid` - 运营流程图
- `productionflowmermaid` - 生产流程图
- `purchaseflowmermaid` - 采购流程图

## ⚠️ 注意事项

1. **数据库连接**: 确保MongoDB服务正在运行（默认端口27017）
2. **数据库名称**: 所有脚本使用 `maintenance_system` 数据库
3. **数据清理**: 大部分脚本会清空现有数据后重新导入
4. **错误处理**: 脚本包含完整的错误处理和日志输出
5. **索引创建**: 脚本会自动创建必要的数据库索引

## 🔧 环境要求

- Node.js 14+
- MongoDB 4.0+
- 项目依赖包（mongodb driver）

## 📝 日志输出

所有脚本都包含详细的日志输出：
- ✅ 成功操作
- ❌ 错误信息
- 📊 统计数据
- 🔍 验证结果

## 🆘 故障排除

1. **连接失败**: 检查MongoDB服务状态
2. **权限错误**: 确保有数据库写入权限
3. **数据格式错误**: 检查源数据文件格式
4. **内存不足**: 大量数据导入时可能需要增加Node.js内存限制 