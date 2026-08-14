/**
 * Browser Web Notifications API & Tab Badge Manager
 */

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function areNotificationsEnabled(): boolean {
  return isNotificationSupported() && Notification.permission === 'granted';
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) {
    console.warn('Browser does not support notifications.');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return false;
  }
}

export function sendBrowserNotification(
  title: string,
  options?: {
    body?: string;
    icon?: string;
    tag?: string;
    data?: any;
    requireInteraction?: boolean;
    onClick?: () => void;
  }
): Notification | null {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }

  try {
    const notification = new Notification(title, {
      body: options?.body,
      icon: options?.icon || 'https://api.iconify.design/twemoji:birthday-cake.svg',
      badge: 'https://api.iconify.design/twemoji:party-popper.svg',
      tag: options?.tag || 'ie-birthday-alert',
      requireInteraction: options?.requireInteraction || false,
      data: options?.data,
    });

    if (options?.onClick) {
      notification.onclick = (e) => {
        window.focus();
        options.onClick?.();
        notification.close();
      };
    }

    return notification;
  } catch (err) {
    console.warn('Failed to dispatch native browser notification:', err);
    return null;
  }
}

export function sendBrowserBirthdayNotification(title: string, bodyText: string, onClick?: () => void): Notification | null {
  return sendBrowserNotification(title, {
    body: bodyText,
    icon: 'https://api.iconify.design/twemoji:birthday-cake.svg',
    requireInteraction: true,
    onClick,
  });
}

/**
 * Dynamically updates the browser tab title with a badge counter
 */
export function updateTabTitle(badgeCount: number, prefixText?: string): void {
  if (typeof document === 'undefined') return;

  const baseTitle = 'IE Central Team Birthday Wisher';

  if (badgeCount > 0) {
    const icon = prefixText || '🎂';
    document.title = `(${badgeCount}) ${icon} ${baseTitle}`;
  } else {
    document.title = baseTitle;
  }
}

export function updateDocumentTitleWithBirthdayReminder(todayCount: number, dueSoonCount: number): void {
  const total = todayCount + dueSoonCount;
  if (todayCount > 0) {
    updateTabTitle(todayCount, '🎉');
  } else if (dueSoonCount > 0) {
    updateTabTitle(dueSoonCount, '🔔');
  } else {
    updateTabTitle(0);
  }
}
