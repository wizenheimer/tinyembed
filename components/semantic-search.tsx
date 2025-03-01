"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SemanticSearchProps } from "@/types";

export function SemanticSearch({
  isModelLoaded,
  onAddDocument,
  onClearDocuments,
  onSearch,
  documents,
  searchResults,
  isProcessing
}: SemanticSearchProps) {
  const [documentText, setDocumentText] = useState("");
  const [queryText, setQueryText] = useState("");

  const handleAddDocument = () => {
    if (documentText.trim()) {
      onAddDocument(documentText.trim());
      setDocumentText("");
    }
  };

  const handleSearch = () => {
    if (queryText.trim() && documents.length > 0) {
      onSearch(queryText.trim());
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Documents</h3>
        <p className="text-sm text-muted-foreground mb-2">Add documents to search through:</p>
        <Textarea
          id="document-input"
          placeholder="Enter text to add as a document..."
          value={documentText}
          onChange={(e) => setDocumentText(e.target.value)}
          disabled={!isModelLoaded || isProcessing}
          className="min-h-[100px] mb-2"
        />
        <div className="space-x-2 mb-4">
          <Button
            onClick={handleAddDocument}
            disabled={!isModelLoaded || isProcessing || !documentText.trim()}
            size="sm"
          >
            Add Document
          </Button>
          <Button
            onClick={onClearDocuments}
            disabled={!isModelLoaded || isProcessing || documents.length === 0}
            variant="outline"
            size="sm"
          >
            Clear All
          </Button>
        </div>
        <div className="border rounded-md max-h-[300px] overflow-y-auto">
          {documents.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground">
              No documents added yet.
            </div>
          ) : (
            documents.map((doc, index) => (
              <div
                key={index}
                className="p-3 border-b last:border-b-0 text-sm"
              >
                {index + 1}. {doc.text.length > 60
                  ? doc.text.substring(0, 60) + "..."
                  : doc.text}
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Search</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Search the documents by semantic meaning:
        </p>
        <Textarea
          id="search-query"
          placeholder="Enter search query..."
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          disabled={!isModelLoaded || isProcessing || documents.length === 0}
          className="min-h-[80px] mb-2"
        />
        <Button
          onClick={handleSearch}
          disabled={
            !isModelLoaded ||
            isProcessing ||
            documents.length === 0 ||
            !queryText.trim()
          }
          className="mb-4"
        >
          Search
        </Button>

        <h4 className="text-md font-medium mb-2">Results</h4>
        {searchResults.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            Search results will appear here.
          </div>
        ) : (
          <div className="space-y-2">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between border rounded-md p-3"
              >
                <div className="truncate flex-1 max-w-[60%]">
                  {result.text.length > 60
                    ? result.text.substring(0, 60) + "..."
                    : result.text}
                </div>
                <div className="flex-1 flex items-center px-2">
                  <div className="h-2 bg-slate-200 flex-1 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${result.similarity * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="font-bold">
                  {(result.similarity * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}