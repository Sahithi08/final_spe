const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const stripe = require("stripe")(
  "sk_test_51IYnC0SIR2AbPxU0EiMx1fTwzbZXLbkaOcbc2cXx49528d9TGkQVjUINJfUDAnQMVaBFfBDP5xtcHCkZG1n1V3E800U7qXFmGf"
);
const Booking = require("../models/booking");
const Room = require("../models/room");
const logger = require('../logger/log'); // Import your logger module here

router.post("/bookroom", async (req, res) => {
  const { room, fromdate, todate, totalDays, totalAmount, user , token } = req.body;

  try {
    // const customer = await stripe.customers.create({
    //   email: token.email,
    //   source: token.id,
    // });

    // const payment = await stripe.charges.create(
    //   {
    //     amount: totalAmount * 1,
    //     currency: "inr",
    //     customer: customer.id,
    //     receipt_email: token.email,
    //   },
    //   {
    //     idempotencyKey: uuidv4(),
    //   }
    // );
    const payment = true;
    if (payment) {
      try {
        const newbooking = new Booking({
          userid: user._id,
          room: room.name,
          roomid: room._id,
          totalDays: totalDays,
          fromdate: moment(fromdate).format("DD-MM-YYYY"),
          todate: moment(todate).format("DD-MM-YYYY"),
          totalAmount: totalAmount,
          transactionId: "1234",
          status: 'booked'
        });

        await newbooking.save(async (err, booking) => {
          const oldroom = await Room.findOne({ _id: room._id });

          oldroom.currentbookings.push({
            bookingid: booking._id,
            fromdate: moment(fromdate).format("DD-MM-YYYY"),
            todate: moment(todate).format("DD-MM-YYYY"),
            userid: user._id,
            status: 'booked'
          });
          await oldroom.save();
        });

        logger.info(`[Success] Room booked successfully - User: ${user._id}, Room: ${room.name}`);
        res.send("Room Booked Successfully");
      } catch (error) {
        logger.error(`[Error] Room booking failed - ${error.message}`);
        console.log(error);
        return res.status(400).json({ message: error });
      }
    } else {
      logger.error(`[Failure] Payment failed - User: ${user._id}, Room: ${room.name}`);
      res.send("Payment failed");
    }
  } catch (error) {
    logger.error(`[Error] Room booking failed - ${error.message}`);
    return res.status(400).json({ message: "Something went wrong" + error });
  }
});

// router.post("/cancelbooking", async (req, res) => {
//   const {bookingid, roomid } = req.body;

//   try {
//     const bookingitem = await Booking.findOne({ _id: bookingid });
//     bookingitem.status = 'cancelled';

//     await bookingitem.save();
    
//     const room = await Room.findOne({ _id: roomid });
//     const bookings = room.currentbookings;
//     const temp = bookings.filter(booking => booking.bookingid.toString() !== bookingid);
//     console.log(temp);
//     room.currentbookings = temp;
//     await room.save();

//     logger.info(`[Success] Booking cancelled successfully - Booking ID: ${bookingid}`);
//     res.send('Booking deleted successfully');
//   } catch (error) {
//     logger.error(`[Error] Booking cancellation failed - ${error.message}`);
//     console.log(error);
//     return res.status(400).json({ message: "something went wrong" });
//   }
// });

router.delete(`/cancelbooking/:bookingid/:roomid`, async (req, res) => {
  // const {bookingid, roomid } = req.body.bookingid;
  const bookingid = req.params.bookingid;
  const roomid = req.params.roomid;
  console.log(bookingid)
  try {
    const deletedBooking = await Booking.findOneAndDelete({ _id: bookingid,roomid : roomid });
    // console.log(booking)
    if (!deletedBooking) {
      logger.error(`[Failure] Booking not found - Booking ID: ${bookingid}`);
      return res.status(404).json({ message: "Booking not found" });
    }
    logger.info(`[Success] Booking cancelled successfully - Booking ID: ${bookingid}`);
    res.send('Booking deleted successfully');
  } catch (error) {
    logger.error(`[Error] Booking cancellation failed - ${error.message}`);
    console.log(error);
    return res.status(400).json({ message: "something went wrong" });
  }
});

router.post("/getuserbookings", async (req, res) => {
  const { userid } = req.body;
  try {
    const bookings = await Booking.find({ userid: userid }).sort({ _id: -1 });
    logger.info(`[Success] Retrieved user bookings successfully - User ID: ${userid}`);
    res.send(bookings);
  } catch (error) {
    logger.error(`[Error] Failed to retrieve user bookings - ${error.message}`);
    return res.status(400).json({ message: "Something went wrong" });
  }
});

router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find({});
    logger.info("[Success] Retrieved all bookings successfully");
    res.send(bookings);
  } catch (error) {
    logger.error(`[Error] Failed to retrieve all bookings - ${error.message}`);
    return res.status(400).json({ message: error });
  }
});

module.exports = router;