import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TeamMember, EmailLogEntry, AutomationLogEntry, AdminSheetConfig } from '../types';
import { fetchLiveTeamData } from '../services/sheetService';
import { getDemoTeamMembers, getMemberNameMeaningDetails, getMemberSpecialDayMatch } from '../data/fallbackData';
import { formatProfileImageUrl } from '../utils/imageUtils';

interface UseTeamDataResult {
  teamMembers: TeamMember[];
  adminConfig: AdminSheetConfig;
  automationLogs: AutomationLogEntry[];
  emailLogs: EmailLogEntry[];
  isLoading: boolean;
  isSyncing: boolean;
  isRealtimeConnected: boolean;
  lastSynced: string;
  error: string | null;
  refetch: (isSilent?: boolean) => Promise<void>;
  refetchEmailLogs: () => Promise<void>;
  refetchAutomationLogs: () => Promise<void>;
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  setAdminConfig: React.Dispatch<React.SetStateAction<AdminSheetConfig>>;
  setEmailLogs: React.Dispatch<React.SetStateAction<EmailLogEntry[]>>;
  setAutomationLogs: React.Dispatch<React.SetStateAction<AutomationLogEntry[]>>;
}

export function useTeamData(
  autoSyncEnabled: boolean = true,
  sentYearMap: Record<string, string> = {}
): UseTeamDataResult {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => getDemoTeamMembers());
  const [adminConfig, setAdminConfig] = useState<AdminSheetConfig>({
    senderWhatsApp: '+8801625299521',
    adminWhatsApp: '+8801625299521',
    adminEmail: 'anik.barua@kdsgroup.net',
    source: 'google_sheet_default',
    isAutoDetected: true,
    sheetName: 'Central IE List',
    detectedRole: 'IE Central Management (Danushka Wanniarachchi / Anik Barua)',
    lastSynced: ''
  });
  const [automationLogs, setAutomationLogs] = useState<AutomationLogEntry[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Active AbortControllers to prevent race conditions
  const syncAbortControllerRef = useRef<AbortController | null>(null);
  const logsAbortControllerRef = useRef<AbortController | null>(null);
  const emailLogsAbortControllerRef = useRef<AbortController | null>(null);

  // Stable ref for sentYearMap to prevent unnecessary aborts
  const sentYearMapRef = useRef(sentYearMap);
  useEffect(() => {
    sentYearMapRef.current = sentYearMap;
  }, [sentYearMap]);

  // Real-Time Server-Sent Events (SSE) connection to listen for Google Sheet onEdit webhooks
  useEffect(() => {
    let sse: EventSource | null = null;
    let reconnectTimeout: any = null;

    const connectSSE = () => {
      try {
        sse = new EventSource('/api/realtime/stream');

        sse.onopen = () => {
          setIsRealtimeConnected(true);
        };

        sse.onmessage = (event) => {
          if (!event.data) return;
          try {
            const parsed = JSON.parse(event.data);
            if (parsed.type === 'CONFIG_UPDATE' || parsed.type === 'INITIAL_STATE' || parsed.type === 'DATA_UPDATE' || parsed.type === 'SHEET_UPDATE') {
              if (parsed.config) {
                setAdminConfig((prev) => ({
                  ...prev,
                  ...parsed.config,
                  senderWhatsApp: parsed.config.senderWhatsApp || prev.senderWhatsApp,
                  adminWhatsApp: parsed.config.adminWhatsApp || prev.adminWhatsApp,
                  adminEmail: parsed.config.adminEmail || prev.adminEmail,
                  lastSynced: parsed.config.lastSynced || new Date().toLocaleTimeString(),
                  syncId: parsed.config.syncId
                }));
                setLastSynced(new Date().toLocaleTimeString());
              }
              if (parsed.fullData && Array.isArray(parsed.fullData) && parsed.fullData.length > 0) {
                const currentMap = sentYearMapRef.current;
                const merged = parsed.fullData.map((m: TeamMember) => {
                  const key = m.id || m.sl;
                  const localSentYear = currentMap[key];
                  const rawImg = m.imageUrl || (m as any).ImageUrl || (m as any).image || (m as any).Image || (m as any)['Image URL'] || (m as any)['Image_URL'] || '';
                  const formattedImg = rawImg ? formatProfileImageUrl(rawImg) : undefined;
                  const details = getMemberNameMeaningDetails(m.name);
                  const specialDay = m.specialDayMatch || getMemberSpecialDayMatch(m.birthday, m.name);
                  return {
                    ...m,
                    imageUrl: formattedImg || m.imageUrl,
                    nameMeaning: m.nameMeaning || details.note,
                    nameMeaningEmoji: m.nameMeaningEmoji || details.emoji,
                    nameMeaningNote: m.nameMeaningNote || details.note,
                    nameEtymology: m.nameEtymology || details.etymology,
                    inspiringNote: m.inspiringNote || details.inspiringNote,
                    specialDayMatch: specialDay,
                    lastSentYear: localSentYear !== undefined && localSentYear !== '' ? localSentYear : m.lastSentYear || ''
                  };
                });
                setTeamMembers(merged);
              } else {
                refetch(true);
              }
            }
          } catch (_e) {
            // Non-JSON or heartbeat
          }
        };

        sse.onerror = () => {
          setIsRealtimeConnected(false);
          if (sse) {
            sse.close();
            sse = null;
          }
          // Retry connection after 5s
          reconnectTimeout = setTimeout(connectSSE, 5000);
        };
      } catch (_err) {
        setIsRealtimeConnected(false);
      }
    };

    connectSSE();

    return () => {
      if (sse) sse.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  // Fetch Sheet Data with AbortController
  const refetch = useCallback(async (isSilent: boolean = false) => {
    // Cancel any in-flight sheet fetch request
    if (syncAbortControllerRef.current) {
      syncAbortControllerRef.current.abort();
    }
    const controller = new AbortController();
    syncAbortControllerRef.current = controller;

    if (!isSilent) {
      setIsSyncing(true);
    }
    setError(null);

    try {
      const result = await fetchLiveTeamData();

      // If aborted during fetch, do not commit state updates
      if (controller.signal.aborted) {
        return;
      }

      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        const currentMap = sentYearMapRef.current;
        const mergedMembers = result.data.map((m: TeamMember) => {
          const key = m.id || m.sl;
          const localSentYear = currentMap[key];
          const details = getMemberNameMeaningDetails(m.name);
          const specialDay = m.specialDayMatch || getMemberSpecialDayMatch(m.birthday, m.name);
          return {
            ...m,
            nameMeaning: m.nameMeaning || details.note,
            nameMeaningEmoji: m.nameMeaningEmoji || details.emoji,
            nameMeaningNote: m.nameMeaningNote || details.note,
            nameEtymology: m.nameEtymology || details.etymology,
            inspiringNote: m.inspiringNote || details.inspiringNote,
            specialDayMatch: specialDay,
            lastSentYear:
              localSentYear !== undefined && localSentYear !== ''
                ? localSentYear
                : m.lastSentYear || ''
          };
        });

        setTeamMembers(mergedMembers);
        if (result.adminConfig) {
          setAdminConfig(result.adminConfig);
        }
        if (result.error) {
          setError(result.error);
        }
        setLastSynced(new Date().toLocaleTimeString());
      } else {
        setTeamMembers((prev) => (prev.length > 0 ? prev : getDemoTeamMembers()));
        if (result.adminConfig) {
          setAdminConfig(result.adminConfig);
        }
        if (result.error) {
          setError(result.error);
        }
        setLastSynced(new Date().toLocaleTimeString());
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return;
      }
      console.error('Error fetching sheet data in hook:', err);
      setError('Unable to sync live sheet data. Showing cached baseline roster.');
      setTeamMembers((prev) => (prev.length > 0 ? prev : getDemoTeamMembers()));
    } finally {
      if (syncAbortControllerRef.current === controller) {
        syncAbortControllerRef.current = null;
        if (!isSilent) {
          setIsSyncing(false);
          setIsLoading(false);
        }
      }
    }
  }, []);

  // Fetch Automation Logs with AbortController
  const refetchAutomationLogs = useCallback(async () => {
    if (logsAbortControllerRef.current) {
      logsAbortControllerRef.current.abort();
    }
    const controller = new AbortController();
    logsAbortControllerRef.current = controller;

    try {
      const res = await fetch('/api/automation-logs', { signal: controller.signal });
      if (!res.ok) return;
      const data = await res.json();
      if (controller.signal.aborted) return;

      if (data.logs && Array.isArray(data.logs)) {
        setAutomationLogs(data.logs);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      // Benign if server route is not present (static deployment)
    } finally {
      if (logsAbortControllerRef.current === controller) {
        logsAbortControllerRef.current = null;
      }
    }
  }, []);

  // Fetch Email Logs with AbortController
  const refetchEmailLogs = useCallback(async () => {
    if (emailLogsAbortControllerRef.current) {
      emailLogsAbortControllerRef.current.abort();
    }
    const controller = new AbortController();
    emailLogsAbortControllerRef.current = controller;

    try {
      const res = await fetch('/api/email-logs', { signal: controller.signal });
      if (!res.ok) return;
      const data = await res.json();
      if (controller.signal.aborted) return;

      if (data.logs && Array.isArray(data.logs)) {
        setEmailLogs(data.logs);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
    } finally {
      if (emailLogsAbortControllerRef.current === controller) {
        emailLogsAbortControllerRef.current = null;
      }
    }
  }, []);

  // Initial Load & Automatic polling loop
  useEffect(() => {
    let isMounted = true;

    const initialLoad = async () => {
      setIsLoading(true);
      await Promise.allSettled([refetch(false), refetchAutomationLogs(), refetchEmailLogs()]);
      if (isMounted) {
        setIsLoading(false);
      }
    };

    initialLoad();

    const intervalId = setInterval(() => {
      if (autoSyncEnabled) {
        refetch(true);
        refetchAutomationLogs();
        refetchEmailLogs();
      }
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      if (syncAbortControllerRef.current) syncAbortControllerRef.current.abort();
      if (logsAbortControllerRef.current) logsAbortControllerRef.current.abort();
      if (emailLogsAbortControllerRef.current) emailLogsAbortControllerRef.current.abort();
    };
  }, [autoSyncEnabled, refetch, refetchAutomationLogs, refetchEmailLogs]);

  return {
    teamMembers,
    adminConfig,
    automationLogs,
    emailLogs,
    isLoading,
    isSyncing,
    isRealtimeConnected,
    lastSynced,
    error,
    refetch,
    refetchEmailLogs,
    refetchAutomationLogs,
    setTeamMembers,
    setAdminConfig,
    setEmailLogs,
    setAutomationLogs
  };
}
