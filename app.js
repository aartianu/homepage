const storage = {
  document: "aarti.homepage.document",
  folders: "aarti.homepage.folders",
  todos: "aarti.homepage.todos",
  events: "aarti.homepage.events",
  song: "aarti.homepage.song"
};

const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const deskPanel = document.querySelector(".desk-panel");
const briefcaseToggle = document.querySelector("#briefcaseToggle");
const deskDocument = document.querySelector("#deskDocument");
const folderView = document.querySelector("#folderView");
const documentMenuView = document.querySelector("#documentMenuView");
const documentView = document.querySelector("#documentView");
const folderGrid = document.querySelector("#folderGrid");
const documentMenu = document.querySelector("#documentMenu");
const documentMenuTitle = document.querySelector("#documentMenuTitle");
const activeDocumentTitle = document.querySelector("#activeDocumentTitle");
const addFolderButton = document.querySelector("#addFolderButton");
const addDocumentButton = document.querySelector("#addDocumentButton");
const backToFolders = document.querySelector("#backToFolders");
const backToDocuments = document.querySelector("#backToDocuments");
const calendarPanel = document.querySelector(".calendar-panel");
const monthLabel = document.querySelector("#monthLabel");
const calendarGrid = document.querySelector("#calendarGrid");
const prevMonth = document.querySelector("#prevMonth");
const nextMonth = document.querySelector("#nextMonth");
const weatherPlace = document.querySelector("#weatherPlace");
const weatherTemp = document.querySelector("#weatherTemp");
const weatherSummary = document.querySelector("#weatherSummary");
const weatherLocation = document.querySelector("#weatherLocation");
const eventDialog = document.querySelector("#eventDialog");
const eventForm = document.querySelector("#eventForm");
const eventDateLabel = document.querySelector("#eventDateLabel");
const eventList = document.querySelector("#eventList");
const eventInput = document.querySelector("#eventInput");
const cancelEvent = document.querySelector("#cancelEvent");
const addTodoButton = document.querySelector("#addTodoButton");
const todoCompose = document.querySelector("#todoCompose");
const todoInput = document.querySelector("#todoInput");
const todoList = document.querySelector("#todoList");
const songTitle = document.querySelector("#songTitle");
const spotifyPlayer = document.querySelector("#spotifyPlayer");
const quoteAuthor = document.querySelector("#quoteAuthor");
const quoteText = document.querySelector("#quoteText");
const quoteSource = document.querySelector("#quoteSource");

const today = new Date();
let visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
let selectedEventDate = "";
let weatherLoaded = false;
let activeFolderId = "";
let activeDocumentId = "";

const defaultTodos = [
  { text: "Water plants", done: false },
  { text: "Check calendar", done: false },
  { text: "Play one puzzle", done: false }
];

const songs = [
  {
    title: "Sabrina Carpenter - Espresso",
    embed: "https://open.spotify.com/embed/track/2qSkIjg1o9h3YT9RAgYN75?utm_source=generator"
  },
  {
    title: "Chappell Roan - Good Luck, Babe!",
    embed: "https://open.spotify.com/embed/track/0WbMK4wrZ1wFSty9F7FCgu?utm_source=generator"
  },
  {
    title: "Billie Eilish - BIRDS OF A FEATHER",
    embed: "https://open.spotify.com/embed/track/6dOtVTDdiauQNBQEDOtlAB?utm_source=generator"
  },
  {
    title: "Taylor Swift - Cruel Summer",
    embed: "https://open.spotify.com/embed/track/1BxfuPKGuaTgP7aM0Bbdwr?utm_source=generator"
  }
];

const quotes = [
  {
    author: "Socrates",
    text: "The unexamined life is not worth living.",
    source: "Plato, Apology"
  },
  {
    author: "Aristotle",
    text: "Happiness depends upon ourselves.",
    source: "Nicomachean Ethics"
  },
  {
    author: "Socrates",
    text: "Wisdom begins in wonder.",
    source: "Plato, Theaetetus"
  },
  {
    author: "Aristotle",
    text: "Quality is not an act, it is a habit.",
    source: "Nicomachean Ethics"
  }
];

const weatherCodes = {
  0: "Clear",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Cloudy",
  45: "Foggy",
  48: "Foggy",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Heavy showers",
  95: "Thunderstorms"
};

function readList(key, fallback = []) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeList(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getFolders() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storage.folders));
    if (Array.isArray(parsed)) return parsed;
  } catch {
    localStorage.removeItem(storage.folders);
  }

  const migratedDocument = localStorage.getItem(storage.document) || "";
  const documentId = createId("doc");
  const folder = {
    id: createId("folder"),
    name: "Notes",
    docs: [{ id: documentId, title: "doc 1", content: migratedDocument }]
  };
  writeList(storage.folders, [folder]);
  return [folder];
}

function saveFolders(folders) {
  writeList(storage.folders, folders);
}

function makeDefaultDocument(index = 1) {
  return { id: createId("doc"), title: `doc ${index}`, content: "" };
}

function getActiveFolder(folders = getFolders()) {
  return folders.find((folder) => folder.id === activeFolderId) || folders[0];
}

function getActiveDocument(folder) {
  return folder.docs.find((doc) => doc.id === activeDocumentId) || folder.docs[0];
}

function showFileView(view) {
  [folderView, documentMenuView, documentView].forEach((section) => {
    section.classList.toggle("is-active", section === view);
  });
}

function renderFolders() {
  const folders = getFolders();
  folderGrid.innerHTML = "";

  if (!folders.length) {
    const empty = document.createElement("div");
    empty.className = "empty-documents";
    empty.textContent = "No folders yet";
    folderGrid.append(empty);
    return;
  }

  folders.forEach((folder) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "folder-card";

    const tab = document.createElement("span");
    tab.className = "folder-tab";
    tab.textContent = folder.name;

    const count = document.createElement("small");
    count.textContent = `${folder.docs.length} doc${folder.docs.length === 1 ? "" : "s"}`;

    button.append(tab, count);
    button.addEventListener("click", () => {
      activeFolderId = folder.id;
      renderDocumentMenu();
      showFileView(documentMenuView);
    });
    button.addEventListener("dblclick", () => {
      const name = prompt("Folder name", folder.name)?.trim();
      if (!name) return;
      folder.name = name;
      saveFolders(folders);
      renderFolders();
    });

    const deleteButton = document.createElement("span");
    deleteButton.className = "folder-delete";
    deleteButton.textContent = "x";
    deleteButton.setAttribute("role", "button");
    deleteButton.setAttribute("aria-label", `Delete ${folder.name}`);
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!confirm(`Delete folder "${folder.name}"?`)) return;
      const nextFolders = folders.filter((item) => item.id !== folder.id);
      saveFolders(nextFolders);
      activeFolderId = nextFolders[0]?.id || "";
      activeDocumentId = "";
      renderFolders();
    });
    button.append(deleteButton);
    folderGrid.append(button);
  });
}

function renderDocumentMenu() {
  const folders = getFolders();
  const folder = getActiveFolder(folders);
  activeFolderId = folder.id;

  documentMenuTitle.textContent = folder.name;
  documentMenu.innerHTML = "";

  if (!folder.docs.length) {
    const empty = document.createElement("div");
    empty.className = "empty-documents";
    empty.textContent = "No documents yet";
    documentMenu.append(empty);
    return;
  }

  folder.docs.forEach((doc, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "document-row";
    button.textContent = doc.title || `doc ${index + 1}`;
    button.addEventListener("click", () => {
      activeDocumentId = doc.id;
      renderDocument();
      showFileView(documentView);
      deskDocument.focus();
    });
    button.addEventListener("dblclick", () => {
      const title = prompt("Document title", doc.title)?.trim();
      if (!title) return;
      doc.title = title;
      saveFolders(folders);
      renderDocumentMenu();
    });
    const deleteButton = document.createElement("span");
    deleteButton.className = "document-delete";
    deleteButton.textContent = "x";
    deleteButton.setAttribute("role", "button");
    deleteButton.setAttribute("aria-label", `Delete ${doc.title}`);
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!confirm(`Delete document "${doc.title}"?`)) return;
      folder.docs = folder.docs.filter((item) => item.id !== doc.id);
      activeDocumentId = folder.docs[0]?.id || "";
      saveFolders(folders);
      renderDocumentMenu();
    });
    button.append(deleteButton);
    documentMenu.append(button);
  });
}

function renderDocument() {
  const folder = getActiveFolder();
  const document = getActiveDocument(folder);
  activeDocumentId = document.id;
  activeDocumentTitle.textContent = document.title;
  deskDocument.value = document.content;
}

function readEvents() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storage.events));
    if (!parsed || typeof parsed !== "object") return {};

    return Object.fromEntries(Object.entries(parsed).map(([date, value]) => {
      if (Array.isArray(value)) return [date, value];
      if (typeof value === "string" && value.trim()) return [date, [value]];
      return [date, []];
    }));
  } catch {
    return {};
  }
}

function writeEvents(events) {
  localStorage.setItem(storage.events, JSON.stringify(events));
}

function normalizeUrl(value) {
  const trimmed = value.trim();
  if (/^[a-z][a-z\d+\-.]*:\/\//i.test(trimmed)) return trimmed;
  if (/^localhost(:\d+)?/i.test(trimmed)) return `http://${trimmed}`;
  return `https://${trimmed}`;
}

function looksLikeUrl(value) {
  const trimmed = value.trim();
  if (/\s/.test(trimmed)) return false;
  if (/^[a-z][a-z\d+\-.]*:\/\//i.test(trimmed)) return true;
  if (trimmed.includes(".") && !trimmed.startsWith(".")) return true;
  return /^localhost(:\d+)?/i.test(trimmed);
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function isSameDate(first, second) {
  return first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate();
}

function addRemoveButton(label, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "x";
  button.ariaLabel = label;
  button.addEventListener("click", onClick);
  return button;
}

function renderCalendar() {
  const events = readEvents();
  monthLabel.textContent = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric"
  }).format(visibleMonth);
  calendarGrid.innerHTML = "";

  const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    const key = toDateKey(date);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "day";
    button.textContent = date.getDate();
    button.ariaLabel = events[key]?.length
      ? `${formatLongDate(date)}: ${events[key].join(", ")}`
      : `Add event for ${formatLongDate(date)}`;

    if (date.getMonth() !== visibleMonth.getMonth()) button.classList.add("outside");
    if (isSameDate(date, today)) button.classList.add("today");
    if (events[key]?.length) button.classList.add("has-event");

    button.addEventListener("click", () => {
      selectedEventDate = key;
      eventDateLabel.textContent = formatLongDate(date);
      eventInput.value = "";
      renderEventList();
      eventDialog.showModal();
      eventInput.focus();
    });

    calendarGrid.append(button);
  }
}

function renderEventList() {
  const events = readEvents();
  const dayEvents = events[selectedEventDate] || [];
  eventList.innerHTML = "";

  if (!dayEvents.length) {
    const empty = document.createElement("li");
    empty.textContent = "No events yet";
    eventList.append(empty);
    return;
  }

  dayEvents.forEach((eventName, index) => {
    const item = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = eventName;
    item.append(text, addRemoveButton(`Delete ${eventName}`, () => {
      const nextEvents = readEvents();
      nextEvents[selectedEventDate] = (nextEvents[selectedEventDate] || []).filter((_, eventIndex) => eventIndex !== index);
      if (!nextEvents[selectedEventDate].length) delete nextEvents[selectedEventDate];
      writeEvents(nextEvents);
      renderEventList();
      renderCalendar();
    }));
    eventList.append(item);
  });
}

function renderTodos() {
  const todos = readList(storage.todos, defaultTodos);
  todoList.innerHTML = "";

  todos.forEach((todo, index) => {
    const item = document.createElement("li");
    if (todo.done) item.classList.add("is-done");

    const text = document.createElement("span");
    text.textContent = todo.text;
    text.addEventListener("click", () => {
      const nextTodos = readList(storage.todos, defaultTodos);
      nextTodos[index].done = !nextTodos[index].done;
      writeList(storage.todos, nextTodos);
      renderTodos();
    });

    item.append(text, addRemoveButton(`Delete ${todo.text}`, () => {
      const nextTodos = readList(storage.todos, defaultTodos).filter((_, todoIndex) => todoIndex !== index);
      writeList(storage.todos, nextTodos);
      renderTodos();
    }));
    todoList.append(item);
  });
}

function addTodo() {
  const value = todoInput.value.trim();
  if (!value) return;
  const todos = readList(storage.todos, defaultTodos);
  todos.unshift({ text: value, done: false });
  writeList(storage.todos, todos);
  todoInput.value = "";
  renderTodos();
}

function pickSong() {
  const saved = localStorage.getItem(storage.song);
  const todayKey = toDateKey(today);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.date === todayKey && songs[parsed.index]) return songs[parsed.index];
    } catch {
      localStorage.removeItem(storage.song);
    }
  }

  const index = Math.floor(Math.random() * songs.length);
  localStorage.setItem(storage.song, JSON.stringify({ date: todayKey, index }));
  return songs[index];
}

function renderSong() {
  const song = pickSong();
  songTitle.textContent = song.title;
  spotifyPlayer.src = song.embed;
}

function renderQuote() {
  const daySeed = Number(toDateKey(today).replaceAll("-", ""));
  const quote = quotes[daySeed % quotes.length];
  quoteAuthor.textContent = quote.author;
  quoteText.textContent = quote.text;
  quoteSource.textContent = quote.source;
}

function renderWeather(data) {
  const temperature = Math.round(data.current.temperature_2m);
  const summary = weatherCodes[data.current.weather_code] || "Outside";
  weatherTemp.textContent = `${temperature}°`;
  weatherSummary.textContent = summary;
}

async function loadWeather(latitude = 40.7128, longitude = -74.0060, label = "New York") {
  weatherPlace.textContent = label;
  weatherSummary.textContent = "Checking the sky";

  try {
    const params = new URLSearchParams({
      latitude,
      longitude,
      current: "temperature_2m,weather_code",
      temperature_unit: "fahrenheit",
      timezone: "auto"
    });
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!response.ok) throw new Error("Weather request failed");
    renderWeather(await response.json());
  } catch {
    weatherTemp.textContent = "--";
    weatherSummary.textContent = "Weather unavailable";
  }
}

async function getLocationName(latitude, longitude) {
  try {
    const params = new URLSearchParams({
      latitude,
      longitude,
      count: "1",
      language: "en",
      format: "json"
    });
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?${params}`);
    if (!response.ok) throw new Error("Location request failed");
    const data = await response.json();
    const place = data.results?.[0];
    return [place?.name, place?.admin1].filter(Boolean).join(", ") || "current location";
  } catch {
    return "current location";
  }
}

function loadLocalWeather() {
  if (!navigator.geolocation) {
    weatherSummary.textContent = "Location unavailable";
    return;
  }

  weatherSummary.textContent = "Finding your sky";
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      const locationName = await getLocationName(latitude, longitude);
      loadWeather(latitude, longitude, locationName);
    },
    () => {
      weatherSummary.textContent = "Location blocked";
    },
    { enableHighAccuracy: false, maximumAge: 900000, timeout: 8000 }
  );
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  window.location.href = looksLikeUrl(query)
    ? normalizeUrl(query)
    : `https://www.google.com/search?q=${encodeURIComponent(query)}`;
});

briefcaseToggle.addEventListener("click", () => {
  const isOpen = deskPanel.classList.toggle("is-open");
  calendarPanel.classList.toggle("show-weather", isOpen);
  briefcaseToggle.textContent = isOpen ? "close" : "open briefcase";
  if (isOpen) {
    renderFolders();
    showFileView(folderView);
    if (!weatherLoaded) {
      loadWeather();
      weatherLoaded = true;
    }
  }
});

deskDocument.addEventListener("input", () => {
  const folders = getFolders();
  const folder = getActiveFolder(folders);
  const document = getActiveDocument(folder);
  document.content = deskDocument.value;
  saveFolders(folders);
});

addFolderButton.addEventListener("click", () => {
  const name = prompt("Folder name")?.trim();
  if (!name) return;
  const folders = getFolders();
  const folder = {
    id: createId("folder"),
    name,
    docs: []
  };
  folders.push(folder);
  activeFolderId = folder.id;
  saveFolders(folders);
  renderFolders();
});

addDocumentButton.addEventListener("click", () => {
  const title = prompt("Document title")?.trim() || "untitled";
  const folders = getFolders();
  const folder = getActiveFolder(folders);
  const doc = { id: createId("doc"), title, content: "" };
  folder.docs.push(doc);
  saveFolders(folders);
  renderDocumentMenu();
});

backToFolders.addEventListener("click", () => {
  renderFolders();
  showFileView(folderView);
});

backToDocuments.addEventListener("click", () => {
  renderDocumentMenu();
  showFileView(documentMenuView);
});

prevMonth.addEventListener("click", () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
  renderCalendar();
});

nextMonth.addEventListener("click", () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
  renderCalendar();
});

cancelEvent.addEventListener("click", () => {
  eventDialog.close();
});

eventForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const events = readEvents();
  const value = eventInput.value.trim();
  if (value) {
    events[selectedEventDate] = [...(events[selectedEventDate] || []), value];
    eventInput.value = "";
  }
  writeEvents(events);
  renderEventList();
  renderCalendar();
});

addTodoButton.addEventListener("click", () => {
  todoCompose.classList.toggle("is-visible");
  if (todoCompose.classList.contains("is-visible")) todoInput.focus();
});

todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addTodo();
});

weatherLocation.addEventListener("click", loadLocalWeather);

renderCalendar();
renderTodos();
renderSong();
renderQuote();
