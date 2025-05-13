/**
 * 资源数据索引文件 - 简化版
 */

import { purchaseResources } from './purchaseResources';

// 映射环节类型到对应资源数据
const resourcesMap = {
  'purchase': purchaseResources
  // 将来可添加其他环节
};

/**
 * 获取指定环节节点的资源数据
 * @param {string} type 环节类型: purchase, production, marketing, operation
 * @param {string} nodeId 节点ID
 * @returns {Object|null} 资源数据或null
 */
export function getNodeResources(type, nodeId) {
  if (!resourcesMap[type] || !resourcesMap[type][nodeId]) {
    return null;
  }
  return resourcesMap[type][nodeId];
}

/**
 * 获取指定节点的资源数量统计
 * @param {string} type 环节类型: purchase, production, marketing, operation
 * @param {string} nodeId 节点ID
 * @returns {Object|null} 资源数量统计或null
 */
export function getResourcesCount(type, nodeId) {
  const resources = getNodeResources(type, nodeId);
  if (!resources || !resources.resources) {
    return null;
  }
  return resources.resources;
}

/**
 * 获取指定节点的属性列表
 * @param {string} type 环节类型: purchase, production, marketing, operation
 * @param {string} nodeId 节点ID
 * @returns {Array|null} 属性列表或null
 */
export function getNodeAttributes(type, nodeId) {
  const resources = getNodeResources(type, nodeId);
  if (!resources || !resources.attributes) {
    return null;
  }
  return resources.attributes;
}

// 导出资源数据
export { purchaseResources }; 