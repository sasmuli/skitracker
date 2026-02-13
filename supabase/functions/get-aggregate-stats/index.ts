import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../shared/cors.js'

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create admin client with service role key to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Total approved resorts
    const { count: totalResorts } = await supabaseAdmin
      .from('resorts')
      .select('*', { count: 'exact', head: true })
      .eq('approved', true)

    // Total unique countries
    const { data: countriesData } = await supabaseAdmin
      .from('resorts')
      .select('location_country')
      .eq('approved', true)
      .not('location_country', 'is', null)

    const uniqueCountries = new Set(
      countriesData?.map((r) => r.location_country) || []
    )
    const totalCountries = uniqueCountries.size

    // Total ski days logged (all users)
    const { count: totalSkiDays } = await supabaseAdmin
      .from('ski_days')
      .select('*', { count: 'exact', head: true })

    // Most visited resort
    const { data: skiDaysData } = await supabaseAdmin
      .from('ski_days')
      .select('resort_id')

    const resortCounts = new Map<string, number>()
    skiDaysData?.forEach((day) => {
      if (day.resort_id) {
        resortCounts.set(day.resort_id, (resortCounts.get(day.resort_id) || 0) + 1)
      }
    })

    let mostVisitedResort: { name: string; visits: number } | null = null

    if (resortCounts.size > 0) {
      const mostVisitedId = Array.from(resortCounts.entries()).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0]

      const { data: resortData } = await supabaseAdmin
        .from('resorts')
        .select('name')
        .eq('id', mostVisitedId)
        .single()

      if (resortData) {
        mostVisitedResort = {
          name: resortData.name,
          visits: resortCounts.get(mostVisitedId) || 0,
        }
      }
    }

    const result = {
      totalResorts: totalResorts || 0,
      totalCountries,
      totalSkiDays: totalSkiDays || 0,
      mostVisitedResort,
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching aggregate statistics:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch statistics' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
