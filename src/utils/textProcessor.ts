import * as wanakana from 'wanakana';
import kuromoji from 'kuromoji';

interface ProcessedData {
  vocabulary: VocabularyItem[];
  sentences: string[];
  quiz: QuizQuestion[];
}

let tokenizer: any = null;

const initializeTokenizer = async () => {
  if (!tokenizer) {
    tokenizer = await new Promise((resolve, reject) => {
      kuromoji.builder({ dicPath: '/dict' }).build((err, _tokenizer) => {
        if (err) {
          reject(err);
        } else {
          resolve(_tokenizer);
        }
      });
    });
  }
  return tokenizer;
};

export const processJapaneseText = async (text: string): Promise<ProcessedData> => {
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
  const quiz: QuizQuestion[] = Array.from(vocabularyMap.values()).map(vocab => ({
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
    quiz
  };
}; 