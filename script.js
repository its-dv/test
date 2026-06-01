"use strict";

// Notes structure
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let currentNoteId = null;

// Create a new note
function createNote() {
  const note = {
    id: Date.now(),
    title: "Untitled",
    content: "",
    updatedAt: Date.now()
  };

  notes.push(note);
  currentNoteId = note.id;

  saveToStorage();
  showToast(translate("noteCreated"));
}

// Render all the notes
function renderNotes() {
  const list = document.getElementById("notesList");
  list.innerHTML = "";

  notes.forEach(note => {
    const li = document.createElement("li");
    li.textContent = note.title;

    li.onclick = () => openNote(note.id);
    list.appendChild(li);
  });
}

// Save a note
function saveNote() {
  const title = document.getElementById("titleInput").value;
  const content = document.getElementById("notepad").value;

  if (!title || !content) {
    showToast(translate("nothingToSave"));
    return;
  }
  
  if (currentNoteId) {
    for (let i = 0; i < notes.length; i++) {
      if (notes[i].id === currentNoteId) {
        notes[i].title = title;
        notes[i].content = content;
      }
    }
  } else {
    notes.push({
      id:Date.now(),
      title,
      content
    });
  }

  localStorage.setItem("notes", JSON.stringify(notes));
  document.getElementById('title').value='';
  document.getElementById('content').value='';
}

// Rename the note title
const titleInput = document.getElementById('titleInput');
const noteTitle = document.getElementById('noteTitle');

titleInput.addEventListener('input', () => {
  noteTitle.textContent = titleInput.value;
});

// Show and hide the title input field
const input = document.getElementById('titleInput');
input.value = localStorage.getItem('noteTitle') || '';

function popup() {
  const titleInput = document.getElementById('titleInput');
  const icon = document.querySelector('#titleRename img');

  if (titleInput.style.display === "none") {
    titleInput.style.display = 'block';
    icon.src = "images/tick.svg";
  } else {
    titleInput.style.display = 'none';
    icon.src = "images/pencil.svg";
    localStorage.setItem('noteTitle', input.value);
  }
}

// Save notes to localStorage
function saveToStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// script.js - index.html
const textarea = document.getElementById("notepad");

// Save text in localStorage
function saveText() {
  if (textarea.value !== "") {
    localStorage.setItem("notepadContent", textarea.value);
    showToast(translate("textSaved"));
  } else {
    showToast(translate("nothingToSave"));
  }

  updateUI();
}

// Ctrl + S to save
window.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && (event.key.toLowerCase() === "s" || event.key.toLowerCase() === "ы")) {
    event.preventDefault();
    saveText();
  }
});

// Load text from localStorage
function loadText() {
  const saved = localStorage.getItem("notepadContent");
  if (saved !== null) {
    textarea.value = saved;
    showToast(translate("textLoaded"));
  } else {
    showToast(translate("nothingToLoad"));
  }

  updateUI();
}

// Ctrl + L to load
window.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && (event.key.toLowerCase() === "l" || event.key.toLowerCase() === "д")) {
    event.preventDefault();
    loadText();
  }
});

// Clear the notepad
function clearNotepad() {
  const saved = localStorage.getItem("notepadContent");
  if (saved !== null || textarea.value !== "") {
    showToast(translate("noteCleared"));
    textarea.value = "";
    localStorage.removeItem("notepadContent");
  } else {
    showToast(translate("noteAlreadyCleared"));
  }

  updateUI();
}

// Switch between light and dark themes
function switchTheme() {
  document.body.classList.toggle("dark");

  const icon = document.getElementById("themeIcon");

  if (document.body.classList.contains("dark")) {
    icon.src = "images/sun.svg";
  } else {
    icon.src = "images/moon.svg";
  }

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  }
  else {
    localStorage.setItem("theme", "light");
  }
}

// Show a message about saving/loading/clearing
function showToast(text) {
  const el = document.getElementById("toast");
  el.textContent = text;
  el.classList.add("show");

  setTimeout(() => {
    el.classList.remove("show");
  }, 2000);
}

// Show a message about copying/cutting/pasting
document.addEventListener('copy', () => {
  showToast(translate("textCopy"));
});
document.addEventListener('paste', () => {
  showToast(translate("textPaste"));
});
document.addEventListener('cut', () => {
  showToast(translate("textCut"));
});

// Load saved text, title, and theme on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedTitle = localStorage.getItem("noteTitle") || "";
  if (savedTitle == null || savedTitle == "") {
    noteTitle.textContent = "Untitled";
  } else {
    titleInput.value = savedTitle;
    noteTitle.textContent = savedTitle;
  }

  const savedText = localStorage.getItem("notepadContent");
  if (savedText !== null) {
    textarea.value = savedText;
  }

  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
    document.getElementById("themeIcon").src = "images/sun.svg";
  } else {
    document.getElementById("themeIcon").src = "images/moon.svg";
  }

  updateUI();
});

const translateButton = document.getElementById("translateButton");
const menu = document.getElementById("dropdownTranslate");

translateButton.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

// Character counter
function countCharacters() {
  const characters = textarea.value;
  let count = 0;
  for (let i = 0; i < characters.length; i++) {
    count++;
  }
  document.getElementById("characterCounter").textContent = translate("characterCounter") + count;
}

document.addEventListener("DOMContentLoaded", () => {
  updateUI();
});

textarea.addEventListener("input", () => {
  countCharacters();
});

function updateUI() {
  countCharacters();
}

// Translations
const translations = {
  en: {
    save: "Save",
    load: "Load",
    clear: "Clear",
    languages: "Languages",
    rights: "© 2026 Simple Notepad. All rights not reserved.",
    textarea: "Write your notes here...",
    characterCounter: "Character count: ",
    characterCounterError: "Character count: something went wrong...",
    textSaved: "Text saved",
    nothingToSave: "Nothing to save",
    textLoaded: "Text loaded",
    nothingToLoad: "Nothing saved yet",
    noteAlreadyCleared: "Note already cleared",
    noteCleared: "Note cleared",
    noteCreated: "Note created",
    textCopy: "Text copied",
    textPaste: "Text pasted",
    textCut: "Text cut"
  },
  de: {
    save: "Speichern",
    load: "Laden",
    clear: "Löschen",
    languages: "Sprachen",
    rights: "© 2026 Simple Notepad. Alle Rechte nicht reserviert.",
    textarea: "Schreiben Sie Ihre Notizen hier...",
    characterCounter: "Zeichenanzahl: ",
    characterCounterError: "Zeichenanzahl: etwas ist schief gelaufen...",
    textSaved: "Text gespeichert",
    nothingToSave: "Nichts zum Speichern",
    textLoaded: "Text geladen",
    nothingToLoad: "Nichts gespeichert yet",
    noteAlreadyCleared: "Notiz bereits gelöscht",
    noteCleared: "Notiz gelöscht",
    noteCreated: "Notiz erstellt",
    textCopy: "Text kopiert",
    textPaste: "Text eingefügt",
    textCut: "Text ausgeschnitten"
  },
  fr: {
    save: "Enregistrer",
    load: "Charger",
    clear: "Effacer",
    languages: "Langues",
    rights: "© 2026 Simple Notepad. Tous droits non réservés.",
    textarea: "Écrivez vos notes ici...",
    characterCounter: "Nombre de caractères : ",
    characterCounterError: "Nombre de caractères : quelque chose s'est mal passé...",
    textSaved: "Texte enregistré",
    nothingToSave: "Rien à enregistrer",
    textLoaded: "Texte chargé",
    nothingToLoad: "Rien enregistré pour le moment",
    noteAlreadyCleared: "Note déjà effacée",
    noteCleared: "Note effacée",
    noteCreated: "Note créée",
    textCopy: "Texte copié",
    textPaste: "Texte collé",
    textCut: "Texte coupé"
  },
  ru: {
    save: "Сохранить",
    load: "Загрузить",
    clear: "Очистить",
    languages: "Языки",
    rights: "© 2026 Simple Notepad. Все права не защищены.",
    textarea: "Напишите свои заметки здесь...",
    characterCounter: "Количество символов: ",
    characterCounterError: "Количество символов: что-то пошло не так...",
    textSaved: "Текст сохранён",
    nothingToSave: "Нечего сохранять",
    textLoaded: "Текст загружен",
    nothingToLoad: "Пока ничего не сохранено",
    noteAlreadyCleared: "Заметка уже очищена",
    noteCleared: "Заметка очищена",
    noteCreated: "Заметка создана",
    textCopy: "Текст скопирован",
    textPaste: "Текст вставлен",
    textCut: "Текст вырезан"
  }
};

document.querySelectorAll('input[name="language"]').forEach(input => {
  input.addEventListener("change", (e) => {
    const lang = e.target.value;
    changeLanguage(lang);
  });
});

let currentLang = localStorage.getItem("lang") || "en";

function translate(key) {
  return translations[currentLang][key] || key;
}

function updateTexts() {
  // Simple text content
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = translate(el.dataset.i18n);
  });

  // Placeholder text content
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = translate(el.dataset.i18nPlaceholder);
  });
}

function changeLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);

  updateTexts();
  updateUI()
}

updateTexts();

document.querySelector(`input[value="${currentLang}"]`).checked = true;