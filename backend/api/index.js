import mongoose from 'mongoose';
import createApp from '../app.js';

let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

async function dbMiddleware(req, res, next) {
  if (cached.conn) return next();
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI).then((m) => m);
  }
  try {
    cached.conn = await cached.promise;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
}

const app = createApp(dbMiddleware);

export default app;
