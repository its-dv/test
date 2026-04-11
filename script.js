// script.js - index.html
const textarea = document.getElementById("notepad");

// Save text in localStorage
function saveText() {
  localStorage.setItem("notepadContent", textarea.value);
  alert("Saved!");
}

// Load text from localStorage
function loadText() {
  const saved = localStorage.getItem("notepadContent");
  alert("Loaded!");
  if (saved !== null) {
    textarea.value = saved;
  } else {
    alert("Nothing saved yet.");
  }
}

// Switch between light and dark themes
function switchTheme() {
  if (document.body.style.backgroundColor === 'white') {
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
  } else {
    document.body.style.backgroundColor = 'white';
    document.body.style.color = 'black';
  }
}

// Auto-load when the page is opened
window.onload = () => {
  const saved = localStorage.getItem("notepadContent");
  if (saved) {
    textarea.value = saved;
  }
}