// @ts-nocheck - Edge Function, not meant for frontend
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      })
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Parse the request body
    const { userId } = await req.json()

    if (!userId) {
      return new Response('User ID is required', { status: 400 })
    }

    // Delete user from auth.users (this will cascade to profiles due to FK constraint)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error('Error deleting user:', deleteError)
      return new Response(JSON.stringify({
        error: 'Failed to delete user',
        details: deleteError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({
      message: 'User deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}) 