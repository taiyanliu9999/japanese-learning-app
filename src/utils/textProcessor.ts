import * as wanakana from 'wanakana';
import kuromoji from 'kuromoji';

interface ProcessedData {
  vocabulary: VocabularyItem[];
  sentences: string[];
  quizzes: QuizQuestion[];
}

let tokenizer: any = null;

const initializeTokenizer = async () => {
  if (!tokenizer) {
    try {
      // Try different dictionary paths
      const dicPaths = [
        '/dict',  // Production path
        process.env.PUBLIC_URL ? process.env.PUBLIC_URL + '/dict' : null, // Development path
        './dict'  // Fallback path
      ].filter(Boolean);

      for (const dicPath of dicPaths) {
        try {
          tokenizer = await new Promise((resolve, reject) => {
            console.log('Attempting to load dictionary from:', dicPath);
            kuromoji.builder({ dicPath }).build((err, _tokenizer) => {
              if (err) {
                console.error('Failed to load dictionary from', dicPath, ':', err);
                reject(err);
              } else {
                console.log('Successfully loaded dictionary from:', dicPath);
                resolve(_tokenizer);
              }
            });
          });
          break; // Break the loop if successful
        } catch (err) {
          console.warn('Failed to load dictionary from', dicPath, ', trying next path');
          continue;
        }
      }

      if (!tokenizer) {
        throw new Error('Failed to load kuromoji dictionary from any path');
      }
    } catch (error) {
      console.error('Failed to initialize tokenizer:', error);
      throw error;
    }
  }
  return tokenizer;
};

export const processJapaneseText = async (text: string): Promise<ProcessedData> => {
  try {
    const _tokenizer = await initializeTokenizer();
    const tokens = _tokenizer.tokenize(text);

    // Extract vocabulary
    const vocabularyMap = new Map<string, VocabularyItem>();
    tokens.forEach((token: any) => {
      if (token.pos === '名詞' || token.pos === '動詞' || token.pos === '形容詞') {
        const word = token.surface_form;
        if (!vocabularyMap.has(word)) {
          vocabularyMap.set(word, {
            id: Math.random().toString(36).substr(2, 9),
            word: word,
            reading: token.reading || wanakana.toHiragana(word),
            meaning: '', // This should be filled with actual translations
            example: '', // This should be filled with example sentences
            isFavorite: false,
            proficiency: 0
          });
        }
      }
    });

    // Extract sentences
    const sentences = text.split(/[。！？]/).filter(s => s.trim());

    // Generate quiz questions
    const quizzes = Array.from(vocabularyMap.values()).map(vocab => ({
      question: `「${vocab.word}」の読み方は何ですか？`,
      options: [
        vocab.reading,
        // Generate some plausible but incorrect readings
        wanakana.toHiragana(vocab.word + 'う'),
        wanakana.toHiragana(vocab.word + 'ん'),
        wanakana.toHiragana(vocab.word + 'つ')
      ].sort(() => Math.random() - 0.5),
      correctAnswer: vocab.reading,
      explanation: `「${vocab.word}」は「${vocab.reading}」と読みます。`
    }));

    return {
      vocabulary: Array.from(vocabularyMap.values()),
      sentences,
      quizzes
    };
  } catch (error) {
    console.error('Error processing Japanese text:', error);
    return {
      vocabulary: [],
      sentences: [],
      quizzes: []
    };
  }
}; 