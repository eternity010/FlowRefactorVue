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

 Date: 14/10/2025 15:18:39
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dm_topic0303_output_class_def
-- ----------------------------
DROP TABLE IF EXISTS `dm_topic0303_output_class_def`;
CREATE TABLE `dm_topic0303_output_class_def`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `model_run_batch` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '模型运行批次标记',
  `class_label` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '分类标签',
  `delivery_coeff_min` decimal(5, 2) NOT NULL DEFAULT 0.00 COMMENT '交付系数最小值',
  `delivery_coeff_max` decimal(5, 2) NOT NULL DEFAULT 0.00 COMMENT '交付系数最大值',
  `price_var_min` decimal(5, 2) NOT NULL DEFAULT 0.00 COMMENT '价格波动率最小值',
  `price_var_max` decimal(5, 2) NOT NULL DEFAULT 0.00 COMMENT '价格波动率最大值',
  `transport_var_min` decimal(5, 2) NOT NULL DEFAULT 0.00 COMMENT '运输成本波动率最小值',
  `transport_var_max` decimal(5, 2) NOT NULL DEFAULT 0.00 COMMENT '运输成本波动率最大值',
  `remark` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '备注',
  `del_flag` int(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除标识',
  `create_id` int(11) NOT NULL DEFAULT -1 COMMENT '创建者ID',
  `create_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '创建者姓名',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_id` int(11) NOT NULL DEFAULT -1 COMMENT '更新者ID',
  `update_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '更新者姓名',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '课题3-模型3 输出-分类定义表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of dm_topic0303_output_class_def
-- ----------------------------
INSERT INTO `dm_topic0303_output_class_def` VALUES (1, '2025-09-08_TSY_HSR_01', '高稳定', 0.90, 1.00, 0.00, 0.05, 0.00, 0.05, '', 0, -1, '', '2025-09-08 13:06:38', -1, '', '2025-09-08 13:06:38');
INSERT INTO `dm_topic0303_output_class_def` VALUES (2, '2025-09-08_TSY_HSR_01', '中稳定', 0.75, 0.90, 0.05, 0.15, 0.05, 0.15, '', 0, -1, '', '2025-09-08 13:06:38', -1, '', '2025-09-08 13:06:38');
INSERT INTO `dm_topic0303_output_class_def` VALUES (3, '2025-09-08_TSY_HSR_01', '低稳定', 0.00, 0.75, 0.15, 1.00, 0.15, 1.00, '', 0, -1, '', '2025-09-08 13:06:38', -1, '', '2025-09-08 13:06:38');

SET FOREIGN_KEY_CHECKS = 1;
