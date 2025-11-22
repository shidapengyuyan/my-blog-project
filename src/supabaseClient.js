import { createClient } from '@supabase/supabase-js';

// 替换为你的Supabase项目URL和anon key（在Supabase控制台的Settings→API中获取）
const supabaseUrl = 'https://ojincmtfpgyhhrzhifim.supabase.co';
const supabaseKey = 'sb_publishable_pyXkyVQp0F1lik8X8IRBuQ_zgqSaoW1';

export const supabase = createClient(supabaseUrl, supabaseKey);