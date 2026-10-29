import { useCallback, useEffect, useState } from 'react';
import { teamService } from '../services/teamService';
import type {
  CreateMemberInput,
  TeamFilters,
  TeamMember,
  UpdateMemberInput,
} from '../types/team.types';
import { getErrorMessage } from '../../../api/errorHandler';

export function useTeam(filters?: TeamFilters) {
  const [data, setData] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await teamService.list(filters);
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [filters?.search, filters?.role, filters?.status]);

  useEffect(() => { refetch(); }, [refetch]);

  const invite = useCallback(async (input: CreateMemberInput) => {
    const member = await teamService.invite(input);
    setData((curr) => [member, ...curr]);
    return member;
  }, []);

  const update = useCallback(async (input: UpdateMemberInput) => {
    const member = await teamService.update(input);
    setData((curr) => curr.map((m) => (m.id === member.id ? member : m)));
    return member;
  }, []);

  const resendInvite = useCallback(async (id: string) => {
    const member = await teamService.resendInvite(id);
    setData((curr) => curr.map((m) => (m.id === member.id ? member : m)));
    return member;
  }, []);

  const remove = useCallback(async (id: string) => {
    await teamService.remove(id);
    setData((curr) => curr.filter((m) => m.id !== id));
  }, []);

  return { data, isLoading, error, refetch, invite, update, resendInvite, remove };
}