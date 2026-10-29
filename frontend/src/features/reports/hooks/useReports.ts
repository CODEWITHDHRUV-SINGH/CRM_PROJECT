import { useEffect, useState } from 'react';
import { reportsService } from '../services/reportsService';
import type {
  CollectionsReport,
  PipelineReport,
  ReportRange,
  SalesReport,
} from '../types/report.types';
import { getErrorMessage } from '../../../api/errorHandler';

export function useSalesReport(range: ReportRange) {
  const [data, setData] = useState<SalesReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    reportsService
      .getSalesReport(range)
      .then((r) => { if (!cancelled) { setData(r); setIsLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(getErrorMessage(err)); setIsLoading(false); } });
    return () => { cancelled = true; };
  }, [range]);

  return { data, isLoading, error };
}

export function usePipelineReport(range: ReportRange) {
  const [data, setData] = useState<PipelineReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    reportsService
      .getPipelineReport(range)
      .then((r) => { if (!cancelled) { setData(r); setIsLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(getErrorMessage(err)); setIsLoading(false); } });
    return () => { cancelled = true; };
  }, [range]);

  return { data, isLoading, error };
}

export function useCollectionsReport(range: ReportRange) {
  const [data, setData] = useState<CollectionsReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    reportsService
      .getCollectionsReport(range)
      .then((r) => { if (!cancelled) { setData(r); setIsLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(getErrorMessage(err)); setIsLoading(false); } });
    return () => { cancelled = true; };
  }, [range]);

  return { data, isLoading, error };
}