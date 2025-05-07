<template>
  <div class="process-flow">
    <div class="flow-container">
      <div class="flow-step">
        <div class="parallelogram">
          <div class="step-content">
            <span>采购环节</span>
            <div class="progress-circle-container">
              <div class="progress-circle">
                <svg width="60" height="60" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#e6f7ff" stroke-width="12" />
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#1890ff" stroke-width="12"
                    stroke-dasharray="339.3" stroke-dashoffset="135.7" transform="rotate(-90 60 60)" />
                  <text x="60" y="60" font-size="30" text-anchor="middle" dominant-baseline="middle" fill="#1890ff" 
                    transform="skew(40deg)">60%</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flow-step">
        <div class="parallelogram">
          <span>流程步骤二</span>
        </div>
      </div>
      <div class="flow-step">
        <div class="parallelogram">
          <span>流程步骤三</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProcessFlow'
}
</script>

<style scoped>
/* 流程图容器：占满整个可用空间，垂直居中布局 */
.process-flow {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;  /* 纵向排列 */
  align-items: center;     /* 水平居中 */
  padding-top: 20px;       /* 顶部留白，避免覆盖分割线 */
}

/* 流程图标题样式 */
.flow-title {
  font-size: 18px;         /* 字体大小 */
  color: #333;             /* 字体颜色 */
  font-weight: 500;        /* 字体粗细 */
  margin-bottom: 30px;     /* 下方留白 */
}

/* 流程图步骤容器：垂直排列各步骤 */
.flow-container {
  display: flex;
  flex-direction: column;  /* 纵向排列 */
  align-items: center;     /* 水平居中 */
  width: 100%;
  gap: 30px;               /* 步骤之间的间距 */
}

/* 单个流程步骤容器 */
.flow-step {
  width: 100%;
  display: flex;
  justify-content: center; /* 水平居中 */
  position: relative;      /* 相对定位，用于放置箭头 */
}

/* 添加连接箭头 - 应用于除最后一个元素外的所有元素 */
.flow-step:not(:last-child) {
  margin-bottom: 20px;    /* 确保有足够空间放置箭头 */
}

/* 箭头样式 */
.flow-step:not(:last-child)::after {
  content: "";
  position: absolute;
  bottom: -30px;          /* 位置调整，放在元素下方 */
  left: 50%;              /* 水平居中 */
  transform: translateX(-50%);  /* 精确居中 */
  width: 0;
  height: 0;
  border-left: 20px solid transparent;   /* 创建三角形 */
  border-right: 20px solid transparent;  /* 创建三角形 */
  border-top: 20px solid #1890ff;        /* 箭头颜色 - 蓝色 */
  z-index: 2;             /* 确保箭头显示在上层 */
}

/* 第一个箭头的特殊颜色 - 蓝色 */
.flow-step:nth-child(1):not(:last-child)::after {
  border-top-color: #1890ff;  /* 从第一个元素来的箭头使用蓝色 */
}

/* 第二个箭头的特殊颜色 - 绿色 */
.flow-step:nth-child(2):not(:last-child)::after {
  border-top-color: #52c41a;  /* 从第二个元素来的箭头使用绿色 */
}

/* 平行四边形基础样式 */
.parallelogram {
  width: 90%;            /* 宽度 */
  height: 120px;            /* 高度 */
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  color: #1890ff;
  display: flex;
  align-items: center;     /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  font-weight: 500;
  position: relative;
  transform: skew(-40deg); /* 向左倾斜20度，形成平行四边形 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

/* 平行四边形背景伪元素 */
.parallelogram:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #e6f7ff;
  z-index: -1;             /* 放在内容下方 */
}

/* 平行四边形内容布局 */
.step-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: skew(40deg); /* 内容反向倾斜，抵消容器的倾斜效果 */
  width: 100%;
  gap: 10px;
}

/* 进度环容器 */
.progress-circle-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
}

/* 进度环样式 */
.progress-circle {
  width: 60px;
  height: 60px;
}

/* 平行四边形内的文字样式：反向倾斜，保持正常显示 */
.parallelogram span {
  /* 文字反向倾斜，抵消容器的倾斜效果 */
  display: inline-block;
}

/* 第一个流程步骤的样式：蓝色 */
.flow-step:nth-child(1) .parallelogram {
  background-color: #e6f7ff; /* 浅蓝色背景 */
  border-color: #91d5ff;     /* 蓝色边框 */
  color: #1890ff;            /* 蓝色文字 */
}

/* 第二个流程步骤的样式：绿色 */
.flow-step:nth-child(2) .parallelogram {
  background-color: #f6ffed; /* 浅绿色背景 */
  border-color: #b7eb8f;     /* 绿色边框 */
  color: #52c41a;            /* 绿色文字 */
}

/* 第三个流程步骤的样式：橙色 */
.flow-step:nth-child(3) .parallelogram {
  background-color: #fff7e6; /* 浅橙色背景 */
  border-color: #ffd591;     /* 橙色边框 */
  color: #fa8c16;            /* 橙色文字 */
}

/* 为第二个和第三个步骤保持原有布局 */
.flow-step:nth-child(2) .parallelogram,
.flow-step:nth-child(3) .parallelogram {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 