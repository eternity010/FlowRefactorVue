const { MongoClient } = require('mongodb');

// MongoDB 连接配置
const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'maintenance_system';
const COLLECTION_NAME = 'operation_implementations';

async function testMongoDBQueries() {
  let client;
  
  try {
    // 连接到 MongoDB
    console.log('正在连接到 MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ 成功连接到 MongoDB');

    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    console.log('\n=== MongoDB 查询测试 ===\n');

    // 1. 查询所有记录
    console.log('1️⃣ 查询所有记录:');
    const allDocs = await collection.find({}, { projection: { id: 1, 'data.title': 1 } }).toArray();
    allDocs.forEach(doc => {
      console.log(`   ${doc.id}: ${doc.data.title}`);
    });

    // 2. 查询特定记录 (o1 - 里程数周期性维护)
    console.log('\n2️⃣ 查询 o1 记录的基本信息:');
    const o1 = await collection.findOne({ id: 'o1' });
    if (o1) {
      console.log(`   标题: ${o1.data.title}`);
      console.log(`   描述: ${o1.data.description}`);
      console.log(`   备用流程启用: ${o1.data.isBackupEnabled}`);
      console.log(`   流程节点数量: ${o1.data.flowData.nodes.length}`);
      console.log(`   流程边数量: ${o1.data.flowData.edges.length}`);
      console.log(`   步骤数量: ${Object.keys(o1.data.steps).length}`);
    }

    // 3. 查询特定步骤信息
    console.log('\n3️⃣ 查询 o1 的步骤信息:');
    const o1Steps = await collection.findOne(
      { id: 'o1' },
      { projection: { 'data.steps': 1 } }
    );
    if (o1Steps) {
      Object.entries(o1Steps.data.steps).forEach(([stepKey, stepData]) => {
        console.log(`   ${stepKey}: ${stepData.title} (${stepData.duration}, 负责人: ${stepData.responsible})`);
      });
    }

    // 4. 查询甘特图任务
    console.log('\n4️⃣ 查询 o1 的甘特图任务:');
    const o1Gantt = await collection.findOne(
      { id: 'o1' },
      { projection: { 'data.ganttData.tasks': 1 } }
    );
    if (o1Gantt && o1Gantt.data.ganttData) {
      o1Gantt.data.ganttData.tasks.forEach(task => {
        console.log(`   任务 ${task.id}: ${task.name} (${task.start} - ${task.end}, 优先级: ${task.priority})`);
      });
    }

    // 5. 查询包含特定关键词的流程
    console.log('\n5️⃣ 查询标题包含"维护"的流程:');
    const maintenanceFlows = await collection.find(
      { 'data.title': { $regex: '维护', $options: 'i' } },
      { projection: { id: 1, 'data.title': 1 } }
    ).toArray();
    maintenanceFlows.forEach(doc => {
      console.log(`   ${doc.id}: ${doc.data.title}`);
    });

    // 6. 查询负责人为"运维专员"的步骤
    console.log('\n6️⃣ 查询负责人为"运维专员"的步骤:');
    const pipeline = [
      { $match: {} },
      {
        $project: {
          id: 1,
          'data.title': 1,
          steps: {
            $objectToArray: '$data.steps'
          }
        }
      },
      { $unwind: '$steps' },
      { $match: { 'steps.v.responsible': '运维专员' } },
      {
        $project: {
          id: 1,
          title: '$data.title',
          stepKey: '$steps.k',
          stepTitle: '$steps.v.title',
          responsible: '$steps.v.responsible'
        }
      }
    ];
    
    const operatorSteps = await collection.aggregate(pipeline).toArray();
    operatorSteps.forEach(step => {
      console.log(`   ${step.id} - ${step.stepKey}: ${step.stepTitle}`);
    });

    // 7. 查询高优先级任务
    console.log('\n7️⃣ 查询高优先级 (critical/high) 的甘特图任务:');
    const highPriorityPipeline = [
      { $match: { 'data.ganttData': { $exists: true } } },
      { $unwind: '$data.ganttData.tasks' },
      { $match: { 'data.ganttData.tasks.priority': { $in: ['critical', 'high'] } } },
      {
        $project: {
          id: 1,
          title: '$data.title',
          taskName: '$data.ganttData.tasks.name',
          priority: '$data.ganttData.tasks.priority',
          responsible: '$data.ganttData.tasks.responsible'
        }
      }
    ];
    
    const highPriorityTasks = await collection.aggregate(highPriorityPipeline).toArray();
    highPriorityTasks.forEach(task => {
      console.log(`   ${task.id} - ${task.taskName} (${task.priority}) - 负责人: ${task.responsible}`);
    });

    // 8. 统计信息
    console.log('\n8️⃣ 数据统计:');
    const totalCount = await collection.countDocuments();
    const withBackupCount = await collection.countDocuments({ 'data.isBackupEnabled': true });
    const withoutBackupCount = await collection.countDocuments({ 'data.isBackupEnabled': false });
    
    console.log(`   总流程数量: ${totalCount}`);
    console.log(`   启用备用流程的数量: ${withBackupCount}`);
    console.log(`   未启用备用流程的数量: ${withoutBackupCount}`);

    console.log('\n✅ 查询测试完成！');

  } catch (error) {
    console.error('❌ 查询测试时发生错误:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 已关闭 MongoDB 连接');
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  testMongoDBQueries();
}

module.exports = { testMongoDBQueries }; 