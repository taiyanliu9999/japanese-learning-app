import * as kuromoji from 'kuromoji';

let tokenizer: any = null;

export const initializeKuromoji = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (tokenizer) {
      console.log('Tokenizer already initialized');
      resolve();
      return;
    }

    // 尝试多个可能的字典路径
    const dicPaths = [
      '/dict',  // 生产环境路径
      process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/dict` : null, // 开发环境路径
      './dict',  // 备用路径
      'dict'     // 相对路径
    ].filter(Boolean);

    // 尝试每个路径，直到成功
    const tryPath = (index: number) => {
      if (index >= dicPaths.length) {
        reject(new Error('无法加载kuromoji字典，尝试了所有可能的路径'));
        return;
      }

      const dicPath = dicPaths[index];
      console.log(`尝试从 ${dicPath} 加载kuromoji字典...`);

      try {
        kuromoji.builder({ dicPath })
          .build((err, _tokenizer) => {
            if (err) {
              console.warn(`从 ${dicPath} 加载字典失败:`, err);
              // 尝试下一个路径
              tryPath(index + 1);
            } else {
              console.log(`成功从 ${dicPath} 加载字典`);
              // 验证tokenizer是否正确初始化
              try {
                const testResult = _tokenizer.tokenize('テスト');
                if (Array.isArray(testResult) && testResult.length > 0) {
                  console.log('Tokenizer测试成功');
                  tokenizer = _tokenizer;
                  resolve();
                } else {
                  console.warn(`从 ${dicPath} 加载的tokenizer测试失败`);
                  tryPath(index + 1);
                }
              } catch (testError) {
                console.warn(`Tokenizer测试出错:`, testError);
                tryPath(index + 1);
              }
            }
          });
      } catch (buildError) {
        console.warn(`构建tokenizer时出错:`, buildError);
        tryPath(index + 1);
      }
    };

    // 开始尝试第一个路径
    tryPath(0);
  });
};

export const tokenizeText = (text: string) => {
  if (!tokenizer) {
    throw new Error('Kuromoji not initialized. Call initializeKuromoji() first.');
  }
  try {
    return tokenizer.tokenize(text);
  } catch (error) {
    console.error('Tokenization error:', error);
    throw error;
  }
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