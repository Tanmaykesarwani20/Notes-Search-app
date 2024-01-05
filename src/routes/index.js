const express = require("express");
const router = express.Router();

const userRouter = require("../modules/users/route");
const notesRouter = require("../modules/notes/route");

router.use("/auth", userRouter);
router.use("/notes", notesRouter);

module.exports = router;
