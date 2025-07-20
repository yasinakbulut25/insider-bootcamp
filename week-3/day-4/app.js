$(document).ready(function () {
  const API_URL = "https://fakestoreapi.com";
  const productList = $(".product-grid");
  const toastBox = $("#toastMsg");
  const cartKey = "cartItems";
  const favKey = "favItems";

  let allProducts = [];
  let shownCount = 0;
  const batchSize = 6;

  // Debounce helper
  const debounce = (fn, delay) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  // Verileri çek
  $.ajax({
    url: `${API_URL}/products`,
    method: "GET",
    success: function (data) {
      allProducts = data;
      loadMoreProducts();
      renderCarousel(data);
    },

    error: function () {
      showToast("Profil verileri yüklenirken hata oluştu!", "error");
    },
  });

  // Swiper Carousel
  const renderCarousel = (products) => {
    const html = products
      .slice(0, 5)
      .map(
        (product) => `
        <div class="swiper-slide">
          <h3 class="product-title truncate-2">${product.title}</h3>
          <img src="${product.image}" alt="${product.title}" />
        </div>`
      )
      .join("");

    $(".carousel-wrapper").html(`
    <div class="swiper">
      <div class="swiper-wrapper">
        ${html}
      </div>
      <div class="swiper-pagination"></div>
    </div>
  `);

    // Swiper Init
    new Swiper(".swiper", {
      loop: true,
      autoplay: {
        delay: 3000,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  };

  // Ürün kartı oluştur
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
              <div class="product-actions">
                <button class="action-btn open-detail-btn">
                  <i class='bi bi-eye'></i> Detay
                </button>
                <button class="action-btn add-basket-btn">
                  ${
                    isAddedToCart
                      ? "<i class='bi bi-bag-plus-fill'></i> Sepete Eklendi"
                      : "<i class='bi bi-bag-plus'></i> Sepete Ekle"
                  }
                </button>
              </div>
            </div>
            <div class="status">Stokta</div>
            <button class="add-favorite-btn ${isFaved ? "added" : ""}">
              <i class="outline-icon bi bi-suit-heart"></i>
              <i class="fill-icon bi bi-suit-heart-fill"></i>
            </button>
          </div>`;
  };

  // Daha fazla ürün yükle
  const loadMoreProducts = () => {
    const slice = allProducts.slice(shownCount, shownCount + batchSize);

    slice.forEach((product, i) => {
      productList.append(
        $(createCard(product))
          .css({ opacity: 0 })
          .delay(i * 100)
          .animate({ opacity: 1 }, 300)
      );
    });

    shownCount += slice.length;

    if (shownCount >= allProducts.length) {
      $("#loadMoreBtn").replaceWith(`<p>Tüm ürünler gösterildi.</p>`);
    }
  };

  // Sepet/Favoriler Modal
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

  // Mesaj Göster
  const showToast = (message, type = "info") => {
    toastBox
      .text(message)
      .removeClass()
      .addClass("toast-msg " + type)
      .fadeIn(300);
    setTimeout(() => toastBox.fadeOut(500), 2000);
  };

  // Detay modal içeriği
  $(document).on("click", ".open-detail-btn", function () {
    const card = $(this).closest(".product-card");
    const clonedCard = card.clone();
    clonedCard
      .find(".add-basket-btn, .add-favorite-btn, .open-detail-btn")
      .remove();
    clonedCard.find(".product-desc").removeClass("truncate-2");

    Fancybox.show([
      {
        src: `
        <div class="modal-wrapper">
          ${clonedCard.prop("outerHTML")}
        </div>`,
        type: "html",
      },
    ]);
  });

  // Arama kutusu
  $("body").prepend(
    `<input
      class='search-input'
      type='number'
      id='searchProduct'
      placeholder='Ürün ID ile ara'
    />`
  );
  $("#searchProduct").on(
    "input",
    debounce(function () {
      const val = Number($(this).val());
      if (!val) return;

      $.get(`${API_URL}/products/${val}`)
        .done((res) => {
          const card = $(`.product-card[data-id=${res.id}]`);

          if (card.length === 0) {
            showToast("Bu ürün sayfada yok!", "error");
            return;
          }
          const clonedCard = card.clone();

          Fancybox.show([
            {
              src: `
                <div class="modal-wrapper">
                  ${clonedCard.prop("outerHTML")}
                </div>`,
              type: "html",
            },
          ]);
        })
        .fail(() => showToast("Ürün bulunamadı", "error"));
    }, 600)
  );

  // Sepete ekle
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

  // Favorilere ekle
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

  // Sepetten/Favorilerden sil
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

  // Sepet/Favori modalı aç
  $(".basket-btn").on("click", () => renderFancyboxList("cart"));
  $(".fav-btn").on("click", () => renderFancyboxList("fav"));

  // Sepetten/Favorilerden verileri temizle
  $(document).on("click", "#clearFancyboxData", function () {
    const key = $(this).data("key");
    localStorage.removeItem(key);
    showToast("Liste temizlendi", "info");
    Fancybox.close();
  });

  // Daha fazla yükle butonu
  $(document).on("click", "#loadMoreBtn", loadMoreProducts);
});
