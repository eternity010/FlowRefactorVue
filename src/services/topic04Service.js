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
   * 获取采购订单数据（含物料明细）
   * @param {string} modelRunBatch - 模型运行批次
   * @returns {Object} 采购订单列表（每个订单包含物料明细）
   */
  async getPurchaseOrders(modelRunBatch = '2025-10-12_TSY_HSR_01') {
    try {
      console.log(`🔍 开始获取采购订单数据, 批次: ${modelRunBatch}`);
      
      // 1. 获取订单主表数据
      const orderSql = `
        SELECT 
          id,
          model_run_batch,
          po_no,
          contract_no,
          po_date,
          buyer_org,
          buyer_id,
          buyer_name,
          supplier_id,
          supplier_name,
          currency,
          tax_rate,
          total_amount,
          expected_arrival,
          delivery_addr,
          transport_mode,
          transport_cost,
          ship_time,
          arrival_time,
          status,
          priority,
          project_code,
          remark,
          create_time,
          update_time
        FROM dm_topic0403_input_purchase_order 
        WHERE model_run_batch = ? 
          AND del_flag = 0
        ORDER BY po_date DESC, po_no
      `;
      
      const orderResult = await this.mysqlService.executeCustomQuery(orderSql, [modelRunBatch]);
      
      if (!orderResult.success) {
        throw new Error(orderResult.error || '查询采购订单数据失败');
      }
      
      // 2. 获取物料明细数据
      const itemSql = `
        SELECT 
          id,
          model_run_batch,
          po_no,
          line_no,
          material_code,
          material_name,
          spec_model,
          unit,
          qty,
          unit_price,
          amount,
          need_date,
          warehouse_code,
          demand_dept,
          transport_mode,
          transport_cost,
          ship_time,
          arrival_time,
          remark
        FROM dm_topic0403_input_purchase_item 
        WHERE model_run_batch = ? 
          AND del_flag = 0
        ORDER BY po_no, line_no
      `;
      
      const itemResult = await this.mysqlService.executeCustomQuery(itemSql, [modelRunBatch]);
      
      if (!itemResult.success) {
        throw new Error(itemResult.error || '查询采购物料明细数据失败');
      }
      
      // 3. 组装数据：将物料明细按订单号分组
      const itemsByOrder = {};
      itemResult.data.forEach(item => {
        if (!itemsByOrder[item.po_no]) {
          itemsByOrder[item.po_no] = [];
        }
        itemsByOrder[item.po_no].push(this.processPurchaseItemData(item));
      });
      
      // 4. 将物料明细添加到对应的订单中
      const ordersWithItems = orderResult.data.map(order => {
        const processedOrder = this.processPurchaseOrderData(order);
        processedOrder.items = itemsByOrder[order.po_no] || [];
        processedOrder.itemCount = processedOrder.items.length;
        return processedOrder;
      });
      
      console.log(`✅ 成功获取 ${ordersWithItems.length} 条采购订单数据`);
      
      return {
        success: true,
        data: {
          total: ordersWithItems.length,
          records: ordersWithItems,
          summary: this.generatePurchaseOrdersSummary(ordersWithItems),
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('❌ 获取采购订单数据失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 处理采购订单数据
   * @param {Object} order - 原始订单数据
   * @returns {Object} 处理后的订单数据
   */
  processPurchaseOrderData(order) {
    return {
      id: order.id,
      modelRunBatch: order.model_run_batch,
      poNo: order.po_no,
      contractNo: order.contract_no,
      poDate: order.po_date,
      buyerOrg: order.buyer_org,
      buyerId: order.buyer_id,
      buyerName: order.buyer_name,
      supplierId: order.supplier_id,
      supplierName: order.supplier_name,
      currency: order.currency,
      taxRate: parseFloat(order.tax_rate) || 0,
      totalAmount: parseFloat(order.total_amount) || 0,
      expectedArrival: order.expected_arrival,
      deliveryAddr: order.delivery_addr,
      transportMode: order.transport_mode,
      transportCost: parseFloat(order.transport_cost) || 0,
      shipTime: order.ship_time,
      arrivalTime: order.arrival_time,
      status: order.status,
      priority: order.priority,
      projectCode: order.project_code,
      remark: order.remark || '',
      createTime: order.create_time,
      updateTime: order.update_time
    };
  }

  /**
   * 处理单条采购物料数据
   * @param {Object} item - 原始物料数据
   * @returns {Object} 处理后的物料数据
   */
  processPurchaseItemData(item) {
    return {
      id: item.id,
      poNo: item.po_no,
      lineNo: item.line_no,
      materialCode: item.material_code,
      materialName: item.material_name,
      specModel: item.spec_model,
      unit: item.unit,
      qty: parseFloat(item.qty) || 0,
      unitPrice: parseFloat(item.unit_price) || 0,
      amount: parseFloat(item.amount) || 0,
      needDate: item.need_date,
      warehouseCode: item.warehouse_code,
      demandDept: item.demand_dept,
      transportMode: item.transport_mode,
      transportCost: parseFloat(item.transport_cost) || 0,
      shipTime: item.ship_time,
      arrivalTime: item.arrival_time,
      remark: item.remark || ''
    };
  }

  /**
   * 生成采购订单汇总信息
   * @param {Array} orders - 采购订单数据（含物料明细）
   * @returns {Object} 汇总统计
   */
  generatePurchaseOrdersSummary(orders) {
    if (!Array.isArray(orders) || orders.length === 0) {
      return {
        totalOrders: 0,
        totalItems: 0,
        totalAmount: 0,
        totalTransportCost: 0,
        totalCost: 0,
        statusCounts: {}
      };
    }

    const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalTransportCost = orders.reduce((sum, order) => sum + order.transportCost, 0);
    const totalItems = orders.reduce((sum, order) => sum + order.itemCount, 0);
    
    // 统计各状态订单数量
    const statusCounts = {};
    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    return {
      totalOrders: orders.length,
      totalItems: totalItems,
      totalAmount: Math.round(totalAmount * 100) / 100,
      totalTransportCost: Math.round(totalTransportCost * 100) / 100,
      totalCost: Math.round((totalAmount + totalTransportCost) * 100) / 100,
      statusCounts: statusCounts
    };
  }

  /**
   * 获取供应商数据（含物料能力）
   * @param {string} modelRunBatch - 模型运行批次
   * @returns {Object} 供应商列表（含物料能力）
   */
  async getSuppliers(modelRunBatch = '2025-10-12_TSY_HSR_01') {
    try {
      console.log(`🔍 开始获取供应商数据, 批次: ${modelRunBatch}`);
      
      // 1. 获取供应商主表数据
      const supplierSql = `
        SELECT 
          id,
          model_run_batch,
          supplier_id,
          supplier_code,
          supplier_name,
          supplier_category,
          credit_rating,
          region,
          contact_name,
          contact_phone,
          contact_email,
          payment_term,
          remark,
          create_time,
          update_time
        FROM dm_topic0403_input_supplier 
        WHERE model_run_batch = ? 
          AND del_flag = 0
        ORDER BY supplier_category, supplier_id
      `;
      
      const supplierResult = await this.mysqlService.executeCustomQuery(supplierSql, [modelRunBatch]);
      
      if (!supplierResult.success) {
        throw new Error(supplierResult.error || '查询供应商数据失败');
      }
      
      // 2. 获取供应商物料能力数据
      const materialSql = `
        SELECT 
          id,
          model_run_batch,
          supplier_id,
          material_code,
          avg_price,
          price_range_min,
          price_range_max,
          lead_time_days,
          on_time_rate,
          defect_rate,
          capacity_level,
          transport_mode,
          avg_transport_cost,
          remark
        FROM dm_topic0403_input_supplier_material 
        WHERE model_run_batch = ? 
          AND del_flag = 0
        ORDER BY supplier_id, material_code
      `;
      
      const materialResult = await this.mysqlService.executeCustomQuery(materialSql, [modelRunBatch]);
      
      if (!materialResult.success) {
        throw new Error(materialResult.error || '查询供应商物料能力数据失败');
      }
      
      // 3. 组装数据：将物料能力按供应商ID分组
      const materialsBySupplier = {};
      materialResult.data.forEach(material => {
        if (!materialsBySupplier[material.supplier_id]) {
          materialsBySupplier[material.supplier_id] = [];
        }
        materialsBySupplier[material.supplier_id].push(this.processSupplierMaterialData(material));
      });
      
      // 4. 将物料能力添加到对应的供应商中
      const suppliersWithMaterials = supplierResult.data.map(supplier => {
        const processedSupplier = this.processSupplierData(supplier);
        const materials = materialsBySupplier[supplier.supplier_id] || [];
        processedSupplier.materials = materials;
        processedSupplier.materialCount = materials.length;
        
        // 计算供应商综合指标
        if (materials.length > 0) {
          processedSupplier.avgOnTimeRate = this.calculateAverage(materials.map(m => m.onTimeRate));
          processedSupplier.avgDefectRate = this.calculateAverage(materials.map(m => m.defectRate));
          processedSupplier.avgLeadTime = this.calculateAverage(materials.map(m => m.leadTimeDays));
          processedSupplier.avgPrice = this.calculateAverage(materials.map(m => m.avgPrice));
        }
        
        return processedSupplier;
      });
      
      // 5. 按类别分组
      const suppliersByCategory = this.groupSuppliersByCategory(suppliersWithMaterials);
      
      console.log(`✅ 成功获取 ${suppliersWithMaterials.length} 条供应商数据`);
      
      return {
        success: true,
        data: {
          total: suppliersWithMaterials.length,
          records: suppliersWithMaterials,
          categories: suppliersByCategory,
          summary: this.generateSuppliersSummary(suppliersWithMaterials),
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('❌ 获取供应商数据失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 处理供应商数据
   * @param {Object} supplier - 原始供应商数据
   * @returns {Object} 处理后的供应商数据
   */
  processSupplierData(supplier) {
    return {
      id: supplier.id,
      modelRunBatch: supplier.model_run_batch,
      supplierId: supplier.supplier_id,
      supplierCode: supplier.supplier_code,
      supplierName: supplier.supplier_name,
      supplierCategory: supplier.supplier_category,
      creditRating: supplier.credit_rating,
      region: supplier.region,
      contactName: supplier.contact_name,
      contactPhone: supplier.contact_phone,
      contactEmail: supplier.contact_email,
      paymentTerm: supplier.payment_term,
      remark: supplier.remark || '',
      createTime: supplier.create_time,
      updateTime: supplier.update_time
    };
  }

  /**
   * 处理供应商物料能力数据
   * @param {Object} material - 原始物料能力数据
   * @returns {Object} 处理后的物料能力数据
   */
  processSupplierMaterialData(material) {
    return {
      id: material.id,
      supplierId: material.supplier_id,
      materialCode: material.material_code,
      avgPrice: parseFloat(material.avg_price) || 0,
      priceRangeMin: parseFloat(material.price_range_min) || 0,
      priceRangeMax: parseFloat(material.price_range_max) || 0,
      leadTimeDays: parseInt(material.lead_time_days) || 0,
      onTimeRate: parseFloat(material.on_time_rate) || 0,
      defectRate: parseFloat(material.defect_rate) || 0,
      capacityLevel: material.capacity_level,
      transportMode: material.transport_mode,
      avgTransportCost: parseFloat(material.avg_transport_cost) || 0,
      remark: material.remark || ''
    };
  }

  /**
   * 按类别分组供应商
   * @param {Array} suppliers - 供应商列表
   * @returns {Object} 按类别分组的供应商
   */
  groupSuppliersByCategory(suppliers) {
    const grouped = {};
    suppliers.forEach(supplier => {
      const category = supplier.supplierCategory;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(supplier);
    });
    return grouped;
  }

  /**
   * 计算平均值
   * @param {Array} values - 数值数组
   * @returns {number} 平均值
   */
  calculateAverage(values) {
    if (!values || values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return Math.round((sum / values.length) * 100) / 100;
  }

  /**
   * 生成供应商汇总信息
   * @param {Array} suppliers - 供应商列表
   * @returns {Object} 汇总统计
   */
  generateSuppliersSummary(suppliers) {
    if (!Array.isArray(suppliers) || suppliers.length === 0) {
      return {
        totalSuppliers: 0,
        totalMaterials: 0,
        avgOnTimeRate: 0,
        avgDefectRate: 0,
        categoryCount: 0,
        categoryCounts: {}
      };
    }

    const totalMaterials = suppliers.reduce((sum, s) => sum + s.materialCount, 0);
    const avgOnTimeRate = this.calculateAverage(suppliers.map(s => s.avgOnTimeRate).filter(v => v > 0));
    const avgDefectRate = this.calculateAverage(suppliers.map(s => s.avgDefectRate).filter(v => v > 0));
    
    // 统计各类别供应商数量
    const categoryCounts = {};
    suppliers.forEach(supplier => {
      categoryCounts[supplier.supplierCategory] = (categoryCounts[supplier.supplierCategory] || 0) + 1;
    });

    return {
      totalSuppliers: suppliers.length,
      totalMaterials: totalMaterials,
      avgOnTimeRate: avgOnTimeRate,
      avgDefectRate: avgDefectRate,
      categoryCount: Object.keys(categoryCounts).length,
      categoryCounts: categoryCounts
    };
  }

  /**
   * 获取采购物料清单数据
   * @param {string} modelRunBatch - 模型运行批次
   * @returns {Object} 采购物料清单列表
   */
  async getPurchaseItems(modelRunBatch = '2025-10-12_TSY_HSR_01') {
    try {
      console.log(`🔍 开始获取采购物料清单数据, 批次: ${modelRunBatch}`);
      
      const sql = `
        SELECT 
          id,
          model_run_batch,
          po_no,
          line_no,
          material_code,
          material_name,
          spec_model,
          unit,
          qty,
          unit_price,
          amount,
          need_date,
          warehouse_code,
          demand_dept,
          transport_mode,
          transport_cost,
          ship_time,
          arrival_time,
          remark,
          create_time,
          update_time
        FROM dm_topic0403_input_purchase_item 
        WHERE model_run_batch = ? 
          AND del_flag = 0
        ORDER BY po_no, line_no
      `;
      
      const result = await this.mysqlService.executeCustomQuery(sql, [modelRunBatch]);
      
      if (result.success) {
        const processedData = this.processPurchaseItemsData(result.data);
        
        console.log(`✅ 成功获取 ${processedData.length} 条采购物料清单数据`);
        
        return {
          success: true,
          data: {
            total: processedData.length,
            records: processedData,
            summary: this.generatePurchaseItemsSummary(processedData),
            timestamp: new Date().toISOString()
          }
        };
      } else {
        throw new Error(result.error || '查询采购物料清单数据失败');
      }
    } catch (error) {
      console.error('❌ 获取采购物料清单失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 处理采购物料清单数据
   * @param {Array} data - 原始数据
   * @returns {Array} 处理后的数据
   */
  processPurchaseItemsData(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data.map(item => ({
      id: item.id,
      modelRunBatch: item.model_run_batch,
      poNo: item.po_no,
      lineNo: item.line_no,
      materialCode: item.material_code,
      materialName: item.material_name,
      specModel: item.spec_model,
      unit: item.unit,
      qty: parseFloat(item.qty) || 0,
      unitPrice: parseFloat(item.unit_price) || 0,
      amount: parseFloat(item.amount) || 0,
      needDate: item.need_date,
      warehouseCode: item.warehouse_code,
      demandDept: item.demand_dept,
      transportMode: item.transport_mode,
      transportCost: parseFloat(item.transport_cost) || 0,
      shipTime: item.ship_time,
      arrivalTime: item.arrival_time,
      remark: item.remark || '',
      createTime: item.create_time,
      updateTime: item.update_time
    }));
  }

  /**
   * 生成采购物料清单汇总信息
   * @param {Array} data - 采购物料数据
   * @returns {Object} 汇总统计
   */
  generatePurchaseItemsSummary(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        totalItems: 0,
        totalAmount: 0,
        totalTransportCost: 0,
        totalCost: 0,
        orderCount: 0,
        materialTypes: 0
      };
    }

    const uniqueOrders = new Set(data.map(item => item.poNo));
    const uniqueMaterials = new Set(data.map(item => item.materialCode));
    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
    const totalTransportCost = data.reduce((sum, item) => sum + item.transportCost, 0);

    return {
      totalItems: data.length,
      totalAmount: Math.round(totalAmount * 100) / 100,
      totalTransportCost: Math.round(totalTransportCost * 100) / 100,
      totalCost: Math.round((totalAmount + totalTransportCost) * 100) / 100,
      orderCount: uniqueOrders.size,
      materialTypes: uniqueMaterials.size
    };
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
