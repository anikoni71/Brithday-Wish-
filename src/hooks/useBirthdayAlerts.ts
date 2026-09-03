import { useState, useEffect, useCallback } from 'react';
import { BirthdayAlert, TeamMember } from '../types';

const STORAGE_KEY = 'birthday_alerts_preferences';

export function useBirthdayAlerts() {
  const [alerts, setAlerts] = useState<Record<string, BirthdayAlert>>({});

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setAlerts(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse birthday alerts from localStorage', e);
      }
    }
  }, []);

  // Save to localStorage whenever alerts change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  }, [alerts]);

  const toggleAlert = useCallback((member: TeamMember) => {
    setAlerts((prev) => {
      const id = member.id || member.sl;
      const existing = prev[id];
      
      const updated = { ...prev };
      if (existing) {
        if (existing.enabled) {
          updated[id] = { ...existing, enabled: false };
        } else {
          updated[id] = { ...existing, enabled: true };
        }
      } else {
        updated[id] = {
          memberId: id,
          memberName: member.name,
          birthday: member.birthday,
          enabled: true,
        };
      }
      return updated;
    });
  }, []);

  const isAlertEnabled = useCallback((memberId: string) => {
    return alerts[memberId]?.enabled || false;
  }, [alerts]);

  const markAsNotified = useCallback((memberId: string, year: number) => {
    setAlerts((prev) => {
      if (!prev[memberId]) return prev;
      return {
        ...prev,
        [memberId]: {
          ...prev[memberId],
          lastNotifiedYear: year,
        },
      };
    });
  }, []);

  return {
    alerts,
    toggleAlert,
    isAlertEnabled,
    markAsNotified,
  };
}
