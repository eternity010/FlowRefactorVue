<template>
  <div class="task-assignment-container">
    <h1 class="page-title">人员分配计划 - 投标书制作</h1>
    
    <!-- 项目概览 -->
    <div class="project-overview">
      <el-card class="overview-card">
        <div slot="header" class="card-header">
          <span>项目概览</span>
        </div>
        <div class="overview-stats">
          <div class="stat-item">
            <span class="stat-label">参与部门:</span>
            <span class="stat-value">{{ totalDepartments }}个</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">总投入人数:</span>
            <span class="stat-value">{{ totalPersonnel }}人</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">项目阶段:</span>
            <span class="stat-value">{{ totalPhases }}个</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 圆形网络图展示 -->
    <div class="circle-container">
      <el-card class="circle-card">
        <div slot="header" class="card-header">
          <span>部门人员分配网络图</span>
          <div class="header-controls">
            <el-tooltip content="重置动画" placement="top">
              <el-button size="mini" icon="el-icon-refresh" @click="resetAnimation"></el-button>
            </el-tooltip>
            <el-tooltip content="显示详情" placement="top">
              <el-button size="mini" icon="el-icon-info" @click="showDetails = !showDetails"></el-button>
            </el-tooltip>
          </div>
        </div>
        
        <!-- SVG 圆形网络图 -->
        <div class="svg-container" ref="svgContainer">
          <svg :width="svgWidth" :height="svgHeight" class="network-svg">
            <!-- 定义渐变和阴影效果 -->
            <defs>
              <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color:#4facfe;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#00f2fe;stop-opacity:1" />
              </radialGradient>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="2" dy="2" stdDeviation="4" flood-color="#00000020"/>
              </filter>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <!-- 连接线 -->
            <g class="connections">
              <line 
                v-for="dept in departmentData" 
                :key="`line-${dept.id}`"
                :x1="centerX" 
                :y1="centerY"
                :x2="dept.x" 
                :y2="dept.y"
                :class="['connection-line', { 'active': hoveredDept === dept.id }]"
                :stroke-width="getLineWidth(dept.totalPersonnel)"
              />
            </g>
            
            <!-- 部门圆圈 -->
            <g class="department-circles">
              <g 
                v-for="dept in departmentData" 
                :key="`dept-${dept.id}`"
                @mouseenter="hoveredDept = dept.id"
                @mouseleave="hoveredDept = null"
                @click="selectDepartment(dept)"
                :class="['department-group', { 'hovered': hoveredDept === dept.id, 'selected': selectedDept === dept.id }]"
              >
                <circle
                  :cx="dept.x"
                  :cy="dept.y"
                  :r="getDepartmentRadius(dept.totalPersonnel)"
                  :fill="dept.color"
                  :class="['department-circle']"
                  filter="url(#shadow)"
                />
                <text
                  :x="dept.x"
                  :y="dept.y - 5"
                  text-anchor="middle"
                  :class="['department-name']"
                  :font-size="getDepartmentFontSize(dept.totalPersonnel)"
                >
                  {{ dept.name }}
                </text>
                <text
                  :x="dept.x"
                  :y="dept.y + 8"
                  text-anchor="middle"
                  :class="['department-count']"
                  :font-size="getDepartmentFontSize(dept.totalPersonnel) - 2"
                >
                  {{ dept.totalPersonnel }}人
                </text>
              </g>
            </g>
            
            <!-- 中心圆 -->
            <g class="center-group" @mouseenter="hoveredCenter = true" @mouseleave="hoveredCenter = false">
              <circle
                :cx="centerX"
                :cy="centerY"
                :r="centerRadius"
                fill="url(#centerGradient)"
                :class="['center-circle', { 'hovered': hoveredCenter }]"
                filter="url(#glow)"
              />
              <text
                :x="centerX"
                :y="centerY - 8"
                text-anchor="middle"
                class="center-text-main"
              >
                投标书制作
              </text>
              <text
                :x="centerX"
                :y="centerY + 8"
                text-anchor="middle"
                class="center-text-sub"
              >
                总计{{ totalPersonnel }}人
              </text>
            </g>
          </svg>
        </div>
        
        <!-- 详情面板 -->
        <transition name="slide-up">
          <div v-if="showDetails" class="details-panel">
            <div class="details-grid">
              <div
                v-for="dept in departmentData"
                :key="`detail-${dept.id}`"
                :class="['detail-item', { 'highlighted': selectedDept === dept.id }]"
                @click="selectDepartment(dept)"
              >
                <div class="detail-color" :style="{ backgroundColor: dept.color }"></div>
                <div class="detail-info">
                  <div class="detail-name">{{ dept.name }}</div>
                  <div class="detail-count">{{ dept.totalPersonnel }}人 ({{ getPercentage(dept.totalPersonnel) }}%)</div>
                  <div class="detail-phases">参与{{ dept.phases.length }}个阶段</div>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- 人员信息弹窗组件 -->
        <DepartmentPersonnelDialog
          v-if="showPersonnelDialog || selectedDeptInfo.name"
          :visible="showPersonnelDialog"
          :department-info="selectedDeptInfo"
          :personnel-data="selectedDeptPersonnel"
          @close="closePersonnelDialog"
        />
      </el-card>
    </div>
  </div>
</template>

<script>
import DepartmentPersonnelDialog from '@/components/DepartmentPersonnelDialog'

export default {
  name: 'TaskAssignmentView',
  components: {
    DepartmentPersonnelDialog
  },
  data() {
    return {
      // SVG 尺寸和布局
      svgWidth: 900,
      svgHeight: 700,
      centerRadius: 90,
      
      // 交互状态
      hoveredDept: null,
      hoveredCenter: false,
      selectedDept: null,
      showDetails: false,
      showPersonnelDialog: false,
      selectedDeptInfo: {},
      
      // 原始项目数据
      rawProjectData: {
        phases: [
          {
            name: '需求分析阶段',
            departments: [
              { name: '市场部', personnel: 3 },
              { name: '商务部', personnel: 2 },
              { name: '技术部', personnel: 2 }
            ]
          },
          {
            name: '方案设计阶段',
            departments: [
              { name: '技术部', personnel: 5 },
              { name: '项目管理部', personnel: 2 },
              { name: '质量管理部', personnel: 1 }
            ]
          },
          {
            name: '成本核算阶段',
            departments: [
              { name: '财务部', personnel: 3 },
              { name: '采购部', personnel: 2 },
              { name: '技术部', personnel: 2 }
            ]
          },
          {
            name: '文档编制阶段',
            departments: [
              { name: '商务部', personnel: 4 },
              { name: '法务部', personnel: 2 },
              { name: '人力资源部', personnel: 1 }
            ]
          },
          {
            name: '投标提交阶段',
            departments: [
              { name: '商务部', personnel: 2 },
              { name: '行政部', personnel: 1 }
            ]
          }
        ]
      },
      
      // 部门颜色配置
      departmentColors: {
        '市场部': '#FF6B6B',
        '商务部': '#4ECDC4',
        '技术部': '#45B7D1',
        '项目管理部': '#96CEB4',
        '质量管理部': '#FECA57',
        '财务部': '#FF9FF3',
        '采购部': '#54A0FF',
        '法务部': '#5F27CD',
        '人力资源部': '#00D2D3',
        '行政部': '#FF9F43'
      },

      // 人员详细信息数据
      personnelData: [
        // 市场部人员
        { id: 'P001', deptId: '市场部', name: '张华', phases: ['需求分析阶段'] },
        { id: 'P002', deptId: '市场部', name: '李明', phases: ['需求分析阶段'] },
        { id: 'P003', deptId: '市场部', name: '王芳', phases: ['需求分析阶段'] },

        // 商务部人员
        { id: 'P004', deptId: '商务部', name: '陈强', phases: ['需求分析阶段', '文档编制阶段', '投标提交阶段'] },
        { id: 'P005', deptId: '商务部', name: '刘雅', phases: ['需求分析阶段', '文档编制阶段', '投标提交阶段'] },
        { id: 'P006', deptId: '商务部', name: '赵磊', phases: ['需求分析阶段', '文档编制阶段', '投标提交阶段'] },
        { id: 'P007', deptId: '商务部', name: '孙丽', phases: ['文档编制阶段', '投标提交阶段'] },
        { id: 'P008', deptId: '商务部', name: '周斌', phases: ['文档编制阶段', '投标提交阶段'] },
        { id: 'P009', deptId: '商务部', name: '吴静', phases: ['文档编制阶段', '投标提交阶段'] },

        // 技术部人员
        { id: 'P010', deptId: '技术部', name: '马超', phases: ['需求分析阶段', '方案设计阶段', '成本核算阶段'] },
        { id: 'P011', deptId: '技术部', name: '钱伟', phases: ['方案设计阶段', '成本核算阶段'] },
        { id: 'P012', deptId: '技术部', name: '孙建', phases: ['方案设计阶段', '成本核算阶段'] },
        { id: 'P013', deptId: '技术部', name: '李娜', phases: ['方案设计阶段', '成本核算阶段'] },
        { id: 'P014', deptId: '技术部', name: '张伟', phases: ['方案设计阶段', '成本核算阶段'] },
        { id: 'P015', deptId: '技术部', name: '王小明', phases: ['方案设计阶段', '成本核算阶段'] },
        { id: 'P016', deptId: '技术部', name: '刘凯', phases: ['方案设计阶段', '成本核算阶段'] },
        { id: 'P017', deptId: '技术部', name: '陈雨', phases: ['方案设计阶段', '成本核算阶段'] },
        { id: 'P018', deptId: '技术部', name: '黄磊', phases: ['方案设计阶段', '成本核算阶段'] },

        // 项目管理部人员
        { id: 'P019', deptId: '项目管理部', name: '林峰', phases: ['方案设计阶段'] },
        { id: 'P020', deptId: '项目管理部', name: '徐敏', phases: ['方案设计阶段'] },

        // 质量管理部人员
        { id: 'P021', deptId: '质量管理部', name: '胡杰', phases: ['方案设计阶段'] },

        // 财务部人员
        { id: 'P022', deptId: '财务部', name: '邓华', phases: ['成本核算阶段'] },
        { id: 'P023', deptId: '财务部', name: '方圆', phases: ['成本核算阶段'] },
        { id: 'P024', deptId: '财务部', name: '田丽', phases: ['成本核算阶段'] },

        // 采购部人员
        { id: 'P025', deptId: '采购部', name: '蒋斌', phases: ['成本核算阶段'] },
        { id: 'P026', deptId: '采购部', name: '雷鸣', phases: ['成本核算阶段'] },

        // 法务部人员
        { id: 'P027', deptId: '法务部', name: '潘伟', phases: ['文档编制阶段'] },
        { id: 'P028', deptId: '法务部', name: '谢琳', phases: ['文档编制阶段'] },

        // 人力资源部人员
        { id: 'P029', deptId: '人力资源部', name: '韩梅', phases: ['文档编制阶段'] },

        // 行政部人员
        { id: 'P030', deptId: '行政部', name: '曹刚', phases: ['投标提交阶段'] }
      ]
    }
  },
  
  computed: {
    // 中心点坐标
    centerX() {
      return this.svgWidth / 2
    },
    centerY() {
      return this.svgHeight / 2
    },
    
    // 统计各部门总人数
    departmentData() {
      const deptMap = new Map()
      
      // 统计各部门在不同阶段的总人数
      this.rawProjectData.phases.forEach(phase => {
        phase.departments.forEach(dept => {
          if (deptMap.has(dept.name)) {
            deptMap.get(dept.name).totalPersonnel += dept.personnel
            deptMap.get(dept.name).phases.push(phase.name)
          } else {
            deptMap.set(dept.name, {
              id: dept.name.replace(/[^a-zA-Z0-9]/g, ''),
              name: dept.name,
              totalPersonnel: dept.personnel,
              color: this.departmentColors[dept.name] || '#95A5A6',
              phases: [phase.name]
            })
          }
        })
      })
      
      // 转换为数组并计算位置
      const departments = Array.from(deptMap.values())
      const angleStep = (2 * Math.PI) / departments.length
      const radius = Math.min(this.svgWidth, this.svgHeight) * 0.35
      
      return departments.map((dept, index) => {
        const angle = index * angleStep - Math.PI / 2 // 从顶部开始
        return {
          ...dept,
          x: this.centerX + radius * Math.cos(angle),
          y: this.centerY + radius * Math.sin(angle),
          angle: angle
        }
      })
    },
    
    totalDepartments() {
      return this.departmentData.length
    },
    
    totalPersonnel() {
      return this.departmentData.reduce((sum, dept) => sum + dept.totalPersonnel, 0)
    },
    
    totalPhases() {
      return this.rawProjectData.phases.length
    },

    // 选中部门的人员信息
    selectedDeptPersonnel() {
      if (!this.selectedDeptInfo.name) return []
      return this.personnelData.filter(person => person.deptId === this.selectedDeptInfo.name)
    }
  },
  
  mounted() {
    this.initializeLayout()
    window.addEventListener('resize', this.handleResize)
  },
  
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  
  methods: {
    // 初始化布局
    initializeLayout() {
      this.$nextTick(() => {
        this.updateSvgSize()
      })
    },
    
         // 更新SVG尺寸
     updateSvgSize() {
       if (this.$refs.svgContainer) {
         const container = this.$refs.svgContainer
         const containerWidth = container.clientWidth
         const containerHeight = Math.max(600, containerWidth * 0.8)
         
         this.svgWidth = Math.max(800, containerWidth - 40)
         this.svgHeight = Math.max(600, containerHeight)
       }
     },
    
    // 窗口大小改变处理
    handleResize() {
      this.updateSvgSize()
    },
    
    // 根据人数计算部门圆半径
    getDepartmentRadius(personnel) {
      const minRadius = 30
      const maxRadius = 70
      const maxPersonnel = Math.max(...this.departmentData.map(d => d.totalPersonnel))
      return minRadius + (maxRadius - minRadius) * (personnel / maxPersonnel)
    },
    
    // 根据人数计算字体大小
    getDepartmentFontSize(personnel) {
      const minSize = 12
      const maxSize = 16
      const maxPersonnel = Math.max(...this.departmentData.map(d => d.totalPersonnel))
      return minSize + (maxSize - minSize) * (personnel / maxPersonnel)
    },
    
    // 根据人数计算连线宽度
    getLineWidth(personnel) {
      const minWidth = 2
      const maxWidth = 6
      const maxPersonnel = Math.max(...this.departmentData.map(d => d.totalPersonnel))
      return minWidth + (maxWidth - minWidth) * (personnel / maxPersonnel)
    },
    
    // 计算百分比
    getPercentage(personnel) {
      return Math.round((personnel / this.totalPersonnel) * 100)
    },
    
    // 选择部门
    selectDepartment(dept) {
      console.log('点击部门:', dept.name, 'ID:', dept.id)
      const isSameDept = this.selectedDept === dept.id
      this.selectedDept = isSameDept ? null : dept.id

      if (isSameDept) {
        // 点击同一个部门，关闭弹窗
        this.showPersonnelDialog = false
        this.selectedDeptInfo = {}
        console.log('关闭弹窗')
      } else {
        // 点击不同部门，打开弹窗
        this.selectedDeptInfo = dept
        this.showPersonnelDialog = true
        console.log('打开弹窗，部门信息:', dept)
      }
      console.log('当前弹窗状态:', this.showPersonnelDialog)
    },

    // 关闭人员信息弹窗
    closePersonnelDialog() {
      this.showPersonnelDialog = false
      this.selectedDept = null
      this.selectedDeptInfo = {}
    },

    
    // 重置动画
    resetAnimation() {
      this.hoveredDept = null
      this.selectedDept = null
      this.hoveredCenter = false
      
      // 触发重新渲染动画
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>
.task-assignment-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #f5f7fa;
}

.page-title {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
}

/* 项目概览样式 */
.project-overview {
  margin-bottom: 20px;
}

.overview-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #303133;
}

.overview-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-right: 8px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #409EFF;
}

/* 圆形网络图容器样式 */
.circle-container {
  flex: 1;
}

.circle-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  height: 85%;
  width: 98%;
  margin: 0 auto 20px auto;
}

.circle-card .el-card__body {
  height: calc(100% - 60px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.header-controls {
  display: flex;
  gap: 8px;
}

/* SVG 容器样式 */
.svg-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  overflow: hidden;
}

.network-svg {
  max-width: 100%;
  max-height: 100%;
  transition: all 0.3s ease;
}

/* 连接线样式 */
.connection-line {
  stroke: #E1E8ED;
  stroke-width: 2;
  transition: all 0.3s ease;
  stroke-dasharray: 5,5;
  animation: dash 1s linear infinite;
}

.connection-line.active {
  stroke: #409EFF;
  stroke-width: 4;
  stroke-dasharray: none;
  animation: none;
}

@keyframes dash {
  to {
    stroke-dashoffset: -10;
  }
}

/* 中心圆样式 */
.center-circle {
  transition: all 0.3s ease;
  cursor: pointer;
}

.center-circle.hovered {
  filter: url(#glow) brightness(1.1);
  transform-origin: center;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.center-text-main {
  font-size: 18px;
  font-weight: 600;
  fill: white;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

.center-text-sub {
  font-size: 14px;
  fill: rgba(255,255,255,0.9);
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

/* 部门圆圈样式 */
.department-group {
  cursor: pointer;
  transition: all 0.3s ease;
}

.department-group.hovered {
  transform-origin: center;
  animation: bounce 0.6s ease-in-out;
}

.department-group.selected .department-circle {
  stroke: #409EFF;
  stroke-width: 3;
  filter: url(#shadow) brightness(1.1);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: scale(1); }
  40% { transform: scale(1.1); }
  60% { transform: scale(1.05); }
}

.department-circle {
  transition: all 0.3s ease;
  opacity: 0.9;
}

.department-group:hover .department-circle {
  opacity: 1;
  filter: url(#shadow) brightness(1.05);
}

.department-name {
  font-weight: 600;
  fill: white;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  pointer-events: none;
}

.department-count {
  font-weight: 500;
  fill: rgba(255,255,255,0.95);
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  pointer-events: none;
}

/* 详情面板样式 */
.details-panel {
  margin-top: 15px;
  padding: 15px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  border-top: 3px solid #409EFF;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.detail-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.detail-item.highlighted {
  border: 2px solid #409EFF;
  background: #f0f9ff;
}

.detail-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.detail-info {
  flex: 1;
}

.detail-name {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
}

.detail-count {
  font-size: 12px;
  color: #409EFF;
  font-weight: 500;
}

.detail-phases {
  font-size: 11px;
  color: #909399;
  margin-top: 2px;
}

/* 过渡动画 */
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .task-assignment-container {
    padding: 10px;
  }
  
  .overview-stats {
    flex-direction: column;
    gap: 10px;
  }
  
  .stat-item {
    margin-bottom: 10px;
  }
  
  .svg-container {
    min-height: 300px;
  }
  
  .center-text-main {
    font-size: 14px;
  }
  
  .center-text-sub {
    font-size: 10px;
  }
  
  .department-name {
    font-size: 10px;
  }
  
  .department-count {
    font-size: 9px;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-item {
    padding: 6px 10px;
  }
}

@media (max-width: 480px) {
  .circle-card {
    height: auto;
    min-height: 400px;
  }
  
  .header-controls {
    flex-direction: column;
    gap: 4px;
  }
  
  .details-panel {
    padding: 10px;
  }
}
</style>
