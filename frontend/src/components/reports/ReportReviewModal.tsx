import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { DailyReport } from '../../types';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, MessageSquare, Clock, ArrowRight, Camera } from 'lucide-react';
import { siteImagesMap } from '../../data/mockData';

interface ReportReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: DailyReport | null;
}

export const ReportReviewModal: React.FC<ReportReviewModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  const { currentUser, approveReport, requestReportRevision, setSelectedReportForEdit, setActiveSection } = useApp();
  const [managerComment, setManagerComment] = useState('');
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);

  if (!report) return null;

  const isManagerOrAdmin = currentUser.role === 'project_manager' || currentUser.role === 'admin';

  const [commentError, setCommentError] = useState('');

  const handleApprove = () => {
    approveReport(report.id, managerComment || 'Report approved. All items verified.');
    onClose();
  };

  const handleRequestRevision = () => {
    if (!managerComment.trim()) {
      setCommentError('Please specify what revisions are required in the comment box below.');
      return;
    }
    setCommentError('');
    requestReportRevision(report.id, managerComment);
    onClose();
  };

  const handleEditAsEngineer = () => {
    setSelectedReportForEdit(report);
    setActiveSection('daily-reports-create');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Review Daily Report: ${report.id}`}
      maxWidth="lg"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Header summary */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f8fafc',
            padding: '1rem',
            borderRadius: '8px',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              {report.siteName}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
              Project: {report.projectName} | Date: {report.date} | Shift: {report.workingHours}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Reported by: <strong>{report.engineerName}</strong>
            </span>
            <span
              className={`badge ${
                report.status === 'Approved'
                  ? 'badge-success'
                  : report.status === 'Submitted'
                  ? 'badge-warning'
                  : report.status === 'Revision Required'
                  ? 'badge-danger'
                  : 'badge-neutral'
              }`}
            >
              {report.status}
            </span>
          </div>
        </div>

        {/* Worker attendance counters */}
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: '#334155' }}>
            Worker Attendance Roll
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem' }}>
              Total: <strong>{report.workersSummary?.total || 0}</strong>
            </div>
            <div style={{ background: '#ecfdf5', color: '#065f46', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem' }}>
              Present: <strong>{report.workersSummary?.present || 0}</strong>
            </div>
            <div style={{ background: '#fef2f2', color: '#991b1b', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem' }}>
              Absent: <strong>{report.workersSummary?.absent || 0}</strong>
            </div>
            <div style={{ background: '#fffbeb', color: '#92400e', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem' }}>
              Half-Day: <strong>{report.workersSummary?.halfDay || 0}</strong>
            </div>
            <div style={{ background: '#eff6ff', color: '#1e40af', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem' }}>
              Leave: <strong>{report.workersSummary?.leave || 0}</strong>
            </div>
          </div>
        </div>

        {/* Work Progress table */}
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: '#334155' }}>
            Work Progress Log
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Planned</th>
                <th>Completed</th>
                <th>Progress %</th>
              </tr>
            </thead>
            <tbody>
              {report.workProgress.map((wp, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{wp.category}</td>
                  <td>{wp.description}</td>
                  <td>{wp.plannedQty} {wp.unit}</td>
                  <td>{wp.completedQty} {wp.unit}</td>
                  <td>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#f97316' }}>{wp.progressPercentage}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Observations & Problems */}
        <div className="form-grid">
          <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Site Observations</div>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{report.siteObservations || 'None noted'}</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Problems Encountered</div>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{report.problemsEncountered || 'None noted'}</p>
          </div>
        </div>

        {/* Attached Site Photographs */}
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Camera size={16} color="#f97316" />
            <span>Attached Shift Photographs ({report.photographs?.length || 0})</span>
          </div>
          {report.photographs && report.photographs.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
              {report.photographs.map((photoRef, idx) => {
                const photoSrc = siteImagesMap[photoRef] || photoRef;
                return (
                  <div
                    key={idx}
                    onClick={() => setPreviewPhotoUrl(photoSrc)}
                    style={{
                      position: 'relative',
                      height: '95px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: '1px solid var(--border)',
                      backgroundColor: '#0f172a',
                    }}
                    title="Click to view full photo"
                  >
                    <img
                      src={photoSrc}
                      alt={`Site Photo ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.src = siteImagesMap.default; }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '2px 6px',
                        background: 'rgba(0,0,0,0.65)',
                        color: '#fff',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                      }}
                    >
                      Photo #{idx + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: '6px', fontSize: '0.8rem', color: '#64748b' }}>
              No photographs attached for this shift.
            </div>
          )}
        </div>

        {/* Review History Audit Trail (Section 15: "Maintain the review history") */}
        {report.reviewHistory && report.reviewHistory.length > 0 && (
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: '#334155' }}>
              Review Audit History
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {report.reviewHistory.map((rev) => (
                <div
                  key={rev.id}
                  style={{
                    background: '#f8fafc',
                    borderLeft: `4px solid ${rev.action === 'Approved' ? '#10b981' : '#f59e0b'}`,
                    padding: '0.65rem 0.85rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>{rev.reviewerName} ({rev.action})</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{rev.date}</span>
                  </div>
                  <div style={{ color: '#475569', marginTop: '3px' }}>{rev.comment}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manager Review Input Pane (Section 15) */}
        {isManagerOrAdmin && report.status !== 'Approved' && (
          <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c2410c', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={16} />
              <span>Project Manager Review & Directive</span>
            </div>
            {commentError && (
              <div style={{ color: '#dc2626', fontSize: '0.8rem', background: '#fef2f2', padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid #fecaca', marginBottom: '0.5rem' }}>
                {commentError}
              </div>
            )}
            <textarea
              className="form-textarea"
              placeholder="Enter your inspection comments, approval notes, or required revisions..."
              value={managerComment}
              onChange={(e) => {
                setManagerComment(e.target.value);
                if (commentError) setCommentError('');
              }}
              rows={3}
            />
          </div>
        )}

        {/* Modal Footer Workflow Actions */}
        <div className="modal-footer" style={{ margin: '0 -1.5rem -1.5rem -1.5rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>

          {/* If Engineer and Revision Required, allow editing */}
          {!isManagerOrAdmin && (report.status === 'Draft' || report.status === 'Revision Required') && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleEditAsEngineer}
            >
              <span>Edit & Resubmit Report</span>
              <ArrowRight size={14} />
            </button>
          )}

          {/* If Manager, show Approve and Request Revision buttons */}
          {isManagerOrAdmin && report.status !== 'Approved' && (
            <>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleRequestRevision}
              >
                <AlertCircle size={15} />
                <span>Request Revision</span>
              </button>

              <button
                type="button"
                className="btn btn-success"
                onClick={handleApprove}
              >
                <CheckCircle2 size={15} />
                <span>Approve Report</span>
              </button>
            </>
          )}
        </div>
      </div>

      {previewPhotoUrl && (
        <Modal
          isOpen={!!previewPhotoUrl}
          onClose={() => setPreviewPhotoUrl(null)}
          title="Attached Photograph Preview"
          maxWidth="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ borderRadius: '8px', overflow: 'hidden', maxHeight: '500px', backgroundColor: '#0f172a' }}>
              <img
                src={previewPhotoUrl}
                alt="Full Photo Preview"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#64748b', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                📸 <strong>Date & Time Taken:</strong> {report.date} (Site Shift Capture)
              </div>
              <div>
                🕒 <strong>Recorded Upload:</strong> {report.date} | Uploaded by {report.engineerName}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setPreviewPhotoUrl(null)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </Modal>
      )}
    </Modal>
  );
};
