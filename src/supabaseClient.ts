import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fnnbujrhhnvtktcwpbov.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZubmJ1anJoaG52dGt0Y3dwYm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyOTE2NDgsImV4cCI6MjA2NDg2NzY0OH0.Vb9C-9QClIpkMRHlOwS8Py3aw8nJgV6iOJ1MyyBxpG0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
