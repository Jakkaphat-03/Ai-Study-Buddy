export interface Document {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  extracted_text: string | null;
  created_at: string;
}

export interface DocumentSummary {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
  summary_count: number;
}