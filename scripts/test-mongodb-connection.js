/**
 * 测试MongoDB连接配置
 */

const mongoConfig = require('../config/mongodb.config');

async function testMongoConnection() {
  console.log('🧪 开始测试MongoDB连接配置...\n');
  
  try {
    // 显示配置信息
    mongoConfig.showCurrentConfig();
    
    // 验证配置
    if (!mongoConfig.validateConfig()) {
      throw new Error('MongoDB配置验证失败');
    }
    
    // 动态导入MongoDB客户端
    const { MongoClient } = require('mongodb');
    
    // 创建连接
    const uri = mongoConfig.getConnectionString();
    const database = mongoConfig.getDatabaseName();
    const options = mongoConfig.getConnectionOptions();
    
    console.log('🔗 尝试连接到MongoDB...');
    const client = new MongoClient(uri, options);
    
    // 连接到数据库
    await client.connect();
    console.log('✅ 成功连接到MongoDB服务器');
    
    // 测试数据库访问
    const db = client.db(database);
    console.log(`✅ 成功访问数据库: ${database}`);
    
    // 列出集合
    const collections = await db.listCollections().toArray();
    console.log(`📊 数据库中的集合数量: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('📋 数据库集合列表:');
      collections.forEach((collection, index) => {
        console.log(`   ${index + 1}. ${collection.name}`);
      });
    } else {
      console.log('⚠️ 数据库中暂无集合');
    }
    
    // 测试管理员命令
    try {
      const admin = db.admin();
      const serverStatus = await admin.serverStatus();
      console.log(`✅ 服务器状态: 运行中 (版本: ${serverStatus.version})`);
    } catch (adminError) {
      console.log('ℹ️ 无法获取服务器状态 (可能权限不足)');
    }
    
    // 关闭连接
    await client.close();
    console.log('🔌 已关闭数据库连接');
    
    console.log('\n🎉 MongoDB连接测试成功！');
    return true;
    
  } catch (error) {
    console.error('\n❌ MongoDB连接测试失败:');
    console.error(`错误类型: ${error.name}`);
    console.error(`错误信息: ${error.message}`);
    
    if (error.code) {
      console.error(`错误代码: ${error.code}`);
    }
    
    // 提供常见错误的解决建议
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 可能的解决方案:');
      console.error('   1. 检查网络连接');
      console.error('   2. 确认MongoDB服务器地址和端口是否正确');
      console.error('   3. 检查防火墙设置');
    } else if (error.message.includes('Authentication failed')) {
      console.error('\n💡 可能的解决方案:');
      console.error('   1. 检查用户名和密码是否正确');
      console.error('   2. 确认认证数据库 (authSource) 设置');
      console.error('   3. 验证用户权限');
    } else if (error.message.includes('timeout')) {
      console.error('\n💡 可能的解决方案:');
      console.error('   1. 检查网络连接稳定性');
      console.error('   2. 增加连接超时时间');
      console.error('   3. 确认服务器负载情况');
    }
    
    return false;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  testMongoConnection().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = testMongoConnection;
