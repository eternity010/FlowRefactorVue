/**
 * Topic04 后端服务 - 高铁运维订单数据处理
 */
const MySQLService = require('./mysqlService');

class Topic04Service {
  constructor() {
    this.serviceName = 'Topic04Service';
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
   * 获取所有状态为"进行中"的运维订单数据
   * @returns {Object} 进行中的运维订单列表
   */
  async getOngoingMaintenanceOrders() {
    try {
      console.log('🔍 开始获取进行中的运维订单数据');
      
      const sql = `
        SELECT 
          id,
          model_run_batch,
          train_id,
          carriage_no,
          repair_order_id,
          repair_code,
          fault_code,
          fault_description,
          system_module,
          maintenance_type,
          maintenance_status,
          reporter,
          report_date,
          report_content,
          station_location,
          responsible_team,
          responsible_person,
          responsible_contact,
          last_maintenance_date,
          maintenance_result,
          end_time,
          begin_time,
          receive_time,
          updater,
          update_time,
          remark
        FROM dm_topic0402_input_train_maintenance 
        WHERE maintenance_status = '进行中' 
          AND del_flag = 0
        ORDER BY report_date DESC
      `;
      
      const result = await this.mysqlService.executeCustomQuery(sql);
      
      if (result.success) {
        const processedData = this.processMaintenanceData(result.data);
        
        console.log(`✅ 成功获取 ${processedData.length} 条进行中的运维订单数据`);
        
        return {
          success: true,
          data: {
            total: processedData.length,
            records: processedData,
            summary: this.generateMaintenanceSummary(processedData),
            timestamp: new Date().toISOString()
          }
        };
      } else {
        throw new Error(result.error || '查询进行中运维订单数据失败');
      }
    } catch (error) {
      console.error('❌ 获取进行中运维订单失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 根据系统模块获取运维订单
   * @param {string} systemModule - 系统模块名称
   * @returns {Object} 指定系统的运维订单
   */
  async getMaintenanceOrdersBySystem(systemModule) {
    try {
      console.log(`🔍 获取系统 "${systemModule}" 的运维订单`);
      
      const sql = `
        SELECT 
          id, train_id, carriage_no, repair_code, fault_code, fault_description,
          system_module, maintenance_type, maintenance_status, reporter, report_date,
          responsible_team, responsible_person, begin_time, receive_time, remark
        FROM dm_topic0402_input_train_maintenance 
        WHERE maintenance_status = '进行中' 
          AND system_module = ?
          AND del_flag = 0
        ORDER BY report_date DESC
      `;
      
      const result = await this.mysqlService.executeCustomQuery(sql, [systemModule]);
      
      if (result.success) {
        const processedData = this.processMaintenanceData(result.data);
        
        return {
          success: true,
          data: {
            systemModule: systemModule,
            total: processedData.length,
            records: processedData,
            timestamp: new Date().toISOString()
          }
        };
      } else {
        throw new Error(result.error || `查询系统 ${systemModule} 运维订单失败`);
      }
    } catch (error) {
      console.error(`❌ 获取系统 ${systemModule} 运维订单失败:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }


  /**
   * 获取运维订单统计数据
   * @returns {Object} 统计结果
   */
  async getMaintenanceStatistics() {
    try {
      console.log('🔍 获取运维订单统计数据');
      
      const sql = `
        SELECT 
          maintenance_status,
          maintenance_type,
          system_module,
          COUNT(*) as count,
          DATE(report_date) as report_day
        FROM dm_topic0402_input_train_maintenance 
        WHERE del_flag = 0
        GROUP BY maintenance_status, maintenance_type, system_module, DATE(report_date)
        ORDER BY report_day DESC, count DESC
      `;
      
      const result = await this.mysqlService.executeCustomQuery(sql);
      
      if (result.success) {
        const statistics = this.processStatisticsData(result.data);
        
        return {
          success: true,
          data: {
            statistics: statistics,
            timestamp: new Date().toISOString()
          }
        };
      } else {
        throw new Error(result.error || '获取运维订单统计失败');
      }
    } catch (error) {
      console.error('❌ 获取运维订单统计失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 处理维修单数据，添加额外信息
   * @param {Array} rawData - 原始维修单数据
   * @returns {Array} 处理后的数据
   */
  processMaintenanceData(rawData) {
    return rawData.map(record => ({
      ...record,
      // 添加持续时间计算
      duration: this.calculateDuration(record.begin_time),
      // 添加系统分类标识
      systemCategory: this.getSystemCategory(record.system_module),
      // 格式化时间字段
      formattedReportDate: this.formatDateTime(record.report_date),
      formattedBeginTime: this.formatDateTime(record.begin_time),
      formattedReceiveTime: this.formatDateTime(record.receive_time),
      formattedLastMaintenanceDate: this.formatDateTime(record.last_maintenance_date),
      // 添加状态标识
      statusColor: this.getStatusColor(record.maintenance_status),
      typeIcon: this.getMaintenanceTypeIcon(record.maintenance_type)
    }));
  }

  /**
   * 处理统计数据
   * @param {Array} rawData - 原始统计数据
   * @returns {Object} 处理后的统计数据
   */
  processStatisticsData(rawData) {
    const statistics = {
      byStatus: {},
      byType: {},
      bySystem: {},
      daily: {},
      totalOrders: 0
    };

    rawData.forEach(record => {
      // 按状态统计
      if (!statistics.byStatus[record.maintenance_status]) {
        statistics.byStatus[record.maintenance_status] = 0;
      }
      statistics.byStatus[record.maintenance_status] += record.count;

      // 按类型统计
      if (!statistics.byType[record.maintenance_type]) {
        statistics.byType[record.maintenance_type] = 0;
      }
      statistics.byType[record.maintenance_type] += record.count;

      // 按系统统计
      if (!statistics.bySystem[record.system_module]) {
        statistics.bySystem[record.system_module] = 0;
      }
      statistics.bySystem[record.system_module] += record.count;

      // 按日期统计
      if (!statistics.daily[record.report_day]) {
        statistics.daily[record.report_day] = 0;
      }
      statistics.daily[record.report_day] += record.count;

      statistics.totalOrders += record.count;
    });

    return statistics;
  }

  /**
   * 计算维修持续时间
   * @param {Date} beginTime - 开始时间
   * @returns {Object} 持续时间信息
   */
  calculateDuration(beginTime) {
    if (!beginTime) return { hours: 0, text: '未开始' };
    
    const now = new Date();
    const start = new Date(beginTime);
    const diffMs = now - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    return {
      hours: diffHours,
      days: diffDays,
      text: diffDays > 0 ? `${diffDays}天${diffHours % 24}小时` : `${diffHours}小时`
    };
  }


  /**
   * 获取系统分类
   * @param {string} systemModule - 系统模块
   * @returns {string} 系统分类
   */
  getSystemCategory(systemModule) {
    const categoryMap = {
      '制动系统': '安全系统',
      '制动管路': '安全系统', 
      '牵引系统': '动力系统',
      '受电弓系统': '供电系统',
      '车门系统': '车体系统',
      '空调系统': '舒适系统',
      '车载网络': '信息系统',
      '信号通信': '信息系统',
      '转向架系统': '走行系统'
    };
    
    return categoryMap[systemModule] || '其他系统';
  }

  /**
   * 获取状态对应的颜色
   * @param {string} status - 维修状态
   * @returns {string} 颜色值
   */
  getStatusColor(status) {
    const colorMap = {
      '进行中': '#1890ff',
      '已完成': '#52c41a',
      '已取消': '#f5222d'
    };
    return colorMap[status] || '#d9d9d9';
  }

  /**
   * 获取维修类型对应的图标
   * @param {string} type - 维修类型
   * @returns {string} 图标类名
   */
  getMaintenanceTypeIcon(type) {
    const iconMap = {
      '定检': 'el-icon-date',
      '临修': 'el-icon-warning',
      '加改修': 'el-icon-setting'
    };
    return iconMap[type] || 'el-icon-info';
  }

  /**
   * 格式化日期时间
   * @param {Date} datetime - 日期时间
   * @returns {string} 格式化后的字符串
   */
  formatDateTime(datetime) {
    if (!datetime) return '';
    
    const date = new Date(datetime);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * 生成维修数据汇总信息
   * @param {Array} data - 维修数据
   * @returns {Object} 汇总信息
   */
  generateMaintenanceSummary(data) {
    const summary = {
      totalCount: data.length,
      byMaintenanceType: {},
      bySystemModule: {},
      bySystemCategory: {},
      byStationLocation: {},
      averageDuration: 0,
      criticalCount: 0
    };

    // 统计各维度数据
    data.forEach(record => {
      // 按维修类型统计
      summary.byMaintenanceType[record.maintenance_type] = 
        (summary.byMaintenanceType[record.maintenance_type] || 0) + 1;
      
      // 按系统模块统计
      summary.bySystemModule[record.system_module] = 
        (summary.bySystemModule[record.system_module] || 0) + 1;
      
      // 按系统分类统计
      summary.bySystemCategory[record.systemCategory] = 
        (summary.bySystemCategory[record.systemCategory] || 0) + 1;
      
      // 按站点统计
      summary.byStationLocation[record.station_location] = 
        (summary.byStationLocation[record.station_location] || 0) + 1;

      // 统计关键系统维修单
      if (['安全系统', '动力系统'].includes(record.systemCategory)) {
        summary.criticalCount++;
      }
    });

    // 计算平均持续时间
    const totalHours = data.reduce((sum, record) => sum + (record.duration.hours || 0), 0);
    summary.averageDuration = data.length > 0 ? Math.round(totalHours / data.length) : 0;

    return summary;
  }

  /**
   * 获取服务状态
   * @returns {Object} 服务状态
   */
  async getStatus() {
    try {
      return {
        success: true,
        data: {
          serviceName: this.serviceName,
          status: 'running',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          description: '高铁运维订单数据处理服务'
        }
      };
    } catch (error) {
      console.error('Topic04 获取状态失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
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

module.exports = Topic04Service;
