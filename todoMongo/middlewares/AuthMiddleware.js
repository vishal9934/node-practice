const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  try {
    const token = req.headers["x-acciojob"];

    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // req.locals = verified;

    if (verified) {
      next();
    } else {
      return res.status(401).send({
        status: 401,
        message: "User not authenticated! Please login",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: 500,
      message: "Internal Server error!",
      data: err,
    });
  }
};

module.exports = { isAuth };