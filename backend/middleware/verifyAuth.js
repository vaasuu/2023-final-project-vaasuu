const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const verifyAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    // Get token from Authorization header; format:
    // Authorization: Bearer <token>
    const token = req.headers?.authorization?.split(" ")[1] || ""; // handle missing authorization Header or token
    if (!token) {
      return res
        .set("WWW-Authenticate", "Bearer ")
        .status(StatusCodes.UNAUTHORIZED)
        .send({ error: "Unauthorized" });
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // Add user data from the JWT to the request
    req.userData = { userId: decodedToken.id };
    next();
  } catch (err) {
    // catch any errors (e.g. invalid token)
    if (err.message === "jwt malformed") {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ error: "Invalid token" });
    }
    if (err.name === "TokenExpiredError") {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ error: "Token expired" });
    }
    return res.status(StatusCodes.UNAUTHORIZED).send({ error: "Unauthorized" });
  }
};

module.exports = verifyAuth;
