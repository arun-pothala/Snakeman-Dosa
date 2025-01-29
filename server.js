const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Sample data for donuts
const donuts = [
  { id: 1, name: 'Butter Dosa', price: 30.0, image: 'images/donut1.png' },
  { id: 2, name: 'Double Dosa', price: 40.0, image: 'images/donut2.png' },
  { id: 3, name: 'Veggie Dosa', price: 30.0, image: 'images/donut3.png' },
];

// API to get all donuts
app.get('/api/donuts', (req, res) => {
  res.json(donuts);
});

// API to place an order
app.post('/api/order', (req, res) => {
  const { items, total } = req.body;
  console.log('Order received:', { items, total });
  res.json({ success: true, message: 'Order placed successfully!' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});