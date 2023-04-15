const { StatusCodes } = require("http-status-codes");
const roles = require("../models/roles");
const logger = require("../utils/log");

const getRoles = async (req, res) => {
  try {
    const rolesResponse = await roles.getAll();
    const rolesArray = rolesResponse.map((role) => role.role_name);
    res.status(StatusCodes.OK).json({ roles: rolesArray });
  } catch (error) {
    logger.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

module.exports = {
  getRoles,
};
