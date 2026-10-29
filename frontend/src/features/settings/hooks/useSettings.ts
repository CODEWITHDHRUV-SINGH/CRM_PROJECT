import { useCallback, useEffect, useState } from 'react';
import { settingsService } from '../services/settingsService';
import type {
  Integration,
  IntegrationProvider,
  NotificationPreferences,
  Organization,
  SecuritySettings,
  UpdateOrganizationInput,
} from '../types/settings.types';
import { getErrorMessage } from '../../../api/errorHandler';

export function useOrganization() {
  const [data, setData] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true); setError(null);
    try { setData(await settingsService.getOrganization()); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  const update = useCallback(async (input: UpdateOrganizationInput) => {
    const updated = await settingsService.updateOrganization(input);
    setData(updated);
    return updated;
  }, []);

  return { data, isLoading, error, refetch, update };
}

export function useIntegrations() {
  const [data, setData] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true); setError(null);
    try { setData(await settingsService.getIntegrations()); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  const toggle = useCallback(async (provider: IntegrationProvider) => {
    const updated = await settingsService.toggleIntegration(provider);
    setData((curr) => curr.map((i) => (i.provider === provider ? updated : i)));
    return updated;
  }, []);

  return { data, isLoading, error, refetch, toggle };
}

export function useNotificationPreferences() {
  const [data, setData] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    settingsService.getNotificationPreferences()
      .then((r) => { if (!cancelled) { setData(r); setIsLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(getErrorMessage(err)); setIsLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  const update = useCallback(async (input: NotificationPreferences) => {
    const updated = await settingsService.updateNotificationPreferences(input);
    setData(updated);
    return updated;
  }, []);

  return { data, isLoading, error, update };
}

export function useSecuritySettings() {
  const [data, setData] = useState<SecuritySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    settingsService.getSecuritySettings()
      .then((r) => { if (!cancelled) { setData(r); setIsLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(getErrorMessage(err)); setIsLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  const update = useCallback(async (input: SecuritySettings) => {
    const updated = await settingsService.updateSecuritySettings(input);
    setData(updated);
    return updated;
  }, []);

  return { data, isLoading, error, update };
}