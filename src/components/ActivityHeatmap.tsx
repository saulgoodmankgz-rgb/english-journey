import type { ActivityEntry } from '../types'

interface ActivityHeatmapProps {
  activity: ActivityEntry[]
}

const DAYS  = ['', 'Mon', '', 'Wed', '', 'Fri', '']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// Warm amber palette instead of GitHub green
function getColor(count: number): string {
  if (count === 0) return '#16131e'
  if (count <= 2)  return 'rgba(251,191,36,0.2)'
  if (count <= 4)  return 'rgba(251,191,36,0.45)'
  if (count <= 6)  return 'rgba(251,191,36,0.7)'
  return '#fbbf24'
}

export default function ActivityHeatmap({ activity }: ActivityHeatmapProps) {
  const today     = new Date()
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - 83)

  const activityMap = new Map(activity.map(a => [a.date, a.count]))

  const weeks: Array<Array<{ date: string; count: number } | null>> = []
  const current = new Date(startDate)
  for (let week = 0; week < 12; week++) {
    const col: Array<{ date: string; count: number } | null> = []
    for (let day = 0; day < 7; day++) {
      const d       = new Date(current)
      const dateStr = d.toISOString().split('T')[0]
      col.push({ date: dateStr, count: activityMap.get(dateStr) || 0 })
      current.setDate(current.getDate() + 1)
    }
    weeks.push(col)
  }

  const monthLabels: Array<{ label: string; col: number }> = []
  let lastMonth = -1
  weeks.forEach((col, i) => {
    const first = col[0]
    if (first) {
      const month = new Date(first.date).getMonth()
      if (month !== lastMonth) {
        monthLabels.push({ label: MONTHS[month], col: i })
        lastMonth = month
      }
    }
  })

  const totalActivity = activity.reduce((sum, a) => sum + a.count, 0)
  const activeDays    = activity.filter(a => a.count > 0).length

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <h3 style={{ margin: '0 0 2px', fontSize: 14.5, fontWeight: 700, color: '#ede8ff', letterSpacing: '-0.02em' }}>
            Study Activity
          </h3>
          <span style={{ fontSize: 12, color: '#4d4468' }}>
            {activeDays} active days · {totalActivity} total actions
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 11, color: '#4d4468' }}>less</span>
          {[0, 2, 4, 6, 8].map(n => (
            <div key={n} style={{
              width: 11,
              height: 11,
              borderRadius: 3,
              background: getColor(n),
              border: n === 0 ? '1px solid #2e2846' : 'none',
            }} />
          ))}
          <span style={{ fontSize: 11, color: '#4d4468' }}>more</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        {/* Day labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 18 }}>
          {DAYS.map((d, i) => (
            <div key={i} style={{ height: 11, fontSize: 9.5, color: '#4d4468', lineHeight: '11px', width: 22 }}>
              {d}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, overflow: 'hidden' }}>
          {/* Month labels */}
          <div style={{ display: 'flex', gap: 3, marginBottom: 6, position: 'relative', height: 16 }}>
            {monthLabels.map(m => (
              <span key={m.col + m.label} style={{
                position: 'absolute',
                left: m.col * 14,
                fontSize: 10,
                color: '#4d4468',
              }}>
                {m.label}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: 'flex', gap: 3 }}>
            {weeks.map((col, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {col.map((cell, di) => {
                  const isToday = cell?.date === today.toISOString().split('T')[0]
                  return (
                    <div
                      key={di}
                      title={cell ? `${cell.date}: ${cell.count} activities` : ''}
                      style={{
                        width: 11,
                        height: 11,
                        borderRadius: 3,
                        backgroundColor: cell ? getColor(cell.count) : '#16131e',
                        border: isToday ? '1px solid rgba(251,191,36,0.6)' : '1px solid transparent',
                        cursor: 'default',
                        transition: 'background-color 0.15s',
                        boxShadow: cell && cell.count > 6 ? '0 0 6px rgba(251,191,36,0.4)' : 'none',
                      }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
