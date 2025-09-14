import { useEffect, useState } from "react";
import { Calendar, Clock, User, Video, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

interface Appointment {
  id: string;
  counselor: string;
  date: string;
  time: string;
  type: "video" | "phone" | "in-person";
  status: "upcoming" | "completed" | "cancelled";
}

export function AppointmentCard() {
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
        setAppointments([]); // fallback to empty
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "phone": return <Phone className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video": return "bg-primary/10 text-primary";
      case "phone": return "bg-success/10 text-success";
      default: return "bg-accent/10 text-accent-foreground";
    }
  };

  return (
    <div className="bg-gradient-card rounded-xl shadow-card border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Upcoming Appointments</h3>
        </div>
        <Button variant="soft" size="sm">
          Book New
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : appointments.length === 0 ? (
        <p className="text-muted-foreground text-sm">No appointments scheduled</p>
      ) : (
        <div className="space-y-3">
          {appointments.slice(0, 3).map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-3 bg-accent-light/50 rounded-lg border border-accent/20 hover:shadow-gentle transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-calm rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{appointment.counselor}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {appointment.date} at {appointment.time}
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className={`${getTypeColor(appointment.type)} flex items-center gap-1`}>
                {getTypeIcon(appointment.type)}
                {appointment.type}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
