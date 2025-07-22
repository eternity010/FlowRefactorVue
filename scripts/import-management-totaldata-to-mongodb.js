const { MongoClient } = require('mongodb');

// MongoDB 配置
const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'maintenance_system';
const COLLECTION_NAME = 'total_data';

// 页面静态数据
const totalData = {
  productionData: [
    { month: '3月', value: 112 },
    { month: '4月', value: 113 },
    { month: '5月', value: 150 },
    { month: '6月', value: 120 },
    { month: '7月', value: 130 },
    { month: '8月', value: 140 },
    { month: '9月', value: 150 },
    { month: '10月', value: 160 },
    { month: '11月', value: 170 }
  ],
  progressPercent: 60,
  efficiencyData: {
    completionRate: {
      value: 93.2,
      trend: 2.1,
      isUp: true
    },
    turnaroundTime: {
      value: 24.6,
      trend: 1.8,
      isUp: false
    }
  },
  riskItems: [
    { type: 'warning', message: '员工离职' },
    { type: 'danger', message: '供应商A缺货' }
  ],
  note: '数据来源于 ProcessManagement.vue 静态默认数据',
  createdAt: new Date(),
  updatedAt: new Date()
};

async function importTotalData() {
  let client;
  try {
    console.log('🔌 连接 MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ 已连接');

    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // 清空旧数据
    await collection.deleteMany({});
    console.log('🗑️ 已清空旧数据');

    // 插入新数据
    const result = await collection.insertOne(totalData);
    console.log(`🎉 已插入文档 _id: ${result.insertedId}`);

    // 简要显示
    const doc = await collection.findOne({ _id: result.insertedId });
    console.log('📄 插入内容摘要:', {
      productionMonths: doc.productionData.length,
      progressPercent: doc.progressPercent,
      efficiencyCompletionRate: doc.efficiencyData.completionRate.value,
      riskCount: doc.riskItems.length
    });
  } catch (error) {
    console.error('❌ 导入失败:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('🔚 连接已关闭');
    }
  }
}

if (require.main === module) {
  importTotalData();
}

module.exports = { importTotalData }; 