const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allows the server to accept and parse JSON in request bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// A simple test route to make sure the server is alive
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Define Routes - This tells Express to use the routes defined in './routes/users.js'
// for any request that starts with '/api/users'
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/marketplace', require('./routes/marketplace')); // Add this line
app.use('/api/events', require('./routes/events'));
app.use('/api/upload', require('./routes/upload'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));