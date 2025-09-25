/**
 * MongoDB数据库连接配置
 * 统一开发环境配置
 */

const mongoConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://admin:pwd123@119.45.15.167:27017/maintenance_system?authSource=maintenance_system',
  database: process.env.MONGODB_DB || 'maintenance_system',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4 // Use IPv4, skip trying IPv6
  }
};

/**
 * 获取MongoDB配置
 * @returns {Object} MongoDB配置对象
 */
function getMongoConfig() {
  console.log(`📊 使用MongoDB配置`);
  console.log(`🔗 连接URI: ${mongoConfig.uri}`);
  console.log(`💾 数据库名: ${mongoConfig.database}`);
  
  return mongoConfig;
}

/**
 * 获取完整的连接字符串
 * @returns {string} 完整的MongoDB连接字符串
 */
function getConnectionString() {
  return mongoConfig.uri;
}

/**
 * 获取数据库名称
 * @returns {string} 数据库名称
 */
function getDatabaseName() {
  return mongoConfig.database;
}

/**
 * 获取连接选项
 * @returns {Object} MongoDB连接选项
 */
function getConnectionOptions() {
  return mongoConfig.options;
}

/**
 * 验证配置是否有效
 * @returns {boolean} 配置是否有效
 */
function validateConfig() {
  try {
    if (!mongoConfig.uri) {
      throw new Error('MongoDB URI不能为空');
    }
    
    if (!mongoConfig.database) {
      throw new Error('数据库名称不能为空');
    }
    
    // 验证URI格式
    if (!mongoConfig.uri.startsWith('mongodb://') && !mongoConfig.uri.startsWith('mongodb+srv://')) {
      throw new Error('无效的MongoDB URI格式');
    }
    
    console.log('✅ MongoDB配置验证通过');
    return true;
  } catch (error) {
    console.error('❌ MongoDB配置验证失败:', error.message);
    return false;
  }
}

/**
 * 显示当前配置信息
 */
function showCurrentConfig() {
  console.log('\n=== MongoDB配置信息 ===');
  console.log(`URI: ${mongoConfig.uri}`);
  console.log(`数据库: ${mongoConfig.database}`);
  console.log(`连接池大小: ${mongoConfig.options.maxPoolSize}`);
  console.log(`连接超时: ${mongoConfig.options.serverSelectionTimeoutMS}ms`);
  console.log(`Socket超时: ${mongoConfig.options.socketTimeoutMS}ms`);
  console.log('========================\n');
}

module.exports = {
  getMongoConfig,
  getConnectionString,
  getDatabaseName,
  getConnectionOptions,
  validateConfig,
  showCurrentConfig,
  // 向后兼容的导出
  MONGODB_URI: getConnectionString(),
  DATABASE_NAME: getDatabaseName()
};
