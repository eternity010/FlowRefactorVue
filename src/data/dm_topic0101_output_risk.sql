/*
 Navicat Premium Data Transfer

 Source Server         : 熊猫电子数据库
 Source Server Type    : MySQL
 Source Server Version : 50644
 Source Host           : 47.103.58.58:3306
 Source Schema         : ods_202509

 Target Server Type    : MySQL
 Target Server Version : 50644
 File Encoding         : 65001

 Date: 25/09/2025 20:41:08
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dm_topic0101_output_risk
-- ----------------------------
DROP TABLE IF EXISTS `dm_topic0101_output_risk`;
CREATE TABLE `dm_topic0101_output_risk`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `model_run_batch` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '模型运行批次标记',
  `activity_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '-1' COMMENT '流程id',
  `activity_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '流程名称',
  `activity_risk` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '风险水平',
  `remark` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '备注',
  `del_flag` int(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除标识',
  `create_id` int(11) NOT NULL DEFAULT -1 COMMENT '创建者ID',
  `create_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '创建者姓名',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_id` int(11) NOT NULL DEFAULT -1 COMMENT '更新者ID',
  `update_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '更新者姓名',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 117 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '课题1风险模型企业出参' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of dm_topic0101_output_risk
-- ----------------------------
INSERT INTO `dm_topic0101_output_risk` VALUES (1, 'BATCH_20250924_090717', 'PU1', '计划整合确定', '36.07', '物流不确定性提升运输风险', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (2, 'BATCH_20250924_090717', 'PU2', '品类管理', '30.88', '系统运行稳定', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (3, 'BATCH_20250924_090717', 'PU3', '技术规格拆解', '42.12', '物流不确定性提升运输风险', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (4, 'BATCH_20250924_090717', 'PU4', '确定工程物料清单（EBOM）', '34.95', '物流不确定性提升运输风险', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (5, 'BATCH_20250924_090717', 'PU5', '确定制造物料清单（MBOM）', '48.65', '库存结构不合理，占用资金', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (6, 'BATCH_20250924_090717', 'PU6', '生产物资供应商准入管理', '46.11', '流程规范，风险可控', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (7, 'BATCH_20250924_090717', 'PU7', '装备设施类供应商准入管理', '27.6', '原材料价格波动影响成本控制', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (8, 'BATCH_20250924_090717', 'PU8', '信息化类供应商准入管理', '55.99', '物流不确定性提升运输风险', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (9, 'BATCH_20250924_090717', 'PU9', '供应商考核评价', '35.46', '物流不确定性提升运输风险', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (10, 'BATCH_20250924_090717', 'PU10', '供应商日常管理', '41.82', '系统运行稳定', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (11, 'BATCH_20250924_090717', 'PU11', '平台采购需求', '20.74', '部分供应商资质及交付稳定性欠佳', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (12, 'BATCH_20250924_090717', 'PU12', '采购方案编制', '48.32', '流程规范，风险可控', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (13, 'BATCH_20250924_090717', 'PU13', '采购申请', '33.25', '库存结构不合理，占用资金', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (14, 'BATCH_20250924_090717', 'PU14', '采购限价制定', '19.07', '供需计划波动，存在缺料风险', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (15, 'BATCH_20250924_090717', 'PU15', '采购文件制定', '39.65', '系统运行稳定', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (16, 'BATCH_20250924_090717', 'PU16', '招标采购', '23.25', '关键物料交期偏长，需提前锁单', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (17, 'BATCH_20250924_090717', 'PU17', '询比采购', '34.4', '关键物料交期偏长，需提前锁单', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (18, 'BATCH_20250924_090717', 'PU18', '竞价采购', '33.88', '库存结构不合理，占用资金', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (19, 'BATCH_20250924_090717', 'PU19', '谈判采购', '23.31', '到货质量波动，来料检验压力增大', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (20, 'BATCH_20250924_090717', 'PU20', '直接采购', '23.56', '交期延误风险', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (21, 'BATCH_20250924_090717', 'PU21', '招投标公示', '36.62', '交期延误风险', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (22, 'BATCH_20250924_090717', 'PU22', '采购合同起草', '14.27', '流程规范，风险可控', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (23, 'BATCH_20250924_090717', 'PU23', '合同审批', '22.81', '竞争对手价格战风险', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (24, 'BATCH_20250924_090717', 'PU24', '合同归档', '31.22', '渠道协同不足，线索转化偏低', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (25, 'BATCH_20250924_090717', 'PU25', '物料供应', '80.25', '到货质量波动，来料检验压力增大', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (26, 'BATCH_20250924_090717', 'PU26', '物料入库', '31.85', '流程规范，风险可控', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (27, 'BATCH_20250924_090717', 'PU27', '物料验收', '26.23', '现场协调压力加大', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (28, 'BATCH_20250924_090717', 'PU28', '物料仓储管理', '30.34', '流程规范，风险可控', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (29, 'BATCH_20250924_090717', 'OR1', 'OR', '47.07', '上下游接口多，沟通成本较高', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (30, 'BATCH_20250924_090717', 'OR2', 'OR', '11.61', '流程规范，风险可控', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (31, 'BATCH_20250924_090717', 'MK1', '获取市场需求信息', '32.92', '合同条款限制较多，议价空间有限', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (32, 'BATCH_20250924_090717', 'MK2', '分析市场机会', '25.61', '回款周期长导致资金压力', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (33, 'BATCH_20250924_090717', 'MK3', '定位目标市场', '34.56', '现场协调压力加大', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (34, 'BATCH_20250924_090717', 'MK4', '确定潜在客户', '18.71', '回款周期长导致资金压力', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (35, 'BATCH_20250924_090717', 'MK5', '发掘客户需求', '85.42', '招投标流程复杂，合规风险需关注', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (36, 'BATCH_20250924_090717', 'MK6', '编制技术方案', '28.15', '关键客户依赖度过大', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (37, 'BATCH_20250924_090717', 'MK7', '沟通客户需求', '45.24', '市场机会明确，流程规范，风险可控', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (38, 'BATCH_20250924_090717', 'MK8', '提供技术支持提供人员支持', '27.71', '竞争对手价格战风险', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (39, 'BATCH_20250924_090717', 'MK9', '提供LCC支持', '40.58', '市场机会明确，流程规范，风险可控', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (40, 'BATCH_20250924_090717', 'MK10', '提供原材料采购成本及询价支持', '28.01', '系统运行稳定', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (41, 'BATCH_20250924_090717', 'MK11', '提供用工和人工成本支持', '33.11', '市场机会明确，流程规范，风险可控', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (42, 'BATCH_20250924_090717', 'MK12', '提供成本和财务支持', '32.59', '关键客户依赖度过大', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (43, 'BATCH_20250924_090717', 'MK13', '确定产品和价格策略', '21.41', '渠道协同不足，线索转化偏低', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (44, 'BATCH_20250924_090717', 'MK14', '提供技术支持提供人员支持', '37.84', '渠道协同不足，线索转化偏低', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (45, 'BATCH_20250924_090717', 'MK15', '提供品牌推广提供公司宣传', '20.06', '关键客户依赖度过大', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (46, 'BATCH_20250924_090717', 'MK16', '进行风险评估及法律支持', '38.08', '成本波动需关注', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (47, 'BATCH_20250924_090717', 'MK17', '确定渠道和销售策略', '42.91', '关键客户依赖度过大', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (48, 'BATCH_20250924_090717', 'MK18', '提供技术支持提供人员支持', '21.16', '订单预测偏差大，影响产能配置', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (49, 'BATCH_20250924_090717', 'MK19', '提供品牌推广提供公司宣传', '35.92', '市场机会明确，流程规范，风险可控', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (50, 'BATCH_20250924_090717', 'MK20', '进行风险评估及法律支持', '10.77', '招投标流程复杂，合规风险需关注', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (51, 'BATCH_20250924_090717', 'MK21', '开展知识产权管理', '23.11', '市场需求不确定性较高', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (52, 'BATCH_20250924_090717', 'MK22', '建立客户档案分类管理客户评价客户信誉', '24.93', '竞争对手价格战风险', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (53, 'BATCH_20250924_090717', 'MK23', '项目立项', '30.65', '合同条款限制较多，议价空间有限', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (54, 'BATCH_20250924_090717', 'MK24', '招标文件评审', '41.83', '回款周期长导致资金压力', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (55, 'BATCH_20250924_090717', 'MK25', '制作投标文件', '35.2', '流程规范，风险可控', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (56, 'BATCH_20250924_090717', 'MK26', '投标文件评审', '40.21', '招投标流程复杂，合规风险需关注', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (57, 'BATCH_20250924_090717', 'MK27', '项目中标', '41.39', '回款周期长导致资金压力', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (58, 'BATCH_20250924_090717', 'MK28', '合同签署', '41.56', '回款周期长导致资金压力', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (59, 'BATCH_20250924_090717', 'MK29', '合同执行', '39.48', '市场需求不确定性较高', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (60, 'BATCH_20250924_090717', 'MK30', '交付回款', '19.29', '资源紧张导致瓶颈', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (61, 'BATCH_20250924_090717', 'PD1', '物料清单BOM', '51.56', '原材料价格波动影响成本控制', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (62, 'BATCH_20250924_090717', 'PD2', '录入生产信息', '21.19', '质量不合格风险，需要加强过程控制', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (63, 'BATCH_20250924_090717', 'PD3', '编制阶段计划', '30.98', '备料齐套率较高，风险可控', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (64, 'BATCH_20250924_090717', 'PD4', '编制工位计划', '28.28', '关键物料交期偏长，需提前锁单', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (65, 'BATCH_20250924_090717', 'PD5', '创建生产订单', '43.04', '订单预测偏差大，影响产能配置', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (66, 'BATCH_20250924_090717', 'PD6', '开工前发料', '24.72', '现场5M1E变动大，过程波动风险', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (67, 'BATCH_20250924_090717', 'PD7', '生产设备点检', '35.97', '质量不合格风险，需要加强过程控制', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (68, 'BATCH_20250924_090717', 'PD8', '生产订单派工', '20.74', '渠道协同不足，线索转化偏低', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (69, 'BATCH_20250924_090717', 'PD9', '金属加工', '26.37', '质量不合格风险，需要加强过程控制', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (70, 'BATCH_20250924_090717', 'PD10', '电气、电子件加工', '12.29', '质量不合格风险，需要加强过程控制', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (71, 'BATCH_20250924_090717', 'PD11', '非金属件加工', '39.39', '工装夹具短缺，换线效率受限', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (72, 'BATCH_20250924_090717', 'PD12', '车体焊接', '27.28', '人员技能不均，操作一致性不足', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (73, 'BATCH_20250924_090717', 'PD13', '转向架焊接', '44.32', '系统运行稳定', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (74, 'BATCH_20250924_090717', 'PD14', '辅助结构焊接', '15.08', '成本波动需关注', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (75, 'BATCH_20250924_090717', 'PD15', '车体涂装处理', '38.94', '流程规范，风险可控', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (76, 'BATCH_20250924_090717', 'PD16', '零部件涂装处理', '10.31', '人员技能不均，操作一致性不足', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (77, 'BATCH_20250924_090717', 'PD17', '车体总成', '28.62', '质量不合格风险，需要加强过程控制', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (78, 'BATCH_20250924_090717', 'PD18', '转向架总成', '16.33', '现场5M1E变动大，过程波动风险', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (79, 'BATCH_20250924_090717', 'PD19', '牵引系统总成', '39.21', '工装夹具短缺，换线效率受限', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (80, 'BATCH_20250924_090717', 'PD20', '辅助系统总成', '11.08', '人员技能不均，操作一致性不足', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (81, 'BATCH_20250924_090717', 'PD21', '车体模块连接', '59.51', '系统运行稳定', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (82, 'BATCH_20250924_090717', 'PD22', '电气系统布线', '36.84', '现场协调压力加大', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (83, 'BATCH_20250924_090717', 'PD23', '最终装配', '89.69', '交期延误风险，需要加班保障', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (84, 'BATCH_20250924_090717', 'PD24', '功能测试', '27.29', '现场协调压力加大', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (85, 'BATCH_20250924_090717', 'PD25', '整机可靠性试验', '31.96', '交期延误风险，需要加班保障', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (86, 'BATCH_20250924_090717', 'PD26', '生产完工', '27.7', '流程规范，风险可控', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (87, 'BATCH_20250924_090717', 'PD27', '订单报工', '37.74', '市场需求不确定性较高', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (88, 'BATCH_20250924_090717', 'PD28', '生产交付', '31.7', '生产负荷高，产能紧张', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (89, 'BATCH_20250924_090717', 'PD29', '产品质量档案', '30.45', '现场协调压力加大', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (90, 'BATCH_20250924_090717', 'OP1', '里程数周期性维护', '23.58', '资源紧张导致瓶颈', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (91, 'BATCH_20250924_090717', 'OP2', '客户整改需求', '33.66', '招投标流程复杂，合规风险需关注', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (92, 'BATCH_20250924_090717', 'OP3', '故障报警', '18.07', '上下游接口多，沟通成本较高', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (93, 'BATCH_20250924_090717', 'OP4', '安排维修人员', '39.69', '维保计划执行较好，风险可控', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (94, 'BATCH_20250924_090717', 'OP5', '检查现场情况', '33.04', '项目计划多变，现场协调压力大', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (95, 'BATCH_20250924_090717', 'OP6', '现场情况分析', '16.36', '安装环境受限，进度风险', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (96, 'BATCH_20250924_090717', 'OP7', '设备维保', '86.01', '备件保障不足，维修周期偏长', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (97, 'BATCH_20250924_090717', 'OP8', '是否存在故障', '14.1', '系统运行稳定', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (98, 'BATCH_20250924_090717', 'OP9', '是否需要返厂', '21.99', '成本波动需关注', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (99, 'BATCH_20250924_090717', 'OP10', '现场修', '29.86', '物流节点多，途中丢损风险', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (100, 'BATCH_20250924_090717', 'OP11', '返厂修', '57.32', '流程规范，风险可控', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (101, 'BATCH_20250924_090717', 'OP12', '是否需要技术支持', '27.7', '系统运行稳定', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (102, 'BATCH_20250924_090717', 'OP13', '选择已有方案', '12.49', '图纸发布延迟影响排产', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (103, 'BATCH_20250924_090717', 'OP14', '设计部门支持', '31.99', '技术评审覆盖不全，需求偏差风险', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (104, 'BATCH_20250924_090717', 'OP15', '工艺部门支持', '53.75', '上下游接口多，沟通成本较高', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (105, 'BATCH_20250924_090717', 'OP16', '质量管理部门支持', '15.22', '信息同步不及时，存在延误风险', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (106, 'BATCH_20250924_090717', 'OP17', '供应商支持', '12.89', '系统运行稳定', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (107, 'BATCH_20250924_090717', 'OP18', '事业部门支持', '13.14', '上下游接口多，沟通成本较高', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (108, 'BATCH_20250924_090717', 'OP19', '确定运维方案', '28.86', '资源紧张导致瓶颈', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (109, 'BATCH_20250924_090717', 'OP20', '人员派遣', '27.13', '信息同步不及时，存在延误风险', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (110, 'BATCH_20250924_090717', 'OP21', '备件供应', '27.06', '备料齐套率较高，风险可控', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (111, 'BATCH_20250924_090717', 'OP22', '费用管理', '32.71', '信息同步不及时，存在延误风险', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (112, 'BATCH_20250924_090717', 'OP23', '执行运维方案', '30.46', '仿真与实测差异较大，需二次验证', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (113, 'BATCH_20250924_090717', 'OP24', '维修效果检验', '20.63', '流程规范，风险可控', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (114, 'BATCH_20250924_090717', 'OP25', '是否需要改进', '39.08', '流程规范，风险可控', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (115, 'BATCH_20250924_090717', 'OP26', '运维信息反馈', '17.55', '成本波动需关注', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');
INSERT INTO `dm_topic0101_output_risk` VALUES (116, 'BATCH_20250924_090717', 'OP27', '技术文件更新', '35.14', '信息同步不及时，存在延误风险', 0, -1, 'system', '2025-09-24 09:07:17', -1, 'system', '2025-09-24 09:07:17');

SET FOREIGN_KEY_CHECKS = 1;
