// js/chat.js

function appendUserMessage(text) {
  const chatFeed = document.querySelector('#chatFeed');
  
  const userHtml = `
    <div class="message_row message_row--user">
      <div class="message_avatar">RK</div>
      <div class="message_content">
        <div class="message_text">${text}</div>
      </div>
    </div>
  `;
  
  chatFeed.insertAdjacentHTML('beforeend', userHtml);
  scrollToBottom();
}

function appendAssistantMessage(text, codeData = null) {
  const chatFeed = document.querySelector('#chatFeed');
  
  let codeBlockHtml = '';
  
  // If the mock response includes code, generate the dark UI block
  if (codeData) {
    codeBlockHtml = `
      <div class="code_block">
        <div class="code_header">
          <span class="code_lang">${codeData.language}</span>
          <button class="action_btn code_copy_btn" onclick="navigator.clipboard.writeText(\`${codeData.snippet}\`)">
            <img class="action_icon" src="./assets/icons/copy.svg" alt="Copy" style="filter: invert(1); width: 12px; height: 12px;" /> Copy code
          </button>
        </div>
        <div class="code_body">
          <pre><code class="code_line">${codeData.snippet.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
        </div>
      </div>
    `;
  }

  const assistantHtml = `
    <div class="message_row message_row--assistant">
      <div class="message_avatar">
        <img class="avatar_icon" src="./assets/icons/chatgpt.svg" alt="ChatGPT" />
      </div>
      <div class="message_content">
        <div class="message_text">${text}</div>
        ${codeBlockHtml}
        
        <div class="message_actions">
          <button class="action_btn tooltip_trigger">
            <img class="action_icon" src="./assets/icons/copy.svg" alt="Copy" />
          </button>
          <button class="action_btn tooltip_trigger">
            <img class="action_icon" src="./assets/icons/thumbs-up.svg" alt="Like" />
          </button>
          <button class="action_btn tooltip_trigger">
            <img class="action_icon" src="./assets/icons/thumbs-down.svg" alt="Dislike" />
          </button>
          <button class="action_btn tooltip_trigger">
            <img class="action_icon" src="./assets/icons/refresh.svg" alt="Regenerate" />
          </button>
        </div>
      </div>
    </div>
  `;
  
  chatFeed.insertAdjacentHTML('beforeend', assistantHtml);
  scrollToBottom();
}

// Helper to keep the chat scrolled to the newest message
function scrollToBottom() {
  const chatFeed = document.querySelector('#chatFeed');
  chatFeed.scrollTop = chatFeed.scrollHeight;
}