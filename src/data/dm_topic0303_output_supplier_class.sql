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

 Date: 14/10/2025 17:04:55
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dm_topic0303_output_supplier_class
-- ----------------------------
DROP TABLE IF EXISTS `dm_topic0303_output_supplier_class`;
CREATE TABLE `dm_topic0303_output_supplier_class`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `model_run_batch` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '模型运行批次标记',
  `supplier_id` int(11) NOT NULL DEFAULT -1 COMMENT '供应商ID',
  `material_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '物料编码',
  `class_label` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '分类标签（高稳定/中稳定/低稳定）',
  `remark` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '备注',
  `del_flag` int(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除标识',
  `create_id` int(11) NOT NULL DEFAULT -1 COMMENT '创建者ID',
  `create_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '创建者姓名',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_id` int(11) NOT NULL DEFAULT -1 COMMENT '更新者ID',
  `update_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '更新者姓名',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 223 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '课题3-模型3 输出-供应商分类结果表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of dm_topic0303_output_supplier_class
-- ----------------------------
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (200, '2025-10-12_TSY_HSR_01', 3101, 'HSR-PLATE-Q550D', '高稳定', '交付率97.8%,价格波动5.3%,综合表现优秀', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (201, '2025-10-12_TSY_HSR_01', 3101, 'HSR-AXLE-25T', '高稳定', '交付率96.2%,价格波动5.0%,稳定供应', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (202, '2025-10-12_TSY_HSR_01', 3104, 'HSR-PLATE-Q550D', '高稳定', '交付率98.5%,价格波动5.4%,高品质稳定', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (203, '2025-10-12_TSY_HSR_01', 3104, 'HSR-AXLE-25T', '高稳定', '交付率97.5%,价格波动3.6%,表现稳定', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (204, '2025-10-12_TSY_HSR_01', 3105, 'HSR-PLATE-Q550D', '高稳定', '交付率97.0%,价格波动5.1%,大批量稳定', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (205, '2025-10-12_TSY_HSR_01', 3105, 'HSR-AXLE-25T', '高稳定', '交付率96.8%,价格波动4.9%,性价比优', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (206, '2025-10-12_TSY_HSR_01', 3102, 'HSR-TM-350kW', '高稳定', '交付率94.5%,价格波动2.6%,性能稳定', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (207, '2025-10-12_TSY_HSR_01', 3102, 'HSR-GEARBOX-T1', '中稳定', '交付率93.8%,价格波动4.3%,波动适中', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (208, '2025-10-12_TSY_HSR_01', 3107, 'HSR-TM-350kW', '高稳定', '交付率96.2%,价格波动2.4%,技术领先', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (209, '2025-10-12_TSY_HSR_01', 3107, 'HSR-GEARBOX-T1', '高稳定', '交付率95.5%,价格波动4.0%,精密制造', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (210, '2025-10-12_TSY_HSR_01', 3108, 'HSR-TM-350kW', '中稳定', '交付率93.8%,价格波动2.3%,性价比优', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (211, '2025-10-12_TSY_HSR_01', 3108, 'HSR-GEARBOX-T1', '中稳定', '交付率93.2%,价格波动4.0%,配套供应', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (212, '2025-10-12_TSY_HSR_01', 3103, 'HSR-PANTO-ZH120', '高稳定', '交付率95.6%,价格波动4.0%,系列产品', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (213, '2025-10-12_TSY_HSR_01', 3103, 'HSR-BD-850', '高稳定', '交付率96.8%,价格波动4.1%,质量优良', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (214, '2025-10-12_TSY_HSR_01', 3103, 'HSR-DOOR-MOD', '高稳定', '交付率95.1%,价格波动3.6%,模块完整', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (215, '2025-10-12_TSY_HSR_01', 3103, 'HSR-HVAC-35kW', '高稳定', '交付率94.9%,价格波动3.0%,综合能力强', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (216, '2025-10-12_TSY_HSR_01', 3111, 'HSR-DOOR-MOD', '高稳定', '交付率96.5%,价格波动3.7%,行业领先', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (217, '2025-10-12_TSY_HSR_01', 3111, 'HSR-BD-850', '高稳定', '交付率95.8%,价格波动4.8%,配套可靠', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (218, '2025-10-12_TSY_HSR_01', 3111, 'HSR-PANTO-ZH120', '高稳定', '交付率94.8%,价格波动4.1%,系统集成', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (219, '2025-10-12_TSY_HSR_01', 3112, 'HSR-BD-850', '高稳定', '交付率97.5%,价格波动4.4%,国际品质', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (220, '2025-10-12_TSY_HSR_01', 3112, 'HSR-HVAC-35kW', '高稳定', '交付率96.2%,价格波动3.5%,技术成熟', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (221, '2025-10-12_TSY_HSR_01', 3112, 'HSR-PANTO-ZH120', '高稳定', '交付率94.2%,价格波动3.6%,配套完善', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');
INSERT INTO `dm_topic0303_output_supplier_class` VALUES (222, '2025-10-12_TSY_HSR_01', 3112, 'HSR-DOOR-MOD', '高稳定', '交付率94.5%,价格波动4.7%,集成能力强', 0, -1, '', '2025-10-14 16:00:00', -1, '', '2025-10-14 16:00:00');

SET FOREIGN_KEY_CHECKS = 1;
