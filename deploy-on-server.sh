#!/bin/bash

# MyVue应用服务器部署脚本
# 适用于离线Linux环境，连接本地MongoDB

set -e  # 遇到错误立即退出

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

# 检查是否为root用户
check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_warn "检测到root用户，建议使用普通用户运行此脚本"
        read -p "是否继续? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# 检查Docker是否安装
check_docker() {
    log_step "检查Docker安装状态..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker未安装，请先安装Docker"
        log_info "安装命令参考："
        log_info "  curl -fsSL https://get.docker.com | sh"
        log_info "  sudo usermod -aG docker \$USER"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        log_error "Docker服务未启动或当前用户无权限"
        log_info "请尝试："
        log_info "  sudo systemctl start docker"
        log_info "  sudo usermod -aG docker \$USER"
        log_info "  然后重新登录"
        exit 1
    fi
    
    log_info "Docker检查通过"
}

# 检查Docker Compose是否安装
check_docker_compose() {
    log_step "检查Docker Compose安装状态..."
    
    if ! command -v docker-compose &> /dev/null; then
        log_warn "Docker Compose未安装，尝试安装..."
        
        # 下载Docker Compose
        COMPOSE_VERSION="v2.20.0"
        sudo curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
        
        if ! command -v docker-compose &> /dev/null; then
            log_error "Docker Compose安装失败"
            exit 1
        fi
    fi
    
    log_info "Docker Compose检查通过"
}

# 检查MongoDB连接
check_mongodb() {
    log_step "检查MongoDB连接..."
    
    # 检查MongoDB是否运行
    if ! pgrep -x "mongod" > /dev/null; then
        log_warn "MongoDB进程未运行"
        log_info "请确保MongoDB已启动并配置正确"
        log_info "启动命令：sudo systemctl start mongod"
    else
        log_info "MongoDB进程正在运行"
    fi
    
    # 尝试连接MongoDB（如果有mongosh）
    if command -v mongosh &> /dev/null; then
        if mongosh --eval "db.runCommand('ping')" &> /dev/null; then
            log_info "MongoDB连接正常"
        else
            log_warn "无法连接到MongoDB，请检查配置"
        fi
    fi
}

# 加载Docker镜像
load_images() {
    log_step "加载Docker镜像..."
    
    # 查找镜像文件
    FRONTEND_TAR=$(find . -name "myvue-frontend-*.tar" | head -1)
    BACKEND_TAR=$(find . -name "myvue-backend-*.tar" | head -1)
    
    if [[ -z "$FRONTEND_TAR" ]]; then
        log_error "未找到前端镜像文件"
        exit 1
    fi
    
    if [[ -z "$BACKEND_TAR" ]]; then
        log_error "未找到后端镜像文件"
        exit 1
    fi
    
    log_info "找到镜像文件："
    log_info "  前端: $FRONTEND_TAR"
    log_info "  后端: $BACKEND_TAR"
    
    # 加载前端镜像
    log_info "加载前端镜像..."
    docker load -i "$FRONTEND_TAR"
    
    # 加载后端镜像
    log_info "加载后端镜像..."
    docker load -i "$BACKEND_TAR"
    
    log_info "镜像加载完成"
}

# 配置MongoDB连接
configure_mongodb() {
    log_step "配置MongoDB连接..."
    
    # 询问MongoDB配置
    log_info "请配置MongoDB连接信息："
    read -p "MongoDB主机地址 (默认: localhost): " MONGO_HOST
    MONGO_HOST=${MONGO_HOST:-localhost}
    
    read -p "MongoDB端口 (默认: 27017): " MONGO_PORT
    MONGO_PORT=${MONGO_PORT:-27017}
    
    read -p "MongoDB数据库名 (默认: maintenance_system): " MONGO_DB
    MONGO_DB=${MONGO_DB:-maintenance_system}
    
    read -p "MongoDB用户名 (可选): " MONGO_USER
    read -s -p "MongoDB密码 (可选): " MONGO_PASS
    echo
    
    # 在容器内访问宿主机：localhost/127.0.0.1 需要替换为 host.docker.internal
    CONTAINER_MONGO_HOST="$MONGO_HOST"
    if [[ "$MONGO_HOST" == "localhost" || "$MONGO_HOST" == "127.0.0.1" ]]; then
        CONTAINER_MONGO_HOST="host.docker.internal"
    fi

    # 构建MongoDB URI（面向容器内部）
    if [[ -n "$MONGO_USER" && -n "$MONGO_PASS" ]]; then
        MONGO_URI="mongodb://${MONGO_USER}:${MONGO_PASS}@${CONTAINER_MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}"
    else
        MONGO_URI="mongodb://${CONTAINER_MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}"
    fi
    
    log_info "MongoDB URI: $MONGO_URI"
    
    # 保存配置到环境文件
    cat > .env << EOF
# MongoDB配置（供容器内部使用）
MONGODB_URI=${MONGO_URI}
MONGODB_DB=${MONGO_DB}

# 原始输入（仅供参考）
MONGO_HOST=${MONGO_HOST}
MONGO_PORT=${MONGO_PORT}
EOF
    
    log_info "配置已保存到 .env 文件"
}

# 创建Docker Compose文件
create_compose_file() {
    log_step "创建Docker Compose配置文件..."
    
    # 读取环境变量
    if [[ -f ".env" ]]; then
        source .env
    fi
    
    # 创建docker-compose.yml
    cat > docker-compose.yml << EOF
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
      - MONGODB_URI=${MONGODB_URI}
      - MONGODB_DB=${MONGO_DB}
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
EOF
    
    log_info "Docker Compose配置文件已创建"
}

# 启动服务
start_services() {
    log_step "启动服务..."
    
    # 停止现有服务
    log_info "停止现有服务..."
    docker-compose down 2>/dev/null || true
    
    # 启动服务
    log_info "启动新服务..."
    docker-compose up -d
    
    # 等待服务启动
    log_info "等待服务启动..."
    sleep 10
    
    # 检查服务状态
    log_info "检查服务状态..."
    docker-compose ps
    
    # 检查服务健康状态
    log_info "检查服务健康状态..."
    
    # 检查后端健康
    if curl -f http://localhost:3001/health &> /dev/null; then
        log_info "✅ 后端服务正常"
    else
        log_warn "⚠️ 后端服务可能未完全启动"
    fi
    
    # 检查前端服务
    if curl -f http://localhost:8080 &> /dev/null; then
        log_info "✅ 前端服务正常"
    else
        log_warn "⚠️ 前端服务可能未完全启动"
    fi
}

# 显示访问信息
show_access_info() {
    log_step "部署完成！"
    
    # 获取服务器IP
    SERVER_IP=$(hostname -I | awk '{print $1}')
    
    echo
    echo "🎉 MyVue应用部署成功！"
    echo
    echo "📋 访问地址："
    echo "  前端应用: http://${SERVER_IP}:8080"
    echo "  后端API: http://${SERVER_IP}:3001"
    echo "  健康检查: http://${SERVER_IP}:3001/health"
    echo
    echo "🔧 管理命令："
    echo "  查看状态: docker-compose ps"
    echo "  查看日志: docker-compose logs -f"
    echo "  停止服务: docker-compose down"
    echo "  重启服务: docker-compose restart"
    echo
    echo "📊 服务信息："
    docker-compose ps
}

# 主函数
main() {
    echo "🚀 MyVue应用服务器部署脚本"
    echo "================================"
    echo
    
    # 检查环境
    check_root
    check_docker
    check_docker_compose
    check_mongodb
    
    # 部署流程
    load_images
    configure_mongodb
    create_compose_file
    start_services
    
    # 显示结果
    show_access_info
}

# 运行主函数
main "$@"
