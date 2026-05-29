const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const timeLogRoutes = require('./routes/timeLogRoutes');
const summaryRoutes = require('./routes/summaryRoutes');  

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/timelogs', timeLogRoutes);
app.use('/api/summary', summaryRoutes); 

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log('DB connection error:', err));