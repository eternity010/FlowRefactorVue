<template>
  <div class="rag-config-container">
    <el-card class="rag-config-card">
      <div slot="header" class="rag-config-header">
        <span>RAG配置</span>
        <el-tag size="small" type="primary">版本 1.0</el-tag>
      </div>
      <div class="rag-config-content">
        <h2 class="rag-title">RAG (检索增强生成) 配置</h2>
        <p class="rag-description">在此页面配置RAG相关参数和设置</p>
        
        <!-- 多场景决策模型及知识图谱RAG配置 -->
        <div class="rag-section" :class="{ 'disabled-section': !ragEnabledStatus.processOptimization }">
          <div class="section-header">
            <h3 class="section-title">
              <i class="el-icon-share"></i>
              多场景决策模型及知识图谱RAG
            </h3>
            <div class="section-control">
              <span class="control-label">启用</span>
              <el-switch
                v-model="ragEnabledStatus.processOptimization"
                @change="handleRAGStatusChange('processOptimization', $event)"
                active-color="#67C23A"
                inactive-color="#DCDFE6">
              </el-switch>
            </div>
          </div>
          
          <!-- 课题二研究成果数据源 -->
          <div class="config-subsection">
            <h4 class="subsection-title">课题二研究成果数据源</h4>
            <el-table :data="processOptimizationConfig" stripe class="config-table">
              <el-table-column prop="dataSource" label="数据来源" width="180">
                <template slot-scope="scope">
                  <el-tag :type="getDataSourceTagType(scope.row.dataSource)" size="small">
                    {{ scope.row.dataSource }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="description" label="具体内容" min-width="240">
                <template slot-scope="scope">
                  <span class="data-description-text">{{ scope.row.description }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="processing" label="处理方式" width="140">
                <template slot-scope="scope">
                  <el-tag :type="getProcessingTagType(scope.row.processing)" size="small">
                    {{ scope.row.processing }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button 
                    type="text" 
                    size="small" 
                    @click="configureProcessOptimization(scope.row)"
                    :disabled="!ragEnabledStatus.processOptimization"
                    icon="el-icon-setting">
                    配置
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>


        
        <!-- 操作按钮区域 -->
        <div class="action-buttons">
          <el-button 
            type="primary" 
            size="medium" 
            @click="applyAndReturn"
            icon="el-icon-check">
            应用并返回
          </el-button>
          <el-button 
            size="medium" 
            @click="cancelAndReturn"
            icon="el-icon-close">
            取消
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'RAGConfigView',
  mounted() {
    this.loadRAGStatus();
  },
  data() {
    return {
      // 多场景决策模型及知识图谱RAG配置 - 基于课题二研究成果
      processOptimizationConfig: [
        {
          dataSource: '多场景智能运营决策模型',
          description: '物料供应-生产调度融合决策机制，构建生产、采购一体化模型',
          processing: '模型接口'
        },
        {
          dataSource: '知识图谱系统',
          description: '面向多场景运营决策的知识图谱构建技术，装备制造知识获取',
          processing: '图谱查询'
        }
      ],

      // RAG启用状态
      ragEnabledStatus: {
        processOptimization: false  // 多场景决策模型及知识图谱RAG默认关闭
      }
    }
  },
  methods: {
    
    // 获取数据来源标签颜色
    getDataSourceTagType(dataSource) {
      const sourceMap = {
        '多场景智能运营决策模型': 'success',
        '知识图谱系统': 'warning'
      };
      return sourceMap[dataSource] || 'info';
    },
    
    // 获取处理方式标签颜色
    getProcessingTagType(processing) {
      const processingMap = {
        '模型接口': 'success',
        '图谱查询': 'warning'
      };
      return processingMap[processing] || 'info';
    },
    
    // 配置多场景决策模型及知识图谱
    configureProcessOptimization(row) {
      if (!this.ragEnabledStatus.processOptimization) {
        this.$message.warning('请先启用多场景决策模型及知识图谱RAG');
        return;
      }
      this.$message.info(`正在配置 ${row.dataSource} - ${row.processing}...`);
      // TODO: 实现具体的多场景决策模型及知识图谱配置功能
    },
    

    
    // 处理RAG启用状态变化
    handleRAGStatusChange(ragType, status) {
      const ragNames = {
        processOptimization: '多场景决策模型及知识图谱RAG'
      };
      
      if (status) {
        this.$message.success(`${ragNames[ragType]} 已启用`);
      } else {
        this.$message.info(`${ragNames[ragType]} 已禁用`);
      }
      
      // 保存状态到localStorage
      localStorage.setItem('ragEnabledStatus', JSON.stringify(this.ragEnabledStatus));
    },
    
    // 加载RAG启用状态
    loadRAGStatus() {
      const savedStatus = localStorage.getItem('ragEnabledStatus');
      if (savedStatus) {
        try {
          this.ragEnabledStatus = { ...this.ragEnabledStatus, ...JSON.parse(savedStatus) };
        } catch (error) {
          console.error('加载RAG状态失败:', error);
        }
      }
    },
    
    // 应用设置并返回
    applyAndReturn() {
      // 保存当前的RAG配置状态
      localStorage.setItem('ragEnabledStatus', JSON.stringify(this.ragEnabledStatus));
      
      // 统计启用的RAG数量
      const enabledRAGs = Object.values(this.ragEnabledStatus).filter(status => status).length;
      const totalRAGs = Object.keys(this.ragEnabledStatus).length;
      
      this.$message.success(`RAG配置已保存：${enabledRAGs}/${totalRAGs} 个RAG已启用`);
      
      // 延迟返回，让用户看到成功消息
      setTimeout(() => {
        this.goBack();
      }, 1500);
    },
    
    // 取消并返回
    cancelAndReturn() {
      this.$confirm('确认取消配置吗？未保存的更改将丢失。', '取消确认', {
        confirmButtonText: '确定取消',
        cancelButtonText: '继续配置',
        type: 'warning'
      }).then(() => {
        // 重新加载保存的状态，撤销当前更改
        this.loadRAGStatus();
        this.$message.info('已取消配置，返回上级页面');
        this.goBack();
      }).catch(() => {
        this.$message.info('继续配置RAG');
      });
    },
    
    // 返回上级页面
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.rag-config-container {
  padding: 20px;
}

.rag-config-card {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.rag-config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
}

.rag-config-content {
  padding: 40px 20px;
}

.rag-title {
  font-size: 28px;
  color: #303133;
  margin-bottom: 20px;
  font-weight: bold;
  text-align: center;
}

.rag-description {
  font-size: 16px;
  color: #606266;
  margin-bottom: 40px;
  line-height: 1.6;
  text-align: center;
}

.rag-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.rag-section.disabled-section {
  background-color: #f5f7fa;
  opacity: 0.6;
}

.rag-section.disabled-section .config-table {
  pointer-events: none;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.section-title {
  font-size: 20px;
  color: #303133;
  font-weight: bold;
  margin-bottom: 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #409EFF;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.section-title i {
  color: #F56C6C;
  font-size: 22px;
}

.config-subsection {
  margin-bottom: 20px;
}

.subsection-title {
  font-size: 16px;
  color: #409EFF;
  font-weight: bold;
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 4px solid #409EFF;
}

.config-table {
  width: 100%;
  margin-top: 10px;
}

.data-source-text {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  color: #606266;
}

.data-description-text {
  font-size: 13px;
  color: #606266;
  line-height: 1.4;
}

.section-title i.el-icon-share {
  color: #409EFF;
}

/* 表格样式优化 */
.config-table ::v-deep .el-table__header {
  background-color: #f8f9fa;
}

.config-table ::v-deep .el-table__header th {
  background-color: #f8f9fa !important;
  color: #303133;
  font-weight: bold;
}

.config-table ::v-deep .el-table__row:hover {
  background-color: #f5f7fa;
}

.config-table ::v-deep .el-button--text {
  color: #409EFF;
}

.config-table ::v-deep .el-button--text:hover {
  color: #66b1ff;
}

/* 操作按钮区域样式 */
.action-buttons {
  margin-top: 40px;
  padding: 25px 0 15px 0;
  text-align: center;
  border-top: 2px solid #ebeef5;
  background-color: #fafafa;
  border-radius: 0 0 8px 8px;
  margin-left: -20px;
  margin-right: -20px;
  margin-bottom: -20px;
}

.action-buttons .el-button {
  margin: 0 12px;
  min-width: 140px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 14px;
}

.action-buttons .el-button--primary {
  background: linear-gradient(135deg, #409EFF, #66b1ff);
  border: none;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.action-buttons .el-button--primary:hover {
  background: linear-gradient(135deg, #66b1ff, #409EFF);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

.action-buttons .el-button:not(.el-button--primary) {
  border: 1px solid #dcdfe6;
  color: #606266;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-buttons .el-button:not(.el-button--primary):hover {
  border-color: #c0c4cc;
  color: #409EFF;
  background-color: #ecf5ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-buttons .el-button i {
  margin-right: 6px;
}
</style> 