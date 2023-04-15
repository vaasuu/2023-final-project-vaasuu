-- Adminer 4.8.1 MySQL 5.5.5-10.11.2-MariaDB-1:10.11.2+maria~ubu2204 dump
SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';
SET NAMES utf8mb4;
DROP DATABASE IF EXISTS `test`;
CREATE DATABASE `test`
/*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */
;
USE `test`;
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    KEY `id` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
INSERT INTO `categories` (`id`, `name`, `created_at`)
VALUES (1, 'electronics', '2023-04-15 14:07:13'),
    (2, 'exercise equipment', '2023-04-15 14:11:11');
DROP TABLE IF EXISTS `listings`;
CREATE TABLE `listings` (
    `listing_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `title` varchar(255) NOT NULL,
    `description` text NOT NULL,
    `asking_price` decimal(10, 2) NOT NULL,
    `owner` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
    `location` varchar(255) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`listing_id`),
    KEY `owner` (`owner`),
    CONSTRAINT `listings_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
INSERT INTO `listings` (
        `listing_id`,
        `title`,
        `description`,
        `asking_price`,
        `owner`,
        `location`,
        `created_at`,
        `updated_at`
    )
VALUES (
        1,
        'MacBook Pro',
        '2019 MacBook Pro with 13\" Retina display, 2.4GHz quad-core Intel Core i5, 8GB RAM, and 256GB SSD storage.',
        1500.00,
        'aaaaaaaa-0615-4d04-a795-9c5756ef5f4c',
        'San Francisco, CA',
        '2023-04-02 11:00:00',
        '2023-04-15 14:24:52'
    ),
    (
        2,
        'iPhone 12 Pro',
        '256GB Pacific Blue iPhone 12 Pro with Ceramic Shield front cover, A14 Bionic chip, and Pro camera system.',
        1000.00,
        'bbbbbbbb-f9e0-4047-99a5-6f0ed153ba89',
        'New York, NY',
        '2023-04-02 12:00:00',
        '2023-04-15 14:25:03'
    ),
    (
        3,
        'Peloton Bike',
        'Peloton Bike in great condition, comes with weights and shoes.',
        2000.00,
        'cccccccc-681d-4475-84a2-fdd1d0dcd057',
        'Los Angeles, CA',
        '2023-04-02 13:00:00',
        '2023-04-15 14:25:07'
    );
DROP TABLE IF EXISTS `listing_categories`;
CREATE TABLE `listing_categories` (
    `listing_id` bigint(20) NOT NULL,
    `category_id` bigint(20) NOT NULL,
    KEY `listing_id` (`listing_id`),
    KEY `category_id` (`category_id`),
    CONSTRAINT `listing_categories_ibfk_4` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`listing_id`) ON DELETE CASCADE,
    CONSTRAINT `listing_categories_ibfk_5` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
INSERT INTO `listing_categories` (`listing_id`, `category_id`)
VALUES (1, 1),
    (2, 1),
    (3, 2);
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
INSERT INTO `pictures` (
        `id`,
        `url`,
        `blurhash`,
        `listing_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        1,
        'https://placehold.co/400x300?text=MacBook+Pro+picture+1',
        'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
        1,
        '2023-04-02 12:00:00',
        '2023-04-10 08:29:35'
    ),
    (
        2,
        'https://placehold.co/300x400?text=iPhone+12+Pro+picture+1',
        'LFFM~Cj?%1#M@rx]b#xGxukCxuj[',
        2,
        '2023-04-02 12:01:00',
        '2023-04-10 08:33:46'
    ),
    (
        3,
        'https://placehold.co/400x400?text=iPhone+12+Pro+picture+2',
        'LmNn}%-QxGIpw[aeWBaxM{t8axS5',
        2,
        '2023-04-02 12:02:00',
        '2023-04-10 08:34:04'
    );
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
-- Passwords are 'first.lastname' for each sample user
INSERT INTO `users` (
        `id`,
        `name`,
        `email`,
        `password_hash`,
        `created_at`,
        `updated_at`
    )
VALUES (
        'aaaaaaaa-0615-4d04-a795-9c5756ef5f4c',
        'John Smith',
        'john.smith@example.com',
        '$2y$10$2g26djFY5UzbITVJ4t/wWuuqNm7q1MdDGXKP6fehoisKviAKqdwz.',
        '2023-04-02 08:00:00',
        '2023-04-02 08:00:00'
    ),
    (
        'bbbbbbbb-f9e0-4047-99a5-6f0ed153ba89',
        'Jane Doe',
        'jane.doe@example.com',
        '$2y$10$Rm1uRiY1XoGRuMON4EvF7ehU0AEzexO3jWndVFY7ozFg7ekj.ucl.',
        '2023-04-02 09:00:00',
        '2023-04-02 09:00:00'
    ),
    (
        'cccccccc-681d-4475-84a2-fdd1d0dcd057',
        'Bob Johnson',
        'bob.johnson@example.com',
        '$2y$10$Vpnec4iR/RSEp5nqZQVgOun7QAYJ3qlVWYLJuKYJx7aHEv2NbUfqS',
        '2023-04-02 10:00:00',
        '2023-04-02 10:00:00'
    );
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
INSERT INTO `user_roles` (`user_id`, `role_id`)
VALUES ('aaaaaaaa-0615-4d04-a795-9c5756ef5f4c', 1),
    ('bbbbbbbb-f9e0-4047-99a5-6f0ed153ba89', 1),
    ('cccccccc-681d-4475-84a2-fdd1d0dcd057', 2);
-- 2023-04-15 15:50:25