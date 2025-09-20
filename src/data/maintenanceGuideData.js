// 维修指南数据 - 转向架悬挂装置检修
export const maintenanceGuideData = {
  // 转向架悬挂装置检修详细指南
  suspensionMaintenance: {
    title: "转向架悬挂装置检修指南",
    summary: "转向架悬挂装置的全面检修方案，包含一系悬挂和二系悬挂的检修要点",
    
    // 精简版维修建议（用于弹窗显示）
    compactGuides: [
      {
        id: 1,
        title: '转向架悬挂装置检修',
        type: '紧急',
        description: '转向架悬挂装置检修包含一系悬挂（轮对与构架间）和二系悬挂（转向架与车体间）的全面检查',
        quickSteps: ['检查轴箱弹簧', '测试液压减震器', '检查空气弹簧', '验证减震器连接'],
        estimatedTime: '45-60分钟',
        riskLevel: 'high'
      },
      {
        id: 2,
        title: '一系悬挂检修要点',
        type: '重要',
        description: '重点检查轴箱弹簧、液压减震器等部件，确保轮轨冲击缓和效果',
        quickSteps: ['弹簧裂纹检查', '减震器阻尼测试', '轴箱定位装置', '润滑维护'],
        estimatedTime: '20-30分钟',
        riskLevel: 'medium'
      },
      {
        id: 3,
        title: '二系悬挂检修要点',
        type: '重要',
        description: '检查空气弹簧、横向减震器、抗蛇行减震器等，提升乘坐舒适性',
        quickSteps: ['空气弹簧气压', '减震器连接', '螺栓紧固', '清洁润滑'],
        estimatedTime: '25-35分钟',
        riskLevel: 'medium'
      }
    ],

    // 详细的Q&A内容
    detailedGuide: {
      question: "转向架的悬挂装置该如何检修？",
      answer: {
        // 检修类型介绍
        maintenanceTypes: {
          title: "检修类型介绍",
          content: `转向架的悬挂装置主要分为一系悬挂和二系悬挂。一系悬挂位于轮对与构架之间，主要包括轴箱弹簧、液压减震器等，用于缓和轮轨之间的冲击。二系悬挂位于转向架与车体之间，包括空气弹簧、横向减震器、抗蛇行减震器等，用于提高乘坐舒适性和运行稳定性。检修类型包括日常检查、定期维护和深度检修，具体根据使用周期和状态进行判定。`,
          keyPoints: [
            "一系悬挂：轮对与构架间的缓冲系统",
            "二系悬挂：转向架与车体间的减震系统", 
            "检修类型：日常检查、定期维护、深度检修"
          ]
        },

        // 检修方法步骤
        maintenanceSteps: {
          title: "检修方法步骤",
          steps: [
            {
              stepNumber: 1,
              description: "检查一系悬挂装置的轴箱弹簧是否有裂纹、变形或老化，使用游标卡尺测量弹簧自由高度，不符合标准需更换。",
              tools: ["游标卡尺"],
              checkPoints: ["裂纹检查", "变形检测", "老化评估", "高度测量"],
              standards: "弹簧自由高度需符合技术标准"
            },
            {
              stepNumber: 2,
              description: "检查一系悬挂液压减震器是否有漏油、损坏或卡滞，使用专用工具进行阻尼性能测试，超标需更换。",
              tools: ["专用阻尼测试工具"],
              checkPoints: ["漏油检查", "损坏检测", "卡滞测试", "阻尼性能"],
              standards: "阻尼性能需在规定范围内"
            },
            {
              stepNumber: 3,
              description: "检查二系悬挂空气弹簧是否有破损、老化或漏气，使用气压表测量气压，若异常需更换或修复。",
              tools: ["气压表"],
              checkPoints: ["破损检查", "老化评估", "漏气测试", "气压测量"],
              standards: "气压需维持在标准范围"
            },
            {
              stepNumber: 4,
              description: "检查横向减震器和抗蛇行减震器的连接部件是否松动，使用扭矩扳手紧固螺栓并检查减震器动作是否正常。",
              tools: ["扭矩扳手"],
              checkPoints: ["连接部件", "螺栓紧固", "减震器动作"],
              standards: "扭矩值需符合技术要求"
            },
            {
              stepNumber: 5,
              description: "对悬挂装置进行清洁和润滑，使用指定的润滑脂涂抹减震器导向套和连接部位。",
              tools: ["指定润滑脂"],
              checkPoints: ["清洁处理", "润滑涂抹", "导向套保养"],
              standards: "使用指定型号润滑脂"
            },
            {
              stepNumber: 6,
              description: "检查悬挂装置的安装座和支撑部件是否有裂纹或腐蚀，必要时进行探伤或更换。",
              tools: ["探伤设备"],
              checkPoints: ["安装座检查", "支撑部件", "裂纹探测", "腐蚀评估"],
              standards: "无裂纹和严重腐蚀"
            }
          ]
        },

        // 部件组成结构
        componentStructure: {
          title: "部件组成结构",
          description: "转向架悬挂装置主要包括：",
          primarySuspension: {
            name: "一系悬挂",
            components: [
              "轴箱弹簧",
              "轴箱定位装置", 
              "一系液压减震器"
            ],
            function: "缓和轮轨间冲击"
          },
          secondarySuspension: {
            name: "二系悬挂", 
            components: [
              "空气弹簧",
              "横向减震器",
              "抗蛇行减震器",
              "构架与车体连接座"
            ],
            function: "提高舒适性和稳定性"
          },
          workingPrinciple: "这些部件通过弹性元件和液压元件共同作用，实现轮对与构架、构架与车体之间的柔性连接，降低振动和冲击传递。"
        },

        // 故障分析
        faultAnalysis: {
          title: "故障分析",
          description: "悬挂装置故障可能导致动车组运行异常，如：",
          primarySuspensionFaults: {
            name: "一系悬挂故障",
            effects: [
              "轮对冲击增大",
              "轮轨接触不良", 
              "轴箱温升过高",
              "轮对异响"
            ],
            impact: "影响行车安全和设备寿命"
          },
          secondarySuspensionFaults: {
            name: "二系悬挂故障",
            effects: [
              "车体振动加剧",
              "乘坐舒适性下降",
              "空气弹簧漏气",
              "减震器失效",
              "车体倾斜或横向摆动增大"
            ],
            impact: "影响乘客体验和运行稳定性"
          },
          commonCauses: [
            "弹簧老化",
            "减震器漏油",
            "连接螺栓松动或断裂",
            "空气弹簧破损",
            "减震器阻尼性能下降"
          ]
        }
      }
    }
  },

  // 其他维修指南可以在这里扩展
  otherGuides: {
    // 可以添加其他系统的维修指南
  }
};

// 导出精简版建议数据（用于快速维修指南弹窗）
export const getCompactMaintenanceGuides = () => {
  return maintenanceGuideData.suspensionMaintenance.compactGuides;
};

// 导出详细建议数据（用于详细建议展示）
export const getDetailedMaintenanceGuide = () => {
  return maintenanceGuideData.suspensionMaintenance.detailedGuide;
};

// 导出所有维修建议数据
export const getAllMaintenanceGuides = () => {
  return maintenanceGuideData;
};
