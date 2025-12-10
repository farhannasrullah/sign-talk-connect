import { useState, useEffect } from 'react'
import './Feed.css'
import { UserService, PostService } from '../services/Services.js'

function Feed() {
  const userService = UserService.getInstance()
  const postService = PostService.getInstance()
  
  // Initialize sample data
  useEffect(() => {
    // Create sample users if not already created
    if (userService.getAllUsers().length === 0) {
      const sarah = userService.createUser({
        name: 'Sarah Johnson',
        username: '@sarah_signs',
        email: 'sarah@example.com',
        avatar: '👩',
        bio: 'ASL teacher & advocate',
        isOnline: true
      }, 'deaf')
      
      const mike = userService.createUser({
        name: 'Mike Chen',
        username: '@mikechen',
        email: 'mike@example.com',
        avatar: '👨',
        bio: 'Deaf community organizer',
        isOnline: true
      }, 'deaf')
      
      const emma = userService.createUser({
        name: 'Emma Williams',
        username: '@emmawill',
        email: 'emma@example.com',
        avatar: '👩‍🦰',
        bio: 'Sign language enthusiast'
      }, 'regular')
      
      const currentUser = userService.createUser({
        name: 'You',
        username: '@you',
        email: 'you@example.com',
        avatar: '😊',
        bio: 'Learning sign language'
      }, 'deaf')
      
      userService.setCurrentUser(currentUser)
      
      // Create sample posts using OOP
      if (postService.getAllPosts().length === 0) {
        postService.createPost({
          author: sarah,
          content: 'Just learned a new sign for "coffee" today! ☕ The sign language community is amazing!',
          likes: 24,
          comments: 5
        })
        
        postService.createPost({
          author: mike,
          content: 'Excited to announce our local deaf community meetup this Saturday at Central Park! 🤟',
          likes: 42,
          comments: 12
        })
        
        postService.createPost({
          author: emma,
          content: 'Teaching my hearing friends sign language. They love it! Communication is for everyone 💚',
          likes: 68,
          comments: 15
        })
      }
    }
  }, [])

  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')

  // Load posts from service
  useEffect(() => {
    const loadedPosts = postService.getAllPosts().map(post => post.toJSON())
    setPosts(loadedPosts)
  }, [])

  const handleCreatePost = (e) => {
    e.preventDefault()
    if (newPost.trim()) {
      const currentUser = userService.getCurrentUser()
      const post = postService.createPost({
        author: currentUser,
        content: newPost
      })
      
      // Reload posts from service
      const updatedPosts = postService.getAllPosts().map(p => p.toJSON())
      setPosts(updatedPosts)
      setNewPost('')
    }
  }

  const handleLike = (postId) => {
    try {
      postService.likePost(postId)
      // Reload posts to reflect the change
      const updatedPosts = postService.getAllPosts().map(p => p.toJSON())
      setPosts(updatedPosts)
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  return (
    <div className="feed">
      <h2 className="feed-title">Community Feed</h2>
      
      <form className="create-post" onSubmit={handleCreatePost}>
        <div className="create-post-avatar">😊</div>
        <textarea
          className="create-post-input"
          placeholder="Share your thoughts with the community..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          rows="3"
        />
        <button type="submit" className="create-post-btn">Post</button>
      </form>

      <div className="posts">
        {posts.map(post => (
          <div key={post.id} className="post">
            <div className="post-header">
              <div className="post-avatar">{post.author?.avatar || '👤'}</div>
              <div className="post-info">
                <h3 className="post-author">{post.author?.name || 'Unknown'}</h3>
                <span className="post-time">{post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Just now'}</span>
                <span className="post-user-type"> • {post.author?.userType || 'User'}</span>
              </div>
            </div>
            
            <div className="post-content">
              <p>{post.content}</p>
              {post.type === 'video' && (
                <div className="post-video-info">
                  📹 Video Post • {post.views} views
                </div>
              )}
            </div>
            
            <div className="post-actions">
              <button 
                className="post-action-btn"
                onClick={() => handleLike(post.id)}
              >
                ❤️ {post.likes} Likes
              </button>
              <button className="post-action-btn">
                💬 {post.comments} Comments
              </button>
              <button className="post-action-btn">
                🔗 Share ({post.engagementScore} score)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Feed
