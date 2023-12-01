document.getElementById('checkPage').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: checkKeywordsOnPage
    }, (results) => {
      const keywords = results[0].result;
      const keywordList = document.getElementById('keywordList');
      keywordList.innerHTML = '';
      keywords.forEach(keyword => {
        const div = document.createElement('div');
        div.classList.add('keywordItem');
        div.textContent = `${keyword.word}: ${keyword.density}%`;
        keywordList.appendChild(div);
      });
    });
  });
});

function checkKeywordsOnPage() {
  const text = document.body.innerText;
  const words = text.toLowerCase().match(/\b(\w+)\b/g).filter(word => word.length > 2 && !['and', 'the', 'for'].includes(word));
  const wordCounts = words.reduce((counts, word) => {
    counts[word] = (counts[word] || 0) + 1;
    return counts;
  }, {});
  const totalWords = words.length;
  const keywordDensities = Object.entries(wordCounts).map(([word, count]) => {
    return { word, density: (count / totalWords * 100).toFixed(2) };
  });
  return keywordDensities.sort((a, b) => b.density - a.density).slice(0, 10);
}
  