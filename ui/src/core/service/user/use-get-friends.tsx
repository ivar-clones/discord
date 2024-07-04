import { useQuery } from '@tanstack/react-query';
import { UserService } from './user.service';

export const useGetFriends = (userId?: string | null) => {
  const userService = new UserService();
  return useQuery({
    queryKey: ['friends', userId],
    queryFn: () => userService.getFriends(userId),
    enabled: !!userId
  });
};
