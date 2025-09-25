const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function testRiskDataAPI() {
  console.log('🧪 开始测试风险数据API...\n');
  
  try {
    // 测试1: 检查连接状态
    console.log('=== 测试1: 检查连接状态 ===');
    const connectionResponse = await axios.get(`${API_BASE_URL}/api/risk-data/connection`);
    console.log('✅ 连接状态:', connectionResponse.data);
    console.log('');

    // 测试2: 获取所有风险数据
    console.log('=== 测试2: 获取所有风险数据 ===');
    const dataResponse = await axios.get(`${API_BASE_URL}/api/risk-data`);
    
    if (dataResponse.data.success) {
      const riskData = dataResponse.data.data;
      console.log('✅ 获取风险数据成功');
      console.log(`📊 数据总数: ${riskData.length} 条`);
      
      if (riskData.length > 0) {
        console.log('📋 第一条数据预览:');
        const firstRecord = riskData[0];
        console.log(`   - 置信度: ${firstRecord.confidence}`);
        console.log(`   - 采购流程步骤数: ${Object.keys(firstRecord.purchase || {}).length}`);
        console.log(`   - ID: ${firstRecord._id}`);
        
        // 显示置信度分布
        const confidenceDistribution = {};
        riskData.forEach(record => {
          const confidence = record.confidence;
          confidenceDistribution[confidence] = (confidenceDistribution[confidence] || 0) + 1;
        });
        
        console.log('📈 置信度分布:');
        Object.entries(confidenceDistribution)
          .sort()
          .forEach(([confidence, count]) => {
            console.log(`   - ${confidence}: ${count} 条记录`);
          });
      }
    } else {
      console.log('❌ 获取风险数据失败:', dataResponse.data.error);
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ 无法连接到API服务器');
      console.log('💡 请确保API服务器正在运行: npm run api-server');
    } else {
      console.error('❌ 测试过程中发生错误:', error.message);
    }
  }
}

// 运行测试
testRiskDataAPI().then(() => {
  console.log('\n🎉 风险数据API测试完成!');
}).catch(error => {
  console.error('\n💥 测试失败:', error);
}); 