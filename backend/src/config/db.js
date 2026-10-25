import dns from 'dns';
import mongoose from 'mongoose';
import { config } from './index.js';

// Resolve MongoDB Atlas SRV records reliably across all Windows/ISP resolvers
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore if custom DNS cannot be set in specific runtime
}

let isConnected = false;

export async function connectDB() {
  if (!config.mongoUri) {
    console.log('ℹ️  No MONGODB_URI configured. Running with persistent JSON store.');
    return false;
  }

  try {
    console.log('⏳ Connecting to MongoDB...');
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 6000,
      connectTimeoutMS: 6000,
    });
    isConnected = true;
    console.log(`🍃 Connected to MongoDB! Host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn('\n⚠️  MongoDB Connection Warning:');
    if (error.message.includes('whitelist') || error.message.includes('Could not connect to any servers')) {
      console.warn('👉 Your current IP address is not whitelisted in MongoDB Atlas.');
      console.warn('👉 To allow access from your current network:');
      console.warn('   1. Log into MongoDB Atlas: https://cloud.mongodb.com');
      console.warn('   2. Navigate to "Network Access" under Security in left sidebar');
      console.warn('   3. Click "Add IP Address" -> choose "Allow Access From Anywhere" (0.0.0.0/0)');
      console.warn('   4. Click "Confirm".');
    } else {
      console.warn(`   Reason: ${error.message}`);
    }
    console.warn('🛡️  Fallback Active: Local persistent storage (storage/db.json) is active and running.\n');
    return false;
  }
}

export function isMongoConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

export { mongoose };
