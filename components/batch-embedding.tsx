"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BatchEmbeddingProps } from "@/types";
import { formatVector } from "@/lib/utils";

export function BatchEmbedding({
  isModelLoaded,
  onGenerateBatchEmbeddings,
  result,
  isGenerating,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  encodingFormat
}: BatchEmbeddingProps) {
  const [text, setText] = useState("");

  const handleGenerateBatchEmbeddings = () => {
    if (text.trim()) {
      // Split by lines and filter empty lines
      const texts = text
        .split("\n")
        .map((t) => t.trim())
        .filter((t) => t);

      if (texts.length > 0) {
        onGenerateBatchEmbeddings(texts);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="batch-text" className="text-sm font-medium block mb-2">
          Enter multiple texts (one per line):
        </label>
        <Textarea
          id="batch-text"
          placeholder="Enter one text per line..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!isModelLoaded || isGenerating}
          className="min-h-[150px]"
        />
      </div>
      <div>
        <Button
          onClick={handleGenerateBatchEmbeddings}
          disabled={!isModelLoaded || isGenerating || !text.trim()}
        >
          Generate Batch Embeddings
        </Button>
      </div>

      {result && (
        <>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="space-x-2">
              <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
                {result.count} embeddings
              </Badge>
              <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
                {result.dimensions} dimensions
              </Badge>
              <span>{result.tokenCount} tokens</span>
            </div>
            <div>{result.timeTaken}ms</div>
          </div>

          <div className="bg-muted p-4 rounded-md text-xs font-mono overflow-auto max-h-[200px] whitespace-pre-wrap">
            {result.embeddings.length > 0 && (
              <>
                <p>Generated {result.embeddings.length} embeddings with {result.dimensions} dimensions each.</p>
                <p>&nbsp;</p>
                <p>Sample (first embedding):</p>
                <p>{formatVector(result.embeddings[0])}</p>
                <p>&nbsp;</p>
                <p>Processing stats:</p>
                <p>- Average time per embedding: {(result.timeTaken / result.count).toFixed(2)}ms</p>
                <p>- Average tokens per text: {(result.tokenCount / result.count).toFixed(2)}</p>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}