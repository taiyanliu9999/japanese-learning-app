import * as wanakana from 'wanakana';
import kuromoji from 'kuromoji';

export interface VocabularyItem {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  example: string;
  isFavorite: boolean;
  proficiency: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface ProcessedData {
  vocabulary: VocabularyItem[];
  sentences: string[];
  quizzes: QuizQuestion[];
}

let tokenizer: any = null;
let isInitializing = false;
let initializationPromise: Promise<any> | null = null;

const initializeTokenizer = async () => {
  if (tokenizer) return tokenizer;
  
  // If already initializing, return the existing promise
  if (isInitializing && initializationPromise) {
    return initializationPromise;
  }
  
  isInitializing = true;
  initializationPromise = (async () => {
    try {
      // Try different dictionary paths
      const dicPaths = [
        './dict',  // Relative path
        '/dict',   // Absolute path
        process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/dict` : null,
        window.location.origin + '/dict',
        '.'
      ].filter(Boolean);
      
      console.log('将尝试以下字典路径:', dicPaths);
      
      for (let i = 0; i < dicPaths.length; i++) {
        const dicPath = dicPaths[i];
        try {
          console.log(`[${i+1}/${dicPaths.length}] 尝试从 ${dicPath} 加载kuromoji字典...`);
          const _tokenizer = await new Promise((resolve, reject) => {
            kuromoji.builder({ dicPath }).build((err, tokenizer) => {
              if (err) {
                console.warn(`从 ${dicPath} 加载字典失败:`, err);
                reject(err);
              } else {
                console.log(`成功从 ${dicPath} 加载字典`);
                resolve(tokenizer);
              }
            });
          });
          tokenizer = _tokenizer;
          break;
        } catch (err) {
          console.warn(`从 ${dicPath} 加载字典失败, 尝试下一个路径`);
        }
      }
      
      if (!tokenizer) {
        throw new Error('无法从任何路径加载kuromoji字典');
      }
      
      return tokenizer;
    } catch (error) {
      console.error('初始化tokenizer失败:', error);
      throw error;
    } finally {
      isInitializing = false;
    }
  })();
  
  return initializationPromise;
};

// Initialize tokenizer when module is loaded
initializeTokenizer().catch(err => console.error('Failed to initialize tokenizer on load:', err));

export const processJapaneseText = (text: string): ProcessedData => {
  // Return empty data if there's no text
  if (!text || !text.trim()) {
    return { vocabulary: [], sentences: [], quizzes: [] };
  }

  // If tokenizer is not initialized yet, return empty data
  // The component will re-render when tokenizer is ready
  if (!tokenizer) {
    console.log('Tokenizer not ready yet, returning empty data');
    // Trigger initialization if not already in progress
    if (!isInitializing) {
      initializeTokenizer()
        .then(() => {
          console.log('Tokenizer initialized successfully');
          // You could dispatch an event or use a callback here
        })
        .catch(error => {
          console.error('Failed to initialize tokenizer:', error);
        });
    }
    return { vocabulary: [], sentences: [], quizzes: [] };
  }

  try {
    // Test tokenizer to make sure it works
    const testTokens = tokenizer.tokenize('テスト');
    console.log('Tokenizer测试成功:', testTokens);
    
    // Tokenize the text
    const tokens = tokenizer.tokenize(text);

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
    const quizzes = Array.from(vocabularyMap.values()).slice(0, 10).map(vocab => ({
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
    console.error('处理日语文本时出错:', error);
    return {
      vocabulary: [],
      sentences: [],
      quizzes: []
    };
  }
}; 