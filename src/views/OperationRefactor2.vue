<template>
  <div class="operation-refactor2-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-button 
        type="primary" 
        icon="el-icon-back" 
        @click="goBack"
        class="back-btn">
        返回上一步
      </el-button>
      <h2 class="page-title">人员匹配度概览</h2>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <el-card class="content-card" shadow="hover">
        <!-- 当数据已加载时显示标题和操作 -->
        <div v-if="dataLoaded" slot="header" class="card-header">
          <span class="card-title">
            <i class="el-icon-user"></i>
            人员匹配度统计
          </span>
          <div class="header-actions">
            <el-input
              v-model="searchText"
              placeholder="搜索人员"
              size="small"
              prefix-icon="el-icon-search"
              clearable
              class="search-input">
            </el-input>
            <el-select 
              v-model="sortBy" 
              size="small" 
              @change="loadPersonList"
              class="sort-select">
              <el-option label="按平均匹配度排序" value="avg_match_score"></el-option>
              <el-option label="按匹配车辆数排序" value="match_count"></el-option>
              <el-option label="按高匹配车辆数排序" value="high_match_count"></el-option>
              <el-option label="按人员ID排序" value="person_id"></el-option>
            </el-select>
            <el-button-group size="small" class="sort-direction">
              <el-button 
                :type="sortOrder === 'desc' ? 'primary' : ''"
                @click="changeSortOrder('desc')">
                <i class="el-icon-sort-down"></i>
              </el-button>
              <el-button 
                :type="sortOrder === 'asc' ? 'primary' : ''"
                @click="changeSortOrder('asc')">
                <i class="el-icon-sort-up"></i>
              </el-button>
            </el-button-group>
          </div>
        </div>
        
        <!-- 当数据未加载时显示提示信息 -->
        <div v-if="!dataLoaded" class="welcome-content">
          <div class="welcome-icon">
            <i class="el-icon-pie-chart"></i>
          </div>
          <h3 class="welcome-title">人员匹配度概览</h3>
          <p class="welcome-description">
            点击下方按钮获取完整的人员匹配度统计信息，包括每位人员的平均匹配度、匹配车辆数量等详细数据。
          </p>
        </div>
        
        <!-- 当数据已加载时显示统计内容 -->
        <div v-if="dataLoaded">
          <!-- 加载状态 -->
          <el-skeleton :loading="loading" animated>
            <template slot="template">
              <div class="skeleton-grid">
                <div class="skeleton-card" v-for="n in 6" :key="n">
                  <div class="skeleton-header">
                    <el-skeleton-item variant="circle" style="width: 50px; height: 50px;" />
                    <div class="skeleton-title">
                      <el-skeleton-item variant="text" style="width: 60%; margin-bottom: 6px;" />
                      <el-skeleton-item variant="text" style="width: 40%;" />
                    </div>
                  </div>
                  <div class="skeleton-content">
                    <div class="skeleton-row">
                      <el-skeleton-item variant="rect" style="width: 48%; height: 70px;" />
                      <el-skeleton-item variant="rect" style="width: 48%; height: 70px;" />
                    </div>
                    <div class="skeleton-row">
                      <el-skeleton-item variant="rect" style="width: 48%; height: 70px;" />
                      <el-skeleton-item variant="rect" style="width: 48%; height: 70px;" />
                    </div>
                  </div>
                </div>
              </div>
            </template>
            
            <!-- 人员卡片网格 -->
            <div class="person-grid">
              <el-card 
                v-for="person in filteredPersons" 
                :key="person.person_id"
                class="person-card"
                shadow="hover"
                @click.native="showPersonDetail(person)">
                <div class="card-header">
                  <div class="person-avatar">
                    <i class="el-icon-user"></i>
                  </div>
                  <div class="person-title">
                    <h3 class="person-name">{{ person.person_id }}</h3>
                  </div>
                </div>
                
                <div class="card-content">
                  <div class="stat-row">
                    <div class="stat-item">
                      <div class="stat-icon">
                        <i class="el-icon-data-line"></i>
                      </div>
                      <div class="stat-info">
                        <div class="stat-label">平均匹配度</div>
                        <div class="stat-value">{{ parseFloat(person.avg_match_score).toFixed(3) }}</div>
                      </div>
                    </div>
                    
                    <div class="stat-item">
                      <div class="stat-icon">
                        <i class="el-icon-pie-chart"></i>
                      </div>
                      <div class="stat-info">
                        <div class="stat-label">匹配车辆</div>
                        <div class="stat-value">{{ person.match_count }} 辆</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="stat-row">
                    <div class="stat-item">
                      <div class="stat-icon">
                        <i class="el-icon-trophy"></i>
                      </div>
                      <div class="stat-info">
                        <div class="stat-label">最高匹配度</div>
                        <div class="stat-value">{{ parseFloat(person.max_match_score).toFixed(3) }}</div>
                      </div>
                    </div>
                    
                    <div class="stat-item">
                      <div class="stat-icon">
                        <i class="el-icon-star-on"></i>
                      </div>
                      <div class="stat-info">
                        <div class="stat-label">高匹配车辆</div>
                        <div class="stat-value">{{ person.high_match_count || 0 }} 辆</div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
            
            <!-- 空状态 -->
            <div v-if="!loading && filteredPersons.length === 0" class="empty-state">
              <i class="el-icon-user-solid empty-icon"></i>
              <p class="empty-text">暂无人员数据</p>
            </div>
          </el-skeleton>
        </div>
        
        <!-- 分页 -->
        <div class="pagination-wrapper" v-if="dataLoaded && pagination.total > pagination.pageSize">
          <el-pagination
            @current-change="handlePageChange"
            :current-page="pagination.page"
            :page-size="pagination.pageSize"
            layout="prev, pager, next, jumper, total"
            :total="pagination.total">
          </el-pagination>
        </div>
        
        <!-- 获取统计按钮 -->
        <div v-if="!dataLoaded" class="action-section">
          <el-button 
            type="primary" 
            size="large"
            :loading="loading"
            @click="fetchPersonStatistics"
            class="fetch-btn">
            <i v-if="!loading" class="el-icon-data-line"></i>
            {{ loading ? '正在获取统计数据...' : '获取人员匹配度统计' }}
          </el-button>
        </div>
      </el-card>
      
      <!-- 下一步按钮 -->
      <div v-if="dataLoaded" class="next-step-section">
        <el-button 
          type="success" 
          size="large"
          @click="goToNextStep"
          class="next-step-btn">
          <i class="el-icon-right"></i>
          下一步
        </el-button>
      </div>
    </div>
    
    <!-- 人员详情对话框 -->
    <el-dialog
      :title="`${selectedPersonDetail.person_id} 的高匹配车辆详情`"
      :visible.sync="detailDialogVisible"
      width="70%"
      :close-on-click-modal="false">
      <div class="detail-header">
        <el-tag type="info" size="medium">
          <i class="el-icon-info"></i>
          显示匹配度大于 0.67 的车辆
        </el-tag>
      </div>
      
      <el-table
        v-loading="detailLoading"
        :data="highMatchVehicles"
        border
        stripe
        style="width: 100%"
        :default-sort="{prop: 'match_score', order: 'descending'}">
        <el-table-column
          prop="person_id"
          label="人员ID"
          width="150"
          align="center">
        </el-table-column>
        <el-table-column
          prop="train_id"
          label="车辆ID"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="match_score"
          label="匹配度"
          width="120"
          align="center"
          sortable>
          <template slot-scope="scope">
            <el-progress
              :percentage="Math.round(parseFloat(scope.row.match_score) * 100)"
              :color="getMatchProgressColor(scope.row.match_score)"
              :stroke-width="8"
              :show-text="false">
            </el-progress>
            <div class="score-text">{{ parseFloat(scope.row.match_score).toFixed(3) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          min-width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.remark">{{ scope.row.remark }}</span>
            <span v-else class="no-remark">暂无备注</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="update_time"
          label="更新时间"
          width="180"
          align="center">
          <template slot-scope="scope">
            {{ formatDetailTime(scope.row.update_time) }}
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="detail-pagination" v-if="detailPagination.total > detailPagination.pageSize">
        <el-pagination
          @current-change="handleDetailPageChange"
          :current-page="detailPagination.page"
          :page-size="detailPagination.pageSize"
          layout="prev, pager, next, total"
          :total="detailPagination.total">
        </el-pagination>
      </div>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import topic03Api from '@/api/topic03Api'

export default {
  name: 'OperationRefactor2',
  data() {
    return {
      // 路由参数
      routeParams: this.$route.params,
      routeQuery: this.$route.query,
      
      // 数据
      loading: false,
      personList: [],
      searchText: '',
      dataLoaded: false, // 控制是否已获取数据
      
      // 排序和分页
      sortBy: 'avg_match_score',
      sortOrder: 'desc',
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0
      },
      
      // 详情对话框
      detailDialogVisible: false,
      detailLoading: false,
      selectedPersonDetail: {},
      highMatchVehicles: [],
      detailPagination: {
        page: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {
    filteredPersons() {
      if (!this.searchText) {
        return this.personList
      }
      return this.personList.filter(person => 
        person.person_id.toLowerCase().includes(this.searchText.toLowerCase())
      )
    }
  },
  mounted() {
    console.log('📍 OperationRefactor2 页面已加载')
    console.log('📊 路由参数:', this.routeParams)
    console.log('🔍 查询参数:', this.routeQuery)
    // 不自动加载数据，等待用户点击按钮
  },
  methods: {
    async fetchPersonStatistics() {
      try {
        this.loading = true
        console.log('🔄 开始获取人员匹配度统计...')
        
        // 模拟2秒加载时间
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        await this.loadPersonList()
        this.dataLoaded = true
        
        this.$message.success('人员匹配度统计获取成功')
        console.log('✅ 人员匹配度统计获取完成')
      } catch (error) {
        this.$message.error('获取统计数据失败，请稍后重试')
        console.error('❌ 获取统计数据失败:', error)
      }
    },
    
    async loadPersonList() {
      try {
        this.loading = true
        console.log('🔄 开始加载人员列表...')
        
        const options = {
          sortBy: this.sortBy,
          sortOrder: this.sortOrder,
          page: this.pagination.page,
          pageSize: this.pagination.pageSize
        }
        
        const result = await topic03Api.getPersonList(options)
        
        if (result.success) {
          this.personList = result.data.persons || []
          this.pagination = {
            ...this.pagination,
            ...result.data.pagination
          }
          console.log('✅ 人员列表加载成功:', this.personList.length, '条记录')
          console.log('📊 高匹配车辆统计已包含（匹配度>0.67，不含0.67）')
        } else {
          this.$message.error(result.error || '获取人员列表失败')
          console.error('❌ 获取人员列表失败:', result.error)
        }
      } catch (error) {
        this.$message.error('网络错误，请稍后重试')
        console.error('❌ 网络错误:', error)
      } finally {
        this.loading = false
      }
    },
    
    changeSortOrder(order) {
      if (this.sortOrder !== order) {
        this.sortOrder = order
        this.pagination.page = 1
        this.loadPersonList()
      }
    },
    
    handlePageChange(page) {
      this.pagination.page = page
      this.loadPersonList()
    },
    
    async showPersonDetail(person) {
      console.log('👤 显示人员详情:', person.person_id)
      this.selectedPersonDetail = person
      this.detailDialogVisible = true
      this.detailPagination.page = 1
      await this.loadHighMatchVehicles()
    },
    
    async loadHighMatchVehicles() {
      try {
        this.detailLoading = true
        console.log('🔄 加载高匹配车辆数据...')
        
        const options = {
          sortBy: 'match_score',
          sortOrder: 'desc',
          page: this.detailPagination.page,
          pageSize: this.detailPagination.pageSize,
          minMatchScore: 0.67 // 高匹配阈值：只获取匹配度大于0.67的记录
        }
        
        console.log('🔍 查询条件:', options)
        console.log('👤 选中人员:', this.selectedPersonDetail.person_id)
        
        const result = await topic03Api.getPersonTrainMatches(this.selectedPersonDetail.person_id, options)
        
        console.log('📡 完整API响应:', JSON.stringify(result, null, 2))
        
        if (result && result.success) {
          console.log('✅ API调用成功')
          console.log('📋 响应数据结构:', result.data)
          
          this.highMatchVehicles = result.data.matches || []
          this.detailPagination = {
            ...this.detailPagination,
            ...result.data.pagination
          }
          
          console.log('✅ 高匹配车辆数据加载成功:', this.highMatchVehicles.length, '条记录')
          console.log('📊 车辆数据详情:', this.highMatchVehicles)
          console.log('📄 分页信息:', this.detailPagination)
          
          if (this.highMatchVehicles.length === 0) {
            console.log('⚠️ 高匹配度查询返回空数据，尝试查询所有数据进行诊断')
            
            // 备选查询：获取该人员的所有车辆匹配数据
            const allDataOptions = {
              sortBy: 'match_score',
              sortOrder: 'desc',
              page: 1,
              pageSize: 5
              // 不设置minMatchScore，获取所有数据
            }
            
            console.log('🔍 备选查询条件（所有数据）:', allDataOptions)
            const allDataResult = await topic03Api.getPersonTrainMatches(this.selectedPersonDetail.person_id, allDataOptions)
            
            console.log('📡 备选查询结果:', allDataResult)
            
            if (allDataResult && allDataResult.success && allDataResult.data.matches.length > 0) {
              console.log('📊 该人员的所有匹配数据:', allDataResult.data.matches)
              console.log('💡 匹配度分布:', allDataResult.data.matches.map(m => parseFloat(m.match_score)))
              this.$message.warning(`${this.selectedPersonDetail.person_id} 暂无匹配度>0.67的车辆，但有其他匹配数据（查看控制台）`)
            } else {
              console.log('❌ 该人员完全没有任何匹配数据')
              this.$message.info(`${this.selectedPersonDetail.person_id} 在数据库中没有任何车辆匹配记录`)
            }
          }
        } else {
          console.error('❌ API调用失败')
          console.error('❌ 错误信息:', result ? result.error : '未知错误')
          console.error('❌ 完整响应:', result)
          this.$message.error((result && result.error) || '获取高匹配车辆数据失败')
        }
      } catch (error) {
        console.error('❌ 网络错误详情:', error)
        console.error('❌ 错误堆栈:', error.stack)
        this.$message.error('网络错误，请稍后重试')
      } finally {
        this.detailLoading = false
      }
    },
    
    async handleDetailPageChange(page) {
      this.detailPagination.page = page
      await this.loadHighMatchVehicles()
    },
    
    getMatchProgressColor(score) {
      const numScore = parseFloat(score)
      if (numScore >= 0.8) return '#67C23A'
      if (numScore >= 0.75) return '#E6A23C'
      return '#409EFF'
    },
    
    formatDetailTime(time) {
      if (!time) return '--'
      const date = new Date(time)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    goBack() {
      console.log('🔙 返回上一页')
      this.$router.push({
        name: 'OperationRefactor',
        query: this.routeQuery
      })
    },
    
    goToNextStep() {
      console.log('➡️ 跳转到下一步')
      this.$router.push({
        name: 'OperationRefactor3',
        params: this.routeParams,
        query: this.routeQuery
      })
    }
  }
}
</script>

<style scoped>
.operation-refactor2-container {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.back-btn {
  margin-right: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.page-title {
  margin: 0;
  color: white;
  font-size: 24px;
  font-weight: 600;
}

.main-content {
  width: 100%;
  margin: 0;
}

.content-card {
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.card-title i {
  margin-right: 8px;
  color: #409EFF;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input {
  width: 200px;
}

.sort-select {
  width: 160px;
}

.sort-direction {
  margin-left: 8px;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.skeleton-card {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  background-color: white;
}

.skeleton-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.skeleton-title {
  flex: 1;
}

.skeleton-content {
  margin-bottom: 16px;
}

.skeleton-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.skeleton-row:last-child {
  margin-bottom: 0;
}


.person-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.person-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  overflow: hidden;
  width: 100%;
  cursor: pointer;
}

.person-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.person-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409EFF, #67C23A);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: white;
  font-size: 22px;
  flex-shrink: 0;
}

.person-title {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.person-name {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.card-content {
  margin-bottom: 16px;
}

.stat-row {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.stat-row:last-child {
  margin-bottom: 0;
}

.stat-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background-color: #f8f9fb;
  border-radius: 8px;
  border-left: 3px solid #409EFF;
  min-height: 70px;
}

.stat-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: linear-gradient(135deg, #409EFF, #67C23A);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 2px;
  line-height: 1;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  line-height: 1;
}


.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  color: #c0c4cc;
}

.empty-text {
  font-size: 16px;
  margin: 0;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

/* 欢迎内容样式 */
.welcome-content {
  text-align: center;
  padding: 60px 40px;
  color: #606266;
}

.welcome-icon {
  margin-bottom: 20px;
}

.welcome-icon i {
  font-size: 80px;
  color: #409EFF;
  opacity: 0.8;
}

.welcome-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
}

.welcome-description {
  font-size: 16px;
  line-height: 1.6;
  color: #606266;
  margin: 0;
  max-width: 500px;
  margin: 0 auto;
}

/* 操作按钮区域样式 */
.action-section {
  text-align: center;
  padding: 40px 20px;
  border-top: 1px solid #ebeef5;
  margin-top: 20px;
}

.fetch-btn {
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
}

.fetch-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

.fetch-btn i {
  margin-right: 8px;
}

/* 下一步按钮区域样式 */
.next-step-section {
  text-align: center;
  margin-top: 24px;
  padding: 20px;
}

.next-step-btn {
  padding: 16px 40px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
  transition: all 0.3s ease;
}

.next-step-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(103, 194, 58, 0.4);
}

.next-step-btn i {
  margin-left: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .operation-refactor2-container {
    padding: 12px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .back-btn {
    margin-right: 0;
    align-self: flex-start;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .header-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .search-input,
  .sort-select {
    width: 100%;
  }
  
  .person-grid,
  .skeleton-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
  }
  
  .stat-row {
    flex-direction: column;
    gap: 8px;
  }
  
  .stat-item {
    padding: 10px;
  }
  
  .stat-icon {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
  
  .stat-label {
    font-size: 11px;
  }
  
  .stat-value {
    font-size: 13px;
  }
  
  .welcome-content {
    padding: 40px 20px;
  }
  
  .welcome-icon i {
    font-size: 60px;
  }
  
  .welcome-title {
    font-size: 20px;
  }
  
  .welcome-description {
    font-size: 14px;
  }
  
  .action-section {
    padding: 30px 15px;
  }
  
  .fetch-btn {
    padding: 14px 24px;
    font-size: 14px;
  }
  
  .next-step-section {
    margin-top: 20px;
    padding: 15px;
  }
  
  .next-step-btn {
    padding: 14px 32px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .operation-refactor2-container {
    padding: 8px;
  }
  
  .person-grid,
  .skeleton-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .person-card {
    margin: 0;
  }
  
  .card-header {
    margin-bottom: 12px;
    padding-bottom: 8px;
  }
  
  .person-avatar {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
  
  .person-name {
    font-size: 16px;
  }
  
  .stat-item {
    padding: 8px;
    gap: 8px;
  }
  
  .stat-icon {
    width: 24px;
    height: 24px;
    font-size: 10px;
  }
  
  .welcome-content {
    padding: 30px 15px;
  }
  
  .welcome-icon i {
    font-size: 50px;
  }
  
  .welcome-title {
    font-size: 18px;
  }
  
  .welcome-description {
    font-size: 13px;
  }
  
  .action-section {
    padding: 25px 10px;
  }
  
  .fetch-btn {
    padding: 12px 20px;
    font-size: 13px;
    width: 90%;
  }
  
  .next-step-section {
    margin-top: 16px;
    padding: 12px;
  }
  
  .next-step-btn {
    padding: 12px 28px;
    font-size: 13px;
    width: 80%;
  }
}

/* 对话框样式 */
.detail-header {
  margin-bottom: 16px;
  text-align: center;
}

.detail-header .el-tag {
  font-size: 14px;
  padding: 8px 16px;
}

.detail-header .el-tag i {
  margin-right: 6px;
}

.score-text {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #303133;
  margin-top: 4px;
}

.no-remark {
  color: #c0c4cc;
  font-style: italic;
  font-size: 12px;
}

.detail-pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.dialog-footer {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

/* 对话框内表格样式 */
.el-dialog__body {
  padding: 20px;
}

.el-table {
  border-radius: 8px;
  overflow: hidden;
}

.el-table th {
  background-color: #f8f9fb;
  font-weight: 600;
  color: #303133;
}

.el-table td {
  padding: 12px 0;
}

.el-table--border td, .el-table--border th {
  border-right: 1px solid #ebeef5;
}

.el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: #fafbfc;
}

/* 对话框响应式 */
@media (max-width: 768px) {
  .el-dialog {
    width: 95% !important;
    margin: 0 auto;
  }
  
  .el-table .el-table__cell {
    padding: 8px 4px;
    font-size: 12px;
  }
  
  .score-text {
    font-size: 10px;
  }
}
</style>