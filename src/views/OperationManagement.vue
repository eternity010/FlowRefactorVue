<template>
  <div class="operation-management">
    <div class="page-header">
      <span class="page-title">运维环节管理</span>
      <!-- 数据状态指示器 -->
      <div class="data-status">
        <span v-if="loading || riskDataLoading" class="status-loading">
          <i class="el-icon-loading"></i> 正在加载数据...
        </span>
        <span v-else-if="error && riskDataError" class="status-error">
          <i class="el-icon-warning"></i> 使用备用数据 (流程: {{ error }}, 风险: {{ riskDataError }})
        </span>
        <span v-else-if="error" class="status-error">
          <i class="el-icon-warning"></i> 流程数据使用备用 ({{ error }})，风险数据已从MySQL加载
        </span>
        <span v-else-if="riskDataError" class="status-error">
          <i class="el-icon-warning"></i> 流程数据已从MongoDB加载，风险数据使用备用 ({{ riskDataError }})
        </span>
        <span v-else class="status-success">
          <i class="el-icon-success"></i> 数据已从MongoDB和MySQL加载
        </span>

        <!-- 刷新按钮 -->
        <el-button
          size="mini"
          type="primary"
          @click="refreshData"
          :loading="loading || riskDataLoading"
          style="margin-left: 10px;">
          <i class="el-icon-refresh"></i> 刷新
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading || riskDataLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p v-if="loading && riskDataLoading">正在加载流程数据和风险数据，请稍候...</p>
      <p v-else-if="loading">正在加载流程数据，请稍候...</p>
      <p v-else>正在加载风险数据，请稍候...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error && !processData" class="error-container">
      <div class="error-message">
        <i class="el-icon-warning"></i>
        <p>{{ error }}</p>
        <el-button
          type="primary"
          @click="refreshData"
          :loading="loading">
          重新加载
        </el-button>
      </div>
    </div>

    <!-- 主要内容 - 只在数据加载完成后渲染 -->
    <div v-else-if="dataLoaded" class="content-container">
      <!-- ==================== 上半部分 ==================== -->
      <div class="upper-section">
        <!-- 上半部分内容：运维环节三个风险级别卡片 -->
        <div class="info-blocks-container">
          <!-- 高风险节点卡片 -->
          <el-card class="info-block risk-high" shadow="hover" @click.native="showRiskNodes('high')">
            <div class="info-block-content">
              <div class="card-title">
                <i :class="currentRiskData.highRisk.icon"></i>
                {{ currentRiskData.highRisk.title }}
              </div>
              <div class="risk-count-container">
                <div class="risk-count">{{ currentRiskData.highRisk.count }}</div>
                <div class="risk-total">/ {{ currentRiskData.total }}</div>
              </div>
              <div class="risk-percentage">
                {{ getPercentage(currentRiskData.highRisk.count, currentRiskData.total) }}%
              </div>
              <div class="risk-nodes-list" v-if="currentRiskData.highRisk.nodeDetails && currentRiskData.highRisk.nodeDetails.length > 0">
                <div
                  v-for="(nodeDetail, index) in currentRiskData.highRisk.nodeDetails.slice(0, 2)"
                  :key="nodeDetail.id"
                  class="risk-node-card"
                  :title="`${nodeDetail.fullName}\n风险描述: ${nodeDetail.description}`"
                >
                  <div class="node-header">
                    <span class="node-id">{{ nodeDetail.id }}</span>
                    <i class="el-icon-warning risk-icon"></i>
                  </div>
                  <div class="node-name">{{ nodeDetail.name }}</div>
                  <div class="node-description">{{ nodeDetail.description }}</div>
                </div>
                <div v-if="currentRiskData.highRisk.nodeDetails.length > 2" class="more-nodes-card">
                  <i class="el-icon-more"></i>
                  <span>还有{{ currentRiskData.highRisk.nodeDetails.length - 2 }}个节点</span>
                </div>
              </div>
              <div v-else-if="currentRiskData.highRisk.nodes && currentRiskData.highRisk.nodes.length > 0" class="risk-nodes-list">
                <div
                  v-for="(node, index) in currentRiskData.highRisk.nodes.slice(0, 2)"
                  :key="index"
                  class="risk-node-item-simple"
                >
                  {{ node }}
                </div>
                <div v-if="currentRiskData.highRisk.nodes.length > 2" class="more-nodes">
                  +{{ currentRiskData.highRisk.nodes.length - 2 }}更多
                </div>
              </div>
            </div>
          </el-card>

          <!-- 中风险节点卡片 -->
          <el-card class="info-block risk-medium" shadow="hover" @click.native="showRiskNodes('medium')">
            <div class="info-block-content">
              <div class="card-title">
                <i :class="currentRiskData.mediumRisk.icon"></i>
                {{ currentRiskData.mediumRisk.title }}
              </div>
              <div class="risk-count-container">
                <div class="risk-count">{{ currentRiskData.mediumRisk.count }}</div>
                <div class="risk-total">/ {{ currentRiskData.total }}</div>
              </div>
              <div class="risk-percentage">
                {{ getPercentage(currentRiskData.mediumRisk.count, currentRiskData.total) }}%
              </div>
              <div class="risk-nodes-list" v-if="currentRiskData.mediumRisk.nodeDetails && currentRiskData.mediumRisk.nodeDetails.length > 0">
                <div
                  v-for="(nodeDetail, index) in currentRiskData.mediumRisk.nodeDetails.slice(0, 2)"
                  :key="nodeDetail.id"
                  class="risk-node-card"
                  :title="`${nodeDetail.fullName}\n风险描述: ${nodeDetail.description}`"
                >
                  <div class="node-header">
                    <span class="node-id">{{ nodeDetail.id }}</span>
                    <i class="el-icon-warning-outline risk-icon"></i>
                  </div>
                  <div class="node-name">{{ nodeDetail.name }}</div>
                  <div class="node-description">{{ nodeDetail.description }}</div>
                </div>
                <div v-if="currentRiskData.mediumRisk.nodeDetails.length > 2" class="more-nodes-card">
                  <i class="el-icon-more"></i>
                  <span>还有{{ currentRiskData.mediumRisk.nodeDetails.length - 2 }}个节点</span>
                </div>
              </div>
              <div v-else-if="currentRiskData.mediumRisk.nodes && currentRiskData.mediumRisk.nodes.length > 0" class="risk-nodes-list">
                <div
                  v-for="(node, index) in currentRiskData.mediumRisk.nodes.slice(0, 2)"
                  :key="index"
                  class="risk-node-item-simple"
                >
                  {{ node }}
                </div>
                <div v-if="currentRiskData.mediumRisk.nodes.length > 2" class="more-nodes">
                  +{{ currentRiskData.mediumRisk.nodes.length - 2 }}更多
                </div>
              </div>
            </div>
          </el-card>

          <!-- 正常节点卡片 -->
          <el-card class="info-block risk-normal" shadow="hover" @click.native="showRiskNodes('normal')">
            <div class="info-block-content">
              <div class="card-title">
                <i :class="currentRiskData.normal.icon"></i>
                {{ currentRiskData.normal.title }}
              </div>
              <div class="risk-count-container">
                <div class="risk-count">{{ currentRiskData.normal.count }}</div>
                <div class="risk-total">/ {{ currentRiskData.total }}</div>
              </div>
              <div class="risk-percentage">
                {{ getPercentage(currentRiskData.normal.count, currentRiskData.total) }}%
              </div>
              <div class="normal-nodes-section">
                <div v-if="currentRiskData.normal.nodeDetails && currentRiskData.normal.nodeDetails.length > 0" class="normal-nodes-list">
                  <div
                    v-for="(nodeDetail, index) in currentRiskData.normal.nodeDetails.slice(0, 2)"
                    :key="nodeDetail.id"
                    class="normal-node-card"
                    :title="`${nodeDetail.fullName}\n状态: ${nodeDetail.description}`"
                  >
                    <div class="node-header">
                      <span class="node-id">{{ nodeDetail.id }}</span>
                      <i class="el-icon-success risk-icon"></i>
                    </div>
                    <div class="node-name">{{ nodeDetail.name }}</div>
                  </div>
                  <div v-if="currentRiskData.normal.nodeDetails.length > 2" class="more-nodes-card normal">
                    <i class="el-icon-more"></i>
                    <span>还有{{ currentRiskData.normal.nodeDetails.length - 2 }}个正常节点</span>
                  </div>
                </div>
                <div v-else class="normal-status">
                  <div class="status-item success">
                    <i class="el-icon-success"></i>
                    <span>运行正常</span>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <!-- ==================== 分隔线 ==================== -->
      <div class="divider"></div>
      <!-- ==================== 下半部分 ==================== -->
      <div class="lower-section">
        <!-- 下半部分内容：运维环节流程图 -->
        <operation-flow ref="operationFlow"></operation-flow>
      </div>
    </div>

    <!-- 无数据状态 -->
    <div v-else class="no-data-container">
      <div class="no-data-message">
        <i class="el-icon-info"></i>
        <p>暂无运维环节数据</p>
        <el-button
          type="primary"
          @click="refreshData"
          :loading="loading">
          加载数据
        </el-button>
      </div>
    </div>

    <!-- 节点列表对话框 -->
    <el-dialog
      :title="nodeListDialogTitle"
      :visible.sync="nodeListDialogVisible"
      width="800px"
      class="node-list-dialog"
      @close="closeNodeListDialog">

      <!-- 对话框头部信息 -->
      <div class="dialog-header">
        <div class="risk-summary">
          <div class="risk-indicator" :class="selectedRiskType">
            <div class="risk-circle-small">
              <div class="risk-dot-small"></div>
            </div>
            <div class="risk-info">
              <div class="risk-title">{{ selectedRiskData.title }}</div>
              <div class="risk-stats">
                {{ selectedRiskData.count }} 个节点 / 总计 {{ currentRiskData.total }} 个
                ({{ getPercentage(selectedRiskData.count, currentRiskData.total) }}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 节点列表内容 -->
      <div class="node-list-content" v-if="selectedRiskData.nodeDetails && selectedRiskData.nodeDetails.length > 0">
        <div class="node-list-grid">
          <div
            v-for="(nodeDetail, index) in selectedRiskData.nodeDetails"
            :key="nodeDetail.id"
            class="node-item-card"
            :class="selectedRiskType"
            @click="navigateToNodeDetail(nodeDetail.id)">

            <div class="node-card-header">
              <div class="node-id-badge">{{ nodeDetail.id }}</div>
              <div class="node-risk-icon">
                <i :class="getRiskIcon(selectedRiskType)"></i>
              </div>
            </div>

            <div class="node-card-body">
              <div class="node-name-full">{{ nodeDetail.name }}</div>
              <div class="node-full-name" v-if="nodeDetail.fullName && nodeDetail.fullName !== nodeDetail.name">
                {{ nodeDetail.fullName }}
              </div>
              <div class="node-description-full">{{ nodeDetail.description }}</div>
            </div>

            <div class="node-card-footer" v-if="nodeDetail.updateTime">
              <div class="node-update-time">
                <i class="el-icon-time"></i>
                {{ formatUpdateTime(nodeDetail.updateTime) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 兼容旧数据格式 -->
      <div class="node-list-content" v-else-if="selectedRiskData.nodes && selectedRiskData.nodes.length > 0">
        <div class="simple-node-list">
          <div
            v-for="(node, index) in selectedRiskData.nodes"
            :key="index"
            class="simple-node-item"
            :class="selectedRiskType">
            {{ node }}
          </div>
        </div>
      </div>

      <!-- 无数据状态 -->
      <div class="no-nodes-message" v-else>
        <i class="el-icon-info"></i>
        <p>当前{{ selectedRiskData.title }}下暂无节点数据</p>
      </div>

      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeNodeListDialog">关闭</el-button>
        <el-button type="primary" @click="refreshCurrentRiskData">
          <i class="el-icon-refresh"></i>
          刷新数据
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import OperationFlow from '@/components/flows/OperationFlow.vue'
import { subProcessDataApi } from '@/api/subProcessDataApi'
import { processCardsData } from '@/data/subProcessCardsData'
import { nodeRiskData } from '@/data/node_risk_data'
import { topic01Api } from '@/api/topic01Api'

export default {
  name: 'OperationManagement',
  components: {
    OperationFlow
  },
  data() {
    return {
      // 数据状态
      loading: false,
      error: null,

      // 从API获取的数据
      processData: null,

      // 备用静态数据
      fallbackData: processCardsData,

      // 节点风险数据
      riskData: nodeRiskData,

      // 从MySQL数据库获取的风险统计数据
      dbRiskData: null,
      riskDataLoading: false,
      riskDataError: null,

      // 节点列表对话框相关数据
      nodeListDialogVisible: false,
      selectedRiskType: '',
      selectedRiskData: {}
    }
  },
  computed: {
    // 判断数据是否已加载完成
    dataLoaded() {
      return !this.loading && !this.riskDataLoading && (this.processData || this.error);
    },

    // 当前运维环节的数据
    currentData() {
      if (this.processData && this.processData.operation) {
        return this.processData.operation;
      }
      // 如果API数据不可用，使用备用数据
      return this.fallbackData.operation || this.fallbackData.purchase;
    },

    // 当前运维环节的风险数据
    currentRiskData() {
      // 优先使用从数据库获取的风险数据
      if (this.dbRiskData && this.dbRiskData.operation) {
        return this.dbRiskData.operation;
      }

      // 如果数据库数据不可用，使用静态风险数据作为备用
      return this.riskData.operation || this.riskData.purchase;
    },

    // 对话框标题
    nodeListDialogTitle() {
      const riskTypeName = this.getRiskTypeName(this.selectedRiskType);
      return `运维环节 - ${riskTypeName}节点列表`;
    }
  },
  async mounted() {
    // 并行加载流程数据和风险数据
    await Promise.all([
      this.loadData(),
      this.loadRiskData()
    ]);
  },
  methods: {
    // 计算百分比
    getPercentage(count, total) {
      if (total === 0) return 0;
      return Math.round((count / total) * 100);
    },

    // 从MySQL数据库加载风险数据
    async loadRiskData() {
      this.riskDataLoading = true;
      this.riskDataError = null;

      try {
        console.log('🔄 OperationManagement组件开始从MySQL加载风险数据...');

        const result = await topic01Api.getAllRiskStatistics();

        if (result.success && result.data) {
          this.dbRiskData = result.data;

          // 详细显示加载的风险数据
          console.log('✅ OperationManagement组件风险数据加载成功:', {
            processTypes: Object.keys(result.data),
            timestamp: new Date().toISOString()
          });

          // 显示运维环节的风险数据概况
          if (result.data.operation) {
            console.log(`📊 运维环节风险数据:`, {
              total: result.data.operation.total,
              high: result.data.operation.highRisk.count,
              medium: result.data.operation.mediumRisk.count,
              normal: result.data.operation.normal.count
            });
          }
        } else {
          throw new Error(result.error || '获取风险统计数据失败');
        }
      } catch (error) {
        console.error('❌ OperationManagement组件从MySQL加载风险数据失败:', error);
        this.riskDataError = error.message;
        this.dbRiskData = null;

        // 显示错误提示但不阻断页面运行
        this.$message({
          message: `风险数据加载失败，使用备用数据: ${error.message}`,
          type: 'warning',
          duration: 3000
        });
      } finally {
        this.riskDataLoading = false;
      }
    },

    // 从API加载数据
    async loadData() {
      this.loading = true;
      this.error = null;

      try {
        console.log('🔄 OperationManagement组件开始从API加载子流程数据...');

        // 检查API连接
        const connectionStatus = await subProcessDataApi.checkConnection();
        if (!connectionStatus.connected) {
          throw new Error('API服务器未启动，请先运行: npm run api-server');
        }

        const result = await subProcessDataApi.getSubProcessData();

        if (result.success && result.data) {
          this.processData = result.data;
          console.log('✅ OperationManagement组件子流程数据加载成功:', {
            dataKeys: Object.keys(result.data),
            message: result.message
          });
        } else {
          throw new Error(result.message || '获取子流程数据失败');
        }
      } catch (error) {
        console.error('❌ OperationManagement组件从API加载子流程数据失败:', error);
        this.error = error.message;
        this.processData = null;

        // 显示错误提示
        this.$message({
          message: `子流程数据加载失败: ${error.message}`,
          type: 'error',
          duration: 5000
        });
      } finally {
        this.loading = false;
      }
    },

    /**
     * 刷新子流程数据
     */
    async refreshData() {
      console.log('🔄 OperationManagement组件开始刷新数据');
      this.$message({
        message: '正在刷新流程数据和风险数据...',
        type: 'info',
        duration: 2000
      });

      // 并行刷新流程数据和风险数据
      await Promise.all([
        this.loadData(),
        this.loadRiskData()
      ]);

      if (!this.error && this.processData) {
        console.log('✅ 流程数据和风险数据刷新完成');
        this.$message({
          message: '数据刷新成功',
          type: 'success',
          duration: 2000
        });
      }
    },

    /**
     * 检查API连接状态
     */
    async checkApiConnection() {
      try {
        const status = await subProcessDataApi.checkConnection();
        console.log('🔍 OperationManagement API连接检查:', status);
        return status;
      } catch (error) {
        console.error('❌ OperationManagement API连接检查失败:', error);
        return { success: false, connected: false, message: error.message };
      }
    },

    /**
     * 获取组件状态信息
     */
    getComponentStatus() {
      const status = {
        loading: this.loading,
        riskDataLoading: this.riskDataLoading,
        error: this.error,
        riskDataError: this.riskDataError,
        hasProcessData: !!this.processData,
        hasRiskData: !!this.dbRiskData,
        availableProcesses: this.processData ? Object.keys(this.processData) : [],
        availableRiskProcesses: this.dbRiskData ? Object.keys(this.dbRiskData) : [],
        usingFallbackData: !this.processData,
        usingFallbackRiskData: !this.dbRiskData,
        apiMode: true
      };

      console.log('📊 OperationManagement组件状态:', status);
      return status;
    },

    /**
     * 调试方法：显示当前风险数据详情
     */
    debugRiskData() {
      console.log('🔍 当前风险数据详情:');
      console.log('dbRiskData:', this.dbRiskData);
      console.log('riskData (备用):', this.riskData);
      console.log('currentRiskData:', this.currentRiskData);

      if (this.dbRiskData && this.dbRiskData.operation) {
        console.log('📊 运维环节风险数据包含的环节:', Object.keys(this.dbRiskData));
        console.log('运维环节:', {
          total: this.dbRiskData.operation.total,
          high: (this.dbRiskData.operation.highRisk && this.dbRiskData.operation.highRisk.count) || 0,
          medium: (this.dbRiskData.operation.mediumRisk && this.dbRiskData.operation.mediumRisk.count) || 0,
          normal: (this.dbRiskData.operation.normal && this.dbRiskData.operation.normal.count) || 0
        });
      }
    },

    /**
     * 调试方法：显示当前节点详情数据
     */
    debugNodeDetails() {
      console.log('🔍 当前运维环节节点详情:');
      if (this.currentRiskData) {
        console.log('运维环节风险分析:');

        if (this.currentRiskData.highRisk && this.currentRiskData.highRisk.nodeDetails) {
          console.log('🔴 高风险节点详情:', this.currentRiskData.highRisk.nodeDetails);
        }

        if (this.currentRiskData.mediumRisk && this.currentRiskData.mediumRisk.nodeDetails) {
          console.log('🟡 中风险节点详情:', this.currentRiskData.mediumRisk.nodeDetails);
        }

        if (this.currentRiskData.normal && this.currentRiskData.normal.nodeDetails) {
          console.log('🟢 正常节点详情:', this.currentRiskData.normal.nodeDetails);
        }
      } else {
        console.log('⚠️ 当前没有风险数据');
      }
    },

    /**
     * 显示风险节点列表对话框
     */
    showRiskNodes(riskType) {
      console.log(`🔍 显示${riskType}风险节点列表`);

      this.selectedRiskType = riskType;

      // 根据风险类型获取对应的数据
      let riskData = {};
      switch (riskType) {
        case 'high':
          riskData = this.currentRiskData.highRisk || {};
          break;
        case 'medium':
          riskData = this.currentRiskData.mediumRisk || {};
          break;
        case 'normal':
          riskData = this.currentRiskData.normal || {};
          break;
        default:
          console.warn('未知的风险类型:', riskType);
          return;
      }

      this.selectedRiskData = riskData;
      this.nodeListDialogVisible = true;

      console.log(`✅ 打开${riskType}风险节点对话框，节点数量: ${riskData.count || 0}`);
    },

    /**
     * 关闭节点列表对话框
     */
    closeNodeListDialog() {
      console.log('🔄 关闭节点列表对话框');
      this.nodeListDialogVisible = false;
      this.selectedRiskType = '';
      this.selectedRiskData = {};
    },

    /**
     * 导航到节点详情页面
     */
    navigateToNodeDetail(nodeId) {
      console.log(`🔗 导航到节点详情: ${nodeId}`);
      this.$router.push({
        name: 'NodeDetailView',
        params: { nodeId: nodeId }
      });
    },

    /**
     * 刷新当前风险数据
     */
    async refreshCurrentRiskData() {
      console.log('🔄 刷新当前风险数据');
      this.$message({
        message: '正在刷新风险数据...',
        type: 'info',
        duration: 2000
      });

      await this.loadRiskData();

      // 重新获取选中的风险数据
      this.showRiskNodes(this.selectedRiskType);

      this.$message({
        message: '风险数据刷新成功',
        type: 'success',
        duration: 2000
      });
    },

    /**
     * 获取风险类型名称
     */
    getRiskTypeName(riskType) {
      const riskTypeNames = {
        'high': '高风险',
        'medium': '中风险',
        'normal': '正常'
      };
      return riskTypeNames[riskType] || riskType;
    },

    /**
     * 获取风险图标
     */
    getRiskIcon(riskType) {
      const riskIcons = {
        'high': 'el-icon-warning',
        'medium': 'el-icon-warning-outline',
        'normal': 'el-icon-success'
      };
      return riskIcons[riskType] || 'el-icon-info';
    },

    /**
     * 格式化更新时间
     */
    formatUpdateTime(updateTime) {
      if (!updateTime) return '';

      try {
        const date = new Date(updateTime);
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        console.warn('时间格式化失败:', updateTime, error);
        return updateTime;
      }
    }
  },
  beforeDestroy() {
    // 清除监听
    console.log('🔄 OperationManagement组件销毁');
  }
}
</script>

<style scoped>
.operation-management {
  padding: 0;
  position: relative;
  height: 100%;
}

.page-header {
  text-align: left;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
}

.page-title {
  font-size: 14px;
  color: #000000;
  font-weight: 500;
}

/* 数据状态指示器样式 */
.data-status {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.status-loading {
  color: #1890ff;
}

.status-loading i {
  margin-right: 4px;
}

.status-error {
  color: #f5222d;
}

.status-error i {
  margin-right: 4px;
}

.status-success {
  color: #52c41a;
}

.status-success i {
  margin-right: 4px;
}

.content-container {
  height: calc(100% - 40px);
  display: flex;
  flex-direction: column;
}

.upper-section {
  height: 30%;
  padding: 20px 0;
  display: flex;
  align-items: center;
  overflow: auto;
}

.info-blocks-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 0 15px;
  gap: 15px;
}

.info-block {
  width: 30%;
  height: 200px;
  margin: 0;
  border-radius: 8px !important;
  background-color: #ffffff !important;
  border: 1px solid #91d5ff !important;
  transition: all 0.3s ease;
}

.info-block:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1) !important;
}

/* 风险级别卡片样式 */
.info-block.risk-high {
  border: 2px solid #f5222d !important;
}

.info-block.risk-medium {
  border: 2px solid #fa8c16 !important;
}

.info-block.risk-normal {
  border: 2px solid #52c41a !important;
}

/* 覆盖Element UI卡片的内部样式 */
.info-block /deep/ .el-card__body {
  padding: 15px;
  height: 100%;
  background-color: #ffffff;
  border-radius: 8px;
}

.info-block-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 其余样式与 SubProcessManagement.vue 保持一致 */
.card-title {
  font-size: 12px;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-title i {
  font-size: 14px;
}

/* 风险计数容器样式 */
.risk-count-container {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin: 15px 0 10px 0;
}

.risk-count {
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
}

.risk-high .risk-count {
  color: #f5222d;
}

.risk-medium .risk-count {
  color: #fa8c16;
}

.risk-normal .risk-count {
  color: #52c41a;
}

.risk-total {
  font-size: 16px;
  color: #8c8c8c;
  margin-left: 5px;
}

/* 风险百分比样式 */
.risk-percentage {
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
}

.risk-high .risk-percentage {
  color: #f5222d;
}

.risk-medium .risk-percentage {
  color: #fa8c16;
}

.risk-normal .risk-percentage {
  color: #52c41a;
}

/* 风险节点列表样式 */
.risk-nodes-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 85px;
  overflow: hidden;
}

/* 新的节点卡片样式 */
.risk-node-card {
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 6px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.risk-node-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: #d0d7de;
}

.risk-high .risk-node-card {
  border-left: 3px solid #f5222d;
  background: linear-gradient(135deg, #fff2f0 0%, #ffffff 100%);
}

.risk-high .risk-node-card:hover {
  border-color: #f5222d;
  box-shadow: 0 2px 8px rgba(245, 34, 45, 0.15);
}

.risk-medium .risk-node-card {
  border-left: 3px solid #fa8c16;
  background: linear-gradient(135deg, #fff7e6 0%, #ffffff 100%);
}

.risk-medium .risk-node-card:hover {
  border-color: #fa8c16;
  box-shadow: 0 2px 8px rgba(250, 140, 22, 0.15);
}

.normal-node-card {
  background: linear-gradient(135deg, #f6ffed 0%, #ffffff 100%);
  border: 1px solid #d9f7be;
  border-left: 3px solid #52c41a;
  border-radius: 6px;
  padding: 6px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.normal-node-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(82, 196, 26, 0.15);
  border-color: #52c41a;
}

/* 节点卡片内部元素 */
.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}

.node-id {
  font-size: 10px;
  font-weight: 600;
  color: #495057;
  background: rgba(108, 117, 125, 0.1);
  padding: 1px 4px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}

.risk-icon {
  font-size: 12px;
  opacity: 0.7;
}

.risk-high .risk-icon {
  color: #f5222d;
}

.risk-medium .risk-icon {
  color: #fa8c16;
}

.normal-node-card .risk-icon {
  color: #52c41a;
}

.node-name {
  font-size: 11px;
  font-weight: 500;
  color: #212529;
  line-height: 1.2;
  margin-bottom: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.node-description {
  font-size: 9px;
  color: #6c757d;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-style: italic;
}

/* 更多节点卡片 */
.more-nodes-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px 6px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px dashed #ced4da;
  border-radius: 4px;
  font-size: 10px;
  color: #6c757d;
  transition: all 0.2s ease;
}

.more-nodes-card:hover {
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
  color: #495057;
}

.more-nodes-card.normal {
  background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
  border-color: #b7eb8f;
  color: #52c41a;
}

.more-nodes-card.normal:hover {
  background: linear-gradient(135deg, #d9f7be 0%, #b7eb8f 100%);
  color: #389e0d;
}

/* 兼容旧样式 */
.risk-node-item-simple {
  font-size: 11px;
  color: #666;
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-nodes {
  font-size: 10px;
  color: #999;
  text-align: center;
  font-style: italic;
}

/* 正常节点区域样式 */
.normal-nodes-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.normal-nodes-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 85px;
  overflow: hidden;
}

/* 正常状态样式 */
.normal-status {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.lower-section {
  height: 70%;
  padding: 30px 0;
  overflow: auto;
}

.divider {
  height: 5px;
  width: 100%;
  background-color: #dcdfe6;
  margin: 0;
}

.status-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 92%;
  padding: 10px 0;
  flex: 1;
  justify-content: flex-start;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
}

.status-item i {
  font-size: 16px;
}

.status-item.success {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-item.warning {
  background-color: #fff7e6;
  color: #fa8c16;
}

.status-item.error {
  background-color: #fff1f0;
  color: #f5222d;
}

/* 加载状态样式 */
.loading-container {
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
  background-color: #fafafa;
  border-radius: 8px;
  margin: 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  font-size: 16px;
  margin: 0;
}

/* 错误状态样式 */
.error-container {
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
}

.error-message {
  text-align: center;
  color: #ff4757;
  padding: 40px;
  border: 2px solid #ff4757;
  border-radius: 12px;
  background-color: #fff5f5;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(255, 71, 87, 0.1);
}

.error-message i {
  font-size: 48px;
  margin-bottom: 20px;
  display: block;
  color: #ff4757;
}

.error-message p {
  margin: 20px 0;
  font-size: 16px;
  line-height: 1.5;
}

/* 无数据状态样式 */
.no-data-container {
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
}

.no-data-message {
  text-align: center;
  color: #8c8c8c;
  padding: 40px;
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  background-color: #fafafa;
  max-width: 400px;
}

.no-data-message i {
  font-size: 48px;
  margin-bottom: 20px;
  display: block;
  color: #8c8c8c;
}

.no-data-message p {
  margin: 20px 0;
  font-size: 16px;
  line-height: 1.5;
}

/* ==================== 节点列表对话框样式 ==================== */

/* 对话框整体样式 */
.node-list-dialog /deep/ .el-dialog {
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.node-list-dialog /deep/ .el-dialog__header {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-bottom: 1px solid #e2e8f0;
  border-radius: 12px 12px 0 0;
  padding: 20px 24px 16px;
}

.node-list-dialog /deep/ .el-dialog__title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.node-list-dialog /deep/ .el-dialog__body {
  padding: 0;
  max-height: 600px;
  overflow-y: auto;
}

/* 对话框头部区域 */
.dialog-header {
  padding: 20px 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-bottom: 1px solid #e2e8f0;
}

.risk-summary {
  display: flex;
  align-items: center;
  gap: 16px;
}

.risk-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 小版本的风险圆形指示器 */
.risk-circle-small {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
}

.risk-dot-small {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
  position: relative;
}

.risk-dot-small::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 4px;
  height: 4px;
  background: rgba(255,255,255,0.9);
  border-radius: 50%;
}

/* 风险指示器颜色 */
.risk-indicator.high .risk-circle-small {
  background: linear-gradient(135deg, #ff4757 0%, #ff3742 100%);
}

.risk-indicator.medium .risk-circle-small {
  background: linear-gradient(135deg, #ffa502 0%, #ff9500 100%);
}

.risk-indicator.normal .risk-circle-small {
  background: linear-gradient(135deg, #2ed573 0%, #1dd1a1 100%);
}

.risk-info {
  flex: 1;
}

.risk-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.risk-indicator.high .risk-title {
  color: #ff4757;
}

.risk-indicator.medium .risk-title {
  color: #ffa502;
}

.risk-indicator.normal .risk-title {
  color: #2ed573;
}

.risk-stats {
  font-size: 14px;
  color: #64748b;
}

/* 节点列表内容区域 */
.node-list-content {
  padding: 20px 24px;
}

.node-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

/* 节点卡片样式 */
.node-item-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.node-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.node-item-card.high {
  border-left: 4px solid #ff4757;
  background: linear-gradient(135deg, #fff2f0 0%, #ffffff 100%);
}

.node-item-card.high:hover {
  border-color: #ff4757;
  box-shadow: 0 8px 25px rgba(255, 71, 87, 0.15);
}

.node-item-card.medium {
  border-left: 4px solid #ffa502;
  background: linear-gradient(135deg, #fff7e6 0%, #ffffff 100%);
}

.node-item-card.medium:hover {
  border-color: #ffa502;
  box-shadow: 0 8px 25px rgba(250, 140, 22, 0.15);
}

.node-item-card.normal {
  border-left: 4px solid #2ed573;
  background: linear-gradient(135deg, #f6ffed 0%, #ffffff 100%);
}

.node-item-card.normal:hover {
  border-color: #2ed573;
  box-shadow: 0 8px 25px rgba(46, 213, 115, 0.15);
}

/* 节点卡片头部 */
.node-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.node-id-badge {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.node-risk-icon {
  font-size: 18px;
  opacity: 0.8;
}

.node-item-card.high .node-risk-icon {
  color: #ff4757;
}

.node-item-card.medium .node-risk-icon {
  color: #ffa502;
}

.node-item-card.normal .node-risk-icon {
  color: #2ed573;
}

/* 节点卡片主体 */
.node-card-body {
  margin-bottom: 12px;
}

.node-name-full {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
  line-height: 1.4;
}

.node-full-name {
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 8px;
  font-weight: 500;
}

.node-description-full {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 节点卡片底部 */
.node-card-footer {
  padding-top: 8px;
  border-top: 1px solid #f1f5f9;
}

.node-update-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
}

.node-update-time i {
  font-size: 12px;
}

/* 简单节点列表（兼容旧格式） */
.simple-node-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.simple-node-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px 16px;
  text-align: center;
  font-size: 14px;
  color: #374151;
  transition: all 0.2s ease;
}

.simple-node-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.simple-node-item.high {
  border-left: 3px solid #ff4757;
  background: #fff2f0;
}

.simple-node-item.medium {
  border-left: 3px solid #ffa502;
  background: #fff7e6;
}

.simple-node-item.normal {
  border-left: 3px solid #2ed573;
  background: #f6ffed;
}

/* 无数据消息 */
.no-nodes-message {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.no-nodes-message i {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
  color: #9ca3af;
}

.no-nodes-message p {
  font-size: 16px;
  margin: 0;
}

/* 对话框底部 */
.dialog-footer {
  padding: 16px 24px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 风险卡片悬停效果增强 */
.info-block {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.info-block::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
  pointer-events: none;
}

.info-block:hover::before {
  transform: translateX(100%);
}

.info-block:hover .card-title {
  color: #1f2937;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .node-list-dialog /deep/ .el-dialog {
    width: 95% !important;
    margin: 0 auto !important;
  }

  .node-list-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .dialog-header,
  .node-list-content,
  .dialog-footer {
    padding: 16px;
  }

  .risk-summary {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .simple-node-list {
    grid-template-columns: 1fr;
  }
}
</style>
