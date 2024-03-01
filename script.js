async function convertText() {
  const inputText = document.getElementById('textInput').value;
  const sentences = inputText.split('. '); // Split text into sentences

  const modifiedSentences = await Promise.all(sentences.map(async (sentence) => {
    let modifiedSentence = await introduceVariability(sentence.trim()); // Introduce variability
    modifiedSentence = await replaceWords(modifiedSentence); // Replace words with synonyms
    return modifiedSentence;
  }));

  const outputText = modifiedSentences.join('. '); // Rejoin sentences with proper punctuation
  document.getElementById('outputText').innerText = outputText;
}

async function introduceVariability(sentence) {
  // Introduce variability by making slight modifications to the sentence
  // For demonstration purposes, this function randomly decides whether to add punctuation or change word order
  let modifiedSentence = sentence;

  if (Math.random() < 0.2) { // 20% chance to add punctuation
    modifiedSentence += Math.random() < 0.5 ? ',' : ';';
  }

  if (Math.random() < 0.2) { // 20% chance to change word order
    const words = sentence.split(' ');
    words.sort(() => Math.random() - 0.5); // Shuffle words randomly
    modifiedSentence = words.join(' ');
  }

  return modifiedSentence;
}

async function replaceWords(sentence) {
  const words = sentence.split(' ');

  const replacedWords = await Promise.all(words.map(async (word) => {
    if (Math.random() < 0.3) { // 30% chance to replace a word with a synonym
      return await getSynonym(word);
    } else {
      return word;
    }
  }));

  return replacedWords.join(' '); // Rejoin words into a sentence
}

async function getSynonym(word) {
  const response = await fetch(`https://api.datamuse.com/words?rel_syn=${word}`);
  const data = await response.json();
  if (data.length > 0) {
    return data[Math.floor(Math.random() * data.length)].word; // Choose a random synonym from the list
  } else {
    return word; // If synonym not found, return the original word
  }
}

