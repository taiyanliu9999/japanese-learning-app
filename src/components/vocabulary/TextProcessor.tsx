import React, { useState, useEffect } from 'react';
import kuromoji from 'kuromoji';
import './TextProcessor.css';

interface TextProcessorProps {
  text: string;
  onTokensProcessed?: (tokens: kuromoji.IpadicFeatures[]) => void;
}

interface TokenTooltipData {
  reading: string;
  pos: string;
  baseForm: string;
}

const TextProcessor: React.FunctionComponent<TextProcessorProps> = ({ text, onTokensProcessed }) => {
  const [tokens, setTokens] = useState<kuromoji.IpadicFeatures[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processText = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const tokenizer = await new Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>>((resolve, reject) => {
          kuromoji.builder({ dicPath: '/dict' }).build((err, tokenizer) => {
            if (err) reject(err);
            else resolve(tokenizer);
          });
        });

        const processedTokens = tokenizer.tokenize(text);
        setTokens(processedTokens);
        if (onTokensProcessed) {
          onTokensProcessed(processedTokens);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process text');
      } finally {
        setIsLoading(false);
      }
    };

    if (text) {
      processText();
    }
  }, [text, onTokensProcessed]);

  const getTooltipContent = (token: kuromoji.IpadicFeatures): TokenTooltipData => {
    return {
      reading: token.reading || token.surface_form,
      pos: `${token.pos}${token.pos_detail_1 ? ` (${token.pos_detail_1})` : ''}`,
      baseForm: token.basic_form || token.surface_form
    };
  };

  if (isLoading) {
    return <div className="text-processor">Loading...</div>;
  }

  if (error) {
    return <div className="text-processor">Error: {error}</div>;
  }

  return (
    <div className="text-processor">
      {tokens.map((token, index) => {
        const tooltipData = getTooltipContent(token);
        return (
          <span
            key={`${token.surface_form}-${index}`}
            className="token"
            title={`Reading: ${tooltipData.reading}
Part of Speech: ${tooltipData.pos}
Base Form: ${tooltipData.baseForm}`}
          >
            {token.surface_form}
          </span>
        );
      })}
    </div>
  );
};

export default TextProcessor; 