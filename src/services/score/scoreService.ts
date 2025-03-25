import { supabase, TABLES, Score } from '@/lib/supabase';

// Score型を再エクスポート
export type { Score };

/**
 * スコアをSupabaseに保存する
 */
export const saveScore = async (userName: string, score: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(TABLES.SCORES)
      .insert([{ user_name: userName, score }]);
    
    if (error) {
      console.error('スコア保存エラー:', error);
      return false;
    }
    
    return true;
  } catch (e) {
    console.error('スコア保存中に例外が発生:', e);
    return false;
  }
};

/**
 * 最高スコアのランキングを取得する
 */
export const getTopScores = async (limit = 10): Promise<Score[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.SCORES)
      .select('*')
      .order('score', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('ランキング取得エラー:', error);
      return [];
    }
    
    return data || [];
  } catch (e) {
    console.error('ランキング取得中に例外が発生:', e);
    return [];
  }
};

/**
 * 自分の順位を取得する
 */
export const getUserRank = async (score: number): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from(TABLES.SCORES)
      .select('*', { count: 'exact', head: true })
      .gt('score', score);
    
    if (error) {
      console.error('ランク取得エラー:', error);
      return 0;
    }
    
    // 自分より高いスコアの数 + 1 = 自分の順位
    return (count || 0) + 1;
  } catch (e) {
    console.error('ランク取得中に例外が発生:', e);
    return 0;
  }
};

/**
 * ローカルストレージにスコアを保存
 */
export const saveLocalScore = (score: number): void => {
  try {
    localStorage.setItem('highScore', score.toString());
  } catch (e) {
    console.error('ローカルスコア保存エラー:', e);
  }
};

/**
 * ローカルストレージから最高スコアを取得
 */
export const getLocalHighScore = (): number => {
  try {
    const score = localStorage.getItem('highScore');
    return score ? parseInt(score, 10) : 0;
  } catch (e) {
    console.error('ローカルスコア取得エラー:', e);
    return 0;
  }
}; 