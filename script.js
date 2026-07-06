// Import translations
import { translations } from "./translations.js";

// Notes data structure
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentNoteId;

// DOM elements
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

    noteTitle.value = note.title;
    textArea.value = note.content;
    countCharacters();
  }
}

// Save note
const saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', saveNote);
function saveNote() {
  const title = noteTitle.value;
  const content = textArea.value;

  if (!title && !content) {
    showToast(translate('nothingToSave'));
    return;
  } else if (!title) {
    showToast(translate('noTitleToSave'));
    return;
  } else if (!content) {
    showToast(translate('noContentToSave'));
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
    localStorage.removeItem('noteId');
  } else {
    const id = Date.now();
    notes.push({
      id,
      title,
      content
    });
  }

  localStorage.setItem('notes', JSON.stringify(notes));
  noteTitle.value = translations[currentLang]["untitledNote"];
  textArea.value = "";

  showToast(translate('noteSaved'));
  renderNotes();
  countCharacters();
}

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
    noteTitle.value = translations[currentLang]["untitledNote"];
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
  translateDropdown.classList.remove('active');
  settingsOverlay.classList.toggle('active');
});

// Switch between light and dark themes
const themeButton = document.getElementById('themeButton');
themeButton.addEventListener('click', switchTheme);
function switchTheme() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');

  const icon = document.getElementById('themeIcon');
  icon.src = document.documentElement.classList.contains('dark')
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

// Toggle trash panel visibility
const trashButton = document.getElementById('trashButton');
const trashPanel = document.getElementById('trashPanel');
trashButton.addEventListener('click', () => {
  trashPanel.classList.toggle('active');
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

// Load saved data on page load
document.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem('theme');
  const icon = document.getElementById('themeIcon');
  icon.src = theme === 'dark'
    ? "images/sun.svg"
    : "images/moon.svg"

  // Icons preloading
  const preload = (src) => {
    const img = new Image();
    img.src = src;
  };

  // Load current note
  const savedId = localStorage.getItem('noteId');
  notes = JSON.parse(localStorage.getItem('notes')) || [];
  if (savedId) {
    const note = notes.find(n => n.id === Number(savedId));
    if (note) {
      currentNoteId = note.id;
      noteTitle.value = note.title;
      textArea.value = note.content;
    }
  }

  renderNotes();
  countCharacters();
  preload("images/sun.svg");
  preload("images/moon.svg");
  preload("images/pencil.svg")
  preload("images/tick.svg");
});

// Initialize UI translations
updateTexts();