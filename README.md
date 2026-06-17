# Flight Indicators Monitor Dashboard

A real-time Full-Stack simulation and control dashboard designed to monitor and log flight telemetry data (Altitude, HSI, and ADI). The system includes data entry logging, tabular text overview, and dynamic, responsive graphical cockpit gauges.

---

## Tech Stack

- **Frontend:** React.js, Vite, Dynamic Inline CSS, HTML5
- **Backend:** Node.js, Express.js, REST API
- **Database:** MongoDB Atlas (Cloud Database), Mongoose Object Modeling

---

## Installation & Setup Guide

Follow these steps to get the project up and running locally or within a private network.

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Configure Environment Variables:
Create a .env file in the backend root folder and add your MongoDB connection string:
    ```code
    MONGO_URI=your_mongodb_atlas_connection_string
    PORT=5000
    ```
4. Start the server:
    ```bash
    node index.js
    ```
### 3. Frontend Setup
1. Open a new terminal window and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Configure Environment Variables (Optional):
Create a .env file in the frontend root folder if running across a private network:
    ```code
    VITE_API_IP=your_server_ip_address
    ```
4. Start the development server:
    ```bash
    npm run dev
    ```
Note: If you want to access the app from other computers on the local network, run:
    ```bash
    npm run dev -- --host
    ```

## Application Preview & Features
### 1. Data Input Form (+ Mode)
An interactive and validated data transmission form enforcing specific logical thresholds:

* Altitude: 0 to 3,000 feet

* HSI (Compass): 0 to 360 degrees

* ADI (Horizon): -100 to 100 pitch units

### 2. Text Summary View (TEXT Mode)
Displays raw, synchronized text telemetry data fetched directly from the cloud database, wrapped in structured circular cards.

### 3. Graphical Cockpit Gauges (VISUAL Mode)
Real-time rendered avionics metrics featuring:

* An active vertical slider track for the Altimeter.

* A dynamically rotating HSI compass wheel based on vector calculations.

* A smooth linear-gradient sky/ground representation for the ADI artificial horizon.
