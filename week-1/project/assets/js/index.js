document.addEventListener("DOMContentLoaded", () => {
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
});
