const express = require("express");
const router = express.Router();
const verifyAuth = require("../middleware/verifyAuth");

const { getRoles } = require("../controllers/roles");

// Protect all routes below this middleware,
// needs valid JWT in Authorization header
router.use(verifyAuth);

router.get("/", getRoles);

module.exports = router;
