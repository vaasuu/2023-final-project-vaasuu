const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");

const users = require("../models/users");

const signUpUser = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(72).required(),
    name: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: error.details[0].message });
  }

  const { email, password, name } = req.body;

  // check if user already exists in the database
  const user = await users.findByEmail(email);
  if (user.length > 0) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ error: "User with that email already exists" }); // data leak
  }

  // password hashing
  let passwordHash;
  try {
    passwordHash = await bcrypt.hash(password, 10);
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }

  // create new user object
  const newUser = {
    id: uuidv4(),
    email,
    password_hash: passwordHash,
    name,
  };

  // save new user to the database
  try {
    await users.create(newUser);
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }

  // create and return a JWT
  const token = jwt.sign(
    {
      id: newUser.id,
      email: newUser.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res
    .status(StatusCodes.CREATED)
    .json({ id: newUser.id, email: newUser.email, token });
};

const loginUser = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(72).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: error.details[0].message });
  }

  // get details from the request body
  const { email, password } = req.body;

  // check if user exists in the database
  const foundUsers = await users.findByEmail(email);
  if (foundUsers.length === 0) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid credentials" });
  }
  const user = foundUsers[0]; // there should only be one user with a given email

  // check if password is correct
  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }

  // create a new JWT
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

  // return the user details and JWT
  return res
    .status(StatusCodes.OK)
    .json({ id: user.id, email: user.email, token });
};

const getAllUsers = async (req, res) => {
  try {
    const usersArray = await users.getAll();

    // return the users array
    return res.status(StatusCodes.OK).json(usersArray);
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

module.exports = {
  signUpUser,
  loginUser,
  getAllUsers,
};
