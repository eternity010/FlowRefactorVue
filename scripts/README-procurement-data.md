# 采购数据 MongoDB 导入和查询指南

## 概述

本指南介绍如何将 `procurement_dataset.json` 文件导入到 MongoDB 数据库，以及如何使用查询脚本进行数据分析。

## 文件说明

- `import-procurement-data-to-mongodb.js` - 采购数据导入脚本
- `test-procurement-data-queries.js` - 采购数据查询测试脚本
- `procurement_dataset.json` - 采购流程数据集

## 数据导入

### 前置条件

1. 确保 MongoDB 服务正在运行（默认端口 27017）
2. 确保项目依赖已安装：`npm install`

### 执行导入

```bash
# 使用 npm 脚本
npm run import-procurement-data

# 或直接运行脚本
node scripts/import-procurement-data-to-mongodb.js
```

### 导入过程

导入脚本会执行以下操作：

1. **连接数据库**：连接到 `maintenance_system` 数据库
2. **读取数据**：读取 `procurement_dataset.json` 文件
3. **数据清理**：清空现有的 `procurement_data` 集合
4. **数据增强**：为每条记录添加导入时间戳和数据源标识
5. **批量插入**：将数据插入到 MongoDB 集合中
6. **创建索引**：为提高查询性能创建必要的索引
7. **数据验证**：显示导入统计信息和示例数据

### 创建的索引

- `process_instance_id` - 流程实例ID索引
- `node.id` - 节点ID索引
- `execution_timestamps.start_utc` - 开始时间索引
- `active_risk_factors.risk_id` - 风险因素ID索引
- `contextual_variables.project_type` - 项目类型索引
- `contextual_variables.procurement_category` - 采购类别索引

## 数据查询

### 执行查询测试

```bash
# 使用 npm 脚本
npm run test-procurement-data

# 或直接运行脚本
node scripts/test-procurement-data-queries.js
```

### 查询功能

查询脚本提供以下分析功能：

1. **基本统计信息**
   - 总记录数
   - 流程实例数量
   - 节点类型统计

2. **按项目类型统计**
   - 各项目类型的记录数量
   - 平均执行时间

3. **按采购类别统计**
   - 各采购类别的记录分布

4. **风险因素分析**
   - 各风险因素的出现次数
   - 平均风险值和最高风险值

5. **流程执行时间分析**
   - 各节点的平均执行时间
   - 执行时间范围统计

6. **特定流程实例查询**
   - 完整流程实例的节点执行情况

7. **高风险节点查询**
   - 风险值超过 0.8 的节点

8. **预算金额分析**
   - 预算金额的统计信息

## 数据结构

### 主要字段

```json
{
  "record_id": "唯一记录ID",
  "process_instance_id": "流程实例ID",
  "node": {
    "id": "节点ID",
    "name": "节点名称"
  },
  "execution_timestamps": {
    "start_utc": "开始时间",
    "end_utc": "结束时间"
  },
  "target_completion_time_seconds": "目标完成时间",
  "active_risk_factors": [
    {
      "risk_id": "风险ID",
      "description": "风险描述",
      "value": "风险值(0-1)"
    }
  ],
  "contextual_variables": {
    // 根据节点类型包含不同的业务参数
  },
  "import_timestamp": "导入时间",
  "data_source": "数据源标识"
}
```

### 节点类型

- **PU1** - 计划整合确定
- **PU2** - 品类管理
- **PU3** - 技术规格拆解
- **PU4** - 确定工程物料清单（EBOM）
- **PU5** - 确定制造物料清单（MBOM）
- **PU6** - 生产物资供应商准入管理
- **PU8** - 信息化类供应商准入管理
- **PU9** - 供应商考核评价
- **PU10** - 供应商日常管理
- **PU11** - 平台采购需求
- **PU12** - 采购方案编制
- **PU13** - 采购申请
- **PU14** - 采购限价制定
- **PU15** - 采购文件制定
- **PU16** - 招标采购
- **PU20** - 直接采购
- **PU21** - 招投标公示
- **PU22** - 采购合同起草
- **PU23** - 合同审批
- **PU24** - 合同归档
- **PU25** - 物料供应
- **PU26** - 物料入库
- **PU27** - 物料验收
- **PU28** - 物料仓储管理

### 风险因素类型

- `risk_01_supplier_delay` - 供应商交付延迟风险
- `risk_02_price_fluctuation` - 价格波动风险
- `risk_03_quality_issue` - 质量问题风险
- `risk_04_approval_delay` - 审批流程延迟
- `risk_05_resource_shortage` - 资源短缺风险
- `risk_06_regulatory_change` - 法规政策变化
- `risk_07_system_downtime` - 系统停机风险
- `risk_08_communication_gap` - 沟通协调问题
- `risk_09_urgent_requirement` - 紧急需求变更
- `risk_10_technical_complexity` - 技术复杂度过高

## 自定义查询示例

### 查询特定流程实例的所有节点

```javascript
const processInstanceData = await collection.find({ 
  "process_instance_id": "proc_run_20240102_0w8dzu" 
}).toArray();
```

### 查询高风险节点

```javascript
const highRiskNodes = await collection.find({
  "active_risk_factors": {
    $elemMatch: { "value": { $gt: 0.8 } }
  }
}).toArray();
```

### 按项目类型统计执行时间

```javascript
const stats = await collection.aggregate([
  {
    $group: {
      _id: "$contextual_variables.project_type",
      avgTime: { $avg: { $subtract: ["$execution_timestamps.end_utc", "$execution_timestamps.start_utc"] } }
    }
  }
]).toArray();
```

## 故障排除

### 常见问题

1. **MongoDB 连接失败**
   - 检查 MongoDB 服务是否正在运行
   - 确认连接字符串是否正确

2. **文件不存在**
   - 确认 `procurement_dataset.json` 文件在项目根目录

3. **内存不足**
   - 对于大型数据集，可能需要增加 Node.js 内存限制

### 日志信息

导入脚本会显示详细的进度信息，包括：
- 连接状态
- 文件读取状态
- 数据插入进度
- 索引创建状态
- 验证结果

## 性能优化

1. **批量插入**：使用 `insertMany` 进行批量数据插入
2. **索引优化**：为常用查询字段创建索引
3. **内存管理**：对于大型数据集，考虑分批处理

## 扩展功能

可以根据需要扩展以下功能：

1. **数据更新**：添加数据更新和增量导入功能
2. **数据导出**：添加数据导出功能
3. **实时监控**：添加实时数据监控功能
4. **API 接口**：创建 RESTful API 接口
5. **可视化**：集成数据可视化功能 