const root = document.documentElement;
const themeToggle = document.querySelector("#theme-toggle");
const profileOrb = document.querySelector("#profile-orb");
const contributionGrid = document.querySelector("#contribution-grid");
const storageKey = "bsis-portfolio-theme";

function readTheme() {
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function setTheme(theme, persist = false) {
  root.dataset.theme = theme;
  const nextTheme = theme === "dark" ? "light" : "dark";
  themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
  themeToggle.setAttribute("title", `Switch to ${nextTheme} mode`);

  if (persist) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // The theme still works for this visit when storage is unavailable.
    }
  }
}

const savedTheme = readTheme();
setTheme(savedTheme || "dark");

themeToggle.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
});

profileOrb.addEventListener("click", () => {
  const isAnimated = profileOrb.classList.toggle("is-animated");
  profileOrb.setAttribute("aria-pressed", String(isAnimated));
});

profileOrb.addEventListener("pointerleave", () => {
  profileOrb.classList.remove("is-animated");
  profileOrb.setAttribute("aria-pressed", "false");
});

if (contributionGrid) {
  const contributionCells = document.createDocumentFragment();
  for (let weekIndex = 0; weekIndex < 52; weekIndex += 1) {
    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const cell = document.createElement("span");
      cell.className = "contribution-cell";
      const wave = (Math.sin(weekIndex * 0.45 + dayIndex * 0.88) + Math.cos(weekIndex * 0.13 - dayIndex * 0.41) + 2) / 4;
      const texture = ((weekIndex * 7 + dayIndex * 11 + weekIndex * dayIndex * 3) % 13) / 26;
      const activity = wave * 0.78 + texture;
      const level = activity > 0.88 ? 4 : activity > 0.72 ? 3 : activity > 0.54 ? 2 : activity > 0.36 ? 1 : 0;
      cell.dataset.level = String(level);
      contributionCells.append(cell);
    }
  }
  contributionGrid.append(contributionCells);
}

const revealTargets = document.querySelectorAll(".content-section, .contact-section");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });

  revealTargets.forEach((target) => {
    target.classList.add("reveal");
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}