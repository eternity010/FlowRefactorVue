<template>
  <div class="gantt-chart-container">
    <div class="gantt-header">
      <h3>{{ ganttData.title }}</h3>
      <div class="gantt-controls">
        <el-button-group size="small">
          <el-button :type="viewMode === 'day' ? 'primary' : 'default'" @click="viewMode = 'day'">日</el-button>
          <el-button :type="viewMode === 'week' ? 'primary' : 'default'" @click="viewMode = 'week'">周</el-button>
        </el-button-group>
      </div>
    </div>
    
    <div class="gantt-content">
      <!-- 任务列表 -->
      <div class="task-list">
        <div class="task-header">
          <div class="task-column-name">任务名称</div>
          <div class="task-column-responsible">负责人</div>
          <div class="task-column-duration">工期</div>
        </div>
        <div 
          v-for="task in ganttData.tasks" 
          :key="task.id" 
          class="task-row"
          :class="getPriorityClass(task.priority)"
        >
          <div class="task-column-name">
            <i :class="getTaskIcon(task.priority)"></i>
            {{ task.name }}
          </div>
          <div class="task-column-responsible">{{ task.responsible }}</div>
          <div class="task-column-duration">{{ task.duration }}天</div>
        </div>
      </div>
      
      <!-- 时间轴和甘特条 -->
      <div class="gantt-timeline">
        <div class="timeline-header">
          <div 
            v-for="date in timelineDates" 
            :key="date" 
            class="timeline-date"
          >
            {{ formatDate(date) }}
          </div>
        </div>
        <div class="gantt-bars">
          <div 
            v-for="task in ganttData.tasks" 
            :key="task.id" 
            class="gantt-bar-row"
          >
            <div 
              class="gantt-bar"
              :class="getPriorityClass(task.priority)"
              :style="getBarStyle(task)"
            >
              <span class="bar-text">{{ task.name }}</span>
            </div>
          </div>
        </div>
        
        <!-- 里程碑标记 -->
        <div class="milestones" v-if="ganttData.milestones">
          <div 
            v-for="milestone in ganttData.milestones"
            :key="milestone.id"
            class="milestone"
            :style="getMilestoneStyle(milestone)"
            :title="milestone.name"
          >
            <i class="el-icon-flag"></i>
            <span class="milestone-text">{{ milestone.name }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 图例 -->
    <div class="gantt-legend">
      <div class="legend-item">
        <div class="legend-color priority-critical"></div>
        <span>关键任务</span>
      </div>
      <div class="legend-item">
        <div class="legend-color priority-high"></div>
        <span>高优先级</span>
      </div>
      <div class="legend-item">
        <div class="legend-color priority-medium"></div>
        <span>中优先级</span>
      </div>
      <div class="legend-item">
        <i class="el-icon-flag milestone-icon"></i>
        <span>里程碑</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GanttChart',
  props: {
    ganttData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      viewMode: 'day'
    }
  },
  computed: {
    timelineDates() {
      if (!this.ganttData.tasks || this.ganttData.tasks.length === 0) return [];
      
      const dates = [];
      const startDate = new Date(Math.min(...this.ganttData.tasks.map(t => new Date(t.start))));
      const endDate = new Date(Math.max(...this.ganttData.tasks.map(t => new Date(t.end))));
      
      // 添加一些缓冲天数
      startDate.setDate(startDate.getDate() - 1);
      endDate.setDate(endDate.getDate() + 1);
      
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return dates;
    },
    dayWidth() {
      return 80; // 每天的宽度
    }
  },
  methods: {
    formatDate(date) {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}/${day}`;
    },
    getPriorityClass(priority) {
      return `priority-${priority}`;
    },
    getTaskIcon(priority) {
      const icons = {
        'critical': 'el-icon-warning-outline',
        'high': 'el-icon-star-off',
        'medium': 'el-icon-circle-check'
      };
      return icons[priority] || 'el-icon-circle-check';
    },
    getBarStyle(task) {
      const startDate = new Date(task.start);
      const endDate = new Date(task.end);
      const timelineStart = this.timelineDates[0];
      
      const startOffset = Math.max(0, (startDate - timelineStart) / (1000 * 60 * 60 * 24)) * this.dayWidth;
      const duration = Math.max(1, (endDate - startDate) / (1000 * 60 * 60 * 24) + 1) * this.dayWidth;
      
      return {
        left: startOffset + 'px',
        width: duration + 'px'
      };
    },
    getMilestoneStyle(milestone) {
      const milestoneDate = new Date(milestone.date);
      const timelineStart = this.timelineDates[0];
      const offset = (milestoneDate - timelineStart) / (1000 * 60 * 60 * 24) * this.dayWidth;
      
      return {
        left: offset + 'px'
      };
    }
  }
}
</script>

<style scoped>
.gantt-chart-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.gantt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.gantt-header h3 {
  margin: 0;
  color: #303133;
}

.gantt-content {
  display: flex;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  overflow: hidden;
}

.task-list {
  width: 250px;
  border-right: 1px solid #EBEEF5;
  background: #FAFAFA;
}

.task-header {
  display: flex;
  background: #F5F7FA;
  border-bottom: 1px solid #EBEEF5;
  font-weight: bold;
  color: #606266;
  padding: 0;
}

.task-column-name {
  width: 140px;
  padding: 12px 8px;
  border-right: 1px solid #EBEEF5;
}

.task-column-responsible {
  width: 80px;
  padding: 12px 8px;
  border-right: 1px solid #EBEEF5;
  font-size: 12px;
}

.task-column-duration {
  width: 30px;
  padding: 12px 8px;
  text-align: center;
  font-size: 12px;
}

.task-row {
  display: flex;
  border-bottom: 1px solid #EBEEF5;
  min-height: 40px;
  align-items: center;
}

.task-row:hover {
  background: #F0F9FF;
}

.task-row i {
  margin-right: 6px;
}

.gantt-timeline {
  flex: 1;
  position: relative;
  overflow-x: auto;
}

.timeline-header {
  display: flex;
  background: #F5F7FA;
  border-bottom: 1px solid #EBEEF5;
  font-weight: bold;
  color: #606266;
}

.timeline-date {
  width: 80px;
  padding: 12px 8px;
  text-align: center;
  border-right: 1px solid #EBEEF5;
  font-size: 12px;
}

.gantt-bars {
  position: relative;
}

.gantt-bar-row {
  height: 40px;
  border-bottom: 1px solid #EBEEF5;
  position: relative;
}

.gantt-bar {
  position: absolute;
  top: 8px;
  height: 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: white;
  font-weight: bold;
  overflow: hidden;
}

.bar-text {
  position: relative;
  z-index: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 100%;
}

.priority-critical {
  background: #F56C6C;
}

.priority-high {
  background: #E6A23C;
}

.priority-medium {
  background: #409EFF;
}

.milestones {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.milestone {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #E6A23C;
  pointer-events: auto;
}

.milestone i {
  position: absolute;
  top: -15px;
  left: -8px;
  color: #E6A23C;
  font-size: 16px;
}

.milestone-text {
  position: absolute;
  top: -35px;
  left: -30px;
  font-size: 10px;
  color: #E6A23C;
  white-space: nowrap;
  font-weight: bold;
}

.gantt-legend {
  display: flex;
  gap: 20px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #EBEEF5;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #606266;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 6px;
}

.milestone-icon {
  color: #E6A23C;
}
</style> 