'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { LogEntry, LogType, PaginatedLogResponse } from '@/features/log/types';
import { fetchLogs as fetchLogsAction } from '@/app/logs/actions';

export type LogFilter = 'all' | LogType;

interface UseLogListReturn {
  logs: LogEntry[];
  loading: boolean;
  hasMore: boolean;
  activeFilter: LogFilter;
  setActiveFilter: (filter: LogFilter) => void;
  sentinelRef: (node: HTMLDivElement | null) => void;
  setLogs: (updater: LogEntry[] | ((prev: LogEntry[]) => LogEntry[])) => void;
}

export function useLogList(babyId: string): UseLogListReturn {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilter, setActiveFilterState] = useState<LogFilter>('all');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelNodeRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const fetchLogs = useCallback(
    async (cursorVal: string | null, reset: boolean) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);

      try {
        const types = activeFilter === 'all' ? undefined : [activeFilter as LogType];
        const response: PaginatedLogResponse = await fetchLogsAction(
          babyId,
          cursorVal,
          20,
          types
        );

        setLogs((prev) => {
          if (reset) return response.items;
          const existingIds = new Set(prev.map((l) => l.id));
          const newItems = response.items.filter((item) => !existingIds.has(item.id));
          return [...prev, ...newItems];
        });
        setCursor(response.nextCursor);
        setHasMore(response.nextCursor !== null);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [babyId, activeFilter]
  );

  useEffect(() => {
    setLogs([]);
    setCursor(null);
    setHasMore(true);
    fetchLogs(null, true);
  }, [fetchLogs]);

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
            fetchLogs(cursor, false);
          }
        },
        { rootMargin: '200px' }
      );

      if (node) {
        observerRef.current.observe(node);
        sentinelNodeRef.current = node;
      }
    },
    [hasMore, cursor, fetchLogs]
  );

  const setActiveFilter = useCallback((filter: LogFilter) => {
    setActiveFilterState(filter);
  }, []);

  return { logs, loading, hasMore, activeFilter, setActiveFilter, sentinelRef, setLogs };
}

