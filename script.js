// ================= Theme Toggle =================
const themeBtn = document.getElementById('themeToggle');
const mobileThemeBtn = document.getElementById('mobileThemeToggle');
const root = document.documentElement;

function toggleTheme() {
  if (root.hasAttribute('data-theme')) {
    root.removeAttribute('data-theme');
    document.querySelectorAll('.fa-sun').forEach(icon => icon.classList.replace('fa-sun', 'fa-moon'));
  } else {
    root.setAttribute('data-theme', 'dark');
    document.querySelectorAll('.fa-moon').forEach(icon => icon.classList.replace('fa-moon', 'fa-sun'));
  }
}

themeBtn?.addEventListener('click', toggleTheme);
mobileThemeBtn?.addEventListener('click', toggleTheme);


// ================= Chat Send =================
const sendBtn = document.getElementById('sendMsg');
const messageText = document.getElementById('messageText');
const chatBody = document.getElementById('chatBody');

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function appendOutgoing(text) {
  if (!text || !chatBody) return;

  const row = document.createElement('div');
  row.className = 'msg-row right';

  const avatar = document.createElement('img');
  avatar.className = 'msg-avatar';
  avatar.src = 'https://i.pravatar.cc/40?img=28';
  avatar.alt = 'You';

  const block = document.createElement('div');
  block.className = 'msg-block';

  const meta = document.createElement('div');
  meta.className = 'msg-meta';
  meta.innerHTML = `<strong>You</strong> <span class="msg-time">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>`;

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble sent';
  bubble.innerHTML = `<p>${escapeHtml(text)}</p>`;

  block.appendChild(meta);
  block.appendChild(bubble);

  row.appendChild(block);
  row.appendChild(avatar);

  chatBody.appendChild(row);
  chatBody.scrollTop = chatBody.scrollHeight;
  messageText.value = '';
  messageText.style.height = '40px'; // reset input height
}

sendBtn?.addEventListener('click', () => {
  const txt = messageText.value.trim();
  if (!txt) return;
  appendOutgoing(txt);
});

// Send on Enter
messageText?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendBtn.click();
  }
});

// ================= Mobile Navigation =================
let isMobileView = window.innerWidth <= 599;
const chatMain = document.querySelector('.chat-main');
const chatsCol = document.querySelector('.chats-col');

window.addEventListener('resize', () => {
  isMobileView = window.innerWidth <= 599;
  if (!isMobileView) {
    chatMain?.classList.remove('slide-left');
    chatsCol?.classList.remove('hidden');
  }
});

let touchStartX = 0;
let touchEndX = 0;

// Click chat to open (mobile)
document.addEventListener('click', (e) => {
  if (!isMobileView) return;
  if (e.target.closest('.chat-item')) {
    chatMain.classList.add('slide-left');
    chatsCol.classList.add('hidden');
  }
});

// Swipe to go back
document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (e) => {
  if (!isMobileView) return;
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, false);

function handleSwipe() {
  const swipeThreshold = 100;
  if (touchEndX - touchStartX > swipeThreshold && chatMain.classList.contains('slide-left')) {
    chatMain.classList.remove('slide-left');
    chatsCol.classList.remove('hidden');
  }
}

// ================= Mobile Keyboard Handling =================
const chatInputWrapper = document.querySelector('.chat-input');

function adjustForKeyboard() {
  if (window.innerWidth > 768) return;

  chatBody.scrollTop = chatBody.scrollHeight;

  chatInputWrapper.style.position = 'fixed';
  chatInputWrapper.style.bottom = '0';
  chatInputWrapper.style.left = '0';
  chatInputWrapper.style.width = '100%';
  chatInputWrapper.style.zIndex = '10';

  chatBody.style.paddingBottom = (chatInputWrapper.offsetHeight + 10) + 'px';
}

function resetKeyboardAdjustment() {
  if (window.innerWidth > 768) return;

  chatInputWrapper.style.position = '';
  chatInputWrapper.style.bottom = '';
  chatInputWrapper.style.left = '';
  chatInputWrapper.style.width = '';
  chatInputWrapper.style.zIndex = '';
  chatBody.style.paddingBottom = '18px';
}

messageText.addEventListener('focus', () => setTimeout(adjustForKeyboard, 300));
messageText.addEventListener('blur', resetKeyboardAdjustment);

// ================= Auto-Expand Input Height =================
messageText.addEventListener('input', () => {
  messageText.style.height = 'auto';
  messageText.style.height = messageText.scrollHeight + 'px';
  if (messageText.value.trim() === '') messageText.style.height = '40px';
});
