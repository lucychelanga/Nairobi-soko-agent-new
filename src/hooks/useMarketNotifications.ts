import { useState, useEffect, useCallback } from 'react';
import {
  isNotificationSupported,
  getNotificationPermission,
  isUserNotificationsEnabled,
  setUserNotificationsEnabled,
  requestNotificationPermission,
  checkAndNotifyAlerts,
  triggerTestNotification,
  notifyMarketAlert,
} from '../utils/notifications';
import type { MarketAlert } from '../types';

export function useMarketNotifications(alerts: MarketAlert[] = []) {
  const [supported, setSupported] = useState<boolean>(false);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [lastNotificationStatus, setLastNotificationStatus] = useState<string | null>(null);

  useEffect(() => {
    const isSupp = isNotificationSupported();
    setSupported(isSupp);
    if (isSupp) {
      setPermission(getNotificationPermission());
      setIsEnabled(isUserNotificationsEnabled());
    } else {
      setPermission('unsupported');
      setIsEnabled(false);
    }
  }, []);

  // Whenever new alerts arrive, evaluate for significant surges or drops
  useEffect(() => {
    if (alerts && alerts.length > 0 && isEnabled && permission === 'granted') {
      const count = checkAndNotifyAlerts(alerts);
      if (count > 0) {
        setLastNotificationStatus(`Dispatched ${count} browser alert(s) for significant market movements.`);
      }
    }
  }, [alerts, isEnabled, permission]);

  const requestPermission = useCallback(async () => {
    const newPerm = await requestNotificationPermission();
    setPermission(newPerm);
    if (newPerm === 'granted') {
      setIsEnabled(true);
      setLastNotificationStatus('Browser notifications activated successfully.');
    } else if (newPerm === 'denied') {
      setIsEnabled(false);
      setLastNotificationStatus('Notifications were blocked in your browser settings.');
    }
    return newPerm;
  }, []);

  const toggleEnabled = useCallback(() => {
    if (permission !== 'granted') {
      requestPermission();
      return;
    }
    const nextVal = !isEnabled;
    setIsEnabled(nextVal);
    setUserNotificationsEnabled(nextVal);
    setLastNotificationStatus(nextVal ? 'Market notifications enabled.' : 'Market notifications muted.');
  }, [permission, isEnabled, requestPermission]);

  const sendTest = useCallback(() => {
    if (permission !== 'granted') {
      requestPermission().then((res) => {
        if (res === 'granted') {
          triggerTestNotification();
          setLastNotificationStatus('Dispatched test surge alert to OS notification tray.');
        }
      });
      return;
    }
    const sent = triggerTestNotification();
    if (sent) {
      setLastNotificationStatus('Dispatched test surge alert to OS notification tray.');
    }
  }, [permission, requestPermission]);

  return {
    supported,
    permission,
    isEnabled,
    toggleEnabled,
    requestPermission,
    sendTest,
    notifyAlert: notifyMarketAlert,
    lastNotificationStatus,
  };
}
