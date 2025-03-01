"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SystemStatus } from "@/components/system-status";
import { ModelControls } from "@/components/model-controls";
import { EmbeddingTabs } from "@/components/embedding-tabs";
import { SystemLog } from "@/components/system-log";
import { formatBytes, formatTime, cosineSimilarity, getSimilarityInterpretation } from "@/lib/utils";
import type {
  Log,
  Progress,
  Document,
  EmbeddingResult,
  SearchResult,
  TinyLMCapabilities
} from "@/types";
import { TinyLM } from 'tinylm';

export default function Home() {
  // System status state
  const [webGPUStatus, setWebGPUStatus] = useState<string>("unknown");
  const [fp16Status, setFp16Status] = useState<string>("unknown");
  const [modelStatus, setModelStatus] = useState<string>("not-loaded");
  const [backendValue, setBackendValue] = useState<string>("Unknown");
  const [progress, setProgress] = useState<Progress | null>(null);
  
  
  // Model state
  const [tiny, setTiny] = useState<any>(null);
  const [loadedModelName, setLoadedModelName] = useState<string | null>(null);
  const [encodingFormat, setEncodingFormat] = useState<string>("float");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Embedding results state
  const [singleEmbeddingResult, setSingleEmbeddingResult] = useState<EmbeddingResult | null>(null);
  const [batchEmbeddingResult, setBatchEmbeddingResult] = useState<{
    embeddings: (number[] | string)[];
    dimensions: number | string;
    tokenCount: number;
    timeTaken: number;
    count: number;
  } | null>(null);
  
  // Documents and search state
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  
  
  // Similarity analysis state
  const [similarityResult, setSimilarityResult] = useState<{
    similarity: number;
    interpretation: string;
  } | null>(null);
  
  // Logs state
  const [logs, setLogs] = useState<Log[]>([]);

  // Add a log entry
  const addLogEntry = useCallback((message: string): void => {
    setLogs((prevLogs) => [
      ...prevLogs,
      {
        timestamp: new Date().toLocaleTimeString(),
        message
      }
    ]);
  }, []);


 // Initialize TinyLM
  useEffect(() => {
    const initTinyLM = async () => {
      if (typeof window === "undefined" || !TinyLM) return;
      
      try {
        addLogEntry("Initializing TinyLM...");
        
        // Create TinyLM instance with progress tracking
        const tinyInstance = new TinyLM({
          progressCallback: handleProgress,
          progressThrottleTime: 50
        });
        
        setTiny(tinyInstance);
        
        // Check hardware capabilities
        addLogEntry("Checking hardware capabilities...");
        const capabilities = await tinyInstance.models.check();
        
        // Update UI with capabilities
        setWebGPUStatus(capabilities.isWebGPUSupported ? "available" : "not-available");
        setFp16Status(capabilities.fp16Supported ? "supported" : "not-supported");
        
        if (capabilities.environment && capabilities.environment.backend) {
          setBackendValue(capabilities.environment.backend);
        }
        
        addLogEntry(`Hardware check: WebGPU ${capabilities.isWebGPUSupported ? 'available' : 'not available'}, FP16 ${capabilities.fp16Supported ? 'supported' : 'not supported'}`);
        
        // Initialize TinyLM (without loading model yet)
        await tinyInstance.init({ lazyLoad: true });
        
        addLogEntry("Initialization complete. Ready to load model.");
      } catch (error: any) {
        addLogEntry(`Error initializing TinyLM: ${error.message}`);
      }
    };
    
    initTinyLM();
  }, [TinyLM, addLogEntry]);

  // Handle progress updates
  const handleProgress = useCallback((progressData: any): void => {
    const { status, type, percentComplete, message, files, overall } = progressData;
    
    // Log message
    let logMessage = `[${status}] (${type || 'unknown'}) ${message || ''}`;
    addLogEntry(logMessage);
    
    // Create progress data for UI
    if (type === 'model' || type === 'embedding_model') {
      setProgress({
        status,
        type,
        percentComplete,
        message: message || 'Loading model...',
        files,
        overall: overall ? {
          ...overall,
          formattedLoaded: formatBytes(overall.bytesLoaded),
          formattedTotal: formatBytes(overall.bytesTotal),
          formattedSpeed: overall.speed ? `${formatBytes(overall.speed)}/s` : '0 B/s',
          formattedRemaining: overall.timeRemaining ? formatTime(overall.timeRemaining) : '--'
        } : undefined
      });
      
      // Update model status
      if (status === 'loading' || status === 'initiate' || status === 'progress') {
        setModelStatus('loading');
      } else if (status === 'ready' || status === 'done') {
        setModelStatus('loaded');
        // Clear progress after a delay
        setTimeout(() => setProgress(null), 1500);
      } else if (status === 'error') {
        setModelStatus('error');
        setTimeout(() => setProgress(null), 1500);
      } else if (status === 'offloaded') {
        setModelStatus('not-loaded');
        setProgress(null);
      }
    }
  }, [addLogEntry]);

  // Load model
  const handleLoadModel = async (modelId: string, format: string): Promise<void> => {
    if (!tiny) return;
    
    try {
      addLogEntry(`Loading embedding model: ${modelId}`);
      setEncodingFormat(format);
      
      // Update UI state
      setModelStatus('loading');
      setLoadedModelName(modelId);
      
      // Load the model
      await tiny.init({
        embeddingModels: [modelId],
        lazyLoad: false
      });
      
      // UI updates on success
      addLogEntry(`Model ${modelId} loaded successfully!`);
      setModelStatus('loaded');
      
    } catch (error: any) {
      // UI updates on error
      addLogEntry(`Error loading model: ${error.message}`);
      setModelStatus('error');
    }
  };

  // Unload model
  const handleUnloadModel = async (): Promise<void> => {
    if (!tiny || !loadedModelName) return;
    
    try {
      addLogEntry(`Unloading embedding model: ${loadedModelName}`);
      
      // Update UI state
      setModelStatus('not-loaded');
      
      // Unload the model
      await tiny.embeddings.offloadModel(loadedModelName);
      
      // UI updates on success
      addLogEntry(`Model ${loadedModelName} unloaded successfully.`);
      setLoadedModelName(null);
      
      // Clear state
      setSingleEmbeddingResult(null);
      setBatchEmbeddingResult(null);
      setDocuments([]);
      setSearchResults([]);
      setSimilarityResult(null);
      
    } catch (error: any) {
      // UI updates on error
      addLogEntry(`Error unloading model: ${error.message}`);
      setModelStatus('loaded');
    }
  };

  // Generate single embedding
  const handleGenerateEmbedding = async (text: string): Promise<void> => {
    if (!tiny || !loadedModelName) return;
    
    try {
      setIsProcessing(true);
      addLogEntry(`Generating embedding for text: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
      
      // Time the operation
      const startTime = performance.now();
      
      // Generate embedding
      const result = await tiny.embeddings.create({
        model: loadedModelName,
        input: text,
        encoding_format: encodingFormat
      });
      
      const timeTaken = performance.now() - startTime;
      
      // Get the embedding
      const embedding = result.data[0].embedding;
      const dimensions = Array.isArray(embedding) ? embedding.length : 'unknown';
      const tokenCount = result.usage.prompt_tokens;
      
      // Update state
      setSingleEmbeddingResult({
        embedding,
        dimensions,
        tokenCount,
        timeTaken: Math.round(timeTaken)
      });
      
      addLogEntry(`Embedding generated successfully: ${dimensions} dimensions, ${tokenCount} tokens, ${Math.round(timeTaken)}ms`);
      
    } catch (error: any) {
      addLogEntry(`Error generating embedding: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate batch embeddings
  const handleGenerateBatchEmbeddings = async (texts: string[]): Promise<void> => {
    if (!tiny || !loadedModelName || texts.length === 0) return;
    
    try {
      setIsProcessing(true);
      addLogEntry(`Generating embeddings for ${texts.length} texts`);
      
      // Time the operation
      const startTime = performance.now();
      
      // Generate embeddings
      const result = await tiny.embeddings.create({
        model: loadedModelName,
        input: texts,
        encoding_format: encodingFormat
      });
      
      const timeTaken = performance.now() - startTime;
      
      // Get the embeddings
      const embeddings = result.data.map((d: { embedding: number[] | string }) => d.embedding);
      const dimensions = Array.isArray(embeddings[0]) ? embeddings[0].length : 'unknown';
      const tokenCount = result.usage.prompt_tokens;
      
      // Update state
      setBatchEmbeddingResult({
        embeddings,
        dimensions,
        tokenCount,
        timeTaken: Math.round(timeTaken),
        count: embeddings.length
      });
      
      addLogEntry(`Batch embeddings generated successfully: ${embeddings.length} embeddings, ${dimensions} dimensions, ${tokenCount} tokens, ${Math.round(timeTaken)}ms`);
      
    } catch (error: any) {
      addLogEntry(`Error generating batch embeddings: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Add a document for semantic search
  const handleAddDocument = async (text: string): Promise<void> => {
    if (!tiny || !loadedModelName) return;
    
    try {
      setIsProcessing(true);
      addLogEntry(`Adding document: "${text.substring(0, 40)}${text.length > 40 ? '...' : ''}"`);
      
      // Generate embedding for the document
      const result = await tiny.embeddings.create({
        model: loadedModelName,
        input: text,
        encoding_format: 'float' // Always use float for semantic search
      });
      
      // Add to documents array
      setDocuments(prev => [
        ...prev,
        {
          text,
          embedding: result.data[0].embedding
        }
      ]);
      
      addLogEntry(`Document added successfully. Total documents: ${documents.length + 1}`);
      
    } catch (error: any) {
      addLogEntry(`Error adding document: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear all documents
  const handleClearDocuments = (): void => {
    setDocuments([]);
    setSearchResults([]);
    addLogEntry('All documents cleared');
  };

  // Search the documents
  const handleSearch = async (query: string): Promise<void> => {
    if (!tiny || !loadedModelName || documents.length === 0) return;
    
    try {
      setIsProcessing(true);
      addLogEntry(`Searching for: "${query}"`);
      
      // Generate embedding for the query
      const result = await tiny.embeddings.create({
        model: loadedModelName,
        input: query,
        encoding_format: 'float'
      });
      
      const queryEmbedding = result.data[0].embedding;
      
      // Calculate similarity with each document
      const similarities: SearchResult[] = documents.map((doc, index) => {
        const similarity = cosineSimilarity(queryEmbedding, doc.embedding);
        return { index, similarity, text: doc.text };
      });
      
      // Sort by similarity (descending)
      similarities.sort((a, b) => b.similarity - a.similarity);
      
      // Update state
      setSearchResults(similarities);
      
      addLogEntry(`Search completed. Found ${similarities.length} results.`);
      
    } catch (error: any) {
      addLogEntry(`Error searching documents: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Compare two texts for similarity
  const handleCompareTexts = async (text1: string, text2: string): Promise<void> => {
    if (!tiny || !loadedModelName) return;
    
    try {
      setIsProcessing(true);
      addLogEntry('Comparing texts for similarity...');
      
      // Generate embeddings for both texts
      const result = await tiny.embeddings.create({
        model: loadedModelName,
        input: [text1, text2],
        encoding_format: 'float'
      });
      
      const embedding1 = result.data[0].embedding;
      const embedding2 = result.data[1].embedding;
      
      // Calculate cosine similarity
      const similarity = cosineSimilarity(embedding1, embedding2);
      const similarityPercent = similarity * 100;
      
      // Get interpretation text
      const interpretation = getSimilarityInterpretation(similarityPercent);
      
      // Update state
      setSimilarityResult({
        similarity: similarityPercent,
        interpretation
      });
      
      addLogEntry(`Comparison complete. Similarity: ${similarityPercent.toFixed(1)}%`);
      
    } catch (error: any) {
      addLogEntry(`Error comparing texts: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="container mx-auto py-6 space-y-6">
      <header className="pb-6 mb-6 border-b">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          TinyEmbed
        </h1>
        <p className="leading-7 text-muted-foreground">
          Generate text embeddings in your browser
        </p>
      </header>

      <SystemStatus
        webGPUStatus={webGPUStatus}
        fp16Status={fp16Status}
        modelStatus={modelStatus}
        backendValue={backendValue}
        progress={progress}
      />

      <ModelControls
        onLoadModel={handleLoadModel}
        onUnloadModel={handleUnloadModel}
        isModelLoaded={modelStatus === 'loaded'}
        isModelLoading={modelStatus === 'loading'}
      />

      <EmbeddingTabs
        isModelLoaded={modelStatus === 'loaded'}
        encodingFormat={encodingFormat}
        onGenerateEmbedding={handleGenerateEmbedding}
        onGenerateBatchEmbeddings={handleGenerateBatchEmbeddings}
        onAddDocument={handleAddDocument}
        onClearDocuments={handleClearDocuments}
        onSearch={handleSearch}
        onCompareTexts={handleCompareTexts}
        singleEmbeddingResult={singleEmbeddingResult}
        batchEmbeddingResult={batchEmbeddingResult}
        documents={documents}
        searchResults={searchResults}
        similarityResult={similarityResult}
        isProcessing={isProcessing}
      />

      <SystemLog logs={logs} />
    </main>
  );
}