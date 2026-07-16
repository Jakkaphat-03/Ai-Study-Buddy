export interface HistoryDocument {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
  summary_count: number;
}

export interface HistorySummary {
  id: string;
  summary_type: string;
  content: string;
  created_at: string;
  document_id: string;
  document_name: string;
}

export interface HistoryQuiz {
  id: string;
  difficulty: string;
  score: number | null;
  total: number | null;
  created_at: string;
  document_id: string;
  document_name: string;
}