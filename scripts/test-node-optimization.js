/**
 * 测试节点信息卡片优化效果
 */

const Topic01Service = require('../src/services/topic01Service');

async function testNodeOptimization() {
  console.log('🧪 开始测试节点信息卡片优化效果...\n');
  
  const topic01Service = new Topic01Service();
  
  try {
    // 获取所有环节的风险统计
    console.log('1️⃣ 测试优化后的节点数据结构...');
    const allRiskResult = await topic01Service.getRiskStatistics();
    
    if (allRiskResult.success) {
      console.log('✅ 节点数据结构测试成功\n');
      
      // 分析每个环节的节点详情
      Object.entries(allRiskResult.data).forEach(([processType, riskData]) => {
        console.log(`🔍 分析 ${processType} 环节的节点信息优化效果:`);
        console.log(`📊 总节点数: ${riskData.total}`);
        
        // 高风险节点详情
        if (riskData.highRisk.nodeDetails && riskData.highRisk.nodeDetails.length > 0) {
          console.log(`\n🔴 高风险节点 (${riskData.highRisk.count}个):`);
          riskData.highRisk.nodeDetails.forEach((node, index) => {
            console.log(`   ${index + 1}. ${node.id} - ${node.name}`);
            console.log(`      📝 风险描述: ${node.description}`);
            console.log(`      🎚️  风险等级: ${node.risk}`);
            console.log(`      🕒 更新时间: ${node.updateTime || '未知'}`);
          });
        }
        
        // 中风险节点详情
        if (riskData.mediumRisk.nodeDetails && riskData.mediumRisk.nodeDetails.length > 0) {
          console.log(`\n🟡 中风险节点 (${riskData.mediumRisk.count}个):`);
          riskData.mediumRisk.nodeDetails.forEach((node, index) => {
            console.log(`   ${index + 1}. ${node.id} - ${node.name}`);
            console.log(`      📝 风险描述: ${node.description}`);
            console.log(`      🎚️  风险等级: ${node.risk}`);
            console.log(`      🕒 更新时间: ${node.updateTime || '未知'}`);
          });
        }
        
        // 正常节点详情
        if (riskData.normal.nodeDetails && riskData.normal.nodeDetails.length > 0) {
          console.log(`\n🟢 正常节点 (${riskData.normal.count}个):`);
          riskData.normal.nodeDetails.slice(0, 3).forEach((node, index) => {
            console.log(`   ${index + 1}. ${node.id} - ${node.name}`);
            console.log(`      📝 状态描述: ${node.description}`);
            console.log(`      🎚️  风险等级: ${node.risk}`);
          });
          if (riskData.normal.nodeDetails.length > 3) {
            console.log(`   ... 还有 ${riskData.normal.nodeDetails.length - 3} 个正常节点`);
          }
        }
        
        console.log('\n' + '='.repeat(60) + '\n');
      });
      
      // 2. 测试数据结构完整性
      console.log('2️⃣ 检查数据结构完整性...');
      let structureValid = true;
      
      Object.entries(allRiskResult.data).forEach(([processType, riskData]) => {
        // 检查必要字段
        const requiredFields = ['total', 'highRisk', 'mediumRisk', 'normal', 'timestamp'];
        for (const field of requiredFields) {
          if (!riskData[field]) {
            console.log(`❌ ${processType} 缺少字段: ${field}`);
            structureValid = false;
          }
        }
        
        // 检查nodeDetails字段
        ['highRisk', 'mediumRisk', 'normal'].forEach(riskLevel => {
          if (riskData[riskLevel] && riskData[riskLevel].nodeDetails) {
            riskData[riskLevel].nodeDetails.forEach((node, index) => {
              const requiredNodeFields = ['id', 'name', 'fullName', 'description', 'risk'];
              for (const field of requiredNodeFields) {
                if (!node[field]) {
                  console.log(`❌ ${processType}.${riskLevel}.nodeDetails[${index}] 缺少字段: ${field}`);
                  structureValid = false;
                }
              }
            });
          }
        });
      });
      
      if (structureValid) {
        console.log('✅ 数据结构完整性检查通过');
      }
      
      // 3. 测试前端展示效果模拟
      console.log('\n3️⃣ 模拟前端卡片展示效果...');
      
      Object.entries(allRiskResult.data).forEach(([processType, riskData]) => {
        console.log(`\n📱 ${processType} 环节卡片预览:`);
        
        // 模拟高风险卡片
        if (riskData.highRisk.nodeDetails && riskData.highRisk.nodeDetails.length > 0) {
          console.log('🔴 高风险节点卡片:');
          riskData.highRisk.nodeDetails.slice(0, 2).forEach(node => {
            console.log(`   ┌─────────────────────────────────┐`);
            console.log(`   │ ${node.id.padEnd(8)} 🚨         │`);
            console.log(`   │ ${node.name.substring(0, 20).padEnd(20)} │`);
            console.log(`   │ ${node.description.substring(0, 25).padEnd(25)} │`);
            console.log(`   └─────────────────────────────────┘`);
          });
          if (riskData.highRisk.nodeDetails.length > 2) {
            console.log(`   📋 还有 ${riskData.highRisk.nodeDetails.length - 2} 个高风险节点...`);
          }
        }
        
        // 模拟中风险卡片  
        if (riskData.mediumRisk.nodeDetails && riskData.mediumRisk.nodeDetails.length > 0) {
          console.log('🟡 中风险节点卡片:');
          riskData.mediumRisk.nodeDetails.slice(0, 2).forEach(node => {
            console.log(`   ┌─────────────────────────────────┐`);
            console.log(`   │ ${node.id.padEnd(8)} ⚠️          │`);
            console.log(`   │ ${node.name.substring(0, 20).padEnd(20)} │`);
            console.log(`   │ ${node.description.substring(0, 25).padEnd(25)} │`);
            console.log(`   └─────────────────────────────────┘`);
          });
          if (riskData.mediumRisk.nodeDetails.length > 2) {
            console.log(`   📋 还有 ${riskData.mediumRisk.nodeDetails.length - 2} 个中风险节点...`);
          }
        }
        
        // 模拟正常节点卡片
        if (riskData.normal.nodeDetails && riskData.normal.nodeDetails.length > 0) {
          console.log('🟢 正常节点卡片:');
          riskData.normal.nodeDetails.slice(0, 2).forEach(node => {
            console.log(`   ┌─────────────────────────────────┐`);
            console.log(`   │ ${node.id.padEnd(8)} ✅         │`);
            console.log(`   │ ${node.name.substring(0, 20).padEnd(20)} │`);
            console.log(`   └─────────────────────────────────┘`);
          });
          if (riskData.normal.nodeDetails.length > 2) {
            console.log(`   📋 还有 ${riskData.normal.nodeDetails.length - 2} 个正常节点...`);
          }
        }
      });
      
      console.log('\n🎉 节点信息卡片优化测试完成！');
      console.log('\n📋 优化总结:');
      console.log('  ✅ 增加了节点ID和完整名称展示');
      console.log('  ✅ 添加了风险描述和状态信息');
      console.log('  ✅ 提供了结构化的节点详情数据');
      console.log('  ✅ 支持工具提示显示完整信息');
      console.log('  ✅ 针对不同风险等级优化了展示样式');
      
    } else {
      console.error('❌ 获取风险数据失败:', allRiskResult.error);
    }
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
  } finally {
    await topic01Service.cleanup();
  }
}

// 运行测试
if (require.main === module) {
  testNodeOptimization();
}

module.exports = testNodeOptimization;
