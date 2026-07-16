export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatDocument {
  id: string;
  file_name: string;
}

export interface ChatSummary {
  id: string;
  document_id: string;
  summary_type: string;
  content: string;
  created_at: string;
}

export interface GenerateChatRequest {
  documentId: string;
  messages: ChatMessage[];
  question: string;
}

export interface GenerateChatResponse {
  answer: string;
}