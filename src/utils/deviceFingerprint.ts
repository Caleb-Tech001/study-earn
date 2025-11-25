/**
 * Generate a device fingerprint for device trust functionality
 * This creates a unique identifier for the user's device
 */
export const generateDeviceFingerprint = async (): Promise<string> => {
  const components: string[] = [];

  // Screen resolution
  components.push(`${window.screen.width}x${window.screen.height}`);
  components.push(`${window.screen.colorDepth}`);

  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Language
  components.push(navigator.language);

  // Platform
  components.push(navigator.platform);

  // User agent
  components.push(navigator.userAgent);

  // Hardware concurrency (CPU cores)
  if (navigator.hardwareConcurrency) {
    components.push(navigator.hardwareConcurrency.toString());
  }

  // Device memory (if available)
  if ('deviceMemory' in navigator) {
    components.push((navigator as any).deviceMemory.toString());
  }

  // Canvas fingerprint
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('StudyEarn', 2, 2);
      components.push(canvas.toDataURL());
    }
  } catch (e) {
    // Canvas fingerprinting might be blocked
  }

  // Combine all components
  const fingerprintString = components.join('|');

  // Hash the fingerprint using Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(fingerprintString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
};

/**
 * Get device type based on screen size and user agent
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const ua = navigator.userAgent;
  const width = window.screen.width;

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }

  if (width < 768) {
    return 'mobile';
  } else if (width < 1024) {
    return 'tablet';
  }

  return 'desktop';
};

/**
 * Get a human-readable device name
 */
export const getDeviceName = (): string => {
  const ua = navigator.userAgent;
  const type = getDeviceType();

  if (/iPhone/.test(ua)) return 'iPhone';
  if (/iPad/.test(ua)) return 'iPad';
  if (/Android/.test(ua)) {
    const match = ua.match(/Android\s([0-9.]*)/);
    return match ? `Android ${match[1]}` : 'Android Device';
  }
  if (/Windows/.test(ua)) return 'Windows PC';
  if (/Mac/.test(ua)) return 'Mac';
  if (/Linux/.test(ua)) return 'Linux PC';

  return `${type.charAt(0).toUpperCase() + type.slice(1)} Device`;
};