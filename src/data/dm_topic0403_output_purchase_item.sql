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

 Date: 16/10/2025 14:53:12
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dm_topic0403_output_purchase_item
-- ----------------------------
DROP TABLE IF EXISTS `dm_topic0403_output_purchase_item`;
CREATE TABLE `dm_topic0403_output_purchase_item`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `model_run_batch` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '模型运行批次',
  `po_no` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '采购订单号',
  `line_no` int(11) NOT NULL DEFAULT 1 COMMENT '订单行号',
  `material_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '物料编码',
  `material_name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '物料名称',
  `spec_model` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '规格/型号',
  `unit` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '计量单位',
  `qty` decimal(18, 6) NOT NULL DEFAULT 0.000000 COMMENT '订购数量',
  `old_unit_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '原单价',
  `unit_price` decimal(18, 6) NOT NULL DEFAULT 0.000000 COMMENT '单价(含税)',
  `amount` decimal(18, 2) NOT NULL DEFAULT 0.00 COMMENT '行金额=qty*unit_price',
  `need_date` date NULL DEFAULT NULL COMMENT '需求到货日期',
  `warehouse_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '收货仓库编码',
  `demand_dept` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '需求部门',
  `transport_mode` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '运输方式',
  `transport_cost` decimal(18, 2) NOT NULL DEFAULT 0.00 COMMENT '运输成本',
  `ship_time` datetime NULL DEFAULT NULL COMMENT '发货时间',
  `arrival_time` datetime NULL DEFAULT NULL COMMENT '到货时间',
  `new_buyer_id` int(11) NOT NULL DEFAULT -1 COMMENT '新采购员ID',
  `new_buyer_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '新采购员姓名',
  `old_supplier_id` int(11) NULL DEFAULT NULL COMMENT '原供应商ID',
  `new_supplier_id` int(11) NOT NULL DEFAULT -1 COMMENT '新供应商ID',
  `new_supplier_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '新供应商名称',
  `remark` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '备注',
  `del_flag` int(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_material_code`(`material_code`) USING BTREE,
  INDEX `idx_need_date`(`need_date`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 208 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '课题4-模型3 出参-采购物料清单' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of dm_topic0403_output_purchase_item
-- ----------------------------
INSERT INTO `dm_topic0403_output_purchase_item` VALUES (200, '2025-10-12_TSY_HSR_01', 'TS-PO-20250908-001', 1, 'HSR-PLATE-Q550D', '桥壳钢板', 'Q550D/16mm/2500mm', 'KG', 20000.000000, 6.80, 6.500000, 130000.00, '2025-09-12', 'TS-WH-01', '转向架', '铁运', 1200.00, '2025-09-07 08:30:00', '2025-09-10 17:00:00', 7001, '李娜', 3101, 3104, '宝钢股份', '优化: 供应商从3101切换至3104，单价从6.8降至6.5，节省6000元；稳定性评级:高稳定(98.5%交付率)', 0, '2025-10-15 10:00:00', '2025-10-16 14:51:29');
INSERT INTO `dm_topic0403_output_purchase_item` VALUES (201, '2025-10-12_TSY_HSR_01', 'TS-PO-20250908-001', 2, 'HSR-AXLE-25T', '车轴坯', '25T/Ø215mm/定尺', 'PCS', 50.000000, 1000.00, 980.000000, 49000.00, '2025-09-12', 'TS-WH-01', '转向架', '铁运', 1500.00, '2025-09-07 08:30:00', '2025-09-10 17:00:00', 7001, '李娜', 3104, 3104, '宝钢股份', '优化: 供应商从3101切换至3104，单价从1000降至980，节省1000元；稳定性评级:高稳定(97.5%交付率)', 0, '2025-10-15 10:00:00', '2025-10-16 14:51:57');
INSERT INTO `dm_topic0403_output_purchase_item` VALUES (202, '2025-10-12_TSY_HSR_01', 'TS-PO-20250908-002', 1, 'HSR-PANTO-ZH120', '受电弓', 'ZH120/25kV', 'SET', 6.000000, 75000.00, 75000.000000, 450000.00, '2025-09-16', 'TS-WH-02', '受流系统', '铁运', 2100.00, '2025-09-09 09:00:00', '2025-09-13 15:20:00', 7002, '赵越', 3103, 3103, '京津轨道部件', '优化: 保持原供应商3103，调整运输成本从2200降至2100；稳定性评级:高稳定(95.6%交付率)', 0, '2025-10-15 10:00:00', '2025-10-16 14:52:01');
INSERT INTO `dm_topic0403_output_purchase_item` VALUES (203, '2025-10-12_TSY_HSR_01', 'TS-PO-20250908-002', 2, 'HSR-BD-850', '高铁制动盘', 'Φ850/合金钢', 'PCS', 40.000000, 8600.00, 8300.000000, 332000.00, '2025-09-16', 'TS-WH-02', '制动系统', '铁运', 1400.00, '2025-09-09 09:00:00', '2025-09-13 15:20:00', 7002, '赵越', 3103, 3112, '法维莱中国', '优化: 供应商从3103切换至3112，单价从8600降至8300，节省12000元；稳定性评级:高稳定(97.5%交付率，国际品质)', 0, '2025-10-15 10:00:00', '2025-10-16 14:52:08');
INSERT INTO `dm_topic0403_output_purchase_item` VALUES (204, '2025-10-12_TSY_HSR_01', 'TS-PO-20250908-002', 3, 'HSR-DOOR-MOD', '车门系统模块', '外滑式/左+右', 'SET', 8.000000, 32800.00, 31500.000000, 252000.00, '2025-09-18', 'TS-WH-02', '车体', '铁运', 1500.00, '2025-09-10 09:30:00', '2025-09-14 16:00:00', 7002, '赵越', 3103, 3111, '康尼机电', '优化: 供应商从3103切换至3111，单价从32800降至31500，节省10400元；稳定性评级:高稳定(96.5%交付率，行业领先)', 0, '2025-10-15 10:00:00', '2025-10-16 14:52:14');
INSERT INTO `dm_topic0403_output_purchase_item` VALUES (205, '2025-10-12_TSY_HSR_01', 'TS-PO-20250908-002', 4, 'HSR-HVAC-35kW', '顶置空调机组', '35kW/冷媒R134a', 'SET', 4.000000, 59800.00, 58500.000000, 234000.00, '2025-09-18', 'TS-WH-02', '空调系统', '铁运', 2500.00, '2025-09-10 10:00:00', '2025-09-14 10:30:00', 7002, '赵越', 3103, 3112, '法维莱中国', '优化: 供应商从3103切换至3112，单价从59800降至58500，节省5200元；稳定性评级:高稳定(96.2%交付率，技术成熟)', 0, '2025-10-15 10:00:00', '2025-10-16 14:52:25');
INSERT INTO `dm_topic0403_output_purchase_item` VALUES (206, '2025-10-12_TSY_HSR_01', 'TS-PO-20250908-003', 1, 'HSR-TM-350kW', '牵引电机', '350kW/异步/三相', 'SET', 8.000000, 98500.00, 96000.000000, 768000.00, '2025-09-20', 'TS-WH-03', '牵引系统', '铁运', 3000.00, '2025-09-11 10:00:00', '2025-09-17 10:30:00', 7001, '李娜', 3102, 3107, '中车电机', '优化: 供应商从3102切换至3107，单价从98500降至96000，节省20000元；稳定性评级:高稳定(96.2%交付率，技术领先)', 0, '2025-10-15 10:00:00', '2025-10-16 14:52:34');
INSERT INTO `dm_topic0403_output_purchase_item` VALUES (207, '2025-10-12_TSY_HSR_01', 'TS-PO-20250908-003', 2, 'HSR-GEARBOX-T1', '高速齿轮箱', 'T1/比速3.68', 'SET', 8.000000, 45800.00, 44500.000000, 356000.00, '2025-09-20', 'TS-WH-03', '牵引系统', '铁运', 2600.00, '2025-09-11 10:00:00', '2025-09-17 10:30:00', 7001, '李娜', 3102, 3107, '中车电机', '优化: 供应商从3102切换至3107，单价从45800降至44500，节省10400元；稳定性评级:高稳定(95.5%交付率，精密制造)', 0, '2025-10-15 10:00:00', '2025-10-16 14:52:41');

SET FOREIGN_KEY_CHECKS = 1;
