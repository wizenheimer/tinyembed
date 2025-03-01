"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SimilarityAnalysisProps } from "@/types";

export function SimilarityAnalysis({
  isModelLoaded,
  onCompareTexts,
  result,
  isComparing
}: SimilarityAnalysisProps) {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");

  const handleCompareTexts = () => {
    if (text1.trim() && text2.trim()) {
      onCompareTexts(text1.trim(), text2.trim());
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="text1" className="text-sm font-medium block mb-2">
            First Text:
          </label>
          <Textarea
            id="text1"
            placeholder="Enter first text..."
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            disabled={!isModelLoaded || isComparing}
            className="min-h-[100px]"
          />
        </div>
        <div>
          <label htmlFor="text2" className="text-sm font-medium block mb-2">
            Second Text:
          </label>
          <Textarea
            id="text2"
            placeholder="Enter second text..."
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            disabled={!isModelLoaded || isComparing}
            className="min-h-[100px]"
          />
        </div>
      </div>

      <div>
        <Button
          onClick={handleCompareTexts}
          disabled={!isModelLoaded || isComparing || !text1.trim() || !text2.trim()}
        >
          Compare Texts
        </Button>
      </div>

      {result && (
        <div className="border rounded-md p-4">
          <h3 className="text-lg font-medium mb-4">Similarity Result</h3>
          <div className="flex items-center justify-between mb-4">
            <div>Cosine Similarity:</div>
            <div className="flex-1 mx-4">
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${result.similarity}%` }}
                ></div>
              </div>
            </div>
            <div className="font-bold text-lg">
              {result.similarity.toFixed(1)}%
            </div>
          </div>
          <div className="text-sm">{result.interpretation}</div>
        </div>
      )}
    </div>
  );
}