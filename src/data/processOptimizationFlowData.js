// 这个文件将用于存储Mermaid流程图的数据

// 流程优化数据
const processOptimizationFlowData = {
  Optimization1: {
    title: '采购流程重构优化',
    description: '原流程缺乏人员风险管控，重构后增加人员调动、紧急招聘、培训等环节，提高流程稳定性和连续性。',
    before: `graph TD\nA((开始)) --> B[接收部门需求]\nB --> C[需求分析整理]\nC --> D[预算审核]\nD -->|不通过| E[预算调整]\nE --> C\nD -->|通过| F[生成采购申请]\nF --> G((结束))`,
    after: `graph TD\nA((开始)) --> B[接收部门需求]\nB --> H[人员状态检查]\nH --> I{审核人员是否充足}\nI -->|人员不足| J[启动应急预案]\nJ --> K[人员调动] & L[紧急招聘]\nK --> M[快速培训]\nL --> N[新员工培训]\nM --> S[人员到位确认]\nN --> S\nS --> C[需求分析整理]\nI -->|人员充足| C\nC --> O[预算审核]\nO -->|不通过| P[预算调整]\nP --> C\nO -->|通过| Q[生成采购申请]\nQ --> R((结束))`,
    after2: `graph TD\nA((开始)) --> B[接收部门需求]\nB --> H[人员状态检查]\nH --> I{当前人员是否可用}\nI -->|人员不足| J[指定备用人员]\nJ --> C[需求分析整理]\nI -->|人员充足| C\nC --> D[预算审核+风险备注]\nD -->|不通过| E[预算调整]\nE --> C\nD -->|通过| F[生成采购申请]\nF --> G((结束))`,
    llm: `graph TD\nA((开始)) --> B[接收部门需求]\nB --> H[人员状态智能检测]\nH --> I{人员可用性检查}\nI -->|主责人员可用| C[需求分析整理]\nI -->|人员不足| J[自动触发应急协议]\nJ --> K[内部人员调度] & L[外包资源调用]\nK & L --> M[快速上岗验证]\nM --> C\n\nC --> D[预算审核]\nD -->|不通过| E[预算调整]\nE --> C\nD -->|通过| F[生成采购申请]\nF --> G((结束))\n\nclassDef risk fill:#f9e3d3,stroke:#f66;\nclass J,K,L risk;`,
    // 资源变化分析
    resourceChanges: {
      // 总体变化概览
      summary: {
        processSteps: { before: 6, after: 13 },      // 流程步骤变化
        newFunctions: 7,                             // 新增功能环节
        resourceTypes: ['人员', '系统', '文档', '设备'], // 涉及资源类型
        implementationPhases: 3                       // 分阶段实施
      },
      
      // 新增资源类型需求
      newResourceTypes: {
        // 人员资源新增需求
        personnel: {
          categories: [
            '人力资源专员（数据分析、风险评估）',
            '运营管理专员（应急响应、执行协调）', 
            '培训发展专员（快速培训、新员工培训）',
            '招聘专员（紧急招聘、面试官）'
          ],
          departments: ['人力资源部', '运营管理部', '培训发展部'],
          totalEstimate: '9-12名新增人员'
        },
        
        // 系统资源新增需求  
        systems: {
          categories: [
            '监控预警类（人员状态监控、风险预警）',
            '管理执行类（应急管理、人员调配）',
            '招聘培训类（快速招聘、在线培训、学习跟踪）',
            '验收确认类（人员验收系统）'
          ],
          implementation: '6个新系统需要开发或采购',
          integration: '需要与现有ERP系统集成'
        },
        
        // 文档资源新增需求
        documents: {
          categories: [
            '检查评估类（状态检查表、风险评估报告、配置标准）',
            '应急管理类（应急预案手册、流程指南、联系清单）',
            '人员管理类（调动申请表、技能匹配表、确认单）',
            '招聘培训类（招聘流程、面试评估、培训大纲、培训手册）'
          ],
          totalEstimate: '15-20份新增文档和标准'
        },
        
        // 设备资源新增需求
        equipment: {
          categories: [
            '培训设备（投影仪、电脑、音响等）',
            '培训场地（多媒体培训室改造）'
          ],
          purpose: '支持新增的培训环节需求'
        }
      },
      
      // 原有资源增强需求
      existingResourceEnhancements: {
        processNodes: [
          '采购需求节点：增加人员稳定性分析',
          '预算审核节点：增加人员风险影响评估'
        ],
        personnelTraining: [
          '现有采购人员需要接受人员风险管理培训',
          '现有财务人员需要学习人员风险评估方法'
        ],
        systemUpgrades: [
          '现有HR系统需要升级支持人员调配功能',
          '现有预算系统需要增加风险评估模块'
        ]
      },
      
      // 实施影响分析
      implementationImpact: {
        organizationalChange: '需要建立跨部门协作机制',
        processComplexity: '流程步骤增加117%，需要重新培训相关人员',
        systemIntegration: '新增系统需要与现有8个业务系统集成',
        changeManagement: '需要制定详细的变更管理计划',
        riskMitigation: '显著降低人员流失对业务连续性的影响'
      },
      
      // 预期效益（定性分析）
      expectedBenefits: {
        resilience: '流程抗风险能力显著增强',
        continuity: '人员变动不再导致流程中断',
        efficiency: '人员短缺应对速度大幅提升', 
        standardization: '人员管理和培训体系标准化',
        sustainability: '建立可持续的人员保障机制'
      }
    },
    
    // 简化版资源变化分析（after2方案）
    resourceChanges2: {
      // 总体变化概览
      summary: {
        processSteps: { before: 6, after: 8 },       // 流程步骤变化（最小化）
        newFunctions: 2,                             // 新增功能环节（大幅减少）
        resourceTypes: ['人员', '文档'],              // 涉及资源类型（简化）
        implementationPhases: 1                       // 单阶段实施
      },
      
      // 最小化资源需求
      minimalResourceChanges: {
        // 人员资源最小需求
        personnel: {
          categories: [
            '指定现有员工作为备用人员（无新增人员）',
            '部门主管兼任人员风险评估（利用现有岗位）'
          ],
          approach: '利用现有人员，无需新增岗位',
          totalEstimate: '0名新增人员，2-3名现有员工承担额外职责'
        },
        
        // 系统资源最小需求  
        systems: {
          approach: '利用现有系统功能，无需新系统开发',
          modifications: [
            '在现有OA系统中增加简单的人员状态标记',
            '在现有预算系统中增加风险备注字段'
          ],
          implementation: '仅需现有系统小幅配置调整'
        },
        
        // 文档资源最小需求
        documents: {
          categories: [
            '简单的人员状态检查清单（1页）',
            '备用人员联系名单（1页）',
            '风险备注标准格式（1页）'
          ],
          totalEstimate: '3份简单文档',
          approach: '重用现有文档模板，最小化新增内容'
        },
        
        // 无需新增设备
        equipment: {
          requirement: '无需新增设备',
          approach: '完全利用现有办公设备和系统'
        }
      },
      
      // 现有资源微调
      minimalEnhancements: {
        processNodes: [
          '需求接收节点：增加5分钟人员状态快速检查',
          '预算审核节点：增加简单风险备注功能'
        ],
        personnelTraining: [
          '现有采购人员接受30分钟简单培训',
          '备用人员接受基础知识培训（2小时）'
        ],
        systemModifications: [
          '现有系统界面增加状态标记功能',
          '预算表格增加风险备注栏位'
        ]
      },
      
      // 实施影响分析（最小化）
      implementationImpact: {
        organizationalChange: '无需组织架构调整',
        processComplexity: '流程步骤仅增加33%，培训需求最小',
        systemIntegration: '无需系统集成，仅需配置调整',
        changeManagement: '变更管理极其简单，1周内可完成',
        riskMitigation: '基本解决人员风险管控缺失问题'
      },
      
      // 预期效益（务实评估）
      expectedBenefits: {
        resilience: '流程抗风险能力适度增强',
        continuity: '基本保障人员变动时的流程连续性',
        efficiency: '人员短缺预警和基本应对能力', 
        costEffectiveness: '极低的实施成本和资源投入',
        quickImplementation: '快速实施，立即见效'
      }
    },
    
    // 甘特图数据
    ganttData: {
      title: '采购流程重构优化项目计划',
      tasks: [
        { id: 1, name: '接收部门需求', start: '2024-01-15', end: '2024-01-15', duration: 0.5, responsible: '采购专员', priority: 'medium' },
        { id: 2, name: '人员状态检查', start: '2024-01-16', end: '2024-01-16', duration: 0.5, responsible: 'HR专员', priority: 'high', dependencies: [1] },
        { id: 3, name: '应急预案启动', start: '2024-01-17', end: '2024-01-17', duration: 0.5, responsible: '运营管理专员', priority: 'critical', dependencies: [2] },
        { id: 4, name: '人员调动招聘', start: '2024-01-18', end: '2024-01-20', duration: 3, responsible: '招聘专员', priority: 'critical', dependencies: [3] },
        { id: 5, name: '人员培训', start: '2024-01-21', end: '2024-01-23', duration: 3, responsible: '培训发展专员', priority: 'high', dependencies: [4] },
        { id: 6, name: '人员到位确认', start: '2024-01-24', end: '2024-01-24', duration: 0.5, responsible: 'HR专员', priority: 'high', dependencies: [5] },
        { id: 7, name: '需求分析整理', start: '2024-01-25', end: '2024-01-26', duration: 2, responsible: '采购分析师', priority: 'medium', dependencies: [6] },
        { id: 8, name: '预算审核', start: '2024-01-27', end: '2024-01-28', duration: 2, responsible: '财务主管', priority: 'high', dependencies: [7] },
        { id: 9, name: '生成采购申请', start: '2024-01-29', end: '2024-01-29', duration: 0.5, responsible: '采购专员', priority: 'medium', dependencies: [8] }
      ],
      milestones: [
        { id: 'm1', name: '人员状态确认', date: '2024-01-16', type: 'planning' },
        { id: 'm2', name: '人员到位', date: '2024-01-24', type: 'execution' },
        { id: 'm3', name: '预算批准', date: '2024-01-28', type: 'planning' },
        { id: 'm4', name: '申请完成', date: '2024-01-29', type: 'completion' }
      ]
    },
    
    // 简化版甘特图数据（after2方案）
    ganttData2: {
      title: '采购流程简化重构项目计划',
      tasks: [
        { id: 1, name: '接收部门需求', start: '2024-01-15', end: '2024-01-15', duration: 0.5, responsible: '采购专员', priority: 'medium' },
        { id: 2, name: '人员状态快速检查', start: '2024-01-15', end: '2024-01-15', duration: 0.1, responsible: '采购专员', priority: 'medium', dependencies: [1] },
        { id: 3, name: '指定备用人员（如需要）', start: '2024-01-15', end: '2024-01-15', duration: 0.2, responsible: '部门主管', priority: 'medium', dependencies: [2] },
        { id: 4, name: '需求分析整理', start: '2024-01-16', end: '2024-01-17', duration: 2, responsible: '采购分析师/备用人员', priority: 'medium', dependencies: [3] },
        { id: 5, name: '预算审核+风险备注', start: '2024-01-18', end: '2024-01-19', duration: 2, responsible: '财务主管', priority: 'high', dependencies: [4] },
        { id: 6, name: '预算调整（如需要）', start: '2024-01-20', end: '2024-01-20', duration: 1, responsible: '财务主管', priority: 'medium', dependencies: [5], optional: true },
        { id: 7, name: '生成采购申请', start: '2024-01-21', end: '2024-01-21', duration: 0.5, responsible: '采购专员', priority: 'medium', dependencies: [5] }
      ],
      milestones: [
        { id: 'm1', name: '人员状态确认', date: '2024-01-15', type: 'planning' },
        { id: 'm2', name: '需求分析完成', date: '2024-01-17', type: 'execution' },
        { id: 'm3', name: '预算批准', date: '2024-01-19', type: 'planning' },
        { id: 'm4', name: '申请完成', date: '2024-01-21', type: 'completion' }
      ]
    }
  },
  
  Optimization2: {
    title: '供应商选择流程重构优化',
    description: '应对美国关税战的供应链多元化策略优化方案',
    before: `graph TD\n  A((开始)) --> B[供应商调研]\n  B --> C[初步筛选]\n  C --> D[供应商评估]\n  D --> E{合格评审}\n  E -->|通过| F[供应商入库]\n  E -->|不通过| G[供应商淘汰]\n  F --> H((结束))\n  G --> H`,
    after: `graph TD\n  A((开始)) --> B[关税风险评估]\n  B --> C{是否涉及美国供应商}\n  C -->|是| D[启动应急方案]\n  C -->|否| E[常规流程]\n  D --> F[多国供应商并行评估]\n  F --> G[东南亚供应商] & H[欧洲供应商] & I[本土供应商]\n  G --> J[综合评分]\n  H --> J\n  I --> J\n  J --> K{最优方案}\n  K -->|关税豁免| L[申请贸易救济]\n  K -->|替代方案| M[签订长期协议]\n  L --> N[海关备案]\n  M --> N\n  N --> O[建立安全库存]\n  O --> P((结束))`,
    after2: `graph TD\n  A((开始)) --> B[供应商调研]\n  B --> C[关税风险检查]\n  C --> D{是否涉及高风险区域}\n  D -->|是| E[寻找替代供应商]\n  D -->|否| F[初步筛选]\n  E --> G[简化评估]\n  F --> G\n  G --> H{合格评审}\n  H -->|通过| I[供应商入库]\n  H -->|不通过| J[供应商淘汰]\n  I --> K[建立基础库存]\n  K --> L((结束))\n  J --> L`,
    llm: `graph TD\n    A((开始)) --> B[供应商国别识别]\n    B --> C{是否涉及美国供应?}\n    C -->|是| D[关税战专项评估]\n    C -->|否| E[常规评估流程]\n    \n    D --> F[实时关税查询]\n    F --> G[成本敏感性分析]\n    G --> H{成本波动>阈值?}\n    H -->|是| I[启动B计划]\n    H -->|否| E\n    \n    I --> J[替代供应商快速认证]\n    J --> K[建立缓冲库存]\n    K --> E\n    \n    E --> L[供应商能力评估]\n    L --> M{合格评审}\n    M -->|通过| N[弹性分级入库]\n    M -->|不通过| O[淘汰+替代源标记]\n    \n    N --> P((结束))\n    O --> B\n    \n    classDef us path fill:#ffcdd2,stroke:#d32f2f;\n    classDef normal path fill:#e8f5e9,stroke:#388e3c;\n    class D,F,G,H,I,J,K us;\n    class E,L,M,N,O normal;`,  
    // 资源变化分析
    resourceChanges: {
      // 总体变化概览
      summary: {
        processSteps: { before: 7, after: 16 },      // 流程步骤变化
        newFunctions: 9,                             // 新增功能环节
        resourceTypes: ['人员', '系统', '文档', '设备'], // 涉及资源类型
        implementationPhases: 4                       // 分阶段实施
      },
      
      // 新增资源类型需求
      newResourceTypes: {
        // 人员资源新增需求
        personnel: {
          categories: [
            '贸易合规专员（关税政策分析、风险评估）',
            '国际采购专员（多国供应商管理、谈判协调）',
            '供应链风险分析师（供应链安全评估、应急预案）',
            '法务专员（贸易救济申请、合规审查）',
            '仓储管理专员（安全库存管理、物流协调）'
          ],
          departments: ['国际贸易部', '采购部', '法务部', '仓储部'],
          totalEstimate: '12-15名新增人员'
        },
        
        // 系统资源新增需求  
        systems: {
          categories: [
            '关税查询系统（实时关税政策、税率计算）',
            '多国供应商管理平台（供应商信息、评估对比）',
            '风险预警系统（贸易风险监控、预警通知）',
            '贸易救济申请系统（申请流程、文档管理）',
            '智能库存管理系统（安全库存优化、补货提醒）'
          ],
          implementation: '5个新系统需要开发或采购',
          integration: '需要与海关系统和ERP系统集成'
        },
        
        // 文档资源新增需求
        documents: {
          categories: [
            '贸易政策类（关税政策手册、贸易法规汇编、政策解读）',
            '供应商管理类（多国供应商标准、评估模板、合同范本）',
            '风险管理类（风险评估表、应急预案、风险缓解措施）',
            '合规操作类（海关备案流程、贸易救济申请指南、合规检查清单）',
            '库存管理类（安全库存标准、库存优化策略、补货作业指导）'
          ],
          totalEstimate: '20-25份新增文档和标准'
        },
        
        // 设备资源新增需求
        equipment: {
          categories: [
            '仓储设备（智能货架、自动分拣设备、温控设备）',
            '办公设备（多国通讯设备、专用服务器、安全存储设备）'
          ],
          purpose: '支持多国供应商管理和安全库存需求'
        }
      },
      
      // 原有资源增强需求
      existingResourceEnhancements: {
        processNodes: [
          '供应商调研节点：增加关税风险和政策合规性分析',
          '供应商评估节点：增加多维度风险评估和替代方案对比'
        ],
        personnelTraining: [
          '现有采购人员需要接受国际贸易法规培训',
          '现有质量管理人员需要学习多国标准差异化管理',
          '现有财务人员需要掌握关税成本核算方法'
        ],
        systemUpgrades: [
          '现有采购系统需要升级支持多国供应商并行管理',
          '现有财务系统需要增加关税成本核算模块',
          '现有质量系统需要适配多国质量标准'
        ]
      },
      
      // 实施影响分析
      implementationImpact: {
        organizationalChange: '需要建立国际化供应链管理体系',
        processComplexity: '流程步骤增加128%，涉及多国法规和标准',
        systemIntegration: '新增系统需要与海关、银行等外部系统对接',
        changeManagement: '需要应对中美贸易关系变化的敏捷管理机制',
        riskMitigation: '显著降低单一供应商和地缘政治风险'
      },
      
      // 预期效益（定性分析）
      expectedBenefits: {
        resilience: '供应链抗贸易战冲击能力显著增强',
        continuity: '多元化供应体系确保业务连续性',
        efficiency: '智能化风险评估提升决策效率',
        standardization: '建立标准化的国际供应商管理体系',
        sustainability: '构建可持续的全球供应链网络'
      }
    },
    
    // 简化版资源变化分析（after2方案）
    resourceChanges2: {
      // 总体变化概览
      summary: {
        processSteps: { before: 7, after: 11 },      // 流程步骤变化（最小化）
        newFunctions: 4,                             // 新增功能环节（大幅减少）
        resourceTypes: ['人员', '文档'],              // 涉及资源类型（简化）
        implementationPhases: 1                       // 单阶段实施
      },
      
      // 最小化资源需求
      minimalResourceChanges: {
        // 人员资源最小需求
        personnel: {
          categories: [
            '现有采购人员兼任关税风险检查（无新增人员）',
            '采购主管负责替代供应商寻找（利用现有岗位）',
            '仓库管理员负责基础库存管理（现有职责扩展）'
          ],
          approach: '利用现有人员，无需专业贸易团队',
          totalEstimate: '0名新增人员，3-4名现有员工承担额外职责'
        },
        
        // 系统资源最小需求  
        systems: {
          approach: '利用现有系统，无需复杂贸易系统',
          modifications: [
            '在现有采购系统中增加风险标记字段',
            '库存系统增加基础安全库存提醒功能'
          ],
          implementation: '仅需现有系统简单配置调整'
        },
        
        // 文档资源最小需求
        documents: {
          categories: [
            '关税风险快速检查清单（2页）',
            '高风险区域供应商名单（1页）',
            '替代供应商联系表（2页）',
            '基础库存管理指南（3页）'
          ],
          totalEstimate: '4份简单操作文档',
          approach: '重用现有模板，最小化新增内容'
        },
        
        // 无需新增设备
        equipment: {
          requirement: '无需新增专业设备',
          approach: '完全利用现有办公设备和仓储设施'
        }
      },
      
      // 现有资源微调
      minimalEnhancements: {
        processNodes: [
          '供应商调研节点：增加5分钟关税风险快速检查',
          '供应商评估节点：增加基础风险评估功能'
        ],
        personnelTraining: [
          '现有采购人员接受2小时关税基础培训',
          '仓库管理员学习安全库存管理（4小时）'
        ],
        systemModifications: [
          '采购系统增加风险标记功能',
          '库存系统增加安全库存提醒'
        ]
      },
      
      // 实施影响分析（最小化）
      implementationImpact: {
        organizationalChange: '无需组织架构调整',
        processComplexity: '流程步骤仅增加57%，学习成本低',
        systemIntegration: '无需外部系统集成，仅需内部配置',
        changeManagement: '变更管理简单，1周内可完成',
        riskMitigation: '基本应对贸易风险，保障供应链基本稳定'
      },
      
      // 预期效益（务实评估）
      expectedBenefits: {
        resilience: '供应链抗风险能力适度增强',
        continuity: '基本避免高风险供应商依赖',
        efficiency: '快速识别和应对贸易风险',
        costEffectiveness: '极低的实施成本和维护费用',
        quickImplementation: '快速实施，立即见效'
      }
    },
    
    // 甘特图数据
    ganttData: {
      title: '供应商选择流程重构优化项目计划',
      tasks: [
        { id: 1, name: '关税风险评估', start: '2024-02-01', end: '2024-02-02', duration: 2, responsible: '贸易合规专员', priority: 'critical' },
        { id: 2, name: '供应商调研启动', start: '2024-02-03', end: '2024-02-03', duration: 1, responsible: '国际采购专员', priority: 'high', dependencies: [1] },
        { id: 3, name: '多国供应商并行评估', start: '2024-02-04', end: '2024-02-08', duration: 5, responsible: '供应链分析师', priority: 'critical', dependencies: [2] },
        { id: 4, name: '综合评分对比', start: '2024-02-09', end: '2024-02-10', duration: 2, responsible: '采购主管', priority: 'high', dependencies: [3] },
        { id: 5, name: '贸易救济申请', start: '2024-02-11', end: '2024-02-13', duration: 3, responsible: '法务专员', priority: 'medium', dependencies: [4] },
        { id: 6, name: '海关备案', start: '2024-02-14', end: '2024-02-15', duration: 2, responsible: '贸易合规专员', priority: 'high', dependencies: [5] },
        { id: 7, name: '建立安全库存', start: '2024-02-16', end: '2024-02-18', duration: 3, responsible: '仓储管理专员', priority: 'medium', dependencies: [6] }
      ],
      milestones: [
        { id: 'm1', name: '风险评估完成', date: '2024-02-02', type: 'planning' },
        { id: 'm2', name: '供应商确定', date: '2024-02-10', type: 'execution' },
        { id: 'm3', name: '合规备案完成', date: '2024-02-15', type: 'completion' }
      ]
    },
    
    // 简化版甘特图数据（after2方案）
    ganttData2: {
      title: '供应商选择流程简化重构项目计划',
      tasks: [
        { id: 1, name: '制定风险检查清单', start: '2024-02-01', end: '2024-02-01', duration: 1, responsible: '采购主管', priority: 'medium' },
        { id: 2, name: '供应商调研', start: '2024-02-02', end: '2024-02-02', duration: 1, responsible: '采购专员', priority: 'medium', dependencies: [1] },
        { id: 3, name: '关税风险快速检查', start: '2024-02-03', end: '2024-02-03', duration: 0.5, responsible: '采购专员', priority: 'high', dependencies: [2] },
        { id: 4, name: '寻找替代供应商', start: '2024-02-04', end: '2024-02-05', duration: 2, responsible: '采购主管', priority: 'high', dependencies: [3] },
        { id: 5, name: '简化评估', start: '2024-02-06', end: '2024-02-07', duration: 2, responsible: '采购团队', priority: 'medium', dependencies: [4] },
        { id: 6, name: '供应商入库', start: '2024-02-08', end: '2024-02-08', duration: 0.5, responsible: '采购专员', priority: 'medium', dependencies: [5] },
        { id: 7, name: '建立基础库存', start: '2024-02-09', end: '2024-02-10', duration: 2, responsible: '仓库管理员', priority: 'medium', dependencies: [6] }
      ],
      milestones: [
        { id: 'm1', name: '风险检查完成', date: '2024-02-03', type: 'planning' },
        { id: 'm2', name: '供应商确定', date: '2024-02-08', type: 'execution' },
        { id: 'm3', name: '库存建立完成', date: '2024-02-10', type: 'completion' }
      ]
    }
  },
  
  Optimization3: {
    title: '故障报警流程重构优化',
    description: '针对单一人工分析可靠性不足的问题，通过AI智能分析实现双重验证机制',
    before: `graph TD\nA((开始)) --> B[报警接收]\nB --> C[人工分析]\nC --> D{紧急程度}\nD -->|紧急| E[紧急处理]\nD -->|一般| F[常规处理]\nE --> G[故障排除]\nF --> G\nG --> H[报警记录]\nH --> I((结束))`,
    after: `graph TD\nA((开始)) --> B[报警接收]\nB --> C[人工分析] & D[AI智能分析]\nC --> E{紧急程度}\nD --> E\nE -->|紧急| F[自动启动应急] & G[通知专家]\nE -->|一般| H[智能派单]\nF --> I[快速故障排除]\nG --> I\nH --> I\nI --> J[自动记录] & K[经验学习]\nJ --> L((结束))\nK --> L`,
    after2: `graph TD\nA((开始)) --> B[报警接收]\nB --> C[人工分析]\nC --> D[AI辅助判断]\nD --> E{紧急程度}\nE -->|紧急| F[优先处理]\nE -->|一般| G[常规处理]\nF --> H[快速故障排除]\nG --> H\nH --> I[自动记录]\nI --> J((结束))`,
    llm: `graph TD\nA((开始)) --> B[报警接收]\nB --> C[AI实时预分析]\nC --> D{AI置信度>90%?}\nD -->|是| E[自动分类]\nD -->|否| F[人工复核]\n\nE --> G{紧急程度}\nG -->|紧急| H[AI紧急处理]\nG -->|一般| I[AI常规处理]\n\nF --> J[专家会诊模式]\nJ --> K[双重确认]\nK --> G\n\nH & I --> L[执行处置]\nL --> M[结果反馈至AI]\nM --> N[报警记录+学习]\nN --> O((结束))\n\nclassDef ai fill:#e3f2fd,stroke:#2196f3;\nclassDef human fill:#fff8e1,stroke:#ffc107;\nclass C,D,E,G,H,I ai;\nclass F,J,K human;`,
    // 资源变化分析
    resourceChanges: {
      // 总体变化概览
      summary: {
        processSteps: { before: 8, after: 12 },      // 流程步骤变化
        newFunctions: 4,                             // 新增功能环节
        resourceTypes: ['人员', '系统', '文档', '设备'], // 涉及资源类型
        implementationPhases: 3                       // 分阶段实施
      },
      
      // 新增资源类型需求
      newResourceTypes: {
        // 人员资源新增需求
        personnel: {
          categories: [
            'AI算法工程师（机器学习、故障识别算法开发）',
            '数据分析师（故障数据挖掘、模型优化）',
            'IT运维专家（系统监控、应急响应协调）',
            '智能运维工程师（AI系统维护、模型训练）'
          ],
          departments: ['技术研发部', '数据分析部', 'IT运维部'],
          totalEstimate: '8-10名新增人员'
        },
        
        // 系统资源新增需求  
        systems: {
          categories: [
            'AI故障分析引擎（机器学习、模式识别、智能诊断）',
            '智能派单系统（自动分配、优先级排序、负载均衡）',
            '专家通知系统（实时通讯、状态跟踪、协作平台）',
            '经验学习系统（知识图谱、案例库、持续优化）'
          ],
          implementation: '4个AI智能系统需要开发',
          integration: '需要与现有监控和工单系统深度集成'
        },
        
        // 文档资源新增需求
        documents: {
          categories: [
            'AI模型类（算法规范、模型文档、训练指南、评估标准）',
            '智能运维类（AI分析流程、双重验证规范、异常处理手册）',
            '专家协作类（专家库管理、响应流程、协作规范）',
            '经验管理类（知识积累规范、案例标准化、学习机制）'
          ],
          totalEstimate: '12-15份新增文档和标准'
        },
        
        // 设备资源新增需求
        equipment: {
          categories: [
            'AI计算设备（GPU服务器、高性能计算集群、存储阵列）',
            '监控设备（智能传感器、数据采集器、边缘计算设备）'
          ],
          purpose: '支持AI模型训练、推理和实时数据处理需求'
        }
      },
      
      // 原有资源增强需求
      existingResourceEnhancements: {
        processNodes: [
          '报警接收节点：增加数据预处理和特征提取功能',
          '故障排除节点：增加AI辅助诊断和解决方案推荐'
        ],
        personnelTraining: [
          '现有运维人员需要学习AI辅助故障分析方法',
          '现有技术专家需要掌握人机协作的新工作模式',
          '现有管理人员需要了解智能运维的评估指标'
        ],
        systemUpgrades: [
          '现有监控系统需要升级数据接口支持AI分析',
          '现有工单系统需要集成智能派单和状态跟踪',
          '现有知识库需要重构支持机器学习和知识图谱'
        ]
      },
      
      // 实施影响分析
      implementationImpact: {
        organizationalChange: '需要建立人机协作的智能运维体系',
        processComplexity: '流程步骤增加50%，但自动化程度显著提升',
        systemIntegration: 'AI系统需要与现有监控、工单、知识库系统集成',
        changeManagement: '需要适应从人工主导到AI辅助的工作模式转变',
        riskMitigation: '通过双重验证机制显著降低误判和漏报风险'
      },
      
      // 预期效益（定性分析）
      expectedBenefits: {
        resilience: '故障识别和响应的准确性和速度显著提升',
        continuity: 'AI24小时不间断分析确保业务连续性',
        efficiency: '自动化处理大幅提升运维效率',
        standardization: '建立标准化的智能故障处理体系',
        sustainability: '持续学习机制实现运维能力的自我优化'
      }
    },
    
    // 简化版资源变化分析（after2方案）
    resourceChanges2: {
      // 总体变化概览
      summary: {
        processSteps: { before: 8, after: 10 },      // 流程步骤变化（最小化）
        newFunctions: 2,                             // 新增功能环节（大幅减少）
        resourceTypes: ['人员', '系统'],              // 涉及资源类型（简化）
        implementationPhases: 1                       // 单阶段实施
      },
      
      // 最小化资源需求
      minimalResourceChanges: {
        // 人员资源最小需求
        personnel: {
          categories: [
            '现有运维人员接受简单AI工具培训（无新增人员）',
            '技术主管兼任AI辅助工具管理（利用现有岗位）'
          ],
          approach: '利用现有人员，无需新增专业岗位',
          totalEstimate: '0名新增人员，2-3名现有员工承担额外职责'
        },
        
        // 系统资源最小需求  
        systems: {
          approach: '使用开源AI工具，无需大规模开发',
          modifications: [
            '部署轻量级AI故障分析工具',
            '在现有监控系统中集成简单AI预警'
          ],
          implementation: '采用现成AI工具，快速集成部署'
        },
        
        // 文档资源最小需求
        documents: {
          categories: [
            'AI工具使用手册（5页）',
            '简化故障分析流程（3页）'
          ],
          totalEstimate: '2份简单操作手册',
          approach: '重用现有文档，最小化新增内容'
        },
        
        // 无需新增设备
        equipment: {
          requirement: '无需新增专用设备',
          approach: '完全利用现有服务器和网络设备'
        }
      },
      
      // 现有资源微调
      minimalEnhancements: {
        processNodes: [
          '人工分析节点：增加简单AI建议参考',
          '故障排除节点：增加基础AI辅助功能'
        ],
        personnelTraining: [
          '现有运维人员接受4小时AI工具培训',
          '技术主管学习AI工具管理（8小时）'
        ],
        systemModifications: [
          '现有监控系统增加AI分析插件',
          '工单系统增加AI建议显示'
        ]
      },
      
      // 实施影响分析（最小化）
      implementationImpact: {
        organizationalChange: '无需组织架构调整',
        processComplexity: '流程步骤仅增加25%，学习成本低',
        systemIntegration: '使用API集成，无需复杂开发',
        changeManagement: '变更管理简单，2周内可完成',
        riskMitigation: '基本提升故障识别准确性'
      },
      
      // 预期效益（务实评估）
      expectedBenefits: {
        resilience: '故障处理准确性适度提升',
        continuity: 'AI辅助减少人工误判',
        efficiency: '基础自动化提升处理速度',
        costEffectiveness: '极低的实施成本和维护费用',
        quickImplementation: '快速实施，立即见效'
      }
    },
    
    // 甘特图数据
    ganttData: {
      title: '故障报警流程重构优化项目计划',
      tasks: [
        { id: 1, name: 'AI系统需求分析', start: '2024-03-01', end: '2024-03-03', duration: 3, responsible: 'AI算法工程师', priority: 'critical' },
        { id: 2, name: '数据采集与预处理', start: '2024-03-04', end: '2024-03-06', duration: 3, responsible: '数据分析师', priority: 'high', dependencies: [1] },
        { id: 3, name: 'AI模型开发训练', start: '2024-03-07', end: '2024-03-12', duration: 6, responsible: 'AI算法工程师', priority: 'critical', dependencies: [2] },
        { id: 4, name: '智能派单系统开发', start: '2024-03-10', end: '2024-03-14', duration: 5, responsible: 'IT运维专家', priority: 'high', dependencies: [2] },
        { id: 5, name: '系统集成测试', start: '2024-03-15', end: '2024-03-18', duration: 4, responsible: '智能运维工程师', priority: 'critical', dependencies: [3, 4] },
        { id: 6, name: '人员培训', start: '2024-03-19', end: '2024-03-21', duration: 3, responsible: '培训专员', priority: 'medium', dependencies: [5] },
        { id: 7, name: '系统上线部署', start: '2024-03-22', end: '2024-03-23', duration: 2, responsible: 'IT运维专家', priority: 'critical', dependencies: [6] }
      ],
      milestones: [
        { id: 'm1', name: 'AI模型完成', date: '2024-03-12', type: 'execution' },
        { id: 'm2', name: '系统测试通过', date: '2024-03-18', type: 'planning' },
        { id: 'm3', name: '系统正式上线', date: '2024-03-23', type: 'completion' }
      ]
    },
    
    // 简化版甘特图数据（after2方案）
    ganttData2: {
      title: '故障报警流程简化重构项目计划',
      tasks: [
        { id: 1, name: 'AI工具选型', start: '2024-03-01', end: '2024-03-01', duration: 1, responsible: '技术主管', priority: 'medium' },
        { id: 2, name: 'AI工具部署', start: '2024-03-02', end: '2024-03-03', duration: 2, responsible: 'IT运维人员', priority: 'high', dependencies: [1] },
        { id: 3, name: '系统集成配置', start: '2024-03-04', end: '2024-03-05', duration: 2, responsible: 'IT运维人员', priority: 'high', dependencies: [2] },
        { id: 4, name: '人员培训', start: '2024-03-06', end: '2024-03-06', duration: 0.5, responsible: '技术主管', priority: 'medium', dependencies: [3] },
        { id: 5, name: '系统测试', start: '2024-03-07', end: '2024-03-07', duration: 1, responsible: '运维团队', priority: 'high', dependencies: [4] },
        { id: 6, name: '正式上线', start: '2024-03-08', end: '2024-03-08', duration: 0.5, responsible: 'IT运维人员', priority: 'critical', dependencies: [5] }
      ],
      milestones: [
        { id: 'm1', name: 'AI工具部署完成', date: '2024-03-03', type: 'execution' },
        { id: 'm2', name: '培训完成', date: '2024-03-06', type: 'planning' },
        { id: 'm3', name: '系统正式上线', date: '2024-03-08', type: 'completion' }
      ]
    }
  },
  
  Optimization4: {
    title: '客户整改需求流程重构优化',
    description: '在国家新发台政策影响下，增加政策合规性检查和风险评估环节，确保整改方案符合最新政策要求',
    before: `graph TD\nA((开始)) --> B[需求接收]\nB --> C[需求分析]\nC --> D[可行性评估]\nD --> E{是否可行}\nE -->|否| F[需求反馈]\nF --> G((结束))\nE -->|是| H[制定整改方案]\nH --> I[执行整改]\nI --> G`,
    after: `graph TD\nA((开始)) --> B[需求接收]\nB --> C[政策影响评估]\nC --> D[需求分析] & E[政策合规检查]\nD --> F[可行性评估]\nE --> G[风险评估]\nF --> H{技术可行}\nG --> I{政策合规}\nH -->|否| J[需求反馈]\nI -->|不合规| K[政策调整建议]\nH -->|是| L{政策影响}\nI -->|合规| L\nL -->|重大影响| M[制定政策适应方案]\nL -->|轻微影响| N[制定标准整改方案]\nM --> O[执行政策适应整改]\nN --> P[执行标准整改]\nO --> Q[政策合规验收]\nP --> R[质量验收]\nQ --> S((结束))\nR --> S\nJ --> S\nK --> S`,
    after2: `graph TD\nA((开始)) --> B[需求接收]\nB --> C[基础政策检查]\nC --> D[需求分析]\nD --> E[可行性评估]\nE --> F{是否可行}\nF -->|否| G[需求反馈]\nF -->|是| H[制定整改方案]\nH --> I{政策影响检查}\nI -->|需要调整| J[方案调整]\nJ --> K[执行整改]\nI -->|无需调整| K\nK --> L[简单验收]\nL --> M((结束))\nG --> M`,
    llm: `graph TD\nA((开始)) --> B[需求接收]\nB --> C[政策扫描引擎]\nC --> D[需求合规预检]\nD --> E{基础合规?}\nE -->|否| F[即时驳回]\nE -->|是| G[深度需求分析]\n\nG --> H[可行性评估]\nH --> I{技术可行?}\nI -->|否| J[需求反馈]\nI -->|是| K[政策风险评估]\n\nK --> L{政策风险等级}\nL -->|高风险| M[制定规避方案]\nL -->|中风险| N[增加补偿措施]\nL -->|低风险| O[标准整改方案]\n\nM & N & O --> P[合规审查会签]\nP --> Q{通过审查?}\nQ -->|否| R[方案调整]\nQ -->|是| S[执行整改]\n\nR --> K\nS --> T[政策符合性验证]\nT --> U((结束))\n\nclassDef policy fill:#e8f5e9,stroke:#2e7d32;\nclass C,D,E,K,L,P,T policy;`,
    
    // 资源变化分析
    resourceChanges: {
      // 总体变化概览
      summary: {
        processSteps: { before: 9, after: 19 },      // 流程步骤变化
        newFunctions: 10,                            // 新增功能环节
        resourceTypes: ['人员', '系统', '文档', '设备'], // 涉及资源类型
        implementationPhases: 3                       // 分阶段实施
      },
      
      // 新增资源类型需求
      newResourceTypes: {
        // 人员资源新增需求
        personnel: {
          categories: [
            '政策分析专员（政策解读、影响评估）',
            '合规检查专员（合规性审查、风险识别）',
            '法规事务专员（法规跟踪、合规指导）',
            '风险管理专员（风险评估、缓解措施制定）'
          ],
          departments: ['法务部', '合规部', '风险管理部'],
          totalEstimate: '6-8名新增人员'
        },
        
        // 系统资源新增需求  
        systems: {
          categories: [
            '政策跟踪系统（政策更新、影响分析）',
            '合规检查系统（自动合规检查、风险提醒）',
            '风险评估系统（风险识别、评估建模）',
            '政策适应系统（方案调整、合规验证）'
          ],
          implementation: '4个新系统需要开发或采购',
          integration: '需要与现有业务系统和外部政策数据库集成'
        },
        
        // 文档资源新增需求
        documents: {
          categories: [
            '政策管理类（政策库、解读手册、影响评估模板）',
            '合规检查类（检查清单、评估标准、合规指南）',
            '风险管理类（风险识别手册、评估方法、应对预案）',
            '整改方案类（标准模板、适应性方案、验收标准）'
          ],
          totalEstimate: '12-16份新增文档和标准'
        },
        
        // 设备资源新增需求
        equipment: {
          categories: [
            '政策监控设备（数据采集、信息处理设备）',
            '合规检测设备（自动化检测工具、分析仪器）'
          ],
          purpose: '支持政策跟踪和合规性自动化检查需求'
        }
      },
      
      // 原有资源增强需求
      existingResourceEnhancements: {
        processNodes: [
          '需求分析节点：增加政策影响预评估功能',
          '方案制定节点：增加政策适应性设计要求'
        ],
        personnelTraining: [
          '现有技术人员需要接受政策合规培训',
          '现有项目管理人员需要学习风险评估方法',
          '现有质量管理人员需要掌握政策合规验收标准'
        ],
        systemUpgrades: [
          '现有业务系统需要增加政策合规检查模块',
          '现有项目管理系统需要集成风险评估功能',
          '现有质量系统需要适配政策合规验收流程'
        ]
      },
      
      // 实施影响分析
      implementationImpact: {
        organizationalChange: '需要建立政策合规管理体系',
        processComplexity: '流程步骤增加111%，涉及多层次政策检查',
        systemIntegration: '新增系统需要与政策数据库和监管平台对接',
        changeManagement: '需要适应政策变化的敏捷响应机制',
        riskMitigation: '显著降低政策合规风险和法律责任'
      },
      
      // 预期效益（定性分析）
      expectedBenefits: {
        resilience: '政策适应能力和合规性显著增强',
        continuity: '政策变化不再导致业务中断',
        efficiency: '自动化合规检查提升效率',
        standardization: '建立标准化的政策合规管理体系',
        sustainability: '构建可持续的政策风险防控机制'
      }
    },
    
    // 简化版资源变化分析（after2方案）
    resourceChanges2: {
      // 总体变化概览
      summary: {
        processSteps: { before: 9, after: 12 },      // 流程步骤变化（最小化）
        newFunctions: 3,                             // 新增功能环节（大幅减少）
        resourceTypes: ['人员', '文档'],              // 涉及资源类型（简化）
        implementationPhases: 1                       // 单阶段实施
      },
      
      // 最小化资源需求
      minimalResourceChanges: {
        // 人员资源最小需求
        personnel: {
          categories: [
            '现有质量管理人员兼任政策检查（无新增人员）',
            '部门主管负责政策影响评估（利用现有岗位）'
          ],
          approach: '利用现有人员，无需专业政策团队',
          totalEstimate: '0名新增人员，2-3名现有员工承担额外职责'
        },
        
        // 系统资源最小需求  
        systems: {
          approach: '利用现有系统，无需新系统开发',
          modifications: [
            '在现有业务系统中增加政策检查字段',
            '项目管理系统增加政策影响标记功能'
          ],
          implementation: '仅需现有系统小幅配置修改'
        },
        
        // 文档资源最小需求
        documents: {
          categories: [
            '简化政策检查清单（2页）',
            '基础政策影响评估表（1页）',
            '方案调整指导（2页）'
          ],
          totalEstimate: '3份简单操作文档',
          approach: '重用现有模板，最小化新增内容'
        },
        
        // 无需新增设备
        equipment: {
          requirement: '无需新增设备',
          approach: '完全利用现有办公设备和系统'
        }
      },
      
      // 现有资源微调
      minimalEnhancements: {
        processNodes: [
          '需求分析节点：增加简单政策影响检查',
          '方案制定节点：增加政策符合性确认'
        ],
        personnelTraining: [
          '现有技术人员接受2小时政策基础培训',
          '质量管理人员学习政策检查方法（4小时）'
        ],
        systemModifications: [
          '业务系统增加政策检查字段',
          '项目系统增加政策标记功能'
        ]
      },
      
      // 实施影响分析（最小化）
      implementationImpact: {
        organizationalChange: '无需组织架构调整',
        processComplexity: '流程步骤仅增加33%，学习成本低',
        systemIntegration: '无需系统集成，仅需配置调整',
        changeManagement: '变更管理简单，1周内可完成',
        riskMitigation: '基本满足政策合规要求'
      },
      
      // 预期效益（务实评估）
      expectedBenefits: {
        resilience: '政策合规性基本保障',
        continuity: '避免明显的政策违规风险',
        efficiency: '最小化对现有流程的影响',
        costEffectiveness: '极低的实施成本',
        quickImplementation: '快速实施，立即见效'
      }
    },
    
    // 甘特图数据
    ganttData: {
      title: '客户整改需求流程重构优化项目计划',
      tasks: [
        { id: 1, name: '需求接收分析', start: '2024-04-01', end: '2024-04-01', duration: 1, responsible: '客服专员', priority: 'medium' },
        { id: 2, name: '政策影响评估', start: '2024-04-02', end: '2024-04-03', duration: 2, responsible: '政策分析专员', priority: 'critical', dependencies: [1] },
        { id: 3, name: '政策合规检查', start: '2024-04-04', end: '2024-04-05', duration: 2, responsible: '合规检查专员', priority: 'critical', dependencies: [2] },
        { id: 4, name: '风险评估', start: '2024-04-06', end: '2024-04-07', duration: 2, responsible: '风险管理专员', priority: 'high', dependencies: [3] },
        { id: 5, name: '政策适应方案制定', start: '2024-04-08', end: '2024-04-11', duration: 4, responsible: '技术专家', priority: 'critical', dependencies: [4] },
        { id: 6, name: '执行政策适应整改', start: '2024-04-12', end: '2024-04-16', duration: 5, responsible: '实施团队', priority: 'high', dependencies: [5] },
        { id: 7, name: '政策合规验收', start: '2024-04-17', end: '2024-04-18', duration: 2, responsible: '合规检查专员', priority: 'critical', dependencies: [6] }
      ],
      milestones: [
        { id: 'm1', name: '政策评估完成', date: '2024-04-05', type: 'planning' },
        { id: 'm2', name: '方案确定', date: '2024-04-11', type: 'execution' },
        { id: 'm3', name: '合规验收通过', date: '2024-04-18', type: 'completion' }
      ]
    },

    // 简化版甘特图数据（after2方案）
    ganttData2: {
      title: '客户整改需求流程简化重构项目计划',
      tasks: [
        { id: 1, name: '需求接收分析', start: '2024-04-01', end: '2024-04-01', duration: 1, responsible: '客服专员', priority: 'medium' },
        { id: 2, name: '基础政策检查', start: '2024-04-02', end: '2024-04-02', duration: 0.5, responsible: '质量管理员', priority: 'medium', dependencies: [1] },
        { id: 3, name: '可行性评估', start: '2024-04-03', end: '2024-04-03', duration: 1, responsible: '技术主管', priority: 'high', dependencies: [2] },
        { id: 4, name: '制定整改方案', start: '2024-04-04', end: '2024-04-05', duration: 2, responsible: '技术专家', priority: 'high', dependencies: [3] },
        { id: 5, name: '政策影响检查', start: '2024-04-06', end: '2024-04-06', duration: 0.5, responsible: '部门主管', priority: 'medium', dependencies: [4] },
        { id: 6, name: '执行整改', start: '2024-04-07', end: '2024-04-09', duration: 3, responsible: '实施团队', priority: 'high', dependencies: [5] },
        { id: 7, name: '简单验收', start: '2024-04-10', end: '2024-04-10', duration: 1, responsible: '质量管理员', priority: 'medium', dependencies: [6] }
      ],
      milestones: [
        { id: 'm1', name: '方案确定', date: '2024-04-05', type: 'planning' },
        { id: 'm2', name: '执行完成', date: '2024-04-09', type: 'execution' },
        { id: 'm3', name: '验收通过', date: '2024-04-10', type: 'completion' }
      ]
    }
  },
};

export default processOptimizationFlowData;