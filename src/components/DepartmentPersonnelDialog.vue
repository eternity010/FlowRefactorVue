<template>
  <el-dialog
    :title="`${departmentInfo.name || '部门'} - 人员信息详情`"
    :visible.sync="visible"
    width="90%"
    :before-close="handleClose"
    class="personnel-dialog"
    :close-on-click-modal="false"
  >
    <!-- 部门概览统计 -->
    <div class="department-overview">
      <div class="overview-grid">
        <div class="overview-item">
          <div class="overview-icon">
            <i class="el-icon-user-solid"></i>
          </div>
          <div class="overview-content">
            <div class="overview-value">{{ personnelData.length }}</div>
            <div class="overview-label">总人数</div>
          </div>
        </div>
        <div class="overview-item">
          <div class="overview-icon">
            <i class="el-icon-s-data"></i>
          </div>
          <div class="overview-content">
            <div class="overview-value">{{ getPercentage(departmentInfo.totalPersonnel) }}%</div>
            <div class="overview-label">项目占比</div>
          </div>
        </div>
        <div class="overview-item">
          <div class="overview-icon">
            <i class="el-icon-time"></i>
          </div>
          <div class="overview-content">
            <div class="overview-value">{{ departmentInfo.phases ? departmentInfo.phases.length : 0 }}</div>
            <div class="overview-label">参与阶段</div>
          </div>
        </div>
        <div class="overview-item">
          <div class="overview-icon">
            <i class="el-icon-office-building"></i>
          </div>
          <div class="overview-content">
            <div class="overview-value">{{ departmentInfo.name }}</div>
            <div class="overview-label">部门名称</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 人员信息表格 -->
    <el-table
      :data="personnelData"
      stripe
      border
      height="400"
      class="personnel-table"
      :header-cell-style="{ background: '#f5f7fa', color: '#303133', fontWeight: '600' }"
    >
      <el-table-column prop="id" label="员工ID" width="120" align="center">
        <template slot-scope="scope">
          <el-tag size="mini" type="info">{{ scope.row.id }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="deptId" label="部门ID" width="120" align="center">
        <template slot-scope="scope">
          <el-tag size="mini" type="success">{{ scope.row.deptId }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="姓名" width="120" align="center">
        <template slot-scope="scope">
          <div class="name-cell">
            <i class="el-icon-user"></i>
            <span>{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="参与阶段" align="center">
        <template slot-scope="scope">
          <el-tag
            v-for="phase in scope.row.phases"
            :key="phase"
            size="mini"
            type="warning"
            style="margin: 2px;"
          >
            {{ phase }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-view"
            @click="viewPersonnelDetail(scope.row)"
          >
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 图表展示区域 -->
    <div class="charts-section">
      <el-tabs type="border-card">
        <!-- 人员阶段分布饼图 -->
        <el-tab-pane label="阶段分布" name="phase">
          <div class="chart-container">
            <h4>人员参与阶段分布</h4>
            <svg :width="pieChartWidth" :height="pieChartHeight" class="phase-pie-chart">
              <g :transform="`translate(${pieChartWidth/2}, ${pieChartHeight/2})`">
                <path
                  v-for="(slice, index) in phasePieData"
                  :key="`slice-${index}`"
                  :d="slice.path"
                  :fill="slice.color"
                  :stroke="slice.stroke"
                  stroke-width="2"
                  class="pie-slice"
                  @mouseenter="showTooltip(slice, $event)"
                  @mouseleave="hideTooltip"
                />
                <text
                  v-for="(slice, index) in phasePieData"
                  :key="`text-${index}`"
                  :x="slice.textX"
                  :y="slice.textY"
                  text-anchor="middle"
                  :fill="slice.textColor"
                  font-size="12"
                  font-weight="500"
                >
                  {{ slice.label }}
                </text>
              </g>
            </svg>
            <div class="chart-legend">
              <div
                v-for="(legend, index) in phaseLegendData"
                :key="`legend-${index}`"
                class="legend-item"
              >
                <div class="legend-color" :style="{ backgroundColor: legend.color }"></div>
                <span class="legend-text">{{ legend.name }} ({{ legend.count }}人)</span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 人员柱状图 -->
        <el-tab-pane label="人员统计" name="bar">
          <div class="chart-container">
            <h4>部门人员统计</h4>
            <div class="bar-chart-container">
              <div class="bar-item" v-for="person in personnelData" :key="person.id">
                <div class="bar-label">{{ person.name }}</div>
                <div class="bar-wrapper">
                  <div
                    class="bar-fill"
                    :style="{
                      width: `${(person.phases ? person.phases.length : 0) / Math.max(...personnelData.map(p => p.phases ? p.phases.length : 0)) * 100}%`,
                      backgroundColor: getRandomColor()
                    }"
                  ></div>
                  <span class="bar-value">{{ person.phases ? person.phases.length : 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 阶段时间线 -->
        <el-tab-pane label="时间线" name="timeline">
          <div class="timeline-container">
            <h4>项目参与时间线</h4>
            <div class="timeline">
              <div
                v-for="(phase, index) in departmentInfo.phases || []"
                :key="`phase-${index}`"
                class="timeline-item"
              >
                <div class="timeline-marker" :style="{ backgroundColor: getPhaseColor(phase) }"></div>
                <div class="timeline-content">
                  <div class="timeline-title">{{ phase }}</div>
                  <div class="timeline-desc">
                    {{ getPhasePersonnel(phase).length }}人参与
                  </div>
                  <div class="timeline-personnel">
                    <el-tag
                      v-for="person in getPhasePersonnel(phase)"
                      :key="person.id"
                      size="mini"
                      type="info"
                      style="margin: 2px;"
                    >
                      {{ person.name }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 工具提示 -->
    <div v-if="showTooltip" class="chart-tooltip" :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }">
      <div class="tooltip-content">
        <div class="tooltip-title">{{ tooltipData.label }}</div>
        <div class="tooltip-value">{{ tooltipData.value }}人</div>
        <div class="tooltip-percent">{{ tooltipData.percent }}%</div>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <div class="footer-center">
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DepartmentPersonnelDialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    departmentInfo: {
      type: Object,
      default: () => ({})
    },
    personnelData: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    visible(val) {
      console.log('DepartmentPersonnelDialog visible changed:', val)
      console.log('departmentInfo:', this.departmentInfo)
      console.log('personnelData length:', this.personnelData.length)
    }
  },
  data() {
    return {
      showTooltip: false,
      tooltipX: 0,
      tooltipY: 0,
      tooltipData: {},
      pieChartWidth: 400,
      pieChartHeight: 300,
      phaseColors: {
        '需求分析阶段': '#FF6B6B',
        '方案设计阶段': '#4ECDC4',
        '成本核算阶段': '#45B7D1',
        '文档编制阶段': '#96CEB4',
        '投标提交阶段': '#FECA57'
      }
    }
  },
  computed: {
    // 阶段分布饼图数据
    phasePieData() {
      const phaseCount = {}
      this.personnelData.forEach(person => {
        if (person.phases) {
          person.phases.forEach(phase => {
            phaseCount[phase] = (phaseCount[phase] || 0) + 1
          })
        }
      })

      const total = Object.values(phaseCount).reduce((sum, count) => sum + count, 0)
      let startAngle = 0
      const radius = Math.min(this.pieChartWidth, this.pieChartHeight) / 2 - 40

      return Object.entries(phaseCount).map(([phase, count], index) => {
        const angle = (count / total) * 2 * Math.PI
        const endAngle = startAngle + angle

        // 计算扇形路径
        const x1 = radius * Math.cos(startAngle)
        const y1 = radius * Math.sin(startAngle)
        const x2 = radius * Math.cos(endAngle)
        const y2 = radius * Math.sin(endAngle)

        const largeArcFlag = angle > Math.PI ? 1 : 0
        const path = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

        // 计算文字位置
        const midAngle = startAngle + angle / 2
        const textRadius = radius * 0.7
        const textX = textRadius * Math.cos(midAngle)
        const textY = textRadius * Math.sin(midAngle)

        const result = {
          label: phase.length > 6 ? phase.substring(0, 6) + '...' : phase,
          value: count,
          percent: Math.round((count / total) * 100),
          path,
          color: this.getPhaseColor(phase),
          stroke: '#fff',
          textColor: '#fff',
          textX,
          textY,
          startAngle,
          endAngle
        }

        startAngle = endAngle
        return result
      })
    },

    // 图例数据
    phaseLegendData() {
      const phaseCount = {}
      this.personnelData.forEach(person => {
        if (person.phases) {
          person.phases.forEach(phase => {
            phaseCount[phase] = (phaseCount[phase] || 0) + 1
          })
        }
      })

      return Object.entries(phaseCount).map(([name, count]) => ({
        name,
        count,
        color: this.getPhaseColor(name)
      }))
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },

    handleExport() {
      this.$emit('export')
    },

    getPercentage(totalPersonnel) {
      // 这里需要父组件传入总人数，或者通过其他方式获取
      return Math.round((totalPersonnel / 32) * 100) // 暂时使用32作为总人数
    },

    getPhaseColor(phase) {
      return this.phaseColors[phase] || '#95A5A6'
    },

    getRandomColor() {
      const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
      return colors[Math.floor(Math.random() * colors.length)]
    },

    showTooltip(slice, event) {
      this.tooltipData = {
        label: slice.label,
        value: slice.value,
        percent: slice.percent
      }
      this.tooltipX = event.clientX + 10
      this.tooltipY = event.clientY - 10
      this.showTooltip = true
    },

    hideTooltip() {
      this.showTooltip = false
    },

    viewPersonnelDetail(person) {
      this.$message({
        message: `查看 ${person.name} 的详细信息`,
        type: 'info'
      })
    },

    getPhasePersonnel(phaseName) {
      return this.personnelData.filter(person =>
        person.phases && person.phases.includes(phaseName)
      )
    },

    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.personnel-dialog .el-dialog {
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.personnel-dialog .el-dialog__header {
  background: linear-gradient(135deg, #409EFF 0%, #36A2FF 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  padding: 20px 24px;
}

.personnel-dialog .el-dialog__title {
  color: white;
  font-weight: 600;
  font-size: 18px;
}

.personnel-dialog .el-dialog__headerbtn .el-dialog__close {
  color: white;
  font-size: 20px;
}

/* 部门概览样式 */
.department-overview {
  margin-bottom: 20px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.overview-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  border-left: 4px solid #409EFF;
  transition: transform 0.3s ease;
}

.overview-item:hover {
  transform: translateY(-2px);
}

.overview-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409EFF 0%, #36A2FF 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: white;
  font-size: 18px;
}

.overview-content {
  flex: 1;
}

.overview-value {
  font-size: 20px;
  font-weight: 700;
  color: #409EFF;
  margin-bottom: 4px;
}

.overview-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

/* 表格样式 */
.personnel-table {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name-cell i {
  color: #409EFF;
  font-size: 16px;
}

/* 图表区域样式 */
.charts-section {
  margin-top: 20px;
}

.chart-container {
  padding: 20px;
}

.chart-container h4 {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.chart-container h4:before {
  content: '';
  width: 4px;
  height: 16px;
  background-color: #409EFF;
  margin-right: 8px;
  border-radius: 2px;
}

/* 饼图样式 */
.phase-pie-chart {
  display: block;
  margin: 0 auto;
}

.pie-slice {
  cursor: pointer;
  transition: all 0.3s ease;
}

.pie-slice:hover {
  filter: brightness(1.1);
  stroke-width: 3;
}

/* 图例样式 */
.chart-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-text {
  font-size: 12px;
  color: #666;
}

/* 柱状图样式 */
.bar-chart-container {
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
}

.bar-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
}

.bar-label {
  width: 80px;
  font-size: 12px;
  font-weight: 500;
  color: #303133;
  margin-right: 15px;
}

.bar-wrapper {
  flex: 1;
  position: relative;
  height: 20px;
  background: #e4e7ed;
  border-radius: 10px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease;
}

.bar-value {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

/* 时间线样式 */
.timeline-container {
  padding: 20px;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline:before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #409EFF;
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
}

.timeline-marker {
  position: absolute;
  left: -25px;
  top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #fff;
}

.timeline-content {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #409EFF;
}

.timeline-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 5px;
}

.timeline-desc {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.timeline-personnel {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

/* 工具提示样式 */
.chart-tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: none;
  z-index: 9999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.tooltip-content {
  text-align: center;
}

.tooltip-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.tooltip-value {
  font-size: 14px;
  color: #409EFF;
}

.tooltip-percent {
  font-size: 11px;
  color: #67C23A;
}

/* 弹窗底部样式 */
.dialog-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0 10px 0;
}

.footer-center {
  display: flex;
  gap: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .personnel-dialog .el-dialog {
    width: 95%;
    margin: 5vh auto;
  }

  .overview-grid {
    grid-template-columns: 1fr;
  }

  .personnel-table {
    font-size: 12px;
  }

  .charts-section .el-tabs {
    font-size: 14px;
  }

  .chart-legend {
    flex-direction: column;
    align-items: center;
  }

  .dialog-footer {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .timeline-content {
    padding: 10px;
  }

  .timeline-personnel {
    justify-content: center;
  }

  .bar-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .bar-label {
    width: 100%;
    margin-bottom: 4px;
  }
}
</style>
