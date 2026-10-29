import { useCallback, useEffect, useState } from 'react';
import { dealsService } from '../services/dealsService';
import type {
  CreateDealInput,
  Deal,
  DealFilters,
  DealStage,
  UpdateDealInput,
} from '../types/deal.types';
import { getErrorMessage } from '../../../api/errorHandler';

export function useDeals(filters?: DealFilters) {
  const [data, setData] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await dealsService.list(filters);
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [filters?.search, filters?.stage, filters?.source]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const create = useCallback(async (input: CreateDealInput) => {
    const deal = await dealsService.create(input);
    setData((curr) => [deal, ...curr]);
    return deal;
  }, []);

  const update = useCallback(async (input: UpdateDealInput) => {
    const deal = await dealsService.update(input);
    setData((curr) => curr.map((d) => (d.id === deal.id ? deal : d)));
    return deal;
  }, []);

  const moveStage = useCallback(async (id: string, stage: DealStage) => {
    // Optimistic update
    setData((curr) => curr.map((d) => (d.id === id ? { ...d, stage } : d)));
    try {
      const deal = await dealsService.moveStage(id, stage);
      setData((curr) => curr.map((d) => (d.id === deal.id ? deal : d)));
      return deal;
    } catch (err) {
      await refetch();
      throw err;
    }
  }, [refetch]);

  const remove = useCallback(async (id: string) => {
    await dealsService.remove(id);
    setData((curr) => curr.filter((d) => d.id !== id));
  }, []);

  return { data, isLoading, error, refetch, create, update, moveStage, remove };
}