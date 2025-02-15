// backend/server.js
require('dotenv').config();  // Add this at the top
const express = require('express');
const cors = require('cors');
const bidRoutes = require('./routes/bids');
const notificationRoutes = require('./routes/notificationRoutes');
const emailRoutes = require('./routes/emailRoutes');



const app = express();

console.log("we made it to the server")

const allowedOrigins = [
  'http://localhost:5173',
  'https://finalmile.pages.dev',
  process.env.CORS_ORIGIN
].filter(Boolean); // This removes any undefined values

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
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
app.use(emailRoutes);

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