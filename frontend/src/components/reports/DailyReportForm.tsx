import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Save,
  Send,
  Eye,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Sun,
  Users,
  Briefcase,
  AlertCircle,
  Camera,
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { DailyReport, WorkProgressItem, ReportStatus } from '../../types';
import { Modal } from '../common/Modal';
import siteAImg from '../../assets/site-a.jpg';
import siteBImg from '../../assets/site-b.jpg';
import siteCImg from '../../assets/site-c.jpg';
import loginBgImg from '../../assets/login-bg.jpg';
import { siteImagesMap } from '../../data/mockData';
import { scrollToTop } from '../../utils/scroll';

export interface AttachedShiftPhoto {
  id: string;
  url: string;
  caption: string;
  category: 'Work Progress' | 'Materials' | 'Safety' | 'Completed Work' | 'Equipment';
  takenAt?: string;
  uploadedAt?: string;
}

export const DailyReportForm: React.FC = () => {
  const {
    projects,
    sites,
    currentUser,
    materials,
    equipment,
    addDailyReport,
    updateDailyReport,
    selectedReportForEdit,
    setSelectedReportForEdit,
    setActiveSection,
    addPhoto,
  } = useApp();

  const editMode = !!selectedReportForEdit;

  React.useEffect(() => {
    scrollToTop();
  }, []);

  // Form states
  const [projectId, setProjectId] = useState(
    selectedReportForEdit?.projectId || (projects[0]?.id || '')
  );
  const [siteId, setSiteId] = useState(
    selectedReportForEdit?.siteId || (sites[0]?.id || '')
  );
  const [reportDate, setReportDate] = useState(
    selectedReportForEdit?.date || new Date().toISOString().split('T')[0]
  );
  const [engineerName, setEngineerName] = useState(
    selectedReportForEdit?.engineerName || currentUser.name
  );
  const [workingHours, setWorkingHours] = useState(
    selectedReportForEdit?.workingHours || '08:00 - 17:00'
  );
  const [weatherCondition, setWeatherCondition] = useState<
    'Sunny' | 'Overcast' | 'Rainy' | 'Windy' | 'Extreme Heat'
  >(selectedReportForEdit?.weatherCondition || 'Sunny');

  // Workers
  const [totalWorkers, setTotalWorkers] = useState<number>(
    selectedReportForEdit?.workersSummary.total || 30
  );
  const [presentWorkers, setPresentWorkers] = useState<number>(
    selectedReportForEdit?.workersSummary.present || 25
  );
  const [absentWorkers, setAbsentWorkers] = useState<number>(
    selectedReportForEdit?.workersSummary.absent || 3
  );
  const [halfDayWorkers, setHalfDayWorkers] = useState<number>(
    selectedReportForEdit?.workersSummary.halfDay || 1
  );
  const [leaveWorkers, setLeaveWorkers] = useState<number>(
    selectedReportForEdit?.workersSummary.leave || 1
  );

  // Work Progress Dynamic Rows
  const [workProgressRows, setWorkProgressRows] = useState<WorkProgressItem[]>(
    selectedReportForEdit?.workProgress && selectedReportForEdit.workProgress.length > 0
      ? selectedReportForEdit.workProgress
      : [
          {
            id: 'WP-ROW-1',
            category: 'Concrete Work',
            description: 'Foundation slab & column reinforcement casting',
            plannedQty: 100,
            completedQty: 64,
            unit: 'm³',
            progressPercentage: 64,
          },
        ]
  );

  // Materials Used in shift
  const [materialsUsed, setMaterialsUsed] = useState(
    selectedReportForEdit?.materialsUsed || [
      { materialId: 'MAT-001', materialName: 'Cement (OPC 53 Grade)', quantityUsed: 40, unit: 'bags' },
      { materialId: 'MAT-002', materialName: 'TMT Reinforcement Steel', quantityUsed: 15, unit: 'MT' },
    ]
  );

  // Equipment Used in shift
  const [equipmentUsed, setEquipmentUsed] = useState(
    selectedReportForEdit?.equipmentUsed || [
      { equipmentId: 'EQP-001', equipmentName: 'Tower Crane 50m Boom', hoursUsed: 7.5, purpose: 'Lifting rebar bundles & formwork shuttering' },
    ]
  );

  // Observations
  const [siteObservations, setSiteObservations] = useState(
    selectedReportForEdit?.siteObservations || 'Level 14 shuttering alignment verified. Concrete pour prepared.'
  );
  const [problemsEncountered, setProblemsEncountered] = useState(
    selectedReportForEdit?.problemsEncountered || 'None. Mild rain shower for 20 mins, resumed work immediately.'
  );
  const [safetyObservations, setSafetyObservations] = useState(
    selectedReportForEdit?.safetyObservations || 'All workers equipped with hard hats, reflective vests, and safety boots.'
  );
  const [generalRemarks, setGeneralRemarks] = useState(
    selectedReportForEdit?.generalRemarks || 'Work proceeding as per weekly target.'
  );

  // Attached Shift Photographs State
  const [attachedPhotos, setAttachedPhotos] = useState<AttachedShiftPhoto[]>(() => {
    if (selectedReportForEdit?.photographs && selectedReportForEdit.photographs.length > 0) {
      return selectedReportForEdit.photographs.map((p, idx) => ({
        id: `PHT-ATTACH-${idx + 1}-${Date.now()}`,
        url: siteImagesMap[p] || p,
        caption: `Shift Inspection Record #${idx + 1}`,
        category: idx === 0 ? 'Work Progress' : idx === 1 ? 'Materials' : 'Safety',
      }));
    }
    return [
      {
        id: 'PHT-ATTACH-1',
        url: siteAImg,
        caption: 'Site A - Slab Casting Progress',
        category: 'Work Progress',
        takenAt: '2026-10-19 10:45',
        uploadedAt: '2026-10-19 11:30',
      },
      {
        id: 'PHT-ATTACH-2',
        url: loginBgImg,
        caption: 'Site A - Material Stockpile Inspection',
        category: 'Materials',
        takenAt: '2026-10-19 08:30',
        uploadedAt: '2026-10-19 09:00',
      },
    ];
  });

  const [isAddPhotoModalOpen, setIsAddPhotoModalOpen] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>(siteAImg);
  const [newPhotoCaption, setNewPhotoCaption] = useState<string>('');
  const [newPhotoCategory, setNewPhotoCategory] = useState<
    'Work Progress' | 'Materials' | 'Safety' | 'Completed Work' | 'Equipment'
  >('Work Progress');
  const [newPhotoTakenAt, setNewPhotoTakenAt] = useState<string>(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });

  const handleAddShiftPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;

    const uploadTimestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const takenFormatted = newPhotoTakenAt ? newPhotoTakenAt.replace('T', ' ') : uploadTimestamp;

    const newPhoto: AttachedShiftPhoto = {
      id: `PHT-ATTACH-${Date.now()}`,
      url: newPhotoUrl,
      caption: newPhotoCaption.trim() || `${newPhotoCategory} Record`,
      category: newPhotoCategory,
      takenAt: takenFormatted,
      uploadedAt: uploadTimestamp,
    };

    setAttachedPhotos((prev) => [...prev, newPhoto]);

    // Also add to global photos collection so it appears in the gallery
    if (addPhoto) {
      const selProject = projects.find((p) => p.id === projectId);
      const selSite = sites.find((s) => s.id === siteId);
      addPhoto({
        title: newPhoto.caption,
        url: newPhoto.url,
        projectId: projectId || 'PRJ-001',
        projectName: selProject?.name || 'Project',
        siteId: siteId || 'SIT-001',
        siteName: selSite?.name || 'Site',
        category: newPhoto.category,
        description: `Attached to daily report on ${reportDate}.`,
        takenAt: takenFormatted,
        uploadedAt: uploadTimestamp,
        uploadedBy: engineerName || currentUser.name,
      });
    }

    // Reset form
    setNewPhotoCaption('');
    setNewPhotoUrl(siteAImg);
    setIsAddPhotoModalOpen(false);
  };

  const handleRemoveShiftPhoto = (id: string) => {
    setAttachedPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.lastModified) {
        const d = new Date(file.lastModified);
        const pad = (n: number) => String(n).padStart(2, '0');
        setNewPhotoTakenAt(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`);
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Preview Modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Handlers for work progress dynamic rows
  const handleAddProgressRow = () => {
    const newRow: WorkProgressItem = {
      id: `WP-ROW-${Date.now()}`,
      category: 'Masonry Work',
      description: '',
      plannedQty: 100,
      completedQty: 0,
      unit: 'm²',
      progressPercentage: 0,
    };
    setWorkProgressRows([...workProgressRows, newRow]);
  };

  const handleUpdateProgressRow = (
    index: number,
    field: keyof WorkProgressItem,
    value: string | number
  ) => {
    const updated = [...workProgressRows];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-calculate progress percentage if planned and completed qty change
    if (field === 'plannedQty' || field === 'completedQty') {
      const planned = Number(field === 'plannedQty' ? value : updated[index].plannedQty) || 1;
      const completed = Number(field === 'completedQty' ? value : updated[index].completedQty) || 0;
      const pct = Math.min(100, Math.round((completed / planned) * 100));
      updated[index].progressPercentage = isNaN(pct) ? 0 : pct;
    }

    setWorkProgressRows(updated);
  };

  const handleRemoveProgressRow = (index: number) => {
    if (workProgressRows.length > 1) {
      setWorkProgressRows(workProgressRows.filter((_, i) => i !== index));
    }
  };

  // Form submission: Draft vs Submit
  const handleSaveReport = (status: ReportStatus) => {
    const selProject = projects.find((p) => p.id === projectId);
    const selSite = sites.find((s) => s.id === siteId);

    const reportPayload = {
      siteId,
      siteName: selSite?.name || 'Selected Site',
      projectId,
      projectName: selProject?.name || 'Selected Project',
      date: reportDate,
      engineerId: currentUser.id,
      engineerName,
      workingHours,
      weatherCondition,
      status,
      workersSummary: {
        total: Number(totalWorkers),
        present: Number(presentWorkers),
        absent: Number(absentWorkers),
        halfDay: Number(halfDayWorkers),
        leave: Number(leaveWorkers),
      },
      workProgress: workProgressRows,
      materialsUsed,
      equipmentUsed,
      siteObservations,
      problemsEncountered,
      safetyObservations,
      generalRemarks,
      photographs: attachedPhotos.map((p) => p.url),
    };

    if (editMode && selectedReportForEdit) {
      updateDailyReport({
        ...reportPayload,
        id: selectedReportForEdit.id,
        reviewHistory: selectedReportForEdit.reviewHistory,
        createdAt: selectedReportForEdit.createdAt,
        updatedAt: new Date().toISOString(),
      });
      setSelectedReportForEdit(null);
    } else {
      addDailyReport(reportPayload);
    }

    setActiveSection('daily-reports');
  };

  return (
    <div className="page-content daily-report-form">
      {/* Top Header Matching Screenshot 5 */}
      <div className="page-header">
        <div>
          <button
            className="btn btn-sm btn-outline"
            style={{ marginBottom: '0.5rem' }}
            onClick={() => {
              setSelectedReportForEdit(null);
              setActiveSection('daily-reports');
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Daily Reports</span>
          </button>
          <h1 className="page-title">
            {editMode ? `Edit Daily Report: ${selectedReportForEdit.id}` : 'Daily Site Report'}
          </h1>
          <p className="page-subtitle">Create and manage daily site operations reports</p>
        </div>

        {/* Top Right Workflow Actions (Screenshot 5) */}
        <div className="page-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => handleSaveReport('Draft')}
          >
            <Save size={16} />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setShowPreviewModal(true)}
          >
            <Eye size={16} />
            <span>Preview</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleSaveReport('Submitted')}
          >
            <Send size={16} />
            <span>Submit Report</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Section 1: Basic Information */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Calendar size={18} color="#f97316" />
              <span>1. Basic Information</span>
            </div>
          </div>
          <div className="card-body">
            <div className="form-grid grid-3">
              <div className="form-group">
                <label className="form-label">Project <span className="required">*</span></label>
                <select
                  className="form-input"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Site / Work Area <span className="required">*</span></label>
                <select
                  className="form-input"
                  value={siteId}
                  onChange={(e) => setSiteId(e.target.value)}
                >
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Report Date <span className="required">*</span></label>
                <input
                  type="date"
                  className="form-input"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Site Engineer</label>
                <input
                  type="text"
                  className="form-input"
                  value={engineerName}
                  onChange={(e) => setEngineerName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Working Hours <span className="required">*</span></label>
                <div style={{ position: 'relative' }}>
                  <Clock
                    size={16}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    placeholder="08:00 - 17:00"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Weather / Working Condition</label>
                <div style={{ position: 'relative' }}>
                  <Sun
                    size={16}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#f59e0b' }}
                  />
                  <select
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                    value={weatherCondition}
                    onChange={(e) => setWeatherCondition(e.target.value as any)}
                  >
                    <option value="Sunny">Sunny (Clear Skies)</option>
                    <option value="Overcast">Overcast (Cloudy)</option>
                    <option value="Rainy">Rainy (Intermittent showers)</option>
                    <option value="Windy">Windy (High gust wind)</option>
                    <option value="Extreme Heat">Extreme Heat (&gt;38°C)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Workers Attendance Counters - 5 Distinct Colored & Shaded Boxes */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Users size={18} color="#2563eb" />
              <span>2. Workers Attendance</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Live synchronized shift attendance tally
            </span>
          </div>
          <div className="card-body">
            <div
              className="report-attendance-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.65rem',
              }}
            >
              {/* Box 1: Total Workers - Professional Corporate Blue */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderLeft: '3px solid #3b82f6',
                  borderRadius: '6px',
                  boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
                  padding: '0.5rem 0.65rem',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Total Roster
                  </span>
                  <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.6rem', padding: '1px 5px', borderRadius: '3px', fontWeight: 600, border: '1px solid #e2e8f0' }}>
                    Muster
                  </span>
                </div>
                <input
                  type="number"
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0.15rem 0.45rem',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    color: '#0f172a',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    outline: 'none',
                  }}
                  value={totalWorkers}
                  onChange={(e) => setTotalWorkers(Number(e.target.value))}
                />
                <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.25rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Registered workforce
                </div>
              </div>

              {/* Box 2: Present - Professional Emerald Green */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderLeft: '3px solid #10b981',
                  borderRadius: '6px',
                  boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
                  padding: '0.5rem 0.65rem',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Present
                  </span>
                  <span style={{ background: '#ecfdf5', color: '#047857', fontSize: '0.6rem', padding: '1px 5px', borderRadius: '3px', fontWeight: 600, border: '1px solid #d1fae5' }}>
                    On Site
                  </span>
                </div>
                <input
                  type="number"
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0.15rem 0.45rem',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    color: '#047857',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    outline: 'none',
                  }}
                  value={presentWorkers}
                  onChange={(e) => setPresentWorkers(Number(e.target.value))}
                />
                <div style={{ fontSize: '0.65rem', color: '#059669', marginTop: '0.25rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Active on shift today
                </div>
              </div>

              {/* Box 3: Absent - Professional Muted Crimson */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderLeft: '3px solid #ef4444',
                  borderRadius: '6px',
                  boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
                  padding: '0.5rem 0.65rem',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Absent
                  </span>
                  <span style={{ background: '#fef2f2', color: '#b91c1c', fontSize: '0.6rem', padding: '1px 5px', borderRadius: '3px', fontWeight: 600, border: '1px solid #fee2e2' }}>
                    Missing
                  </span>
                </div>
                <input
                  type="number"
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0.15rem 0.45rem',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    color: '#b91c1c',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    outline: 'none',
                  }}
                  value={absentWorkers}
                  onChange={(e) => setAbsentWorkers(Number(e.target.value))}
                />
                <div style={{ fontSize: '0.65rem', color: '#dc2626', marginTop: '0.25rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Unreported absences
                </div>
              </div>

              {/* Box 4: Half-Day - Professional Amber Gold */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderLeft: '3px solid #f59e0b',
                  borderRadius: '6px',
                  boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
                  padding: '0.5rem 0.65rem',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Half-Day
                  </span>
                  <span style={{ background: '#fffbeb', color: '#b45309', fontSize: '0.6rem', padding: '1px 5px', borderRadius: '3px', fontWeight: 600, border: '1px solid #fef3c7' }}>
                    4h Shift
                  </span>
                </div>
                <input
                  type="number"
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0.15rem 0.45rem',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    color: '#b45309',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    outline: 'none',
                  }}
                  value={halfDayWorkers}
                  onChange={(e) => setHalfDayWorkers(Number(e.target.value))}
                />
                <div style={{ fontSize: '0.65rem', color: '#d97706', marginTop: '0.25rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Partial shift duty
                </div>
              </div>

              {/* Box 5: On Leave - Professional Slate Indigo */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderLeft: '3px solid #6366f1',
                  borderRadius: '6px',
                  boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
                  padding: '0.5rem 0.65rem',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    On Leave
                  </span>
                  <span style={{ background: '#f5f3ff', color: '#6d28d9', fontSize: '0.6rem', padding: '1px 5px', borderRadius: '3px', fontWeight: 600, border: '1px solid #ede9fe' }}>
                    Approved
                  </span>
                </div>
                <input
                  type="number"
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0.15rem 0.45rem',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    color: '#4338ca',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    outline: 'none',
                  }}
                  value={leaveWorkers}
                  onChange={(e) => setLeaveWorkers(Number(e.target.value))}
                />
                <div style={{ fontSize: '0.65rem', color: '#6366f1', marginTop: '0.25rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Sanctioned leaves
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Work Progress Dynamic Table (Screenshot 5 & PDF Section 7) */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Briefcase size={18} color="#10b981" />
              <span>3. Work Progress Tracking</span>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={handleAddProgressRow}
            >
              <Plus size={14} />
              <span>Add Row</span>
            </button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-container" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Work Category</th>
                    <th>Description</th>
                    <th style={{ width: '110px' }}>Planned Qty</th>
                    <th style={{ width: '110px' }}>Completed Qty</th>
                    <th style={{ width: '80px' }}>Unit</th>
                    <th style={{ width: '100px' }}>Progress %</th>
                    <th style={{ width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {workProgressRows.map((row, index) => (
                    <tr key={row.id}>
                      <td>
                        <select
                          className="form-input"
                          style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', minWidth: '150px' }}
                          value={row.category}
                          onChange={(e) => handleUpdateProgressRow(index, 'category', e.target.value)}
                        >
                          <option value="Concrete Work">Concrete Work</option>
                          <option value="Masonry Work">Masonry Work</option>
                          <option value="Steel Fixing">Steel Fixing</option>
                          <option value="Formwork & Shuttering">Formwork & Shuttering</option>
                          <option value="Excavation">Excavation</option>
                          <option value="Electrical Work">Electrical Work</option>
                          <option value="Plumbing Work">Plumbing Work</option>
                          <option value="Plastering & Painting">Plastering & Painting</option>
                          <option value="Tiling & Flooring">Tiling & Flooring</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', minWidth: '200px' }}
                          value={row.description}
                          placeholder="e.g. Columns casting, 14th floor"
                          onChange={(e) => handleUpdateProgressRow(index, 'description', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-input"
                          style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
                          value={row.plannedQty}
                          onChange={(e) =>
                            handleUpdateProgressRow(index, 'plannedQty', Number(e.target.value))
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-input"
                          style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
                          value={row.completedQty}
                          onChange={(e) =>
                            handleUpdateProgressRow(index, 'completedQty', Number(e.target.value))
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', width: '70px' }}
                          value={row.unit}
                          onChange={(e) => handleUpdateProgressRow(index, 'unit', e.target.value)}
                        />
                      </td>
                      <td>
                        <span style={{ alignItems: 'center', fontSize: '0.9rem', fontWeight: 800, color: '#f97316' }}>
                          {row.progressPercentage}%
                        </span>
                      </td>
                      <td>
                        {workProgressRows.length > 1 && (
                          <button
                            type="button"
                            className="btn-icon-only btn-outline"
                            style={{ color: '#ef4444' }}
                            onClick={() => handleRemoveProgressRow(index)}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 4: Site Observations & Notes */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <AlertCircle size={18} color="#d97706" />
              <span>4. Operational Observations & Safety Remarks</span>
            </div>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Site Observations (General Progress)</label>
                <textarea
                  className="form-textarea"
                  value={siteObservations}
                  onChange={(e) => setSiteObservations(e.target.value)}
                  placeholder="Record activities completed, concrete batch deliveries, surveyor levels..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Problems Encountered (Blockers / Delays)</label>
                <textarea
                  className="form-textarea"
                  value={problemsEncountered}
                  onChange={(e) => setProblemsEncountered(e.target.value)}
                  placeholder="Equipment breakdown, material delivery delays, access issues..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Safety Observations</label>
                <textarea
                  className="form-textarea"
                  value={safetyObservations}
                  onChange={(e) => setSafetyObservations(e.target.value)}
                  placeholder="PPE compliance, scaffolding barrier checks, electrical safety..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Work Planned for Next Day & General Remarks</label>
                <textarea
                  className="form-textarea"
                  value={generalRemarks}
                  onChange={(e) => setGeneralRemarks(e.target.value)}
                  placeholder="Planned pours, subcontractor mobilizations, inspection schedules..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Photographs Attachment Preview */}
        <div className="card" style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ background: '#fff7ed', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Camera size={20} color="#f97316" />
              </div>
              <div>
                <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b' }}>5. Photographs from Shift</span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                  Attach live site progress, material delivery, safety checks or equipment photos
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="badge badge-neutral" style={{ fontWeight: 600, padding: '4px 10px', fontSize: '0.8rem' }}>
                {attachedPhotos.length} {attachedPhotos.length === 1 ? 'Photo' : 'Photos'} Attached
              </span>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsAddPhotoModalOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} />
                <span>Add Photo from Shift</span>
              </button>
            </div>
          </div>
          <div className="card-body">
            {attachedPhotos.length === 0 ? (
              <div
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '12px',
                  padding: '2.5rem 1rem',
                  textAlign: 'center',
                  background: '#f8fafc',
                  cursor: 'pointer',
                }}
                onClick={() => setIsAddPhotoModalOpen(true)}
              >
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', color: '#f97316' }}>
                  <Camera size={26} />
                </div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: 700, color: '#1e293b' }}>No shift photos attached yet</h4>
                <p style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '0.85rem' }}>
                  Add real-time photos of work progress, delivered materials, or safety compliance
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ background: '#f97316', border: 'none', color: '#fff' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAddPhotoModalOpen(true);
                  }}
                >
                  <Plus size={16} />
                  <span>+ Add Photo from Shift</span>
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '1rem',
                }}
              >
                {attachedPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    style={{
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0',
                      background: '#ffffff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    <div style={{ position: 'relative', width: '100%', height: '140px', backgroundColor: '#0f172a' }}>
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          background: 'rgba(15, 23, 42, 0.82)',
                          backdropFilter: 'blur(4px)',
                          color: '#38bdf8',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                        }}
                      >
                        {photo.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveShiftPhoto(photo.id)}
                        title="Remove photo"
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: '#ffffff',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#dc2626';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)';
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div style={{ padding: '0.65rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: '#1e293b',
                          lineHeight: 1.3,
                          marginBottom: '0.35rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {photo.caption}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '2px', borderTop: '1px solid #f1f5f9', paddingTop: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>📸 Taken:</span>
                          <span style={{ fontWeight: 600, color: '#334155' }}>{photo.takenAt || reportDate}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>🕒 Uploaded:</span>
                          <span style={{ fontWeight: 600, color: '#334155' }}>{photo.uploadedAt || 'Current Shift'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Dashed Add More Card Tile */}
                <div
                  onClick={() => setIsAddPhotoModalOpen(true)}
                  style={{
                    minHeight: '185px',
                    borderRadius: '10px',
                    border: '2px dashed #cbd5e1',
                    background: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: '#64748b',
                    padding: '1rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#f97316';
                    e.currentTarget.style.background = '#fff7ed';
                    e.currentTarget.style.color = '#ea580c';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.color = '#64748b';
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'rgba(249, 115, 22, 0.12)',
                      color: '#f97316',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Plus size={22} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>+ Add Shift Photo</span>
                  <span style={{ fontSize: '0.72rem', textAlign: 'center', color: '#94a3b8' }}>
                    Upload file or choose site preset
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="report-bottom-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => handleSaveReport('Draft')}
          >
            <Save size={16} />
            <span>Save as Draft</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleSaveReport('Submitted')}
          >
            <Send size={16} />
            <span>Submit to Manager for Approval</span>
          </button>
        </div>
      </div>

      {/* Add Photo From Shift Modal */}
      {isAddPhotoModalOpen && (
        <Modal
          isOpen={isAddPhotoModalOpen}
          onClose={() => setIsAddPhotoModalOpen(false)}
          title="Add Photograph from Shift"
          maxWidth="md"
        >
          <form onSubmit={handleAddShiftPhoto} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="form-label" style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>
                1. Select Photo Source
              </label>

              {/* Local File Upload Button / Area */}
              <div
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  textAlign: 'center',
                  background: '#f8fafc',
                  marginBottom: '1rem',
                  position: 'relative',
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                  }}
                  id="shift-photo-file-input"
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Upload size={20} />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>
                    Click or Drag & Drop to upload from device
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Supports JPG, PNG, WEBP files
                  </span>
                </div>
              </div>

              {/* Quick Select Presets */}
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.4rem', display: 'block', color: '#475569' }}>
                Or select from Site Presets:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {[
                  { name: 'Site A', img: siteAImg, tag: 'Civil' },
                  { name: 'Site B', img: siteBImg, tag: 'Steel' },
                  { name: 'Site C', img: siteCImg, tag: 'Excavation' },
                  { name: 'Site Staging', img: loginBgImg, tag: 'Materials' },
                ].map((preset) => {
                  const isSelected = newPhotoUrl === preset.img;
                  return (
                    <div
                      key={preset.name}
                      onClick={() => {
                        setNewPhotoUrl(preset.img);
                        if (!newPhotoCaption) {
                          setNewPhotoCaption(`${preset.name} - Shift inspection`);
                        }
                      }}
                      style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: isSelected ? '2px solid #f97316' : '1px solid #e2e8f0',
                        position: 'relative',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 0 0 3px rgba(249, 115, 22, 0.2)' : 'none',
                      }}
                    >
                      <img
                        src={preset.img}
                        alt={preset.name}
                        style={{ width: '100%', height: '70px', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          padding: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          textAlign: 'center',
                          background: isSelected ? '#fff7ed' : '#f8fafc',
                          color: isSelected ? '#ea580c' : '#334155',
                        }}
                      >
                        {preset.name}
                      </div>
                      {isSelected && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            background: '#f97316',
                            color: '#fff',
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Photo Preview */}
            {newPhotoUrl && (
              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.4rem', display: 'block' }}>
                  Photo Preview
                </label>
                <div style={{ position: 'relative', height: '140px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#0f172a' }}>
                  <img src={newPhotoUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            )}

            {/* Category and Caption */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.82rem' }}>Photo Category</label>
                <select
                  className="form-select"
                  value={newPhotoCategory}
                  onChange={(e) =>
                    setNewPhotoCategory(
                      e.target.value as 'Work Progress' | 'Materials' | 'Safety' | 'Completed Work' | 'Equipment'
                    )
                  }
                >
                  <option value="Work Progress">Work Progress</option>
                  <option value="Materials">Materials & Stockpile</option>
                  <option value="Safety">Safety & Compliance</option>
                  <option value="Completed Work">Completed Work</option>
                  <option value="Equipment">Equipment & Machinery</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.82rem' }}>Photo Caption</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Slab casting grid C-4 inspection"
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                />
              </div>
            </div>

            {/* Date and Time: Taken & Auto-recorded Upload */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} color="#f97316" />
                  <span>Date & Time Photo Was Taken</span>
                </label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={newPhotoTakenAt}
                  onChange={(e) => setNewPhotoTakenAt(e.target.value)}
                  required
                />
              </div>

              <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#64748b' }}>
                <div style={{ fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} color="#10b981" />
                  Auto-recorded Upload Time:
                </div>
                <div style={{ marginTop: '2px' }}>Live system timestamp upon submit</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsAddPhotoModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.35)',
                }}
              >
                <Plus size={16} />
                <span>Attach to Shift Report</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Report Preview Modal */}
      {showPreviewModal && (
        <Modal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          title="Daily Site Report Preview"
          maxWidth="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Daily Site Report (Preview)</h2>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                Date: {reportDate} | Site: {sites.find((s) => s.id === siteId)?.name} | Engineer: {engineerName}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                Worker Attendance Summary:
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                <span>Total: <strong>{totalWorkers}</strong></span>
                <span style={{ color: '#059669' }}>Present: <strong>{presentWorkers}</strong></span>
                <span style={{ color: '#e11d48' }}>Absent: <strong>{absentWorkers}</strong></span>
                <span style={{ color: '#d97706' }}>Half-Day: <strong>{halfDayWorkers}</strong></span>
                <span style={{ color: '#0284c7' }}>On Leave: <strong>{leaveWorkers}</strong></span>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                Work Progress Items:
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Planned</th>
                      <th>Completed</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workProgressRows.map((r, i) => (
                      <tr key={i}>
                        <td>{r.category}</td>
                        <td>{r.description}</td>
                        <td>{r.plannedQty} {r.unit}</td>
                        <td>{r.completedQty} {r.unit}</td>
                        <td style={{ fontWeight: 700, color: '#f97316' }}>{r.progressPercentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Attached Photographs in Preview */}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Camera size={16} color="#f97316" />
                <span>Attached Shift Photographs ({attachedPhotos.length}):</span>
              </div>
              {attachedPhotos.length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>No photos attached</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
                  {attachedPhotos.map((photo) => (
                    <div key={photo.id} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#ffffff' }}>
                      <img src={photo.url} alt={photo.caption} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                      <div style={{ padding: '4px 6px', fontSize: '0.72rem', fontWeight: 600, color: '#1e293b' }}>
                        {photo.caption}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowPreviewModal(false)}>
                Back to Edit
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowPreviewModal(false);
                  handleSaveReport('Submitted');
                }}
              >
                Submit Now
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
