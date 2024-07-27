const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const getTokenFromBearerHeader = (req) => {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
    return authorizationHeader.substring(7);
  }
  return null;
};

exports.verifyToken = (req, res, next) => {
  const token = getTokenFromBearerHeader(req);
  if (!token) return res.status(401).send("Access Denied");

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send("Invalid Token");
    req.id = user.id;
    req.role = user.role;
    req.email = user.email;
    next();
  });
};

exports.isStudent = (req, res, next) => {
  if (req.role !== "student") return res.status(401).send("Access Denied");
  next();
};

exports.isInstructor = (req, res, next) => {
  if (req.role !== "instructor") return res.status(401).send("Access Denied");
  next();
};
