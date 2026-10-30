import React, { useState } from 'react';
import {
  Crown,
  Briefcase,
  Users,
  CheckCircle2,
  HeartHandshake,
  Sparkles,
  Footprints,
  UserCheck,
  Smile,
  UserPlus,
  Eye,
  UserMinus,
  Fingerprint,
  ChevronRight,
  HelpingHand,
} from 'lucide-react';
import { usePermission } from '../../context/PermissionContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  ROLES,
  PERMISSIONS,
  PERMISSION_DEFINITIONS,
  DEFAULT_PERMISSIONS,
  DEMO_USERS,
  ROLE_HUMAN_TITLES,
} from '../../utils/constants';

import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Toggle from '../../components/common/Toggle';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import ConfirmModal from '../../components/common/ConfirmModal';

export const AdminSettings = () => {
  const {
    permissions,
    savePermissionsMatrix,
    resetToDefaults,
    activityLogs,
    permissionDefinitions,
  } = usePermission();

  const { currentUser, switchRole, users, updateUserRole, addUser, deleteUser } = useAuth();
  const { success, info, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState('matrix'); // 'matrix' | 'roles'
  const [matrixDraft, setMatrixDraft] = useState(() => JSON.parse(JSON.stringify(permissions)));
  const [isSaving, setIsSaving] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // User management state
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: ROLES.EMPLOYEE,
    department: 'Operations',
    title: 'Operations Specialist',
  });
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const hasUnsavedChanges = JSON.stringify(matrixDraft) !== JSON.stringify(permissions);

  const handleToggle = (role, permissionKey, newValue) => {
    setMatrixDraft((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permissionKey]: newValue,
      },
    }));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    savePermissionsMatrix(matrixDraft, currentUser);
    setIsSaving(false);
    success(
      'Updated permissions saved and applied immediately across all colleagues!',
      'Colleague Access Updated'
    );
  };

  const handleConfirmReset = () => {
    resetToDefaults(currentUser);
    setMatrixDraft(JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS)));
    setResetModalOpen(false);
    info(
      'All role privileges returned to baseline enterprise defaults.',
      'Permissions Reset'
    );
  };

  // Role Management Handlers
  const handleRoleChange = (userId, userName, newRole) => {
    updateUserRole(userId, newRole);
    success(
      `${userName} is now assigned the "${newRole}" role tier!`,
      'Role Reassigned'
    );
  };

  const handleCreateColleague = (e) => {
    e.preventDefault();
    if (!newUserData.name.trim() || !newUserData.email.trim()) {
      toastError('Please provide both name and a corporate email.');
      return;
    }

    addUser(newUserData);
    success(`Colleague ${newUserData.name} added with ${newUserData.role} access!`, 'Colleague Added');
    setAddUserModalOpen(false);
    setNewUserData({
      name: '',
      email: '',
      role: ROLES.EMPLOYEE,
      department: 'Operations',
      title: 'Operations Specialist',
    });
  };

  const handleConfirmDeleteUser = () => {
    if (!userToDelete) return;
    deleteUser(userToDelete.id);
    success(`Colleague record for ${userToDelete.name} has been removed.`, 'Colleague Removed');
    setDeleteUserModalOpen(false);
    setUserToDelete(null);
  };

  const filteredUsers = (users || []).filter(
    (u) =>
      u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      (u.department || '').toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Colleague Access & Permission Governance"
        subtitle="Dynamically determine what Team Managers and Operations Specialists can view, add, modify, and remove."
        badge="Executive Administrator"
        badgeVariant="purple"
        actions={
          <div className="flex items-center gap-2">
            {activeTab === 'matrix' ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  icon={HelpingHand}
                  onClick={() => setResetModalOpen(true)}
                >
                  Reset to Defaults
                </Button>

                <Button
                  variant={hasUnsavedChanges ? 'primary' : 'secondary'}
                  size="sm"
                  icon={HeartHandshake}
                  isLoading={isSaving}
                  onClick={handleSaveAll}
                  className={hasUnsavedChanges ? 'animate-pulse' : ''}
                >
                  {hasUnsavedChanges ? 'Save Changes *' : 'Save Permission Settings'}
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                icon={UserPlus}
                onClick={() => setAddUserModalOpen(true)}
              >
                Add New Colleague
              </Button>
            )}
          </div>
        }
      />

      {/* Primary Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'matrix'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Dynamic Permission Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'roles'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manage Colleague Roles ({users?.length || 3})</span>
        </button>
      </div>

      {/* TAB 1: DYNAMIC PERMISSION MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Unsaved Changes Banner */}
          {hasUnsavedChanges && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Smile className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <span>
                  <strong>You have unsaved changes!</strong> Click <em>"Save Permission Settings"</em> to broadcast these updated permissions to all active colleague sessions.
                </span>
              </div>
              <Button
                variant="primary"
                size="xs"
                onClick={handleSaveAll}
                isLoading={isSaving}
              >
                Apply to Colleagues
              </Button>
            </div>
          )}

          {/* Dynamic Permission Matrix Table */}
          <Card
            title="Human Permission Matrix"
            subtitle="Manage the capabilities granted to each role tier. Administrators maintain permanent governance over all modules."
            action={
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Dynamic Runtime Enforcement
              </span>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 w-2/5">Capability & Purpose</th>
                    <th className="py-3.5 px-4 w-1/5">Category</th>
                    <th className="py-3.5 px-4 text-center w-1/5">
                      <div className="flex items-center justify-center gap-1.5">
                        <img
                          src={DEMO_USERS[1].avatar}
                          alt="Marcus"
                          className="w-5 h-5 rounded-full object-cover border border-blue-400"
                        />
                        <span className="font-bold text-slate-800 dark:text-slate-200">Team Managers</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-4 text-center w-1/5">
                      <div className="flex items-center justify-center gap-1.5">
                        <img
                          src={DEMO_USERS[2].avatar}
                          alt="Elena"
                          className="w-5 h-5 rounded-full object-cover border border-emerald-400"
                        />
                        <span className="font-bold text-slate-800 dark:text-slate-200">Specialists</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {permissionDefinitions.map((def) => {
                    const managerAllowed = !!matrixDraft[ROLES.MANAGER]?.[def.key];
                    const employeeAllowed = !!matrixDraft[ROLES.EMPLOYEE]?.[def.key];

                    return (
                      <tr
                        key={def.key}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        {/* Capability Name & Question */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                            {def.label}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                            {def.humanQuestion || def.description}
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                            Permission Key: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-600 dark:text-slate-400">{def.key}</code>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {def.category}
                          </span>
                        </td>

                        {/* Manager Toggle */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Toggle
                              checked={managerAllowed}
                              onChange={(val) =>
                                handleToggle(ROLES.MANAGER, def.key, val)
                              }
                              size="md"
                            />
                            <span
                              className={`text-[10px] font-bold mt-1 ${
                                managerAllowed ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                              }`}
                            >
                              {managerAllowed ? 'Permitted ☑' : 'Restricted ☐'}
                            </span>
                          </div>
                        </td>

                        {/* Employee Toggle */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Toggle
                              checked={employeeAllowed}
                              onChange={(val) =>
                                handleToggle(ROLES.EMPLOYEE, def.key, val)
                              }
                              size="md"
                            />
                            <span
                              className={`text-[10px] font-bold mt-1 ${
                                employeeAllowed ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                              }`}
                            >
                              {employeeAllowed ? 'Permitted ☑' : 'Restricted ☐'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Matrix Footer */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0" />
                <span>
                  Toggling switches prepares your changes. Press <strong>"Save Permission Settings"</strong> to update policies across all user sessions.
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={HeartHandshake}
                onClick={handleSaveAll}
                isLoading={isSaving}
              >
                Save Permission Settings
              </Button>
            </div>
          </Card>

          {/* Colleague Experience Preview & Audit Trail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Experience Simulation Card */}
            <Card
              title="Inspect Colleague Perspectives"
              subtitle="Experience what your colleagues see right now based on active rules"
            >
              <div className="space-y-3.5 text-xs">
                <p className="text-slate-600 dark:text-slate-400">
                  Switch directly into Marcus’s or Elena’s view to verify that buttons, navigation links, and routes reflect the rules you set above.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      switchRole(ROLES.MANAGER);
                      info('Switched to Marcus Vance (Team Manager)! Notice the sidebar and actions update accordingly.');
                    }}
                    className="p-3.5 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100/60 dark:hover:bg-blue-900/40 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <img
                        src={DEMO_USERS[1].avatar}
                        alt="Marcus"
                        className="w-8 h-8 rounded-full object-cover border border-blue-300 dark:border-blue-700"
                      />
                      <div>
                        <div className="font-bold text-blue-950 dark:text-blue-200">Marcus Vance</div>
                        <div className="text-[10px] text-blue-700 dark:text-blue-400">Team Manager</div>
                      </div>
                    </div>
                    <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                      Test the catalog with Manager permissions. If Delete is enabled, delete buttons appear.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      switchRole(ROLES.EMPLOYEE);
                      info('Switched to Elena Rostova (Specialist)! Notice restricted actions and routes.');
                    }}
                    className="p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <img
                        src={DEMO_USERS[2].avatar}
                        alt="Elena"
                        className="w-8 h-8 rounded-full object-cover border border-emerald-300 dark:border-emerald-700"
                      />
                      <div>
                        <div className="font-bold text-emerald-950 dark:text-emerald-200">Elena Rostova</div>
                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400">Operations Specialist</div>
                      </div>
                    </div>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                      Test restricted staff mode. Notice that adding and removing products is guarded.
                    </p>
                  </button>
                </div>
              </div>
            </Card>

            {/* Audit Trail */}
            <Card
              title="Colleague Governance Audit Trail"
              subtitle="Recent adjustments made to team access and roles"
            >
              <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                {activityLogs
                  .filter((log) => log.type === 'security' || log.type === 'system')
                  .slice(0, 5)
                  .map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{log.action}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString([], {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{log.details}</p>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE COLLEAGUE ROLES & USERS */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <Card
            title="Colleague Role Management & Access Assignment"
            subtitle="Administer organizational role tiers for team members. Role reassignments take effect immediately."
            action={
              <Button
                variant="primary"
                size="sm"
                icon={UserPlus}
                onClick={() => setAddUserModalOpen(true)}
              >
                Add Colleague
              </Button>
            }
          >
            {/* Search filter */}
            <div className="mb-4 relative max-w-sm">
              <Eye className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search colleagues by name, role, email..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Colleague Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Colleague Profile</th>
                    <th className="py-3 px-4">Department & Title</th>
                    <th className="py-3 px-4">Passkey Attestation</th>
                    <th className="py-3 px-4">Current Assigned Role</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((u) => {
                    const isSelf = u.id === currentUser?.id;
                    const humanTitle = ROLE_HUMAN_TITLES[u.role] || u.role;

                    return (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        {/* Profile Info */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 bg-slate-100"
                            />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                {u.name}
                                {isSelf && (
                                  <span className="text-[10px] bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 px-1.5 py-0.2 rounded font-semibold">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            {u.department || 'Operations'}
                          </div>
                          <div className="text-[11px] text-slate-400">{u.title || humanTitle}</div>
                        </td>

                        {/* Passkey Status */}
                        <td className="py-3 px-4">
                          {u.hasPasskey || u.passkeys?.length > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              <Fingerprint className="w-3.5 h-3.5" />
                              Passkey Enrolled
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              Password Only
                            </span>
                          )}
                        </td>

                        {/* Dynamic Role Selector */}
                        <td className="py-3 px-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, u.name, e.target.value)}
                            disabled={isSelf}
                            className={`py-1 px-2.5 text-xs font-bold rounded-xl border transition-all ${
                              u.role === ROLES.ADMIN
                                ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                                : u.role === ROLES.MANAGER
                                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                            }`}
                            title={isSelf ? 'Cannot change your own active admin role' : 'Reassign role tier'}
                          >
                            <option value={ROLES.ADMIN}>Admin (Master Governance)</option>
                            <option value={ROLES.MANAGER}>Manager (Operational Lead)</option>
                            <option value={ROLES.EMPLOYEE}>Employee (Specialist)</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                switchRole(u.role);
                                info(`Simulating perspective as ${u.name} (${u.role}).`);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Test perspective as this colleague"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>

                            {!isSelf && (
                              <button
                                type="button"
                                onClick={() => {
                                  setUserToDelete(u);
                                  setDeleteUserModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Remove colleague"
                              >
                                <UserMinus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Confirmation Modal for Reset */}
      <ConfirmModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset All Colleague Permissions?"
        message="This will restore the baseline permissions matrix. Any custom permission toggles for Managers and Specialists will be restored to defaults."
        confirmText="Yes, Reset Permissions"
        variant="warning"
      />

      {/* Confirmation Modal for Deleting User */}
      <ConfirmModal
        isOpen={deleteUserModalOpen}
        onClose={() => setDeleteUserModalOpen(false)}
        onConfirm={handleConfirmDeleteUser}
        title="Remove Colleague Record?"
        message={`Are you sure you want to remove colleague ${userToDelete?.name}? Their access credentials will be revoked.`}
        confirmText="Yes, Remove Colleague"
        variant="danger"
      />

      {/* Modal: Add New Colleague */}
      <Modal
        isOpen={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        title="Register New Team Colleague"
        subtitle="Create an internal colleague account and assign an initial RBAC role tier"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateColleague} className="space-y-3.5">
          <Input
            label="Full Name *"
            placeholder="e.g. David Miller"
            value={newUserData.name}
            onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
            required
          />

          <Input
            label="Corporate Email *"
            type="email"
            placeholder="e.g. david.miller@enterprise.com"
            value={newUserData.email}
            onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Department"
              placeholder="e.g. Logistics"
              value={newUserData.department}
              onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value })}
            />

            <Select
              label="Assigned Role *"
              value={newUserData.role}
              onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
              options={[
                { value: ROLES.ADMIN, label: 'Admin (Director)' },
                { value: ROLES.MANAGER, label: 'Manager (Lead)' },
                { value: ROLES.EMPLOYEE, label: 'Employee (Specialist)' },
              ]}
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            💡 The newly registered colleague can log in with their email and password <code>Password123!</code>, or enroll their personal Windows Hello / Fingerprint passkey.
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" size="sm" onClick={() => setAddUserModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" icon={UserPlus}>
              Create Colleague
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminSettings;
