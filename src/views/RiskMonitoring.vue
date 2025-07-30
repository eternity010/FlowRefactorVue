<template>
  <div class="risk-monitoring">
    <div class="page-header">
      <div class="title-section">
        <h1><i class="el-icon-warning"></i> 风险监控平台</h1>
        <div class="subtitle">企业运营全业务流程风险监测与预警系统</div>
      </div>
      <div class="action-section">
        <el-button-group>
          <el-button type="primary" icon="el-icon-refresh" size="small" @click="refreshData">刷新数据</el-button>
          <el-button type="success" icon="el-icon-download" size="small" @click="exportRiskData">导出风险数据</el-button>
          <el-button type="info" icon="el-icon-document" size="small" @click="exportRiskReport">导出报告</el-button>
        </el-button-group>
      </div>
    </div>
    
    <div class="risk-dashboard">
      <div class="filter-section">
        <el-card shadow="hover" class="filter-card">
          <div slot="header">
            <span><i class="el-icon-search"></i> 风险筛选</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-select v-model="selectedProcess" placeholder="选择业务流程" clearable @change="filterRisks" class="full-width">
                <el-option
                  v-for="item in processOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="selectedCategory" placeholder="选择风险类别" clearable @change="filterRisks" class="full-width">
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="selectedAlertStatus" placeholder="选择警告级别" clearable @change="filterRisks" class="full-width">
                <el-option
                  v-for="item in alertStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-date-picker
                v-model="selectedDate"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                class="full-width"
                @change="filterRisks">
              </el-date-picker>
            </el-col>
          </el-row>
        </el-card>
      </div>

      <div class="risk-summary">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card shadow="hover" class="risk-card high-risk">
              <div class="risk-card-content">
                <div class="risk-icon">
                  <i class="el-icon-warning"></i>
                </div>
                <div class="risk-info">
                  <h3>高风险</h3>
                  <div class="risk-count">{{ reportData.riskDistribution.red }}</div>
                  <div class="risk-change" v-if="riskTrends.red > 0">
                    <i class="el-icon-top"></i> 较昨日增加 {{riskTrends.red}}
                  </div>
                  <div class="risk-change down" v-else-if="riskTrends.red < 0">
                    <i class="el-icon-bottom"></i> 较昨日减少 {{-riskTrends.red}}
                  </div>
                  <div class="risk-change stable" v-else>
                    <i class="el-icon-minus"></i> 与昨日持平
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="risk-card medium-risk">
              <div class="risk-card-content">
                <div class="risk-icon">
                  <i class="el-icon-bell"></i>
                </div>
                <div class="risk-info">
                  <h3>中风险</h3>
                  <div class="risk-count">{{ reportData.riskDistribution.yellow }}</div>
                  <div class="risk-change" v-if="riskTrends.yellow > 0">
                    <i class="el-icon-top"></i> 较昨日增加 {{riskTrends.yellow}}
                  </div>
                  <div class="risk-change down" v-else-if="riskTrends.yellow < 0">
                    <i class="el-icon-bottom"></i> 较昨日减少 {{-riskTrends.yellow}}
                  </div>
                  <div class="risk-change stable" v-else>
                    <i class="el-icon-minus"></i> 与昨日持平
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="risk-card normal-risk">
              <div class="risk-card-content">
                <div class="risk-icon">
                  <i class="el-icon-check"></i>
                </div>
                <div class="risk-info">
                  <h3>正常</h3>
                  <div class="risk-count">{{ reportData.riskDistribution.normal }}</div>
                  <div class="risk-change" v-if="riskTrends.normal > 0">
                    <i class="el-icon-top"></i> 较昨日增加 {{riskTrends.normal}}
                  </div>
                  <div class="risk-change down" v-else-if="riskTrends.normal < 0">
                    <i class="el-icon-bottom"></i> 较昨日减少 {{-riskTrends.normal}}
                  </div>
                  <div class="risk-change stable" v-else>
                    <i class="el-icon-minus"></i> 与昨日持平
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="risk-card overall-risk">
              <div class="risk-card-content">
                <div class="risk-icon">
                  <i class="el-icon-data-analysis"></i>
                </div>
                <div class="risk-info">
                  <h3>总体风险</h3>
                  <div class="risk-level">{{ reportData.overallRiskLevel }}</div>
                  <div class="last-update">
                    <i class="el-icon-time"></i> 最后更新: {{ lastUpdateTime }}
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- Top Risks Section -->
      <div class="top-risks-section">
        <h2>高关注风险</h2>
        <el-table :data="reportData.topRisks" style="width: 100%">
          <el-table-column prop="id" label="风险编号" width="100"></el-table-column>
          <el-table-column prop="name" label="风险名称" width="180"></el-table-column>
          <el-table-column prop="businessActivity" label="相关业务活动" width="180"></el-table-column>
          <el-table-column prop="confidenceLevel" label="置信度" width="100">
            <template slot-scope="scope">
              {{ (scope.row.confidenceLevel * 100).toFixed(0) }}%
            </template>
          </el-table-column>
          <el-table-column prop="trend" label="趋势" width="100">
            <template slot-scope="scope">
              <i class="el-icon-top" v-if="scope.row.trend === 'up'" style="color: #F56C6C;"></i>
              <i class="el-icon-bottom" v-if="scope.row.trend === 'down'" style="color: #67C23A;"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Risk List -->
      <div class="risk-list-section">
        <el-card shadow="hover" class="section-card">
          <div slot="header" class="section-header">
            <div class="section-title">
              <i class="el-icon-document-checked"></i> 风险监测列表
            </div>
            <div class="section-actions">
              <el-input
                placeholder="搜索风险"
                prefix-icon="el-icon-search"
                v-model="searchQuery"
                size="small"
                clearable
                @input="filterRisks"
                style="width: 250px;">
              </el-input>
            </div>
          </div>
          <el-table
            :data="filteredRisks"
            style="width: 100%"
            :row-class-name="tableRowClassName"
            border
            stripe
            highlight-current-row>
            <el-table-column prop="riskFactorId" label="风险编号" width="100" sortable>
              <template slot-scope="scope">
                <el-tag 
                  :type="getRiskTagType(scope.row.alertStatus)" 
                  size="medium" 
                  effect="plain">
                  {{ scope.row.riskFactorId }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="风险名称" width="180" sortable>
              <template slot-scope="scope">
                {{ getRiskName(scope.row.riskFactorId) }}
              </template>
            </el-table-column>
            <el-table-column label="风险类别" width="120" sortable>
              <template slot-scope="scope">
                <el-tag size="small" effect="dark">{{ getRiskCategory(scope.row.riskFactorId) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="相关业务活动" width="180">
              <template slot-scope="scope">
                <div v-for="activityId in scope.row.relatedBusinessActivities" :key="activityId" class="activity-tag">
                  <el-tag size="small" type="info" effect="plain">{{ getBusinessActivityName(activityId) }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="confidenceLevel" label="置信度" width="120" sortable>
              <template slot-scope="scope">
                <el-progress 
                  :percentage="scope.row.confidenceLevel * 100" 
                  :color="getConfidenceLevelColor(scope.row.confidenceLevel)"
                  :stroke-width="16"
                  :show-text="true">
                </el-progress>
              </template>
            </el-table-column>
            <el-table-column prop="cvarValue" label="CVaR值" width="100" sortable>
              <template slot-scope="scope">
                <span :style="{ color: getCVaRColor(scope.row.cvarValue) }">
                  {{ scope.row.cvarValue.toFixed(2) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="trend" label="趋势" width="80">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.trend === 'up'" type="danger" size="small">
                  <i class="el-icon-top"></i> 上升
                </el-tag>
                <el-tag v-else-if="scope.row.trend === 'down'" type="success" size="small">
                  <i class="el-icon-bottom"></i> 下降
                </el-tag>
                <el-tag v-else type="info" size="small">
                  <i class="el-icon-minus"></i> 稳定
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="alertStatus" label="警告状态" width="100">
              <template slot-scope="scope">
                <el-tag :type="getAlertType(scope.row.alertStatus)">
                  {{ getAlertLabel(scope.row.alertStatus) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button 
                    @click="showRiskDetail(scope.row)" 
                    type="primary" 
                    icon="el-icon-view"
                    size="mini">详情</el-button>
                  <el-button 
                    @click="showThresholdSetting(scope.row)" 
                    type="warning" 
                    icon="el-icon-setting"
                    size="mini">阈值</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="filteredRisks.length">
            </el-pagination>
          </div>
        </el-card>
      </div>

      <!-- CVaR Chart -->
      <div class="chart-section">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-card shadow="hover" class="section-card">
              <div slot="header" class="section-header">
                <div class="section-title">
                  <i class="el-icon-data-line"></i> 业务活动风险分析
                </div>
                <div class="section-actions">
                  <el-radio-group v-model="chartView" size="small">
                    <el-radio-button label="cvar">CVaR分析</el-radio-button>
                    <el-radio-button label="trend">趋势分析</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
              <div class="chart-container" style="height: 400px">
                <div id="cvarChart" style="width: 100%; height: 100%"></div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="section-card">
              <div slot="header" class="section-header">
                <div class="section-title">
                  <i class="el-icon-pie-chart"></i> 风险分布
                </div>
              </div>
              <div class="chart-container" style="height: 400px">
                <div id="distributionChart" style="width: 100%; height: 100%"></div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 风险热力图分析 -->
      <div class="heatmap-section">
        <el-card shadow="hover" class="section-card">
          <div slot="header" class="section-header">
            <div class="section-title">
              <i class="el-icon-data-analysis"></i> 采购流程风险热力图分析
            </div>
            <div class="section-actions">
              <el-select v-model="heatmapView" size="small" style="width: 120px" @change="renderHeatmap">
                <el-option label="风险值" value="cvar"></el-option>
                <el-option label="风险等级" value="level"></el-option>
              </el-select>
              <el-button 
                type="primary" 
                size="small" 
                icon="el-icon-refresh" 
                @click="refreshHeatmap"
                :loading="riskDataLoading"
                style="margin-left: 10px;">
                刷新
              </el-button>
            </div>
          </div>
          
          <!-- 加载状态 -->
          <div v-if="riskDataLoading" class="loading-container">
            <el-loading-component></el-loading-component>
            <p>正在加载风险数据...</p>
          </div>
          
          <!-- 错误状态 -->
          <div v-else-if="riskDataError" class="error-container">
            <i class="el-icon-warning" style="color: #F56C6C; font-size: 48px;"></i>
            <h3>数据加载失败</h3>
            <p>{{ riskDataError }}</p>
            <el-button type="primary" @click="loadRiskData">重试</el-button>
          </div>
          
          <!-- 数据为空状态 -->
          <div v-else-if="!riskData || riskData.length === 0" class="empty-container">
            <i class="el-icon-data-analysis" style="color: #909399; font-size: 48px;"></i>
            <h3>暂无风险数据</h3>
            <p>请检查数据库连接或数据导入状态</p>
          </div>
          
          <!-- 热力图内容 -->
          <div v-else-if="canRenderHeatmap" class="heatmap-container" style="height: 500px">
            <div id="riskHeatmap" style="width: 100%; height: 100%"></div>
          </div>
          
          <div v-if="canRenderHeatmap" class="heatmap-legend">
            <div class="legend-title">风险等级说明：</div>
            <div class="legend-items">
              <div class="legend-item">
                <div class="legend-color high-risk"></div>
                <span>高风险 (>150)</span>
              </div>
              <div class="legend-item">
                <div class="legend-color medium-risk"></div>
                <span>中风险 (80-150)</span>
              </div>
              <div class="legend-item">
                <div class="legend-color low-risk"></div>
                <span>低风险 (50-80)</span>
              </div>
              <div class="legend-item">
                <div class="legend-color safe-risk"></div>
                <span>安全 (<50)</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- Risk Detail Dialog -->
    <el-dialog
      title="风险详情"
      :visible.sync="riskDetailVisible"
      width="80%"
      top="5vh"
      class="risk-detail-dialog">
      <div v-if="selectedRisk" class="risk-detail-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card class="detail-overview-card" :body-style="{ padding: '20px' }" shadow="never">
              <div slot="header" class="detail-card-header">
                <span>基本信息</span>
              </div>
              <h2 class="risk-title">
                <el-tag :type="getAlertType(selectedRisk.alertStatus)" effect="dark" size="medium">
                  {{ selectedRisk.riskFactorId }}
                </el-tag>
                {{ getRiskName(selectedRisk.riskFactorId) }}
              </h2>
              <div class="detail-info-item">
                <span class="detail-label">风险类别:</span>
                <el-tag size="small" effect="plain">{{ getRiskCategory(selectedRisk.riskFactorId) }}</el-tag>
              </div>
              <div class="detail-info-item">
                <span class="detail-label">当前置信度:</span>
                <el-progress 
                  :percentage="selectedRisk.confidenceLevel * 100" 
                  :color="getConfidenceLevelColor(selectedRisk.confidenceLevel)"
                  :stroke-width="12">
                </el-progress>
              </div>
              <div class="detail-info-item">
                <span class="detail-label">CVaR值:</span>
                <span :style="{ color: getCVaRColor(selectedRisk.cvarValue), fontWeight: 'bold' }">
                  {{ selectedRisk.cvarValue.toFixed(2) }}
                </span>
              </div>
              <div class="detail-info-item">
                <span class="detail-label">警告状态:</span>
                <el-tag :type="getAlertType(selectedRisk.alertStatus)">
                  {{ getAlertLabel(selectedRisk.alertStatus) }}
                </el-tag>
              </div>
              <div class="detail-info-item">
                <span class="detail-label">阈值设置:</span>
                <div class="threshold-display">
                  <div class="threshold-item">
                    <span class="threshold-label">警告:</span>
                    <el-tag type="warning" size="small">{{ (selectedRisk.threshold.warning * 100).toFixed(0) }}%</el-tag>
                  </div>
                  <div class="threshold-item">
                    <span class="threshold-label">告警:</span>
                    <el-tag type="danger" size="small">{{ (selectedRisk.threshold.alert * 100).toFixed(0) }}%</el-tag>
                  </div>
                </div>
              </div>
            </el-card>
            <el-card class="detail-activity-card" :body-style="{ padding: '20px' }" shadow="never">
              <div slot="header" class="detail-card-header">
                <span>相关业务活动</span>
              </div>
              <div v-if="selectedRisk.relatedBusinessActivities.length === 0" class="no-data-text">
                无关联业务活动
              </div>
              <el-timeline v-else>
                <el-timeline-item
                  v-for="activityId in selectedRisk.relatedBusinessActivities"
                  :key="activityId"
                  :color="getActivityColor(activityId)">
                  <div class="timeline-activity">
                    <div class="activity-name">{{ getBusinessActivityName(activityId) }}</div>
                    <div class="activity-process">
                      <el-tag size="mini" effect="plain">{{ getBusinessActivityProcess(activityId) }}</el-tag>
                    </div>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card class="detail-chart-card" shadow="never">
              <div slot="header" class="detail-card-header">
                <span>风险置信度历史趋势</span>
              </div>
              <div class="history-chart-container" style="height: 280px">
                <div id="historyChart" style="width: 100%; height: 100%"></div>
              </div>
            </el-card>
            <el-card class="detail-network-card" shadow="never">
              <div slot="header" class="detail-card-header">
                <span>风险网络关联</span>
              </div>
              <div class="network-chart-container" style="height: 280px">
                <div id="networkChart" style="width: 100%; height: 100%"></div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div class="risk-detail-actions">
          <el-button @click="exportRiskDetail" type="primary" icon="el-icon-download">导出详情</el-button>
          <el-button @click="showThresholdSetting(selectedRisk)" type="warning" icon="el-icon-setting">设置阈值</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- Threshold Setting Dialog -->
    <el-dialog
      title="风险阈值设置"
      :visible.sync="thresholdSettingVisible"
      width="50%"
      class="threshold-setting-dialog">
      <div v-if="selectedRisk" class="threshold-setting-content">
        <div class="threshold-risk-info">
          <h3>
            <el-tag :type="getAlertType(selectedRisk.alertStatus)" effect="dark" size="medium">
              {{ selectedRisk.riskFactorId }}
            </el-tag>
            {{ getRiskName(selectedRisk.riskFactorId) }}
          </h3>
          <p class="current-confidence">
            当前置信度: 
            <span :class="getConfidenceLevelClass(selectedRisk.confidenceLevel)">
              {{ (selectedRisk.confidenceLevel * 100).toFixed(0) }}%
            </span>
          </p>
        </div>
        
        <el-form :model="thresholdForm" label-width="120px" class="threshold-form">
          <el-form-item label="警告阈值 (%)">
            <el-slider
              v-model="thresholdForm.warning"
              :min="0"
              :max="100"
              :step="5"
              :marks="{0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%'}"
              :format-tooltip="formatTooltip"
              show-stops>
            </el-slider>
            <div class="threshold-value warning">{{ thresholdForm.warning }}%</div>
          </el-form-item>
          <el-form-item label="告警阈值 (%)">
            <el-slider
              v-model="thresholdForm.alert"
              :min="0"
              :max="100"
              :step="5"
              :marks="{0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%'}"
              :format-tooltip="formatTooltip"
              show-stops>
            </el-slider>
            <div class="threshold-value alert">{{ thresholdForm.alert }}%</div>
          </el-form-item>
        </el-form>
        
        <div class="threshold-preview">
          <p class="preview-title">阈值调整预览：</p>
          <div class="preview-display">
            <el-progress :percentage="selectedRisk.confidenceLevel * 100" :stroke-width="20">
              <div class="progress-labels">
                <span 
                  class="warning-threshold" 
                  :style="{left: thresholdForm.warning + '%'}">
                  警告
                </span>
                <span 
                  class="alert-threshold" 
                  :style="{left: thresholdForm.alert + '%'}">
                  告警
                </span>
              </div>
            </el-progress>
          </div>
          <div class="preview-result">
            <p>设置此阈值后，该风险的状态将变为：</p>
            <el-tag :type="getPreviewAlertType()">
              {{ getPreviewAlertLabel() }}
            </el-tag>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="thresholdSettingVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveThresholdSettings">确定保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { 
  riskFactors, 
  businessActivities, 
  riskNetwork, 
  riskMonitoringData, 
  riskCVaRData,
  riskReportData
} from '@/data/riskFactors'
import { downloadRiskDataCsv, downloadRiskReportCsv } from '@/utils/exportRiskData'
import { riskDataApi } from '@/api/riskDataApi'

export default {
  name: 'RiskMonitoring',
  data() {
    return {
      riskFactors,
      businessActivities,
      riskNetwork,
      monitoringData: riskMonitoringData,
      cvarData: riskCVaRData,
      reportData: riskReportData,
      filteredRisks: [],
      displayedRisks: [],
      selectedProcess: '',
      selectedCategory: '',
      selectedAlertStatus: '',
      selectedDate: new Date().toISOString().slice(0, 10),
      searchQuery: '',
      riskDetailVisible: false,
      thresholdSettingVisible: false,
      selectedRisk: null,
      thresholdForm: {
        warning: 0,
        alert: 0
      },
      chartView: 'cvar',
      heatmapView: 'cvar',
      currentPage: 1,
      pageSize: 10,
      processOptions: [
        { value: '采购', label: '采购流程' },
        { value: '生产', label: '生产流程' },
        { value: '营销', label: '营销流程' },
        { value: '运维', label: '运维流程' }
      ],
      categoryOptions: [
        { value: '不稳定不确定环境', label: '不稳定不确定环境' },
        { value: '采购风险', label: '采购风险' },
        { value: '生产风险', label: '生产风险' },
        { value: '营销风险', label: '营销风险' },
        { value: '运维风险', label: '运维风险' },
        { value: '财务风险', label: '财务风险' }
      ],
      alertStatusOptions: [
        { value: 'red', label: '高风险' },
        { value: 'yellow', label: '中风险' },
        { value: 'normal', label: '正常' }
      ],
      riskTrends: {
        red: 1,
        yellow: -2,
        normal: 1
      },
      // 新增：风险数据API相关
      riskData: [],
      riskDataLoading: false,
      riskDataError: null
    }
  },
  computed: {
    lastUpdateTime() {
      return new Date().toLocaleString('zh-CN', { 
        hour12: false, 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit', 
        minute: '2-digit'
      });
    },
    // 检查热力图是否可以渲染
    canRenderHeatmap() {
      return !this.riskDataLoading && 
             !this.riskDataError && 
             this.riskData && 
             this.riskData.length > 0;
    }
  },
  async mounted() {
    await this.loadRiskData()
    this.filterRisks()
    this.renderCharts()
  },
  watch: {
    // 监听风险数据变化，自动渲染热力图
    canRenderHeatmap(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.renderHeatmap()
        })
      }
    }
  },
  methods: {
    // 加载风险数据
    async loadRiskData() {
      this.riskDataLoading = true
      this.riskDataError = null
      
      try {
        const response = await riskDataApi.getAllRiskData()
        if (response.success) {
          this.riskData = response.data
          console.log('✅ 风险数据加载成功:', this.riskData.length, '条记录')
        } else {
          this.riskDataError = response.error || '获取风险数据失败'
          console.error('❌ 风险数据加载失败:', this.riskDataError)
        }
      } catch (error) {
        this.riskDataError = error.message || '网络请求失败'
        console.error('❌ 风险数据加载异常:', error)
      } finally {
        this.riskDataLoading = false
      }
    },
    
    refreshData() {
      this.$message({
        message: '数据已刷新',
        type: 'success'
      });
      // 刷新风险数据
      this.loadRiskData()
      this.filterRisks()
      this.renderCharts()
    },
    filterRisks() {
      const query = this.searchQuery.toLowerCase();
      
      this.filteredRisks = this.monitoringData.filter(risk => {
        // Filter by process
        if (this.selectedProcess) {
          const riskActivities = risk.relatedBusinessActivities
          const hasMatchingActivity = riskActivities.some(activityId => {
            const activity = this.businessActivities.find(ba => ba.id === activityId)
            return activity && activity.process === this.selectedProcess
          })
          if (!hasMatchingActivity) return false
        }
        
        // Filter by category
        if (this.selectedCategory) {
          const riskInfo = this.riskFactors.find(rf => rf.id === risk.riskFactorId)
          if (!riskInfo || riskInfo.category !== this.selectedCategory) return false
        }
        
        // Filter by alert status
        if (this.selectedAlertStatus && risk.alertStatus !== this.selectedAlertStatus) return false
        
        // Filter by search query
        if (query) {
          const riskInfo = this.riskFactors.find(rf => rf.id === risk.riskFactorId)
          const riskName = riskInfo ? riskInfo.name.toLowerCase() : '';
          if (!risk.riskFactorId.toLowerCase().includes(query) && 
              !riskName.includes(query)) {
            return false;
          }
        }
        
        return true
      });
      
      this.handleCurrentChange(1);
      this.renderDistributionChart();
    },
    formatTooltip(val) {
      return val + '%';
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.handleCurrentChange(1);
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      const start = (page - 1) * this.pageSize;
      const end = page * this.pageSize;
      this.displayedRisks = this.filteredRisks.slice(start, end);
    },
    getRiskName(riskId) {
      const risk = this.riskFactors.find(rf => rf.id === riskId)
      return risk ? risk.name : riskId
    },
    getRiskCategory(riskId) {
      const risk = this.riskFactors.find(rf => rf.id === riskId)
      return risk ? risk.category : ''
    },
    getBusinessActivityName(activityId) {
      const activity = this.businessActivities.find(ba => ba.id === activityId)
      return activity ? activity.name : activityId
    },
    getBusinessActivityProcess(activityId) {
      const activity = this.businessActivities.find(ba => ba.id === activityId)
      return activity ? activity.process : ''
    },
    getActivityColor(activityId) {
      const activity = this.businessActivities.find(ba => ba.id === activityId);
      if (!activity) return '#909399';
      
      switch(activity.process) {
        case '采购': return '#409EFF';
        case '生产': return '#67C23A';
        case '营销': return '#E6A23C';
        case '运维': return '#909399';
        default: return '#909399';
      }
    },
    getAlertType(status) {
      switch(status) {
        case 'red': return 'danger'
        case 'yellow': return 'warning'
        case 'normal': return 'success'
        default: return 'info'
      }
    },
    getAlertLabel(status) {
      switch(status) {
        case 'red': return '高风险'
        case 'yellow': return '中风险'
        case 'normal': return '正常'
        default: return '未知'
      }
    },
    getRiskTagType(status) {
      switch(status) {
        case 'red': return 'danger'
        case 'yellow': return 'warning'
        case 'normal': return 'success'
        default: return 'info'
      }
    },
    getConfidenceLevelColor(level) {
      if (level >= 0.85) return '#F56C6C';
      if (level >= 0.7) return '#E6A23C';
      if (level >= 0.5) return '#409EFF';
      return '#67C23A';
    },
    getConfidenceLevelClass(level) {
      if (level >= 0.85) return 'level-high';
      if (level >= 0.7) return 'level-medium';
      if (level >= 0.5) return 'level-low';
      return 'level-safe';
    },
    getCVaRColor(value) {
      if (value >= 10) return '#F56C6C';
      if (value >= 7) return '#E6A23C';
      if (value >= 5) return '#409EFF';
      return '#67C23A';
    },
    getPreviewAlertType() {
      if (!this.selectedRisk) return 'info';
      
      const level = this.selectedRisk.confidenceLevel;
      if (level >= this.thresholdForm.alert / 100) {
        return 'danger';
      } else if (level >= this.thresholdForm.warning / 100) {
        return 'warning';
      } else {
        return 'success';
      }
    },
    getPreviewAlertLabel() {
      if (!this.selectedRisk) return '未知';
      
      const level = this.selectedRisk.confidenceLevel;
      if (level >= this.thresholdForm.alert / 100) {
        return '高风险';
      } else if (level >= this.thresholdForm.warning / 100) {
        return '中风险';
      } else {
        return '正常';
      }
    },
    tableRowClassName({row}) {
      if (row.alertStatus === 'red') {
        return 'warning-row-high'
      } else if (row.alertStatus === 'yellow') {
        return 'warning-row-medium'
      }
      return ''
    },
    showRiskDetail(risk) {
      this.selectedRisk = risk
      this.riskDetailVisible = true
      this.$nextTick(() => {
        this.renderHistoryChart()
        this.renderNetworkChart()
      })
    },
    showThresholdSetting(risk) {
      this.selectedRisk = risk
      this.thresholdForm.warning = risk.threshold.warning * 100
      this.thresholdForm.alert = risk.threshold.alert * 100
      this.thresholdSettingVisible = true
    },
    saveThresholdSettings() {
      // In a real app, we would send this to the backend
      // Here we just update the local data
      if (this.selectedRisk) {
        const index = this.monitoringData.findIndex(
          r => r.riskFactorId === this.selectedRisk.riskFactorId
        )
        
        if (index !== -1) {
          this.monitoringData[index].threshold = {
            warning: this.thresholdForm.warning / 100,
            alert: this.thresholdForm.alert / 100
          }
          
          // Update alert status based on new thresholds
          const confidenceLevel = this.monitoringData[index].confidenceLevel
          if (confidenceLevel >= this.thresholdForm.alert / 100) {
            this.monitoringData[index].alertStatus = 'red'
          } else if (confidenceLevel >= this.thresholdForm.warning / 100) {
            this.monitoringData[index].alertStatus = 'yellow'
          } else {
            this.monitoringData[index].alertStatus = 'normal'
          }
          
          // Update filtered risks
          this.filterRisks()
          
          this.$message({
            message: '阈值设置已保存',
            type: 'success'
          })
        }
      }
      
      this.thresholdSettingVisible = false
    },
    exportRiskData() {
      // Export the filtered risk data to CSV
      const timestamp = new Date().toISOString().slice(0, 10)
      const filename = `risk_data_${timestamp}.csv`
      
      downloadRiskDataCsv(this.filteredRisks, filename)
      
      this.$message({
        message: '风险数据已导出',
        type: 'success'
      })
    },
    exportRiskReport() {
      // Export the risk report to CSV
      const timestamp = new Date().toISOString().slice(0, 10)
      const filename = `risk_report_${timestamp}.csv`
      
      downloadRiskReportCsv(this.reportData, filename)
      
      this.$message({
        message: '风险报告已导出',
        type: 'success'
      })
    },
    exportRiskDetail() {
      if (!this.selectedRisk) return;
      
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `risk_detail_${this.selectedRisk.riskFactorId}_${timestamp}.csv`;
      
      downloadRiskDataCsv([this.selectedRisk], filename);
      
      this.$message({
        message: '风险详情已导出',
        type: 'success'
      });
    },
    renderCharts() {
      this.renderCVaRChart();
      this.renderDistributionChart();
      // 只有在数据加载完成且有效时才渲染热力图
      if (this.canRenderHeatmap) {
        this.$nextTick(() => {
          this.renderHeatmap();
        });
      }
    },
    renderCVaRChart() {
      const chartDom = document.getElementById('cvarChart')
      if (!chartDom) return;
      
      const myChart = echarts.init(chartDom)
      
      const series = this.cvarData.businessActivityNames.map((name, index) => {
        return {
          name: name,
          type: 'line',
          data: this.cvarData.data.map(row => row[index]),
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            width: 3
          }
        }
      })
      
      const option = {
        title: {
          text: '不同置信水平下业务活动的CVaR值',
          left: 'center',
          textStyle: {
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            let result = `置信水平: ${params[0].axisValue}%<br/>`
            params.forEach(param => {
              result += `${param.seriesName}: ${param.value.toFixed(2)}<br/>`
            })
            return result
          }
        },
        legend: {
          data: this.cvarData.businessActivityNames,
          type: 'scroll',
          orient: 'horizontal',
          bottom: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.cvarData.confidenceLevels.map(level => level.toString()),
          name: '置信水平 (%)',
          nameLocation: 'middle',
          nameGap: 35,
          nameTextStyle: {
            fontWeight: 'bold'
          },
          axisLine: {
            lineStyle: {
              color: '#666'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: 'CVaR值',
          nameLocation: 'middle',
          nameGap: 40,
          nameTextStyle: {
            fontWeight: 'bold'
          },
          axisLine: {
            lineStyle: {
              color: '#666'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: series,
        color: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#9C27B0', '#2196F3', '#FF9800']
      }
      
      option && myChart.setOption(option)
      
      window.addEventListener('resize', function() {
        myChart.resize()
      })
    },
    renderDistributionChart() {
      const chartDom = document.getElementById('distributionChart');
      if (!chartDom) return;
      
      const myChart = echarts.init(chartDom);
      
      // Process Risk Distribution
      const processData = {};
      this.filteredRisks.forEach(risk => {
        // Find related business activities
        risk.relatedBusinessActivities.forEach(activityId => {
          const activity = this.businessActivities.find(ba => ba.id === activityId);
          if (activity) {
            const process = activity.process;
            if (!processData[process]) {
              processData[process] = { total: 0, red: 0, yellow: 0, normal: 0 };
            }
            processData[process].total++;
            processData[process][risk.alertStatus]++;
          }
        });
        
        // Handle risks with no related activities
        if (risk.relatedBusinessActivities.length === 0) {
          if (!processData['其他']) {
            processData['其他'] = { total: 0, red: 0, yellow: 0, normal: 0 };
          }
          processData['其他'].total++;
          processData['其他'][risk.alertStatus]++;
        }
      });
      
      // 定义固定的显示顺序，运维在其他之前
      const orderedProcessNames = ['采购', '生产', '营销', '运维', '其他'];
      const processNames = orderedProcessNames.filter(name => processData[name]);
      const redData = processNames.map(name => processData[name].red);
      const yellowData = processNames.map(name => processData[name].yellow);
      const normalData = processNames.map(name => processData[name].normal);
      
      const option = {
        title: {
          text: '风险分布统计',
          left: 'center',
          textStyle: {
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['高风险', '中风险', '正常'],
          bottom: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: processNames,
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        yAxis: {
          type: 'value',
          name: '风险数量',
          nameLocation: 'middle',
          nameGap: 40,
          nameTextStyle: {
            fontWeight: 'bold'
          }
        },
        series: [
          {
            name: '高风险',
            type: 'bar',
            stack: 'total',
            emphasis: {
              focus: 'series'
            },
            data: redData,
            itemStyle: {
              color: '#F56C6C'
            }
          },
          {
            name: '中风险',
            type: 'bar',
            stack: 'total',
            emphasis: {
              focus: 'series'
            },
            data: yellowData,
            itemStyle: {
              color: '#E6A23C'
            }
          },
          {
            name: '正常',
            type: 'bar',
            stack: 'total',
            emphasis: {
              focus: 'series'
            },
            data: normalData,
            itemStyle: {
              color: '#67C23A'
            }
          }
        ]
      };
      
      option && myChart.setOption(option);
      
      window.addEventListener('resize', function() {
        myChart.resize();
      });
    },
    renderHistoryChart() {
      if (!this.selectedRisk) return
      
      const chartDom = document.getElementById('historyChart')
      if (!chartDom) return;
      
      const myChart = echarts.init(chartDom)
      
      const dates = this.selectedRisk.historicalData.map(item => item.date).reverse()
      dates.push(new Date().toISOString().split('T')[0]) // Add current date
      
      const values = this.selectedRisk.historicalData.map(item => item.value).reverse()
      values.push(this.selectedRisk.confidenceLevel) // Add current value
      
      const warningLine = Array(dates.length).fill(this.selectedRisk.threshold.warning)
      const alertLine = Array(dates.length).fill(this.selectedRisk.threshold.alert)
      
      const option = {
        title: {
          text: '风险置信度历史趋势',
          left: 'center',
          textStyle: {
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            return `${params[0].axisValue}<br/>置信度: ${(params[0].value * 100).toFixed(0)}%`
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '5%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dates,
          axisLine: {
            lineStyle: {
              color: '#666'
            }
          },
          axisLabel: {
            formatter: function(value) {
              return value.substring(5); // Format as MM-DD
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '置信度',
          axisLabel: {
            formatter: function(value) {
              return (value * 100) + '%';
            }
          },
          axisLine: {
            lineStyle: {
              color: '#666'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: '置信度',
            type: 'line',
            data: values,
            lineStyle: {
              width: 4
            },
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#409EFF'
            },
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markArea: {
              silent: true,
              data: [
                [{
                  yAxis: this.selectedRisk.threshold.alert
                }, {
                  yAxis: 1
                }]
              ],
              itemStyle: {
                opacity: 0.1,
                color: '#F56C6C'
              }
            }
          },
          {
            name: '警告阈值',
            type: 'line',
            data: warningLine,
            lineStyle: {
              color: '#E6A23C',
              type: 'dashed',
              width: 2
            },
            symbol: 'none'
          },
          {
            name: '告警阈值',
            type: 'line',
            data: alertLine,
            lineStyle: {
              color: '#F56C6C',
              type: 'dashed',
              width: 2
            },
            symbol: 'none'
          }
        ]
      }
      
      option && myChart.setOption(option)
      
      window.addEventListener('resize', function() {
        myChart.resize()
      })
    },
    renderNetworkChart() {
      if (!this.selectedRisk) return
      
      const chartDom = document.getElementById('networkChart')
      if (!chartDom) return;
      
      const myChart = echarts.init(chartDom)
      
      // Filter network to show only connections related to the current risk
      const currentRiskId = this.selectedRisk.riskFactorId
      const relatedLinks = this.riskNetwork.filter(link => 
        link.source === currentRiskId || link.target === currentRiskId
      )
      
      // Extract all nodes from filtered links
      const nodeSet = new Set()
      nodeSet.add(currentRiskId)
      relatedLinks.forEach(link => {
        nodeSet.add(link.source)
        nodeSet.add(link.target)
      })
      
      const nodes = Array.from(nodeSet).map(id => {
        const risk = this.riskFactors.find(rf => rf.id === id)
        return {
          id: id,
          name: risk ? `${id}: ${risk.name}` : id,
          symbolSize: id === currentRiskId ? 50 : 30,
          category: risk ? risk.category : '',
          itemStyle: id === currentRiskId ? { color: '#F56C6C' } : {}
        }
      })
      
      const links = relatedLinks.map(link => ({
        source: link.source,
        target: link.target,
        lineStyle: {
          width: link.weight * 5,
          curveness: 0.3
        }
      }))
      
      const categories = [...new Set(nodes.map(node => node.category))].map(category => ({
        name: category
      }))
      
      const option = {
        title: {
          text: '风险因子网络关联',
          left: 'center',
          textStyle: {
            fontSize: 16
          }
        },
        tooltip: {
          formatter: function(params) {
            if (params.dataType === 'edge') {
              return `关联强度: ${(params.data.lineStyle.width / 5).toFixed(2)}`;
            }
            return params.data.name;
          }
        },
        legend: {
          data: categories.map(c => c.name),
          type: 'scroll',
          orient: 'horizontal',
          bottom: 0
        },
        series: [
          {
            type: 'graph',
            layout: 'force',
            data: nodes,
            links: links,
            categories: categories,
            roam: true,
            label: {
              show: true,
              position: 'right',
              formatter: '{b}',
              fontSize: 12
            },
            force: {
              repulsion: 200,
              edgeLength: [80, 120]
            },
            emphasis: {
              focus: 'adjacency',
              lineStyle: {
                width: 10
              }
            },
            lineStyle: {
              color: 'source',
              curveness: 0.3
            }
          }
        ]
      }
      
      option && myChart.setOption(option)
      
      window.addEventListener('resize', function() {
        myChart.resize()
      })
    },
    
    // 渲染风险热力图
    renderHeatmap() {
      const chartDom = document.getElementById('riskHeatmap')
      if (!chartDom) {
        console.warn('⚠️ 热力图DOM元素不存在')
        return;
      }
      
      // 检查是否有风险数据
      if (!this.riskData || this.riskData.length === 0) {
        console.warn('⚠️ 没有风险数据，无法渲染热力图')
        return;
      }
      
      // 确保DOM元素已经渲染完成
      this.$nextTick(() => {
        const myChart = echarts.init(chartDom)
        
        // 准备热力图数据
        const heatmapData = this.prepareHeatmapData()
        
        const option = {
          title: {
            text: this.getHeatmapTitle(),
            left: 'center',
            textStyle: {
              fontSize: 16
            }
          },
          tooltip: {
            position: 'top',
            formatter: (params) => {
              const processName = this.getProcessName(params.data[0])
              const confidence = params.data[1]
              const value = params.data[2]
              
              let valueText = ''
              if (this.heatmapView === 'cvar') {
                valueText = `CVaR值: ${value.toFixed(2)}`
              } else {
                valueText = `风险等级: ${this.getRiskLevelText(value)}`
              }
              
              return `${processName}<br/>置信度: ${confidence}<br/>${valueText}`
            }
          },
          grid: {
            height: '70%',
            top: '15%',
            left: '15%',
            right: '5%'
          },
          xAxis: {
            type: 'category',
            data: this.getProcessNames(),
            splitArea: {
              show: true
            },
            axisLabel: {
              interval: 0,
              rotate: 45,
              fontSize: 12
            }
          },
          yAxis: {
            type: 'category',
            data: this.getConfidenceLevels(),
            splitArea: {
              show: true
            },
            axisLabel: {
              fontSize: 11,
              width: 100,
              overflow: 'truncate'
            }
          },
          visualMap: {
            min: this.getVisualMapMin(),
            max: this.getVisualMapMax(),
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '5%',
            inRange: {
              color: this.getHeatmapColors()
            },
            text: ['高', '低'],
            textStyle: {
              color: '#333'
            }
          },
          series: [{
            name: this.getHeatmapTitle(),
            type: 'heatmap',
            data: heatmapData,
            label: {
              show: true,
              fontSize: 10,
              color: '#333'
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        }
        
        option && myChart.setOption(option)
        
        window.addEventListener('resize', function() {
          myChart.resize()
        })
      })
    },
    
    // 准备热力图数据
    prepareHeatmapData() {
      const data = []
      const processes = this.getProcessNames()
      const confidenceLevels = this.getConfidenceLevels()
      
      processes.forEach((process, processIndex) => {
        confidenceLevels.forEach((confidence, confidenceIndex) => {
          const value = this.getHeatmapValue(process, confidence)
          if (value !== null) {
            data.push([processIndex, confidenceIndex, value])
          }
        })
      })
      
      return data
    },
    
    // 获取热力图数值
    getHeatmapValue(process, confidence) {
      // 找到对应置信度的风险数据
      const riskRecord = this.riskData.find(record => record.confidence === confidence)
      
      if (!riskRecord || !riskRecord.purchase) return null
      
      // 根据视图类型返回不同的值
      switch (this.heatmapView) {
        case 'cvar':
          // 返回该流程的CVaR值（这里用风险值代替）
          return riskRecord.purchase[process] || 0
        case 'level':
          // 返回风险等级数值
          const riskValue = riskRecord.purchase[process] || 0
          return this.getRiskLevelValue(riskValue)
        default:
          return riskRecord.purchase[process] || 0
      }
    },
    
    // 获取风险等级数值
    getRiskLevelValue(riskValue) {
      if (riskValue > 150) return 0.9  // 高风险
      if (riskValue > 80) return 0.6   // 中风险
      if (riskValue > 50) return 0.4   // 低风险
      return 0.2  // 安全
    },
    
    // 获取风险等级文本
    getRiskLevelText(value) {
      if (value >= 0.8) return '高风险'
      if (value >= 0.6) return '中风险'
      if (value >= 0.4) return '低风险'
      return '安全'
    },
    
    // 获取流程名称列表（从风险数据中提取）
    getProcessNames() {
      if (!this.riskData || this.riskData.length === 0) return []
      
      // 从第一条记录中获取采购流程的所有环节
      const firstRecord = this.riskData[0]
      if (firstRecord && firstRecord.purchase) {
        return Object.keys(firstRecord.purchase)
      }
      return []
    },
    
    // 获取置信度级别列表
    getConfidenceLevels() {
      if (!this.riskData || this.riskData.length === 0) return []
      
      // 返回所有置信度级别，按数值排序
      return this.riskData
        .map(record => record.confidence)
        .sort((a, b) => parseInt(a) - parseInt(b))
    },
    
    // 获取流程名称
    getProcessName(processIndex) {
      const processes = this.getProcessNames()
      return processes[processIndex] || ''
    },
    
    // 获取热力图标题
    getHeatmapTitle() {
      switch (this.heatmapView) {
        case 'cvar':
          return '采购流程风险值热力图'
        case 'level':
          return '采购流程风险等级热力图'
        default:
          return '采购流程风险热力图'
      }
    },
    
    // 获取视觉映射最小值
    getVisualMapMin() {
      switch (this.heatmapView) {
        case 'cvar':
          return 0   // 风险值范围
        case 'level':
          return 0   // 风险等级0-1
        default:
          return 0
      }
    },
    
    // 获取视觉映射最大值
    getVisualMapMax() {
      switch (this.heatmapView) {
        case 'cvar':
          return 800 // 风险值范围（根据数据调整）
        case 'level':
          return 1   // 风险等级0-1
        default:
          return 1
      }
    },
    
    // 获取热力图颜色
    getHeatmapColors() {
      switch (this.heatmapView) {
        case 'cvar':
          return ['#67C23A', '#E6A23C', '#F56C6C']
        case 'level':
          return ['#67C23A', '#E6A23C', '#F56C6C']
        default:
          return ['#67C23A', '#E6A23C', '#F56C6C']
      }
    },
    
    // 刷新热力图
    async refreshHeatmap() {
      await this.loadRiskData()
      if (this.canRenderHeatmap) {
        this.renderHeatmap()
        this.$message({
          message: '热力图已刷新',
          type: 'success'
        })
      }
    }
  }
}
</script>

<style scoped>
.risk-monitoring {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 100px);
}

/* 页面头部样式 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.title-section h1 {
  font-size: 28px;
  margin: 0;
  color: #303133;
  display: flex;
  align-items: center;
}

.title-section h1 i {
  margin-right: 10px;
  color: #F56C6C;
}

.subtitle {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
  margin-left: 30px;
}

.full-width {
  width: 100%;
}

/* 风险卡片样式 */
.risk-dashboard {
  margin-top: 20px;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-card {
  background-color: white;
  border-radius: 8px;
}

.filter-card ::v-deep .el-card__header {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
  font-weight: 600;
  color: #303133;
}

.risk-summary {
  margin-bottom: 30px;
}

.risk-card {
  text-align: center;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.risk-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.risk-card-content {
  padding: 10px;
  display: flex;
  align-items: center;
}

.risk-icon {
  font-size: 3rem;
  margin-right: 15px;
  width: 60px;
  display: flex;
  justify-content: center;
}

.risk-info {
  text-align: left;
  flex: 1;
}

.risk-count {
  font-size: 36px;
  font-weight: bold;
  margin: 5px 0;
}

.risk-level {
  font-size: 24px;
  font-weight: bold;
  margin: 5px 0;
}

.risk-change {
  font-size: 12px;
  color: #F56C6C;
  display: flex;
  align-items: center;
}

.risk-change i {
  margin-right: 5px;
}

.risk-change.down {
  color: #67C23A;
}

.risk-change.stable {
  color: #909399;
}

.last-update {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.high-risk {
  background-color: #FEF0F0;
  border-color: #F56C6C;
}

.high-risk .risk-icon {
  color: #F56C6C;
}

.high-risk h3 {
  color: #F56C6C;
  margin: 0;
}

.medium-risk {
  background-color: #FDF6EC;
  border-color: #E6A23C;
}

.medium-risk .risk-icon {
  color: #E6A23C;
}

.medium-risk h3 {
  color: #E6A23C;
  margin: 0;
}

.normal-risk {
  background-color: #F0F9EB;
  border-color: #67C23A;
}

.normal-risk .risk-icon {
  color: #67C23A;
}

.normal-risk h3 {
  color: #67C23A;
  margin: 0;
}

.overall-risk {
  background-color: #F2F6FC;
  border-color: #409EFF;
}

.overall-risk .risk-icon {
  color: #409EFF;
}

.overall-risk h3 {
  color: #409EFF;
  margin: 0;
}

/* 内容卡片样式 */
.section-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.section-card ::v-deep .el-card__header {
  padding: 15px 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-weight: 600;
  color: #303133;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.section-title i {
  margin-right: 8px;
  font-size: 18px;
}

.section-actions {
  display: flex;
  align-items: center;
}

.top-risks-section,
.risk-list-section,
.chart-section {
  margin-top: 30px;
  margin-bottom: 30px;
}

.chart-container,
.history-chart-container,
.network-chart-container {
  border-radius: 4px;
  padding: 10px;
  margin-top: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 表格自定义样式 */
::v-deep .warning-row-high {
  background-color: rgba(245, 108, 108, 0.1);
}

::v-deep .warning-row-medium {
  background-color: rgba(230, 162, 60, 0.1);
}

::v-deep .el-table th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

::v-deep .el-table--border th, ::v-deep .el-table--border td {
  border-right: 1px solid #ebeef5;
}

.activity-tag {
  margin-bottom: 5px;
}

/* 详情弹窗样式 */
.risk-detail-dialog ::v-deep .el-dialog__header {
  padding: 15px 20px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.risk-detail-dialog ::v-deep .el-dialog__title {
  font-weight: 600;
  color: #303133;
  font-size: 18px;
}

.risk-detail-content {
  padding: 20px 0;
}

.detail-overview-card, 
.detail-activity-card, 
.detail-chart-card, 
.detail-network-card {
  margin-bottom: 20px;
  border: 1px solid #ebeef5;
}

.detail-card-header {
  font-weight: 600;
  color: #303133;
  padding: 10px 15px;
  border-bottom: 1px solid #ebeef5;
  background-color: #f5f7fa;
}

.risk-title {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.detail-info-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.detail-label {
  font-weight: 600;
  color: #606266;
  margin-right: 10px;
  width: 100px;
}

.threshold-display {
  display: flex;
  gap: 15px;
}

.threshold-item {
  display: flex;
  align-items: center;
}

.threshold-label {
  font-size: 12px;
  margin-right: 5px;
}

.no-data-text {
  color: #909399;
  font-size: 14px;
  text-align: center;
  padding: 20px 0;
}

.timeline-activity {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-name {
  font-weight: 500;
}

.risk-detail-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

/* 阈值设置弹窗样式 */
.threshold-setting-dialog ::v-deep .el-dialog__header {
  padding: 15px 20px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.threshold-setting-content {
  padding: 20px 0;
}

.threshold-risk-info {
  margin-bottom: 30px;
  text-align: center;
}

.threshold-risk-info h3 {
  font-size: 18px;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.current-confidence {
  font-size: 16px;
  color: #606266;
}

.level-high {
  color: #F56C6C;
  font-weight: bold;
}

.level-medium {
  color: #E6A23C;
  font-weight: bold;
}

.level-low {
  color: #409EFF;
  font-weight: bold;
}

.level-safe {
  color: #67C23A;
  font-weight: bold;
}

.threshold-value {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
}

.threshold-value.warning {
  color: #E6A23C;
}

.threshold-value.alert {
  color: #F56C6C;
}

.threshold-form ::v-deep .el-slider__runway {
  margin: 16px 0;
}

.threshold-preview {
  margin-top: 30px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.preview-title {
  font-weight: 600;
  color: #303133;
  margin-top: 0;
}

.preview-display {
  position: relative;
  margin: 20px 0;
}

.progress-labels {
  position: relative;
  width: 100%;
  height: 0;
}

.warning-threshold, .alert-threshold {
  position: absolute;
  top: -25px;
  transform: translateX(-50%);
  font-size: 12px;
  background-color: #fff;
  padding: 2px 6px;
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 2;
}

.warning-threshold {
  color: #E6A23C;
  border: 1px solid #E6A23C;
}

.alert-threshold {
  color: #F56C6C;
  border: 1px solid #F56C6C;
}

.preview-result {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  justify-content: center;
}

.preview-result p {
  margin: 0;
}

/* 热力图样式 */
.heatmap-section {
  margin-top: 30px;
  margin-bottom: 30px;
}

.heatmap-container {
  border-radius: 4px;
  padding: 10px;
  margin-top: 10px;
  background-color: #fff;
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #909399;
}

.loading-container p {
  margin-top: 15px;
  font-size: 14px;
}

/* 错误状态样式 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
  color: #606266;
}

.error-container h3 {
  margin: 15px 0 10px 0;
  color: #F56C6C;
}

.error-container p {
  margin: 0 0 20px 0;
  color: #909399;
}

/* 空状态样式 */
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
  color: #606266;
}

.empty-container h3 {
  margin: 15px 0 10px 0;
  color: #909399;
}

.empty-container p {
  margin: 0;
  color: #909399;
}

.heatmap-legend {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}

.legend-title {
  font-weight: 600;
  color: #303133;
  margin-bottom: 15px;
  font-size: 14px;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #606266;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  border: 1px solid #dcdfe6;
}

.legend-color.high-risk {
  background-color: #F56C6C;
}

.legend-color.medium-risk {
  background-color: #E6A23C;
}

.legend-color.low-risk {
  background-color: #409EFF;
}

.legend-color.safe-risk {
  background-color: #67C23A;
}
</style> 