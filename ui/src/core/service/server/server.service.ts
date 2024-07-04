import { CreateServerRequest } from '@/core/models/create-server.interface';
import { Server } from '@/core/models/get-servers.interface';

export class ServerService {
  createServer = async ({ name, ownerId }: CreateServerRequest) => {
    return await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/v1/servers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, ownerId })
    }).then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
    });
  };

  getServers = async (): Promise<{ data: Server[] } | void> => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/v1/servers`, {
        method: 'GET'
      });
      return res.json();
    } catch (e) {
      return console.error(e);
    }
  };
}
