const appendLocation = ".ins-api-users";

const storageKey = "usersDataWithExpiryInline";
const sessionReloadKey = "reloadOncePerSession";
const expiryDuration = 1000 * 60 * 60 * 24;

(function loadJQuery(callback) {
  if (typeof jQuery === "undefined") {
    const script = document.createElement("script");
    script.src = "https://code.jquery.com/jquery-3.7.1.min.js";
    script.onload = () => callback();
    document.head.appendChild(script);
  } else {
    callback();
  }
})(function () {
  function saveUsersToStorage(users) {
    const now = Date.now();
    const withExpiry = users.map((u) => ({
      ...u,
      expiry: now + expiryDuration,
    }));
    localStorage.setItem(storageKey, JSON.stringify(withExpiry));
  }

  function loadUsersFromStorage() {
    const itemStr = localStorage.getItem(storageKey);
    if (!itemStr) return null;

    try {
      const items = JSON.parse(itemStr);
      const now = Date.now();
      const validUsers = items.filter((u) => now < u.expiry);
      return validUsers.length > 0 ? validUsers : null;
    } catch {
      return null;
    }
  }

  async function fetchUsers() {
    return fetch("https://jsonplaceholder.typicode.com/users").then((res) => {
      if (!res.ok) throw new Error("Veri alınamadı");
      return res.json();
    });
  }

  function renderUsers(users) {
    const $container = $(appendLocation).empty();

    if (!users || users.length === 0) {
      $container.append("<p class='empty-msg'>Hiç kullanıcı yok</p>");
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
      $(appendLocation).append($card);
    });

    applyStyles();
  }

  function deleteUser(id) {
    let users = loadUsersFromStorage();
    if (!users) return;

    const updated = users.filter((u) => u.id !== id);
    saveUsersToStorage(updated);

    const $card = $(`.user-card[data-id="${id}"]`);
    $card.slideUp(300, () => {
      $card.remove();
    });
  }

  function setupEmptyObserver() {
    const target = document.querySelector(appendLocation);
    const observer = new MutationObserver(() => {
      if (
        $(appendLocation).children().length === 0 &&
        !sessionStorage.getItem(sessionReloadKey)
      ) {
        if ($(".reload-btn").length === 0) {
          $(appendLocation).append(
            `<button class="reload-btn">Kullanıcıları Yeniden Yükle</button>`
          );
          applyReloadStyle();
        }
      }
    });

    observer.observe(target, { childList: true });
  }

  $(document).on("click", ".reload-btn", async function () {
    if (sessionStorage.getItem(sessionReloadKey)) return;

    try {
      const newUsers = await fetchUsers();
      saveUsersToStorage(newUsers);
      sessionStorage.setItem(sessionReloadKey, "true");
      renderUsers(newUsers);
    } catch {
      $(appendLocation).html(`<p style='color:red;'>Veri alınamadı.</p>`);
    }
  });

  function applyStyles() {
    $("*").css({
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      fontFamily: "sans-serif",
    });
    $("body").css({ padding: "1rem", backgroundColor: "#f4f4f4" });

    $(appendLocation).css({
      maxWidth: "800px",
      margin: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    });

    $(".user-card").css({
      backgroundColor: "#fff",
      borderRadius: "10px",
      padding: "1rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    });

    $(".user-info").css({ flex: 1 });
    $(".user-info h3").css({ fontSize: "1.2rem", color: "#333" });
    $(".user-info p").css({ color: "#555", fontSize: "0.9rem" });

    $(".delete-btn").css({
      backgroundColor: "#ff4d4f",
      color: "#fff",
      border: "none",
      padding: "0.5rem 0.75rem",
      borderRadius: "5px",
      cursor: "pointer",
    });
  }

  function applyReloadStyle() {
    $(".reload-btn").css({
      padding: "0.6rem 1rem",
      backgroundColor: "#4f46e5",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      fontSize: "1rem",
      cursor: "pointer",
      margin: "1rem auto 0",
    });
  }

  $(async function () {
    setupEmptyObserver();

    const existing = loadUsersFromStorage();
    if (existing) {
      renderUsers(existing);
    } else {
      try {
        const users = await fetchUsers();
        saveUsersToStorage(users);
        renderUsers(users);
      } catch {
        $(appendLocation).html(
          `<p style='color:red;'>Kullanıcılar yüklenemedi.</p>`
        );
      }
    }

    $(appendLocation).on("click", ".delete-btn", function () {
      const id = parseInt($(this).closest(".user-card").data("id"));
      deleteUser(id);
    });
  });
});
