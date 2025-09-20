<template>
  <div class="operation-refactor-container">
    <div class="page-header">
      <el-page-header @back="goBack" content="运维环节重构" />
    </div>
    
    <div class="content">
      <el-card class="refactor-card">
        <div class="refactor-title">
          <h1>运维环节重构</h1>
          <p class="subtitle">Operation Process Refactoring</p>
        </div>
        
        <div class="node-info" v-if="nodeInfo">
          <el-tag type="info" size="medium">节点ID: {{ nodeInfo.nodeId }}</el-tag>
          <el-tag type="primary" size="medium">节点名称: {{ nodeInfo.nodeTitle }}</el-tag>
        </div>
      </el-card>

      <!-- 进行中的运维订单 -->
      <el-card class="maintenance-orders-card">
        <div slot="header" class="card-header">
          <span class="header-title">
            <i class="el-icon-setting"></i>
            进行中的运维订单
          </span>
          <div class="header-actions">
            <el-button 
              type="primary" 
              size="small" 
              @click="refreshOrders"
              :loading="loading"
              icon="el-icon-refresh">
              刷新数据
            </el-button>
            <el-tag :type="getStatusTagType()" size="medium">
              共 {{ totalOrders }} 条订单
            </el-tag>
          </div>
        </div>

        <!-- 数据加载状态 -->
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="3" animated />
        </div>

        <!-- 空数据状态 -->
        <div v-else-if="!loading && orders.length === 0" class="empty-container">
          <el-empty description="暂无进行中的运维订单">
            <el-button type="primary" @click="refreshOrders">重新加载</el-button>
          </el-empty>
        </div>

        <!-- 运维订单列表 -->
        <div v-else class="orders-container">
          <!-- 统计概览 -->
          <div class="summary-section" v-if="summary">
            <div class="summary-cards">
              <div class="summary-card critical">
                <div class="card-content">
                  <div class="card-number">{{ summary.criticalCount }}</div>
                  <div class="card-label">关键系统</div>
                </div>
                <i class="el-icon-warning card-icon"></i>
              </div>
            </div>
          </div>

          <!-- 筛选器 -->
          <div class="filter-section">
            <el-row :gutter="16">
              <el-col :span="8">
                <el-select v-model="filters.systemModule" placeholder="系统模块" clearable @change="applyFilters">
                  <el-option
                    v-for="system in systemModules"
                    :key="system"
                    :label="system"
                    :value="system">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="filters.maintenanceType" placeholder="维修类型" clearable @change="applyFilters">
                  <el-option label="定检" value="定检"></el-option>
                  <el-option label="临修" value="临修"></el-option>
                  <el-option label="加改修" value="加改修"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-input 
                  v-model="filters.keyword" 
                  placeholder="搜索列车号/故障码" 
                  clearable
                  @clear="applyFilters"
                  @keyup.enter="applyFilters">
                  <el-button slot="append" icon="el-icon-search" @click="applyFilters"></el-button>
                </el-input>
              </el-col>
            </el-row>
          </div>

          <!-- 订单卡片列表 -->
          <div class="orders-list">
            <div 
              v-for="order in paginatedOrders" 
              :key="order.id" 
              class="order-card"
              @click="viewOrderDetail(order)">
              
              <!-- 卡片头部 -->
              <div class="order-header">
                <div class="train-info">
                  <h3 class="train-id">{{ order.train_id }}</h3>
                  <el-tag size="mini" type="info">{{ order.carriage_no }}</el-tag>
                </div>
              </div>

              <!-- 故障信息 -->
              <div class="fault-info">
                <div class="fault-code">
                  <el-tag size="small" type="warning">{{ order.fault_code }}</el-tag>
                  <span class="system-module">{{ order.system_module }}</span>
                </div>
                <p class="fault-description">{{ order.fault_description }}</p>
              </div>

              <!-- 进度信息 -->
              <div class="progress-info">
                <div class="maintenance-type">
                  <i :class="order.typeIcon"></i>
                  {{ order.maintenance_type }}
                </div>
              </div>

              <!-- 责任信息 -->
              <div class="responsibility-info">
                <div class="team">
                  <i class="el-icon-user"></i>
                  {{ order.responsible_team }}
                </div>
                <div class="person">
                  <i class="el-icon-phone"></i>
                  {{ order.responsible_person }}
                </div>
                <div class="location">
                  <i class="el-icon-location"></i>
                  {{ order.station_location }}
                </div>
              </div>

              <!-- 时间信息 -->
              <div class="time-info">
                <div class="time-item">
                  <span class="time-label">报修时间:</span>
                  <span class="time-value">{{ order.formattedReportDate }}</span>
                </div>
                <div class="time-item">
                  <span class="time-label">开始时间:</span>
                  <span class="time-value">{{ order.formattedBeginTime || '未开始' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页器 -->
          <div class="pagination-container" v-if="totalOrders > 0">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalOrders">
            </el-pagination>
          </div>
        </div>
      </el-card>

      <!-- 知识库维修建议 -->
      <el-card class="knowledge-base-card">
        <div class="knowledge-base-section">
          <div class="section-header">
            <h3 class="section-title">
              <i class="el-icon-document"></i>
              智能维修建议
            </h3>
            <p class="section-description">基于知识库为当前运维订单提供专业的维修建议和详细操作指导</p>
          </div>
          
          <div class="knowledge-actions">
            <el-button 
              type="primary" 
              size="large"
              icon="el-icon-search"
              :loading="gettingSuggestions"
              @click="getBatchMaintenanceSuggestions"
              class="suggestion-btn">
              批量获取维修建议
            </el-button>
            
            <el-button 
              type="info" 
              size="large"
              icon="el-icon-view"
              @click="showMaintenanceGuide"
              plain>
              查看维修指南
            </el-button>
            
            <!-- 下一步按钮（与其他按钮在同一行） -->
            <el-button 
              v-if="!batchProcessing && completedCount === orderSuggestions.length && orderSuggestions.length > 0"
              type="success" 
              size="large"
              icon="el-icon-right"
              @click="goToNextStep"
              class="next-step-btn">
              下一步
            </el-button>
          </div>

          <!-- 下一步完成提示 -->
          <div v-if="!batchProcessing && completedCount === orderSuggestions.length && orderSuggestions.length > 0" class="completion-tip">
            <i class="el-icon-success completion-icon"></i>
            <p class="completion-text">所有维修建议已生成完成，可以进行下一步操作</p>
          </div>

          <!-- 批量处理结果展示（可展开窗口） -->
          <div v-if="batchProcessing || orderSuggestions.length > 0" class="batch-suggestions-container">
            <!-- 展开/收起控制 -->
            <div class="batch-header" @click="toggleBatchExpand">
              <div class="batch-header-content">
                <div class="batch-title-section">
                  <i class="el-icon-cpu batch-icon"></i>
                  <h4 class="batch-title">批量获取维修建议</h4>
                  <span v-if="batchProcessing" class="processing-indicator">
                    <i class="el-icon-loading"></i>
                    正在处理中...
                  </span>
                  <el-tag v-else-if="orderSuggestions.length > 0" :type="completedCount === orderSuggestions.length ? 'success' : 'warning'" size="small">
                    {{ completedCount }}/{{ orderSuggestions.length }} 已完成
                  </el-tag>
                </div>
                <div class="expand-control">
                  <i :class="batchExpanded ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="expand-icon"></i>
                </div>
              </div>
            </div>

            <!-- 可展开的内容区域 -->
            <el-collapse-transition>
              <div v-show="batchExpanded" class="batch-content">
                <!-- 订单处理列表 -->
                <div class="order-processing-list">
                  <div 
                    v-for="orderSuggestion in orderSuggestions" 
                    :key="orderSuggestion.orderId"
                    class="order-suggestion-item"
                    :class="{ 
                      'processing': orderSuggestion.status === 'processing',
                      'completed': orderSuggestion.status === 'completed',
                      'pending': orderSuggestion.status === 'pending'
                    }">
                    
                    <div class="order-suggestion-header">
                      <div class="order-info">
                        <el-tag size="mini" type="info">{{ orderSuggestion.trainId }}</el-tag>
                        <span class="order-title">{{ orderSuggestion.faultCode }} - {{ orderSuggestion.systemModule }}</span>
                      </div>
                      <div class="processing-status">
                        <i v-if="orderSuggestion.status === 'pending'" class="el-icon-time status-icon pending"></i>
                        <i v-else-if="orderSuggestion.status === 'processing'" class="el-icon-loading status-icon processing"></i>
                        <i v-else-if="orderSuggestion.status === 'completed'" class="el-icon-success status-icon completed"></i>
                        <span class="status-text">{{ getStatusText(orderSuggestion.status) }}</span>
                      </div>
                    </div>

                    <!-- 处理进度条 -->
                    <div v-if="orderSuggestion.status === 'processing'" class="processing-progress">
                      <el-progress 
                        :percentage="orderSuggestion.progress" 
                        :show-text="false"
                        stroke-width="4"
                        color="#409eff">
                      </el-progress>
                      <span class="progress-text">{{ orderSuggestion.progressText }}</span>
                    </div>

                  </div>
                </div>

                <!-- 批量处理完成统计 -->
                <div v-if="!batchProcessing && orderSuggestions.length > 0" class="batch-summary">
                  <div class="summary-stats">
                    <el-tag type="success">已完成: {{ completedCount }}</el-tag>
                    <el-tag type="info">总计: {{ orderSuggestions.length }}</el-tag>
                  </div>
                </div>
              </div>
            </el-collapse-transition>

          </div>
        </div>
      </el-card>
    </div>

    <!-- 订单详情对话框 -->
    <el-dialog
      title="运维订单详情"
      :visible.sync="detailDialogVisible"
      width="60%"
      :before-close="closeDetailDialog">
      <div v-if="selectedOrder" class="order-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单ID">{{ selectedOrder.id }}</el-descriptions-item>
          <el-descriptions-item label="维修编码">{{ selectedOrder.repair_code }}</el-descriptions-item>
          <el-descriptions-item label="列车编号">{{ selectedOrder.train_id }}</el-descriptions-item>
          <el-descriptions-item label="车厢号">{{ selectedOrder.carriage_no }}</el-descriptions-item>
          <el-descriptions-item label="故障代码">{{ selectedOrder.fault_code }}</el-descriptions-item>
          <el-descriptions-item label="系统模块">{{ selectedOrder.system_module }}</el-descriptions-item>
          <el-descriptions-item label="维修类型">{{ selectedOrder.maintenance_type }}</el-descriptions-item>
          <el-descriptions-item label="故障描述" :span="2">{{ selectedOrder.fault_description }}</el-descriptions-item>
          <el-descriptions-item label="报修内容" :span="2">{{ selectedOrder.report_content }}</el-descriptions-item>
          <el-descriptions-item label="报修人">{{ selectedOrder.reporter }}</el-descriptions-item>
          <el-descriptions-item label="责任班组">{{ selectedOrder.responsible_team }}</el-descriptions-item>
          <el-descriptions-item label="责任人">{{ selectedOrder.responsible_person }}</el-descriptions-item>
          <el-descriptions-item label="联系方式">{{ selectedOrder.responsible_contact }}</el-descriptions-item>
          <el-descriptions-item label="所在位置">{{ selectedOrder.station_location }}</el-descriptions-item>
          <el-descriptions-item label="报修时间">{{ selectedOrder.formattedReportDate }}</el-descriptions-item>
          <el-descriptions-item label="派工时间">{{ selectedOrder.formattedReceiveTime }}</el-descriptions-item>
          <el-descriptions-item label="开始时间">{{ selectedOrder.formattedBeginTime }}</el-descriptions-item>
          <el-descriptions-item label="上次维保">{{ selectedOrder.formattedLastMaintenanceDate }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ selectedOrder.remark || '无' }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDetailDialog">关闭</el-button>
        <el-button type="primary" @click="closeDetailDialog">确定</el-button>
      </div>
    </el-dialog>

    <!-- 知识库说明对话框 -->
    <el-dialog
      title="知识库说明"
      :visible.sync="knowledgeBaseInfoVisible"
      width="50%">
      <div class="knowledge-base-info">
        <div class="info-section">
          <h4><i class="el-icon-info"></i> 功能介绍</h4>
          <p>智能维修建议系统基于海量的历史维修数据和专家经验，为当前运维订单提供个性化的维修指导和建议。</p>
        </div>
        
        <div class="info-section">
          <h4><i class="el-icon-cpu"></i> 工作原理</h4>
          <ul>
            <li>分析当前运维订单的故障类型、系统模块等关键信息</li>
            <li>匹配知识库中的相似案例和最佳实践</li>
            <li>结合历史维修成功率生成可信度评分</li>
            <li>提供分步骤的详细维修指导</li>
          </ul>
        </div>
        
        <div class="info-section">
          <h4><i class="el-icon-star-on"></i> 建议分级</h4>
          <div class="priority-levels">
            <div class="priority-item">
              <el-tag type="danger" size="small">高</el-tag>
              <span>紧急且重要的维修建议，需要优先处理</span>
            </div>
            <div class="priority-item">
              <el-tag type="warning" size="small">中</el-tag>
              <span>重要的维修建议，建议及时处理</span>
            </div>
            <div class="priority-item">
              <el-tag type="success" size="small">低</el-tag>
              <span>一般性建议，可根据情况安排处理</span>
            </div>
          </div>
        </div>
        
        <div class="info-section">
          <h4><i class="el-icon-warning"></i> 注意事项</h4>
          <ul>
            <li>建议仅供参考，实际操作请遵循标准作业程序</li>
            <li>对于高风险操作，请务必由专业技术人员执行</li>
            <li>如有疑问，请及时联系技术支持团队</li>
          </ul>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="knowledgeBaseInfoVisible = false">知道了</el-button>
      </div>
    </el-dialog>

    <!-- 维修指南弹窗 -->
    <el-dialog
      title="维修指南"
      :visible.sync="maintenanceGuideVisible"
      width="70%"
      :before-close="() => maintenanceGuideVisible = false">
      <div class="maintenance-guide-content">
        <div class="guide-header">
          <h3><i class="el-icon-tools"></i> 转向架悬挂装置检修指南</h3>
          <p class="guide-description">完整的维修检修操作指导和技术规范</p>
        </div>

        <div v-if="guideContent.length === 0" class="loading-guide">
          <el-skeleton :rows="3" animated />
        </div>

        <div v-else class="guide-list">
          <!-- 使用独立的维修指南组件 -->
          <MaintenanceGuide />
        </div>
      </div>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="maintenanceGuideVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { topic04Api } from '@/services';
import MaintenanceGuide from '@/components/MaintenanceGuide.vue';

export default {
  name: 'OperationRefactor',
  components: {
    MaintenanceGuide
  },
  data() {
    return {
      nodeInfo: null,
      // 运维订单数据
      orders: [],
      originalOrders: [], // 保存原始数据用于筛选
      filteredOrders: [], // 筛选后的数据
      loading: false,
      summary: null,
      totalOrders: 0,
      
      // 筛选器
      filters: {
        systemModule: '',
        maintenanceType: '',
        keyword: ''
      },
      systemModules: [], // 系统模块选项
      
      // 分页
      currentPage: 1,
      pageSize: 10,
      
      // 详情对话框
      detailDialogVisible: false,
      selectedOrder: null,
      
      // 知识库建议
      gettingSuggestions: false,
      suggestions: [],
      knowledgeBaseInfoVisible: false,
      
      // 批量获取建议相关
      batchProcessing: false,
      orderSuggestions: [], // 存储每个订单的建议状态
      processingOrderId: null, // 当前正在处理的订单ID
      batchExpanded: false, // 批量处理窗口展开状态（默认收起）
      
      // 维修指南弹窗
      maintenanceGuideVisible: false,
      guideContent: []
    }
  },
  created() {
    // 从路由参数中获取节点信息
    this.nodeInfo = {
      nodeId: this.$route.query.nodeId || '',
      nodeTitle: this.$route.query.nodeTitle || '未知节点',
      nodeType: this.$route.query.nodeType || 'operation'
    }
    
    console.log('⚙️ 运维环节重构页面初始化:', this.nodeInfo);
    
    // 加载运维订单数据
    this.loadMaintenanceOrders();
  },
  computed: {
    // 分页后的数据
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredOrders.slice(start, end);
    },
    
    // 已完成的建议数量
    completedCount() {
      return this.orderSuggestions.filter(item => item.status === 'completed').length;
    }
  },
  watch: {
    filteredOrders: {
      handler(newVal) {
        this.totalOrders = newVal.length;
        // 重置到第一页
        if (this.currentPage > 1 && newVal.length <= (this.currentPage - 1) * this.pageSize) {
          this.currentPage = 1;
        }
      },
      immediate: true
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },

    /**
     * 加载运维订单数据
     */
    async loadMaintenanceOrders() {
      try {
        this.loading = true;
        console.log('🔄 开始加载进行中的运维订单数据...');
        
        const response = await topic04Api.getOngoingMaintenanceOrders();
        
        if (response.success && response.data) {
          this.orders = response.data.records || [];
          this.originalOrders = [...this.orders];
          this.filteredOrders = [...this.orders];
          this.summary = response.data.summary;
          
          // 提取系统模块选项
          this.extractSystemModules();
          
          this.$message.success(`✅ 成功加载 ${this.orders.length} 条运维订单`);
          console.log('✅ 运维订单数据加载完成:', response.data);
        } else {
          this.$message.error(response.error || '获取运维订单数据失败');
          console.error('❌ 获取运维订单失败:', response.error);
        }
      } catch (error) {
        this.$message.error('网络错误，请稍后重试');
        console.error('❌ 加载运维订单异常:', error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * 提取系统模块选项
     */
    extractSystemModules() {
      const modules = new Set();
      this.orders.forEach(order => {
        if (order.system_module) {
          modules.add(order.system_module);
        }
      });
      this.systemModules = Array.from(modules).sort();
    },

    /**
     * 刷新订单数据
     */
    async refreshOrders() {
      await this.loadMaintenanceOrders();
    },

    /**
     * 应用筛选器
     */
    applyFilters() {
      let filtered = [...this.originalOrders];
      
      // 按系统模块筛选
      if (this.filters.systemModule) {
        filtered = filtered.filter(order => 
          order.system_module === this.filters.systemModule
        );
      }
      
      
      // 按维修类型筛选
      if (this.filters.maintenanceType) {
        filtered = filtered.filter(order => 
          order.maintenance_type === this.filters.maintenanceType
        );
      }
      
      // 按关键词筛选
      if (this.filters.keyword) {
        const keyword = this.filters.keyword.toLowerCase();
        filtered = filtered.filter(order => 
          order.train_id.toLowerCase().includes(keyword) ||
          order.fault_code.toLowerCase().includes(keyword) ||
          order.repair_code.toLowerCase().includes(keyword) ||
          order.fault_description.toLowerCase().includes(keyword)
        );
      }
      
      this.filteredOrders = filtered;
      this.currentPage = 1; // 重置到第一页
      
      console.log(`🔍 筛选结果: ${filtered.length}/${this.originalOrders.length} 条订单`);
    },

    /**
     * 查看订单详情
     */
    viewOrderDetail(order) {
      this.selectedOrder = order;
      this.detailDialogVisible = true;
    },

    /**
     * 关闭详情对话框
     */
    closeDetailDialog() {
      this.detailDialogVisible = false;
      this.selectedOrder = null;
    },

    /**
     * 分页大小改变
     */
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.currentPage = 1;
    },

    /**
     * 当前页改变
     */
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
    },

    /**
     * 获取状态标签类型
     */
    getStatusTagType() {
      if (this.totalOrders === 0) return '';
      if (this.summary && this.summary.criticalCount > 0) return 'warning';
      return 'success';
    },

    /**
     * 批量获取维修建议
     */
    async getBatchMaintenanceSuggestions() {
      try {
        this.gettingSuggestions = true;
        this.batchProcessing = true;
        console.log('🔍 开始批量获取维修建议...');
        
        // 初始化订单建议列表
        this.orderSuggestions = this.orders.map(order => ({
          orderId: order.id,
          trainId: order.train_id,
          faultCode: order.fault_code,
          systemModule: order.system_module,
          status: 'pending',
          progress: 0,
          progressText: '等待处理',
          suggestion: null
        }));
        
        // 保持用户选择的展开状态，不强制展开
        
        // 逐个处理订单
        for (let i = 0; i < this.orderSuggestions.length; i++) {
          const orderSuggestion = this.orderSuggestions[i];
          this.processingOrderId = orderSuggestion.orderId;
          
          // 开始处理当前订单
          orderSuggestion.status = 'processing';
          orderSuggestion.progressText = '正在分析故障...';
          
          // 模拟分析过程
          await this.simulateOrderAnalysis(orderSuggestion);
          
          // 标记为完成
          orderSuggestion.status = 'completed';
          orderSuggestion.progress = 100;
          orderSuggestion.progressText = '分析完成';
          
          // 每处理完一个订单稍作停顿（减少停顿时间）
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        this.batchProcessing = false;
        this.processingOrderId = null;
        this.$message.success(`✅ 批量获取维修建议完成，共处理 ${this.orderSuggestions.length} 个订单`);
        
      } catch (error) {
        this.batchProcessing = false;
        this.processingOrderId = null;
        this.$message.error('批量获取维修建议失败，请稍后重试');
        console.error('❌ 批量获取维修建议失败:', error);
      } finally {
        this.gettingSuggestions = false;
      }
    },

     /**
      * 模拟订单分析过程
      */
     async simulateOrderAnalysis(orderSuggestion) {
       const analysisSteps = [
         { progress: 30, text: '正在分析故障代码...' },
         { progress: 60, text: '匹配维修方案...' },
         { progress: 100, text: '分析完成' }
       ];
       
       for (const step of analysisSteps) {
         orderSuggestion.progress = step.progress;
         orderSuggestion.progressText = step.text;
         
        // 每个步骤间隔（加快速度）
        await new Promise(resolve => setTimeout(resolve, 100));
       }
       
       // 简化建议生成，不需要详细内容
       orderSuggestion.suggestion = { completed: true };
     },


    /**
     * 获取状态文本
     */
    getStatusText(status) {
      const statusMap = {
        'pending': '等待处理',
        'processing': '正在处理',
        'completed': '已完成'
      };
      return statusMap[status] || status;
    },

    /**
     * 进入下一步操作
     */
    goToNextStep() {
      this.$message.success('正在进入下一步操作...');
      console.log('🎯 进入下一步，已完成的订单:', this.completedCount);
      
      // 跳转到 OperationRefactor2 页面
      try {
        this.$router.push({
          name: 'OperationRefactor2',
          // 可以传递参数到下一个页面
          params: {
            completedOrders: this.completedCount,
            totalOrders: this.orderSuggestions.length
          },
          query: {
            from: 'operationRefactor',
            nodeId: this.nodeInfo && this.nodeInfo.nodeId,
            nodeTitle: this.nodeInfo && this.nodeInfo.nodeTitle
          }
        });
      } catch (error) {
        console.error('跳转失败:', error);
        this.$message.error('页面跳转失败，请检查路由配置');
      }
    },

    /**
     * 切换批量处理窗口的展开/收起状态
     */
    toggleBatchExpand() {
      this.batchExpanded = !this.batchExpanded;
      console.log('📋 批量处理窗口', this.batchExpanded ? '展开' : '收起');
    },


    /**
     * 显示知识库说明
     */
    showKnowledgeBaseInfo() {
      this.knowledgeBaseInfoVisible = true;
    },

    /**
     * 显示维修指南
     */
    async showMaintenanceGuide() {
      try {
        this.maintenanceGuideVisible = true;
        
        // 如果还没有维修指南数据，则加载
        if (this.guideContent.length === 0) {
          console.log('🔍 正在加载维修指南...');
          await this.generateCompactSuggestions();
        }
      } catch (error) {
        this.$message.error('获取维修指南失败，请稍后重试');
        console.error('❌ 获取维修指南失败:', error);
      }
    },

    /**
     * 加载维修指南内容（用于控制加载状态）
     */
    async generateCompactSuggestions() {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 设置一个简单的标记来控制内容显示
      this.guideContent = [{ loaded: true }];
    },


  }
}
</script>

<style scoped>
.operation-refactor-container {
  padding: 20px;
  height: 100%;
}

.page-header {
  margin-bottom: 20px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.refactor-card {
  text-align: center;
  padding: 40px 20px;
}

.refactor-title h1 {
  font-size: 32px;
  color: #1f2937;
  margin: 0 0 8px 0;
  font-weight: 700;
}

.refactor-title .subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 24px 0;
  font-style: italic;
}

.node-info {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.node-info .el-tag {
  font-size: 14px;
  padding: 8px 16px;
}

/* 运维订单卡片样式 */
.maintenance-orders-card {
  min-height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-title i {
  margin-right: 8px;
  color: #409eff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 加载和空状态 */
.loading-container {
  padding: 40px;
}

.empty-container {
  padding: 60px 20px;
  text-align: center;
}

/* 统计概览卡片 */
.summary-section {
  margin-bottom: 24px;
}

.summary-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 20px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.summary-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.summary-card.critical {
  background: linear-gradient(135deg, #fef5e7 0%, #f4b26c 100%);
}

.summary-card.urgent {
  background: linear-gradient(135deg, #ffebee 0%, #ef5350 100%);
}

.card-content {
  flex: 1;
}

.card-number {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 4px;
}

.card-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.card-icon {
  font-size: 32px;
  color: rgba(0, 0, 0, 0.3);
}

/* 筛选器 */
.filter-section {
  background: #f8f9fb;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

/* 订单列表 */
.orders-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.order-card {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.order-card:hover {
  border-color: #409eff;
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.15);
  transform: translateY(-2px);
}

/* 订单头部 */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.train-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.train-id {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}


/* 故障信息 */
.fault-info {
  margin-bottom: 16px;
}

.fault-code {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.system-module {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.fault-description {
  font-size: 14px;
  color: #909399;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 进度信息 */
.progress-info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 16px;
  padding: 8px 0;
  border-top: 1px solid #f5f7fa;
  border-bottom: 1px solid #f5f7fa;
}

.maintenance-type {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #606266;
}

/* 责任信息 */
.responsibility-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 12px;
  color: #909399;
}

.responsibility-info > div {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

/* 时间信息 */
.time-info {
  font-size: 12px;
  color: #c0c4cc;
}

.time-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.time-item:last-child {
  margin-bottom: 0;
}

.time-label {
  color: #909399;
}

.time-value {
  color: #606266;
  font-weight: 500;
}

/* 分页器 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 20px 0;
}

/* 订单详情对话框 */
.order-detail {
  max-height: 500px;
  overflow-y: auto;
}

.dialog-footer {
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .operation-refactor-container {
    padding: 10px;
  }
  
  .summary-cards {
    max-width: 100%;
  }
  
  .orders-list {
    grid-template-columns: 1fr;
  }
  
  .filter-section .el-row .el-col {
    margin-bottom: 8px;
  }
  
  .responsibility-info {
    flex-direction: column;
    gap: 8px;
  }
  
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

/* 知识库维修建议样式 */
.knowledge-base-card {
  margin-top: 20px;
}

.knowledge-base-section {
  text-align: center;
}

.section-header {
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  color: #303133;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.section-title i {
  margin-right: 8px;
  color: #409eff;
}

.section-description {
  font-size: 16px;
  color: #606266;
  margin: 0;
  line-height: 1.5;
}

.knowledge-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.suggestion-btn {
  min-width: 160px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

/* 建议结果展示 */
/* 批量建议容器样式 */
.batch-suggestions-container {
  background: #f8f9fb;
  border-radius: 12px;
  margin-top: 24px;
  overflow: hidden;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
}

.batch-suggestions-container:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.1);
}

/* 批量处理头部 */
.batch-header {
  background: linear-gradient(135deg, #ecf5ff 0%, #ffffff 100%);
  padding: 16px 24px;
  cursor: pointer;
  border-bottom: 1px solid #e8f4fd;
  transition: all 0.3s ease;
}

.batch-header:hover {
  background: linear-gradient(135deg, #d9ecff 0%, #f8fbff 100%);
}

.batch-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.batch-title-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.batch-icon {
  font-size: 20px;
  color: #409eff;
}

.batch-title {
  font-size: 16px;
  color: #303133;
  margin: 0;
  font-weight: 600;
}

.expand-control {
  display: flex;
  align-items: center;
}

.expand-icon {
  font-size: 16px;
  color: #909399;
  transition: all 0.3s ease;
}

.expand-icon:hover {
  color: #409eff;
}

/* 批量处理内容区域 */
.batch-content {
  padding: 20px 24px;
}

.processing-indicator {
  color: #409eff;
  font-size: 14px;
  font-weight: 400;
  margin-left: 8px;
}

.processing-indicator i {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 订单处理列表 */
.order-processing-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-suggestion-item {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.order-suggestion-item.pending {
  border-left-color: #c0c4cc;
}

.order-suggestion-item.processing {
  border-left-color: #409eff;
  background: linear-gradient(135deg, #ecf5ff 0%, #ffffff 100%);
  animation: pulse 2s ease-in-out infinite;
}

.order-suggestion-item.completed {
  border-left-color: #67c23a;
  background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.order-suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.order-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.processing-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-icon {
  font-size: 16px;
}

.status-icon.pending {
  color: #c0c4cc;
}

.status-icon.processing {
  color: #409eff;
  animation: rotate 2s linear infinite;
}

.status-icon.completed {
  color: #67c23a;
}

.status-text {
  font-size: 12px;
  color: #606266;
  font-weight: 500;
}

/* 处理进度 */
.processing-progress {
  margin: 12px 0;
}

.progress-text {
  font-size: 12px;
  color: #409eff;
  margin-top: 4px;
  display: block;
}


/* 批量处理统计 */
.batch-summary {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 2px solid #e4e7ed;
  text-align: center;
}

.summary-stats {
  display: flex;
  justify-content: center;
  gap: 12px;
  align-items: center;
}

/* 下一步按钮（在按钮组中） */
.next-step-btn {
  min-width: 140px;
  height: 44px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
  transition: all 0.3s ease;
}

.next-step-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(103, 194, 58, 0.4);
}

/* 完成提示区域 */
.completion-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.completion-icon {
  font-size: 18px;
  color: #52c41a;
}

.completion-text {
  margin: 0;
  font-size: 14px;
  color: #52c41a;
  font-weight: 500;
}

/* 知识库说明对话框 */
.knowledge-base-info {
  max-height: 500px;
  overflow-y: auto;
}

.info-section {
  margin-bottom: 24px;
}

.info-section:last-child {
  margin-bottom: 0;
}

.info-section h4 {
  font-size: 16px;
  color: #303133;
  margin: 0 0 12px 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-section h4 i {
  color: #409eff;
}

.info-section p {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

.info-section ul {
  margin: 0;
  padding-left: 20px;
}

.info-section li {
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
  margin-bottom: 4px;
}

.priority-levels {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.priority-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #606266;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .knowledge-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .suggestion-btn {
    width: 100%;
    max-width: 280px;
  }
  
  /* 批量处理容器响应式 */
  .batch-header {
    padding: 12px 16px;
  }
  
  .batch-title-section {
    gap: 8px;
    flex-wrap: wrap;
  }
  
  .batch-title {
    font-size: 15px;
  }
  
  .batch-icon {
    font-size: 18px;
  }
  
  .batch-content {
    padding: 16px;
  }
  
  /* 完成提示响应式 */
  .completion-tip {
    margin-top: 16px;
    padding: 12px;
    flex-direction: column;
    gap: 6px;
  }
  
  .completion-text {
    font-size: 13px;
    text-align: center;
  }
  
  .order-suggestion-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .order-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
   .processing-status {
     align-self: flex-end;
   }
  
  .summary-stats {
    flex-direction: column;
    gap: 8px;
  }
  
  .next-step-btn {
    width: 100%;
    max-width: 200px;
    height: 40px;
    font-size: 15px;
  }
}

/* 滚动条美化 */
.order-detail::-webkit-scrollbar,
.knowledge-base-info::-webkit-scrollbar {
  width: 6px;
}

.order-detail::-webkit-scrollbar-track,
.knowledge-base-info::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 3px;
}

.order-detail::-webkit-scrollbar-thumb,
.knowledge-base-info::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.order-detail::-webkit-scrollbar-thumb:hover,
.knowledge-base-info::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

/* 维修指南弹窗样式 */
.maintenance-guide-content {
  max-height: 600px;
  overflow-y: auto;
}

.guide-header {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f2f5;
}

.guide-header h3 {
  font-size: 20px;
  color: #303133;
  margin: 0 0 8px 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.guide-header h3 i {
  color: #409eff;
}

.guide-description {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

.loading-guide {
  padding: 20px;
}

.guide-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.guide-item {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.guide-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: #409eff;
}

.guide-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.guide-title-section {
  flex: 1;
}

.guide-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.guide-tags {
  display: flex;
  gap: 8px;
  align-items: center;
}

.guide-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #909399;
  background: #f5f7fa;
  padding: 4px 8px;
  border-radius: 4px;
}

.guide-time i {
  color: #409eff;
}

.guide-description {
  margin-bottom: 16px;
}

.guide-description p {
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
  margin: 0;
}

.guide-steps h5 {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.guide-steps h5 i {
  color: #409eff;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8f9fb;
  border-radius: 6px;
  border-left: 3px solid #409eff;
  transition: all 0.2s ease;
}

.step-item:hover {
  background: #ecf5ff;
  transform: translateX(2px);
}

.step-number {
  width: 20px;
  height: 20px;
  background: #409eff;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-text {
  font-size: 13px;
  color: #606266;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .guide-item-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .guide-time {
    align-self: flex-start;
  }
  
  .steps-grid {
    grid-template-columns: 1fr;
  }
}

/* 维修指南弹窗滚动条 */
.maintenance-guide-content::-webkit-scrollbar {
  width: 6px;
}

.maintenance-guide-content::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 3px;
}

.maintenance-guide-content::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.maintenance-guide-content::-webkit-scrollbar-thumb:hover {
  background: #909399;
}
</style>
