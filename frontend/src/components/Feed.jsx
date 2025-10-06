import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import './Feed.css';
import Post from './Post';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Feed() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null); // State for the selected file
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/posts`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch posts.');
        return response.json();
      })
      .then(data => setPosts(data))
      .catch(error => setError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleFileChange = (e) => {
    setMediaFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim() && !mediaFile) return;
    setIsSubmitting(true);

    let imageUrl = null;

    try {
      // 1. If a file is selected, upload it first
      if (mediaFile) {
        const formData = new FormData();
        formData.append('media', mediaFile);

        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers: { 'x-auth-token': token },
          body: formData,
        });

        if (!uploadRes.ok) throw new Error('File upload failed');
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.secure_url;
      }

      // 2. Now, create the post with the text and media URL
      const newPostData = { content: newPostContent, imageUrl };

      const postRes = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(newPostData),
      });

      if (!postRes.ok) throw new Error('Failed to create post');
      const newPostFromServer = await postRes.json();
      
      setPosts([newPostFromServer, ...posts]);
      
      // 3. Reset everything
      setNewPostContent('');
      setMediaFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (err) {
      console.error(err);
      alert(err.message || 'An error occurred during posting.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeletePost = (id) => {
    fetch(`${API_URL}/api/posts/${id}`, {
      method: 'DELETE',
      headers: { 'x-auth-token': token },
    }).then(() => {
      setPosts(posts.filter(post => post._id !== id));
    });
  };

  const handleUpdatePost = (id, newContent) => {
    fetch(`${API_URL}/api/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify({ content: newContent }),
    })
      .then(res => res.json())
      .then(updatedPost => {
        setPosts(posts.map(p => (p._id === id ? updatedPost : p)));
      });
  };

  const renderContent = () => {
    if (isLoading) return <p>Loading posts...</p>;
    if (error) return <p style={{ color: '#ff6b6b' }}>Error: {error}</p>;
    if (posts.length === 0) return <p>No posts yet. Be the first!</p>;
    return posts.map(post => (
      <Post 
        key={post._id}
        post={post} 
        onDelete={handleDeletePost}
        onUpdate={handleUpdatePost}
      />
    ));
  };

  return (
    <div className="feed-container">
      {user && (
        <form onSubmit={handleSubmit} className="post-form">
          <h3>Create a Post</h3>
          <textarea 
            value={newPostContent} 
            onChange={(e) => setNewPostContent(e.target.value)} 
            placeholder="What's on your mind?" 
          />
          <div className="form-actions">
          <div>
            <label htmlFor="file-upload" className="file-input-label">
              Add Media
            </label>
            <input 
              id="file-upload"
              type="file" 
              accept="image/*,video/*" 
              onChange={handleFileChange} 
              ref={fileInputRef} 
              style={{ display: 'none' }} // Hide the actual input
            />
            <span className="file-name">
              {mediaFile ? mediaFile.name : 'No file selected'}
            </span>
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
        </form>
      )}
      <div className="post-list">
        {renderContent()}
      </div>
    </div>
  );
}

export default Feed;