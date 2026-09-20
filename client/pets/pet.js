const token = localStorage.getItem("petHealthToken");
const API_BASE = "http://localhost:3000";
const petId = new URLSearchParams(window.location.search).get("id");
const petTitle = document.querySelector("#pet-title");
const petSpecies = document.querySelector("#pet-species");
const petStatus = document.querySelector("#pet-status");
const logList = document.querySelector("#log-list");
const logForm = document.querySelector("#log-form");
const logStatus = document.querySelector("#log-status");
const logSubmit = document.querySelector("#log-submit");
const logCancel = document.querySelector("#log-cancel");
let pet = null;
let editingLogId = null;

if (!token || !petId) {
  window.location.replace("../dashboard/dashboard.html");
}

async function getJson(url, options) {
  const response = await fetch(url, options);
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      response.ok
        ? "The server returned an unexpected response. Check that the API is running on port 3000."
        : `API request failed (${response.status}). Check that the API is running on port 3000.`,
    );
  }

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
    item.innerHTML = `<div class="log-meta"><strong>${log.log_type || "Other"}</strong><time>${formattedDate}</time></div><p></p><div class="log-actions"><button type="button" data-action="edit">Edit</button><button type="button" data-action="delete">Delete</button></div>`;
    item.querySelector("p").textContent = log.entry;
    item.dataset.logId = log.pet_log_id;
    item.dataset.logType = log.log_type || "Other";
    item.dataset.entry = log.entry;
    item.dataset.date = dateValue;
    logList.append(item);
  });
}

function startEditing(item) {
  editingLogId = item.dataset.logId;
  document.querySelector("#log-type").value = item.dataset.logType;
  document.querySelector("#log-entry").value = item.dataset.entry;
  document.querySelector("#log-date").value = item.dataset.date;
  logSubmit.innerHTML = "Update log <b>→</b>";
  logCancel.hidden = false;
  logStatus.textContent = "Editing log...";
  document.querySelector("#log-type").focus();
}

function stopEditing() {
  editingLogId = null;
  logForm.reset();
  document.querySelector("#log-date").value = new Date()
    .toISOString()
    .slice(0, 10);
  logSubmit.innerHTML = "Save log <b>→</b>";
  logCancel.hidden = true;
  logStatus.textContent = "";
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
  logStatus.textContent = editingLogId ? "Updating log..." : "Saving log...";
  logStatus.className = "form-status";

  try {
    const wasEditing = Boolean(editingLogId);
    await getJson(
      `${API_BASE}/api/pets/${petId}/logs${editingLogId ? `/${editingLogId}` : ""}`,
      {
        method: editingLogId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          log_type: document.querySelector("#log-type").value,
          entry: document.querySelector("#log-entry").value,
          logged_at: document.querySelector("#log-date").value,
        }),
      },
    );
    stopEditing();
    await loadLogs();
    logStatus.textContent = wasEditing ? "Log updated." : "Log added.";
  } catch (error) {
    logStatus.textContent = error.message;
    logStatus.classList.add("error");
  } finally {
    submitButton.disabled = false;
  }
});

logCancel.addEventListener("click", stopEditing);

logList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const item = button.closest(".log-item");
  if (!item) return;

  if (button.dataset.action === "edit") {
    startEditing(item);
    return;
  }

  if (!window.confirm("Delete this log?")) return;
  button.disabled = true;
  try {
    await getJson(`${API_BASE}/api/pets/${petId}/logs/${item.dataset.logId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (editingLogId === item.dataset.logId) stopEditing();
    await loadLogs();
  } catch (error) {
    petStatus.textContent = error.message;
    petStatus.classList.add("error");
    button.disabled = false;
  }
});

document.querySelector("#log-date").value = new Date()
  .toISOString()
  .slice(0, 10);
document.querySelector("#logout").addEventListener("click", () => {
  localStorage.removeItem("petHealthToken");
  localStorage.removeItem("petHealthUser");
  window.location.replace("../account/account.html");
});

loadPet();
