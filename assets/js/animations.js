/* ==========================================
   SNEAK PEEK SWIPE ANIMATION (home page)
   Everything else (page intros + scroll reveals)
   lives in assets/js/page-animations.js
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  const heading = document.querySelector(".swipe-heading");

  if (!heading || !("IntersectionObserver" in window)) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heading.classList.add("swipe-active");
    return;
  }

  const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {
      heading.classList.toggle("swipe-active", entry.isIntersecting);
    });

  }, {
    threshold: 0.1
  });

  observer.observe(heading);

});