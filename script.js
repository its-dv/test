"use strict";

// Import translations
import { translations } from "./translations.js";

// Notes data structure
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let currentNoteId = null;

// Render all the notes
function renderNotes() {
  const list = document.getElementById("notesList");
  list.innerHTML = "";

  notes.forEach(note => {
    const li = document.createElement("li");
    if (note.id === currentNoteId) {
      li.classList.add("active");
    }

    const titleSpan = document.createElement("span");
    titleSpan.textContent = note.title;
    titleSpan.onclick = () => openNote(note.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✕";
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      deleteNote(note.id);
    };

    li.appendChild(titleSpan);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

// Open a note
function openNote(id) {
  const note = notes.find(n => n.id === id);
  if (note) {
    currentNoteId = id;
    document.getElementById("titleInput").value = note.title;
    document.getElementById("noteTitle").textContent = note.title;
    document.getElementById("notepad").value = note.content;
    updateUI();
  }
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
      };
    }
    currentNoteId = null;
  } else {
    notes.push({
      id:Date.now(),
      title,
      content
    });
  }

  localStorage.setItem("notes", JSON.stringify(notes));
  document.getElementById('titleInput').value='';
  document.getElementById('notepad').value='';
  renderNotes();
  showToast(translate("noteCreated"));
}

// Delete a note
function deleteNote(id){
  notes = notes.filter(n => n.id !== id);

  if (currentNoteId === id) {
    currentNoteId = null;
    document.getElementById('titleInput').value='';
    document.getElementById('notepad').value='';
    document.getElementById("noteTitle").textContent = "Untitled";
  }

  localStorage.setItem(
    'notes',
    JSON.stringify(notes)
  );
  renderNotes();
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

  renderNotes();
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

textarea.addEventListener("input", () => {
  countCharacters();
});

function updateUI() {
  countCharacters();
}

// Language selection
document.querySelectorAll('input[name="language"]').forEach(input => {
  input.addEventListener("change", (e) => {
    const lang = e.target.value;
    changeLanguage(lang);
  });
});

// Default language
let currentLang = localStorage.getItem("lang") || "en";
function translate(key) {
  return translations[currentLang][key] || key;
}

// Update all text content based on the selected language
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

// Change language and save the preference
function changeLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);

  updateTexts();
  updateUI();
}

// Set current language radio button as checked
document.querySelector(`input[value="${currentLang}"]`).checked = true;