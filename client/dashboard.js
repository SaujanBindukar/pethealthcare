const token = localStorage.getItem("petHealthToken");
const storedUser = localStorage.getItem("petHealthUser");
const navLinks = document.querySelectorAll("[data-section]");
const contentSections = document.querySelectorAll("[data-content]");
const petForm = document.querySelector("#pet-form");
const petStatus = document.querySelector("#pet-status");
const petList = document.querySelector("#pet-list");
const petsStatus = document.querySelector("#pets-status");
const API_BASE = "http://localhost:3000";

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

function renderPets(pets) {
  petList.replaceChildren();
  if (!pets.length) {
    petList.innerHTML =
      '<p class="empty-state">No pets yet. Add your first pet to start a care log.</p>';
    return;
  }

  pets.forEach((pet) => {
    const button = document.createElement("button");
    button.className = "pet-card";
    button.type = "button";
    button.innerHTML = `<strong>${pet.name}</strong><span>${pet.species}</span><b>→</b>`;
    button.addEventListener(
      "click",
      () => (window.location.href = `pet.html?id=${pet.pet_id}`),
    );
    petList.append(button);
  });
}

async function loadPets() {
  petsStatus.textContent = "Loading pets...";
  try {
    const response = await fetch(`${API_BASE}/api/pets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not fetch pets");
    renderPets(result.pets);
    petsStatus.textContent = "";
  } catch (error) {
    petsStatus.textContent = error.message;
    petsStatus.className = "form-status error";
  }
}

document.querySelector("#refresh-pets").addEventListener("click", loadPets);
loadPets();

petForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = petForm.querySelector("button");
  submitButton.disabled = true;
  petStatus.textContent = "Saving pet...";
  petStatus.className = "form-status";

  try {
    const response = await fetch(`${API_BASE}/api/pets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: document.querySelector("#pet-name").value,
        species: document.querySelector("#pet-type").value,
      }),
    });
    const result = await response.json();

    if (!response.ok) throw new Error(result.error || "Could not save pet");

    petForm.reset();
    petStatus.textContent = `${result.pet.name} was added successfully.`;
  } catch (error) {
    petStatus.textContent = error.message;
    petStatus.classList.add("error");
  } finally {
    submitButton.disabled = false;
  }
});

document.querySelector("#logout").addEventListener("click", () => {
  localStorage.removeItem("petHealthToken");
  localStorage.removeItem("petHealthUser");
  window.location.replace("account.html");
});
