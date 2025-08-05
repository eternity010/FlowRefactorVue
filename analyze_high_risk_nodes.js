const fs = require('fs');

// 读取数据
const data = JSON.parse(fs.readFileSync('procurement_dataset.json', 'utf8'));

// 风险阈值定义
const RISK_THRESHOLDS = {
  HIGH: 0.7,
  MEDIUM: 0.3
};

// 分析函数
function analyzeHighRiskNodes() {
  console.log('🔍 采购流程高风险节点分析\n');
  
  // 1. 按节点分组
  const nodeGroups = {};
  
  data.forEach(record => {
    const nodeId = record.node.id;
    const nodeName = record.node.name;
    
    if (!nodeGroups[nodeId]) {
      nodeGroups[nodeId] = {
        nodeId,
        nodeName,
        records: [],
        riskStats: {
          totalRecords: 0,
          highRiskRecords: 0,
          avgRiskValue: 0,
          maxRiskValue: 0,
          riskFactors: {}
        }
      };
    }
    
    nodeGroups[nodeId].records.push(record);
  });
  
  // 2. 分析每个节点的风险
  Object.values(nodeGroups).forEach(node => {
    let totalRiskValue = 0;
    let riskFactorCount = 0;
    let highRiskCount = 0;
    let maxRiskInNode = 0;
    
    node.records.forEach(record => {
      let hasHighRisk = false;
      
      record.active_risk_factors.forEach(factor => {
        totalRiskValue += factor.value;
        riskFactorCount++;
        
        // 统计风险因子
        if (!node.riskStats.riskFactors[factor.risk_id]) {
          node.riskStats.riskFactors[factor.risk_id] = {
            description: factor.description,
            count: 0,
            avgValue: 0,
            totalValue: 0
          };
        }
        
        node.riskStats.riskFactors[factor.risk_id].count++;
        node.riskStats.riskFactors[factor.risk_id].totalValue += factor.value;
        
        // 检查高风险
        if (factor.value >= RISK_THRESHOLDS.HIGH) {
          hasHighRisk = true;
          maxRiskInNode = Math.max(maxRiskInNode, factor.value);
        }
      });
      
      if (hasHighRisk) {
        highRiskCount++;
      }
    });
    
    // 计算统计值
    node.riskStats.totalRecords = node.records.length;
    node.riskStats.highRiskRecords = highRiskCount;
    node.riskStats.avgRiskValue = riskFactorCount > 0 ? totalRiskValue / riskFactorCount : 0;
    node.riskStats.maxRiskValue = maxRiskInNode;
    
    // 计算风险因子的平均值
    Object.values(node.riskStats.riskFactors).forEach(factor => {
      factor.avgValue = factor.totalValue / factor.count;
    });
  });
  
  // 3. 识别高风险节点
  const highRiskNodes = Object.values(nodeGroups).filter(node => {
    return node.riskStats.highRiskRecords > 0 || node.riskStats.avgRiskValue >= RISK_THRESHOLDS.MEDIUM;
  }).sort((a, b) => b.riskStats.avgRiskValue - a.riskStats.avgRiskValue);
  
  // 4. 输出结果
  console.log('🚨 高风险节点 (Top 10):');
  
  highRiskNodes.slice(0, 10).forEach((node, index) => {
    const riskLevel = node.riskStats.avgRiskValue >= RISK_THRESHOLDS.HIGH ? '🔴' :
                     node.riskStats.avgRiskValue >= RISK_THRESHOLDS.MEDIUM ? '🟡' : '🟢';
    
    console.log(`${index + 1}. ${node.nodeId} ${node.nodeName} ${riskLevel}${(node.riskStats.avgRiskValue * 100).toFixed(0)}%`);
  });
  
  // 5. 风险因子全局分析
  console.log('\n📊 主要风险因子 (Top 5):');
  
  const globalRiskFactors = {};
  
  data.forEach(record => {
    record.active_risk_factors.forEach(factor => {
      if (!globalRiskFactors[factor.risk_id]) {
        globalRiskFactors[factor.risk_id] = {
          description: factor.description,
          count: 0,
          totalValue: 0
        };
      }
      
      globalRiskFactors[factor.risk_id].count++;
      globalRiskFactors[factor.risk_id].totalValue += factor.value;
    });
  });
  
  const sortedRiskFactors = Object.entries(globalRiskFactors)
    .sort(([,a], [,b]) => (b.totalValue / b.count) - (a.totalValue / a.count))
    .slice(0, 5);
  
  sortedRiskFactors.forEach(([riskId, factor], index) => {
    const avgValue = factor.totalValue / factor.count;
    const riskLevel = avgValue >= RISK_THRESHOLDS.HIGH ? '🔴' :
                     avgValue >= RISK_THRESHOLDS.MEDIUM ? '🟡' : '🟢';
    
    console.log(`${index + 1}. ${riskLevel}${(avgValue * 100).toFixed(0)}% ${factor.description}`);
  });
  
  console.log('\n✅ 分析完成');
  
  return {
    highRiskNodes,
    globalRiskFactors
  };
}

// 执行分析
const analysis = analyzeHighRiskNodes();

// 导出结果到JSON文件
fs.writeFileSync('risk_analysis_result.json', JSON.stringify(analysis, null, 2));
console.log('✅ 分析结果已保存到 risk_analysis_result.json'); 