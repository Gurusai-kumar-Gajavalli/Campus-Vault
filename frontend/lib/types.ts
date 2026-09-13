export type StudentYear = '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Alumni';

export interface Profile {
  id: string;
  name: string;
  year: StudentYear;
  branch: string;
}

export interface Vault {
  id: string;
  slug: string;
  name: string;
  category: 'Placement' | 'Course Notes' | 'Project' | 'General';
  description: string;
  entry_count?: number;
}

export interface Entry {
  id: string;
  vault_id: string;
  author_id: string;
  author_name?: string;
  author_year?: StudentYear;
  author_branch?: string;
  title: string;
  content: string;
  resource_url: string | null;
  created_at: string;
  updated_at?: string;
  vote_count: number;
  hasVoted?: boolean;
  isOwner?: boolean;
  comment_count?: number;
}

export interface Comment {
  id: string;
  entry_id: string;
  author_id: string;
  author_name?: string;
  author_year?: StudentYear;
  author_branch?: string;
  content: string;
  created_at: string;
  isOwner?: boolean;
}
