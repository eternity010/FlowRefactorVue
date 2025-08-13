# Docker 镜像化使用指南

## 📋 概述

本项目已配置为支持Docker容器化部署，包含前端Vue应用和后端API服务。

## 🏗️ 文件结构

```
├── Dockerfile.frontend    # 前端Docker构建文件
├── nginx.conf            # Nginx配置文件
├── .dockerignore         # Docker忽略文件
├── build-frontend.sh     # Linux/Mac构建脚本
├── build-frontend.ps1    # Windows PowerShell构建脚本
└── DOCKER_README.md      # 本文档
```

## 🚀 快速开始

### 方法一：使用构建脚本（推荐）

#### Windows用户
```powershell
# 在PowerShell中运行
.\build-frontend.ps1
```

#### Linux/Mac用户
```bash
# 给脚本执行权限
chmod +x build-frontend.sh

# 运行构建脚本
./build-frontend.sh
```

### 方法二：手动构建

```bash
# 构建前端镜像

docker build -f Dockerfile.frontend -t myvue-frontend:latest .
# 运行容器
docker run -d -p 8080:80 --name myvue-frontend myvue-frontend:latest
```

## 🔧 详细操作步骤

### 1. 构建镜像

```bash
# 构建前端镜像
docker build -f Dockerfile.frontend -t myvue-frontend:latest .
```

### 2. 运行容器

```bash
# 运行前端容器
docker run -d -p 8080:80 --name myvue-frontend myvue-frontend:latest
```

### 3. 访问应用

构建成功后，可以通过以下地址访问：
- **前端应用**: http://localhost:8080

### 4. 容器管理

```bash
# 查看运行中的容器
docker ps

# 查看容器日志
docker logs myvue-frontend

# 停止容器
docker stop myvue-frontend

# 删除容器
docker rm myvue-frontend

# 删除镜像
docker rmi myvue-frontend:latest
```

## 📦 镜像特点

### 前端镜像 (`myvue-frontend`)
- **基础镜像**: `nginx:alpine` (轻量级)
- **构建阶段**: 多阶段构建，优化镜像大小
- **功能特性**:
  - Vue Router history模式支持
  - 静态资源缓存优化
  - Gzip压缩
  - API代理配置
  - 健康检查端点

### 配置说明

#### Nginx配置特性
- **路由处理**: 支持Vue Router的history模式
- **静态缓存**: JS/CSS文件缓存1年
- **Gzip压缩**: 自动压缩文本文件
- **API代理**: 可配置后端API代理
- **健康检查**: `/health` 端点

## 🔍 故障排除

### 常见问题

#### 1. 构建失败
```bash
# 检查Docker是否运行
docker info

# 清理Docker缓存
docker system prune -a
```

#### 2. 端口冲突
```bash
# 检查端口占用
netstat -tulpn | grep 8080

# 使用其他端口
docker run -d -p 8081:80 --name myvue-frontend myvue-frontend:latest
```

#### 3. 容器无法启动
```bash
# 查看容器日志
docker logs myvue-frontend

# 检查容器状态
docker ps -a
```

### 调试模式

```bash
# 交互式运行容器
docker run -it --rm -p 8080:80 myvue-frontend:latest /bin/sh

# 查看容器内部文件
docker exec -it myvue-frontend ls -la /usr/share/nginx/html
```

## 🛠️ 开发环境

### 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 生产构建
```bash
# 构建生产版本
npm run build

# 构建Docker镜像
docker build -f Dockerfile.frontend -t myvue-frontend:latest .
```

## 📊 性能优化

### 镜像优化
- 使用多阶段构建减少镜像大小
- 使用Alpine Linux基础镜像
- 合理配置.dockerignore文件

### 运行时优化
- 启用Nginx Gzip压缩
- 配置静态资源缓存
- 使用健康检查监控

## 🔐 安全考虑

- 使用非root用户运行容器
- 定期更新基础镜像
- 扫描镜像安全漏洞
- 限制容器资源使用

## 📝 环境变量

可以通过环境变量配置应用：

```bash
# 设置环境变量
docker run -d -p 8080:80 \
  -e NODE_ENV=production \
  --name myvue-frontend \
  myvue-frontend:latest
```

## 🚀 部署建议

### 生产环境
1. 使用Docker Compose管理多服务
2. 配置反向代理（如Nginx）
3. 设置SSL证书
4. 配置监控和日志收集
5. 使用容器编排工具（如Kubernetes）

### 开发环境
1. 使用卷挂载实现热重载
2. 配置开发工具和调试器
3. 使用Docker Compose简化管理

## 📞 支持

如果遇到问题，请检查：
1. Docker版本是否兼容
2. 系统资源是否充足
3. 网络连接是否正常
4. 端口是否被占用

---

**注意**: 本配置适用于Vue.js 2.x项目，如果升级到Vue 3.x，可能需要调整构建配置。
