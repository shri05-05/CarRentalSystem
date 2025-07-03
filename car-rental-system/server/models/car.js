const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: String,
  model: String,
  capacity: Number,
  isBooked: { type: Boolean, default: false },
  bookedBy: String,       // ⬅️ store who booked it
  ownerEmail: String      // ⬅️ store which owner added the car
});

module.exports = mongoose.model("Car", carSchema);
