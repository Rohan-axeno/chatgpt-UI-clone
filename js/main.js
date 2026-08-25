(function () {
  const dropdownTriggers = [
    "#modelSelectorBtn",
    ".js-toggle-chat-options",
    ".js-toggle-profile",
    ".js-toggle-nested",
    ".js-toggle-attachment",
    ".js-toggle-organize",
  ].join(", ");

  document.addEventListener("click", function (e) {
    const triggerBtn = e.target.closest(dropdownTriggers);
    const isInsideDropdown = e.target.closest(".dropdown_menu");

    function closeAllDropdowns(exceptMenu) {
      document
        .querySelectorAll(".dropdown_menu.is-open")
        .forEach(function (menu) {
          if (
            menu !== exceptMenu &&
            (!exceptMenu || !menu.contains(exceptMenu))
          ) {
            menu.classList.remove("is-open");
          }
        });
      document
        .querySelectorAll(".group_item.has-open-menu")
        .forEach(function (item) {
          if (!exceptMenu || !item.contains(exceptMenu)) {
            item.classList.remove("has-open-menu");
          }
        });
    }

    if (!triggerBtn && !isInsideDropdown) {
      closeAllDropdowns();
      return;
    }

    if (triggerBtn) {
      const wrapper = triggerBtn.closest(".popover_wrapper");
      if (!wrapper) return;
      const targetMenu = wrapper.querySelector(":scope > .dropdown_menu");
      if (!targetMenu) return;

      const groupItem = triggerBtn.closest(".group_item");

      if (triggerBtn.classList.contains("js-toggle-nested")) {
        const parentMenu = triggerBtn.closest(".dropdown_menu");
        if (parentMenu) {
          parentMenu
            .querySelectorAll(".nested_menu.is-open")
            .forEach(function (menu) {
              if (menu !== targetMenu) menu.classList.remove("is-open");
            });
        }
      } else {
        closeAllDropdowns(targetMenu);
      }

      const isOpen = targetMenu.classList.toggle("is-open");

      if (groupItem) {
        groupItem.classList.toggle("has-open-menu", isOpen);
      }

      if (isOpen) {
        const btnRect = triggerBtn.getBoundingClientRect();
        if (triggerBtn.classList.contains("js-toggle-nested")) {
          if (btnRect.bottom > window.innerHeight - 180) {
            targetMenu.classList.add("dropdown_menu--up");
          } else {
            targetMenu.classList.remove("dropdown_menu--up");
          }
        } else {
          if (btnRect.bottom > window.innerHeight - 250) {
            targetMenu.classList.add("dropdown_menu--up");
          } else {
            targetMenu.classList.remove("dropdown_menu--up");
          }
        }
      }
    }
  });

  const sidebarContent = document.querySelector(".sidebar_content");
  if (sidebarContent) {
    sidebarContent.addEventListener("scroll", function () {
      document
        .querySelectorAll(".dropdown_menu.is-open")
        .forEach(function (menu) {
          menu.classList.remove("is-open");
        });
      document
        .querySelectorAll(".group_item.has-open-menu")
        .forEach(function (item) {
          item.classList.remove("has-open-menu");
        });
    });
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest("#recentsNewChatBtn")) {
      const newChatBtn = document.querySelector("#newChatBtn");
      if (newChatBtn) newChatBtn.click();
    }
  });

  document.addEventListener("click", function (e) {
    const copyBtn = e.target.closest(".js-copy-msg");
    if (copyBtn) {
      const messageRow = copyBtn.closest(".message_row");
      const textEl = messageRow
        ? messageRow.querySelector(".message_text")
        : null;
      const text = textEl ? textEl.textContent : "";
      copyToClipboard(text).then(function () {
        showCopyFeedback(copyBtn, "Copied!");
      });
      return;
    }

    const codeCopyBtn = e.target.closest(".js-copy-code");
    if (codeCopyBtn) {
      const codeBlock = codeCopyBtn.closest(".code_block");
      const codeEl = codeBlock ? codeBlock.querySelector(".code_line") : null;
      const code = codeEl ? codeEl.textContent : "";
      copyToClipboard(code).then(function () {
        codeCopyBtn.textContent = "Copied!";
        setTimeout(function () {
          codeCopyBtn.innerHTML =
            '<img class="code_copy_icon" src="./assets/icons/copy.svg" alt="" aria-hidden="true" /> Copy code';
        }, 1500);
      });
      return;
    }

    const likeBtn = e.target.closest(".js-like-msg");
    if (likeBtn) {
      const dislikeBtn = likeBtn.parentElement.querySelector(".js-dislike-msg");
      likeBtn.classList.toggle("is-active");
      if (dislikeBtn) dislikeBtn.classList.remove("is-active");
      return;
    }

    const dislikeBtn = e.target.closest(".js-dislike-msg");
    if (dislikeBtn) {
      const likeSibling =
        dislikeBtn.parentElement.querySelector(".js-like-msg");
      dislikeBtn.classList.toggle("is-active");
      if (likeSibling) likeSibling.classList.remove("is-active");
      return;
    }

    const regenBtn = e.target.closest(".js-regenerate");
    if (regenBtn) {
      const messageRow = regenBtn.closest(".message_row");
      if (!messageRow) return;

      const contentEl = messageRow.querySelector(".message_content");
      if (!contentEl) return;

      const altResponse =
        typeof alternateResponses !== "undefined" ? alternateResponses : null;
      if (!altResponse) return;

      const hasCode = messageRow.querySelector(".code_block");
      let newText, newExtras;

      if (hasCode && altResponse.code) {
        newText = altResponse.code.text;
        newExtras = altResponse.code;
      } else {
        newText = altResponse.general;
        newExtras = null;
      }

      let richHtml = "";
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
            <img class="msg_action_icon" src="./assets/icons/refresh-cw.svg" alt="regenerate" aria-hidden="true" />
            <span class="tooltip_box">Regenerate</span>
          </button>
        </div>
      `;
      return;
    }
  });

  document.addEventListener("click", function (e) {
    const modelOption = e.target.closest(".model_option");
    if (!modelOption) return;

    const modelName = modelOption.querySelector(".model_name");
    const selectorBtn = document.querySelector("#modelSelectorBtn");

    document.querySelectorAll(".model_option").forEach(function (opt) {
      opt.classList.remove("is-selected");
    });
    modelOption.classList.add("is-selected");

    if (selectorBtn && modelName) {
      selectorBtn.childNodes[0].textContent =
        modelName.textContent.trim() + " ";
    }

    const dropdown = document.querySelector("#modelDropdown");
    if (dropdown) dropdown.classList.remove("is-open");
  });

  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      const searchBtn = document.querySelector("#searchTriggerBtn");
      if (searchBtn) searchBtn.click();
    }

    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "O") {
      e.preventDefault();
      const newChatBtn = document.querySelector("#newChatBtn");
      if (newChatBtn) newChatBtn.click();
    }

    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "S") {
      e.preventDefault();
      const sidebarBtn = document.querySelector("#sidebarToggleBtn");
      if (sidebarBtn) sidebarBtn.click();
    }

    if (e.key === "Escape") {
      const searchModal = document.querySelector("#searchModal");
      const settingsModal = document.querySelector("#settingsModal");
      if (searchModal && searchModal.classList.contains("is-open")) {
        searchModal.classList.remove("is-open");
      } else if (settingsModal && settingsModal.classList.contains("is-open")) {
        settingsModal.classList.remove("is-open");
      } else {
        document
          .querySelectorAll(".dropdown_menu.is-open")
          .forEach(function (menu) {
            menu.classList.remove("is-open");
          });
        document
          .querySelectorAll(".group_item.has-open-menu")
          .forEach(function (item) {
            item.classList.remove("has-open-menu");
          });
      }
    }
  });
})();
