const express = require("express");
const mongoose = require("mongoose");

const User = require("./userSchema");

const app = express();
const PORT = 8005;
const SALT_ROUNDS = 10;

require("dotenv").config(); // in node we require to do this for .env

app.use(express.json());

const bcrypt = require("bcrypt");

//Post-creating new user

app.post("/signup", async (req, res) => {
  try {
    const userBody = req.body;
    const hashedPassword = await bcrypt.hash(userBody.password, SALT_ROUNDS);
    const userObj = new User({
      username: userBody.username,
      password: hashedPassword,
      email: userBody.email,
    });
    await userObj.save();

    res.status(200).send("user has been created");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
});

app.post("/login", async (req, res) => {
  try {
    const loginBody = req.body;  // send by the user
    const userData = await User.findOne({ username: loginBody.username }); // data in database and it returns all document

    const isPasswordSame = await bcrypt.compare(
      loginBody.password,  
      userData.password
    );

    if (!isPasswordSame) {
      res.status(400).send("password is incorrect");
    } else {
      res.status(200).send("You are logged in");
    }
  } catch (err) {
    res.status(500).send("Internal server error");
  }
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log("server is running at ", PORT);
});
