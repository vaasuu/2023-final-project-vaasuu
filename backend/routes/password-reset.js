const express = require("express");
const router = express.Router();

const {
  resetPasswordEmail,
  setNewPassword,
} = require("../controllers/password-reset");

router.post("/send-reset-email", resetPasswordEmail);
router.post("/set-new-password", setNewPassword);

module.exports = router;
