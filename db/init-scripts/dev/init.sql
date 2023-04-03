CREATE TABLE IF NOT EXISTS `users` (
    id CHAR(36) CHARACTER SET ascii PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    -- 320 is the max length of an email address https://www.rfc-editor.org/rfc/rfc3696#:~:text=the%20%22%40%22)%20for%20a-,total%20length%20of%20320,-characters.%20%20Systems%20that
    email VARCHAR(320) NOT NULL,
    -- bcrypt hashes are 60 characters long
    password_hash VARCHAR(60) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- delete user's listings when user is deleted:
    CONSTRAINT user_listings_fk FOREIGN KEY (id) REFERENCES listings(owner) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS `listings` (
    listing_id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    asking_price DECIMAL(10, 2) NOT NULL,
    owner CHAR(36) CHARACTER SET ascii NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner) REFERENCES users(id),
    -- delete listing's pictures when listing is deleted:
    CONSTRAINT listing_pictures_fk FOREIGN KEY (listing_id) REFERENCES pictures(listing_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS `pictures` (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    url VARCHAR(1000) NOT NULL,
    blurhash VARCHAR(30) NOT NULL,
    listing_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE
);