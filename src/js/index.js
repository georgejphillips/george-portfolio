import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { CustomBounce } from "gsap/CustomBounce";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(
  ScrollTrigger,
  SplitText,
  ScrollSmoother,
  CustomBounce,
  CustomEase
);

// scroll smoother
const smoother = ScrollSmoother.create({
  smooth: 1,
  effects: true,
  smoothTouch: 0.1,
});

CustomBounce.create("myBounce", {
  strength: 0.6,
  squash: 1.5,
  squashID: "myBounce-squash",
});

const mm = window.matchMedia("(max-width: 720px)");

let isMobile = false;

const initNav = () => {
  const header = document.querySelector("header");

  gsap.timeline().from(header, {
    yPercent: -100,
    duration: 1,
    ease: "myBounce",
  });

  // nav
  const nav = document.querySelector("nav");

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = e.target.getAttribute("href");
      nav.classList.remove("active");
      smoother.paused(false);
      smoother.scrollTo(target, true, "top top");
    });
  });

  // menu button
  const menuButton = document.querySelector(".menu-button");

  menuButton.addEventListener("click", () => {
    smoother.paused(true);
    nav.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  const closeButton = document.querySelector(".close-button");

  closeButton.addEventListener("click", () => {
    smoother.paused(false);
    nav.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });
};

// rotating headers
const rotatingHeaders = document.querySelectorAll(".rotating-header");

const bouncingHeaders = document.querySelectorAll(".bouncing-header");

const revealHeaders = document.querySelectorAll(".reveal-header");

const parallaxHeaders = document.querySelectorAll(".parallax-header");

const staggerHeaders = document.querySelectorAll(".stagger-header");

const hero = document.querySelector(".hero");

const initHeaders = () => {
  // rotating headers
  rotatingHeaders.forEach((header) => {
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
      animation: createHeaderAnimation(header),
      toggleActions: "play none none reset",
    });
  });

  // boucing headers
  bouncingHeaders.forEach((header) => {
    header.heading = header.querySelector("h2");

    const splitText = new SplitText(header.heading, {
      type: "chars",
    });

    const tl = gsap
      .timeline({
        defaults: {
          duration: 1.5,
          stagger: {
            amount: 0.1,
            ease: "sine.in",
          },
        },
      })
      .from(
        splitText.chars,
        {
          duration: 0.6,
          opacity: 0,
          ease: "power1.inOut",
        },
        0
      )
      .from(
        splitText.chars,
        {
          y: -350,
          ease: "myBounce",
        },
        0
      )
      .to(
        splitText.chars,
        {
          scaleX: 1.8,
          scaleY: 0.7,
          rotate: (i) => {
            15 - 30 * Math.random();
          },
          ease: "myBounce-squash",
          transformOrigin: "50% 100%",
        },
        0
      );

    ScrollTrigger.create({
      trigger: header,
      toggleActions: "play none none reset",
      animation: tl,
    });
  });

  // reveal headers
  revealHeaders.forEach((header) => {
    header.heading = header.querySelector("h2");

    const split = SplitText.create(header, {
      type: "chars, words",
      mask: "chars",
    });

    const tween = gsap.from(split.chars, {
      duration: 0.6,
      yPercent: "random([-150, 150])",
      xPercent: "random([-150, 150])",
      stagger: {
        from: "random",
        amount: 0.6,
      },
      ease: "power3.out",
    });

    ScrollTrigger.create({
      trigger: header,
      toggleActions: "play none none reset",
      animation: tween,
    });
  });

  staggerHeaders.forEach((header) => {
    header.heading = header.querySelector("h2");

    gsap.set(header.heading, { opacity: 1 });

    const split = SplitText.create(header.heading, {
      type: "chars",
    });

    const tween = gsap.from(split.chars, {
      scale: 0.2,
      opacity: 0,
      stagger: {
        each: 0.2,
        from: "center",
      },
    });

    ScrollTrigger.create({
      trigger: header,
      toggleActions: "play none none reset",
      animation: tween,
    });
  });

  parallaxHeaders.forEach((header) => {
    const parent = header.parentNode;
    header.heading = header.querySelector("h2");

    const splitText = SplitText.create(header.heading, {
      type: "chars",
      charsClass: "string",
    });

    const chars = splitText.chars;
    const tween = gsap.from(chars, {
      duration: 0.6,
      yPercent: -250,
      ease: "none",
      stagger: {
        from: "random",
        amount: 0.6,
        onStart: function () {
          if (this.targets()[0].classList.contains("string--landed")) {
            this.targets()[0].classList.remove("string--landed");
          }
        },
        onComplete: function () {
          this.targets()[0].classList.add("string--landed");
        },
      },
    });

    ScrollTrigger.create({
      trigger: parent,
      start: "top 80%",
      end: "bottom bottom",
      scrub: 1,
      animation: tween,
      onEnterBack: () => {
        splitText.chars.forEach((char) => {
          char.classList.remove("string--landed");
        });
      },
    });
  });
};

const initHero = () => {
  const noMask = hero.querySelector(".no-mask");

  gsap
    .timeline()
    .from(
      noMask,
      {
        autoAlpha: 0,
        duration: 1,
        opacity: 0,
        ease: "none",
      },
      0
    )
    .from(
      noMask,
      {
        duration: 0.3,
        yPercent: 50,
        scale: 0.2,
      },
      0
    );

  const mask = hero.querySelector(".mask");

  const tl = gsap.timeline().to(
    mask,
    {
      duration: 1,
      clipPath: "circle(60%)",
      ease: "none",
    },
    0
  );

  ScrollTrigger.create({
    trigger: hero,
    animation: tl,
    pin: true,
    scrub: true,
    invalidateOnRefresh: true,
  });
};

const initText = () => {
  const text = document.querySelectorAll(".text");

  text.forEach((t) => {
    const p = t.querySelectorAll("p");

    if (p.length) {
      const tween = gsap.from(p, {
        duration: 1,
        opacity: 0,
        yPercent: 100,
        ease: "expo",
        stagger: {
          each: 0.4,
        },
      });

      ScrollTrigger.create({
        trigger: t,
        toggleActions: "play none none reset",
        animation: tween,
      });
    }
  });
};

const initSkills = () => {
  const skills = document.querySelector(".skills");
  const skillsList = document.querySelectorAll(".skills li");

  const tween = gsap.from(skillsList, {
    duration: 1,
    opacity: 0,
    scale: 0.7,
    yPercent: 100,
    ease: "expo",
    stagger: {
      each: 0.1,
    },
  });

  ScrollTrigger.create({
    trigger: skills,
    toggleActions: "play none none reset",
    start: "top 80%",
    animation: tween,
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

const toggleAnimations = (isMobile) => {
  if (isMobile) {
    document.body.classList.add("animate");
  } else {
    document.body.classList.remove("animate");
  }
};

const checkMobile = () => {
  if (mm.matches) {
    isMobile = true;
    toggleAnimations(isMobile);
  } else {
    isMobile = false;
    toggleAnimations(isMobile);
  }
};

const debounce = (func) => {
  let timer;
  return (event) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, 100, event);
  };
};

window.addEventListener(
  "resize",
  debounce((e) => {
    checkMobile();
  })
);

// wait for font to load before calling function
document.fonts.ready.then(() => {
  checkMobile();
  initNav();
  initHero();
  initHeaders();
  initText();
  initSkills();
});
