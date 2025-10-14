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

 Date: 12/10/2025 16:59:35
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dm_topic0403_input_purchase_order
-- ----------------------------
DROP TABLE IF EXISTS `dm_topic0403_input_purchase_order`;
CREATE TABLE `dm_topic0403_input_purchase_order`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `model_run_batch` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '模型运行批次',
  `po_no` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '采购订单号',
  `contract_no` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '合同号/框架协议号',
  `po_date` date NULL DEFAULT NULL COMMENT '下单日期',
  `buyer_org` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '采购组织/公司',
  `buyer_id` int(11) NOT NULL DEFAULT -1 COMMENT '采购员ID',
  `buyer_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '采购员姓名',
  `supplier_id` int(11) NOT NULL DEFAULT -1 COMMENT '供应商ID',
  `supplier_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '供应商名称',
  `currency` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'CNY' COMMENT '币种',
  `tax_rate` decimal(5, 2) NOT NULL DEFAULT 0.00 COMMENT '税率(%)',
  `total_amount` decimal(18, 2) NOT NULL DEFAULT 0.00 COMMENT '订单含税总金额',
  `expected_arrival` date NULL DEFAULT NULL COMMENT '预计到货日期',
  `delivery_addr` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '送货地址/收货仓',
  `transport_mode` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '运输方式(汽运/铁运/海运等)',
  `transport_cost` decimal(18, 2) NOT NULL DEFAULT 0.00 COMMENT '运输成本',
  `ship_time` datetime NULL DEFAULT NULL COMMENT '发货时间',
  `arrival_time` datetime NULL DEFAULT NULL COMMENT '到货时间',
  `status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '订单状态(已下单/在途/完成/关闭)',
  `priority` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '紧急程度',
  `project_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '项目/工单编码',
  `remark` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '备注',
  `del_flag` int(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_po_no_batch`(`po_no`, `model_run_batch`) USING BTREE,
  INDEX `idx_supplier_id`(`supplier_id`) USING BTREE,
  INDEX `idx_po_date`(`po_date`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 204 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '课题4-模型3 入参-采购订单' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of dm_topic0403_input_purchase_order
-- ----------------------------
INSERT INTO `dm_topic0403_input_purchase_order` VALUES (201, '2025-10-12_TSY_HSR_01', 'TS-PO-20250908-001', 'TS-HT-2025-001', '2025-09-05', '中车唐山-采购中心', 7001, '李娜', 3101, '唐山精工材料', 'CNY', 13.00, 186000.00, '2025-09-12', '唐山厂-一号仓(TS-WH-01)', '铁运', 2600.00, '2025-09-07 08:30:00', '2025-09-10 17:00:00', '在途', '高', 'CR400AF-Bogie', '桥壳钢板+车轴坯', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_purchase_order` VALUES (202, '2025-10-12_TSY_HSR_01', 'TS-PO-20250908-002', 'TS-HT-2025-002', '2025-09-06', '中车唐山-采购中心', 7002, '赵越', 3103, '京津轨道部件', 'CNY', 13.00, 302600.00, '2025-09-16', '唐山厂-二号仓(TS-WH-02)', '铁运', 5500.00, '2025-09-09 09:00:00', '2025-09-13 15:20:00', '已下单', '高', 'CR400AF-Brake&Door', '受流/制动/车门/空调', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_purchase_order` VALUES (203, '2025-10-12_TSY_HSR_01', 'TS-PO-20250908-003', 'TS-HT-2025-003', '2025-09-06', '中车唐山-采购中心', 7001, '李娜', 3102, '渤海传动', 'CNY', 13.00, 268300.00, '2025-09-20', '唐山厂-三号仓(TS-WH-03)', '铁运', 5200.00, '2025-09-11 10:00:00', '2025-09-17 10:30:00', '在途', '中', 'CR400AF-Traction', '牵引电机+齿轮箱', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');

SET FOREIGN_KEY_CHECKS = 1;
