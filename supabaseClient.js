import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mvnvuhzfwrllslpjwbvy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12bnZ1aHpmd3JsbHNscGp3YnZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3Mzc5OTIsImV4cCI6MjA0ODMxMzk5Mn0.r08OHLKjuoP10stDdAmH3i8DazoFHhJdfJmPumkEcsU'

export const supabase = createClient(supabaseUrl, supabaseKey)