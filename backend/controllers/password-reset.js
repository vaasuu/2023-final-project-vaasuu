const Joi = require("joi");
const users = require("../models/users");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendPasswordResetEmail } = require("../services/passwordResetEmail");
const logger = require("../utils/log");

const resetPasswordEmail = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  const { email } = req.body;

  const userArray = await users.findByEmail(email);
  if (userArray.length === 0) {
    // user does not exist
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "User with that email does not exist" });
  }

  const user = userArray[0];

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_PASSWORD_RESET_SECRET,
    { expiresIn: "30m" } // token expires in 30 minutes
  );

  try {
    logger.info(`Sending password reset email. Reset token: ${token}`);
    await sendPasswordResetEmail(user, token); // send email
  } catch (err) {
    logger.error(err);
    return res.status(500).send({ error: "Internal server error" });
  }

  return res
    .status(StatusCodes.OK)
    .json({ message: "Reset password email sent" });
};

const setNewPassword = async (req, res) => {
  const schema = Joi.object({
    password: Joi.string().min(8).max(72).required(),
    token: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  const { password, token } = req.body;

  let decodedToken; // declare variable outside try-catch block

  try {
    // verify token
    decodedToken = jwt.verify(token, process.env.JWT_PASSWORD_RESET_SECRET);
    if (!decodedToken) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ error: "Unauthorized" });
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ error: "Token expired" });
    }
    return res.status(StatusCodes.UNAUTHORIZED).send({ error: "Unauthorized" });
  }

  // get user id from decoded token
  const { id: userId } = decodedToken;

  // check if user exists
  const foundUsers = await users.findById(userId);
  if (foundUsers.length === 0) {
    return res.status(StatusCodes.UNAUTHORIZED).send({ error: "Unauthorized" });
  }

  // bcrypt new password
  const password_hash = await bcrypt.hash(password, 10);

  // update password
  const updatedUser = await users.update(userId, { password_hash });
  if (updatedUser.affectedRows === 0) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: "Internal server error" });
  }

  res.status(StatusCodes.NO_CONTENT).send();
};

module.exports = {
  resetPasswordEmail,
  setNewPassword,
};
