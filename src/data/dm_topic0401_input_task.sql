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

 Date: 23/09/2025 16:03:50
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dm_topic0401_input_task
-- ----------------------------
DROP TABLE IF EXISTS `dm_topic0401_input_task`;
CREATE TABLE `dm_topic0401_input_task`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `model_run_batch` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '模型运行批次标记',
  `task_id` int(11) NULL DEFAULT NULL COMMENT '任务id',
  `work_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '工作令',
  `sale_order_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '销售订单号',
  `order_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '生产订单号',
  `order_need_num` int(11) NOT NULL DEFAULT 0 COMMENT '订单需求数量',
  `plan_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '主计划编号',
  `work_order_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '-1' COMMENT '工单号',
  `batch_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '批次号',
  `dispatch_order_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '-1' COMMENT '派工单号',
  `procedure_id` int(11) NULL DEFAULT -1 COMMENT '工序id',
  `procedure_code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '-1' COMMENT '工序编码',
  `procedure_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '工序描述',
  `procedure_content` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '工序内容',
  `procedure_order` int(11) NOT NULL DEFAULT -1 COMMENT '工序顺序号',
  `procedure_plan_preparation_time` bigint(14) NOT NULL DEFAULT 0 COMMENT '工序准备时长（min）',
  `procedure_plan_work_time` bigint(14) NOT NULL DEFAULT 0 COMMENT '工序标准生产时长（min）',
  `receive_id` int(11) NOT NULL DEFAULT -1 COMMENT '派工单接收人id，生产负责人',
  `receive_time` datetime NULL DEFAULT NULL COMMENT '派工单接收时间',
  `receive_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '派工单接收人name',
  `product_id` int(11) NULL DEFAULT NULL COMMENT '产品id',
  `product_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '产品编码',
  `product_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '产品描述',
  `order_type` tinyint(1) NOT NULL DEFAULT 2 COMMENT '维度 1-工单 2-派工单 3-人员 4-设备',
  `task_num` int(4) NOT NULL DEFAULT 0 COMMENT '派工单数量',
  `report_num` int(4) NOT NULL DEFAULT 0 COMMENT '已报工数量',
  `plan_start_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '计划开始时间',
  `plan_end_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '计划完成时间',
  `real_start_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '实际开始时间',
  `real_end_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '实际完成时间',
  `jockey_id` int(11) NOT NULL DEFAULT -1 COMMENT '操作工',
  `jockey_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '操作工工号',
  `jockey_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '操作工名称',
  `equipment_ids` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '-1' COMMENT '生产设备id拼接 逗号隔开',
  `equipment_speed_range` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '机器可调速度范围',
  `equipment_unit_process_energy` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '单位加工能耗(kWh/件)',
  `equipment_unit_idle_energy` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '单位待机能耗(kWh/小时)',
  `work_center_id` int(11) NOT NULL DEFAULT -1 COMMENT '工作中心id',
  `work_center_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '工作中心编码',
  `work_center_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '工作中心名称',
  `line_id` int(11) NOT NULL DEFAULT -1 COMMENT '产线id',
  `line_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '产线编码',
  `line_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '产线描述',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '备注',
  `del_flag` tinyint(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除标识',
  `create_id` int(11) NOT NULL DEFAULT -1 COMMENT '创建者ID',
  `create_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '创建者姓名',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_id` int(11) NOT NULL DEFAULT -1 COMMENT '更新者ID',
  `update_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '更新者姓名',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '工位计划排产表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of dm_topic0401_input_task
-- ----------------------------

INSERT INTO `dm_topic0401_input_task` VALUES (7, '20240905', 1001, 'W001', 'SO001', 'ORD001', 100, 'P001', 'WO001', 'B001', 'D001', 1, '101', '下料', '原材料下料切割', 1, 5, 30, 1001, '2025-09-03 08:00:00', '张三', 1001, 'PROD001', '轴承座', 2, 100, 0, '2025-09-03 08:00:00', '2025-09-03 08:30:00', '2025-09-03 08:00:00', '2025-09-03 08:30:00', 101, 'J001', '李师傅', '1;7;15', '1-4', 5.50, 2.10, 1001, 'WC01', '机加工中心1', 2001, 'LINE01', '生产线1', '', 0, 1, 'admin', '2025-09-03 08:00:00', 1, 'admin', '2025-09-03 08:00:00');
INSERT INTO `dm_topic0401_input_task` VALUES (8, '20240905', 1002, 'W002', 'SO001', 'ORD001', 100, 'P001', 'WO001', 'B001', 'D002', 2, '102', '粗加工', '工件粗加工成型', 2, 5, 30, 1002, '2025-09-03 08:03:00', '李四', 1001, 'PROD001', '轴承座', 2, 100, 0, '2025-09-03 08:30:00', '2025-09-03 09:00:00', '2025-09-03 08:30:00', '2025-09-03 09:00:00', 102, 'J002', '王师傅', '2;8', '1-3', 4.20, 1.80, 1002, 'WC02', '机加工中心2', 2001, 'LINE01', '生产线1', '', 0, 1, 'admin', '2025-09-03 08:00:00', 1, 'admin', '2025-09-03 08:00:00');
INSERT INTO `dm_topic0401_input_task` VALUES (9, '20240905', 1003, 'W003', 'SO001', 'ORD001', 100, 'P001', 'WO001', 'B001', 'D003', 3, '103', '精加工', '工件精密加工', 3, 5, 30, 1003, '2025-09-03 08:06:00', '赵五', 1001, 'PROD001', '轴承座', 2, 100, 0, '2025-09-03 09:00:00', '2025-09-03 09:30:00', '2025-09-03 09:00:00', '2025-09-03 09:30:00', 103, 'J003', '刘师傅', '3;9;16', '1-4', 3.80, 1.50, 1003, 'WC03', '精密加工中心', 2001, 'LINE01', '生产线1', '', 0, 1, 'admin', '2025-09-03 08:00:00', 1, 'admin', '2025-09-03 08:00:00');
INSERT INTO `dm_topic0401_input_task` VALUES (10, '20240905', 1004, 'W004', 'SO001', 'ORD001', 100, 'P001', 'WO001', 'B001', 'D004', 4, '106', '检验包装', '成品检验包装', 4, 5, 30, 1006, '2025-09-03 08:15:00', '周八', 1001, 'PROD001', '轴承座', 2, 100, 0, '2025-09-03 09:30:00', '2025-09-03 10:00:00', '2025-09-03 09:30:00', '2025-09-03 10:00:00', 106, 'J006', '郑师傅', '6;12', '1-2', 1.00, 0.50, 1006, 'WC06', '检验包装中心', 2002, 'LINE02', '生产线2', '', 0, 1, 'admin', '2025-09-03 08:00:00', 1, 'admin', '2025-09-03 08:00:00');
INSERT INTO `dm_topic0401_input_task` VALUES (11, '20240905', 2001, 'W005', 'SO002', 'ORD002', 150, 'P002', 'WO002', 'B002', 'D005', 1, '101', '下料', '原材料下料切割', 1, 5, 30, 1007, '2025-09-03 08:22:00', '张三', 1002, 'PROD002', '法兰盘', 2, 150, 0, '2025-09-03 10:00:00', '2025-09-03 10:30:00', '2025-09-03 10:00:00', '2025-09-03 10:30:00', 101, 'J001', '李师傅', '1;7;15', '1-4', 5.50, 2.10, 1001, 'WC01', '机加工中心1', 2001, 'LINE01', '生产线1', '', 0, 1, 'admin', '2025-09-03 08:00:00', 1, 'admin', '2025-09-03 08:00:00');
INSERT INTO `dm_topic0401_input_task` VALUES (12, '20240905', 2002, 'W006', 'SO002', 'ORD002', 150, 'P002', 'WO002', 'B002', 'D006', 2, '102', '粗加工', '工件粗加工成型', 2, 5, 30, 1008, '2025-09-03 08:25:00', '李四', 1002, 'PROD002', '法兰盘', 2, 150, 0, '2025-09-03 10:30:00', '2025-09-03 11:00:00', '2025-09-03 10:30:00', '2025-09-03 11:00:00', 102, 'J002', '王师傅', '2;8', '1-3', 4.20, 1.80, 1002, 'WC02', '机加工中心2', 2001, 'LINE01', '生产线1', '', 0, 1, 'admin', '2025-09-03 08:00:00', 1, 'admin', '2025-09-03 08:00:00');
INSERT INTO `dm_topic0401_input_task` VALUES (13, '20240905', 2003, 'W007', 'SO002', 'ORD002', 150, 'P002', 'WO002', 'B002', 'D007', 3, '103', '精加工', '工件精密加工', 3, 5, 30, 1009, '2025-09-03 08:28:00', '赵五', 1002, 'PROD002', '法兰盘', 2, 150, 0, '2025-09-03 11:00:00', '2025-09-03 11:30:00', '2025-09-03 11:00:00', '2025-09-03 11:30:00', 103, 'J003', '刘师傅', '3;9;16', '1-4', 3.80, 1.50, 1003, 'WC03', '精密加工中心', 2001, 'LINE01', '生产线1', '', 0, 1, 'admin', '2025-09-03 08:00:00', 1, 'admin', '2025-09-03 08:00:00');
INSERT INTO `dm_topic0401_input_task` VALUES (14, '20240905', 2004, 'W008', 'SO002', 'ORD002', 150, 'P002', 'WO002', 'B002', 'D008', 4, '106', '检验包装', '成品检验包装', 4, 5, 30, 1012, '2025-09-03 08:37:00', '周八', 1002, 'PROD002', '法兰盘', 2, 150, 0, '2025-09-03 11:30:00', '2025-09-03 12:00:00', '2025-09-03 11:30:00', '2025-09-03 12:00:00', 106, 'J006', '郑师傅', '6;12', '1-2', 1.00, 0.50, 1006, 'WC06', '检验包装中心', 2002, 'LINE02', '生产线2', '', 0, 1, 'admin', '2025-09-03 08:00:00', 1, 'admin', '2025-09-03 08:00:00');
INSERT INTO `dm_topic0401_input_task` VALUES (15, '20240905', 3001, 'W009', 'SO003', 'ORD003', 200, 'P003', 'WO003', 'B003', 'D009', 1, '101', '下料', '原材料下料切割', 1, 5, 30, 1013, '2025-09-03 08:45:00', '张三', 1003, 'PROD003', '连接器', 2, 200, 0, '2025-09-03 12:00:00', '2025-09-03 12:30:00', '2025-09-03 12:00:00', '2025-09-03 12:30:00', 101, 'J001', '李师傅', '1;7;15', '1-4', 5.50, 2.10, 1001, 'WC01', '机加工中心1', 2001, 'LINE01', '生产线1', '', 0, 1, 'admin', '2025-09-03 08:00:00', 1, 'admin', '2025-09-03 08:00:00');
INSERT INTO `dm_topic0401_input_task` VALUES (16, '20240905', 3002, 'W010', 'SO003', 'ORD003', 200, 'P003', 'WO003', 'B003', 'D010', 2, '102', '粗加工', '工件粗加工成型', 2, 5, 30, 1014, '2025-09-03 08:48:00', '李四', 1003, 'PROD003', '连接器', 2, 200, 0, '2025-09-03 12:30:00', '2025-09-03 13:00:00', '2025-09-03 12:30:00', '2025-09-03 13:00:00', 102, 'J002', '王师傅', '2;8', '1-3', 4.20, 1.80, 1002, 'WC02', '机加工中心2', 2001, 'LINE01', '生产线1', '', 0, 1, 'admin', '2025-09-03 08:00:00', 1, 'admin', '2025-09-03 08:00:00');
INSERT INTO `dm_topic0401_input_task` VALUES (17, '20240905', 3003, 'W011', 'SO003', 'ORD003', 200, 'P003', 'WO003', 'B003', 'D011', 3, '103', '精加工', '工件精密加工', 3, 5, 30, 1015, '2025-09-03 08:51:00', '赵五', 1003, 'PROD003', '连接器', 2, 200, 0, '2025-09-03 13:00:00', '2025-09-03 13:30:00', '2025-09-03 13:00:00', '2025-09-03 13:30:00', 103, 'J003', '刘师傅', '3;9;16', '1-4', 3.80, 1.50, 1003, 'WC03', '精密加工中心', 2001, 'LINE01', '生产线1', '', 0, 1, 'admin', '2025-09-03 08:00:00', 1, 'admin', '2025-09-03 08:00:00');
INSERT INTO `dm_topic0401_input_task` VALUES (18, '20240905', 3004, 'W012', 'SO003', 'ORD003', 200, 'P003', 'WO003', 'B003', 'D012', 4, '106', '检验包装', '成品检验包装', 4, 5, 30, 1018, '2025-09-03 09:00:00', '周八', 1003, 'PROD003', '连接器', 2, 200, 0, '2025-09-03 13:30:00', '2025-09-03 14:00:00', '2025-09-03 13:30:00', '2025-09-03 14:00:00', 106, 'J006', '郑师傅', '6;12', '1-2', 1.00, 0.50, 1006, 'WC06', '检验包装中心', 2002, 'LINE02', '生产线2', '', 0, 1, 'admin', '2025-09-03 08:00:00', 1, 'admin', '2025-09-03 08:00:00');

SET FOREIGN_KEY_CHECKS = 1;
