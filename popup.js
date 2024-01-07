document.getElementById('checkPage').addEventListener('click', () => {
  const phraseLength = parseInt(document.getElementById('phraseLength').value);
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "calculateDensity", length: phraseLength });
  });
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "displayKeywords") {
    displayKeywords(request.keywords);
  }
});

function displayKeywords(keywords) {
  const keywordList = document.getElementById('keywordList');
  keywordList.innerHTML = '';

  const table = document.createElement('table');
  table.classList.add('keywordTable');

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['Phrase', 'Frequency', 'Density (%)'].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  keywords.forEach(keyword => {
    const row = document.createElement('tr');
    ['word', 'frequency', 'density'].forEach(key => {
      const td = document.createElement('td');
      td.textContent = keyword[key];
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  keywordList.appendChild(table);
}
