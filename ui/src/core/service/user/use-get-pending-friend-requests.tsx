import { useQuery } from '@tanstack/react-query';
import { UserService } from './user.service';

export const useGetPendingFriendRequests = (userId?: string | null) => {
  const userService = new UserService();
  return useQuery({
    queryKey: ['friend-requests', userId],
    queryFn: () => userService.getPendingFriendRequests(userId),
    enabled: !!userId
  });
};
