import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import createApp from './app.js';

const PORT = process.env.PORT || 5000;
const app = createApp();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
