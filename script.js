// Wait until DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  fetchMenuItems(); // Load menu
});

// Cart array to track items
let cart = [];

/**
 * Simulate fetching menu data (replace with fetch if using db.json or API)
 */
function fetchMenuItems() {
  const menuData = [
    { id: 1, name: "Burger", price: 350, image: "assests/burger.jpeg" },
    { id: 2, name: "Pizza", price: 800, image: "assests/pizza.jpeg" },
    { id: 3, name: "Pasta", price: 600, image: "assests/pasta.jpeg" }
  ];
  displayMenu(menuData);
}

/**
 * Display menu cards with Add to Cart buttons
 */
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
  attachCartListeners();
}

/**
 * Attach click listeners to "Add to Cart" buttons
 */
function attachCartListeners() {
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
      const id = parseInt(button.dataset.id);
      const name = button.dataset.name;
      const price = parseInt(button.dataset.price);
      cart.push({ id, name, price });
      updateCart();
    });
  });
}

/**
 * Display cart items and total
 */
function updateCart() {
  const cartList = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("cart-total");
  cartList.innerHTML = "";
  let total = 0;

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

  totalDisplay.textContent = total;
  attachRemoveListeners();
}

/**
 * Allow items to be removed from cart
 */
function attachRemoveListeners() {
  document.querySelectorAll(".remove-item").forEach(button => {
    button.addEventListener("click", () => {
      const index = parseInt(button.dataset.index);
      cart.splice(index, 1); // remove item at index
      updateCart(); // refresh cart UI
    });
  });
}

/**
 * Place order logic (for now, just an alert and reset)
 */
document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = this.querySelector("input").value;

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  if (name.trim() === "") {
    alert("Please enter your name.");
    return;
  }

  alert(`Thank you, ${name}! Your order has been placed successfully.`);
  cart = []; // clear cart
  updateCart(); // refresh cart UI
  this.reset(); // clear form input
});
// === Discover Meals Using TheMealDB API ===
document.addEventListener("DOMContentLoaded", () => {
  fetchDiscoverMeals(); // Load API meals on page load
});

/**
 * Fetch meals from TheMealDB API and display them
 */
function fetchDiscoverMeals() {
  // API endpoint for random meals
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

/**
 * Render meals from API inside #api-meals section
 */
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
