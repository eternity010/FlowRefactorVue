# Docker镜像运行指南

## 🎯 运行方式选择

### 方式一：使用Docker Compose（推荐）

这是最简单的方式，一键启动所有服务：

```bash
# 启动所有服务（前端+后端+数据库）
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs -f

# 停止所有服务
docker-compose down
```

### 方式二：分别运行各个镜像

#### 1. 启动MongoDB数据库
```bash
# 启动MongoDB
docker run -d \
  --name myvue-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_DATABASE=maintenance_system \
  -v mongo_data:/data/db \
  mongo:6.0
```

#### 2. 启动后端API服务
```bash
# 构建后端镜像（如果还没构建）
docker build -f Dockerfile.backend -t myvue-backend:latest .

# 启动后端容器
docker run -d \
  --name myvue-backend \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/maintenance_system \
  myvue-backend:latest
```

#### 3. 启动前端服务
```bash
# 构建前端镜像（如果还没构建）
docker build -f Dockerfile.frontend -t myvue-frontend:latest .

# 启动前端容器
docker run -d \
  --name myvue-frontend \
  -p 8080:80 \
  myvue-frontend:latest
```

### 方式三：使用构建脚本

#### 使用PowerShell脚本：
```powershell
# 构建并测试前端
.\test-docker-image.ps1

# 构建并测试后端
.\test-backend-image.ps1
```

## 📋 服务访问地址

启动成功后，可以通过以下地址访问：

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端应用 | http://localhost:8080 | Vue.js前端界面 |
| 后端API | http://localhost:3001 | Express API服务 |
| 健康检查 | http://localhost:3001/health | 后端服务状态 |
| MongoDB | localhost:27017 | 数据库服务 |

## 🔧 管理命令

### 查看容器状态
```bash
# 查看所有运行中的容器
docker ps

# 查看所有容器（包括停止的）
docker ps -a

# 查看特定容器
docker ps --filter "name=myvue"
```

### 查看容器日志
```bash
# 查看前端日志
docker logs myvue-frontend

# 查看后端日志
docker logs myvue-backend

# 查看数据库日志
docker logs myvue-mongo

# 实时查看日志
docker logs -f myvue-frontend
```

### 停止和删除容器
```bash
# 停止容器
docker stop myvue-frontend myvue-backend myvue-mongo

# 删除容器
docker rm myvue-frontend myvue-backend myvue-mongo

# 一次性停止并删除
docker rm -f myvue-frontend myvue-backend myvue-mongo
```

### 进入容器调试
```bash
# 进入前端容器
docker exec -it myvue-frontend sh

# 进入后端容器
docker exec -it myvue-backend sh

# 进入数据库容器
docker exec -it myvue-mongo mongosh
```

## 🚀 快速启动脚本

### 创建启动脚本
```powershell
# 创建快速启动脚本
@"
Write-Host "🚀 启动MyVue应用..." -ForegroundColor Green

# 检查Docker是否运行
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker未运行，请先启动Docker" -ForegroundColor Red
    exit 1
}

# 启动所有服务
Write-Host "📦 启动Docker Compose服务..." -ForegroundColor Yellow
docker-compose up -d

# 等待服务启动
Write-Host "⏳ 等待服务启动..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 检查服务状态
Write-Host "🔍 检查服务状态..." -ForegroundColor Yellow
docker-compose ps

Write-Host ""
Write-Host "🎉 服务启动完成!" -ForegroundColor Green
Write-Host "📋 访问地址:" -ForegroundColor Cyan
Write-Host "   - 前端应用: http://localhost:8080" -ForegroundColor White
Write-Host "   - 后端API: http://localhost:3001" -ForegroundColor White
Write-Host "   - 健康检查: http://localhost:3001/health" -ForegroundColor White
"@ | Out-File -FilePath "start-app.ps1" -Encoding UTF8
```

### 使用启动脚本
```powershell
# 运行启动脚本
.\start-app.ps1
```

## 🔍 故障排除

### 常见问题

#### 1. 端口冲突
```bash
# 检查端口占用
netstat -tulpn | grep 8080
netstat -tulpn | grep 3001
netstat -tulpn | grep 27017

# 使用不同端口
docker run -d -p 8081:80 --name myvue-frontend myvue-frontend:latest
```

#### 2. 容器无法启动
```bash
# 查看详细错误信息
docker logs myvue-backend

# 检查容器状态
docker ps -a

# 重新构建镜像
docker build -f Dockerfile.backend -t myvue-backend:latest . --no-cache
```

#### 3. 数据库连接失败
```bash
# 检查MongoDB是否运行
docker ps | grep mongo

# 检查网络连接
docker network inspect bridge

# 重启数据库容器
docker restart myvue-mongo
```

#### 4. 前端无法访问后端
```bash
# 检查后端是否正常运行
curl http://localhost:3001/health

# 检查网络配置
docker network ls
docker network inspect myvue_myvue-network
```

## 📊 监控和日志

### 资源监控
```bash
# 查看容器资源使用
docker stats

# 查看特定容器资源使用
docker stats myvue-frontend myvue-backend myvue-mongo
```

### 日志管理
```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs frontend
docker-compose logs backend
docker-compose logs mongo

# 实时查看日志
docker-compose logs -f
```

## 🧹 清理资源

### 停止所有服务
```bash
# 使用Docker Compose停止
docker-compose down

# 或者手动停止
docker stop $(docker ps -q --filter "name=myvue")
```

### 清理容器和镜像
```bash
# 删除所有相关容器
docker rm -f myvue-frontend myvue-backend myvue-mongo

# 删除镜像
docker rmi myvue-frontend:latest myvue-backend:latest

# 清理未使用的资源
docker system prune -a
```

## 🎯 推荐运行流程

1. **首次运行**：
   ```bash
   docker-compose up -d --build
   ```

2. **日常启动**：
   ```bash
   docker-compose up -d
   ```

3. **停止服务**：
   ```bash
   docker-compose down
   ```

4. **查看状态**：
   ```bash
   docker-compose ps
   ```

---

**提示**：建议使用Docker Compose方式，因为它可以自动处理服务依赖关系和网络配置。
