// Get the logged-in user's email from localStorage (simulate login)
let email = localStorage.getItem('email');
if (!email) {
  email = prompt("Enter your email:");
  localStorage.setItem('email', email);
}

// Retrieve existing cars from localStorage or start with an empty array
let cars = JSON.parse(localStorage.getItem('cars')) || [];

// Function to display cars (for pages where needed)
function displayCars() {
  const carList = document.getElementById('car-list');
  if (!carList) return; // Exit if no car-list in this page

  carList.innerHTML = '';

  if (cars.length === 0) {
    carList.innerHTML = '<p>No cars available.</p>';
    return;
  }

  cars.forEach(car => {
    const carItem = document.createElement('div');
    carItem.innerHTML = `<strong>${car.brand}</strong> ${car.model} - Seats: ${car.capacity}`;
    carList.appendChild(carItem);
  });
}

// Handle Add Car form submission
const carForm = document.getElementById('car-form');
if (carForm) {
  carForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const brand = document.getElementById('brand').value.trim();
    const model = document.getElementById('model').value.trim();
    const capacity = document.getElementById('capacity').value.trim();

    if (!brand || !model || !capacity) {
      alert('Please fill in all fields.');
      return;
    }

    const newCar = {
      brand,
      model,
      capacity: parseInt(capacity),
      ownerEmail: email,       // ✅ Required for owner dashboard
      isBooked: false,         // ✅ Not booked initially
      bookedBy: ''             // ✅ Empty bookedBy field
    };

    cars.push(newCar);
    localStorage.setItem('cars', JSON.stringify(cars));

    alert('Car added successfully!');
    this.reset();
    displayCars();
  });
}

// Owner Dashboard: Display only owner's cars
function displayOwnerCars() {
  const container = document.getElementById('car-list');
  if (!container) return;

  container.innerHTML = '';

  const ownerCars = cars.filter(car => car.ownerEmail === email);

  if (ownerCars.length === 0) {
    container.innerHTML = "<p>You have not added any cars.</p>";
    return;
  }

  ownerCars.forEach((car, index) => {
    const card = document.createElement("div");
    card.className = "car-card";

    const status = car.isBooked
      ? `
        <p class="booked">Booked by: ${car.bookedBy || 'Someone'}</p>
        <button onclick="returnCar(${index})">Return Car</button>
      `
      : `<p class="not-booked">Not Booked</p>`;

    card.innerHTML = `
      <h3>${car.brand} ${car.model}</h3>
      <p>Capacity: ${car.capacity} seats</p>
      <p>Owner: ${car.ownerEmail}</p>
      ${status}
    `;
    container.appendChild(card);
  });
}

// Return single car
function returnCar(indexInFilteredList) {
  const ownerCars = cars.filter(car => car.ownerEmail === email);
  const actualIndex = cars.indexOf(ownerCars[indexInFilteredList]);

  if (actualIndex !== -1 && cars[actualIndex].isBooked) {
    cars[actualIndex].isBooked = false;
    cars[actualIndex].bookedBy = '';
    localStorage.setItem('cars', JSON.stringify(cars));
    alert("Car marked as returned.");
    displayOwnerCars();
  }
}

// Return all cars
function returnAll() {
  const confirmAll = confirm("Are you sure you want to return all your booked cars?");
  if (!confirmAll) return;

  cars = cars.map(car => {
    if (car.ownerEmail === email && car.isBooked) {
      return { ...car, isBooked: false, bookedBy: '' };
    }
    return car;
  });

  localStorage.setItem('cars', JSON.stringify(cars));
  alert("All your booked cars have been marked as returned.");
  displayOwnerCars();
}

// Auto-run correct display on page load
document.addEventListener('DOMContentLoaded', function() {
  displayCars();
  displayOwnerCars();
});
