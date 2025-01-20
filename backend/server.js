// backend/server.js
require('dotenv').config();  // Add this at the top
const express = require('express');
const cors = require('cors');
const bidRoutes = require('./routes/bids');
const notificationRoutes = require('./routes/notificationRoutes');


const app = express();

console.log("we made it to the server")


// Enable CORS for your frontend URL
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to match your Vite frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Test route working' });
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  next();
});


// Use the bid routes
app.use('/api', bidRoutes);
app.use('/api', notificationRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// 404 handler
app.use((req, res) => {
  console.log('404 hit for:', req.method, req.url);
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

console.log('\nRegistered Routes:');
  app._router.stack.forEach(function(r){
    if (r.route && r.route.path){
      console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
    }
  });