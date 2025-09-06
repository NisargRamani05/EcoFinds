import mongoose from 'mongoose';

// Retrieve the MongoDB connection string from environment variables.
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // If we have a cached connection, use it.
  if (cached.conn) {
    return cached.conn;
  }

  // If there's no cached promise, create a new connection promise.
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  // Wait for the connection promise to resolve and cache the connection.
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // If the connection fails, reset the cached promise and re-throw the error.
    cached.promise = null;
    throw e;
  }

  // Return the connection.
  return cached.conn;
}

export default dbConnect;