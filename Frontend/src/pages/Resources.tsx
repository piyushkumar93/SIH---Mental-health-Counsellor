import { BookOpen, Play, Download, Search, Filter, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import wellnessImage from "@/assets/wellness-illustration.jpg";

const resourceCategories = [
  { name: "Guided Meditation", count: 24, icon: "🧘" },
  { name: "Stress Management", count: 18, icon: "😌" },
  { name: "Sleep Hygiene", count: 15, icon: "😴" },
  { name: "Academic Success", count: 21, icon: "📚" },
  { name: "Relationship Skills", count: 12, icon: "💕" },
  { name: "Crisis Resources", count: 8, icon: "🆘" },
];

const resources = [
  {
    id: "1",
    title: "Progressive Muscle Relaxation Guide",
    type: "Audio",
    duration: "15 minutes",
    category: "Stress Management",
    rating: 4.8,
    downloads: 234,
    description: "Learn to release physical tension and mental stress through guided relaxation.",
  },
  {
    id: "2",
    title: "Exam Anxiety Coping Strategies",
    type: "Article",
    duration: "5 min read",
    category: "Academic Success",
    rating: 4.9,
    downloads: 189,
    description: "Evidence-based techniques to manage test anxiety and improve performance.",
  },
  {
    id: "3",
    title: "Mindful Breathing for Sleep",
    type: "Video",
    duration: "10 minutes",
    category: "Sleep Hygiene",
    rating: 4.7,
    downloads: 156,
    description: "Gentle breathing exercises to help you wind down and fall asleep easier.",
  },
  {
    id: "4",
    title: "Building Healthy Boundaries",
    type: "Workbook",
    duration: "30 min activity",
    category: "Relationship Skills",
    rating: 4.6,
    downloads: 98,
    description: "Interactive exercises to develop and maintain healthy personal boundaries.",
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Audio":
      return <Play className="h-4 w-4" />;
    case "Video":
      return <Play className="h-4 w-4" />;
    case "Article":
      return <BookOpen className="h-4 w-4" />;
    case "Workbook":
      return <Download className="h-4 w-4" />;
    default:
      return <BookOpen className="h-4 w-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "Audio":
      return "bg-success/10 text-success";
    case "Video":
      return "bg-primary/10 text-primary";
    case "Article":
      return "bg-accent/10 text-accent-foreground";
    case "Workbook":
      return "bg-peaceful-purple/10 text-peaceful-purple";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Resources() {
  return (
    <div className="flex-1 p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Wellness Resources</h1>
        <p className="text-muted-foreground">
          Access psychoeducational materials, relaxation tools, and wellness guides to support your mental health journey.
        </p>
      </div>

      {/* Featured Resource Banner */}
      <Card 
        className="p-6 mb-6 bg-gradient-primary text-primary-foreground shadow-soft overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(55, 162, 218, 0.9), rgba(116, 192, 252, 0.9)), url(${wellnessImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10">
          <h3 className="text-xl font-semibold mb-2">Featured: Mental Health First Aid Kit</h3>
          <p className="text-primary-foreground/90 mb-4">
            A comprehensive collection of emergency coping strategies and crisis resources.
          </p>
          <Button variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            Access Now
          </Button>
        </div>
      </Card>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-10"
          />
        </div>
        <Button variant="soft">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories */}
        <div className="lg:col-span-1">
          <Card className="p-4 bg-gradient-card shadow-card border-border">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Categories
            </h3>
            <div className="space-y-2">
              {resourceCategories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-accent/20 hover:shadow-gentle transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{category.icon}</span>
                    <div>
                      <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{category.count} items</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Access */}
          <Card className="p-4 bg-gradient-card shadow-card border-border mt-4">
            <h4 className="font-semibold text-foreground mb-3">Quick Access</h4>
            <div className="space-y-2">
              <Button variant="calming" size="sm" className="w-full justify-start">
                🆘 Crisis Resources
              </Button>
              <Button variant="soft" size="sm" className="w-full justify-start">
                📞 Helpline Numbers
              </Button>
              <Button variant="soft" size="sm" className="w-full justify-start">
                🏥 Campus Services
              </Button>
            </div>
          </Card>
        </div>

        {/* Resources Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource) => (
              <Card key={resource.id} className="p-6 bg-gradient-card shadow-card border-border hover:shadow-soft transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <Badge
                    variant="secondary"
                    className={`${getTypeColor(resource.type)} flex items-center gap-1`}
                  >
                    {getTypeIcon(resource.type)}
                    {resource.type}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-current text-accent" />
                    {resource.rating}
                  </div>
                </div>

                <h3 className="font-semibold text-foreground mb-2">{resource.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>{resource.duration}</span>
                  <span>{resource.downloads} downloads</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="calming" size="sm" className="flex-1">
                    <Heart className="h-4 w-4 mr-1" />
                    Access
                  </Button>
                  <Button variant="soft" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Language Support Notice */}
          <Card className="p-4 bg-accent-light/50 border-accent/20 mt-6">
            <h4 className="font-medium text-accent-foreground mb-2">Multi-language Support</h4>
            <p className="text-sm text-muted-foreground">
              Many resources are available in multiple languages to ensure accessibility for all students. 
              Use the language filter to find resources in your preferred language.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}