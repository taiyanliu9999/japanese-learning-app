import * as kuromoji from 'kuromoji';

let tokenizer: any = null;

export const initializeKuromoji = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (tokenizer) {
      resolve();
      return;
    }

    kuromoji.builder({ dicPath: '/dict' })
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

export const tokenizeText = (text: string) => {
  if (!tokenizer) {
    throw new Error('Kuromoji not initialized. Call initializeKuromoji() first.');
  }
  return tokenizer.tokenize(text);
};

export interface KuromojiToken {
  word_id: number;
  word_type: string;
  word_position: number;
  surface_form: string;
  pos: string;
  pos_detail_1: string;
  pos_detail_2: string;
  pos_detail_3: string;
  conjugated_type: string;
  conjugated_form: string;
  basic_form: string;
  reading: string;
  pronunciation: string;
} 