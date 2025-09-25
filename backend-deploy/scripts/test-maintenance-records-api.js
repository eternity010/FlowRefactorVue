const axios = require('axios');

// API基础配置
const BASE_URL = 'http://localhost:5000';
const API_ENDPOINT = '/api/maintenance/query-maintenance-records';
const FULL_URL = BASE_URL + API_ENDPOINT;

// 颜色输出配置
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bright: '\x1b[1m'
};

// 日志函数
function logSuccess(message) {
  console.log(`${colors.green}✓ ${message}${colors.reset}`);
}

function logError(message) {
  console.log(`${colors.red}✗ ${message}${colors.reset}`);
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ ${message}${colors.reset}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠ ${message}${colors.reset}`);
}

function logTitle(title) {
  console.log(`${colors.bright}${colors.blue}\n=== ${title} ===${colors.reset}`);
}

// HTTP请求函数
async function makeRequest(data, description) {
  try {
    logInfo(`正在测试: ${description}`);
    logInfo(`请求数据: ${JSON.stringify(data, null, 2)}`);
    
    const response = await axios.post(FULL_URL, data, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10秒超时
    });
    
    logSuccess(`请求成功 - 状态码: ${response.status}`);
    console.log(`响应数据:`, JSON.stringify(response.data, null, 2));
    return { success: true, data: response.data, status: response.status };
    
  } catch (error) {
    if (error.response) {
      logError(`请求失败 - 状态码: ${error.response.status}`);
      console.log(`错误响应:`, JSON.stringify(error.response.data, null, 2));
      return { success: false, error: error.response.data, status: error.response.status };
    } else if (error.request) {
      logError(`网络错误 - 无法连接到服务器`);
      return { success: false, error: 'Network Error', status: 0 };
    } else {
      logError(`请求配置错误: ${error.message}`);
      return { success: false, error: error.message, status: 0 };
    }
  }
}

// 测试用例定义
const testCases = [
  {
    name: '正常日期范围查询',
    data: {
      "start_date": "2025-06-01",
      "end_date": "2025-06-05"
    },
    expectSuccess: true
  },
  {
    name: '较长日期范围查询',
    data: {
      "start_date": "2025-05-01",
      "end_date": "2025-06-30"
    },
    expectSuccess: true
  },
  {
    name: '单日查询',
    data: {
      "start_date": "2025-06-15",
      "end_date": "2025-06-15"
    },
    expectSuccess: true
  },
  {
    name: '跨月查询',
    data: {
      "start_date": "2025-05-28",
      "end_date": "2025-06-05"
    },
    expectSuccess: true
  },
  {
    name: '历史数据查询',
    data: {
      "start_date": "2024-12-01",
      "end_date": "2024-12-31"
    },
    expectSuccess: true
  },
  {
    name: '无效日期格式 - 缺少前导零',
    data: {
      "start_date": "2025-6-1",
      "end_date": "2025-6-5"
    },
    expectSuccess: false
  },
  {
    name: '无效日期格式 - 错误分隔符',
    data: {
      "start_date": "2025/06/01",
      "end_date": "2025/06/05"
    },
    expectSuccess: false
  },
  {
    name: '日期范围颠倒',
    data: {
      "start_date": "2025-06-05",
      "end_date": "2025-06-01"
    },
    expectSuccess: false
  },
  {
    name: '缺少开始日期',
    data: {
      "end_date": "2025-06-05"
    },
    expectSuccess: false
  },
  {
    name: '缺少结束日期',
    data: {
      "start_date": "2025-06-01"
    },
    expectSuccess: false
  },
  {
    name: '空请求体',
    data: {},
    expectSuccess: false
  },
  {
    name: '无效日期值',
    data: {
      "start_date": "2025-13-01",
      "end_date": "2025-13-32"
    },
    expectSuccess: false
  },
  {
    name: '非字符串日期',
    data: {
      "start_date": 20250601,
      "end_date": 20250605
    },
    expectSuccess: false
  }
];

// 主测试函数
async function runTests() {
  logTitle('维护记录查询API测试');
  
  console.log(`${colors.blue}API端点: ${FULL_URL}${colors.reset}`);
  console.log(`${colors.blue}测试时间: ${new Date().toLocaleString('zh-CN')}${colors.reset}\n`);
  
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  
  // 首先检查服务器连接
  logTitle('服务器连接检查');
  try {
    const healthCheck = await axios.get(BASE_URL, { timeout: 5000 });
    logSuccess('服务器连接正常');
  } catch (error) {
    logError('无法连接到服务器，请确保服务器正在运行');
    logWarning('跳过所有测试...');
    return;
  }
  
  // 运行所有测试用例
  logTitle('API功能测试');
  
  for (const testCase of testCases) {
    totalTests++;
    console.log(`\n${colors.bright}测试 ${totalTests}: ${testCase.name}${colors.reset}`);
    console.log('-'.repeat(50));
    
    const result = await makeRequest(testCase.data, testCase.name);
    
    // 验证测试结果
    const actualSuccess = result.success;
    const expectedSuccess = testCase.expectSuccess;
    
    if (actualSuccess === expectedSuccess) {
      logSuccess(`测试通过 - 预期${expectedSuccess ? '成功' : '失败'}，实际${actualSuccess ? '成功' : '失败'}`);
      passedTests++;
    } else {
      logError(`测试失败 - 预期${expectedSuccess ? '成功' : '失败'}，实际${actualSuccess ? '成功' : '失败'}`);
      failedTests++;
    }
    
    // 添加延迟避免服务器过载
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // 输出测试总结
  logTitle('测试总结');
  console.log(`${colors.blue}总测试数: ${totalTests}${colors.reset}`);
  console.log(`${colors.green}通过: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}失败: ${failedTests}${colors.reset}`);
  console.log(`${colors.yellow}成功率: ${((passedTests / totalTests) * 100).toFixed(1)}%${colors.reset}`);
  
  if (failedTests === 0) {
    logSuccess('\n🎉 所有测试通过！');
  } else {
    logWarning(`\n⚠️  有 ${failedTests} 个测试失败，请检查API实现`);
  }
}

// 性能测试函数
async function performanceTest() {
  logTitle('性能测试');
  
  const testData = {
    "start_date": "2025-06-01",
    "end_date": "2025-06-05"
  };
  
  const iterations = 10;
  const times = [];
  
  logInfo(`执行 ${iterations} 次请求测试响应时间...`);
  
  for (let i = 0; i < iterations; i++) {
    const startTime = Date.now();
    const result = await makeRequest(testData, `性能测试 ${i + 1}`);
    const endTime = Date.now();
    const duration = endTime - startTime;
    times.push(duration);
    
    if (result.success) {
      logInfo(`请求 ${i + 1}: ${duration}ms`);
    } else {
      logError(`请求 ${i + 1} 失败: ${duration}ms`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // 计算统计数据
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  
  console.log(`\n${colors.bright}性能统计:${colors.reset}`);
  console.log(`平均响应时间: ${avgTime.toFixed(2)}ms`);
  console.log(`最快响应时间: ${minTime}ms`);
  console.log(`最慢响应时间: ${maxTime}ms`);
}

// 程序入口
async function main() {
  try {
    await runTests();
    console.log('\n');
    await performanceTest();
  } catch (error) {
    logError(`测试执行错误: ${error.message}`);
    process.exit(1);
  }
}

// 运行测试
if (require.main === module) {
  main();
}

module.exports = {
  makeRequest,
  runTests,
  performanceTest
};
