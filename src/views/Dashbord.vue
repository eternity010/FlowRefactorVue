<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="header-left">
        <img src="../assets/logo.png" alt="Logo" class="logo">
        <span class="title">后台管理系统</span>
      </div>
      <div class="header-right">
        <el-dropdown>
          <span class="el-dropdown-link">
            管理员<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item>修改密码</el-dropdown-item>
            <el-dropdown-item divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>

    <div class="main-container">
      <!-- 侧边栏 -->
      <el-aside width="200px" class="aside">
        <!--菜单项-->
        <el-menu
          class="custom-dark-menu"
          :default-active="activeMenu"
          background-color="#000000"
          text-color="#ffffff"
          active-text-color="#409EFF"
          @select="handleSelect">
          <!-- 内容管理 (带子菜单) -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu menu-icon"></i>
              <span>内容管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-s-operation menu-icon"></i>
              <span>流程管理</span>
            </el-menu-item>
            <el-menu-item index="1-2">
              <i class="el-icon-s-grid menu-icon"></i>
              <span>子流程管理</span>
            </el-menu-item>
          </el-submenu>

          <!-- 风险监控 (独立菜单项) -->
          <el-menu-item index="2">
            <i class="el-icon-warning menu-icon"></i>
            <span>风险监控</span>
          </el-menu-item>

          <!-- 资源管理 (独立菜单项) -->
          <el-menu-item index="3">
            <i class="el-icon-folder menu-icon"></i>
            <span>资源管理</span>
          </el-menu-item>

          <!-- 重构时机判断 (独立菜单项) -->
          <el-menu-item index="4">
            <i class="el-icon-time menu-icon"></i>
            <span>重构时机判断</span>
          </el-menu-item>

          <!-- 流程重构优化 (独立菜单项) -->
          <el-menu-item index="5">
            <i class="el-icon-refresh menu-icon"></i>
            <span>流程重构优化</span>
          </el-menu-item>
          
        </el-menu>
      </el-aside>

      <!-- 主要内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      activeMenu: '1-1'  // 默认激活流程管理菜单
    }
  },
  created() {
    // 页面加载时，如果当前路由是/home，则跳转到流程管理页面
    if (this.$route.path === '/home') {
      this.$router.push('/home/process')
    }
  },
  methods: {
    handleSelect(index) {
      // 根据选中的菜单项进行路由跳转
      switch(index) {
        case '1-1':
          this.$router.push('/home/process')
          break
        case '1-2':
          this.$router.push('/home/sub-process')
          break
        case '2': // 风险监控菜单项的index为2
          this.$router.push('/home/risk')
          break
        case '3':
          this.$router.push('/home/resource')
          break
        case '4':
          this.$router.push('/home/refactor-timing')
          break
        case '5':
          this.$router.push('/home/process-optimization')
          break
        // 其他菜单项的路由可以在这里添加
      }
    }
  }
}
</script>

<style scoped>
.home-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  height: 40px;
  margin-right: 20px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.header-right {
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
  color: #606266;
  display: flex;
  align-items: center;
}

.el-dropdown-link:hover {
  color: #409eff;
}

.el-icon-arrow-down {
  margin-left: 5px;
}

/* 主容器样式 */
.main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 侧边栏样式 */
.aside {
  background-color: #000000;
  width: 200px !important;
}

/* 全局菜单样式 */
.custom-dark-menu {
  text-align: left;
  width: 100%;
  border-right: none;
}

/* 所有菜单项基础样式 */
.custom-dark-menu .el-submenu__title,
.custom-dark-menu .el-menu-item {
  padding-left: 20px !important;
  width: 100%;
}

/* 子菜单项缩进 */
.custom-dark-menu .el-submenu .el-menu-item {
  padding-left: 40px !important; /* 父级20px + 子级20px */
  background-color: #141414 !important;
  width: 100%;
}

/* 图标颜色控制 */
.custom-dark-menu .menu-icon {
  color: #909399 !important; /* Element UI 的灰色图标 */
  margin-right: 8px;
}

/* 悬浮/激活状态样式 */
.custom-dark-menu .el-menu-item:hover,
.custom-dark-menu .el-submenu__title:hover {
  background-color: #262626 !important;
}

/* 下拉箭头颜色 */
.custom-dark-menu .el-submenu__icon-arrow {
  color: #909399 !important;
}

/* 确保菜单项文本不换行 */
.custom-dark-menu .el-menu-item span,
.custom-dark-menu .el-submenu__title span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 主要内容区域样式 */
.el-main {
  padding: 20px;
  background-color: #f0f2f5;
}
</style> 