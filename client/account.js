const tabs = document.querySelectorAll(".tabs button");
const submit = document.querySelector(".submit");
const footnote = document.querySelector(".footnote");
const header = document.querySelector("header");
const form = document.querySelector("#account-form");
const nameFields = document.querySelectorAll(".name-field");
const status = document.querySelector(".form-status");
const API_BASE = "http://localhost:3000";

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

function setMode(mode) {
  const register = mode === "register";
  tabs.forEach((tab) =>
    tab.classList.toggle("active", tab.dataset.mode === mode),
  );
  submit.firstChild.textContent = register ? "Register " : "Log in ";
  nameFields.forEach((field) => {
    field.hidden = !register;
    field.required = register;
  });
  document.querySelector("#password").autocomplete = register
    ? "new-password"
    : "current-password";
  footnote.innerHTML = register
    ? 'Already have an account? <a href="#" data-switch> Log in</a>'
    : 'New here? <a href="#" data-switch> Create an account</a>';
  document.querySelector("[data-switch]").addEventListener("click", (event) => {
    event.preventDefault();
    setMode(register ? "login" : "register");
  });
}
tabs.forEach((tab) =>
  tab.addEventListener("click", () => setMode(tab.dataset.mode)),
);
setMode("login");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const register =
    document.querySelector(".tabs button.active").dataset.mode === "register";
  const payload = {
    email: document.querySelector("#email").value.trim(),
    password: document.querySelector("#password").value,
  };

  if (register) payload.name = document.querySelector("#name").value.trim();

  submit.disabled = true;
  status.textContent = register
    ? "Creating your account..."
    : "Signing you in...";
  status.className = "form-status";

  try {
    const response = await fetch(
      `${API_BASE}/api/auth/${register ? "signup" : "login"}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const result = await response.json();

    if (!response.ok) throw new Error(result.error || "Authentication failed");

    localStorage.setItem("petHealthToken", result.token);
    localStorage.setItem("petHealthUser", JSON.stringify(result.user));
    window.location.href = "dashboard.html";
  } catch (error) {
    status.textContent = error.message;
    status.classList.add("error");
    submit.disabled = false;
  }
});
