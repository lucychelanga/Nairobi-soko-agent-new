import type { MarketAlert, UrgencyLevel } from '../types';

const NOTIFIED_STORAGE_KEY = 'soko_notified_alert_ids';
const NOTIFICATIONS_ENABLED_KEY = 'soko_notifications_enabled';

// In-memory set of notified alert IDs for this session
const notifiedAlertIds = new Set<string>();

// Load previously notified IDs from localStorage
try {
  const saved = localStorage.getItem(NOTIFIED_STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      parsed.forEach((id) => notifiedAlertIds.add(id));
    }
  }
} catch (e) {
  console.warn('Could not read notified alert IDs from localStorage', e);
}

/**
 * Check if the browser supports Notification API
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Get current browser notification permission
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Check if notifications are enabled by user preference in app
 */
export function isUserNotificationsEnabled(): boolean {
  if (!isNotificationSupported()) return false;
  const val = localStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
  if (val === null) {
    // Default to true if permission is already granted
    return Notification.permission === 'granted';
  }
  return val === 'true';
}

/**
 * Set user notification preference
 */
export function setUserNotificationsEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, String(enabled));
  } catch (e) {
    console.warn('Could not persist notification setting', e);
  }
}

/**
 * Request notification permission from browser
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setUserNotificationsEnabled(true);
    }
    return permission;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return Notification.permission;
  }
}

/**
 * Play subtle, elegant Web Audio chime for market alerts
 */
export function playMarketAudioChime(type: 'spike' | 'glut' | 'info' = 'info'): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'spike') {
      // Urgent rising harmonic alert
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'glut') {
      // Pleasant descending chime for buyer savings
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.18); // C5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else {
      // Subtle pulse
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch {
    // Ignore audio context errors in restricted iframe/browser environments
  }
}

/**
 * Low-level notification sender wrapper
 */
export function sendBrowserNotification(
  title: string,
  options?: NotificationOptions & { playAudio?: boolean; audioType?: 'spike' | 'glut' | 'info' }
): Notification | null {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }

  if (!isUserNotificationsEnabled()) {
    return null;
  }

  try {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });

    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      notification.close();
    };

    if (options?.playAudio !== false) {
      playMarketAudioChime(options?.audioType || 'info');
    }

    return notification;
  } catch (err) {
    console.warn('Failed to construct browser notification:', err);
    return null;
  }
}

/**
 * Dispatch notification for a specific Market Alert (Surge / Glut / Anomaly)
 * Filters for significant surges or drops (e.g. CRITICAL_SPIKE or HIGH_GLUT_BUY_NOW)
 */
export function notifyMarketAlert(alert: MarketAlert, force: boolean = false): boolean {
  if (!force && notifiedAlertIds.has(alert.id)) {
    // Already notified this alert
    return false;
  }

  // Check if it's a significant price surge or glut
  const isSignificant =
    alert.urgencyLevel === 'CRITICAL_SPIKE' ||
    alert.urgencyLevel === 'HIGH_GLUT_BUY_NOW';

  if (!isSignificant && !force) {
    return false;
  }

  const isSpike = alert.urgencyLevel === 'CRITICAL_SPIKE';
  const prefix = isSpike ? '🚨 PRICE SURGE' : '🥬 SUPPLY GLUT (BUY)';
  const title = `${prefix}: ${alert.commodity} @ ${alert.marketName}`;
  const body = `${alert.alertTitle}\n${alert.alertMessage}`;

  const notification = sendBrowserNotification(title, {
    body,
    tag: `soko-alert-${alert.id}`,
    requireInteraction: isSpike,
    playAudio: true,
    audioType: isSpike ? 'spike' : 'glut',
  });

  if (notification || Notification.permission === 'granted') {
    notifiedAlertIds.add(alert.id);
    try {
      localStorage.setItem(
        NOTIFIED_STORAGE_KEY,
        JSON.stringify(Array.from(notifiedAlertIds).slice(-50))
      );
    } catch {
      // Ignore storage errors
    }
    return true;
  }

  return false;
}

/**
 * Process a batch of alerts and notify about any new significant surges/gluts
 */
export function checkAndNotifyAlerts(alerts: MarketAlert[]): number {
  let notifiedCount = 0;
  if (!alerts || alerts.length === 0) return 0;

  alerts.forEach((alert) => {
    if (notifyMarketAlert(alert)) {
      notifiedCount++;
    }
  });

  return notifiedCount;
}

/**
 * Send a test notification to verify browser & OS notification center configuration
 */
export function triggerTestNotification(): boolean {
  const testAlert: MarketAlert = {
    id: `test-${Date.now()}`,
    commodity: 'Nyanya (Tomatoes)',
    marketName: 'Wakulima / Marikiti',
    urgencyLevel: 'CRITICAL_SPIKE',
    alertTitle: 'Test Surge Alert: 18% Price Hike Observed',
    alertMessage: 'Cross-border transport delays via Namanga have reduced supply. 64kg crates trading up to KES 4,800.',
    timestamp: new Date().toISOString(),
  };

  return notifyMarketAlert(testAlert, true);
}
