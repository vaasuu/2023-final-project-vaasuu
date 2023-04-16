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
      if (image_datas) {
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
            l.location, 
            l.created_at, 
            l.updated_at, 
            p.url, 
            p.blurhash 
        FROM 
            listings l 
            INNER JOIN users u ON l.owner = u.id 
            LEFT JOIN pictures p ON l.listing_id = p.listing_id
  `
      );
      return rows;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
};

module.exports = listings;
