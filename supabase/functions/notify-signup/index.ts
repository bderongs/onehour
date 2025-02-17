// @ts-nocheck - Edge Function, not meant for frontend
// Follow this setup guide to integrate the Deno runtime successfully:
// https://deno.land/manual/getting_started/setup_your_environment

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const NOTIFICATION_EMAIL = Deno.env.get('NOTIFICATION_EMAIL') || 'notifications@sparkier.io'

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: {
    id: string
    email: string
    first_name: string
    last_name: string
    company?: string
    roles: string[]
    created_at: string
  }
  schema: string
  old_record: null | Record<string, unknown>
}

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

    // Verify Resend API key is configured
    if (!RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY environment variable')
    }

    // Parse the webhook payload
    const payload: WebhookPayload = await req.json()

    // Only process new user insertions
    if (payload.type !== 'INSERT' || payload.table !== 'profiles') {
      return new Response('Ignored event', { status: 200 })
    }

    const { record } = payload
    const userType = record.roles.includes('consultant') ? 'Consultant' : 'Client'
    const companyInfo = record.company ? ` from ${record.company}` : ''

    // Prepare email content
    const emailContent = {
      from: `Sparkier Notifications <${NOTIFICATION_EMAIL}>`,
      to: NOTIFICATION_EMAIL,
      subject: `New ${userType} Signup: ${record.first_name} ${record.last_name}`,
      html: `
        <h2>New ${userType} Registration</h2>
        <p>A new user has signed up for Sparkier:</p>
        <ul>
          <li><strong>Name:</strong> ${record.first_name} ${record.last_name}</li>
          <li><strong>Email:</strong> ${record.email}</li>
          <li><strong>Type:</strong> ${userType}</li>
          ${record.company ? `<li><strong>Company:</strong> ${record.company}</li>` : ''}
          <li><strong>Signup Date:</strong> ${new Date(record.created_at).toLocaleString()}</li>
        </ul>
      `
    }

    // Send email using Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailContent)
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Resend API error:', {
        status: response.status,
        statusText: response.statusText,
        error
      })
      throw new Error(`Impossible d'envoyer l'email: ${error}`)
    }

    return new Response('Notification sent successfully', { status: 200 })

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(error.message, { status: 500 })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/notify-signup' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
