import { useCallback, useEffect, useState } from 'react';
import { contactsService } from '../services/contactsService';
import type {
  Contact,
  ContactFilters,
  CreateContactInput,
  UpdateContactInput,
} from '../types/contact.types';
import { getErrorMessage } from '../../../api/errorHandler';

export function useContacts(filters?: ContactFilters) {
  const [data, setData] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await contactsService.list(filters);
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [filters?.search, filters?.status, filters?.role]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const create = useCallback(async (input: CreateContactInput) => {
    const contact = await contactsService.create(input);
    setData((curr) => [contact, ...curr]);
    return contact;
  }, []);

  const update = useCallback(async (input: UpdateContactInput) => {
    const contact = await contactsService.update(input);
    setData((curr) => curr.map((c) => (c.id === contact.id ? contact : c)));
    return contact;
  }, []);

  const remove = useCallback(async (id: string) => {
    await contactsService.remove(id);
    setData((curr) => curr.filter((c) => c.id !== id));
  }, []);

  return { data, isLoading, error, refetch, create, update, remove };
}