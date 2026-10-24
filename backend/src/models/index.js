import mongoose from 'mongoose';

const options = { timestamps: true, strict: false };

// 1. Project Schema
const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  client: { type: String, default: '' },
  type: { type: String, default: 'Commercial' },
  startDate: { type: String },
  expectedCompletionDate: { type: String },
  location: { type: String, default: '' },
  projectManager: { type: String, default: '' },
  status: { type: String, default: 'Active' },
  description: { type: String, default: '' },
  progress: { type: Number, default: 0 },
}, options);

// 2. Site Schema
const SiteSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  projectId: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String, default: '' },
  siteEngineer: { type: String, default: '' },
  projectManager: { type: String, default: '' },
  status: { type: String, default: 'Active' },
  totalWorkers: { type: Number, default: 0 },
  activeIssues: { type: Number, default: 0 },
  todayReportStatus: { type: String, default: 'Pending' },
  image: { type: String, default: '' },
}, options);

// 3. Daily Report Schema
const DailyReportSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  siteId: { type: String, required: true },
  siteName: { type: String, default: '' },
  submittedBy: { type: String, default: '' },
  submittedById: { type: String, default: '' },
  submittedAt: { type: String, default: '' },
  status: { type: String, default: 'Submitted' },
  weather: {
    condition: { type: String, default: 'Sunny' },
    temperature: { type: String, default: '28°C' },
    impact: { type: String, default: 'None' },
  },
  workProgress: { type: Array, default: [] },
  workforceAttendance: { type: Array, default: [] },
  materialsUsed: { type: Array, default: [] },
  equipmentLogs: { type: Array, default: [] },
  safetyObservations: { type: Array, default: [] },
  issuesDelays: { type: Array, default: [] },
  photos: { type: Array, default: [] },
  notes: { type: String, default: '' },
  reviewHistory: { type: Array, default: [] },
  createdAt: { type: String },
  updatedAt: { type: String },
}, options);

// 4. Worker Schema
const WorkerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, default: 'Labor' },
  trade: { type: String, default: 'General' },
  siteId: { type: String, required: true },
  siteName: { type: String, default: '' },
  phone: { type: String, default: '' },
  status: { type: String, default: 'Active' },
  todayAttendance: { type: String, default: 'present' },
  joinDate: { type: String },
}, options);

// 5. Material Schema
const MaterialSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, default: 'Raw Material' },
  siteId: { type: String, required: true },
  siteName: { type: String, default: '' },
  quantity: { type: Number, default: 0 },
  unit: { type: String, default: 'units' },
  minimumThreshold: { type: Number, default: 10 },
  reorderQuantity: { type: Number, default: 50 },
  supplier: { type: String, default: '' },
  lastRestocked: { type: String },
}, options);

// 6. Material Request Schema
const MaterialRequestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  siteId: { type: String, required: true },
  siteName: { type: String, default: '' },
  materialName: { type: String, required: true },
  category: { type: String, default: 'Raw Material' },
  quantity: { type: Number, default: 1 },
  unit: { type: String, default: 'units' },
  urgency: { type: String, default: 'Medium' },
  status: { type: String, default: 'Pending' },
  requestedBy: { type: String, default: '' },
  requestedById: { type: String, default: '' },
  requiredDate: { type: String },
  createdAt: { type: String },
  remarks: { type: String, default: '' },
}, options);

// 7. Equipment Schema
const EquipmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, default: 'Machinery' },
  siteId: { type: String, required: true },
  siteName: { type: String, default: '' },
  operatorName: { type: String, default: '' },
  status: { type: String, default: 'Operational' },
  totalHoursRun: { type: Number, default: 0 },
  fuelEfficiency: { type: String, default: '' },
  lastMaintenanceDate: { type: String },
  nextMaintenanceDue: { type: String },
}, options);

// 8. Equipment Usage Log Schema
const EquipmentUsageLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  equipmentId: { type: String, required: true },
  equipmentName: { type: String, default: '' },
  siteId: { type: String, required: true },
  date: { type: String, required: true },
  hoursOperated: { type: Number, default: 0 },
  idleHours: { type: Number, default: 0 },
  breakdownHours: { type: Number, default: 0 },
  operatorName: { type: String, default: '' },
  fuelConsumedLiters: { type: Number, default: 0 },
  notes: { type: String, default: '' },
}, options);

// 9. Site Issue Schema
const IssueSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  siteId: { type: String, required: true },
  siteName: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Technical' },
  severity: { type: String, default: 'Medium' },
  status: { type: String, default: 'Open' },
  assignedTo: { type: String, default: '' },
  reportedBy: { type: String, default: '' },
  reportedDate: { type: String },
  resolutionNotes: { type: String, default: '' },
}, options);

// 10. Safety Observation Schema
const SafetyObservationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  siteId: { type: String, required: true },
  siteName: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, default: 'Hazard' },
  severity: { type: String, default: 'Medium' },
  status: { type: String, default: 'Reported' },
  reportedBy: { type: String, default: '' },
  date: { type: String },
  photograph: { type: String, default: '' },
  preventiveAction: { type: String, default: '' },
}, options);

// 11. Photo Schema
const PhotoSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  siteId: { type: String, required: true },
  siteName: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  url: { type: String, default: '' },
  tag: { type: String, default: 'Progress' },
  dateTime: { type: String },
  uploadedBy: { type: String, default: '' },
}, options);

// 12. User Schema
const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  assignedSites: { type: Array, default: [] },
}, options);

// Export models
export const ProjectModel = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export const SiteModel = mongoose.models.Site || mongoose.model('Site', SiteSchema);
export const DailyReportModel = mongoose.models.DailyReport || mongoose.model('DailyReport', DailyReportSchema);
export const WorkerModel = mongoose.models.Worker || mongoose.model('Worker', WorkerSchema);
export const MaterialModel = mongoose.models.Material || mongoose.model('Material', MaterialSchema);
export const MaterialRequestModel = mongoose.models.MaterialRequest || mongoose.model('MaterialRequest', MaterialRequestSchema);
export const EquipmentModel = mongoose.models.Equipment || mongoose.model('Equipment', EquipmentSchema);
export const EquipmentUsageLogModel = mongoose.models.EquipmentUsageLog || mongoose.model('EquipmentUsageLog', EquipmentUsageLogSchema);
export const IssueModel = mongoose.models.Issue || mongoose.model('Issue', IssueSchema);
export const SafetyObservationModel = mongoose.models.SafetyObservation || mongoose.model('SafetyObservation', SafetyObservationSchema);
export const PhotoModel = mongoose.models.Photo || mongoose.model('Photo', PhotoSchema);
export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
