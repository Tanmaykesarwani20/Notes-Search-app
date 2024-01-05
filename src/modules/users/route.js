const express = require("express");
const router = new express.Router();
const { verifyToken } = require("../../middleware/auth");

const {
  login,
  registerUser,
  logout
} = require("./controller");

router.post("/signup", registerUser);
router.post("/login", login);
router.get("/logout", verifyToken, logout);

module.exports = router;
