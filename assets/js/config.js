const SUPABASE_URL = "https://rjgrbqirkudqwdhqrlrg.supabase.co";
const SUPABASE_KEY = "sb_publishable_ub0nDxp4gr6BQPADGG5ZFQ_57RAgcDK";   
// Shared client, reused by every page.
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);