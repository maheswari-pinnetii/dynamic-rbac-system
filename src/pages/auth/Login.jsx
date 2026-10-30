import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HeartHandshake,
  Fingerprint,
  ScanFace,
  UserCheck,
  Smile,
  Sparkles,
  Heart,
  Crown,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROLES, DEMO_USERS, ROLE_HUMAN_TITLES } from '../../utils/constants';
import { authenticateNativePasskey, checkPasskeySupport } from '../../utils/passkey';

import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import BiometricModal from '../../components/common/BiometricModal';
import ThemeToggle from '../../components/common/ThemeToggle';

export const Login = () => {
  const { login, loginWithPasskey, users } = useAuth();
  const { success, error, info } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Active Auth Tab: 'passkey' | 'password'
  const [authMethod, setAuthMethod] = useState('passkey');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Passkey modal state
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [passkeySupport, setPasskeySupport] = useState({
    supported: true,
    platformAuthenticator: true,
  });

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    checkPasskeySupport().then((support) => {
      setPasskeySupport(support);
    });
  }, []);

  const validatePasswordForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Please enter your password';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Passwords must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setIsLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      success(`Welcome back, ${user.name}! It’s wonderful to see you.`, 'Signed In');
      navigate(from, { replace: true });
    } catch (err) {
      error(err.message || 'We could not sign you in. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerPasskey = () => {
    if (!formData.email.trim()) {
      setErrors({ email: 'Please enter your account email or select a colleague below' });
      return;
    }
    setErrors({});
    setIsBiometricModalOpen(true);
  };

  const handleExecuteNativePasskey = async () => {
    const matched = users.find(
      (u) => u.email.toLowerCase().trim() === formData.email.toLowerCase().trim()
    );
    const credentialIds = matched?.passkeys?.map((p) => p.id) || [];
    return await authenticateNativePasskey({ credentialIds });
  };

  const handlePasskeySuccess = async (passkeyResult) => {
    try {
      const user = await loginWithPasskey(formData.email, passkeyResult);
      success(
        `Welcome back, ${user.name}! Verified using ${passkeyResult.authenticatorType || 'your passkey'}.`,
        'Identity Verified'
      );
      navigate(from, { replace: true });
    } catch (err) {
      error(err.message || 'Passkey authentication was not completed.');
    }
  };

  const handleQuickLogin = (demoUser) => {
    setFormData({
      email: demoUser.email,
      password: demoUser.password,
    });
    setErrors({});
    info(`Prefilled credentials for ${demoUser.name} (${demoUser.role})`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative transition-colors duration-200">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Floating Theme Toggle in Auth header */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex items-center gap-2">
        <ThemeToggle size="md" />
      </div>

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-500 via-teal-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-xl shadow-brand-500/20 mb-4 transform hover:scale-105 transition-transform">
          <HeartHandshake className="w-8 h-8 text-slate-950" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Welcome to PeopleRBAC
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Sign in to your team workspace using your <strong>Face, Fingerprint,</strong> or <strong>Password</strong>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 z-10">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-200/90 dark:border-slate-800 transition-colors">
          {/* Method Selection Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAuthMethod('passkey')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
                authMethod === 'passkey'
                  ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ScanFace className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Face / Fingerprint</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMethod('password')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
                authMethod === 'password'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Fingerprint className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Password Sign-In</span>
            </button>
          </div>

          {/* TAB 1: PASSKEY / BIOMETRIC SIGN-IN */}
          {authMethod === 'passkey' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/60 text-center">
                <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/60 flex items-center justify-center text-brand-700 dark:text-brand-300 mx-auto mb-2">
                  <ScanFace className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-sm font-bold text-brand-950 dark:text-brand-200">
                  Passwordless Colleague Sign-In
                </h4>
                <p className="text-xs text-brand-800 dark:text-brand-300 mt-1 leading-relaxed">
                  Sign in instantly using your <strong>Windows Hello facial recognition</strong>, <strong>Touch ID</strong>, or <strong>fingerprint sensor</strong>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Colleague Account Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Smile className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@enterprise.com"
                    autoComplete="username webauthn"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    className={`block w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 font-medium ${
                      errors.email
                        ? 'border-rose-400 focus:ring-rose-500'
                        : 'border-slate-300 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-500'
                    }`}
                  />
                </div>
                {errors.email ? (
                  <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.email}</p>
                ) : (
                  <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    Enter your email or click one of the pre-configured accounts below.
                  </p>
                )}
              </div>

              <Button
                type="button"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                onClick={handleTriggerPasskey}
                icon={ScanFace}
              >
                Sign In With Passkey / Biometrics
              </Button>

              <div className="flex items-center justify-center gap-3 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 font-medium">
                  <ScanFace className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Windows Hello Face
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Fingerprint className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  Fingerprint Touch
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: TRADITIONAL PASSWORD SIGN-IN */}
          {authMethod === 'password' && (
            <form className="space-y-4 animate-in fade-in duration-200" onSubmit={handlePasswordSubmit} noValidate>
              <Input
                label="Corporate Email Address"
                name="email"
                type="email"
                placeholder="name@enterprise.com"
                icon={Smile}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                autoComplete="username"
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                icon={Fingerprint}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                autoComplete="current-password"
                helperText="Pre-configured password for demo users is: Password123!"
                required
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 h-3.5 w-3.5 mr-2"
                  />
                  Keep me signed in
                </label>
                <button
                  type="button"
                  onClick={() => setAuthMethod('passkey')}
                  className="text-brand-600 dark:text-brand-400 hover:text-brand-700 font-bold"
                >
                  Use Passkey instead?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoading}
                icon={HeartHandshake}
              >
                Sign In With Password
              </Button>
            </form>
          )}

          {/* Pre-Configured Colleague Demo Credentials Card */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Pre-Configured Accounts (Click to Load)
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {DEMO_USERS.map((demo) => {
                const isSelected = formData.email === demo.email;
                return (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => handleQuickLogin(demo)}
                    className={`flex flex-col items-center p-2.5 rounded-2xl border transition-all text-center group ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/60 shadow-xs ring-1 ring-brand-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-brand-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <img
                      src={demo.avatar}
                      alt={demo.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700 mb-1"
                    />
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 truncate w-full">
                      {demo.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-full font-medium">
                      {demo.role}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Password for all demo accounts:</span>
              <code className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono font-bold text-slate-800 dark:text-slate-200">
                Password123!
              </code>
            </div>
          </div>

          {/* Link to Signup */}
          <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
            Joining the team?{' '}
            <Link
              to="/signup"
              className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 inline-flex items-center gap-1 ml-1"
            >
              Register your account <Sparkles className="w-3 h-3 text-amber-500" />
            </Link>
          </div>
        </div>
      </div>

      {/* Biometric Verification Modal */}
      <BiometricModal
        isOpen={isBiometricModalOpen}
        onClose={() => setIsBiometricModalOpen(false)}
        onSuccess={handlePasskeySuccess}
        mode="login"
        userName={formData.email || 'Colleague'}
        isNativeAvailable={passkeySupport.supported}
        onTriggerNative={handleExecuteNativePasskey}
      />
    </div>
  );
};

export default Login;
