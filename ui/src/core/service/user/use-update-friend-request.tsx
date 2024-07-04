import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from './user.service';
import { updateFriendRequest } from '@/core/models/update-friend-request.interface';

export const useUpdateFriendRequest = () => {
  const queryClient = useQueryClient();
  const userService = new UserService();
  return useMutation({
    mutationFn: (data: updateFriendRequest) => userService.updateFriendRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    }
  });
};
