import { useQuery } from '@tanstack/react-query';
import { ChatService } from './chat.service';

export const useGetChats = (userId?: string | null) => {
  const chatService = new ChatService();
  return useQuery({
    queryKey: ['chats', userId],
    queryFn: () => chatService.getAlLChats(userId),
    enabled: !!userId
  });
};
