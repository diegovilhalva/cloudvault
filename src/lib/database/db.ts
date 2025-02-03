import mongoose, { ConnectOptions } from "mongoose";
import { MONGODB_URI } from "../env";

// Ensure the MongoDB URI is defined
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

// Define a type for the cached object
interface MongooseCache {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}

// Add the cache object to the global type to prevent TypeScript errors
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Use a global cached object for maintaining a single connection instance
const cached: MongooseCache = global.mongoose || {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = cached;
}

async function db(): Promise<mongoose.Mongoose> {
  // Return the cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: ConnectOptions = {
      bufferCommands: false,
    };

    // Create a new connection promise and cache it
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset the promise on failure
    throw e; // Rethrow the error to be handled by the caller
  }

  return cached.conn;
}

export default db;