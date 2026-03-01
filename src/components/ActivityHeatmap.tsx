import type { ActivityEntry } from '../types'

interface ActivityHeatmapProps {
  activity: ActivityEntry[]
}

const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', '']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getColor(count: number): string {
  if (count === 0) return '#161b22'
  if (count <= 2) return 'rgba(63,185,80,0.25)'
  if (count <= 4) return 'rgba(63,185,80,0.5)'
  if (count <= 6) return 'rgba(63,185,80,0.75)'
  return '#3fb950'
}

export default function ActivityHeatmap({ activity }: ActivityHeatmapProps) {
  // Build a 12-week grid (84 days), ending today
  const today = new Date()
  const weeks: Array<Array<{ date: string; count: number } | null>> = []

  // Find the start: go back 83 days from today
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - 83)

  // Align to Sunday (or Monday, we'll go Monday)
  const activityMap = new Map(activity.map((a) => [a.date, a.count]))

  // Build 12 columns of 7 days
  let current = new Date(startDate)
  for (let week = 0; week < 12; week++) {
    const col: Array<{ date: string; count: number } | null> = []
    for (let day = 0; day < 7; day++) {
      const d = new Date(current)
      const dateStr = d.toISOString().split('T')[0]
      col.push({ date: dateStr, count: activityMap.get(dateStr) || 0 })
      current.setDate(current.getDate() + 1)
    }
    weeks.push(col)
  }

  // Get month labels
  const monthLabels: Array<{ label: string; col: number }> = []
  let lastMonth = -1
  weeks.forEach((col, i) => {
    const firstDay = col[0]
    if (firstDay) {
      const month = new Date(firstDay.date).getMonth()
      if (month !== lastMonth) {
        monthLabels.push({ label: MONTHS[month], col: i })
        lastMonth = month
      }
    }
  })

  const totalActivity = activity.reduce((sum, a) => sum + a.count, 0)
  const activeDays = activity.filter((a) => a.count > 0).length

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#e6edf3' }}>Activity</h3>
        <span style={{ fontSize: 12, color: '#8b949e' }}>
          {totalActivity} actions · {activeDays} days
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {/* Day labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 20 }}>
          {DAYS.map((d, i) => (
            <div key={i} style={{ height: 12, fontSize: 10, color: '#8b949e', lineHeight: '12px', width: 24 }}>
              {d}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, overflow: 'hidden' }}>
          {/* Month labels */}
          <div style={{ display: 'flex', gap: 3, marginBottom: 6, position: 'relative', height: 16 }}>
            {monthLabels.map((m) => (
              <span
                key={m.col + m.label}
                style={{
                  position: 'absolute',
                  left: m.col * 15,
                  fontSize: 10,
                  color: '#8b949e',
                }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: 'flex', gap: 3 }}>
            {weeks.map((col, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {col.map((cell, di) => (
                  <div
                    key={di}
                    title={cell ? `${cell.date}: ${cell.count} activities` : ''}
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 2,
                      backgroundColor: cell ? getColor(cell.count) : '#161b22',
                      cursor: 'default',
                      transition: 'background-color 0.15s',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10, justifyContent: 'flex-end' }}>
        <span style={{ fontSize: 11, color: '#8b949e' }}>Less</span>
        {[0, 2, 4, 6, 8].map((n) => (
          <div
            key={n}
            style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: getColor(n) }}
          />
        ))}
        <span style={{ fontSize: 11, color: '#8b949e' }}>More</span>
      </div>
    </div>
  )
}
