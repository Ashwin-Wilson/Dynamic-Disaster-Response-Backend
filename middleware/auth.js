// middleware/auth.js
const { getUser } = require("../services/Auth");

function checkAuth(role) {
  return async (req, res, next) => {
    // Return middleware function
    try {
      const token = req.headers.token;
      if (!token) {
        return res.status(401).json({ message: "token is required" });
      }

      const user = await getUser(token);
      if (!user) {
        return res.status(401).json({ message: "User is not logged in!" });
      }

      if (user.role !== role) {
        return res
          .status(401)
          .json({ message: `User not authorized to ${role} view` });
      }

      req.body.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
}

module.exports = {
  checkAuth,
};
