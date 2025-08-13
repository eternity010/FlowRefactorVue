# Docker镜像导出脚本 - 用于离线部署
Write-Host "📦 准备Docker镜像导出..." -ForegroundColor Green

# 设置变量
$FRONTEND_IMAGE = "myvue-frontend:latest"
$BACKEND_IMAGE = "myvue-backend:latest"
$EXPORT_DIR = "docker-images"
$TIMESTAMP = Get-Date -Format "yyyyMMdd-HHmmss"

# 创建导出目录
if (-not (Test-Path $EXPORT_DIR)) {
    New-Item -ItemType Directory -Path $EXPORT_DIR | Out-Null
    Write-Host "✅ 创建导出目录: $EXPORT_DIR" -ForegroundColor Green
}

# 检查镜像是否存在
Write-Host "🔍 检查镜像是否存在..." -ForegroundColor Yellow

$frontendExists = docker images $FRONTEND_IMAGE --format "table {{.Repository}}:{{.Tag}}" | Select-String $FRONTEND_IMAGE
$backendExists = docker images $BACKEND_IMAGE --format "table {{.Repository}}:{{.Tag}}" | Select-String $BACKEND_IMAGE

if (-not $frontendExists) {
    Write-Host "❌ 前端镜像不存在，请先构建: $FRONTEND_IMAGE" -ForegroundColor Red
    Write-Host "💡 运行: docker build -f Dockerfile.frontend -t $FRONTEND_IMAGE ." -ForegroundColor Yellow
    exit 1
}

if (-not $backendExists) {
    Write-Host "❌ 后端镜像不存在，请先构建: $BACKEND_IMAGE" -ForegroundColor Red
    Write-Host "💡 运行: docker build -f Dockerfile.backend -t $BACKEND_IMAGE ." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ 镜像检查完成" -ForegroundColor Green

# 导出镜像
Write-Host "📤 导出前端镜像..." -ForegroundColor Yellow
$frontendTar = "$EXPORT_DIR\myvue-frontend-$TIMESTAMP.tar"
docker save -o $frontendTar $FRONTEND_IMAGE

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 前端镜像导出成功: $frontendTar" -ForegroundColor Green
} else {
    Write-Host "❌ 前端镜像导出失败" -ForegroundColor Red
    exit 1
}

Write-Host "📤 导出后端镜像..." -ForegroundColor Yellow
$backendTar = "$EXPORT_DIR\myvue-backend-$TIMESTAMP.tar"
docker save -o $backendTar $BACKEND_IMAGE

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 后端镜像导出成功: $backendTar" -ForegroundColor Green
} else {
    Write-Host "❌ 后端镜像导出失败" -ForegroundColor Red
    exit 1
}

# 创建部署包
Write-Host "📦 创建部署包..." -ForegroundColor Yellow

$deploymentPackage = "$EXPORT_DIR\myvue-deployment-$TIMESTAMP.zip"

# 复制必要的文件
$tempDir = "temp-deployment"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# 复制镜像文件
Copy-Item $frontendTar $tempDir\
Copy-Item $backendTar $tempDir\

# 复制部署脚本
Copy-Item "deploy-on-server.sh" $tempDir\
Copy-Item "start-app.sh" $tempDir\

# 创建README文件
@"
# MyVue应用离线部署包

## 部署步骤

1. 将整个文件夹上传到Linux服务器
2. 解压文件（如果已压缩）
3. 运行部署脚本：
   \`\`\`bash
   chmod +x deploy-on-server.sh
   ./deploy-on-server.sh
   \`\`\`

## 文件说明

- myvue-frontend-*.tar: 前端Docker镜像
- myvue-backend-*.tar: 后端Docker镜像
- deploy-on-server.sh: 服务器部署脚本
- start-app.sh: 应用启动脚本

## 访问地址

- 前端应用: http://服务器IP:8080
- 后端API: http://服务器IP:3001
- 健康检查: http://服务器IP:3001/health

## 注意事项

1. 确保服务器已安装Docker和Docker Compose
2. 确保MongoDB数据库已配置并运行在服务器上
3. 部署脚本会询问MongoDB连接配置信息
"@ | Out-File -FilePath "$tempDir\README.md" -Encoding UTF8

# 创建压缩包
Compress-Archive -Path "$tempDir\*" -DestinationPath $deploymentPackage -Force

# 清理临时目录
Remove-Item $tempDir -Recurse -Force

Write-Host ""
Write-Host "🎉 部署包创建完成!" -ForegroundColor Green
Write-Host "📁 部署包位置: $deploymentPackage" -ForegroundColor Cyan
Write-Host "📊 文件大小:" -ForegroundColor Yellow
Get-ChildItem $deploymentPackage | ForEach-Object {
    $sizeMB = [math]::Round($_.Length / 1MB, 2)
    Write-Host "   $($_.Name): $sizeMB MB" -ForegroundColor White
}

Write-Host ""
Write-Host "📋 下一步操作:" -ForegroundColor Yellow
Write-Host "1. 将部署包上传到Linux服务器" -ForegroundColor White
Write-Host "2. 在服务器上解压并运行部署脚本" -ForegroundColor White
Write-Host "3. 根据README.md中的说明进行配置" -ForegroundColor White
