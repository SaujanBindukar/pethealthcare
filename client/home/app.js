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

const API_BASE = "https://pethealthcare-mrc6.onrender.com";
const careGrid = document.querySelector("#care-grid");
const careStatus = document.querySelector("#care-status");
const serviceScroller = document.querySelector(".service-scroller");
const serviceStatus = document.querySelector("#service-status");
const breedList = document.querySelector("#breed-list");
const breedStatus = document.querySelector("#breed-status");

// Dog cards jump to the breed guide, every other species goes to services.
function guideLink(name) {
  return name.toLowerCase() === "dog" ? "#breeds" : "#services";
}

function guideCard(guide) {
  const name = guide.name.toLowerCase();
  const card = document.createElement("a");
  card.href = `../guides/guide.html?id=${encodeURIComponent(guide.id)}`;

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

// Convert each provider response into one service card.
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
              role: "status",
              ariaLive: "polite",
              textContent: "No care services available yet.",
            }),
          ]),
    );
  } catch (error) {
    console.error(error);
    serviceStatus.textContent = "We could not load care services right now.";
  }
}

function breedCard(breed, index) {
  const card = document.createElement("a");
  card.href = `../guides/guide.html?breed=${encodeURIComponent(breed.slug)}`;
  card.className = "breed-card";

  const photo = document.createElement("div");
  photo.className = "breed-photo";
  // Breed images come from the API; the placeholder handles missing URLs.
  photo.textContent = `${breed.name} image placeholder`;

  const imagePath = breed.image_url;
  if (imagePath) {
    const image = document.createElement("img");
    image.src = imagePath;
    image.alt = breed.name;
    image.loading = "lazy";
    image.addEventListener("error", () => {
      image.remove();
      photo.classList.remove("has-photo");
    });
    photo.classList.add("has-photo");
    photo.append(image);
  }

  const name = document.createElement("h3");
  name.textContent = breed.name;
  const arrow = document.createElement("b");
  arrow.textContent = "↗";
  name.append(arrow);

  const description = document.createElement("p");
  description.textContent = breed.description;

  card.append(photo, name, description);
  return card;
}

async function loadBreeds() {
  try {
    const response = await fetch(`${API_BASE}/api/breeds`);
    if (!response.ok) throw new Error(`Request failed (${response.status})`);

    const breeds = await response.json();
    breedList.replaceChildren(
      ...(breeds.length
        ? breeds.map(breedCard)
        : [
            Object.assign(document.createElement("p"), {
              className: "breed-status",
              role: "status",
              ariaLive: "polite",
              textContent: "No dog breeds available yet.",
            }),
          ]),
    );
  } catch (error) {
    console.error(error);
    breedStatus.textContent = "We could not load dog breeds right now.";
  }
}

loadGuides();
loadServices();
loadBreeds();
