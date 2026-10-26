import React from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Phone, MapPin } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, sites } = useApp();

  return (
    <div
      className="page-content profile-page-content"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '2rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Centered Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', width: '100%' }}>
          <h1 className="page-title" style={{ textAlign: 'center', fontSize: '1.75rem' }}>
            User Profile
          </h1>
          <p className="page-subtitle" style={{ textAlign: 'center', marginTop: '0.4rem' }}>
            Personal account credentials, contact info, and site assignments
          </p>
        </div>

        {/* Centered Profile Card */}
        <div
          className="card"
          style={{
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
          }}
        >
          {/* User Avatar & Identity Header - Clean & Centered, No Colour Banner */}
          <div
            style={{
              padding: '2.5rem 2rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #e2e8f0',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                  backgroundColor: '#ffffff',
                }}
              />
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              {currentUser.name}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.45rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span
                className="badge badge-neutral"
                style={{
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.35rem 0.75rem',
                  letterSpacing: '0.04em',
                }}
              >
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Contact & Assignment Details */}
          <div className="card-body" style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Email Address */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1rem',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #f1f5f9',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  flexShrink: 0,
                }}
              >
                <Mail size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Email Address</div>
                <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#0f172a', marginTop: '2px', wordBreak: 'break-all' }}>
                  {currentUser.email}
                </div>
              </div>
            </div>

            {/* Mobile Number */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1rem',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #f1f5f9',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  flexShrink: 0,
                }}
              >
                <Phone size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Mobile Number</div>
                <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#0f172a', marginTop: '2px' }}>
                  {currentUser.phone || '+91 98765 43210'}
                </div>
              </div>
            </div>

            {/* Assigned Sites */}
            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #f1f5f9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <MapPin size={16} color="#64748b" />
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Assigned Active Work Sites
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {currentUser.assignedSiteIds && currentUser.assignedSiteIds.length > 0 ? (
                  currentUser.assignedSiteIds.map((siteId) => {
                    const s = sites.find((x) => x.id === siteId);
                    return (
                      <span
                        key={siteId}
                        className="badge badge-neutral"
                        style={{
                          padding: '0.4rem 0.75rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          borderRadius: '8px',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        {s?.name || siteId}
                      </span>
                    );
                  })
                ) : (
                  <span
                    className="badge badge-neutral"
                    style={{
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    All Operational Work Sites
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
