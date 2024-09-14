const express = require('express');
const connectDB = require('./config/db'); // Assuming you have this file for MongoDB connection
const app = express();

// Connect to the MongoDB database
connectDB();

// Simple route
app.get('/', (req, res) => res.send('API is running...'));

// Define the port number (use environment variable or default to 5000)
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
