// ============================================================
// js/Components/_chat.js — Chat Message Rendering
// ============================================================

/**
 * Appends a user message bubble to the chat feed
 */
function appendUserMessage(text) {
  const chatFeed = document.querySelector('#chatFeed');
  if (!chatFeed) return;

  const row = document.createElement('div');
  row.className = 'message_row message_row--user';
  row.innerHTML = `
    <div class="message_avatar">RK</div>
    <div class="message_content">
      <div class="message_text">${escapeHtml(text)}</div>
    </div>
  `;

  chatFeed.appendChild(row);
  scrollToBottom(chatFeed);
}

/**
 * Shows the typing indicator
 */
function showTypingIndicator() {
  const chatFeed = document.querySelector('#chatFeed');
  if (!chatFeed) return;

  const indicator = document.createElement('div');
  indicator.className = 'typing_indicator';
  indicator.id = 'typingIndicator';
  indicator.innerHTML = `
    <div class="typing_avatar">
      <img class="avatar_icon" src="./assets/icons/new-chat.svg" alt="ChatGPT" />
    </div>
    <div class="typing_dots">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
  `;

  chatFeed.appendChild(indicator);
  scrollToBottom(chatFeed);
}

/**
 * Removes the typing indicator
 */
function removeTypingIndicator() {
  const indicator = document.querySelector('#typingIndicator');
  if (indicator) indicator.remove();
}

/**
 * Builds HTML for a code block
 */
function buildCodeBlockHtml(codeData) {
  if (!codeData) return '';
  const escapedSnippet = escapeHtml(codeData.snippet);
  return `
    <div class="code_block">
      <div class="code_header">
        <span class="code_lang">${escapeHtml(codeData.language)}</span>
        <button class="code_copy_btn js-copy-code" data-code="${escapedSnippet}" aria-label="Copy code">
          <img class="code_copy_icon" src="./assets/icons/copy.svg" alt="" aria-hidden="true" /> Copy code
        </button>
      </div>
      <div class="code_body">
        <pre class="code_pre"><code class="code_line">${escapedSnippet}</code></pre>
      </div>
    </div>
  `;
}

/**
 * Builds HTML for a list in message
 */
function buildListHtml(items) {
  if (!items || !items.length) return '';
  const listItems = items.map(item => `<li class="msg_list_item">${escapeHtml(item)}</li>`).join('');
  return `<ol class="msg_list">${listItems}</ol>`;
}

/**
 * Builds HTML for a table in message
 */
function buildTableHtml(tableData) {
  if (!tableData) return '';
  const headerCells = tableData.headers.map(h => `<th class="msg_th">${escapeHtml(h)}</th>`).join('');
  const bodyRows = tableData.rows.map(row => {
    const cells = row.map(cell => `<td class="msg_td">${escapeHtml(cell)}</td>`).join('');
    return `<tr class="msg_tr">${cells}</tr>`;
  }).join('');

  return `
    <div class="msg_table_wrap">
      <table class="msg_table">
        <thead><tr>${headerCells}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </div>
  `;
}

/**
 * Appends an assistant message bubble to the chat feed
 */
function appendAssistantMessage(text, extras) {
  const chatFeed = document.querySelector('#chatFeed');
  if (!chatFeed) return;

  let richContentHtml = '';

  if (extras) {
    // Code block
    if (extras.language && extras.snippet) {
      richContentHtml += buildCodeBlockHtml(extras);
    }
    // Code from nested object
    if (extras.code) {
      richContentHtml += buildCodeBlockHtml(extras.code);
    }
    // List
    if (extras.list) {
      richContentHtml += buildListHtml(extras.list);
    }
    if (extras.items) {
      richContentHtml += buildListHtml(extras.items);
    }
    // Table
    if (extras.table) {
      richContentHtml += buildTableHtml(extras.table);
    }
    if (extras.data) {
      richContentHtml += buildTableHtml(extras.data);
    }
  }

  const msgId = generateId();
  const row = document.createElement('div');
  row.className = 'message_row message_row--assistant';
  row.dataset.msgId = msgId;
  row.innerHTML = `
    <div class="message_avatar">
      <img class="avatar_icon" src="./assets/icons/new-chat.svg" alt="ChatGPT" />
    </div>
    <div class="message_content">
      <div class="message_text">${escapeHtml(text)}${richContentHtml}</div>
      <div class="message_actions">
        <button class="msg_action_btn js-copy-msg tooltip_trigger" aria-label="Copy message" data-text="${escapeHtml(text)}">
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
    </div>
  `;

  chatFeed.appendChild(row);
  scrollToBottom(chatFeed);
}