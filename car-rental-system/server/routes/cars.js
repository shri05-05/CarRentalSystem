const express = require('express');
const router = express.Router();
const Car = require('../models/car'); // make sure this file is named 'car.js' (lowercase) in models/

// Add a new car
router.post('/add', async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.json({ message: 'Car added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all cars
router.get('/', async (req, res) => {
  console.log("✅ /api/cars route hit");
  try {
    const cars = await Car.find();
    console.log("🚗 Cars from DB:", cars);
    res.json(cars);
  } catch (err) {
    console.error("❌ Error fetching cars:", err);
    res.status(500).json({ error: err.message });
  }
});

// Book a car
router.post('/book/:id', async (req, res) => {
  const { id } = req.params;
  const { userEmail } = req.body;

  try {
    const car = await Car.findById(id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    if (car.isBooked) return res.status(400).json({ message: 'Car already booked' });

    car.isBooked = true;
    car.bookedBy = userEmail;
    await car.save();

    res.json({ message: 'Car booked successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get cars by owner email (for owner dashboard)
router.get('/owner/:email', async (req, res) => {
  try {
    const cars = await Car.find({ ownerEmail: req.params.email });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Return a booked car
router.post('/return/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    car.isBooked = false;
    car.bookedBy = null;
    await car.save();

    res.json({ message: 'Car returned successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Return all booked cars (admin/dev purpose)
router.post('/return-all', async (req, res) => {
  try {
    await Car.updateMany(
      { isBooked: true },
      { $set: { isBooked: false, bookedBy: null } }
    );
    res.json({ message: 'All cars returned successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// POST /api/cars/sample (insert sample cars)
router.post('/sample', async (req, res) => {
  try {
    const sampleCars = [
      { brand: "Hyundai", model: "i20", capacity: 5, isBooked: false },
      { brand: "Toyota", model: "Innova", capacity: 7, isBooked: false },
      { brand: "Maruti", model: "Swift", capacity: 5, isBooked: false }
    ];

    await Car.insertMany(sampleCars);
    res.json({ message: 'Sample cars added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding sample cars', error: error.message });
  }
});
// GET /api/cars/owner/:email
router.get('/owner/:email', async (req, res) => {
  try {
    const ownerCars = await Car.find({ ownerEmail: req.params.email });
    res.json(ownerCars);
  } catch (err) {
    res.status(500).json({ message: "Error fetching owner's cars", error: err.message });
  }
});
// POST /api/cars/book/:id
router.post('/book/:id', async (req, res) => {
  const carId = req.params.id;
  const { userEmail } = req.body;

  try {
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    car.isBooked = true;
    car.bookedBy = userEmail;
    await car.save();

    res.json({ message: 'Car booked successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error booking car', error: err.message });
  }
});
router.post("/", async (req, res) => {
  try {
    const { brand, model, capacity, ownerEmail } = req.body;
    const newCar = new Car({ brand, model, capacity, ownerEmail, isBooked: false });
    await newCar.save();
    res.status(201).json({ message: "Car added successfully", car: newCar });
  } catch (err) {
    res.status(500).json({ message: "Error adding car", error: err.message });
  }
});



module.exports = router;
