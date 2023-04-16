const express = require("express");
const router = express.Router();
const verifyAuth = require("../middleware/verifyAuth");

const {
  createListing,
  getListings,
  getListing,
  getUserListings,
} = require("../controllers/listings");

// Protect all routes below this middleware,
// needs valid JWT in Authorization header
router.use(verifyAuth);

router.post("/", createListing);
router.get("/", getListings);
router.get("/:id", getListing);
router.get("/user/:userId", getUserListings);
module.exports = router;
