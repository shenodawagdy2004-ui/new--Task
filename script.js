
const products = [
  {
    id: 1,
    name: "Galaxy S22 Ultra",
    price: 520,
    oldPrice: 720,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Galaxy M13",
    price: 145,
    oldPrice: 200,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    name: "Galaxy M33 5G",
    price: 280,
    oldPrice: 350,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 4,
    name: "Galaxy A Series",
    price: 190,
    oldPrice: 240,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 5,
    name: "Galaxy S22",
    price: 390,
    oldPrice: 480,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80"
  }
];

const categories = [
  { name: "Mobile", icon: "📱", keyword: "Galaxy" },
  { name: "Cosmetics", icon: "🧴", keyword: "Cosmetics" },
  { name: "Electronics", icon: "🎧", keyword: "Galaxy" },
  { name: "Furniture", icon: "🛋️", keyword: "Furniture" },
  { name: "Watches", icon: "⌚", keyword: "Watch" },
  { name: "Decor", icon: "🪴", keyword: "Decor" },
  { name: "Accessories", icon: "📿", keyword: "Accessories" }
];

const essentials = [
  {
    name: "Daily Essentials",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Fresh Vegetables",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Fresh Fruits",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Strawberries",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Mangoes",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Cherries",
    image: "https://images.unsplash.com/photo-1528821128474-27f963b062bf?auto=format&fit=crop&w=300&q=80"
  }
];

// Select HTML elements
const productGrid = document.getElementById("productGrid");
const categoryGrid = document.getElementById("categoryGrid");
const essentialsGrid = document.getElementById("essentialsGrid");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");

const cartCount = document.getElementById("cartCount");
const cartBtn = document.getElementById("cartBtn");
const cartDialog = document.getElementById("cartDialog");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const signInBtn = document.getElementById("signInBtn");

// Shopping cart state
let cart = [];

// Format prices
function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

// Render products on the page
function renderProducts(items) {
  productGrid.innerHTML = items.map(product => {
    const discount = Math.round(
      ((product.oldPrice - product.price) / product.oldPrice) * 100
    );

    return `
      <article class="product-card">
        <span class="discount-badge">${discount}% OFF</span>

        <div class="product-image">
          <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
          >
        </div>

        <h3>${product.name}</h3>

        <p class="price">
          ${formatPrice(product.price)}
          <span class="old-price">${formatPrice(product.oldPrice)}</span>
        </p>

        <p class="saving">
          Save ${formatPrice(product.oldPrice - product.price)}
        </p>

        <button class="add-to-cart" data-id="${product.id}">
          Add to Cart
        </button>
      </article>
    `;
  }).join("");

  emptyMessage.hidden = items.length !== 0;
}

// Render categories
function renderCategories() {
  categoryGrid.innerHTML = categories.map(category => `
    <button
      class="category-card"
      data-category="${category.name}"
      aria-pressed="false"
    >
      <span class="category-icon">${category.icon}</span>
      <span>${category.name}</span>
    </button>
  `).join("");
}

// Render daily essentials
function renderEssentials() {
  essentialsGrid.innerHTML = essentials.map(item => `
    <article class="essential-card">
      <img src="${item.image}" alt="${item.name}" loading="lazy">
      <h3>${item.name}</h3>
      <p>Great deals every day</p>
    </article>
  `).join("");
}

// Search products
searchForm.addEventListener("submit", event => {
  event.preventDefault();

  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm)
  );

  renderProducts(filteredProducts);

  document.getElementById("products").scrollIntoView({
    behavior: "smooth"
  });
});

// Add products to the cart
productGrid.addEventListener("click", event => {
  const button = event.target.closest(".add-to-cart");

  if (!button) return;

  const productId = Number(button.dataset.id);
  const product = products.find(item => item.id === productId);

  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
});

// Update cart count, items and total
function updateCart() {
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  cartCount.textContent = totalItems;

  cartItems.innerHTML = cart.length
    ? cart.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">

          <div class="cart-item-info">
            <strong>${item.name}</strong>
            <p>
              ${formatPrice(item.price)} × ${item.quantity}
            </p>
          </div>

          <button
            class="remove-item"
            data-remove-id="${item.id}"
          >
            Remove
          </button>
        </div>
      `).join("")
    : "<p>Your cart is empty.</p>";

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  cartTotal.textContent = formatPrice(totalPrice);
}

// Open shopping cart
cartBtn.addEventListener("click", () => {
  if (!cartDialog.open) {
    cartDialog.showModal();
  }
});

// Close shopping cart
closeCartBtn.addEventListener("click", () => {
  cartDialog.close();
});

// Remove products from the cart
cartItems.addEventListener("click", event => {
  const button = event.target.closest("[data-remove-id]");

  if (!button) return;

  const productId = Number(button.dataset.removeId);

  cart = cart.filter(item => item.id !== productId);

  updateCart();
});

// Category selection
categoryGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");

  if (!button) return;

  const categoryName = button.dataset.category;

  categoryGrid.querySelectorAll(".category-card").forEach(card => {
    const isActive = card === button;

    card.classList.toggle("active", isActive);
    card.setAttribute("aria-pressed", String(isActive));
  });

  // This demo currently contains smartphone products only.
  if (categoryName === "Mobile" || categoryName === "Electronics") {
    renderProducts(products);
  } else {
    renderProducts([]);
    emptyMessage.textContent =
      `Products for ${categoryName} will be added soon.`;
  }

  if (categoryName === "Mobile" || categoryName === "Electronics") {
    emptyMessage.textContent = "No products found. Try another search.";
  }

  document.getElementById("products").scrollIntoView({
    behavior: "smooth"
  });
});

// Demo sign-in interaction
signInBtn.addEventListener("click", () => {
  alert("Sign-in functionality can be connected to a backend later.");
});

// Initial page rendering
renderProducts(products);
renderCategories();
renderEssentials();
updateCart();
