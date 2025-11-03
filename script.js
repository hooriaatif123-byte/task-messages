// Theme toggle: toggles data-theme on documentElement
const themeBtn = document.getElementById('themeToggle');
const root = document.documentElement;

// If you want to remember theme during page session only, keep it simple:
themeBtn?.addEventListener('click', () => {
  if (root.hasAttribute('data-theme')) {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', 'dark');
  }
});

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
