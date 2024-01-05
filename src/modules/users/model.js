const mongoose = require("mongoose");
require("dotenv").config();
const db = require("../../utilities/db");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
      unique: true, // `username` must be unique
    },
    email: {
      type: String,
      required: true,
      unique: true, // `email` must be unique
    },
    password: {
      type: String,
      required: true,
    },
    tokens: {
      accessToken: { type: String },
      Access_ts: { type: String }, // issue time stamp
      access_validity_dur: { type: Number }, // validity
      refreshToken: { type: String }, // refresh token
      refresh_ts: { type: Date }, // issue time stamp
      refresh_validity_dur: { type: Number }, // validity in days
    },
  },
  { timestamps: true }
);

//generating access token
userSchema.methods.generateAuthAccessToken = async function () {
  try {
    const accessToken = jwt.sign(
      {
        username: this.username,
        user_id: this._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESSEXPIRESIN, issuer: process.env.ISSUER }
    );

    this.tokens.accessToken = accessToken;
    this.tokens.Access_ts = new Date();
    this.tokens.access_validity_dur = 1;

    await this.save();
    return accessToken;
  } catch (error) {
    throw error;
  }
};

//generating refresh token
userSchema.methods.generateAuthrefreshToken = async function () {
  try {
    const refreshToken = jwt.sign(
      {
        username: this.username,
        user_id: this._id,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.REFRESHEXPIRESIN, issuer: process.env.ISSUER }
    );

    this.tokens.refreshToken = refreshToken;
    this.tokens.refresh_ts = new Date();
    this.tokens.refresh_validity_dur = 7;
    await this.save();
    return refreshToken;
  } catch (error) {
    throw error;
  }
};

module.exports = db.model("User", userSchema);
