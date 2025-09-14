import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, Activity, BookOpen, Calendar } from "lucide-react";
import { AIAssistant } from "@/components/AIAssistant";
import { AppointmentCard } from "@/components/AppointmentCard";
import { ForumNotifications } from "@/components/ForumNotifications";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bg.jpg";
import wellnessImage from "@/assets/wellness-illustration.jpg";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/dashboard"); // will fail if no backend
        const data = Array.isArray(res.data) ? res.data : res.data?.stats || [];
        setStats(data);
      } catch (err) {
        console.warn("Backend not available, showing no data");
        setStats([]); // fallback to empty
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex-1 p-6 space-y-6 bg-background min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative rounded-2xl overflow-hidden p-8 bg-gradient-primary text-primary-foreground shadow-soft"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(55, 162, 218, 0.9), rgba(116, 192, 252, 0.9)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">Welcome back to MindCare</h1>
          <p className="text-primary-foreground/90 mb-4">
            Your mental wellness journey matters. Take a moment to check in with yourself today.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              Quick Check-in
            </Button>
            <Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              View Progress
            </Button>
          </div>
        </div>
        <div className="absolute top-4 right-4 w-32 h-32 opacity-20">
          <img src={wellnessImage} alt="Wellness" className="w-full h-full object-cover rounded-lg" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <p className="text-muted-foreground col-span-full">Loading...</p>
        ) : stats.length === 0 ? (
          <p className="text-muted-foreground col-span-full">No stats available</p>
        ) : (
          stats.map((stat, index) => {
            const Icon = stat.icon || Calendar;
            return (
              <Card key={index} className="p-4 bg-gradient-card shadow-card border-border hover:shadow-soft transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    <p className={`text-xs mt-1 ${stat.color}`}>{stat.change}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-calm">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[600px]">
          <AIAssistant />
        </div>
        <div className="space-y-6">
          <AppointmentCard />
          <ForumNotifications userId="currentUserId" />
        </div>
      </div>
    </div>
  );
}
