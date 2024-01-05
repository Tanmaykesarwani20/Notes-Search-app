const mongoose = require('mongoose');
const db = require("../../utilities/db");


const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  }],
},
{ timestamps: true }
);


module.exports = db.model("Note", noteSchema);
