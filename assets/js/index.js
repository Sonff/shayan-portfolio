const emailJsConfig = {
  publicKey: "-GbqVuMJ4x5jl6QGe",
  serviceId: "service_4tdx2um",
  templateId: "template_yp3l3cb",
};

function scrollToOptions(id) {
  const section = document.getElementById(id);

  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.getElementById("siteHeader");
  const themeToggle = document.getElementById("themeToggle");
  const navLinks = document.querySelectorAll(".navbar .nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  const projectItems = document.querySelectorAll(".project-item");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const skillMeters = document.querySelectorAll(".skill-meter");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const submitButton = document.getElementById("contactSubmit");

  initTheme(body, themeToggle);
  initTypingAnimation();
  initAos();
  initNavbar(header, navLinks, sections);
  initScrollTop(scrollTopBtn);
  initProjectFilters(filterButtons, projectItems);
  initSkillMeters(skillMeters);
  initContactForm(contactForm, formStatus, submitButton);
  initBootstrapHelpers();
});

window.addEventListener("load", () => {
  const loader = document.getElementById("pageLoader");

  if (loader) {
    loader.classList.add("is-hidden");
    setTimeout(() => loader.remove(), 450);
  }
});

function initTheme(body, themeToggle) {
  const storedTheme = localStorage.getItem("portfolio-theme") || "dark";
  const icon = themeToggle?.querySelector("i");

  body.classList.toggle("light-mode", storedTheme === "light");
  updateThemeIcon(icon, storedTheme);

  themeToggle?.addEventListener("click", () => {
    const isLight = body.classList.toggle("light-mode");
    const nextTheme = isLight ? "light" : "dark";

    localStorage.setItem("portfolio-theme", nextTheme);
    updateThemeIcon(icon, nextTheme);
  });
}

function updateThemeIcon(icon, theme) {
  if (!icon) return;

  icon.className = theme === "light" ? "bi bi-sun" : "bi bi-moon-stars";
}

function initTypingAnimation() {
  const target = document.getElementById("typedRole");
  const roles = ["Web Developer", "WordPress Expert", "E-commerce Website Manager", "Frontend Developer"];

  if (!target) return;

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const type = () => {
    const role = roles[roleIndex];
    const nextText = isDeleting ? role.slice(0, charIndex - 1) : role.slice(0, charIndex + 1);

    target.textContent = nextText;
    charIndex = nextText.length;

    if (!isDeleting && charIndex === role.length) {
      isDeleting = true;
      setTimeout(type, 1300);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }

    setTimeout(type, isDeleting ? 45 : 85);
  };

  type();
}

function initAos() {
  if (!window.AOS) return;

  window.AOS.init({
    duration: 850,
    easing: "ease-out-cubic",
    once: true,
    offset: 80,
  });
}

function initNavbar(header, navLinks, sections) {
  const setHeaderState = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  const setActiveLink = () => {
    let current = "home";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;

      if (window.scrollY >= sectionTop) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const navCollapse = document.getElementById("mainNavbar");

      if (navCollapse?.classList.contains("show") && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }
    });
  });

  setHeaderState();
  setActiveLink();
  window.addEventListener("scroll", () => {
    setHeaderState();
    setActiveLink();
  }, { passive: true });
}

function initScrollTop(scrollTopBtn) {
  if (!scrollTopBtn) return;

  const toggleButton = () => {
    scrollTopBtn.classList.toggle("is-visible", window.scrollY > 500);
  };

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  toggleButton();
  window.addEventListener("scroll", toggleButton, { passive: true });
}

function initProjectFilters(filterButtons, projectItems) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      projectItems.forEach((item) => {
        const shouldShow = filter === "all" || item.dataset.category === filter;

        item.classList.toggle("d-none", !shouldShow);
      });

      if (window.AOS) {
        window.AOS.refresh();
      }
    });
  });
}

function initSkillMeters(skillMeters) {
  if (!skillMeters.length) return;

  const animateMeter = (meter) => {
    const bar = meter.querySelector(".progress-bar");
    const percent = meter.dataset.percent || "0";

    if (bar) {
      bar.style.width = `${percent}%`;
    }
  };

  if (!("IntersectionObserver" in window)) {
    skillMeters.forEach(animateMeter);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      animateMeter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  skillMeters.forEach((meter) => observer.observe(meter));
}

function initContactForm(contactForm, formStatus, submitButton) {
  if (!contactForm || !formStatus) return;

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    contactForm.classList.add("was-validated");

    if (!contactForm.checkValidity()) {
      setFormStatus(formStatus, "Please complete all required fields correctly.", "error");
      return;
    }

    const formData = Object.fromEntries(new FormData(contactForm));
    const originalButtonText = submitButton?.innerHTML;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = 'Sending... <i class="bi bi-hourglass-split"></i>';
    }

    try {
      if (canUseEmailJs()) {
        window.emailjs.init({ publicKey: emailJsConfig.publicKey });
        await window.emailjs.send(emailJsConfig.serviceId, emailJsConfig.templateId, formData);
        setFormStatus(formStatus, "Message sent successfully. I will reply soon.", "success");
      } else {
        openMailClient(formData);
        setFormStatus(formStatus, "Your email app has been opened with the message ready to send.", "success");
      }

      contactForm.reset();
      contactForm.classList.remove("was-validated");
    } catch (error) {
      setFormStatus(formStatus, "Something went wrong. Please email me directly at sroy52649@gmail.com.", "error");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    }
  });
}

function canUseEmailJs() {
  return Boolean(
    window.emailjs &&
    emailJsConfig.publicKey &&
    emailJsConfig.serviceId &&
    emailJsConfig.templateId
  );
}

function openMailClient(formData) {
  const subject = encodeURIComponent(formData.subject || "Portfolio enquiry");
  const body = encodeURIComponent(
    `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\n${formData.message}`
  );

  window.location.href = `mailto:sroy52649@gmail.com?subject=${subject}&body=${body}`;
}

function setFormStatus(formStatus, message, type) {
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
}

function initBootstrapHelpers() {
  if (!window.bootstrap) return;

  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
    window.bootstrap.Tooltip.getOrCreateInstance(element);
  });
}
