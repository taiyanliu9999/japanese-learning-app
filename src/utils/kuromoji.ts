import * as kuromoji from 'kuromoji';

let tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null = null;

export const initializeKuromoji = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (tokenizer) {
      console.log('Tokenizer already initialized');
      resolve();
      return;
    }

    const dicPath = process.env.NODE_ENV === 'production' ? '/dict' : '/public/dict';
    console.log('Attempting to load dictionary from:', dicPath);

    kuromoji
      .builder({ dicPath })
      .build((err, _tokenizer) => {
        if (err) {
          console.error('Error initializing kuromoji:', err);
          reject(err);
          return;
        }
        if (!_tokenizer) {
          console.error('Tokenizer is undefined after initialization');
          reject(new Error('Failed to initialize tokenizer'));
          return;
        }
        tokenizer = _tokenizer;
        console.log('Successfully loaded dictionary from:', dicPath);
        resolve();
      });
  });
};

export const getTokenizer = (): kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null => {
  return tokenizer;
};

export const tokenize = (text: string): Promise<kuromoji.IpadicFeatures[]> => {
  return new Promise((resolve, reject) => {
    if (!tokenizer) {
      reject(new Error('Tokenizer not initialized'));
      return;
    }
    try {
      const tokens = tokenizer.tokenize(text);
      resolve(tokens);
    } catch (error) {
      console.error('Error tokenizing text:', error);
      reject(error);
    }
  });
}; 