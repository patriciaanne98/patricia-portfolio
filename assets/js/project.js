
/* ==========================================
   PROJECT DOCUMENT LIGHTBOX
========================================== */

function initializeLightbox() {

  const lightbox = document.getElementById("case-lightbox");

  if (!lightbox) return;

  const image = document.getElementById("lightbox-image");
  const counter = document.getElementById("lightbox-counter");
  const closeButton = document.getElementById("lightbox-close");
  const prevButton = document.getElementById("lightbox-prev");
  const nextButton = document.getElementById("lightbox-next");

  const triggers = Array.from(
    document.querySelectorAll(".case-zoom-trigger")
  );

  let currentPage = 0;
  let activeTrigger = null;

  // DISPLAY SELECTED PAGE

  function showPage(index) {

    if (index < 0 || index >= triggers.length) return;

    currentPage = index;

    const selectedImage = triggers[index].querySelector("img");

    image.src = selectedImage.currentSrc || selectedImage.src;
    image.alt = selectedImage.alt;

    counter.textContent =
      `Page ${index + 1} of ${triggers.length}`;

    // Hide Previous on first page
    prevButton.style.visibility =
      index === 0 ? "hidden" : "visible";

    // Hide Next on last page
    nextButton.style.visibility =
      index === triggers.length - 1 ? "hidden" : "visible";

    prevButton.disabled = index === 0;
    nextButton.disabled = index === triggers.length - 1;

    lightbox.querySelector(
      ".case-lightbox-content"
    ).scrollTop = 0;

  }

  // OPEN IMAGE VIEWER

  triggers.forEach((trigger, index) => {

    trigger.addEventListener("click", () => {

      activeTrigger = trigger;

      showPage(index);

      if (!lightbox.open) {
        lightbox.showModal();
      }

      document.body.classList.add("lightbox-open");

      closeButton.focus();

    });

  });

  // CLOSE IMAGE VIEWER

  closeButton.addEventListener("click", () => {
    lightbox.close();
  });

  lightbox.addEventListener("close", () => {

    document.body.classList.remove("lightbox-open");

    activeTrigger?.focus();

  });

  // PREVIOUS PAGE

  prevButton.addEventListener("click", () => {
    showPage(currentPage - 1);
  });

  // NEXT PAGE

  nextButton.addEventListener("click", () => {
    showPage(currentPage + 1);
  });

  // KEYBOARD NAVIGATION

  lightbox.addEventListener("keydown", (event) => {

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPage(currentPage - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showPage(currentPage + 1);
    }

  });

  // CLICK OUTSIDE TO CLOSE

  lightbox.addEventListener("click", (event) => {

    if (event.target === lightbox) {

      const rect = lightbox.getBoundingClientRect();

      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        lightbox.close();
      }

    }

  });

  console.log("Project lightbox initialized successfully");

}

// INITIALIZE LIGHTBOX

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initializeLightbox
  );

} else {

  initializeLightbox();

}
