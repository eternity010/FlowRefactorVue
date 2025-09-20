<template>
  <div class="maintenance-guide-component">
    <!-- 转向架检修Q&A展示 -->
    <div class="qa-section">
      <div class="question-section">
        <h4 class="question-title">
          <i class="el-icon-question"></i>
          Q: 转向架的悬挂装置该如何检修？
        </h4>
      </div>
      
      <div class="answer-section">
        <h4 class="answer-title">
          <i class="el-icon-chat-dot-square"></i>
          A: 
        </h4>
        
        <!-- (1) 检修类型介绍 -->
        <div class="maintenance-section">
          <h5 class="section-title">
            <span class="section-number">(1)</span>
            检修类型介绍：
          </h5>
          <div class="section-content">
            <p>转向架的悬挂装置主要分为一系悬挂和二系悬挂。一系悬挂位于轮对与构架之间，主要包括轴箱弹簧、液压减震器等，用于缓和轮轨之间的冲击。二系悬挂位于转向架与车体之间，包括空气弹簧、横向减震器、抗蛇行减震器等，用于提高乘坐舒适性和运行稳定性。检修类型包括日常检查、定期维护和深度检修，具体根据使用周期和状态进行判定。</p>
          </div>
        </div>

        <!-- (2) 检修方法步骤 -->
        <div class="maintenance-section">
          <h5 class="section-title">
            <span class="section-number">(2)</span>
            检修方法步骤：
          </h5>
          <div class="section-content">
            <ol class="maintenance-steps-list">
              <li>检查一系悬挂装置的轴箱弹簧是否有裂纹、变形或老化，使用游标卡尺测量弹簧自由高度，不符合标准需更换。</li>
              <li>检查一系悬挂液压减震器是否有漏油、损坏或卡滞，使用专用工具进行阻尼性能测试，超标需更换。</li>
              <li>检查二系悬挂空气弹簧是否有破损、老化或漏气，使用气压表测量气压，若异常需更换或修复。</li>
              <li>检查横向减震器和抗蛇行减震器的连接部件是否松动，使用扭矩扳手紧固螺栓并检查减震器动作是否正常。</li>
              <li>对悬挂装置进行清洁和润滑，使用指定的润滑脂涂抹减震器导向套和连接部位。</li>
              <li>检查悬挂装置的安装座和支撑部件是否有裂纹或腐蚀，必要时进行探伤或更换。</li>
            </ol>
          </div>
        </div>

        <!-- (3) 部件组成结构 -->
        <div class="maintenance-section">
          <h5 class="section-title">
            <span class="section-number">(3)</span>
            部件组成结构：
          </h5>
          <div class="section-content">
            <p>转向架悬挂装置主要包括：</p>
            <ul class="component-list">
              <li><strong>一系悬挂：</strong>轴箱弹簧、轴箱定位装置、一系液压减震器。</li>
              <li><strong>二系悬挂：</strong>空气弹簧、横向减震器、抗蛇行减震器、构架与车体连接座。</li>
            </ul>
            <p>这些部件通过弹性元件和液压元件共同作用，实现轮对与构架、构架与车体之间的柔性连接，降低振动和冲击传递。</p>
          </div>
        </div>

        <!-- (4) 故障分析 -->
        <div class="maintenance-section">
          <h5 class="section-title">
            <span class="section-number">(4)</span>
            故障分析：
          </h5>
          <div class="section-content">
            <p>悬挂装置故障可能导致动车组运行异常，如：</p>
            <ul class="fault-analysis-list">
              <li><strong>一系悬挂故障：</strong>轮对冲击增大，可能导致轮轨接触不良、轴箱温升过高、轮对异响等问题。</li>
              <li><strong>二系悬挂故障：</strong>车体振动加剧，影响乘坐舒适性，可能导致空气弹簧漏气、减震器失效、车体倾斜或横向摆动增大。</li>
            </ul>
            <p>常见的故障原因包括弹簧老化、减震器漏油、连接螺栓松动或断裂、空气弹簧破损、减震器阻尼性能下降等。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MaintenanceGuide',
  props: {
    // 可以通过props传入不同的维修指南数据
    guideData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // 组件内部状态
    }
  },
  mounted() {
    console.log('🔧 维修指南组件已加载');
  }
}
</script>

<style scoped>
.maintenance-guide-component {
  width: 100%;
  height: 100%;
}

/* Q&A 格式样式 */
.qa-section {
  text-align: left;
}

.question-section {
  margin-bottom: 24px;
  padding: 16px;
  background: linear-gradient(135deg, #e8f4fd 0%, #c3e7fc 100%);
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.question-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.question-title i {
  color: #409eff;
  font-size: 18px;
}

.answer-section {
  background: #f8f9fb;
  border-radius: 8px;
  padding: 20px;
}

.answer-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e4e7ed;
}

.answer-title i {
  color: #67c23a;
  font-size: 18px;
}

/* 维修章节样式 */
.maintenance-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.maintenance-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f2f5;
}

.section-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #409eff;
  color: #fff;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.section-content {
  color: #606266;
  line-height: 1.6;
}

.section-content p {
  margin: 0 0 12px 0;
  font-size: 14px;
  text-align: justify;
}

.section-content p:last-child {
  margin-bottom: 0;
}

/* 检修步骤列表样式 */
.maintenance-steps-list {
  margin: 0;
  padding-left: 0;
  counter-reset: step-counter;
}

.maintenance-steps-list li {
  position: relative;
  margin-bottom: 16px;
  padding: 12px 16px 12px 50px;
  background: #f8f9fb;
  border-radius: 8px;
  border-left: 4px solid #409eff;
  font-size: 14px;
  line-height: 1.6;
  counter-increment: step-counter;
  transition: all 0.3s ease;
}

.maintenance-steps-list li:hover {
  background: #ecf5ff;
  transform: translateX(2px);
}

.maintenance-steps-list li:before {
  content: counter(step-counter);
  position: absolute;
  left: 16px;
  top: 12px;
  width: 24px;
  height: 24px;
  background: #409eff;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.maintenance-steps-list li:last-child {
  margin-bottom: 0;
}

/* 部件列表样式 */
.component-list {
  margin: 12px 0;
  padding-left: 0;
}

.component-list li {
  position: relative;
  margin-bottom: 8px;
  padding: 8px 16px 8px 40px;
  background: #f0f9ff;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
  font-size: 14px;
  line-height: 1.5;
}

.component-list li:before {
  content: "•";
  position: absolute;
  left: 16px;
  top: 8px;
  color: #3b82f6;
  font-weight: bold;
  font-size: 16px;
}

.component-list li:last-child {
  margin-bottom: 0;
}

.component-list strong {
  color: #1f2937;
  font-weight: 600;
}

/* 故障分析列表样式 */
.fault-analysis-list {
  margin: 12px 0;
  padding-left: 0;
}

.fault-analysis-list li {
  position: relative;
  margin-bottom: 12px;
  padding: 12px 16px 12px 40px;
  background: #fef3f2;
  border-radius: 6px;
  border-left: 3px solid #ef4444;
  font-size: 14px;
  line-height: 1.6;
}

.fault-analysis-list li:before {
  content: "⚠";
  position: absolute;
  left: 16px;
  top: 12px;
  color: #ef4444;
  font-size: 14px;
}

.fault-analysis-list li:last-child {
  margin-bottom: 0;
}

.fault-analysis-list strong {
  color: #dc2626;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .question-section,
  .answer-section {
    padding: 12px;
  }
  
  .maintenance-section {
    padding: 16px;
    margin-bottom: 16px;
  }
  
  .section-title {
    font-size: 14px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .maintenance-steps-list li {
    padding: 10px 12px 10px 40px;
    font-size: 13px;
  }
  
  .maintenance-steps-list li:before {
    left: 12px;
    width: 20px;
    height: 20px;
    font-size: 11px;
  }
  
  .component-list li,
  .fault-analysis-list li {
    padding: 8px 12px 8px 32px;
    font-size: 13px;
  }
  
  .component-list li:before,
  .fault-analysis-list li:before {
    left: 12px;
  }
}

/* 滚动条美化 */
.maintenance-guide-component::-webkit-scrollbar {
  width: 6px;
}

.maintenance-guide-component::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 3px;
}

.maintenance-guide-component::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.maintenance-guide-component::-webkit-scrollbar-thumb:hover {
  background: #909399;
}
</style>
