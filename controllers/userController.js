"use strict";
const jwt = require("jsonwebtoken");
const SHA256 = require("crypto-js/sha256");
const uuid = require("uuid");
const UserModel = require("./../models/userModel");

const userControllers = {
  register: (req, res) => {
    UserModel.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((result) => {
        if (result) {
          res.statusCode = 400;
          res.json({
            success: false,
            message: "Email has already been taken",
          });
          return;
        }
        const salt = uuid.v4();
        const combination = salt + req.body.password;
        const hash = SHA256(combination).toString();

        UserModel.create({
          username: req.body.username,
          email: req.body.email,
          pwsalt: salt,
          hash: hash,
        })
          .then((createResult) => {
            res.statueCode = 201;
            res.json({
              success: true,
              message: "registration is successful",
            });
          })
          .catch((err) => {
            res.statueCode = 409;
            res.json({
              success: false,
              message: "unable to register due to unexpected error",
            });
          });
      })
      .catch((err) => {
        res.statueCode = 409;
        res.json({
          success: false,
          message: "The register email is exist",
        });
      });
  },
  login: (req, res) => {
    // validate input here on your own
    console.log(req.body.email);
    // gets user with the given email
    UserModel.findOne({
      email: req.body.email,
    })
      .then((result) => {
        console.log(result);
        // check if result is empty, if it is, no user, so login fail, return err as json response
        if (!result) {
          res.statusCode = 401;
          res.json({
            success: false,
            message: "Either username or password is wrong , no account",
          });
          return;
        }

        // combine DB user salt with given password, and apply hash algo
        const hash = SHA256(result.pwsalt + req.body.password).toString();
        console.log(hash);
        // check if password is correct by comparing hashes
        if (hash !== result.hash) {
          res.statusCode = 401;
          res.json({
            success: false,
            message: "Either username or password is wrong,yoyo",
            test: hash,
          });
          return;
        }

        // login successful, generate JWT
        const token = jwt.sign(
          {
            email: result.email,
          },
          process.env.JWT_SECRET,
          {
            algorithm: "HS384",
            expiresIn: "1h",
          }
        );

        // decode JWT to get raw values
        const rawJWT = jwt.decode(token);

        // return token as json response
        res.json({
          success: true,
          token: token,
          expiresAt: rawJWT.exp,
        });
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json({
          success: false,
          message: "Unable to login due to unexpected error",
        });
      });
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "Logged out" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: "Please Login or Register" });

      jwt.verify(rf_token, process.env.JWT_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Please Login or Register" });

        const accesstoken = createAccessToken({ id: user.id });

        res.json({ accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userControllers;
