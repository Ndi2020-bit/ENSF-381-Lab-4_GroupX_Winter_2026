// ====== API URL (your MockAPI endpoint) ======
const API_URL = "https://69a1edcc2e82ee536fa29f3f.mockapi.io/users_api";

// ====== DOM selectors (required minimum) ======
const userGrid = document.getElementById("userGrid");
const viewToggleBtn = document.getElementById("viewToggleBtn");
const deleteIdInput = document.getElementById("deleteIdInput");
const deleteBtn = document.getElementById("deleteBtn");
const sortByGroupBtn = document.getElementById("sortByGroupBtn");
const sortByIdBtn = document.getElementById("sortByIdBtn");

// ====== Users array (stores API list) ======
let users = [];

// ====== Fetch users on load ======
async function retrieveData() {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
    }

    users = await res.json();
    console.log(users); // required: log users array

    render(users);
  } catch (err) {
    console.error("Error retrieving data:", err);
    userGrid.innerHTML = "Failed to load users.";
  }
}

// ====== Render user cards ======
function render(arr) {
  let html = "";

  for (const user of arr) {
    html += `
<article class="user-card">
  <h3>${user.first_name ?? ""}</h3>
  <p>first_name: ${user.first_name ?? ""}</p>
  <p>user_group: ${user.user_group ?? ""}</p>
  <p>id: ${user.id ?? ""}</p>
</article>
`;
  }

  userGrid.innerHTML = html || "No users loaded.";
}

// ====== Toggle Grid/List view ======
viewToggleBtn.addEventListener("click", () => {
  if (userGrid.classList.contains("grid-view")) {
    userGrid.classList.remove("grid-view");
    userGrid.classList.add("list-view");
  } else {
    userGrid.classList.remove("list-view");
    userGrid.classList.add("grid-view");
  }
});

// ====== Sort by Group (ascending) ======
sortByGroupBtn.addEventListener("click", () => {
  users.sort((a, b) => Number(a.user_group) - Number(b.user_group));
  render(users);
});

// ====== Sort by ID (ascending numeric) ======
sortByIdBtn.addEventListener("click", () => {
  users.sort((a, b) => Number(a.id) - Number(b.id));
  render(users);
});

// ====== Delete by ID ======
deleteBtn.addEventListener("click", async () => {
  const idToDelete = deleteIdInput.value.trim();

  if (!idToDelete) {
    console.error("Delete failed: Please enter an ID.");
    return;
  }

  // check local list first (optional but helps error messaging)
  const exists = users.some((u) => String(u.id) === String(idToDelete));
  if (!exists) {
    console.error(`Delete failed: No user found with id ${idToDelete}`);
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${idToDelete}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`DELETE failed: ${res.status} ${res.statusText}`);
    }

    // remove from local array + re-render
    users = users.filter((u) => String(u.id) !== String(idToDelete));
    render(users);

    // clear input
    deleteIdInput.value = "";
  } catch (err) {
    console.error("Delete request failed:", err);
  }
});

// run on page load
retrieveData();