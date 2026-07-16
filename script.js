const cities = [
  ["Vancouver", "Canada", "BC Place"],
  ["Toronto", "Canada", "BMO Field"],
  ["Guadalajara", "Mexico", "Estadio Akron"],
  ["Mexico City", "Mexico", "Estadio Azteca"],
  ["Monterrey", "Mexico", "Estadio BBVA"],
  ["Atlanta", "United States", "Mercedes-Benz Stadium"],
  ["Boston", "United States", "Gillette Stadium"],
  ["Dallas", "United States", "AT&T Stadium"],
  ["Houston", "United States", "NRG Stadium"],
  ["Kansas City", "United States", "Arrowhead Stadium"],
  ["Los Angeles", "United States", "SoFi Stadium"],
  ["Miami", "United States", "Hard Rock Stadium"],
  ["New York/New Jersey", "United States", "MetLife Stadium"],
  ["Philadelphia", "United States", "Lincoln Financial Field"],
  ["San Francisco Bay Area", "United States", "Levi's Stadium"],
  ["Seattle", "United States", "Lumen Field"]
];

const grid = document.querySelector("#city-grid");
const buttons = document.querySelectorAll(".filter-button");
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav a");
const articleSearch = document.querySelector("#article-search");
const articleCards = document.querySelectorAll(".article-card");
const articleFilters = document.querySelectorAll(".content-filter");
const articleCount = document.querySelector("#article-count");
const guideSearch = document.querySelector("#guide-search");
const guideCards = document.querySelectorAll(".guide-card");
const guideCount = document.querySelector("#guide-count");
const backToTop = document.querySelector(".back-to-top");

let activeArticleCategory = "all";

function renderCities(filter = "all") {
  if (!grid) {
    return;
  }

  grid.innerHTML = "";

  cities
    .filter(([, country]) => filter === "all" || country === filter)
    .forEach(([name, country, stadium]) => {
      const card = document.createElement("article");
      card.className = "city-card";
      card.dataset.country = country;
      card.innerHTML = `
        <strong>${country}</strong>
        <h3>${name}</h3>
        <p>${stadium}</p>
      `;
      grid.appendChild(card);
    });
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("is-active");
    button.setAttribute("aria-pressed", "true");
    renderCities(button.dataset.filter);
  });

  button.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      button.click();
    }
  });
});

function normalize(value) {
  return String(value).toLowerCase().trim();
}

function cardMatchesSearch(card, query) {
  if (!query) {
    return true;
  }

  const text = `${card.textContent} ${card.dataset.keywords || ""} ${card.dataset.guideKeywords || ""}`;
  return normalize(text).includes(query);
}

function updateArticleCards() {
  const query = normalize(articleSearch?.value || "");
  let visible = 0;

  articleCards.forEach((card) => {
    const categoryMatch = activeArticleCategory === "all" || card.dataset.category === activeArticleCategory;
    const searchMatch = cardMatchesSearch(card, query);
    const isVisible = categoryMatch && searchMatch;
    card.classList.toggle("is-hidden", !isVisible);
    if (isVisible) {
      visible += 1;
    }
  });

  if (articleCount) {
    articleCount.textContent = `${visible}件のガイドを表示`;
  }
}

function updateGuideCards() {
  const query = normalize(guideSearch?.value || "");
  let visible = 0;

  guideCards.forEach((card) => {
    const isVisible = cardMatchesSearch(card, query);
    card.classList.toggle("is-hidden", !isVisible);
    if (isVisible) {
      visible += 1;
    }
  });

  if (guideCount) {
    guideCount.textContent = `${visible}件の初心者向けガイドを表示`;
  }
}

articleFilters.forEach((button) => {
  button.addEventListener("click", () => {
    articleFilters.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    activeArticleCategory = button.dataset.category;
    updateArticleCards();
  });
});

articleSearch?.addEventListener("input", updateArticleCards);
guideSearch?.addEventListener("input", updateGuideCards);

menuToggle?.addEventListener("click", () => {
  if (!header) {
    return;
  }

  const isOpen = header.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "ナビゲーションメニューを閉じる" : "ナビゲーションメニューを開く");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header?.classList.remove("nav-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "ナビゲーションメニューを開く");
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") {
      return;
    }

    const target = document.querySelector(href);
    if (!target) {
      return;
    }
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function updateBackToTop() {
  backToTop?.classList.toggle("is-visible", window.scrollY > 520);
}

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", updateBackToTop, { passive: true });

const revealTargets = document.querySelectorAll(
  ".topic-card, .article-card, .guide-card, .city-card, .info-card"
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((target) => {
    target.classList.add("reveal-on-scroll");
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

renderCities();
window.VekpalCountdown?.renderCountdown(document, new Date());
updateArticleCards();
updateGuideCards();
updateBackToTop();
