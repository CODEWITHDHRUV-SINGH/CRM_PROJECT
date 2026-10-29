import { useCallback, useEffect, useState } from 'react';
import { invoicesService } from '../services/invoicesService';
import type { Payment, PaymentFilters } from '../types/invoice.types';
import { getErrorMessage } from '../../../api/errorHandler';

export function usePayments(filters?: PaymentFilters) {
  const [data, setData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await invoicesService.listPayments(filters);
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [filters?.search, filters?.method, filters?.status]);

  useEffect(() => { refetch(); }, [refetch]);

  const refund = useCallback(async (id: string) => {
    const result = await invoicesService.refundPayment(id);
    setData((curr) => curr.map((p) => (p.id === result.payment.id ? result.payment : p)));
    return result;
  }, []);

  return { data, isLoading, error, refetch, refund };
}