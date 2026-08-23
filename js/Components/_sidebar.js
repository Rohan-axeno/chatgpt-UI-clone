// ============================================================
// js/Components/_sidebar.js — Sidebar Logic
// ============================================================

(function () {
  const sidebar = document.querySelector('#sidebar');
  const sidebarToggleBtn = document.querySelector('#sidebarToggleBtn');
  const railExpandBtn = document.querySelector('#railExpandBtn');
  const mobileMenuBtn = document.querySelector('#mobileMenuBtn');
  const sidebarOverlay = document.querySelector('#sidebarOverlay');
  const newChatBtn = document.querySelector('#newChatBtn');

  if (!sidebar) return;

  // ---- Sidebar Toggle (Desktop: collapse to rail, Mobile: drawer) ----
  function toggleSidebar() {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      sidebar.classList.toggle('is-open');
      if (sidebarOverlay) sidebarOverlay.classList.toggle('is-visible');
      document.body.style.overflow = sidebar.classList.contains('is-open') ? 'hidden' : '';
    } else {
      sidebar.classList.toggle('is-collapsed');
    }
  }

  function expandSidebar() {
    sidebar.classList.remove('is-collapsed');
  }

  function collapseSidebar() {
    sidebar.classList.add('is-collapsed');
  }

  function closeMobileSidebar() {
    sidebar.classList.remove('is-open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  // Toggle buttons
  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', toggleSidebar);
  }

  if (railExpandBtn) {
    railExpandBtn.addEventListener('click', expandSidebar);
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeMobileSidebar);
  }

  // ---- Collapsed Rail Button Listeners ----
  document.addEventListener('click', function (e) {
    // Rail: New chat
    if (e.target.closest('.js-new-chat-rail')) {
      resetToNewChat();
      return;
    }

    // Rail: Search
    if (e.target.closest('.js-search-rail')) {
      const searchTriggerBtn = document.querySelector('#searchTriggerBtn');
      if (searchTriggerBtn) searchTriggerBtn.click();
      return;
    }

    // Rail: Pinned
    if (e.target.closest('.js-pinned-rail')) {
      loadChat('pinned-1');
      return;
    }

    // Rail: Recents (expand sidebar or load first recent)
    if (e.target.closest('.js-recents-rail')) {
      expandSidebar();
      return;
    }

    // Rail: Profile / Settings
    if (e.target.closest('.js-toggle-profile-rail')) {
      const settingsModal = document.querySelector('#settingsModal');
      if (settingsModal) settingsModal.classList.add('is-open');
      return;
    }
  });

  // ---- New Chat ----
  if (newChatBtn) {
    newChatBtn.addEventListener('click', function () {
      resetToNewChat();
      closeMobileSidebar();
    });

    newChatBtn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        resetToNewChat();
        closeMobileSidebar();
      }
    });
  }

  function resetToNewChat() {
    const chatGreeting = document.querySelector('#chatGreeting');
    const chatSuggestions = document.querySelector('#chatSuggestions');
    const chatFeed = document.querySelector('#chatFeed');
    const chatContainer = document.querySelector('#chatContainer');
    const chatInput = document.querySelector('#chatInput');

    if (chatGreeting) chatGreeting.classList.remove('hidden');
    if (chatSuggestions) chatSuggestions.classList.remove('hidden');
    if (chatFeed) {
      chatFeed.classList.add('hidden');
      chatFeed.innerHTML = '';
    }
    if (chatContainer) chatContainer.classList.remove('is-chatting');
    if (chatInput) {
      chatInput.value = '';
      chatInput.style.height = 'auto';
      chatInput.focus();
    }

    // Remove active state from all chat links
    document.querySelectorAll('.group_link.is-active').forEach(function (link) {
      link.classList.remove('is-active');
    });

    if (typeof window._resetComposer === 'function') {
      window._resetComposer();
    }

    // Set new chat as active in utils
    document.querySelectorAll('.utils_item').forEach(function (item) {
      item.classList.remove('active');
    });
    if (newChatBtn) newChatBtn.classList.add('active');
  }

  // ---- Collapsible Groups (Pinned toggle) ----
  document.querySelectorAll('.group_toggle_btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const isCollapsed = btn.classList.toggle('is-collapsed');
      const groupList = btn.closest('.history_group').querySelector('.group_list');
      if (groupList) {
        groupList.classList.toggle('is-hidden', isCollapsed);
      }
      btn.setAttribute('aria-expanded', !isCollapsed);
    });
  });

  // ---- Render Sidebar Chat History ----
  function renderSidebar() {
    const recentsList = document.querySelector('#recentsList');
    if (!recentsList || typeof chatHistory === 'undefined') return;

    recentsList.innerHTML = '';

    // Group chats by their group property
    const grouped = {};
    chatHistory.forEach(function (chat) {
      if (!grouped[chat.group]) grouped[chat.group] = [];
      grouped[chat.group].push(chat);
    });

    // Render grouped with date headers
    const groupOrder = ['Today', 'Yesterday', 'Previous 7 days', 'Older'];

    groupOrder.forEach(function (groupName) {
      const chats = grouped[groupName];
      if (!chats || !chats.length) return;

      // Add group header
      const headerLi = document.createElement('li');
      headerLi.className = 'group_title';
      headerLi.textContent = groupName;
      headerLi.setAttribute('role', 'separator');
      recentsList.appendChild(headerLi);

      chats.forEach(function (chat) {
        const li = document.createElement('li');
        li.className = 'group_item';
        li.innerHTML = `
          <a href="#" class="group_link" data-id="${chat.id}">
            ${escapeHtml(chat.title)}
          </a>
          <div class="chat_hover_actions">
            <div class="popover_wrapper">
              <button class="icon_btn js-toggle-chat-options" aria-label="More options">
                <img class="hover_action_icon" src="./assets/icons/dots-horizontal.svg" alt="" aria-hidden="true" />
              </button>
              <div class="dropdown_menu dropdown_menu--right chat_options_menu" role="menu">
                <button class="menu_item js-rename-chat" role="menuitem" data-id="${chat.id}">
                  <img class="menu_item_icon" src="./assets/icons/pencil.svg" alt="" aria-hidden="true" /> Rename
                </button>
                <button class="menu_item text_danger js-delete-chat" role="menuitem" data-id="${chat.id}">
                  <img class="menu_item_icon" src="./assets/icons/cross-1.svg" alt="" aria-hidden="true" /> Delete
                </button>
              </div>
            </div>
          </div>
        `;
        recentsList.appendChild(li);
      });
    });
  }

  // ---- Chat Selection ----
  document.addEventListener('click', function (e) {
    const chatLink = e.target.closest('.group_link[data-id]');
    if (!chatLink) return;

    e.preventDefault();
    const chatId = chatLink.dataset.id;
    loadChat(chatId);
    closeMobileSidebar();

    // Update active state
    document.querySelectorAll('.group_link.is-active').forEach(function (link) {
      link.classList.remove('is-active');
    });
    chatLink.classList.add('is-active');

    // Deactivate new chat
    document.querySelectorAll('.utils_item.active').forEach(function (item) {
      item.classList.remove('active');
    });
  });

  // ---- Delete Chat ----
  document.addEventListener('click', function (e) {
    const deleteBtn = e.target.closest('.js-delete-chat');
    if (!deleteBtn) return;

    const chatId = deleteBtn.dataset.id;
    const index = chatHistory.findIndex(function (c) { return c.id === chatId; });
    if (index > -1) {
      chatHistory.splice(index, 1);
      renderSidebar();
    }

    // Close any open dropdowns
    document.querySelectorAll('.dropdown_menu.is-open').forEach(function (menu) {
      menu.classList.remove('is-open');
    });
  });

  // ---- Rename Chat ----
  document.addEventListener('click', function (e) {
    const renameBtn = e.target.closest('.js-rename-chat');
    if (!renameBtn) return;

    const chatId = renameBtn.dataset.id;
    const chat = chatHistory.find(function (c) { return c.id === chatId; });
    if (!chat) return;

    const newTitle = prompt('Rename chat:', chat.title);
    if (newTitle && newTitle.trim()) {
      chat.title = newTitle.trim();
      renderSidebar();
    }

    // Close dropdowns
    document.querySelectorAll('.dropdown_menu.is-open').forEach(function (menu) {
      menu.classList.remove('is-open');
    });
  });

  // ---- Load Chat ----
  function loadChat(chatId) {
    if (typeof chatHistory === 'undefined') return;

    // Handle pinned chat
    if (chatId === 'pinned-1') {
      const chatGreeting = document.querySelector('#chatGreeting');
      const chatSuggestions = document.querySelector('#chatSuggestions');
      const chatFeed = document.querySelector('#chatFeed');
      const chatContainer = document.querySelector('#chatContainer');

      if (chatGreeting) chatGreeting.classList.add('hidden');
      if (chatSuggestions) chatSuggestions.classList.add('hidden');

      if (chatFeed) {
        chatFeed.classList.remove('hidden');
        chatFeed.innerHTML = '';
      }
      if (chatContainer) chatContainer.classList.add('is-chatting');

      if (typeof appendUserMessage === 'function') {
        appendUserMessage('Can you provide a summary of the current Git/GitHub issues?');
      }
      if (typeof appendAssistantMessage === 'function') {
        appendAssistantMessage('Here is the latest summary of the repository issues:\n\n• Issue #42: Fixed navigation bar overflow on ultra-wide viewports.\n• Issue #56: Updated SCSS variables to prevent hardcoded style tokens.\n• PR #78: Added responsive sidebar rail mode for desktop collapse state.');
      }
      const searchModal = document.querySelector('#searchModal');
      if (searchModal) searchModal.classList.remove('is-open');
      return;
    }

    const chat = chatHistory.find(function (c) { return c.id === chatId; });
    if (!chat) return;

    const chatGreeting = document.querySelector('#chatGreeting');
    const chatSuggestions = document.querySelector('#chatSuggestions');
    const chatFeed = document.querySelector('#chatFeed');
    const chatContainer = document.querySelector('#chatContainer');

    if (chatGreeting) chatGreeting.classList.add('hidden');
    if (chatSuggestions) chatSuggestions.classList.add('hidden');

    if (chatFeed) {
      chatFeed.classList.remove('hidden');
      chatFeed.innerHTML = '';
    }
    if (chatContainer) chatContainer.classList.add('is-chatting');

    chat.messages.forEach(function (msg) {
      if (msg.role === 'user' && typeof appendUserMessage === 'function') {
        appendUserMessage(msg.content);
      } else if (msg.role === 'assistant' && typeof appendAssistantMessage === 'function') {
        appendAssistantMessage(msg.content, msg);
      }
    });

    // Close search modal
    const searchModal = document.querySelector('#searchModal');
    if (searchModal) searchModal.classList.remove('is-open');
  }

  // ---- Window Resize Handler ----
  window.addEventListener('resize', debounce(function () {
    if (window.innerWidth >= 768) {
      closeMobileSidebar();
    }
  }, 250));

  // Initialize
  renderSidebar();

  // Expose for global / modal access
  window._renderSidebar = renderSidebar;
  window._loadChat = loadChat;
  window._toggleSidebar = toggleSidebar;
  window._expandSidebar = expandSidebar;
  window._collapseSidebar = collapseSidebar;
})();
