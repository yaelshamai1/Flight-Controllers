import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Middleware configuration
app.use(cors());          // Enables Cross-Origin Resource Sharing for React frontend access
app.use(express.json());  // Parses incoming requests with JSON payloads

// Database Connection (MongoDB Atlas)
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Data Structure (Mongoose Schema & Model)
const flightDataSchema = new mongoose.Schema({
  altitude: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 3000 
  },
  his: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 360 
  },
  adi: { 
    type: Number, 
    required: true, 
    min: -100, 
    max: 100 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const FlightData = mongoose.model('FlightData', flightDataSchema);

// API Endpoints

// POST Endpoint: Receives flight telemetry from the client and saves it to MongoDB
app.post('/api/flight-data', async (rows, res) => {
  try {
    const { altitude, his, adi } = rows.body;

    // Server-side validation for data thresholds
    if (altitude < 0 || altitude > 3000 || his < 0 || his > 360 || adi < -100 || adi > 100) {
      return res.status(400).json({ message: 'Values are out of range!' });
    }

    const newRecord = new FlightData({ altitude, his, adi });
    await newRecord.save();
    
    res.status(201).json({ message: 'Data saved successfully!', data: newRecord });
  } catch (error) {
    res.status(500).json({ message: 'Server error while saving data', error: error.message });
  }
});

// GET Endpoint: Fetches the most recent telemetry record for the cockpit indicators
app.get('/api/flight-data', async (rows, res) => {
  try {
    // Queries the collection for the latest entry sorted by creation date
    const latestData = await FlightData.findOne().sort({ createdAt: -1 });
    
    // Fallback response with default values if the collection is empty
    if (!latestData) {
      return res.json({ altitude: 0, his: 0, adi: 0 });
    }
    
    res.json(latestData);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching data', error: error.message });
  }
});

// Start Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});