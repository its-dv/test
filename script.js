"use strict";

// script.js - index.html
const textarea = document.getElementById("notepad");

// Save text in localStorage
function saveText() {
  if (textarea.value !== null && textarea.value !== "") {
    localStorage.setItem("notepadContent", textarea.value);
    showToast("Text saved");
  } else {
    showToast("Nothing to save");
  }
}

// Load text from localStorage
function loadText() {
  const saved = localStorage.getItem("notepadContent");
  if (saved !== null && saved !== "") {
    textarea.value = saved;
    showToast("Text loaded");
  } else {
    showToast("Nothing saved yet");
  }
}

// Clear the notepad
function clearNotepad() {
  textarea.value = "";
  localStorage.removeItem("notepadContent");
  showToast("Text cleared");
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

// Text auto-load when the page is opened
window.onload = () => {
  const saved = localStorage.getItem("notepadContent");
  if (saved) {
    textarea.value = saved;
  }
}

// Theme auto-load when the page is opened
window.onload = () => {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
  }
  const icon = document.getElementById("themeIcon");
  if (document.body.classList.contains("dark")) {
    icon.src = "images/sun.svg";
  }
};

const btn = document.getElementById("translateButton");
const menu = document.getElementById("dropdownTranslate");

btn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

// Translations
const translations = {
  en: {
    save: "Save",
    load: "Load",
    clear: "Clear",
    languages: "Languages",
    rights: "© 2026 Simple Notepad. All rights not reserved.",
    textarea: "Write your notes here..."
  },
  de: {
    save: "Speichern",
    load: "Laden",
    clear: "Löschen",
    languages: "Sprachen",
    rights: "© 2026 Simple Notepad. Alle Rechte nicht reserviert.",
    textarea: "Schreiben Sie Ihre Notizen hier..."
  },
  fr: {
    save: "Enregistrer",
    load: "Charger",
    clear: "Effacer",
    languages: "Langues",
    rights: "© 2026 Simple Notepad. Tous droits non réservés.",
    textarea: "Écrivez vos notes ici..."
  },
  ru: {
    save: "Сохранить",
    load: "Загрузить",
    clear: "Очистить",
    languages: "Языки",
    rights: "© 2026 Simple Notepad. Все права не защищены.",
    textarea: "Напишите свои заметки здесь..."
  }
};

document.querySelectorAll('input[name="language"]').forEach(input => {
  input.addEventListener("change", (e) => {
    const lang = e.target.value;
    changeLanguage(lang);
  });
});

let currentLang = localStorage.getItem("lang") || "en";

function t(key) {
  return translations[currentLang][key] || key;
}

function updateTexts() {
  // Simple text content
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });

  // Placeholder text content
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
}

function changeLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  updateTexts();
}

updateTexts();

document.querySelector(`input[value="${currentLang}"]`).checked = true;