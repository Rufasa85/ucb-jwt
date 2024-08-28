const express = require("express");
const router = express.Router();
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// signup
router.post("/", (req, res) => {
  User.create(req.body)
    .then((newUser) => {
      const token = jwt.sign(
        {
          id: newUser.id,
          email: newUser.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );
      res.json({
        token,
        user: newUser,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "error occurred", err });
    });
});
//Login
router.post("/login", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((foundUser) => {
      if (!foundUser) {
        return res.status(401).json({ msg: "login failed" });
      }
      if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
        return res.status(401).json({ msg: "login failed" });
      }
      const token = jwt.sign(
        {
          id: foundUser.id,
          email: foundUser.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );
      res.json({
        token,
        user: foundUser,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "error occurred", err });
    });
});

//secret

router.get("/secret", (req, res) => {
  //Only for logged in users
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);

    const cake = {
      flavor: "carrot",
      frosting: "cream cheese",
      raisins: false,
    };
    res.json({ user: tokenData, cake: cake });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      msg: "invalid token",
      error: error,
    });
  }
});

module.exports = router;
