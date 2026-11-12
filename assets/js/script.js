
const projects = document.querySelectorAll(".project");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  projects.forEach((project) => observer.observe(project));
} else {
  projects.forEach((project) => {
    project.classList.add("is-visible");
  });
}
