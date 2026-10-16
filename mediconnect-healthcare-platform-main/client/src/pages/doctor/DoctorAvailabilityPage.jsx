import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DoctorSidebar } from '../../components/layout/Sidebar'
import Button from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { doctorService } from '../../services/services'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Pre-built time slots for the visual grid — doctor just ticks what they want
const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
]

const to12hr = (t) => {
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`
}

const addThirty = (t) => {
  const [h, m] = t.split(':').map(Number)
  const total = h * 60 + m + 30
  return `${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`
}

/**
 * DoctorAvailabilityPage
 *
 * Redesigned as a visual weekly grid:
 *  • One column per day
 *  • Each row is a 30-min time slot
 *  • Click a cell to toggle it on/off
 *  • Bulk actions: "Select all morning / afternoon / evening"
 *  • Save converts the grid to the backend {day, slots:[{startTime,endTime}]} format
 */
const DoctorAvailabilityPage = () => {
  // selectedSlots = { Monday: Set('09:00','09:30',...), Tuesday: Set(...), ... }
  const [selectedSlots, setSelectedSlots] = useState(() =>
    DAYS.reduce((acc, d) => ({ ...acc, [d]: new Set() }), {})
  )
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [activeDays, setActiveDays] = useState(() =>
    DAYS.reduce((acc, d) => ({ ...acc, [d]: false }), {})
  )

  // Load existing availability from backend
  useEffect(() => {
    doctorService.getMyProfile()
      .then(res => {
        const avail = res.data.doctor?.availability || []
        const slots = DAYS.reduce((acc, d) => ({ ...acc, [d]: new Set() }), {})
        const days = DAYS.reduce((acc, d) => ({ ...acc, [d]: false }), {})
        avail.forEach(({ day, slots: daySlots }) => {
          if (slots[day]) {
            daySlots.forEach(s => slots[day].add(s.startTime))
            days[day] = true
          }
        })
        setSelectedSlots(slots)
        setActiveDays(days)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleSlot = (day, time) => {
    if (!activeDays[day]) return
    setSelectedSlots(prev => {
      const next = { ...prev, [day]: new Set(prev[day]) }
      if (next[day].has(time)) next[day].delete(time)
      else next[day].add(time)
      return next
    })
  }

  const toggleDay = (day) => {
    setActiveDays(prev => {
      const active = !prev[day]
      if (!active) {
        setSelectedSlots(s => ({ ...s, [day]: new Set() }))
      }
      return { ...prev, [day]: active }
    })
  }

  const bulkSelect = (day, period) => {
    if (!activeDays[day]) return
    const ranges = { morning: ['08:00','12:30'], afternoon: ['13:00','16:30'], evening: ['17:00','19:30'] }
    const [start, end] = ranges[period]
    setSelectedSlots(prev => {
      const next = new Set(prev[day])
      TIME_SLOTS.forEach(t => {
        if (t >= start && t <= end) next.add(t)
      })
      return { ...prev, [day]: next }
    })
  }

  const clearDay = (day) => {
    setSelectedSlots(prev => ({ ...prev, [day]: new Set() }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage({ type: '', text: '' })
    try {
      const availability = DAYS
        .filter(d => activeDays[d] && selectedSlots[d].size > 0)
        .map(day => ({
          day,
          slots: Array.from(selectedSlots[day]).sort().map(startTime => ({
            startTime,
            endTime: addThirty(startTime)
          }))
        }))

      await doctorService.updateAvailability({ availability })
      setMessage({ type: 'success', text: `✓ Availability saved — ${availability.reduce((s, d) => s + d.slots.length, 0)} slots across ${availability.length} days` })
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const totalSelected = DAYS.reduce((s, d) => s + selectedSlots[d].size, 0)

  if (loading) return (
    <div className="flex min-h-screen bg-neutral-50">
      <DoctorSidebar />
      <main className="flex-1 flex items-center justify-center"><LoadingSpinner size="lg" /></main>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <DoctorSidebar />
      <main className="flex-1 min-w-0 p-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-1">Manage Availability</h1>
              <p className="text-sm text-neutral-500">
                Enable the days you work, then click the time slots you are available.
                {totalSelected > 0 && <span className="text-primary font-medium"> {totalSelected} slots selected.</span>}
              </p>
            </div>
            <Button variant="primary" size="md" loading={saving} onClick={handleSave}>
              Save availability
            </Button>
          </div>

          {message.text && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className={`mb-5 p-4 rounded-lg text-sm border ${message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
              {message.text}
            </motion.div>
          )}

          {/* Legend */}
          <div className="flex items-center gap-5 mb-5 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-primary inline-block"></span>Selected (available)</span>
            <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-neutral-200 inline-block"></span>Not available</span>
            <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-neutral-100 border border-dashed border-neutral-300 inline-block"></span>Day disabled</span>
          </div>

          {/* Weekly Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">

              {/* Day headers */}
              <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}>
                <div />
                {DAYS.map(day => (
                  <div key={day} className="text-center">
                    <button
                      onClick={() => toggleDay(day)}
                      className={`text-xs font-bold px-2 py-1.5 rounded-lg w-full transition-all ${activeDays[day] ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-500 hover:bg-neutral-300'}`}
                    >
                      {day.slice(0, 3)}
                    </button>
                    {/* Bulk select buttons */}
                    {activeDays[day] && (
                      <div className="flex gap-0.5 mt-1 justify-center">
                        {['morning', 'afternoon', 'evening'].map(p => (
                          <button key={p} onClick={() => bulkSelect(day, p)}
                            className="text-[9px] px-1 py-0.5 bg-neutral-100 text-neutral-500 rounded hover:bg-primary/10 hover:text-primary transition-colors capitalize">
                            {p[0].toUpperCase()}
                          </button>
                        ))}
                        <button onClick={() => clearDay(day)}
                          className="text-[9px] px-1 py-0.5 bg-neutral-100 text-red-400 rounded hover:bg-red-50 transition-colors">
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Time slot rows */}
              <div className="space-y-0.5">
                {TIME_SLOTS.map((time, ri) => (
                  <div key={time} className="grid gap-1 items-center" style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}>
                    {/* Time label */}
                    <span className="text-[10px] text-neutral-400 text-right pr-2 select-none">{to12hr(time)}</span>

                    {/* Cells for each day */}
                    {DAYS.map(day => {
                      const active = activeDays[day]
                      const selected = selectedSlots[day].has(time)
                      return (
                        <motion.button
                          key={day}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleSlot(day, time)}
                          disabled={!active}
                          title={active ? `${day} ${to12hr(time)} – ${to12hr(addThirty(time))}` : `Enable ${day} first`}
                          className={`h-7 rounded text-[10px] font-medium transition-all border
                            ${!active ? 'bg-neutral-50 border-dashed border-neutral-200 cursor-not-allowed'
                              : selected ? 'bg-primary text-white border-primary shadow-sm'
                              : 'bg-white border-neutral-200 hover:border-primary hover:bg-primary/5 cursor-pointer'}`}
                        >
                          {selected && '✓'}
                        </motion.button>
                      )
                    })}
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Summary */}
          {totalSelected > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 bg-white border border-neutral-200 rounded-xl">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Availability Summary</h3>
              <div className="flex flex-wrap gap-3">
                {DAYS.filter(d => selectedSlots[d].size > 0).map(day => (
                  <div key={day} className="bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                    <p className="text-xs font-bold text-primary">{day}</p>
                    <p className="text-xs text-neutral-600">{selectedSlots[day].size} slots</p>
                    <p className="text-[10px] text-neutral-400">
                      {to12hr(Array.from(selectedSlots[day]).sort()[0])} – {to12hr(addThirty(Array.from(selectedSlots[day]).sort().at(-1)))}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  )
}

export default DoctorAvailabilityPage
