/**
 * MySQL数据库配置
 * 统一开发环境配置
 */

const mysqlConfig = {
  host: process.env.MYSQL_HOST || '47.103.58.58',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'ktuser',
  password: process.env.MYSQL_PASSWORD || 'PYH^FIks!TG5SnGz',
  database: process.env.MYSQL_DATABASE || 'ods_202509',
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: '+08:00'
};

module.exports = mysqlConfig;
