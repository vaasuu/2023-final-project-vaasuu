const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");

const users = require("../models/users");
const utils = require("../utils/utils");
const roles = require("../models/roles");
const logger = require("../utils/log");

const signUpUser = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(72).required(),
    name: Joi.string().max(255).required(),
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
    logger.error(err);
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
    logger.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }

  // create and return a JWT
  const token = jwt.sign(
    {
      id: newUser.id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const roles = await utils.getRoles(newUser.id);

  return res
    .status(StatusCodes.CREATED)
    .json({ id: newUser.id, email: newUser.email, token, roles });
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
    logger.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }

  // create a new JWT
  const token = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  const roles = await utils.getRoles(user.id);

  // return the user details and JWT
  return res
    .status(StatusCodes.OK)
    .json({ id: user.id, email: user.email, token, roles });
};

const getAllUsers = async (req, res) => {
  try {
    const usersArray = await users.getAll();

    // return the users array
    return res.status(StatusCodes.OK).json({ users: usersArray });
  } catch (err) {
    logger.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const searchUsers = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  const { error } = schema.validate(req.query);
  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: error.details[0].message });
  }

  const { name } = req.query;

  try {
    const usersArray = await users.search(name);

    // return the users array
    return res.status(StatusCodes.OK).json({ users: usersArray });
  } catch (err) {
    logger.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  const schema = Joi.object({
    id: Joi.string().required(),
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: error.details[0].message });
  }

  const { id } = req.params;

  const requestedUserId = id;
  const tokenUserId = req.userData.userId;
  const isAdmin = await utils.hasRole(tokenUserId, "admin");

  // Check if user is authorized to access this resource
  // User can only get their own account information.
  // Admin can get any user's account information.

  // if user is not an admin and is not requesting their own account information
  if (!isAdmin && tokenUserId !== requestedUserId) {
    // return 403 forbidden
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: "You are not authorized to access this resource" });
  }

  // check if user exists in the database
  try {
    const foundUsers = await users.findById(id);
    if (foundUsers.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User with that ID does not exist" });
    }

    const user = foundUsers[0];
    const userDetailsToReturn = {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    // return the user details
    return res.status(StatusCodes.OK).json({ user: userDetailsToReturn });
  } catch (err) {
    logger.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const deleteUserById = async (req, res) => {
  const schema = Joi.object({
    id: Joi.string().required(),
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: error.details[0].message });
  }

  const { id } = req.params;

  const requestedUserId = id;
  const tokenUserId = req.userData.userId;
  const isAdmin = await utils.hasRole(tokenUserId, "admin");

  // Check if user is authorized to access this resource
  // User can delete only their own account.
  // Admin can delete any account.

  // if user is not an admin and is not requesting their own account information
  if (!isAdmin && tokenUserId !== requestedUserId) {
    // return 403 forbidden
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: "You are not authorized to access this resource" });
  }

  // check if user exists in the database
  try {
    const deletionResult = await users.delete(id);
    if (deletionResult.affectedRows === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User with that ID does not exist" });
    }

    return res.status(StatusCodes.NO_CONTENT).json();
  } catch (err) {
    logger.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateUserById = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().max(255).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(8).max(72).optional(),
    roles: Joi.array().items(Joi.string()).optional(),
  }).or("name", "email", "password", "roles");

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: error.details[0].message });
  }

  const { id } = req.params;

  try {
    const requestedUserId = id;
    const tokenUserId = req.userData.userId;
    const isAdmin = await utils.hasRole(tokenUserId, "admin");

    // Check if user is authorized to access this resource
    // User can update only their own account.
    // Admin can update any account.

    // if user is not an admin and is not updating their own account information
    if (!isAdmin && tokenUserId !== requestedUserId) {
      // return 403 forbidden
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "You are not authorized to update this resource" });
    }

    if (req.body.roles?.length > 0) {
      // check if user is an admin
      if (!isAdmin) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ error: "You are not authorized to update roles" });
      }

      // check if the roles are valid
      // const rolesObjStr = await roles.getAll();
      const rolesObj = await roles.getAll();
      // const validRolesObj = JSON.parse(rolesObjStr[0].roles);
      // const validRoles = Object.keys(validRolesObj);
      const validRoles = Object.keys(rolesObj[0].roles);
      for (const role of req.body.roles) {
        if (!validRoles.includes(role)) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: "Invalid role" });
        }
        // update the roles
        await roles.setRole(requestedUserId, role);
      }
      // remove the role from the request body
      delete req.body.roles;
    }

    // check if user exists in the database
    const foundUsers = await users.findById(id);
    if (foundUsers.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User with that ID does not exist" });
    }

    // check if email is already in use
    if (req.body.email) {
      const foundUsers = await users.findByEmail(req.body.email);
      if (foundUsers.length > 0) {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ error: "Email is already in use" });
      }
    }

    // hash the password if it is provided
    if (req.body.password) {
      // compare new password with old password
      const isSamePassword = await bcrypt.compare(
        req.body.password,
        foundUsers[0].password_hash
      );
      if (isSamePassword) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "New password cannot be the same as old password" });
      } else {
        // hash the new password
        const password_hash = await bcrypt.hash(req.body.password, 10);
        req.body.password_hash = password_hash;
        delete req.body.password; // remove the password from the request body
      }
    }

    // update the user
    try {
      await users.update(id, req.body);

      // return only status code on successfull update
      return res.status(StatusCodes.NO_CONTENT).json();
    } catch (err) {
      logger.error(err);
      console.log(err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
  } catch (err) {
    logger.error(err);
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

module.exports = {
  signUpUser,
  loginUser,
  getAllUsers,
  searchUsers,
  getUserById,
  deleteUserById,
  updateUserById,
};
