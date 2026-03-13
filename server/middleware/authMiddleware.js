import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

/*
========================================================
HELPER: Extract Bearer Token
========================================================
*/
const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

/*
========================================================
PROTECT MIDDLEWARE
Verifies JWT and attaches user to req.user
========================================================
*/
export const protect = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    res.status(401);
    throw new Error("Not authorized. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id)
      .select("-__v")
      .lean();

    if (!user) {
      res.status(401);
      throw new Error("User not found.");
    }

    req.user = user;

    next();

  } catch (error) {

    if (error.name === "TokenExpiredError") {
      res.status(401);
      throw new Error("Session expired. Please login again.");
    }

    if (error.name === "JsonWebTokenError") {
      res.status(401);
      throw new Error("Invalid authentication token.");
    }

    res.status(401);
    throw new Error("Authentication failed.");
  }
});

/*
========================================================
ROLE BASED ACCESS CONTROL
Example: admin, recruiter, candidate
========================================================
*/
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      res.status(401);
      throw new Error("User not authenticated.");
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error("Access denied. Insufficient permissions.");
    }

    next();
  };
};

/*
========================================================
OPTIONAL: OPTIONAL AUTH (Public routes)
Attaches user if token exists but does not block
========================================================
*/
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-__v").lean();

    if (user) {
      req.user = user;
    }

  } catch (error) {
    // silently ignore
  }

  next();
});