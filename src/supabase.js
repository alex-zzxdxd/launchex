// Inicializar cliente de Supabase global
const SUPABASE_URL = 'https://waazzrymrcgzdeitmtoy.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_RUgBA5nsTdiRQx4PWXR6OQ_XXutM8SG'

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);