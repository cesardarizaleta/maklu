export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Thesis {
  id: string;
  title: string;
  idea: string;
  discipline?: string;
  status: 'generating' | 'ready' | 'failed';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThesisPart {
  id: string;
  thesisId: string;
  key: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateThesisDto {
  idea: string;
  discipline?: string;
}

export interface UpdateThesisPartDto {
  content: string;
}

export interface ThesisTree {
  thesis: Thesis;
  parts: ThesisPart[];
}

export interface FullThesis {
  id: string;
  title: string;
  idea: string;
  discipline?: string;
  status: 'generating' | 'ready' | 'failed';
  progress?: number;
  createdAt: string;
  updatedAt: string;
  parts: { [key: string]: ThesisPart };
}