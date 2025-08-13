# Docker Compose 使用指南

## 🎯 Docker Compose 的作用

Docker Compose 是一个用于定义和运行多容器 Docker 应用程序的工具，主要作用包括：

### 1. **多容器应用管理**
- 将多个相关容器组织在一起
- 定义服务间的依赖关系
- 自动创建容器间网络通信

### 2. **简化部署流程**
- 一个命令启动整个应用栈
- 统一的环境配置管理
- 自动处理服务启动顺序

### 3. **开发环境标准化**
- 确保开发、测试、生产环境一致
- 快速搭建完整的开发环境
- 便于团队协作

## 🚀 快速开始

### 启动所有服务
```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs -f
```

### 启动特定服务
```bash
# 只启动前端和数据库
docker-compose up -d frontend mongo

# 启动开发环境（包含MongoDB管理界面）
docker-compose --profile dev up -d
```

## 📋 服务说明

### 1. **前端服务 (frontend)**
- **端口**: 8080
- **访问地址**: http://localhost:8080
- **功能**: Vue.js 前端应用
- **健康检查**: http://localhost:8080/health

### 2. **MongoDB数据库 (mongo)**
- **端口**: 27017
- **数据库名**: maintenance_system
- **数据持久化**: mongo_data 卷
- **初始化数据**: ./MongoDB 目录

### 3. **MongoDB管理界面 (mongo-express)**
- **端口**: 8081
- **访问地址**: http://localhost:8081
- **用户名**: admin
- **密码**: admin123
- **仅在开发环境启动**

## 🔧 常用命令

### 服务管理
```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 重新构建并启动
docker-compose up -d --build
```

### 日志查看
```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs frontend

# 实时查看日志
docker-compose logs -f
```

### 服务操作
```bash
# 进入容器
docker-compose exec frontend sh
docker-compose exec mongo mongosh

# 执行命令
docker-compose exec frontend nginx -t

# 查看服务状态
docker-compose ps
```

## 🛠️ 环境配置

### 环境变量
可以通过 `.env` 文件或环境变量配置：

```bash
# 创建 .env 文件
NODE_ENV=production
MONGODB_URI=mongodb://mongo:27017/maintenance_system
```

### 配置文件
```yaml
# docker-compose.override.yml (开发环境)
version: '3.8'
services:
  frontend:
    volumes:
      - ./src:/app/src  # 热重载
    environment:
      - NODE_ENV=development
```

## 📊 监控和调试

### 健康检查
```bash
# 查看健康状态
docker-compose ps

# 查看健康检查日志
docker-compose exec frontend curl http://localhost/health
```

### 资源监控
```bash
# 查看资源使用情况
docker stats

# 查看网络信息
docker network ls
docker network inspect myvue_myvue-network
```

## 🔍 故障排除

### 常见问题

#### 1. 端口冲突
```bash
# 检查端口占用
netstat -tulpn | grep 8080

# 修改端口映射
# 在 docker-compose.yml 中修改 ports 配置
```

#### 2. 服务启动失败
```bash
# 查看详细日志
docker-compose logs frontend

# 检查服务依赖
docker-compose config

# 重新构建服务
docker-compose build --no-cache frontend
```

#### 3. 数据持久化问题
```bash
# 查看数据卷
docker volume ls

# 备份数据
docker run --rm -v myvue_mongo_data:/data -v $(pwd):/backup alpine tar czf /backup/mongo_backup.tar.gz -C /data .
```

## 🚀 生产环境部署

### 生产配置
```bash
# 使用生产配置文件
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 设置资源限制
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --scale frontend=2
```

### 备份和恢复
```bash
# 备份数据库
docker-compose exec mongo mongodump --out /data/backup

# 恢复数据库
docker-compose exec mongo mongorestore /data/backup
```

## 📝 最佳实践

### 1. **服务分离**
- 将不同环境配置分离
- 使用 profiles 管理可选服务
- 合理设置服务依赖关系

### 2. **数据管理**
- 使用命名卷进行数据持久化
- 定期备份重要数据
- 合理设置数据卷权限

### 3. **安全考虑**
- 不在生产环境暴露管理端口
- 使用环境变量管理敏感信息
- 定期更新基础镜像

### 4. **性能优化**
- 合理设置资源限制
- 使用健康检查监控服务状态
- 配置日志轮转

## 🔗 相关链接

- [Docker Compose 官方文档](https://docs.docker.com/compose/)
- [Docker Compose 文件参考](https://docs.docker.com/compose/compose-file/)
- [Docker Compose 最佳实践](https://docs.docker.com/compose/production/)

---

**提示**: 在生产环境中，建议使用 Docker Swarm 或 Kubernetes 进行容器编排，Docker Compose 更适合开发和测试环境。
