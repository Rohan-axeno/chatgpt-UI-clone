(function () {
  const searchTriggerBtn = document.querySelector("#searchTriggerBtn");
  const searchModal = document.querySelector("#searchModal");
  const closeSearchModalBtn = document.querySelector("#closeSearchModalBtn");
  const searchModalInput = document.querySelector("#searchModalInput");
  const searchBody = document.querySelector("#searchBody");

  function openSearchModal() {
    if (!searchModal) return;
    searchModal.classList.add("is-open");
    setTimeout(function () {
      if (searchModalInput) searchModalInput.focus();
    }, 100);
    renderSearchModal("");
  }

  function closeSearchModal() {
    if (!searchModal) return;
    searchModal.classList.remove("is-open");
    if (searchModalInput) searchModalInput.value = "";
  }

  if (searchTriggerBtn) {
    searchTriggerBtn.addEventListener("click", openSearchModal);
  }

  if (closeSearchModalBtn) {
    closeSearchModalBtn.addEventListener("click", closeSearchModal);
  }

  if (searchModal) {
    searchModal.addEventListener("click", function (e) {
      if (e.target === searchModal) closeSearchModal();
    });
  }

  function renderSearchModal(searchTerm) {
    if (!searchBody || typeof chatHistory === "undefined") return;

    const filtered = chatHistory.filter(function (chat) {
      return chat.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const grouped = { Today: [], Yesterday: [], Older: [] };
    filtered.forEach(function (chat) {
      if (grouped[chat.group]) {
        grouped[chat.group].push(chat);
      } else {
        grouped.Older.push(chat);
      }
    });

    let html = `
      <button class="new_chat_row" id="searchNewChatBtn">
        <img class="chat_row_icon" src="./assets/icons/square-pen.svg" alt="" aria-hidden="true" /> New chat
      </button>
    `;

    let hasResults = false;

    Object.entries(grouped).forEach(function (entry) {
      const groupName = entry[0];
      const chats = entry[1];
      if (chats.length > 0) {
        hasResults = true;
        html +=
          '<div class="search_group"><h3 class="group_title">' +
          groupName +
          "</h3>";
        chats.forEach(function (chat) {
          html += `
            <button class="chat_row" data-id="${chat.id}">
              <img class="chat_row_icon" src="./assets/icons/message-circle.svg" alt="" aria-hidden="true" /> ${escapeHtml(chat.title)}
            </button>
          `;
        });
        html += "</div>";
      }
    });

    if (!hasResults && searchTerm) {
      html += `
        <div class="no_results">
          <img class="no_results_icon" src="./assets/icons/magnifying-glass.svg" alt="" aria-hidden="true" />
          <span>No results for "${escapeHtml(searchTerm)}"</span>
        </div>
      `;
    }

    searchBody.innerHTML = html;
  }

  if (searchModalInput) {
    searchModalInput.addEventListener(
      "input",
      debounce(function (e) {
        renderSearchModal(e.target.value);
      }, 150),
    );
  }

  if (searchBody) {
    searchBody.addEventListener("click", function (e) {
      const chatRow = e.target.closest(".chat_row[data-id]");
      if (chatRow && typeof window._loadChat === "function") {
        window._loadChat(chatRow.dataset.id);
        closeSearchModal();
      }

      const newChatBtn = e.target.closest("#searchNewChatBtn");
      if (newChatBtn) {
        closeSearchModal();
        const mainNewChatBtn = document.querySelector("#newChatBtn");
        if (mainNewChatBtn) mainNewChatBtn.click();
      }
    });
  }

  renderSearchModal("");

  const settingsTriggerBtn = document.querySelector("#settingsTriggerBtn");
  const settingsModal = document.querySelector("#settingsModal");
  const closeSettingsBtn = document.querySelector("#closeSettingsBtn");

  function openSettingsModal() {
    if (!settingsModal) return;
    document
      .querySelectorAll(".dropdown_menu.is-open")
      .forEach(function (menu) {
        menu.classList.remove("is-open");
      });
    settingsModal.classList.add("is-open");
  }

  function closeSettingsModal() {
    if (!settingsModal) return;
    settingsModal.classList.remove("is-open");
  }

  if (settingsTriggerBtn) {
    settingsTriggerBtn.addEventListener("click", openSettingsModal);
  }

  if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener("click", closeSettingsModal);
  }

  if (settingsModal) {
    settingsModal.addEventListener("click", function (e) {
      if (e.target === settingsModal) closeSettingsModal();
    });
  }

  document.querySelectorAll(".settings_nav_item").forEach(function (navItem) {
    navItem.addEventListener("click", function () {
      const section = navItem.dataset.section;

      document.querySelectorAll(".settings_nav_item").forEach(function (item) {
        item.classList.remove("active");
      });
      navItem.classList.add("active");

      document.querySelectorAll(".settings_panel").forEach(function (panel) {
        panel.classList.add("hidden");
      });
      const targetPanel = document.querySelector("#panel-" + section);
      if (targetPanel) targetPanel.classList.remove("hidden");
    });
  });

  document.addEventListener("click", function (e) {
    const toggle = e.target.closest(".toggle_switch");
    if (toggle) {
      toggle.classList.toggle("is-on");
    }
  });

  document.addEventListener("click", function (e) {
    const themeOption = e.target.closest(".theme_option");
    if (themeOption) {
      document.querySelectorAll(".theme_option").forEach(function (opt) {
        opt.classList.remove("active");
      });
      themeOption.classList.add("active");
    }
  });
})();
