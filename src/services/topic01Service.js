/**
 * Topic01 后端服务
 */
const MySQLService = require('./mysqlService');

class Topic01Service {
  constructor() {
    this.serviceName = 'Topic01Service';
    this.mysqlService = new MySQLService();
  }

  /**
   * 初始化服务
   */
  async initialize() {
    console.log(`✅ ${this.serviceName} 服务已初始化`);
    return { success: true };
  }

  /**
   * 获取数据
   * @param {Object} params - 查询参数
   * @returns {Object} 查询结果
   */
  async getData(params = {}) {
    try {
      // 在这里添加您的业务逻辑
      const data = {
        message: 'Topic01 数据获取成功',
        params: params,
        timestamp: new Date().toISOString()
      };

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Topic01 获取数据失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 保存数据
   * @param {Object} data - 要保存的数据
   * @returns {Object} 保存结果
   */
  async saveData(data) {
    try {
      // 在这里添加您的保存逻辑
      console.log('Topic01 保存数据:', data);

      return {
        success: true,
        data: {
          message: '数据保存成功',
          savedData: data,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Topic01 保存数据失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 处理业务逻辑
   * @param {Object} input - 输入数据
   * @returns {Object} 处理结果
   */
  async processData(input) {
    try {
      // 在这里添加您的业务处理逻辑
      const result = {
        processed: true,
        input: input,
        output: `Topic01 处理结果: ${JSON.stringify(input)}`,
        timestamp: new Date().toISOString()
      };

      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Topic01 处理数据失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取风险数据统计
   * @param {string} processType - 流程类型 (purchase, production, marketing, operation)
   * @returns {Object} 风险统计结果
   */
  async getRiskStatistics(processType = '') {
    try {
      let sql = `
        SELECT 
          activity_id,
          activity_name,
          activity_risk,
          CASE 
            WHEN activity_id LIKE 'MK%' THEN 'marketing'
            WHEN activity_id LIKE 'PU%' THEN 'purchase' 
            WHEN activity_id LIKE 'PD%' THEN 'production'
            WHEN activity_id LIKE 'OP%' THEN 'operation'
            ELSE 'unknown'
          END as process_type
        FROM dm_topic0101_output_risk 
        WHERE del_flag = '0'
      `;
      
      const params = [];
      
      // 如果指定了流程类型，添加筛选条件
      if (processType) {
        const processMap = {
          'marketing': 'MK%',
          'purchase': 'PU%', 
          'production': 'PD%',
          'operation': 'OP%'
        };
        
        if (processMap[processType]) {
          sql += ` AND activity_id LIKE ?`;
          params.push(processMap[processType]);
        }
      }
      
      sql += ` ORDER BY activity_id`;
      
      const result = await this.mysqlService.executeCustomQuery(sql, params);
      
      if (result.success) {
        // 统计各风险等级的数量
        const statistics = this.processRiskData(result.data, processType);
        
        return {
          success: true,
          data: statistics
        };
      } else {
        throw new Error(result.error || '查询风险数据失败');
      }
    } catch (error) {
      console.error('获取风险统计失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 处理风险数据统计
   * @param {Array} rawData - 原始查询数据
   * @param {string} processType - 流程类型
   * @returns {Object} 处理后的统计数据
   */
  processRiskData(rawData, processType) {
    // 如果没有指定流程类型，返回所有流程的统计
    if (!processType) {
      const allProcesses = {};
      const processTypes = ['marketing', 'purchase', 'production', 'operation'];
      
      processTypes.forEach(type => {
        const typeData = rawData.filter(item => item.process_type === type);
        allProcesses[type] = this.calculateRiskStats(typeData);
      });
      
      return allProcesses;
    } else {
      // 返回指定流程的统计
      const typeData = rawData.filter(item => item.process_type === processType);
      return this.calculateRiskStats(typeData);
    }
  }

  /**
   * 计算风险统计数据
   * @param {Array} data - 流程数据
   * @returns {Object} 统计结果
   */
  calculateRiskStats(data) {
    // 将activity_risk转换为数字进行比较
    // 高于80: 高风险，50-80: 中风险，低于50: 低风险（正常）
    const highRiskNodes = data.filter(item => {
      const riskValue = parseFloat(item.activity_risk);
      return !isNaN(riskValue) && riskValue > 80;
    });
    
    const mediumRiskNodes = data.filter(item => {
      const riskValue = parseFloat(item.activity_risk);
      return !isNaN(riskValue) && riskValue >= 50 && riskValue <= 80;
    });
    
    const lowRiskNodes = data.filter(item => {
      const riskValue = parseFloat(item.activity_risk);
      return !isNaN(riskValue) && riskValue < 50;
    });
    
    // 格式化节点数据，包含更丰富的信息
    const formatNodeData = (nodes) => {
      return nodes.map(item => {
        const riskValue = parseFloat(item.activity_risk);
        let riskLevel = '未知';
        if (!isNaN(riskValue)) {
          if (riskValue > 80) {
            riskLevel = '高风险';
          } else if (riskValue >= 50) {
            riskLevel = '中风险';
          } else {
            riskLevel = '低风险';
          }
        }
        
        return {
          id: item.activity_id,
          name: item.activity_name,
          fullName: `${item.activity_id}: ${item.activity_name}`,
          description: item.remark || `风险值: ${riskValue}，${riskLevel}`,
          risk: item.activity_risk,
          riskLevel: riskLevel,
          riskValue: riskValue,
          updateTime: item.update_time
        };
      });
    };
    
    return {
      total: data.length,
      highRisk: {
        title: '高风险节点',
        icon: 'el-icon-warning',
        count: highRiskNodes.length,
        nodes: highRiskNodes.map(item => `${item.activity_id}: ${item.activity_name}`),
        nodeDetails: formatNodeData(highRiskNodes)
      },
      mediumRisk: {
        title: '中风险节点', 
        icon: 'el-icon-warning',
        count: mediumRiskNodes.length,
        nodes: mediumRiskNodes.map(item => `${item.activity_id}: ${item.activity_name}`),
        nodeDetails: formatNodeData(mediumRiskNodes)
      },
      normal: {
        title: '正常节点',
        icon: 'el-icon-success',
        count: lowRiskNodes.length,
        nodes: lowRiskNodes.map(item => `${item.activity_id}: ${item.activity_name}`),
        nodeDetails: formatNodeData(lowRiskNodes)
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 获取单个节点的风险信息
   * @param {string} nodeId - 节点ID
   * @returns {Object} 节点风险信息
   */
  async getNodeRiskInfo(nodeId) {
    try {
      console.log(`🔍 开始获取节点风险信息: ${nodeId}`);
      
      const sql = `
        SELECT 
          activity_id,
          activity_name,
          activity_risk,
          remark,
          update_time,
          CASE 
            WHEN activity_id LIKE 'MK%' THEN 'marketing'
            WHEN activity_id LIKE 'PU%' THEN 'purchase' 
            WHEN activity_id LIKE 'PD%' THEN 'production'
            WHEN activity_id LIKE 'OP%' THEN 'operation'
            ELSE 'unknown'
          END as process_type
        FROM dm_topic0101_output_risk 
        WHERE activity_id = ? AND del_flag = '0'
      `;
      
      const result = await this.mysqlService.executeCustomQuery(sql, [nodeId]);
      
      if (result.success && result.data && result.data.length > 0) {
        const nodeData = result.data[0];
        const riskValue = parseFloat(nodeData.activity_risk);
        
        // 根据数值确定风险等级
        let riskLevel = '未知';
        if (!isNaN(riskValue)) {
          if (riskValue > 80) {
            riskLevel = '高';
          } else if (riskValue >= 50) {
            riskLevel = '中';
          } else {
            riskLevel = '低';
          }
        }
        
        return {
          success: true,
          data: {
            nodeId: nodeData.activity_id,
            nodeName: nodeData.activity_name,
            riskLevel: riskLevel,
            riskValue: riskValue,
            originalRiskValue: nodeData.activity_risk,
            riskDescription: nodeData.remark || `风险值: ${riskValue}，等级: ${riskLevel}`,
            processType: nodeData.process_type,
            updateTime: nodeData.update_time,
            riskLevelColor: this.getRiskLevelColor(riskLevel),
            riskLevelIcon: this.getRiskLevelIcon(riskLevel),
            riskLevelClass: this.getRiskLevelClass(riskLevel)
          }
        };
      } else {
        return {
          success: false,
          error: `未找到节点 ${nodeId} 的风险信息`
        };
      }
    } catch (error) {
      console.error(`❌ 获取节点风险信息失败 [${nodeId}]:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取风险等级对应的颜色
   * @param {string} riskLevel - 风险等级
   * @returns {string} 颜色值
   */
  getRiskLevelColor(riskLevel) {
    const colorMap = {
      '高': '#f5222d',
      '中': '#fa8c16', 
      '低': '#52c41a'
    };
    return colorMap[riskLevel] || '#d9d9d9';
  }

  /**
   * 获取风险等级对应的图标
   * @param {string} riskLevel - 风险等级
   * @returns {string} 图标类名
   */
  getRiskLevelIcon(riskLevel) {
    const iconMap = {
      '高': 'el-icon-warning',
      '中': 'el-icon-warning-outline',
      '低': 'el-icon-success'
    };
    return iconMap[riskLevel] || 'el-icon-info';
  }

  /**
   * 获取风险等级对应的CSS类名
   * @param {string} riskLevel - 风险等级
   * @returns {string} CSS类名
   */
  getRiskLevelClass(riskLevel) {
    const classMap = {
      '高': 'risk-high',
      '中': 'risk-medium',
      '低': 'risk-low'
    };
    return classMap[riskLevel] || 'risk-unknown';
  }

  /**
   * 清理资源
   */
  async cleanup() {
    console.log(`🔄 ${this.serviceName} 资源清理完成`);
    if (this.mysqlService) {
      await this.mysqlService.disconnect();
    }
  }
}

module.exports = Topic01Service;
