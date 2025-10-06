import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Post.css';

function Post({ post, onDelete, onUpdate }) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);

  const handleSave = () => {
    onUpdate(post._id, editedContent);
    setIsEditing(false);
  };

  // Check if the current user is the author of the post
  const isAuthor = user && post.author && user._id === post.author._id;

  // Function to check if the URL is for a video
  const isVideo = (url) => {
    return url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.webm');
  };

  return (
    <div className="post">
      <div className="post-header">
        <strong>{post.author?.name || 'Anonymous'}</strong>
        {isAuthor && !isEditing && (
          <div className="post-actions">
            <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
            <button onClick={() => onDelete(post._id)} className="delete-button">&times;</button>
          </div>
        )}
      </div>
      <div className="post-content">
        {isEditing ? (
          <div className="edit-form">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="edit-form-actions">
                <button onClick={handleSave} className="save-button">Save</button>
                <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
            </div>
          </div>
        ) : (
          <p>{post.content}</p>
        )}
        
        {post.imageUrl && (
          isVideo(post.imageUrl) ? (
            <video src={post.imageUrl} controls className="post-media" />
          ) : (
            <img src={post.imageUrl} alt="" className="post-media" />
          )
        )}
      </div>
    </div>
  );
}

export default Post;