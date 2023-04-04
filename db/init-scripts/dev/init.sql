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
        'Macbook Pro',
        '2019 Macbook Pro with 13\" Retina display, 2.4GHz quad-core Intel Core i5, 8GB RAM, and 256GB SSD storage.',
        1500.00,
        'aaaaaaaa-0615-4d04-a795-9c5756ef5f4c',
        'San Francisco, CA',
        '2023-04-02 11:00:00',
        '2023-04-02 11:00:00'
    ),
    (
        2,
        'iPhone 12 Pro',
        '256GB Pacific Blue iPhone 12 Pro with Ceramic Shield front cover, A14 Bionic chip, and Pro camera system.',
        1000.00,
        'bbbbbbbb-f9e0-4047-99a5-6f0ed153ba89',
        'New York, NY',
        '2023-04-02 12:00:00',
        '2023-04-02 12:00:00'
    ),
    (
        3,
        'Peloton Bike',
        'Peloton Bike in great condition, comes with weights and shoes.',
        2000.00,
        'cccccccc-681d-4475-84a2-fdd1d0dcd057',
        'Los Angeles, CA',
        '2023-04-02 13:00:00',
        '2023-04-02 13:00:00'
    );
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
        'https://placekitten.com/200/300',
        'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
        1,
        '2023-04-02 12:00:00',
        '2023-04-04 00:09:45'
    ),
    (
        2,
        'https://placekitten.com/300/300',
        'LFFM~Cj?%1#M@rx]b#xGxukCxuj[',
        2,
        '2023-04-02 12:01:00',
        '2023-04-04 00:10:03'
    ),
    (
        3,
        'https://placekitten.com/500/100',
        'LmNn}%-QxGIpw[aeWBaxM{t8axS5',
        2,
        '2023-04-02 12:02:00',
        '2023-04-04 00:10:19'
    );
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