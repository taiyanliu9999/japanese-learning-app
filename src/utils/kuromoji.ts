import * as kuromoji from 'kuromoji';

let tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null = null;

export const initializeKuromoji = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (tokenizer) {
      resolve();
      return;
    }

    kuromoji
      .builder({ dicPath: '/dict' })
      .build((err, _tokenizer) => {
        if (err) {
          console.error('Error initializing kuromoji:', err);
          reject(err);
          return;
        }
        tokenizer = _tokenizer;
        resolve();
      });
  });
};

export const getTokenizer = (): kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null => {
  return tokenizer;
};

export const tokenize = (text: string): kuromoji.IpadicFeatures[] | null => {
  if (!tokenizer) {
    console.error('Tokenizer not initialized');
    return null;
  }
  return tokenizer.tokenize(text);
}; 