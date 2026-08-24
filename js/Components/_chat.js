function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatSyntaxHighlight(code, lang) {
  if (!code) return '';
  let result = code;

  result = result.replace(/(\/\*[\s\S]*?\*\/|\/\/[^\n]*|#[^\n]*)/g, '<span class="token_comment">$1</span>');

  result = result.replace(/(&quot;.*?&quot;|&#39;.*?&#39;|`.*?`|'.*?'|".*?")/g, '<span class="token_string">$1</span>');

  result = result.replace(/\b(@media|@include|@use|@function|@return|import|from|const|let|var|function|return|def|class|if|else|export|as)\b/g, '<span class="token_keyword">$1</span>');

  result = result.replace(/\b(\d+(?:px|rem|em|%|vh|vw|ms|s)?)\b/g, '<span class="token_number">$1</span>');

  result = result.replace(/(\.[\w-]+)/g, '<span class="token_selector">$1</span>');

  return result;
}

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

function showTypingIndicator() {
  const chatFeed = document.querySelector('#chatFeed');
  if (!chatFeed) return;

  const indicator = document.createElement('div');
  indicator.className = 'typing_indicator';
  indicator.id = 'typingIndicator';
  indicator.innerHTML = `
    <div class="typing_avatar">
      <img class="avatar_icon" src="./assets/icons/blossom.svg" alt="ChatGPT" />
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

function removeTypingIndicator() {
  const indicator = document.querySelector('#typingIndicator');
  if (indicator) indicator.remove();
}

function buildCodeBlockHtml(codeData) {
  if (!codeData) return '';
  const escapedSnippet = escapeHtml(codeData.snippet);
  const lang = escapeHtml(codeData.language || 'code').toUpperCase();
  const highlighted = formatSyntaxHighlight(escapedSnippet, codeData.language);

  return `
    <div class="code_block">
      <div class="code_header">
        <div class="code_lang_wrap">
          <span class="code_tag_icon">&lt;/&gt;</span>
          <span class="code_lang">${lang}</span>
        </div>
        <button class="code_copy_btn js-copy-code" data-code="${escapedSnippet}" aria-label="Copy code">
          <img class="code_copy_icon" src="./assets/icons/copy.svg" alt="" aria-hidden="true" /> Copy code
        </button>
      </div>
      <div class="code_body">
        <pre class="code_pre"><code class="code_line">${highlighted}</code></pre>
      </div>
    </div>
  `;
}

function buildListHtml(items) {
  if (!items || !items.length) return '';
  const listItems = items.map(item => `<li class="msg_list_item">${escapeHtml(item)}</li>`).join('');
  return `<ol class="msg_list">${listItems}</ol>`;
}

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

function appendAssistantMessage(text, extras) {
  const chatFeed = document.querySelector('#chatFeed');
  if (!chatFeed) return;

  let richContentHtml = '';

  if (extras) {
    if (extras.language && extras.snippet) {
      richContentHtml += buildCodeBlockHtml(extras);
    }
    if (extras.code) {
      richContentHtml += buildCodeBlockHtml(extras.code);
    }
    if (extras.list) {
      richContentHtml += buildListHtml(extras.list);
    }
    if (extras.items) {
      richContentHtml += buildListHtml(extras.items);
    }
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
      <img class="avatar_icon" src="./assets/icons/blossom.svg" alt="ChatGPT" />
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