(() => {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* ---------- STYLES FOR THE ANIMATIONS ---------- */

  const style = document.createElement("style");
  style.textContent = `
    /* BIG IDEAS: lines slide up */
    .anim-line { display: block; overflow: hidden; padding: 0.08em 0 0.12em; margin: -0.08em 0 -0.12em; }
    .anim-line-inner { display: inline-block; translate: 0 110%; }
    .lines-in .anim-line-inner {
      translate: 0 0;
      transition: translate 1s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--i) * 110ms);
    }

    /* SNEAK PEEK: a purple bar swipes right and reveals the text */
    .swipe-reveal span { display: block; width: fit-content; position: relative; color: transparent; }
    .swipe-reveal span::after {
      content: ""; position: absolute; inset: 0;
      background: #37008f; transform: scaleX(0); transform-origin: left;
    }
    .swipe-reveal.swipe-in span { animation: swipe-text 1.2s linear both; }
    .swipe-reveal.swipe-in span::after { animation: swipe-bar 1.2s cubic-bezier(0.77, 0, 0.18, 1) both; }
    .swipe-reveal.swipe-in span:nth-child(2),
    .swipe-reveal.swipe-in span:nth-child(2)::after { animation-delay: 0.2s; }

    @keyframes swipe-bar {
      0%   { transform: scaleX(0); transform-origin: left; }
      50%  { transform: scaleX(1); transform-origin: left; }
      51%  { transform: scaleX(1); transform-origin: right; }
      100% { transform: scaleX(0); transform-origin: right; }
    }
    @keyframes swipe-text {
      0%, 50% { color: transparent; }
      51%, 100% { color: inherit; }
    }

    /* PURPLE LAPTOP PANELS: panel opens from the side, then the laptop rises in */
    .panel-reveal {
      clip-path: inset(0 100% 0 0);
      transition: clip-path 1.1s cubic-bezier(0.77, 0, 0.18, 1);
    }
    .project.reverse .panel-reveal { clip-path: inset(0 0 0 100%); }
    .panel-reveal img {
      opacity: 0; translate: 0 40px;
      transition: opacity 0.9s ease 0.6s, translate 1s cubic-bezier(0.22, 1, 0.36, 1) 0.6s, transform 0.4s ease;
    }
    .panel-reveal.panel-in,
    .project.reverse .panel-reveal.panel-in { clip-path: inset(0 0 0 0); }
    .panel-reveal.panel-in img { opacity: 1; translate: 0 0; }

    @media (max-width: 700px) {
      .project.reverse .panel-reveal { clip-path: inset(0 100% 0 0); }
    }
  `;
  document.head.appendChild(style);

  /* ---------- SET UP WHAT ANIMATES ---------- */

  // BIG IDEAS heading
  document.querySelectorAll(".about h2").forEach((heading) => {
    const lines = heading.innerHTML
      .split(/<br\s*\/?>/i)
      .map((line) => line.trim())
      .filter(Boolean);

    heading.innerHTML = lines
      .map((line, i) =>
        `<span class="anim-line"><span class="anim-line-inner" style="--i:${i}">${line}</span></span>`
      )
      .join("");

    heading.dataset.reveal = "lines-in";
  });

  // SNEAK PEEK heading (replaces the old swipe in animations.js)
  document.querySelectorAll(".swipe-heading").forEach((heading) => {
    heading.classList.remove("swipe-heading");
    heading.classList.add("swipe-reveal");
    heading.dataset.reveal = "swipe-in";
  });

  // Purple laptop panels
  document.querySelectorAll(".project").forEach((project) => {
    const panel = project.querySelector(".project-image");
    if (!panel) return;
    panel.classList.add("panel-reveal");
    project.dataset.reveal = "panel-in";
  });

  /* ---------- PLAY WHEN SCROLLED INTO VIEW ---------- */

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = el.querySelector(".panel-reveal") || el;
      target.classList.add(el.dataset.reveal);
      observer.unobserve(el);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
})();