// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rejwvtqlirwwpvrpkmjn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJland2dHFsaXJ3d3B2cnBrbWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0ODI5NjgsImV4cCI6MjA2MDA1ODk2OH0.SqTyd983qu_pGSODIhtmJRH9DproruqBttSysqVUrpM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);