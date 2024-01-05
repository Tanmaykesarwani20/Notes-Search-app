const bcrypt = require("bcrypt");
const userModel = require("./model");
const { deleteCache, hashSet, hashGetAll } = require("../../utilities/cache");

const {
  customResponse,
} = require("../../utilities/helper");

const {
  userRegisterSchema,
  loginSchema,
} = require("./schema");

//signup
const registerUser = async (req, res) => {

  let code, message, data;
  let success = false;

  const { error } = userRegisterSchema.validate(req.body);

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

    const checkUserExist = await userModel.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });

    if (checkUserExist) {
      throw {
            message: "User Already Exists",
            code: 400,
        };
    }

    const newUser = new userModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, 10),
    });

    newUser.save();
    code = 201;
    message = "User created successfully";
    data = newUser;
    success = true;
    const resData = customResponse({ code, message, data, success });
    return res.status(code).send(resData);
  } catch (error) {
    console.log("error in post register user endpoint", error);
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

// login
const login = async (req, res) => {

  let code, message, data;
  let success = false;

  const { error } = loginSchema.validate(req.body);

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

    const username = req.body.username;
    const password = req.body.password;
    const userDoc = await userModel.findOne({
      $or: [{ email: username }, { username: username }],
    });

    if (!userDoc) {
      code = 401;
      message = "Invalid Credentials";
      success = false;
      const resData = customResponse({
        code,
        message,
        success,
      });
      return res.status(code).send(resData);
    }
    
    const isMatch = await bcrypt.compare(password, userDoc.password);
    const accessToken = await userDoc.generateAuthAccessToken();
    const refreshToken = await userDoc.generateAuthrefreshToken();

    data = {
      username: req.body.username,
      tokens: { accessToken: accessToken, refreshToken: refreshToken },
    };

    if (isMatch) {
      code = 201;
      message = "Successfully logged in";
      data = userDoc;
      const cachedData = {
        username: userDoc.username,
        firstName: userDoc.firstName,
        lastName: userDoc.lastName,
        email: userDoc.email,
      };

      hashSet(userDoc._id.toString(), cachedData);
      const resData = customResponse({ code, message, data });
      return res.status(code).send(resData);

    } else {
      code = 400;
      message = "Invalid Credentials";
      const resData = customResponse({
        code,
        message,
      });
      return res.status(code).send(resData);
    }
  } catch (error) {
    console.log("error in post login endpoint", error);
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

//logout
const logout = async (req, res) => {
  try {
    let code, message;
    await deleteCache(req.decodedUser.user_id.toString());
    await userModel
      .findOneAndUpdate(
        {
          username: req.decodedUser.username,
        },
        { tokens: {} },
        { new: true }
      )
      .then(() => {
        code = 200;
        message = "user logged out successfully";
        const resData = customResponse({ code, message });
        return res.status(code).send(resData);
      });
  } catch (error) {
    console.log("error in logout endpoint", error);
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
  registerUser,
  login,
  logout,
};
