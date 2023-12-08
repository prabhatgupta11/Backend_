const express = require("express");
const userRouter = express.Router();
const db = require("../models/index");

// Now you can access the Sequelize instance and models
const User=db.User

//create user

userRouter.post("/createUser", async (req, res) => {
  try {

    const {
      name
    } = req.body;

    // Create a new User
    const user = await User.create({
    name
    });

   

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = userRouter;