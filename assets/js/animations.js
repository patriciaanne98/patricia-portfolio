document.addEventListener("DOMContentLoaded", () => {

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    return;
  }

  const elements = document.querySelectorAll(
    ".about, .section-title:not(.swipe-heading), .project, .more-projects, .library-project"
  );

  const observer = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else if (entry.target.classList.contains("swipe-heading")) {
          entry.target.classList.remove("is-visible");
        }

        if (
          entry.isIntersecting &&
          !entry.target.classList.contains("swipe-heading")
        ) {
          observer.unobserve(entry.target);
        }

      });

    },
    {
      threshold: 0.15
    }
  );

  elements.forEach((element) => {
    element.classList.add("reveal-ready");
    observer.observe(element);
  });

});

console.log({
  heading: document.querySelector(".swipe-heading"),
  script: document.querySelector('script[src="animations.js"]'),
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  observerSupported: "IntersectionObserver" in window
});


/* SNEAK PEEK SWIPE ANIMATION */

document.addEventListener("DOMContentLoaded", () => {

  const heading = document.querySelector(".swipe-heading");

  if (!heading) return;

  const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {
        heading.classList.add("swipe-active");
      } else {
        heading.classList.remove("swipe-active");
      }

    });

  }, {
    threshold: 0.1
  });

  observer.observe(heading);

});