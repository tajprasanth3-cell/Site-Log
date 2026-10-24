import {
  Project,
  ConstructionSite,
  DailyReport,
  Worker,
  Material,
  MaterialRequest,
  Equipment,
  EquipmentUsageLog,
  SiteIssue,
  SafetyObservation,
  SitePhoto,
  User,
  AttendanceStatus,
  MaterialRequestStatus,
  IssueStatus,
  SafetyStatus,
  UserRole,
} from '../types';

const rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_BASE = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      console.warn(`[API] HTTP ${res.status} on ${endpoint}:`, errBody.error || res.statusText);
      return null;
    }

    return await res.json();
  } catch (err: any) {
    console.warn(`[API] Network error connecting to ${endpoint}:`, err.message);
    return null;
  }
}

export const api = {
  // Health & Initial Bootstrap
  async checkHealth(): Promise<boolean> {
    const res = await request<{ status: string }>('/health');
    return res?.status === 'online';
  },

  async getInitialData(): Promise<any | null> {
    const res = await request<{ status: string; data: any }>('/initial-data');
    return res?.data || null;
  },

  // Auth
  async login(email: string, role?: UserRole): Promise<{ token: string; user: User } | null> {
    return await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    });
  },

  // Projects
  async getProjects(): Promise<Project[] | null> {
    return await request('/projects');
  },
  async createProject(p: Omit<Project, 'id'>): Promise<Project | null> {
    return await request('/projects', {
      method: 'POST',
      body: JSON.stringify(p),
    });
  },
  async updateProject(p: Project): Promise<Project | null> {
    return await request(`/projects/${p.id}`, {
      method: 'PUT',
      body: JSON.stringify(p),
    });
  },
  async deleteProject(id: string): Promise<boolean> {
    const res = await request(`/projects/${id}`, { method: 'DELETE' });
    return res !== null;
  },

  // Sites
  async getSites(): Promise<ConstructionSite[] | null> {
    return await request('/sites');
  },
  async createSite(s: Omit<ConstructionSite, 'id'>): Promise<ConstructionSite | null> {
    return await request('/sites', {
      method: 'POST',
      body: JSON.stringify(s),
    });
  },
  async updateSite(s: ConstructionSite): Promise<ConstructionSite | null> {
    return await request(`/sites/${s.id}`, {
      method: 'PUT',
      body: JSON.stringify(s),
    });
  },

  // Daily Reports
  async getReports(): Promise<DailyReport[] | null> {
    return await request('/reports');
  },
  async createReport(r: Omit<DailyReport, 'id' | 'createdAt' | 'updatedAt' | 'reviewHistory'>): Promise<DailyReport | null> {
    return await request('/reports', {
      method: 'POST',
      body: JSON.stringify(r),
    });
  },
  async updateReport(r: DailyReport): Promise<DailyReport | null> {
    return await request(`/reports/${r.id}`, {
      method: 'PUT',
      body: JSON.stringify(r),
    });
  },
  async approveReport(reportId: string, comment: string, reviewerName?: string, reviewerId?: string): Promise<DailyReport | null> {
    return await request(`/reports/${reportId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ comment, reviewerName, reviewerId }),
    });
  },
  async requestRevision(reportId: string, comment: string, reviewerName?: string, reviewerId?: string): Promise<DailyReport | null> {
    return await request(`/reports/${reportId}/revision`, {
      method: 'POST',
      body: JSON.stringify({ comment, reviewerName, reviewerId }),
    });
  },

  // Workers
  async getWorkers(): Promise<Worker[] | null> {
    return await request('/workers');
  },
  async createWorker(w: Omit<Worker, 'id'>): Promise<Worker | null> {
    return await request('/workers', {
      method: 'POST',
      body: JSON.stringify(w),
    });
  },
  async updateWorkerAttendance(workerId: string, status: AttendanceStatus): Promise<Worker | null> {
    return await request(`/workers/${workerId}/attendance`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Materials
  async getMaterials(): Promise<Material[] | null> {
    return await request('/materials');
  },
  async createMaterial(m: Omit<Material, 'id'>): Promise<Material | null> {
    return await request('/materials', {
      method: 'POST',
      body: JSON.stringify(m),
    });
  },
  async updateMaterial(m: Material): Promise<Material | null> {
    return await request(`/materials/${m.id}`, {
      method: 'PUT',
      body: JSON.stringify(m),
    });
  },
  async getMaterialRequests(): Promise<MaterialRequest[] | null> {
    return await request('/materials/requests/all');
  },
  async createMaterialRequest(mr: Omit<MaterialRequest, 'id' | 'createdAt' | 'status'>): Promise<MaterialRequest | null> {
    return await request('/materials/requests/new', {
      method: 'POST',
      body: JSON.stringify(mr),
    });
  },
  async updateMaterialRequestStatus(id: string, status: MaterialRequestStatus, remarks?: string): Promise<MaterialRequest | null> {
    return await request(`/materials/requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, remarks }),
    });
  },

  // Equipment
  async getEquipment(): Promise<Equipment[] | null> {
    return await request('/equipment');
  },
  async createEquipment(e: Omit<Equipment, 'id'>): Promise<Equipment | null> {
    return await request('/equipment', {
      method: 'POST',
      body: JSON.stringify(e),
    });
  },
  async logEquipmentUsage(log: Omit<EquipmentUsageLog, 'id'>): Promise<EquipmentUsageLog | null> {
    return await request('/equipment/usage/log', {
      method: 'POST',
      body: JSON.stringify(log),
    });
  },

  // Issues & Safety
  async getIssues(): Promise<SiteIssue[] | null> {
    return await request('/issues');
  },
  async createIssue(i: Omit<SiteIssue, 'id' | 'date'>): Promise<SiteIssue | null> {
    return await request('/issues', {
      method: 'POST',
      body: JSON.stringify(i),
    });
  },
  async updateIssueStatus(id: string, status: IssueStatus, resolution?: string): Promise<SiteIssue | null> {
    return await request(`/issues/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, resolution }),
    });
  },
  async getSafetyObservations(): Promise<SafetyObservation[] | null> {
    return await request('/issues/safety/all');
  },
  async createSafetyObservation(s: Omit<SafetyObservation, 'id' | 'date'>): Promise<SafetyObservation | null> {
    return await request('/issues/safety/new', {
      method: 'POST',
      body: JSON.stringify(s),
    });
  },
  async updateSafetyStatus(id: string, status: SafetyStatus, remarks?: string): Promise<SafetyObservation | null> {
    return await request(`/issues/safety/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, remarks }),
    });
  },

  // Photos
  async getPhotos(): Promise<SitePhoto[] | null> {
    return await request('/photos');
  },
  async createPhoto(p: Omit<SitePhoto, 'id' | 'dateTime'> & { takenAt?: string; uploadedAt?: string; dateTime?: string }): Promise<SitePhoto | null> {
    return await request('/photos', {
      method: 'POST',
      body: JSON.stringify(p),
    });
  },
  async deletePhoto(id: string): Promise<boolean> {
    const res = await request(`/photos/${id}`, { method: 'DELETE' });
    return res !== null;
  },

  // Users
  async getUsers(): Promise<User[] | null> {
    return await request('/users');
  },
  async createUser(u: Omit<User, 'id'>): Promise<User | null> {
    return await request('/users', {
      method: 'POST',
      body: JSON.stringify(u),
    });
  },
};
