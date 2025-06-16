/**
 * Type definitions for the DeepSlide PowerPoint Semantic Search system
 */

/**
 * Search result interface representing a slide match
 */
export interface SearchResult {
  slide_id: string;
  presentation_name: string;
  id: string;
  slide_number: number;
  image_url?: string;
  description: string;
  similarity?: number; // 0-1 score where 1 is exact match (optional for compatibility)
  distance?: number; // vector distance (lower = more relevant)
  metadata?: Record<string, any>;
  search_history_id?: string; // Added for feedback feature
}

/**
 * Search request payload
 */
export interface SearchRequest {
  query: string;
  limit?: number;
  filters?: SearchFilters;
}

/**
 * Search filters for refining results
 */
export interface SearchFilters {
  presentation_names?: string[];
  min_similarity?: number; // 0-1 threshold
  date_range?: {
    start?: string; // ISO date string
    end?: string; // ISO date string
  };
}

/**
 * Presentation metadata
 */
export interface Presentation {
  id: string;
  filename: string;
  filepath: string;
  slide_count: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  status: 'pending' | 'processing' | 'completed' | 'error';
}

/**
 * Slide metadata
 */
export interface Slide {
  id: string;
  presentation_name: string;
  slide_number: number;
  image_path?: string;
  description?: string;
  embedding_id?: string;
  updated_at: string; // ISO date string
}
