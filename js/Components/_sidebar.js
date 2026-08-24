(function () {
  const sidebar = document.querySelector('#sidebar');
  const sidebarToggleBtn = document.querySelector('#sidebarToggleBtn');
  const railExpandBtn = document.querySelector('#railExpandBtn');
  const mobileMenuBtn = document.querySelector('#mobileMenuBtn');
  const sidebarOverlay = document.querySelector('#sidebarOverlay');
  const newChatBtn = document.querySelector('#newChatBtn');

  if (!sidebar) return;

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

  document.addEventListener('click', function (e) {
    if (e.target.closest('.js-new-chat-rail')) {
      resetToNewChat();
      return;
    }

    if (e.target.closest('.js-search-rail')) {
      const searchTriggerBtn = document.querySelector('#searchTriggerBtn');
      if (searchTriggerBtn) searchTriggerBtn.click();
      return;
    }

    if (e.target.closest('.js-pinned-rail')) {
      loadChat('pinned-1');
      return;
    }

    if (e.target.closest('.js-recents-rail')) {
      expandSidebar();
      return;
    }

    if (e.target.closest('.js-toggle-profile-rail')) {
      const settingsModal = document.querySelector('#settingsModal');
      if (settingsModal) settingsModal.classList.add('is-open');
      return;
    }
  });

  // Handle sidebar utils items (New chat, Library, Projects, Scheduled, Plugins, Codex, More)
  document.addEventListener('click', function (e) {
    const utilsItem = e.target.closest('.utils_item');
    if (!utilsItem) return;

    if (utilsItem.id === 'newChatBtn' || utilsItem === newChatBtn) {
      resetToNewChat();
      closeMobileSidebar();
      return;
    }

    // Deselect all active chat links
    document.querySelectorAll('.group_link.is-active').forEach(function (link) {
      link.classList.remove('is-active');
    });

    // Deselect all utils items
    document.querySelectorAll('.utils_item').forEach(function (item) {
      item.classList.remove('active');
    });

    // Mark clicked utils item as active
    utilsItem.classList.add('active');
    closeMobileSidebar();
  });

  if (newChatBtn) {
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

    document.querySelectorAll('.group_link.is-active').forEach(function (link) {
      link.classList.remove('is-active');
    });

    if (typeof window._resetComposer === 'function') {
      window._resetComposer();
    }

    document.querySelectorAll('.utils_item').forEach(function (item) {
      item.classList.remove('active');
    });
    if (newChatBtn) newChatBtn.classList.add('active');
  }

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

  function renderSidebar() {
    const recentsList = document.querySelector('#recentsList');
    if (!recentsList || typeof chatHistory === 'undefined') return;

    recentsList.innerHTML = '';

    const grouped = {};
    chatHistory.forEach(function (chat) {
      if (!grouped[chat.group]) grouped[chat.group] = [];
      grouped[chat.group].push(chat);
    });

    const groupOrder = ['Today', 'Yesterday', 'Previous 7 days', 'Older'];

    groupOrder.forEach(function (groupName) {
      const chats = grouped[groupName];
      if (!chats || !chats.length) return;

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
                <button class="menu_item js-share-chat" role="menuitem" data-id="${chat.id}">
                  <img class="menu_item_icon" src="./assets/icons/upload.svg" alt="" aria-hidden="true" /> Share
                </button>
                <button class="menu_item js-rename-chat" role="menuitem" data-id="${chat.id}">
                  <img class="menu_item_icon" src="./assets/icons/pencil.svg" alt="" aria-hidden="true" /> Rename
                </button>
                <div class="menu_divider"></div>
                <button class="menu_item js-pin-chat" role="menuitem" data-id="${chat.id}">
                  <img class="menu_item_icon" src="./assets/icons/pin.svg" alt="" aria-hidden="true" /> Pin chat
                </button>
                <button class="menu_item js-archive-chat" role="menuitem" data-id="${chat.id}">
                  <img class="menu_item_icon" src="./assets/icons/download.svg" alt="" aria-hidden="true" /> Archive
                </button>
                <button class="menu_item text_danger js-delete-chat" role="menuitem" data-id="${chat.id}">
                  <img class="menu_item_icon" src="./assets/icons/cross-1.svg" alt="" aria-hidden="true" /> Delete
                </button>
                <div class="menu_divider"></div>
                <button class="menu_item js-move-chat" role="menuitem" data-id="${chat.id}">
                  <span class="menu_item_left">
                    <img class="menu_item_icon" src="./assets/icons/folder-closed.svg" alt="" aria-hidden="true" /> Move to project
                  </span>
                  <img class="menu_item_arrow" src="./assets/icons/chevron-down.svg" alt="" aria-hidden="true" style="transform: rotate(-90deg);" />
                </button>
              </div>
            </div>
          </div>
        `;
        recentsList.appendChild(li);
      });
    });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('.chat_hover_actions') || e.target.closest('.popover_wrapper')) {
      return;
    }

    const chatLink = e.target.closest('.group_link[data-id]');
    if (!chatLink) return;

    e.preventDefault();
    const chatId = chatLink.dataset.id;
    loadChat(chatId);
    closeMobileSidebar();

    document.querySelectorAll('.group_link.is-active').forEach(function (link) {
      link.classList.remove('is-active');
    });
    chatLink.classList.add('is-active');

    document.querySelectorAll('.utils_item.active').forEach(function (item) {
      item.classList.remove('active');
    });
  });

  document.addEventListener('click', function (e) {
    const unpinBtn = e.target.closest('.js-unpin-chat, .js-unpin-btn');
    if (!unpinBtn) return;

    const chatId = unpinBtn.dataset.id;
    if (chatId === 'pinned-1') {
      const pinnedItem = unpinBtn.closest('.group_item');
      if (pinnedItem) pinnedItem.remove();
    } else if (typeof chatHistory !== 'undefined') {
      const chat = chatHistory.find(function (c) { return c.id === chatId; });
      if (chat) {
        chat.pinned = false;
        renderSidebar();
      }
    }
    document.querySelectorAll('.dropdown_menu.is-open').forEach(function (menu) {
      menu.classList.remove('is-open');
    });
    document.querySelectorAll('.group_item.has-open-menu').forEach(function (item) {
      item.classList.remove('has-open-menu');
    });
  });

  document.addEventListener('click', function (e) {
    const shareBtn = e.target.closest('.js-share-chat');
    if (!shareBtn) return;

    const chatId = shareBtn.dataset.id;
    if (typeof copyToClipboard === 'function') {
      copyToClipboard(window.location.origin + window.location.pathname + '#' + chatId).then(function () {
        alert('Share link copied to clipboard!');
      });
    }
    document.querySelectorAll('.dropdown_menu.is-open').forEach(function (menu) {
      menu.classList.remove('is-open');
    });
  });

  document.addEventListener('click', function (e) {
    const deleteBtn = e.target.closest('.js-delete-chat');
    if (!deleteBtn) return;

    const chatId = deleteBtn.dataset.id;
    const index = chatHistory.findIndex(function (c) { return c.id === chatId; });
    if (index > -1) {
      chatHistory.splice(index, 1);
      renderSidebar();
    }

    document.querySelectorAll('.dropdown_menu.is-open').forEach(function (menu) {
      menu.classList.remove('is-open');
    });
  });

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

    document.querySelectorAll('.dropdown_menu.is-open').forEach(function (menu) {
      menu.classList.remove('is-open');
    });
  });

  document.addEventListener('click', function (e) {
    const archiveBtn = e.target.closest('.js-archive-chat');
    if (!archiveBtn) return;

    const chatId = archiveBtn.dataset.id;
    const index = chatHistory.findIndex(function (c) { return c.id === chatId; });
    if (index > -1) {
      chatHistory.splice(index, 1);
      renderSidebar();
    }
    document.querySelectorAll('.dropdown_menu.is-open').forEach(function (menu) {
      menu.classList.remove('is-open');
    });
  });

  document.addEventListener('click', function (e) {
    const pinBtn = e.target.closest('.js-pin-chat');
    if (!pinBtn) return;

    const chatId = pinBtn.dataset.id;
    const chat = chatHistory.find(function (c) { return c.id === chatId; });
    if (chat) {
      chat.pinned = true;
      alert('Chat pinned to top!');
    }
    document.querySelectorAll('.dropdown_menu.is-open').forEach(function (menu) {
      menu.classList.remove('is-open');
    });
  });

  document.addEventListener('click', function (e) {
    const orgItem = e.target.closest('.organize_popover .popover_item');
    if (!orgItem) return;

    document.querySelectorAll('.organize_popover .popover_item').forEach(function (item) {
      item.classList.remove('active');
    });
    orgItem.classList.add('active');

    setTimeout(function () {
      const orgPopover = orgItem.closest('.organize_popover');
      if (orgPopover) orgPopover.classList.remove('is-open');
    }, 200);
  });

  function loadChat(chatId) {
    if (typeof chatHistory === 'undefined') return;

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

    const searchModal = document.querySelector('#searchModal');
    if (searchModal) searchModal.classList.remove('is-open');
  }

  window.addEventListener('resize', debounce(function () {
    if (window.innerWidth >= 768) {
      closeMobileSidebar();
    }
  }, 250));

  renderSidebar();

  window._renderSidebar = renderSidebar;
  window._loadChat = loadChat;
  window._toggleSidebar = toggleSidebar;
  window._expandSidebar = expandSidebar;
  window._collapseSidebar = collapseSidebar;
})();
