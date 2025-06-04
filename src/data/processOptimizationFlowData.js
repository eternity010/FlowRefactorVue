// 这个文件将用于存储Mermaid流程图的数据

// 流程优化数据
const processOptimizationFlowData = {
  Optimization1: {
    title: '采购流程重构优化',
    description: '原流程缺乏人员风险管控，重构后增加人员调动、紧急招聘、培训等环节，提高流程稳定性和连续性。',
    before: `graph TD\nA((开始)) --> B[接收部门需求]\nB --> C[需求分析整理]\nC --> D[预算审核]\nD -->|不通过| E[预算调整]\nE --> C\nD -->|通过| F[生成采购申请]\nF --> G((结束))`,
    after: `graph TD\nA((开始)) --> B[接收部门需求]\nB --> H[人员状态检查]\nH --> I{审核人员是否充足}\nI -->|人员不足| J[启动应急预案]\nJ --> K[人员调动] & L[紧急招聘]\nK --> M[快速培训]\nL --> N[新员工培训]\nM --> S[人员到位确认]\nN --> S\nS --> C[需求分析整理]\nI -->|人员充足| C\nC --> O[预算审核]\nO -->|不通过| P[预算调整]\nP --> C\nO -->|通过| Q[生成采购申请]\nQ --> R((结束))`,
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
    }
  },
  
  Optimization2: {
    title: '供应商选择流程重构优化',
    description: '应对美国关税战的供应链多元化策略优化方案',
    before: `graph TD\n  A((开始)) --> B[供应商调研]\n  B --> C[初步筛选]\n  C --> D[供应商评估]\n  D --> E{合格评审}\n  E -->|通过| F[供应商入库]\n  E -->|不通过| G[供应商淘汰]\n  F --> H((结束))\n  G --> H`,
    after: `graph TD\n  A((开始)) --> B[关税风险评估]\n  B --> C{是否涉及美国供应商}\n  C -->|是| D[启动应急方案]\n  C -->|否| E[常规流程]\n  D --> F[多国供应商并行评估]\n  F --> G[东南亚供应商] & H[欧洲供应商] & I[本土供应商]\n  G --> J[综合评分]\n  H --> J\n  I --> J\n  J --> K{最优方案}\n  K -->|关税豁免| L[申请贸易救济]\n  K -->|替代方案| M[签订长期协议]\n  L --> N[海关备案]\n  M --> N\n  N --> O[建立安全库存]\n  O --> P((结束))`,
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
    }
  },
  
  Optimization3: {
    title: '故障报警流程重构优化',
    description: '针对单一人工分析可靠性不足的问题，通过AI智能分析实现双重验证机制',
    before: `graph TD\nA((开始)) --> B[报警接收]\nB --> C[人工分析]\nC --> D{紧急程度}\nD -->|紧急| E[紧急处理]\nD -->|一般| F[常规处理]\nE --> G[故障排除]\nF --> G\nG --> H[报警记录]\nH --> I((结束))`,
    after: `graph TD\nA((开始)) --> B[报警接收]\nB --> C[人工分析] & D[AI智能分析]\nC --> E{紧急程度}\nD --> E\nE -->|紧急| F[自动启动应急] & G[通知专家]\nE -->|一般| H[智能派单]\nF --> I[快速故障排除]\nG --> I\nH --> I\nI --> J[自动记录] & K[经验学习]\nJ --> L((结束))\nK --> L`,
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
    }
  },
  
  Optimization4: {
    title: '客户整改需求流程重构优化',
    description: '在国家新发台政策影响下，增加政策合规性检查和风险评估环节，确保整改方案符合最新政策要求',
    before: `graph TD\nA((开始)) --> B[需求接收]\nB --> C[需求分析]\nC --> D[可行性评估]\nD --> E{是否可行}\nE -->|否| F[需求反馈]\nF --> G((结束))\nE -->|是| H[制定整改方案]\nH --> I[执行整改]\nI --> G`,
    after: `graph TD\nA((开始)) --> B[需求接收]\nB --> C[政策影响评估]\nC --> D[需求分析] & E[政策合规检查]\nD --> F[可行性评估]\nE --> G[风险评估]\nF --> H{技术可行}\nG --> I{政策合规}\nH -->|否| J[需求反馈]\nI -->|不合规| K[政策调整建议]\nH -->|是| L{政策影响}\nI -->|合规| L\nL -->|重大影响| M[制定政策适应方案]\nL -->|轻微影响| N[制定标准整改方案]\nM --> O[执行政策适应整改]\nN --> P[执行标准整改]\nO --> Q[政策合规验收]\nP --> R[质量验收]\nQ --> S((结束))\nR --> S\nJ --> S\nK --> S`
  },
};

export default processOptimizationFlowData;