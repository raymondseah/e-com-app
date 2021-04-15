"use strict";
const jwt = require("jsonwebtoken");
const SHA256 = require("crypto-js/sha256");
const uuid = require("uuid");
const UserModel = require("./../models/userModel");

const userControllers = {
  register: (req, res) => {
    UserModel.findOne({
      where: {
        email: req.body.user.email,
      },
    })
      .then((result) => {
        if (result) {
          res.statusCode = 400;
          res.json({
            success: false,
            msg: "Email has already been taken",
          });
          return;
        }
        const salt = uuid.v4();
        const combination = salt + req.body.user.password;
        const hash = SHA256(combination).toString();

        UserModel.create({
          username: req.body.user.name,
          email: req.body.user.email,
          pwsalt: salt,
          hash: hash,
        })
          .then((createResult) => {
            res.statueCode = 201;
            res.json({
              success: true,
              msg: "registration is successful",
            });
          })
          .catch((err) => {
            res.statueCode = 409;
            res.json({
              success: false,
              msg: err,
            });
          });
      })
      .catch((err) => {
        res.statueCode = 409;
        res.json({
          success: false,
          msg: "The register email is exist",
        });
      });
  },
  login: (req, res) => {
    // validate input here on your own
    // gets user with the given email
    UserModel.findOne({
      email: req.body.user.email,
    })
      .then((result) => {
        console.log(result);
        // check if result is empty, if it is, no user, so login fail, return err as json response
        if (!result) {
          res.statusCode = 401;
          res.json({
            success: false,
            msg: "Either username or password is wrong , no account",
          });
          return;
        }

        // combine DB user salt with given password, and apply hash algo
        const hash = SHA256(result.pwsalt + req.body.user.password).toString();
        console.log(hash);
        // check if password is correct by comparing hashes
        if (hash !== result.hash) {
          res.statusCode = 401;
          res.json({
            success: false,
            msg: "Either username or password is wrong,yoyo",
            test: hash,
          });
          return;
        }

        // login successful, generate JWT
        const token = jwt.sign(
          {
            email: result.email,
            id: result._id,
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
          msg: "logged in",
        });
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json({
          success: false,
          msg: "Unable to login due to unexpected error",
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
  addcart: async (req, res) => {
    let id = res.locals.jwtData.id
    try {
      const user = await UserModel.findOne({ _id: id });
      console.log(user)
      
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      await UserModel.findOneAndUpdate(
        { _id: id },
        {
          cart: req.body.cart,
        }
      );

      return res.json({ msg: "Added to cart" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserInfo: async (req,res) => {
    let id = res.locals.jwtData.id
    try {
      const user = await UserModel.findById(id)
      if(!user) return res.status(400).json({msg: "User does not exist."})

      res.json(user)
  } catch (err) {
      return res.status(500).json({msg: err.message})
  }

  }
};

module.exports = userControllers;
