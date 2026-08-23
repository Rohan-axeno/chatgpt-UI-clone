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
      if (voiceBtn) voiceBtn.classList.remove('hidden');
      if (sendBtn) sendBtn.classList.add('hidden');
      if (stopBtn) stopBtn.classList.add('hidden');
    }
  }

  function autoGrow() {
    chatInput.style.height = 'auto';
    chatInput.style.height = chatInput.scrollHeight + 'px';
  }

  chatInput.addEventListener('input', function () {
    autoGrow();

    if (currentComposerState !== 'generating') {
      const hasText = chatInput.value.trim().length > 0;
      setComposerState(hasText ? 'typing' : 'idle');
    }

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

  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    const chatGreeting = document.querySelector('#chatGreeting');
    const chatSuggestions = document.querySelector('#chatSuggestions');
    const chatFeed = document.querySelector('#chatFeed');
    const chatContainer = document.querySelector('#chatContainer');

    chatInput.value = '';
    chatInput.style.height = 'auto';

    hideAttachment();

    if (chatGreeting) chatGreeting.classList.add('hidden');
    if (chatSuggestions) chatSuggestions.classList.add('hidden');
    if (chatFeed) chatFeed.classList.remove('hidden');
    if (chatContainer) chatContainer.classList.add('is-chatting');

    if (typeof appendUserMessage === 'function') {
      appendUserMessage(text);
    }

    if (typeof showTypingIndicator === 'function') {
      showTypingIndicator();
    }

    setComposerState('generating');

    if (window._generatingTimeout) {
      clearTimeout(window._generatingTimeout);
      window._generatingTimeout = null;
    }

    window._generatingTimeout = setTimeout(function () {
      window._generatingTimeout = null;

      if (typeof removeTypingIndicator === 'function') {
        removeTypingIndicator();
      }

      const hasText = chatInput.value.trim().length > 0;
      setComposerState(hasText ? 'typing' : 'idle');

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

  if (composerForm) {
    composerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (currentComposerState !== 'generating') {
        sendMessage();
      }
    });
  }

  chatInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentComposerState !== 'generating') {
        sendMessage();
      }
    }
  });

  if (stopBtn) {
    stopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (window._generatingTimeout) {
        clearTimeout(window._generatingTimeout);
        window._generatingTimeout = null;
      }

      if (typeof removeTypingIndicator === 'function') {
        removeTypingIndicator();
      }

      const hasText = chatInput.value.trim().length > 0;
      setComposerState(hasText ? 'typing' : 'idle');
    });
  }

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

  document.addEventListener('click', function (e) {
    const suggestionBtn = e.target.closest('.suggestion_btn');
    if (!suggestionBtn) return;

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

  setComposerState('idle');

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
