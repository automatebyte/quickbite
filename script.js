// Wait for the full DOM to be loaded before running core logic
document.addEventListener("DOMContentLoaded", () => {
  fetchMenuItems();        // Load menu items from local data or API
  fetchDiscoverMeals();    // Fetch meals from TheMealDB API
});

// === Cart State ===
let cart = []; // Global cart array to track added menu items

// === 1. Fetch and Display Local Menu Items (Burger, Pizza, Pasta) ===
function fetchMenuItems() {
  // Local menu data (you can replace this with a fetch to db.json or an API)
  const menuData = [
    { id: 1, name: "Burger", price: 350, image: "assests/burger.jpeg" },
    { id: 2, name: "Pizza", price: 800, image: "assests/pizza.jpeg" },
    { id: 3, name: "Pasta", price: 600, image: "assests/pasta.jpeg" }
  ];
  displayMenu(menuData); // Call to render menu cards
}

// === 2. Render Menu Items as Bootstrap Cards ===
function displayMenu(items) {
  const menuSection = document.getElementById("menu");
  const row = document.createElement("div");
  row.classList.add("row");

  items.forEach(item => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";

    col.innerHTML = `
      <div class="card">
        <img src="${item.image}" class="card-img-top" alt="${item.name}">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text">Price: KES ${item.price}</p>
          <button class="btn btn-primary add-to-cart" 
            data-id="${item.id}" 
            data-name="${item.name}" 
            data-price="${item.price}">
            Add to Cart
          </button>
        </div>
      </div>
    `;
    row.appendChild(col);
  });

  menuSection.appendChild(row);
  attachCartListeners(); // Attach click handlers to new Add-to-Cart buttons
}

// === 3. Listen for Add-to-Cart Button Clicks ===
function attachCartListeners() {
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
      const id = parseInt(button.dataset.id);
      const name = button.dataset.name;
      const price = parseInt(button.dataset.price);
      
      // Add item to cart array
      cart.push({ id, name, price });
      updateCart(); // Refresh cart UI
    });
  });
}

// === 4. Update Cart UI and Navbar Count Badge ===
function updateCart() {
  const cartList = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  cartList.innerHTML = ""; // Clear current cart display
  let total = 0;

  // Render each item in the cart
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      ${item.name} - KES ${item.price}
      <button class="btn btn-sm btn-danger remove-item" data-index="${index}">
        <i class="bi bi-trash"></i>
      </button>
    `;
    cartList.appendChild(li);
    total += item.price;
  });

  // Update total price
  totalDisplay.textContent = total;

  // Update cart count in navbar
  if (cartCount) {
    cartCount.textContent = cart.length;
    cartCount.style.display = cart.length === 0 ? "none" : "inline-block";
    
    // Optional: brief animation to show update
    cartCount.classList.add("updated");
    setTimeout(() => cartCount.classList.remove("updated"), 200);
  }

  attachRemoveListeners(); // Enable item removal
}

// === 5. Enable Remove-From-Cart Functionality ===
function attachRemoveListeners() {
  document.querySelectorAll(".remove-item").forEach(button => {
    button.addEventListener("click", () => {
      const index = parseInt(button.dataset.index);
      cart.splice(index, 1); // Remove item from cart array
      updateCart(); // Refresh cart UI
    });
  });
}

// === 6. Handle Order Submission ===
document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent default form submission
  const name = this.querySelector("input").value.trim();

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  if (name === "") {
    alert("Please enter your name.");
    return;
  }

  alert(`Thank you, ${name}! Your order has been placed successfully.`);

  // Reset cart and UI
  cart = [];
  updateCart();
  this.reset(); // Clear form input
});

// === 7. Fetch Meals from TheMealDB API ===
function fetchDiscoverMeals() {
  const API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?f=c';

  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      if (data.meals) {
        displayDiscoveredMeals(data.meals);
      } else {
        document.getElementById("api-meals").innerHTML = "<p>No meals found.</p>";
      }
    })
    .catch(err => {
      console.error("Error fetching meals:", err);
      document.getElementById("api-meals").innerHTML = "<p>Failed to load meals.</p>";
    });
}

// === 8. Render Meals from API to #api-meals Section ===
function displayDiscoveredMeals(meals) {
  const apiContainer = document.getElementById("api-meals");

  meals.forEach(meal => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";

    col.innerHTML = `
      <div class="card h-100">
        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${meal.strMeal}</h5>
          <p class="card-text"><strong>Category:</strong> ${meal.strCategory || "N/A"}</p>
          <a href="${meal.strSource || '#'}" target="_blank" class="btn btn-outline-primary mt-auto">Explore Recipe</a>
        </div>
      </div>
    `;
    apiContainer.appendChild(col);
  });
}
