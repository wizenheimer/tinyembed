"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SingleEmbeddingProps } from "@/types";
import { formatVector } from "@/lib/utils";

export function SingleEmbedding({
  isModelLoaded,
  onGenerateEmbedding,
  result,
  isGenerating,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  encodingFormat
}: SingleEmbeddingProps) {
  const [text, setText] = useState("");

  const handleGenerateEmbedding = () => {
    if (text.trim()) {
      onGenerateEmbedding(text.trim());
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="single-text" className="text-sm font-medium block mb-2">
          Enter text to embed:
        </label>
        <Textarea
          id="single-text"
          placeholder="Enter text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!isModelLoaded || isGenerating}
          className="min-h-[100px]"
        />
      </div>
      <div>
        <Button
          onClick={handleGenerateEmbedding}
          disabled={!isModelLoaded || isGenerating || !text.trim()}
        >
          Generate Embedding
        </Button>
      </div>

      {result && (
        <>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="space-x-2">
              <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
                {result.dimensions} dimensions
              </Badge>
              <span>{result.tokenCount} tokens</span>
            </div>
            <div>{result.timeTaken}ms</div>
          </div>

          <div className="bg-muted p-4 rounded-md text-xs font-mono overflow-auto max-h-[200px] whitespace-pre-wrap">
            {formatVector(result.embedding)}
          </div>
        </>
      )}
    </div>
  );
}