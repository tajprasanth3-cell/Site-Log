import app from './app.js';
import { config } from './config/index.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  🏗️  Site Log Backend API Server Ready!`);
  console.log(`  🚀  URL: http://localhost:${PORT}`);
  console.log(`  🩺  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`  📦  Initial Data: http://localhost:${PORT}/api/initial-data`);
  console.log(`====================================================`);
});
