require("dotenv").config();
const { promisePool } = require("../db/pool");
const logger = require("../utils/log");

const listings = {
  create: async (listingData) => {
    try {
      await promisePool.query("START TRANSACTION");

      const {
        title,
        description,
        asking_price,
        currency,
        category,
        owner,
        location,
        image_datas,
      } = listingData;

      // insert listing
      const [rows] = await promisePool.query(
        "INSERT INTO listings (title, description, asking_price, currency, owner, location) VALUES (?, ?, ?, ?, ?, ?)",
        [title, description, asking_price, currency, owner, location]
      );

      // get the id of the inserted listing
      const listingId = rows.insertId;

      // insert pictures if any
      if (image_datas?.length > 0) {
        const imageUrls = image_datas.map((data) => [
          data.url,
          data.blurhash,
          listingId,
        ]);
        await promisePool.query(
          "INSERT INTO pictures (url, blurhash, listing_id) VALUES ?",
          [imageUrls]
        );
      }

      // insert category and return the id, if category already exists, return the id of the existing category
      const [categoryRows] = await promisePool.query(
        "INSERT INTO categories (name) VALUES (?) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id), name = VALUES(name)",
        [category]
      );

      // get the id of the inserted/returned category
      const categoryId = categoryRows.insertId;

      // insert listing-category relationship
      await promisePool.query(
        "INSERT INTO listing_categories (listing_id, category_id) VALUES (?, ?)",
        [listingId, categoryId]
      );

      // save changes to database as no errors were thrown
      await promisePool.query("COMMIT");

      // return the data of the inserted listing
      // TODO: use listings.get(listingId) to return the data of the inserted listing
      return {
        id: listingId, // currently returns just the id of the inserted listing
      };
    } catch (error) {
      logger.error(error);
      // rollback changes if an error was thrown
      await promisePool.query("ROLLBACK");
      throw error;
    }
  },

  getAll: async () => {
    try {
      const [rows] = await promisePool.query(
        `
        SELECT 
            l.listing_id, 
            l.title, 
            l.description, 
            l.asking_price, 
            l.currency, 
            l.owner, 
            u.name AS owner_name, 
            MIN(c.name) AS category,
            l.location, 
            l.created_at, 
            l.updated_at, 
            MIN(p.url) as picture_url, 
            MIN(p.blurhash) as blurhash
        FROM 
            listings l 
            LEFT JOIN users u ON l.owner = u.id 
            LEFT JOIN pictures p ON l.listing_id = p.listing_id
            LEFT JOIN listing_categories lc ON l.listing_id = lc.listing_id
            LEFT JOIN categories c ON lc.category_id = c.id
        GROUP BY l.listing_id
        `
      );
      return rows;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const [rows] = await promisePool.query(
        `
        SELECT l.listing_id,
            l.title,
            l.description,
            l.asking_price,
            l.currency,
            l.owner,
            u.name AS owner_name,
            MIN(c.name) AS category,
            l.location,
            l.created_at,
            l.updated_at,
            JSON_ARRAYAGG(p.id) AS picture_ids,
            JSON_ARRAYAGG(p.url) AS picture_urls,
            JSON_ARRAYAGG(p.blurhash) AS blurhashes
        FROM listings l
            LEFT JOIN users u ON l.owner = u.id
            LEFT JOIN pictures p ON l.listing_id = p.listing_id
            LEFT JOIN listing_categories lc ON l.listing_id = lc.listing_id
            LEFT JOIN categories c ON lc.category_id = c.id
        WHERE l.listing_id = ?
        `,
        [id]
      );
      return rows;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
  getByUserId: async (userId) => {
    try {
      const [rows] = await promisePool.query(
        `
        SELECT 
        l.listing_id, 
        l.title, 
        l.description, 
        l.asking_price, 
        l.currency, 
        l.owner, 
        u.name AS owner_name, 
        l.location, 
        l.created_at, 
        l.updated_at, 
        p.url AS picture_url, 
        p.blurhash AS blurhash
      FROM 
        listings l 
        INNER JOIN users u ON l.owner = u.id 
        LEFT JOIN (
          SELECT listing_id, MIN(id) AS id 
          FROM pictures 
          GROUP BY listing_id
        ) AS pmin ON l.listing_id = pmin.listing_id
        LEFT JOIN pictures p ON pmin.id = p.id
      WHERE 
        l.owner = ?
      GROUP BY 
        l.listing_id
        `,
        [userId]
      );
      return rows;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
  getCategories: async () => {
    try {
      const [rows] = await promisePool.query(
        "SELECT id, name FROM categories ORDER BY name ASC"
      );
      return rows;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const [rows] = await promisePool.query(
        "DELETE FROM listings WHERE listing_id = ?",
        [id]
      );

      return rows;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
  update: async (listingData) => {
    try {
      await promisePool.query("START TRANSACTION");

      const {
        listing_id,
        title,
        description,
        asking_price,
        currency,
        category,
        location,
        image_datas,
      } = listingData;

      await promisePool.query(
        "UPDATE listings SET title = ?, description = ?, asking_price = ?, currency = ?, location = ? WHERE listing_id = ?",
        [title, description, asking_price, currency, location, listing_id]
      );

      const [categoryRows] = await promisePool.query(
        "INSERT INTO categories (name) VALUES (?) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id), name = VALUES(name)",
        [category]
      );

      const categoryId = categoryRows.insertId;

      await promisePool.query(
        "UPDATE listing_categories SET category_id = ? WHERE listing_id = ?",
        [categoryId, listing_id]
      );

      // BAD: this is not a good way to update pictures, as it wastes DB ids and processing power, but it's the easiest way to remove pictures that are no longer in the listing, keep existing pictures and add new pictures
      await promisePool.query("DELETE FROM pictures WHERE listing_id = ?", [
        listing_id,
      ]);

      // insert pictures if there are any
      if (image_datas?.length > 0) {
        const imageUrls = image_datas.map((data) => [
          data.url,
          data.blurhash,
          listing_id,
        ]);

        await promisePool.query(
          "INSERT INTO pictures (url, blurhash, listing_id) VALUES ?",
          [imageUrls]
        );
      }
      // save changes to database as no errors were thrown
      await promisePool.query("COMMIT");
    } catch (error) {
      logger.error(error);
      // rollback changes if an error was thrown
      await promisePool.query("ROLLBACK");
      throw error;
    }
  },
  search: async (searchString) => {
    try {
      const [rows] = await promisePool.query(
        `
          SELECT l.listing_id,
            l.title,
            l.description,
            l.asking_price,
            l.currency,
            l.owner,
            u.name AS owner_name,
            c.name AS category,
            l.location,
            l.created_at,
            l.updated_at,
            p.url as picture_url,
            p.blurhash
          FROM listings l
            LEFT JOIN users u ON l.owner = u.id
            LEFT JOIN pictures p ON l.listing_id = p.listing_id
            LEFT JOIN listing_categories lc ON l.listing_id = lc.listing_id
            LEFT JOIN categories c ON lc.category_id = c.id
          WHERE MATCH (title, description, location) AGAINST (? IN NATURAL LANGUAGE MODE)
            OR MATCH (c.name) AGAINST (? IN NATURAL LANGUAGE MODE)
          GROUP BY l.listing_id, c.name, p.url, p.blurhash
          ORDER BY MATCH (title, description, location) AGAINST (? IN NATURAL LANGUAGE MODE) DESC;
        `,
        [searchString, searchString, searchString]
      );
      return rows;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
};

module.exports = listings;
