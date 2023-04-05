const users = require("./models/users");

const utils = {
  getRoles: async (userId) => {
    const rolesArray = await users.getUsersRoles(userId);
    return rolesArray;
  },
  hasRole: async (userId, role) => {
    const rolesArray = await utils.getRoles(userId);
    return rolesArray.includes(role);
  },
};

module.exports = utils;
