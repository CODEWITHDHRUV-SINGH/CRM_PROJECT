import { useCallback, useEffect, useState } from 'react';
import { leadsService } from '../services/leadsService';
import type {
  CreateLeadInput,
  Lead,
  LeadFilters,
  UpdateLeadInput,
} from '../types/lead.types';
import { getErrorMessage } from '../../../api/errorHandler';

export function useLeads(filters?: LeadFilters) {
  const [data, setData] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await leadsService.list(filters);
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [filters?.search, filters?.status, filters?.source]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const create = useCallback(async (input: CreateLeadInput) => {
    const lead = await leadsService.create(input);
    setData((curr) => [lead, ...curr]);
    return lead;
  }, []);

  const update = useCallback(async (input: UpdateLeadInput) => {
    const lead = await leadsService.update(input);
    setData((curr) => curr.map((l) => (l.id === lead.id ? lead : l)));
    return lead;
  }, []);

  const remove = useCallback(async (id: string) => {
    await leadsService.remove(id);
    setData((curr) => curr.filter((l) => l.id !== id));
  }, []);

  return { data, isLoading, error, refetch, create, update, remove };
}