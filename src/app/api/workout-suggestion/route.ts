import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getWeekStart, getWeekEnd } from '@/lib/utils/date'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const weekStart = getWeekStart()
  const weekEnd = getWeekEnd()

  // Fetch goals with exercises
  const { data: goals } = await supabase
    .from('weekly_goals')
    .select('*, exercise:exercises(*, muscle_group:muscle_groups(*))')
    .eq('user_id', user.id)
    .eq('week_start', weekStart)

  // Fetch this week's logs
  const { data: logs } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', user.id)
    .gte('log_date', weekStart)
    .lte('log_date', weekEnd)

  if (!goals?.length) {
    return NextResponse.json({ suggestions: [], message: 'Set weekly goals first' })
  }

  // Calculate deficits
  const deficits = goals.map((goal) => {
    const totalLogged = (logs || [])
      .filter((l) => l.exercise_id === goal.exercise_id)
      .reduce((sum, l) => sum + l.reps * l.sets, 0)
    const remaining = Math.max(0, goal.target_reps - totalLogged)
    const deficitRatio = goal.target_reps > 0 ? remaining / goal.target_reps : 0
    return {
      exercise: goal.exercise,
      goal,
      totalLogged,
      remaining,
      deficitRatio,
    }
  })

  // Get yesterday's muscle groups
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]
  const { data: yesterdayLogs } = await supabase
    .from('daily_logs')
    .select('exercise:exercises(muscle_group:muscle_groups(slug))')
    .eq('user_id', user.id)
    .eq('log_date', yesterdayStr)

  const yesterdayMuscles = [...new Set(
    yesterdayLogs?.map((l) => {
      const ex = l.exercise as unknown as { muscle_group: { slug: string } }
      return ex?.muscle_group?.slug
    }).filter(Boolean) || []
  )]

  // Calculate days left in week
  const today = new Date()
  const endOfWeek = new Date(weekEnd)
  const daysLeft = Math.max(1, Math.ceil((endOfWeek.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

  // Score and sort
  const active = deficits.filter((d) => d.remaining > 0)
  const scored = active.map((d) => {
    let score = d.deficitRatio
    const mg = (d.exercise as unknown as { muscle_group: { slug: string } })?.muscle_group
    if (mg && yesterdayMuscles.includes(mg.slug)) {
      score *= 0.5
    }
    return { ...d, score }
  })
  scored.sort((a, b) => b.score - a.score)

  const suggestions = scored.slice(0, 8).map((item) => ({
    ...item,
    suggestedReps: Math.ceil(item.remaining / daysLeft),
  }))

  // Bonus round
  const bonusRound = deficits
    .filter((d) => d.deficitRatio > 0 && d.deficitRatio <= 0.15)
    .sort((a, b) => a.remaining - b.remaining)
    .slice(0, 3)

  return NextResponse.json({ suggestions, bonusRound, daysLeft })
}
