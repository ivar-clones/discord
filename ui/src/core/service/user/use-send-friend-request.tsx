import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from './user.service';
import { SendFriendRequest } from '@/core/models/send-friend-request.interface';

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();
  const userService = new UserService();
  return useMutation({
    mutationFn: (data: SendFriendRequest) => userService.sendFriendRequest(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['friend-requests'] })
  });
};
