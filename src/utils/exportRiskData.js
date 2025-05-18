import { riskFactors, businessActivities } from '@/data/riskFactors'

/**
 * Get risk factor name by ID
 * @param {string} riskId - The risk factor ID
 * @returns {string} The risk factor name
 */
const getRiskName = (riskId) => {
  const risk = riskFactors.find(rf => rf.id === riskId)
  return risk ? risk.name : riskId
}

/**
 * Get related business activity names by risk factor
 * @param {Array} activityIds - Array of business activity IDs
 * @returns {string} Comma-separated list of business activity names
 */
const getBusinessActivityNames = (activityIds) => {
  if (!activityIds || activityIds.length === 0) return '无'
  
  return activityIds.map(id => {
    const activity = businessActivities.find(ba => ba.id === id)
    return activity ? activity.name : id
  }).join(', ')
}

/**
 * Convert trend indicator to text
 * @param {string} trend - The trend indicator ('up' or 'down')
 * @returns {string} Localized trend text
 */
const getTrendText = (trend) => {
  switch(trend) {
    case 'up': return '上升'
    case 'down': return '下降'
    default: return '稳定'
  }
}

/**
 * Convert alert status to text
 * @param {string} status - The alert status ('red', 'yellow', or 'normal')
 * @returns {string} Localized alert status text
 */
const getAlertStatusText = (status) => {
  switch(status) {
    case 'red': return '高风险'
    case 'yellow': return '中风险'
    case 'normal': return '正常'
    default: return '未知'
  }
}

/**
 * Export risk monitoring data to CSV
 * @param {Array} riskData - Array of risk monitoring data objects
 * @returns {string} CSV content
 */
export const exportRiskDataToCsv = (riskData) => {
  // Define CSV header
  const header = '风险编号,风险名称,风险类别,相关业务活动,置信度,CVaR值,趋势,警告状态,最后更新时间\n'
  
  // Transform data
  const rows = riskData.map(risk => {
    const riskInfo = riskFactors.find(rf => rf.id === risk.riskFactorId)
    const category = riskInfo ? riskInfo.category : ''
    const name = getRiskName(risk.riskFactorId)
    const activities = getBusinessActivityNames(risk.relatedBusinessActivities)
    const confidenceLevel = (risk.confidenceLevel * 100).toFixed(0) + '%'
    const cvarValue = risk.cvarValue.toFixed(2)
    const trend = getTrendText(risk.trend)
    const alertStatus = getAlertStatusText(risk.alertStatus)
    const timestamp = new Date(risk.timestamp).toLocaleString('zh-CN')
    
    // Escape any commas in text fields
    const escapeComma = (text) => `"${text.replace(/"/g, '""')}"`
    
    return [
      risk.riskFactorId,
      escapeComma(name),
      escapeComma(category),
      escapeComma(activities),
      confidenceLevel,
      cvarValue,
      trend,
      alertStatus,
      timestamp
    ].join(',')
  }).join('\n')
  
  return header + rows
}

/**
 * Export risk data to CSV file and download
 * @param {Array} riskData - Array of risk monitoring data objects
 * @param {string} filename - The filename for the downloaded file
 */
export const downloadRiskDataCsv = (riskData, filename = 'risk_data.csv') => {
  const csvContent = exportRiskDataToCsv(riskData)
  
  // Add BOM for correct Chinese character display in Excel
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  
  // Create download link
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Generate risk assessment report in CSV format
 * @param {Object} reportData - Risk report data with distribution and top risks
 * @returns {string} CSV content for the report
 */
export const exportRiskReportToCsv = (reportData) => {
  const timestamp = new Date(reportData.timestamp).toLocaleString('zh-CN')
  
  let csvContent = '风险评估报告,' + timestamp + '\n\n'
  
  // Risk distribution
  csvContent += '风险分布统计\n'
  csvContent += '高风险,' + reportData.riskDistribution.red + '\n'
  csvContent += '中风险,' + reportData.riskDistribution.yellow + '\n'
  csvContent += '正常,' + reportData.riskDistribution.normal + '\n\n'
  
  // Top risks
  csvContent += '高关注风险\n'
  csvContent += '风险编号,风险名称,相关业务活动,置信度,趋势\n'
  
  reportData.topRisks.forEach(risk => {
    const confidenceLevel = (risk.confidenceLevel * 100).toFixed(0) + '%'
    const trend = getTrendText(risk.trend)
    
    csvContent += [
      risk.id,
      `"${risk.name}"`,
      `"${risk.businessActivity || '无'}"`,
      confidenceLevel,
      trend
    ].join(',') + '\n'
  })
  
  csvContent += '\n业务流程风险分布\n'
  csvContent += '业务流程,高风险,中风险,正常\n'
  
  // Risk by process
  Object.entries(reportData.riskByProcess).forEach(([process, distribution]) => {
    csvContent += [
      `"${process}"`,
      distribution.red || 0,
      distribution.yellow || 0,
      distribution.normal || 0
    ].join(',') + '\n'
  })
  
  return csvContent
}

/**
 * Download risk assessment report as CSV
 * @param {Object} reportData - Risk report data
 * @param {string} filename - The filename for the downloaded file
 */
export const downloadRiskReportCsv = (reportData, filename = 'risk_report.csv') => {
  const csvContent = exportRiskReportToCsv(reportData)
  
  // Add BOM for correct Chinese character display in Excel
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  
  // Create download link
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
} 