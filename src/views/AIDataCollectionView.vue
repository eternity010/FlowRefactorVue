<template>
  <div class="ai-data-collection-container">
    <el-card class="page-card">
      <div slot="header" class="header">
        <span>大模型联网收集信息</span>
        <el-tag size="small" type="success">功能开发中</el-tag>
      </div>
      
      <div class="content-area">
        <div class="data-source-section">
          <div class="section-header">
            <i class="el-icon-news"></i>
            <h3>选择信息源，支持多选</h3>
            <p>请选择需要收集信息的数据源，包括新闻和市场价格信息</p>
          </div>
          
          <el-card class="source-selection-card">
            <div slot="header" class="card-header">
              <span>国际新闻信息源</span>
              <div class="header-actions">
                <el-button size="mini" type="text" @click="selectAll">全选</el-button>
                <el-button size="mini" type="text" @click="clearAll">清空</el-button>
              </div>
            </div>
            
            <el-checkbox-group v-model="selectedSources" class="source-grid">
              <el-checkbox
                v-for="source in dataSources"
                :key="source.id"
                :label="source.id"
                class="source-item"
              >
                <div class="source-content">
                  <div class="source-info">
                    <div class="source-name">{{ source.name }}</div>
                    <div class="source-desc">{{ source.description }}</div>
                  </div>
                  <el-tag :type="source.type" size="mini">{{ source.region }}</el-tag>
                </div>
              </el-checkbox>
            </el-checkbox-group>
            
            <div class="selection-summary">
              <span>已选择 {{ selectedSources.length }} 个信息源</span>
            </div>
          </el-card>
          
          <!-- 市场价格信息源选择 -->
          <el-card class="source-selection-card">
            <div slot="header" class="card-header">
              <span>市场价格信息源</span>
              <div class="header-actions">
                <el-button size="mini" type="text" @click="selectAllMarket">全选</el-button>
                <el-button size="mini" type="text" @click="clearAllMarket">清空</el-button>
              </div>
            </div>
            
            <el-checkbox-group v-model="selectedMarketSources" class="source-grid">
              <el-checkbox
                v-for="source in marketSources"
                :key="source.id"
                :label="source.id"
                class="source-item"
              >
                <div class="source-content">
                  <div class="source-info">
                    <div class="source-name">{{ source.name }}</div>
                    <div class="source-desc">{{ source.description }}</div>
                  </div>
                  <el-tag :type="source.type" size="mini">{{ source.category }}</el-tag>
                </div>
              </el-checkbox>
            </el-checkbox-group>
            
            <div class="selection-summary">
              <span>已选择 {{ selectedMarketSources.length }} 个市场信息源</span>
            </div>
          </el-card>
          
          <div class="action-buttons">
            <el-button 
              type="primary" 
              size="large" 
              icon="el-icon-video-play" 
              @click="startDataCollection"
              :disabled="selectedSources.length === 0 && selectedMarketSources.length === 0"
            >
              启动信息收集 ({{ selectedSources.length + selectedMarketSources.length }})
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AIDataCollectionView',
  data() {
    return {
      selectedSources: [], // 已选择的新闻信息源
      selectedMarketSources: [], // 已选择的市场信息源
      dataSources: [
        {
          id: 'bbc',
          name: 'BBC News',
          description: '英国广播公司国际新闻',
          region: '英国',
          type: 'primary'
        },
        {
          id: 'cnn',
          name: 'CNN International',
          description: '美国有线电视新闻网国际版',
          region: '美国',
          type: 'primary'
        },
        {
          id: 'reuters',
          name: 'Reuters',
          description: '路透社国际新闻通讯社',
          region: '英国',
          type: 'success'
        },
        {
          id: 'ap',
          name: 'Associated Press',
          description: '美联社国际新闻',
          region: '美国',
          type: 'success'
        },
        {
          id: 'france24',
          name: 'France 24',
          description: '法国24小时国际新闻台',
          region: '法国',
          type: 'warning'
        },
        {
          id: 'dw',
          name: 'Deutsche Welle',
          description: '德国之声国际广播',
          region: '德国',
          type: 'warning'
        },
        {
          id: 'aljazeera',
          name: 'Al Jazeera',
          description: '半岛电视台国际新闻',
          region: '卡塔尔',
          type: 'info'
        },
        {
          id: 'euronews',
          name: 'Euronews',
          description: '欧洲新闻台',
          region: '欧洲',
          type: 'info'
        },
        {
          id: 'nyt',
          name: 'The New York Times',
          description: '纽约时报国际版',
          region: '美国',
          type: 'primary'
        },
        {
          id: 'guardian',
          name: 'The Guardian',
          description: '英国卫报国际新闻',
          region: '英国',
          type: 'success'
        }
      ],
      marketSources: [
        {
          id: 'nyse',
          name: 'New York Stock Exchange (NYSE)',
          description: '纽约证券交易所实时股价数据',
          category: '股票',
          type: 'primary'
        },
        {
          id: 'nasdaq',
          name: 'NASDAQ',
          description: '纳斯达克全球精选市场数据',
          category: '股票',
          type: 'primary'
        },
        {
          id: 'lse',
          name: 'London Stock Exchange',
          description: '伦敦证券交易所市场数据',
          category: '股票',
          type: 'primary'
        },
        {
          id: 'forex',
          name: 'Foreign Exchange Market',
          description: '主要货币对汇率实时数据',
          category: '外汇',
          type: 'success'
        },
        {
          id: 'cme',
          name: 'Chicago Mercantile Exchange',
          description: '芝加哥商品交易所期货价格',
          category: '期货',
          type: 'warning'
        },
        {
          id: 'lme',
          name: 'London Metal Exchange',
          description: '伦敦金属交易所金属价格',
          category: '期货',
          type: 'warning'
        },
        {
          id: 'crypto',
          name: 'Cryptocurrency Markets',
          description: '主要加密货币实时价格',
          category: '加密货币',
          type: 'info'
        },
        {
          id: 'treasury',
          name: 'Treasury Bond Markets',
          description: '美国国债市场价格数据',
          category: '债券',
          type: 'success'
        },
        {
          id: 'gold',
          name: 'Gold Market',
          description: '国际黄金现货和期货价格',
          category: '贵金属',
          type: 'warning'
        },
        {
          id: 'oil',
          name: 'Oil Market',
          description: 'WTI和布伦特原油期货价格',
          category: '能源',
          type: 'danger'
        }
      ]
    }
  },
  methods: {
    // 全选新闻信息源
    selectAll() {
      this.selectedSources = this.dataSources.map(source => source.id);
      this.$message({
        message: '已选择全部新闻信息源',
        type: 'success',
        duration: 1000
      });
    },
    // 清空选择
    clearAll() {
      this.selectedSources = [];
      this.$message({
        message: '已清空新闻信息源选择',
        type: 'info',
        duration: 1000
      });
    },
    // 全选市场信息源
    selectAllMarket() {
      this.selectedMarketSources = this.marketSources.map(source => source.id);
      this.$message({
        message: '已选择全部市场信息源',
        type: 'success',
        duration: 1000
      });
    },
    // 清空市场信息源选择
    clearAllMarket() {
      this.selectedMarketSources = [];
      this.$message({
        message: '已清空市场信息源选择',
        type: 'info',
        duration: 1000
      });
    },
    // 启动信息收集
    startDataCollection() {
      const totalSources = this.selectedSources.length + this.selectedMarketSources.length;
      
      if (totalSources === 0) {
        this.$message({
          message: '请至少选择一个信息源',
          type: 'warning'
        });
        return;
      }

      // 获取选中的新闻信息源名称
      const selectedNewsNames = this.selectedSources.map(id => {
        const source = this.dataSources.find(s => s.id === id);
        return source ? source.name : id;
      });

      // 获取选中的市场信息源名称
      const selectedMarketNames = this.selectedMarketSources.map(id => {
        const source = this.marketSources.find(s => s.id === id);
        return source ? source.name : id;
      });

      // 构建提示信息
      let sourceInfo = '';
      if (this.selectedSources.length > 0 && this.selectedMarketSources.length > 0) {
        sourceInfo = `${this.selectedSources.length} 个新闻源和 ${this.selectedMarketSources.length} 个市场源`;
      } else if (this.selectedSources.length > 0) {
        sourceInfo = `${this.selectedSources.length} 个新闻信息源`;
      } else {
        sourceInfo = `${this.selectedMarketSources.length} 个市场信息源`;
      }

      this.$message({
        message: `正在从 ${sourceInfo} 收集数据...`,
        type: 'info',
        duration: 1000
      });
      
      // 构建加载时显示的详细信息源列表
      const allSelectedSources = [...selectedNewsNames, ...selectedMarketNames];
      const displayText = allSelectedSources.length > 5 
        ? `${allSelectedSources.slice(0, 5).join(', ')} 等 ${allSelectedSources.length} 个信息源`
        : allSelectedSources.join(', ');
      
      // 显示加载状态
      const loading = this.$loading({
        lock: true,
        text: `大模型正在从以下信息源收集信息：${displayText}`,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      
      // 模拟信息收集过程
      setTimeout(() => {
        // 保存AI收集状态到localStorage
        const aiCollectionData = {
          lastCollectionTime: new Date().toLocaleString('zh-CN'),
          collectedSources: totalSources,
          newsSources: this.selectedSources.length,
          marketSources: this.selectedMarketSources.length,
          timestamp: Date.now()
        };
        localStorage.setItem('aiCollectionData', JSON.stringify(aiCollectionData));
        
        // 关闭加载状态
        loading.close();
        
        // 显示成功消息
        this.$message({
          message: `信息收集完成！已从 ${sourceInfo} 获取最新数据`,
          type: 'success',
          duration: 1500
        });
        
        // 1.5秒后跳转到重构时机界面
        setTimeout(() => {
          this.$router.push('/topic4/home/refactor-timing');
        }, 1500);
      }, 3000);
    }
  }
}
</script>

<style scoped>
.ai-data-collection-container {
  padding: 20px 10px;
}

.page-card {
  width: 100%;
  min-height: 600px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-area {
  padding: 20px 0;
}

.data-source-section {
  width: 100%;
  margin: 0 auto;
  padding: 0 10px;
}

.section-header {
  text-align: center;
  margin-bottom: 30px;
}

.section-header i {
  font-size: 60px;
  color: #67C23A;
  margin-bottom: 15px;
}

.section-header h3 {
  margin: 15px 0 8px;
  color: #303133;
  font-size: 24px;
  font-weight: bold;
}

.section-header p {
  margin: 0;
  color: #606266;
  font-size: 16px;
}

.source-selection-card {
  margin-bottom: 30px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.source-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.source-item {
  margin: 0 !important;
  width: 100%;
}

.source-item .el-checkbox__label {
  width: 100%;
  padding-left: 10px;
}

.source-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid #EBEEF5;
  border-radius: 6px;
  background-color: #fafafa;
  transition: all 0.3s;
}

.source-content:hover {
  border-color: #409EFF;
  background-color: #f0f9ff;
}

.source-item.is-checked .source-content {
  border-color: #409EFF;
  background-color: #e6f7ff;
}

.source-info {
  flex: 1;
}

.source-name {
  font-weight: bold;
  font-size: 14px;
  color: #303133;
  margin-bottom: 3px;
}

.source-desc {
  font-size: 12px;
  color: #606266;
  line-height: 1.3;
}

.selection-summary {
  text-align: center;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  color: #606266;
  font-size: 14px;
}

.action-buttons {
  text-align: center;
  margin-top: 20px;
}

.action-buttons .el-button {
  padding: 15px 30px;
  font-size: 16px;
}
</style> 