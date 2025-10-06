import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import MarketplaceItem from './MarketplaceItem';
import './Marketplace.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Marketplace() {
  const { user, token } = useAuth();
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]); // State for multiple files
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/marketplace`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch marketplace items.');
        return res.json();
      })
      .then(data => setItems(data))
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleFileChange = (e) => {
    // Convert the FileList object to an array to store in state
    setMediaFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName.trim() || !price.trim() || !description.trim()) {
      alert('Please fill out all fields.');
      return;
    }
    setIsSubmitting(true);

    let mediaUrls = [];

    try {
      if (mediaFiles.length > 0) {
        const formData = new FormData();
        mediaFiles.forEach(file => {
          formData.append('media', file);
        });

        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers: { 'x-auth-token': token },
          body: formData,
        });

        if (!uploadRes.ok) throw new Error('File upload failed');
        const uploadData = await uploadRes.json();
        mediaUrls = uploadData.secure_urls;
      }

      const newItemData = { itemName, description, price, mediaUrls };

      const itemRes = await fetch(`${API_URL}/api/marketplace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(newItemData),
      });

      if (!itemRes.ok) throw new Error('Failed to create item');
      const newItemFromServer = await itemRes.json();

      setItems([newItemFromServer, ...items]);
      // Reset form
      setItemName(''); setDescription(''); setPrice(''); setMediaFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
    } catch (err) {
      console.error(err);
      alert(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = (id) => {
    fetch(`${API_URL}/api/marketplace/${id}`, { 
        method: 'DELETE',
        headers: { 'x-auth-token': token }
    }).then(() => {
        setItems(items.filter(item => item._id !== id));
      });
  };

  const handleUpdateItem = (id, updatedData) => {
    fetch(`${API_URL}/api/marketplace/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify(updatedData)
    })
    .then(res => res.json())
    .then(updatedItem => {
      setItems(items.map(item => item._id === id ? updatedItem : item));
    });
  };

  const renderContent = () => {
    if (isLoading) return <p>Loading items...</p>;
    if (error) return <p style={{ color: '#ff6b6b' }}>Error: {error}</p>;
    if (items.length === 0) return <p>No items listed in the marketplace yet.</p>;
    return items.map(item => (
      <MarketplaceItem 
        key={item._id} 
        item={item} 
        onDelete={handleDeleteItem}
        onUpdate={handleUpdateItem}
      />
    ));
  };

  return (
    <div className="marketplace-container">
      <h1>Marketplace</h1>
      <p>Buy, sell, and connect with your neighbors.</p>
      {user && (
        <form onSubmit={handleSubmit} className="item-form">
          <h3>List an Item</h3>
          <input type="text" placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
          <input type="number" placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <input 
            type="file" 
            multiple // Allow multiple file selection
            accept="image/*,video/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            required 
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Listing Item...' : 'List Item'}
          </button>
        </form>
      )}
      <div className="item-list">
        {renderContent()}
      </div>
    </div>
  );
}

export default Marketplace;