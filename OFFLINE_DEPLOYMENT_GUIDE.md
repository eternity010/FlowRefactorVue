# MyVue应用离线部署指南

## 📋 概述

本指南将帮助您将MyVue应用部署到离线Linux服务器上，连接服务器本地部署的MongoDB数据库。整个过程分为本地准备和服务器部署两个阶段。

## 🏠 第一阶段：本地准备

### 1. 构建Docker镜像

首先确保您已经构建了前端和后端镜像：

```bash
# 构建前端镜像
docker build -f Dockerfile.frontend -t myvue-frontend:latest .

# 构建后端镜像
docker build -f Dockerfile.backend -t myvue-backend:latest .
```

### 2. 导出镜像

运行导出脚本创建部署包：

```powershell
# 在Windows上运行
.\export-images.ps1
```

或者手动导出：

```bash
# 创建导出目录
mkdir docker-images

# 导出镜像
docker save -o D:\vue_project/myvue-frontend.tar myvue-frontend:latest
docker save -o D:\vue_project/myvue-backend.tar myvue-backend:latest
```

### 3. 准备部署文件

确保以下文件已准备好：

- `deploy-on-server.sh` - 服务器部署脚本
- `start-app.sh` - 应用启动脚本
- `myvue-frontend-*.tar` - 前端镜像文件
- `myvue-backend-*.tar` - 后端镜像文件

## 🖥️ 第二阶段：服务器部署

### 1. 上传文件到服务器

将整个部署包上传到Linux服务器：

```bash
# 使用scp上传
scp -r myvue-deployment-*.zip user@server-ip:/home/user/

# 或使用其他文件传输工具
```

### 2. 在服务器上解压

```bash
# 登录服务器
ssh user@server-ip

# 解压部署包
unzip myvue-deployment-*.zip
cd myvue-deployment-*
```

### 3. 运行部署脚本

```bash
# 给脚本执行权限
chmod +x deploy-on-server.sh
chmod +x start-app.sh

# 运行部署脚本
./deploy-on-server.sh
```

部署脚本会自动：
- 检查Docker和Docker Compose安装状态
- 加载Docker镜像
- 配置MongoDB连接信息
- 创建docker-compose.yml文件
- 启动前端和后端服务

## 🔧 服务器环境要求

### 必需软件

1. **Docker** (版本 20.10+)
2. **Docker Compose** (版本 2.0+)
3. **MongoDB** (已安装并运行在服务器上)

### 安装Docker (如果未安装)

```bash
# 安装Docker
curl -fsSL https://get.docker.com | sh

# 启动Docker服务
sudo systemctl start docker
sudo systemctl enable docker

# 将当前用户添加到docker组
sudo usermod -aG docker $USER

# 重新登录或运行
newgrp docker
```

### 安装Docker Compose (如果未安装)

```bash
# 下载Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 给执行权限
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker-compose --version
```

注意：离线环境无法在线下载，请提前在可联网环境准备好对应架构的 docker-compose 二进制文件并拷贝到服务器（或确保服务器已预装 Compose）。

## 📊 MongoDB配置

### 确保MongoDB运行

```bash
# 检查MongoDB状态
sudo systemctl status mongod

# 启动MongoDB (如果未运行)
sudo systemctl start mongod
sudo systemctl enable mongod

# 检查MongoDB端口
netstat -tlnp | grep 27017
```

### MongoDB连接配置

部署脚本会询问以下信息：
- MongoDB主机地址 (默认: localhost)
- MongoDB端口 (默认: 27017)
- 数据库名 (默认: maintenance_system)
- 用户名 (可选)
- 密码 (可选)

配置信息会保存在 `.env` 文件中。

## 🚀 启动和管理

### 启动应用

```bash
# 使用启动脚本
./start-app.sh

# 或手动启动
docker-compose up -d
```

### 查看服务状态

```bash
# 查看所有服务状态
docker-compose ps

# 查看服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f frontend
docker-compose logs -f backend
```

### 停止服务

```bash
# 停止所有服务
docker-compose down

# 停止并删除容器
docker-compose down -v
```

### 重启服务

```bash
# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart backend
```

## 🌐 访问应用

部署成功后，可以通过以下地址访问：

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端应用 | http://服务器IP:8080 | Vue.js前端界面 |
| 后端API | http://服务器IP:3001 | Express API服务 |
| 健康检查 | http://服务器IP:3001/health | 后端服务状态 |

## 🔍 故障排除

### 常见问题

#### 1. 端口被占用

```bash
# 检查端口占用
netstat -tlnp | grep 8080
netstat -tlnp | grep 3001

# 修改端口映射
# 编辑 docker-compose.yml 文件
```

#### 2. 容器启动失败

```bash
# 查看容器日志
docker-compose logs backend
docker-compose logs frontend

# 检查容器状态
docker-compose ps -a
```

#### 3. MongoDB连接失败

```bash
# 检查MongoDB是否运行
sudo systemctl status mongod

# 测试MongoDB连接
mongosh --eval "db.runCommand('ping')"

# 检查防火墙设置
sudo ufw status

# 检查.env文件中的配置
cat .env
```

#### 4. 镜像加载失败

```bash
# 检查镜像文件
ls -la *.tar

# 重新加载镜像
docker load -i myvue-frontend-*.tar
docker load -i myvue-backend-*.tar
```

### 日志分析

```bash
# 查看实时日志
docker-compose logs -f --tail=100

# 查看错误日志
docker-compose logs | grep ERROR

# 查看特定时间段的日志
docker-compose logs --since="2024-01-01T00:00:00"
```

## 📝 配置文件说明

### docker-compose.yml

部署脚本会生成适合连接本地MongoDB的配置文件：

```yaml
version: '3.8'

services:
  frontend:
    image: myvue-frontend:latest
    container_name: myvue-frontend
    ports:
      - "8080:80"
    networks:
      - myvue-network
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    image: myvue-backend:latest
    container_name: myvue-backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://host.docker.internal:27017/maintenance_system
      - MONGODB_DB=maintenance_system
    networks:
      - myvue-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    extra_hosts:
      - "host.docker.internal:host-gateway"

networks:
  myvue-network:
    driver: bridge
```

说明：
- Linux上容器内访问宿主机MongoDB，推荐使用 `host.docker.internal`，并通过 `extra_hosts: host-gateway` 解析到宿主机。
- 若内核不支持 `host-gateway`，请将 `MONGODB_URI` 改为 `mongodb://<服务器IP>:27017/maintenance_system` 或直接填写内网IP；不要使用 `localhost`/`127.0.0.1`（那是容器自身）。

### .env 文件

包含MongoDB连接配置：

```bash
# MongoDB配置
MONGODB_URI=mongodb://localhost:27017/maintenance_system
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=maintenance_system
```

## 🔒 安全建议

1. **防火墙配置**
   ```bash
   # 只开放必要端口
   sudo ufw allow 8080/tcp
   sudo ufw allow 3001/tcp
   sudo ufw enable
   ```

2. **MongoDB安全**
   ```bash
   # 启用MongoDB认证
   # 创建用户和密码
   # 配置访问控制
   ```

3. **容器安全**
   ```bash
   # 定期更新镜像
   # 使用非root用户运行容器
   # 限制容器资源使用
   ```

## 📞 技术支持

如果遇到问题，请检查：

1. Docker和Docker Compose版本
2. MongoDB连接配置（.env文件）
3. 服务器防火墙设置
4. 容器日志信息
5. MongoDB服务状态

---

**注意**：本指南适用于离线Linux环境，确保所有必要的软件和依赖都已正确安装，MongoDB已在服务器上本地部署并运行。
