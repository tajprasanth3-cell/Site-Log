import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Project,
  ConstructionSite,
  DailyReport,
  Worker,
  Material,
  MaterialRequest,
  Equipment,
  SiteIssue,
  SafetyObservation,
  SitePhoto,
  InAppNotification,
  AttendanceStatus,
  MaterialRequestStatus,
  IssueStatus,
  SafetyStatus,
  EquipmentUsageLog,
} from '../types';
import {
  initialUsers,
  initialProjects,
  initialSites,
  initialWorkers,
  initialMaterials,
  initialMaterialRequests,
  initialEquipment,
  initialIssues,
  initialSafetyObservations,
  initialPhotos,
  initialDailyReports,
  initialNotifications,
  siteImagesMap,
} from '../data/mockData';
import { scrollToTop } from '../utils/scroll';


interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User;
  isAuthenticated: boolean;
  activeSection: string;
  setActiveSection: (section: string) => void;
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  
  projects: Project[];
  addProject: (p: Omit<Project, 'id'>) => void;
  updateProject: (p: Project) => void;
  deleteProject: (id: string) => void;

  sites: ConstructionSite[];
  addSite: (s: Omit<ConstructionSite, 'id'>) => void;
  updateSite: (s: ConstructionSite) => void;

  dailyReports: DailyReport[];
  addDailyReport: (r: Omit<DailyReport, 'id' | 'createdAt' | 'updatedAt' | 'reviewHistory'>) => void;
  updateDailyReport: (r: DailyReport) => void;
  approveReport: (reportId: string, comment: string) => void;
  requestReportRevision: (reportId: string, comment: string) => void;
  selectedReportForReview: DailyReport | null;
  setSelectedReportForReview: (r: DailyReport | null) => void;
  selectedReportForEdit: DailyReport | null;
  setSelectedReportForEdit: (r: DailyReport | null) => void;

  workers: Worker[];
  addWorker: (w: Omit<Worker, 'id'>) => void;
  updateWorkerAttendance: (workerId: string, status: AttendanceStatus) => void;

  materials: Material[];
  addMaterial: (m: Omit<Material, 'id'>) => void;
  updateMaterial: (m: Material) => void;

  materialRequests: MaterialRequest[];
  addMaterialRequest: (mr: Omit<MaterialRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateMaterialRequestStatus: (id: string, status: MaterialRequestStatus, remarks?: string) => void;

  equipment: Equipment[];
  addEquipment: (e: Omit<Equipment, 'id'>) => void;
  equipmentUsageLogs: EquipmentUsageLog[];
  logEquipmentUsage: (log: Omit<EquipmentUsageLog, 'id'>) => void;

  issues: SiteIssue[];
  addIssue: (i: Omit<SiteIssue, 'id' | 'date'>) => void;
  updateIssueStatus: (id: string, status: IssueStatus, resolution?: string) => void;

  safetyObservations: SafetyObservation[];
  addSafetyObservation: (s: Omit<SafetyObservation, 'id' | 'date'>) => void;
  updateSafetyStatus: (id: string, status: SafetyStatus, remarks?: string) => void;

  photos: SitePhoto[];
  addPhoto: (p: Omit<SitePhoto, 'id' | 'dateTime'> & { takenAt?: string; uploadedAt?: string; dateTime?: string }) => void;

  notifications: InAppNotification[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`sitelog_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Error loading ${key} from storage:`, err);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`sitelog_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() =>
    loadFromStorage('currentUser', initialUsers[0])
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    loadFromStorage('isAuthenticated', true)
  );
  const [activeSection, setActiveSectionState] = useState<string>('dashboard');

  const setActiveSection = (section: string) => {
    setActiveSectionState(section);
    scrollToTop();
  };

  const [projects, setProjects] = useState<Project[]>(() =>
    loadFromStorage('projects', initialProjects)
  );
  const [sites, setSites] = useState<ConstructionSite[]>(() =>
    loadFromStorage('sites', initialSites)
  );
  const [dailyReports, setDailyReports] = useState<DailyReport[]>(() =>
    loadFromStorage('dailyReports', initialDailyReports)
  );
  const [workers, setWorkers] = useState<Worker[]>(() =>
    loadFromStorage('workers', initialWorkers)
  );
  const [materials, setMaterials] = useState<Material[]>(() =>
    loadFromStorage('materials', initialMaterials)
  );
  const [materialRequests, setMaterialRequests] = useState<MaterialRequest[]>(() =>
    loadFromStorage('materialRequests', initialMaterialRequests)
  );
  const [equipment, setEquipment] = useState<Equipment[]>(() =>
    loadFromStorage('equipment', initialEquipment)
  );
  const [equipmentUsageLogs, setEquipmentUsageLogs] = useState<EquipmentUsageLog[]>(() =>
    loadFromStorage('equipmentUsageLogs', [])
  );
  const [issues, setIssues] = useState<SiteIssue[]>(() =>
    loadFromStorage('issues', initialIssues)
  );
  const [safetyObservations, setSafetyObservations] = useState<SafetyObservation[]>(() => {
    const raw = loadFromStorage('safetyObservations', initialSafetyObservations);
    return raw.map((s: SafetyObservation) => ({
      ...s,
      photograph: s.photograph && !s.photograph.includes('images.unsplash.com') ? s.photograph : siteImagesMap[s.id] || siteImagesMap.default,
    }));
  });
  const [photos, setPhotos] = useState<SitePhoto[]>(() => {
    const raw = loadFromStorage('photos', initialPhotos);
    return raw.map((p: SitePhoto) => {
      const initMatch = initialPhotos.find((ip) => ip.id === p.id);
      return {
        ...p,
        title: initMatch ? initMatch.title : p.title,
        description: initMatch ? initMatch.description : p.description,
        url: siteImagesMap[p.id] || (p.url && !p.url.includes('images.unsplash.com') ? p.url : siteImagesMap.default),
      };
    });
  });
  const [notifications, setNotifications] = useState<InAppNotification[]>(() =>
    loadFromStorage('notifications', initialNotifications)
  );

  const [selectedReportForReview, setSelectedReportForReview] = useState<DailyReport | null>(null);
  const [selectedReportForEdit, setSelectedReportForEdit] = useState<DailyReport | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Auto-sync states to localStorage
  useEffect(() => saveToStorage('currentUser', currentUser), [currentUser]);
  useEffect(() => saveToStorage('isAuthenticated', isAuthenticated), [isAuthenticated]);
  useEffect(() => saveToStorage('projects', projects), [projects]);
  useEffect(() => saveToStorage('sites', sites), [sites]);
  useEffect(() => saveToStorage('dailyReports', dailyReports), [dailyReports]);
  useEffect(() => saveToStorage('workers', workers), [workers]);
  useEffect(() => saveToStorage('materials', materials), [materials]);
  useEffect(() => saveToStorage('materialRequests', materialRequests), [materialRequests]);
  useEffect(() => saveToStorage('equipment', equipment), [equipment]);
  useEffect(() => saveToStorage('equipmentUsageLogs', equipmentUsageLogs), [equipmentUsageLogs]);
  useEffect(() => saveToStorage('issues', issues), [issues]);
  useEffect(() => saveToStorage('safetyObservations', safetyObservations), [safetyObservations]);
  useEffect(() => saveToStorage('photos', photos), [photos]);
  useEffect(() => saveToStorage('notifications', notifications), [notifications]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const login = (email: string, role?: UserRole) => {
    // 1. If email matches an existing user profile, use that user
    const userByEmail = initialUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    // 2. If role was selected, find the demo profile matching that role
    const userByRole = role ? initialUsers.find((u) => u.role === role) : null;

    let matched: User;
    if (userByEmail) {
      matched = role && userByEmail.role !== role && userByRole ? userByRole : userByEmail;
    } else if (userByRole) {
      matched = userByRole;
    } else {
      matched = {
        id: `USR-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: role || 'site_engineer',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        phone: '+91 98765 43210',
        assignedSiteIds: ['SIT-001', 'SIT-002'],
      };
    }

    setCurrentUser(matched);
    setIsAuthenticated(true);
    setActiveSection('dashboard');
    scrollToTop();
    const roleLabel =
      matched.role === 'site_engineer'
        ? 'Site Engineer'
        : matched.role === 'project_manager'
        ? 'Project Manager'
        : 'Admin';
    showToast(`Welcome back, ${matched.name}! (${roleLabel})`);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Logged out successfully', 'info');
  };

  const switchRole = (newRole: UserRole) => {
    const targetUser = initialUsers.find((u) => u.role === newRole) || {
      ...currentUser,
      role: newRole,
    };
    setCurrentUser(targetUser);
    setActiveSection('dashboard');
    scrollToTop();
    const roleLabel =
      newRole === 'site_engineer'
        ? 'Site Engineer'
        : newRole === 'project_manager'
        ? 'Project Manager'
        : 'Admin';
    showToast(`Switched active perspective to ${roleLabel}`);
  };

  // Projects CRUD
  const addProject = (p: Omit<Project, 'id'>) => {
    const newProj: Project = {
      ...p,
      id: `PRJ-${String(projects.length + 1).padStart(3, '0')}`,
    };
    setProjects((prev) => [newProj, ...prev]);
    showToast(`Project "${newProj.name}" created successfully!`);
  };

  const updateProject = (updated: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Project "${updated.name}" updated!`);
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    showToast('Project removed', 'info');
  };

  // Sites CRUD
  const addSite = (s: Omit<ConstructionSite, 'id'>) => {
    const newSite: ConstructionSite = {
      ...s,
      id: `SIT-${String(sites.length + 1).padStart(3, '0')}`,
    };
    setSites((prev) => [newSite, ...prev]);
    showToast(`Construction Site "${newSite.name}" added!`);
  };

  const updateSite = (updated: ConstructionSite) => {
    setSites((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    showToast(`Site "${updated.name}" updated!`);
  };

  // Daily Reports CRUD & Workflow
  const addDailyReport = (r: Omit<DailyReport, 'id' | 'createdAt' | 'updatedAt' | 'reviewHistory'>) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);
    const newReport: DailyReport = {
      ...r,
      id: `DSR-${now.getFullYear()}-${String(dailyReports.length + 1).padStart(3, '0')}`,
      reviewHistory: [],
      createdAt: `${dateStr} ${timeStr}`,
      updatedAt: `${dateStr} ${timeStr}`,
    };
    setDailyReports((prev) => [newReport, ...prev]);

    // Send in-app notification if submitted
    if (newReport.status === 'Submitted') {
      const notif: InAppNotification = {
        id: `NOTIF-${Date.now()}`,
        title: 'Daily Report Submitted',
        message: `${currentUser.name} submitted Daily Report for ${newReport.siteName}.`,
        type: 'report',
        timestamp: 'Just now',
        read: false,
        targetId: newReport.id,
        targetSection: 'daily-reports',
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    showToast(
      newReport.status === 'Submitted'
        ? 'Daily Site Report submitted successfully for Manager review!'
        : 'Daily Site Report saved as draft.'
    );
  };

  const updateDailyReport = (updated: DailyReport) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);
    const refreshed = { ...updated, updatedAt: `${dateStr} ${timeStr}` };
    setDailyReports((prev) => prev.map((r) => (r.id === refreshed.id ? refreshed : r)));

    if (refreshed.status === 'Submitted') {
      const notif: InAppNotification = {
        id: `NOTIF-${Date.now()}`,
        title: 'Report Resubmitted',
        message: `Report for ${refreshed.siteName} was resubmitted after updates.`,
        type: 'report',
        timestamp: 'Just now',
        read: false,
        targetId: refreshed.id,
        targetSection: 'daily-reports',
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    showToast('Daily Report updated successfully!');
  };

  const approveReport = (reportId: string, comment: string) => {
    const target = dailyReports.find((r) => r.id === reportId);
    if (!target) return;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const updated: DailyReport = {
      ...target,
      status: 'Approved',
      updatedAt: now,
      reviewHistory: [
        ...target.reviewHistory,
        {
          id: `REV-${Date.now()}`,
          reviewerId: currentUser.id,
          reviewerName: currentUser.name,
          date: now,
          action: 'Approved',
          comment: comment || 'Report reviewed and approved by Project Manager.',
        },
      ],
    };
    setDailyReports((prev) => prev.map((r) => (r.id === reportId ? updated : r)));
    setSelectedReportForReview(null);

    // Notify engineer
    const notif: InAppNotification = {
      id: `NOTIF-${Date.now()}`,
      title: 'Report Approved',
      message: `Daily report for ${target.siteName} has been approved by ${currentUser.name}.`,
      type: 'report',
      timestamp: 'Just now',
      read: false,
      targetId: reportId,
      targetSection: 'daily-reports',
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast(`Report ${reportId} approved!`);
  };

  const requestReportRevision = (reportId: string, comment: string) => {
    const target = dailyReports.find((r) => r.id === reportId);
    if (!target) return;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const updated: DailyReport = {
      ...target,
      status: 'Revision Required',
      updatedAt: now,
      reviewHistory: [
        ...target.reviewHistory,
        {
          id: `REV-${Date.now()}`,
          reviewerId: currentUser.id,
          reviewerName: currentUser.name,
          date: now,
          action: 'Revision Required',
          comment: comment || 'Revision requested. Please check and update items.',
        },
      ],
    };
    setDailyReports((prev) => prev.map((r) => (r.id === reportId ? updated : r)));
    setSelectedReportForReview(null);

    // Notify engineer
    const notif: InAppNotification = {
      id: `NOTIF-${Date.now()}`,
      title: 'Revision Requested on Report',
      message: `${currentUser.name} requested revisions on ${target.siteName} report: "${comment.slice(0, 60)}..."`,
      type: 'report',
      timestamp: 'Just now',
      read: false,
      targetId: reportId,
      targetSection: 'daily-reports',
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast(`Revision request sent for ${reportId}!`, 'info');
  };

  // Workers
  const addWorker = (w: Omit<Worker, 'id'>) => {
    const newWorker: Worker = {
      ...w,
      id: `WKR-${String(workers.length + 1).padStart(3, '0')}`,
    };
    setWorkers((prev) => [newWorker, ...prev]);
    showToast(`Worker ${newWorker.name} added!`);
  };

  const updateWorkerAttendance = (workerId: string, status: AttendanceStatus) => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, todayAttendance: status } : w))
    );
    showToast(`Attendance updated for worker`, 'info');
  };

  // Materials & Requests
  const addMaterial = (m: Omit<Material, 'id'>) => {
    const newMat: Material = {
      ...m,
      id: `MAT-${String(materials.length + 1).padStart(3, '0')}`,
    };
    setMaterials((prev) => [newMat, ...prev]);
    showToast(`Material ${newMat.name} added to inventory!`);
  };

  const updateMaterial = (updated: Material) => {
    setMaterials((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    showToast(`Material updated`);
  };

  const addMaterialRequest = (mr: Omit<MaterialRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: MaterialRequest = {
      ...mr,
      id: `MR-${String(materialRequests.length + 1).padStart(3, '0')}`,
      status: 'Pending Review',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMaterialRequests((prev) => [newReq, ...prev]);

    const notif: InAppNotification = {
      id: `NOTIF-${Date.now()}`,
      title: 'Material Request Submitted',
      message: `${newReq.requestingEngineerName} requested ${newReq.quantity} ${newReq.unit} of ${newReq.materialName}.`,
      type: 'material',
      timestamp: 'Just now',
      read: false,
      targetId: newReq.id,
      targetSection: 'materials',
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast(`Material request for ${newReq.materialName} sent to Manager!`);
  };

  const updateMaterialRequestStatus = (id: string, status: MaterialRequestStatus, remarks?: string) => {
    setMaterialRequests((prev) =>
      prev.map((mr) => (mr.id === id ? { ...mr, status, managerRemarks: remarks || mr.managerRemarks } : mr))
    );
    showToast(`Material request status updated to: ${status}`);
  };

  // Equipment
  const addEquipment = (e: Omit<Equipment, 'id'>) => {
    const newEqp: Equipment = {
      ...e,
      id: `EQP-${String(equipment.length + 1).padStart(3, '0')}`,
    };
    setEquipment((prev) => [newEqp, ...prev]);
    showToast(`Equipment ${newEqp.name} registered!`);
  };

  const logEquipmentUsage = (log: Omit<EquipmentUsageLog, 'id'>) => {
    const newLog: EquipmentUsageLog = {
      ...log,
      id: `EUL-${Date.now()}`,
    };
    setEquipmentUsageLogs((prev) => [newLog, ...prev]);
    showToast(`Usage logged for ${log.equipmentName}`);
  };

  // Issues
  const addIssue = (i: Omit<SiteIssue, 'id' | 'date'>) => {
    const newIssue: SiteIssue = {
      ...i,
      id: `ISS-${String(issues.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
    };
    setIssues((prev) => [newIssue, ...prev]);

    const notif: InAppNotification = {
      id: `NOTIF-${Date.now()}`,
      title: `New Issue Reported (${newIssue.severity})`,
      message: `${newIssue.title} at ${newIssue.siteName}`,
      type: 'issue',
      timestamp: 'Just now',
      read: false,
      targetId: newIssue.id,
      targetSection: 'issues',
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast(`Issue ${newIssue.id} reported!`);
  };

  const updateIssueStatus = (id: string, status: IssueStatus, resolution?: string) => {
    const now = new Date().toISOString().split('T')[0];
    setIssues((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status,
              resolution: resolution || i.resolution,
              resolvedDate: status === 'Resolved' || status === 'Closed' ? now : i.resolvedDate,
            }
          : i
      )
    );
    showToast(`Issue status changed to ${status}`);
  };

  // Safety
  const addSafetyObservation = (s: Omit<SafetyObservation, 'id' | 'date'>) => {
    const newObs: SafetyObservation = {
      ...s,
      id: `SFT-${String(safetyObservations.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
    };
    setSafetyObservations((prev) => [newObs, ...prev]);

    const notif: InAppNotification = {
      id: `NOTIF-${Date.now()}`,
      title: `Safety Observation (${newObs.riskLevel} Risk)`,
      message: `${newObs.observation.slice(0, 70)}...`,
      type: 'safety',
      timestamp: 'Just now',
      read: false,
      targetId: newObs.id,
      targetSection: 'safety',
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast(`Safety observation recorded!`);
  };

  const updateSafetyStatus = (id: string, status: SafetyStatus, remarks?: string) => {
    setSafetyObservations((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, remarks: remarks || s.remarks } : s))
    );
    showToast(`Safety observation status updated to ${status}`);
  };

  // Photos
  const addPhoto = (p: Omit<SitePhoto, 'id' | 'dateTime'> & { takenAt?: string; uploadedAt?: string; dateTime?: string }) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const taken = p.takenAt || p.dateTime || now;
    const uploaded = p.uploadedAt || now;
    const newPhoto: SitePhoto = {
      ...p,
      id: `PHT-${String(photos.length + 1).padStart(3, '0')}`,
      dateTime: taken,
      takenAt: taken,
      uploadedAt: uploaded,
    };
    setPhotos((prev) => [newPhoto, ...prev]);
    showToast(`Photo uploaded (Taken: ${taken}, Uploaded: ${uploaded})!`);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('Notifications cleared', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        activeSection,
        setActiveSection,
        login,
        logout,
        switchRole,
        projects,
        addProject,
        updateProject,
        deleteProject,
        sites,
        addSite,
        updateSite,
        dailyReports,
        addDailyReport,
        updateDailyReport,
        approveReport,
        requestReportRevision,
        selectedReportForReview,
        setSelectedReportForReview,
        selectedReportForEdit,
        setSelectedReportForEdit,
        workers,
        addWorker,
        updateWorkerAttendance,
        materials,
        addMaterial,
        updateMaterial,
        materialRequests,
        addMaterialRequest,
        updateMaterialRequestStatus,
        equipment,
        addEquipment,
        equipmentUsageLogs,
        logEquipmentUsage,
        issues,
        addIssue,
        updateIssueStatus,
        safetyObservations,
        addSafetyObservation,
        updateSafetyStatus,
        photos,
        addPhoto,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        toasts,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
