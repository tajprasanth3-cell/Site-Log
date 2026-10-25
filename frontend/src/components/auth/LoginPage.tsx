import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HardHat,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';
import { UserRole } from '../../types';
import loginBg from '../../assets/login-bg.jpg';
import { Modal } from '../common/Modal';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('ashok@sitelog.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('site_engineer');
  const [rememberMe, setRememberMe] = useState(true);
  const [loginFeedback, setLoginFeedback] = useState<string | null>(null);

  // Forgot Password Modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'verify' | 'done'>('request');
  const [verificationCode, setVerificationCode] = useState('SL-8849');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginFeedback(null);
    const success = login(email, selectedRole);
    if (!success) {
      setLoginFeedback('Login credentials could not be verified. Please select a valid demo profile.');
    }
  };

  const handleQuickDemo = (demoEmail: string, role: UserRole) => {
    setEmail(demoEmail);
    setSelectedRole(role);
    setLoginFeedback(null);
    login(demoEmail, role);
  };

  const handleOpenForgotModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setForgotEmail(email || 'ashok@sitelog.com');
    setForgotStep('request');
    setVerificationCode('SL-8849');
    setNewPassword('');
    setConfirmPassword('');
    setForgotError(null);
    setIsForgotModalOpen(true);
  };

  const handleSendRecoveryCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setForgotError('Please enter a valid email address.');
      return;
    }
    setForgotError(null);
    setForgotStep('verify');
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setForgotError('Please enter the verification code.');
      return;
    }
    if (newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match. Please verify both fields.');
      return;
    }

    setForgotError(null);
    setPassword(newPassword);
    setEmail(forgotEmail);
    setForgotStep('done');
  };

  const handleFinishReset = () => {
    setIsForgotModalOpen(false);
    setForgotStep('request');
    setLoginFeedback('Password updated! You can now sign in.');
  };

  return (
    <div className="login-wrapper">
      {/* Left Construction Hero with full fit and cover */}
      <div
        className="login-hero"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(13, 21, 39, 0.68) 0%, rgba(13, 21, 39, 0.82) 100%), url(${loginBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="brand-logo" style={{ color: '#ffffff' }}>
          <div className="brand-icon">
            <HardHat size={22} />
          </div>
          <div className="brand-title">
            <span className="brand-name" style={{ fontSize: '1.4rem' }}>Site Log</span>
            <span className="brand-sub" style={{ color: '#f97316', fontWeight: 'bold' }}>Enterprise Platform</span>
          </div>
        </div>

        <div className="login-hero-content">
          <h1 className="login-hero-title">
            Construction Site Operations & Daily Reporting Platform
          </h1>
          <p className="login-hero-sub">
            Manage your projects, sites, workers, materials, equipment and reports — all in one centralized system.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.85rem' }}>
              <ShieldCheck size={18} color="#f97316" />
              <span>Role-Based Access Control</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.85rem' }}>
              <UserCheck size={18} color="#f97316" />
              <span>Audit Trail & Approvals</span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
          Site Log Enterprise Operations Suite | v2.4 Live
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="login-form-pane">
        <div className="login-box">
          <div className="mobile-login-brand">
            <div className="brand-icon">
              <HardHat size={22} />
            </div>
            <div className="brand-title">
              <span className="brand-name">Site Log</span>
              <span className="brand-sub">Enterprise Platform</span>
            </div>
          </div>
          <h2 className="login-form-title">Welcome Back</h2>
          <p className="login-form-sub">Sign in to your Site Log account</p>

          {loginFeedback && (
            <div
              style={{
                background: loginFeedback.includes('updated') ? '#ecfdf5' : '#fef2f2',
                border: `1px solid ${loginFeedback.includes('updated') ? '#a7f3d0' : '#fecaca'}`,
                color: loginFeedback.includes('updated') ? '#065f46' : '#991b1b',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {loginFeedback.includes('updated') ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{loginFeedback}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                />
                <input
                  type="email"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '2.4rem' }}
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEmail(val);
                    const lower = val.trim().toLowerCase();
                    if (lower.includes('priya')) setSelectedRole('project_manager');
                    else if (lower.includes('admin') || lower.includes('arjun')) setSelectedRole('admin');
                    else if (lower.includes('ashok')) setSelectedRole('site_engineer');
                  }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '2.4rem', paddingRight: '2.5rem' }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#475569' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
                <button
                  type="button"
                  className="login-forgot-link"
                  onClick={handleOpenForgotModal}
                  style={{
                  background: 'none',
                  border: 'none',
                  color: '#f97316',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', fontSize: '0.95rem' }}>
              <span>Sign In</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick 1-Click Role Login Chips */}
          <div className="demo-account-pills">
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              1-Click Demo Accounts (Fast Testing)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                style={{ justifyContent: 'space-between', background: '#ffffff', textAlign: 'left' }}
                onClick={() => handleQuickDemo('ashok@sitelog.com', 'site_engineer')}
              >
                <span>👷‍♂️ <strong>Ashok</strong> (Site Engineer)</span>
                <span className="badge badge-info">Login</span>
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                style={{ justifyContent: 'space-between', background: '#ffffff', textAlign: 'left' }}
                onClick={() => handleQuickDemo('priya@sitelog.com', 'project_manager')}
              >
                <span>📋 <strong>Priya</strong> (Project Manager)</span>
                <span className="badge badge-warning">Login</span>
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                style={{ justifyContent: 'space-between', background: '#ffffff', textAlign: 'left' }}
                onClick={() => handleQuickDemo('admin@sitelog.com', 'admin')}
              >
                <span>⚙️ <strong>Arjun Mehta</strong> (Admin)</span>
                <span className="badge badge-success">Login</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <Modal
          isOpen={isForgotModalOpen}
          onClose={() => setIsForgotModalOpen(false)}
          title={
            forgotStep === 'request'
              ? 'Reset Account Password'
              : forgotStep === 'verify'
              ? 'Enter Verification Code & Set New Password'
              : 'Password Reset Complete'
          }
          maxWidth="sm"
        >
          {forgotStep === 'request' && (
            <form onSubmit={handleSendRecoveryCode} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#fff7ed', padding: '1rem', borderRadius: '8px', border: '1px solid #fed7aa' }}>
                <KeyRound size={24} color="#ea580c" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '0.8rem', color: '#9a3412', lineHeight: 1.4 }}>
                  Enter your registered work email address. We will immediately generate a secure recovery code to reset your password.
                </div>
              </div>

              {forgotError && (
                <div style={{ color: '#dc2626', fontSize: '0.8rem', background: '#fef2f2', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #fecaca' }}>
                  {forgotError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Registered Work Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="email"
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '2.4rem' }}
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. ashok@sitelog.com"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ margin: '0 -1.5rem -1.5rem -1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsForgotModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>Send Recovery Code</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}

          {forgotStep === 'verify' && (
            <form onSubmit={handleSaveNewPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.85rem 1rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065f46', fontWeight: 700, fontSize: '0.85rem' }}>
                  <CheckCircle2 size={16} />
                  <span>Recovery Token Generated</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#047857', marginTop: '0.25rem' }}>
                  A verification token was issued for <strong>{forgotEmail}</strong>. (Auto-filled below: <code>SL-8849</code>)
                </div>
              </div>

              {forgotError && (
                <div style={{ color: '#dc2626', fontSize: '0.8rem', background: '#fef2f2', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #fecaca' }}>
                  {forgotError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Recovery Verification Code</label>
                <input
                  type="text"
                  className="form-input"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="SL-8849"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password (min 6 characters)</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '2.4rem', paddingRight: '2.5rem' }}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter strong new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0,
                    }}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '2.4rem' }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ margin: '0 -1.5rem -1.5rem -1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setForgotStep('request')}>
                  Back
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>Update Password</span>
                  <Check size={14} />
                </button>
              </div>
            </form>
          )}

          {forgotStep === 'done' && (
            <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#ecfdf5',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle2 size={32} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  Password Reset Successfully!
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem', lineHeight: 1.5 }}>
                  Your password for <strong>{forgotEmail}</strong> has been updated. You can now log into your Site Log account with your new password.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
                onClick={handleFinishReset}
              >
                <span>Sign In with New Password</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};
