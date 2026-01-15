import { createClient } from '@supabase/supabase-js';

// Substitua estas variáveis pelas suas chaves do Supabase ou use variáveis de ambiente (recomendado)
// Crie um arquivo .env.local na raiz com:
// VITE_SUPABASE_URL=sua_url
// VITE_SUPABASE_ANON_KEY=sua_chave

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "SUA_URL_DO_SUPABASE_AQUI";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "SUA_CHAVE_ANON_AQUI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
