import { useQuery } from '@tanstack/react-query';
import { ServerService } from './server.service';

export const useGetServers = () => {
  const serverService = new ServerService();
  return useQuery({
    queryKey: ['servers'],
    queryFn: () => serverService.getServers()
  });
};
