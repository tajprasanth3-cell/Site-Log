import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Camera, Eye, Calendar, MapPin, Clock } from 'lucide-react';
import { SitePhoto, PhotoCategory } from '../../types';
import { PhotoUploadModal } from './PhotoUploadModal';
import { Modal } from '../common/Modal';
import { siteImagesMap } from '../../data/mockData';

export const PhotosView: React.FC = () => {
  const { photos, sites, projects } = useApp();
  const [projectFilter, setProjectFilter] = useState('All');
  const [siteFilter, setSiteFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [viewingPhoto, setViewingPhoto] = useState<SitePhoto | null>(null);

  const filteredPhotos = photos.filter((p) => {
    const matchesProj = projectFilter === 'All' || p.projectId === projectFilter;
    const matchesSite = siteFilter === 'All' || p.siteId === siteFilter;
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesProj && matchesSite && matchesCat;
  });

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Site Photographs</h1>
          <p className="page-subtitle">View and manage photo records across construction sites and work progress</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsUploadOpen(true)}>
          <Plus size={16} />
          <span>Upload Photo</span>
        </button>
      </div>

      {/* Filter Bar (Screenshot 10) */}
      <div className="filter-bar">
        <div className="filter-group">
          <select
            className="filter-select"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="All">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
          >
            <option value="All">All Sites</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Site Overview">Site Overview</option>
            <option value="Work Progress">Work Progress</option>
            <option value="Materials">Materials</option>
            <option value="Equipment">Equipment</option>
            <option value="Safety">Safety</option>
            <option value="Issue">Issue</option>
            <option value="Completed Work">Completed Work</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          Showing <strong>{filteredPhotos.length}</strong> photo records
        </div>
      </div>

      {/* Photos Grid */}
      {filteredPhotos.length === 0 ? (
        <div
          style={{
            background: '#ffffff',
            padding: '3rem',
            textAlign: 'center',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            color: '#94a3b8',
          }}
        >
          <Camera size={36} style={{ margin: '0 auto 0.5rem', color: '#cbd5e1' }} />
          <div>No photos found for the selected filter combination.</div>
        </div>
      ) : (
        <div className="photos-grid">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="photo-card"
              onClick={() => setViewingPhoto(photo)}
              style={{ cursor: 'pointer' }}
            >
              <div className="photo-img-wrapper" style={{ backgroundColor: '#0f172a' }}>
                <img
                  src={siteImagesMap[photo.id] || photo.url}
                  alt={photo.title}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = siteImagesMap[photo.id] || siteImagesMap.default; }}
                />
                <span className="photo-category-tag">{photo.category}</span>
              </div>
              <div className="photo-meta">
                <div className="photo-title">{photo.title}</div>
                <div className="photo-desc">{photo.description}</div>
                <div className="photo-submeta" style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                      <MapPin size={11} color="#f97316" />
                      {photo.siteName}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.72rem', color: '#64748b' }}>
                    <span title="Date and time photo was taken" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Camera size={11} color="#0284c7" />
                      Taken: {photo.takenAt || photo.dateTime}
                    </span>
                    <span title="Date and time photo was uploaded" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={11} color="#10b981" />
                      Uploaded: {photo.uploadedAt || photo.dateTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isUploadOpen && (
        <PhotoUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
      )}

      {/* Photo Lightbox / Detail Modal */}
      {viewingPhoto && (
        <Modal
          isOpen={!!viewingPhoto}
          onClose={() => setViewingPhoto(null)}
          title={viewingPhoto.title}
          maxWidth="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ borderRadius: '8px', overflow: 'hidden', maxHeight: '450px', background: '#0f172a' }}>
              <img
                src={siteImagesMap[viewingPhoto.id] || viewingPhoto.url}
                alt={viewingPhoto.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => { e.currentTarget.src = siteImagesMap[viewingPhoto.id] || siteImagesMap.default; }}
              />
            </div>

            {/* Date and Time Record Metadata Box */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '0.75rem',
                background: '#f8fafc',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '0.825rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Camera size={13} color="#0284c7" />
                  Date & Time Taken
                </div>
                <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '3px' }}>
                  {viewingPhoto.takenAt || viewingPhoto.dateTime}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} color="#10b981" />
                  Date & Time Uploaded
                </div>
                <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '3px' }}>
                  {viewingPhoto.uploadedAt || viewingPhoto.dateTime}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Uploaded By
                </div>
                <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '3px' }}>
                  {viewingPhoto.uploadedBy}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Category
                </div>
                <div style={{ marginTop: '3px' }}>
                  <span className="badge badge-info">{viewingPhoto.category}</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', fontSize: '0.85rem' }}>
              <strong>Description: </strong>
              <span style={{ color: '#334155' }}>{viewingPhoto.description}</span>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Project: <strong>{viewingPhoto.projectName}</strong> | Site: <strong>{viewingPhoto.siteName}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setViewingPhoto(null)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
