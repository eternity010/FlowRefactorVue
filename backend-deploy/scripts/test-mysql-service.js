/**
 * MySQL服务测试脚本
 */

const MySQLService = require('../src/services/mysqlService');

async function testMySQLService() {
  console.log('🧪 开始测试MySQL服务...\n');
  
  const mysqlService = new MySQLService();
  
  try {
    // 1. 测试数据库连接
    console.log('1️⃣ 测试数据库连接...');
    const connectionResult = await mysqlService.checkConnection();
    
    if (connectionResult.success) {
      console.log('✅ 数据库连接成功');
      console.log('📊 连接信息:', connectionResult.data);
    } else {
      console.log('❌ 数据库连接失败:', connectionResult.error);
      return;
    }
    
    // 2. 测试获取数据库表列表
    console.log('\n2️⃣ 测试获取数据库表列表...');
    const tablesResult = await mysqlService.getAllTables();
    
    if (tablesResult.success) {
      console.log('✅ 获取表列表成功');
      console.log('📋 表数量:', tablesResult.data.length);
      console.log('📋 表列表:', tablesResult.data.slice(0, 5).join(', '), tablesResult.data.length > 5 ? '...' : '');
    } else {
      console.log('❌ 获取表列表失败:', tablesResult.error);
    }
    
    // 3. 测试数据库统计信息
    console.log('\n3️⃣ 测试获取数据库统计信息...');
    const statsResult = await mysqlService.getDatabaseStats();
    
    if (statsResult.success) {
      console.log('✅ 获取统计信息成功');
      console.log('📈 统计信息:', {
        表数量: statsResult.data.tableCount,
        样例表: statsResult.data.tables.slice(0, 3).map(t => `${t.name}(${t.rowCount}行)`)
      });
    } else {
      console.log('❌ 获取统计信息失败:', statsResult.error);
    }
    
    console.log('\n🎉 MySQL服务测试完成！');
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
  } finally {
    await mysqlService.disconnect();
  }
}

// 运行测试
if (require.main === module) {
  testMySQLService();
}

module.exports = testMySQLService;
