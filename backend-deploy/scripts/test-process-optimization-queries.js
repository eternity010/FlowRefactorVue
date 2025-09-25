const { MongoClient } = require('mongodb');

// MongoDB 连接配置
const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'maintenance_system';
const COLLECTION_NAME = 'process_optimization_flows';

async function testProcessOptimizationQueries() {
  let client;
  
  try {
    // 连接到 MongoDB
    console.log('正在连接到 MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ 成功连接到 MongoDB');

    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    console.log('\n=== 流程优化数据查询测试 ===\n');

    // 1. 查询所有流程优化记录
    console.log('1️⃣ 查询所有流程优化记录:');
    const allDocs = await collection.find({}, { projection: { id: 1, 'data.title': 1 } }).toArray();
    allDocs.forEach(doc => {
      console.log(`   ${doc.id}: ${doc.data.title}`);
    });

    // 2. 查询特定优化流程 (Optimization1 - 采购流程重构优化)
    console.log('\n2️⃣ 查询 Optimization1 的详细信息:');
    const opt1 = await collection.findOne({ id: 'Optimization1' });
    if (opt1) {
      console.log(`   标题: ${opt1.data.title}`);
      console.log(`   描述: ${opt1.data.description}`);
      console.log(`   优化前步骤: ${opt1.data.resourceChanges.summary.processSteps.before}`);
      console.log(`   优化后步骤: ${opt1.data.resourceChanges.summary.processSteps.after}`);
      console.log(`   新增功能: ${opt1.data.resourceChanges.summary.newFunctions} 个`);
      console.log(`   实施阶段: ${opt1.data.resourceChanges.summary.implementationPhases} 个`);
      console.log(`   甘特图任务数量: ${opt1.data.ganttData.tasks.length}`);
      console.log(`   甘特图里程碑: ${opt1.data.ganttData.milestones.length}`);
    }

    // 3. 查询资源变化分析
    console.log('\n3️⃣ 查询资源变化分析:');
    const resourceAnalysis = await collection.find(
      {},
      { 
        projection: { 
          id: 1, 
          'data.title': 1,
          'data.resourceChanges.summary': 1,
          'data.resourceChanges.newResourceTypes.personnel.totalEstimate': 1
        }
      }
    ).toArray();
    
    resourceAnalysis.forEach(doc => {
      const summary = doc.data.resourceChanges?.summary;
      const personnel = doc.data.resourceChanges?.newResourceTypes?.personnel;
      console.log(`   ${doc.id}: ${doc.data.title}`);
      if (summary) {
        console.log(`     流程变化: ${summary.processSteps.before} → ${summary.processSteps.after} 步`);
        console.log(`     新增功能: ${summary.newFunctions} 个`);
        console.log(`     涉及资源: ${summary.resourceTypes.join(', ')}`);
        console.log(`     人员需求: ${personnel?.totalEstimate || 'N/A'}`);
      }
    });

    // 4. 查询甘特图任务信息
    console.log('\n4️⃣ 查询甘特图任务信息 (以 Optimization1 为例):');
    const ganttTasks = await collection.findOne(
      { id: 'Optimization1' },
      { projection: { 'data.ganttData.tasks': 1 } }
    );
    if (ganttTasks && ganttTasks.data.ganttData) {
      ganttTasks.data.ganttData.tasks.forEach(task => {
        console.log(`   任务 ${task.id}: ${task.name}`);
        console.log(`     时间: ${task.start} - ${task.end} (${task.duration}天)`);
        console.log(`     负责人: ${task.responsible}, 优先级: ${task.priority}`);
      });
    }

    // 5. 查询流程步骤增加最多的优化方案
    console.log('\n5️⃣ 查询流程步骤增加最多的优化方案:');
    const stepIncreasePipeline = [
      { $match: { 'data.resourceChanges.summary.processSteps': { $exists: true } } },
      {
        $addFields: {
          stepIncrease: {
            $subtract: [
              '$data.resourceChanges.summary.processSteps.after',
              '$data.resourceChanges.summary.processSteps.before'
            ]
          }
        }
      },
      { $sort: { stepIncrease: -1 } },
      {
        $project: {
          id: 1,
          title: '$data.title',
          before: '$data.resourceChanges.summary.processSteps.before',
          after: '$data.resourceChanges.summary.processSteps.after',
          stepIncrease: 1
        }
      }
    ];
    
    const stepIncreaseResults = await collection.aggregate(stepIncreasePipeline).toArray();
    stepIncreaseResults.forEach(result => {
      console.log(`   ${result.id}: ${result.title}`);
      console.log(`     步骤变化: ${result.before} → ${result.after} (增加 ${result.stepIncrease} 步)`);
    });

    // 6. 查询高优先级甘特图任务
    console.log('\n6️⃣ 查询高优先级 (critical/high) 的甘特图任务:');
    const highPriorityPipeline = [
      { $match: { 'data.ganttData.tasks': { $exists: true } } },
      { $unwind: '$data.ganttData.tasks' },
      { $match: { 'data.ganttData.tasks.priority': { $in: ['critical', 'high'] } } },
      {
        $project: {
          id: 1,
          title: '$data.title',
          taskName: '$data.ganttData.tasks.name',
          priority: '$data.ganttData.tasks.priority',
          responsible: '$data.ganttData.tasks.responsible',
          duration: '$data.ganttData.tasks.duration'
        }
      },
      { $sort: { priority: 1, duration: -1 } }
    ];
    
    const highPriorityTasks = await collection.aggregate(highPriorityPipeline).toArray();
    highPriorityTasks.forEach(task => {
      console.log(`   ${task.id} - ${task.taskName}`);
      console.log(`     优先级: ${task.priority}, 负责人: ${task.responsible}, 时长: ${task.duration}天`);
    });

    // 7. 查询新增人员需求分析
    console.log('\n7️⃣ 查询新增人员需求分析:');
    const personnelPipeline = [
      { $match: { 'data.resourceChanges.newResourceTypes.personnel': { $exists: true } } },
      {
        $project: {
          id: 1,
          title: '$data.title',
          totalEstimate: '$data.resourceChanges.newResourceTypes.personnel.totalEstimate',
          departments: '$data.resourceChanges.newResourceTypes.personnel.departments',
          categories: '$data.resourceChanges.newResourceTypes.personnel.categories'
        }
      }
    ];
    
    const personnelResults = await collection.aggregate(personnelPipeline).toArray();
    personnelResults.forEach(result => {
      console.log(`   ${result.id}: ${result.title}`);
      console.log(`     新增人员: ${result.totalEstimate}`);
      console.log(`     涉及部门: ${result.departments?.join(', ') || 'N/A'}`);
      console.log(`     岗位类型: ${result.categories?.length || 0} 种`);
    });

    // 8. 查询简化版与完整版的对比
    console.log('\n8️⃣ 查询简化版与完整版的对比:');
    const comparisonPipeline = [
      { $match: { 'data.resourceChanges2': { $exists: true } } },
      {
        $project: {
          id: 1,
          title: '$data.title',
          fullVersion: {
            steps: '$data.resourceChanges.summary.processSteps',
            newFunctions: '$data.resourceChanges.summary.newFunctions',
            phases: '$data.resourceChanges.summary.implementationPhases'
          },
          simplifiedVersion: {
            steps: '$data.resourceChanges2.summary.processSteps',
            newFunctions: '$data.resourceChanges2.summary.newFunctions',
            phases: '$data.resourceChanges2.summary.implementationPhases'
          }
        }
      }
    ];
    
    const comparisonResults = await collection.aggregate(comparisonPipeline).toArray();
    comparisonResults.forEach(result => {
      console.log(`   ${result.id}: ${result.title}`);
      console.log(`     完整版: ${result.fullVersion.steps.before} → ${result.fullVersion.steps.after} 步, 新功能 ${result.fullVersion.newFunctions} 个, ${result.fullVersion.phases} 阶段`);
      console.log(`     简化版: ${result.simplifiedVersion.steps.before} → ${result.simplifiedVersion.steps.after} 步, 新功能 ${result.simplifiedVersion.newFunctions} 个, ${result.simplifiedVersion.phases} 阶段`);
    });

    // 9. 全文搜索示例
    console.log('\n9️⃣ 全文搜索 - 查找包含"风险"的流程:');
    const searchResults = await collection.find(
      { $text: { $search: '风险' } },
      { projection: { id: 1, 'data.title': 1, score: { $meta: 'textScore' } } }
    ).sort({ score: { $meta: 'textScore' } }).toArray();
    
    searchResults.forEach(result => {
      console.log(`   ${result.id}: ${result.data.title} (相关度: ${result.score.toFixed(2)})`);
    });

    // 10. 统计信息
    console.log('\n🔟 数据统计:');
    const totalCount = await collection.countDocuments();
    const withSimplifiedVersion = await collection.countDocuments({ 'data.resourceChanges2': { $exists: true } });
    const withGanttData = await collection.countDocuments({ 'data.ganttData': { $exists: true } });
    
    console.log(`   总优化流程数量: ${totalCount}`);
    console.log(`   包含简化版的数量: ${withSimplifiedVersion}`);
    console.log(`   包含甘特图的数量: ${withGanttData}`);

    console.log('\n✅ 流程优化数据查询测试完成！');

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
  testProcessOptimizationQueries();
}

module.exports = { testProcessOptimizationQueries }; 