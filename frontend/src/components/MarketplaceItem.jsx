import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './MarketplaceItem.css';

// Helper function to check for video URLs
const isVideo = (url) => {
  if (!url) return false;
  return url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.webm');
}

function MarketplaceItem({ item, onDelete, onUpdate }) {
  const { user } = useAuth(); // Renamed from currentUser for consistency
  const [isEditing, setIsEditing] = useState(false);
  const [showContact, setShowContact] = useState(false);


  // State for the edit form fields
  const [editedName, setEditedName] = useState(item.itemName);
  const [editedPrice, setEditedPrice] = useState(item.price);
  const [editedDesc, setEditedDesc] = useState(item.description);

  const isSeller = user && item.seller && user._id === item.seller._id;

  const handleSave = () => {
    const updatedData = {
      itemName: editedName,
      price: editedPrice,
      description: editedDesc
    };
    onUpdate(item._id, updatedData);
    setIsEditing(false);
  };

  return (
    <div className="marketplace-item">
      <div className="item-gallery">
        {item.mediaUrls && item.mediaUrls.length > 0 ? (
          item.mediaUrls.map((url, index) => (
            isVideo(url) ? (
              <video key={index} src={url} controls className="item-media" />
            ) : (
              <img key={index} src={url} alt={`${item.itemName} ${index + 1}`} className="item-media" />
            )
          ))
        ) : (
          <img src="https://via.placeholder.com/250x200?text=No+Media" alt="No media available" className="item-media" />
        )}
      </div>

      {isEditing ? (
        <div className="item-details edit-mode">
          <input type="text" value={editedName} onChange={e => setEditedName(e.target.value)} />
          <input type="number" value={editedPrice} onChange={e => setEditedPrice(e.target.value)} />
          <textarea value={editedDesc} onChange={e => setEditedDesc(e.target.value)} />
          <div className="edit-actions">
            <button onClick={handleSave} className="save-btn">Save</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="item-details">
          <h3 className="item-name">{item.itemName}</h3>
          <p className="item-price">₹{item.price}</p>
          <p className="item-description">{item.description}</p>
          <p className="item-seller">Seller: <strong>{item.seller?.name || 'Unknown'}</strong></p>

          {!isSeller && user && (
            <button className="contact-btn" onClick={() => setShowContact(!showContact)}>
              {showContact ? 'Hide Contact Info' : 'Show Contact Info'}
            </button>
          )}

          {showContact && (
            <div className="contact-details">
              <p><strong>Block:</strong> {item.seller.blockNo}</p>
              <p><strong>Email:</strong> {item.seller.email}</p>
              <p><strong>Phone:</strong> {item.seller.phone}</p>
            </div>
          )}
          
          {isSeller && (
            <div className="seller-actions">
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={() => onDelete(item._id)}>Delete</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MarketplaceItem;