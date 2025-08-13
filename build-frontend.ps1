# 前端Docker镜像构建脚本 (PowerShell)

# 设置变量
$IMAGE_NAME = "myvue-frontend"
$IMAGE_TAG = "latest"
$FULL_IMAGE_NAME = "${IMAGE_NAME}:${IMAGE_TAG}"

Write-Host "🚀 开始构建前端Docker镜像..." -ForegroundColor Green

# 检查Docker是否运行
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker未运行，请先启动Docker" -ForegroundColor Red
    exit 1
}

# 构建镜像
Write-Host "📦 构建Docker镜像: $FULL_IMAGE_NAME" -ForegroundColor Yellow
docker build -f Dockerfile.frontend -t $FULL_IMAGE_NAME .

# 检查构建结果
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 前端Docker镜像构建成功!" -ForegroundColor Green
    Write-Host "📋 镜像信息:" -ForegroundColor Cyan
    docker images $FULL_IMAGE_NAME
    
    Write-Host ""
    Write-Host "🔧 运行命令:" -ForegroundColor Yellow
    Write-Host "docker run -d -p 8080:80 --name myvue-frontend $FULL_IMAGE_NAME" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 访问地址: http://localhost:8080" -ForegroundColor Green
} else {
    Write-Host "❌ 构建失败，请检查错误信息" -ForegroundColor Red
    exit 1
}
