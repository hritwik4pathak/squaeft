import mongoose from "mongoose";

// Use global to persist connection across Next.js hot-reloads in dev
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connect = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set('strictQuery', true);
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'SqFt-Estate-1',
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
