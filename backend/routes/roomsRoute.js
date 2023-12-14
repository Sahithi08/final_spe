const express = require("express");
const router = express.Router();
const Room = require("../models/room");
const mongoose = require("mongoose");
const logger = require('../logger/log'); // Import your logger module here

router.get("/getallrooms", async (req, res) => {
  try {
    const rooms = await Room.find();
    logger.info("[Success] Retrieved all rooms successfully");
    res.send(rooms);
  } catch (error) {
    logger.error(`[Error] Failed to retrieve all rooms - ${error.message}`);
    return res.status(400).json({ message: 'Something went wrong' });
  }
});

router.post("/getroombyid", async (req, res) => {
  try {
    const room = await Room.findOne({ '_id': req.body.roomid });
    logger.info(`[Success] Retrieved room by ID successfully - Room ID: ${req.body.roomid}`);
    res.send(room);
  } catch (error) {
    logger.error(`[Error] Failed to retrieve room by ID - ${error.message}`);
    return res.status(400).json({ message: error });
  }
});

router.post("/addroom", async (req, res) => {
  const { room, rentperday, maxcount, description, phonenumber, type, image1, image2, image3 } = req.body;

  const newroom = new Room({
    name: room,
    rentperday,
    maxcount,
    description,
    phonenumber,
    type,
    imageurls: [image1, image2, image3],
    currentbookings: []
  });

  try {
    await newroom.save();
    logger.info(`[Success] New room added successfully - Room Name: ${room}`);
    res.send('New Room Added Successfully');
  } catch (error) {
    logger.error(`[Error] Failed to add new room - ${error.message}`);
    return res.status(400).json({ error });
  }
});
router.delete("/delroom", async (req, res) => {
  const { room, rentperday, maxcount, description, phonenumber, type, image1, image2, image3 } = req.body;

  const newroom = new Room({
    name: room,
    rentperday,
    maxcount,
    description,
    phonenumber,
    type,
    imageurls: [image1, image2, image3],
    currentbookings: []
  });

  try {
    await newroom.save();
    logger.info(`[Success] New room added successfully - Room Name: ${room}`);
    res.send('New Room Added Successfully');
  } catch (error) {
    logger.error(`[Error] Failed to add new room - ${error.message}`);
    return res.status(400).json({ error });
  }
});
module.exports = router;