#!/bin/bash

# MyVue应用启动脚本 - Linux服务器版
# 适用于连接本地MongoDB的部署

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

# 检查Docker Compose文件
check_compose_file() {
    if [[ ! -f "docker-compose.yml" ]]; then
        log_error "未找到docker-compose.yml文件"
        log_info "请先运行部署脚本: ./deploy-on-server.sh"
        exit 1
    fi
}

# 检查环境配置文件
check_env_file() {
    if [[ ! -f ".env" ]]; then
        log_warn "未找到.env文件，将使用默认配置"
        return 1
    fi
    return 0
}

# 检查MongoDB状态
check_mongodb() {
    log_step "检查MongoDB状态..."
    
    if ! pgrep -x "mongod" > /dev/null; then
        log_warn "MongoDB进程未运行"
        log_info "请启动MongoDB: sudo systemctl start mongod"
        return 1
    else
        log_info "MongoDB进程正在运行"
        return 0
    fi
}

# 检查服务状态
check_services() {
    log_step "检查服务状态..."
    
    if docker-compose ps | grep -q "Up"; then
        log_info "服务正在运行"
        docker-compose ps
        return 0
    else
        log_warn "服务未运行"
        return 1
    fi
}

# 启动服务
start_services() {
    log_step "启动MyVue应用服务..."
    
    # 检查MongoDB
    if ! check_mongodb; then
        log_error "MongoDB未运行，无法启动应用"
        exit 1
    fi
    
    # 停止现有服务
    log_info "停止现有服务..."
    docker-compose down 2>/dev/null || true
    
    # 启动服务
    log_info "启动服务..."
    docker-compose up -d
    
    # 等待服务启动
    log_info "等待服务启动..."
    sleep 15
    
    # 检查服务状态
    log_info "检查服务状态..."
    docker-compose ps
}

# 测试服务可用性
test_services() {
    log_step "测试服务可用性..."
    
    # 测试后端健康检查
    log_info "测试后端服务..."
    if curl -f http://localhost:3001/health &> /dev/null; then
        log_info "✅ 后端服务正常"
    else
        log_warn "⚠️ 后端服务可能未完全启动"
    fi
    
    # 测试前端服务
    log_info "测试前端服务..."
    if curl -f http://localhost:8080 &> /dev/null; then
        log_info "✅ 前端服务正常"
    else
        log_warn "⚠️ 前端服务可能未完全启动"
    fi
}

# 显示配置信息
show_config() {
    log_step "当前配置信息..."
    
    if [[ -f ".env" ]]; then
        log_info "MongoDB配置："
        grep "MONGO" .env | while read line; do
            if [[ $line != *"PASS"* ]]; then  # 不显示密码
                log_info "  $line"
            else
                log_info "  MONGO_PASS=***"
            fi
        done
    else
        log_warn "未找到配置文件，使用默认配置"
    fi
}

# 显示访问信息
show_access_info() {
    log_step "服务启动完成！"
    
    # 获取服务器IP
    SERVER_IP=$(hostname -I | awk '{print $1}')
    
    echo
    echo "🎉 MyVue应用启动成功！"
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
    echo "📊 当前服务状态："
    docker-compose ps
}

# 主函数
main() {
    echo "🚀 MyVue应用启动脚本"
    echo "======================"
    echo
    
    # 检查环境
    check_compose_file
    check_env_file
    
    # 显示配置
    show_config
    
    # 检查服务状态
    if check_services; then
        log_info "服务已在运行"
        show_access_info
        exit 0
    fi
    
    # 启动服务
    start_services
    
    # 测试服务
    test_services
    
    # 显示结果
    show_access_info
}

# 运行主函数
main "$@"
