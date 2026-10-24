import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as initialSeed from './initialData.js';
import * as models from '../models/index.js';
import { isMongoConnected } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORAGE_DIR = path.resolve(__dirname, '../../storage');
const DB_FILE = path.join(STORAGE_DIR, 'db.json');

const COLLECTION_MODEL_MAP = {
  projects: models.ProjectModel,
  sites: models.SiteModel,
  dailyReports: models.DailyReportModel,
  workers: models.WorkerModel,
  materials: models.MaterialModel,
  materialRequests: models.MaterialRequestModel,
  equipment: models.EquipmentModel,
  equipmentUsageLogs: models.EquipmentUsageLogModel,
  issues: models.IssueModel,
  safetyObservations: models.SafetyObservationModel,
  photos: models.PhotoModel,
  users: models.UserModel,
};

class Database {
  constructor() {
    this.data = {};
    this.init();
  }

  init() {
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        console.log('[Database] Loaded local persistent store from storage/db.json');
        return;
      } catch (err) {
        console.error('[Database] Failed to read db.json, re-seeding default data:', err.message);
      }
    }

    // Seed default data
    this.data = {
      users: [...initialSeed.initialUsers],
      projects: [...initialSeed.initialProjects],
      sites: [...initialSeed.initialSites],
      workers: [...initialSeed.initialWorkers],
      materials: [...initialSeed.initialMaterials],
      materialRequests: [...initialSeed.initialMaterialRequests],
      equipment: [...initialSeed.initialEquipment],
      equipmentUsageLogs: [...initialSeed.initialEquipmentUsageLogs],
      issues: [...initialSeed.initialIssues],
      safetyObservations: [...initialSeed.initialSafetyObservations],
      photos: [...initialSeed.initialPhotos],
      dailyReports: [...initialSeed.initialDailyReports],
      notifications: [...initialSeed.initialNotifications],
      settings: {
        companyName: 'Apex Construction Infra Ltd',
        primaryColor: '#f97316',
        theme: 'light',
        emailNotifications: true,
        smsAlerts: false,
        autoApproveReports: false,
      },
    };

    this.persist();
    console.log('[Database] Seeded new local store into storage/db.json');
  }

  persist() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Database] Error saving to db.json:', err.message);
    }
  }

  // Synchronize collections with MongoDB Atlas upon connection
  async syncWithMongoDB() {
    if (!isMongoConnected()) return;

    try {
      console.log('🔄 [MongoDB] Synchronizing collections with MongoDB Atlas...');
      for (const [collectionName, Model] of Object.entries(COLLECTION_MODEL_MAP)) {
        if (!Model) continue;

        const count = await Model.countDocuments();
        if (count === 0 && Array.isArray(this.data[collectionName]) && this.data[collectionName].length > 0) {
          // Seed MongoDB Atlas with initial data
          await Model.insertMany(this.data[collectionName]);
          console.log(`   ✓ Seeded ${this.data[collectionName].length} items into Atlas [${collectionName}]`);
        } else if (count > 0) {
          // Load latest records from MongoDB Atlas
          const docs = await Model.find({}).lean();
          this.data[collectionName] = docs.map((d) => {
            const { _id, __v, ...rest } = d;
            return rest;
          });
          console.log(`   ✓ Hydrated ${docs.length} items from Atlas [${collectionName}]`);
        }
      }
      this.persist();
      console.log('✅ [MongoDB] All collections in sync with MongoDB Atlas!');
    } catch (err) {
      console.error('⚠️ [MongoDB] Error during collection sync:', err.message);
    }
  }

  get(collection) {
    return this.data[collection] || [];
  }

  getById(collection, id) {
    const list = this.get(collection);
    return list.find((item) => String(item.id) === String(id));
  }

  insert(collection, item) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    this.data[collection].unshift(item);
    this.persist();

    // Mirror to MongoDB Atlas asynchronously
    if (isMongoConnected() && COLLECTION_MODEL_MAP[collection]) {
      const Model = COLLECTION_MODEL_MAP[collection];
      Model.create(item).catch((err) => {
        console.error(`[MongoDB] Error inserting into ${collection}:`, err.message);
      });
    }

    return item;
  }

  update(collection, id, updates) {
    const list = this.get(collection);
    const index = list.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return null;

    this.data[collection][index] = {
      ...this.data[collection][index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();

    // Mirror to MongoDB Atlas asynchronously
    if (isMongoConnected() && COLLECTION_MODEL_MAP[collection]) {
      const Model = COLLECTION_MODEL_MAP[collection];
      Model.findOneAndUpdate({ id: String(id) }, updates, { new: true }).catch((err) => {
        console.error(`[MongoDB] Error updating ${collection} ${id}:`, err.message);
      });
    }

    return this.data[collection][index];
  }

  delete(collection, id) {
    const list = this.get(collection);
    const index = list.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return false;

    this.data[collection].splice(index, 1);
    this.persist();

    // Mirror to MongoDB Atlas asynchronously
    if (isMongoConnected() && COLLECTION_MODEL_MAP[collection]) {
      const Model = COLLECTION_MODEL_MAP[collection];
      Model.findOneAndDelete({ id: String(id) }).catch((err) => {
        console.error(`[MongoDB] Error deleting ${collection} ${id}:`, err.message);
      });
    }

    return true;
  }

  getAllData() {
    return this.data;
  }
}

export const db = new Database();
