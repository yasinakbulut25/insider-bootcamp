$(document).ready(function () {
  const API_URL = "https://jsonplaceholder.typicode.com";
  const container = $(".posts-container");
  const toast = $("#toastMsg");

  const limit = 5;
  let start = 0;
  let isLoading = false;
  let isEnd = false;

  let postUsers = [];

  // Kullanıcı bilgilerini al ilk yüklemeyi gerçekleştir
  $.ajax({
    url: `${API_URL}/users`,
    method: "GET",
    success: function (users) {
      users.forEach((user) => {
        postUsers[user.id] = user.name;
      });

      // Kullanıcılar geldikten sonra postları yüklemeye başla
      loadPosts();
    },
    error: function () {
      showToast("Kullanıcı verileri yüklenemedi!", true);
    },
  });

  // Scroll ile yeni post çekme
  $(window).on("scroll", function () {
    if (
      $(window).scrollTop() + $(window).height() >=
        $(document).height() - 100 &&
      !isLoading &&
      !isEnd
    ) {
      showToast("Daha fazla içerik getirildi!");
      loadPosts();
    }
  });

  // Postları çek ve göster
  function loadPosts() {
    isLoading = true;
    showLoader();

    $.ajax({
      url: `${API_URL}/posts?_start=${start}&_limit=${limit}`,
      method: "GET",
      success: function (data) {
        if (data.length === 0) {
          isEnd = true;
          showToast("Tüm içerikler yüklendi.");
          hideLoader();
          return;
        }

        data.forEach((post) => {
          const userName =
            postUsers[post.userId] || `Kullanıcı #${post.userId}`;

          const card = $(`
            <div class="post-card" style="opacity: 0; transform: translateY(20px); transition: all 0.3s ease;">
              <div class="post-info">
                <p class="post-user"><i class='bi bi-person'></i> ${userName}</p>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-body">${post.body}</p>
              </div>
              <button class="add-favorite-btn" data-id='${post.id}'>
                <i class="outline-icon bi bi-suit-heart"></i>
                <i class="fill-icon bi bi-suit-heart-fill d-none"></i>
              </button>
            </div>
          `);

          container.append(card);

          setTimeout(() => {
            card.css({
              opacity: 1,
              transform: "translateY(0)",
            });
          }, 100);
        });

        start += limit;
        hideLoader();
        isLoading = false;
      },
      error: function () {
        showToast("İçerikler yüklenirken bir hata oluştu.", true);
        hideLoader();
        isLoading = false;
      },
    });
    showLoader();
  }

  function showToast(message, isError = false) {
    toast.hide();
    toast.text(message);

    if (isError) {
      toast.css({
        backgroundColor: "#fef2f2",
        borderColor: "#fca5a5",
        color: "#ef4444",
      });
    }

    toast.fadeIn();

    setTimeout(() => {
      toast.fadeOut();
    }, 3000);
  }

  // Loader göster
  function showLoader() {
    if ($("#loading").length === 0) {
      container.after(
        `<div id="loading" style="text-align:center; padding:1.5rem;">
          <i class="bi bi-arrow-repeat spin"></i>
        </div>
        `
      );
    }
  }

  // Loader gizle
  function hideLoader() {
    $("#loading").remove();
  }

  // Favori butonuna tıklama
  container.on("click", ".add-favorite-btn", function (e) {
    e.stopPropagation();
    const btn = $(this);
    const isLiked = btn.find(".fill-icon").hasClass("d-none") === false;

    btn.find(".outline-icon").toggleClass("d-none");
    btn.find(".fill-icon").toggleClass("d-none");

    const postId = btn.data("id");

    const message = isLiked
      ? `Post ${postId} beğeni kaldırıldı.`
      : `Post ${postId} beğenildi!`;

    showToast(message);
  });
});
