<template>
  <el-card class="neural-settings-card">
    <div slot="header" class="settings-header">
      <span>神经网络参数设置</span>
      <el-tag size="small" type="info">运行配置</el-tag>
    </div>
    
    <div class="settings-content">
      <div class="settings-description">
        <p>调整神经网络运行参数以优化分析结果</p>
      </div>
      
      <!-- 风险评估参数 -->
      <div class="parameter-section">
        <h4 class="section-title">风险评估参数</h4>
        
        <div class="parameter-grid">
          <div class="parameter-item">
            <div class="parameter-label">
              <span class="label-text">地缘政治事件影响系数</span>
              <el-tooltip content="控制地缘政治事件对流程风险评估的影响程度，取值范围0.1-2.0" placement="top">
                <i class="el-icon-question help-icon"></i>
              </el-tooltip>
            </div>
            
            <div class="parameter-control">
              <el-row :gutter="8" type="flex" align="middle">
                <el-col :span="12">
                  <el-slider
                    v-model="geoPoliticalWeight"
                    :min="0.1"
                    :max="2.0"
                    :step="0.1"
                    :show-tooltip="false"
                    @change="handleParameterChange"
                    class="weight-slider">
                  </el-slider>
                </el-col>
                <el-col :span="6">
                  <el-input-number
                    v-model="geoPoliticalWeight"
                    :min="0.1"
                    :max="2.0"
                    :step="0.1"
                    :precision="1"
                    size="mini"
                    @change="handleParameterChange">
                  </el-input-number>
                </el-col>
                <el-col :span="6">
                  <el-tag 
                    :type="getGeoPoliticalLevel().type" 
                    size="mini"
                    class="weight-tag">
                    {{ getGeoPoliticalLevel().label }}
                  </el-tag>
                </el-col>
              </el-row>
            </div>
            
            <div class="parameter-description">
              <span class="desc-text">{{ getGeoPoliticalDescription() }}</span>
            </div>
          </div>

          <div class="parameter-item">
            <div class="parameter-label">
              <span class="label-text">原材料价格波动敏感度</span>
              <el-tooltip content="控制原材料价格变化对供应链决策的影响敏感度，取值范围0.1-2.0" placement="top">
                <i class="el-icon-question help-icon"></i>
              </el-tooltip>
            </div>
            
            <div class="parameter-control">
              <el-row :gutter="8" type="flex" align="middle">
                <el-col :span="12">
                  <el-slider
                    v-model="marketVolatilityFactor"
                    :min="0.1"
                    :max="2.0"
                    :step="0.1"
                    :show-tooltip="false"
                    @change="handleParameterChange"
                    class="weight-slider">
                  </el-slider>
                </el-col>
                <el-col :span="6">
                  <el-input-number
                    v-model="marketVolatilityFactor"
                    :min="0.1"
                    :max="2.0"
                    :step="0.1"
                    :precision="1"
                    size="mini"
                    @change="handleParameterChange">
                  </el-input-number>
                </el-col>
                <el-col :span="6">
                  <el-tag 
                    :type="getMarketVolatilityLevel().type" 
                    size="mini"
                    class="weight-tag">
                    {{ getMarketVolatilityLevel().label }}
                  </el-tag>
                </el-col>
              </el-row>
            </div>
            
            <div class="parameter-description">
              <span class="desc-text">{{ getMarketVolatilityDescription() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 供应链管理参数 -->
      <div class="parameter-section">
        <h4 class="section-title">供应链管理参数</h4>
        
        <div class="parameter-grid">
          <div class="parameter-item">
            <div class="parameter-label">
              <span class="label-text">备用供应商最低覆盖比例</span>
              <el-tooltip content="每个关键物料至少需要的备用供应商覆盖比例，取值范围10%-80%" placement="top">
                <i class="el-icon-question help-icon"></i>
              </el-tooltip>
            </div>
            
            <div class="parameter-control">
              <el-row :gutter="8" type="flex" align="middle">
                <el-col :span="12">
                  <el-slider
                    v-model="backupSupplierRatio"
                    :min="0.1"
                    :max="0.8"
                    :step="0.05"
                    :show-tooltip="false"
                    @change="handleParameterChange"
                    class="weight-slider">
                  </el-slider>
                </el-col>
                <el-col :span="6">
                  <el-input
                    :value="(backupSupplierRatio * 100).toFixed(0) + '%'"
                    size="mini"
                    readonly
                    style="text-align: center;">
                  </el-input>
                </el-col>
                <el-col :span="6">
                  <el-tag 
                    :type="getBackupSupplierLevel().type" 
                    size="mini"
                    class="weight-tag">
                    {{ getBackupSupplierLevel().label }}
                  </el-tag>
                </el-col>
              </el-row>
            </div>
            
            <div class="parameter-description">
              <span class="desc-text">{{ getBackupSupplierDescription() }}</span>
            </div>
          </div>

          <div class="parameter-item">
            <div class="parameter-label">
              <span class="label-text">运输路径重评估频率</span>
              <el-tooltip content="重新评估和优化运输路径的时间间隔，取值范围1-30天" placement="top">
                <i class="el-icon-question help-icon"></i>
              </el-tooltip>
            </div>
            
            <div class="parameter-control">
              <el-row :gutter="8" type="flex" align="middle">
                <el-col :span="12">
                  <el-slider
                    v-model="routeReevalFrequency"
                    :min="1"
                    :max="30"
                    :step="1"
                    :show-tooltip="false"
                    @change="handleParameterChange"
                    class="weight-slider">
                  </el-slider>
                </el-col>
                <el-col :span="6">
                  <el-input
                    :value="routeReevalFrequency + '天'"
                    size="mini"
                    readonly
                    style="text-align: center;">
                  </el-input>
                </el-col>
                <el-col :span="6">
                  <el-tag 
                    :type="getRouteReevalLevel().type" 
                    size="mini"
                    class="weight-tag">
                    {{ getRouteReevalLevel().label }}
                  </el-tag>
                </el-col>
              </el-row>
            </div>
            
            <div class="parameter-description">
              <span class="desc-text">{{ getRouteReevalDescription() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 运营优化参数 -->
      <div class="parameter-section">
        <h4 class="section-title">运营优化参数</h4>
        
        <div class="parameter-grid">
          <div class="parameter-item">
            <div class="parameter-label">
              <span class="label-text">成本与延误权衡系数</span>
              <el-tooltip content="在成本优化和交期保证之间的权衡系数，取值范围0.5-3.0" placement="top">
                <i class="el-icon-question help-icon"></i>
              </el-tooltip>
            </div>
            
            <div class="parameter-control">
              <el-row :gutter="8" type="flex" align="middle">
                <el-col :span="12">
                  <el-slider
                    v-model="costDelayTradeoff"
                    :min="0.5"
                    :max="3.0"
                    :step="0.1"
                    :show-tooltip="false"
                    @change="handleParameterChange"
                    class="weight-slider">
                  </el-slider>
                </el-col>
                <el-col :span="6">
                  <el-input-number
                    v-model="costDelayTradeoff"
                    :min="0.5"
                    :max="3.0"
                    :step="0.1"
                    :precision="1"
                    size="mini"
                    @change="handleParameterChange">
                  </el-input-number>
                </el-col>
                <el-col :span="6">
                  <el-tag 
                    :type="getCostDelayLevel().type" 
                    size="mini"
                    class="weight-tag">
                    {{ getCostDelayLevel().label }}
                  </el-tag>
                </el-col>
              </el-row>
            </div>
            
            <div class="parameter-description">
              <span class="desc-text">{{ getCostDelayDescription() }}</span>
            </div>
          </div>

          <div class="parameter-item">
            <div class="parameter-label">
              <span class="label-text">生产节拍波动容忍范围</span>
              <el-tooltip content="允许的生产节拍波动范围，超出此范围将触发流程重组，取值范围1%-20%" placement="top">
                <i class="el-icon-question help-icon"></i>
              </el-tooltip>
            </div>
            
            <div class="parameter-control">
              <el-row :gutter="8" type="flex" align="middle">
                <el-col :span="12">
                  <el-slider
                    v-model="taktTimeVariance"
                    :min="0.01"
                    :max="0.2"
                    :step="0.01"
                    :show-tooltip="false"
                    @change="handleParameterChange"
                    class="weight-slider">
                  </el-slider>
                </el-col>
                <el-col :span="6">
                  <el-input
                    :value="'±' + (taktTimeVariance * 100).toFixed(0) + '%'"
                    size="mini"
                    readonly
                    style="text-align: center;">
                  </el-input>
                </el-col>
                <el-col :span="6">
                  <el-tag 
                    :type="getTaktTimeLevel().type" 
                    size="mini"
                    class="weight-tag">
                    {{ getTaktTimeLevel().label }}
                  </el-tag>
                </el-col>
              </el-row>
            </div>
            
            <div class="parameter-description">
              <span class="desc-text">{{ getTaktTimeDescription() }}</span>
            </div>
          </div>

          <div class="parameter-item">
            <div class="parameter-label">
              <span class="label-text">紧急人力成本上限</span>
              <el-tooltip content="每月最多调用的加班工时上限，取值范围50-500小时/月" placement="top">
                <i class="el-icon-question help-icon"></i>
              </el-tooltip>
            </div>
            
            <div class="parameter-control">
              <el-row :gutter="8" type="flex" align="middle">
                <el-col :span="12">
                  <el-slider
                    v-model="overtimeCostCap"
                    :min="50"
                    :max="500"
                    :step="10"
                    :show-tooltip="false"
                    @change="handleParameterChange"
                    class="weight-slider">
                  </el-slider>
                </el-col>
                <el-col :span="6">
                  <el-input
                    :value="overtimeCostCap + '小时'"
                    size="mini"
                    readonly
                    style="text-align: center;">
                  </el-input>
                </el-col>
                <el-col :span="6">
                  <el-tag 
                    :type="getOvertimeLevel().type" 
                    size="mini"
                    class="weight-tag">
                    {{ getOvertimeLevel().label }}
                  </el-tag>
                </el-col>
              </el-row>
            </div>
            
            <div class="parameter-description">
              <span class="desc-text">{{ getOvertimeDescription() }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="settings-actions">
        <el-button type="primary" size="small" @click="applySettings">
          应用设置
        </el-button>
        <el-button size="small" @click="resetSettings">
          重置默认
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'NeuralNetworkSettings',
  data() {
    return {
      geoPoliticalWeight: 1.0, // 地缘政治事件影响系数
      marketVolatilityFactor: 0.8, // 原材料价格波动敏感度
      backupSupplierRatio: 0.3, // 备用供应商最低覆盖比例
      routeReevalFrequency: 7, // 运输路径重评估频率（天）
      costDelayTradeoff: 1.2, // 成本与延误的权衡系数
      taktTimeVariance: 0.05, // 允许的生产节拍波动范围
      overtimeCostCap: 200 // 紧急人力成本上限（小时/月）
    }
  },
  methods: {
    handleParameterChange() {
      // 参数变化时触发
      this.$emit('parameter-change', {
        geoPoliticalWeight: this.geoPoliticalWeight,
        marketVolatilityFactor: this.marketVolatilityFactor,
        backupSupplierRatio: this.backupSupplierRatio,
        routeReevalFrequency: this.routeReevalFrequency,
        costDelayTradeoff: this.costDelayTradeoff,
        taktTimeVariance: this.taktTimeVariance,
        overtimeCostCap: this.overtimeCostCap
      });
    },
    
    // 地缘政治事件影响系数相关方法
    getGeoPoliticalLevel() {
      if (this.geoPoliticalWeight <= 0.5) {
        return { type: 'success', label: '低影响' };
      } else if (this.geoPoliticalWeight <= 1.2) {
        return { type: 'primary', label: '正常' };
      } else if (this.geoPoliticalWeight <= 1.6) {
        return { type: 'warning', label: '高影响' };
      } else {
        return { type: 'danger', label: '极高影响' };
      }
    },
    
    getGeoPoliticalDescription() {
      if (this.geoPoliticalWeight <= 0.5) {
        return '地缘政治事件对风险评估影响较小，适用于稳定环境';
      } else if (this.geoPoliticalWeight <= 1.2) {
        return '标准影响程度，平衡考虑地缘政治因素';
      } else if (this.geoPoliticalWeight <= 1.6) {
        return '地缘政治事件影响较大，适用于动荡环境';
      } else {
        return '地缘政治事件影响极大，适用于高风险环境';
      }
    },

    // 原材料价格波动敏感度相关方法
    getMarketVolatilityLevel() {
      if (this.marketVolatilityFactor <= 0.4) {
        return { type: 'success', label: '低敏感' };
      } else if (this.marketVolatilityFactor <= 1.0) {
        return { type: 'primary', label: '正常' };
      } else if (this.marketVolatilityFactor <= 1.5) {
        return { type: 'warning', label: '高敏感' };
      } else {
        return { type: 'danger', label: '极敏感' };
      }
    },
    
    getMarketVolatilityDescription() {
      if (this.marketVolatilityFactor <= 0.4) {
        return '对原材料价格变化反应较弱，适用于价格稳定市场';
      } else if (this.marketVolatilityFactor <= 1.0) {
        return '标准敏感度，平衡响应市场价格变化';
      } else if (this.marketVolatilityFactor <= 1.5) {
        return '对价格变化高度敏感，快速调整供应策略';
      } else {
        return '极度敏感，适用于高波动市场环境';
      }
    },

    // 备用供应商覆盖比例相关方法
    getBackupSupplierLevel() {
      if (this.backupSupplierRatio <= 0.2) {
        return { type: 'danger', label: '低保障' };
      } else if (this.backupSupplierRatio <= 0.4) {
        return { type: 'warning', label: '中等' };
      } else if (this.backupSupplierRatio <= 0.6) {
        return { type: 'primary', label: '良好' };
      } else {
        return { type: 'success', label: '高保障' };
      }
    },
    
    getBackupSupplierDescription() {
      if (this.backupSupplierRatio <= 0.2) {
        return '备用供应商覆盖不足，供应风险较高';
      } else if (this.backupSupplierRatio <= 0.4) {
        return '中等程度的供应保障，适用于稳定供应环境';
      } else if (this.backupSupplierRatio <= 0.6) {
        return '良好的供应保障水平，平衡成本与风险';
      } else {
        return '高水平供应保障，适用于高风险环境';
      }
    },

    // 运输路径重评估频率相关方法
    getRouteReevalLevel() {
      if (this.routeReevalFrequency <= 3) {
        return { type: 'danger', label: '高频' };
      } else if (this.routeReevalFrequency <= 7) {
        return { type: 'warning', label: '常规' };
      } else if (this.routeReevalFrequency <= 15) {
        return { type: 'primary', label: '适中' };
      } else {
        return { type: 'success', label: '低频' };
      }
    },
    
    getRouteReevalDescription() {
      if (this.routeReevalFrequency <= 3) {
        return '高频重评估，适用于动态变化的运输环境';
      } else if (this.routeReevalFrequency <= 7) {
        return '常规重评估频率，平衡优化效果与计算成本';
      } else if (this.routeReevalFrequency <= 15) {
        return '适中的重评估频率，适用于相对稳定环境';
      } else {
        return '低频重评估，适用于稳定的运输网络';
      }
    },

    // 成本与延误权衡系数相关方法
    getCostDelayLevel() {
      if (this.costDelayTradeoff <= 0.8) {
        return { type: 'success', label: '成本优先' };
      } else if (this.costDelayTradeoff <= 1.5) {
        return { type: 'primary', label: '平衡' };
      } else if (this.costDelayTradeoff <= 2.2) {
        return { type: 'warning', label: '交期优先' };
      } else {
        return { type: 'danger', label: '极速交付' };
      }
    },
    
    getCostDelayDescription() {
      if (this.costDelayTradeoff <= 0.8) {
        return '优先考虑成本控制，容忍适度延误';
      } else if (this.costDelayTradeoff <= 1.5) {
        return '平衡成本与交期，综合优化决策';
      } else if (this.costDelayTradeoff <= 2.2) {
        return '优先保证交期，愿意承担额外成本';
      } else {
        return '极速交付模式，成本为次要考虑';
      }
    },

    // 生产节拍波动容忍范围相关方法
    getTaktTimeLevel() {
      if (this.taktTimeVariance <= 0.03) {
        return { type: 'danger', label: '严格' };
      } else if (this.taktTimeVariance <= 0.08) {
        return { type: 'warning', label: '标准' };
      } else if (this.taktTimeVariance <= 0.15) {
        return { type: 'primary', label: '宽松' };
      } else {
        return { type: 'success', label: '灵活' };
      }
    },
    
    getTaktTimeDescription() {
      if (this.taktTimeVariance <= 0.03) {
        return '严格控制生产节拍，频繁触发流程调整';
      } else if (this.taktTimeVariance <= 0.08) {
        return '标准节拍控制，平衡稳定性与灵活性';
      } else if (this.taktTimeVariance <= 0.15) {
        return '宽松的节拍控制，减少频繁调整';
      } else {
        return '灵活的节拍管理，适应生产波动';
      }
    },

    // 紧急人力成本上限相关方法
    getOvertimeLevel() {
      if (this.overtimeCostCap <= 100) {
        return { type: 'success', label: '节约' };
      } else if (this.overtimeCostCap <= 200) {
        return { type: 'primary', label: '标准' };
      } else if (this.overtimeCostCap <= 350) {
        return { type: 'warning', label: '充足' };
      } else {
        return { type: 'danger', label: '充裕' };
      }
    },
    
    getOvertimeDescription() {
      if (this.overtimeCostCap <= 100) {
        return '严格控制加班成本，优先通过流程优化解决问题';
      } else if (this.overtimeCostCap <= 200) {
        return '标准加班预算，平衡成本与应急能力';
      } else if (this.overtimeCostCap <= 350) {
        return '充足的应急人力预算，快速响应突发需求';
      } else {
        return '充裕的人力成本预算，优先保证生产连续性';
      }
    },
    
    applySettings() {
      const allParams = {
        geoPoliticalWeight: this.geoPoliticalWeight,
        marketVolatilityFactor: this.marketVolatilityFactor,
        backupSupplierRatio: this.backupSupplierRatio,
        routeReevalFrequency: this.routeReevalFrequency,
        costDelayTradeoff: this.costDelayTradeoff,
        taktTimeVariance: this.taktTimeVariance,
        overtimeCostCap: this.overtimeCostCap
      };
      
      this.$emit('apply-settings', allParams);
      this.$message.success('神经网络参数已全部应用');
    },
    
    resetSettings() {
      this.geoPoliticalWeight = 1.0;
      this.marketVolatilityFactor = 0.8;
      this.backupSupplierRatio = 0.3;
      this.routeReevalFrequency = 7;
      this.costDelayTradeoff = 1.2;
      this.taktTimeVariance = 0.05;
      this.overtimeCostCap = 200;
      this.handleParameterChange();
      this.$message.info('所有参数已重置为默认值');
    }
  }
}
</script>

<style scoped>
.neural-settings-card {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
}

.settings-content {
  padding: 10px 0;
}

.settings-description {
  margin-bottom: 20px;
  text-align: center;
}

.settings-description p {
  color: #606266;
  font-size: 14px;
  margin: 0;
}

.parameter-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 3px solid #409EFF;
  background-color: #f0f9ff;
  padding: 8px 0 8px 15px;
  border-radius: 4px;
}

.parameter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.parameter-item {
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.parameter-item:hover {
  border-color: #409EFF;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .parameter-grid {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 10px;
  }
}

@media (max-width: 900px) {
  .parameter-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 8px;
  }
}

@media (max-width: 720px) {
  .parameter-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .neural-settings-card {
    max-width: 800px;
  }
  
  .parameter-item {
    min-height: 100px;
    padding: 6px;
  }
}

@media (max-width: 480px) {
  .neural-settings-card {
    max-width: 100%;
    margin: 0;
  }
  
  .parameter-grid {
    gap: 6px;
  }
  
  .parameter-item {
    min-height: 90px;
    padding: 6px;
  }
  
  .parameter-control {
    margin-bottom: 4px;
  }
  
  .label-text {
    font-size: 11px;
    line-height: 1.2;
  }
  
  .desc-text {
    font-size: 9px;
    line-height: 1.2;
  }
  
  .parameter-label {
    margin-bottom: 6px;
    min-height: 16px;
  }
}

.parameter-label {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  min-height: 20px;
}

.label-text {
  font-weight: 600;
  color: #303133;
  font-size: 12px;
  line-height: 1.3;
  flex: 1;
}

.help-icon {
  margin-left: 6px;
  color: #909399;
  cursor: help;
  font-size: 14px;
  flex-shrink: 0;
}

.help-icon:hover {
  color: #409EFF;
}

.parameter-control {
  margin-bottom: 6px;
}

.weight-slider {
  margin: 0 5px;
}

.parameter-description {
  margin-top: 6px;
  padding: 4px 6px;
  background-color: #f0f9ff;
  border-radius: 3px;
  border-left: 3px solid #409EFF;
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.desc-text {
  font-size: 10px;
  color: #606266;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.settings-actions {
  margin-top: 25px;
  text-align: center;
  padding: 20px 0 10px 0;
  border-top: 1px solid #ebeef5;
  background-color: #fafafa;
  border-radius: 0 0 6px 6px;
  margin-left: -10px;
  margin-right: -10px;
  margin-bottom: -10px;
}

.settings-actions .el-button {
  margin: 0 10px;
  min-width: 100px;
  padding: 10px 20px;
  font-weight: 600;
}

.settings-actions .el-button--primary {
  background: linear-gradient(135deg, #409EFF, #66b1ff);
  border: none;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.settings-actions .el-button--primary:hover {
  background: linear-gradient(135deg, #66b1ff, #409EFF);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

/* 滑块样式调整 */
.neural-settings-card :deep(.el-slider__runway) {
  background-color: #e4e7ed;
}

.neural-settings-card :deep(.el-slider__bar) {
  background-color: #409EFF;
}

.neural-settings-card :deep(.el-slider__button) {
  border-color: #409EFF;
}

.neural-settings-card :deep(.el-slider__button:hover) {
  border-color: #66b1ff;
}

/* 输入框样式 */
.neural-settings-card :deep(.el-input-number) {
  width: 100%;
}

.neural-settings-card :deep(.el-input-number .el-input__inner) {
  text-align: center;
}

/* Mini尺寸组件优化 */
.neural-settings-card :deep(.el-input-number--mini .el-input__inner) {
  height: 24px;
  line-height: 24px;
  font-size: 11px;
  padding: 0 8px;
}

.neural-settings-card :deep(.el-input--mini .el-input__inner) {
  height: 24px;
  line-height: 24px;
  font-size: 11px;
  padding: 0 8px;
}

.neural-settings-card :deep(.el-tag--mini) {
  height: 20px;
  line-height: 18px;
  font-size: 10px;
  padding: 0 6px;
}

.neural-settings-card :deep(.el-slider--mini) {
  margin: 0 3px;
}

.weight-tag {
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}
</style> 