import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrollSmoother);

const smoother = ScrollSmoother.create({
  smooth: 1,
  effects: true,
  smoothTouch: 0.1,
});

const nav = document.querySelector("nav");

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = e.target.getAttribute("href");
    smoother.scrollTo(target, true, "top top");
  });
});

const rotatingHeaders = document.querySelectorAll(".rotating-header");

const initHeaders = () => {
  rotatingHeaders.forEach((header) => {
    header.querySelector("h2");
    const original = header.querySelector("h2");
    const clone = original.cloneNode(true);
    header.appendChild(clone);

    header.originalSplit = new SplitText(original, {
      type: "chars",
    });
    header.cloneSplit = new SplitText(clone, {
      type: "chars",
    });

    ScrollTrigger.create({
      trigger: header,
      start: "top 80%",
      end: "bottom top",
      // scrub: true,
      toggleActions: "play none none reverse",
      markers: true,
      animation: createHeaderAnimation(header),
      invalidateOnRefresh: true,
    });
  });
};

const createHeaderAnimation = (header) => {
  const tl = gsap.timeline();

  let duration = 1;
  let stagger = { each: 0.05, from: "start", ease: "power2" };

  gsap.set(header.cloneSplit.chars, {
    rotationX: -90,
    opacity: 0,
    transformOrigin: () => {
      const height = header.offsetHeight;
      return `50% 50% -${height / 2}`;
    },
  });

  tl.to(header.originalSplit.chars, {
    duration,
    stagger,
    rotationX: 90,
    transformOrigin: () => {
      const height = header.offsetHeight;
      return `50% 50% -${height / 2}`;
    },
  })
    .to(
      header.originalSplit.chars,
      {
        duration,
        stagger,
        opacity: 0,
        ease: "power2.in",
      },
      0
    )
    .to(
      header.cloneSplit.chars,
      {
        duration: 0.1,
        stagger,
        opacity: 1,
      },
      0
    )
    .to(
      header.cloneSplit.chars,
      {
        duration,
        stagger,
        rotationX: 0,
      },
      0
    );

  return tl;
};

const checkbox = document.querySelector('input[name="color-scheme"]');

const systemDarkModeOn = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;
const localDarkMode = localStorage.getItem("darkMode");

const toggleMode = () => {
  document.body.classList.toggle("night");
  document.body.classList.toggle("day");
};

if (localDarkMode === "true") {
  checkbox.checked = true;
  document.body.classList.add("night");
  document.body.classList.remove("day");
} else if (localDarkMode === "false") {
  document.body.classList.add("day");
  document.body.classList.remove("night");
} else if (systemDarkModeOn) {
  checkbox.checked = true;
  document.body.classList.add("night");
  document.body.classList.remove("day");
}

checkbox.addEventListener("change", (e) => {
  toggleMode();
  localStorage.setItem("darkMode", checkbox.checked ? true : false);
});

// wait for font to load before calling function
document.fonts.ready.then(() => {
  initHeaders();

  createHeaderAnimation();
});
