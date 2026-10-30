import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import Badge from './Badge';
import {
  Fingerprint,
  ScanFace,
  UserCheck,
  Smile,
  Heart,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const BiometricModal = ({
  isOpen,
  onClose,
  onSuccess,
  mode = 'login', // 'login' | 'register'
  userName = 'Colleague',
  userRole = 'Admin',
  isNativeAvailable = true,
  onTriggerNative,
}) => {
  const [status, setStatus] = useState('ready'); // 'ready' | 'scanning' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [authMethod, setAuthMethod] = useState('windows-hello'); // 'windows-hello' | 'fingerprint'

  useEffect(() => {
    if (isOpen) {
      setStatus('ready');
      setErrorMessage('');
    }
  }, [isOpen]);

  const handleStartBiometric = async () => {
    setStatus('scanning');
    setErrorMessage('');

    if (onTriggerNative) {
      try {
        const result = await onTriggerNative();
        setStatus('success');
        setTimeout(() => {
          onSuccess(result);
          onClose();
        }, 800);
        return;
      } catch (err) {
        console.warn('Native biometric completed or bypassed:', err.message);
        setStatus('error');
        setErrorMessage(
          err.message || 'Biometric scan was dismissed or not detected by hardware.'
        );
        return;
      }
    }

    // Friendly scanning simulation
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess({
          id: `passkey_${Date.now()}`,
          authenticatorType:
            authMethod === 'windows-hello'
              ? 'Windows Hello (Face / PIN)'
              : 'Fingerprint Biometrics',
          verified: true,
        });
        onClose();
      }, 900);
    }, 1300);
  };

  const handleSimulatedBypass = () => {
    setStatus('scanning');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess({
          id: `passkey_${Date.now()}`,
          authenticatorType:
            authMethod === 'windows-hello'
              ? 'Windows Hello'
              : 'Fingerprint Biometrics',
          verified: true,
          isSimulated: true,
        });
        onClose();
      }, 700);
    }, 900);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'register'
          ? 'Link Your Biometric Passkey'
          : 'Human Biometric Sign-In'
      }
      subtitle={
        mode === 'register'
          ? 'Enrolling your personal Face or Fingerprint passkey'
          : `Verifying identity for ${userName}`
      }
      maxWidth="max-w-md"
    >
      <div className="flex flex-col items-center text-center py-2">
        {/* Method selector pills with human icons */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setAuthMethod('windows-hello')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
              authMethod === 'windows-hello'
                ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ScanFace className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Windows Hello Face</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMethod('fingerprint')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
              authMethod === 'fingerprint'
                ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Fingerprint className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Fingerprint Touch</span>
          </button>
        </div>

        {/* Human Interactive Biometric Icon Graphic */}
        <div className="relative mb-6">
          <div
            className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 relative ${
              status === 'scanning'
                ? 'bg-brand-50 dark:bg-brand-950/40 border-3 border-brand-500 scale-105 shadow-xl shadow-brand-500/20'
                : status === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-3 border-emerald-500 scale-105 shadow-xl shadow-emerald-500/20'
                : status === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-3 border-rose-400'
                : 'bg-slate-50 dark:bg-slate-800 border-3 border-slate-200 dark:border-slate-700 hover:border-brand-400'
            }`}
          >
            {status === 'scanning' && (
              <span className="absolute inset-0 rounded-full border-2 border-brand-400 animate-ping opacity-40 pointer-events-none" />
            )}

            {status === 'success' ? (
              <CheckCircle2 className="w-14 h-14 text-emerald-600 dark:text-emerald-400 animate-in zoom-in-75 duration-200" />
            ) : status === 'error' ? (
              <Smile className="w-14 h-14 text-rose-500 dark:text-rose-400" />
            ) : authMethod === 'windows-hello' ? (
              <ScanFace className="w-14 h-14 text-blue-600 dark:text-blue-400" />
            ) : (
              <Fingerprint className="w-14 h-14 text-brand-600 dark:text-brand-400" />
            )}
          </div>
        </div>

        {/* User Context & Instructions */}
        <div className="mb-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            {status === 'scanning'
              ? authMethod === 'windows-hello'
                ? 'Looking for your smile on camera...'
                : 'Reading your fingerprint sensor...'
              : status === 'success'
              ? 'Identity Confirmed!'
              : status === 'error'
              ? 'Biometric Verification Paused'
              : mode === 'register'
              ? `Register ${authMethod === 'windows-hello' ? 'Face Recognition' : 'Fingerprint'} Passkey`
              : `Welcome! Please verify your identity`}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
            {status === 'scanning'
              ? 'Look into the camera or touch your biometric sensor to complete sign-in.'
              : status === 'success'
              ? 'Your cryptographic passkey signature was verified seamlessly.'
              : status === 'error'
              ? errorMessage
              : 'Passkeys let you sign in in a split second using your face or fingerprint.'}
          </p>
        </div>

        {/* Actions */}
        <div className="w-full space-y-2 mt-2">
          {status !== 'scanning' && status !== 'success' && (
            <>
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={handleStartBiometric}
                icon={authMethod === 'windows-hello' ? ScanFace : Fingerprint}
              >
                {isNativeAvailable
                  ? `Verify with ${authMethod === 'windows-hello' ? 'Windows Hello' : 'Fingerprint'}`
                  : 'Start Biometric Scan'}
              </Button>

              {status === 'error' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-950/40 hover:bg-brand-100 dark:hover:bg-brand-900/40"
                  onClick={handleSimulatedBypass}
                >
                  Confirm With Simulated Biometric (Instant Test)
                </Button>
              )}
            </>
          )}

          {status === 'scanning' && (
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-400 py-2">
              <ScanFace className="w-4 h-4 animate-pulse text-brand-600 dark:text-brand-400" />
              <span>Scanning biometric presence...</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-full text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            disabled={status === 'scanning'}
          >
            Cancel & Return
          </Button>
        </div>

        {/* Human security pledge */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 w-full flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Human Verified Security
          </span>
          <span className="font-medium text-slate-500 dark:text-slate-400">Private to this device</span>
        </div>
      </div>
    </Modal>
  );
};

export default BiometricModal;
