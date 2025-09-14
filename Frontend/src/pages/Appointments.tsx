import { useState } from "react";
import { Calendar, Clock, User, Video, Phone, MapPin, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Counselor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  rating: number;
  availability: "available" | "busy" | "offline";
  nextSlot: string;
  image: string;
}

const counselors: Counselor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    title: "Licensed Clinical Psychologist",
    specialty: "Anxiety & Depression",
    rating: 4.9,
    availability: "available",
    nextSlot: "Today 2:00 PM",
    image: "SJ",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    title: "Behavioral Therapist",
    specialty: "Academic Stress",
    rating: 4.8,
    availability: "available",
    nextSlot: "Tomorrow 10:30 AM",
    image: "MC",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    title: "Counseling Psychologist",
    specialty: "Relationship Issues",
    rating: 4.9,
    availability: "busy",
    nextSlot: "Dec 16 3:00 PM",
    image: "ER",
  },
];

export default function Appointments() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCounselors = counselors.filter(counselor =>
    counselor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    counselor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-success/10 text-success";
      case "busy":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex-1 p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Appointments</h1>
        <p className="text-muted-foreground">
          Book confidential sessions with our licensed counselors and therapists.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {filteredCounselors.map((counselor) => (
          <Card key={counselor.id} className="p-6 bg-gradient-card shadow-card border-border hover:shadow-soft transition-all duration-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-lg">
                {counselor.image}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{counselor.name}</h3>
                <p className="text-sm text-muted-foreground">{counselor.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-accent">★ {counselor.rating}</span>
                  <Badge
                    variant="secondary"
                    className={getAvailabilityColor(counselor.availability)}
                  >
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
                {counselor.nextSlot}
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

      {/* Emergency Resources */}
      <Card className="p-6 bg-gradient-card shadow-card border border-destructive/20">
        <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
          <Phone className="h-5 w-5 text-destructive" />
          Crisis Support
        </h3>
        <p className="text-muted-foreground mb-4">
          If you're experiencing a mental health emergency, please reach out immediately.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="destructive" className="w-full">
            Crisis Hotline: 988
          </Button>
          <Button variant="outline" className="w-full">
            Campus Security: (555) 123-4567
          </Button>
          <Button variant="outline" className="w-full">
            Student Health Center
          </Button>
        </div>
      </Card>
    </div>
  );
}