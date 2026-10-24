export type UserRole = 'site_engineer' | 'project_manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  assignedSiteIds?: string[];
}

export type ProjectStatus = 'Planned' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
export type ProjectType = 'Residential' | 'Commercial' | 'Industrial' | 'Infrastructure' | 'Institutional';

export interface Project {
  id: string; // e.g. PRJ-001
  name: string;
  client: string;
  type: ProjectType;
  startDate: string;
  expectedCompletionDate: string;
  location: string;
  projectManager: string;
  status: ProjectStatus;
  description: string;
  progress: number; // 0-100
}

export type SiteStatus = 'Active' | 'Planned' | 'On Hold' | 'Completed';

export interface ConstructionSite {
  id: string; // e.g. SIT-001
  name: string;
  projectId: string;
  projectName: string;
  location: string;
  gpsCoordinates: string;
  engineerId: string;
  engineerName: string;
  currentPhase: string;
  status: SiteStatus;
  startDate: string;
  expectedCompletionDate: string;
  notes: string;
}

export type ReportStatus = 'Draft' | 'Submitted' | 'Approved' | 'Revision Required';

export interface WorkProgressItem {
  id: string;
  category: string;
  description: string;
  plannedQty: number;
  completedQty: number;
  unit: string;
  progressPercentage: number;
  startDate?: string;
  expectedCompletionDate?: string;
  status?: 'Not Started' | 'In Progress' | 'Completed';
  remarks?: string;
}

export interface ReportReviewComment {
  id: string;
  reviewerId: string;
  reviewerName: string;
  date: string;
  action: 'Approved' | 'Revision Required' | 'Comment';
  comment: string;
}

export interface DailyReport {
  id: string; // e.g. DSR-2026-001
  siteId: string;
  siteName: string;
  projectId: string;
  projectName: string;
  date: string;
  engineerId: string;
  engineerName: string;
  workingHours: string; // e.g. "08:00 - 17:00"
  weatherCondition: 'Sunny' | 'Overcast' | 'Rainy' | 'Windy' | 'Extreme Heat';
  status: ReportStatus;
  
  // Worker attendance overview in report
  workersSummary: {
    total: number;
    present: number;
    absent: number;
    halfDay: number;
    leave: number;
  };

  // Work progress items
  workProgress: WorkProgressItem[];

  // Materials used in this shift
  materialsUsed: {
    materialId: string;
    materialName: string;
    quantityUsed: number;
    unit: string;
  }[];

  // Equipment used in this shift
  equipmentUsed: {
    equipmentId: string;
    equipmentName: string;
    hoursUsed: number;
    purpose: string;
  }[];

  siteObservations: string;
  problemsEncountered: string;
  safetyObservations: string;
  generalRemarks: string;
  photographs: string[]; // photo IDs or URLs
  
  reviewHistory: ReportReviewComment[];
  createdAt: string;
  updatedAt: string;
}

export type WorkerTrade = 'Mason' | 'Electrician' | 'Carpenter' | 'Helper' | 'Welder' | 'Plumber' | 'Painter' | 'Surveyor' | 'Bar Bender';
export type AttendanceStatus = 'Present' | 'Absent' | 'Half Day' | 'Leave';

export interface Worker {
  id: string; // e.g. WKR-001
  name: string;
  trade: WorkerTrade;
  contractor: string;
  skill: 'Unskilled' | 'Semi-Skilled' | 'Skilled' | 'Master Craftsman';
  contact: string;
  siteId: string;
  status: 'Active' | 'Inactive';
  todayAttendance: AttendanceStatus;
}

export interface AttendanceRecord {
  id: string;
  workerId: string;
  workerName: string;
  siteId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface Material {
  id: string; // e.g. MAT-001
  name: string;
  category: string;
  unit: string;
  openingQty: number;
  receivedQty: number;
  usedQty: number;
  remainingQty: number;
  supplier: string;
  deliveryDate: string;
  siteId: string;
  remarks: string;
}

export type MaterialRequestStatus = 'Pending Review' | 'Approved' | 'Rejected' | 'In Delivery' | 'Received';

export interface MaterialRequest {
  id: string; // e.g. MR-001
  materialName: string;
  quantity: number;
  unit: string;
  requiredDate: string;
  reason: string;
  siteId: string;
  siteName: string;
  requestingEngineerId: string;
  requestingEngineerName: string;
  status: MaterialRequestStatus;
  managerRemarks?: string;
  createdAt: string;
}

export type EquipmentCondition = 'Excellent' | 'Good' | 'Fair' | 'Needs Repair';
export type MaintenanceStatus = 'OK' | 'Due' | 'In Repair';

export interface Equipment {
  id: string; // e.g. EQP-001
  name: string;
  type: string;
  assignedSiteId: string;
  assignedSiteName: string;
  operator: string;
  condition: EquipmentCondition;
  maintenanceStatus: MaintenanceStatus;
  lastServiceDate: string;
  nextServiceDate: string;
}

export interface EquipmentUsageLog {
  id: string;
  equipmentId: string;
  equipmentName: string;
  siteId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  purpose: string;
  remarks: string;
}

export type IssueCategory = 
  | 'Material shortage'
  | 'Equipment failure'
  | 'Labour shortage'
  | 'Weather'
  | 'Safety'
  | 'Quality'
  | 'Design/change'
  | 'Delivery delay'
  | 'Access problem'
  | 'Other';

export type IssueSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type IssueStatus = 'Open' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';

export interface SiteIssue {
  id: string; // e.g. ISS-001
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  siteId: string;
  siteName: string;
  reportedBy: string;
  date: string;
  photographs: string[];
  assignedPerson: string;
  status: IssueStatus;
  resolution?: string;
  resolvedDate?: string;
}

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type SafetyStatus = 'Open' | 'Action Taken' | 'Resolved';

export interface SafetyObservation {
  id: string; // e.g. SFT-001
  observation: string;
  riskLevel: RiskLevel;
  location: string;
  siteId: string;
  siteName: string;
  date: string;
  photograph?: string;
  correctiveAction: string;
  status: SafetyStatus;
  remarks: string;
  reportedBy: string;
}

export type PhotoCategory = 
  | 'Site Overview'
  | 'Work Progress'
  | 'Materials'
  | 'Equipment'
  | 'Safety'
  | 'Issue'
  | 'Completed Work'
  | 'Other';

export interface SitePhoto {
  id: string;
  url: string;
  title: string;
  projectId: string;
  projectName: string;
  siteId: string;
  siteName: string;
  reportId?: string;
  category: PhotoCategory;
  dateTime: string;
  takenAt?: string;    // Date and time when the photo was taken on site
  uploadedAt?: string; // Date and time when the photo was uploaded into the app
  description: string;
  uploadedBy: string;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'report' | 'issue' | 'material' | 'safety' | 'system';
  timestamp: string;
  read: boolean;
  targetId?: string;
  targetSection?: string;
}
