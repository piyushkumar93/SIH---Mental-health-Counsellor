import { BarChart3, TrendingUp, Users, Activity, BookOpen, Calendar } from "lucide-react";
import { AIAssistant } from "@/components/AIAssistant";
import { AppointmentCard } from "@/components/AppointmentCard";
import { ForumNotifications } from "@/components/ForumNotifications";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bg.jpg";
import wellnessImage from "@/assets/wellness-illustration.jpg";

const stats = [
  {
    title: "Sessions Completed",
    value: "12",
    change: "+3 this month",
    icon: Calendar,
    color: "text-success",
  },
  {
    title: "Wellness Score",
    value: "78%",
    change: "+12% improvement",
    icon: TrendingUp,
    color: "text-primary",
  },
  {
    title: "Community Posts",
    value: "5",
    change: "Active contributor",
    icon: Users,
    color: "text-accent",
  },
  {
    title: "Resources Accessed",
    value: "23",
    change: "Learning progress",
    icon: BookOpen,
    color: "text-peaceful-purple",
  },
];

export default function Dashboard() {
  return (
    <div className="flex-1 p-6 space-y-6 bg-background min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative rounded-2xl overflow-hidden p-8 bg-gradient-primary text-primary-foreground shadow-soft"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(55, 162, 218, 0.9), rgba(116, 192, 252, 0.9)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
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
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4 bg-gradient-card shadow-card border-border hover:shadow-soft transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className={`text-xs mt-1 ${stat.color}`}>{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-calm`}>
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Assistant - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <div className="h-[600px]">
            <AIAssistant />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Appointments */}
          <AppointmentCard />
          
          {/* Forum Notifications */}
          <ForumNotifications />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-card rounded-xl shadow-card border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="calming" className="flex-col h-20 gap-2">
            <Calendar className="h-5 w-5" />
            <span className="text-xs">Book Session</span>
          </Button>
          <Button variant="soft" className="flex-col h-20 gap-2">
            <Users className="h-5 w-5" />
            <span className="text-xs">Join Forum</span>
          </Button>
          <Button variant="success" className="flex-col h-20 gap-2">
            <BookOpen className="h-5 w-5" />
            <span className="text-xs">Resources</span>
          </Button>
          <Button variant="outline" className="flex-col h-20 gap-2">
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs">Progress</span>
          </Button>
        </div>
      </div>
    </div>
  );
}