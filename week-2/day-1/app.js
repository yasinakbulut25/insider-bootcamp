// Kullanıcı bilgilerini prompt ile alma
const user = {
  name: prompt("Adınız nedir?"),
  age: prompt("Yaşınız kaç?"),
  job: prompt("Mesleğiniz nedir?"),
};

// Ekrana yazma
document.getElementById("user-name").textContent = user.name;
document.getElementById("user-age").textContent = user.age;
document.getElementById("user-job").textContent = user.job;

// Ürün Listesi
const products = [
  {
    id: 1,
    title: "Samsung Galaxy S24 Ultra",
    category: "Akıllı Telefon",
    price: 35000,
    image: "./images/product-1.png",
  },
  {
    id: 2,
    title: "Apple AirPods Pro 2",
    category: "Kablosuz Kulaklık",
    price: 6500,
    image: "./images/product-2.png",
  },
  {
    id: 3,
    title: "iPad Pro 12.9 M4",
    category: "Tablet",
    price: 55000,
    image: "./images/product-3.png",
  },
  {
    id: 4,
    title: "SteelSeries Apex Pro",
    category: "Oyuncu Klavyesi",
    price: 4500,
    image: "./images/product-4.png",
  },
];

let cart = [];

document.addEventListener("DOMContentLoaded", () => {
  renderProductList();
  renderCart();
});

// Ürünleri HTML'e basma
function renderProductList() {
  const productList = document.querySelector(".product-grid");
  productList.innerHTML = products
    .map(
      (product) => `
      <div class="product-card">
        <div class="product-image">
          <img src="${product.image}" alt="${product.title}" />
        </div>
        <div class="product-info">
          <p class="product-category">${product.category}</p>
          <h3 class="product-title">${product.title}</h3>
          <h4 class="new-price">${product.price.toLocaleString("tr-TR")}₺</h4>
          <button class="add-basket-btn" data-id="${product.id}">
            Sepete Ekle <i class="bi bi-bag-plus-fill"></i>
          </button>
        </div>
      </div>
    `
    )
    .join("");

  document.querySelectorAll(".add-basket-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      addToCart(id);
    });
  });
}

// Sepete ekleme fonksiyonu
function addToCart(id) {
  const item = cart.find((p) => p.id === id);
  if (item) {
    if (item.quantity < 5) item.quantity++;
  } else {
    const product = products.find((p) => p.id === id);
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
}

// Sepeti HTML'e basma
function renderCart() {
  const cartContainer = document.querySelector(".shopping-card");
  console.log("cart.length", cart.length);
  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Sepetiniz boş.</p>";
    return;
  }

  const itemList = cart
    .map((item, index) => {
      const totalPrice = item.quantity * item.price;
      return `
      <div class="shopping-item">
        <img src="${item.image}" alt="${item.title}" class="item-image" />
        <div class="item-info">
          <div class="item-texts">
            <h3 class="product-title">${item.title}</h3>
            <p class="product-category">${item.category}</p>
          </div>
          <div class="item-actions">
            <select class="count-select" data-index="${index}">
              ${[1, 2, 3, 4, 5]
                .map(
                  (n) =>
                    `<option value="${n}"${
                      n === item.quantity ? "selected" : ""
                    }>
                      ${n}
                    </option>`
                )
                .join("")}
            </select>
            <button class="remove-btn" data-index="${index}">
              <i class="bi bi-trash"></i> Sil
            </button>
          </div>
          <h4 class="item-price">${totalPrice.toLocaleString("tr-TR")}₺</h4>
        </div>
      </div>
    `;
    })
    .join("");

  const subTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subTotal > 0 ? 100.0 : 0;
  const tax = subTotal * 0.2;
  const total = subTotal + shipping + tax;

  const summary = `
    <div class="payment-section">
      <div class="payment-item">
        <p class="payment-title">Ara Toplam</p>
        <p class="payment-price">${subTotal.toLocaleString("tr-TR")}₺</p>
      </div>
      <div class="payment-item">
        <p class="payment-title">Kargo</p>
        <p class="payment-price">${shipping.toLocaleString("tr-TR")}₺</p>
      </div>
      <div class="payment-item">
        <p class="payment-title">Vergi</p>
        <p class="payment-price">${tax.toLocaleString("tr-TR")}₺</p>
      </div>
      <div class="payment-item">
        <p class="payment-title">Genel Toplam</p>
        <p class="payment-price">${total.toLocaleString("tr-TR")}₺</p>
      </div>
    </div>
    <button class="order-btn">Ödemeye Geç <i class="bi bi-arrow-right"></i></button>
  `;

  cartContainer.innerHTML = itemList + summary;

  // Eventleri ekleme
  document.querySelectorAll(".remove-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      cart.splice(index, 1);
      renderCart();
    })
  );

  document.querySelectorAll(".count-select").forEach((select) =>
    select.addEventListener("change", (e) => {
      const index = e.target.dataset.index;
      cart[index].quantity = parseInt(e.target.value);
      renderCart();
    })
  );
}
