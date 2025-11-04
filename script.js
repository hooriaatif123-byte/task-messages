// ---------------- Theme Toggle ----------------
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

// ---------------- Chat Send ----------------
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
}

sendBtn?.addEventListener('click', () => {
    const txt = messageText.value.trim();
    if (!txt) return;
    appendOutgoing(txt);
    messageText.value = '';
});

// Send on Enter
messageText?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendBtn.click();
    }
});

// ---------------- Mobile Navigation ----------------
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

document.addEventListener('click', (e) => {
    if (!isMobileView) return;
    if (e.target.closest('.chat-item')) {
        chatMain.classList.add('slide-left');
        chatsCol.classList.add('hidden');
    }
});

let touchStartX = 0;
let touchEndX = 0;
document.addEventListener('touchstart', (e) => touchStartX = e.changedTouches[0].screenX, false);
document.addEventListener('touchend', (e) => {
    if (!isMobileView) return;
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX - touchStartX > 100 && chatMain.classList.contains('slide-left')) {
        chatMain.classList.remove('slide-left');
        chatsCol.classList.remove('hidden');
    }
}, false);

// ---------------- Mobile Input Keyboard Fix Enhanced ----------------
const chatInputWrapper = document.querySelector('.chat-input');

function adjustForKeyboard() {
    if (!window.visualViewport || window.innerWidth > 768) {
        // Reset styles for non-mobile
        chatInputWrapper.style.position = '';
        chatInputWrapper.style.bottom = '';
        chatInputWrapper.style.left = '';
        chatInputWrapper.style.width = '';
        chatInputWrapper.style.zIndex = '';
        chatBody.style.paddingBottom = '18px';
        return;
    }

    const viewportHeight = window.visualViewport.height;
    const windowHeight = window.innerHeight;
    const keyboardHeight = windowHeight - viewportHeight;

    if (keyboardHeight > 150) { // keyboard likely open
        chatInputWrapper.style.position = 'fixed';
        chatInputWrapper.style.bottom = keyboardHeight + 'px';
        chatInputWrapper.style.left = '0';
        chatInputWrapper.style.width = '100%';
        chatInputWrapper.style.zIndex = '999';

        chatBody.style.paddingBottom = (chatInputWrapper.offsetHeight + keyboardHeight) + 'px';
        chatBody.scrollTop = chatBody.scrollHeight;
    } else {
        // keyboard closed or minimized
        chatInputWrapper.style.position = 'fixed';
        chatInputWrapper.style.bottom = '0';
        chatInputWrapper.style.left = '0';
        chatInputWrapper.style.width = '100%';
        chatInputWrapper.style.zIndex = '999';
        chatBody.style.paddingBottom = chatInputWrapper.offsetHeight + 'px';
    }
}

messageText.addEventListener('focus', () => {
    setTimeout(() => {
        adjustForKeyboard();
    }, 300);
});

messageText.addEventListener('blur', () => {
    setTimeout(() => {
        adjustForKeyboard();
    }, 300);
});

// Call on load and resize
window.addEventListener('resize', adjustForKeyboard);

if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', adjustForKeyboard);
  window.visualViewport.addEventListener('scroll', adjustForKeyboard);
}

adjustForKeyboard();

// ---------------- Auto-expand Input ----------------
messageText.addEventListener('input', () => {
    messageText.style.height = 'auto';
    messageText.style.height = messageText.scrollHeight + 'px';
    if (messageText.value.trim() === '') messageText.style.height = '40px';
});
