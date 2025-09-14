import { useEffect, useState } from "react";
import { MessageSquare, Heart, Reply, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

interface ForumPost {
  id: string;
  title: string;
  author: string;
  category: string;
  replies: { text: string; author: string; timeAgo: string }[]; // replies contain admin answers
  likes: number;
  timeAgo: string;
  isNew: boolean;
}

export function ForumNotifications({ userId }: { userId: string }) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/forum?userId=${userId}`);
        // filter: only current user's posts + admin answers
        const filtered = res.data.map((post: ForumPost) => ({
          ...post,
          replies: post.replies.filter((r) => r.author === "Admin"),
        }));
        setPosts(filtered);
      } catch (err) {
        console.error("Error fetching forum data:", err);
        setError("Unable to load your forum posts right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-gradient-card rounded-xl shadow-card border border-border p-6">
        <p className="text-muted-foreground">Loading your questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-card rounded-xl shadow-card border border-border p-6">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-card rounded-xl shadow-card border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">My Forum Posts</h3>
        </div>
        {posts.length > 0 && (
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {posts.length} active
          </Badge>
        )}
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You haven’t asked any questions yet.
        </p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-3 bg-accent-light/50 rounded-lg border border-accent/20 hover:shadow-gentle transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs py-0 px-2">
                      {post.category}
                    </Badge>
                    <span>•</span>
                    <span>{post.timeAgo}</span>
                  </div>
                </div>
              </div>

              {/* Admin Replies */}
              {post.replies.length > 0 && (
                <div className="mt-2 pl-3 border-l border-border space-y-1">
                  {post.replies.map((reply, idx) => (
                    <div key={idx} className="text-xs text-muted-foreground">
                      <Reply className="h-3 w-3 inline mr-1 text-primary" />
                      <span className="font-semibold">{reply.author}:</span>{" "}
                      {reply.text} <span className="ml-2">({reply.timeAgo})</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{post.likes} likes</span>
                  </div>
                </div>
                <TrendingUp className="h-3 w-3 text-success opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-border">
        <Button variant="soft" size="sm" className="w-full">
          Ask a Question
        </Button>
      </div>
    </div>
  );
}
