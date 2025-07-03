const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 In-memory storage
let users = [];
let cars = [];

// ✅ User Signup
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, role } = req.body;

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = { email, password, role };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully' });
});

// ✅ User Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  res.json({ message: 'Login successful', user: { email: user.email, role: user.role } });
});

// ✅ Add Car (Owner)
app.post('/api/cars', (req, res) => {
  const { brand, model, capacity, ownerEmail } = req.body;

  const newCar = { id: cars.length + 1, brand, model, capacity, ownerEmail, isBooked: false };
  cars.push(newCar);

  res.status(201).json({ message: 'Car added successfully', car: newCar });
});

// ✅ Get Available Cars
app.get('/api/cars', (req, res) => {
  const availableCars = cars.filter(car => !car.isBooked);
  res.json(availableCars);
});

// ✅ Book Car
app.post('/api/cars/book', (req, res) => {
  const { carId, userEmail } = req.body;

  const car = cars.find(c => c.id === carId);
  if (!car || car.isBooked) {
    return res.status(400).json({ message: 'Car not available' });
  }

  car.isBooked = true;
  car.bookedBy = userEmail;

  res.json({ message: 'Car booked successfully', car });
});

// ✅ Owner View Cars
app.get('/api/cars/owner/:email', (req, res) => {
  const ownerCars = cars.filter(car => car.ownerEmail === req.params.email);
  res.json(ownerCars);
});

// ✅ Static files
app.use(express.static(path.join(__dirname, '..', 'client')));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// Start server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
