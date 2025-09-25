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

 Date: 25/09/2025 11:53:10
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dm_topic0302_output_equipment
-- ----------------------------
DROP TABLE IF EXISTS `dm_topic0302_output_equipment`;
CREATE TABLE `dm_topic0302_output_equipment`  (
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
) ENGINE = InnoDB AUTO_INCREMENT = 104 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '课题3设备健康度出参' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of dm_topic0302_output_equipment
-- ----------------------------
INSERT INTO `dm_topic0302_output_equipment` VALUES (1, '', 'CR400AF-2151', 0.94, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (2, '', 'CR400AF-2152', 0.94, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (3, '', 'CR400AF-2153', 0.95, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (4, '', 'CRH380A-2001', 0.37, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (5, '', 'CR400BF-2002', 0.38, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (6, '', 'CR400BF-2003', 0.63, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (7, '', 'CR200J-2004', 0.39, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (8, '', 'CR400BF-2005', 0.68, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (9, '', 'CR400AF-2006', 0.48, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (10, '', 'CR400AF-2007', 0.56, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (11, '', 'CR200J-2008', 0.38, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (12, '', 'CRH6A-2009', 0.60, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (13, '', 'CR400BF-2010', 0.54, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (14, '', 'CRH380A-2011', 0.56, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (15, '', 'CR200J-2012', 0.36, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (16, '', 'CRH380A-2013', 0.56, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (17, '', 'CRH380A-2014', 0.70, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (18, '', 'CR200J-2015', 0.59, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (19, '', 'CRH6A-2016', 0.45, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (20, '', 'CRH380A-2017', 0.53, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (21, '', 'CRH380A-2018', 0.53, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (22, '', 'CR200J-2019', 0.38, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (23, '', 'CR400AF-2020', 0.54, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (24, '', 'CRH380A-2021', 0.53, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (25, '', 'CR400AF-2022', 0.66, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (26, '', 'CRH380A-2023', 0.65, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (27, '', 'CRH6A-2024', 0.52, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (28, '', 'CRH6A-2025', 0.51, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (29, '', 'CR400AF-2026', 0.62, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (30, '', 'CR400BF-2027', 0.64, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (31, '', 'CR400AF-2028', 0.38, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (32, '', 'CR200J-2029', 0.54, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (33, '', 'CR400AF-2030', 0.68, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (34, '', 'CRH6A-2031', 0.55, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (35, '', 'CR400BF-2032', 0.38, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (36, '', 'CRH6A-2033', 0.68, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (37, '', 'CR200J-2034', 0.36, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (38, '', 'CR400BF-2035', 0.49, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (39, '', 'CRH380A-2036', 0.49, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (40, '', 'CRH6A-2037', 0.48, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (41, '', 'CR400AF-2038', 0.57, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (42, '', 'CRH6A-2039', 0.38, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (43, '', 'CRH380A-2040', 0.56, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (44, '', 'CR400BF-2041', 0.57, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (45, '', 'CRH6A-2042', 0.35, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (46, '', 'CRH380A-2043', 0.37, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (47, '', 'CRH6A-2044', 0.47, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (48, '', 'CR400AF-2045', 0.58, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (49, '', 'CR400BF-2046', 0.47, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (50, '', 'CRH6A-2047', 0.45, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (51, '', 'CR400AF-2048', 0.51, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (52, '', 'CRH380A-2049', 0.59, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (53, '', 'CR400AF-2050', 0.64, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (54, '', 'CR400BF-2051', 0.38, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (55, '', 'CRH6A-2052', 0.48, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (56, '', 'CRH380A-2053', 0.45, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (57, '', 'CRH6A-2054', 0.51, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (58, '', 'CR400AF-2055', 0.39, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (59, '', 'CRH6A-2056', 0.57, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (60, '', 'CRH6A-2057', 0.61, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (61, '', 'CRH380A-2058', 0.53, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (62, '', 'CR400BF-2059', 0.59, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (63, '', 'CRH380A-2060', 0.65, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (64, '', 'CRH380A-2061', 0.51, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (65, '', 'CRH6A-2062', 0.57, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (66, '', 'CR200J-2063', 0.57, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (67, '', 'CRH380A-2064', 0.59, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (68, '', 'CRH380A-2065', 0.35, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (69, '', 'CR200J-2066', 0.34, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (70, '', 'CR400BF-2067', 0.48, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (71, '', 'CR400AF-2068', 0.61, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (72, '', 'CR200J-2069', 0.62, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (73, '', 'CRH6A-2070', 0.53, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (74, '', 'CRH6A-2071', 0.49, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (75, '', 'CRH380A-2072', 0.55, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (76, '', 'CR400AF-2073', 0.55, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (77, '', 'CRH380A-2074', 0.55, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (78, '', 'CRH380A-2075', 0.48, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (79, '', 'CR400BF-2076', 0.52, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (80, '', 'CRH380A-2077', 0.64, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (81, '', 'CR200J-2078', 0.36, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (82, '', 'CR400BF-2079', 0.55, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (83, '', 'CR400AF-2080', 0.53, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (84, '', 'CR400AF-2081', 0.65, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (85, '', 'CRH6A-2082', 0.76, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (86, '', 'CR400AF-2083', 0.56, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (87, '', 'CR400AF-2084', 0.38, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (88, '', 'CRH380A-2085', 0.61, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (89, '', 'CR200J-2086', 0.53, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (90, '', 'CRH6A-2087', 0.56, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (91, '', 'CRH6A-2088', 0.37, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (92, '', 'CR200J-2089', 0.38, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (93, '', 'CRH6A-2090', 0.37, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (94, '', 'CR400AF-2091', 0.38, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (95, '', 'CR400BF-2092', 0.61, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (96, '', 'CR400AF-2093', 0.40, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (97, '', 'CRH6A-2094', 0.38, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (98, '', 'CRH6A-2095', 0.43, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (99, '', 'CRH6A-2096', 0.41, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (100, '', 'CR400BF-2097', 0.60, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (101, '', 'CR400AF-2098', 0.36, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (102, '', 'CR400BF-2099', 0.35, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');
INSERT INTO `dm_topic0302_output_equipment` VALUES (103, '', 'CR200J-2100', 0.62, '', 0, -1, '', '2025-09-24 16:04:52', -1, '', '2025-09-24 16:04:52');

SET FOREIGN_KEY_CHECKS = 1;
