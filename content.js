chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "calculateDensity") {
    const keywords = calculateKeywordDensity(request.length);
    chrome.runtime.sendMessage({ action: "displayKeywords", keywords: keywords });
  }
});

function calculateKeywordDensity(phraseLength) {
  const text = document.body.innerText;
  const words = text.toLowerCase().match(/\b(\w+)\b/g).filter(word => word.length > 2);

  const phrases = [];
  for (let i = 0; i <= words.length - phraseLength; i++) {
    phrases.push(words.slice(i, i + phraseLength).join(' '));
  }

  const phraseCounts = phrases.reduce((counts, phrase) => {
    counts[phrase] = (counts[phrase] || 0) + 1;
    return counts;
  }, {});

  const totalPhrases = phrases.length;
  const keywordDensities = Object.entries(phraseCounts).map(([phrase, count]) => {
    return { word: phrase, frequency: count, density: ((count / totalPhrases) * 100).toFixed(2) };
  });

  return keywordDensities.sort((a, b) => b.density - a.density).slice(0, 5);
}
  
