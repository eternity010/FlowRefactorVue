const { MongoClient } = require('mongodb');

// MongoDB连接配置
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = 'maintenance_system';
const NEURAL_NETWORK_COLLECTION = 'neural_network_parameters';
const PARAMETER_CONFIGS_COLLECTION = 'neural_network_saved_configs';
const RAG_CONFIG_COLLECTION = 'rag_config_data';

/**
 * 神经网络参数服务类
 */
class NeuralNetworkService {
  constructor() {
    this.client = null;
    this.db = null;
    this.parametersCollection = null;
    this.configsCollection = null;
    this.ragConfigCollection = null;
    this.isConnected = false;
    
    // 默认参数配置
    this.defaultParameters = {
      geoPoliticalWeight: 1.0,
      marketVolatilityFactor: 0.8,
      backupSupplierRatio: 0.3,
      routeReevalFrequency: 7,
      minimumInventoryRatio: 0.15,
      costDelayTradeoff: 1.2,
      taktTimeVariance: 0.05,
      overtimeCostCap: 200
    };

    // 参数定义
    this.parameterDefinitions = {
      categories: {
        risk_assessment: {
          name: "风险评估参数",
          description: "控制风险评估相关的参数配置",
          parameters: {
            geo_political_weight: {
              name: "地缘政治事件影响系数",
              key: "geoPoliticalWeight",
              default_value: 1.0,
              min_value: 0.1,
              max_value: 2.0,
              step: 0.1,
              precision: 1,
              unit: "系数",
              description: "控制地缘政治事件对流程风险评估的影响程度",
              help_text: "控制地缘政治事件对流程风险评估的影响程度，取值范围0.1-2.0",
              levels: {
                "0.1-0.5": { type: "success", label: "低影响", description: "地缘政治事件对风险评估影响较小，适用于稳定环境" },
                "0.6-1.2": { type: "primary", label: "正常", description: "标准影响程度，平衡考虑地缘政治因素" },
                "1.3-1.6": { type: "warning", label: "高影响", description: "地缘政治事件影响较大，适用于动荡环境" },
                "1.7-2.0": { type: "danger", label: "极高影响", description: "地缘政治事件影响极大，适用于高风险环境" }
              }
            },
            market_volatility_factor: {
              name: "原材料价格波动敏感度",
              key: "marketVolatilityFactor",
              default_value: 0.8,
              min_value: 0.1,
              max_value: 2.0,
              step: 0.1,
              precision: 1,
              unit: "系数",
              description: "控制原材料价格变化对供应链决策的影响敏感度",
              help_text: "控制原材料价格变化对供应链决策的影响敏感度，取值范围0.1-2.0",
              levels: {
                "0.1-0.4": { type: "success", label: "低敏感", description: "对原材料价格变化反应较弱，适用于价格稳定市场" },
                "0.5-1.0": { type: "primary", label: "正常", description: "标准敏感度，平衡响应市场价格变化" },
                "1.1-1.5": { type: "warning", label: "高敏感", description: "对价格变化高度敏感，快速调整供应策略" },
                "1.6-2.0": { type: "danger", label: "极敏感", description: "极度敏感，适用于高波动市场环境" }
              }
            }
          }
        },
        supply_chain_management: {
          name: "供应链管理参数",
          description: "控制供应链管理相关的参数配置",
          parameters: {
            backup_supplier_ratio: {
              name: "备用供应商最低覆盖比例",
              key: "backupSupplierRatio",
              default_value: 0.3,
              min_value: 0.1,
              max_value: 0.8,
              step: 0.05,
              precision: 2,
              unit: "比例",
              display_unit: "%",
              description: "每个关键物料至少需要的备用供应商覆盖比例",
              help_text: "每个关键物料至少需要的备用供应商覆盖比例，取值范围10%-80%",
              levels: {
                "0.1-0.2": { type: "danger", label: "低保障", description: "备用供应商覆盖不足，供应风险较高" },
                "0.21-0.4": { type: "warning", label: "中等", description: "中等程度的供应保障，适用于稳定供应环境" },
                "0.41-0.6": { type: "primary", label: "良好", description: "良好的供应保障水平，平衡成本与风险" },
                "0.61-0.8": { type: "success", label: "高保障", description: "高水平供应保障，适用于高风险环境" }
              }
            },
            route_reeval_frequency: {
              name: "运输路径重评估频率",
              key: "routeReevalFrequency",
              default_value: 7,
              min_value: 1,
              max_value: 30,
              step: 1,
              precision: 0,
              unit: "天",
              description: "重新评估和优化运输路径的时间间隔",
              help_text: "重新评估和优化运输路径的时间间隔，取值范围1-30天",
              levels: {
                "1-3": { type: "danger", label: "高频", description: "高频重评估，适用于动态变化的运输环境" },
                "4-7": { type: "warning", label: "常规", description: "常规重评估频率，平衡优化效果与计算成本" },
                "8-15": { type: "primary", label: "适中", description: "适中的重评估频率，适用于相对稳定环境" },
                "16-30": { type: "success", label: "低频", description: "低频重评估，适用于稳定的运输网络" }
              }
            },
            minimum_inventory_ratio: {
              name: "最低库存比例",
              key: "minimumInventoryRatio",
              default_value: 0.15,
              min_value: 0.05,
              max_value: 0.5,
              step: 0.01,
              precision: 2,
              unit: "比例",
              display_unit: "%",
              description: "关键物料必须维持的最低库存水平",
              help_text: "关键物料必须维持的最低库存水平，取值范围5%-50%",
              levels: {
                "0.05-0.1": { type: "danger", label: "极低", description: "极低库存水平，高风险但低成本，适用于可靠供应链" },
                "0.11-0.2": { type: "warning", label: "较低", description: "较低库存水平，平衡风险与成本，需要较好的需求预测" },
                "0.21-0.3": { type: "primary", label: "标准", description: "标准库存水平，提供合理的安全边际，适用于一般业务" },
                "0.31-0.5": { type: "success", label: "充足", description: "充足库存水平，高安全性但高持有成本，适用于关键业务" }
              }
            }
          }
        },
        operation_optimization: {
          name: "运营优化参数",
          description: "控制运营优化相关的参数配置",
          parameters: {
            cost_delay_tradeoff: {
              name: "成本与延误权衡系数",
              key: "costDelayTradeoff",
              default_value: 1.2,
              min_value: 0.5,
              max_value: 3.0,
              step: 0.1,
              precision: 1,
              unit: "系数",
              description: "在成本优化和交期保证之间的权衡系数",
              help_text: "在成本优化和交期保证之间的权衡系数，取值范围0.5-3.0",
              levels: {
                "0.5-0.8": { type: "success", label: "成本优先", description: "优先考虑成本控制，容忍适度延误" },
                "0.9-1.5": { type: "primary", label: "平衡", description: "平衡成本与交期，综合优化决策" },
                "1.6-2.2": { type: "warning", label: "交期优先", description: "优先保证交期，愿意承担额外成本" },
                "2.3-3.0": { type: "danger", label: "极速交付", description: "极速交付模式，成本为次要考虑" }
              }
            },
            takt_time_variance: {
              name: "生产节拍波动容忍范围",
              key: "taktTimeVariance",
              default_value: 0.05,
              min_value: 0.01,
              max_value: 0.2,
              step: 0.01,
              precision: 2,
              unit: "比例",
              display_unit: "%",
              description: "允许的生产节拍波动范围，超出此范围将触发流程重组",
              help_text: "允许的生产节拍波动范围，超出此范围将触发流程重组，取值范围1%-20%",
              levels: {
                "0.01-0.03": { type: "danger", label: "严格", description: "严格控制生产节拍，频繁触发流程调整" },
                "0.04-0.08": { type: "warning", label: "标准", description: "标准节拍控制，平衡稳定性与灵活性" },
                "0.09-0.15": { type: "primary", label: "宽松", description: "宽松的节拍控制，减少频繁调整" },
                "0.16-0.2": { type: "success", label: "灵活", description: "灵活的节拍管理，适应生产波动" }
              }
            },
            overtime_cost_cap: {
              name: "紧急人力成本上限",
              key: "overtimeCostCap",
              default_value: 200,
              min_value: 50,
              max_value: 500,
              step: 10,
              precision: 0,
              unit: "小时/月",
              description: "每月最多调用的加班工时上限",
              help_text: "每月最多调用的加班工时上限，取值范围50-500小时/月",
              levels: {
                "50-100": { type: "success", label: "节约", description: "严格控制加班成本，优先通过流程优化解决问题" },
                "101-200": { type: "primary", label: "标准", description: "标准加班预算，平衡成本与应急能力" },
                "201-350": { type: "warning", label: "充足", description: "充足的应急人力预算，快速响应突发需求" },
                "351-500": { type: "danger", label: "充裕", description: "充裕的人力成本预算，优先保证生产连续性" }
              }
            }
          }
        }
      },
      metadata: {
        total_parameters: 8,
        total_categories: 3,
        storage_key: "neuralNetworkParams",
        version: "1.0"
      }
    };
  }

  /**
   * 连接到MongoDB
   */
  async connect() {
    try {
      if (this.isConnected) {
        return;
      }

      console.log('🔗 正在连接MongoDB (神经网络参数服务)...');
      this.client = new MongoClient(MONGODB_URI);
      await this.client.connect();
      
      this.db = this.client.db(DATABASE_NAME);
      this.parametersCollection = this.db.collection(NEURAL_NETWORK_COLLECTION);
      this.configsCollection = this.db.collection(PARAMETER_CONFIGS_COLLECTION);
      this.ragConfigCollection = this.db.collection(RAG_CONFIG_COLLECTION);
      this.isConnected = true;
      
      console.log(`✅ 神经网络参数服务MongoDB连接成功: ${DATABASE_NAME}`);
      
      // 初始化默认参数（如果不存在）
      await this.initializeDefaultParameters();
    } catch (error) {
      console.error('❌ 神经网络参数服务MongoDB连接失败:', error);
      throw error;
    }
  }

  /**
   * 断开MongoDB连接
   */
  async disconnect() {
    try {
      if (this.client && this.isConnected) {
        await this.client.close();
        this.isConnected = false;
        console.log('🔌 神经网络参数服务MongoDB连接已关闭');
      }
    } catch (error) {
      console.error('❌ 关闭神经网络参数服务MongoDB连接失败:', error);
    }
  }

  /**
   * 确保连接
   */
  async ensureConnection() {
    if (!this.isConnected) {
      await this.connect();
    }
  }

  /**
   * 初始化默认参数和当前参数
   */
  async initializeDefaultParameters() {
    try {
      // 初始化默认参数配置文档
      const existingDefaultDocument = await this.parametersCollection.findOne({
        _id: 'default_neural_network_settings'
      });

      if (!existingDefaultDocument) {
        const defaultDocument = {
          _id: 'default_neural_network_settings',
          name: '神经网络默认参数配置',
          description: '流程重构优化的神经网络参数默认设置',
          version: '1.0',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true,
          categories: this.parameterDefinitions.categories,
          current_values: this.defaultParameters,
          metadata: this.parameterDefinitions.metadata
        };

        await this.parametersCollection.insertOne(defaultDocument);
        console.log('✅ 已初始化默认神经网络参数配置');
      }

      // 初始化当前参数配置文档
      const existingCurrentDocument = await this.parametersCollection.findOne({
        _id: 'current_neural_network_settings'
      });

      if (!existingCurrentDocument) {
        const currentDocument = {
          _id: 'current_neural_network_settings',
          name: '神经网络当前参数配置',
          description: '用户当前设置的神经网络参数',
          version: '1.0',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true,
          current_values: this.defaultParameters, // 初始值使用默认参数
          source: 'default'
        };

        await this.parametersCollection.insertOne(currentDocument);
        console.log('✅ 已初始化当前神经网络参数配置');
      }
    } catch (error) {
      console.error('❌ 初始化参数配置失败:', error);
    }
  }

  /**
   * 获取所有参数配置
   */
  async getNeuralNetworkParameters() {
    try {
      await this.ensureConnection();
      
      const currentDocument = await this.parametersCollection.findOne({
        _id: 'current_neural_network_settings'
      });

      if (!currentDocument) {
        throw new Error('未找到当前神经网络参数配置');
      }

      return {
        ...this.parameterDefinitions,
        current_values: currentDocument.current_values || this.defaultParameters,
        last_updated: currentDocument.updated_at
      };
    } catch (error) {
      console.error('获取神经网络参数失败:', error);
      throw error;
    }
  }

  /**
   * 获取当前参数值
   */
  async getCurrentNeuralNetworkParameters() {
    try {
      await this.ensureConnection();
      
      const document = await this.parametersCollection.findOne(
        { _id: 'current_neural_network_settings' },
        { projection: { current_values: 1, updated_at: 1 } }
      );

      return document ? { 
        ...document.current_values,
        last_updated: document.updated_at
      } : this.defaultParameters;
    } catch (error) {
      console.error('获取当前参数值失败:', error);
      throw error;
    }
  }

  /**
   * 获取默认参数配置
   */
  async getDefaultNeuralNetworkParameters() {
    try {
      await this.ensureConnection();
      
      const document = await this.parametersCollection.findOne(
        { _id: 'default_neural_network_settings' },
        { projection: { current_values: 1, updated_at: 1, categories: 1 } }
      );

      if (!document) {
        throw new Error('未找到默认神经网络参数配置');
      }

      return {
        ...document.current_values,
        last_updated: document.updated_at,
        categories: document.categories
      };
    } catch (error) {
      console.error('获取默认参数配置失败:', error);
      throw error;
    }
  }

  /**
   * 获取参数定义信息
   */
  async getNeuralNetworkParameterDefinitions() {
    return this.parameterDefinitions;
  }

  /**
   * 获取特定类别的参数
   */
  async getNeuralNetworkParametersByCategory(category) {
    try {
      if (!this.parameterDefinitions.categories[category]) {
        return null;
      }

      await this.ensureConnection();
      
      const document = await this.parametersCollection.findOne({
        _id: 'current_neural_network_settings'
      });

      const categoryData = this.parameterDefinitions.categories[category];
      
      // 获取该类别下的当前参数值
      const currentValues = {};
      if (document && document.current_values) {
        Object.keys(categoryData.parameters).forEach(paramKey => {
          const param = categoryData.parameters[paramKey];
          currentValues[param.key] = document.current_values[param.key] || param.default_value;
        });
      }
      
      return {
        ...categoryData,
        current_values: currentValues
      };
    } catch (error) {
      console.error(`获取类别 ${category} 参数失败:`, error);
      throw error;
    }
  }

  /**
   * 更新参数配置
   */
  async updateNeuralNetworkParameters(parameters) {
    try {
      await this.ensureConnection();
      
      // 验证参数
      const validationResult = this.validateParameters(parameters);
      if (!validationResult.valid) {
        throw new Error(`参数验证失败: ${validationResult.errors.join(', ')}`);
      }

      // 获取当前用户参数
      const currentDocument = await this.parametersCollection.findOne({
        _id: 'current_neural_network_settings'
      });

      const currentValues = currentDocument ? currentDocument.current_values : this.defaultParameters;
      const updatedValues = { ...currentValues, ...parameters };

      // 更新用户当前参数配置
      const result = await this.parametersCollection.updateOne(
        { _id: 'current_neural_network_settings' },
        { 
          $set: { 
            current_values: updatedValues,
            updated_at: new Date().toISOString(),
            source: 'user_modified'
          }
        }
      );

      return {
        updated_parameters: parameters,
        all_parameters: updatedValues,
        updated_at: new Date().toISOString(),
        modified_count: result.modifiedCount
      };
    } catch (error) {
      console.error('更新神经网络参数失败:', error);
      throw error;
    }
  }

  /**
   * 重置参数为默认值
   */
  async resetNeuralNetworkParameters(parameterKeys = null) {
    try {
      await this.ensureConnection();
      
      // 获取默认参数配置
      const defaultDocument = await this.parametersCollection.findOne({
        _id: 'default_neural_network_settings'
      });
      
      const defaultValues = defaultDocument ? defaultDocument.current_values : this.defaultParameters;
      let resetParams;
      
      if (parameterKeys && Array.isArray(parameterKeys)) {
        // 重置指定参数到默认值
        resetParams = {};
        parameterKeys.forEach(key => {
          if (defaultValues.hasOwnProperty(key)) {
            resetParams[key] = defaultValues[key];
          }
        });
        
        // 获取当前用户参数
        const currentDocument = await this.parametersCollection.findOne({
          _id: 'current_neural_network_settings'
        });
        
        const currentValues = currentDocument ? currentDocument.current_values : this.defaultParameters;
        const updatedValues = { ...currentValues, ...resetParams };
        
        await this.parametersCollection.updateOne(
          { _id: 'current_neural_network_settings' },
          { 
            $set: { 
              current_values: updatedValues,
              updated_at: new Date().toISOString(),
              source: 'reset_partial'
            }
          }
        );
      } else {
        // 重置所有参数到默认值
        resetParams = defaultValues;
        
        await this.parametersCollection.updateOne(
          { _id: 'current_neural_network_settings' },
          { 
            $set: { 
              current_values: resetParams,
              updated_at: new Date().toISOString(),
              source: 'reset_all'
            }
          }
        );
      }

      return {
        reset_parameters: resetParams,
        all_parameters: resetParams,
        reset_count: Object.keys(resetParams).length,
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('重置神经网络参数失败:', error);
      throw error;
    }
  }

  /**
   * 保存参数配置
   */
  async saveNeuralNetworkParameterConfig(parameters, configName, timestamp) {
    try {
      await this.ensureConnection();
      
      const configDocument = {
        _id: `config_${configName}_${Date.now()}`,
        config_name: configName,
        parameters: parameters,
        created_at: timestamp || new Date().toISOString(),
        version: '1.0',
        parameter_count: Object.keys(parameters).length
      };

      await this.configsCollection.insertOne(configDocument);

      return {
        config_name: configName,
        saved_at: configDocument.created_at,
        parameter_count: configDocument.parameter_count,
        config_id: configDocument._id
      };
    } catch (error) {
      console.error('保存参数配置失败:', error);
      throw error;
    }
  }

  /**
   * 获取保存的参数配置列表
   */
  async getSavedNeuralNetworkConfigs() {
    try {
      await this.ensureConnection();
      
      const configs = await this.configsCollection.find({})
        .sort({ created_at: -1 })
        .toArray();

      return configs.map(config => ({
        id: config._id,
        name: config.config_name,
        created_at: config.created_at,
        version: config.version,
        parameter_count: config.parameter_count
      }));
    } catch (error) {
      console.error('获取保存的配置列表失败:', error);
      throw error;
    }
  }

  /**
   * 加载保存的参数配置
   */
  async loadNeuralNetworkParameterConfig(configName) {
    try {
      await this.ensureConnection();
      
      const config = await this.configsCollection.findOne({
        config_name: configName
      }, { sort: { created_at: -1 } });

      return config;
    } catch (error) {
      console.error(`加载配置 ${configName} 失败:`, error);
      throw error;
    }
  }

  /**
   * 删除保存的参数配置
   */
  async deleteNeuralNetworkParameterConfig(configName) {
    try {
      await this.ensureConnection();
      
      const result = await this.configsCollection.deleteMany({
        config_name: configName
      });

      return {
        config_name: configName,
        deleted_count: result.deletedCount,
        deleted_at: new Date().toISOString()
      };
    } catch (error) {
      console.error(`删除配置 ${configName} 失败:`, error);
      throw error;
    }
  }

  /**
   * 获取参数使用统计
   */
  async getNeuralNetworkParameterStats() {
    try {
      await this.ensureConnection();
      
      // 获取当前用户设置
      const currentDocument = await this.parametersCollection.findOne({
        _id: 'current_neural_network_settings'
      });

      // 获取默认设置
      const defaultDocument = await this.parametersCollection.findOne({
        _id: 'default_neural_network_settings'
      });

      const currentValues = currentDocument ? currentDocument.current_values : this.defaultParameters;
      const defaultValues = defaultDocument ? defaultDocument.current_values : this.defaultParameters;
      
      // 计算修改的参数数量（与默认值比较）
      const modifiedParameters = Object.keys(currentValues).filter(key => 
        currentValues[key] !== defaultValues[key]
      ).length;

      // 获取保存的配置数量
      const savedConfigsCount = await this.configsCollection.countDocuments({});

      return {
        total_parameters: Object.keys(this.defaultParameters).length,
        modified_parameters: modifiedParameters,
        last_modified: currentDocument ? currentDocument.updated_at : null,
        parameter_categories: Object.keys(this.parameterDefinitions.categories).length,
        current_values: currentValues,
        default_values: defaultValues,
        saved_configs: savedConfigsCount,
        version: this.parameterDefinitions.metadata.version,
        source: currentDocument ? currentDocument.source : 'default'
      };
    } catch (error) {
      console.error('获取参数统计失败:', error);
      throw error;
    }
  }

  /**
   * 验证参数值
   */
  validateParameters(parameters) {
    const errors = [];
    
    // 获取所有参数定义
    const allParams = {};
    Object.values(this.parameterDefinitions.categories).forEach(category => {
      Object.values(category.parameters).forEach(param => {
        allParams[param.key] = param;
      });
    });
    
    // 验证每个参数
    Object.keys(parameters).forEach(key => {
      const value = parameters[key];
      const definition = allParams[key];
      
      if (!definition) {
        errors.push(`未知参数: ${key}`);
        return;
      }
      
      // 检查类型
      if (typeof value !== 'number') {
        errors.push(`参数 ${key} 必须是数字类型`);
        return;
      }
      
      // 检查范围
      if (value < definition.min_value || value > definition.max_value) {
        errors.push(`参数 ${key} 值 ${value} 超出范围 [${definition.min_value}, ${definition.max_value}]`);
      }
      
      // 检查步长
      const steps = Math.round((value - definition.min_value) / definition.step);
      const expectedValue = definition.min_value + steps * definition.step;
      if (Math.abs(value - expectedValue) > 0.001) {
        errors.push(`参数 ${key} 值 ${value} 不符合步长要求 ${definition.step}`);
      }
    });
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 验证参数值（异步版本）
   */
  async validateNeuralNetworkParameters(parameters) {
    return this.validateParameters(parameters);
  }



  /**
   * 导出参数配置
   */
  async exportNeuralNetworkParameters(format = 'json') {
    try {
      await this.ensureConnection();
      
      const document = await this.parametersCollection.findOne({
        _id: 'default_neural_network_settings'
      });

      const exportData = {
        export_info: {
          timestamp: new Date().toISOString(),
          format: format,
          version: this.parameterDefinitions.metadata.version
        },
        parameter_definitions: this.parameterDefinitions,
        current_values: document ? document.current_values : this.defaultParameters,
        metadata: {
          last_updated: document ? document.updated_at : null,
          total_parameters: Object.keys(this.defaultParameters).length
        }
      };

      return exportData;
    } catch (error) {
      console.error('导出参数配置失败:', error);
      throw error;
    }
  }

  /**
   * 导入参数配置
   */
  async importNeuralNetworkParameters(configData, overwrite = false) {
    try {
      await this.ensureConnection();
      
      // 验证导入数据格式
      if (!configData.current_values) {
        throw new Error('导入数据格式错误：缺少 current_values');
      }

      // 验证参数
      const validationResult = this.validateParameters(configData.current_values);
      if (!validationResult.valid) {
        throw new Error(`导入参数验证失败: ${validationResult.errors.join(', ')}`);
      }

      let updateResult;
      
      if (overwrite) {
        // 完全覆盖
        updateResult = await this.parametersCollection.updateOne(
          { _id: 'default_neural_network_settings' },
          { 
            $set: { 
              current_values: configData.current_values,
              updated_at: new Date().toISOString()
            }
          }
        );
      } else {
        // 合并更新
        const currentDocument = await this.parametersCollection.findOne({
          _id: 'default_neural_network_settings'
        });
        
        const currentValues = currentDocument ? currentDocument.current_values : this.defaultParameters;
        const mergedValues = { ...currentValues, ...configData.current_values };
        
        updateResult = await this.parametersCollection.updateOne(
          { _id: 'default_neural_network_settings' },
          { 
            $set: { 
              current_values: mergedValues,
              updated_at: new Date().toISOString()
            }
          }
        );
      }

      return {
        imported_parameters: configData.current_values,
        import_mode: overwrite ? 'overwrite' : 'merge',
        imported_count: Object.keys(configData.current_values).length,
        updated_at: new Date().toISOString(),
        modified_count: updateResult.modifiedCount
      };
    } catch (error) {
      console.error('导入参数配置失败:', error);
      throw error;
    }
  }

  // ==================== RAG配置相关方法 ====================

  /**
   * 获取RAG配置数据
   */
  async getRAGConfigData() {
    try {
      await this.ensureConnection();
      
      const document = await this.ragConfigCollection.findOne({
        _id: 'default_rag_config'
      });

      if (!document) {
        throw new Error('未找到RAG配置数据');
      }

      return document;
    } catch (error) {
      console.error('获取RAG配置数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取RAG启用状态
   */
  async getRAGEnabledStatus() {
    try {
      await this.ensureConnection();
      
      const document = await this.ragConfigCollection.findOne(
        { _id: 'default_rag_config' },
        { projection: { rag_systems: 1, updated_at: 1 } }
      );

      if (!document) {
        throw new Error('未找到RAG配置数据');
      }

      // 构建启用状态对象
      const enabledStatus = {};
      Object.keys(document.rag_systems).forEach(systemKey => {
        enabledStatus[systemKey] = document.rag_systems[systemKey].enabled || false;
      });

      return {
        enabled_status: enabledStatus,
        last_updated: document.updated_at
      };
    } catch (error) {
      console.error('获取RAG启用状态失败:', error);
      throw error;
    }
  }

  /**
   * 更新RAG启用状态
   */
  async updateRAGEnabledStatus(enabledStatus) {
    try {
      await this.ensureConnection();
      
      // 首先获取当前状态，确保只更新传入的字段
      const currentDocument = await this.ragConfigCollection.findOne(
        { _id: 'default_rag_config' },
        { projection: { rag_systems: 1 } }
      );

      if (!currentDocument) {
        throw new Error('未找到RAG配置文档');
      }

      // 构建更新操作，只更新传入的状态
      const updateOps = {};
      Object.keys(enabledStatus).forEach(systemKey => {
        if (currentDocument.rag_systems[systemKey]) {
          updateOps[`rag_systems.${systemKey}.enabled`] = enabledStatus[systemKey];
        }
      });
      updateOps['updated_at'] = new Date().toISOString();

      const result = await this.ragConfigCollection.updateOne(
        { _id: 'default_rag_config' },
        { $set: updateOps }
      );

      // 返回完整的当前状态
      const updatedDocument = await this.ragConfigCollection.findOne(
        { _id: 'default_rag_config' },
        { projection: { rag_systems: 1, updated_at: 1 } }
      );

      const completeStatus = {};
      Object.keys(updatedDocument.rag_systems).forEach(systemKey => {
        completeStatus[systemKey] = updatedDocument.rag_systems[systemKey].enabled || false;
      });

      return {
        updated_status: enabledStatus,
        complete_status: completeStatus,
        updated_at: new Date().toISOString(),
        modified_count: result.modifiedCount
      };
    } catch (error) {
      console.error('更新RAG启用状态失败:', error);
      throw error;
    }
  }

  /**
   * 获取特定RAG系统的数据源配置
   */
  async getRAGDataSources(ragType) {
    try {
      await this.ensureConnection();
      
      const document = await this.ragConfigCollection.findOne(
        { _id: 'default_rag_config' },
        { projection: { [`rag_systems.${ragType}`]: 1 } }
      );

      if (!document || !document.rag_systems || !document.rag_systems[ragType]) {
        throw new Error(`未找到RAG类型 ${ragType} 的配置`);
      }

      return document.rag_systems[ragType];
    } catch (error) {
      console.error(`获取RAG数据源 ${ragType} 失败:`, error);
      throw error;
    }
  }

  /**
   * 更新完整RAG配置
   */
  async updateRAGConfig(ragConfig) {
    try {
      await this.ensureConnection();
      
      const updateData = {
        ...ragConfig,
        updated_at: new Date().toISOString()
      };

      const result = await this.ragConfigCollection.updateOne(
        { _id: 'default_rag_config' },
        { $set: updateData }
      );

      return {
        updated_config: ragConfig,
        updated_at: updateData.updated_at,
        modified_count: result.modifiedCount
      };
    } catch (error) {
      console.error('更新RAG配置失败:', error);
      throw error;
    }
  }

  /**
   * 重置RAG配置为默认值
   */
  async resetRAGConfig() {
    try {
      await this.ensureConnection();
      
      // 默认的RAG配置状态
      const defaultEnabledStatus = {
        process_optimization: false
      };

      const updateOps = {};
      Object.keys(defaultEnabledStatus).forEach(systemKey => {
        updateOps[`rag_systems.${systemKey}.enabled`] = defaultEnabledStatus[systemKey];
      });
      updateOps['updated_at'] = new Date().toISOString();

      const result = await this.ragConfigCollection.updateOne(
        { _id: 'default_rag_config' },
        { $set: updateOps }
      );

      return {
        reset_status: defaultEnabledStatus,
        updated_at: new Date().toISOString(),
        modified_count: result.modifiedCount
      };
    } catch (error) {
      console.error('重置RAG配置失败:', error);
      throw error;
    }
  }

  /**
   * 获取RAG配置统计信息
   */
  async getRAGConfigStats() {
    try {
      await this.ensureConnection();
      
      const document = await this.ragConfigCollection.findOne({
        _id: 'default_rag_config'
      });

      if (!document) {
        throw new Error('未找到RAG配置数据');
      }

      // 统计启用的RAG系统数量
      const enabledSystems = Object.values(document.rag_systems).filter(system => system.enabled).length;
      const totalSystems = Object.keys(document.rag_systems).length;
      
      // 统计数据源总数
      let totalDataSources = 0;
      Object.values(document.rag_systems).forEach(system => {
        if (system.data_sources && Array.isArray(system.data_sources)) {
          totalDataSources += system.data_sources.length;
        }
      });

      return {
        total_systems: totalSystems,
        enabled_systems: enabledSystems,
        total_data_sources: totalDataSources,
        last_updated: document.updated_at,
        version: document.version,
        is_active: document.is_active
      };
    } catch (error) {
      console.error('获取RAG配置统计失败:', error);
      throw error;
    }
  }
}

module.exports = NeuralNetworkService; 