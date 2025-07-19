import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://swijzlhxsyphhocmihkk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3aWp6bGh4c3lwaGhvY21paGtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MTY5MjgsImV4cCI6MjA2ODE5MjkyOH0.Ri5MsMW7qQYklNuGwWesESkOyh_N_-PsNFazzOC02F4';

export const supabase = createClient(supabaseUrl, supabaseKey);