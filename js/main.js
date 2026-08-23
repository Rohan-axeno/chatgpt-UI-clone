// ============================================================
// js/main.js — Global Application Logic
// ============================================================

(function () {

  // ============================================================
  // 1. GLOBAL DROPDOWN / POPOVER SYSTEM
  // ============================================================
  const dropdownTriggers = [
    '#modelSelectorBtn',
    '.js-toggle-chat-options',
    '.js-toggle-profile',
    '.js-toggle-nested',
    '.js-toggle-attachment',
    '.js-toggle-organize'
  ].join(', ');

  document.addEventListener('click', function (e) {
    const triggerBtn = e.target.closest(dropdownTriggers);
    const isInsideDropdown = e.target.closest('.dropdown_menu');

    function closeAllDropdowns(exceptMenu) {
      document.querySelectorAll('.dropdown_menu.is-open').forEach(function (menu) {
        if (menu !== exceptMenu && (!exceptMenu || !menu.contains(exceptMenu))) {
          menu.classList.remove('is-open');
        }
      });
    }

    // Click outside — close all
    if (!triggerBtn && !isInsideDropdown) {
      closeAllDropdowns();
      return;
    }

    // Click on trigger button
    if (triggerBtn) {
      const wrapper = triggerBtn.closest('.popover_wrapper');
      if (!wrapper) return;
      const targetMenu = wrapper.querySelector(':scope > .dropdown_menu');

      // If it's a nested trigger, only close sibling nested menus
      if (triggerBtn.classList.contains('js-toggle-nested')) {
        const parentMenu = triggerBtn.closest('.dropdown_menu');
        if (parentMenu) {
          parentMenu.querySelectorAll('.nested_menu.is-open').forEach(function (menu) {
            if (menu !== targetMenu) menu.classList.remove('is-open');
          });
        }
      } else {
        closeAllDropdowns(targetMenu);
      }

      if (targetMenu) {
        const isOpen = targetMenu.classList.toggle('is-open');

        // Position --right menus using fixed positioning
        if (isOpen && targetMenu.classList.contains('dropdown_menu--right') && !targetMenu.classList.contains('nested_menu')) {
          const btnRect = triggerBtn.getBoundingClientRect();
          targetMenu.style.position = 'fixed';
          targetMenu.style.top = btnRect.top + 'px';
          targetMenu.style.left = (btnRect.right + 8) + 'px';
          targetMenu.style.bottom = 'auto';
          targetMenu.style.right = 'auto';
        }
      }
    }
  });

  // Close dropdowns on scroll
  const sidebarContent = document.querySelector('.sidebar_content');
  if (sidebarContent) {
    sidebarContent.addEventListener('scroll', function () {
      document.querySelectorAll('.dropdown_menu.is-open').forEach(function (menu) {
        menu.classList.remove('is-open');
      });
    });
  }

  // ============================================================
  // 2. MESSAGE ACTIONS (Copy, Like, Dislike, Regenerate)
  // ============================================================
  document.addEventListener('click', function (e) {
    // ---- Copy Message ----
    const copyBtn = e.target.closest('.js-copy-msg');
    if (copyBtn) {
      const messageRow = copyBtn.closest('.message_row');
      const textEl = messageRow ? messageRow.querySelector('.message_text') : null;
      const text = textEl ? textEl.textContent : '';
      copyToClipboard(text).then(function () {
        showCopyFeedback(copyBtn, 'Copied!');
      });
      return;
    }

    // ---- Copy Code Block ----
    const codeCopyBtn = e.target.closest('.js-copy-code');
    if (codeCopyBtn) {
      const codeBlock = codeCopyBtn.closest('.code_block');
      const codeEl = codeBlock ? codeBlock.querySelector('.code_line') : null;
      const code = codeEl ? codeEl.textContent : '';
      copyToClipboard(code).then(function () {
        codeCopyBtn.textContent = 'Copied!';
        setTimeout(function () {
          codeCopyBtn.innerHTML = '<img class="code_copy_icon" src="./assets/icons/copy.svg" alt="" aria-hidden="true" /> Copy code';
        }, 1500);
      });
      return;
    }

    // ---- Like ----
    const likeBtn = e.target.closest('.js-like-msg');
    if (likeBtn) {
      const dislikeBtn = likeBtn.parentElement.querySelector('.js-dislike-msg');
      likeBtn.classList.toggle('is-active');
      if (dislikeBtn) dislikeBtn.classList.remove('is-active');
      return;
    }

    // ---- Dislike ----
    const dislikeBtn = e.target.closest('.js-dislike-msg');
    if (dislikeBtn) {
      const likeSibling = dislikeBtn.parentElement.querySelector('.js-like-msg');
      dislikeBtn.classList.toggle('is-active');
      if (likeSibling) likeSibling.classList.remove('is-active');
      return;
    }

    // ---- Regenerate ----
    const regenBtn = e.target.closest('.js-regenerate');
    if (regenBtn) {
      const messageRow = regenBtn.closest('.message_row');
      if (!messageRow) return;

      const contentEl = messageRow.querySelector('.message_content');
      if (!contentEl) return;

      // Get alternate response
      const altResponse = typeof alternateResponses !== 'undefined' ? alternateResponses : null;
      if (!altResponse) return;

      // Determine which type to use
      const hasCode = messageRow.querySelector('.code_block');
      let newText, newExtras;

      if (hasCode && altResponse.code) {
        newText = altResponse.code.text;
        newExtras = altResponse.code;
      } else {
        newText = altResponse.general;
        newExtras = null;
      }

      // Build new content
      let richHtml = '';
      if (newExtras && newExtras.language && newExtras.snippet) {
        richHtml = buildCodeBlockHtml(newExtras);
      }

      contentEl.innerHTML = `
        <div class="message_text">${escapeHtml(newText)}${richHtml}</div>
        <div class="message_actions">
          <button class="msg_action_btn js-copy-msg tooltip_trigger" aria-label="Copy message" data-text="${escapeHtml(newText)}">
            <img class="msg_action_icon" src="./assets/icons/copy.svg" alt="" aria-hidden="true" />
            <span class="tooltip_box">Copy</span>
          </button>
          <button class="msg_action_btn js-like-msg tooltip_trigger" aria-label="Like">
            <img class="msg_action_icon" src="./assets/icons/chevron-down.svg" alt="" aria-hidden="true" style="transform:rotate(180deg)" />
            <span class="tooltip_box">Like</span>
          </button>
          <button class="msg_action_btn js-dislike-msg tooltip_trigger" aria-label="Dislike">
            <img class="msg_action_icon" src="./assets/icons/chevron-down.svg" alt="" aria-hidden="true" />
            <span class="tooltip_box">Dislike</span>
          </button>
          <button class="msg_action_btn js-regenerate tooltip_trigger" aria-label="Regenerate">
            <img class="msg_action_icon" src="./assets/icons/message-circle-dashed.svg" alt="" aria-hidden="true" />
            <span class="tooltip_box">Regenerate</span>
          </button>
        </div>
      `;
      return;
    }
  });

  // ============================================================
  // 3. MODEL SELECTOR
  // ============================================================
  document.addEventListener('click', function (e) {
    const modelOption = e.target.closest('.model_option');
    if (!modelOption) return;

    const modelName = modelOption.querySelector('.model_name');
    const selectorBtn = document.querySelector('#modelSelectorBtn');

    // Update selected state
    document.querySelectorAll('.model_option').forEach(function (opt) {
      opt.classList.remove('is-selected');
    });
    modelOption.classList.add('is-selected');

    // Update button text
    if (selectorBtn && modelName) {
      selectorBtn.childNodes[0].textContent = modelName.textContent.trim() + ' ';
    }

    // Close dropdown
    const dropdown = document.querySelector('#modelDropdown');
    if (dropdown) dropdown.classList.remove('is-open');
  });

  // ============================================================
  // 4. KEYBOARD SHORTCUTS
  // ============================================================
  document.addEventListener('keydown', function (e) {
    // Ctrl+K — Open search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchBtn = document.querySelector('#searchTriggerBtn');
      if (searchBtn) searchBtn.click();
    }

    // Ctrl+Shift+O — New chat
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'O') {
      e.preventDefault();
      const newChatBtn = document.querySelector('#newChatBtn');
      if (newChatBtn) newChatBtn.click();
    }

    // Ctrl+Shift+S — Toggle sidebar
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
      e.preventDefault();
      const sidebarBtn = document.querySelector('#sidebarToggleBtn');
      if (sidebarBtn) sidebarBtn.click();
    }

    // Escape — Close modals
    if (e.key === 'Escape') {
      const searchModal = document.querySelector('#searchModal');
      const settingsModal = document.querySelector('#settingsModal');
      if (searchModal && searchModal.classList.contains('is-open')) {
        searchModal.classList.remove('is-open');
      } else if (settingsModal && settingsModal.classList.contains('is-open')) {
        settingsModal.classList.remove('is-open');
      } else {
        // Close any open dropdowns
        document.querySelectorAll('.dropdown_menu.is-open').forEach(function (menu) {
          menu.classList.remove('is-open');
        });
      }
    }
  });

})();