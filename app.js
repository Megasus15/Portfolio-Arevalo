// DOM Elements
const themeToggle = document.getElementById("theme-toggle");
const navHamburger = document.getElementById("nav-hamburger");
const sidebar = document.getElementById("sidebar");
const sidebarClose = document.getElementById("sidebar-close");
const typingText = document.getElementById("typing-text");
const carouselWrapper = document.getElementById("carousel-wrapper");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const indicators = document.querySelectorAll(".indicator");
const navLinks = document.querySelectorAll(".nav-link");
const sidebarLinks = document.querySelectorAll(".sidebar-link");

// Theme Management
let currentTheme = "light";

function loadTheme() {
  const savedTheme = currentTheme;
  if (savedTheme) {
    currentTheme = savedTheme;
    document.documentElement.setAttribute("data-theme", currentTheme);
    updateThemeIcon();
  }
}

function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = themeToggle.querySelector("i");
  icon.className = currentTheme === "dark" ? "fas fa-moon" : "fas fa-sun";
}

// **MODIFIED** Typing Animation Class to handle multiple texts
class TypingAnimation {
  constructor(element, texts, speed = 150) {
    this.element = element;
    this.texts = texts;
    this.speed = speed;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.start();
  }

  start() {
    this.type();
  }

  type() {
    const currentText = this.texts[this.textIndex];
    const currentSubstr = currentText.substring(0, this.charIndex);
    this.element.textContent = currentSubstr;

    let typeSpeed = this.isDeleting ? this.speed / 2 : this.speed;

    if (!this.isDeleting && this.charIndex === currentText.length) {
      typeSpeed = 2000;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      typeSpeed = 500;
    }

    this.charIndex += this.isDeleting ? -1 : 1;
    setTimeout(() => this.type(), typeSpeed);
  }
}

// Skills Carousel
class SkillsCarousel {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 4;
    this.init();
  }

  init() {
    this.updateSlide();
    this.updateIndicators();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateSlide();
    this.updateIndicators();
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateSlide();
    this.updateIndicators();
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.updateSlide();
    this.updateIndicators();
  }

  updateSlide() {
    const translateX = -this.currentSlide * 100;
    carouselWrapper.style.transform = `translateX(${translateX}%)`;
  }

  updateIndicators() {
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentSlide);
    });
  }
}

function smoothScroll(target) {
  const element = document.querySelector(target);
  if (element) {
    const offsetTop = element.offsetTop - 70;
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }
}

function toggleSidebar() {
  sidebar.classList.toggle("active");
}

function handleNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.backgroundColor =
      currentTheme === "dark"
        ? "rgba(26, 15, 10, 0.95)"
        : "rgba(255, 255, 255, 0.95)";
  } else {
    navbar.style.backgroundColor =
      currentTheme === "dark" ? "var(--bg-color)" : "var(--bg-color)";
  }
}

function animateOnScroll() {
  const elements = document.querySelectorAll(
    ".project-card, .service-card, .skill-category"
  );
  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    if (elementTop < window.innerHeight - elementVisible) {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }
  });
}

function initAnimations() {
  const animatedElements = document.querySelectorAll(
    ".project-card, .service-card"
  );
  animatedElements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "all 0.6s ease";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  loadTheme();

  // **MODIFIED** Initialize typing animation with new texts and slower speed
  if (typingText) {
    const textsToType = ["Web Developer", "BS in Information Systems"];
    new TypingAnimation(typingText, textsToType, 125);
  }

  const carousel = new SkillsCarousel();

  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
  if (navHamburger) navHamburger.addEventListener("click", toggleSidebar);
  if (sidebarClose) sidebarClose.addEventListener("click", toggleSidebar);
  if (prevBtn) prevBtn.addEventListener("click", () => carousel.prevSlide());
  if (nextBtn) nextBtn.addEventListener("click", () => carousel.nextSlide());

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => carousel.goToSlide(index));
  });

  const allLinks = [...navLinks, ...sidebarLinks];
  allLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = this.getAttribute("href");
      smoothScroll(target);
      if (sidebar.classList.contains("active")) {
        toggleSidebar();
      }
    });
  });

  window.addEventListener("scroll", handleNavbarScroll);
  window.addEventListener("scroll", animateOnScroll);

  initAnimations();

  document.addEventListener("click", function (e) {
    if (
      sidebar.classList.contains("active") &&
      !sidebar.contains(e.target) &&
      !navHamburger.contains(e.target)
    ) {
      toggleSidebar();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768 && sidebar.classList.contains("active")) {
      toggleSidebar();
    }
  });
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        document
          .querySelectorAll(".nav-link, .sidebar-link")
          .forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${id}`) {
              link.classList.add("active");
            }
          });
      }
    });
  },
  { rootMargin: "-40% 0px -60% 0px" }
);

document.querySelectorAll("section[id]").forEach((section) => {
  sectionObserver.observe(section);
});
