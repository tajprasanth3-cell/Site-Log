import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as initialData from '../data/initialData.js';
import * as models from '../models/index.js';

dotenv.config();

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://tajprasanth3_db_user:sitelog@cluster0.aevi79z.mongodb.net/sitelog?retryWrites=true&w=majority';

console.log('====================================================');
console.log('🍃 Starting MongoDB Atlas Seeder for SiteLog...');
console.log('🎯 Target Cluster:', mongoUri.split('@')[1] ? mongoUri.split('@')[1].split('/')[0] : 'cluster0');
console.log('====================================================');

const MAPPINGS = [
  { name: 'projects', model: models.ProjectModel, data: initialData.initialProjects },
  { name: 'sites', model: models.SiteModel, data: initialData.initialSites },
  { name: 'dailyreports', model: models.DailyReportModel, data: initialData.initialDailyReports },
  { name: 'workers', model: models.WorkerModel, data: initialData.initialWorkers },
  { name: 'materials', model: models.MaterialModel, data: initialData.initialMaterials },
  { name: 'materialrequests', model: models.MaterialRequestModel, data: initialData.initialMaterialRequests },
  { name: 'equipments', model: models.EquipmentModel, data: initialData.initialEquipment },
  { name: 'equipmentusagelogs', model: models.EquipmentUsageLogModel, data: initialData.initialEquipmentUsageLogs },
  { name: 'issues', model: models.IssueModel, data: initialData.initialIssues },
  { name: 'safetyobservations', model: models.SafetyObservationModel, data: initialData.initialSafetyObservations },
  { name: 'photos', model: models.PhotoModel, data: initialData.initialPhotos },
  { name: 'users', model: models.UserModel, data: initialData.initialUsers },
];

async function seed() {
  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected successfully to database: sitelog');

    for (const item of MAPPINGS) {
      const existing = await item.model.countDocuments();
      if (existing === 0) {
        if (item.data && item.data.length > 0) {
          await item.model.insertMany(item.data);
          console.log(`   ✓ Seeded ${item.data.length} documents into [${item.name}]`);
        }
      } else {
        console.log(`   ℹ️ [${item.name}] already has ${existing} documents (skipping overwrite)`);
      }
    }

    console.log('\n🎉 ALL COLLECTIONS READY in MongoDB Atlas!');
    console.log('👉 Open MongoDB Compass, click Refresh, and you will see the "sitelog" database with all collections populated!\n');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed:');
    if (error.message.includes('whitelist') || error.message.includes('Could not connect to any servers')) {
      console.error('👉 MongoDB Atlas rejected the connection because your IP is not whitelisted yet.');
      console.error('👉 Solution: Add 0.0.0.0/0 (Allow Access from Anywhere) in MongoDB Atlas Network Access.');
    } else {
      console.error('👉 Error detail:', error.message);
    }
    process.exit(1);
  }
}

seed();
