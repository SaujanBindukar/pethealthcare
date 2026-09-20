const token = localStorage.getItem("petHealthToken");
const storedUser = localStorage.getItem("petHealthUser");
const navLinks = document.querySelectorAll("[data-section]");
const contentSections = document.querySelectorAll("[data-content]");
const petForm = document.querySelector("#pet-form");
const petStatus = document.querySelector("#pet-status");
const petList = document.querySelector("#pet-list");
const petsStatus = document.querySelector("#pets-status");
const API_BASE = "http://localhost:3000";
let editingPetId = null;

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
    const card = document.createElement("article");
    card.className = "pet-card";

    const details = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = pet.name;
    const species = document.createElement("span");
    species.textContent = pet.species;
    details.append(name, species);

    const actions = document.createElement("div");
    actions.className = "pet-card-actions";
    const openButton = document.createElement("button");
    openButton.type = "button";
    openButton.textContent = "Open →";
    openButton.addEventListener(
      "click",
      () => (window.location.href = `pet.html?id=${pet.pet_id}`),
    );

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => startEditingPet(pet));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", async () => {
      if (!window.confirm(`Delete ${pet.name} and its logs?`)) return;
      deleteButton.disabled = true;
      try {
        const response = await fetch(`${API_BASE}/api/pets/${pet.pet_id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || "Could not delete pet");
        }
        await loadPets();
      } catch (error) {
        petsStatus.textContent = error.message;
        petsStatus.className = "form-status error";
        deleteButton.disabled = false;
      }
    });

    actions.append(openButton, editButton, deleteButton);
    card.append(details, actions);
    petList.append(card);
  });
}

function startEditingPet(pet) {
  editingPetId = pet.pet_id;
  document.querySelector("#pet-name").value = pet.name;
  document.querySelector("#pet-type").value = pet.species;
  document.querySelector("#add-pet-title").textContent = "Edit pet";
  document.querySelector("#pet-submit").innerHTML = "Update pet <b>→</b>";
  document.querySelector("#pet-cancel").hidden = false;
  window.location.hash = "add-pet";
  showSection("add-pet");
}

function stopEditingPet() {
  editingPetId = null;
  petForm.reset();
  document.querySelector("#add-pet-title").textContent = "Add a pet";
  document.querySelector("#pet-submit").innerHTML = "Save pet <b>→</b>";
  document.querySelector("#pet-cancel").hidden = true;
  petStatus.textContent = "";
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
  petStatus.textContent = editingPetId ? "Updating pet..." : "Saving pet...";
  petStatus.className = "form-status";

  try {
    const response = await fetch(
      `${API_BASE}/api/pets${editingPetId ? `/${editingPetId}` : ""}`,
      {
        method: editingPetId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: document.querySelector("#pet-name").value,
          species: document.querySelector("#pet-type").value,
        }),
      },
    );
    const result = await response.json();

    if (!response.ok) throw new Error(result.error || "Could not save pet");

    const message = editingPetId ? "updated" : "added";
    stopEditingPet();
    await loadPets();
    petStatus.textContent = `${result.pet.name} was ${message} successfully.`;
  } catch (error) {
    petStatus.textContent = error.message;
    petStatus.classList.add("error");
  } finally {
    submitButton.disabled = false;
  }
});

document.querySelector("#pet-cancel").addEventListener("click", stopEditingPet);

document.querySelector("#logout").addEventListener("click", () => {
  localStorage.removeItem("petHealthToken");
  localStorage.removeItem("petHealthUser");
  window.location.replace("account.html");
});
