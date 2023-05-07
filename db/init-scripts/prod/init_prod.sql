-- Adminer 4.8.1 MySQL 5.5.5-10.11.2-MariaDB-1:10.11.2+maria~ubu2204 dump
SET NAMES utf8;

SET time_zone = '+00:00';

SET foreign_key_checks = 0;

SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    UNIQUE KEY `name` (`name`),
    KEY `id` (`id`),
    FULLTEXT KEY `category_name` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

DROP TABLE IF EXISTS `listings`;

CREATE TABLE `listings` (
    `listing_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `title` varchar(255) NOT NULL,
    `description` varchar(4095) NOT NULL,
    `asking_price` decimal(10, 2) NOT NULL,
    `currency` varchar(3) NOT NULL,
    `owner` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
    `location` varchar(255) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`listing_id`),
    KEY `owner` (`owner`),
    FULLTEXT KEY `title_description_location` (`title`, `description`, `location`),
    CONSTRAINT `listings_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

DROP TABLE IF EXISTS `listing_categories`;

CREATE TABLE `listing_categories` (
    `listing_id` bigint(20) NOT NULL,
    `category_id` bigint(20) NOT NULL,
    KEY `listing_id` (`listing_id`),
    KEY `category_id` (`category_id`),
    CONSTRAINT `listing_categories_ibfk_4` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`listing_id`) ON DELETE CASCADE,
    CONSTRAINT `listing_categories_ibfk_5` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TRIGGER `update_listings_timestamp_ai_listing_categories`
AFTER
INSERT ON `listing_categories` FOR EACH ROW
UPDATE listings
SET updated_at = CURRENT_TIMESTAMP
WHERE listing_id = NEW.listing_id;

CREATE TRIGGER `update_listings_timestamp_au_listing_categories`
AFTER
UPDATE ON `listing_categories` FOR EACH ROW
UPDATE listings
SET updated_at = CURRENT_TIMESTAMP
WHERE listing_id = NEW.listing_id;

DROP TABLE IF EXISTS `pictures`;

CREATE TABLE `pictures` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `url` varchar(1000) NOT NULL,
    `blurhash` varchar(30) NOT NULL,
    `listing_id` bigint(20) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    KEY `listing_id` (`listing_id`),
    CONSTRAINT `pictures_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`listing_id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TRIGGER `update_listings_timestamp_ai_pictures`
AFTER
INSERT ON `pictures` FOR EACH ROW
UPDATE listings
SET updated_at = CURRENT_TIMESTAMP
WHERE listing_id = NEW.listing_id;

CREATE TRIGGER `update_listings_timestamp_au_pictures`
AFTER
UPDATE ON `pictures` FOR EACH ROW
UPDATE listings
SET updated_at = CURRENT_TIMESTAMP
WHERE listing_id = NEW.listing_id;

DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
    `role_id` int(11) NOT NULL AUTO_INCREMENT,
    `role_name` varchar(50) NOT NULL,
    PRIMARY KEY (`role_id`),
    UNIQUE KEY `role_name` (`role_name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

INSERT INTO `roles` (`role_id`, `role_name`)
VALUES (2, 'admin'),
    (1, 'normal');

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
    `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
    `name` varchar(255) NOT NULL,
    `email` varchar(320) NOT NULL,
    `password_hash` varchar(60) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TRIGGER `user_default_role`
AFTER
INSERT ON `users` FOR EACH ROW
INSERT INTO `user_roles` (`user_id`)
VALUES (NEW.id);

DROP TABLE IF EXISTS `user_roles`;

CREATE TABLE `user_roles` (
    `user_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
    `role_id` int(11) NOT NULL DEFAULT 1,
    PRIMARY KEY (`user_id`, `role_id`),
    KEY `role_id` (`role_id`),
    CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- 2023-04-16 14:15:01