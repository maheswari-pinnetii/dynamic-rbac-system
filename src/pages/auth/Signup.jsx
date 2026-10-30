import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartHandshake,
  User,
  UserPlus,
  Fingerprint,
  ScanFace,
  Smile,
  CheckCircle2,
  Sparkles,
  Crown,
  Briefcase,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROLES, ROLE_LIST } from '../../utils/constants';
import { registerNativePasskey, checkPasskeySupport } from '../../utils/passkey';

import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import BiometricModal from '../../components/common/BiometricModal';
import ThemeToggle from '../../components/common/ThemeToggle';

export const Signup = () => {
  const { signup } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [authMethod, setAuthMethod] = useState('passkey');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ROLES.EMPLOYEE,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [passkeySupport, setPasskeySupport] = useState({
    supported: true,
    platformAuthenticator: true,
  });

  useEffect(() => {
    checkPasskeySupport().then((support) => {
      setPasskeySupport(support);
    });
  }, []);

  const validateCommon = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your full name';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name should be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your work email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email format';
    }

    if (!formData.role) {
      newErrors.role = 'Please select your role within the team';
    }

    return newErrors;
  };

  const validatePasswordForm = () => {
    const newErrors = validateCommon();

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmation password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setIsLoading(true);
    try {
      const newUser = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      success(
        `Welcome to the team, ${newUser.name}! Your account is ready.`,
        'Welcome Aboard'
      );
      navigate('/dashboard', { replace: true });
    } catch (err) {
      error(err.message || 'Registration could not be completed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartPasskeySignup = (e) => {
    e.preventDefault();
    const commonErrors = validateCommon();
    if (Object.keys(commonErrors).length > 0) {
      setErrors(commonErrors);
      return;
    }
    setErrors({});
    setIsBiometricModalOpen(true);
  };

  const handleExecuteNativeRegistration = async () => {
    return await registerNativePasskey({
      userName: formData.email,
      userDisplayName: formData.name,
    });
  };

  const handlePasskeySuccess = async (passkeyResult) => {
    setIsLoading(true);
    try {
      const newUser = await signup({
        name: formData.name,
        email: formData.email,
        password: 'PasskeyDefault123!',
        role: formData.role,
        passkeyData: passkeyResult,
      });

      success(
        `Biometric passkey enrolled with ${passkeyResult.authenticatorType || 'your device'}! Welcome, ${newUser.name}.`,
        'Welcome to the Team'
      );
      navigate('/dashboard', { replace: true });
    } catch (err) {
      error(err.message || 'Could not complete passkey enrollment.');
    } finally {
      setIsLoading(false);
    }
  };

  const rolesConfig = [
    {
      role: ROLES.ADMIN,
      title: 'Administrator',
      desc: 'Universal control over all modules & dynamic permissions',
      icon: Crown,
      color: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/40',
    },
    {
      role: ROLES.MANAGER,
      title: 'Team Manager',
      desc: 'Operational lead over catalog items and reports',
      icon: Briefcase,
      color: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/40',
    },
    {
      role: ROLES.EMPLOYEE,
      title: 'Operations Specialist',
      desc: 'Front-line staff handling daily catalog inquiries',
      icon: UserCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/40',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative transition-colors duration-200">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Floating Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex items-center gap-2">
        <ThemeToggle size="md" />
      </div>

      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-500 via-teal-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-xl shadow-brand-500/20 mb-4 transform hover:scale-105 transition-transform">
          <HeartHandshake className="w-8 h-8 text-slate-950" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Join the PeopleRBAC Team
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Create your account with your <strong>Face, Fingerprint,</strong> or <strong>Password</strong>
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
              <span>Register Passkey</span>
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
              <span>Register Password</span>
            </button>
          </div>

          {/* Role Selection Cards Grid */}
          <div className="mb-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Select Your Team Role Tier *
            </label>
            <div className="space-y-2">
              {rolesConfig.map((item) => {
                const isSelected = formData.role === item.role;
                const RoleIcon = item.icon;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: item.role })}
                    className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? `${item.border} ring-2 ring-brand-500/30`
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-xl bg-white dark:bg-slate-800 shadow-xs">
                        <RoleIcon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
            {errors.role && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.role}</p>
            )}
          </div>

          {/* TAB 1: PASSKEY REGISTRATION FORM */}
          {authMethod === 'passkey' && (
            <form className="space-y-4 animate-in fade-in duration-200" onSubmit={handleStartPasskeySignup} noValidate>
              <div className="p-3.5 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/60 text-xs text-brand-900 dark:text-brand-200 flex items-start gap-2.5">
                <Smile className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Biometric Enrollment</span>
                  <span className="text-[11px] text-brand-700 dark:text-brand-300">
                    Your Face or Fingerprint passkey will be securely registered to this device for instant future logins.
                  </span>
                </div>
              </div>

              <Input
                label="Full Name *"
                name="name"
                type="text"
                placeholder="e.g. Jordan Cooper"
                icon={User}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                required
              />

              <Input
                label="Work Email Address *"
                name="email"
                type="email"
                placeholder="jordan@enterprise.com"
                icon={Smile}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoading}
                icon={ScanFace}
              >
                Enroll & Link Passkey
              </Button>
            </form>
          )}

          {/* TAB 2: PASSWORD REGISTRATION FORM */}
          {authMethod === 'password' && (
            <form className="space-y-4 animate-in fade-in duration-200" onSubmit={handlePasswordSubmit} noValidate>
              <Input
                label="Full Name *"
                name="name"
                type="text"
                placeholder="e.g. Jordan Cooper"
                icon={User}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                required
              />

              <Input
                label="Work Email Address *"
                name="email"
                type="email"
                placeholder="jordan@enterprise.com"
                icon={Smile}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                required
              />

              <Input
                label="Password *"
                name="password"
                type="password"
                placeholder="••••••••"
                icon={Fingerprint}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                helperText="Must be at least 6 characters"
                required
              />

              <Input
                label="Confirm Password *"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                icon={Fingerprint}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                error={errors.confirmPassword}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoading}
                icon={UserPlus}
              >
                Create Account
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
            Already registered?{' '}
            <Link
              to="/login"
              className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 inline-flex items-center gap-1 ml-1"
            >
              Sign in to your account <Sparkles className="w-3 h-3 text-amber-500" />
            </Link>
          </div>
        </div>
      </div>

      {/* Biometric Enrollment Modal */}
      <BiometricModal
        isOpen={isBiometricModalOpen}
        onClose={() => setIsBiometricModalOpen(false)}
        onSuccess={handlePasskeySuccess}
        mode="register"
        userName={formData.name || formData.email || 'Colleague'}
        isNativeAvailable={passkeySupport.supported}
        onTriggerNative={handleExecuteNativeRegistration}
      />
    </div>
  );
};

export default Signup;
