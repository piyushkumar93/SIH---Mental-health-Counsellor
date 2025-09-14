import { useState, useEffect } from "react";
import { Calendar, Clock, Video, Phone, MapPin, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import axios from "axios";

// Types
interface Counselor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  rating: number;
  availability: "available" | "busy" | "offline";
  nextSlot: string;
  image?: string;
}

interface Appointment {
  id: string;
  student: string;
  counselor: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled";
}

// Utility for availability color
const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case "available":
      return "bg-success/10 text-success";
    case "busy":
      return "bg-warning/10 text-warning";
    case "offline":
      return "bg-muted text-muted-foreground";
    default:
      return "";
  }
};

// ----------------- User View -----------------
const UserAppointments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const res = await axios.get("/api/counselors");
        const data = Array.isArray(res.data) ? res.data : res.data?.counselors || [];
        setCounselors(data);
      } catch (err) {
        console.warn("Backend not available, showing no counselors");
        setCounselors([]); // safe fallback
      } finally {
        setLoading(false);
      }
    };
    fetchCounselors();
  }, []);

  const filteredCounselors = counselors.filter((c) =>
    [c.name, c.specialty].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) return <p>Loading counselors...</p>;

  return (
    <>
      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search counselors or specialties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="calming">
          <Plus className="h-4 w-4 mr-2" />
          Emergency Session
        </Button>
      </div>

      {/* Counselors Grid */}
      {filteredCounselors.length === 0 ? (
        <p className="text-muted-foreground">No counselors available.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {filteredCounselors.map((counselor) => (
            <Card
              key={counselor.id}
              className="p-6 bg-gradient-card shadow-card border-border hover:shadow-soft transition-all duration-200"
            >
              <div className="flex items-start gap-4 mb-4">
                {counselor.image ? (
                  <img
                    src={counselor.image}
                    alt={counselor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-lg">
                    {counselor.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{counselor.name}</h3>
                  <p className="text-sm text-muted-foreground">{counselor.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-accent">★ {counselor.rating}</span>
                    <Badge variant="secondary" className={getAvailabilityColor(counselor.availability)}>
                      {counselor.availability}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-foreground mb-1">Specialty</p>
                <Badge variant="outline" className="bg-accent-light text-accent-foreground">
                  {counselor.specialty}
                </Badge>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Next available:</p>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  {counselor.nextSlot || "No slots available"}
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  variant="calming"
                  className="w-full"
                  disabled={counselor.availability === "offline"}
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
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

// ----------------- Admin View -----------------
const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("/api/appointments");
        const data = Array.isArray(res.data) ? res.data : res.data?.appointments || [];
        setAppointments(data);
      } catch (err) {
        console.warn("Backend not available, showing no appointments");
        setAppointments([]); // safe fallback
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) return <p>Loading appointments...</p>;

  return (
    <Card className="p-6 shadow-card border-border">
      <h2 className="text-xl font-bold mb-4">All Appointments</h2>
      <div className="space-y-3">
        {appointments.length === 0 ? (
          <p className="text-muted-foreground">No appointments yet.</p>
        ) : (
          appointments.map((appt) => (
            <div
              key={appt.id}
              className="p-3 border rounded-md flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{appt.student}</p>
                <p className="text-sm text-muted-foreground">
                  with {appt.counselor} — {appt.time}
                </p>
              </div>
              <Badge
                className={
                  appt.status === "confirmed"
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                }
              >
                {appt.status}
              </Badge>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

// ----------------- Main Component -----------------
export default function Appointments() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role === "admin" ? "admin" : "user";

  return (
    <div className="flex-1 p-6 bg-background min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Appointments</h1>
        <p className="text-muted-foreground">
          {role === "admin"
            ? "Manage all student counseling appointments."
            : "Book confidential sessions with our licensed counselors and therapists."}
        </p>
      </div>

      {role === "admin" ? <AdminAppointments /> : <UserAppointments />}
    </div>
  );
}
