import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from './user.service';
import { RemoveFriendRequest } from '@/core/models/remove-friend.interface';

export const useRemoveFriend = () => {
  const userService = new UserService();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RemoveFriendRequest) => userService.removeFriend(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
    }
  });
};
