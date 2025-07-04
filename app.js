require("dotenv").config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB

console.log("Connecting to:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI,{
    family:4
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Simple route
app.get('/', (req, res) => res.send('Welcome to Taskoo, Your personal planner!'));

// const blogRoutes = require('./routes/blog');
// app.use('/api/blogs', blogRoutes);

const taskRoutes = require('./routes/taskRoutes');
app.use('/api', taskRoutes);


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
