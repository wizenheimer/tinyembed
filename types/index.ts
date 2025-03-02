export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
  isTyping?: boolean;
};

export type ModelConfig = {
  model: string;
  temperature?: number;
  maxTokens?: number;
};

export type Log = {
  timestamp: string;
  message: string;
};

export type Progress = {
  status: string;
  type: string;
  percentComplete: number;
  message: string;
  files?: ProgressFile[];
  overall?: {
    bytesLoaded: number;
    bytesTotal: number;
    speed?: number;
    timeRemaining?: number;
    formattedLoaded?: string;
    formattedTotal?: string;
    formattedSpeed?: string;
    formattedRemaining?: string;
  };
};

export type TinyLMCapabilities = {
  isWebGPUSupported: boolean;
  fp16Supported: boolean;
  environment: {
    backend: string;
  };
};

export interface ProgressFile {
  id: string;
  name: string;
  status: string;
  percentComplete: number;
  bytesLoaded?: number;
  bytesTotal?: number;
  speed?: number;
  timeRemaining?: number;
}

export interface ProgressOverall {
  bytesLoaded: number;
  bytesTotal: number;
  speed: number;
  timeRemaining: number;
  formattedLoaded?: string;
  formattedTotal?: string;
  formattedSpeed?: string;
  formattedRemaining?: string;
}

export interface SystemStatusProps {
  webGPUStatus: string;
  fp16Status: string;
  modelStatus: string;
  backendValue: string;
  progress: Progress | null;
}

export interface ModelControlsProps {
  onLoadModel: (modelId: string, encodingFormat: string) => Promise<void>;
  onUnloadModel: () => Promise<void>;
  isModelLoaded: boolean;
  isModelLoading: boolean;
}

export interface EmbeddingResult {
  embedding: number[] | string;
  dimensions: number | string;
  tokenCount: number;
  timeTaken: number;
}

export interface SingleEmbeddingProps {
  isModelLoaded: boolean;
  onGenerateEmbedding: (text: string) => Promise<void>;
  result: EmbeddingResult | null;
  isGenerating: boolean;
  encodingFormat: string;
}

export interface BatchEmbeddingProps {
  isModelLoaded: boolean;
  onGenerateBatchEmbeddings: (texts: string[]) => Promise<void>;
  result: {
    embeddings: (number[] | string)[];
    dimensions: number | string;
    tokenCount: number;
    timeTaken: number;
    count: number;
  } | null;
  isGenerating: boolean;
  encodingFormat: string;
}

export interface Document {
  text: string;
  embedding: number[];
}

export interface SearchResult {
  text: string;
  similarity: number;
  index: number;
}

export interface SemanticSearchProps {
  isModelLoaded: boolean;
  onAddDocument: (text: string) => Promise<void>;
  onClearDocuments: () => void;
  onSearch: (query: string) => Promise<void>;
  documents: Document[];
  searchResults: SearchResult[];
  isProcessing: boolean;
}

export interface SimilarityAnalysisProps {
  isModelLoaded: boolean;
  onCompareTexts: (text1: string, text2: string) => Promise<void>;
  result: {
    similarity: number;
    interpretation: string;
  } | null;
  isComparing: boolean;
}

export interface SystemLogProps {
  logs: Log[];
}

// Declare the global window interface to include TinyLM-related methods
declare global {
  interface Window {
    fs?: {
      readFile: (path: string, options?: { encoding?: string }) => Promise<Uint8Array | string>;
    };
  }
}