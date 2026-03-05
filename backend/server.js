require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Health check – confirms backend is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const candidateRoutes = require('./routes/candidates');
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/candidates', candidateRoutes);

// Connect to MongoDB if MONGODB_URI is set (e.g. in .env)
if (process.env.MONGODB_URI) {
  connectDB();
} else {
  console.log('No MONGODB_URI set – running without database. Add .env with MONGODB_URI to connect.');
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
