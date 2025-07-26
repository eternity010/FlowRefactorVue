import axios from 'axios'

// API基础URL
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001'

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
apiClient.interceptors.request.use(
  config => {
    console.log(`🚀 发送请求: ${config.method.toUpperCase()} ${config.url}`)
    return config
  },
  error => {
    console.error('❌ 请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  response => {
    console.log(`✅ 收到响应: ${response.config.url}`)
    return response
  },
  error => {
    console.error('❌ 响应错误:', (error.response && error.response.data) || error.message)
    return Promise.reject(error)
  }
)

// 流程优化API方法
export const processOptimizationApi = {
  // 获取所有优化案例
  async getAllOptimizations() {
    try {
      const response = await apiClient.get('/api/process-optimization')
      
      if (response.data.code === 200) {
        console.log('✅ 获取所有优化案例成功')
        return {
          data: {
            code: 200,
            message: '获取成功',
            data: response.data.data
          }
        }
      } else {
        throw new Error(response.data.message || '获取优化案例失败')
      }
    } catch (error) {
      console.error('❌ 获取所有优化案例失败:', error)
      throw new Error(`获取优化案例失败: ${error.message}`)
    }
  },

  // 根据ID获取特定优化案例
  async getOptimizationById(optimizationId) {
    try {
      const response = await apiClient.get(`/api/process-optimization/${optimizationId}`)
      
      if (response.data.code === 200) {
        console.log(`✅ 获取优化案例成功: ${optimizationId}`)
        return {
          data: {
            code: 200,
            message: '获取成功',
            data: response.data.data
          }
        }
      } else {
        throw new Error(response.data.message || '获取优化案例失败')
      }
    } catch (error) {
      console.error(`❌ 获取优化案例失败 (${optimizationId}):`, error)
      throw new Error(`获取优化案例失败: ${error.message}`)
    }
  },

  // 获取优化案例的流程图数据
  async getOptimizationFlowcharts(optimizationId) {
    try {
      const response = await apiClient.get(`/api/process-optimization/${optimizationId}/flowcharts`)
      
      if (response.data.code === 200) {
        console.log(`✅ 获取流程图数据成功: ${optimizationId}`)
        return {
          data: {
            code: 200,
            message: '获取成功',
            data: response.data.data
          }
        }
      } else {
        throw new Error(response.data.message || '获取流程图数据失败')
      }
    } catch (error) {
      console.error(`❌ 获取流程图数据失败 (${optimizationId}):`, error)
      throw new Error(`获取流程图数据失败: ${error.message}`)
    }
  },

  // 获取优化案例的资源变化分析
  async getOptimizationResources(optimizationId) {
    try {
      const response = await apiClient.get(`/api/process-optimization/${optimizationId}/resources`)
      
      if (response.data.code === 200) {
        console.log(`✅ 获取资源变化分析成功: ${optimizationId}`)
        return {
          data: {
            code: 200,
            message: '获取成功',
            data: response.data.data
          }
        }
      } else {
        throw new Error(response.data.message || '获取资源变化分析失败')
      }
    } catch (error) {
      console.error(`❌ 获取资源变化分析失败 (${optimizationId}):`, error)
      throw new Error(`获取资源变化分析失败: ${error.message}`)
    }
  },

  // 获取优化案例的甘特图数据
  async getOptimizationGantt(optimizationId) {
    try {
      const response = await apiClient.get(`/api/process-optimization/${optimizationId}/gantt`)
      
      if (response.data.code === 200) {
        console.log(`✅ 获取甘特图数据成功: ${optimizationId}`)
        return {
          data: {
            code: 200,
            message: '获取成功',
            data: response.data.data
          }
        }
      } else {
        throw new Error(response.data.message || '获取甘特图数据失败')
      }
    } catch (error) {
      console.error(`❌ 获取甘特图数据失败 (${optimizationId}):`, error)
      throw new Error(`获取甘特图数据失败: ${error.message}`)
    }
  },

  // 搜索优化案例
  async searchOptimizations(keyword) {
    try {
      const response = await apiClient.get('/api/process-optimization/search', {
        params: { keyword }
      })
      
      if (response.data.code === 200) {
        console.log(`✅ 搜索优化案例成功: ${keyword}`)
        return {
          data: {
            code: 200,
            message: '搜索成功',
            data: response.data.data
          }
        }
      } else {
        throw new Error(response.data.message || '搜索优化案例失败')
      }
    } catch (error) {
      console.error(`❌ 搜索优化案例失败 (${keyword}):`, error)
      throw new Error(`搜索优化案例失败: ${error.message}`)
    }
  },

  // 获取优化数据统计
  async getOptimizationStats() {
    try {
      const response = await apiClient.get('/api/process-optimization/stats')
      
      if (response.data.code === 200) {
        console.log('✅ 获取优化数据统计成功')
        return {
          data: {
            code: 200,
            message: '获取成功',
            data: response.data.data
          }
        }
      } else {
        throw new Error(response.data.message || '获取优化数据统计失败')
      }
    } catch (error) {
      console.error('❌ 获取优化数据统计失败:', error)
      throw new Error(`获取优化数据统计失败: ${error.message}`)
    }
  },

  // 检查数据库连接状态
  async checkConnection() {
    try {
      const response = await apiClient.get('/api/process-optimization/connection')
      
      if (response.data.code === 200) {
        console.log('✅ 检查数据库连接状态成功')
        return {
          data: {
            code: 200,
            message: '连接状态检查成功',
            data: response.data.data
          }
        }
      } else {
        throw new Error(response.data.message || '检查数据库连接状态失败')
      }
    } catch (error) {
      console.error('❌ 检查数据库连接状态失败:', error)
      throw new Error(`检查数据库连接状态失败: ${error.message}`)
    }
  }
}

export default processOptimizationApi 