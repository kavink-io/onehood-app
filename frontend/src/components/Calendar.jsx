import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import EventItem from './EventItem';
import './Calendar.css'; 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Calendar() {
  const { user, token } = useAuth();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the new event form
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [description, setDescription] = useState('');
  
  // State for the custom 12-hour time picker
  const [hour, setHour] = useState('01');
  const [minute, setMinute] = useState('00');
  const [ampm, setAmPm] = useState('AM');

  // Fetch events (READ)
  useEffect(() => {
    fetch(`${API_URL}/api/events`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch events.');
        return res.json();
      })
      .then(data => {
        const sortedEvents = data.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
        setEvents(sortedEvents);
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);
  
  // CREATE event handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventName || !eventDate || !description) return;
    
    // Convert 12-hour format from state to 24-hour format for the backend
    let twentyFourHour = parseInt(hour, 10);
    if (ampm === 'PM' && twentyFourHour < 12) {
      twentyFourHour += 12;
    }
    if (ampm === 'AM' && twentyFourHour === 12) { // Handle 12 AM (midnight)
      twentyFourHour = 0;
    }
    const finalTime = `${String(twentyFourHour).padStart(2, '0')}:${minute}`;

    const newEventData = { 
      eventName, 
      eventDate, 
      eventTime: finalTime, 
      description 
    };

    fetch(`${API_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify(newEventData)
    })
    .then(res => res.json())
    .then(newEventFromServer => {
      setEvents([...events, newEventFromServer].sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate)));
      // Reset form fields
      setEventName(''); 
      setEventDate(''); 
      setDescription('');
      setHour('01'); 
      setMinute('00'); 
      setAmPm('AM');
    });
  };

  // DELETE event handler
  const handleDeleteEvent = (id) => {
    fetch(`${API_URL}/api/events/${id}`, { 
        method: 'DELETE',
        headers: { 'x-auth-token': token }
    }).then(() => setEvents(events.filter(e => e._id !== id)));
  };

  // UPDATE event handler
  const handleUpdateEvent = (id, updatedData) => {
    fetch(`${API_URL}/api/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify(updatedData)
    })
    .then(res => res.json())
    .then(updatedEvent => {
      setEvents(events.map(e => (e._id === id ? updatedEvent : e)));
    });
  };

  const renderContent = () => {
    if (isLoading) return <p>Loading events...</p>;
    if (error) return <p style={{ color: '#ff6b6b' }}>Error: {error}</p>;
    if (events.length === 0) return <p>No events scheduled.</p>;
    return events.map(event => (
      <EventItem 
        key={event._id} 
        event={event}
        onDelete={handleDeleteEvent}
        onUpdate={handleUpdateEvent}
      />
    ));
  };

  return (
    <div className="calendar-container">
      <h1>Hood Calendar</h1>
      <p>Upcoming events and activities in your community.</p>
      
      {user && (
        <form onSubmit={handleSubmit} className="event-form">
          <h3>Post a New Event</h3>
          <input type="text" placeholder="Event Name" value={eventName} onChange={e => setEventName(e.target.value)} required />
          <div className="date-time-inputs">
            <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} required />
            <div className="custom-time-picker">
              <select value={hour} onChange={e => setHour(e.target.value)}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                  <option key={h} value={String(h).padStart(2, '0')}>{String(h).padStart(2, '0')}</option>
                ))}
              </select>
              <span>:</span>
              <select value={minute} onChange={e => setMinute(e.target.value)}>
                <option value="00">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select>
              <select value={ampm} onChange={e => setAmPm(e.target.value)}>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
          <button type="submit">Post Event</button>
        </form>
      )}

      <div className="event-list">
        {renderContent()}
      </div>
    </div>
  );
}

export default Calendar;