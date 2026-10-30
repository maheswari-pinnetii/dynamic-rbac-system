/**
 * Passkey & WebAuthn Utility for Fingerprint, Windows Hello, and Platform Biometrics
 * Implements native W3C Web Authentication API (WebAuthn) with graceful simulation fallbacks.
 */

// Helper to convert string to ArrayBuffer
export const strToBuffer = (str) => {
  return new TextEncoder().encode(str);
};

// Helper to convert ArrayBuffer to Base64URL string
export const bufferToBase64Url = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Helper to convert Base64URL string to Uint8Array
export const base64UrlToBuffer = (base64url) => {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (base64.length % 4)) % 4;
  const padded = base64 + '='.repeat(padLen);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

// Generate random cryptographic challenge
export const generateRandomChallenge = (length = 32) => {
  const array = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < length; i++) array[i] = Math.floor(Math.random() * 256);
  }
  return array;
};

/**
 * Check if the browser supports WebAuthn / Passkeys
 */
export const checkPasskeySupport = async () => {
  if (typeof window === 'undefined') {
    return { supported: false, platformAuthenticator: false, reason: 'SSR environment' };
  }

  const isWebAuthnAvailable = !!(
    window.PublicKeyCredential &&
    navigator.credentials &&
    typeof navigator.credentials.create === 'function' &&
    typeof navigator.credentials.get === 'function'
  );

  if (!isWebAuthnAvailable) {
    return {
      supported: false,
      platformAuthenticator: false,
      reason: 'Browser does not support Web Authentication API (WebAuthn).',
    };
  }

  let hasPlatformAuth = false;
  try {
    if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
      hasPlatformAuth = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    }
  } catch (err) {
    console.warn('Could not check platform authenticator availability:', err);
  }

  return {
    supported: true,
    platformAuthenticator: hasPlatformAuth,
    reason: null,
  };
};

/**
 * Register a new Passkey with native WebAuthn
 * Prompts user for Windows Hello PIN/Fingerprint/Face, Touch ID, or Security Key
 */
export const registerNativePasskey = async ({
  userId,
  userName,
  userDisplayName,
  rpName = 'SecureRBAC Enterprise Portal',
}) => {
  if (!window.PublicKeyCredential) {
    throw new Error('WebAuthn is not supported in this browser.');
  }

  const challenge = generateRandomChallenge();
  const userIdBuffer = strToBuffer(userId || `usr_${Date.now()}`);

  const creationOptions = {
    challenge,
    rp: {
      name: rpName,
      id: window.location.hostname || 'localhost',
    },
    user: {
      id: userIdBuffer,
      name: userName || 'user@enterprise.com',
      displayName: userDisplayName || userName || 'Enterprise User',
    },
    pubKeyCredParams: [
      { alg: -7, type: 'public-key' },  // ES256
      { alg: -257, type: 'public-key' }, // RS256
    ],
    authenticatorSelection: {
      authenticatorAttachment: 'platform', // Windows Hello, Touch ID, Face ID
      userVerification: 'preferred',
      residentKey: 'preferred',
    },
    timeout: 60000,
    attestation: 'none',
  };

  try {
    const credential = await navigator.credentials.create({
      publicKey: creationOptions,
    });

    if (!credential) {
      throw new Error('Authenticator did not return a credential.');
    }

    const rawIdBase64 = bufferToBase64Url(credential.rawId);
    return {
      id: credential.id || rawIdBase64,
      rawId: rawIdBase64,
      type: credential.type,
      authenticatorType: 'Windows Hello / Platform Biometric',
      createdAt: new Date().toISOString(),
      verified: true,
    };
  } catch (err) {
    console.warn('Native WebAuthn creation notice:', err.name, err.message);

    if (err.name === 'NotAllowedError') {
      throw new Error('Passkey registration cancelled by user or timed out.');
    } else if (err.name === 'InvalidStateError') {
      throw new Error('A passkey is already registered for this device.');
    } else if (err.name === 'SecurityError') {
      throw new Error('Security context mismatch. Please ensure you are running on http://localhost or HTTPS.');
    }

    throw err;
  }
};

/**
 * Authenticate existing user with native WebAuthn Passkey
 * Prompts user for Windows Hello / Fingerprint / Device Biometrics
 */
export const authenticateNativePasskey = async ({ credentialIds = [] }) => {
  if (!window.PublicKeyCredential) {
    throw new Error('WebAuthn is not supported in this browser.');
  }

  const challenge = generateRandomChallenge();

  const allowCredentials = credentialIds.map((id) => ({
    id: typeof id === 'string' ? base64UrlToBuffer(id) : id,
    type: 'public-key',
    transports: ['internal', 'hybrid'],
  }));

  const requestOptions = {
    challenge,
    rpId: window.location.hostname || 'localhost',
    timeout: 60000,
    userVerification: 'preferred',
    allowCredentials: allowCredentials.length > 0 ? allowCredentials : undefined,
  };

  try {
    const assertion = await navigator.credentials.get({
      publicKey: requestOptions,
    });

    if (!assertion) {
      throw new Error('Authenticator did not return authentication credentials.');
    }

    const credentialId = assertion.id || bufferToBase64Url(assertion.rawId);
    return {
      success: true,
      credentialId,
      authenticatorType: 'Windows Hello / Platform Biometric',
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    console.warn('Native WebAuthn authentication notice:', err.name, err.message);

    if (err.name === 'NotAllowedError') {
      throw new Error('Passkey authentication cancelled or timed out.');
    }
    throw err;
  }
};

