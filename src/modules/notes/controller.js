const Note = require('./model');
const userModel = require("../users/model");

const {
  customResponse,
} = require("../../utilities/helper");
const{ notesSchema } = require("./schema");

// GET /api/notes
const getAllNotes = async (req, res) => {
  
  let code, message, data;
  const{ user_id } = req.decodedUser;

  try {

    if(!user_id) {
        throw {
            message: "user not found",
            code: 404,
        };
    }

    const notes = await Note.find({ owner: user_id })
      .populate('owner', 'username email')
      .populate('sharedWith', 'username email');

    code = 200;
    message = "User Notes fetched successfully";
    data = notes;
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);

  } catch (error) {
    console.log("error in get user all notes endpoint", error);
    code = error?.code ? error.code : 500;
    message = error?.message ? error.message : "something went wrong";
    const resData = customResponse({
        code,
        message,
        err: error.message,
    });
    return res.send(resData);
  }
};

// GET /api/notes/:id
const getNoteById = async (req, res) => {

  let code, message, data;
  const{ user_id } = req.decodedUser;
  const { id } = req.params;

  try {

    if(!user_id) {
        throw {
            message: "user not found",
            code: 404,
        };
    }

    const note = await Note.findOne({ _id: id, owner: user_id })
      .populate('owner', 'username email')
      .populate('sharedWith', 'username email');

    if (!note) {
        throw {
            message: "Note not found",
            code: 404,
        };
    }
    
    code = 200;
    message = "User Note fetched successfully";
    data = note;
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);
    
  } catch (error) {
    console.log("error in get notes by Id endpoint", error);
    code = error?.code ? error.code : 500;
    message = error?.message ? error.message : "something went wrong";
    const resData = customResponse({
        code,
        message,
        err: error.message,
    });
    return res.send(resData);
  }
};

// POST /api/notes
const createNote = async (req, res) => {

  let code, message, data;
  const{ user_id } = req.decodedUser;
  const { title, content } = req.body;
  const { error } = notesSchema.validate(req.body);

  if (error) {
    code = 422;
    message = "Invalid request data";
    const resData = customResponse({
      code,
      message,
      err: error && error.details,
    });
    return res.status(code).send(resData);
  }


  try {

    if(!user_id) {
        throw {
            message: "user not found",
            code: 404,
        };
    }

    const newNote = new Note({
      title,
      content,
      owner: user_id,
    });
    await newNote.save();

    code = 201;
    message = "Note created successfully";
    data = newNote;
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);

  } catch (error) {
    console.log("error in post user notes endpoint", error);
    code = error?.code ? error.code : 500;
    message = error?.message ? error.message : "something went wrong";
    const resData = customResponse({
        code,
        message,
        err: error.message,
    });
    return res.send(resData);
  }
};

// PUT /api/notes/:id
const updateNote = async (req, res) => {

  const { id } = req.params;
  let code, message, data;
  const{ user_id } = req.decodedUser;
  const { title, content } = req.body;

  try {

    if(!user_id) {
        throw {
            message: "user not found",
            code: 404,
        };
    }

    const note = await Note.findOne({ _id: id, owner: user_id });

    if (!note) {
      throw {
            message: "Note not found",
            code: 404,
        };
    }

    if(title) {
        note.title = title;
    }

    if(content) {
        note.content = content;
    }

    const updatedNote = await note.save();

    code = 200;
    message = "Note updated successfully";
    data = updatedNote;
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);

  } catch (error) {
    console.log("error in put user notes endpoint", error);
    code = error?.code ? error.code : 500;
    message = error?.message ? error.message : "something went wrong";
    const resData = customResponse({
        code,
        message,
        err: error.message,
    });
    return res.send(resData);
  }
};

// DELETE /api/notes/:id
const deleteNote = async (req, res) => {

  const { id } = req.params;
  let code, message, data;
  const{ user_id } = req.decodedUser;

  try {

    if(!user_id) {
        throw {
            message: "user not found",
            code: 404,
        };
    }
    
    const deletedNote = await Note.findOneAndDelete({ _id: id, owner: user_id });

    if (!deletedNote) {
      throw {
            message: "Note not found",
            code: 404,
        };
    }

    code = 200;
    message = "Note deteled successfully";
    data = deletedNote;
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);

  } catch (error) {
    console.log("error in delete user note endpoint", error);
    code = error?.code ? error.code : 500;
    message = error?.message ? error.message : "something went wrong";
    const resData = customResponse({
        code,
        message,
        err: error.message,
    });
    return res.send(resData);
  }
};

// POST /api/notes/:id/share
const shareNote = async (req, res) => {

  const { id } = req.params;
  let code, message, data;
  const{ user_id } = req.decodedUser;
  const { shareUser } = req.body;
  try {

    if(!user_id) {
        throw {
            message: "user not found",
            code: 404,
        };
    }

    const note = await Note.findOne({ _id: id, owner: user_id });

    if (!note) {
      throw {
            message: "Note not found",
            code: 404,
        };
    }

    const userExist = await userModel.findOne({ _id: shareUser });

    if (!userExist) {
      throw {
            message: "share User not found",
            code: 404,
        };
    }

    // Check if the user is already in the sharedWith array
    const isAlreadyShared = note.sharedWith.includes(shareUser);
    if (isAlreadyShared) {
      throw {
        message: "User already shared this note",
        code: 400,
      };
    }

    note.sharedWith.push(shareUser);
    const shared = await note.save();

    code = 200;
    message = "user shared successfully";
    data = shared;
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);
    
  } catch (error) {
    console.log("error in post share note endpoint", error);
    code = error?.code ? error.code : 500;
    message = error?.message ? error.message : "something went wrong";
    const resData = customResponse({
        code,
        message,
        err: error.message,
    });
    return res.send(resData);
  }
};

// GET /api/notes/search?q=:query
const searchNotes = async (req, res) => {
  
  let code, message, data;
  const{ user_id } = req.decodedUser;
  const { q: query } = req.query;

  try {

    if(!user_id) {
        throw {
            message: "user not found",
            code: 404,
        };
    }

    const notes = await Note.find({
      owner: user_id,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
      ],
    })
    .populate('owner', 'username email')
    .populate('sharedWith', 'username email');

    code = 200;
    message = "note searched successfully";
    data = notes;
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);

  } catch (error) {
    console.log("error in search user notes endpoint", error);
    code = error?.code ? error.code : 500;
    message = error?.message ? error.message : "something went wrong";
    const resData = customResponse({
        code,
        message,
        err: error.message,
    });
    return res.send(resData);
  }
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  searchNotes,
};
