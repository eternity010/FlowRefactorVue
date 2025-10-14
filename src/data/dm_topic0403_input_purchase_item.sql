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

 Date: 12/10/2025 16:26:49
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dm_topic0403_input_purchase_item
-- ----------------------------
DROP TABLE IF EXISTS `dm_topic0403_input_purchase_item`;
CREATE TABLE `dm_topic0403_input_purchase_item`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `model_run_batch` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '模型运行批次',
  `po_no` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '采购订单号',
  `line_no` int(11) NOT NULL DEFAULT 1 COMMENT '订单行号',
  `material_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '物料编码',
  `material_name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '物料名称',
  `spec_model` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '规格/型号',
  `unit` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '计量单位',
  `qty` decimal(18, 6) NOT NULL DEFAULT 0.000000 COMMENT '订购数量',
  `unit_price` decimal(18, 6) NOT NULL DEFAULT 0.000000 COMMENT '单价(含税)',
  `amount` decimal(18, 2) NOT NULL DEFAULT 0.00 COMMENT '行金额=qty*unit_price',
  `need_date` date NULL DEFAULT NULL COMMENT '需求到货日期',
  `warehouse_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '收货仓库编码',
  `demand_dept` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '需求部门',
  `transport_mode` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '运输方式',
  `transport_cost` decimal(18, 2) NOT NULL DEFAULT 0.00 COMMENT '运输成本',
  `ship_time` datetime NULL DEFAULT NULL COMMENT '发货时间',
  `arrival_time` datetime NULL DEFAULT NULL COMMENT '到货时间',
  `remark` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '备注',
  `del_flag` int(11) NOT NULL DEFAULT 0 COMMENT '逻辑删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_material_code`(`material_code`) USING BTREE,
  INDEX `idx_need_date`(`need_date`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 109 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '课题4-模型3 入参-采购物料清单' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of dm_topic0403_input_purchase_item
-- ----------------------------
INSERT INTO `dm_topic0403_input_purchase_item` VALUES (101, '2025-10-12_TSY_HSR_01', 'TS-PO-20250908-001', 1, 'HSR-PLATE-Q550D', '桥壳钢板', 'Q550D/16mm/2500mm', 'KG', 20000.000000, 6.800000, 136000.00, '2025-09-12', 'TS-WH-01', '转向架', '铁运', 1800.00, '2025-09-07 08:30:00', '2025-09-10 17:00:00', '批次切割', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_purchase_item` VALUES (102, '2025-10-12_TSY_HSR_01', 'TS-PO-20250908-001', 2, 'HSR-AXLE-25T', '车轴坯', '25T/Ø215mm/定尺', 'PCS', 50.000000, 1000.000000, 50000.00, '2025-09-12', 'TS-WH-01', '转向架', '铁运', 800.00, '2025-09-07 08:30:00', '2025-09-10 17:00:00', '与钢板同车', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_purchase_item` VALUES (103, '2025-10-12_TSY_HSR_01', 'TS-PO-20250908-002', 1, 'HSR-PANTO-ZH120', '受电弓', 'ZH120/25kV', 'SET', 6.000000, 75000.000000, 450000.00, '2025-09-16', 'TS-WH-02', '受流系统', '铁运', 2200.00, '2025-09-09 09:00:00', '2025-09-13 15:20:00', '先到2台', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_purchase_item` VALUES (104, '2025-10-12_TSY_HSR_01', 'TS-PO-20250908-002', 2, 'HSR-BD-850', '高铁制动盘', 'Φ850/合金钢', 'PCS', 40.000000, 8600.000000, 344000.00, '2025-09-16', 'TS-WH-02', '制动系统', '铁运', 1200.00, '2025-09-09 09:00:00', '2025-09-13 15:20:00', '全量到货', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_purchase_item` VALUES (105, '2025-10-12_TSY_HSR_01', 'TS-PO-20250908-002', 3, 'HSR-DOOR-MOD', '车门系统模块', '外滑式/左+右', 'SET', 8.000000, 32800.000000, 262400.00, '2025-09-18', 'TS-WH-02', '车体', '铁运', 900.00, NULL, NULL, '分两批，每批4套', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_purchase_item` VALUES (106, '2025-10-12_TSY_HSR_01', 'TS-PO-20250908-002', 4, 'HSR-HVAC-35kW', '顶置空调机组', '35kW/冷媒R134a', 'SET', 4.000000, 59800.000000, 239200.00, '2025-09-18', 'TS-WH-02', '空调系统', '铁运', 1200.00, '2025-09-10 10:00:00', '2025-09-14 10:30:00', '整批到', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_purchase_item` VALUES (107, '2025-10-12_TSY_HSR_01', 'TS-PO-20250908-003', 1, 'HSR-TM-350kW', '牵引电机', '350kW/异步/三相', 'SET', 8.000000, 98500.000000, 788000.00, '2025-09-20', 'TS-WH-03', '牵引系统', '铁运', 3000.00, '2025-09-11 10:00:00', '2025-09-17 10:30:00', '按编组先到4台', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_purchase_item` VALUES (108, '2025-10-12_TSY_HSR_01', 'TS-PO-20250908-003', 2, 'HSR-GEARBOX-T1', '高速齿轮箱', 'T1/比速3.68', 'SET', 8.000000, 45800.000000, 366400.00, '2025-09-20', 'TS-WH-03', '牵引系统', '铁运', 2200.00, '2025-09-11 10:00:00', '2025-09-17 10:30:00', '与电机同车', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');

SET FOREIGN_KEY_CHECKS = 1;
