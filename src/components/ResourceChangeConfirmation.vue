<template>
  <el-dialog
    title="流程重构资源变化确认"
    :visible.sync="visible"
    width="70%"
    :before-close="handleClose"
    :class="['resource-dialog', { 'minimal-mode': isMinimalMode() }]">
    
    <!-- 顶部警告提示 -->
    <div class="warning-banner">
      <el-alert
        :title="getAlertTitle()"
        :description="getAlertDescription()"
        :type="isMinimalMode() ? 'info' : 'warning'"
        :closable="false"
        show-icon>
      </el-alert>
    </div>

    <!-- 总体变化概览 -->
    <div class="summary-section">
      <h3 class="section-title">{{ getSectionTitle() }}</h3>
      <el-row :gutter="16">
        <el-col :span="6">
          <div class="summary-card">
            <div class="summary-number">{{ getSummaryData('processSteps') }}</div>
            <div class="summary-label">流程步骤</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="summary-card">
            <div class="summary-number">{{ getSummaryData('newFunctions') }}</div>
            <div class="summary-label">新增功能环节</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="summary-card">
            <div class="summary-number">{{ getSummaryData('resourceTypesLength') }}</div>
            <div class="summary-label">涉及资源类型</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="summary-card">
            <div class="summary-number">{{ getSummaryData('implementationPhases') }}</div>
            <div class="summary-label">实施阶段</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 项目实施计划甘特图 -->
    <div class="gantt-section" v-if="getGanttData()">
      <h3 class="section-title">项目实施计划</h3>
      <div class="gantt-wrapper">
        <GanttChart :gantt-data="getGanttData()" />
      </div>
    </div>

    <!-- 资源需求详情 -->
    <div class="details-section">
      <h3 class="section-title">{{ getResourceSectionTitle() }}</h3>
      
      <el-row :gutter="20">
        <!-- 人员资源 -->
        <el-col :span="12">
          <div class="resource-card">
            <div class="resource-header">
              <i class="el-icon-user-solid"></i>
              <span>人员资源</span>
              <el-tag size="small" type="primary">{{ getPersonnelEstimate() }}</el-tag>
            </div>
            <div class="resource-content">
              <div class="department-info">
                <strong>涉及部门：</strong>{{ getPersonnelDepartments() }}
              </div>
              <ul class="resource-list">
                <li v-for="(category, index) in getPersonnelCategories()" :key="index">
                  {{ category }}
                </li>
              </ul>
            </div>
          </div>
        </el-col>

        <!-- 系统资源 -->
        <el-col :span="12">
          <div class="resource-card">
            <div class="resource-header">
              <i class="el-icon-monitor"></i>
              <span>系统资源</span>
              <el-tag size="small" type="warning">{{ getSystemsImplementation() }}</el-tag>
            </div>
            <div class="resource-content">
              <div class="system-info">
                <strong>集成要求：</strong>{{ getSystemsIntegration() }}
              </div>
              <ul class="resource-list">
                <li v-for="(category, index) in getSystemsCategories()" :key="index">
                  {{ category }}
                </li>
              </ul>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px;">
        <!-- 文档资源 -->
        <el-col :span="12">
          <div class="resource-card">
            <div class="resource-header">
              <i class="el-icon-document"></i>
              <span>文档资源</span>
              <el-tag size="small" type="success">{{ getDocumentsEstimate() }}</el-tag>
            </div>
            <div class="resource-content">
              <ul class="resource-list">
                <li v-for="(category, index) in getDocumentsCategories()" :key="index">
                  {{ category }}
                </li>
              </ul>
            </div>
          </div>
        </el-col>

        <!-- 设备资源 -->
        <el-col :span="12">
          <div class="resource-card">
            <div class="resource-header">
              <i class="el-icon-cpu"></i>
              <span>设备资源</span>
              <el-tag size="small" type="info">{{ getEquipmentPurpose() }}</el-tag>
            </div>
            <div class="resource-content">
              <ul class="resource-list">
                <li v-for="(category, index) in getEquipmentCategories()" :key="index">
                  {{ category }}
                </li>
              </ul>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 实施影响与效益 -->
    <div class="impact-benefits-section">
      <el-row :gutter="20">
        <el-col :span="12">
          <h4 class="sub-title">实施影响</h4>
          <div class="impact-list">
            <div v-for="(value, key) in getImplementationImpact()" :key="key" class="impact-item">
              <span class="impact-label">{{ getImpactTitle(key) }}：</span>
              <span class="impact-text">{{ value }}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <h4 class="sub-title">预期效益</h4>
          <div class="benefits-list">
            <div v-for="(value, key) in getExpectedBenefits()" :key="key" class="benefit-item">
              <i :class="getBenefitIcon(key)" class="benefit-icon"></i>
              <span class="benefit-text">{{ value }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 确认区域 -->
    <div class="confirmation-section">
      <el-checkbox v-model="userConfirmed" size="large">
        {{ getConfirmationText() }}
      </el-checkbox>
    </div>

    <!-- 底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel" size="large">
        取消
      </el-button>
      <el-button 
        type="primary" 
        @click="handleConfirm" 
        :disabled="!userConfirmed"
        size="large">
        {{ getConfirmButtonText() }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import GanttChart from '@/components/GanttChart.vue';

export default {
  name: 'ResourceChangeConfirmation',
  components: {
    GanttChart
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    resourceData: {
      type: Object,
      default: () => ({})
    },
    optimizationKey: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      userConfirmed: false
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.userConfirmed = false
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleCancel() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    handleConfirm() {
      if (!this.userConfirmed) {
        this.$message.warning('请先确认您已阅读并理解所有变化内容')
        return
      }
      this.$emit('confirm', this.optimizationKey)
      this.$emit('update:visible', false)
    },
    
    // 检测当前数据模式
    isMinimalMode() {
      return !!this.resourceData.minimalResourceChanges;
    },
    
    // 获取基础资源路径
    getResourceBasePath() {
      return this.isMinimalMode() ? 'minimalResourceChanges' : 'newResourceTypes';
    },
    
    getSummaryData(key) {
      if (!this.resourceData.summary) return '';
      
      switch(key) {
        case 'processSteps':
          const steps = this.resourceData.summary.processSteps;
          if (steps && steps.before && steps.after) {
            return steps.before + ' → ' + steps.after;
          }
          return '';
        case 'resourceTypesLength':
          const types = this.resourceData.summary.resourceTypes;
          return types ? types.length : '';
        default:
          return this.resourceData.summary[key] || '';
      }
    },
    
    getPersonnelEstimate() {
      const basePath = this.getResourceBasePath();
      return this.getNestedValue([basePath, 'personnel', 'totalEstimate']) || '';
    },
    
    getPersonnelDepartments() {
      const basePath = this.getResourceBasePath();
      const departments = this.getNestedValue([basePath, 'personnel', 'departments']);
      if (departments && Array.isArray(departments)) {
        return departments.join('、');
      }
      // 对于资源优先模式，可能没有departments字段
      return this.isMinimalMode() ? '现有部门' : '';
    },
    
    getPersonnelCategories() {
      const basePath = this.getResourceBasePath();
      return this.getNestedValue([basePath, 'personnel', 'categories']) || [];
    },
    
    getSystemsImplementation() {
      const basePath = this.getResourceBasePath();
      return this.getNestedValue([basePath, 'systems', 'implementation']) || '';
    },
    
    getSystemsIntegration() {
      const basePath = this.getResourceBasePath();
      const integration = this.getNestedValue([basePath, 'systems', 'integration']);
      if (integration) return integration;
      
      // 对于资源优先模式，可能使用不同的字段名
      if (this.isMinimalMode()) {
        return this.getNestedValue([basePath, 'systems', 'approach']) || '';
      }
      return '';
    },
    
    getSystemsCategories() {
      const basePath = this.getResourceBasePath();
      const categories = this.getNestedValue([basePath, 'systems', 'categories']);
      if (categories && Array.isArray(categories)) {
        return categories;
      }
      
      // 对于资源优先模式，可能使用modifications字段
      if (this.isMinimalMode()) {
        return this.getNestedValue([basePath, 'systems', 'modifications']) || [];
      }
      return [];
    },
    
    getDocumentsEstimate() {
      const basePath = this.getResourceBasePath();
      return this.getNestedValue([basePath, 'documents', 'totalEstimate']) || '';
    },
    
    getDocumentsCategories() {
      const basePath = this.getResourceBasePath();
      return this.getNestedValue([basePath, 'documents', 'categories']) || [];
    },
    
    getEquipmentPurpose() {
      const basePath = this.getResourceBasePath();
      const purpose = this.getNestedValue([basePath, 'equipment', 'purpose']);
      if (purpose) return purpose;
      
      // 对于资源优先模式，可能使用approach字段
      if (this.isMinimalMode()) {
        return this.getNestedValue([basePath, 'equipment', 'approach']) || 
               this.getNestedValue([basePath, 'equipment', 'requirement']) || '';
      }
      return '';
    },
    
    getEquipmentCategories() {
      const basePath = this.getResourceBasePath();
      const categories = this.getNestedValue([basePath, 'equipment', 'categories']);
      if (categories && Array.isArray(categories)) {
        return categories;
      }
      
      // 对于资源优先模式，可能没有设备需求
      if (this.isMinimalMode()) {
        const requirement = this.getNestedValue([basePath, 'equipment', 'requirement']);
        if (requirement) {
          return [requirement];
        }
      }
      return [];
    },
    
    getImplementationImpact() {
      // 检查是否有minimalEnhancements.implementationImpact（资源优先模式）
      if (this.isMinimalMode() && this.resourceData.implementationImpact) {
        return this.resourceData.implementationImpact;
      }
      return this.resourceData.implementationImpact || {};
    },
    
    getExpectedBenefits() {
      return this.resourceData.expectedBenefits || {};
    },
    
    getNestedValue(path) {
      let value = this.resourceData;
      for (let key of path) {
        if (value && value[key]) {
          value = value[key];
        } else {
          return null;
        }
      }
      return value;
    },
    
    getImpactTitle(key) {
      const titles = {
        organizationalChange: '组织变革',
        processComplexity: '流程复杂性',
        systemIntegration: '系统集成',
        changeManagement: '变更管理',
        riskMitigation: '风险缓解'
      }
      return titles[key] || key
    },
    
    getBenefitIcon(key) {
      const icons = {
        resilience: 'el-icon-shield',
        continuity: 'el-icon-connection',
        efficiency: 'el-icon-timer',
        standardization: 'el-icon-document',
        sustainability: 'el-icon-refresh',
        costEffectiveness: 'el-icon-money',
        quickImplementation: 'el-icon-time'
      }
      return icons[key] || 'el-icon-check'
    },
    
    getGanttData() {
      return this.resourceData.ganttData || null;
    },
    
    getAlertTitle() {
      return this.isMinimalMode() ? '资源优先方案确认' : '重要提示';
    },
    
    getAlertDescription() {
      return this.isMinimalMode() ? 
        '以下是资源优先的简化重构方案，将最大化利用现有资源，请仔细审核变化内容' : 
        '以下资源变化将在您确认后立即生效，请仔细审核所有资源需求';
    },
    
    getSectionTitle() {
      return this.isMinimalMode() ? '资源变化概览（最小化投入）' : '总体变化概览';
    },
    
    getResourceSectionTitle() {
      return this.isMinimalMode() ? '新增资源需求（最小化投入）' : '新增资源需求';
    },
    
    getConfirmationText() {
      return this.isMinimalMode() ? 
        '我已仔细阅读并理解上述资源变化内容，确认实施此资源优先的简化重构方案' : 
        '我已仔细阅读并理解上述所有资源变化内容，确认实施此重构方案';
    },
    
    getConfirmButtonText() {
      return this.isMinimalMode() ? '确认实施简化重构' : '确认实施重构';
    }
  }
}
</script>

<style scoped>
.resource-dialog :deep(.el-dialog) {
  margin-top: 5vh;
}

.warning-banner {
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  color: #303133;
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 4px solid #409EFF;
}

.summary-section {
  margin-bottom: 30px;
}

.summary-card {
  text-align: center;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.summary-number {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.summary-label {
  font-size: 12px;
  opacity: 0.9;
}

.details-section {
  margin-bottom: 25px;
}

.resource-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background-color: #fafafa;
  height: 100%;
}

.resource-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  border-radius: 8px 8px 0 0;
}

.resource-header i {
  font-size: 16px;
  color: #409EFF;
  margin-right: 8px;
}

.resource-header span {
  flex: 1;
  font-weight: bold;
  color: #303133;
}

.resource-content {
  padding: 16px;
}

.department-info, .system-info {
  margin-bottom: 12px;
  color: #606266;
  font-size: 14px;
}

.resource-list {
  margin: 0;
  padding-left: 20px;
  list-style-type: disc;
}

.resource-list li {
  margin-bottom: 6px;
  color: #606266;
  line-height: 1.4;
  font-size: 14px;
}

.impact-benefits-section {
  margin-bottom: 20px;
}

.sub-title {
  font-size: 14px;
  color: #303133;
  margin-bottom: 12px;
  font-weight: bold;
}

.impact-list, .benefits-list {
  max-height: 180px;
  overflow-y: auto;
}

.impact-item {
  margin-bottom: 10px;
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border-left: 3px solid #409EFF;
}

.impact-label {
  font-weight: bold;
  color: #409EFF;
}

.impact-text {
  color: #606266;
  font-size: 13px;
}

.benefit-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 6px;
}

.benefit-icon {
  color: #67C23A;
  margin-right: 8px;
  font-size: 14px;
}

.benefit-text {
  color: #606266;
  font-size: 13px;
  line-height: 1.4;
}

.confirmation-section {
  margin: 20px 0;
  padding: 15px;
  background-color: #f0f9ff;
  border: 1px solid #409EFF;
  border-radius: 6px;
  text-align: center;
}

.confirmation-section :deep(.el-checkbox__label) {
  font-weight: 500;
  color: #303133;
}

.dialog-footer {
  text-align: center;
  padding-top: 10px;
}

.dialog-footer .el-button {
  min-width: 120px;
  margin: 0 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .resource-dialog :deep(.el-dialog) {
    width: 95% !important;
    margin-top: 2vh;
  }
  
  .summary-card {
    margin-bottom: 10px;
  }
}

/* 甘特图样式 */
.gantt-section {
  margin-bottom: 25px;
}

.gantt-wrapper {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background-color: #fafafa;
}

/* 资源优先模式特殊样式 */
.minimal-mode.resource-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #67B26F, #4ca2cd);
  color: white;
  margin: 0;
  padding: 20px;
  border-radius: 8px 8px 0 0;
}

.minimal-mode.resource-dialog :deep(.el-dialog__title) {
  color: white;
  font-weight: bold;
}

.minimal-mode .summary-card {
  background: linear-gradient(135deg, #67B26F 0%, #4ca2cd 100%);
}

.minimal-mode .confirmation-section {
  background-color: #f0f9ff;
  border-color: #67B26F;
}

.minimal-mode .confirmation-section :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #67B26F;
  border-color: #67B26F;
}

.minimal-mode .dialog-footer .el-button--primary {
  background-color: #67B26F;
  border-color: #67B26F;
}

.minimal-mode .dialog-footer .el-button--primary:hover {
  background-color: #5a9c63;
  border-color: #5a9c63;
}
</style> 