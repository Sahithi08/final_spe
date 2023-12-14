const express = require("express");
const router = express.Router();
const User = require("../models/user");
const logger = require('../logger/log'); // Import your logger module here

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const newUser = new User({ name, email, password });

  try {
    await newUser.save();
    logger.info(`[Success] User registered successfully - Name: ${name}, Email: ${email}`);
    res.send('User Registered successfully');
  } catch (error) {
    logger.error(`[Error] User registration failed - ${error.message}`);
    return res.status(400).json({ message: error });
  }
});
router.put("/makeAdmin", async (req, res) => {
  const { id } = req.body;
  // const newUser = new User({ name, email, password });

  try {
    const user = await User.findOne({_id :id});
    user.isAdmin = true;
    user.save();
    const user2 = await User.findOne({_id :id});
    console.log(user2);
    logger.info(`[Success] This user is now an admin ${id}`);
    res.send('User is now an admin');
  } catch (error) {
    logger.error(`[Error] Make user admin failed - ${error.message}`);
    return res.status(400).json({ message: error });
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.find({ email, password });

    if (user.length > 0) {
      const currentUser = {
        name: user[0].name,
        email: user[0].email,
        isAdmin: user[0].isAdmin,
        _id: user[0]._id
      };
      logger.info(`[Success] User login successful - Name: ${user[0].name}, Email: ${user[0].email}`);
      res.send(currentUser);
    } else {
      logger.error("[Failure] User login failed - Invalid credentials");
      return res.status(400).json({ message: 'User Login Failed' });
    }
  } catch (error) {
    logger.error(`[Error] User login failed - ${error.message}`);
    return res.status(400).json({ message: 'Something went wrong' });
  }
});

router.get("/getallusers", async (req, res) => {
  try {
    const users = await User.find({});
    logger.info("[Success] Retrieved all users successfully");
    res.send(users);
  } catch (error) {
    logger.error(`[Error] Failed to retrieve all users - ${error.message}`);
    return res.status(400).json({ message: error });
  }
});

router.post("/deleteuser", async (req, res) => {
  const userid = req.body.userid;

  try {
    await User.findOneAndDelete({ _id: userid });
    logger.info(`[Success] User deleted successfully - User ID: ${userid}`);
    res.send('User Deleted Successfully');
  } catch (error) {
    logger.error(`[Error] Failed to delete user - ${error.message}`);
    return res.status(400).json({ message: error });
  }
});

module.exports = router;