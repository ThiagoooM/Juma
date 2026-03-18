import { createClient } from '@supabase/supabase-js';

// Estas variables de entorno deben estar definidas en un archivo .env en la raiz del proyecto
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Faltan las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY de Supabase en tu archivo .env');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
