chrome.runtime.onInstalled.addListener(() => {
  console.log('Keyword Density Checker extension installed.');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "calculateDensity" && sender.tab) {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      func: calculateKeywordDensity
    }, (injectionResults) => {
      for (const frameResult of injectionResults) {
        if (frameResult.result) {
          sendResponse({ topKeywords: frameResult.result });
        }
      }
    });
    return true; // Return true to indicate async response
  }
});

function calculateKeywordDensity() {
  const text = document.body.innerText;
  const words = text.toLowerCase().match(/\b(\w+)\b/g).filter(word => word.length > 2 && !
    ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", 
    "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 
    'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 
    'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 
    "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 
    'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 
    'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 
    'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 
    'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 
    'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 
    'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 
    'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 
    'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', 
    "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 
    'won', "won't", 'wouldn', "wouldn't"].includes(word));
  
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
  