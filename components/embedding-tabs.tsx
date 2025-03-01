"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { SingleEmbedding } from "@/components/single-embedding";
import { BatchEmbedding } from "@/components/batch-embedding";
import { SemanticSearch } from "@/components/semantic-search";
import { SimilarityAnalysis } from "@/components/similarity-analysis";
import {
  Document,
  EmbeddingResult,
  SearchResult
} from "@/types";

interface EmbeddingTabsProps {
  isModelLoaded: boolean;
  encodingFormat: string;
  onGenerateEmbedding: (text: string) => Promise<void>;
  onGenerateBatchEmbeddings: (texts: string[]) => Promise<void>;
  onAddDocument: (text: string) => Promise<void>;
  onClearDocuments: () => void;
  onSearch: (query: string) => Promise<void>;
  onCompareTexts: (text1: string, text2: string) => Promise<void>;
  singleEmbeddingResult: EmbeddingResult | null;
  batchEmbeddingResult: {
    embeddings: (number[] | string)[];
    dimensions: number | string;
    tokenCount: number;
    timeTaken: number;
    count: number;
  } | null;
  documents: Document[];
  searchResults: SearchResult[];
  similarityResult: {
    similarity: number;
    interpretation: string;
  } | null;
  isProcessing: boolean;
}

export function EmbeddingTabs({
  isModelLoaded,
  encodingFormat,
  onGenerateEmbedding,
  onGenerateBatchEmbeddings,
  onAddDocument,
  onClearDocuments,
  onSearch,
  onCompareTexts,
  singleEmbeddingResult,
  batchEmbeddingResult,
  documents,
  searchResults,
  similarityResult,
  isProcessing
}: EmbeddingTabsProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Tabs defaultValue="single-embedding" className="w-full">
          <TabsList className="grid grid-cols-4 rounded-b-none">
            <TabsTrigger value="single-embedding">Single Embedding</TabsTrigger>
            <TabsTrigger value="batch-embedding">Batch Embedding</TabsTrigger>
            <TabsTrigger value="semantic-search">Semantic Search</TabsTrigger>
            <TabsTrigger value="similarity-analysis">
              Similarity Analysis
            </TabsTrigger>
          </TabsList>
          <TabsContent value="single-embedding" className="p-6">
            <SingleEmbedding
              isModelLoaded={isModelLoaded}
              onGenerateEmbedding={onGenerateEmbedding}
              result={singleEmbeddingResult}
              isGenerating={isProcessing}
              encodingFormat={encodingFormat}
            />
          </TabsContent>
          <TabsContent value="batch-embedding" className="p-6">
            <BatchEmbedding
              isModelLoaded={isModelLoaded}
              onGenerateBatchEmbeddings={onGenerateBatchEmbeddings}
              result={batchEmbeddingResult}
              isGenerating={isProcessing}
              encodingFormat={encodingFormat}
            />
          </TabsContent>
          <TabsContent value="semantic-search" className="p-6">
            <SemanticSearch
              isModelLoaded={isModelLoaded}
              onAddDocument={onAddDocument}
              onClearDocuments={onClearDocuments}
              onSearch={onSearch}
              documents={documents}
              searchResults={searchResults}
              isProcessing={isProcessing}
            />
          </TabsContent>
          <TabsContent value="similarity-analysis" className="p-6">
            <SimilarityAnalysis
              isModelLoaded={isModelLoaded}
              onCompareTexts={onCompareTexts}
              result={similarityResult}
              isComparing={isProcessing}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}