document.addEventListener("DOMContentLoaded", () => {

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    return;
  }

  const elements = document.querySelectorAll(
    ".about, .section-title, .project, .more-projects, .library-project"
  );

  const observer = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }

      });

    },
    {
      threshold: 0.08
    }
  );

  elements.forEach((element) => {
    element.classList.add("reveal-ready");
    observer.observe(element);
  });

});