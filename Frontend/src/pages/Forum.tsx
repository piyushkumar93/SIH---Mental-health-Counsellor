import { useEffect, useState } from 'react'
import { Plus, MessageSquare, Pin, Tag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'

export default function Forum () {
  const [posts, setPosts] = useState([])
  const [tags, setTags] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')
  const [newTags, setNewTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const user = JSON.parse(localStorage.getItem('user')) // { name, role, id }
  const token = localStorage.getItem('token')

  // Fetch tags and posts
  useEffect(() => {
    async function fetchData () {
      setLoading(true)
      try {
        const tagRes = await fetch('http://localhost:5000/api/forum-tags', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setTags(await tagRes.json())
        const postRes = await fetch('http://localhost:5000/api/forum', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const allPosts = await postRes.json()
        // Only show current user's posts
        setPosts(allPosts.filter(p => p.authorId === user?.id))
      } catch (e) {
        setError('Failed to load forum data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [showModal])

  // Create new post
  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newBody.trim()) return
    try {
      await fetch('http://localhost:5000/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTitle,
          body: newBody,
          tags: newTags
        })
      })
      setShowModal(false)
      setNewTitle('')
      setNewBody('')
      setNewTags([])
    } catch {
      setError('Failed to create post')
    }
  }

  // Add comment (admin or user)
  const handleReply = async postId => {
    const replyText = prompt('Enter your reply:')
    if (!replyText) return
    await fetch(`http://localhost:5000/api/forum/${postId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text: replyText })
    })
    // Refresh posts
    setShowModal(false)
    setShowModal(true)
  }

  // Delete post (user can delete their own)
  const handleDelete = async postId => {
    if (!window.confirm('Delete this post?')) return
    try {
      await fetch(`http://localhost:5000/api/forum/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      setPosts(posts => posts.filter(p => p._id !== postId))
    } catch {
      setError('Failed to delete post')
    }
  }

  return (
    <div className='flex-1 p-6 bg-background min-h-screen'>
      <h1 className='text-3xl font-bold mb-6'>My Forum Posts</h1>
      <div className='flex justify-between items-center mb-6'>
        <div className='flex gap-2 flex-wrap'>
          {tags.map(tag => (
            <Badge
              key={tag._id}
              variant='outline'
              className='flex items-center gap-1'
            >
              <Tag className='h-4 w-4' /> {tag.name}
            </Badge>
          ))}
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className='h-4 w-4 mr-2' /> New Post
        </Button>
      </div>
      {error && <div className='text-red-500 mb-4'>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className='space-y-6'>
          {posts.length === 0 ? (
            <div className='text-muted-foreground text-center'>
              No posts yet.
            </div>
          ) : (
            posts.map(post => (
              <Card
                key={post._id}
                className='p-0 overflow-hidden border border-border shadow-lg rounded-xl bg-popover/90 hover:shadow-2xl transition-shadow duration-200'
              >
                <div className='flex flex-col md:flex-row'>
                  {/* Left: tags and pin, only if present */}
                  {(post.isPinned || (post.tags && post.tags.length > 0)) && (
                    <div className='flex flex-col items-center bg-accent-light/40 px-4 py-6 min-w-[100px] md:min-w-[120px] border-r border-border'>
                      {post.isPinned && (
                        <Pin className='h-5 w-5 text-primary mb-2' />
                      )}
                      <div className='flex flex-col gap-2'>
                        {post.tags?.map(tag => (
                          <Badge
                            key={tag}
                            variant='secondary'
                            className='text-xs'
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Right: main content */}
                  <div className='flex-1 p-4 flex flex-col gap-1 bg-card'>
                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-1'>
                      <div className='font-semibold text-lg text-primary'>
                        {post.title}
                      </div>
                      <span className='text-xs text-muted-foreground'>
                        {format(new Date(post.createdAt), 'PPpp')}
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground mb-1'>
                      <span className='font-medium'>
                        {post.isAnonymous
                          ? 'Anonymous'
                          : post.authorName || user?.name}
                      </span>
                    </div>
                    <div
                      className='whitespace-pre-line text-base text-foreground bg-popover border border-border rounded px-2 py-1 mb-1'
                      style={{ minHeight: 28 }}
                    >
                      {post.body}
                    </div>
                    <div className='flex flex-col gap-1 mt-3'>
                      {Array.isArray(post.comments) &&
                        post.comments.length > 0 &&
                        post.comments.map((reply, idx) => {
                          const isAdmin = reply.authorId?.role === 'admin'
                          const isUser =
                            reply.authorId?._id === user?.id ||
                            reply.authorId === user?.id
                          return (
                            <div
                              key={reply._id || idx}
                              className='border border-border bg-popover rounded-lg px-3 py-2 shadow-sm relative flex flex-col gap-0.5'
                              style={{
                                marginLeft: 18,
                                marginTop: idx === 0 ? 0 : 6
                              }}
                            >
                              <div className='flex items-center gap-2'>
                                <span
                                  className={`font-medium ${
                                    isAdmin
                                      ? 'text-primary'
                                      : 'text-accent-foreground'
                                  }`}
                                >
                                  {isAdmin
                                    ? 'Admin'
                                    : reply.authorId?.name ||
                                      user?.name ||
                                      'Unknown'}
                                </span>
                                <span className='text-xs text-muted-foreground'>
                                  {reply.createdAt
                                    ? format(new Date(reply.createdAt), 'PPpp')
                                    : ''}
                                </span>
                                {(user?.role === 'admin' || isUser) && (
                                  <Button
                                    variant='ghost'
                                    size='icon'
                                    className='ml-auto text-destructive hover:bg-destructive/10'
                                    title='Delete reply'
                                    onClick={async () => {
                                      if (!window.confirm('Delete this reply?'))
                                        return
                                      await fetch(
                                        `http://localhost:5000/api/forum/${post._id}/comment/${reply._id}`,
                                        {
                                          method: 'DELETE',
                                          headers: {
                                            Authorization: `Bearer ${token}`
                                          }
                                        }
                                      )
                                      setPosts(posts =>
                                        posts.map(p =>
                                          p._id === post._id
                                            ? {
                                                ...p,
                                                comments: p.comments.filter(
                                                  c => c._id !== reply._id
                                                )
                                              }
                                            : p
                                        )
                                      )
                                    }}
                                  >
                                    <Trash2 className='w-5 h-5' />
                                  </Button>
                                )}
                              </div>
                              <span className='pl-1'>{reply.text}</span>
                            </div>
                          )
                        })}
                    </div>
                    <div className='flex gap-2 mt-2'>
                      <Button
                        variant='soft'
                        size='sm'
                        onClick={() => handleReply(post._id)}
                      >
                        <MessageSquare className='h-4 w-4 mr-1' /> Reply
                      </Button>
                      {user?.id === post.authorId && (
                        <Button
                          variant='destructive'
                          size='sm'
                          onClick={() => handleDelete(post._id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
      {/* Modal for new post */}
      {showModal && (
        <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50'>
          <div className='bg-card rounded-lg p-6 w-full max-w-md shadow-lg'>
            <h2 className='text-xl font-bold mb-4'>Create New Post</h2>
            <input
              className='w-full border p-2 rounded mb-3'
              placeholder='Title'
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
            <textarea
              className='w-full border p-2 rounded mb-3'
              placeholder='Message body...'
              value={newBody}
              onChange={e => setNewBody(e.target.value)}
              rows={4}
            />
            <div className='mb-3'>
              <span className='font-medium'>Tags:</span>
              <div className='flex gap-2 flex-wrap mt-2'>
                {tags.map(tag => (
                  <Button
                    key={tag._id}
                    size='sm'
                    variant={newTags.includes(tag.name) ? 'calming' : 'outline'}
                    onClick={() =>
                      setNewTags(t =>
                        t.includes(tag.name)
                          ? t.filter(n => n !== tag.name)
                          : [...t, tag.name]
                      )
                    }
                  >
                    {tag.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className='flex gap-2 justify-end'>
              <Button variant='outline' onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreatePost}
                disabled={!newTitle || !newBody}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
