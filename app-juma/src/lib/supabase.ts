import { createClient } from '@supabase/supabase-js';

// Hardcoded para evitar problemas con la cache del servidor Vite sin reiniciar
const supabaseUrl = 'https://ynnsqqhejqxugujrzohm.supabase.co';
const supabaseAnonKey = 'sb_publishable_rUDyDczWTZu4hG3NrhpnrA_8_yZTC3N';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
