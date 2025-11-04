// Theme toggle: toggles data-theme on documentElement
const themeBtn = document.getElementById('themeToggle');
const mobileThemeBtn = document.getElementById('mobileThemeToggle');
const root = document.documentElement;

// Mobile Navigation
let isMobileView = window.innerWidth <= 599;
const chatMain = document.querySelector('.chat-main');
const chatsCol = document.querySelector('.chats-col');

// Update isMobileView on resize
window.addEventListener('resize', () => {
    isMobileView = window.innerWidth <= 599;
    if (!isMobileView) {
        // Reset any mobile-specific states when returning to larger screens
        chatMain?.classList.remove('slide-left');
        chatsCol?.classList.remove('hidden');
    }
});

// If you want to remember theme during page session only, keep it simple:
// Function to toggle theme
function toggleTheme() {
  if (root.hasAttribute('data-theme')) {
    root.removeAttribute('data-theme');
    document.querySelectorAll('.fa-sun').forEach(icon => icon.classList.replace('fa-sun', 'fa-moon'));
  } else {
    root.setAttribute('data-theme', 'dark');
    document.querySelectorAll('.fa-moon').forEach(icon => icon.classList.replace('fa-moon', 'fa-sun'));
  }
}

// Add click handlers for both buttons
themeBtn?.addEventListener('click', toggleTheme);
mobileThemeBtn?.addEventListener('click', toggleTheme);

// Simple send message demo (adds your message to chat as right aligned blue bubble)
const sendBtn = document.getElementById('sendMsg');
const messageText = document.getElementById('messageText');
const chatBody = document.getElementById('chatBody');

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
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

sendBtn?.addEventListener('click', () => {
  const txt = messageText.value.trim();
  if (!txt) return;
  appendOutgoing(txt);
  messageText.value = '';
});

// also send on Enter
messageText?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendBtn.click();
  }
});

// Handle mobile navigation
let touchStartX = 0;
let touchEndX = 0;

// Handle chat item click to open chat
document.addEventListener('click', (e) => {
    if (!isMobileView) return;
    if (e.target.closest('.chat-item')) {
        chatMain.classList.add('slide-left');
        chatsCol.classList.add('hidden');
    }
});

// Handle swipe gesture
document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (e) => {
    if (!isMobileView) return;
    
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 100; // minimum distance for swipe
    const swipeDistance = touchEndX - touchStartX;
    
    // If swiped right while in chat view
    if (swipeDistance > swipeThreshold && chatMain.classList.contains('slide-left')) {
        chatMain.classList.remove('slide-left');
        chatsCol.classList.remove('hidden');
    }
}// ---------------- Mobile input keyboard handling ----------------
const msgInput = document.getElementById('messageText');
const chatBody = document.getElementById('chatBody');
const chatInputWrapper = document.querySelector('.chat-input');

msgInput.addEventListener('focus', () => {
    // delay to let keyboard open
    setTimeout(() => {
        // Scroll chat to bottom
        chatBody.scrollTop = chatBody.scrollHeight;

        // On mobile, keep input above keyboard
        if (window.innerWidth <= 768) {
            chatInputWrapper.style.position = 'absolute';
            chatInputWrapper.style.bottom = '10px';
            chatInputWrapper.style.width = '95%';
            chatInputWrapper.style.left = '50%';
            chatInputWrapper.style.transform = 'translateX(-50%)';

            // Optional: add padding-bottom to chat-body so last messages are visible
            chatBody.style.paddingBottom = (chatInputWrapper.offsetHeight + 20) + 'px';
        }
    }, 300);
});

msgInput.addEventListener('blur', () => {
    // Reset styles
    if (window.innerWidth <= 768) {
        chatInputWrapper.style.position = '';
        chatInputWrapper.style.bottom = '';
        chatInputWrapper.style.width = '';
        chatInputWrapper.style.left = '';
        chatInputWrapper.style.transform = '';
        chatBody.style.paddingBottom = '18px';
    }
});

// Auto-expand input height when typing
msgInput.addEventListener('input', () => {
    msgInput.style.height = 'auto';
    msgInput.style.height = msgInput.scrollHeight + 'px';
    if (msgInput.value.trim() === '') msgInput.style.height = '40px';
});
