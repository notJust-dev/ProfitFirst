import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ikpfgvfpwzlfmykwmfzl.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrcGZndmZwd3psZm15a3dtZnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQxNDQ2MjksImV4cCI6MjAyOTcyMDYyOX0.IsElwb5_dT0s6m1vV69z9z3O0ZC4AdqQ6C_4JozyTP8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
