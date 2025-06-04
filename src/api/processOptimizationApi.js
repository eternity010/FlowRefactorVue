import processOptimizationFlowData from '@/data/processOptimizationFlowData.js';

// 模拟网络延迟
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟 axios 请求的 API 服务
export const processOptimizationApi = {
  // 获取所有流程优化数据
  async getAllOptimizations() {
    await mockDelay();
    
    // 模拟 axios 响应格式
    return {
      data: {
        code: 200,
        message: '获取成功',
        data: processOptimizationFlowData
      },
      status: 200,
      statusText: 'OK'
    };
  },

  // 根据ID获取单个流程优化数据
  async getOptimizationById(id) {
    await mockDelay();
    
    const optimization = processOptimizationFlowData[id];
    
    if (!optimization) {
      return {
        data: {
          code: 404,
          message: '数据不存在',
          data: null
        },
        status: 404,
        statusText: 'Not Found'
      };
    }
    
    return {
      data: {
        code: 200,
        message: '获取成功',
        data: optimization
      },
      status: 200,
      statusText: 'OK'
    };
  },

  // 获取流程优化列表（只返回基本信息）
  async getOptimizationList() {
    await mockDelay();
    
    const list = Object.keys(processOptimizationFlowData).map(key => ({
      id: key,
      title: processOptimizationFlowData[key].title,
      description: processOptimizationFlowData[key].description
    }));
    
    return {
      data: {
        code: 200,
        message: '获取成功',
        data: list
      },
      status: 200,
      statusText: 'OK'
    };
  },

  // 获取资源变化分析数据
  async getResourceChanges(id) {
    await mockDelay();
    
    const optimization = processOptimizationFlowData[id];
    
    if (!optimization || !optimization.resourceChanges) {
      return {
        data: {
          code: 404,
          message: '资源分析数据不存在',
          data: null
        },
        status: 404,
        statusText: 'Not Found'
      };
    }
    
    return {
      data: {
        code: 200,
        message: '获取成功',
        data: optimization.resourceChanges
      },
      status: 200,
      statusText: 'OK'
    };
  }
};

// 如果需要使用真实的 axios，可以这样封装
/*
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

export const processOptimizationApi = {
  getAllOptimizations: () => api.get('/optimizations'),
  getOptimizationById: (id) => api.get(`/optimizations/${id}`),
  getOptimizationList: () => api.get('/optimizations/list'),
  getResourceChanges: (id) => api.get(`/optimizations/${id}/resource-changes`)
};
*/ 