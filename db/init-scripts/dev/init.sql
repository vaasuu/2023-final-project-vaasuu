CREATE TABLE IF NOT EXISTS `users` (
    id CHAR(36) PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    -- 320 is the max length of an email address https://www.rfc-editor.org/rfc/rfc3696#:~:text=the%20%22%40%22)%20for%20a-,total%20length%20of%20320,-characters.%20%20Systems%20that
    email VARCHAR(320) NOT NULL,
    -- bcrypt hashes are 60 characters long
    password_hash VARCHAR(60) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS `listings` (
    listing_id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    asking_price DECIMAL(10, 2) NOT NULL,
    owner CHAR(36) NOT NULL,
    location VARCHAR(255) NOT NULL,
    picture_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (owner) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS `pictures` (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    url VARCHAR(1000) NOT NULL,
    blurhash VARCHAR(30) NOT NULL,
    listing_id BIGINT NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id)
);