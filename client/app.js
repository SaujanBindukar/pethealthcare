const services = document.querySelector(".service-scroller");
const header = document.querySelector(".site-header");

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

document
  .querySelector(".prev")
  .addEventListener("click", () =>
    services.scrollBy({ left: -290, behavior: "smooth" }),
  );
document
  .querySelector(".next")
  .addEventListener("click", () =>
    services.scrollBy({ left: 290, behavior: "smooth" }),
  );
