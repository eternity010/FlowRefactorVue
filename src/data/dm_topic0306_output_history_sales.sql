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

 Date: 16/10/2025 16:31:01
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dm_topic0306_output_history_sales
-- ----------------------------
DROP TABLE IF EXISTS `dm_topic0306_output_history_sales`;
CREATE TABLE `dm_topic0306_output_history_sales`  (
  `customer_id` int(11) NULL DEFAULT NULL COMMENT '客户唯一标识',
  `customer_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '客户名称',
  `owner_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '当前负责该客户的销售/负责人',
  `hist_contract_cnt` double NULL DEFAULT NULL COMMENT '历史累计合同数量（客户历史成交活跃度）',
  `hist_contract_amount` double NULL DEFAULT NULL COMMENT '历史累计合同金额（客户历史成交体量）',
  `received_amount` double NULL DEFAULT NULL COMMENT '历史累计已回款金额（客户回款质量）',
  `overdue_amount` double NULL DEFAULT NULL COMMENT '历史累计逾期金额（客户回款风险）'
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '课题3-0306输出:历史销售记录' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of dm_topic0306_output_history_sales
-- ----------------------------
INSERT INTO `dm_topic0306_output_history_sales` VALUES (1, '华信科技有限公司001', '张伟', 10, 476.79, 275.83, 200.96);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (2, '华信科技有限公司002', '张伟', 1, 200.97, 160.99, 39.98);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (3, '华信科技有限公司003', '刘洋', 10, 235.32, 205.19, 30.13);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (4, '华信科技有限公司004', '张伟', 2, 466.85, 302.29, 164.56);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (5, '华信科技有限公司005', '张伟', 6, 285.32, 187.59, 97.73);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (6, '华信科技有限公司006', '张伟', 13, 107.11, 93.3, 13.81);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (7, '华信科技有限公司007', '李娜', 3, 292.48, 178.49, 113.99);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (8, '华信科技有限公司008', '赵敏', 14, 117.73, 68.96, 48.77);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (9, '华信科技有限公司009', '李娜', 18, 65.75, 44.13, 21.62);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (10, '华信科技有限公司010', '赵敏', 4, 495.29, 369.66, 125.63);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (11, '华信科技有限公司011', '张伟', 1, 302.44, 159.85, 142.59);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (12, '华信科技有限公司012', '刘洋', 19, 446.4, 274.53, 171.87);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (13, '华信科技有限公司013', '张伟', 3, 69.5, 61.78, 7.72);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (14, '华信科技有限公司014', '王强', 19, 445.01, 324.92, 120.09);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (15, '华信科技有限公司015', '赵敏', 16, 29.39, 22.52, 6.87);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (16, '华信科技有限公司016', '刘洋', 3, 411.2, 338.03, 73.17);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (17, '华信科技有限公司017', '李娜', 3, 309.9, 210.17, 99.73);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (18, '华信科技有限公司018', '王强', 15, 381.71, 257.45, 124.26);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (19, '华信科技有限公司019', '张伟', 9, 465.26, 363.83, 101.43);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (20, '华信科技有限公司020', '李娜', 1, 50.74, 34.97, 15.77);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (21, '华信科技有限公司021', '张伟', 13, 205.29, 142.96, 62.33);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (22, '华信科技有限公司022', '李娜', 7, 193.23, 124.35, 68.88);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (23, '华信科技有限公司023', '张伟', 15, 45.85, 40.05, 5.8);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (24, '华信科技有限公司024', '赵敏', 20, 269.83, 178.4, 91.43);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (25, '华信科技有限公司025', '刘洋', 7, 136.57, 74.13, 62.44);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (26, '华信科技有限公司026', '王强', 14, 183.16, 101.32, 81.84);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (27, '华信科技有限公司027', '刘洋', 2, 433.48, 295.94, 137.54);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (28, '华信科技有限公司028', '刘洋', 15, 351.5, 236.85, 114.65);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (29, '华信科技有限公司029', '李娜', 8, 79.73, 45.57, 34.16);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (30, '华信科技有限公司030', '张伟', 15, 219.16, 147.41, 71.75);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (31, '华信科技有限公司031', '刘洋', 7, 447.15, 359.49, 87.66);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (32, '华信科技有限公司032', '刘洋', 7, 450.34, 383.63, 66.71);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (33, '华信科技有限公司033', '赵敏', 12, 499.8, 420.82, 78.98);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (34, '华信科技有限公司034', '张伟', 4, 207.81, 115.18, 92.63);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (35, '华信科技有限公司035', '李娜', 10, 150.87, 117.53, 33.34);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (36, '华信科技有限公司036', '张伟', 16, 176.49, 88.88, 87.61);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (37, '华信科技有限公司037', '张伟', 3, 50.81, 41.72, 9.09);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (38, '华信科技有限公司038', '王强', 10, 405.51, 260.7, 144.81);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (39, '华信科技有限公司039', '李娜', 13, 239.1, 164.32, 74.78);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (40, '华信科技有限公司040', '张伟', 7, 361.85, 244.86, 116.99);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (41, '华信科技有限公司041', '李娜', 6, 150.71, 87.66, 63.05);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (42, '华信科技有限公司042', '王强', 13, 306.38, 242.14, 64.24);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (43, '华信科技有限公司043', '张伟', 19, 275.04, 140.63, 134.41);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (44, '华信科技有限公司044', '赵敏', 14, 112.29, 70.36, 41.93);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (45, '华信科技有限公司045', '张伟', 18, 288.95, 207, 81.95);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (46, '华信科技有限公司046', '李娜', 9, 360.83, 269.33, 91.5);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (47, '华信科技有限公司047', '王强', 5, 453.1, 364.38, 88.72);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (48, '华信科技有限公司048', '王强', 10, 19.66, 17.37, 2.29);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (49, '华信科技有限公司049', '刘洋', 10, 244.08, 169.61, 74.47);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (50, '华信科技有限公司050', '刘洋', 2, 216.68, 156.78, 59.9);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (51, '华信科技有限公司051', '赵敏', 19, 291.21, 236.48, 54.73);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (52, '华信科技有限公司052', '刘洋', 15, 344.85, 266.67, 78.18);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (53, '华信科技有限公司053', '王强', 8, 291.63, 165.42, 126.21);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (54, '华信科技有限公司054', '赵敏', 9, 154.27, 94.75, 59.52);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (55, '华信科技有限公司055', '李娜', 18, 432.9, 273.94, 158.96);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (56, '华信科技有限公司056', '李娜', 2, 125.05, 75, 50.05);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (57, '华信科技有限公司057', '王强', 12, 280.77, 154.08, 126.69);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (58, '华信科技有限公司058', '王强', 12, 298.42, 260.16, 38.26);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (59, '华信科技有限公司059', '王强', 9, 338.77, 251.77, 87);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (60, '华信科技有限公司060', '张伟', 11, 384.82, 202.74, 182.08);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (61, '华信科技有限公司061', '赵敏', 8, 305.18, 260, 45.18);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (62, '华信科技有限公司062', '赵敏', 5, 288.88, 190.09, 98.79);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (63, '华信科技有限公司063', '刘洋', 4, 497.67, 399.27, 98.4);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (64, '华信科技有限公司064', '张伟', 10, 142.55, 78.01, 64.54);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (65, '华信科技有限公司065', '李娜', 8, 116.91, 100.14, 16.77);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (66, '华信科技有限公司066', '李娜', 19, 198.13, 175.14, 22.99);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (67, '华信科技有限公司067', '王强', 9, 428.83, 322.98, 105.85);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (68, '华信科技有限公司068', '王强', 8, 29.05, 16.65, 12.4);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (69, '华信科技有限公司069', '王强', 13, 200.33, 113.48, 86.85);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (70, '华信科技有限公司070', '赵敏', 4, 489.72, 334.52, 155.2);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (71, '华信科技有限公司071', '张伟', 5, 267.55, 213.64, 53.91);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (72, '华信科技有限公司072', '赵敏', 11, 138.42, 104.21, 34.21);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (73, '华信科技有限公司073', '张伟', 1, 395.66, 319.8, 75.86);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (74, '华信科技有限公司074', '王强', 19, 365.11, 265.08, 100.03);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (75, '华信科技有限公司075', '王强', 7, 297.36, 188.75, 108.61);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (76, '华信科技有限公司076', '刘洋', 8, 450.03, 314.75, 135.28);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (77, '华信科技有限公司077', '赵敏', 2, 96.16, 73.33, 22.83);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (78, '华信科技有限公司078', '李娜', 12, 217.53, 111.14, 106.39);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (79, '华信科技有限公司079', '刘洋', 12, 322.06, 189.81, 132.25);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (80, '华信科技有限公司080', '李娜', 20, 44.02, 35.63, 8.39);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (81, '华信科技有限公司081', '李娜', 14, 440.05, 315.61, 124.44);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (82, '华信科技有限公司082', '赵敏', 17, 298.09, 251.55, 46.54);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (83, '华信科技有限公司083', '李娜', 6, 285.66, 145.6, 140.06);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (84, '华信科技有限公司084', '赵敏', 8, 379.37, 248.38, 130.99);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (85, '华信科技有限公司085', '王强', 3, 258.39, 161, 97.39);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (86, '华信科技有限公司086', '王强', 4, 90.47, 71.77, 18.7);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (87, '华信科技有限公司087', '李娜', 12, 12.23, 8.84, 3.39);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (88, '华信科技有限公司088', '王强', 13, 262.84, 146.88, 115.96);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (89, '华信科技有限公司089', '李娜', 20, 241.09, 175.45, 65.64);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (90, '华信科技有限公司090', '李娜', 15, 46.53, 35.75, 10.78);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (91, '华信科技有限公司091', '王强', 17, 38.58, 33.74, 4.84);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (92, '华信科技有限公司092', '赵敏', 5, 264.63, 185.79, 78.84);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (93, '华信科技有限公司093', '李娜', 14, 273.68, 159.6, 114.08);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (94, '华信科技有限公司094', '李娜', 6, 440.33, 367.34, 72.99);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (95, '华信科技有限公司095', '王强', 13, 438.63, 365.03, 73.6);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (96, '华信科技有限公司096', '赵敏', 2, 20.54, 12, 8.54);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (97, '华信科技有限公司097', '刘洋', 16, 243.97, 199.75, 44.22);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (98, '华信科技有限公司098', '王强', 17, 63.35, 38.62, 24.73);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (99, '华信科技有限公司099', '赵敏', 7, 294.2, 187.82, 106.38);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (100, '华信科技有限公司100', '刘洋', 12, 14.33, 7.54, 6.79);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (101, '华信科技有限公司101', '赵敏', 7, 225.74, 183.23, 42.51);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (102, '华信科技有限公司102', '李娜', 18, 223.61, 154.63, 68.98);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (103, '华信科技有限公司103', '王强', 9, 481.57, 419.55, 62.02);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (104, '华信科技有限公司104', '赵敏', 8, 373.63, 239.35, 134.28);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (105, '华信科技有限公司105', '刘洋', 7, 152.08, 113.68, 38.4);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (106, '华信科技有限公司106', '李娜', 18, 387, 246.82, 140.18);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (107, '华信科技有限公司107', '赵敏', 18, 455.56, 289.65, 165.91);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (108, '华信科技有限公司108', '刘洋', 19, 101.1, 75.31, 25.79);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (109, '华信科技有限公司109', '赵敏', 8, 209.53, 130.02, 79.51);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (110, '华信科技有限公司110', '刘洋', 3, 345.33, 262.08, 83.25);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (111, '华信科技有限公司111', '王强', 17, 146.52, 78.91, 67.61);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (112, '华信科技有限公司112', '李娜', 12, 193.45, 132.64, 60.81);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (113, '华信科技有限公司113', '王强', 4, 25.76, 22.23, 3.53);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (114, '华信科技有限公司114', '刘洋', 12, 278.89, 158.07, 120.82);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (115, '华信科技有限公司115', '刘洋', 10, 396.53, 272.63, 123.9);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (116, '华信科技有限公司116', '张伟', 8, 473.92, 309.91, 164.01);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (117, '华信科技有限公司117', '赵敏', 14, 32.47, 22.13, 10.34);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (118, '华信科技有限公司118', '刘洋', 8, 90.54, 57.95, 32.59);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (119, '华信科技有限公司119', '王强', 4, 441.66, 287.46, 154.2);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (120, '华信科技有限公司120', '李娜', 5, 67.77, 50.06, 17.71);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (121, '华信科技有限公司121', '张伟', 9, 433.27, 263.44, 169.83);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (122, '华信科技有限公司122', '赵敏', 8, 213.35, 111.74, 101.61);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (123, '华信科技有限公司123', '刘洋', 20, 33.76, 22.92, 10.84);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (124, '华信科技有限公司124', '刘洋', 17, 492.18, 399.12, 93.06);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (125, '华信科技有限公司125', '赵敏', 15, 188.46, 108.76, 79.7);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (126, '华信科技有限公司126', '王强', 2, 469.57, 359.7, 109.87);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (127, '华信科技有限公司127', '赵敏', 2, 307.41, 236.47, 70.94);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (128, '华信科技有限公司128', '张伟', 10, 143.95, 126.06, 17.89);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (129, '华信科技有限公司129', '赵敏', 15, 132.21, 89.89, 42.32);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (130, '华信科技有限公司130', '张伟', 9, 49.42, 36.2, 13.22);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (131, '华信科技有限公司131', '赵敏', 17, 127.85, 109.2, 18.65);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (132, '华信科技有限公司132', '李娜', 20, 364.74, 303.37, 61.37);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (133, '华信科技有限公司133', '赵敏', 4, 82.75, 48.6, 34.15);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (134, '华信科技有限公司134', '李娜', 14, 313.34, 220.86, 92.48);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (135, '华信科技有限公司135', '张伟', 6, 314.36, 261.4, 52.96);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (136, '华信科技有限公司136', '李娜', 9, 274.01, 213.88, 60.13);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (137, '华信科技有限公司137', '王强', 5, 107.08, 76.32, 30.76);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (138, '华信科技有限公司138', '刘洋', 15, 434.18, 330.26, 103.92);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (139, '华信科技有限公司139', '赵敏', 1, 248.89, 137.46, 111.43);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (140, '华信科技有限公司140', '刘洋', 17, 248.51, 134.87, 113.64);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (141, '华信科技有限公司141', '李娜', 12, 344.35, 258.6, 85.75);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (142, '华信科技有限公司142', '赵敏', 2, 315.3, 243.27, 72.03);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (143, '华信科技有限公司143', '刘洋', 8, 127.65, 87.58, 40.07);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (144, '华信科技有限公司144', '张伟', 3, 337.12, 246.01, 91.11);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (145, '华信科技有限公司145', '张伟', 10, 262.88, 192.26, 70.62);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (146, '华信科技有限公司146', '赵敏', 10, 478.05, 410.14, 67.91);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (147, '华信科技有限公司147', '刘洋', 13, 426.54, 367.53, 59.01);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (148, '华信科技有限公司148', '张伟', 2, 201.21, 134.3, 66.91);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (149, '华信科技有限公司149', '赵敏', 11, 322.68, 260.45, 62.23);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (150, '华信科技有限公司150', '赵敏', 7, 116.99, 71.73, 45.26);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (151, '华信科技有限公司151', '张伟', 9, 485.35, 303.73, 181.62);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (152, '华信科技有限公司152', '赵敏', 2, 461.39, 235.47, 225.92);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (153, '华信科技有限公司153', '刘洋', 13, 403.41, 211.27, 192.14);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (154, '华信科技有限公司154', '刘洋', 15, 278.24, 212.97, 65.27);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (155, '华信科技有限公司155', '刘洋', 13, 243.09, 181.99, 61.1);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (156, '华信科技有限公司156', '刘洋', 11, 318.05, 191.43, 126.62);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (157, '华信科技有限公司157', '王强', 15, 104.04, 57.77, 46.27);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (158, '华信科技有限公司158', '李娜', 14, 397.18, 354.38, 42.8);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (159, '华信科技有限公司159', '李娜', 16, 177.08, 118.14, 58.94);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (160, '华信科技有限公司160', '王强', 9, 15.58, 12.42, 3.16);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (161, '华信科技有限公司161', '李娜', 12, 126.14, 72.09, 54.05);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (162, '华信科技有限公司162', '刘洋', 13, 312.88, 223.61, 89.27);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (163, '华信科技有限公司163', '李娜', 8, 473.71, 356.76, 116.95);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (164, '华信科技有限公司164', '刘洋', 8, 403.13, 359.7, 43.43);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (165, '华信科技有限公司165', '赵敏', 16, 476.12, 349.12, 127);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (166, '华信科技有限公司166', '张伟', 14, 175.19, 95.86, 79.33);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (167, '华信科技有限公司167', '赵敏', 12, 44.66, 34.94, 9.72);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (168, '华信科技有限公司168', '王强', 9, 420.99, 233.46, 187.53);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (169, '华信科技有限公司169', '张伟', 4, 446.73, 232.71, 214.02);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (170, '华信科技有限公司170', '赵敏', 1, 124.95, 110.66, 14.29);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (171, '华信科技有限公司171', '王强', 1, 16.46, 10.02, 6.44);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (172, '华信科技有限公司172', '刘洋', 16, 107.97, 60, 47.97);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (173, '华信科技有限公司173', '张伟', 3, 413.96, 276.09, 137.87);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (174, '华信科技有限公司174', '赵敏', 17, 275, 203.63, 71.37);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (175, '华信科技有限公司175', '刘洋', 2, 218.07, 183.69, 34.38);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (176, '华信科技有限公司176', '王强', 19, 172.77, 99.74, 73.03);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (177, '华信科技有限公司177', '赵敏', 19, 67.42, 44.09, 23.33);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (178, '华信科技有限公司178', '刘洋', 8, 102.86, 88.71, 14.15);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (179, '华信科技有限公司179', '刘洋', 5, 240.81, 202.25, 38.56);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (180, '华信科技有限公司180', '赵敏', 4, 306.84, 170.96, 135.88);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (181, '华信科技有限公司181', '张伟', 9, 241, 149.24, 91.76);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (182, '华信科技有限公司182', '赵敏', 3, 163.07, 116.1, 46.97);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (183, '华信科技有限公司183', '张伟', 11, 10.89, 9.57, 1.32);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (184, '华信科技有限公司184', '赵敏', 9, 302.26, 248.38, 53.88);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (185, '华信科技有限公司185', '王强', 13, 91.4, 60.51, 30.89);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (186, '华信科技有限公司186', '张伟', 7, 376.48, 300.99, 75.49);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (187, '华信科技有限公司187', '张伟', 8, 83.98, 56.71, 27.27);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (188, '华信科技有限公司188', '张伟', 6, 126.1, 108.62, 17.48);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (189, '华信科技有限公司189', '王强', 13, 165.34, 115.18, 50.16);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (190, '华信科技有限公司190', '张伟', 14, 362.97, 320.81, 42.16);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (191, '华信科技有限公司191', '刘洋', 17, 381.92, 272.17, 109.75);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (192, '华信科技有限公司192', '刘洋', 8, 178.3, 134.88, 43.42);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (193, '华信科技有限公司193', '刘洋', 20, 444.01, 382.56, 61.45);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (194, '华信科技有限公司194', '张伟', 8, 290.15, 245.63, 44.52);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (195, '华信科技有限公司195', '李娜', 2, 176.05, 108.27, 67.78);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (196, '华信科技有限公司196', '刘洋', 10, 206.3, 150.75, 55.55);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (197, '华信科技有限公司197', '李娜', 8, 58.2, 46, 12.2);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (198, '华信科技有限公司198', '张伟', 3, 308.39, 167.85, 140.54);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (199, '华信科技有限公司199', '赵敏', 11, 385.43, 233.66, 151.77);
INSERT INTO `dm_topic0306_output_history_sales` VALUES (200, '华信科技有限公司200', '王强', 13, 344.03, 300.49, 43.54);

SET FOREIGN_KEY_CHECKS = 1;
