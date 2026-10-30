import React, { useState } from 'react';
import {
  User,
  CheckCircle2,
  XCircle,
  Users,
  Smile,
  Footprints,
  Sparkles,
  Fingerprint,
  UserPlus,
  Heart,
  HeartHandshake,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePermission } from '../../context/PermissionContext';
import { useToast } from '../../context/ToastContext';
import { ROLES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { registerNativePasskey } from '../../utils/passkey';
import { useTheme } from '../../context/ThemeContext';

import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import BiometricModal from '../../components/common/BiometricModal';

export const Profile = () => {
  const { currentUser, updateUserProfile, addPasskeyToUser } = useAuth();
  const { hasPermission, permissionDefinitions } = usePermission();
  const { success, error } = useToast();
  const { theme, setTheme } = useTheme();

  const userRole = currentUser?.role || ROLES.EMPLOYEE;

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    department: currentUser?.department || '',
  });

  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: formData.name.trim(),
      department: formData.department.trim(),
    });
    success('Profile details updated successfully.', 'Profile Updated');
  };

  const handleExecuteNativeRegistration = async () => {
    return await registerNativePasskey({
      userId: currentUser?.id,
      userName: currentUser?.email,
      userDisplayName: currentUser?.name,
    });
  };

  const handlePasskeyRegistered = (passkeyResult) => {
    addPasskeyToUser(currentUser?.id, passkeyResult);
    success(
      `New passkey linked successfully via ${passkeyResult.authenticatorType || 'Biometrics'}!`,
      'Passkey Registered'
    );
  };

  const userPasskeys = currentUser?.passkeys || [
    {
      id: `pk_${currentUser?.id}`,
      name: 'Windows Hello / Device Biometrics',
      type: 'platform',
      createdAt: currentUser?.createdAt || new Date().toISOString(),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Account & Security Profile"
        subtitle="View personal account information, department assignment, and active role privileges."
        badge={userRole}
        badgeVariant={userRole === ROLES.ADMIN ? 'purple' : userRole === ROLES.MANAGER ? 'blue' : 'success'}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Card & Details */}
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col items-center text-center p-2">
              <img
                src={
                  currentUser?.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || 'User'}`
                }
                alt={currentUser?.name}
                className="w-24 h-24 rounded-full border-4 border-slate-100 object-cover shadow-sm mb-3"
              />
              <h2 className="text-lg font-bold text-slate-900">{currentUser?.name}</h2>
              <p className="text-xs text-slate-500">{currentUser?.email}</p>

              <div className="mt-3 flex items-center gap-2">
                <Badge role={userRole} size="md" dot />
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {currentUser?.department}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-slate-400" />
                  Email
                </span>
                <span className="font-medium text-slate-800">{currentUser?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  Department
                </span>
                <span className="font-medium text-slate-800">{currentUser?.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Footprints className="w-3.5 h-3.5 text-slate-400" />
                  Member Since
                </span>
                <span className="font-medium text-slate-800">
                  {formatDate(currentUser?.createdAt || '2026-01-01')}
                </span>
              </div>
            </div>
          </Card>

          {/* Passkey & Biometric Credentials Card */}
          <Card
            title="Biometric Passkeys"
            subtitle="FIDO2 / WebAuthn credentials"
            action={
              <Button
                variant="outline"
                size="xs"
                icon={UserPlus}
                onClick={() => setIsBiometricModalOpen(true)}
              >
                Add Passkey
              </Button>
            }
          >
            <div className="space-y-2.5">
              {userPasskeys.map((pk) => (
                <div
                  key={pk.id}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-brand-100 text-brand-700">
                      <Fingerprint className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{pk.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {formatDate(pk.createdAt)}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Theme Preference Card */}
          <Card
            title="Appearance Theme"
            subtitle="Customize light, dark, or system matching"
          >
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setTheme('light');
                  success('Light theme activated.', 'Appearance Updated');
                }}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs ${
                  theme === 'light'
                    ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Smile className="w-4 h-4 text-amber-500" />
                <span>Daylight</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTheme('dark');
                  success('Human Twilight theme activated.', 'Appearance Updated');
                }}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs ${
                  theme === 'dark'
                    ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />
                <span>Twilight</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTheme('system');
                  success('System preference matching activated.', 'Appearance Updated');
                }}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs ${
                  theme === 'system'
                    ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <HeartHandshake className="w-4 h-4 text-amber-400" />
                <span>Auto</span>
              </button>
            </div>
          </Card>

          {/* Edit Information Form */}
          <Card title="Update Profile Details">
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <Input
                label="Display Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
              <Button type="submit" variant="primary" size="sm" className="w-full">
                Save Profile Changes
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Column: Dynamic Assigned Permissions Table */}
        <div className="lg:col-span-2">
          <Card
            title="Active Assigned Permissions"
            subtitle={`Real-time permissions matrix evaluation for your role (${userRole})`}
            action={
              <Badge variant="primary" size="sm">
                Enforced by Admin Policy
              </Badge>
            }
          >
            <div className="divide-y divide-slate-100">
              {permissionDefinitions.map((def) => {
                const isGranted = userRole === ROLES.ADMIN || hasPermission(def.key, userRole);
                return (
                  <div
                    key={def.key}
                    className="py-3 px-2 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-xs">
                          {def.label}
                        </span>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {def.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{def.description}</p>
                    </div>

                    <div className="flex-shrink-0">
                      {isGranted ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Granted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                          <XCircle className="w-3.5 h-3.5" />
                          Restricted
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Biometric Link Modal */}
      <BiometricModal
        isOpen={isBiometricModalOpen}
        onClose={() => setIsBiometricModalOpen(false)}
        onSuccess={handlePasskeyRegistered}
        mode="register"
        userName={currentUser?.name || 'User'}
        onTriggerNative={handleExecuteNativeRegistration}
      />
    </div>
  );
};

export default Profile;
