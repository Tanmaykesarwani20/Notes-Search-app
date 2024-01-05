const jwt = require("jsonwebtoken");
const userModel = require("../modules/users/model");
const { customResponse } = require("../utilities/helper");

const verifyToken = async (req, res, next) => {
  let code, message;
  const authorizationHeaader = req.headers.authorization;
  let result;
  if (authorizationHeaader) {
    const secret = process.env.JWT_SECRET;
    const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
    const options = {
      expiresIn: process.env.EXPIRESIN,
      issuer: process.env.ISSUER,
    };
    try {
      jwt.verify(token, secret, async function (err, decoded) {
        if (err) {
          code = 500;
          message = err.message;
          if (err.message === "invalid token") {
            code = 401;
          } else if (err.message === "jwt expired") {
            code = 444;
          }
          const resData = customResponse({
            code,
            message,
            err,
          });
          return res.status(code).send(resData);
        }
        const user = await userModel.findOne({ "tokens.accessToken": token });
        if (!user) {
          code = 401;
          message = "Invalid Token";
          const resData = customResponse({
            code,
            message,
          });
          return res.status(code).send(resData);
        }
        result = jwt.verify(token, process.env.JWT_SECRET, options);
        req.decodedUser = {...result, ...user};
        next();
      });
    } catch (error) {
      console.log("error in isAuthorization", error);
      code = 401;
      message = "Invalid Token";
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      return res.status(code).send(resData);
    }
  } else {
    code = 401;
    message = "Authentication error. Token required.";
    const resData = customResponse({ code, message });
    return res.status(code).send(resData);
  }
};


module.exports = {
  verifyToken,
};
