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

 Date: 20/09/2025 17:30:43
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dm_topic0401_input_equipment
-- ----------------------------
DROP TABLE IF EXISTS `dm_topic0401_input_equipment`;
CREATE TABLE `dm_topic0401_input_equipment`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `model_run_batch` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '模型运行批次标记',
  `equipment_id` int NOT NULL DEFAULT -1 COMMENT '设备id',
  `equipment_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '设备编号',
  `equipment_desc` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '设备描述',
  `supplier_id` int NOT NULL DEFAULT -1 COMMENT '供应商',
  `organization_id` int NOT NULL DEFAULT -1 COMMENT '负责部门id',
  `charge_id` int NOT NULL DEFAULT -1 COMMENT '负责人id',
  `area_id` int NOT NULL DEFAULT -1 COMMENT '区域id',
  `area_code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '区域编码',
  `area_desc` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '区域描述',
  `status` int NOT NULL DEFAULT 1 COMMENT '状态 1 启用 2 停用',
  `equipment_model` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '型号代号',
  `arrive_date` date NOT NULL COMMENT '到货日期',
  `category_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '分类编码',
  `category_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '分类名称',
  `remark` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '备注',
  `del_flag` int NOT NULL DEFAULT 0 COMMENT '逻辑删除标识',
  `create_id` int NOT NULL DEFAULT -1 COMMENT '创建者ID',
  `create_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '创建者姓名',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_id` int NOT NULL DEFAULT -1 COMMENT '更新者ID',
  `update_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '更新者姓名',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `speed_range` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '机器可调速度范围',
  `unit_process_energy` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '单位加工能耗(kWh/件)',
  `unit_idle_energy` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '单位待机能耗(kWh/分钟)',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `equipment_code_idx`(`equipment_code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '设备信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dm_topic0401_input_equipment
-- ----------------------------
INSERT INTO `dm_topic0401_input_equipment` VALUES (1, '20240905', 1, 'EQP001', '数控下料机A', 1001, 1001, 101, 101, 'A01', '下料区域', 1, 'NC-DL-2023', '2023-01-10', 'CAT001', '下料设备', '高精度数控下料设备', 0, 1, 'admin', '2024-09-03 08:00:00', 1, 'admin', '2024-09-03 08:00:00', '1-4', 5.50, 2.10);
INSERT INTO `dm_topic0401_input_equipment` VALUES (2, '20240905', 2, 'EQP002', '数控粗加工机A', 1002, 1001, 102, 102, 'B01', '粗加工区域', 1, 'NC-CA-2023', '2023-10-15', 'CAT002', '粗加工设备', '数控粗加工中心', 0, 1, 'admin', '2024-09-03 08:00:00', 1, 'admin', '2024-09-03 08:00:00', '1-3', 4.20, 1.80);
INSERT INTO `dm_topic0401_input_equipment` VALUES (3, '20240905', 3, 'EQP003', '精密加工中心A', 1003, 1001, 103, 103, 'C01', '精加工区域', 1, 'PC-FA-2023', '2023-10-20', 'CAT003', '精加工设备', '高精度精密加工设备', 0, 1, 'admin', '2024-09-03 08:00:00', 1, 'admin', '2024-09-03 08:00:00', '1-4', 3.80, 1.50);
INSERT INTO `dm_topic0401_input_equipment` VALUES (4, '20240905', 6, 'EQP006', '检验包装设备A', 1006, 1002, 106, 106, 'F01', '检验包装区域', 1, 'QC-PK-2023', '2023-11-05', 'CAT006', '检验包装设备', '自动检验包装线', 0, 1, 'admin', '2024-09-03 08:00:00', 1, 'admin', '2024-09-03 08:00:00', '1-2', 1.00, 0.50);
INSERT INTO `dm_topic0401_input_equipment` VALUES (5, '20240905', 7, 'EQP007', '数控下料机B', 1001, 1001, 101, 101, 'A01', '下料区域', 1, 'NC-DL-2023B', '2023-11-10', 'CAT001', '下料设备', '高精度数控下料设备B', 0, 1, 'admin', '2024-09-03 08:00:00', 1, 'admin', '2024-09-03 08:00:00', '1-4', 5.80, 2.10);
INSERT INTO `dm_topic0401_input_equipment` VALUES (6, '20240905', 8, 'EQP008', '数控粗加工机B', 1002, 1001, 102, 102, 'B01', '粗加工区域', 1, 'NC-CA-2023B', '2023-11-15', 'CAT002', '粗加工设备', '数控粗加工中心B', 0, 1, 'admin', '2024-09-03 08:00:00', 1, 'admin', '2024-09-03 08:00:00', '1-3', 4.50, 1.80);
INSERT INTO `dm_topic0401_input_equipment` VALUES (7, '20240905', 9, 'EQP009', '精密加工中心B', 1003, 1001, 103, 103, 'C01', '精加工区域', 1, 'PC-FA-2023B', '2023-11-20', 'CAT003', '精加工设备', '高精度精密加工设备B', 0, 1, 'admin', '2024-09-03 08:00:00', 1, 'admin', '2024-09-03 08:00:00', '1-4', 4.00, 1.50);
INSERT INTO `dm_topic0401_input_equipment` VALUES (8, '20240905', 12, 'EQP012', '检验包装设备B', 1006, 1002, 106, 106, 'F01', '检验包装区域', 1, 'QC-PK-2023B', '2023-12-05', 'CAT006', '检验包装设备', '自动检验包装线B', 0, 1, 'admin', '2024-09-03 08:00:00', 1, 'admin', '2024-09-03 08:00:00', '1-2', 1.20, 0.50);
INSERT INTO `dm_topic0401_input_equipment` VALUES (9, '20240905', 15, 'EQP015', '数控下料机C', 1001, 1001, 101, 101, 'A01', '下料区域', 1, 'NC-DL-2024', '2024-01-10', 'CAT001', '下料设备', '高精度数控下料设备C', 0, 1, 'admin', '2024-09-03 08:00:00', 1, 'admin', '2024-09-03 08:00:00', '1-3', 5.20, 2.10);
INSERT INTO `dm_topic0401_input_equipment` VALUES (10, '20240905', 16, 'EQP016', '精密加工中心C', 1003, 1001, 103, 103, 'C01', '精加工区域', 1, 'PC-FA-2024', '2024-01-15', 'CAT003', '精加工设备', '高精度精密加工设备C', 0, 1, 'admin', '2024-09-03 08:00:00', 1, 'admin', '2024-09-03 08:00:00', '1-3', 3.50, 1.50);

SET FOREIGN_KEY_CHECKS = 1;
