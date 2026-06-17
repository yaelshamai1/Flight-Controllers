import { useState } from 'react';
import './App.css';

function App() {
  
  const BASE_URL = import.meta.env.VITE_API_IP || 'localhost';

  // --- 1. State Declarations ---
  // Input fields for the flight data form
  const [altitude, setAltitude] = useState('');
  const [his, setHis] = useState('');
  const [adi, setAdi] = useState('');

  // Active view management ('form', 'text', 'visual')
  const [viewMode, setViewMode] = useState('form'); 
  
  // Storage for the latest record fetched from the server
  const [currentData, setCurrentData] = useState({ altitude: 0, his: 0, adi: 0 });

  // --- 2. Navigation & Data Fetching Handler ---
  // Sets the active view and automatically triggers a GET request if needed
  const navigateToView = async (mode) => {
    setViewMode(mode);
    if (mode === 'text' || mode === 'visual') {
      await fetchLatestData();
    }
  };

  // --- 3. API Actions ---
  // POST Request: Validates inputs, packages data, and sends it to the backend
  const handleSend = async (e) => {
    e.preventDefault();

    const flightData = {
      altitude: Number(altitude),
      his: Number(his),
      adi: Number(adi)
    };

    try {
      const response = await fetch(`http://${BASE_URL}:5000/api/flight-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flightData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Data successfully saved to the database!');
        // Resetting form fields upon success
        setAltitude('');
        setHis('');
        setAdi('');
      } else {
        alert('Server Error: ' + data.message);
      }
    } catch (error) {
      alert('Communication error. Please ensure the Node.js server is running!');
    }
  };

  // GET Request: Fetches the most recent telemetry entry from the database
  const fetchLatestData = async () => {
    try {
      const response = await fetch(`http://${BASE_URL}:5000/api/flight-data`);
      const data = await response.json();
      
      if (response.ok) {
        // Fallback to 0 if any property is missing to prevent breaking UI rendering
        setCurrentData({
          altitude: data.altitude || 0,
          his: data.his || 0,
          adi: data.adi || 0
        });
      }
    } catch (error) {
      console.error("Error fetching latest data from server:", error);
    }
  };

  // --- 4. UI Layout Rendering ---
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa', 
      color: '#333333',
      minHeight: '100vh',
      width: '100%', 
      boxSizing: 'border-box'
    }}>
      <h2 style={{ marginBottom: '5px', color: '#111' }}>Flight Indicators Monitor</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>Real-time Simulation & Control Dashboard</p>
      
      {/* Top Navigation Menu */}
      <div style={{ 
        marginBottom: '40px', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '15px'
      }}>
        <button 
          onClick={() => navigateToView('text')} 
          style={{ 
            padding: '12px 30px', 
            cursor: 'pointer',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontWeight: 'bold',
            backgroundColor: viewMode === 'text' ? '#333' : '#fff',
            color: viewMode === 'text' ? '#fff' : '#333',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>TEXT</button>
        <button 
          onClick={() => navigateToView('visual')} 
          style={{ 
            padding: '12px 30px', 
            cursor: 'pointer',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontWeight: 'bold',
            backgroundColor: viewMode === 'visual' ? '#333' : '#fff',
            color: viewMode === 'visual' ? '#fff' : '#333',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>VISUAL</button>
        <button 
          onClick={() => navigateToView('form')} 
          style={{ 
            padding: '12px 30px', 
            cursor: 'pointer',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontWeight: 'bold',
            backgroundColor: viewMode === 'form' ? '#333' : '#fff',
            color: viewMode === 'form' ? '#fff' : '#333',
            fontSize: '16px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>+</button>
      </div>

      {/* VIEW 1: Data Entry Form */}
      {viewMode === 'form' && (
        <form onSubmit={handleSend} style={{ 
          display: 'inline-block', 
          textAlign: 'left', 
          width: '100%',
          maxWidth: '450px', 
          backgroundColor: '#ffffff', 
          padding: '35px', 
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '25px', textAlign: 'center' }}>Insert New Flight Data</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Altitude (0-3000 ft):</label>
            <input type="number" value={altitude} onChange={(e) => setAltitude(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '15px' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>HSI (0-360 degrees):</label>
            <input type="number" value={his} onChange={(e) => setHis(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '15px' }} />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>ADI (-100 to 100):</label>
            <input type="number" value={adi} onChange={(e) => setAdi(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '15px' }} />
          </div>
          
          <button type="submit" style={{ width: '100%', padding: '14px', cursor: 'pointer', background: '#007bef', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', boxShadow: '0 4px 10px rgba(0,123,239,0.2)' }}>
            Transmit Data
          </button>
        </form>
      )}

      {/* VIEW 2: Raw Text Metrics (Circular Indicator Presentation) */}
      {viewMode === 'text' && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-evenly', 
          alignItems: 'center',
          width: '100%', 
          maxWidth: '1200px', 
          margin: '40px auto 0 auto',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ backgroundColor: '#fff', border: '2px solid #333', borderRadius: '50%', padding: '40px 20px', width: '160px', height: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#555' }}>Altitude</h4>
            <span style={{ fontSize: '26px', fontWeight: 'bold' }}>{currentData.altitude} ft</span>
          </div>

          <div style={{ backgroundColor: '#fff', border: '2px solid #333', borderRadius: '50%', padding: '40px 20px', width: '160px', height: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#555' }}>HSI</h4>
            <span style={{ fontSize: '26px', fontWeight: 'bold' }}>{currentData.his}°</span>
          </div>

          <div style={{ backgroundColor: '#fff', border: '2px solid #333', borderRadius: '50%', padding: '40px 20px', width: '160px', height: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#555' }}>ADI</h4>
            <span style={{ fontSize: '26px', fontWeight: 'bold' }}>{currentData.adi}</span>
          </div>
        </div>
      )}

      {/* VIEW 3: Graphical Cockpit Gauges */}
      {viewMode === 'visual' && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-evenly', 
          alignItems: 'flex-end', 
          width: '100%',
          maxWidth: '1200px',
          margin: '40px auto 0 auto',
          flexWrap: 'wrap',
          gap: '40px'
        }}>
          
          {/* Vertical Altimeter Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h4 style={{ marginBottom: '15px' }}>Altitude</h4>
            <div style={{ width: '60px', height: '24px' }} />
            <div style={{ width: '60px', height: '200px', border: '2px solid #333', position: 'relative', background: '#e9ecef', borderRadius: '4px' }}>
              <div style={{ position: 'absolute', top: '0', right: '5px', fontSize: '11px', fontWeight: 'bold' }}>3000</div>
              <div style={{ position: 'absolute', top: '50%', right: '5px', fontSize: '11px', fontWeight: 'bold', transform: 'translateY(-50%)' }}>1500</div>
              <div style={{ position: 'absolute', bottom: '0', right: '5px', fontSize: '11px', fontWeight: 'bold' }}>0</div>
              <div style={{
                position: 'absolute',
                left: '0',
                width: '100%',
                height: '4px',
                background: 'black',
                bottom: `${(currentData.altitude / 3000) * 100}%`, 
                transition: 'bottom 0.5s ease'
              }} />
            </div>
          </div>

          {/* Rotational Compass (HSI) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h4 style={{ marginBottom: '15px' }}>HSI</h4>
            <div style={{
              width: '200px', 
              height: '200px',
              border: '2px solid #333',
              borderRadius: '50%',
              position: 'relative',
              background: '#fff',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              transform: `rotate(-${currentData.his}deg)`,
              transition: 'transform 0.5s ease'
            }}>
              <div style={{ position: 'absolute', top: '5px', left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold' }}>0</div>
              <div style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontWeight: 'bold' }}>90</div>
              <div style={{ position: 'absolute', bottom: '5px', left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold' }}>180</div>
              <div style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', fontWeight: 'bold' }}>270</div>
            </div>
            <div style={{ marginTop: '-120px', fontSize: '32px', zIndex: 10, color: 'red' }}>▲</div>
            <div style={{ height: '90px' }} />
          </div>

          {/* Dynamic Color Attitude Director Indicator (ADI) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h4 style={{ marginBottom: '15px' }}>ADI</h4>
            <div style={{ width: '60px', height: '24px' }} />
            <div style={{
              width: '200px',
              height: '200px',
              border: '2px solid #333',
              borderRadius: '50%',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              // Blends ground (green) and sky (blue) thresholds based on the ADI factor
              background: `linear-gradient(to top, #28a745 ${100 - (((currentData.adi + 100) / 200) * 100)}%, #007bef ${100 - (((currentData.adi + 100) / 200) * 100)}%)`,
              transition: 'background 0.5s ease',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Static Horizon Reference Line */}
              <div style={{ position: 'absolute', top: '50%', left: '5%', width: '90%', height: '2px', backgroundColor: '#ffc107', zIndex: 5 }}></div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default App;