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

 Date: 12/10/2025 17:40:48
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dm_topic0403_input_supplier
-- ----------------------------
DROP TABLE IF EXISTS `dm_topic0403_input_supplier`;
CREATE TABLE `dm_topic0403_input_supplier`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `model_run_batch` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '模型运行批次',
  `supplier_id` int(11) NOT NULL DEFAULT -1 COMMENT '供应商ID',
  `supplier_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '供应商编码',
  `supplier_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '供应商名称',
  `supplier_category` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '供应商类别',
  `credit_rating` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '信用评级',
  `region` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '区域/省市',
  `contact_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '联系人',
  `contact_phone` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '联系电话',
  `contact_email` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '邮箱',
  `payment_term` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '付款条款',
  `remark` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '备注',
  `del_flag` int(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_supplier_batch`(`supplier_id`, `model_run_batch`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 210 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '课题4-模型3 入参-供应商主表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of dm_topic0403_input_supplier
-- ----------------------------
INSERT INTO `dm_topic0403_input_supplier` VALUES (201, '2025-10-12_TSY_HSR_01', 3101, 'TS-SUP-3101', '唐山精工材料', '原材料', 'A', '河北唐山', '刘强', '13100001111', 'liuqiang@tsmat.cn', '月结30天', '唐山本地钢材与型材', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier` VALUES (202, '2025-10-12_TSY_HSR_01', 3104, 'BG-SUP-3104', '宝钢股份', '原材料', 'A+', '上海', '陈建国', '13100001112', 'chenjianguo@baosteel.com', '月结60天', '高强度钢材/特种钢', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier` VALUES (203, '2025-10-12_TSY_HSR_01', 3105, 'AG-SUP-3105', '鞍钢股份', '原材料', 'A', '辽宁鞍山', '李明辉', '13100001113', 'liminghui@ansteel.com', '月结45天', '钢板/型材/铸锻件', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier` VALUES (204, '2025-10-12_TSY_HSR_01', 3102, 'BH-SUP-3102', '渤海传动', '机电部件', 'A', '天津', '周磊', '13100002222', 'zhoulei@bohaimotion.com', '月结45天', '牵引/传动类供货', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier` VALUES (205, '2025-10-12_TSY_HSR_01', 3107, 'ZD-SUP-3107', '中车电机', '机电部件', 'A+', '湖南株洲', '张文博', '13100002223', 'zhangwenbo@crrcmotor.com', '月结60天', '牵引电机/辅助电机', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier` VALUES (206, '2025-10-12_TSY_HSR_01', 3108, 'XT-SUP-3108', '湘潭电机', '机电部件', 'A', '湖南湘潭', '刘建华', '13100002224', 'liujianhua@xemc.com', '月结45天', '电机/电控设备', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier` VALUES (207, '2025-10-12_TSY_HSR_01', 3103, 'JJ-SUP-3103', '京津轨道部件', '系统模块', 'B', '北京', '王洁', '13100003333', 'wangjie@jjrail.com', '月结30天', '车门/受流/制动模块', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier` VALUES (208, '2025-10-12_TSY_HSR_01', 3111, 'KN-SUP-3111', '康尼机电', '系统模块', 'A', '江苏南京', '吴建平', '13100003334', 'wujianping@kangni.com', '月结30天', '车门系统/站台门', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');
INSERT INTO `dm_topic0403_input_supplier` VALUES (209, '2025-10-12_TSY_HSR_01', 3112, 'FX-SUP-3112', '法维莱中国', '系统模块', 'A', '上海', 'Laurent Chen', '13100003335', 'laurent.chen@faiveley.cn', '月结60天', '制动系统/车钩/HVAC', 0, '2025-09-08 10:39:47', '2025-09-08 10:39:47');

SET FOREIGN_KEY_CHECKS = 1;
