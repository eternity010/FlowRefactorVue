const FlowDataService = require('../src/services/flowDataService');

async function testFlowDataService() {
const service = new FlowDataService();
  
  try {
    // 连接到数据库
    console.log('🔌 正在连接到数据库...');
    const connected = await service.connect();
    if (!connected) {
      console.error('❌ 无法连接到数据库，测试终止');
      return;
    }

    console.log('\n🧪 开始测试 FlowDataService 方法...\n');

    // 测试1: 获取数据库统计信息
    console.log('📊 测试1 - 获取数据库统计信息:');
    const statsResult = await service.getDatabaseStats();
    if (statsResult.success) {
      console.log(`  ✅ 总记录数: ${statsResult.data.totalRecords}`);
      console.log(`  ✅ 流程类型数: ${statsResult.data.flowTypeCount}`);
      console.log(`  ✅ 流程类型: ${statsResult.data.flowTypes.join(', ')}`);
    } else {
      console.log(`  ❌ 失败: ${statsResult.error}`);
    }

    // 测试2: 获取所有流程数据
    console.log('\n📋 测试2 - 获取所有流程数据:');
    const allDataResult = await service.getAllFlowData();
    if (allDataResult.success) {
      console.log(`  ✅ 成功获取 ${allDataResult.count} 条流程数据`);
      allDataResult.data.forEach(flow => {
        console.log(`    - ${flow.flowName} (${flow.flowType}): ${flow.chartSummary.totalMonths}个月数据`);
      });
    } else {
      console.log(`  ❌ 失败: ${allDataResult.error}`);
    }

    // 测试3: 根据流程类型获取数据
    console.log('\n🔍 测试3 - 根据流程类型获取数据:');
    const flowTypes = ['purchase', 'production', 'marketing', 'maintenance'];
    for (const flowType of flowTypes) {
      const result = await service.getFlowDataByType(flowType);
      if (result.success && result.data) {
        console.log(`  ✅ ${result.data.flowName}: 最新数值 ${result.data.chartSummary.latestValue.toLocaleString()}`);
      } else {
        console.log(`  ❌ ${flowType}: 获取失败`);
      }
    }

    // 测试4: 获取流程摘要
    console.log('\n📄 测试4 - 获取流程摘要:');
    const summaryResult = await service.getFlowSummary();
    if (summaryResult.success) {
      console.log('  ✅ 流程摘要信息:');
      summaryResult.data.forEach(summary => {
        console.log(`    - ${summary.flowName}: ${summary.chartSummary.latestValue.toLocaleString()} (${summary.panelSummary.totalPanels}个指标)`);
      });
    } else {
      console.log(`  ❌ 失败: ${summaryResult.error}`);
    }

    // 测试5: 获取流程趋势分析
    console.log('\n📈 测试5 - 获取流程趋势分析:');
    const trendResult = await service.getFlowTrendAnalysis();
    if (trendResult.success) {
      console.log('  ✅ 流程趋势分析 (按增长率排序):');
      trendResult.data.forEach(trend => {
        const trendIcon = trend.trend === '上升' ? '↗️' : trend.trend === '下降' ? '↘️' : '➡️';
        console.log(`    - ${trend.flowName}: ${trendIcon} ${trend.growthRate.toFixed(1)}% (${trend.trend})`);
      });
    } else {
      console.log(`  ❌ 失败: ${trendResult.error}`);
    }

    // 测试6: 获取指定流程的月度数据
    console.log('\n📅 测试6 - 获取月度数据 (以采购流程为例):');
    const monthlyResult = await service.getMonthlyDataByType('purchase');
    if (monthlyResult.success && monthlyResult.data) {
      console.log(`  ✅ ${monthlyResult.data.flowName} 月度数据:`);
      monthlyResult.data.chartData.forEach(monthData => {
        console.log(`    - ${monthData.month}: ${monthData.value.toLocaleString()}`);
      });
    } else {
      console.log(`  ❌ 失败: ${monthlyResult.error}`);
    }

    // 测试7: 获取指定流程的关键指标
    console.log('\n🎯 测试7 - 获取关键指标 (以生产流程为例):');
    const panelResult = await service.getPanelDataByType('production');
    if (panelResult.success && panelResult.data) {
      console.log(`  ✅ ${panelResult.data.flowName} 关键指标:`);
      panelResult.data.panelData.forEach(panel => {
        console.log(`    - ${panel.label}: ${panel.value}${panel.unit}`);
      });
    } else {
      console.log(`  ❌ 失败: ${panelResult.error}`);
    }

    // 测试8: 按最新数值排序获取流程数据
    console.log('\n🏆 测试8 - 按最新数值排序:');
    const sortedResult = await service.getFlowDataByLatestValue(4);
    if (sortedResult.success) {
      console.log('  ✅ 流程数据 (按最新数值从高到低):');
      sortedResult.data.forEach((flow, index) => {
        console.log(`    ${index + 1}. ${flow.flowName}: ${flow.chartSummary.latestValue.toLocaleString()}`);
      });
    } else {
      console.log(`  ❌ 失败: ${sortedResult.error}`);
    }

    // 测试9: 搜索包含特定关键词的流程
    console.log('\n🔎 测试9 - 关键词搜索 (搜索"数据"):');
    const searchResult = await service.searchFlowData('数据');
    if (searchResult.success) {
      console.log(`  ✅ 找到 ${searchResult.data.length} 个包含"${searchResult.keyword}"的流程:`);
      searchResult.data.forEach(flow => {
        console.log(`    - ${flow.flowName}: ${flow.description}`);
      });
    } else {
      console.log(`  ❌ 失败: ${searchResult.error}`);
    }

    // 测试10: 获取包含特定面板指标的流程
    console.log('\n🎪 测试10 - 面板指标搜索 (搜索"完成率"):');
    const panelSearchResult = await service.getFlowsByPanelLabel('完成率');
    if (panelSearchResult.success) {
      console.log(`  ✅ 找到 ${panelSearchResult.data.length} 个包含"${panelSearchResult.searchLabel}"的流程:`);
      panelSearchResult.data.forEach(flow => {
        console.log(`    - ${flow.flowName}:`);
        if (flow.panelData && flow.panelData.length > 0) {
          flow.panelData.forEach(panel => {
            console.log(`      * ${panel.label}: ${panel.value}${panel.unit}`);
          });
        }
      });
    } else {
      console.log(`  ❌ 失败: ${panelSearchResult.error}`);
    }

    // 测试11: 批量获取多个流程类型的数据
    console.log('\n📦 测试11 - 批量获取流程数据 (采购+营销):');
    const batchResult = await service.getMultipleFlowData(['purchase', 'marketing']);
    if (batchResult.success) {
      console.log(`  ✅ 成功获取 ${batchResult.data.length} 个流程的数据:`);
      batchResult.data.forEach(flow => {
        console.log(`    - ${flow.flowName}: ${flow.chartSummary.latestValue.toLocaleString()}`);
      });
    } else {
      console.log(`  ❌ 失败: ${batchResult.error}`);
    }

    // 测试12: 错误处理测试（获取不存在的流程类型）
    console.log('\n⚠️ 测试12 - 错误处理测试 (不存在的流程类型):');
    const errorResult = await service.getFlowDataByType('nonexistent');
    if (errorResult.success) {
      if (errorResult.data === null) {
        console.log('  ✅ 正确处理：返回 null，表示未找到数据');
      } else {
        console.log('  ⚠️ 意外获取到数据');
      }
    } else {
      console.log(`  ✅ 正确处理错误: ${errorResult.error}`);
    }

    // 性能测试
    console.log('\n⚡ 测试13 - 性能测试:');
    const startTime = Date.now();
    await service.getAllFlowData();
    await service.getFlowTrendAnalysis();
    await service.getFlowSummary();
    const endTime = Date.now();
    console.log(`  ✅ 3个查询操作总耗时: ${endTime - startTime}ms`);

    // 数据完整性验证
    console.log('\n🔒 测试14 - 数据完整性验证:');
    const allData = await service.getAllFlowData();
    if (allData.success) {
      let isValid = true;
      const requiredFields = ['flowType', 'flowName', 'chartData', 'panelData', 'chartSummary'];
      
      allData.data.forEach(flow => {
        requiredFields.forEach(field => {
          if (!flow[field]) {
            console.log(`  ❌ ${flow.flowName} 缺少字段: ${field}`);
            isValid = false;
          }
        });
      });
      
      if (isValid) {
        console.log('  ✅ 所有数据完整性验证通过');
      }
    }

    console.log('\n🎉 所有测试完成！');

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  } finally {
    // 关闭数据库连接
    await service.disconnect();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  testFlowDataService();
}

module.exports = { testFlowDataService }; 