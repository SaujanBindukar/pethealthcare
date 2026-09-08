const tabs = document.querySelectorAll(".tabs button");
const submit = document.querySelector(".submit");
const footnote = document.querySelector(".footnote");
const header = document.querySelector("header");

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
