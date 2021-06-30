/*
 Navicat Premium Data Transfer

 Source Server         : ec
 Source Server Type    : MySQL
 Source Server Version : 100419
 Source Host           : localhost:3306
 Source Schema         : ec

 Target Server Type    : MySQL
 Target Server Version : 100419
 File Encoding         : 65001

 Date: 30/06/2021 20:38:56
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for articles
-- ----------------------------
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles`  (
  `articleID` int NOT NULL AUTO_INCREMENT,
  `articleName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `tag` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `avater` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`articleID`) USING BTREE,
  CONSTRAINT `CatID` FOREIGN KEY (`articleID`) REFERENCES `categories` (`CatID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of articles
-- ----------------------------
INSERT INTO `articles` VALUES (1, 'Buôn bán nông sản', NULL, 'https://i1-vnexpress.vnecdn.net/2021/06/30/203361413-529564385145353-6575-7676-6568-1625045931.jpg?w=1020&h=0&q=100&dpr=1&fit=crop&s=UcnmdKvtO_J5zSfUnOE5YA');
INSERT INTO `articles` VALUES (2, 'Buôn bán thủy sản', NULL, NULL);

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories`  (
  `CatID` int NOT NULL AUTO_INCREMENT,
  `CatName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `CatLink` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`CatID`, `CatName`) USING BTREE,
  INDEX `CatID`(`CatID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of categories
-- ----------------------------
INSERT INTO `categories` VALUES (1, 'Thời sự', 'thoisu');
INSERT INTO `categories` VALUES (2, 'Kinh doanh', 'kinhdoanh');
INSERT INTO `categories` VALUES (3, 'Nông nghiệp', 'nongnghiep');
INSERT INTO `categories` VALUES (4, 'Giáo dục', 'giaoduc');
INSERT INTO `categories` VALUES (5, 'Y tế', 'yte');
INSERT INTO `categories` VALUES (12, 'Quốc phòng', 'quocphong');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `userID` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `emailAddress` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `dob` date NULL DEFAULT NULL,
  PRIMARY KEY (`userID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'Heovang097', 'heovang097@gmail.com', '2000-03-13');
INSERT INTO `user` VALUES (2, 'Heovang098', 'heovang098@gmail.com', '2001-03-13');
INSERT INTO `user` VALUES (3, 'Heovang099', NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;
