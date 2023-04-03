const express = require("express");
const router = express.Router();
const verifyAuth = require("../middleware/verifyAuth");

const { signUpUser, loginUser } = require("../controllers/users");

router.post("/signup", signUpUser);
router.post("/login", loginUser);

// Protect all routes below this middleware,
// needs valid JWT in Authorization header
router.use(verifyAuth);
module.exports = router;
