import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { PhotoCategory } from '../../types';
import { Calendar, Clock, Upload, Camera } from 'lucide-react';
import siteAImg from '../../assets/site-a.jpg';
import siteBImg from '../../assets/site-b.jpg';
import siteCImg from '../../assets/site-c.jpg';
import siteMetroImg from '../../assets/site-metro.jpg';
import loginBgImg from '../../assets/login-bg.jpg';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({ isOpen, onClose }) => {
  const { sites, projects, currentUser, addPhoto } = useApp();

  const getNowDateTimeInput = () => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || 'PRJ-001');
  const [siteId, setSiteId] = useState(sites[0]?.id || 'SIT-001');
  const [category, setCategory] = useState<PhotoCategory>('Work Progress');
  const [description, setDescription] = useState('');
  const [takenAt, setTakenAt] = useState(getNowDateTimeInput);
  const [url, setUrl] = useState(siteAImg);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Auto-extract photo timestamp if available from device
      if (file.lastModified) {
        const d = new Date(file.lastModified);
        const pad = (n: number) => String(n).padStart(2, '0');
        const formatted = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        setTakenAt(formatted);
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selProject = projects.find((p) => p.id === projectId);
    const selSite = sites.find((s) => s.id === siteId);

    const nowUploadTimestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const formattedTaken = takenAt ? takenAt.replace('T', ' ') : nowUploadTimestamp;

    addPhoto({
      title: title || `${category} Record`,
      url,
      projectId,
      projectName: selProject?.name || 'Project',
      siteId,
      siteName: selSite?.name || 'Site',
      category,
      description,
      takenAt: formattedTaken,
      uploadedAt: nowUploadTimestamp,
      dateTime: formattedTaken,
      uploadedBy: currentUser.name,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Construction Site Photograph" maxWidth="md">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="form-group">
          <label className="form-label">
            Photo Title / Caption <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 14th Floor Slab Rebar Inspection"
            required
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Project</label>
            <select className="form-input" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Site / Work Area</label>
            <select className="form-input" value={siteId} onChange={(e) => setSiteId(e.target.value)}>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value as PhotoCategory)}
            >
              <option value="Work Progress">Work Progress</option>
              <option value="Site Overview">Site Overview</option>
              <option value="Materials">Materials</option>
              <option value="Equipment">Equipment</option>
              <option value="Safety">Safety</option>
              <option value="Issue">Issue</option>
              <option value="Completed Work">Completed Work</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Date and Time: Taken & Uploaded */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} color="#f97316" />
              <span>Date & Time Photo Was Taken</span>
            </label>
            <input
              type="datetime-local"
              className="form-input"
              value={takenAt}
              onChange={(e) => setTakenAt(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Date and Time Record Info Card */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            color: '#475569',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Camera size={15} color="#0284c7" />
            <span>
              <strong>Capture Timestamp:</strong> {takenAt.replace('T', ' ')}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={15} color="#10b981" />
            <span>
              <strong>Upload Timestamp:</strong> Auto-recorded live upon submission
            </span>
          </div>
        </div>

        {/* File Upload & Presets */}
        <div className="form-group">
          <label className="form-label">Upload Photo File or Choose Preset</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <label
              className="btn btn-sm btn-outline"
              style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Upload size={14} />
              <span>{fileName ? `File: ${fileName}` : 'Choose from Device / Camera'}</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </label>

            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>or use sample:</span>

            {[
              { label: 'Site A (Tower)', src: siteAImg },
              { label: 'Site B (Foundation)', src: siteBImg },
              { label: 'Site C (Scaffolding)', src: siteCImg },
              { label: 'Site A Staging', src: loginBgImg },
              { label: 'Metro Rail', src: siteMetroImg },
            ].map((preset) => (
              <button
                type="button"
                key={preset.label}
                onClick={() => {
                  setUrl(preset.src);
                  setFileName(null);
                }}
                className="btn btn-sm btn-outline"
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.5rem',
                  borderColor: url === preset.src ? 'var(--primary)' : undefined,
                  backgroundColor: url === preset.src ? 'rgba(249, 115, 22, 0.1)' : undefined,
                  fontWeight: url === preset.src ? 700 : 500,
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description & Observations</label>
          <textarea
            className="form-textarea"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Structural notes, inspection tags, engineer comments..."
          />
        </div>

        {url && (
          <div style={{ borderRadius: '8px', overflow: 'hidden', height: '140px', background: '#0f172a' }}>
            <img src={url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div className="modal-footer" style={{ margin: '0 -1.5rem -1.5rem -1.5rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Upload Photograph
          </button>
        </div>
      </form>
    </Modal>
  );
};
