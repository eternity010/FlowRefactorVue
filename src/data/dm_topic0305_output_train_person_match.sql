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

 Date: 17/09/2025 15:13:00
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dm_topic0305_output_train_person_match
-- ----------------------------
DROP TABLE IF EXISTS `dm_topic0305_output_train_person_match`;
CREATE TABLE `dm_topic0305_output_train_person_match`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `model_run_batch` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '模型运行批次标记',
  `train_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '列车编号/车组号',
  `person_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '人员ID',
  `match_score` decimal(5, 2) NOT NULL DEFAULT 0.00 COMMENT '匹配度(0-100)',
  `remark` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '备注',
  `del_flag` int NOT NULL DEFAULT 0 COMMENT '逻辑删除标识',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_train_person`(`train_id` ASC, `person_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 901 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '课题3-模型5 输出-列车与人员匹配度结果表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dm_topic0305_output_train_person_match
-- ----------------------------
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (1, '', 'CR200J-2004', '王工', 0.68, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (2, '', 'CR200J-2004', '郝工', 0.67, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (3, '', 'CR200J-2004', '李工', 0.65, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (4, '', 'CR200J-2004', '刘工', 0.68, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (5, '', 'CR200J-2004', '周工', 0.68, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (6, '', 'CR200J-2004', '董工', 0.70, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (7, '', 'CR200J-2004', '何工', 0.67, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (8, '', 'CR200J-2004', '赵工', 0.67, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (9, '', 'CR200J-2004', '钱工', 0.69, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (10, '', 'CR200J-2008', '王工', 0.64, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (11, '', 'CR200J-2008', '郝工', 0.67, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (12, '', 'CR200J-2008', '李工', 0.64, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (13, '', 'CR200J-2008', '刘工', 0.65, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (14, '', 'CR200J-2008', '周工', 0.64, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (15, '', 'CR200J-2008', '董工', 0.64, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (16, '', 'CR200J-2008', '何工', 0.67, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (17, '', 'CR200J-2008', '赵工', 0.68, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (18, '', 'CR200J-2008', '钱工', 0.66, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (19, '', 'CR200J-2012', '王工', 0.68, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (20, '', 'CR200J-2012', '郝工', 0.66, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (21, '', 'CR200J-2012', '李工', 0.68, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (22, '', 'CR200J-2012', '刘工', 0.66, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (23, '', 'CR200J-2012', '周工', 0.66, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (24, '', 'CR200J-2012', '董工', 0.68, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (25, '', 'CR200J-2012', '何工', 0.66, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (26, '', 'CR200J-2012', '赵工', 0.70, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (27, '', 'CR200J-2012', '钱工', 0.65, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (28, '', 'CR200J-2015', '王工', 0.70, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (29, '', 'CR200J-2015', '郝工', 0.65, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');
INSERT INTO `dm_topic0305_output_train_person_match` VALUES (30, '', 'CR200J-2015', '李工', 0.68, '', 0, '2025-09-17 10:52:17', '2025-09-17 10:52:17');