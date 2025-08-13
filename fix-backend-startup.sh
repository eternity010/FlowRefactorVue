#!/bin/bash

# 修复后端启动问题脚本

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 检查后端容器状态
check_backend_container() {
    log_step "检查后端容器状态..."
    
    if docker ps | grep -q "myvue-backend"; then
        log_info "后端容器正在运行"
        return 0
    elif docker ps -a | grep -q "myvue-backend"; then
        log_warn "后端容器存在但未运行"
        return 1
    else
        log_warn "后端容器不存在"
        return 2
    fi
}

# 查看后端容器日志
show_backend_logs() {
    log_step "查看后端容器日志..."
    docker logs myvue-backend --tail=50
}

# 进入后端容器检查
inspect_backend_container() {
    log_step "检查后端容器内部..."
    
    log_info "检查package.json是否存在..."
    docker exec myvue-backend ls -la package.json 2>/dev/null || log_error "package.json不存在"
    
    log_info "检查server目录是否存在..."
    docker exec myvue-backend ls -la server/ 2>/dev/null || log_error "server目录不存在"
    
    log_info "检查startApiServer.js是否存在..."
    docker exec myvue-backend ls -la server/startApiServer.js 2>/dev/null || log_error "startApiServer.js不存在"
    
    log_info "检查node_modules是否存在..."
    docker exec myvue-backend ls -la node_modules/ 2>/dev/null || log_error "node_modules不存在"
}

# 重新构建后端镜像
rebuild_backend_image() {
    log_step "重新构建后端镜像..."
    
    # 停止并删除现有容器
    docker-compose down
    
    # 删除现有镜像
    docker rmi myvue-backend:latest 2>/dev/null || true
    
    # 重新构建
    log_info "重新构建后端镜像..."
    docker build -f Dockerfile.backend -t myvue-backend:latest .
    
    if [[ $? -eq 0 ]]; then
        log_info "后端镜像构建成功"
        return 0
    else
        log_error "后端镜像构建失败"
        return 1
    fi
}

# 修复Dockerfile.backend
fix_dockerfile() {
    log_step "检查并修复Dockerfile.backend..."
    
    # 备份原文件
    cp Dockerfile.backend Dockerfile.backend.backup
    
    # 创建修复后的Dockerfile
    cat > Dockerfile.backend << 'EOF'
# 后端API服务Docker镜像
FROM node:18.20-alpine

# 设置工作目录
WORKDIR /app

# 安装curl用于健康检查
RUN apk add --no-cache curl

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制后端源代码
COPY src/services ./src/services
COPY server ./server
COPY scripts ./scripts

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# 更改文件所有权
RUN chown -R nodejs:nodejs /app
USER nodejs

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# 启动后端服务
CMD ["node", "server/startApiServer.js"]
EOF
    
    log_info "Dockerfile.backend已修复"
}

# 测试后端启动
test_backend_startup() {
    log_step "测试后端启动..."
    
    # 启动后端容器
    docker-compose up -d backend
    
    # 等待启动
    sleep 10
    
    # 检查状态
    if docker ps | grep -q "myvue-backend"; then
        log_info "✅ 后端容器启动成功"
        
        # 测试健康检查
        if curl -f http://localhost:3001/health &> /dev/null; then
            log_info "✅ 后端健康检查通过"
            return 0
        else
            log_warn "⚠️ 后端健康检查失败"
            return 1
        fi
    else
        log_error "❌ 后端容器启动失败"
        return 1
    fi
}

# 显示诊断信息
show_diagnosis() {
    log_step "诊断信息..."
    
    echo "=== 系统信息 ==="
    docker --version
    docker-compose --version
    
    echo "=== 镜像信息 ==="
    docker images | grep myvue
    
    echo "=== 容器状态 ==="
    docker ps -a | grep myvue
    
    echo "=== 网络信息 ==="
    docker network ls | grep myvue
}

# 主函数
main() {
    echo "🔧 后端启动问题修复脚本"
    echo "=========================="
    echo
    
    # 显示诊断信息
    show_diagnosis
    
    # 检查容器状态
    container_status=$(check_backend_container)
    
    case $container_status in
        0)
            log_info "容器正在运行，查看日志..."
            show_backend_logs
            ;;
        1)
            log_warn "容器存在但未运行，查看日志..."
            show_backend_logs
            ;;
        2)
            log_warn "容器不存在"
            ;;
    esac
    
    # 如果容器存在，检查内部
    if [[ $container_status -lt 2 ]]; then
        inspect_backend_container
    fi
    
    # 询问是否重新构建
    echo
    read -p "是否重新构建后端镜像? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        fix_dockerfile
        if rebuild_backend_image; then
            test_backend_startup
        fi
    fi
    
    echo
    log_info "修复完成！"
    log_info "如果问题仍然存在，请检查："
    log_info "1. package.json中的api-server脚本"
    log_info "2. server/startApiServer.js文件是否存在"
    log_info "3. MongoDB连接配置"
    log_info "4. 容器日志: docker logs myvue-backend"
}

# 运行主函数
main "$@"
