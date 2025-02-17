const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// Simple route
app.get('/', (req, res) => res.send('Welcome to MERN Blog!'));

const blogRoutes = require('./routes/blog');
app.use('/api/blogs', blogRoutes);


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
