import axios from 'axios';

// 获取API基础URL
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001';

class NodeDetailApi {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 10000; // 10秒超时
  }

  /**
   * 发送HTTP请求的基础方法
   * @param {string} method - HTTP方法
   * @param {string} endpoint - API端点
   * @param {Object} data - 请求数据
   * @returns {Promise<Object>} 响应结果
   */
  async request(method, endpoint, data = null) {
    try {
      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error(`节点详情API请求失败 [${method} ${endpoint}]:`, error);
      
      // 处理网络错误
      if (error.code === 'ECONNABORTED') {
        throw new Error('请求超时，请稍后重试');
      }
      
      // 处理HTTP错误
      if (error.response) {
        const { status, data } = error.response;
        throw new Error((data && data.error) || `HTTP ${status} 错误`);
      }
      
      // 处理其他错误
      throw new Error(error.message || '网络请求失败');
    }
  }

  /**
   * GET请求
   */
  async get(endpoint) {
    return await this.request('GET', endpoint);
  }

  /**
   * PUT请求
   */
  async put(endpoint, data) {
    return await this.request('PUT', endpoint, data);
  }

  /**
   * 获取节点的详细信息，包括当前流程编号
   */
  async getNodeDetail(nodeType, nodeId) {
    return await this.get(`/api/node-detail/${nodeType}/${nodeId}`);
  }

  /**
   * 获取节点的当前实现流程（根据currentFlowNumber自动获取对应的mermaidDefinition）
   */
  async getNodeCurrentFlow(nodeType, nodeId) {
    return await this.get(`/api/node-current-flow/${nodeType}/${nodeId}`);
  }

  /**
   * 获取节点指定编号的实现流程
   */
  async getNodeImplementation(nodeType, nodeId, flowNumber) {
    return await this.get(`/api/node-implementation/${nodeType}/${nodeId}?flowNumber=${flowNumber}`);
  }

  /**
   * 获取节点的所有流程数据
   */
  async getNodeAllFlows(nodeType, nodeId) {
    return await this.get(`/api/node-all-flows/${nodeType}/${nodeId}`);
  }

  /**
   * 切换节点的当前流程
   */
  async switchNodeFlow(nodeType, nodeId, currentFlowNumber) {
    return await this.put(`/api/node-flow-switch/${nodeType}/${nodeId}`, {
      currentFlowNumber
    });
  }

  /**
   * 获取节点的所有可用流程列表
   */
  async getNodeFlowList(nodeType, nodeId) {
    return await this.get(`/api/node-flow-list/${nodeType}/${nodeId}`);
  }
}

// 创建并导出实例
export const nodeDetailApi = new NodeDetailApi();