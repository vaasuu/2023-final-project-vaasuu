const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");

const users = require("../models/users");

const signUpUser = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(12).required(),
    name: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: 400, error: error.details[0].message });
  }

  const { email, password, name } = req.body;

  // check if user already exists in the database
  const user = await users.findByEmail(email);
  if (user.length > 0) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ status: 409, error: "User with that email already exists" }); // data leak
  }

  let passwordHash;
  try {
    passwordHash = await bcrypt.hash(password, 10);
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: 500, error: "Internal server error" });
  }

  const newUser = {
    id: uuidv4(),
    email,
    password_hash: passwordHash,
    name,
  };

  try {
    await users.create(newUser);
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: 500, error: "Internal server error" });
  }

  const token = jwt.sign(
    {
      id: newUser.id,
      email: newUser.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.status(StatusCodes.CREATED).json({
    status: 201,
    data: { id: newUser.id, email: newUser.email, token },
  });
};

const loginUser = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(12).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: 400, error: error.details[0].message });
  }

  const { email, password } = req.body;

  const foundUsers = await users.findByEmail(email);
  if (foundUsers.length === 0) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ status: 401, error: "Invalid credentials" });
  }
  const user = foundUsers[0]; // there should only be one user with a given email

  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ status: 401, error: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: 500, error: "Internal server error" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return res.status(StatusCodes.OK).json({
    status: 200,
    data: { id: user.id, email: user.email, token },
  });
};

module.exports = {
  signUpUser,
  loginUser,
};
