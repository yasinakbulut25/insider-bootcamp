$(document).ready(function () {
  const API_URL = "https://fakestoreapi.com";
  const productList = $(".product-grid");
  const toastBox = $("#toastMsg");
  const cartKey = "cartItems";
  const favKey = "favItems";

  let allProducts = [];
  let shownCount = 0;
  const batchSize = 6;

  $.ajax({
    url: `${API_URL}/products`,
    method: "GET",
    success: function (data) {
      allProducts = data;
      loadMoreProducts();
    },

    error: function () {
      showToast("Profil verileri yüklenirken hata oluştu!", "error");
    },
  });

  const createCard = (product) => {
    const cartProducts = JSON.parse(localStorage.getItem(cartKey)) || [];
    const favProducts = JSON.parse(localStorage.getItem(favKey)) || [];

    const isAddedToCart = cartProducts.includes(product.id);
    const isFaved = favProducts.includes(product.id);

    return `
          <div class="product-card" data-id="${product.id}">
            <div class="product-image">
              <img src="${product.image}" alt="${product.title}" />
            </div>
            <div class="product-info">
              <p class="product-category truncate-1">${product.category}</p>
              <h3 class="product-title truncate-2">${product.title}</h3>
              <p class="product-desc truncate-2">${product.description}</p>
              <div class="product-footer">
                <div class="product-prices">
                  <h4 class="new-price">${product.price} TL</h4>
                </div>
                <div class="product-rate">
                  <i class="bi bi-star-fill"></i>
                  <span class="rate">${product.rating.rate}</span>
                </div>
              </div>
              <button class="add-basket-btn">
                ${
                  isAddedToCart
                    ? "Sepete Eklendi  <i class='bi bi-bag-plus-fill'></i>"
                    : "Sepete Ekle <i class='bi bi-bag-plus'></i>"
                }
              </button>
            </div>
            <div class="status">Stokta</div>
            <button class="add-favorite-btn ${isFaved ? "added" : ""}">
              <i class="outline-icon bi bi-suit-heart"></i>
              <i class="fill-icon bi bi-suit-heart-fill"></i>
            </button>
          </div>`;
  };

  const loadMoreProducts = () => {
    const slice = allProducts.slice(shownCount, shownCount + batchSize);

    slice.forEach((product, i) => {
      productList.append(
        $(createCard(product))
          .css({ opacity: 0, position: "relative", top: "-20px" })
          .delay(i * 150)
          .animate({ top: "0", opacity: 1 }, 150, "swing")
      );
    });

    shownCount += slice.length;

    if (shownCount >= allProducts.length) {
      $("#loadMoreBtn").replaceWith(`<p>Tüm ürünler gösterildi.</p>`);
    }
  };

  // Render Cart/Favs Modal
  const renderFancyboxList = (type = "cart") => {
    const key = type === "cart" ? cartKey : favKey;
    const title = type === "cart" ? "Sepetim" : "Favorilerim";
    const data = JSON.parse(localStorage.getItem(key)) || [];

    let html = `
      <div class='modal-wrapper'>
        <h2 class='modal-title'>${title}</h2>
    `;

    if (data.length === 0) {
      html += `<p class="empty-message">Hiç ürün yok.</p>`;
    } else {
      html += `<div class='modal-products'>`;
      html += data
        .map((id) => {
          const findProduct = allProducts.find((p) => p.id === id);
          if (!findProduct) return "";

          return `
          <div class="product-item">
            <img src="${findProduct.image}" alt="${findProduct.title}" class="item-image">
            <div class="item-info">
              <div class="item-texts">
                <h3 class="product-title">${findProduct.title}</h3>
                <p class="product-category">${findProduct.category}</p>
                <h4 class="item-price">${findProduct.price}₺</h4>
              </div>
              <button class="remove-btn" data-id="${findProduct.id}" data-key="${key}">
                <i class="bi bi-trash"></i> Sil
              </button>
            </div>
          </div>`;
        })
        .join("");
      html += `</div>`;
      html += `<button class="clear-fancybox-btn" id="clearFancyboxData" data-key="${key}">Temizle</button>`;
    }
    html += `</div>`;
    Fancybox.show([{ src: html, type: "html" }]);
  };

  // Show Toast Message
  const showToast = (message, type = "info") => {
    toastBox
      .text(message)
      .removeClass()
      .addClass("toast-msg " + type)
      .fadeIn(300);
    setTimeout(() => toastBox.fadeOut(500), 2000);
  };

  // Add to Cart
  $(document).on("click", ".add-basket-btn", function () {
    const id = $(this).closest(".product-card").data("id");
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    if (!cart.includes(id)) {
      cart.push(id);
      localStorage.setItem(cartKey, JSON.stringify(cart));
      $(this).html("Sepete Eklendi  <i class='bi bi-bag-plus-fill'></i>");
      showToast("Ürün sepete eklendi", "success");
    } else {
      showToast("Ürün zaten sepette", "info");
    }
  });

  // Add to Favorites
  $(document).on("click", ".add-favorite-btn", function () {
    const id = $(this).closest(".product-card").data("id");
    let favs = JSON.parse(localStorage.getItem(favKey)) || [];
    const index = favs.indexOf(id);

    if (index === -1) {
      favs.push(id);
      $(this).addClass("added");
      showToast("Ürün Favorilere Eklendi", "success");
    } else {
      favs.splice(index, 1);
      $(this).removeClass("added");
      showToast("Ürün Favorilerden Çıkarıldı", "info");
    }

    localStorage.setItem(favKey, JSON.stringify(favs));
  });

  $(document).on("click", ".remove-btn", function () {
    const key = $(this).data("key");
    const id = $(this).data("id");

    const localData = JSON.parse(localStorage.getItem(key)) || [];

    if (localData.includes(id)) {
      const filteredData = localData.filter((d) => d !== id);
      localStorage.setItem(key, JSON.stringify(filteredData));
      showToast("Ürün listeden silindi!", "success");
      Fancybox.close();
      renderFancyboxList(key === cartKey ? "cart" : "fav");
    } else {
      showToast("Ürün bulunamadı!", "error");
    }
  });

  // Load More Products
  $(document).on("click", "#loadMoreBtn", loadMoreProducts);

  // Open Cart Modal
  $(".basket-btn").on("click", function () {
    renderFancyboxList("cart");
  });

  // Open Favorites Modal
  $(".fav-btn").on("click", function () {
    renderFancyboxList("fav");
  });

  // Clear Cart/Favs Data
  $(document).on("click", "#clearFancyboxData", function () {
    const key = $(this).data("key");
    localStorage.removeItem(key);
    showToast("Liste temizlendi", "info");
    Fancybox.close();
  });
});
