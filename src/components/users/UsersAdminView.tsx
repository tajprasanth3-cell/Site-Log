import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Users, Shield, MapPin, Mail, Phone } from 'lucide-react';
import { initialUsers } from '../../data/mockData';
import { User, UserRole } from '../../types';
import { Modal } from '../common/Modal';

export const UsersAdminView: React.FC = () => {
  const { sites, showToast } = useApp();
  const [usersList, setUsersList] = useState<User[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('site_engineer');
  const [phone, setPhone] = useState('+91 98765 00000');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `USR-${String(usersList.length + 1).padStart(3, '0')}`,
      name,
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      phone,
      assignedSiteIds: ['SIT-001'],
    };
    setUsersList([...usersList, newUser]);
    showToast(`User ${name} registered with role ${role.toUpperCase()}`);
    setIsModalOpen(false);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <span className="badge badge-danger">Admin</span>;
      case 'project_manager':
        return <span className="badge badge-warning">Project Manager</span>;
      case 'site_engineer':
      default:
        return <span className="badge badge-info">Site Engineer</span>;
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Users & Role-Based Access Control</h1>
          <p className="page-subtitle">Manage personnel accounts, system privileges, and site assignments</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Add User</span>
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name & Avatar</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Assigned Sites</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((u) => (
              <tr key={u.id}>
                <td style={{ fontWeight: 700, color: '#f97316' }}>{u.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={u.avatar}
                      alt={u.name}
                      style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ color: '#475569' }}>{u.email}</td>
                <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{u.phone || 'N/A'}</td>
                <td>{getRoleBadge(u.role)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                    {u.assignedSiteIds?.map((siteId) => {
                      const s = sites.find((x) => x.id === siteId);
                      return (
                        <span key={siteId} className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                          {s?.name || siteId}
                        </span>
                      );
                    }) || <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>All Sites</span>}
                  </div>
                </td>
                <td>
                  <span className="badge badge-success">Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create User Account" maxWidth="md">
          <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name <span className="required">*</span></label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vikram Joshi"
                required
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@sitelog.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">System Role <span className="required">*</span></label>
                <select className="form-input" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
                  <option value="site_engineer">Site Engineer</option>
                  <option value="project_manager">Project Manager</option>
                  <option value="admin">System Admin</option>
                </select>
              </div>

              <div className="form-group col-span-2">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="modal-footer" style={{ margin: '0 -1.5rem -1.5rem -1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Register User
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
