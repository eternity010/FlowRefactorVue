<template>
  <div class="marketing-refactor2-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-page-header @back="goBack" content="营销重构 - 第二阶段">
        <template slot="content">
          <span class="page-title">营销重构 - 第二阶段</span>
        </template>
      </el-page-header>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 分析操作区域 -->
      <div class="analysis-action-section">
        <el-card class="action-card">
          <div class="action-header">
            <h3>
              <i class="el-icon-data-analysis"></i>
              客户和人员匹配度分析
            </h3>
            <p>基于历史数据分析客户与人员的匹配度指标</p>
          </div>
          <div class="action-buttons">
            <el-button 
              type="primary" 
              size="medium"
              @click="startAnalysis"
              :loading="analysisLoading">
              <i class="el-icon-search"></i>
              {{ analysisLoading ? '正在分析客户数据...' : '分析客户数据' }}
            </el-button>
          </div>
        </el-card>
      </div>

      <!-- 分析结果展示区域 -->
      <div v-if="showAnalysisResults" class="analysis-results-section">
        <!-- 简化的统计和数据展示 -->
        <el-card class="compact-data-card">
          <div slot="header" class="compact-header">
            <div class="header-left">
              <span>
                <i class="el-icon-s-data"></i>
                客户数据分析
              </span>
              <el-tag type="info" size="mini">{{ analysisData.length }}个客户</el-tag>
            </div>
            <div class="header-right">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索客户"
                size="mini"
                prefix-icon="el-icon-search"
                clearable
                style="width: 180px; margin-right: 8px;">
              </el-input>
              <el-button size="mini" @click="toggleViewMode">
                <i :class="viewMode === 'table' ? 'el-icon-menu' : 'el-icon-s-grid'"></i>
                {{ viewMode === 'table' ? '卡片' : '表格' }}
              </el-button>
            </div>
          </div>
          
          <!-- 表格视图 -->
          <div v-if="viewMode === 'table'">
            <el-table 
              :data="paginatedData" 
              size="small"
              stripe 
              :loading="analysisLoading"
              @sort-change="handleSortChange"
              style="width: 100%">
              
              <el-table-column 
                prop="customer_name" 
                label="客户名称" 
                min-width="150"
                show-overflow-tooltip>
              </el-table-column>
              
              <el-table-column 
                prop="lead_conversion_prob" 
                label="线索转化概率" 
                width="120"
                sortable="custom">
                <template slot-scope="scope">
                  <span :style="{color: getConversionColor(scope.row.lead_conversion_prob)}">
                    {{ (scope.row.lead_conversion_prob * 100).toFixed(0) }}%
                  </span>
                </template>
              </el-table-column>
              
              <el-table-column 
                prop="assignment_cost" 
                label="指派成本" 
                width="90"
                sortable="custom">
                <template slot-scope="scope">
                  <span>{{ scope.row.assignment_cost.toFixed(1) }}</span>
                </template>
              </el-table-column>
              
              <el-table-column 
                prop="overdue_ratio" 
                label="逾期风险" 
                width="90"
                sortable="custom">
                <template slot-scope="scope">
                  <span :style="{color: getRiskColor(scope.row.overdue_ratio)}">
                    {{ (scope.row.overdue_ratio * 100).toFixed(0) }}%
                  </span>
                </template>
              </el-table-column>
              
              <el-table-column 
                label="评级" 
                width="70">
                <template slot-scope="scope">
                  <el-tag 
                    :type="getMatchingGrade(scope.row).type"
                    size="mini">
                    {{ getMatchingGrade(scope.row).grade }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
          
          <!-- 卡片视图 -->
          <div v-else class="card-grid-view">
            <div 
              v-for="item in paginatedData" 
              :key="item.customer_id"
              class="customer-card-item">
              <div class="card-item-header">
                <span class="card-customer-name">{{ item.customer_name }}</span>
                <el-tag 
                  :type="getMatchingGrade(item).type"
                  size="mini">
                  {{ getMatchingGrade(item).grade }}
                </el-tag>
              </div>
              <div class="card-item-body">
                <div class="card-metric">
                  <span class="metric-label">线索转化概率:</span>
                  <span class="metric-value" :style="{color: getConversionColor(item.lead_conversion_prob)}">
                    {{ (item.lead_conversion_prob * 100).toFixed(0) }}%
                  </span>
                </div>
                <div class="card-metric">
                  <span class="metric-label">指派成本:</span>
                  <span class="metric-value">{{ item.assignment_cost.toFixed(1) }}</span>
                </div>
                <div class="card-metric">
                  <span class="metric-label">逾期风险:</span>
                  <span class="metric-value" :style="{color: getRiskColor(item.overdue_ratio)}">
                    {{ (item.overdue_ratio * 100).toFixed(0) }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 紧凑分页 -->
          <div class="compact-pagination">
            <el-pagination
              small
              @current-change="handlePageChange"
              @size-change="handleSizeChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 50]"
              :page-size="pageSize"
              :total="filteredAnalysisData.length"
              layout="total, sizes, prev, pager, next">
            </el-pagination>
          </div>
        </el-card>

        <!-- 下一步分析按钮 -->
        <div class="next-analysis-section">
          <el-card class="next-analysis-card">
            <div class="next-analysis-content">
              <div class="next-analysis-info">
                <h4>
                  <i class="el-icon-right"></i>
                  下一步：人员匹配度分析
                </h4>
                <p>基于客户数据结果，分析人员与客户的匹配度</p>
              </div>
              <div class="next-analysis-actions">
                <el-button 
                  type="warning" 
                  size="medium"
                  @click="analyzeStaffMatching"
                  :loading="staffAnalysisLoading">
                  <i class="el-icon-user"></i>
                  {{ staffAnalysisLoading ? '正在分析人员匹配度...' : '分析人员匹配度' }}
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <!-- 人员匹配度结果展示区域 -->
      <div v-if="showStaffMatchResults" class="staff-match-results-section">
        <el-card class="staff-match-card">
          <div class="staff-match-header">
            <div class="header-title">
              <h3>
                <i class="el-icon-user"></i>
                人员匹配度分析结果
              </h3>
              <p>展示各销售人员与客户的匹配度统计信息</p>
            </div>
            <div class="header-stats">
              <span class="stat-item">
                <i class="el-icon-s-custom"></i>
                销售人员：<strong>{{ staffMatchData.length }}</strong>人
              </span>
            </div>
          </div>

          <!-- 人员卡片列表 -->
          <div class="staff-cards-grid">
            <div 
              v-for="owner in staffMatchData" 
              :key="owner.owner_name"
              class="staff-card"
              @click="viewOwnerDetail(owner)">
              <div class="staff-card-header">
                <div class="staff-info">
                  <i class="el-icon-user-solid staff-icon"></i>
                  <div class="staff-name">{{ owner.owner_name }}</div>
                </div>
                <div class="staff-badge">
                  <el-tag 
                    :type="owner.statistics.avg_match_score >= 0.7 ? 'success' : 'warning'" 
                    size="small">
                    {{ getMatchLevel(owner.statistics.avg_match_score) }}
                  </el-tag>
                </div>
              </div>

              <div class="staff-card-body">
                <!-- 平均匹配度 -->
                <div class="stat-row main-stat">
                  <span class="stat-label">平均匹配度</span>
                  <span class="stat-value" :style="{color: getMatchColor(owner.statistics.avg_match_score)}">
                    {{ (owner.statistics.avg_match_score * 100).toFixed(1) }}%
                  </span>
                </div>

                <!-- 客户总数 -->
                <div class="stat-row">
                  <span class="stat-label">客户总数</span>
                  <span class="stat-value">{{ owner.statistics.total_customers }}个</span>
                </div>

                <!-- 匹配度分布 -->
                <div class="match-distribution">
                  <div class="distribution-item">
                    <span class="label high">高匹配</span>
                    <span class="value">{{ owner.statistics.high_match_count }}</span>
                  </div>
                  <div class="distribution-item">
                    <span class="label medium">中匹配</span>
                    <span class="value">{{ owner.statistics.medium_match_count }}</span>
                  </div>
                  <div class="distribution-item">
                    <span class="label low">低匹配</span>
                    <span class="value">{{ owner.statistics.low_match_count }}</span>
                  </div>
                </div>

                <!-- 最佳匹配客户 -->
                <div class="best-match" v-if="owner.customers.length > 0">
                  <div class="best-match-label">最佳匹配</div>
                  <div class="best-match-customer">
                    <span class="customer-name">{{ owner.customers[0].customer_name }}</span>
                    <span class="match-score" :style="{color: getMatchColor(owner.customers[0].match_score)}">
                      {{ (owner.customers[0].match_score * 100).toFixed(1) }}%
                    </span>
                  </div>
                </div>
              </div>

              <div class="staff-card-footer">
                <el-button type="text" size="small">
                  查看详情 <i class="el-icon-arrow-right"></i>
                </el-button>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 最终下一步按钮 -->
        <div class="final-next-step-section">
          <el-card class="final-next-step-card">
            <div class="final-next-step-content">
              <div class="final-next-step-info">
                <h4>
                  <i class="el-icon-finished"></i>
                  分析完成：进入下一阶段
                </h4>
                <p>已完成客户数据分析和人员匹配度分析，准备进入下一阶段操作</p>
                <div class="analysis-summary">
                  <span>客户分析：{{ analysisData.length }}个</span>
                  <span class="separator">|</span>
                  <span>人员分析：{{ staffMatchData.length }}人</span>
                </div>
              </div>
              <div class="final-next-step-actions">
                <el-button 
                  type="warning" 
                  size="medium"
                  @click="goToNextStep"
                  :loading="nextStepLoading">
                  <i class="el-icon-right"></i>
                  {{ nextStepLoading ? '处理中...' : '下一步' }}
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <!-- 人员详情抽屉 -->
      <el-drawer
        :visible.sync="ownerDetailVisible"
        :title="`${selectedOwner ? selectedOwner.owner_name : ''} - 客户匹配度详情`"
        size="50%"
        direction="rtl">
        <div v-if="selectedOwner" class="owner-detail-content">
          <!-- 统计概览 -->
          <div class="detail-stats">
            <div class="stat-card">
              <div class="stat-icon" style="background: #e6f7ff; color: #1890ff;">
                <i class="el-icon-s-custom"></i>
              </div>
              <div class="stat-info">
                <div class="stat-label">客户总数</div>
                <div class="stat-value">{{ selectedOwner.statistics.total_customers }}</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background: #f6ffed; color: #52c41a;">
                <i class="el-icon-star-on"></i>
              </div>
              <div class="stat-info">
                <div class="stat-label">平均匹配度</div>
                <div class="stat-value">{{ (selectedOwner.statistics.avg_match_score * 100).toFixed(1) }}%</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background: #fff7e6; color: #faad14;">
                <i class="el-icon-trophy"></i>
              </div>
              <div class="stat-info">
                <div class="stat-label">最高匹配度</div>
                <div class="stat-value">{{ (selectedOwner.statistics.max_match_score * 100).toFixed(1) }}%</div>
              </div>
            </div>
          </div>

          <!-- 客户列表 -->
          <div class="customer-list-section">
            <h4>客户匹配度列表</h4>
            <el-table 
              :data="selectedOwner.customers" 
              stripe
              style="width: 100%"
              max-height="500">
              <el-table-column type="index" label="#" width="50"></el-table-column>
              <el-table-column prop="customer_name" label="客户名称" min-width="200"></el-table-column>
              <el-table-column label="匹配度" width="120" align="center">
                <template slot-scope="scope">
                  <span :style="{color: getMatchColor(scope.row.match_score), fontWeight: 600}">
                    {{ (scope.row.match_score * 100).toFixed(1) }}%
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="等级" width="100" align="center">
                <template slot-scope="scope">
                  <el-tag 
                    :type="scope.row.match_score >= 0.8 ? 'success' : scope.row.match_score >= 0.6 ? '' : 'warning'"
                    size="small">
                    {{ getMatchLevel(scope.row.match_score) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="进度" width="150">
                <template slot-scope="scope">
                  <el-progress 
                    :percentage="scope.row.match_score * 100" 
                    :color="getMatchColor(scope.row.match_score)"
                    :show-text="false"
                    :stroke-width="8">
                  </el-progress>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import topic03Api from '@/api/topic03Api';

export default {
  name: 'MarketingRefactor2',
  
  data() {
    return {
      // 分析状态
      analysisLoading: false,
      staffAnalysisLoading: false,
      showAnalysisResults: false,
      showStaffMatchResults: false,
      
      // 分析数据
      analysisData: [],
      staffMatchData: [],
      searchKeyword: '',
      
      // 视图模式
      viewMode: 'table', // 'table' 或 'card'
      
      // 表格分页
      currentPage: 1,
      pageSize: 10,
      
      // 选中的人员（用于查看详情）
      selectedOwner: null,
      ownerDetailVisible: false,
      
      // 下一步状态
      nextStepLoading: false
    };
  },
  
  computed: {
    // 过滤后的分析数据
    filteredAnalysisData() {
      let filtered = this.analysisData;
      
      // 根据搜索关键词过滤
      if (this.searchKeyword) {
        filtered = filtered.filter(item => 
          item.customer_name.toLowerCase().includes(this.searchKeyword.toLowerCase())
        );
      }
      
      return filtered;
    },
    
    // 分页后的数据
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredAnalysisData.slice(start, end);
    }
  },
  
  methods: {
    // 返回上一页
    goBack() {
      console.log('📤 从人员和客户匹配度分析页面返回上一页');
      this.$router.go(-1);
    },
    
    // 开始分析
    async startAnalysis() {
      console.log('🔍 开始分析所有公司数据');
      
      this.analysisLoading = true;
      
      try {
        // 模拟加载延迟
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 调用API获取优化指标数据
        const result = await topic03Api.getOptimizationMetrics();
        
        if (result.success) {
          this.analysisData = result.data || [];
          this.showAnalysisResults = true;
          this.$message.success(`成功分析了${this.analysisData.length}个客户的匹配度数据`);
        } else {
          this.$message.error('分析失败：' + (result.error || '未知错误'));
        }
        
      } catch (error) {
        console.error('分析数据失败:', error);
        this.$message.error('分析失败：' + error.message);
      } finally {
        this.analysisLoading = false;
      }
    },

    // 分析人员匹配度
    async analyzeStaffMatching() {
      console.log('👥 开始分析人员匹配度');
      
      this.staffAnalysisLoading = true;
      
      try {
        // 模拟加载延迟
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 调用API获取销售-客户匹配度数据
        const result = await topic03Api.getSalesCustomerMatch({
          groupBy: 'owner'
        });
        
        if (result.success) {
          this.staffMatchData = result.data || [];
          this.showStaffMatchResults = true;
          this.$message.success(`成功分析了${this.staffMatchData.length}位销售人员的匹配度数据`);
          console.log('📊 人员匹配度分析完成:', this.staffMatchData);
        } else {
          this.$message.error('分析失败：' + (result.error || '未知错误'));
        }
        
      } catch (error) {
        console.error('人员匹配度分析失败:', error);
        this.$message.error('人员匹配度分析失败：' + error.message);
      } finally {
        this.staffAnalysisLoading = false;
      }
    },
    
    // 查看人员详细匹配度
    viewOwnerDetail(owner) {
      console.log('👤 查看人员详情:', owner.owner_name);
      this.selectedOwner = owner;
      this.ownerDetailVisible = true;
    },
    
    // 关闭人员详情
    closeOwnerDetail() {
      this.ownerDetailVisible = false;
      this.selectedOwner = null;
    },
    
    // 获取匹配度等级
    getMatchLevel(score) {
      if (score >= 0.8) return '优秀';
      if (score >= 0.6) return '良好';
      if (score >= 0.4) return '一般';
      return '较低';
    },
    
    // 获取匹配度颜色
    getMatchColor(score) {
      if (score >= 0.8) return '#52c41a';
      if (score >= 0.6) return '#1890ff';
      if (score >= 0.4) return '#faad14';
      return '#ff4d4f';
    },
    
    // 进入下一步（跳转到MarketingRefactor3）
    async goToNextStep() {
      console.log('🚀 进入下一步 - 跳转到MarketingRefactor3页面');
      
      this.nextStepLoading = true;
      
      try {
        // 模拟加载延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 构建路由参数
        const params = {
          customerAnalysisCount: this.analysisData.length,
          staffAnalysisCount: this.staffMatchData.length,
          fromPage: 'MarketingRefactor2'
        };
        
        // 跳转到MarketingRefactor3页面
        this.$router.push({
          name: 'MarketingRefactor3',
          query: params
        });
        
        this.$message.success('正在进入下一阶段...');
        console.log('📊 跳转到MarketingRefactor3页面');
        
      } catch (error) {
        console.error('页面跳转失败:', error);
        this.$message.error('页面跳转失败：' + error.message);
      } finally {
        this.nextStepLoading = false;
      }
    },

    // 查看客户详情
    viewCustomerDetail(customer) {
      console.log('👁️ 查看客户详情:', customer.customer_name);
      this.$message.info(`查看客户：${customer.customer_name} 的详情`);
    },
    
    // 切换视图模式
    toggleViewMode() {
      this.viewMode = this.viewMode === 'table' ? 'card' : 'table';
    },
    
    // 获取转化率颜色
    getConversionColor(rate) {
      if (rate >= 0.6) return '#67C23A';  // 绿色
      if (rate >= 0.3) return '#E6A23C';  // 橙色
      return '#F56C6C';  // 红色
    },
    
    // 获取成本等级
    getCostLevel(cost) {
      if (cost <= 1) return 'success';
      if (cost <= 2) return 'warning';
      return 'danger';
    },
    
    // 获取风险颜色
    getRiskColor(risk) {
      if (risk <= 0.2) return '#67C23A';  // 绿色 - 低风险
      if (risk <= 0.4) return '#E6A23C';  // 橙色 - 中等风险
      return '#F56C6C';  // 红色 - 高风险
    },
    
    // 获取匹配度评级
    getMatchingGrade(customer) {
      const conversionRate = customer.lead_conversion_prob;
      const cost = customer.assignment_cost;
      const risk = customer.overdue_ratio;
      
      // 综合评分算法
      let score = 0;
      
      // 转化率权重：40%
      score += conversionRate * 40;
      
      // 成本权重：30% (成本越低分数越高)
      score += (1 - Math.min(cost / 4, 1)) * 30;
      
      // 风险权重：30% (风险越低分数越高)
      score += (1 - risk) * 30;
      
      if (score >= 70) {
        return { grade: 'A级', type: 'success' };
      } else if (score >= 50) {
        return { grade: 'B级', type: 'warning' };
      } else if (score >= 30) {
        return { grade: 'C级', type: 'info' };
      } else {
        return { grade: 'D级', type: 'danger' };
      }
    },
    
    // 处理排序变化
    handleSortChange({ column, prop, order }) {
      console.log('📊 排序变化:', prop, order);
      
      if (!order) {
        return;
      }
      
      this.analysisData.sort((a, b) => {
        const aVal = a[prop];
        const bVal = b[prop];
        
        if (order === 'ascending') {
          return aVal - bVal;
        } else {
          return bVal - aVal;
        }
      });
    },
    
    // 处理页码变化
    handlePageChange(page) {
      this.currentPage = page;
    },
    
    // 处理页面大小变化
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
    }
  }
};
</script>

<style scoped>
/* 页面容器 */
.marketing-refactor2-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

/* 页面头部 */
.page-header {
  background: #fff;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

/* 主要内容区域 */
.main-content {
  width: 100%;
}

/* 分析操作区域 */
.analysis-action-section {
  margin-bottom: 24px;
}

.action-card {
  border-radius: 8px;
  border: 2px solid #e6f7ff;
  background: linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%);
}

.action-header {
  text-align: center;
  margin-bottom: 20px;
}

.action-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1890ff;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.action-header p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

/* 分析结果区域 */
.analysis-results-section {
  margin-top: 20px;
}

/* 紧凑数据卡片 */
.compact-data-card {
  border-radius: 8px;
}

.compact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #262626;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-right {
  display: flex;
  align-items: center;
}

/* 卡片网格视图 */
.card-grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
  padding: 8px 0;
}

.customer-card-item {
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 12px;
  transition: all 0.3s;
  background: #fff;
}

.customer-card-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
  transform: translateY(-2px);
}

.card-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.card-customer-name {
  font-size: 13px;
  font-weight: 500;
  color: #262626;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 120px;
}

.card-item-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.metric-label {
  color: #8c8c8c;
}

.metric-value {
  font-weight: 500;
  color: #262626;
}

/* 紧凑分页 */
.compact-pagination {
  margin-top: 16px;
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

/* 下一步分析区域 */
.next-analysis-section {
  margin-top: 20px;
}

.next-analysis-card {
  border-radius: 8px;
  border: 2px solid #faad14;
  background: linear-gradient(135deg, #fff7e6 0%, #fff1b8 100%);
}

.next-analysis-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.next-analysis-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #fa8c16;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.next-analysis-info h4 i {
  color: #52c41a;
}

.next-analysis-info p {
  font-size: 14px;
  color: #8c5a00;
  margin: 0;
}

.next-analysis-actions {
  display: flex;
  align-items: center;
}

/* Element UI 组件样式覆盖 */
::v-deep .el-table {
  font-size: 14px;
}

::v-deep .el-table th {
  background-color: #fafafa;
  color: #262626;
  font-weight: 600;
}

::v-deep .el-table td {
  padding: 12px 0;
}

::v-deep .el-progress-bar__outer {
  border-radius: 4px;
}

::v-deep .el-progress-circle {
  display: flex;
  justify-content: center;
}

::v-deep .el-tag {
  border-radius: 4px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .card-grid-view {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .marketing-refactor2-container {
    padding: 12px;
  }
  
  .page-header {
    padding: 12px 16px;
  }
  
  .action-header h3 {
    font-size: 18px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  
  .action-buttons .el-button {
    width: 220px;
  }

  .next-analysis-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .next-analysis-actions .el-button {
    width: 220px;
  }
  
  .compact-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .header-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .card-grid-view {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 8px;
  }
  
  ::v-deep .el-table {
    font-size: 12px;
  }
}

@media (max-width: 576px) {
  .card-grid-view {
    grid-template-columns: 1fr;
  }
  
  .customer-card-item {
    padding: 10px;
  }
  
  .header-right {
    flex-direction: column;
    gap: 8px;
  }
  
  .header-right .el-input,
  .header-right .el-button {
    width: 100%;
  }
}

/* ==================== 人员匹配度分析样式 ==================== */

/* 人员匹配度结果区域 */
.staff-match-results-section {
  margin-top: 20px;
}

.staff-match-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.staff-match-header {
  padding: 16px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.staff-match-header .header-title h3 {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.staff-match-header .header-title p {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
}

.staff-match-header .header-stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.staff-match-header .stat-item {
  font-size: 14px;
  color: #595959;
  display: flex;
  align-items: center;
  gap: 6px;
}

.staff-match-header .stat-item i {
  font-size: 16px;
  color: #1890ff;
}

.staff-match-header .stat-item strong {
  font-size: 18px;
  color: #1890ff;
  font-weight: 600;
}

/* 人员卡片网格 */
.staff-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

/* 人员卡片 */
.staff-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
  transition: all 0.3s ease;
  cursor: pointer;
}

.staff-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
  transform: translateY(-2px);
}

.staff-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.staff-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.staff-icon {
  font-size: 24px;
  color: #1890ff;
}

.staff-name {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.staff-badge {
  flex-shrink: 0;
}

.staff-card-body {
  padding: 12px 0;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.stat-row.main-stat {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 8px;
}

.stat-row.main-stat .stat-label {
  font-size: 14px;
  font-weight: 600;
}

.stat-row.main-stat .stat-value {
  font-size: 20px;
  font-weight: 700;
}

.stat-row .stat-label {
  font-size: 13px;
  color: #8c8c8c;
}

.stat-row .stat-value {
  font-size: 15px;
  font-weight: 600;
  color: #262626;
}

/* 匹配度分布 */
.match-distribution {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding: 8px 0;
  border-top: 1px solid #f0f0f0;
}

.distribution-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: 6px;
  background: #fafafa;
}

.distribution-item .label {
  font-size: 12px;
  color: #8c8c8c;
}

.distribution-item .label.high {
  color: #52c41a;
}

.distribution-item .label.medium {
  color: #1890ff;
}

.distribution-item .label.low {
  color: #faad14;
}

.distribution-item .value {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

/* 最佳匹配 */
.best-match {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.best-match-label {
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 6px;
}

.best-match-customer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
  border-radius: 4px;
}

.best-match-customer .customer-name {
  font-size: 13px;
  color: #262626;
  font-weight: 500;
}

.best-match-customer .match-score {
  font-size: 14px;
  font-weight: 700;
}

.staff-card-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}

/* 人员详情抽屉 */
.owner-detail-content {
  padding: 20px;
}

.detail-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-info .stat-label {
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.stat-info .stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #262626;
}

.customer-list-section {
  margin-top: 20px;
}

.customer-list-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 16px 0;
}

/* 最终下一步按钮 */
.final-next-step-section {
  margin-top: 20px;
}

.final-next-step-card {
  border-radius: 8px;
  border: 2px solid #faad14;
  background: linear-gradient(135deg, #fff7e6 0%, #fff1b8 100%);
}

.final-next-step-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.final-next-step-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #fa8c16;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.final-next-step-info h4 i {
  color: #52c41a;
}

.final-next-step-info p {
  font-size: 14px;
  color: #8c5a00;
  margin: 0 0 8px 0;
}

.analysis-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #faad14;
  font-weight: 500;
}

.analysis-summary .separator {
  color: #d9d9d9;
}

.final-next-step-actions {
  display: flex;
  align-items: center;
}

/* 响应式 - 移动端 */
@media (max-width: 768px) {
  .staff-cards-grid {
    grid-template-columns: 1fr;
  }
  
  .staff-match-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .detail-stats {
    grid-template-columns: 1fr;
  }

  .final-next-step-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .final-next-step-actions .el-button {
    width: 220px;
  }
}
</style>
