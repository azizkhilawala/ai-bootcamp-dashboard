export interface Student {
  id: number;
  name: string;
  location: string;
  role: string;
  specialization: string;
  hasChat: boolean;
  bio?: string;
}

export interface Tool {
  id: number;
  name: string;
  category: string;
  website: string;
  notes?: string;
  useCases?: string[];
}

export interface Workshop {
  id: number;
  number: number;
  title: string;
  date: string;
  description?: string;
  tools?: string[];
  youtubeLink?: string;
  instructors?: string[];
  notes?: string;
}

export interface Challenge {
  id: number;
  number: number;
  name: string;
  description: string;
  category: string;
  tools?: string[];
  details?: string;
  resources?: string[];
}

export interface SortConfig {
  key: string | null;
  direction: 'ascending' | 'descending';
}

export interface CategoryData {
  category: string;
  count: number;
  percentage: string;
} 