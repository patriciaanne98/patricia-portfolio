/* ==========================================
   MOBILE MENU BUTTON
========================================== */

(() => {
  "use strict";

  const navbar = document.querySelector(".navbar");
  const nav = navbar && navbar.querySelector("nav");
  if (!nav) return;

  const style = document.createElement("style");
  style.textContent = `
    .menu-toggle {
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 44px;
      height: 44px;
      margin-right: -10px;
      padding: 0;
      border: 0;
      background: none;
      color: #37008f;
      cursor: pointer;
    }

    .menu-toggle span {
      display: block;
      width: 24px;
      height: 2px;
      background: currentColor;
      transition: transform 0.25s ease, opacity 0.2s ease;
    }

    .menu-open .menu-toggle span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
    .menu-open .menu-toggle span:nth-child(2) { opacity: 0; }
    .menu-open .menu-toggle span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

    @media (max-width: 700px) {

      .navbar.has-menu {
        position: relative;
        z-index: 50;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        min-height: 72px;
        padding: 14px 6%;
        text-align: left;
      }

      .navbar.has-menu .menu-toggle {
        display: flex;
      }

      .navbar.has-menu nav {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        align-items: stretch;
        gap: 0;
        padding: 4px 6% 18px;
        background: #ffffff;
        border-bottom: 1px solid #e6e1eb;
        box-shadow: 0 16px 30px rgba(55, 0, 143, 0.08);
        visibility: hidden;
        opacity: 0;
        translate: 0 -10px;
        transition: opacity 0.25s ease, translate 0.25s ease, visibility 0s linear 0.25s;
      }

      .navbar.has-menu.menu-open nav {
        visibility: visible;
        opacity: 1;
        translate: 0 0;
        transition: opacity 0.25s ease, translate 0.25s ease;
      }

      .navbar.has-menu nav a {
        padding: 16px 0;
        border-bottom: 1px solid #f0edf4;
        font-size: 16px;
        text-align: left;
      }

      .navbar.has-menu nav a:last-child {
        border-bottom: 0;
      }

      .navbar.has-menu nav a::after {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .menu-toggle span,
      .navbar.has-menu nav {
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  if (!nav.id) nav.id = "site-menu";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "menu-toggle";
  button.setAttribute("aria-controls", nav.id);
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-label", "Open menu");
  button.innerHTML = "<span></span><span></span><span></span>";

  navbar.appendChild(button);
  navbar.classList.add("has-menu");

  function setOpen(open) {
    navbar.classList.toggle("menu-open", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  button.addEventListener("click", () => {
    setOpen(!navbar.classList.contains("menu-open"));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (!navbar.contains(event.target)) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navbar.classList.contains("menu-open")) {
      setOpen(false);
      button.focus();
    }
  });

  window.matchMedia("(min-width: 701px)").addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });
})();