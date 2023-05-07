const express = require("express");
const router = express.Router();
const verifyAuth = require("../middleware/verifyAuth");

const {
  signUpUser,
  loginUser,
  getAllUsers,
  searchUsers,
  getUserById,
  deleteUserById,
  updateUserById,
} = require("../controllers/users");

router.post("/signup", signUpUser);
router.post("/login", loginUser);

// Protect all routes below this middleware,
// needs valid JWT in Authorization header
router.use(verifyAuth);

router.get("/", getAllUsers);
router.get("/search", searchUsers);
router.get("/:id", getUserById); // email is only accessible to respective user or admin

// These routes are only accessible to their respective users or admins
router.delete("/:id", deleteUserById);
router.patch("/:id", updateUserById);

module.exports = router;
