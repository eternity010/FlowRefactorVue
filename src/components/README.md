# RiskMonitoringDialog 组件

## 功能描述
风险监控详情弹窗组件，用于展示风险统计概览和详细风险事项列表。

## 使用方法

### 1. 导入组件
```javascript
import RiskMonitoringDialog from '@/components/RiskMonitoringDialog.vue';

export default {
  components: {
    RiskMonitoringDialog
  }
}
```

### 2. 模板中使用
```vue
<template>
  <div>
    <!-- 触发按钮 -->
    <el-button @click="showRiskDialog">显示风险详情</el-button>
    
    <!-- 风险监控弹窗组件 -->
    <RiskMonitoringDialog
      :visible.sync="riskDialogVisible"
      :risk-data="riskData"
      @view-details="handleViewDetails"
      @close="handleClose" />
  </div>
</template>
```

### 3. 数据定义
```javascript
data() {
  return {
    riskDialogVisible: false,
    riskData: {
      totalRisks: 24,
      highRisks: 5,
      mediumRisks: 12,
      lowRisks: 7,
      riskDetails: [
        {
          id: 'R001',
          name: '核心零部件断供',
          level: 'high', // 'high' | 'medium' | 'low'
          type: '采购风险',
          description: '关键供应商面临生产中断，可能导致核心零部件供应链断裂',
          impact: '严重影响生产进度，预计延误15-30天',
          probability: '85%',
          detectionTime: '2024-01-15 10:30',
          responsibleDept: '采购部',
          status: '待处理'
        }
        // ... 更多风险事项
      ]
    }
  }
}
```

## Props

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|------|
| visible | Boolean | 否 | false | 控制弹窗显示/隐藏 |
| riskData | Object | 是 | - | 风险数据对象 |

### riskData 对象结构
```javascript
{
  totalRisks: Number,    // 总风险数
  highRisks: Number,     // 高风险数
  mediumRisks: Number,   // 中风险数
  lowRisks: Number,      // 低风险数
  riskDetails: Array     // 风险详情数组
}
```

### riskDetails 数组元素结构
```javascript
{
  id: String,           // 风险ID
  name: String,         // 风险名称
  level: String,        // 风险等级: 'high' | 'medium' | 'low'
  type: String,         // 风险类型
  description: String,  // 风险描述
  impact: String,       // 影响说明
  probability: String,  // 发生概率
  detectionTime: String, // 检测时间
  responsibleDept: String, // 责任部门
  status: String        // 处理状态
}
```

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:visible | Boolean | 弹窗显示状态变更 |
| view-details | - | 点击"查看详情"按钮 |
| close | - | 弹窗关闭 |

## 功能特性

### 1. 风险统计概览
- 显示总风险数、高中低风险数量统计
- 不同风险等级使用不同颜色主题

### 2. 风险事项列表
- 展示详细的风险信息
- 支持筛选显示高风险事项
- 每个风险项显示等级标签、状态标签
- 包含完整的风险描述、影响分析等信息

### 3. 交互功能
- 筛选按钮：切换显示全部/仅高风险
- 关闭按钮：关闭弹窗
- 查看详情按钮：触发 view-details 事件

## 样式定制

组件使用 scoped 样式，如需定制样式，可通过以下方式：

1. 传入自定义 CSS 类名
2. 使用深度选择器覆盖样式
3. 修改组件内部样式变量

## 示例用法

完整示例请参考 `src/views/RefactorTimingView.vue` 文件中的使用方法。 