import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './EventItem.css';

function EventItem({ event, onDelete, onUpdate }) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(event.eventName);
  const [editedDate, setEditedDate] = useState(event.eventDate);
  const [editedTime, setEditedTime] = useState(event.eventTime);
  const [editedDesc, setEditedDesc] = useState(event.description);
  
  const isAuthor = user && user._id === event.postedBy._id;

  const handleSave = () => {
    onUpdate(event._id, { 
      eventName: editedName, 
      eventDate: editedDate, 
      eventTime: editedTime,
      description: editedDesc 
    });
    setIsEditing(false);
  };
  
  const eventDateTime = new Date(`${event.eventDate}T${event.eventTime}`);
  const formattedDate = eventDateTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = eventDateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  return (
    <div className="event-item">
      <div className="event-date-card">
        <div className="month">{eventDateTime.toLocaleString('en-IN', { month: 'short' }).toUpperCase()}</div>
        <div className="day">{eventDateTime.getDate()}</div>
      </div>
      <div className="event-details">
        {isEditing ? (
          <div className="event-edit-form">
            <input type="text" value={editedName} onChange={e => setEditedName(e.target.value)} />
            <div className="date-time-inputs">
              <input type="date" value={editedDate} onChange={e => setEditedDate(e.target.value)} />
              <input type="time" value={editedTime} onChange={e => setEditedTime(e.target.value)} />
            </div>
            <textarea value={editedDesc} onChange={e => setEditedDesc(e.target.value)} />
            <div className="edit-actions">
              <button onClick={handleSave} className="save-btn">Save</button>
              <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="event-name">{event.eventName}</h3>
            <p className="event-time">{formattedDate} at {formattedTime}</p>
            <p className="event-description">{event.description}</p>
            <p className="event-poster">Posted by: <strong>{event.postedBy?.name}</strong></p>
            {isAuthor && (
              <div className="author-actions">
                <button onClick={() => setIsEditing(true)}>Edit</button>
                <button onClick={() => onDelete(event._id)}>Delete</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventItem;