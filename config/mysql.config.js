/**
 * MySQL数据库配置
 */

// 开发环境配置
const development = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '666666',
  database: process.env.MYSQL_DATABASE || 'sys',
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4',
  timezone: '+08:00'
};

// 生产环境配置
const production = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '666666',
  database: process.env.MYSQL_DATABASE || 'sys',
  connectionLimit: 20,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4',
  timezone: '+08:00'
};

const env = process.env.NODE_ENV || 'development';
const configs = { development, production };
const config = configs[env] || development;

module.exports = config;
