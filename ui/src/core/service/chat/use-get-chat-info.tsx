import { useMutation } from '@tanstack/react-query';
import { ChatService } from './chat.service';
import { ChatInfoRequest } from '@/core/models/chat-info-request.interface';

export const useChatInfo = () => {
  const chatService = new ChatService();
  return useMutation({
    mutationFn: (data: ChatInfoRequest) => chatService.getChatInfo(data)
  });
};
