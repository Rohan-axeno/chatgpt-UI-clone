// ============================================================
// js/Components/_composer.js — Composer Logic
// ============================================================

(function () {
  const chatInput = document.querySelector('#chatInput');
  const sendBtn = document.querySelector('#sendBtn');
  const voiceBtn = document.querySelector('#voiceBtn');
  const stopBtn = document.querySelector('#stopBtn');
  const composerForm = document.querySelector('#composerForm');
  const fileInput = document.querySelector('#fileInput');
  const filePickerBtn = document.querySelector('#filePickerBtn');
  const attachmentPreview = document.querySelector('#attachmentPreview');
  const removeFileBtn = document.querySelector('#removeFileBtn');
  const fileName = document.querySelector('#fileName');
  const fileMeta = document.querySelector('#fileMeta');
  const uploadBar = document.querySelector('#uploadBar');
  const uploadProgress = document.querySelector('#uploadProgress');
  const composerWrapper = document.querySelector('#composerForm');

  if (!chatInput) return;

  // ---- State Management for the Unified Button Spot ----
  // States: 'idle' (voice), 'typing' (send), 'generating' (pause/stop)
  let currentComposerState = 'idle';

  function setComposerState(state) {
    currentComposerState = state;

    if (state === 'generating') {
      if (voiceBtn) voiceBtn.classList.add('hidden');
      if (sendBtn) sendBtn.classList.add('hidden');
      if (stopBtn) stopBtn.classList.remove('hidden');
    } else if (state === 'typing') {
      if (voiceBtn) voiceBtn.classList.add('hidden');
      if (sendBtn) sendBtn.classList.remove('hidden');
      if (stopBtn) stopBtn.classList.add('hidden');
    } else {
      // 'idle'
      if (voiceBtn) voiceBtn.classList.remove('hidden');
      if (sendBtn) sendBtn.classList.add('hidden');
      if (stopBtn) stopBtn.classList.add('hidden');
    }
  }

  // ---- Auto-growing Textarea & Input Listener ----
  function autoGrow() {
    chatInput.style.height = 'auto';
    chatInput.style.height = chatInput.scrollHeight + 'px';
  }

  chatInput.addEventListener('input', function () {
    autoGrow();

    // Only update between idle and typing if we are NOT in generating state
    if (currentComposerState !== 'generating') {
      const hasText = chatInput.value.trim().length > 0;
      setComposerState(hasText ? 'typing' : 'idle');
    }

    // Hide suggestions while user is typing
    const chatSuggestions = document.querySelector('#chatSuggestions');
    const chatFeed = document.querySelector('#chatFeed');
    const isFeedActive = chatFeed && !chatFeed.classList.contains('hidden');

    if (chatSuggestions) {
      if (chatInput.value.trim().length > 0 || isFeedActive) {
        chatSuggestions.classList.add('hidden');
      } else {
        chatSuggestions.classList.remove('hidden');
      }
    }
  });

  // ---- Send Message ----
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    const chatGreeting = document.querySelector('#chatGreeting');
    const chatSuggestions = document.querySelector('#chatSuggestions');
    const chatFeed = document.querySelector('#chatFeed');
    const chatContainer = document.querySelector('#chatContainer');

    // Clear input & reset height
    chatInput.value = '';
    chatInput.style.height = 'auto';

    // Remove attachment if present
    hideAttachment();

    // Switch to active chat layout
    if (chatGreeting) chatGreeting.classList.add('hidden');
    if (chatSuggestions) chatSuggestions.classList.add('hidden');
    if (chatFeed) chatFeed.classList.remove('hidden');
    if (chatContainer) chatContainer.classList.add('is-chatting');

    // Add user message to conversation
    if (typeof appendUserMessage === 'function') {
      appendUserMessage(text);
    }

    // Show typing indicator
    if (typeof showTypingIndicator === 'function') {
      showTypingIndicator();
    }

    // Switch button to Pause / Stop in the exact same slot
    setComposerState('generating');

    // Clear any previous ongoing generating timeout
    if (window._generatingTimeout) {
      clearTimeout(window._generatingTimeout);
      window._generatingTimeout = null;
    }

    // 1500ms Simulated AI Generation
    window._generatingTimeout = setTimeout(function () {
      window._generatingTimeout = null;

      // Remove typing indicator dots
      if (typeof removeTypingIndicator === 'function') {
        removeTypingIndicator();
      }

      // Restore button state
      const hasText = chatInput.value.trim().length > 0;
      setComposerState(hasText ? 'typing' : 'idle');

      // Append predefined AI response
      if (typeof appendAssistantMessage === 'function') {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('code') || lowerText.includes('server') || lowerText.includes('function') || lowerText.includes('javascript')) {
          appendAssistantMessage(mockResponses.code.text, mockResponses.code);
        } else if (lowerText.includes('list') || lowerText.includes('best') || lowerText.includes('tips') || lowerText.includes('step')) {
          appendAssistantMessage(mockResponses.list.text, { items: mockResponses.list.items });
        } else if (lowerText.includes('compare') || lowerText.includes('table') || lowerText.includes('vs')) {
          appendAssistantMessage(mockResponses.table.text, { table: mockResponses.table.data });
        } else if (lowerText.includes('creative') || lowerText.includes('design') || lowerText.includes('idea')) {
          appendAssistantMessage(mockResponses.creative);
        } else {
          appendAssistantMessage(mockResponses.general);
        }
      }
    }, 1500);
  }

  // Form submit listener (Enter key or form submit)
  if (composerForm) {
    composerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (currentComposerState !== 'generating') {
        sendMessage();
      }
    });
  }

  // Enter to send (Shift+Enter for newline)
  chatInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentComposerState !== 'generating') {
        sendMessage();
      }
    }
  });

  // ---- Pause / Stop Generating Button Listener ----
  if (stopBtn) {
    stopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (window._generatingTimeout) {
        clearTimeout(window._generatingTimeout);
        window._generatingTimeout = null;
      }

      // Remove typing indicator dots immediately
      if (typeof removeTypingIndicator === 'function') {
        removeTypingIndicator();
      }

      // Switch back to typing or idle state — NO conversation / AI message is loaded!
      const hasText = chatInput.value.trim().length > 0;
      setComposerState(hasText ? 'typing' : 'idle');
    });
  }

  // ---- File Picker & Attachment Flow ----
  if (filePickerBtn && fileInput) {
    filePickerBtn.addEventListener('click', function () {
      fileInput.click();
      const attachMenu = document.querySelector('#attachmentMenu');
      if (attachMenu) attachMenu.classList.remove('is-open');
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', function () {
      const file = fileInput.files[0];
      if (!file) return;

      if (fileName) fileName.textContent = file.name;
      if (fileMeta) fileMeta.textContent = formatFileSize(file.size);
      if (attachmentPreview) {
        attachmentPreview.classList.remove('hidden', 'has-error');
        if (composerWrapper) composerWrapper.classList.add('has-attachment');
      }

      // Simulate upload progress
      simulateUpload();
    });
  }

  function simulateUpload() {
    if (!uploadBar || !uploadProgress) return;
    uploadProgress.classList.remove('hidden');
    let progress = 0;
    const interval = setInterval(function () {
      progress += Math.random() * 35 + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(function () {
          uploadProgress.classList.add('hidden');
          uploadBar.style.width = '0%';
        }, 400);
      }
      uploadBar.style.width = progress + '%';
    }, 200);
  }

  // ---- Remove Attachment ----
  function hideAttachment() {
    if (attachmentPreview) {
      attachmentPreview.classList.add('hidden');
      attachmentPreview.classList.remove('has-error');
    }
    if (composerWrapper) composerWrapper.classList.remove('has-attachment');
    if (fileInput) fileInput.value = '';
  }

  if (removeFileBtn) {
    removeFileBtn.addEventListener('click', hideAttachment);
  }

  // ---- Suggestion Clicks ----
  document.addEventListener('click', function (e) {
    const suggestionBtn = e.target.closest('.suggestion_btn');
    if (!suggestionBtn) return;

    // Check if close/dismiss icon was clicked
    if (e.target.closest('.close_icon')) {
      suggestionBtn.remove();
      return;
    }

    const prompt = suggestionBtn.dataset.prompt;
    if (prompt && chatInput) {
      chatInput.value = prompt;
      autoGrow();
      sendMessage();
    }
  });

  // Initialize button state
  setComposerState('idle');

  // Expose reset function for new chat
  window._resetComposer = function () {
    if (window._generatingTimeout) {
      clearTimeout(window._generatingTimeout);
      window._generatingTimeout = null;
    }
    if (typeof removeTypingIndicator === 'function') {
      removeTypingIndicator();
    }
    hideAttachment();
    if (chatInput) {
      chatInput.value = '';
      chatInput.style.height = 'auto';
    }
    setComposerState('idle');
  };
})();
