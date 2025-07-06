document.addEventListener("DOMContentLoaded", () => {
  // Header on scroll
  const header = document.querySelector("header");

  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Hamburger menu
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navbarLinks = document.querySelector(".navbar-links");
  const mobileCloseArea = document.querySelector(".mobile-close-area");

  if (mobileMenuBtn && navbarLinks) {
    const toggleMenu = () => navbarLinks.classList.toggle("open");
    const closeMenu = () => navbarLinks.classList.remove("open");

    mobileMenuBtn.addEventListener("click", toggleMenu);

    if (mobileCloseArea) {
      mobileCloseArea.addEventListener("click", closeMenu);
    }
  }

  // Add favorite
  const favoriteButton = document.querySelector(".favorite-btn");

  if (favoriteButton) {
    favoriteButton.addEventListener("click", () => {
      favoriteButton.classList.add("added");
    });
  }

  // Header links
  const navLinks = document.querySelectorAll(".nav-link-item");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });
});
