// --- 1. Global Dropdown / Popover Logic ---
document.addEventListener('click', (e) => {
  const isDropdownButton = e.target.closest('#modelSelectorBtn, .js-toggle-chat-options, .js-toggle-profile, .js-toggle-nested, .js-toggle-attachment, .js-toggle-organize');
  const isClickInsideDropdown = e.target.closest('.dropdown_menu');

  const closeAllDropdowns = (exceptMenu = null) => {
    document.querySelectorAll('.dropdown_menu.is-open').forEach(menu => {
      if (menu !== exceptMenu && !menu.contains(exceptMenu)) {
        menu.classList.remove('is-open');

        if (menu.id === 'attachmentMenu') {
          const suggestions = document.querySelector('.suggestions');
          if (suggestions) suggestions.style.display = 'flex';
        }
      }
    });
  };

  if (!isDropdownButton && !isClickInsideDropdown) {
    closeAllDropdowns();
    return;
  }

  if (isDropdownButton) {
    const wrapper = isDropdownButton.closest('.popover_wrapper');
    const targetMenu = wrapper.querySelector(':scope > .dropdown_menu');

    if (isDropdownButton.classList.contains('js-toggle-nested')) {
      const siblingMenus = isDropdownButton.closest('.dropdown_menu').querySelectorAll('.nested_menu');
      siblingMenus.forEach(menu => {
        if (menu !== targetMenu) menu.classList.remove('is-open');
      });
    } else {
      closeAllDropdowns(targetMenu);
    }

    if (targetMenu) {
      const isOpen = targetMenu.classList.toggle('is-open');

      if (targetMenu.id === 'attachmentMenu') {
        const suggestions = document.querySelector('.suggestions');
        if (suggestions) suggestions.style.display = isOpen ? 'none' : 'flex';
      }

      if (isOpen && targetMenu.classList.contains('dropdown_menu--right') && !targetMenu.classList.contains('nested_menu')) {
        const btnRect = isDropdownButton.getBoundingClientRect();
        targetMenu.style.position = 'fixed';
        targetMenu.style.top = `${btnRect.top}px`;
        targetMenu.style.left = `${btnRect.right + 8}px`; 
        targetMenu.style.bottom = 'auto';
        targetMenu.style.right = 'auto';
      }
    }
  }
});

const sidebarContent = document.querySelector('.sidebar_content');
if (sidebarContent) {
  sidebarContent.addEventListener('scroll', () => {
    document.querySelectorAll('.dropdown_menu.is-open').forEach(menu => {
      menu.classList.remove('is-open');
    });
  });
}

// --- 2. Search Modal Logic ---
const searchTriggerBtn = document.querySelector('#searchTriggerBtn');
const searchModal = document.querySelector('#searchModal');
const closeSearchModalBtn = document.querySelector('#closeSearchModalBtn');

if (searchTriggerBtn && searchModal) {
  searchTriggerBtn.addEventListener('click', () => {
    searchModal.classList.add('is-open');
    setTimeout(() => searchModal.querySelector('.search_modal_input').focus(), 100);
  });
}

if (closeSearchModalBtn) {
  closeSearchModalBtn.addEventListener('click', () => {
    searchModal.classList.remove('is-open');
  });
}

if (searchModal) {
  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
      searchModal.classList.remove('is-open');
    }
  });
}

// --- 3. Attachment Preview Card Logic ---
const removeFileBtn = document.querySelector('#removeFileBtn');
const attachmentPreview = document.querySelector('#attachmentPreview');

if (removeFileBtn && attachmentPreview) {
  removeFileBtn.addEventListener('click', () => {
    attachmentPreview.classList.add('hidden'); 
  });
}

// --- 4. Chat Engine & State Toggle Logic ---
const chatInput = document.querySelector('#chatInput');
const chatGreeting = document.querySelector('#chatGreeting');
const chatSuggestions = document.querySelector('#chatSuggestions');
const chatFeed = document.querySelector('#chatFeed');

if (chatInput && chatGreeting && chatSuggestions && chatFeed) {
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && chatInput.value.trim() !== '') {
      const userText = chatInput.value.trim();

      chatInput.value = '';
      chatGreeting.classList.add('hidden');
      chatSuggestions.classList.add('hidden');
      chatFeed.classList.remove('hidden');

      if (typeof appendUserMessage === 'function') {
        appendUserMessage(userText);
      }

      setTimeout(() => {
        if (typeof appendAssistantMessage === 'function') {
          if (userText.toLowerCase().includes('code') || userText.toLowerCase().includes('server')) {
            appendAssistantMessage(mockResponses.code.text, mockResponses.code);
          } else {
            appendAssistantMessage(mockResponses.general);
          }
        }
      }, 1500);
    }
  });
}

// =========================================================================
// --- 5. NEW: DYNAMIC DATA INJECTION (Sidebar & Search) ---
// =========================================================================

function renderSidebar() {
  const historyGroups = document.querySelectorAll('.history_group');
  if (historyGroups.length < 2) return; 
  
  const recentList = historyGroups[1].querySelector('.group_list');
  if (!recentList) return;

  // Clear hardcoded HTML
  recentList.innerHTML = ''; 

  if (typeof chatHistory === 'undefined') return;

  chatHistory.forEach(chat => {
    const li = document.createElement('li');
    li.classList.add('group_item');
    li.innerHTML = `<a href="#" class="group_link" data-id="${chat.id}">${chat.title}</a>`;
    recentList.appendChild(li);
  });
}

function renderSearchModal(searchTerm = '') {
  const searchBody = document.querySelector('.search_body');
  if (!searchBody) return;
  if (typeof chatHistory === 'undefined') return;

  const groupedChats = { Today: [], Yesterday: [], Older: [] };
  
  chatHistory.forEach(chat => {
    if (chat.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      if (groupedChats[chat.group]) groupedChats[chat.group].push(chat);
    }
  });

  let html = `
    <button class="new_chat_row">
      <img src="./assets/icons/edit.svg" alt="" /> New chat
    </button>
  `;

  for (const [groupName, chats] of Object.entries(groupedChats)) {
    if (chats.length > 0) {
      html += `<div class="search_group"><h3 class="group_title">${groupName}</h3>`;
      chats.forEach(chat => {
        html += `
          <button class="chat_row" data-id="${chat.id}">
            <img src="./assets/icons/chat-bubble.svg" alt="" /> ${chat.title}
          </button>
        `;
      });
      html += `</div>`;
    }
  }
  searchBody.innerHTML = html;
}

// Live Search Listener
const searchModalInputField = document.querySelector('.search_modal_input');
if (searchModalInputField) {
  searchModalInputField.addEventListener('input', (e) => {
    renderSearchModal(e.target.value);
  });
}

// Initialize dynamic rendering on page load
renderSidebar();
renderSearchModal();


// =========================================================================
// --- 6. NEW: CHAT SWITCHING LOGIC (Click to load past chats) ---
// =========================================================================

function loadChat(chatId) {
  if (typeof chatHistory === 'undefined') return;
  const chat = chatHistory.find(c => c.id === chatId);
  if (!chat) return;

  // Reset UI elements
  if (chatGreeting) chatGreeting.classList.add('hidden');
  if (chatSuggestions) chatSuggestions.classList.add('hidden');
  
  if (chatFeed) {
    chatFeed.classList.remove('hidden');
    chatFeed.innerHTML = ''; 
  }

  // Inject messages from the selected chat history
  chat.messages.forEach(msg => {
    if (msg.role === 'user' && typeof appendUserMessage === 'function') {
      appendUserMessage(msg.content);
    } else if (msg.role === 'assistant' && typeof appendAssistantMessage === 'function') {
      appendAssistantMessage(msg.content, msg.code); 
    }
  });

  // Close the search modal if it was open
  if (searchModal) searchModal.classList.remove('is-open');
}

// Event Delegation for clicking on dynamic chat links
document.addEventListener('click', (e) => {
  
  // 1. If they click a link in the sidebar
  const chatLink = e.target.closest('.group_link');
  if (chatLink && chatLink.dataset.id) {
    e.preventDefault();
    loadChat(chatLink.dataset.id);
  }

  // 2. If they click a button in the search modal
  const chatRow = e.target.closest('.chat_row');
  if (chatRow && chatRow.dataset.id) {
    e.preventDefault();
    loadChat(chatRow.dataset.id);
  }
});