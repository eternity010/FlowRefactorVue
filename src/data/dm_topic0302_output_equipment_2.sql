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

 Date: 25/09/2025 12:15:00
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dm_topic0302_output_equipment_2
-- ----------------------------
DROP TABLE IF EXISTS `dm_topic0302_output_equipment_2`;
CREATE TABLE `dm_topic0302_output_equipment_2`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `model_run_batch` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '模型运行批次标记',
  `equipment_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '-1' COMMENT '设备ID',
  `rate_percent` decimal(11, 2) NOT NULL DEFAULT 0.00 COMMENT '健康度',
  `remark` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '备注',
  `del_flag` int(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除标识',
  `create_id` int(11) NOT NULL DEFAULT -1 COMMENT '创建者ID',
  `create_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '创建者姓名',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_id` int(11) NOT NULL DEFAULT -1 COMMENT '更新者ID',
  `update_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '更新者姓名',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '课题3设备健康度出参-列车最终装配' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of dm_topic0302_output_equipment_2
-- ----------------------------
-- 装配机器人系列（8台）
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (1, 'TRAIN_ASSEMBLY_2025', 'ROBOT-001', 0.95, '高速装配机器人A1型，性能优秀', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (2, 'TRAIN_ASSEMBLY_2025', 'ROBOT-002', 0.92, '高速装配机器人A1型，状态良好', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (3, 'TRAIN_ASSEMBLY_2025', 'ROBOT-003', 0.88, '高速装配机器人A1型，运行稳定', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (4, 'TRAIN_ASSEMBLY_2025', 'ROBOT-004', 0.91, '焊接机器人B2型，精度高', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (5, 'TRAIN_ASSEMBLY_2025', 'ROBOT-005', 0.76, '焊接机器人B2型，关节磨损', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (6, 'TRAIN_ASSEMBLY_2025', 'ROBOT-006', 0.89, '物料搬运机器人C3型，效率高', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (7, 'TRAIN_ASSEMBLY_2025', 'ROBOT-007', 0.93, '物料搬运机器人C3型，性能稳定', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (8, 'TRAIN_ASSEMBLY_2025', 'ROBOT-008', 0.85, '物料搬运机器人C3型，运行正常', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');

-- 检测设备系列（6台）
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (9, 'TRAIN_ASSEMBLY_2025', 'DETECT-001', 0.94, 'X光检测设备D1型，射线强度稳定', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (10, 'TRAIN_ASSEMBLY_2025', 'DETECT-002', 0.88, '质量检测设备D2型，精度良好', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (11, 'TRAIN_ASSEMBLY_2025', 'DETECT-003', 0.91, '自动化测试台D3型，性能稳定', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (12, 'TRAIN_ASSEMBLY_2025', 'DETECT-004', 0.84, '扭矩测试仪D4型，精度校准', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (13, 'TRAIN_ASSEMBLY_2025', 'DETECT-005', 0.87, '振动测试台D5型，性能良好', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (14, 'TRAIN_ASSEMBLY_2025', 'DETECT-006', 0.92, '精密测量仪D6型，精度达标', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');

-- 传送系统系列（6台）
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (15, 'TRAIN_ASSEMBLY_2025', 'CONVEY-001', 0.89, '智能传送带E1型，同步良好', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (16, 'TRAIN_ASSEMBLY_2025', 'CONVEY-002', 0.72, '智能传送带E1型，电机老化', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (17, 'TRAIN_ASSEMBLY_2025', 'CONVEY-003', 0.86, '物料传送带E2型，效率稳定', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (18, 'TRAIN_ASSEMBLY_2025', 'CONVEY-004', 0.81, '仓储机器人E3型，路径规划正常', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (19, 'TRAIN_ASSEMBLY_2025', 'CONVEY-005', 0.94, '智能仓储系统E4型，效率高', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (20, 'TRAIN_ASSEMBLY_2025', 'CONVEY-006', 0.86, 'AGV小车E5型，导航准确', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');

-- 加工设备系列（6台）
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (21, 'TRAIN_ASSEMBLY_2025', 'PROCESS-001', 0.78, '激光切割设备F1型，精度高', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (22, 'TRAIN_ASSEMBLY_2025', 'PROCESS-002', 0.91, '车体焊接设备F2型，性能稳定', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (23, 'TRAIN_ASSEMBLY_2025', 'PROCESS-003', 0.85, '涂装设备F3型，喷涂均匀', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (24, 'TRAIN_ASSEMBLY_2025', 'PROCESS-004', 0.67, '涂装设备F3型，轴承磨损', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (25, 'TRAIN_ASSEMBLY_2025', 'PROCESS-005', 0.88, 'CNC加工中心F4型，性能稳定', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');
INSERT INTO `dm_topic0302_output_equipment_2` VALUES (26, 'TRAIN_ASSEMBLY_2025', 'PROCESS-006', 0.79, '磨床设备F5型，砂轮消耗大', 0, -1, '', '2025-09-25 12:00:00', -1, '', '2025-09-25 12:00:00');

SET FOREIGN_KEY_CHECKS = 1;
