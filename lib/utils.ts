import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format bytes to human-readable size
 * @param {number} bytes - Bytes to format
 * @returns {string} Human-readable size
 */
export function formatBytes(bytes: number | undefined): string {
  if (bytes === 0 || !bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Format seconds to human-readable time
 * @param {number} seconds - Seconds to format
 * @returns {string} Human-readable time
 */
export function formatTime(seconds: number | undefined): string {
  if (!seconds || seconds === 0) return '';
  if (seconds < 60) return `${Math.ceil(seconds)}s`;
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.ceil(seconds % 60);
    return `${minutes}m ${secs}s`;
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

/**
 * Calculate cosine similarity between two vectors
 * @param {number[]} vec1 - First vector
 * @param {number[]} vec2 - Second vector
 * @returns {number} Cosine similarity (0-1)
 */
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

/**
 * Format vector for display
 * @param {number[] | string} vector - Vector to format
 * @returns {string} Formatted vector
 */
export function formatVector(vector: number[] | string): string {
  if (typeof vector === 'string') {
    // For base64 encoded vectors, show part of it
    return `Base64 encoded (${vector.length} characters):\n${vector.substring(0, 100)}...`;
  } else if (Array.isArray(vector)) {
    // For float arrays, show some values
    if (vector.length <= 10) return JSON.stringify(vector);
    return JSON.stringify(vector.slice(0, 5))
      .replace(']', ', ..., ')
      + JSON.stringify(vector.slice(-5)).substring(1);
  }
  return 'Unknown vector format';
}

/**
 * Get interpretation text based on similarity score
 * @param {number} similarityPercent - Similarity percentage (0-100)
 * @returns {string} Interpretation text
 */
export function getSimilarityInterpretation(similarityPercent: number): string {
  if (similarityPercent >= 90) {
    return 'These texts are semantically nearly identical.';
  } else if (similarityPercent >= 75) {
    return 'These texts are very similar in meaning.';
  } else if (similarityPercent >= 50) {
    return 'These texts are moderately similar.';
  } else if (similarityPercent >= 25) {
    return 'These texts have some similarity, but are mostly different.';
  } else {
    return 'These texts have very little semantic similarity.';
  }
}