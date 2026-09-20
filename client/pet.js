const token = localStorage.getItem("petHealthToken");
const API_BASE = "http://localhost:3000";
const petId = new URLSearchParams(window.location.search).get("id");
const petTitle = document.querySelector("#pet-title");
const petSpecies = document.querySelector("#pet-species");
const petStatus = document.querySelector("#pet-status");
const logList = document.querySelector("#log-list");
const logForm = document.querySelector("#log-form");
const logStatus = document.querySelector("#log-status");
let pet = null;

if (!token || !petId) {
  window.location.replace("dashboard.html");
}

async function getJson(url, options) {
  const response = await fetch(url, options);
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Something went wrong");
  return result;
}

function renderLogs(logs) {
  logList.replaceChildren();
  if (!logs.length) {
    logList.innerHTML = '<p class="empty-state">No logs for this pet yet.</p>';
    return;
  }

  logs.forEach((log) => {
    const item = document.createElement("article");
    item.className = "log-item";
    const dateValue = String(log.logged_at).slice(0, 10);
    const formattedDate = new Date(`${dateValue}T00:00:00`).toLocaleDateString(
      undefined,
      { year: "numeric", month: "short", day: "numeric" },
    );
    item.innerHTML = `<time>${formattedDate}</time><p></p>`;
    item.querySelector("p").textContent = log.entry;
    logList.append(item);
  });
}

async function loadLogs() {
  logList.innerHTML = '<p class="empty-state">Loading logs...</p>';
  const result = await getJson(`${API_BASE}/api/pets/${petId}/logs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  renderLogs(result.logs);
}

async function loadPet() {
  try {
    const result = await getJson(`${API_BASE}/api/pets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    pet = result.pets.find((item) => String(item.pet_id) === petId);
    if (!pet) throw new Error("Pet not found");
    petTitle.textContent = pet.name;
    petSpecies.textContent = pet.species;
    await loadLogs();
  } catch (error) {
    petStatus.textContent = error.message;
    petStatus.classList.add("error");
    logList.replaceChildren();
  }
}

logForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = logForm.querySelector("button[type=submit]");
  submitButton.disabled = true;
  logStatus.textContent = "Saving log...";
  logStatus.className = "form-status";

  try {
    await getJson(`${API_BASE}/api/pets/${petId}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        entry: document.querySelector("#log-entry").value,
        logged_at: document.querySelector("#log-date").value,
      }),
    });
    logForm.reset();
    document.querySelector("#log-date").value = new Date()
      .toISOString()
      .slice(0, 10);
    await loadLogs();
    logStatus.textContent = "Log added.";
  } catch (error) {
    logStatus.textContent = error.message;
    logStatus.classList.add("error");
  } finally {
    submitButton.disabled = false;
  }
});

document.querySelector("#log-date").value = new Date()
  .toISOString()
  .slice(0, 10);
document.querySelector("#logout").addEventListener("click", () => {
  localStorage.removeItem("petHealthToken");
  localStorage.removeItem("petHealthUser");
  window.location.replace("account.html");
});

loadPet();
