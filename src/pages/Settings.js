import React, { useEffect, useState } from 'react'; 
import { fetchLogbook } from '../api/homeAssistantApi';

const Settings = () => {
  const [logbookEntries, setLogbookEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLogbookData = async () => {
      try {
        const data = await fetchLogbook();
        // จัดเรียงข้อมูลตาม `id` จากใหม่สุดไปเก่าสุด
        const sortedEntries = data.sort((a, b) => b.id - a.id);
        setLogbookEntries(sortedEntries);  // เก็บข้อมูลที่จัดเรียงแล้ว
      } catch (error) {
        console.error("Failed to load logbook entries", error);
      } finally {
        setLoading(false);
      }
    };

    getLogbookData();
  }, []);

  // Function to format time (for both `time_fired` and `When` fields)
  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  // Function to calculate the time difference
  const timeAgo = (time) => {
    const now = new Date();
    const eventTime = new Date(time);
    const diffInSeconds = Math.floor((now - eventTime) / 1000); // Time difference in seconds

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="settings-container" style={{
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: '#f0f4f8',  // Light background for the container
      color: '#1e2a47',  // Dark blue text color
      fontFamily: 'Courier New, monospace', 
      padding: '20px'
    }}>
      <h1 style={{ color: '#007acc', marginBottom: '20px' }}>Latest Logbook Entries</h1>  {/* Blue title */}
      {loading ? (
        <div className="loading-container" style={{
          flex: 1, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: '#e0e7ff',  // Light blue background for loading
          borderRadius: '5px', 
          padding: '10px',
          margin: '20px 0'
        }}>
          <div className="spinner" style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007acc',  // Blue spinner top border
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 2s linear infinite'
          }}></div>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {logbookEntries.map((entry, index) => (
            <div key={index} style={{
              backgroundColor: '#ffffff',  // White background for the entry
              color: '#1e2a47',  // Dark blue text color for readability
              padding: '15px', 
              margin: '10px 0', 
              borderRadius: '8px',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',  // Subtle shadow for a card-like feel
              borderLeft: '5px solid #007acc'  // Blue border on the left for visual appeal
            }}>
              <h3 style={{ color: '#007acc' }}>Time: {formatTime(entry.time_fired)}</h3>  {/* Blue time heading */}
              <p><strong>Entity ID:</strong> {entry.entity_id}</p>
              <p><strong>Name:</strong> {entry.name}</p>
              <p><strong>State:</strong> {entry.state}</p>
              <p><strong>When:</strong> {formatTime(entry.when)}</p> {/* Formatted `When` */}
              <p><strong>Time Ago:</strong> {timeAgo(entry.time_fired)}</p>  {/* Display time difference */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Settings;
