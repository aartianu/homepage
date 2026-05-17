const storage = {
  document: "aarti.homepage.document",
  folders: "aarti.homepage.folders",
  todos: "aarti.homepage.todos",
  events: "aarti.homepage.events",
  song: "aarti.homepage.song"
};

const cloudStateKeys = Object.values(storage);
let suppressCloudSave = false;
let cloudSaveTimer = 0;

const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const bookmarkShelf = document.querySelector(".bookmark-shelf");
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
const googleDocButton = document.querySelector("#googleDocButton");
const openGoogleDocButton = document.querySelector("#openGoogleDocButton");
const annotateFileButton = document.querySelector("#annotateFileButton");
const googleDocFrame = document.querySelector("#googleDocFrame");
const uploadedFileFrame = document.querySelector("#uploadedFileFrame");
const documentFileInput = document.querySelector("#documentFileInput");
const annotationDialog = document.querySelector("#annotationDialog");
const annotationTitle = document.querySelector("#annotationTitle");
const annotationFrame = document.querySelector("#annotationFrame");
const annotationPage = document.querySelector("#annotationPage");
const annotationLayer = document.querySelector("#annotationLayer");
const annotationCanvas = document.querySelector("#annotationCanvas");
const annotationToolButtons = document.querySelectorAll("[data-annotation-tool]");
const closeAnnotationButton = document.querySelector("#closeAnnotationButton");
const annotationImageInput = document.querySelector("#annotationImageInput");
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
const eventSubmitButton = eventForm.querySelector('button[type="submit"]');
const documentTypeDialog = document.querySelector("#documentTypeDialog");
const documentTypeButtons = document.querySelectorAll("[data-document-type]");
const cancelDocumentType = document.querySelector("#cancelDocumentType");
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
let editingEventIndex = -1;
let weatherLoaded = false;
let activeFolderId = "";
let activeDocumentId = "";
let activeAnnotationTool = "scroll";
let isAnnotationScrolling = false;
let annotationScrollTimer = 0;
let annotationPageHeight = 1600;

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
  },
  {
    title: "Mitski - My Love Mine All Mine",
    embed: "https://open.spotify.com/embed/track/3vkCueOmm7xQDoJ17W1Pm3?utm_source=generator"
  },
  {
    title: "SZA - Kill Bill",
    embed: "https://open.spotify.com/embed/track/1Qrg8KqiBpW07V7PNxwwwL?utm_source=generator"
  },
  {
    title: "Hozier - Too Sweet",
    embed: "https://open.spotify.com/embed/track/1BJJbSX6muJVF2AK7uH1x4?utm_source=generator"
  },
  {
    title: "Olivia Rodrigo - vampire",
    embed: "https://open.spotify.com/embed/track/1kuGVB7EU95pJObxwvfwKS?utm_source=generator"
  },
  {
    title: "Noah Kahan - Stick Season",
    embed: "https://open.spotify.com/embed/track/0mflMxspEfB0VbI1kyLiAv?utm_source=generator"
  },
  {
    title: "Laufey - From The Start",
    embed: "https://open.spotify.com/embed/track/43iIQbw5hx986dUEZbr3eN?utm_source=generator"
  }
];

const songRotationVersion = "2026-05-15";
const songOverrides = {
  "2026-05-15": 6
};

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

function collectCloudState() {
  return Object.fromEntries(cloudStateKeys.map((key) => [key, localStorage.getItem(key)]));
}

function applyCloudState(data) {
  if (!data || typeof data !== "object") return;
  suppressCloudSave = true;
  cloudStateKeys.forEach((key) => {
    if (typeof data[key] === "string") {
      localStorage.setItem(key, data[key]);
    } else if (data[key] === null) {
      localStorage.removeItem(key);
    }
  });
  suppressCloudSave = false;
}

function getCloudSyncSecret() {
  return localStorage.getItem("aarti.homepage.syncSecret") || "";
}

function scheduleCloudSave() {
  if (suppressCloudSave) return;
  window.clearTimeout(cloudSaveTimer);
  cloudSaveTimer = window.setTimeout(saveCloudState, 650);
}

async function loadCloudState() {
  try {
    const response = await fetch("/api/state");
    if (!response.ok) return;
    const payload = await response.json();
    applyCloudState(payload.data);
  } catch {
    // Local file/http-server previews do not have the Vercel API route.
  }
}

async function saveCloudState() {
  try {
    const secret = getCloudSyncSecret();
    const headers = { "Content-Type": "application/json" };
    if (secret) headers["x-homepage-secret"] = secret;
    await fetch("/api/state", {
      method: "POST",
      headers,
      body: JSON.stringify({ data: collectCloudState() })
    });
  } catch {
    // Keep localStorage as the offline-first source if cloud sync is unavailable.
  }
}

function writeList(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  scheduleCloudSave();
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
  return { id: createId("doc"), title: `doc ${index}`, type: "normal", content: "" };
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

    const editButton = makeFileAction("folder-edit", "edit", `Rename ${folder.name}`, (event) => {
      event.stopPropagation();
      const name = prompt("Folder name", folder.name)?.trim();
      if (!name) return;
      folder.name = name;
      saveFolders(folders);
      renderFolders();
    });

    const deleteButton = makeFileAction("folder-delete", "x", `Delete ${folder.name}`, (event) => {
      event.stopPropagation();
      if (!confirm(`Delete folder "${folder.name}"?`)) return;
      const nextFolders = folders.filter((item) => item.id !== folder.id);
      saveFolders(nextFolders);
      activeFolderId = nextFolders[0]?.id || "";
      activeDocumentId = "";
      renderFolders();
    });
    button.append(editButton, deleteButton);
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

    const title = document.createElement("span");
    title.className = "document-title";
    title.textContent = doc.title || `doc ${index + 1}`;

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

    const editButton = makeFileAction("document-edit", "edit", `Rename ${doc.title}`, (event) => {
      event.stopPropagation();
      const nextTitle = prompt("Document title", doc.title)?.trim();
      if (!nextTitle) return;
      doc.title = nextTitle;
      saveFolders(folders);
      renderDocumentMenu();
    });

    const deleteButton = makeFileAction("document-delete", "x", `Delete ${doc.title}`, (event) => {
      event.stopPropagation();
      if (!confirm(`Delete document "${doc.title}"?`)) return;
      folder.docs = folder.docs.filter((item) => item.id !== doc.id);
      activeDocumentId = folder.docs[0]?.id || "";
      saveFolders(folders);
      renderDocumentMenu();
    });
    button.append(title, editButton, deleteButton);
    documentMenu.append(button);
  });
}

function renderDocument() {
  const folder = getActiveFolder();
  const document = getActiveDocument(folder);
  activeDocumentId = document.id;
  activeDocumentTitle.textContent = document.title;
  deskDocument.value = document.content;
  const previewUrl = getGoogleDocPreviewUrl(document.googleDocUrl || "");
  const fileUrl = document.fileDataUrl || "";
  const type = getDocumentType(document);
  const hasGoogleDoc = type === "google" && Boolean(previewUrl);
  const hasFileDoc = type === "file" && Boolean(fileUrl);
  documentView.classList.toggle("has-google-doc", hasGoogleDoc);
  documentView.classList.toggle("has-file-doc", hasFileDoc);
  googleDocButton.hidden = type !== "google";
  googleDocButton.disabled = type !== "google";
  googleDocButton.textContent = previewUrl ? "change doc" : "google doc";
  annotateFileButton.hidden = !hasFileDoc;
  annotateFileButton.disabled = !hasFileDoc;
  openGoogleDocButton.hidden = !hasGoogleDoc;
  openGoogleDocButton.disabled = !hasGoogleDoc;
  googleDocFrame.src = hasGoogleDoc ? previewUrl : "";
  uploadedFileFrame.src = hasFileDoc ? fileUrl : "";
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
  scheduleCloudSave();
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

function getGoogleDocPreviewUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed);
    if (url.hostname !== "docs.google.com") return "";
    const publishedMatch = url.pathname.match(/\/document\/d\/e\/([^/]+)\/pub/);
    if (publishedMatch) {
      return `https://docs.google.com/document/d/e/${publishedMatch[1]}/pub?embedded=true`;
    }

    const docMatch = url.pathname.match(/\/document\/d\/([^/]+)/);
    if (!docMatch) return "";
    return `https://docs.google.com/document/d/${docMatch[1]}/preview`;
  } catch {
    return "";
  }
}

function getDocumentType(document) {
  if (document.fileDataUrl) return "file";
  if (document.googleDocUrl) return "google";
  return document.type || "normal";
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function chooseDocumentFile() {
  return new Promise((resolve) => {
    documentFileInput.value = "";
    const handleChange = () => {
      documentFileInput.removeEventListener("change", handleChange);
      resolve(documentFileInput.files[0] || null);
    };
    documentFileInput.addEventListener("change", handleChange);
    documentFileInput.click();
  });
}

function chooseAnnotationImage() {
  return new Promise((resolve) => {
    annotationImageInput.value = "";
    const handleChange = () => {
      annotationImageInput.removeEventListener("change", handleChange);
      resolve(annotationImageInput.files[0] || null);
    };
    annotationImageInput.addEventListener("change", handleChange);
    annotationImageInput.click();
  });
}

function chooseDocumentType() {
  return new Promise((resolve) => {
    const cleanup = () => {
      documentTypeButtons.forEach((button) => button.removeEventListener("click", handleChoice));
      cancelDocumentType.removeEventListener("click", handleCancel);
      documentTypeDialog.removeEventListener("cancel", handleCancel);
    };

    const finish = (type = "") => {
      cleanup();
      documentTypeDialog.close();
      resolve(type);
    };

    function handleChoice(event) {
      finish(event.currentTarget.dataset.documentType);
    }

    function handleCancel(event) {
      event?.preventDefault();
      finish("");
    }

    documentTypeButtons.forEach((button) => button.addEventListener("click", handleChoice));
    cancelDocumentType.addEventListener("click", handleCancel);
    documentTypeDialog.addEventListener("cancel", handleCancel);
    documentTypeDialog.showModal();
  });
}

function getActiveDocumentContext() {
  const folders = getFolders();
  const folder = getActiveFolder(folders);
  const document = getActiveDocument(folder);
  return { folders, folder, document };
}

function saveActiveDocumentContext(folders) {
  saveFolders(folders);
  renderDocument();
}

function setAnnotationTool(tool) {
  activeAnnotationTool = tool;
  annotationLayer.classList.toggle("is-scroll-mode", tool === "scroll");
  annotationToolButtons.forEach((toolButton) => {
    toolButton.classList.toggle("is-active", toolButton.dataset.annotationTool === tool);
  });
}

function setAnnotationPageHeight(height) {
  annotationPageHeight = Math.max(annotationCanvas.clientHeight || 700, Math.min(30000, Math.ceil(height)));
  annotationPage.style.height = `${annotationPageHeight}px`;
}

function decodeDataUrlText(dataUrl) {
  const [, data = ""] = dataUrl.split(",");
  try {
    return decodeURIComponent(escape(atob(data)));
  } catch {
    try {
      return atob(data);
    } catch {
      return "";
    }
  }
}

function getPdfPageCount(dataUrl) {
  const text = decodeDataUrlText(dataUrl);
  const pageMatches = text.match(/\/Type\s*\/Page\b/g) || [];
  const countMatches = [...text.matchAll(/\/Count\s+(\d+)/g)].map((match) => Number(match[1]));
  return Math.max(1, pageMatches.length, ...countMatches.filter(Number.isFinite));
}

function getImageDisplayHeight(dataUrl, width) {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => {
      if (!image.naturalWidth || !image.naturalHeight) {
        resolve(1400);
        return;
      }
      resolve((image.naturalHeight / image.naturalWidth) * width);
    });
    image.addEventListener("error", () => resolve(1400));
    image.src = dataUrl;
  });
}

async function getAnnotationDocumentHeight(document) {
  const width = Math.max(1, annotationCanvas.clientWidth);
  const fileType = document.fileType || "";

  if (fileType.startsWith("image/")) {
    return getImageDisplayHeight(document.fileDataUrl, width);
  }

  if (fileType === "application/pdf" || document.fileName?.toLowerCase().endsWith(".pdf")) {
    const pageCount = getPdfPageCount(document.fileDataUrl);
    const pageHeight = width * 1.294;
    return pageCount * pageHeight + Math.max(0, pageCount - 1) * 28 + 120;
  }

  if (fileType.startsWith("text/") || /\.(txt|md)$/i.test(document.fileName || "")) {
    const text = decodeDataUrlText(document.fileDataUrl);
    const lineCount = Math.max(10, text.split(/\r?\n/).length);
    return lineCount * 24 + 120;
  }

  return 1600;
}

function getAnnotationPagePoint(event) {
  const rect = annotationLayer.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(rect.width, event.clientX - rect.left)),
    y: Math.max(0, Math.min(annotationPageHeight, event.clientY - rect.top))
  };
}

function positionAnnotationMarker(marker, annotation) {
  if (Number.isFinite(annotation.pageX) && Number.isFinite(annotation.pageY)) {
    marker.style.left = `${annotation.pageX}px`;
    marker.style.top = `${annotation.pageY}px`;
    return;
  }

  marker.style.left = `${annotation.x}%`;
  marker.style.top = `${annotation.y}%`;
}

function renderAnnotations() {
  const { document: activeDocument } = getActiveDocumentContext();
  annotationLayer.innerHTML = "";
  (activeDocument.annotations || []).forEach((annotation, index) => {
    const marker = document.createElement(annotation.type === "link" ? "a" : "button");
    let linkOpenTimer = 0;
    marker.className = `annotation-marker annotation-${annotation.type}`;
    positionAnnotationMarker(marker, annotation);
    if (annotation.type !== "link") marker.type = "button";
    marker.textContent = annotation.text || (annotation.type === "highlight" ? "" : "note");
    marker.title = annotation.text || annotation.href || "";
    marker.setAttribute("aria-label", annotation.text || `${annotation.type} annotation`);
    marker.addEventListener("pointerdown", (event) => startAnnotationDrag(event, index));

    if (annotation.type === "link") {
      marker.href = annotation.href;
      marker.target = "_blank";
      marker.rel = "noreferrer";
      marker.textContent = annotation.text || "link";
      marker.addEventListener("click", (event) => {
        event.preventDefault();
        if (marker.dataset.dragged === "true") {
          marker.dataset.dragged = "false";
          return;
        }
        linkOpenTimer = window.setTimeout(() => {
          window.open(annotation.href, "_blank", "noopener,noreferrer");
        }, 220);
      });
    } else if (annotation.type === "image") {
      marker.textContent = "";
      const image = document.createElement("img");
      image.src = annotation.src;
      image.alt = annotation.text || "image annotation";
      marker.append(image);
    }

    marker.addEventListener("dblclick", (event) => {
      event.preventDefault();
      event.stopPropagation();
      window.clearTimeout(linkOpenTimer);
      if (!confirm("Remove this annotation?")) return;
      const next = getActiveDocumentContext();
      next.document.annotations = (next.document.annotations || []).filter((_, itemIndex) => itemIndex !== index);
      saveActiveDocumentContext(next.folders);
      renderAnnotations();
    });

    annotationLayer.append(marker);
  });
}

function startAnnotationDrag(event, index) {
  if (activeAnnotationTool === "scroll" || isAnnotationScrolling || event.button !== 0) return;
  event.stopPropagation();
  const marker = event.currentTarget;
  const startX = event.clientX;
  const startY = event.clientY;
  let moved = false;
  marker.setPointerCapture?.(event.pointerId);

  const move = (moveEvent) => {
    const delta = Math.abs(moveEvent.clientX - startX) + Math.abs(moveEvent.clientY - startY);
    if (delta > 3) moved = true;
    const point = getAnnotationPagePoint(moveEvent);
    marker.style.left = `${point.x}px`;
    marker.style.top = `${point.y}px`;
  };

  const end = (endEvent) => {
    marker.releasePointerCapture?.(event.pointerId);
    marker.removeEventListener("pointermove", move);
    marker.removeEventListener("pointerup", end);
    marker.removeEventListener("pointercancel", end);

    if (!moved) return;
    marker.dataset.dragged = "true";
    const point = getAnnotationPagePoint(endEvent);
    const next = getActiveDocumentContext();
    const annotation = next.document.annotations?.[index];
    if (!annotation) return;
    annotation.pageX = point.x;
    annotation.pageY = point.y;
    delete annotation.x;
    delete annotation.y;
    saveActiveDocumentContext(next.folders);
  };

  marker.addEventListener("pointermove", move);
  marker.addEventListener("pointerup", end);
  marker.addEventListener("pointercancel", end);
}

function scrollAnnotationFile(event) {
  event.preventDefault();
  isAnnotationScrolling = true;
  annotationLayer.classList.add("is-scrolling");
  window.clearTimeout(annotationScrollTimer);
  annotationScrollTimer = window.setTimeout(() => {
    isAnnotationScrolling = false;
    annotationLayer.classList.remove("is-scrolling");
  }, 180);
  annotationCanvas.scrollLeft += event.deltaX;
  annotationCanvas.scrollTop += event.deltaY;
}

async function addAnnotationAt(event) {
  if (activeAnnotationTool === "scroll") return;
  if (event.target !== annotationLayer) return;
  const point = getAnnotationPagePoint(event);
  const next = getActiveDocumentContext();
  const annotation = {
    id: createId("annotation"),
    type: activeAnnotationTool,
    pageX: point.x,
    pageY: point.y
  };

  if (activeAnnotationTool === "note") {
    const text = prompt("Sticky note text")?.trim();
    if (!text) return;
    annotation.text = text;
  } else if (activeAnnotationTool === "link") {
    const href = prompt("Paste link URL")?.trim();
    if (!href) return;
    annotation.href = normalizeUrl(href);
    annotation.text = prompt("Link label")?.trim() || "link";
  } else if (activeAnnotationTool === "image") {
    const file = await chooseAnnotationImage();
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }
    if (file.size > 1_500_000) {
      alert("That image is a bit too large to save as an annotation. Try a smaller image.");
      return;
    }
    annotation.src = await readFileAsDataUrl(file);
    annotation.text = file.name;
  }

  next.document.annotations = [...(next.document.annotations || []), annotation];
  saveActiveDocumentContext(next.folders);
  renderAnnotations();
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

function makeFileAction(className, text, label, onClick) {
  const action = document.createElement("span");
  action.className = className;
  action.textContent = text;
  action.setAttribute("role", "button");
  action.setAttribute("tabindex", "0");
  action.setAttribute("aria-label", label);
  action.addEventListener("click", onClick);
  action.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    action.click();
  });
  return action;
}

function resetEventEditor() {
  editingEventIndex = -1;
  eventInput.value = "";
  eventSubmitButton.textContent = "Save";
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
      resetEventEditor();
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

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "edit";
    editButton.ariaLabel = `Edit ${eventName}`;
    editButton.addEventListener("click", () => {
      editingEventIndex = index;
      eventInput.value = eventName;
      eventSubmitButton.textContent = "Update";
      eventInput.focus();
      eventInput.select();
    });

    item.append(text, editButton, addRemoveButton(`Delete ${eventName}`, () => {
      const nextEvents = readEvents();
      nextEvents[selectedEventDate] = (nextEvents[selectedEventDate] || []).filter((_, eventIndex) => eventIndex !== index);
      if (!nextEvents[selectedEventDate].length) delete nextEvents[selectedEventDate];
      writeEvents(nextEvents);
      resetEventEditor();
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
      if (parsed.date === todayKey && parsed.version === songRotationVersion && songs[parsed.index]) {
        return songs[parsed.index];
      }
    } catch {
      localStorage.removeItem(storage.song);
    }
  }

  const index = songOverrides[todayKey] ?? Math.floor(Math.random() * songs.length);
  localStorage.setItem(storage.song, JSON.stringify({ date: todayKey, index, version: songRotationVersion }));
  scheduleCloudSave();
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

bookmarkShelf.addEventListener("click", (event) => {
  const bookmark = event.target.closest("[data-bookmark-url]");
  if (!bookmark) return;
  window.open(bookmark.dataset.bookmarkUrl, "_blank", "noopener,noreferrer");
});

bookmarkShelf.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const bookmark = event.target.closest("[data-bookmark-url]");
  if (!bookmark) return;
  event.preventDefault();
  window.open(bookmark.dataset.bookmarkUrl, "_blank", "noopener,noreferrer");
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

addDocumentButton.addEventListener("click", async () => {
  const typeChoice = await chooseDocumentType();
  if (!typeChoice) return;
  const title = prompt("Document title")?.trim() || "untitled";
  const folders = getFolders();
  const folder = getActiveFolder(folders);

  let doc = { id: createId("doc"), title, type: "normal", content: "" };

  if (typeChoice === "google") {
    const url = prompt("Paste a Google Docs share or published URL")?.trim();
    if (!url) return;
    if (!getGoogleDocPreviewUrl(url)) {
      alert("That does not look like a Google Docs URL.");
      return;
    }
    doc = { ...doc, type: "google", googleDocUrl: url };
  } else if (typeChoice === "file") {
    const file = await chooseDocumentFile();
    if (!file) return;
    if (file.size > 2_500_000) {
      alert("That file is a bit too large to store in this homepage. Try a smaller PDF, image, or text file.");
      return;
    }
    try {
      doc = {
        ...doc,
        type: "file",
        fileName: file.name,
        fileType: file.type,
        fileDataUrl: await readFileAsDataUrl(file)
      };
      if (title === "untitled") doc.title = file.name;
    } catch {
      alert("I could not read that file.");
      return;
    }
  } else if (typeChoice !== "normal") {
    return;
  }

  folder.docs.push(doc);
  activeDocumentId = doc.id;
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

documentMenuTitle.addEventListener("dblclick", () => {
  const folders = getFolders();
  const folder = getActiveFolder(folders);
  const name = prompt("Folder name", folder.name)?.trim();
  if (!name) return;
  folder.name = name;
  saveFolders(folders);
  renderDocumentMenu();
});

activeDocumentTitle.addEventListener("dblclick", () => {
  const folders = getFolders();
  const folder = getActiveFolder(folders);
  const document = getActiveDocument(folder);
  const title = prompt("Document title", document.title)?.trim();
  if (!title) return;
  document.title = title;
  saveFolders(folders);
  renderDocument();
});

googleDocButton.addEventListener("click", () => {
  const folders = getFolders();
  const folder = getActiveFolder(folders);
  const document = getActiveDocument(folder);
  const currentUrl = document.googleDocUrl || "";
  const response = prompt("Paste a Google Docs share or published URL. Leave blank to remove it.", currentUrl);
  if (response === null) return;
  const url = response.trim();
  if (!url) {
    delete document.googleDocUrl;
    document.type = document.fileDataUrl ? "file" : "normal";
  } else {
    const previewUrl = getGoogleDocPreviewUrl(url);
    if (!previewUrl) {
      alert("That does not look like a Google Docs URL.");
      return;
    }
    document.type = "google";
    document.googleDocUrl = url;
    delete document.fileName;
    delete document.fileType;
    delete document.fileDataUrl;
  }
  saveFolders(folders);
  renderDocument();
});

openGoogleDocButton.addEventListener("click", () => {
  const document = getActiveDocument(getActiveFolder());
  if (!document.googleDocUrl) return;
  window.open(document.googleDocUrl, "_blank", "noopener,noreferrer");
});

annotateFileButton.addEventListener("click", async () => {
  const document = getActiveDocument(getActiveFolder());
  if (!document.fileDataUrl) return;
  annotationTitle.textContent = document.title || "annotate";
  annotationFrame.src = document.fileDataUrl;
  setAnnotationTool("scroll");
  annotationDialog.showModal();
  await new Promise((resolve) => requestAnimationFrame(resolve));
  const lowestAnnotation = Math.max(0, ...(document.annotations || []).map((annotation) => annotation.pageY || 0));
  const documentHeight = await getAnnotationDocumentHeight(document);
  setAnnotationPageHeight(Math.max(documentHeight, lowestAnnotation + 160));
  annotationCanvas.scrollTop = 0;
  renderAnnotations();
});

annotationToolButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setAnnotationTool(button.dataset.annotationTool);
  });
});

annotationLayer.addEventListener("click", addAnnotationAt);
annotationCanvas.addEventListener("wheel", scrollAnnotationFile, { passive: false });

closeAnnotationButton.addEventListener("click", () => {
  annotationDialog.close();
  annotationFrame.src = "";
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
  resetEventEditor();
  eventDialog.close();
});

eventForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const events = readEvents();
  const value = eventInput.value.trim();
  if (value) {
    if (editingEventIndex >= 0 && events[selectedEventDate]?.[editingEventIndex]) {
      events[selectedEventDate][editingEventIndex] = value;
    } else {
      events[selectedEventDate] = [...(events[selectedEventDate] || []), value];
    }
    resetEventEditor();
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

async function initApp() {
  await loadCloudState();
  renderCalendar();
  renderTodos();
  renderSong();
  renderQuote();
  searchInput.focus();
}

initApp();
