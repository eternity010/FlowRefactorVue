/**
 * 将风险数据CSV导入到MySQL数据库
 */

const fs = require('fs');
const path = require('path');
const MySQLService = require('../src/services/mysqlService');

// CSV解析函数
function parseCSV(csvContent) {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      // 简单的CSV解析（处理带引号的字段）
      const values = [];
      let currentValue = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue.trim());
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      values.push(currentValue.trim()); // 添加最后一个值
      
      if (values.length === headers.length) {
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        data.push(row);
      }
    }
  }
  
  return data;
}

async function importRiskData() {
  console.log('🚀 开始导入风险数据到MySQL...\n');
  
  const mysqlService = new MySQLService();
  
  try {
    // 1. 检查MySQL连接
    console.log('1️⃣ 检查MySQL连接...');
    const connectionResult = await mysqlService.checkConnection();
    
    if (!connectionResult.success) {
      throw new Error(`MySQL连接失败: ${connectionResult.error}`);
    }
    
    console.log('✅ MySQL连接成功');
    console.log('📊 数据库信息:', connectionResult.data);
    
    // 2. 读取CSV文件
    console.log('\n2️⃣ 读取风险数据CSV文件...');
    const csvPath = path.join(__dirname, '../src/data/dm_topic0101_output_risk.csv');
    
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV文件不存在: ${csvPath}`);
    }
    
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const riskData = parseCSV(csvContent);
    
    console.log('✅ CSV文件解析完成');
    console.log('📋 解析到记录数:', riskData.length);
    console.log('📋 字段名:', Object.keys(riskData[0] || {}));
    
    // 3. 创建表（如果不存在）
    console.log('\n3️⃣ 创建数据表...');
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS dm_topic0101_output_risk (
        id INT PRIMARY KEY,
        model_run_batch VARCHAR(100),
        activity_id VARCHAR(50),
        activity_name VARCHAR(200),
        activity_risk VARCHAR(20),
        remark TEXT,
        del_flag VARCHAR(10),
        create_id VARCHAR(50),
        create_name VARCHAR(100),
        create_time VARCHAR(50),
        update_id VARCHAR(50),
        update_name VARCHAR(100),
        update_time VARCHAR(50)
      )
    `;
    
    const createResult = await mysqlService.executeCustomQuery(createTableSQL);
    if (!createResult.success) {
      throw new Error(`创建表失败: ${createResult.error}`);
    }
    
    console.log('✅ 数据表已准备');
    
    // 4. 清空现有数据
    console.log('\n4️⃣ 清空现有数据...');
    const truncateResult = await mysqlService.executeCustomQuery('TRUNCATE TABLE dm_topic0101_output_risk');
    if (!truncateResult.success) {
      console.log('⚠️ 清空表失败，继续导入:', truncateResult.error);
    } else {
      console.log('✅ 现有数据已清空');
    }
    
    // 5. 插入数据
    console.log('\n5️⃣ 插入风险数据...');
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < riskData.length; i++) {
      const record = riskData[i];
      
      try {
        const insertResult = await mysqlService.insertData('dm_topic0101_output_risk', record);
        if (insertResult.success) {
          successCount++;
          if (successCount % 5 === 0) {
            console.log(`📝 已插入 ${successCount}/${riskData.length} 条记录`);
          }
        } else {
          errorCount++;
          console.log(`❌ 插入记录失败 [${i+1}]:`, insertResult.error);
        }
      } catch (error) {
        errorCount++;
        console.log(`❌ 插入记录异常 [${i+1}]:`, error.message);
      }
    }
    
    // 6. 验证导入结果
    console.log('\n6️⃣ 验证导入结果...');
    const countResult = await mysqlService.executeCustomQuery('SELECT COUNT(*) as total FROM dm_topic0101_output_risk');
    const totalRecords = countResult.success ? countResult.data[0].total : 0;
    
    console.log('\n🎉 风险数据导入完成！');
    console.log('📊 导入统计:');
    console.log(`   - 成功插入: ${successCount} 条`);
    console.log(`   - 插入失败: ${errorCount} 条`);
    console.log(`   - 数据库总记录: ${totalRecords} 条`);
    
    // 7. 显示按流程类型的统计
    console.log('\n📈 按流程类型统计:');
    const statsSQL = `
      SELECT 
        CASE 
          WHEN activity_id LIKE 'MK%' THEN '营销流程'
          WHEN activity_id LIKE 'PU%' THEN '采购流程' 
          WHEN activity_id LIKE 'PD%' THEN '生产流程'
          WHEN activity_id LIKE 'OP%' THEN '运维流程'
          ELSE '其他'
        END as process_type,
        activity_risk,
        COUNT(*) as count
      FROM dm_topic0101_output_risk 
      WHERE del_flag = '0'
      GROUP BY process_type, activity_risk
      ORDER BY process_type, activity_risk
    `;
    
    const statsResult = await mysqlService.executeCustomQuery(statsSQL);
    if (statsResult.success) {
      statsResult.data.forEach(row => {
        console.log(`   ${row.process_type} - ${row.activity_risk}风险: ${row.count} 个节点`);
      });
    }
    
  } catch (error) {
    console.error('❌ 导入过程中发生错误:', error.message);
  } finally {
    await mysqlService.disconnect();
  }
}

// 运行导入
if (require.main === module) {
  importRiskData();
}

module.exports = importRiskData;
