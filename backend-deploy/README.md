# 后端服务器部署指南

## 📦 部署包内容

```
backend-deploy/
├── services/           # 所有业务服务文件
├── config/            # 配置文件
├── package.json       # 依赖配置
├── package-lock.json  # 锁定版本
├── start-server.js    # 启动脚本
└── README.md         # 本说明文件
```

## 🚀 部署步骤

### 1. 环境要求
- **Node.js**: >= 6.0.0
- **NPM**: >= 3.0.0
- **MongoDB**: 数据库服务
- **MySQL**: 数据库服务

### 2. 安装依赖
```bash
cd backend-deploy
npm install --only=production
```

### 3. 配置环境变量
创建 `.env` 文件：
```env
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/maintenance_system
MONGODB_DB=maintenance_system
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=your_database
```

### 4. 启动服务器

**方式一：直接启动**
```bash
node start-server.js
```

**方式二：使用PM2（推荐生产环境）**
```bash
npm install -g pm2
pm2 start start-server.js --name "backend-api"
pm2 startup
pm2 save
```

### 5. 验证服务
访问健康检查端点：
```bash
curl http://localhost:3001/health
```

## 🔧 配置说明

### 数据库配置
- 修改 `config/mongodb.config.js` 中的MongoDB连接设置
- 修改 `config/mysql.config.js` 中的MySQL连接设置

### 服务端口
- 默认端口：3001
- 可通过环境变量 `PORT` 修改

## 📊 API端点
- `/health` - 健康检查
- `/api/flow-data/*` - 流程数据管理
- `/api/topic01/*` - Topic01业务服务
- `/api/topic02/*` - Topic02业务服务
- `/api/topic03/*` - 车辆人员匹配度
- `/api/topic04/*` - 运维订单管理
- 更多API详见完整文档

## 🛠️ 维护命令

```bash
# 查看日志
pm2 logs backend-api

# 重启服务
pm2 restart backend-api

# 停止服务
pm2 stop backend-api

# 删除服务
pm2 delete backend-api
```

## ⚠️ 注意事项

1. **数据库连接**：确保MongoDB和MySQL服务正常运行
2. **端口冲突**：确保3001端口未被占用
3. **权限问题**：确保有读写日志文件的权限
4. **防火墙**：开放3001端口的网络访问

## 🐳 Docker部署（可选）

如果使用Docker部署，可参考项目根目录的 `Dockerfile.backend`
