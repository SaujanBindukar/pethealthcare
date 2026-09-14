const token = localStorage.getItem("petHealthToken");
const storedUser = localStorage.getItem("petHealthUser");

if (!token || !storedUser) {
  window.location.replace("account.html");
} else {
  const user = JSON.parse(storedUser);
  document.querySelector("#user-name").textContent = user.name;
}

document.querySelector("#logout").addEventListener("click", () => {
  localStorage.removeItem("petHealthToken");
  localStorage.removeItem("petHealthUser");
  window.location.replace("account.html");
});
