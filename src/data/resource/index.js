/**
 * 资源数据索引文件 - 简化版
 * 提供获取节点资源数据的工具函数
 */

import { purchaseResources, purchaseNodesMap } from './purchaseResources';
import { productionResources } from './productionResources';
import { marketingResources } from './marketingResources';
import { operationResources, operationNodesMap } from './operationResources';
import purchaseResourceDetails from './purchaseResourceDetails';
import productionResourceDetails from './productionResourceDetails';
import marketingResourceDetails from './marketingResourceDetails';
import operationResourceDetails from './operationResourceDetails';

// 映射环节类型到资源数据
const resourcesMap = {
  'purchase': purchaseResources,
  'production': productionResources,
  'marketing': marketingResources,
  'operation': operationResources
};

// 映射环节类型到资源详情数据
const resourceDetailsMap = {
  'purchase': purchaseResourceDetails,
  'production': productionResourceDetails,
  'marketing': marketingResourceDetails,
  'operation': operationResourceDetails
};

// 映射环节类型到节点ID和名称映射
const nodesMap = {
  'purchase': purchaseNodesMap,
  'operation': operationNodesMap
};

/**
 * 获取节点的资源数据
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
 * 获取节点特定类型的资源
 * @param {string} type 环节类型
 * @param {string} nodeId 节点ID
 * @param {string} resourceType 资源类型: documents, personnel, systems, equipment, others
 * @returns {Object|null} 资源数据或null
 */
export function getResourceType(type, nodeId, resourceType) {
  const resources = getNodeResources(type, nodeId);
  if (!resources || !resources[resourceType]) {
    return null;
  }
  return resources[resourceType];
}

/**
 * 获取节点资源详细信息
 * @param {string} type 环节类型
 * @param {string} nodeId 节点ID
 * @returns {Object|null} 详细资源数据或null
 */
export function getNodeResourceDetails(type, nodeId) {
  if (!resourceDetailsMap[type] || !resourceDetailsMap[type][nodeId]) {
    return null;
  }
  return resourceDetailsMap[type][nodeId];
}

/**
 * 获取环节的节点ID和名称映射
 * @param {string} type 环节类型: purchase, production, marketing, operation
 * @returns {Object|null} 节点映射或null
 */
export function getNodesMap(type) {
  if (!nodesMap[type]) {
    return null;
  }
  return nodesMap[type];
}

/**
 * 获取节点名称
 * @param {string} type 环节类型
 * @param {string} nodeId 节点ID
 * @returns {string|null} 节点名称或null
 */
export function getNodeName(type, nodeId) {
  const map = getNodesMap(type);
  if (!map || !map[nodeId]) {
    return null;
  }
  return map[nodeId];
}

// 导出资源数据
export { 
  purchaseResources,
  productionResources,
  marketingResources,
  operationResources,
  purchaseResourceDetails,
  productionResourceDetails,
  marketingResourceDetails,
  operationResourceDetails,
  purchaseNodesMap,
  operationNodesMap
}; 