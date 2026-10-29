import { useCallback, useEffect, useState } from 'react';
import { companiesService } from '../services/companiesService';
import type {
  Company,
  CompanyFilters,
  CreateCompanyInput,
  UpdateCompanyInput,
} from '../types/company.types';
import { getErrorMessage } from '../../../api/errorHandler';

export function useCompanies(filters?: CompanyFilters) {
  const [data, setData] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await companiesService.list(filters);
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [filters?.search, filters?.status, filters?.industry, filters?.size]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const create = useCallback(async (input: CreateCompanyInput) => {
    const company = await companiesService.create(input);
    setData((curr) => [company, ...curr]);
    return company;
  }, []);

  const update = useCallback(async (input: UpdateCompanyInput) => {
    const company = await companiesService.update(input);
    setData((curr) => curr.map((c) => (c.id === company.id ? company : c)));
    return company;
  }, []);

  const remove = useCallback(async (id: string) => {
    await companiesService.remove(id);
    setData((curr) => curr.filter((c) => c.id !== id));
  }, []);

  return { data, isLoading, error, refetch, create, update, remove };
}