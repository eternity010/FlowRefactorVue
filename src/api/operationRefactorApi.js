import axios from 'axios'

// API基础配置 - 专用于维修记录API，使用维修专用代理路径
const BASE_URL = ''

// 创建axios实例
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30秒超时
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    console.log('🚀 API请求:', config.method && config.method.toUpperCase(), config.url, config.data)
    return config
  },
  error => {
    console.error('❌ 请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    console.log('✅ API响应:', response.status, response.data)
    return response
  },
  error => {
    console.error('❌ 响应错误:', (error.response && error.response.data) || error.message)
    return Promise.reject(error)
  }
)

/**
 * 运维重构相关API
 */
export const operationRefactorApi = {
  
  /**
   * 查询维护记录
   * @param {Object} params - 查询参数
   * @param {string} params.start_date - 开始日期 (YYYY-MM-DD格式)
   * @param {string} params.end_date - 结束日期 (YYYY-MM-DD格式)
   * @returns {Promise} API响应数据
   * @example
   * const result = await operationRefactorApi.queryMaintenanceRecords({
   *   start_date: "2025-06-01",
   *   end_date: "2025-06-05"
   * })
   */
  async queryMaintenanceRecords(params) {
    try {
      // 参数验证
      if (!params || !params.start_date || !params.end_date) {
        throw new Error('缺少必需参数: start_date 和 end_date')
      }

      // 日期格式验证
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(params.start_date) || !dateRegex.test(params.end_date)) {
        throw new Error('日期格式错误，请使用 YYYY-MM-DD 格式')
      }

      const response = await api.post('/api/maintenance/query-maintenance-records', {
        start_date: params.start_date,
        end_date: params.end_date
      })

      return {
        success: true,
        data: response.data,
        status: response.status
      }
    } catch (error) {
      console.error('查询维护记录失败:', error)
      
      // 处理不同类型的错误
      if (error.response) {
        // 服务器响应错误
        return {
          success: false,
          error: (error.response.data && error.response.data.message) || '服务器错误',
          status: error.response.status,
          details: error.response.data
        }
      } else if (error.request) {
        // 网络错误
        return {
          success: false,
          error: '网络连接失败，请检查网络状态',
          status: 0
        }
      } else {
        // 其他错误
        return {
          success: false,
          error: error.message || '未知错误',
          status: 0
        }
      }
    }
  },

  /**
   * 解析维护记录数据
   * @param {Object} rawData - API返回的原始数据
   * @returns {Object} 解析后的数据
   */
  parseMaintenanceData(rawData) {
    try {
      if (!rawData || !rawData.success) {
        return {
          success: false,
          error: '数据解析失败：无效的数据格式'
        }
      }

      const { data, summary, message } = rawData

      // 统计数据
      const statistics = {
        totalDays: (summary && summary.total_days) || 0,
        totalInputRecords: (summary && summary.total_input_records) || 0,
        totalOutputPlans: (summary && summary.total_output_plans) || 0,
        dateRange: (summary && summary.date_range) || '',
        
        // 计算额外统计信息
        averageRecordsPerDay: (summary && summary.total_days > 0) 
          ? Math.round(summary.total_input_records / summary.total_days * 100) / 100 
          : 0,
        
        planConversionRate: (summary && summary.total_input_records > 0) 
          ? Math.round((summary.total_output_plans / summary.total_input_records) * 100 * 100) / 100
          : 0
      }

      // 按日期整理数据
      const dailyData = data ? data.map(dayRecord => ({
        date: dayRecord.date,
        recordCount: (dayRecord.records && dayRecord.records.length) || 0,
        records: dayRecord.records ? dayRecord.records.map(record => ({
          // 基本信息
          trainId: record.train_id,
          carriageNo: record.carriage_no,
          faultDescription: record.fault_description,
          maintenanceType: record.maintenance_type,
          reportDate: record.report_date,
          stationLocation: record.station_location,
          systemModule: record.system_module,
          repairCode: record.repair_code,
          repairOrderId: record.repair_order_id,
          
          // 新的维修信息
          newRepairInfo: {
            assignedPerson: record.new_repair_info && record.new_repair_info.assigned_person,
            assignedTeam: record.new_repair_info && record.new_repair_info.assigned_team,
            assignedContact: record.new_repair_info && record.new_repair_info.assigned_contact,
            matchScore: record.new_repair_info && record.new_repair_info.match_score,
            predictedRepairTime: record.new_repair_info && record.new_repair_info.predicted_repair_time_hour,
            predictedNextFailureTime: record.new_repair_info && record.new_repair_info.predicted_next_failure_time_hour
          },
          
          // 旧的维修信息
          oldRepairInfo: {
            assignedPerson: record.old_repair_info && record.old_repair_info.assigned_person,
            assignedTeam: record.old_repair_info && record.old_repair_info.assigned_team,
            assignedContact: record.old_repair_info && record.old_repair_info.assigned_contact,
            matchScore: record.old_repair_info && record.old_repair_info.match_score,
            predictedRepairTime: record.old_repair_info && record.old_repair_info.predicted_repair_time_hour,
            predictedNextFailureTime: record.old_repair_info && record.old_repair_info.predicted_next_failure_time_hour
          },
          
          // 匹配计划
          matchingPlans: record.matching_plans ? record.matching_plans.map(plan => ({
            planCode: plan.plan_code,
            assignedPerson: plan.assigned_person,
            assignedTeam: plan.assigned_team,
            assignedContact: plan.assigned_contact,
            planStartTime: plan.plan_start_time,
            planEndTime: plan.plan_end_time,
            planStatus: plan.plan_status,
            priority: plan.priority,
            riskLevel: plan.risk_level,
            predictedDowntimeHours: plan.predicted_downtime_hours,
            slaDeadline: plan.sla_deadline,
            dependencyOrderId: plan.dependency_order_id,
            requiredParts: plan.required_parts,
            requiredSkill: plan.required_skill,
            remark: plan.remark
          })) : [],
          
          // 计算改进指标
          improvements: {
            matchScoreImprovement: (record.new_repair_info && record.new_repair_info.match_score && record.old_repair_info && record.old_repair_info.match_score)
              ? Math.round((record.new_repair_info.match_score - record.old_repair_info.match_score) * 100 * 100) / 100
              : 0,
            repairTimeReduction: (record.old_repair_info && record.old_repair_info.predicted_repair_time_hour && record.new_repair_info && record.new_repair_info.predicted_repair_time_hour)
              ? Math.round((record.old_repair_info.predicted_repair_time_hour - record.new_repair_info.predicted_repair_time_hour) * 100) / 100
              : 0,
            nextFailureTimeIncrease: (record.new_repair_info && record.new_repair_info.predicted_next_failure_time_hour && record.old_repair_info && record.old_repair_info.predicted_next_failure_time_hour)
              ? Math.round((record.new_repair_info.predicted_next_failure_time_hour - record.old_repair_info.predicted_next_failure_time_hour) * 100) / 100
              : 0
          }
        })) : []
      })) : []

      return {
        success: true,
        data: {
          statistics,
          dailyData,
          message
        }
      }
    } catch (error) {
      console.error('数据解析错误:', error)
      return {
        success: false,
        error: '数据解析失败：' + error.message
      }
    }
  },

  /**
   * 获取并解析维护记录数据（组合接口）
   * @param {Object} params - 查询参数
   * @returns {Promise} 解析后的数据
   */
  async getMaintenanceRecords(params) {
    try {
      // 获取原始数据
      const response = await this.queryMaintenanceRecords(params)
      
      if (!response.success) {
        return response
      }

      // 解析数据
      const parsedData = this.parseMaintenanceData(response.data)
      
      return parsedData
    } catch (error) {
      console.error('获取维护记录失败:', error)
      return {
        success: false,
        error: error.message || '获取维护记录失败'
      }
    }
  },

  /**
   * 获取统计摘要
   * @param {string} startDate - 开始日期
   * @param {string} endDate - 结束日期
   * @returns {Promise} 统计摘要数据
   */
  async getStatisticsSummary(startDate, endDate) {
    try {
      const result = await this.getMaintenanceRecords({
        start_date: startDate,
        end_date: endDate
      })

      if (!result.success) {
        return result
      }

      return {
        success: true,
        data: result.data.statistics
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || '获取统计摘要失败'
      }
    }
  },

  /**
   * 分析重构效果
   * @param {Object} rawData - API返回的原始数据
   * @returns {Object} 重构效果分析结果
   */
  analyzeRefactorEffects(rawData) {
    try {
      if (!rawData || !rawData.success || !rawData.data) {
        return {
          success: false,
          error: '无效的数据格式'
        }
      }

      const allRecords = []
      
      // 收集所有维修记录
      rawData.data.forEach(dayData => {
        if (dayData.records) {
          allRecords.push(...dayData.records)
        }
      })

      let totalRecords = allRecords.length
      let improvedMatchScore = 0  // 匹配度提升的记录数
      let reducedRepairTime = 0   // 维修时间缩短的记录数
      let increasedFailureTime = 0 // 下次故障时间延长的记录数
      let reassignedPersonnel = 0  // 重新分配人员的记录数

      let totalMatchScoreImprovement = 0    // 总匹配度提升
      let totalRepairTimeReduction = 0      // 总维修时间缩短
      let totalFailureTimeIncrease = 0      // 总故障时间延长

      let totalOldRepairTime = 0             // 原总维修时间
      let totalNewRepairTime = 0             // 现总维修时间
      
      let totalOldFailureTime = 0            // 原总故障间隔时间
      let totalNewFailureTime = 0            // 现总故障间隔时间

      const personnelChanges = []  // 人员变更记录
      const teamChanges = []       // 团队变更记录
      const failureOptimizationRates = []  // 故障间隔优化率记录
      
      allRecords.forEach(record => {
        const oldInfo = record.old_repair_info
        const newInfo = record.new_repair_info

        if (!oldInfo || !newInfo) return

        // 计算原总维修时间和现总维修时间
        totalOldRepairTime += oldInfo.predicted_repair_time_hour || 0
        totalNewRepairTime += newInfo.predicted_repair_time_hour || 0
        
        // 计算原总故障间隔时间和现总故障间隔时间
        totalOldFailureTime += oldInfo.predicted_next_failure_time_hour || 0
        totalNewFailureTime += newInfo.predicted_next_failure_time_hour || 0

        // 分析匹配度变化
        if (newInfo.match_score > oldInfo.match_score) {
          improvedMatchScore++
          totalMatchScoreImprovement += (newInfo.match_score - oldInfo.match_score)
        }

        // 分析维修时间变化
        if (newInfo.predicted_repair_time_hour < oldInfo.predicted_repair_time_hour) {
          reducedRepairTime++
          totalRepairTimeReduction += (oldInfo.predicted_repair_time_hour - newInfo.predicted_repair_time_hour)
        }

        // 分析下次故障时间变化
        if (newInfo.predicted_next_failure_time_hour > oldInfo.predicted_next_failure_time_hour) {
          increasedFailureTime++
          totalFailureTimeIncrease += (newInfo.predicted_next_failure_time_hour - oldInfo.predicted_next_failure_time_hour)
        }

        // 计算每个记录的故障间隔优化率
        if (oldInfo.predicted_next_failure_time_hour && oldInfo.predicted_next_failure_time_hour > 0) {
          const optimizationRate = ((newInfo.predicted_next_failure_time_hour - oldInfo.predicted_next_failure_time_hour) / oldInfo.predicted_next_failure_time_hour) * 100
          failureOptimizationRates.push(optimizationRate)
        }

        // 分析人员变更
        if (oldInfo.assigned_person !== newInfo.assigned_person) {
          reassignedPersonnel++
          personnelChanges.push({
            trainId: record.train_id,
            carriageNo: record.carriage_no,
            systemModule: record.system_module,
            oldPerson: oldInfo.assigned_person,
            newPerson: newInfo.assigned_person,
            oldTeam: oldInfo.assigned_team,
            newTeam: newInfo.assigned_team,
            matchScoreChange: newInfo.match_score - oldInfo.match_score,
            repairTimeChange: oldInfo.predicted_repair_time_hour - newInfo.predicted_repair_time_hour
          })
        }

        // 分析团队变更
        if (oldInfo.assigned_team !== newInfo.assigned_team) {
          teamChanges.push({
            trainId: record.train_id,
            carriageNo: record.carriage_no,
            systemModule: record.system_module,
            oldTeam: oldInfo.assigned_team,
            newTeam: newInfo.assigned_team,
            reason: '跨团队优化分配'
          })
        }
      })

      // 计算效果统计
      const effectStats = {
        总记录数: totalRecords,
        匹配度提升记录数: improvedMatchScore,
        维修时间缩短记录数: reducedRepairTime,
        故障间隔延长记录数: increasedFailureTime,
        人员重新分配记录数: reassignedPersonnel,
        
        匹配度提升率: totalRecords > 0 ? Math.round((improvedMatchScore / totalRecords) * 100 * 100) / 100 : 0,
        维修时间缩短率: totalRecords > 0 ? Math.round((reducedRepairTime / totalRecords) * 100 * 100) / 100 : 0,
        故障间隔延长率: totalRecords > 0 ? Math.round((increasedFailureTime / totalRecords) * 100 * 100) / 100 : 0,
        人员重新分配率: totalRecords > 0 ? Math.round((reassignedPersonnel / totalRecords) * 100 * 100) / 100 : 0,
        
        平均匹配度提升: improvedMatchScore > 0 ? Math.round((totalMatchScoreImprovement / improvedMatchScore) * 100 * 100) / 100 : 0,
        平均维修时间缩短小时: reducedRepairTime > 0 ? Math.round((totalRepairTimeReduction / reducedRepairTime) * 100) / 100 : 0,
        平均故障间隔延长小时: increasedFailureTime > 0 ? Math.round((totalFailureTimeIncrease / increasedFailureTime) * 100) / 100 : 0,
        
        总维修时间节省小时: Math.round(totalRepairTimeReduction * 100) / 100,
        总故障间隔延长小时: Math.round(totalFailureTimeIncrease * 100) / 100,
        
        // 原总维修时间和现总维修时间对比
        原总维修时间小时: Math.round(totalOldRepairTime * 100) / 100,
        现总维修时间小时: Math.round(totalNewRepairTime * 100) / 100,
        
        // 原总故障间隔时间和现总故障间隔时间对比
        原总故障间隔时间小时: Math.round(totalOldFailureTime * 100) / 100,
        现总故障间隔时间小时: Math.round(totalNewFailureTime * 100) / 100,
        
        // 故障间隔优化率统计
        最大优化率: failureOptimizationRates.length > 0 ? Math.round(Math.max(...failureOptimizationRates) * 100) / 100 : 0,
        平均优化率: failureOptimizationRates.length > 0 ? Math.round((failureOptimizationRates.reduce((sum, rate) => sum + rate, 0) / failureOptimizationRates.length) * 100) / 100 : 0,
        有效优化记录数: failureOptimizationRates.length
      }

      // 按系统模块分析效果
      const systemModuleEffects = {}
      allRecords.forEach(record => {
        const module = record.system_module
        if (!systemModuleEffects[module]) {
          systemModuleEffects[module] = {
            totalCount: 0,
            improvedMatch: 0,
            reducedTime: 0,
            increasedFailureTime: 0,
            reassigned: 0,
            totalTimeReduction: 0,
            totalMatchImprovement: 0
          }
        }

        const moduleStats = systemModuleEffects[module]
        moduleStats.totalCount++

        const oldInfo = record.old_repair_info
        const newInfo = record.new_repair_info

        if (newInfo.match_score > oldInfo.match_score) {
          moduleStats.improvedMatch++
          moduleStats.totalMatchImprovement += (newInfo.match_score - oldInfo.match_score)
        }

        if (newInfo.predicted_repair_time_hour < oldInfo.predicted_repair_time_hour) {
          moduleStats.reducedTime++
          moduleStats.totalTimeReduction += (oldInfo.predicted_repair_time_hour - newInfo.predicted_repair_time_hour)
        }

        if (newInfo.predicted_next_failure_time_hour > oldInfo.predicted_next_failure_time_hour) {
          moduleStats.increasedFailureTime++
        }

        if (oldInfo.assigned_person !== newInfo.assigned_person) {
          moduleStats.reassigned++
        }
      })

      // 按维护类型分析效果
      const maintenanceTypeEffects = {}
      allRecords.forEach(record => {
        const type = record.maintenance_type
        if (!maintenanceTypeEffects[type]) {
          maintenanceTypeEffects[type] = {
            totalCount: 0,
            averageOldMatchScore: 0,
            averageNewMatchScore: 0,
            averageTimeReduction: 0,
            totalOldMatchScore: 0,
            totalNewMatchScore: 0,
            totalTimeReduction: 0
          }
        }

        const typeStats = maintenanceTypeEffects[type]
        typeStats.totalCount++

        const oldInfo = record.old_repair_info
        const newInfo = record.new_repair_info

        typeStats.totalOldMatchScore += oldInfo.match_score
        typeStats.totalNewMatchScore += newInfo.match_score
        typeStats.totalTimeReduction += (oldInfo.predicted_repair_time_hour - newInfo.predicted_repair_time_hour)
      })

      // 计算平均值
      Object.keys(maintenanceTypeEffects).forEach(type => {
        const stats = maintenanceTypeEffects[type]
        stats.averageOldMatchScore = Math.round((stats.totalOldMatchScore / stats.totalCount) * 100) / 100
        stats.averageNewMatchScore = Math.round((stats.totalNewMatchScore / stats.totalCount) * 100) / 100
        stats.averageTimeReduction = Math.round((stats.totalTimeReduction / stats.totalCount) * 100) / 100
      })

      // 准备详细记录数据用于前端展示
      const detailedRecords = allRecords.map(record => {
        const oldInfo = record.old_repair_info
        const newInfo = record.new_repair_info
        
        return {
          // 基本信息
          trainId: record.train_id,
          carriageNo: record.carriage_no,
          systemModule: record.system_module,
          faultDescription: record.fault_description,
          reportDate: record.report_date,
          
          // 人员变化
          oldPerson: oldInfo.assigned_person || '未分配',
          newPerson: newInfo.assigned_person || '未分配',
          personChanged: Boolean(oldInfo.assigned_person && newInfo.assigned_person &&
                                  oldInfo.assigned_person !== newInfo.assigned_person),
          
          // 维修时间变化
          oldRepairTime: oldInfo.predicted_repair_time_hour,
          newRepairTime: newInfo.predicted_repair_time_hour,
          repairTimeSaved: Math.round((oldInfo.predicted_repair_time_hour - newInfo.predicted_repair_time_hour) * 100) / 100,
          repairTimeImproved: newInfo.predicted_repair_time_hour < oldInfo.predicted_repair_time_hour,
          
          // 故障间隔时间变化
          oldFailureTime: oldInfo.predicted_next_failure_time_hour,
          newFailureTime: newInfo.predicted_next_failure_time_hour,
          failureTimeIncreased: Math.round((newInfo.predicted_next_failure_time_hour - oldInfo.predicted_next_failure_time_hour) * 100) / 100,
          failureTimeImproved: newInfo.predicted_next_failure_time_hour > oldInfo.predicted_next_failure_time_hour,
          
          // 匹配度变化
          oldMatchScore: oldInfo.match_score,
          newMatchScore: newInfo.match_score,
          matchScoreImproved: newInfo.match_score > oldInfo.match_score,
          
          // 综合改进状态
          hasAnyImprovement: (newInfo.predicted_repair_time_hour < oldInfo.predicted_repair_time_hour) ||
                            (newInfo.predicted_next_failure_time_hour > oldInfo.predicted_next_failure_time_hour) ||
                            (newInfo.match_score > oldInfo.match_score) ||
                            (oldInfo.assigned_person !== newInfo.assigned_person)
        }
      }).filter(record => record.hasAnyImprovement) // 只保留有改进的记录

      return {
        success: true,
        data: {
          effectStats,
          systemModuleEffects,
          maintenanceTypeEffects,
          personnelChanges: personnelChanges.slice(0, 20), // 只返回前20个变更记录
          teamChanges: teamChanges.slice(0, 20),
          detailedRecords: detailedRecords, // 新增详细记录数据
          summary: {
            重构效果: effectStats.人员重新分配率 > 50 ? '显著' : effectStats.人员重新分配率 > 20 ? '良好' : '一般',
            主要改进: [
              effectStats.匹配度提升率 > 0 ? `${effectStats.匹配度提升率}%的记录匹配度提升` : null,
              effectStats.维修时间缩短率 > 0 ? `${effectStats.维修时间缩短率}%的记录维修时间缩短` : null,
              effectStats.故障间隔延长率 > 0 ? `${effectStats.故障间隔延长率}%的记录故障间隔延长` : null
            ].filter(Boolean),
            总体节省时间: `${effectStats.总维修时间节省小时}小时`,
            建议: effectStats.人员重新分配率 < 30 ? '建议进一步优化人员分配策略' : '重构效果良好，可继续推广'
          }
        }
      }
    } catch (error) {
      console.error('重构效果分析错误:', error)
      return {
        success: false,
        error: '重构效果分析失败：' + error.message
      }
    }
  },

  /**
   * 获取重构效果分析（组合接口）
   * @param {Object} params - 查询参数
   * @returns {Promise} 重构效果分析数据
   */
  async getRefactorAnalysis(params) {
    try {
      // 获取原始数据
      const response = await this.queryMaintenanceRecords(params)
      
      if (!response.success) {
        return response
      }

      // 分析重构效果
      const analysisResult = this.analyzeRefactorEffects(response.data)
      
      return analysisResult
    } catch (error) {
      console.error('获取重构分析失败:', error)
      return {
        success: false,
        error: error.message || '获取重构分析失败'
      }
    }
  }
}

// 默认导出
export default operationRefactorApi
