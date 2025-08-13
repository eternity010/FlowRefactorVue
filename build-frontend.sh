#!/bin/bash

# 前端Docker镜像构建脚本

# 设置变量
IMAGE_NAME="myvue-frontend"
IMAGE_TAG="latest"
FULL_IMAGE_NAME="${IMAGE_NAME}:${IMAGE_TAG}"

echo "🚀 开始构建前端Docker镜像..."

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未运行，请先启动Docker"
    exit 1
fi

# 构建镜像
echo "📦 构建Docker镜像: ${FULL_IMAGE_NAME}"
docker build -f Dockerfile.frontend -t ${FULL_IMAGE_NAME} .

# 检查构建结果
if [ $? -eq 0 ]; then
    echo "✅ 前端Docker镜像构建成功!"
    echo "📋 镜像信息:"
    docker images ${FULL_IMAGE_NAME}
    
    echo ""
    echo "🔧 运行命令:"
    echo "docker run -d -p 8080:80 --name myvue-frontend ${FULL_IMAGE_NAME}"
    echo ""
    echo "🌐 访问地址: http://localhost:8080"
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi
