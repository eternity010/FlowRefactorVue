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

 Date: 12/10/2025 17:41:38
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dm_topic0403_input_supplier_material
-- ----------------------------
DROP TABLE IF EXISTS `dm_topic0403_input_supplier_material`;
CREATE TABLE `dm_topic0403_input_supplier_material`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `model_run_batch` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '模型运行批次',
  `supplier_id` int(11) NOT NULL DEFAULT -1 COMMENT '供应商ID',
  `material_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '物料编码',
  `avg_price` decimal(18, 6) NOT NULL DEFAULT 0.000000 COMMENT '平均报价',
  `price_range_min` decimal(18, 6) NOT NULL DEFAULT 0.000000 COMMENT '历史最低价格',
  `price_range_max` decimal(18, 6) NOT NULL DEFAULT 0.000000 COMMENT '历史最高价格',
  `lead_time_days` int(11) NOT NULL DEFAULT 0 COMMENT '平均交期(天)',
  `on_time_rate` decimal(5, 2) NOT NULL DEFAULT 0.00 COMMENT '准时交付率(%)',
  `defect_rate` decimal(5, 2) NOT NULL DEFAULT 0.00 COMMENT '不良率(%)',
  `capacity_level` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '供货能力等级',
  `transport_mode` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '常用运输方式',
  `avg_transport_cost` decimal(18, 2) NOT NULL DEFAULT 0.00 COMMENT '平均运输成本',
  `remark` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '备注',
  `del_flag` int(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2009 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '课题4-模型3 入参-供应商物料能力表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of dm_topic0403_input_supplier_material
-- ----------------------------
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (101, '2025-10-12_TSY_HSR_01', 3101, 'HSR-PLATE-Q550D', 6.800000, 6.500000, 7.200000, 5, 97.80, 0.40, '高', '铁运', 900.00, '转向架桥壳用Q550D板，常备库存', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (102, '2025-10-12_TSY_HSR_01', 3101, 'HSR-AXLE-25T', 1050.000000, 1000.000000, 1100.000000, 12, 96.20, 0.60, '中', '铁运', 1300.00, '25T级车轴坯件', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (103, '2025-10-12_TSY_HSR_01', 3104, 'HSR-PLATE-Q550D', 6.500000, 6.200000, 6.900000, 7, 98.50, 0.30, '高', '铁运', 1200.00, '宝钢高品质Q550D，质量稳定', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (104, '2025-10-12_TSY_HSR_01', 3104, 'HSR-AXLE-25T', 980.000000, 950.000000, 1020.000000, 10, 97.50, 0.40, '高', '铁运', 1500.00, '特种钢车轴坯，高强度', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (105, '2025-10-12_TSY_HSR_01', 3105, 'HSR-PLATE-Q550D', 6.900000, 6.600000, 7.300000, 6, 97.00, 0.50, '高', '铁运', 1100.00, '鞍钢Q550D板材，大批量供应', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (106, '2025-10-12_TSY_HSR_01', 3105, 'HSR-AXLE-25T', 1020.000000, 980.000000, 1080.000000, 11, 96.80, 0.55, '中', '铁运', 1400.00, '车轴坯铸锻件，性价比高', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (107, '2025-10-12_TSY_HSR_01', 3102, 'HSR-TM-350kW', 98500.000000, 96000.000000, 101000.000000, 18, 94.50, 0.80, '中', '铁运', 2800.00, '350kW牵引电机', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (108, '2025-10-12_TSY_HSR_01', 3102, 'HSR-GEARBOX-T1', 45800.000000, 44000.000000, 47800.000000, 20, 93.80, 0.90, '中', '铁运', 2400.00, '高速齿轮箱T1', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (109, '2025-10-12_TSY_HSR_01', 3107, 'HSR-TM-350kW', 96000.000000, 94000.000000, 98500.000000, 15, 96.20, 0.50, '高', '铁运', 3000.00, '中车高品质牵引电机，技术领先', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (110, '2025-10-12_TSY_HSR_01', 3107, 'HSR-GEARBOX-T1', 44500.000000, 43000.000000, 46500.000000, 17, 95.50, 0.60, '高', '铁运', 2600.00, '齿轮箱精密制造', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (111, '2025-10-12_TSY_HSR_01', 3108, 'HSR-TM-350kW', 99800.000000, 97500.000000, 102000.000000, 19, 93.80, 0.85, '中', '铁运', 2700.00, '湘电牵引电机，性价比优', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (112, '2025-10-12_TSY_HSR_01', 3108, 'HSR-GEARBOX-T1', 46500.000000, 44800.000000, 48500.000000, 21, 93.20, 0.95, '中', '铁运', 2500.00, '齿轮箱配套供应', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (113, '2025-10-12_TSY_HSR_01', 3103, 'HSR-PANTO-ZH120', 75000.000000, 72000.000000, 78000.000000, 15, 95.60, 0.70, '中', '铁运', 2100.00, '受电弓ZH120系列', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (114, '2025-10-12_TSY_HSR_01', 3103, 'HSR-BD-850', 8600.000000, 8200.000000, 8900.000000, 10, 96.80, 0.50, '高', '铁运', 1200.00, 'Φ850高铁制动盘', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (115, '2025-10-12_TSY_HSR_01', 3103, 'HSR-DOOR-MOD', 32800.000000, 31500.000000, 33800.000000, 14, 95.10, 0.70, '中', '铁运', 1600.00, '外滑式车门模块', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (116, '2025-10-12_TSY_HSR_01', 3103, 'HSR-HVAC-35kW', 59800.000000, 58000.000000, 61500.000000, 16, 94.90, 0.80, '中', '铁运', 2300.00, '顶置空调35kW', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (117, '2025-10-12_TSY_HSR_01', 3111, 'HSR-DOOR-MOD', 31500.000000, 30500.000000, 32800.000000, 12, 96.50, 0.50, '高', '铁运', 1500.00, '康尼车门系统，行业领先', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (118, '2025-10-12_TSY_HSR_01', 3111, 'HSR-BD-850', 8800.000000, 8400.000000, 9200.000000, 11, 95.80, 0.60, '中', '铁运', 1300.00, '制动盘配套供应', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (119, '2025-10-12_TSY_HSR_01', 3111, 'HSR-PANTO-ZH120', 76500.000000, 73500.000000, 79500.000000, 16, 94.80, 0.75, '中', '铁运', 2200.00, '受电弓系统', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (120, '2025-10-12_TSY_HSR_01', 3112, 'HSR-BD-850', 8300.000000, 7900.000000, 8600.000000, 9, 97.50, 0.35, '高', '铁运', 1400.00, '法维莱制动系统，国际品质', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (121, '2025-10-12_TSY_HSR_01', 3112, 'HSR-HVAC-35kW', 58500.000000, 56500.000000, 60500.000000, 14, 96.20, 0.60, '高', '铁运', 2500.00, 'HVAC空调系统，技术成熟', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (122, '2025-10-12_TSY_HSR_01', 3112, 'HSR-PANTO-ZH120', 77800.000000, 75000.000000, 80500.000000, 17, 94.20, 0.80, '中', '铁运', 2400.00, '受电弓配套', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier_material` VALUES (123, '2025-10-12_TSY_HSR_01', 3112, 'HSR-DOOR-MOD', 33500.000000, 32000.000000, 35000.000000, 15, 94.50, 0.75, '中', '铁运', 1700.00, '车门系统集成', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');


SET FOREIGN_KEY_CHECKS = 1;
