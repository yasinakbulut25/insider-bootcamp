const storageKey = "usersDataWithExpiry";
const expiryDuration = 1000 * 60 * 60 * 24; // 1 gün

// LocalStorage kaydetme
function saveToLocalStorage(key, data, duration) {
  const dataWithExpiry = {
    value: data,
    expiry: Date.now() + duration,
  };
  localStorage.setItem(key, JSON.stringify(dataWithExpiry));
}

// LocalStorage'dan verileri getir
function loadFromLocalStorage(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);

  if (Date.now() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
}

// User kartlarını yazdır
function renderUsers(users) {
  const $container = $(".ins-api-users").empty();

  if (users.length === 0) {
    $container.append(
      "<p style='text-align:center;color:#000;font-size:1rem'>Hiç kullanıcı yok</p>"
    );
    return;
  }

  users.forEach((user) => {
    const $card = $(`
      <div class="user-card" data-id="${user.id}">
        <div class="user-info">
          <h3>${user.name}</h3>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Adres:</strong> ${user.address.street}, ${user.address.city}</p>
        </div>
        <button class="delete-btn">Sil</button>
      </div>
    `);

    $container.append($card);
  });

  applyStyles();
}

// Kullanıcı sil
function deleteUser(id) {
  const current = loadFromLocalStorage(storageKey);
  if (!current) return;

  const updated = current.filter((u) => u.id !== id);
  saveToLocalStorage(storageKey, updated, expiryDuration);

  // Kartı animasyonlu sil
  const $card = $(`.user-card[data-id="${id}"]`);
  $card.slideUp(300, () => {
    $card.remove();
    // Kart silindikten sonra localStorage verisini yeniden kontrol etme
    if (updated.length === 0) {
      $(".ins-api-users").html(
        "<p style='text-align:center;color:#888;'>Hiç kullanıcı yok</p>"
      );
    }
  });
}

// Kullanıcıları API den çek
function fetchUsers() {
  return new Promise((resolve, reject) => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Sunucu hatası: " + response.status);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch(() => {
        reject("Kullanıcı verisi alınamadı.");
      });
  });
}

// Stillendirme ekleme
function applyStyles() {
  $("*").css({
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
  });

  $("body").css({
    minHeight: "100vh",
    overflowX: "hidden",
    padding: "1.5rem",
    backgroundColor: "#f4f4f5",
  });

  $(".ins-api-users").css({
    maxWidth: "800px",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  });

  $(".user-card").css({
    backgroundColor: "#fff",
    borderRadius: "0.75rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    padding: "1.25rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  });

  $(".user-info").css({
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    flex: "1",
  });

  $(".user-info h3").css({
    fontSize: "1.5rem",
    color: "#000",
  });

  $(".user-info p").css({
    color: "#828892",
    fontSize: "0.9rem",
  });

  $(".delete-btn")
    .css({
      backgroundColor: "#ff4d4f",
      color: "#fff",
      border: "none",
      borderRadius: "0.5rem",
      padding: "0.5rem 0.75rem",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      fontSize: "0.9rem",
    })
    .hover(
      function () {
        $(this).css("background-color", "#d9363e");
      },
      function () {
        $(this).css("background-color", "#ff4d4f");
      }
    );
}

$(document).ready(async () => {
  let users = loadFromLocalStorage(storageKey);
  if (users) {
    renderUsers(users);
  } else {
    try {
      const fetchedUsers = await fetchUsers();
      saveToLocalStorage(storageKey, fetchedUsers, expiryDuration);
      renderUsers(fetchedUsers);
    } catch (errMsg) {
      $(".ins-api-users").html(
        `<p style='text-align:center;color:#ff0000;font-size:1rem'>${errMsg}</p>`
      );
      console.error("error", errMsg);
    }
  }

  $(".ins-api-users").on("click", ".delete-btn", function () {
    const userId = parseInt($(this).closest(".user-card").data("id"));
    deleteUser(userId);
  });
});
