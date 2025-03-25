import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Supabaseクライアントを作成して export
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// テーブル名の定義
export const TABLES = {
  SCORES: 'scores',
};

// 型定義
export interface Score {
  id?: number;
  user_name: string;
  score: number;
  created_at?: string;
} 