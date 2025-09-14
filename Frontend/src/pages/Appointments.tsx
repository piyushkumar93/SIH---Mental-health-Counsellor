// src/pages/Appointments.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Clock, User, Video, Phone, MapPin, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type Availability = "available" | "busy" | "offline";

type Counsellor = {
  _id: string;
  name: string;
  title?: string;
  specialty?: string;
  rating?: number;
};

type Appointment = {
  _id: string;
  collegeName?: string;
  scheduledAt: string; // ISO string
  counsellorId: Counsellor | string;
  status?: string;
  notes?: string;
};

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function getTokenHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function availabilityColor(availability: Availability) {
  switch (availability) {
    case "available":
      return "bg-success/10 text-success";
    case "busy":
      return "bg-warning/10 text-warning";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function Appointments(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState("");
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // booking UI state
  const [bookingFor, setBookingFor] = useState<string | null>(null); // counsellorId
  const [bookingDateTime, setBookingDateTime] = useState<string>(""); // datetime-local value
  const [bookingMode, setBookingMode] = useState<"video" | "phone" | "in-person">("video");
  const [bookingNotes, setBookingNotes] = useState<string>("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // fetch counsellors
        const cRes = await axios.get(`${API_BASE}/counsellors`, {
          headers: { ...getTokenHeader() },
        });
        setCounsellors(cRes.data || []);

        // fetch my appointments
        const aRes = await axios.get(`${API_BASE}/appointments/me`, {
          headers: { ...getTokenHeader() },
        });
        setAppointments(aRes.data || []);
      } catch (err: any) {
        console.error("Failed to load appointments / counsellors", err);
        setError(
          err?.response?.data?.message ||
            "Failed to load data. Make sure you are logged in and the backend is running."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filteredCounsellors = counsellors.filter((c) =>
    (c.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.specialty ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to format datetime
  const fmt = (iso?: string) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  const startBooking = (counsellorId: string) => {
    setBookingFor(counsellorId);
    setBookingDateTime(""); // clear
    setBookingMode("video");
    setBookingNotes("");
  };

  const cancelBookingUi = () => {
    setBookingFor(null);
    setBookingDateTime("");
    setBookingMode("video");
    setBookingNotes("");
  };

  const confirmBooking = async () => {
    if (!bookingFor) return;
    if (!bookingDateTime) {
      alert("Please choose date and time.");
      return;
    }

    // convert datetime-local (YYYY-MM-DDTHH:mm) to ISO
    let iso = bookingDateTime;
    // If browser returns without timezone, new Date() will treat it as local which is fine.
    try {
      const d = new Date(bookingDateTime);
      iso = d.toISOString();
    } catch {
      // fallback: use as-is
    }

    const collegeName = localStorage.getItem("collegeName") || "MyCollege";

    const payload = {
      collegeName,
      scheduledAt: iso,
      counsellorId: bookingFor,
      notes: bookingNotes || `Mode: ${bookingMode}`,
    };

    try {
      const res = await axios.post(`${API_BASE}/appointments`, payload, {
        headers: { "Content-Type": "application/json", ...getTokenHeader() },
      });
      setAppointments((p) => [...p, res.data]);
      cancelBookingUi();
    } catch (err: any) {
      console.error("Booking failed", err);
      alert(
        err?.response?.data?.message ||
          "Booking failed. Ensure you are logged in and have a valid token."
      );
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this appointment?")) return;
    try {
      await axios.delete(`${API_BASE}/appointments/${id}`, {
        headers: { ...getTokenHeader() },
      });
      setAppointments((p) => p.map((a) => (a._id === id ? { ...a, status: "cancelled" } : a)));
    } catch (err) {
      console.error("Cancel failed", err);
      alert("Cancel failed");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-background min-h-screen">
        <h1 className="text-3xl font-bold text-foreground mb-2">Appointments</h1>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-background min-h-screen">
      {/* Header */}
	@@ -89,75 +200,131 @@ export default function Appointments() {
            className="pl-10"
          />
        </div>
        <Button variant="calming" onClick={() => alert("Emergency flow - hook up your flow here")}>
          <Plus className="h-4 w-4 mr-2" />
          Emergency Session
        </Button>
      </div>

      {error && <div className="text-destructive mb-4">{error}</div>}

      {/* Counselors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {filteredCounsellors.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">No counsellors found.</div>
        )}

        {filteredCounsellors.map((c) => {
          // determine availability heuristic from appointments (if you want), default available
          const availability: Availability = "available";
          const initials = (c.name || "??")
            .split(" ")
            .map((s) => s[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <Card key={c._id} className="p-6 bg-gradient-card shadow-card border-border hover:shadow-soft transition-all duration-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-lg">
                  {initials}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">{c.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-accent">★ {c.rating ?? "—"}</span>
                    <Badge variant="secondary" className={availabilityColor(availability)}>
                      {availability}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-foreground mb-1">Specialty</p>
                <Badge variant="outline" className="bg-accent-light text-accent-foreground">
                  {c.specialty ?? "General"}
                </Badge>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Next available:</p>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  {/* If you have next slot data, show it; fallback to heuristic */}
                  <span>Check calendar</span>
                </div>
              </div>

              {/* Booking controls */}
              <div className="space-y-2">
                {bookingFor === c._id ? (
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Choose date & time</label>
                    <input
                      type="datetime-local"
                      value={bookingDateTime}
                      onChange={(e) => setBookingDateTime(e.target.value)}
                      className="w-full p-2 rounded-md border"
                    />
                    <div className="flex gap-2 items-center">
                      <select
                        value={bookingMode}
                        onChange={(e) => setBookingMode(e.target.value as any)}
                        className="p-2 rounded-md border flex-1"
                      >
                        <option value="video">Video</option>
                        <option value="phone">Phone</option>
                        <option value="in-person">In-person</option>
                      </select>
                      <Input
                        placeholder="Notes (optional)"
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="calming" className="flex-1" onClick={confirmBooking}>
                        Confirm
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={cancelBookingUi}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="calming"
                      className="w-full"
                      onClick={() => startBooking(c._id)}
                      disabled={availability !== "available"}
                    >
                      Book Appointment
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="soft" size="sm" className="flex-1">
                        <Video className="h-4 w-4 mr-1" />
                        Video
                      </Button>
                      <Button variant="soft" size="sm" className="flex-1">
                        <Phone className="h-4 w-4 mr-1" />
                        Phone
                      </Button>
                      <Button variant="soft" size="sm" className="flex-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        In-person
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Emergency Resources */}
	@@ -170,17 +337,45 @@ export default function Appointments() {
          If you're experiencing a mental health emergency, please reach out immediately.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="destructive" className="w-full" onClick={() => alert("Call 988 or local emergency number")}>
            Crisis Hotline: 988
          </Button>
          <Button variant="outline" className="w-full">Campus Security: (555) 123-4567</Button>
          <Button variant="outline" className="w-full">Student Health Center</Button>
        </div>
      </Card>

      {/* My Appointments */}
      <div style={{ marginTop: 32 }}>
        <h2 className="text-2xl font-semibold mb-4">Your Appointments</h2>
        {appointments.length === 0 && <div className="text-muted-foreground">You have no appointments.</div>}
        <div className="grid gap-4">
          {appointments.map((a) => {
            const counsellor = typeof a.counsellorId === "object" ? (a.counsellorId as Counsellor) : null;
            return (
              <Card key={a._id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-semibold">{counsellor?.name ?? a.counsellorId}</div>
                    <div className="text-sm text-muted-foreground">{a.collegeName}</div>
                    <div className="text-sm">{fmt(a.scheduledAt)}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div>Status: <strong>{a.status ?? "scheduled"}</strong></div>
                    {a.status !== "cancelled" ? (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleCancel(a._id)}>Cancel</Button>
                      </div>
                    ) : (
                      <div className="text-muted-foreground">Cancelled</div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
