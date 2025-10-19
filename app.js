// --- 1. DOM Element Selection ---
// Get all necessary elements from the HTML
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

// Elements for new features
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
const heroSection = document.getElementById("hero");
const navbar = document.getElementById("navbar");

// Custom cursor element
const enchantedCursor = document.getElementById("enchanted-cursor");

// --- 2. Theme Management ---
let currentTheme = "light"; // Global variable to track the current theme

/**
 * Loads the saved theme from local storage or defaults to 'light'.
 * Applies the theme to the document.
 */
function loadTheme() {
  // Note: Simplified to always start with 'light' as per original code logic
  const savedTheme = currentTheme;
  if (savedTheme) {
    currentTheme = savedTheme;
    document.documentElement.setAttribute("data-theme", currentTheme);
    updateThemeIcon();
  }
}

/**
 * Toggles the theme between 'light' and 'dark'.
 * Saves the new theme to local storage and updates the DOM.
 */
function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", currentTheme);
  // localStorage.setItem("theme", currentTheme); // (This line was missing but is good practice)
  updateThemeIcon();
}

/**
 * Changes the theme toggle button's icon to a sun or moon.
 */
function updateThemeIcon() {
  const icon = themeToggle.querySelector("i");
  icon.className = currentTheme === "dark" ? "fas fa-moon" : "fas fa-sun";
}

// --- 3. Typing Animation Class ---
/**
 * Handles the "typing and deleting" effect for a list of texts.
 */
class TypingAnimation {
  constructor(element, texts, speed = 150) {
    this.element = element;
    this.texts = texts;
    this.speed = speed;
    this.textIndex = 0; // Current text in the array
    this.charIndex = 0; // Current character in the text
    this.isDeleting = false; // Toggles between typing and deleting
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
      // Word is fully typed
      typeSpeed = 2000; // Pause at the end of a word
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      // Word is fully deleted
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length; // Move to the next text
      typeSpeed = 500; // Pause before starting the new word
    }

    // Move to the next/previous character
    this.charIndex += this.isDeleting ? -1 : 1;
    // Call the type function again after the calculated delay
    setTimeout(() => this.type(), typeSpeed);
  }
}

// --- 4. Skills Carousel Class ---
/**
 * Manages the logic for the skills carousel, including auto-sliding,
 * manual controls, and indicators.
 */
class SkillsCarousel {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 4;
    this.autoSlideInterval = null; // Stores the interval ID
    this.slideIntervalTime = 4000; // 4 seconds
    this.init();
  }

  // Initializes the carousel state and starts auto-slide
  init() {
    this.updateSlide();
    this.updateIndicators();
    this.startAutoSlide();
  }

  // Starts the automatic slide interval
  startAutoSlide() {
    clearInterval(this.autoSlideInterval); // Clear existing interval
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide(false); // 'false' means it was not user-initiated
    }, this.slideIntervalTime);
  }

  // Stops the automatic slide interval (e.g., on hover)
  stopAutoSlide() {
    clearInterval(this.autoSlideInterval);
  }

  // Resets the auto-slide timer (used after user clicks)
  resetAutoSlide() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  // Moves to the next slide
  nextSlide(userInitiated = true) {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateSlide();
    this.updateIndicators();
    if (userInitiated) this.resetAutoSlide(); // Reset timer if user clicked
  }

  // Moves to the previous slide
  prevSlide(userInitiated = true) {
    this.currentSlide =
      (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateSlide();
    this.updateIndicators();
    if (userInitiated) this.resetAutoSlide();
  }

  // Jumps to a specific slide by index
  goToSlide(index, userInitiated = true) {
    this.currentSlide = index;
    this.updateSlide();
    this.updateIndicators();
    if (userInitiated) this.resetAutoSlide();
  }

  // Applies the CSS transform to move the carousel wrapper
  updateSlide() {
    const translateX = -this.currentSlide * 100;
    if (carouselWrapper) {
      carouselWrapper.style.transform = `translateX(${translateX}%)`;
    }
  }

  // Updates the active state of the carousel dots
  updateIndicators() {
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentSlide);
    });
  }
}

// --- 5. Utility Functions ---

/**
 * Scrolls smoothly to a target element (e.g., "#about").
 * Accounts for the 70px height of the fixed navbar.
 */
function smoothScroll(target) {
  const element = document.querySelector(target);
  if (element) {
    const offsetTop = element.offsetTop - 70; // 70px navbar height
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }
}

/**
 * Toggles the 'active' class on the mobile sidebar to show/hide it.
 */
function toggleSidebar() {
  sidebar.classList.toggle("active");
}

/**
 * Adds a blurred background to the navbar when the user scrolls down.
 */
function handleNavbarScroll() {
  if (window.scrollY > 50) {
    // Apply blur effect based on theme
    navbar.style.backgroundColor =
      currentTheme === "dark"
        ? "rgba(26, 15, 10, 0.95)" // Dark, semi-transparent
        : "rgba(255, 255, 255, 0.95)"; // Light, semi-transparent
  } else {
    // Revert to solid color
    navbar.style.backgroundColor =
      currentTheme === "dark" ? "var(--bg-color)" : "var(--bg-color)";
  }
}

/**
 * Shows or hides the 'scroll to top' button.
 * It becomes visible only after scrolling past the hero section.
 */
function handleScrollToTop() {
  if (!heroSection || !scrollToTopBtn || !navbar) return;

  const navHeight = navbar.offsetHeight || 70;
  const heroBottomViewport = heroSection.getBoundingClientRect().bottom;

  // If the bottom of the hero section is above the bottom of the navbar
  if (heroBottomViewport < navHeight) {
    scrollToTopBtn.classList.add("visible");
  } else {
    scrollToTopBtn.classList.remove("visible");
  }
}

/**
 * Fades in elements (like project cards) as they scroll into view.
 */
function animateOnScroll() {
  const elements = document.querySelectorAll(
    ".project-card, .service-card, .skill-category"
  );
  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150; // Pixel offset
    if (elementTop < window.innerHeight - elementVisible) {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }
  });
}

/**
 * Sets the initial 'hidden' state for scroll-animated elements.
 */
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

// --- 6. Main Initialization (DOMContentLoaded) ---
/**
 * Waits for the page to load, then initializes all functions
 * and adds all event listeners.
 */
document.addEventListener("DOMContentLoaded", function () {
  loadTheme();

  // Initialize the hero text typing animation
  if (typingText) {
    const textsToType = [
      "Web Developer",
      "BS in Information Systems",
      "20 Years Old",
    ];
    new TypingAnimation(typingText, textsToType, 150);
  }

  // Create a new carousel instance
  const carousel = new SkillsCarousel();
  const skillsCarouselElement = document.querySelector(".skills-carousel");

  // --- Event Listeners ---

  // Theme toggle button
  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
  // Hamburger menu button
  if (navHamburger) navHamburger.addEventListener("click", toggleSidebar);
  // Sidebar close button
  if (sidebarClose) sidebarClose.addEventListener("click", toggleSidebar);

  // Carousel navigation (prev/next)
  if (prevBtn) prevBtn.addEventListener("click", () => carousel.prevSlide());
  if (nextBtn) nextBtn.addEventListener("click", () => carousel.nextSlide());

  // Carousel indicator dots
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => carousel.goToSlide(index));
  });

  // Pause/resume auto-slide on carousel hover
  if (skillsCarouselElement) {
    skillsCarouselElement.addEventListener("mouseenter", () => {
      carousel.stopAutoSlide();
    });
    skillsCarouselElement.addEventListener("mouseleave", () => {
      carousel.startAutoSlide();
    });
  }

  // Smooth scroll for all nav and sidebar links
  const allLinks = [...navLinks, ...sidebarLinks];
  allLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = this.getAttribute("href");
      smoothScroll(target);
      // Close sidebar if a link is clicked
      if (sidebar.classList.contains("active")) {
        toggleSidebar();
      }
    });
  });

  // 'Scroll to top' button click
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // Scroll to the very top of the page (0)
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Main window scroll listeners
  window.addEventListener("scroll", handleScrollToTop);
  window.addEventListener("scroll", handleNavbarScroll);
  window.addEventListener("scroll", animateOnScroll);

  // Set up initial animation states
  initAnimations();

  // === NEW: ENCHANTED CURSOR LOGIC ===
  if (enchantedCursor) {
    let mouseX = -100; // Start off-screen
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    const speed = 1; // Controls the "lag" (1 = instant, 0.1 = slow)

    // Update target mouse position
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Animation loop to smoothly follow the cursor (lerping)
    const animateCursor = () => {
      // Calculate distance to target
      let dx = mouseX - cursorX;
      let dy = mouseY - cursorY;

      // Move a fraction of the distance (this creates the smooth lag)
      cursorX += dx * speed;
      cursorY += dy * speed;

      // Apply the transform to the cursor element
      enchantedCursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

      requestAnimationFrame(animateCursor); // Run this function on the next frame
    };
    requestAnimationFrame(animateCursor); // Start the loop

    // Hide cursor when leaving the window
    document.addEventListener("mouseleave", () => {
      enchantedCursor.style.opacity = "0";
    });

    // Show cursor when re-entering the window
    document.addEventListener("mouseenter", () => {
      enchantedCursor.style.opacity = "1";
    });
  }
  // === END NEW CURSOR LOGIC ===

  // Close sidebar when clicking outside of it
  document.addEventListener("click", function (e) {
    if (
      sidebar.classList.contains("active") &&
      !sidebar.contains(e.target) && // Click was not in the sidebar
      !navHamburger.contains(e.target) // Click was not on the hamburger icon
    ) {
      toggleSidebar();
    }
  });

  // Close sidebar on window resize if screen becomes large
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768 && sidebar.classList.contains("active")) {
      toggleSidebar();
    }
  });
});

// --- 7. Active Nav Link on Scroll (IntersectionObserver) ---
/**
 * Observes which section is currently in the middle of the viewport
 * and adds the 'active' class to the corresponding nav link.
 */
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        // Remove 'active' from all links
        document
          .querySelectorAll(".nav-link, .sidebar-link")
          .forEach((link) => {
            link.classList.remove("active");
            // Add 'active' to the matching link
            if (link.getAttribute("href") === `#${id}`) {
              link.classList.add("active");
            }
          });
      }
    });
  },
  { rootMargin: "-40% 0px -60% 0px" } // Triggers when section is in the middle 40-60% of viewport
);

// Apply the observer to all sections that have an ID
document.querySelectorAll("section[id]").forEach((section) => {
  sectionObserver.observe(section);
});
