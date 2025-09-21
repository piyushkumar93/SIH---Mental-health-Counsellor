// src/pages/Appointments.tsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

type Counsellor = {
  _id: string
  name: string
  title?: string
  specialty?: string
}

type Appointment = {
  _id: string
  collegeName?: string
  scheduledAt: string
  counsellorId: Counsellor | string
  userId?: { _id?: string; name?: string } | string
  status?: string
  notes?: string
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function getTokenHeader () {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default function Appointments (): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('')
  const [counsellors, setCounsellors] = useState<Counsellor[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const localUser = JSON.parse(localStorage.getItem('user') || 'null')

  const [bookingFor, setBookingFor] = useState<string | null>(null)
  const [bookingDateTime, setBookingDateTime] = useState<string>('')
  const [bookingMode, setBookingMode] = useState<
    'video' | 'phone' | 'in-person'
  >('video')
  const [bookingNotes, setBookingNotes] = useState<string>('')

  const [isCounsellor, setIsCounsellor] = useState(false)
  const [userCollege, setUserCollege] = useState('')

  useEffect(() => {
    async function load () {
      setLoading(true)
      setError(null)
      try {
        // user info
        const userRes = await axios.get(`${API_BASE}/users/me`, {
          headers: getTokenHeader()
        })
        setUserCollege(userRes.data.college || '')

        // check if counsellor
        let foundCounsellor = false
        try {
          const cm = await axios.get(`${API_BASE}/counsellors/me`, {
            headers: getTokenHeader()
          })
          if (cm?.data?._id) {
            foundCounsellor = true
            localStorage.setItem('counsellorId', cm.data._id)
          }
        } catch {
          /* ignore */
        }
        if (foundCounsellor) setIsCounsellor(true)

        // load counsellors
        const cRes = await axios.get(`${API_BASE}/counsellors`, {
          headers: getTokenHeader()
        })
        setCounsellors(cRes.data || [])

        // load appointments
        let aRes
        if (userRes.data?.role === 'admin') {
          aRes = await axios.get(`${API_BASE}/appointments`, {
            headers: getTokenHeader()
          })
        } else if (foundCounsellor || userRes.data?.role === 'counsellor') {
          aRes = await axios.get(`${API_BASE}/appointments/counsellor`, {
            headers: getTokenHeader()
          })
        } else {
          aRes = await axios.get(`${API_BASE}/appointments/me`, {
            headers: getTokenHeader()
          })
        }
        setAppointments(aRes.data || [])
      } catch (err: any) {
        console.error('Failed to load', err)
        setError(err?.response?.data?.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // helpers
  const fmt = (iso?: string) => {
    if (!iso) return ''
    try {
      return new Date(iso).toLocaleString()
    } catch {
      return iso
    }
  }
  const displayName = (val: any, fallback = 'Unknown') => {
    if (!val) return fallback
    if (typeof val === 'object') return (val.name as string) || fallback
    return String(val)
  }

  // booking actions
  const startBooking = (cId: string) => {
    setBookingFor(cId)
    setBookingDateTime('')
    setBookingMode('video')
    setBookingNotes('')
  }
  const cancelBookingUi = () => {
    setBookingFor(null)
    setBookingDateTime('')
    setBookingMode('video')
    setBookingNotes('')
  }
  const confirmBooking = async () => {
    if (!bookingFor) return
    if (!bookingDateTime) {
      alert('Please choose date and time')
      return
    }
    let iso = bookingDateTime
    try {
      iso = new Date(bookingDateTime).toISOString()
    } catch {}
    const collegeName =
      userCollege || localStorage.getItem('collegeName') || 'MyCollege'
    const payload = {
      collegeName,
      scheduledAt: iso,
      counsellorId: bookingFor,
      notes: `Mode: ${bookingMode}` + (bookingNotes ? ` | ${bookingNotes}` : '')
    }
    try {
      const res = await axios.post(`${API_BASE}/appointments`, payload, {
        headers: { 'Content-Type': 'application/json', ...getTokenHeader() }
      })
      setAppointments(p => [...p, res.data])
      cancelBookingUi()
    } catch (err: any) {
      console.error('Booking failed', err)
      alert(err?.response?.data?.message || 'Booking failed')
    }
  }

  // appointment actions
  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this appointment?')) return
    try {
      await axios.delete(`${API_BASE}/appointments/${id}`, {
        headers: getTokenHeader()
      })
      setAppointments(p =>
        p.map(a => (a._id === id ? { ...a, status: 'cancelled' } : a))
      )
    } catch (err) {
      console.error(err)
      alert('Cancel failed')
    }
  }

  const handleAdminUpdate = async (
    id: string,
    status: 'confirmed' | 'cancelled'
  ) => {
    const msg = prompt('Message to include (optional)') || ''
    try {
      const res = await axios.put(
        `${API_BASE}/appointments/${id}`,
        { status, notes: msg },
        { headers: { 'Content-Type': 'application/json', ...getTokenHeader() } }
      )
      setAppointments(p => p.map(a => (a._id === id ? res.data : a)))
    } catch (err) {
      console.error(err)
      alert('Update failed')
    }
  }

  const handleAccept = async (id: string) => {
    try {
      // backend expects the status value 'confirmed' (enum defined in Appointment model)
      const res = await axios.put(
        `${API_BASE}/appointments/${id}`,
        { status: 'confirmed' },
        { headers: { 'Content-Type': 'application/json', ...getTokenHeader() } }
      )
      setAppointments(p => p.map(a => (a._id === id ? res.data : a)))
    } catch (err) {
      console.error(err)
      alert('Accept failed')
    }
  }

  // search filter
  const filteredCounsellors = counsellors.filter(c =>
    [c.name, c.specialty, c.title].some(f =>
      f?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  // loading state
  if (loading) {
    return (
      <div className='flex-1 p-6 bg-background min-h-screen'>
        <h1 className='text-3xl font-bold mb-2'>Appointments</h1>
        <div>Loading...</div>
      </div>
    )
  }

  // admin view
  if (localUser?.role === 'admin' && !isCounsellor) {
    return (
      <div className='flex-1 p-6 bg-background min-h-screen'>
        <h1 className='text-3xl font-bold text-foreground mb-4'>
          Appointments (Admin)
        </h1>
        {error && <div className='text-destructive mb-4'>{error}</div>}
        <div className='space-y-4'>
          {appointments.length === 0 && (
            <div className='text-muted-foreground'>No appointments.</div>
          )}
          {appointments.map(a => (
            <Card key={a._id} className='p-4'>
              <div className='flex items-center justify-between gap-4'>
                <div className='flex items-center gap-4'>
                  <div className='h-12 w-12 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground'>
                    {(typeof a.counsellorId === 'object'
                      ? (a.counsellorId as any).name
                      : a.counsellorId || ''
                    )
                      .toString()
                      .split(' ')
                      .map((s: string) => s[0]?.toUpperCase())
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <div className='text-lg font-semibold'>
                      {typeof a.counsellorId === 'object'
                        ? (a.counsellorId as any).name
                        : a.counsellorId}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {a.collegeName}
                    </div>
                    <div className='text-sm mt-1'>{fmt(a.scheduledAt)}</div>
                    {a.notes && (
                      <div className='text-sm mt-1 text-muted-foreground'>
                        Notes: {a.notes}
                      </div>
                    )}
                  </div>
                </div>
                <div className='flex flex-col items-end gap-2'>
                  <div className='text-sm'>
                    Status: <strong>{a.status ?? 'scheduled'}</strong>
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      variant='calming'
                      size='sm'
                      onClick={() => handleAdminUpdate(a._id, 'confirmed')}
                    >
                      Accept
                    </Button>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleAdminUpdate(a._id, 'cancelled')}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // regular user / counsellor view
  return (
    <div className='flex flex-col flex-1 min-h-screen bg-background'>
      <div className='flex-1 p-6 w-full max-w-7xl mx-auto'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-foreground mb-2'>
            Appointments
          </h1>
          <p className='text-muted-foreground'>
            Book confidential sessions with our licensed counselors and
            therapists.
          </p>
        </div>

        <div className='flex gap-4 mb-6 flex-wrap'>
          <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search counselors or specialties...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
          <Button
            variant='calming'
            onClick={() => alert('Emergency flow - hook up your flow here')}
          >
            <Plus className='h-4 w-4 mr-2' /> Emergency Session
          </Button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Counselors list */}
          {!(localUser?.role === 'admin' && !isCounsellor) && (
            <div>
              <div className='grid grid-cols-1 gap-6 mb-8'>
                {filteredCounsellors.length === 0 && (
                  <div className='col-span-full text-center text-muted-foreground'>
                    No counsellors found.
                  </div>
                )}
                {filteredCounsellors.map(c => (
                  <Card key={c._id} className='p-4'>
                    <div className='flex items-start justify-between gap-4'>
                      <div className='flex-1'>
                        <div className='font-semibold'>{c.name}</div>
                        <div className='text-sm text-muted-foreground'>
                          {c.title}
                        </div>
                        <div className='text-sm mt-2'>
                          Specialty: {c.specialty ?? 'General'}
                        </div>
                      </div>

                      <div className='w-48'>
                        {bookingFor === c._id ? (
                          <div className='space-y-2'>
                            <label className='text-sm text-muted-foreground'>
                              Choose date & time
                            </label>
                            <input
                              type='datetime-local'
                              value={bookingDateTime}
                              onChange={e => setBookingDateTime(e.target.value)}
                              className='w-full p-2 rounded-md border border-border bg-popover text-foreground'
                            />
                            <div className='flex gap-2 items-center'>
                              <select
                                value={bookingMode}
                                onChange={e =>
                                  setBookingMode(e.target.value as any)
                                }
                                className='p-2 rounded-md border border-border bg-popover text-foreground flex-1'
                              >
                                <option value='video'>Video</option>
                                <option value='phone'>Phone</option>
                                <option value='in-person'>In-person</option>
                              </select>
                            </div>
                            <Input
                              placeholder='Notes (optional)'
                              value={bookingNotes}
                              onChange={e => setBookingNotes(e.target.value)}
                              className='w-full bg-popover text-foreground'
                            />
                            <div className='flex gap-2'>
                              <Button
                                variant='calming'
                                onClick={confirmBooking}
                                className='flex-1'
                              >
                                Confirm
                              </Button>
                              <Button
                                variant='outline'
                                onClick={cancelBookingUi}
                                className='flex-1'
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant='calming'
                            onClick={() => startBooking(c._id)}
                            className='w-full'
                          >
                            Book
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Appointments list */}
          <div>
            <Card className='p-6 shadow-lg border border-border bg-card mb-6'>
              <h2 className='text-2xl font-semibold mb-4'>
                {isCounsellor
                  ? 'Appointments assigned to you'
                  : 'Your Appointments'}
              </h2>
              {appointments.length === 0 && (
                <div className='text-muted-foreground'>
                  You have no appointments.
                </div>
              )}
              <div className='grid gap-4'>
                {appointments.map(a => (
                  <Card key={a._id} className='p-4'>
                    <div className='flex justify-between items-center'>
                      <div>
                        <div className='text-lg font-semibold'>
                          {isCounsellor
                            ? displayName(a.userId)
                            : displayName(a.counsellorId)}
                        </div>
                        <div className='text-sm text-muted-foreground'>
                          {a.collegeName}
                        </div>
                        {a.notes && <div className='text-sm'>{a.notes}</div>}
                        <div className='text-sm'>{fmt(a.scheduledAt)}</div>
                      </div>
                      <div className='flex flex-col items-end gap-2'>
                        <div>
                          Status: <strong>{a.status ?? 'scheduled'}</strong>
                        </div>
                        {a.status !== 'cancelled' ? (
                          <div className='flex gap-2'>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handleCancel(a._id)}
                            >
                              Cancel
                            </Button>
                            {isCounsellor && (
                              <>
                                {a.status !== 'confirmed' && (
                                  <Button
                                    variant='calming'
                                    size='sm'
                                    onClick={() => handleAccept(a._id)}
                                  >
                                    Accept
                                  </Button>
                                )}
                                <Button
                                  variant='destructive'
                                  size='sm'
                                  onClick={async () => {
                                    if (
                                      !window.confirm(
                                        'Delete this appointment permanently?'
                                      )
                                    )
                                      return
                                    try {
                                      await axios.delete(
                                        `${API_BASE}/appointments/${a._id}?hardDelete=true`,
                                        { headers: getTokenHeader() }
                                      )
                                      setAppointments(p =>
                                        p.filter(ap => ap._id !== a._id)
                                      )
                                    } catch (err) {
                                      alert('Delete failed')
                                    }
                                  }}
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className='text-muted-foreground'>Cancelled</div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Crisis Hotline Bar */}
      <div className='w-full bg-destructive/10 border-t border-destructive text-destructive-foreground py-4 px-6 flex flex-col items-center'>
        <h3 className='text-lg font-bold mb-1'>Crisis Hotline</h3>
        <div className='mb-1'>
          If you or someone you know is in crisis, please call:
        </div>
        <div className='text-2xl font-bold mb-1'>1-800-273-8255</div>
        <div className='text-sm'>Available 24/7 for immediate help</div>
      </div>
    </div>
  )
}
