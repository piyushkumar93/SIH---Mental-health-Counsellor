import { Users, Plus, TrendingUp, MessageSquare, Heart, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const categories = [
  { name: "Academic Stress", posts: 124, color: "bg-primary/10 text-primary" },
  { name: "Anxiety Support", posts: 89, color: "bg-success/10 text-success" },
  { name: "Self-care Tips", posts: 67, color: "bg-accent/10 text-accent-foreground" },
  { name: "Relationship Issues", posts: 45, color: "bg-peaceful-purple/10 text-peaceful-purple" },
  { name: "Sleep & Wellness", posts: 52, color: "bg-gentle-green/10 text-gentle-green" },
];

const featuredPosts = [
  {
    id: "1",
    title: "How I overcame exam anxiety - my complete journey",
    author: "StudyWarrior",
    category: "Academic Stress",
    replies: 28,
    likes: 45,
    timeAgo: "2 hours ago",
    isPinned: true,
  },
  {
    id: "2",
    title: "Daily mindfulness practices that changed my life",
    author: "ZenStudent",
    category: "Self-care Tips",
    replies: 19,
    likes: 32,
    timeAgo: "4 hours ago",
    isPinned: false,
  },
  {
    id: "3",
    title: "Building healthy boundaries with roommates",
    author: "WellnessAdvocate",
    category: "Relationship Issues",
    replies: 15,
    likes: 27,
    timeAgo: "6 hours ago",
    isPinned: false,
  },
];

export default function Forum() {
  return (
    <div className="flex-1 p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Community Forum</h1>
        <p className="text-muted-foreground">
          Connect with peers in a safe, moderated environment for mutual support and guidance.
        </p>
      </div>

      {/* Community Guidelines Banner */}
      <Card className="p-4 bg-gradient-success border-success/20 mb-6">
        <h3 className="font-semibold text-success-foreground mb-2">Community Guidelines</h3>
        <p className="text-sm text-success-foreground/90">
          This is a safe space for peer support. Please be respectful, kind, and supportive. 
          All conversations are moderated by trained volunteers and mental health professionals.
        </p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories */}
        <div className="lg:col-span-1">
          <Card className="p-4 bg-gradient-card shadow-card border-border">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Categories
            </h3>
            <div className="space-y-3">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-accent/20 hover:shadow-gentle transition-all duration-200 cursor-pointer group"
                >
                  <div>
                    <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{category.posts} posts</p>
                  </div>
                  <Badge variant="secondary" className={category.color}>
                    {category.posts}
                  </Badge>
                </div>
              ))}
            </div>
            
            <Button variant="calming" className="w-full mt-4">
              <Plus className="h-4 w-4 mr-2" />
              New Discussion
            </Button>
          </Card>
        </div>

        {/* Posts */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="calming" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </Button>
              <Button variant="soft" size="sm">Recent</Button>
              <Button variant="soft" size="sm">Most Helpful</Button>
            </div>
            <Button variant="default">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>

          <div className="space-y-4">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="p-6 bg-gradient-card shadow-card border-border hover:shadow-soft transition-all duration-200 cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {post.isPinned && (
                      <Pin className="h-4 w-4 text-primary" />
                    )}
                    <Badge variant="outline" className="bg-accent-light text-accent-foreground">
                      {post.category}
                    </Badge>
                    {post.isPinned && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Pinned
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
                </div>
                
                <h3 className="font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                  {post.title}
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>by {post.author}</span>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.replies} replies</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes} helpful</span>
                    </div>
                  </div>
                  <Button variant="soft" size="sm">
                    Join Discussion
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Moderation Notice */}
          <Card className="p-4 bg-accent-light/50 border-accent/20 mt-6">
            <h4 className="font-medium text-accent-foreground mb-2">Moderated Community</h4>
            <p className="text-sm text-muted-foreground">
              All posts and comments are reviewed by trained peer moderators and mental health professionals. 
              Crisis situations are immediately escalated to appropriate support services.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}