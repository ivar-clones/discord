import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ServerService } from './server.service';
import { CreateServerRequest } from '@/core/models/create-server.interface';

export const useCreateServer = () => {
  const serverService = new ServerService();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateServerRequest) => serverService.createServer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
    }
  });
};
