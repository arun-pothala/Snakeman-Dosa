let cart = [];
let donuts = []; // Define globally to access in addToCart()

// Popup messages
const popupMessages = [
  "Amazing choice!",
  "Great choice!",
  "Wooohooo!",
  "You have great taste buds!",
  "Nuvvu thopu ehe!"
];

// Fetch donuts from the backend
async function fetchDonuts() {
  const response = await fetch('/api/donuts');
  donuts = await response.json(); // Assign fetched donuts to global variable
  displayDonuts(donuts);
}

// Display donuts on the page
function displayDonuts(donuts) {
  const donutList = document.getElementById('donut-list');
  donutList.innerHTML = donuts.map(donut => `
    <div class="col-md-4">
      <div class="donut-card">
        <img src="${donut.image}" alt="${donut.name}">
        <h3>${donut.name}</h3>
        <p>$${donut.price.toFixed(2)}</p>
        <input type="number" id="quantity-${donut.id}" min="1" value="1" class="quantity-input">
        <button onclick="addToCart(${donut.id}, '${donut.name}', ${donut.price})" class="btn btn-primary">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

// Add a donut to the cart with quantity selection
function addToCart(donutId, donutName, donutPrice) {
  const quantityInput = document.getElementById(`quantity-${donutId}`);
  const quantity = parseInt(quantityInput.value) || 1;

  const existingItem = cart.find(item => item.id === donutId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ id: donutId, name: donutName, price: donutPrice, quantity });
  }

  updateCart();
  showPopupMessage(); // Show popup on adding to cart

  // Reset quantity input to 1 after adding to cart
  quantityInput.value = 1;
}

// Show a random popup message
function showPopupMessage() {
  const message = popupMessages[Math.floor(Math.random() * popupMessages.length)];
  const popup = document.createElement('div');
  popup.textContent = message;
  popup.className = 'popup-message';
  document.body.appendChild(popup);

  // Remove the popup after 2 seconds
  setTimeout(() => {
    popup.remove();
  }, 2000);
}

// Clear cart function
function clearCart() {
  cart = []; // Empty the cart array
  updateCart(); // Update the cart display
}

// Add event listener for the "Clear Cart" button
document.getElementById('clear-cart').addEventListener('click', () => {
  clearCart();
  alert('Your cart has been cleared!');
});

// Update the cart display
function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartTax = document.getElementById('cart-tax');
  const cartGrandTotal = document.getElementById('cart-grand-total');

  cartItems.innerHTML = cart.map(item => `
    <li class="list-group-item">
      ${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}
    </li>
  `).join('');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = total * 0.10;
  const grandTotal = total + tax;

  cartTotal.textContent = total.toFixed(2);
  cartTax.textContent = tax.toFixed(2);
  cartGrandTotal.textContent = grandTotal.toFixed(2);
}

// Place an order
document.getElementById('place-order').addEventListener('click', async () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const response = await fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cart, total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.10 }),
  });

  const result = await response.json();
  alert('Thank you for your order! Your delicious dosas are being prepared.');

  cart = [];
  updateCart();
});

// Load donuts when the page loads
fetchDonuts();
