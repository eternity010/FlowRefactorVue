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
   * 获取生产任务数据
   * @param {string} modelRunBatch - 模型运行批次 (可选)
   * @returns {Object} 生产任务列表
   */
  async getProductionTasks(modelRunBatch = '20240905') {
    try {
      console.log(`🔍 获取生产任务数据，批次: ${modelRunBatch}`);
      
      const sql = `
        SELECT 
          id,
          model_run_batch,
          task_id,
          work_no,
          sale_order_no,
          order_no,
          order_need_num,
          plan_no,
          work_order_no,
          batch_no,
          dispatch_order_no,
          procedure_id,
          procedure_code,
          procedure_name,
          procedure_content,
          procedure_order,
          procedure_plan_preparation_time,
          procedure_plan_work_time,
          receive_id,
          receive_time,
          receive_name,
          product_id,
          product_code,
          product_name,
          order_type,
          task_num,
          report_num,
          plan_start_time,
          plan_end_time,
          real_start_time,
          real_end_time,
          jockey_id,
          jockey_no,
          jockey_name,
          equipment_ids,
          equipment_speed_range,
          equipment_unit_process_energy,
          equipment_unit_idle_energy,
          work_center_id,
          work_center_code,
          work_center_name,
          line_id,
          line_code,
          line_name,
          remark,
          create_time,
          update_time
        FROM dm_topic0401_input_task 
        WHERE model_run_batch = ?
          AND del_flag = 0
        ORDER BY task_id, procedure_order
      `;
      
      const result = await this.mysqlService.executeCustomQuery(sql, [modelRunBatch]);
      
      if (result.success) {
        const processedData = this.processProductionTaskData(result.data);
        const summary = this.generateProductionTaskSummary(processedData);
        
        console.log(`✅ 成功获取 ${processedData.length} 条生产任务数据`);
        
        return {
          success: true,
          data: {
            total: processedData.length,
            tasks: processedData,
            summary: summary,
            timestamp: new Date().toISOString()
          }
        };
      } else {
        throw new Error(result.error || '查询生产任务数据失败');
      }
    } catch (error) {
      console.error('❌ 获取生产任务失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取生产任务输出数据 (从output_task表)
   * @param {string} modelRunBatch - 模型运行批次
   * @returns {Object} 生产任务输出数据
   */
  async getProductionOutputTasks(modelRunBatch = '20240905') {
    try {
      console.log(`🔍 获取生产任务输出数据，批次: ${modelRunBatch}`);

      const sql = `
        SELECT
          id,
          model_run_batch,
          task_id,
          work_no,
          sale_order_no,
          order_no,
          order_need_num,
          plan_no,
          work_order_no,
          batch_no,
          dispatch_order_no,
          procedure_id,
          procedure_code,
          procedure_name,
          procedure_content,
          procedure_order,
          procedure_plan_preparation_time,
          procedure_plan_work_time,
          receive_id,
          receive_time,
          receive_name,
          product_id,
          product_code,
          product_name,
          order_type,
          task_num,
          report_num,
          plan_start_time,
          plan_end_time,
          real_start_time,
          real_end_time,
          jockey_id,
          jockey_no,
          jockey_name,
          equipment_ids,
          equipment_speed_range,
          equipment_unit_process_energy,
          equipment_unit_idle_energy,
          work_center_id,
          work_center_code,
          work_center_name,
          line_id,
          line_code,
          line_name,
          remark,
          create_time,
          update_time
        FROM dm_topic0401_output_task
        WHERE model_run_batch = ?
          AND del_flag = 0
        ORDER BY task_id, procedure_order
      `;

      const result = await this.mysqlService.executeCustomQuery(sql, [modelRunBatch]);

      if (result.success) {
        const processedData = this.processProductionTaskData(result.data);
        const summary = this.generateProductionTaskSummary(processedData);

        console.log(`✅ 成功获取 ${processedData.length} 条生产任务输出数据`);

        return {
          success: true,
          data: {
            total: processedData.length,
            tasks: processedData,
            summary: summary,
            timestamp: new Date().toISOString()
          }
        };
      } else {
        throw new Error(result.error || '查询生产任务输出数据失败');
      }
    } catch (error) {
      console.error('❌ 获取生产任务输出数据失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 根据订单号获取生产任务
   * @param {string} orderNo - 订单号
   * @returns {Object} 指定订单的生产任务
   */
  async getProductionTasksByOrder(orderNo) {
    try {
      console.log(`🔍 获取订单 "${orderNo}" 的生产任务`);
      
      const sql = `
        SELECT 
          id, task_id, work_no, order_no, procedure_name, procedure_order,
          procedure_plan_preparation_time, procedure_plan_work_time,
          product_name, order_need_num, jockey_name, work_center_name,
          plan_start_time, plan_end_time, real_start_time, real_end_time,
          equipment_ids, remark
        FROM dm_topic0401_input_task 
        WHERE order_no = ?
          AND del_flag = 0
        ORDER BY procedure_order
      `;
      
      const result = await this.mysqlService.executeCustomQuery(sql, [orderNo]);
      
      if (result.success) {
        const processedData = this.processProductionTaskData(result.data);
        
        return {
          success: true,
          data: {
            orderNo: orderNo,
            total: processedData.length,
            tasks: processedData,
            timestamp: new Date().toISOString()
          }
        };
      } else {
        throw new Error(result.error || `查询订单 ${orderNo} 生产任务失败`);
      }
    } catch (error) {
      console.error(`❌ 获取订单 ${orderNo} 生产任务失败:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取生产任务统计数据
   * @param {string} modelRunBatch - 模型运行批次
   * @returns {Object} 统计结果
   */
  async getProductionTaskStatistics(modelRunBatch = '20240905') {
    try {
      console.log('🔍 获取生产任务统计数据');
      
      const sql = `
        SELECT 
          order_no,
          product_name,
          order_need_num,
          COUNT(*) as task_count,
          COUNT(DISTINCT procedure_code) as procedure_count,
          COUNT(DISTINCT jockey_id) as jockey_count,
          COUNT(DISTINCT work_center_id) as work_center_count,
          MIN(plan_start_time) as earliest_start,
          MAX(plan_end_time) as latest_end,
          SUM(procedure_plan_preparation_time) as total_prep_time,
          SUM(procedure_plan_work_time) as total_work_time
        FROM dm_topic0401_input_task 
        WHERE model_run_batch = ?
          AND del_flag = 0
        GROUP BY order_no, product_name, order_need_num
        ORDER BY order_no
      `;
      
      const result = await this.mysqlService.executeCustomQuery(sql, [modelRunBatch]);
      
      if (result.success) {
        const statistics = this.processProductionStatisticsData(result.data);
        
        return {
          success: true,
          data: {
            statistics: statistics,
            timestamp: new Date().toISOString()
          }
        };
      } else {
        throw new Error(result.error || '获取生产任务统计失败');
      }
    } catch (error) {
      console.error('❌ 获取生产任务统计失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 处理生产任务数据，添加额外信息
   * @param {Array} rawData - 原始生产任务数据
   * @returns {Array} 处理后的数据
   */
  processProductionTaskData(rawData) {
    return rawData.map(record => ({
      ...record,
      // 格式化时间字段
      formattedPlanStartTime: this.formatDateTime(record.plan_start_time),
      formattedPlanEndTime: this.formatDateTime(record.plan_end_time),
      formattedRealStartTime: this.formatDateTime(record.real_start_time),
      formattedRealEndTime: this.formatDateTime(record.real_end_time),
      formattedReceiveTime: this.formatDateTime(record.receive_time),
      // 计算计划总时间
      totalPlannedTime: (record.procedure_plan_preparation_time || 0) + (record.procedure_plan_work_time || 0),
      // 工序状态
      procedureStatus: this.getProcedureStatus(record.plan_start_time, record.plan_end_time),
      // 设备ID数组
      equipmentIdArray: record.equipment_ids ? record.equipment_ids.split(';').filter(id => id && id !== '-1') : [],
      // 进度百分比
      progressPercent: this.calculateTaskProgress(record.plan_start_time, record.plan_end_time)
    }));
  }

  /**
   * 处理生产统计数据
   * @param {Array} rawData - 原始统计数据
   * @returns {Object} 处理后的统计数据
   */
  processProductionStatisticsData(rawData) {
    const statistics = {
      totalOrders: rawData.length,
      totalTasks: 0,
      totalProducts: 0,
      byProduct: {},
      byWorkCenter: {},
      timeline: {},
      efficiency: {}
    };

    rawData.forEach(record => {
      statistics.totalTasks += record.task_count;
      statistics.totalProducts += record.order_need_num;

      // 按产品统计
      if (!statistics.byProduct[record.product_name]) {
        statistics.byProduct[record.product_name] = {
          orderCount: 0,
          taskCount: 0,
          needNum: 0
        };
      }
      statistics.byProduct[record.product_name].orderCount++;
      statistics.byProduct[record.product_name].taskCount += record.task_count;
      statistics.byProduct[record.product_name].needNum += record.order_need_num;

      // 时间线统计
      const startDate = new Date(record.earliest_start).toDateString();
      if (!statistics.timeline[startDate]) {
        statistics.timeline[startDate] = 0;
      }
      statistics.timeline[startDate] += record.task_count;

      // 效率统计
      const totalTime = record.total_prep_time + record.total_work_time;
      statistics.efficiency[record.order_no] = {
        totalTime: totalTime,
        taskCount: record.task_count,
        avgTimePerTask: totalTime / record.task_count
      };
    });

    return statistics;
  }

  /**
   * 获取工序状态
   * @param {Date} planStartTime - 计划开始时间
   * @param {Date} planEndTime - 计划结束时间
   * @returns {string} 工序状态
   */
  getProcedureStatus(planStartTime, planEndTime) {
    const now = new Date();
    const start = new Date(planStartTime);
    const end = new Date(planEndTime);

    if (now < start) {
      return '未开始';
    } else if (now > end) {
      return '已完成';
    } else {
      return '进行中';
    }
  }

  /**
   * 计算任务进度
   * @param {Date} planStartTime - 计划开始时间
   * @param {Date} planEndTime - 计划结束时间
   * @returns {number} 进度百分比
   */
  calculateTaskProgress(planStartTime, planEndTime) {
    const now = new Date();
    const start = new Date(planStartTime);
    const end = new Date(planEndTime);

    if (now <= start) return 0;
    if (now >= end) return 100;

    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  }

  /**
   * 生成生产任务汇总信息
   * @param {Array} data - 生产任务数据
   * @returns {Object} 汇总信息
   */
  generateProductionTaskSummary(data) {
    const summary = {
      totalCount: data.length,
      byProcedure: {},
      byProduct: {},
      byWorkCenter: {},
      byStatus: {},
      avgPreparationTime: 0,
      avgWorkTime: 0
    };

    // 统计各维度数据
    data.forEach(record => {
      // 按工序统计
      summary.byProcedure[record.procedure_name] = 
        (summary.byProcedure[record.procedure_name] || 0) + 1;
      
      // 按产品统计
      summary.byProduct[record.product_name] = 
        (summary.byProduct[record.product_name] || 0) + 1;
      
      // 按工作中心统计
      summary.byWorkCenter[record.work_center_name] = 
        (summary.byWorkCenter[record.work_center_name] || 0) + 1;

      // 按状态统计
      summary.byStatus[record.procedureStatus] = 
        (summary.byStatus[record.procedureStatus] || 0) + 1;
    });

    // 计算平均时间
    const totalPrepTime = data.reduce((sum, record) => sum + (record.procedure_plan_preparation_time || 0), 0);
    const totalWorkTime = data.reduce((sum, record) => sum + (record.procedure_plan_work_time || 0), 0);
    summary.avgPreparationTime = data.length > 0 ? Math.round(totalPrepTime / data.length) : 0;
    summary.avgWorkTime = data.length > 0 ? Math.round(totalWorkTime / data.length) : 0;

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
