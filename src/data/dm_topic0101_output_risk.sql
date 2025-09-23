/*
 Navicat Premium Data Transfer

 Source Server         : ROOT
 Source Server Type    : MySQL
 Source Server Version : 90300
 Source Host           : localhost:3306
 Source Schema         : sys

 Target Server Type    : MySQL
 Target Server Version : 90300
 File Encoding         : 65001

 Date: 21/09/2025 15:03:23
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dm_topic0101_output_risk
-- ----------------------------
DROP TABLE IF EXISTS `dm_topic0101_output_risk`;
CREATE TABLE `dm_topic0101_output_risk`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `model_run_batch` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '模型运行批次标记',
  `activity_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '-1' COMMENT '流程id',
  `activity_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '流程名称',
  `activity_risk` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '风险水平',
  `remark` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '备注',
  `del_flag` int NOT NULL DEFAULT 0 COMMENT '逻辑删除标识',
  `create_id` int NOT NULL DEFAULT -1 COMMENT '创建者ID',
  `create_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '创建者姓名',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_id` int NOT NULL DEFAULT -1 COMMENT '更新者ID',
  `update_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '更新者姓名',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '课题1风险模型企业出参' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dm_topic0101_output_risk
-- ----------------------------
INSERT INTO `dm_topic0101_output_risk` VALUES (1, '2025-09-08_TSY_RISK_01', 'MK1', '获取市场需求信息', '中', '市场需求不确定性较高', 0, -1, '', '2025-09-08 14:07:21', -1, '', '2025-09-08 14:07:21');
INSERT INTO `dm_topic0101_output_risk` VALUES (2, '2025-09-08_TSY_RISK_01', 'MK5', '发掘客户需求', '高', '关键客户依赖度过大', 0, -1, '', '2025-09-08 14:07:21', -1, '', '2025-09-08 14:07:21');
INSERT INTO `dm_topic0101_output_risk` VALUES (3, '2025-09-08_TSY_RISK_01', 'MK13', '确定产品和价格策略', '中', '原材料价格波动影响定价', 0, -1, '', '2025-09-08 14:07:21', -1, '', '2025-09-08 14:07:21');
INSERT INTO `dm_topic0101_output_risk` VALUES (4, '2025-09-08_TSY_RISK_01', 'MK27', '项目中标', '低', '项目竞争压力一般', 0, -1, '', '2025-09-08 14:07:21', -1, '', '2025-09-08 14:07:21');
INSERT INTO `dm_topic0101_output_risk` VALUES (5, '2025-09-08_TSY_RISK_01', 'MK30', '交付回款', '中', '客户回款能力不足', 0, -1, '', '2025-09-08 14:07:21', -1, '', '2025-09-13 16:09:23');
INSERT INTO `dm_topic0101_output_risk` VALUES (6, '2025-09-08_TSY_RISK_01', 'PU1', '计划整合确定', '中', '供应计划波动', 0, -1, '', '2025-09-08 14:07:21', -1, '', '2025-09-08 14:07:21');
INSERT INTO `dm_topic0101_output_risk` VALUES (7, '2025-09-08_TSY_RISK_01', 'PU6', '生产物资供应商准入管理', '中', '部分供应商资质不稳定', 0, -1, '', '2025-09-08 14:07:21', -1, '', '2025-09-13 16:10:11');
INSERT INTO `dm_topic0101_output_risk` VALUES (8, '2025-09-08_TSY_RISK_01', 'PU14', '采购限价制定', '中', '市场价格波动影响限价合理性', 0, -1, '', '2025-09-08 14:07:21', -1, '', '2025-09-08 14:07:21');
INSERT INTO `dm_topic0101_output_risk` VALUES (9, '2025-09-08_TSY_RISK_01', 'PU22', '采购合同起草', '低', '流程规范，风险可控', 0, -1, '', '2025-09-08 14:07:21', -1, '', '2025-09-08 14:07:21');
INSERT INTO `dm_topic0101_output_risk` VALUES (10, '2025-09-08_TSY_RISK_01', 'PU25', '物料供应', '高', '质量不合格风险', 0, -1, '', '2025-09-08 14:07:21', -1, '', '2025-09-13 15:28:30');
INSERT INTO `dm_topic0101_output_risk` VALUES (11, '2025-09-08_TSY_RISK_01', 'PD1', '物料清单BOM', '中', '设计变更频繁', 0, -1, '', '2025-09-08 14:07:21', -1, '', '2025-09-08 14:07:21');
INSERT INTO `dm_topic0101_output_risk` VALUES (12, '2025-09-08_TSY_RISK_01', 'PD5', '创建生产订单', '低', '系统运行稳定', 0, -1, '', '2025-09-08 14:07:21', -1, '', '2025-09-08 14:07:21');
INSERT INTO `dm_topic0101_output_risk` VALUES (13, '2025-09-08_TSY_RISK_01', 'PD13', '转向架焊接', '中', '工装夹具短缺', 0, -1, '', '2025-09-08 14:07:21', -1, '', '2025-09-13 15:28:54');
INSERT INTO `dm_topic0101_output_risk` VALUES (14, '2025-09-08_TSY_RISK_01', 'PD23', '最终装配', '高', '人工工时紧张', 0, -1, '', '2025-09-08 14:07:21', -1, '', '2025-09-13 15:29:00');
INSERT INTO `dm_topic0101_output_risk` VALUES (15, '2025-09-08_TSY_RISK_01', 'PD28', '生产交付', '中', '交期延误风险', 0, -1, '', '2025-09-08 14:07:21', -1, '', '2025-09-13 15:29:13');
INSERT INTO `dm_topic0101_output_risk` VALUES (16, '2025-09-08_TSY_RISK_01', 'OP1', '里程数周期性维护', '低', '维保计划执行较好', 0, -1, '', '2025-09-08 14:07:21', -1, '', '2025-09-08 14:07:21');
INSERT INTO `dm_topic0101_output_risk` VALUES (17, '2025-09-08_TSY_RISK_01', 'OP5', '检查现场情况', '中', '部分现场反馈滞后', 0, -1, '', '2025-09-08 14:07:21', -1, '', '2025-09-08 14:07:21');
INSERT INTO `dm_topic0101_output_risk` VALUES (18, '2025-09-08_TSY_RISK_01', 'OP7', '设备维保', '高', '设备维修时间过长', 0, -1, '', '2025-09-08 14:07:21', -1, '', '2025-09-13 16:11:01');
INSERT INTO `dm_topic0101_output_risk` VALUES (19, '2025-09-08_TSY_RISK_01', 'OP19', '确定运维方案', '中', '方案优化空间较大', 0, -1, '', '2025-09-08 14:07:21', -1, '', '2025-09-08 14:07:21');
INSERT INTO `dm_topic0101_output_risk` VALUES (20, '2025-09-08_TSY_RISK_01', 'OP26', '运维信息反馈', '中', '客户反馈滞后，存在积压风险', 0, -1, '', '2025-09-08 14:07:21', -1, '', '2025-09-13 16:10:16');

SET FOREIGN_KEY_CHECKS = 1;
