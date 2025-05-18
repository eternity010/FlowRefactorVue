/**
 * 统一导出所有环节的实现流程数据和工具函数
 */

import { purchaseImplementation } from './purchaseImpl';

// 映射类型到对应的实现数据
const implementationMap = {
  'purchase': purchaseImplementation,
  // 其他环节将来添加
  // 'operation': operationImplementation,
  // 'production': productionImplementation,
  // 'marketing': marketingImplementation
};

/**
 * 获取节点实现流程详细信息
 * @param {string} type 流程类型：operation, purchase, production, marketing
 * @param {string} nodeId 节点ID
 * @returns {object|null} 节点实现流程详细信息或null
 */
export function getNodeImplementation(type, nodeId) {
  const implementationData = implementationMap[type];
  if (!implementationData || !implementationData[nodeId]) {
    return null;
  }
  return implementationData[nodeId];
}

/**
 * 获取节点备用实现流程详细信息
 * @param {string} type 流程类型：operation, purchase, production, marketing
 * @param {string} nodeId 节点ID
 * @returns {object|null} 节点备用实现流程详细信息或null
 */
export function getNodeBackupImplementation(type, nodeId) {
  const implementationData = implementationMap[type];
  if (!implementationData || !implementationData[nodeId] || !implementationData[nodeId].backupImplementation) {
    return null;
  }
  return implementationData[nodeId].backupImplementation;
}

/**
 * 检查节点是否有备用实现流程
 * @param {string} type 流程类型：operation, purchase, production, marketing
 * @param {string} nodeId 节点ID
 * @returns {boolean} 是否存在备用实现流程
 */
export function hasNodeBackupImplementation(type, nodeId) {
  return !!getNodeBackupImplementation(type, nodeId);
}

/**
 * 更新节点的备用流程启用状态
 * @param {string} type 流程类型：operation, purchase, production, marketing
 * @param {string} nodeId 节点ID
 * @param {boolean} enabled 是否启用备用流程
 * @returns {boolean} 更新是否成功
 */
export function updateBackupFlowStatus(type, nodeId, enabled) {
  const implementationData = implementationMap[type];
  if (!implementationData || !implementationData[nodeId]) {
    return false;
  }
  
  // 检查是否有备用流程可切换
  if (enabled && !implementationData[nodeId].backupImplementation) {
    return false;
  }
  
  // 更新状态
  implementationData[nodeId].isBackupEnabled = enabled;
  return true;
}

/**
 * 获取节点的备用流程启用状态
 * @param {string} type 流程类型：operation, purchase, production, marketing
 * @param {string} nodeId 节点ID
 * @returns {boolean} 是否启用了备用流程
 */
export function getBackupFlowStatus(type, nodeId) {
  const implementationData = implementationMap[type];
  if (!implementationData || !implementationData[nodeId]) {
    return false;
  }
  
  return !!implementationData[nodeId].isBackupEnabled;
}

/**
 * 获取指定环节中所有具有备用实现流程的节点ID列表
 * @param {string} type 流程类型：operation, purchase, production, marketing
 * @returns {Array<string>} 具有备用实现流程的节点ID列表
 */
export function getNodesWithBackupImplementation(type) {
  const implementationData = implementationMap[type];
  if (!implementationData) {
    return [];
  }
  
  return Object.keys(implementationData).filter(nodeId => 
    implementationData[nodeId] && implementationData[nodeId].backupImplementation
  );
}

// 导出所有实现数据，便于需要时直接访问
export {
  purchaseImplementation
  // 将来可以添加其他环节
  // operationImplementation,
  // productionImplementation,
  // marketingImplementation
}; 