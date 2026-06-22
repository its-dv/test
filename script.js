// Import translations
import { translations } from "./translations.js";

// Notes data structure
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentNoteId;

// DOM elements
const titleInput = document.getElementById('titleInput');
const noteTitle = document.getElementById('noteTitle');
const textArea = document.getElementById('textArea');
const characterCounter = document.getElementById('characterCounter');

// Render all notes
function renderNotes() {
  const list = document.getElementById('notesList');
  list.innerHTML = "";

  notes.forEach(note => {
    const li = document.createElement('li');
    if (note.id === currentNoteId) {
      li.classList.add('active');
    }

    const titleSpan = document.createElement('span');
    titleSpan.textContent = note.title;
    titleSpan.onclick = () => openNote(note.id);

    li.appendChild(titleSpan);
    list.appendChild(li);
  });
}

// Open a note
function openNote(id) {
  const note = notes.find(n => n.id === id);
  if (note) {
    currentNoteId = id;
    localStorage.setItem('noteId', currentNoteId);

    noteTitle.textContent = note.title;
    titleInput.value = note.title;
    textArea.value = note.content;
    countCharacters();
  }
}

// Save note
const saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', saveNote);
function saveNote() {
  const title = noteTitle.textContent;
  const content = textArea.value;

  if (!title || !content) {
    showToast(translate('nothingToSave'));
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

  localStorage.setItem('notes', JSON.stringify(notes));
  noteTitle.textContent = "Untitled";
  titleInput.value = "Untitled";
  textArea.value = "";

  showToast(translate('noteSaved'));
  renderNotes();
  countCharacters();
}

// Update note title
titleInput.addEventListener('input', () => {
  noteTitle.textContent = titleInput.value;
  localStorage.setItem('currentTitle', titleInput.value);
});

// Delete note
const deleteButton = document.getElementById('deleteButton');
deleteButton.addEventListener('click', () => deleteNote(currentNoteId));
function deleteNote(id) {
  const exists = notes.some(n => n.id === id);
  if (!exists) {
    showToast(translate('nothingToDelete'));
    return;
  }

  notes = notes.filter(n => n.id !== id);
  if (currentNoteId === id) {
    currentNoteId = null;
    noteTitle.textContent = "Untitled";
    titleInput.value = "Untitled";
    textArea.value = "";
  }

  localStorage.setItem(
    'notes',
    JSON.stringify(notes)
  );

  showToast(translate('noteDeleted'));
  countCharacters();
  renderNotes();
}

// Show search menu (under development)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.code === 'KeyF') {
    showToast(translate('textFind'));
    e.preventDefault();
  }
});

// Highlight search matches in text (under development)
function highlight(query) {
  let text = textArea.innerText;
  const regex = new RexExp(query, "gi");

  if (!query) {
    editor.innerHTML = text;
    return;
  }

  textArea.innerHTML = text.replace(regex, match => {
    return `<mark>${match}</mark>`;
  });
}

// Toggle title input visibility
const titleRenameButton = document.getElementById('titleRenameButton');
titleRenameButton.addEventListener('click', popup);
function popup() {
  const icon = document.querySelector('#titleRenameButton img');
  const hidden = titleInput.style.display === 'none';

  titleInput.style.display = hidden
    ? 'block'
    : 'none';
  icon.src = hidden
    ? 'images/tick.svg'
    : 'images/pencil.svg';
}

// Show a toast notification
function showToast(text) {
  const el = document.getElementById('toast');  
  el.textContent = text;
  el.classList.add('show');

  setTimeout(() => {
    el.classList.remove('show');
  }, 2000);
}

// Show toast notifications for clipboard actions
document.addEventListener('copy', () => {
  showToast(translate('textCopy'));
});
document.addEventListener('paste', () => {
  showToast(translate('textPaste'));
});
document.addEventListener('cut', () => {
  showToast(translate('textCut'));
});

// Settings panel
const openSettingsButton = document.getElementById('openSettingsButton');
const settingsOverlay = document.getElementById('settingsOverlay');

openSettingsButton.addEventListener('click', () => {
  settingsOverlay.classList.toggle("active");
});

// Switch between light and dark themes
const themeButton = document.getElementById('themeButton');
themeButton.addEventListener('click', switchTheme);
function switchTheme() {
  document.body.classList.toggle('dark');
  const icon = document.getElementById('themeIcon');

  icon.src = document.body.classList.contains('dark')
    ? "images/sun.svg"
    : "images/moon.svg";
}

// Toggle translate dropdown visibility
const translateButton = document.getElementById('translateButton');
const translateDropdown = document.getElementById('translateDropdown');

translateButton.addEventListener('click', () => {
  translateDropdown.classList.toggle('active');
});

// Character counter toggle
const characterCountButton = document.getElementById('characterCountButton');

characterCountButton.addEventListener('click', () => {
  characterCounter.classList.toggle('hidden');
});

// Togglle trash panel visibility
const trashButton = document.getElementById('trashButton');
const trashPanel = document.getElementById('trashPanel');

trashButton.addEventListener('click', () => {
  trashPanel.classList.toggle('hidden');
});

// Character counter
textArea.addEventListener('input', countCharacters);
function countCharacters() {
  const count = textArea.value.length;
  characterCounter.textContent = translate('characterCounter') + count;
}

// Default language
let currentLang = localStorage.getItem('lang') || 'en';
function translate(key) {
  return translations[currentLang][key] || key;
}

// Language selection
document.querySelectorAll('input[name="language"]').forEach(input => {
  input.addEventListener('change', (e) => {
    const lang = e.target.value;
    changeLanguage(lang);
  });
});

// Update text content for selected language
function updateTexts() {
  // Simple text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = translate(el.dataset.i18n);
  });

  // Placeholder text content
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = translate(el.dataset.i18nPlaceholder);
  });
}

// Change language and save the preference
function changeLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);

  updateTexts();
  countCharacters();
}

// Set current language radio button as checked
document.querySelector(`input[value="${currentLang}"]`).checked = true;

// Load saved text, title, and theme on page load
document.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem('theme');
  const icon = document.getElementById('themeIcon');
  if (theme === 'dark') {
    document.body.classList.add('dark');
    icon.src = "images/sun.svg";
  } else {
    icon.src = "images/moon.svg";
  }

  // Icons preloading
  const preload = (src) => {
    const img = new Image();
    img.src = src;
  };

  // Load current note ID
  const savedId = localStorage.getItem('noteId');
  currentNoteId = Number(savedId);

  // Load saved title
  const savedTitle = localStorage.getItem('currentTitle') || "Untitled";
  noteTitle.textContent = savedTitle;
  titleInput.value = savedTitle;

  renderNotes();
  countCharacters();
  preload("images/sun.svg");
  preload("images/moon.svg");
  preload("images/pencil.svg")
  preload("images/tick.svg");
});

// Initialize placeholder text on page load
updateTexts();