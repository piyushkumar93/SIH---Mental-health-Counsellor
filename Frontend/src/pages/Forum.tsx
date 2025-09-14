import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Users, Plus, MessageSquare, Heart, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const socket = io("http://localhost:4000"); // connect to backend

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const user = JSON.parse(localStorage.getItem("user")); // { name, role }

  useEffect(() => {
    // Load all posts
    socket.on("loadPosts", (data) => setPosts(data));

    // When new post is created
    socket.on("newPost", (post) => setPosts((prev) => [post, ...prev]));

    // When replies are updated
    socket.on("updatePost", (updatedPost) => {
      setPosts((prev) =>
        prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
      );
    });

    return () => {
      socket.off("loadPosts");
      socket.off("newPost");
      socket.off("updatePost");
    };
  }, []);

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    socket.emit("createPost", {
      title: newPost,
      author: user?.name || "Anonymous",
      category: "General",
    });
    setNewPost("");
  };

  const handleReply = (postId) => {
    const replyText = prompt("Enter your reply:");
    if (!replyText) return;

    // Only admins can reply
    if (user?.role !== "admin") {
      alert("Only admins can reply to posts.");
      return;
    }

    socket.emit("addReply", {
      postId,
      reply: { author: user.name, text: replyText },
    });
  };

  return (
    <div className="flex-1 p-6 bg-background min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Community Forum</h1>

      {/* Create Post */}
      <Card className="p-4 mb-6">
        <textarea
          className="w-full border p-2 rounded mb-3"
          placeholder="Start a new discussion..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <Button onClick={handleCreatePost}>
          <Plus className="h-4 w-4 mr-2" /> Post
        </Button>
      </Card>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post._id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                {post.isPinned && <Pin className="h-4 w-4 text-primary" />}
                <Badge variant="outline">{post.category}</Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>

            <h3 className="font-semibold mt-2">{post.title}</h3>
            <p className="text-sm text-muted-foreground">by {post.author}</p>

            <div className="mt-3">
              {post.replies?.map((reply, idx) => (
                <div key={idx} className="border-t pt-2 mt-2 text-sm">
                  <span className="font-medium">{reply.author}:</span> {reply.text}
                </div>
              ))}
            </div>

            {user?.role === "admin" && (
              <Button
                variant="soft"
                size="sm"
                className="mt-3"
                onClick={() => handleReply(post._id)}
              >
                <MessageSquare className="h-4 w-4 mr-1" /> Reply
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
