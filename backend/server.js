// backend/server.js
const express = require('express');
const cors = require('cors');
const bidRoutes = require('./Routes/bids');

const app = express();

console.log("we made it to the server")


// Enable CORS for your frontend URL
app.use(cors({
  origin: 'http://localhost:5173' // Adjust this to match your Vite frontend URL
}));

// Parse JSON bodies
app.use(express.json());



// Use the bid routes
app.use('/api', bidRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});