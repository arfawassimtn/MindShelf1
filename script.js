let chats = JSON.parse(localStorage.getItem("mindshelf_chats")) || [];

/* VIEW SWITCH */
function setView(viewId) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(viewId).classList.add("active");
  updateDashboard();
  renderChats();
}

/* ADD CHAT */
function addChat() {
  const title = document.getElementById("chatTitle").value;
  const tag = document.getElementById("chatTag").value;
  const content = document.getElementById("chatContent").value;

  if (!title || !content) return;

  const chat = {
    id: Date.now(),
    title,
    tag,
    content,
    favorite: false,
    date: new Date().toLocaleDateString()
  };

  chats.push(chat);
  save();
  renderChats();
  updateDashboard();
}

/* SAVE */
function save() {
  localStorage.setItem("mindshelf_chats", JSON.stringify(chats));
}

/* RENDER CHATS */
function renderChats() {
  const list = document.getElementById("chatList");
  const search = document.getElementById("search")?.value || "";

  list.innerHTML = "";

  chats
    .filter(c =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.tag.toLowerCase().includes(search.toLowerCase())
    )
    .forEach(chat => {
      const div = document.createElement("div");
      div.className = "chat";

      div.innerHTML = `
        <h3>${chat.title}</h3>
        <small>#${chat.tag} • ${chat.date}</small>
        <p>${chat.content}</p>

        <button onclick="toggleFav(${chat.id})">
          ${chat.favorite ? "★ Remove Fav" : "☆ Favorite"}
        </button>

        <button onclick="deleteChat(${chat.id})">Delete</button>
      `;

      list.appendChild(div);
    });

  renderFavorites();
}

/* FAVORITES */
function toggleFav(id) {
  chats = chats.map(c =>
    c.id === id ? { ...c, favorite: !c.favorite } : c
  );
  save();
  renderChats();
}

/* DELETE */
function deleteChat(id) {
  chats = chats.filter(c => c.id !== id);
  save();
  renderChats();
  updateDashboard();
}

/* FAVORITE VIEW */
function renderFavorites() {
  const fav = document.getElementById("favoriteList");
  if (!fav) return;

  fav.innerHTML = "";

  chats.filter(c => c.favorite).forEach(chat => {
    const div = document.createElement("div");
    div.className = "chat";
    div.innerHTML = `<h3>${chat.title}</h3><p>${chat.content}</p>`;
    fav.appendChild(div);
  });
}

/* DASHBOARD */
function updateDashboard() {
  document.getElementById("totalChats").innerText = chats.length;
  document.getElementById("totalPinned").innerText = chats.filter(c => c.favorite).length;

  const tags = new Set(chats.map(c => c.tag));
  document.getElementById("totalCategories").innerText = tags.size;
}

/* THEME */
function toggleTheme() {
  document.body.classList.toggle("dark");
}

/* INIT */
renderChats();
updateDashboard();

