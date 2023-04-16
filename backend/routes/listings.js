const express = require("express");
const router = express.Router();
const verifyAuth = require("../middleware/verifyAuth");

const {
  createListing,
  getListings,
} = require("../controllers/listings");

// Protect all routes below this middleware,
// needs valid JWT in Authorization header
router.use(verifyAuth);

router.post("/", createListing);
router.get("/", getListings);
module.exports = router;
