$(document).ready(function () {
  const API_URL = "https://randomuser.me/api";
  const profileCards = $("#profileCards");
  const profileSlider = $("#profileSlider");
  const toast = $("#toastMsg");

  loadProfiles();
  loadSliderProfiles();

  $("#loadProfilesBtn").on("click", function () {
    $(this).addClass("bounce");
    setTimeout(() => $(this).removeClass("bounce"), 500);
    profileCards.empty();
    loadProfiles();
    showToast("Yeni profiller yüklendi!");
  });

  function loadProfiles() {
    $.ajax({
      url: `${API_URL}/?results=6`,
      method: "GET",
      success: function (data) {
        data.results.forEach((user, i) => {
          const card = $(`
            <div class="card-item mfp-link" href="#popup-${i}">
              <div class="user-image">
                <img src="${user.picture.large}" alt="${user.name.first}" />
              </div>
              <div class="user-info">
                <p class="info-text">${user.email}</p>
                <h3 class="user-name">${user.name.first} ${user.name.last}</h3>
                <p class="info-text"><i class="bi bi-map"></i> ${user.location.city}/${user.location.country}</p>
                <p class="info-text"><i class="bi bi-telephone"></i> ${user.phone}</p>
              </div>
              <div class="gender ${user.gender}">${user.gender}</div>
            </div>
          `);

          const modal = $(`
            <div id="popup-${i}" class="mfp-hide user-popup centered-text">
              <div class="user-image">
                <img src="${user.picture.large}" alt="${user.name.first}" />
              </div>
              <div class="user-info">
                <div class="gender gender-block ${user.gender}">
                  ${user.gender}
                </div>
                <h3 class="user-name">${user.name.first} ${user.name.last}</h3>
                <p class="info-text">
                  <strong>Email: </strong> ${user.email}
                </p>
                <p class="info-text">
                  <strong>Konum: </strong>
                  ${user.location.city}/${user.location.country}
                </p>
                <p class="info-text">
                  <strong>Telefon: </strong> ${user.phone}
                </p>
                <p class="info-text">
                  <strong>Doğum Tarihi: </strong>
                  ${new Date(user.dob.date).toLocaleDateString()}
                </p>
                <p class="info-text">
                  <strong>Yaş: </strong> ${user.dob.age}
                </p>
                <p class="info-text">
                  <strong>Posta Kodu: </strong> ${user.location.postcode}
                </p>
                <p class="info-text">
                  <strong>Kayıt: </strong>
                  ${new Date(user.registered.date).toLocaleDateString()}
                </p>
                <p class="info-text">
                  <strong>Kullanıcı Adı: </strong> ${user.login.username}
                </p>
                <p class="info-text">
                  <strong>Uyruk: </strong> ${user.nat}
                </p>
              </div>
              <button class="mfp-close" title="Kapat">×</button>
            </div>
          `);

          $("body").append(modal);
          profileCards.append(card);
          card
            .css({ opacity: 0, position: "relative", top: "-20px" })
            .delay(i * 200)
            .animate({ top: "0", opacity: 1 }, 200, "swing");
        });

        $(".mfp-link").magnificPopup({
          type: "inline",
          midClick: true,
        });
      },

      error: function () {
        showToast("Profil verileri yüklenirken hata oluştu!", true);
      },
    });
  }

  function loadSliderProfiles() {
    $.ajax({
      url: `${API_URL}/?results=10`,
      method: "GET",
      success: function (data) {
        data.results.forEach((user) => {
          const slide = $(`
            <div class="card-item glider-card centered-text">
              <div class="user-image">
                <img src="${user.picture.large}" alt="${user.name.first}" />
              </div>
              <div class="user-info">
                <div class="gender gender-block ${user.gender}">${user.gender}</div>
                <h3 class="user-name">${user.name.first} ${user.name.last}</h3>
                <p class="info-text">${user.email}</p>
                <p class="info-text"><i class="bi bi-map"></i> ${user.location.city}, ${user.location.country}</p>
                <p class="info-text"><i class="bi bi-telephone"></i> ${user.phone}</p>
              </div>
            </div>
          `);
          profileSlider.append(slide);
        });

        new Glider(document.querySelector("#profileSlider"), {
          slidesToShow: 2,
          slidesToScroll: 1,
          draggable: true,
          scrollLock: true,
          dots: ".dots",
          arrows: {
            prev: ".glider-prev",
            next: ".glider-next",
          },
          responsive: [
            {
              breakpoint: 768,
              settings: { slidesToShow: 2 },
            },
            {
              breakpoint: 480,
              settings: { slidesToShow: 1 },
            },
          ],
        });
      },
      error: function () {
        showToast("Slider verileri yüklenemedi!", true);
      },
    });
  }

  function showToast(message, isError = false) {
    if (isError) {
      toast.css({
        backgroundColor: "#fef2f2",
        borderColor: "#fca5a5",
        color: "#ef4444",
      });
    }

    toast.stop(true, true).hide();
    toast.text(message);
    toast.fadeIn(300).delay(2000).fadeOut();
  }

  // Hover efekti
  $(document).on("mouseenter", ".card-item", function () {
    $(this).stop().fadeTo(200, 0.9).addClass("hovered");
  });

  $(document).on("mouseleave", ".card-item", function () {
    $(this).stop().fadeTo(200, 1).removeClass("hovered");
  });
});
