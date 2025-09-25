const axios = require('axios');

// API配置
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001';

// 模拟高危节点ID列表（基于已知的采购环节高危风险节点）
const mockHighRiskNodeIds = [
  'PU22', // 采购合同起草
  'PU23', // 合同审批
  'PU27', // 物料验收
  'PU13', // 样件检验与签约
  'PU24', // 款项结算
  'PU25', // IQC与入库管理
  'PU26'  // 质量追溯与供应商管理
];

async function testGetHighRiskNodeData() {
  console.log('🚀 开始测试获取高危节点数据功能...\n');

  try {
    console.log('📊 测试数据准备完成:');
    console.log(`- 流程类型: purchase (采购流程)`);
    console.log(`- 高危节点数量: ${mockHighRiskNodeIds.length}`);
    console.log(`- 节点ID列表: ${mockHighRiskNodeIds.join(', ')}`);
    console.log(`- API端点: POST ${API_BASE_URL}/api/mermaid-flow/purchase/nodes\n`);

    // 调用API获取高危节点数据
    console.log('🔄 正在调用获取节点数据API...');
    const response = await axios.post(`${API_BASE_URL}/api/mermaid-flow/purchase/nodes`, {
      nodeIds: mockHighRiskNodeIds
    }, {
      timeout: 30000, // 30秒超时
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      console.log('✅ API调用成功!\n');
      
      const result = response.data.data;
      
      console.log('📋 === 获取结果概览 ===');
      console.log(`请求节点数量: ${result.totalRequested}`);
      console.log(`成功找到数量: ${result.totalFound}`);
      console.log(`未找到数量: ${result.notFoundNodes?.length || 0}`);
      console.log(`数据来源: ${result.source}`);
      console.log(`获取时间: ${result.timestamp}\n`);
      
      if (result.notFoundNodes && result.notFoundNodes.length > 0) {
        console.log('⚠️ === 未找到的节点 ===');
        result.notFoundNodes.forEach(nodeId => {
          console.log(`- ${nodeId}`);
        });
        console.log('');
      }
      
      if (result.nodeDataMap && Object.keys(result.nodeDataMap).length > 0) {
        console.log('✅ === 成功获取的节点数据（包含子流程详情） ===');
        Object.entries(result.nodeDataMap).forEach(([nodeId, nodeData]) => {
          console.log(`🔍 节点 ${nodeId}:`);
          console.log(`  - ID: ${nodeData.id || nodeData.nodeId || '未知'}`);
          console.log(`  - 名称: ${nodeData.label || nodeData.name || nodeData.nodeName || nodeData.description || '未知'}`);
          console.log(`  - 类型: ${nodeData.type || '未知'}`);
          console.log(`  - 数据来源: ${nodeData.source || '未知'}`);
          
          if (nodeData._foundPath) {
            console.log(`  - 发现路径: ${nodeData._foundPath}`);
          }
          
          // 新增：显示子流程信息
          if (nodeData.flowCount && nodeData.flowCount > 0) {
            console.log(`  📋 子流程详情:`);
            console.log(`    - 描述: ${nodeData.description || '未知'}`);
            console.log(`    - 子流程数量: ${nodeData.flowCount}`);
            console.log(`    - 当前使用流程: ${nodeData.currentFlowNumber || 1}`);
            console.log(`    - 主流程: ${nodeData.mermaidDefinition1 ? '存在' : '不存在'}`);
            console.log(`    - 备用流程: ${nodeData.mermaidDefinition2 ? '存在' : '不存在'}`);
            
            if (nodeData.mermaidDefinition1) {
              const mainFlowLines = nodeData.mermaidDefinition1.split('\n').filter(line => line.trim());
              console.log(`    - 主流程步骤数: ${mainFlowLines.filter(line => line.includes('[')).length}`);
            }
            
            if (nodeData.mermaidDefinition2) {
              const altFlowLines = nodeData.mermaidDefinition2.split('\n').filter(line => line.trim());
              console.log(`    - 备用流程步骤数: ${altFlowLines.filter(line => line.includes('[')).length}`);
            }
            
            if (nodeData.createdAt) {
              console.log(`    - 创建时间: ${nodeData.createdAt}`);
            }
          } else {
            console.log(`  📋 子流程详情: 无子流程信息`);
          }
          
          console.log('');
        });
      }
      
      console.log('📊 === 原始流程数据信息 ===');
      const originalFlowData = result.originalFlowData;
      if (originalFlowData) {
        console.log(`- 数据ID: ${originalFlowData._id}`);
        console.log(`- 导入时间: ${originalFlowData.importedAt}`);
        console.log(`- 数据结构:`, originalFlowData.dataStructure);
      }
      
      // 新增：数据增强信息
      if (result.dataEnhancement) {
        console.log('\n🚀 === 数据增强信息 ===');
        const enhancement = result.dataEnhancement;
        console.log(`- 包含子流程详情: ${enhancement.includesSubProcessDetails ? '是' : '否'}`);
        console.log(`- 包含子流程的节点数: ${enhancement.subProcessNodesFound || 0}`);
        console.log(`- 子流程字段: ${(enhancement.subProcessFieldsIncluded || []).join(', ')}`);
        console.log(`- 增强时间: ${enhancement.enhancementTimestamp}`);
        
        // 计算子流程覆盖率
        const subProcessCoverage = result.totalFound > 0 ? 
          ((enhancement.subProcessNodesFound || 0) / result.totalFound * 100).toFixed(1) : 0;
        console.log(`- 子流程覆盖率: ${subProcessCoverage}%`);
      }
      
      console.log('\n🎯 === 测试验证 ===');
      
      // 验证API响应格式（增强版本）
      const expectedFields = ['nodeDataMap', 'notFoundNodes', 'totalRequested', 'totalFound', 'source', 'timestamp', 'dataEnhancement'];
      const actualFields = Object.keys(result);
      const missingFields = expectedFields.filter(field => !actualFields.includes(field));
      
      if (missingFields.length === 0) {
        console.log('✅ API响应格式验证通过（包含数据增强字段）');
      } else {
        console.log('⚠️ API响应格式验证失败，缺少字段:', missingFields);
      }
      
      // 验证数据完整性
      const successRate = (result.totalFound / result.totalRequested) * 100;
      console.log(`📈 数据获取成功率: ${successRate.toFixed(1)}%`);
      
      // 新增：验证子流程数据质量
      const nodesWithSubProcess = Object.values(result.nodeDataMap).filter(node => 
        node.flowCount && node.flowCount > 0 && 
        (node.mermaidDefinition1 || node.mermaidDefinition2)
      );
      
      if (nodesWithSubProcess.length > 0) {
        console.log(`✅ 子流程数据质量验证:`);
        console.log(`   - 包含完整子流程的节点: ${nodesWithSubProcess.length}/${result.totalFound}`);
        
        const withMainFlow = nodesWithSubProcess.filter(node => node.mermaidDefinition1).length;
        const withAltFlow = nodesWithSubProcess.filter(node => node.mermaidDefinition2).length;
        
        console.log(`   - 包含主流程: ${withMainFlow}/${nodesWithSubProcess.length}`);
        console.log(`   - 包含备用流程: ${withAltFlow}/${nodesWithSubProcess.length}`);
      } else {
        console.log(`⚠️ 未找到包含子流程详情的节点`);
      }
      
      if (successRate >= 80) {
        console.log('✅ 数据获取成功率良好');
      } else if (successRate >= 50) {
        console.log('⚠️ 数据获取成功率一般，可能需要检查节点ID映射');
      } else {
        console.log('❌ 数据获取成功率较低，建议检查数据源和节点ID');
      }
      
    } else {
      console.error('❌ API调用失败:', response.data.error || response.data.message);
    }

  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error.message);
    
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    } else if (error.request) {
      console.error('请求错误:', error.request);
    }
  }

  console.log('\n🎉 高危节点数据获取功能测试完成!');
}

// 额外测试：测试不同的节点ID格式
async function testDifferentNodeIdFormats() {
  console.log('\n🧪 开始测试不同节点ID格式...');
  
  const testCases = [
    {
      name: '采购环节节点ID（PU前缀）',
      nodeIds: ['PU1', 'PU2', 'PU3']
    },
    {
      name: '数字节点ID',
      nodeIds: ['1', '2', '3']
    },
    {
      name: '混合格式节点ID',
      nodeIds: ['PU22', '样件检验与签约', 'node_001']
    }
  ];
  
  for (const testCase of testCases) {
    try {
      console.log(`\n🔍 测试案例: ${testCase.name}`);
      console.log(`节点ID: ${testCase.nodeIds.join(', ')}`);
      
      const response = await axios.post(`${API_BASE_URL}/api/mermaid-flow/purchase/nodes`, {
        nodeIds: testCase.nodeIds
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        const result = response.data.data;
        console.log(`✅ 成功: 找到 ${result.totalFound}/${result.totalRequested} 个节点`);
      } else {
        console.log(`❌ 失败: ${response.data.error}`);
      }
      
    } catch (error) {
      console.log(`❌ 异常: ${error.message}`);
    }
  }
}

// 测试错误处理
async function testErrorHandling() {
  console.log('\n🚨 开始测试错误处理...');
  
  const errorTestCases = [
    {
      name: '空节点ID数组',
      data: { nodeIds: [] }
    },
    {
      name: '无效的流程类型',
      endpoint: '/api/mermaid-flow/invalid-type/nodes',
      data: { nodeIds: ['PU01'] }
    },
    {
      name: '缺少nodeIds参数',
      data: {}
    },
    {
      name: 'nodeIds不是数组',
      data: { nodeIds: 'PU01,PU02' }
    }
  ];
  
  for (const testCase of errorTestCases) {
    try {
      console.log(`\n🔍 错误测试: ${testCase.name}`);
      
      const endpoint = testCase.endpoint || '/api/mermaid-flow/purchase/nodes';
      
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, testCase.data, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`⚠️ 期望错误但得到成功响应:`, response.data);
      
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        console.log(`✅ 正确处理错误: ${error.response.status} - ${error.response.data.error || error.response.data.message}`);
      } else {
        console.log(`❌ 非预期错误: ${error.message}`);
      }
    }
  }
}

// 支持命令行参数
const args = process.argv.slice(2);
const showHelp = args.includes('--help') || args.includes('-h');
const testAll = args.includes('--all') || args.includes('-a');
const testError = args.includes('--error') || args.includes('-e');

if (showHelp) {
  console.log(`
🔧 高危节点数据获取功能测试工具

用法:
  node scripts/test-get-high-risk-node-data.js [选项]

选项:
  --help, -h     显示帮助信息
  --all, -a      运行所有测试（包括格式和错误测试）
  --error, -e    只运行错误处理测试

说明:
  该脚本会测试从maintenance_system数据库的purchase_flow_mermaid集合
  获取高危节点数据的功能，验证API端点、数据格式和错误处理。
  
  测试的节点ID基于已知的采购环节高危风险节点。

示例:
  node scripts/test-get-high-risk-node-data.js          # 基础测试
  node scripts/test-get-high-risk-node-data.js --all    # 全面测试
  node scripts/test-get-high-risk-node-data.js --error  # 错误测试
`);
} else {
  // 运行测试
  (async () => {
    await testGetHighRiskNodeData();
    
    if (testAll) {
      await testDifferentNodeIdFormats();
      await testErrorHandling();
    } else if (testError) {
      await testErrorHandling();
    }
  })();
}
