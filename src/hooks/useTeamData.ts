import { useState, useEffect, useRef, useCallback } from 'react';
import { TeamMember, EmailLogEntry, AutomationLogEntry } from '../types';
import { fetchLiveTeamData } from '../services/sheetService';
import { getDemoTeamMembers } from '../data/fallbackData';

interface UseTeamDataResult {
  teamMembers: TeamMember[];
  automationLogs: AutomationLogEntry[];
  emailLogs: EmailLogEntry[];
  isLoading: boolean;
  isSyncing: boolean;
  lastSynced: string;
  error: string | null;
  refetch: (isSilent?: boolean) => Promise<void>;
  refetchEmailLogs: () => Promise<void>;
  refetchAutomationLogs: () => Promise<void>;
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  setEmailLogs: React.Dispatch<React.SetStateAction<EmailLogEntry[]>>;
  setAutomationLogs: React.Dispatch<React.SetStateAction<AutomationLogEntry[]>>;
}

export function useTeamData(
  autoSyncEnabled: boolean = true,
  sentYearMap: Record<string, string> = {}
): UseTeamDataResult {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => getDemoTeamMembers());
  const [automationLogs, setAutomationLogs] = useState<AutomationLogEntry[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
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
          return {
            ...m,
            lastSentYear:
              localSentYear !== undefined && localSentYear !== ''
                ? localSentYear
                : m.lastSentYear || ''
          };
        });

        setTeamMembers(mergedMembers);
        setLastSynced(new Date().toLocaleTimeString());
      } else {
        setTeamMembers((prev) => (prev.length > 0 ? prev : getDemoTeamMembers()));
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
    automationLogs,
    emailLogs,
    isLoading,
    isSyncing,
    lastSynced,
    error,
    refetch,
    refetchEmailLogs,
    refetchAutomationLogs,
    setTeamMembers,
    setEmailLogs,
    setAutomationLogs
  };
}
