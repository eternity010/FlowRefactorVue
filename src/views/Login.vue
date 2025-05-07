<template>
  <!-- 登录页面主容器 -->
  <div class="login-container">
    <!-- 左侧图片区域，占据70%宽度 -->
    <div class="login-left">
      <img src="../assets/logo.png" alt="Logo" class="login-image">
    </div>
    <!-- 左右分区的分隔线 -->
    <div class="login-divider"></div>
    <!-- 右侧登录表单区域，占据30%宽度 -->
    <div class="login-right">
      <div class="login-box">
        <h2>用户登录</h2>
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item prop="username">
            <el-input 
              v-model="loginForm.username" 
              prefix-icon="el-icon-user" 
              placeholder="请输入用户名">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              v-model="loginForm.password" 
              prefix-icon="el-icon-lock" 
              type="password" 
              placeholder="请输入密码">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              @click="handleLogin" 
              :loading="loading" 
              style="width: 100%">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loading: false,
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          // 验证用户名和密码
          if (this.loginForm.username === 'root' && this.loginForm.password === '666666') {
            // 登录成功，跳转到首页
            this.$message.success('登录成功')
            setTimeout(() => {
              this.$router.push('/home')
            }, 1000)
          } else {
            // 登录失败，显示错误信息
            this.$message.error('用户名或密码错误')
            this.loading = false
          }
        }
      })
    }
  }
}
</script>

<style scoped>
/* 登录页面主容器样式 */
.login-container {
  height: 100vh; /* 占满整个视口高度 */
  display: flex; /* 使用flex布局 */
  background-color: #f5f5f5; /* 背景色 */
}

/* 左侧图片区域样式 */
.login-left {
  flex: 7; /* 占据7份空间 */
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  background-color: white; /* 白色背景 */
}

/* 图片样式 */
.login-image {
  max-width: 80%; /* 最大宽度为容器的80% */
  max-height: 80%; /* 最大高度为容器的80% */
  object-fit: contain; /* 保持图片比例 */
}

/* 分隔线样式 */
.login-divider {
  width: 1px; /* 宽度为1像素 */
  background-color: #dcdfe6; /* 分隔线颜色 */
  margin: 20px 0; /* 上下边距 */
}

/* 右侧登录表单区域样式 */
.login-right {
  flex: 3; /* 占据3份空间 */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #409eff; /* 蓝色背景 */
}

/* 登录框样式 */
.login-box {
  width: 400px; /* 固定宽度 */
  padding: 40px; /* 内边距 */
  background: white; /* 白色背景 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}

/* 标题样式 */
h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

/* 调整Element UI输入框的样式 */
.el-input__inner {
  height: 40px;
}

/* 调整Element UI按钮的样式 */
.el-button {
  height: 40px;
}
</style> 