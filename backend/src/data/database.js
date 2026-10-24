import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as initialSeed from './initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORAGE_DIR = path.resolve(__dirname, '../../storage');
const DB_FILE = path.join(STORAGE_DIR, 'db.json');

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
        console.log('[Database] Loaded existing database from storage/db.json');
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
    console.log('[Database] Seeded new database into storage/db.json');
  }

  persist() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Database] Error saving to db.json:', err.message);
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
    return this.data[collection][index];
  }

  delete(collection, id) {
    const list = this.get(collection);
    const index = list.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return false;

    this.data[collection].splice(index, 1);
    this.persist();
    return true;
  }

  getAllData() {
    return this.data;
  }
}

export const db = new Database();
