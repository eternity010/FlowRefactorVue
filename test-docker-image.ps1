# Docker镜像测试脚本
Write-Host "🧪 开始测试Docker镜像..." -ForegroundColor Green

# 设置变量
$IMAGE_NAME = "myvue-frontend"
$IMAGE_TAG = "latest"
$FULL_IMAGE_NAME = "${IMAGE_NAME}:${IMAGE_TAG}"
$CONTAINER_NAME = "myvue-frontend-test"

# 检查Docker是否运行
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker未运行，请先启动Docker" -ForegroundColor Red
    exit 1
}

# 步骤1: 构建镜像
Write-Host "📦 步骤1: 构建Docker镜像..." -ForegroundColor Yellow
docker build -f Dockerfile.frontend -t $FULL_IMAGE_NAME .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 镜像构建失败" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 镜像构建成功!" -ForegroundColor Green

# 步骤2: 检查镜像信息
Write-Host "📋 步骤2: 检查镜像信息..." -ForegroundColor Yellow
docker images $FULL_IMAGE_NAME

# 步骤3: 运行容器进行测试
Write-Host "🚀 步骤3: 运行容器进行测试..." -ForegroundColor Yellow

# 停止并删除可能存在的同名容器
docker stop $CONTAINER_NAME 2>$null
docker rm $CONTAINER_NAME 2>$null

# 运行容器
docker run -d -p 8080:80 --name $CONTAINER_NAME $FULL_IMAGE_NAME

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 容器启动失败" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 容器启动成功!" -ForegroundColor Green

# 步骤4: 检查容器状态
Write-Host "🔍 步骤4: 检查容器状态..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
docker ps --filter "name=$CONTAINER_NAME"

# 步骤5: 检查容器日志
Write-Host "📝 步骤5: 检查容器日志..." -ForegroundColor Yellow
docker logs $CONTAINER_NAME

# 步骤6: 健康检查
Write-Host "🏥 步骤6: 执行健康检查..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/health" -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ 健康检查通过: $($response.Content)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ 健康检查返回状态码: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ 健康检查失败: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 步骤7: 测试主页访问
Write-Host "🌐 步骤7: 测试主页访问..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ 主页访问成功!" -ForegroundColor Green
        Write-Host "📄 页面标题: $($response.ParsedHtml.title)" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️ 主页访问返回状态码: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ 主页访问失败: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 步骤8: 检查容器资源使用
Write-Host "📊 步骤8: 检查容器资源使用..." -ForegroundColor Yellow
docker stats $CONTAINER_NAME --no-stream

# 测试结果总结
Write-Host ""
Write-Host "🎉 测试完成!" -ForegroundColor Green
Write-Host "📋 测试结果:" -ForegroundColor Cyan
Write-Host "   - 镜像名称: $FULL_IMAGE_NAME" -ForegroundColor White
Write-Host "   - 容器名称: $CONTAINER_NAME" -ForegroundColor White
Write-Host "   - 访问地址: http://localhost:8080" -ForegroundColor White
Write-Host "   - 健康检查: http://localhost:8080/health" -ForegroundColor White

Write-Host ""
Write-Host "🔧 管理命令:" -ForegroundColor Yellow
Write-Host "   - 查看日志: docker logs $CONTAINER_NAME" -ForegroundColor White
Write-Host "   - 停止容器: docker stop $CONTAINER_NAME" -ForegroundColor White
Write-Host "   - 删除容器: docker rm $CONTAINER_NAME" -ForegroundColor White
Write-Host "   - 进入容器: docker exec -it $CONTAINER_NAME sh" -ForegroundColor White

Write-Host ""
Write-Host "💡 提示: 容器正在后台运行，您可以访问 http://localhost:8080 查看应用" -ForegroundColor Green
