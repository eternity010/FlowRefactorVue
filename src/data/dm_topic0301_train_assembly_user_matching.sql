/*
 Navicat Premium Data Transfer

 Source Server         : 模拟火车装配数据库
 Source Server Type    : MySQL
 Source Server Version : 50644
 Source Server Host    : localhost:3306
 Source Schema         : train_assembly_db

 Target Server Type    : MySQL
 Target Server Version : 50644
 File Encoding         : 65001

 Date: 24/09/2025 16:00:00
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dm_topic0301_output_user_2
-- ----------------------------
DROP TABLE IF EXISTS `dm_topic0301_output_user_2`;
CREATE TABLE `dm_topic0301_output_user_2`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `model_run_batch` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '模型运行批次标记',
  `user_id` int(11) NOT NULL DEFAULT -1 COMMENT '人员ID',
  `task_id` int(11) NULL DEFAULT NULL COMMENT '任务id',
  `rate_percent` decimal(11, 2) NOT NULL DEFAULT 0.00 COMMENT '匹配度',
  `remark` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '备注',
  `del_flag` int(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除标识',
  `create_id` int(11) NOT NULL DEFAULT -1 COMMENT '创建者ID',
  `create_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '创建者姓名',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_id` int(11) NOT NULL DEFAULT -1 COMMENT '更新者ID',
  `update_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '更新者姓名',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 100001 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '火车装配人员匹配度出参' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of dm_topic0301_output_user_2
-- ----------------------------
INSERT INTO `dm_topic0301_output_user_2` VALUES (1, 'TRAIN_ASSEMBLY_2025', 1, 2001, 0.92, '车体装配专家-主车体焊接', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (2, 'TRAIN_ASSEMBLY_2025', 1, 2002, 0.88, '车体装配专家-侧面板安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (3, 'TRAIN_ASSEMBLY_2025', 1, 2003, 0.75, '车体装配专家-车顶安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (4, 'TRAIN_ASSEMBLY_2025', 1, 2004, 0.35, '车体装配专家-电气布线', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (5, 'TRAIN_ASSEMBLY_2025', 1, 2005, 0.42, '车体装配专家-制动系统', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (6, 'TRAIN_ASSEMBLY_2025', 1, 2006, 0.68, '车体装配专家-内饰安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (7, 'TRAIN_ASSEMBLY_2025', 1, 2007, 0.55, '车体装配专家-涂装准备', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (8, 'TRAIN_ASSEMBLY_2025', 1, 2008, 0.72, '车体装配专家-质量检查', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (9, 'TRAIN_ASSEMBLY_2025', 1, 2009, 0.65, '车体装配专家-调试测试', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (10, 'TRAIN_ASSEMBLY_2025', 1, 2010, 0.78, '车体装配专家-最终验收', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');

INSERT INTO `dm_topic0301_output_user_2` VALUES (11, 'TRAIN_ASSEMBLY_2025', 2, 2001, 0.65, '电气工程师-主车体焊接', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (12, 'TRAIN_ASSEMBLY_2025', 2, 2002, 0.58, '电气工程师-侧面板安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (13, 'TRAIN_ASSEMBLY_2025', 2, 2003, 0.45, '电气工程师-车顶安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (14, 'TRAIN_ASSEMBLY_2025', 2, 2004, 0.95, '电气工程师-电气布线', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (15, 'TRAIN_ASSEMBLY_2025', 2, 2005, 0.88, '电气工程师-制动系统', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (16, 'TRAIN_ASSEMBLY_2025', 2, 2006, 0.72, '电气工程师-内饰安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (17, 'TRAIN_ASSEMBLY_2025', 2, 2007, 0.35, '电气工程师-涂装准备', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (18, 'TRAIN_ASSEMBLY_2025', 2, 2008, 0.82, '电气工程师-质量检查', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (19, 'TRAIN_ASSEMBLY_2025', 2, 2009, 0.92, '电气工程师-调试测试', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (20, 'TRAIN_ASSEMBLY_2025', 2, 2010, 0.85, '电气工程师-最终验收', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');

INSERT INTO `dm_topic0301_output_user_2` VALUES (21, 'TRAIN_ASSEMBLY_2025', 3, 2001, 0.42, '制动系统专家-主车体焊接', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (22, 'TRAIN_ASSEMBLY_2025', 3, 2002, 0.55, '制动系统专家-侧面板安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (23, 'TRAIN_ASSEMBLY_2025', 3, 2003, 0.48, '制动系统专家-车顶安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (24, 'TRAIN_ASSEMBLY_2025', 3, 2004, 0.75, '制动系统专家-电气布线', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (25, 'TRAIN_ASSEMBLY_2025', 3, 2005, 0.92, '制动系统专家-制动系统', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (26, 'TRAIN_ASSEMBLY_2025', 3, 2006, 0.38, '制动系统专家-内饰安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (27, 'TRAIN_ASSEMBLY_2025', 3, 2007, 0.45, '制动系统专家-涂装准备', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (28, 'TRAIN_ASSEMBLY_2025', 3, 2008, 0.88, '制动系统专家-质量检查', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (29, 'TRAIN_ASSEMBLY_2025', 3, 2009, 0.85, '制动系统专家-调试测试', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (30, 'TRAIN_ASSEMBLY_2025', 3, 2010, 0.82, '制动系统专家-最终验收', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');

INSERT INTO `dm_topic0301_output_user_2` VALUES (31, 'TRAIN_ASSEMBLY_2025', 4, 2001, 0.35, '内饰装配工-主车体焊接', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (32, 'TRAIN_ASSEMBLY_2025', 4, 2002, 0.42, '内饰装配工-侧面板安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (33, 'TRAIN_ASSEMBLY_2025', 4, 2003, 0.38, '内饰装配工-车顶安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (34, 'TRAIN_ASSEMBLY_2025', 4, 2004, 0.55, '内饰装配工-电气布线', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (35, 'TRAIN_ASSEMBLY_2025', 4, 2005, 0.28, '内饰装配工-制动系统', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (36, 'TRAIN_ASSEMBLY_2025', 4, 2006, 0.95, '内饰装配工-内饰安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (37, 'TRAIN_ASSEMBLY_2025', 4, 2007, 0.82, '内饰装配工-涂装准备', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (38, 'TRAIN_ASSEMBLY_2025', 4, 2008, 0.68, '内饰装配工-质量检查', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (39, 'TRAIN_ASSEMBLY_2025', 4, 2009, 0.45, '内饰装配工-调试测试', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (40, 'TRAIN_ASSEMBLY_2025', 4, 2010, 0.72, '内饰装配工-最终验收', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');

INSERT INTO `dm_topic0301_output_user_2` VALUES (41, 'TRAIN_ASSEMBLY_2025', 5, 2001, 0.25, '涂装技师-主车体焊接', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (42, 'TRAIN_ASSEMBLY_2025', 5, 2002, 0.32, '涂装技师-侧面板安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (43, 'TRAIN_ASSEMBLY_2025', 5, 2003, 0.28, '涂装技师-车顶安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (44, 'TRAIN_ASSEMBLY_2025', 5, 2004, 0.42, '涂装技师-电气布线', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (45, 'TRAIN_ASSEMBLY_2025', 5, 2005, 0.35, '涂装技师-制动系统', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (46, 'TRAIN_ASSEMBLY_2025', 5, 2006, 0.78, '涂装技师-内饰安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (47, 'TRAIN_ASSEMBLY_2025', 5, 2007, 0.95, '涂装技师-涂装准备', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (48, 'TRAIN_ASSEMBLY_2025', 5, 2008, 0.72, '涂装技师-质量检查', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (49, 'TRAIN_ASSEMBLY_2025', 5, 2009, 0.38, '涂装技师-调试测试', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (50, 'TRAIN_ASSEMBLY_2025', 5, 2010, 0.85, '涂装技师-最终验收', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');

INSERT INTO `dm_topic0301_output_user_2` VALUES (51, 'TRAIN_ASSEMBLY_2025', 6, 2001, 0.72, '质量检验员-主车体焊接', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (52, 'TRAIN_ASSEMBLY_2025', 6, 2002, 0.68, '质量检验员-侧面板安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (53, 'TRAIN_ASSEMBLY_2025', 6, 2003, 0.75, '质量检验员-车顶安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (54, 'TRAIN_ASSEMBLY_2025', 6, 2004, 0.82, '质量检验员-电气布线', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (55, 'TRAIN_ASSEMBLY_2025', 6, 2005, 0.85, '质量检验员-制动系统', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (56, 'TRAIN_ASSEMBLY_2025', 6, 2006, 0.78, '质量检验员-内饰安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (57, 'TRAIN_ASSEMBLY_2025', 6, 2007, 0.65, '质量检验员-涂装准备', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (58, 'TRAIN_ASSEMBLY_2025', 6, 2008, 0.95, '质量检验员-质量检查', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (59, 'TRAIN_ASSEMBLY_2025', 6, 2009, 0.88, '质量检验员-调试测试', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (60, 'TRAIN_ASSEMBLY_2025', 6, 2010, 0.92, '质量检验员-最终验收', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');

INSERT INTO `dm_topic0301_output_user_2` VALUES (61, 'TRAIN_ASSEMBLY_2025', 7, 2001, 0.58, '调试工程师-主车体焊接', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (62, 'TRAIN_ASSEMBLY_2025', 7, 2002, 0.52, '调试工程师-侧面板安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (63, 'TRAIN_ASSEMBLY_2025', 7, 2003, 0.45, '调试工程师-车顶安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (64, 'TRAIN_ASSEMBLY_2025', 7, 2004, 0.88, '调试工程师-电气布线', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (65, 'TRAIN_ASSEMBLY_2025', 7, 2005, 0.82, '调试工程师-制动系统', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (66, 'TRAIN_ASSEMBLY_2025', 7, 2006, 0.35, '调试工程师-内饰安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (67, 'TRAIN_ASSEMBLY_2025', 7, 2007, 0.42, '调试工程师-涂装准备', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (68, 'TRAIN_ASSEMBLY_2025', 7, 2008, 0.78, '调试工程师-质量检查', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (69, 'TRAIN_ASSEMBLY_2025', 7, 2009, 0.95, '调试工程师-调试测试', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (70, 'TRAIN_ASSEMBLY_2025', 7, 2010, 0.85, '调试工程师-最终验收', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');

INSERT INTO `dm_topic0301_output_user_2` VALUES (71, 'TRAIN_ASSEMBLY_2025', 8, 2001, 0.82, '验收工程师-主车体焊接', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (72, 'TRAIN_ASSEMBLY_2025', 8, 2002, 0.78, '验收工程师-侧面板安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (73, 'TRAIN_ASSEMBLY_2025', 8, 2003, 0.85, '验收工程师-车顶安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (74, 'TRAIN_ASSEMBLY_2025', 8, 2004, 0.75, '验收工程师-电气布线', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (75, 'TRAIN_ASSEMBLY_2025', 8, 2005, 0.82, '验收工程师-制动系统', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (76, 'TRAIN_ASSEMBLY_2025', 8, 2006, 0.65, '验收工程师-内饰安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (77, 'TRAIN_ASSEMBLY_2025', 8, 2007, 0.55, '验收工程师-涂装准备', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (78, 'TRAIN_ASSEMBLY_2025', 8, 2008, 0.88, '验收工程师-质量检查', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (79, 'TRAIN_ASSEMBLY_2025', 8, 2009, 0.82, '验收工程师-调试测试', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (80, 'TRAIN_ASSEMBLY_2025', 8, 2010, 0.98, '验收工程师-最终验收', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');

INSERT INTO `dm_topic0301_output_user_2` VALUES (81, 'TRAIN_ASSEMBLY_2025', 9, 2001, 0.45, '装配学徒-主车体焊接', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (82, 'TRAIN_ASSEMBLY_2025', 9, 2002, 0.52, '装配学徒-侧面板安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (83, 'TRAIN_ASSEMBLY_2025', 9, 2003, 0.38, '装配学徒-车顶安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (84, 'TRAIN_ASSEMBLY_2025', 9, 2004, 0.25, '装配学徒-电气布线', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (85, 'TRAIN_ASSEMBLY_2025', 9, 2005, 0.32, '装配学徒-制动系统', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (86, 'TRAIN_ASSEMBLY_2025', 9, 2006, 0.68, '装配学徒-内饰安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (87, 'TRAIN_ASSEMBLY_2025', 9, 2007, 0.42, '装配学徒-涂装准备', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (88, 'TRAIN_ASSEMBLY_2025', 9, 2008, 0.35, '装配学徒-质量检查', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (89, 'TRAIN_ASSEMBLY_2025', 9, 2009, 0.28, '装配学徒-调试测试', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (90, 'TRAIN_ASSEMBLY_2025', 9, 2010, 0.45, '装配学徒-最终验收', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');

INSERT INTO `dm_topic0301_output_user_2` VALUES (91, 'TRAIN_ASSEMBLY_2025', 10, 2001, 0.65, '技术主管-主车体焊接', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (92, 'TRAIN_ASSEMBLY_2025', 10, 2002, 0.72, '技术主管-侧面板安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (93, 'TRAIN_ASSEMBLY_2025', 10, 2003, 0.68, '技术主管-车顶安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (94, 'TRAIN_ASSEMBLY_2025', 10, 2004, 0.75, '技术主管-电气布线', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (95, 'TRAIN_ASSEMBLY_2025', 10, 2005, 0.78, '技术主管-制动系统', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (96, 'TRAIN_ASSEMBLY_2025', 10, 2006, 0.58, '技术主管-内饰安装', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (97, 'TRAIN_ASSEMBLY_2025', 10, 2007, 0.52, '技术主管-涂装准备', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (98, 'TRAIN_ASSEMBLY_2025', 10, 2008, 0.85, '技术主管-质量检查', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (99, 'TRAIN_ASSEMBLY_2025', 10, 2009, 0.82, '技术主管-调试测试', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');
INSERT INTO `dm_topic0301_output_user_2` VALUES (100, 'TRAIN_ASSEMBLY_2025', 10, 2010, 0.95, '技术主管-最终验收', 0, -1, '', '2025-09-24 16:00:00', -1, '', '2025-09-24 16:00:00');

SET FOREIGN_KEY_CHECKS = 1;
