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

const API_BASE = "http://localhost:3000";
const careGrid = document.querySelector("#care-grid");
const careStatus = document.querySelector("#care-status");
const serviceScroller = document.querySelector(".service-scroller");
const serviceStatus = document.querySelector("#service-status");

// Dog cards jump to the breed guide, every other species goes to services.
function guideLink(name) {
  return name.toLowerCase() === "dog" ? "#breeds" : "#services";
}

function guideCard(guide) {
  const name = guide.name.toLowerCase();
  const card = document.createElement("a");
  card.href = `guide.html?id=${encodeURIComponent(guide.id)}`;

  const photo = document.createElement("div");
  photo.className = `care-photo ${name}`;
  photo.textContent = `${guide.name} image placeholder`;

  if (guide.image_path) {
    const image = document.createElement("img");
    image.src = guide.image_path;
    image.alt = guide.name;
    image.loading = "lazy";
    // fall back to the coloured placeholder if the photo is missing
    image.addEventListener("error", () => {
      image.remove();
      photo.classList.remove("has-photo");
    });
    photo.classList.add("has-photo");
    photo.append(image);
  }

  const title = document.createElement("h3");
  title.textContent = `${guide.name} `;
  const arrow = document.createElement("b");
  arrow.textContent = "↗";
  title.append(arrow);

  card.append(photo, title);
  return card;
}

async function loadGuides() {
  try {
    const response = await fetch(`${API_BASE}/api/species`);
    if (!response.ok) throw new Error(`Request failed (${response.status})`);

    const guides = await response.json();
    console.log("Loaded guides:", guides);
    careGrid.replaceChildren(...guides.map(guideCard));
    careStatus.textContent = guides.length ? "" : "No care guides yet.";
    careStatus.hidden = guides.length > 0;
  } catch (error) {
    console.error(error);
    careStatus.textContent = "We could not load the care guides right now.";
  }
}

function serviceCard(service, index) {
  const card = document.createElement("article");
  if (service.service_type.toLowerCase().includes("emergency")) {
    card.classList.add("featured", "emergency-service");
  }

  const number = document.createElement("span");
  number.textContent = String(index + 1).padStart(2, "0");

  const icon = document.createElement("strong");
  icon.textContent = service.service_type.toLowerCase().includes("nutrition")
    ? "⌁"
    : service.service_type.toLowerCase().includes("emergency")
      ? "✚"
      : "♡";

  const type = document.createElement("small");
  type.className = "service-type";
  type.textContent = service.service_type;

  const name = document.createElement("h3");
  name.textContent = service.name;

  const description = document.createElement("p");
  description.textContent = service.description;

  const phone = document.createElement("a");
  phone.href = `tel:${service.phone.replace(/[^+\d]/g, "")}`;
  phone.textContent = service.phone;
  phone.setAttribute("aria-label", `Call ${service.name}`);

  card.append(number, icon, type, name, description, phone);
  return card;
}

async function loadServices() {
  try {
    const response = await fetch(`${API_BASE}/api/services`);
    if (!response.ok) throw new Error(`Request failed (${response.status})`);

    const servicesList = await response.json();
    serviceScroller.replaceChildren(
      ...(servicesList.length
        ? servicesList.map(serviceCard)
        : [
            Object.assign(document.createElement("p"), {
              className: "service-status",
              textContent: "No care services available yet.",
            }),
          ]),
    );
  } catch (error) {
    console.error(error);
    serviceStatus.textContent = "We could not load care services right now.";
  }
}

loadGuides();
loadServices();
