// src/lib/mongodb.ts
import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI tidak ditemukan di .env.local');
}

// Menyimpan koneksi global saat development (hindari warning HMR)
declare global {
  var mongooseConn: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  } | undefined;
}

// Inisialisasi global jika belum ada
if (!global.mongooseConn) {
  global.mongooseConn = {
    conn: null,
    promise: null,
  };
}

export async function connectDB(): Promise<Mongoose> {
  if (global.mongooseConn?.conn) return global.mongooseConn.conn;

  if (!global.mongooseConn?.promise) {
    global.mongooseConn!.promise = mongoose.connect(MONGODB_URI!, {
      dbName: 'pustakabuana',
      bufferCommands: false,
    });
  }

  global.mongooseConn!.conn = await global.mongooseConn!.promise;
  console.log('✅ MongoDB Connected');
  return global.mongooseConn!.conn;
}
