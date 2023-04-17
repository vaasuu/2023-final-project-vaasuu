const express = require("express");
const router = express.Router();
const verifyAuth = require("../middleware/verifyAuth");

const {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing,
  getUserListings,
  searchListings,
  getCategories,
} = require("../controllers/listings");

// Protect all routes below this middleware,
// needs valid JWT in Authorization header
router.use(verifyAuth);

// these are before the ones with ':id', otherwise it will think e.g 'categories' is an id
router.get("/categories", getCategories);
router.get("/search", searchListings);

router.post("/", createListing);
router.get("/", getListings);
router.get("/:id", getListing);
router.get("/user/:userId", getUserListings);

// Only accessible to listing owner or admin
router.put("/:id", updateListing);
router.delete("/:id", deleteListing);

module.exports = router;
