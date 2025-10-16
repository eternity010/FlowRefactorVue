<template>
  <div class="purchase-refactor2-container">
    <!-- 顶部标题 -->
    <div class="header">
      <el-page-header @back="goBack" content="供应商画像分析" />
    </div>

    <!-- 操作按钮卡片 -->
    <el-card class="action-card">
      <template #header>
        <div class="card-header">
          <i class="el-icon-setting"></i>
          <span>操作面板</span>
        </div>
      </template>
      <div class="action-section">
        <div class="action-buttons">
          <el-button
            type="primary"
            icon="el-icon-refresh"
            @click="loadSupplierClassifications"
            :loading="loading"
          >
            刷新数据
          </el-button>
          <el-button
            type="primary"
            size="large"
            icon="el-icon-data-analysis"
            @click="analyzeSupplierProfile"
          >
            分析供应商画像
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 供应商分类数据展示区域 -->
    <div class="supplier-classification-section" v-if="showSupplierData">
      <el-card>
        <template #header>
          <div class="card-header">
            <i class="el-icon-data-board"></i>
            <span>供应商稳定性分类</span>
            <div class="header-actions">
              <el-tag :type="getClassificationTagType('高稳定')" size="small">
                高稳定: {{ classificationSummary.高稳定 || 0 }}
              </el-tag>
              <el-tag :type="getClassificationTagType('中稳定')" size="small">
                中稳定: {{ classificationSummary.中稳定 || 0 }}
              </el-tag>
              <el-tag :type="getClassificationTagType('低稳定')" size="small">
                低稳定: {{ classificationSummary.低稳定 || 0 }}
              </el-tag>
            </div>
          </div>
        </template>
        
        <!-- 供应商类型标签页 -->
        <el-tabs v-model="activeSupplierTab" type="card" @tab-click="handleTabClick">
          <el-tab-pane 
            v-for="category in supplierCategories" 
            :key="category.key"
            :label="category.label" 
            :name="category.key"
          >
            <template #label>
              <span class="tab-label">
                <i :class="category.icon"></i>
                {{ category.label }}
                <el-badge 
                  :value="getCategoryClassificationCount(category.key)" 
                  :max="99" 
                  class="tab-badge"
                />
              </span>
            </template>
            
            <el-table 
              :data="getClassificationsByCategory(category.key)" 
              stripe 
              style="width: 100%"
              :default-sort="{prop: 'classLabel', order: 'ascending'}"
              v-loading="loading"
              empty-text="暂无该类型供应商的分类数据"
            >
              <el-table-column prop="supplierId" label="供应商ID" width="100" />
              
              <el-table-column prop="supplierName" label="供应商名称" width="150" show-overflow-tooltip />
              
              <el-table-column prop="materialCode" label="物料编码" width="150">
                <template #default="scope">
                  <el-tag size="mini" type="info">{{ scope.row.materialCode }}</el-tag>
                </template>
              </el-table-column>
              
              <el-table-column prop="classLabel" label="稳定性等级" width="120" sortable>
                <template #default="scope">
                  <el-tag :type="getClassificationTagType(scope.row.classLabel)">
                    {{ scope.row.classLabel }}
                  </el-tag>
                </template>
              </el-table-column>
              
              <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip />
              
              <el-table-column prop="createTime" label="创建时间" width="160">
                <template #default="scope">
                  {{ formatDateTime(scope.row.createTime) }}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <!-- 下一步操作区域 -->
    <div class="next-step-section" v-if="showSupplierData">
      <el-card>
        <div class="action-section">
          <div class="action-buttons">
            <el-button
              type="primary"
              size="large"
              icon="el-icon-arrow-right"
              @click="handleNextStep"
              class="next-step-btn"
            >
              下一步
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>
import topic03Api from '@/api/topic03Api';

export default {
  name: 'PurchaseRefactor2',
  data() {
    return {
      nodeId: '',
      nodeTitle: '',
      nodeType: '',
      modelRunBatch: '',
      supplierClassifications: [],
      classificationSummary: {},
      loading: false,
      showSupplierData: false,
      activeSupplierTab: '原材料',
      supplierCategories: [
        {
          key: '原材料',
          label: '原材料',
          icon: 'el-icon-box'
        },
        {
          key: '机电部件',
          label: '机电部件',
          icon: 'el-icon-cpu'
        },
        {
          key: '系统模块',
          label: '系统模块',
          icon: 'el-icon-connection'
        }
      ],
      supplierInfo: {} // 存储供应商基本信息
    };
  },
  created() {
    // 获取路由参数
    this.nodeId = this.$route.query.nodeId || '';
    this.nodeTitle = this.$route.query.nodeTitle || '';
    this.nodeType = this.$route.query.nodeType || '';
    this.modelRunBatch = this.$route.query.modelRunBatch || '2025-10-12_TSY_HSR_01';
    
    console.log('📋 供应商画像页面参数:', {
      nodeId: this.nodeId,
      nodeTitle: this.nodeTitle,
      nodeType: this.nodeType,
      modelRunBatch: this.modelRunBatch
    });
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },

    // 加载供应商分类数据
    async loadSupplierClassifications() {
      try {
        this.loading = true;
        console.log('🔍 开始加载供应商分类数据, 批次:', this.modelRunBatch);
        
        // 同时加载供应商分类数据和供应商基本信息
        const [classificationResponse, supplierResponse] = await Promise.all([
          topic03Api.getSupplierClassifications(this.modelRunBatch),
          this.loadSupplierInfo()
        ]);
        
        if (classificationResponse.success) {
          this.supplierClassifications = classificationResponse.data.records || [];
          
          // 为分类数据添加供应商名称和类别信息
          this.enrichClassificationData();
          
          // 计算分类汇总
          this.calculateClassificationSummary();
          
          console.log('✅ 供应商分类数据加载成功:', {
            total: this.supplierClassifications.length,
            summary: this.classificationSummary
          });
          
          this.$message({
            message: `成功加载 ${this.supplierClassifications.length} 条供应商分类数据`,
            type: 'success',
            duration: 2000
          });
        } else {
          console.error('❌ 供应商分类数据加载失败:', classificationResponse.error);
          this.$message({
            message: classificationResponse.error || '加载供应商分类数据失败',
            type: 'error',
            duration: 3000
          });
        }
      } catch (error) {
        console.error('❌ 加载供应商分类数据异常:', error);
        this.$message({
          message: '加载数据时发生异常',
          type: 'error',
          duration: 3000
        });
      } finally {
        this.loading = false;
      }
    },

    // 加载供应商基本信息
    async loadSupplierInfo() {
      try {
        // 这里应该调用获取供应商基本信息的API
        // 暂时使用硬编码数据模拟
        this.supplierInfo = {
          3101: { name: '唐山精工材料', category: '原材料' },
          3104: { name: '宝钢股份', category: '原材料' },
          3105: { name: '鞍钢股份', category: '原材料' },
          3102: { name: '渤海传动', category: '机电部件' },
          3107: { name: '中车电机', category: '机电部件' },
          3108: { name: '湘潭电机', category: '机电部件' },
          3103: { name: '京津轨道部件', category: '系统模块' },
          3111: { name: '康尼机电', category: '系统模块' },
          3112: { name: '法维莱中国', category: '系统模块' }
        };
        return { success: true };
      } catch (error) {
        console.error('❌ 加载供应商信息失败:', error);
        return { success: false, error: error.message };
      }
    },

    // 为分类数据添加供应商信息
    enrichClassificationData() {
      this.supplierClassifications = this.supplierClassifications.map(item => {
        const supplierInfo = this.supplierInfo[item.supplierId] || {};
        return {
          ...item,
          supplierName: supplierInfo.name || `供应商${item.supplierId}`,
          supplierCategory: supplierInfo.category || '未分类'
        };
      });
    },

    // 计算分类汇总
    calculateClassificationSummary() {
      const summary = {};
      this.supplierClassifications.forEach(item => {
        const label = item.classLabel || '未分类';
        summary[label] = (summary[label] || 0) + 1;
      });
      this.classificationSummary = summary;
    },

    // 获取分类标签类型
    getClassificationTagType(classLabel) {
      const typeMap = {
        '高稳定': 'success',
        '中稳定': 'warning',
        '低稳定': 'danger'
      };
      return typeMap[classLabel] || 'info';
    },

    // 格式化日期时间
    formatDateTime(dateTime) {
      if (!dateTime) return '-';
      return new Date(dateTime).toLocaleString('zh-CN');
    },

    // 分析供应商画像 - 模拟加载并显示供应商分类数据
    async analyzeSupplierProfile() {
      console.log('🔍 开始分析供应商画像');
      console.log('📊 当前批次:', this.modelRunBatch);
      console.log('🎯 节点信息:', {
        nodeId: this.nodeId,
        nodeTitle: this.nodeTitle,
        nodeType: this.nodeType
      });

      // 显示加载状态
      this.$message({
        message: '正在分析供应商画像，请稍候...',
        type: 'info',
        duration: 1000
      });

      // 如果还没有数据，先加载数据
      if (this.supplierClassifications.length === 0) {
        try {
          this.loading = true;
          console.log('🔄 分析前先加载供应商分类数据');

          // 同时加载供应商分类数据和供应商基本信息
          const [classificationResponse, supplierResponse] = await Promise.all([
            topic03Api.getSupplierClassifications(this.modelRunBatch),
            this.loadSupplierInfo()
          ]);

          if (classificationResponse.success) {
            this.supplierClassifications = classificationResponse.data.records || [];
            
            // 为分类数据添加供应商名称和类别信息
            this.enrichClassificationData();
            
            this.calculateClassificationSummary();

            console.log('✅ 数据加载完成，准备显示');
          } else {
            this.$message({
              message: classificationResponse.error || '数据加载失败',
              type: 'error',
              duration: 3000
            });
            return;
          }
        } catch (error) {
          console.error('❌ 数据加载异常:', error);
          this.$message({
            message: '数据加载时发生异常',
            type: 'error',
            duration: 3000
          });
          return;
        } finally {
          this.loading = false;
        }
      }

      // 模拟分析过程 - 1秒后显示结果
      this.loading = true;

      setTimeout(() => {
        this.loading = false;
        this.showSupplierData = true;

        this.$message({
          message: `供应商画像分析完成！共显示 ${this.supplierClassifications.length} 条分类记录`,
          type: 'success',
          duration: 3000
        });
      }, 1000);
    },

    // 根据供应商类别筛选分类数据
    getClassificationsByCategory(category) {
      return this.supplierClassifications.filter(item => 
        item.supplierCategory === category
      );
    },

    // 获取指定类别的分类数量
    getCategoryClassificationCount(category) {
      return this.getClassificationsByCategory(category).length;
    },

    // 标签页点击事件
    handleTabClick(tab) {
      console.log('🏷️ 切换到标签页:', tab.name);
      this.activeSupplierTab = tab.name;
    },

    // 下一步操作
    handleNextStep() {
      console.log('➡️ 进入下一步操作 - 跳转到 PurchaseRefactor3');
      console.log('📋 当前节点信息:', {
        nodeId: this.nodeId,
        nodeTitle: this.nodeTitle,
        nodeType: this.nodeType,
        modelRunBatch: this.modelRunBatch
      });

      // 跳转到 PurchaseRefactor3 页面
      this.$router.push({
        name: 'PurchaseRefactor3',
        query: {
          nodeId: this.nodeId,
          nodeTitle: this.nodeTitle,
          nodeType: this.nodeType,
          modelRunBatch: this.modelRunBatch
        }
      });
    }
  }
};
</script>

<style scoped>
.purchase-refactor2-container {
  padding: 20px;
  height: 100%;
  background: #f5f7fa;
}

.header {
  margin-bottom: 20px;
}

.action-card {
  margin-bottom: 20px;
}

.action-section {
  padding: 20px 0;
}

.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.action-buttons .el-button--large {
  min-width: 200px;
  height: 50px;
  font-size: 16px;
  font-weight: 500;
}

.card-header {
  font-weight: 600;
  color: #409eff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-header i {
  font-size: 18px;
}

.supplier-classification-section {
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tab-label i {
  font-size: 14px;
}

.tab-badge {
  margin-left: 4px;
}

.el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.el-tabs--card > .el-tabs__header .el-tabs__item {
  border-left: 1px solid #e4e7ed;
  border-top: none;
  border-bottom: none;
  border-right: none;
}

.el-tabs--card > .el-tabs__header .el-tabs__item:first-child {
  border-left: none;
}

.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  background-color: #409eff;
  color: white;
  border-color: #409eff;
}

.el-tabs__content {
  padding-top: 20px;
}

.next-step-section {
  margin-top: 20px;
}

.next-step-btn {
  min-width: 200px;
  height: 50px;
  font-size: 16px;
  font-weight: 500;
}
</style>

