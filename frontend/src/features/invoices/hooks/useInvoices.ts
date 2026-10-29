import { useCallback, useEffect, useState } from 'react';
import { invoicesService } from '../services/invoicesService';
import type {
  CreateInvoiceInput,
  CreatePaymentInput,
  Invoice,
  InvoiceFilters,
  UpdateInvoiceInput,
} from '../types/invoice.types';
import { getErrorMessage } from '../../../api/errorHandler';

export function useInvoices(filters?: InvoiceFilters) {
  const [data, setData] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await invoicesService.listInvoices(filters);
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [filters?.search, filters?.status]);

  useEffect(() => { refetch(); }, [refetch]);

  const create = useCallback(async (input: CreateInvoiceInput) => {
    const invoice = await invoicesService.createInvoice(input);
    setData((curr) => [invoice, ...curr]);
    return invoice;
  }, []);

  const update = useCallback(async (input: UpdateInvoiceInput) => {
    const invoice = await invoicesService.updateInvoice(input);
    setData((curr) => curr.map((i) => (i.id === invoice.id ? invoice : i)));
    return invoice;
  }, []);

  const voidInvoice = useCallback(async (id: string) => {
    const invoice = await invoicesService.voidInvoice(id);
    setData((curr) => curr.map((i) => (i.id === invoice.id ? invoice : i)));
    return invoice;
  }, []);

  const addPayment = useCallback(async (input: CreatePaymentInput) => {
    const result = await invoicesService.addPayment(input);
    setData((curr) => curr.map((i) => (i.id === result.invoice.id ? result.invoice : i)));
    return result;
  }, []);

  return { data, isLoading, error, refetch, create, update, voidInvoice, addPayment };
}