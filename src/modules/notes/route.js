const express = require("express");
const router = new express.Router();
const { verifyToken } = require("../../middleware/auth");

const {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  searchNotes,
  shareNote,
  updateNote
} = require("./controller");


router.get("/", verifyToken, getAllNotes);
router.get("/search", verifyToken, searchNotes);
router.get("/:id", verifyToken, getNoteById);
router.post("/", verifyToken, createNote);
router.put("/:id", verifyToken, updateNote);
router.delete("/:id", verifyToken, deleteNote);
router.post("/:id/share", verifyToken, shareNote);

module.exports = router;
