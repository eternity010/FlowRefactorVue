/**
 * 测试所有环节的风险数据获取
 */

const Topic01Service = require('../src/services/topic01Service');

async function testAllRiskData() {
  console.log('🧪 开始测试所有环节的风险数据获取...\n');
  
  const topic01Service = new Topic01Service();
  
  try {
    // 1. 测试获取所有环节的风险统计
    console.log('1️⃣ 测试获取所有环节的风险统计...');
    const allRiskResult = await topic01Service.getRiskStatistics();
    
    if (allRiskResult.success) {
      console.log('✅ 获取所有环节风险数据成功');
      console.log('📊 包含的环节:', Object.keys(allRiskResult.data));
      
      // 显示每个环节的统计
      Object.entries(allRiskResult.data).forEach(([processType, riskData]) => {
        console.log(`\n📋 ${processType} 环节风险统计:`);
        console.log(`   - 总节点数: ${riskData.total}`);
        console.log(`   - 高风险节点: ${riskData.highRisk.count} 个`);
        console.log(`   - 中风险节点: ${riskData.mediumRisk.count} 个`);
        console.log(`   - 正常节点: ${riskData.normal.count} 个`);
        
        if (riskData.highRisk.nodes.length > 0) {
          console.log(`   - 高风险节点详情: ${riskData.highRisk.nodes.slice(0, 2).join(', ')}${riskData.highRisk.nodes.length > 2 ? '...' : ''}`);
        }
      });
    } else {
      console.error('❌ 获取所有环节风险数据失败:', allRiskResult.error);
    }
    
    // 2. 测试按环节分别获取
    console.log('\n2️⃣ 测试按环节分别获取风险数据...');
    const processTypes = ['marketing', 'purchase', 'production', 'operation'];
    
    for (const processType of processTypes) {
      console.log(`\n🔍 测试获取 ${processType} 环节数据...`);
      const singleResult = await topic01Service.getRiskStatistics(processType);
      
      if (singleResult.success) {
        console.log(`✅ ${processType} 环节数据获取成功`);
        console.log(`   总节点: ${singleResult.data.total}, 高风险: ${singleResult.data.highRisk.count}, 中风险: ${singleResult.data.mediumRisk.count}, 正常: ${singleResult.data.normal.count}`);
      } else {
        console.error(`❌ ${processType} 环节数据获取失败:`, singleResult.error);
      }
    }
    
    // 3. 测试数据库原始查询
    console.log('\n3️⃣ 测试数据库原始查询...');
    const rawQuery = `
      SELECT 
        CASE 
          WHEN activity_id LIKE 'MK%' THEN '营销'
          WHEN activity_id LIKE 'PU%' THEN '采购' 
          WHEN activity_id LIKE 'PD%' THEN '生产'
          WHEN activity_id LIKE 'OP%' THEN '运维'
          ELSE '其他'
        END as process_type,
        activity_risk,
        COUNT(*) as count
      FROM dm_topic0101_output_risk 
      WHERE del_flag = '0'
      GROUP BY process_type, activity_risk
      ORDER BY process_type, 
               CASE activity_risk 
                 WHEN '高' THEN 1 
                 WHEN '中' THEN 2 
                 WHEN '低' THEN 3 
                 ELSE 4 
               END
    `;
    
    const rawResult = await topic01Service.mysqlService.executeCustomQuery(rawQuery);
    
    if (rawResult.success) {
      console.log('✅ 数据库原始查询成功');
      console.log('📈 按环节和风险等级统计:');
      rawResult.data.forEach(row => {
        console.log(`   ${row.process_type}环节 - ${row.activity_risk}风险: ${row.count} 个节点`);
      });
    } else {
      console.error('❌ 数据库原始查询失败:', rawResult.error);
    }
    
    console.log('\n🎉 所有环节风险数据测试完成！');
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
  } finally {
    await topic01Service.cleanup();
  }
}

// 运行测试
if (require.main === module) {
  testAllRiskData();
}

module.exports = testAllRiskData;
