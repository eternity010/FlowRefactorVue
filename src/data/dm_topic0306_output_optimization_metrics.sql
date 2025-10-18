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

 Date: 17/10/2025 15:42:45
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dm_topic0306_output_optimization_metrics
-- ----------------------------
DROP TABLE IF EXISTS `dm_topic0306_output_optimization_metrics`;
CREATE TABLE `dm_topic0306_output_optimization_metrics`  (
  `customer_id` int(11) NULL DEFAULT NULL COMMENT '客户唯一标识',
  `customer_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '客户名称',
  `lead_conversion_prob` double NULL DEFAULT NULL COMMENT '线索转化概率\r\n含义: 该客户名下“已转化”线索占全部线索的比例。',
  `avg_task_per_lead` double NULL DEFAULT NULL COMMENT '平均每条线索关联的任务数（工作量/投入的近似代理），三位小数',
  `assignment_cost` double NULL DEFAULT NULL COMMENT '指派成本（代理指标），三位小数,现在的“指派成本”是一个“工作量/投入”的代理指标，用的是每条线索平均关联的任务数，所以表现为小数（平均值可能不是整数）。\r\n含义：对该客户，每条线索从指派到完成，预期会消耗多少“任务单位”的投入。数值越大，说明单条线索平均需要更多跟进任务，指派给销售的边际成本更高',
  `overdue_ratio` double NULL DEFAULT NULL COMMENT '回款逾期占比，范围[0,1]，三位小数'
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '课题3-0306输出:优化指标' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of dm_topic0306_output_optimization_metrics
-- ----------------------------
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (1, '华信科技有限公司001', 0, 0, 0, 0.421);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (2, '华信科技有限公司002', 0.6, 1.333, 1.333, 0.199);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (3, '华信科技有限公司003', 0.5, 1.167, 1.167, 0.128);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (4, '华信科技有限公司004', 0.3, 2.5, 2.5, 0.352);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (5, '华信科技有限公司005', 0.5, 1.75, 1.75, 0.343);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (6, '华信科技有限公司006', 0.25, 2.167, 2.167, 0.129);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (7, '华信科技有限公司007', 0.333, 0, 0, 0.39);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (8, '华信科技有限公司008', 0.25, 2, 2, 0.414);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (9, '华信科技有限公司009', 0.2, 1.333, 1.333, 0.329);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (10, '华信科技有限公司010', 0.167, 0.5, 0.5, 0.254);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (11, '华信科技有限公司011', 0.5, 2, 2, 0.471);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (12, '华信科技有限公司012', 0.25, 1, 1, 0.385);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (13, '华信科技有限公司013', 0.2, 2, 2, 0.111);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (14, '华信科技有限公司014', 0.6, 1.333, 1.333, 0.27);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (15, '华信科技有限公司015', 0.286, 2.6, 2.6, 0.234);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (16, '华信科技有限公司016', 0, 0, 0, 0.178);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (17, '华信科技有限公司017', 0.667, 2, 2, 0.322);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (18, '华信科技有限公司018', 0.5, 1, 1, 0.326);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (19, '华信科技有限公司019', 0.6, 2, 2, 0.218);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (20, '华信科技有限公司020', 0.5, 2.75, 2.75, 0.311);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (21, '华信科技有限公司021', 0.2, 1.333, 1.333, 0.304);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (22, '华信科技有限公司022', 0.4, 2.333, 2.333, 0.356);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (23, '华信科技有限公司023', 0.143, 2.6, 2.6, 0.126);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (24, '华信科技有限公司024', 0, 0, 0, 0.339);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (25, '华信科技有限公司025', 0.25, 3.5, 3.5, 0.457);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (26, '华信科技有限公司026', 0, 0, 0, 0.447);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (27, '华信科技有限公司027', 0.25, 1.333, 1.333, 0.317);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (28, '华信科技有限公司028', 0.25, 0.5, 0.5, 0.326);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (29, '华信科技有限公司029', 0.2, 1.333, 1.333, 0.428);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (30, '华信科技有限公司030', 0.5, 2.5, 2.5, 0.327);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (31, '华信科技有限公司031', 0.429, 1.8, 1.8, 0.196);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (32, '华信科技有限公司032', 0.5, 1.75, 1.75, 0.148);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (33, '华信科技有限公司033', 0.167, 3.25, 3.25, 0.158);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (34, '华信科技有限公司034', 0.333, 1, 1, 0.446);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (35, '华信科技有限公司035', 0, 0, 0, 0.221);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (36, '华信科技有限公司036', 0.143, 2.4, 2.4, 0.496);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (37, '华信科技有限公司037', 0.25, 2, 2, 0.179);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (38, '华信科技有限公司038', 0.25, 1, 1, 0.357);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (39, '华信科技有限公司039', 0.4, 1.667, 1.667, 0.313);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (40, '华信科技有限公司040', 0.167, 1, 1, 0.323);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (41, '华信科技有限公司041', 0.167, 2, 2, 0.418);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (42, '华信科技有限公司042', 0, 0, 0, 0.21);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (43, '华信科技有限公司043', 0.2, 2.667, 2.667, 0.489);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (44, '华信科技有限公司044', 0.333, 1, 1, 0.373);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (45, '华信科技有限公司045', 0.5, 2, 2, 0.284);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (46, '华信科技有限公司046', 0.5, 1.5, 1.5, 0.254);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (47, '华信科技有限公司047', 0.333, 1, 1, 0.196);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (48, '华信科技有限公司048', 0.25, 1.5, 1.5, 0.116);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (49, '华信科技有限公司049', 0, 0, 0, 0.305);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (50, '华信科技有限公司050', 0.4, 2.667, 2.667, 0.276);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (51, '华信科技有限公司051', 0.25, 2, 2, 0.188);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (52, '华信科技有限公司052', 0.333, 3.75, 3.75, 0.227);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (53, '华信科技有限公司053', 0.5, 2, 2, 0.433);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (54, '华信科技有限公司054', 0.333, 3, 3, 0.386);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (55, '华信科技有限公司055', 0.333, 4, 4, 0.367);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (56, '华信科技有限公司056', 0.5, 2, 2, 0.4);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (57, '华信科技有限公司057', 0, 0, 0, 0.451);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (58, '华信科技有限公司058', 0.5, 1.25, 1.25, 0.128);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (59, '华信科技有限公司059', 0, 0, 0, 0.257);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (60, '华信科技有限公司060', 0.25, 2, 2, 0.473);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (61, '华信科技有限公司061', 0.143, 2.2, 2.2, 0.148);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (62, '华信科技有限公司062', 0.333, 2.75, 2.75, 0.342);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (63, '华信科技有限公司063', 0.25, 1.5, 1.5, 0.198);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (64, '华信科技有限公司064', 0.333, 3, 3, 0.453);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (65, '华信科技有限公司065', 0.4, 2, 2, 0.143);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (66, '华信科技有限公司066', 0, 0, 0, 0.116);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (67, '华信科技有限公司067', 0.4, 2.333, 2.333, 0.247);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (68, '华信科技有限公司068', 0.2, 1.667, 1.667, 0.427);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (69, '华信科技有限公司069', 0.25, 3, 3, 0.434);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (70, '华信科技有限公司070', 0.167, 1.25, 1.25, 0.317);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (71, '华信科技有限公司071', 0.333, 3, 3, 0.201);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (72, '华信科技有限公司072', 0.333, 3, 3, 0.247);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (73, '华信科技有限公司073', 0.25, 1, 1, 0.192);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (74, '华信科技有限公司074', 0.25, 3, 3, 0.274);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (75, '华信科技有限公司075', 0.167, 2.25, 2.25, 0.365);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (76, '华信科技有限公司076', 0.333, 2.5, 2.5, 0.301);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (77, '华信科技有限公司077', 0.333, 0, 0, 0.237);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (78, '华信科技有限公司078', 0, 0, 0, 0.489);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (79, '华信科技有限公司079', 0.4, 2, 2, 0.411);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (80, '华信科技有限公司080', 0.25, 1.5, 1.5, 0.191);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (81, '华信科技有限公司081', 0.286, 1.4, 1.4, 0.283);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (82, '华信科技有限公司082', 0.4, 1.667, 1.667, 0.156);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (83, '华信科技有限公司083', 0.333, 3, 3, 0.49);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (84, '华信科技有限公司084', 0, 0, 0, 0.345);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (85, '华信科技有限公司085', 0.667, 1, 1, 0.377);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (86, '华信科技有限公司086', 0.333, 1, 1, 0.207);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (87, '华信科技有限公司087', 0.75, 1.5, 1.5, 0.277);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (88, '华信科技有限公司088', 0, 0, 0, 0.441);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (89, '华信科技有限公司089', 0.167, 2.25, 2.25, 0.272);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (90, '华信科技有限公司090', 0.429, 2.8, 2.8, 0.232);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (91, '华信科技有限公司091', 0.6, 2.333, 2.333, 0.125);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (92, '华信科技有限公司092', 0.667, 2, 2, 0.298);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (93, '华信科技有限公司093', 0.5, 1.5, 1.5, 0.417);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (94, '华信科技有限公司094', 0.667, 2, 2, 0.166);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (95, '华信科技有限公司095', 0.5, 3, 3, 0.168);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (96, '华信科技有限公司096', 0.5, 2.5, 2.5, 0.416);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (97, '华信科技有限公司097', 0.25, 2, 2, 0.181);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (98, '华信科技有限公司098', 0.2, 1.667, 1.667, 0.39);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (99, '华信科技有限公司099', 0.6, 2.333, 2.333, 0.362);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (100, '华信科技有限公司100', 0.444, 2.571, 2.571, 0.474);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (101, '华信科技有限公司101', 0.167, 2.75, 2.75, 0.188);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (102, '华信科技有限公司102', 0.429, 1.6, 1.6, 0.308);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (103, '华信科技有限公司103', 0.4, 2.667, 2.667, 0.129);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (104, '华信科技有限公司104', 0.143, 1.8, 1.8, 0.359);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (105, '华信科技有限公司105', 0.2, 3, 3, 0.252);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (106, '华信科技有限公司106', 0.4, 2, 2, 0.362);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (107, '华信科技有限公司107', 0.667, 3, 3, 0.364);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (108, '华信科技有限公司108', 0.5, 1.5, 1.5, 0.255);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (109, '华信科技有限公司109', 0.143, 3.2, 3.2, 0.379);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (110, '华信科技有限公司110', 0.5, 1.5, 1.5, 0.241);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (111, '华信科技有限公司111', 0.5, 1, 1, 0.461);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (112, '华信科技有限公司112', 0.333, 0, 0, 0.314);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (113, '华信科技有限公司113', 0.4, 2.667, 2.667, 0.137);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (114, '华信科技有限公司114', 0.25, 0.5, 0.5, 0.433);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (115, '华信科技有限公司115', 0.333, 1, 1, 0.312);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (116, '华信科技有限公司116', 0.25, 2.5, 2.5, 0.346);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (117, '华信科技有限公司117', 0.6, 2.333, 2.333, 0.318);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (118, '华信科技有限公司118', 0.333, 1, 1, 0.36);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (119, '华信科技有限公司119', 0.4, 3, 3, 0.349);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (120, '华信科技有限公司120', 0.25, 3, 3, 0.261);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (121, '华信科技有限公司121', 0.333, 1.5, 1.5, 0.392);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (122, '华信科技有限公司122', 0.25, 1.833, 1.833, 0.476);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (123, '华信科技有限公司123', 0.333, 2, 2, 0.321);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (124, '华信科技有限公司124', 0.25, 1.5, 1.5, 0.189);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (125, '华信科技有限公司125', 0, 0, 0, 0.423);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (126, '华信科技有限公司126', 0.167, 1, 1, 0.234);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (127, '华信科技有限公司127', 0.25, 1.5, 1.5, 0.231);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (128, '华信科技有限公司128', 0.2, 3, 3, 0.124);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (129, '华信科技有限公司129', 0.4, 2, 2, 0.32);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (130, '华信科技有限公司130', 0.286, 1.2, 1.2, 0.268);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (131, '华信科技有限公司131', 0, 0, 0, 0.146);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (132, '华信科技有限公司132', 0.667, 0, 0, 0.168);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (133, '华信科技有限公司133', 0.333, 2, 2, 0.413);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (134, '华信科技有限公司134', 0.286, 1.6, 1.6, 0.295);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (135, '华信科技有限公司135', 0.5, 2, 2, 0.168);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (136, '华信科技有限公司136', 0.667, 1, 1, 0.219);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (137, '华信科技有限公司137', 0.5, 1.5, 1.5, 0.287);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (138, '华信科技有限公司138', 0.333, 6, 6, 0.239);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (139, '华信科技有限公司139', 0.25, 3, 3, 0.448);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (140, '华信科技有限公司140', 0.4, 1.333, 1.333, 0.457);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (141, '华信科技有限公司141', 0.2, 2.333, 2.333, 0.249);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (142, '华信科技有限公司142', 0.333, 0, 0, 0.228);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (143, '华信科技有限公司143', 0, 0, 0, 0.314);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (144, '华信科技有限公司144', 0.25, 2.5, 2.5, 0.27);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (145, '华信科技有限公司145', 0.2, 2.667, 2.667, 0.269);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (146, '华信科技有限公司146', 0.25, 1, 1, 0.142);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (147, '华信科技有限公司147', 0.333, 2, 2, 0.138);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (148, '华信科技有限公司148', 0.167, 1, 1, 0.333);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (149, '华信科技有限公司149', 0.2, 1, 1, 0.193);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (150, '华信科技有限公司150', 0.2, 2, 2, 0.387);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (151, '华信科技有限公司151', 0.333, 0, 0, 0.374);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (152, '华信科技有限公司152', 0.25, 0.5, 0.5, 0.49);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (153, '华信科技有限公司153', 0, 0, 0, 0.476);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (154, '华信科技有限公司154', 0, 0, 0, 0.235);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (155, '华信科技有限公司155', 0.4, 2, 2, 0.251);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (156, '华信科技有限公司156', 0.25, 3, 3, 0.398);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (157, '华信科技有限公司157', 0.333, 2.25, 2.25, 0.445);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (158, '华信科技有限公司158', 0.25, 2, 2, 0.108);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (159, '华信科技有限公司159', 0.5, 1.5, 1.5, 0.333);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (160, '华信科技有限公司160', 0.286, 1.2, 1.2, 0.203);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (161, '华信科技有限公司161', 0.5, 2.5, 2.5, 0.428);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (162, '华信科技有限公司162', 0.667, 1, 1, 0.285);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (163, '华信科技有限公司163', 0.6, 2.667, 2.667, 0.247);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (164, '华信科技有限公司164', 0.333, 2, 2, 0.108);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (165, '华信科技有限公司165', 0.333, 2, 2, 0.267);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (166, '华信科技有限公司166', 0.143, 3, 3, 0.453);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (167, '华信科技有限公司167', 0.5, 4, 4, 0.218);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (168, '华信科技有限公司168', 0.6, 1, 1, 0.445);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (169, '华信科技有限公司169', 0.2, 1, 1, 0.479);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (170, '华信科技有限公司170', 0.25, 1.5, 1.5, 0.114);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (171, '华信科技有限公司171', 0.25, 0.5, 0.5, 0.391);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (172, '华信科技有限公司172', 0.167, 1.75, 1.75, 0.444);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (173, '华信科技有限公司173', 0.4, 1.333, 1.333, 0.333);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (174, '华信科技有限公司174', 0.333, 1, 1, 0.26);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (175, '华信科技有限公司175', 0.5, 1.667, 1.667, 0.158);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (176, '华信科技有限公司176', 0.5, 3, 3, 0.423);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (177, '华信科技有限公司177', 0.2, 1.667, 1.667, 0.346);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (178, '华信科技有限公司178', 0.25, 1, 1, 0.138);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (179, '华信科技有限公司179', 0.2, 3, 3, 0.16);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (180, '华信科技有限公司180', 0.333, 2, 2, 0.443);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (181, '华信科技有限公司181', 0.333, 3, 3, 0.381);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (182, '华信科技有限公司182', 0.333, 2, 2, 0.288);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (183, '华信科技有限公司183', 0.75, 2, 2, 0.121);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (184, '华信科技有限公司184', 0.143, 1.8, 1.8, 0.178);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (185, '华信科技有限公司185', 0.333, 4, 4, 0.338);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (186, '华信科技有限公司186', 0.25, 0.5, 0.5, 0.201);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (187, '华信科技有限公司187', 0, 0, 0, 0.325);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (188, '华信科技有限公司188', 0.333, 3.5, 3.5, 0.139);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (189, '华信科技有限公司189', 0.6, 2.333, 2.333, 0.303);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (190, '华信科技有限公司190', 0.4, 1, 1, 0.116);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (191, '华信科技有限公司191', 0.333, 2, 2, 0.287);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (192, '华信科技有限公司192', 0.25, 2.5, 2.5, 0.244);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (193, '华信科技有限公司193', 0.5, 3.5, 3.5, 0.138);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (194, '华信科技有限公司194', 0.5, 1, 1, 0.153);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (195, '华信科技有限公司195', 0, 0, 0, 0.385);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (196, '华信科技有限公司196', 0.333, 2, 2, 0.269);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (197, '华信科技有限公司197', 0.25, 2.5, 2.5, 0.21);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (198, '华信科技有限公司198', 0.667, 3, 3, 0.456);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (199, '华信科技有限公司199', 0.333, 3.5, 3.5, 0.394);
INSERT INTO `dm_topic0306_output_optimization_metrics` VALUES (200, '华信科技有限公司200', 0.25, 2.167, 2.167, 0.127);

SET FOREIGN_KEY_CHECKS = 1;
