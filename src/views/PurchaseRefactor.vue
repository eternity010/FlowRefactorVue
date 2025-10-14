<template>
  <div class="purchase-refactor-container">
    <div class="header">
      <el-page-header @back="goBack" content="采购环节重构" />
    </div>
    
    <!-- 汇总信息卡片 -->
    <el-row :gutter="20" class="summary-section">
      <el-col :span="6">
        <el-card class="summary-card">
          <div class="summary-item">
            <div class="summary-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <i class="el-icon-document"></i>
            </div>
            <div class="summary-content">
              <div class="summary-value">{{ summary.totalOrders }}</div>
              <div class="summary-label">采购订单</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="summary-card">
          <div class="summary-item">
            <div class="summary-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
              <i class="el-icon-box"></i>
            </div>
            <div class="summary-content">
              <div class="summary-value">{{ summary.totalItems }}</div>
              <div class="summary-label">物料明细</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="summary-card">
          <div class="summary-item">
            <div class="summary-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
              <i class="el-icon-coin"></i>
            </div>
            <div class="summary-content">
              <div class="summary-value">¥{{ formatNumber(summary.totalAmount) }}</div>
              <div class="summary-label">总金额</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="summary-card">
          <div class="summary-item">
            <div class="summary-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
              <i class="el-icon-truck"></i>
            </div>
            <div class="summary-content">
              <div class="summary-value">¥{{ formatNumber(summary.totalTransportCost) }}</div>
              <div class="summary-label">运输成本</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 采购订单表格 -->
    <el-card class="table-card">
      <div slot="header" class="card-header">
        <span class="card-title">
          <i class="el-icon-tickets"></i>
          采购订单列表
        </span>
        <el-button type="primary" size="small" @click="loadData">
          <i class="el-icon-refresh"></i>
          刷新数据
        </el-button>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-wrapper">
        <i class="el-icon-loading"></i>
        <p>正在加载采购订单数据...</p>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="error-wrapper">
        <i class="el-icon-warning"></i>
        <p>{{ error }}</p>
        <el-button type="primary" size="small" @click="loadData">重新加载</el-button>
      </div>
      
      <!-- 数据表格 -->
      <el-table
        v-else
        :data="purchaseItems"
        style="width: 100%"
        stripe
        border
        height="600"
        :default-sort="{prop: 'poDate', order: 'descending'}"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div class="expand-content">
              <!-- 订单详细信息 -->
              <div class="order-detail-section">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <div class="expand-section">
                      <h4><i class="el-icon-info"></i> 订单详情</h4>
                      <div class="expand-item">
                        <span class="expand-label">合同编号：</span>
                        <span class="expand-value">{{ scope.row.contractNo }}</span>
                      </div>
                      <div class="expand-item">
                        <span class="expand-label">采购组织：</span>
                        <span class="expand-value">{{ scope.row.buyerOrg }}</span>
                      </div>
                      <div class="expand-item">
                        <span class="expand-label">采购员：</span>
                        <span class="expand-value">{{ scope.row.buyerName }}</span>
                      </div>
                      <div class="expand-item">
                        <span class="expand-label">项目编码：</span>
                        <span class="expand-value">{{ scope.row.projectCode }}</span>
                      </div>
                      <div class="expand-item">
                        <span class="expand-label">税率：</span>
                        <span class="expand-value">{{ scope.row.taxRate }}%</span>
                      </div>
                    </div>
                  </el-col>
                  
                  <el-col :span="12">
                    <div class="expand-section">
                      <h4><i class="el-icon-truck"></i> 物流信息</h4>
                      <div class="expand-item">
                        <span class="expand-label">送货地址：</span>
                        <span class="expand-value">{{ scope.row.deliveryAddr }}</span>
                      </div>
                      <div class="expand-item">
                        <span class="expand-label">运输方式：</span>
                        <span class="expand-value">
                          <el-tag size="mini" type="info">{{ scope.row.transportMode }}</el-tag>
                        </span>
                      </div>
                      <div class="expand-item">
                        <span class="expand-label">运输成本：</span>
                        <span class="expand-value" style="color: #e6a23c;">
                          ¥{{ formatNumber(scope.row.transportCost) }}
                        </span>
                      </div>
                      <div class="expand-item">
                        <span class="expand-label">发货时间：</span>
                        <span class="expand-value">
                          {{ scope.row.shipTime ? formatDateTime(scope.row.shipTime) : '未发货' }}
                        </span>
                      </div>
                      <div class="expand-item">
                        <span class="expand-label">到货时间：</span>
                        <span class="expand-value">
                          {{ scope.row.arrivalTime ? formatDateTime(scope.row.arrivalTime) : '未到货' }}
                        </span>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                
                <!-- 备注信息 -->
                <div class="expand-section" v-if="scope.row.remark" style="margin-top: 16px;">
                  <h4><i class="el-icon-document"></i> 备注信息</h4>
                  <div class="remark-text">{{ scope.row.remark }}</div>
                </div>
              </div>
              
              <!-- 物料明细表格 -->
              <div class="items-table-section">
                <h4><i class="el-icon-box"></i> 物料明细 (共{{ scope.row.itemCount }}项)</h4>
                <el-table
                  :data="scope.row.items"
                  size="small"
                  border
                  style="width: 100%"
                >
                  <el-table-column type="index" label="行号" width="60" align="center" />
                  <el-table-column prop="materialCode" label="物料编码" width="150" />
                  <el-table-column prop="materialName" label="物料名称" min-width="140" show-overflow-tooltip />
                  <el-table-column prop="specModel" label="规格型号" min-width="160" show-overflow-tooltip />
                  <el-table-column label="数量" width="110" align="right">
                    <template slot-scope="itemScope">
                      {{ formatNumber(itemScope.row.qty) }} {{ itemScope.row.unit }}
                    </template>
                  </el-table-column>
                  <el-table-column label="单价" width="110" align="right">
                    <template slot-scope="itemScope">
                      ¥{{ formatNumber(itemScope.row.unitPrice) }}
                    </template>
                  </el-table-column>
                  <el-table-column label="金额" width="120" align="right">
                    <template slot-scope="itemScope">
                      <span style="color: #f56c6c; font-weight: bold;">
                        ¥{{ formatNumber(itemScope.row.amount) }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="demandDept" label="需求部门" width="120" />
                  <el-table-column prop="warehouseCode" label="收货仓库" width="130" />
                </el-table>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column type="index" label="序号" width="60" align="center" />
        
        <el-table-column prop="poNo" label="采购订单号" width="180" sortable>
          <template slot-scope="scope">
            <el-tag type="primary" size="small">{{ scope.row.poNo }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="supplierName" label="供应商" min-width="140" show-overflow-tooltip sortable />
        
        <el-table-column prop="poDate" label="下单日期" width="120" align="center" sortable />
        
        <el-table-column prop="expectedArrival" label="预计到货" width="120" align="center" sortable>
          <template slot-scope="scope">
            <span style="color: #409eff;">{{ scope.row.expectedArrival }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="itemCount" label="物料数" width="90" align="center" sortable>
          <template slot-scope="scope">
            <el-tag size="small" type="info">{{ scope.row.itemCount }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="totalAmount" label="订单金额" width="140" align="right" sortable>
          <template slot-scope="scope">
            <span style="color: #f56c6c; font-weight: bold; font-size: 15px;">
              ¥{{ formatNumber(scope.row.totalAmount) }}
            </span>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="订单状态" width="100" align="center" sortable>
          <template slot-scope="scope">
            <el-tag 
              :type="getStatusType(scope.row.status)" 
              size="small"
            >
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="priority" label="优先级" width="90" align="center" sortable>
          <template slot-scope="scope">
            <el-tag 
              :type="getPriorityType(scope.row.priority)" 
              size="small"
            >
              {{ scope.row.priority }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 供应商信息标签页 -->
    <el-card class="table-card supplier-tabs-card">
      <div slot="header" class="card-header">
        <span class="card-title">
          <i class="el-icon-office-building"></i>
          供应商信息
        </span>
        <el-button type="primary" size="small" @click="loadSuppliersData">
          <i class="el-icon-refresh"></i>
          刷新供应商数据
        </el-button>
        </div>
        
      <!-- 供应商汇总信息卡片 -->
      <el-row :gutter="20" class="supplier-summary-section">
        <el-col :span="6">
          <el-card class="summary-card">
            <div class="summary-item">
              <div class="summary-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <i class="el-icon-office-building"></i>
              </div>
              <div class="summary-content">
                <div class="summary-value">{{ supplierSummary.totalSuppliers }}</div>
                <div class="summary-label">供应商总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="summary-card">
            <div class="summary-item">
              <div class="summary-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                <i class="el-icon-menu"></i>
              </div>
              <div class="summary-content">
                <div class="summary-value">{{ supplierSummary.categoryCount }}</div>
                <div class="summary-label">供应商类别</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="summary-card">
            <div class="summary-item">
              <div class="summary-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                <i class="el-icon-check"></i>
              </div>
              <div class="summary-content">
                <div class="summary-value">{{ formatPercentage(supplierSummary.avgOnTimeRate) }}</div>
                <div class="summary-label">平均准时率</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="summary-card">
            <div class="summary-item">
              <div class="summary-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                <i class="el-icon-box"></i>
              </div>
              <div class="summary-content">
                <div class="summary-value">{{ supplierSummary.totalMaterials }}</div>
                <div class="summary-label">物料能力总数</div>
              </div>
        </div>
      </el-card>
        </el-col>
      </el-row>

      <!-- 供应商分类标签页 -->
      <div class="supplier-tabs-container">
        <!-- 加载状态 -->
        <div v-if="suppliersLoading" class="loading-wrapper">
          <i class="el-icon-loading"></i>
          <p>正在加载供应商数据...</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="suppliersError" class="error-wrapper">
          <i class="el-icon-warning"></i>
          <p>{{ suppliersError }}</p>
          <el-button type="primary" size="small" @click="loadSuppliersData">重新加载</el-button>
        </div>

        <!-- 供应商标签页 -->
        <el-tabs v-else type="border-card" class="supplier-tabs">
          <el-tab-pane 
            v-for="(suppliers, category) in supplierCategories" 
            :key="category"
            :name="category"
          >
            <span slot="label">
              <i class="el-icon-folder-opened"></i>
              {{ category }} ({{ suppliers.length }})
            </span>

            <!-- 该类别供应商表格 -->
            <el-table
              :data="suppliers"
              style="width: 100%"
              stripe
              border
              :default-sort="{prop: 'creditRating', order: 'descending'}"
            >
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <div class="expand-content">
                    <!-- 供应商详细信息 -->
                    <div class="supplier-detail-section">
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <div class="expand-section">
                            <h4><i class="el-icon-info"></i> 供应商详情</h4>
                            <div class="expand-item">
                              <span class="expand-label">供应商编码：</span>
                              <span class="expand-value">{{ scope.row.supplierCode }}</span>
                            </div>
                            <div class="expand-item">
                              <span class="expand-label">供应商ID：</span>
                              <span class="expand-value">{{ scope.row.supplierId }}</span>
                            </div>
                            <div class="expand-item">
                              <span class="expand-label">所在区域：</span>
                              <span class="expand-value">{{ scope.row.region }}</span>
                            </div>
                            <div class="expand-item">
                              <span class="expand-label">付款条款：</span>
                              <span class="expand-value">{{ scope.row.paymentTerm }}</span>
                            </div>
                            <div class="expand-item">
                              <span class="expand-label">平均交期：</span>
                              <span class="expand-value">{{ scope.row.avgLeadTime || 0 }} 天</span>
                            </div>
                          </div>
                        </el-col>
                        
                        <el-col :span="12">
                          <div class="expand-section">
                            <h4><i class="el-icon-phone"></i> 联系信息</h4>
                            <div class="expand-item">
                              <span class="expand-label">联系人：</span>
                              <span class="expand-value">{{ scope.row.contactName }}</span>
                            </div>
                            <div class="expand-item">
                              <span class="expand-label">联系电话：</span>
                              <span class="expand-value">{{ scope.row.contactPhone }}</span>
                            </div>
                            <div class="expand-item">
                              <span class="expand-label">邮箱地址：</span>
                              <span class="expand-value">{{ scope.row.contactEmail }}</span>
                            </div>
                            <div class="expand-item">
                              <span class="expand-label">准时交付率：</span>
                              <span class="expand-value" style="color: #67c23a;">
                                {{ formatPercentage(scope.row.avgOnTimeRate) }}
                              </span>
                            </div>
                            <div class="expand-item">
                              <span class="expand-label">不良率：</span>
                              <span class="expand-value" style="color: #f56c6c;">
                                {{ formatPercentage(scope.row.avgDefectRate) }}
                              </span>
                            </div>
                          </div>
                        </el-col>
                      </el-row>
                      
                      <!-- 备注信息 -->
                      <div class="expand-section" v-if="scope.row.remark" style="margin-top: 16px;">
                        <h4><i class="el-icon-document"></i> 备注信息</h4>
                        <div class="remark-text">{{ scope.row.remark }}</div>
                      </div>
                    </div>
                    
                    <!-- 物料能力表格 -->
                    <div class="materials-table-section">
                      <h4><i class="el-icon-goods"></i> 物料供应能力 (共{{ scope.row.materialCount }}项)</h4>
                      <el-table
                        :data="scope.row.materials"
                        size="small"
                        border
                        style="width: 100%"
                      >
                        <el-table-column type="index" label="序号" width="60" align="center" />
                        <el-table-column prop="materialCode" label="物料编码" width="150" />
                        <el-table-column label="平均价格" width="120" align="right">
                          <template slot-scope="materialScope">
                            ¥{{ formatNumber(materialScope.row.avgPrice) }}
                          </template>
                        </el-table-column>
                        <el-table-column label="价格区间" width="180" align="center">
                          <template slot-scope="materialScope">
                            ¥{{ formatNumber(materialScope.row.priceRangeMin) }} ~ 
                            ¥{{ formatNumber(materialScope.row.priceRangeMax) }}
                          </template>
                        </el-table-column>
                        <el-table-column prop="leadTimeDays" label="交期(天)" width="90" align="center" />
                        <el-table-column label="准时率" width="90" align="center">
                          <template slot-scope="materialScope">
                            <span style="color: #67c23a;">{{ formatPercentage(materialScope.row.onTimeRate) }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="不良率" width="90" align="center">
                          <template slot-scope="materialScope">
                            <span style="color: #f56c6c;">{{ formatPercentage(materialScope.row.defectRate) }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="capacityLevel" label="供货能力" width="100" align="center">
                          <template slot-scope="materialScope">
                            <el-tag 
                              :type="getCapacityLevelType(materialScope.row.capacityLevel)" 
                              size="small"
                            >
                              {{ materialScope.row.capacityLevel }}
                            </el-tag>
                          </template>
                        </el-table-column>
                        <el-table-column prop="transportMode" label="运输方式" width="100" align="center" />
                        <el-table-column label="运输成本" width="120" align="right">
                          <template slot-scope="materialScope">
                            ¥{{ formatNumber(materialScope.row.avgTransportCost) }}
                          </template>
                        </el-table-column>
                      </el-table>
    </div>
                  </div>
                </template>
              </el-table-column>
              
              <el-table-column type="index" label="序号" width="60" align="center" />
              
              <el-table-column prop="supplierName" label="供应商名称" min-width="140" show-overflow-tooltip sortable />
              
              <el-table-column prop="creditRating" label="信用评级" width="100" align="center" sortable>
                <template slot-scope="scope">
                  <el-tag 
                    :type="getCreditRatingType(scope.row.creditRating)" 
                    size="small"
                  >
                    {{ scope.row.creditRating }}
                  </el-tag>
                </template>
              </el-table-column>
              
              <el-table-column prop="region" label="所在区域" width="120" align="center" sortable />
              
              <el-table-column prop="materialCount" label="物料数" width="90" align="center" sortable>
                <template slot-scope="scope">
                  <el-tag size="small" type="info">{{ scope.row.materialCount }}</el-tag>
                </template>
              </el-table-column>
              
              <el-table-column label="准时交付率" width="120" align="center" sortable>
                <template slot-scope="scope">
                  <span style="color: #67c23a; font-weight: bold;">
                    {{ formatPercentage(scope.row.avgOnTimeRate) }}
                  </span>
                </template>
              </el-table-column>
              
              <el-table-column label="不良率" width="100" align="center" sortable>
                <template slot-scope="scope">
                  <span style="color: #f56c6c; font-weight: bold;">
                    {{ formatPercentage(scope.row.avgDefectRate) }}
                  </span>
                </template>
              </el-table-column>
              
              <el-table-column prop="contactName" label="联系人" width="100" align="center" />
              
              <el-table-column prop="paymentTerm" label="付款条款" width="120" align="center" show-overflow-tooltip />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

    <!-- 下一步操作按钮区域 -->
    <el-card class="action-buttons-card">
      <div class="action-buttons-container">
        <div class="action-buttons-header">
          <h3>
            <i class="el-icon-right"></i>
            下一步操作
          </h3>
        </div>

        <div class="next-step-button-wrapper">
          <el-button 
            type="primary" 
            size="large" 
            class="next-step-button"
            @click="handleSupplierProfile"
          >
            <i class="el-icon-user"></i>
            获取供应商画像
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import topic04Api from '@/api/topic04Api';

export default {
  name: 'PurchaseRefactor',
  data() {
    return {
      modelRunBatch: '2025-10-12_TSY_HSR_01',
      loading: false,
      error: null,
      purchaseItems: [],
      summary: {
        totalOrders: 0,
        totalItems: 0,
        totalAmount: 0,
        totalTransportCost: 0,
        totalCost: 0,
        statusCounts: {}
      },
      // 供应商相关数据
      suppliersLoading: false,
      suppliersError: null,
      suppliers: [],
      supplierCategories: {},
      supplierSummary: {
        totalSuppliers: 0,
        totalMaterials: 0,
        avgOnTimeRate: 0,
        avgDefectRate: 0,
        categoryCount: 0,
        categoryCounts: {}
      }
    };
  },
  created() {
    this.loadData();
    this.loadSuppliersData();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    
    async loadData() {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('🔄 开始加载采购订单数据...');
        const response = await topic04Api.getPurchaseOrders(this.modelRunBatch);
        
        if (response.success) {
          this.purchaseItems = response.data.records || [];
          this.summary = response.data.summary || this.summary;
          
          console.log('✅ 采购订单数据加载成功:', {
            total: this.purchaseItems.length,
            summary: this.summary
          });
          
          this.$message.success(`成功加载 ${this.purchaseItems.length} 个采购订单`);
        } else {
          throw new Error(response.error || '加载数据失败');
        }
      } catch (error) {
        console.error('❌ 加载采购订单数据失败:', error);
        this.error = error.message || '加载数据失败，请稍后重试';
        this.$message.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async loadSuppliersData() {
      this.suppliersLoading = true;
      this.suppliersError = null;
      
      try {
        console.log('🔄 开始加载供应商数据...');
        const response = await topic04Api.getSuppliers(this.modelRunBatch);
        
        if (response.success) {
          this.suppliers = response.data.records || [];
          this.supplierCategories = response.data.categories || {};
          this.supplierSummary = response.data.summary || this.supplierSummary;
          
          console.log('✅ 供应商数据加载成功:', {
            total: this.suppliers.length,
            categories: Object.keys(this.supplierCategories),
            summary: this.supplierSummary
          });
          
          this.$message.success(`成功加载 ${this.suppliers.length} 个供应商`);
        } else {
          throw new Error(response.error || '加载供应商数据失败');
        }
      } catch (error) {
        console.error('❌ 加载供应商数据失败:', error);
        this.suppliersError = error.message || '加载供应商数据失败，请稍后重试';
        this.$message.error(this.suppliersError);
      } finally {
        this.suppliersLoading = false;
      }
    },
    
    formatNumber(value) {
      if (value === null || value === undefined) return '0';
      return parseFloat(value).toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    
    formatDateTime(dateTimeStr) {
      if (!dateTimeStr) return '-';
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) return dateTimeStr;
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    
    getStatusType(status) {
      const statusMap = {
        '已下单': 'primary',
        '在途': 'warning',
        '完成': 'success',
        '关闭': 'info'
      };
      return statusMap[status] || 'info';
    },
    
    getPriorityType(priority) {
      const priorityMap = {
        '高': 'danger',
        '中': 'warning',
        '低': 'success'
      };
      return priorityMap[priority] || 'info';
    },

    getCreditRatingType(rating) {
      const ratingMap = {
        'A+': 'success',
        'A': 'primary',
        'B': 'warning',
        'C': 'danger'
      };
      return ratingMap[rating] || 'info';
    },

    getCapacityLevelType(level) {
      const levelMap = {
        '高': 'success',
        '中': 'warning',
        '低': 'info'
      };
      return levelMap[level] || 'info';
    },

    formatPercentage(value) {
      if (value === null || value === undefined) return '0%';
      return `${parseFloat(value).toFixed(1)}%`;
    },

    // 下一步操作：获取供应商画像
    handleSupplierProfile() {
      console.log('👤 跳转到供应商画像页面');
      this.$router.push({
        name: 'PurchaseRefactor2',
        query: {
          nodeId: this.$route.query.nodeId || 'PU4',
          nodeTitle: this.$route.query.nodeTitle || '确定工程物料清单（EBOM）',
          nodeType: this.$route.query.nodeType || 'purchase',
          modelRunBatch: this.modelRunBatch
        }
      });
    }
  }
};
</script>

<style scoped>
.purchase-refactor-container {
  padding: 20px;
  height: 100%;
  background: #f5f7fa;
}

.header {
  margin-bottom: 20px;
}

/* 汇总信息样式 */
.summary-section {
  margin-bottom: 20px;
}

.summary-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.summary-card /deep/ .el-card__body {
  padding: 20px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.summary-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  flex-shrink: 0;
}

.summary-content {
  flex: 1;
}

.summary-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.summary-label {
  font-size: 14px;
  color: #909399;
}

/* 表格卡片样式 */
.table-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-title i {
  font-size: 20px;
  color: #409eff;
}

/* 加载和错误状态样式 */
.loading-wrapper,
.error-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #909399;
}

.loading-wrapper i,
.error-wrapper i {
  font-size: 48px;
  margin-bottom: 16px;
}

.loading-wrapper i {
  color: #409eff;
}

.error-wrapper i {
  color: #f56c6c;
}

.loading-wrapper p,
.error-wrapper p {
  font-size: 16px;
  margin: 0 0 16px 0;
}

/* 表格样式优化 */
.el-table /deep/ .el-table__header th {
  background-color: #f5f7fa;
  color: #303133;
  font-weight: 600;
}

.el-table /deep/ .el-table__row:hover {
  background-color: #ecf5ff;
}

/* 展开行样式 */
.expand-content {
  padding: 20px;
  background: linear-gradient(135deg, #fafbfc 0%, #f5f7fa 100%);
  border-radius: 8px;
  margin: 10px;
}

.expand-section {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.expand-section h4 {
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e4e7ed;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.expand-section h4 i {
  color: #409eff;
  font-size: 18px;
}

.expand-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  line-height: 1.8;
}

.expand-item:last-child {
  margin-bottom: 0;
}

.expand-label {
  font-weight: 600;
  color: #606266;
  min-width: 100px;
  flex-shrink: 0;
}

.expand-value {
  color: #303133;
  flex: 1;
  word-break: break-word;
}

/* 订单详情区域 */
.order-detail-section {
  margin-bottom: 20px;
}

.remark-text {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  color: #606266;
  line-height: 1.8;
}

/* 物料明细表格区域 */
.items-table-section {
  margin-top: 20px;
}

.items-table-section h4 {
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e4e7ed;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.items-table-section h4 i {
  color: #67c23a;
  font-size: 18px;
}

.items-table-section .el-table {
  margin-top: 16px;
}

/* 物料明细表格样式 */
.items-table-section /deep/ .el-table__header th {
  background-color: #f0f2f5;
  color: #303133;
  font-weight: 600;
  font-size: 13px;
}

.items-table-section /deep/ .el-table__row:hover {
  background-color: #f5f7fa;
}

/* 供应商标签页样式 */
.supplier-tabs-card {
  margin-top: 20px;
}

.supplier-summary-section {
  margin-bottom: 20px;
}

.supplier-tabs-container {
  margin-top: 20px;
}

.supplier-tabs /deep/ .el-tabs__header {
  margin: 0 0 20px 0;
}

.supplier-tabs /deep/ .el-tabs__item {
  font-weight: 600;
  padding: 0 20px;
}

.supplier-tabs /deep/ .el-tabs__item.is-active {
  color: #409eff;
}

.supplier-tabs /deep/ .el-tabs__content {
  padding: 20px;
}

/* 供应商详情区域 */
.supplier-detail-section {
  margin-bottom: 20px;
}

/* 物料能力表格区域 */
.materials-table-section {
  margin-top: 20px;
}

.materials-table-section h4 {
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e4e7ed;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.materials-table-section h4 i {
  color: #e6a23c;
  font-size: 18px;
}

.materials-table-section .el-table {
  margin-top: 16px;
}

/* 物料能力表格样式 */
.materials-table-section /deep/ .el-table__header th {
  background-color: #f0f2f5;
  color: #303133;
  font-weight: 600;
  font-size: 13px;
}

.materials-table-section /deep/ .el-table__row:hover {
  background-color: #f5f7fa;
}

/* 下一步操作按钮区域样式 */
.action-buttons-card {
  margin-top: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.action-buttons-container {
  padding: 30px;
}

.action-buttons-header {
  text-align: center;
  margin-bottom: 30px;
}

.action-buttons-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.action-buttons-header h3 i {
  font-size: 22px;
  color: #409eff;
}

.next-step-button-wrapper {
  text-align: center;
}

.next-step-button {
  width: 300px;
  height: 80px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
  border: none;
  box-shadow: 0 4px 20px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.next-step-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(64, 158, 255, 0.4);
}

.next-step-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.next-step-button:hover::before {
  left: 100%;
}

.next-step-button i {
  margin-right: 10px;
  font-size: 20px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .summary-section .el-col,
  .supplier-summary-section .el-col {
    margin-bottom: 10px;
  }

  .next-step-button {
    width: 250px;
    height: 70px;
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .purchase-refactor-container {
    padding: 10px;
  }
  
  .summary-icon {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }
  
  .summary-value {
    font-size: 20px;
  }
  
  .card-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
