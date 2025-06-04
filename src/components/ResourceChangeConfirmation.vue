<template>
  <el-dialog
    title="流程重构资源变化确认"
    :visible.sync="visible"
    width="70%"
    :before-close="handleClose"
    class="resource-dialog">
    
    <!-- 顶部警告提示 -->
    <div class="warning-banner">
      <el-alert
        title="重要提示"
        description="以下资源变化将在您确认后立即生效，请仔细审核所有资源需求"
        type="warning"
        :closable="false"
        show-icon>
      </el-alert>
    </div>

    <!-- 总体变化概览 -->
    <div class="summary-section">
      <h3 class="section-title">总体变化概览</h3>
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

    <!-- 资源需求详情 -->
    <div class="details-section">
      <h3 class="section-title">新增资源需求</h3>
      
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
        我已仔细阅读并理解上述所有资源变化内容，确认实施此重构方案
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
        确认实施重构
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ResourceChangeConfirmation',
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
      return this.getNestedValue(['newResourceTypes', 'personnel', 'totalEstimate']) || '';
    },
    getPersonnelDepartments() {
      const departments = this.getNestedValue(['newResourceTypes', 'personnel', 'departments']);
      return departments ? departments.join('、') : '';
    },
    getPersonnelCategories() {
      return this.getNestedValue(['newResourceTypes', 'personnel', 'categories']) || [];
    },
    getSystemsImplementation() {
      return this.getNestedValue(['newResourceTypes', 'systems', 'implementation']) || '';
    },
    getSystemsIntegration() {
      return this.getNestedValue(['newResourceTypes', 'systems', 'integration']) || '';
    },
    getSystemsCategories() {
      return this.getNestedValue(['newResourceTypes', 'systems', 'categories']) || [];
    },
    getDocumentsEstimate() {
      return this.getNestedValue(['newResourceTypes', 'documents', 'totalEstimate']) || '';
    },
    getDocumentsCategories() {
      return this.getNestedValue(['newResourceTypes', 'documents', 'categories']) || [];
    },
    getEquipmentPurpose() {
      return this.getNestedValue(['newResourceTypes', 'equipment', 'purpose']) || '';
    },
    getEquipmentCategories() {
      return this.getNestedValue(['newResourceTypes', 'equipment', 'categories']) || [];
    },
    getImplementationImpact() {
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
        sustainability: 'el-icon-refresh'
      }
      return icons[key] || 'el-icon-check'
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
</style> 