const token = localStorage.getItem("petHealthToken");
const storedUser = localStorage.getItem("petHealthUser");
const navLinks = document.querySelectorAll("[data-section]");
const contentSections = document.querySelectorAll("[data-content]");

if (!token || !storedUser) {
  window.location.replace("account.html");
} else {
  const user = JSON.parse(storedUser);
  document.querySelector("#profile-name").textContent = user.name;
  document.querySelector("#profile-email").textContent = user.email;
}

function showSection(sectionName) {
  navLinks.forEach((link) => {
    const isActive = link.dataset.section === sectionName;
    link.classList.toggle("active", isActive);
    link.setAttribute("aria-current", isActive ? "page" : "false");
  });
  contentSections.forEach((section) => {
    section.hidden = section.dataset.content !== sectionName;
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const sectionName = link.dataset.section;
    window.location.hash = sectionName;
    showSection(sectionName);
  });
});

showSection(window.location.hash.slice(1) || "dashboard");

document.querySelector("#logout").addEventListener("click", () => {
  localStorage.removeItem("petHealthToken");
  localStorage.removeItem("petHealthUser");
  window.location.replace("account.html");
});
