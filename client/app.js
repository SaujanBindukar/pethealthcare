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

loadGuides();
