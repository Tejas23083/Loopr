import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addAlert } = useAlert();

  const [email, setEmail] = useState('demo@loopr.com');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await login({ email, password });
      addAlert('success', 'Welcome back! Redirecting to dashboard...');
      navigate('/');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed. Please check your credentials.';
      addAlert('error', msg);
      setErrors({ password: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1117 0%, #151b27 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Background grid accent */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0,200,120,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.06) 0%, transparent 50%)',
      }} />

      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(21,27,39,0.95)',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.07)',
        padding: '48px 40px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #00c878, #00a060)',
            marginBottom: '16px',
            boxShadow: '0 8px 24px rgba(0,200,120,0.3)',
          }}>
            <TrendingUp size={28} color="white" />
          </div>
          <h1 style={{ color: '#f1f5f9', fontSize: '28px', fontWeight: 700, margin: 0 }}>Loopr</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '6px' }}>Financial Analytics Dashboard</p>
        </div>

        <h2 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Sign in</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '28px' }}>
          Access your financial analytics workspace
        </p>

        {/* Demo credentials hint */}
        <div style={{
          background: 'rgba(0,200,120,0.08)',
          border: '1px solid rgba(0,200,120,0.2)',
          borderRadius: '10px',
          padding: '12px 14px',
          marginBottom: '24px',
          fontSize: '13px',
          color: '#94a3b8',
        }}>
          <span style={{ color: '#00c878', fontWeight: 600 }}>Demo:</span> demo@loopr.com / demo1234
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
              placeholder="you@company.com"
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${errors.email ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '10px',
                color: '#f1f5f9',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => { if (!errors.email) e.target.style.borderColor = '#00c878'; }}
              onBlur={(e) => { if (!errors.email) e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            />
            {errors.email && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 44px 12px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${errors.password ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '10px',
                  color: '#f1f5f9',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { if (!errors.password) e.target.style.borderColor = '#00c878'; }}
                onBlur={(e) => { if (!errors.password) e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '2px',
                  display: 'flex', alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '13px',
              background: isLoading ? 'rgba(0,200,120,0.5)' : 'linear-gradient(135deg, #00c878, #00a060)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(0,200,120,0.3)',
              transition: 'opacity 0.2s, transform 0.1s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {isLoading ? (
              <>
                <span className="spinner-sm" />
                Signing in...
              </>
            ) : 'Sign in'}
          </button>
        </form>
      </div>

      <style>{`
        input::placeholder { color: #475569; }
        .spinner-sm {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default LoginPage;
