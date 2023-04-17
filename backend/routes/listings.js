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
  getCategories,
} = require("../controllers/listings");

// Protect all routes below this middleware,
// needs valid JWT in Authorization header
router.use(verifyAuth);

router.get("/categories", getCategories);
router.post("/", createListing);
router.get("/", getListings);
router.get("/:id", getListing);
router.get("/user/:userId", getUserListings);

// Only accessible to listing owner or admin
router.put("/:id", updateListing);
router.delete("/:id", deleteListing);

module.exports = router;
