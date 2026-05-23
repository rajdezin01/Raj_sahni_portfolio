/**
 * Site configuration — update these URLs for your live site.
 */
const SITE_CONFIG = {
  calendlyUrl: "https://calendly.com/dezinwizard/30min",
  contactEmail: "dezinwizard@gmail.com",
  resumeUrl: "https://drive.google.com/file/d/1EB88QmHoSyj3YfRZxboqIpQIyxUXqPPR/view?usp=sharing",
};

const HEADER_OFFSET = 97;

function scrollToTarget(target) {
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;

    link.addEventListener("click", (event) => {
      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      scrollToTarget(target);

    });
  });
}

function openCalendly() {
  if (!SITE_CONFIG.calendlyUrl) return;

  if (window.Calendly) {
    Calendly.initPopupWidget({ url: SITE_CONFIG.calendlyUrl });
    return;
  }

  window.open(SITE_CONFIG.calendlyUrl, "_blank", "noopener,noreferrer");
}

function initCalendly() {
  const widget = document.querySelector(".calendly-inline-widget");
  if (widget) {
    widget.setAttribute("data-url", SITE_CONFIG.calendlyUrl);
  }

  document.querySelectorAll("[data-action='open-calendly']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openCalendly();
    });
  });

  const applyConfig = () => {
    document.querySelectorAll("[data-email-link]").forEach((link) => {
      link.setAttribute("href", `mailto:${SITE_CONFIG.contactEmail}`);
      link.textContent = SITE_CONFIG.contactEmail;
    });
  };

  applyConfig();
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "Portfolio inquiry").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !message) {
      status.textContent = "Please fill in your name, email, and message.";
      status.className = "form-status form-status-error";
      return;
    }

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      message,
    ].join("\n");

    const mailto = new URL(`mailto:${SITE_CONFIG.contactEmail}`);
    mailto.searchParams.set("subject", subject);
    mailto.searchParams.set("body", body);

    window.location.href = mailto.toString();

    status.textContent = "Opening your email app… If nothing opens, email us directly.";
    status.className = "form-status form-status-success";
    form.reset();
  });
}

function initResumeLink() {
  const resumeLink = document.querySelector("[data-resume]");
  if (!resumeLink) return;

  resumeLink.addEventListener("click", (event) => {
    if (!SITE_CONFIG.resumeUrl) {
      event.preventDefault();
      scrollToTarget(document.getElementById("contact"));
      const status = document.getElementById("form-status");
      if (status) {
        status.textContent = "Add your resume PDF URL in script.js (resumeUrl), or send a request below.";
        status.className = "form-status";
      }
      return;
    }

    resumeLink.setAttribute("href", SITE_CONFIG.resumeUrl);
    resumeLink.setAttribute("download", "");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSmoothScroll();
  initCalendly();
  initContactForm();
  initResumeLink();
});
