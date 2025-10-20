import axios from 'axios'

// API基础配置 - 专用于营销重构API，使用webpack代理
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
    console.log('🚀 营销重构API请求:', config.method && config.method.toUpperCase(), config.url, config.data)
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
    console.log('✅ 营销重构API响应:', response.status, response.data)
    return response
  },
  error => {
    console.error('❌ 响应错误:', (error.response && error.response.data) || error.message)
    return Promise.reject(error)
  }
)

/**
 * 营销重构相关API
 */
export const marketingRefactorApi = {
  
  /**
   * 查询销售分配对比数据
   * @param {Object} params - 查询参数
   * @param {number} params.start_id - 起始ID
   * @param {number} params.end_id - 结束ID
   * @returns {Promise} API响应数据
   * @example
   * const result = await marketingRefactorApi.querySalesAssignmentComparison({
   *   start_id: 11,
   *   end_id: 20
   * })
   */
  async querySalesAssignmentComparison(params) {
    try {
      // 参数验证
      if (!params || params.start_id === undefined || params.end_id === undefined) {
        throw new Error('缺少必需参数: start_id 和 end_id')
      }

      // ID范围验证
      if (!Number.isInteger(params.start_id) || !Number.isInteger(params.end_id)) {
        throw new Error('start_id 和 end_id 必须是整数')
      }

      if (params.start_id < 0 || params.end_id < 0) {
        throw new Error('start_id 和 end_id 必须大于等于0')
      }

      if (params.start_id > params.end_id) {
        throw new Error('start_id 不能大于 end_id')
      }

      const response = await api.post('/api/marketing/sales-assignment-comparison', {
        start_id: params.start_id,
        end_id: params.end_id
      })

      return {
        success: true,
        data: response.data,
        status: response.status
      }
    } catch (error) {
      console.error('查询销售分配对比数据失败:', error)
      
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
          error: '网络连接失败，请检查网络状态或确认后端服务是否启动',
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
   * 解析销售分配对比数据
   * @param {Object} rawData - API返回的原始数据
   * @returns {Object} 解析后的数据
   */
  parseSalesAssignmentData(rawData) {
    try {
      if (!rawData || !rawData.success) {
        return {
          success: false,
          error: '数据解析失败：无效的数据格式'
        }
      }

      const { data, message, total_count } = rawData

      // 统计数据
      const statistics = {
        totalComparisons: total_count || (data ? data.length : 0),
        assignmentChanges: 0,
        performanceImprovements: 0,
        matchScoreImprovements: 0,
        conversionImprovements: 0,
        costReductions: 0,
        
        // 计算额外统计信息
        idRange: {
          startId: null,
          endId: null,
          totalRange: 0
        },
        
        // 平均改进指标
        averageMatchScoreImprovement: 0,
        averageConversionImprovement: 0,
        averageCostReduction: 0,
        
        // 总改进指标
        totalMatchScoreImprovement: 0,
        totalConversionImprovement: 0,
        totalCostReduction: 0
      }

      // 处理对比数据
      const comparisonData = data ? data.map(item => ({
        // 基本信息
        customerId: item.customer_id,
        customerName: item.customer_name,
        assignmentChanged: item.assignment_changed,
        matchScoreChange: item.match_score_change,
        
        // 原始分配（历史销售数据）
        originalAssignment: {
          ownerName: item.history_sales_0306 && item.history_sales_0306.owner_name,
          assignmentCost: item.history_sales_0306 && item.history_sales_0306.assignment_cost,
          conversionProb: item.history_sales_0306 && item.history_sales_0306.conversion_prob,
          salesCustomerMatch: item.history_sales_0306 && item.history_sales_0306.sales_customer_match
        },
        
        // 优化后分配（新计划）
        optimizedAssignment: {
          ownerName: item.plan_0406 && item.plan_0406.owner_name,
          assignmentCost: item.plan_0406 && item.plan_0406.assignment_cost,
          conversionProb: item.plan_0406 && item.plan_0406.conversion_prob,
          salesCustomerMatch: item.plan_0406 && item.plan_0406.sales_customer_match
        },
        
        // 对比分析
        comparison: {
          ownerChanged: item.assignment_changed,
          matchScoreChange: item.match_score_change || 0,
          costChange: (item.history_sales_0306 && item.plan_0406) ?
                     (item.history_sales_0306.assignment_cost - item.plan_0406.assignment_cost) : 0,
          conversionChange: (item.history_sales_0306 && item.plan_0406) ?
                          (item.plan_0406.conversion_prob - item.history_sales_0306.conversion_prob) : 0
        },
        
        // 改进指标
        improvements: {
          hasMatchImprovement: (item.match_score_change || 0) > 0,
          hasCostReduction: (item.history_sales_0306 && item.plan_0406) &&
                           (item.plan_0406.assignment_cost < item.history_sales_0306.assignment_cost),
          hasConversionImprovement: (item.history_sales_0306 && item.plan_0406) &&
                                   (item.plan_0406.conversion_prob > item.history_sales_0306.conversion_prob),
          overallImprovement: 0 // 将在下面计算
        }
      })) : []

      // 计算统计数据
      if (comparisonData.length > 0) {
        let totalMatchScoreGain = 0
        let totalConversionGain = 0
        let totalCostSaved = 0
        let assignmentChanges = 0
        let performanceImprovements = 0
        let matchScoreImprovements = 0
        let conversionImprovements = 0
        let costReductions = 0

        // 计算ID范围
        const customerIds = comparisonData.map(item => item.customerId).filter(id => id !== null)
        if (customerIds.length > 0) {
          statistics.idRange.startId = Math.min(...customerIds)
          statistics.idRange.endId = Math.max(...customerIds)
          statistics.idRange.totalRange = statistics.idRange.endId - statistics.idRange.startId + 1
        }

        comparisonData.forEach(item => {
          // 计算综合改进分数
          let improvementScore = 0
          
          if (item.improvements.hasMatchImprovement) {
            matchScoreImprovements++
            totalMatchScoreGain += item.comparison.matchScoreChange
            improvementScore += 30
          }
          
          if (item.improvements.hasConversionImprovement) {
            conversionImprovements++
            totalConversionGain += item.comparison.conversionChange
            improvementScore += 40
          }
          
          if (item.improvements.hasCostReduction) {
            costReductions++
            totalCostSaved += item.comparison.costChange
            improvementScore += 30
          }
          
          item.improvements.overallImprovement = improvementScore

          if (item.assignmentChanged) {
            assignmentChanges++
          }
          if (improvementScore > 0) {
            performanceImprovements++
          }
        })

        // 更新统计数据
        statistics.assignmentChanges = assignmentChanges
        statistics.performanceImprovements = performanceImprovements
        statistics.matchScoreImprovements = matchScoreImprovements
        statistics.conversionImprovements = conversionImprovements
        statistics.costReductions = costReductions
        
        // 计算平均改进
        statistics.averageMatchScoreImprovement = matchScoreImprovements > 0 ? 
          Math.round((totalMatchScoreGain / matchScoreImprovements) * 1000) / 1000 : 0
        statistics.averageConversionImprovement = conversionImprovements > 0 ?
          Math.round((totalConversionGain / conversionImprovements) * 1000) / 1000 : 0
        statistics.averageCostReduction = costReductions > 0 ?
          Math.round((totalCostSaved / costReductions) * 100) / 100 : 0
        
        // 总改进指标
        statistics.totalMatchScoreImprovement = Math.round(totalMatchScoreGain * 1000) / 1000
        statistics.totalConversionImprovement = Math.round(totalConversionGain * 1000) / 1000
        statistics.totalCostReduction = Math.round(totalCostSaved * 100) / 100
      }

      return {
        success: true,
        data: {
          statistics,
          comparisonData,
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
   * 获取并解析销售分配对比数据（组合接口）
   * @param {Object} params - 查询参数
   * @returns {Promise} 解析后的数据
   */
  async getSalesAssignmentComparison(params) {
    try {
      // 获取原始数据
      const response = await this.querySalesAssignmentComparison(params)
      
      if (!response.success) {
        return response
      }

      // 解析数据
      const parsedData = this.parseSalesAssignmentData(response.data)
      
      return parsedData
    } catch (error) {
      console.error('获取销售分配对比数据失败:', error)
      return {
        success: false,
        error: error.message || '获取销售分配对比数据失败'
      }
    }
  },

  /**
   * 获取统计摘要
   * @param {number} startId - 起始ID
   * @param {number} endId - 结束ID
   * @returns {Promise} 统计摘要数据
   */
  async getStatisticsSummary(startId, endId) {
    try {
      const result = await this.getSalesAssignmentComparison({
        start_id: startId,
        end_id: endId
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

      const comparisonData = rawData.data.comparisonData || []
      const totalRecords = comparisonData.length

      let assignmentOptimizations = 0  // 分配优化的记录数
      let matchScoreImprovements = 0   // 匹配度提升的记录数
      let revenueImprovements = 0      // 收入提升的记录数
      let conversionImprovements = 0   // 转化率提升的记录数

      let totalMatchScoreGain = 0      // 总匹配度提升
      let totalRevenueGain = 0         // 总收入提升
      let totalConversionGain = 0      // 总转化率提升

      const salesPersonChanges = []    // 销售人员变更记录
      const teamChanges = []           // 团队变更记录
      const topImprovements = []       // 最佳改进记录
      
      comparisonData.forEach(record => {
        const original = record.originalAssignment
        const optimized = record.optimizedAssignment
        const comparison = record.comparison

        if (!original || !optimized) return

        // 分析匹配度变化
        if (comparison.matchScoreChange > 0) {
          matchScoreImprovements++
          totalMatchScoreGain += comparison.matchScoreChange
        }

        // 分析成本变化
        if (comparison.costChange > 0) {
          revenueImprovements++
          totalRevenueGain += comparison.costChange
        }

        // 分析转化率变化
        if (comparison.conversionChange > 0) {
          conversionImprovements++
          totalConversionGain += comparison.conversionChange
        }

        // 分析人员变更
        if (comparison.ownerChanged) {
          assignmentOptimizations++
          salesPersonChanges.push({
            customerId: record.customerId,
            customerName: record.customerName,
            oldOwner: original.ownerName,
            newOwner: optimized.ownerName,
            matchScoreChange: comparison.matchScoreChange,
            costChange: comparison.costChange,
            conversionChange: comparison.conversionChange,
            assignmentChanged: record.assignmentChanged
          })
        }

        // 收集最佳改进记录
        if (record.improvements.overallImprovement > 50) {
          topImprovements.push({
            customerId: record.customerId,
            customerName: record.customerName,
            improvementScore: record.improvements.overallImprovement,
            matchImprovement: comparison.matchScoreChange,
            costReduction: comparison.costChange,
            conversionImprovement: comparison.conversionChange,
            assignmentChanged: record.assignmentChanged
          })
        }
      })

      // 计算效果统计
      const effectStats = {
        总记录数: totalRecords,
        分配优化记录数: assignmentOptimizations,
        匹配度提升记录数: matchScoreImprovements,
        成本节约记录数: revenueImprovements,
        转化率提升记录数: conversionImprovements,
        
        分配优化率: totalRecords > 0 ? Math.round((assignmentOptimizations / totalRecords) * 100 * 100) / 100 : 0,
        匹配度提升率: totalRecords > 0 ? Math.round((matchScoreImprovements / totalRecords) * 100 * 100) / 100 : 0,
        成本节约率: totalRecords > 0 ? Math.round((revenueImprovements / totalRecords) * 100 * 100) / 100 : 0,
        转化率提升率: totalRecords > 0 ? Math.round((conversionImprovements / totalRecords) * 100 * 100) / 100 : 0,
        
        平均匹配度提升: matchScoreImprovements > 0 ? Math.round((totalMatchScoreGain / matchScoreImprovements) * 1000) / 1000 : 0,
        平均成本节约: revenueImprovements > 0 ? Math.round((totalRevenueGain / revenueImprovements) * 100) / 100 : 0,
        平均转化率提升: conversionImprovements > 0 ? Math.round((totalConversionGain / conversionImprovements) * 1000) / 1000 : 0,
        
        总匹配度提升: Math.round(totalMatchScoreGain * 1000) / 1000,
        总成本节约: Math.round(totalRevenueGain * 100) / 100,
        总转化率提升: Math.round(totalConversionGain * 1000) / 1000,
        
        最佳改进记录数: topImprovements.length
      }

      // 按销售人员分析效果
      const ownerEffects = {}
      comparisonData.forEach(record => {
        const newOwner = record.optimizedAssignment.ownerName
        if (!ownerEffects[newOwner]) {
          ownerEffects[newOwner] = {
            totalAssigned: 0,
            fromOtherOwner: 0,
            averageMatchScore: 0,
            averageConversionProb: 0,
            totalMatchScore: 0,
            totalConversionProb: 0,
            totalCostReduction: 0
          }
        }

        const ownerStats = ownerEffects[newOwner]
        ownerStats.totalAssigned++
        ownerStats.totalMatchScore += record.optimizedAssignment.salesCustomerMatch || 0
        ownerStats.totalConversionProb += record.optimizedAssignment.conversionProb || 0

        if (record.comparison.ownerChanged) {
          ownerStats.fromOtherOwner++
        }

        if (record.comparison.costChange > 0) {
          ownerStats.totalCostReduction += record.comparison.costChange
        }
      })

      // 计算平均值
      Object.keys(ownerEffects).forEach(owner => {
        const stats = ownerEffects[owner]
        stats.averageMatchScore = stats.totalAssigned > 0 ? 
          Math.round((stats.totalMatchScore / stats.totalAssigned) * 1000) / 1000 : 0
        stats.averageConversionProb = stats.totalAssigned > 0 ?
          Math.round((stats.totalConversionProb / stats.totalAssigned) * 1000) / 1000 : 0
      })

      return {
        success: true,
        data: {
          effectStats,
          ownerEffects,
          salesPersonChanges: salesPersonChanges.slice(0, 20), // 只返回前20个变更记录
          topImprovements: topImprovements.sort((a, b) => b.improvementScore - a.improvementScore).slice(0, 10),
          summary: {
            重构效果: effectStats.分配优化率 > 50 ? '显著' : effectStats.分配优化率 > 20 ? '良好' : '一般',
            主要改进: [
              effectStats.匹配度提升率 > 0 ? `${effectStats.匹配度提升率}%的记录匹配度提升` : null,
              effectStats.成本节约率 > 0 ? `${effectStats.成本节约率}%的记录成本节约` : null,
              effectStats.转化率提升率 > 0 ? `${effectStats.转化率提升率}%的记录转化率提升` : null
            ].filter(Boolean),
            总体成本节约: `${effectStats.总成本节约}`,
            总体匹配度提升: `${effectStats.总匹配度提升}`,
            建议: effectStats.分配优化率 < 30 ? '建议进一步优化分配策略' : '重构效果良好，可继续推广'
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
      const response = await this.querySalesAssignmentComparison(params)
      
      if (!response.success) {
        return response
      }

      // 解析数据
      const parsedData = this.parseSalesAssignmentData(response.data)
      
      if (!parsedData.success) {
        return parsedData
      }

      // 分析重构效果
      const analysisResult = this.analyzeRefactorEffects(parsedData)
      
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
export default marketingRefactorApi
