import app from './app.js';
import { config } from './config/index.js';
import { connectDB, isMongoConnected } from './config/db.js';
import { db } from './data/database.js';

const PORT = config.port;

// Start server
app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(`  🏗️  Site Log Backend API Server Ready!`);
  console.log(`  🚀  URL: http://localhost:${PORT}`);
  console.log(`  🩺  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`  📦  Initial Data: http://localhost:${PORT}/api/initial-data`);
  console.log(`====================================================`);

  // Attempt connection to MongoDB Atlas
  const connected = await connectDB();
  if (connected) {
    await db.syncWithMongoDB();
  }
});
