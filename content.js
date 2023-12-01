function calculateKeywordDensity() {
    const text = document.body.innerText;
    const words = text.toLowerCase().match(/\b(\w+)\b/g).filter(word => word.length > 2 && !['and', 'the', 'for', 'is', 'that', 'or', 'it'].includes(word));
    
    // Count occurrences of each word
    const wordCounts = words.reduce((counts, word) => {
        counts[word] = (counts[word] || 0) + 1;
        return counts;
    }, {});

    // Calculate densities
    const totalWords = words.length;
    const keywordDensities = Object.entries(wordCounts).map(([word, count]) => {
        return { word, density: (count / totalWords * 100).toFixed(2) };
    });

    // Sort by density and return top 10
    return keywordDensities.sort((a, b) => b.density - a.density).slice(0, 10);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "calculateDensity") {
        const topKeywords = calculateKeywordDensity();
        sendResponse({ topKeywords });
    }
    return true; // Indicates an asynchronous response is forthcoming
});
