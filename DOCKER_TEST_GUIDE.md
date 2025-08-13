# Docker镜像测试指南

## 🧪 测试步骤

### 1. **构建镜像**
```bash
# 构建前端镜像
docker build -f Dockerfile.frontend -t myvue-frontend:latest .
```

### 2. **检查镜像信息**
```bash
# 查看构建的镜像
docker images myvue-frontend:latest

# 查看镜像详细信息
docker inspect myvue-frontend:latest
```

### 3. **运行容器**
```bash
# 运行容器（后台模式）
docker run -d -p 8080:80 --name myvue-frontend-test myvue-frontend:latest

# 或者前台模式（查看日志）
docker run -p 8080:80 --name myvue-frontend-test myvue-frontend:latest
```

### 4. **检查容器状态**
```bash
# 查看运行中的容器
docker ps

# 查看所有容器（包括停止的）
docker ps -a

# 查看容器详细信息
docker inspect myvue-frontend-test
```

### 5. **查看容器日志**
```bash
# 查看容器日志
docker logs myvue-frontend-test

# 实时查看日志
docker logs -f myvue-frontend-test

# 查看最近的日志
docker logs --tail 50 myvue-frontend-test
```

### 6. **健康检查**
```bash
# 测试健康检查端点
curl http://localhost:8080/health

# 或者使用PowerShell
Invoke-WebRequest -Uri "http://localhost:8080/health"
```

### 7. **访问应用**
```bash
# 在浏览器中访问
http://localhost:8080

# 或者使用curl测试
curl http://localhost:8080
```

### 8. **进入容器调试**
```bash
# 进入容器内部
docker exec -it myvue-frontend-test sh

# 在容器内查看文件
ls -la /usr/share/nginx/html
cat /usr/share/nginx/html/index.html
```

## 🔍 故障排除

### 常见问题及解决方案

#### 1. **容器启动失败**
```bash
# 查看详细错误信息
docker logs myvue-frontend-test

# 检查端口是否被占用
netstat -tulpn | grep 8080

# 使用不同端口
docker run -d -p 8081:80 --name myvue-frontend-test myvue-frontend:latest
```

#### 2. **页面无法访问**
```bash
# 检查容器是否正在运行
docker ps

# 检查容器网络
docker network inspect bridge

# 测试容器内部
docker exec myvue-frontend-test curl http://localhost/health
```

#### 3. **静态资源加载失败**
```bash
# 检查nginx配置
docker exec myvue-frontend-test nginx -t

# 查看nginx日志
docker exec myvue-frontend-test tail -f /var/log/nginx/error.log
```

## 📊 性能测试

### 资源使用监控
```bash
# 查看容器资源使用情况
docker stats myvue-frontend-test

# 查看容器详细信息
docker stats --no-stream myvue-frontend-test
```

### 负载测试
```bash
# 使用curl进行简单负载测试
for i in {1..10}; do curl http://localhost:8080; done

# 使用ab进行Apache基准测试（如果安装了）
ab -n 100 -c 10 http://localhost:8080/
```

## 🧹 清理资源

### 停止和删除容器
```bash
# 停止容器
docker stop myvue-frontend-test

# 删除容器
docker rm myvue-frontend-test

# 一次性停止并删除
docker rm -f myvue-frontend-test
```

### 删除镜像
```bash
# 删除镜像
docker rmi myvue-frontend:latest

# 强制删除（如果有容器在使用）
docker rmi -f myvue-frontend:latest
```

## 🚀 自动化测试

### 使用测试脚本
```powershell
# 运行完整的测试脚本
.\test-docker-image.ps1
```

### 使用Docker Compose测试
```bash
# 启动完整服务栈
docker-compose up -d

# 查看所有服务状态
docker-compose ps

# 查看服务日志
docker-compose logs -f
```

## 📋 测试检查清单

- [ ] 镜像构建成功
- [ ] 容器启动成功
- [ ] 健康检查通过
- [ ] 主页可以访问
- [ ] 静态资源加载正常
- [ ] Vue Router路由工作正常
- [ ] 容器日志无错误
- [ ] 资源使用合理
- [ ] 容器可以正常停止和删除

## 🎯 成功标准

1. **功能测试**：应用可以正常访问和使用
2. **性能测试**：响应时间在可接受范围内
3. **稳定性测试**：容器可以长时间稳定运行
4. **资源测试**：内存和CPU使用合理
5. **安全测试**：没有明显的安全漏洞

---

**提示**：测试完成后，记得清理测试容器和镜像以释放系统资源。
