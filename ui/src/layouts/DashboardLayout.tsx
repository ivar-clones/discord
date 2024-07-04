import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCreateUser } from '@/core/service/user/use-create-user';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/ui/icons';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';
import Loader from '@/components/local/Loader/Loader';
import { useGetChats } from '@/core/service/chat/use-get-chats';
import { useAppState } from '@/store/provider';
import useWebSocket from 'react-use-websocket';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import CreateServerButton from '@/components/local/Server/CreateServerButton';
import { useGetServers } from '@/core/service/server/use-get-servers';
import { Server } from '@/core/models/get-servers.interface';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    state: { chatList, currentUser },
    dispatch
  } = useAppState();
  const { isLoaded, signOut } = useAuth();
  const { user } = useUser();
  const { mutate: createUser, isPending, isError } = useCreateUser();
  const { data: chats, isLoading: isLoadingChats } = useGetChats(user?.id);
  const { data: servers } = useGetServers();

  useEffect(() => {
    if (user && user.username && user.id) {
      createUser({ id: user.id, username: user.username });
      dispatch({ type: 'SET_CURRENT_USER', payload: { id: user.id, username: user.username } });
    }
  }, [user, user?.username, createUser]);

  useWebSocket(`${import.meta.env.VITE_SERVICE_WS_URL}/ws/${currentUser.id}`, {
    share: true,
    shouldReconnect: () => true,
    retryOnError: true
  });

  useEffect(() => {
    if (isError && !isPending) {
      signOut();
    }
  }, [isError, isPending, signOut]);

  useEffect(() => {
    if (chats && chats.data) {
      dispatch({ type: 'SET_CHAT_LIST', payload: chats.data });
    }
  }, [chats]);

  if (!isLoaded || isPending) {
    return (
      <Loader
        text='Hold on while we log you in...'
        subtext='FACT: Good things happen to those who wait'
      />
    );
  }

  return (
    <>
      <div className='h-full min-w-16 max-w-16 bg-secondary'>
        <div className='flex flex-col h-full py-2 px-1 overflow-y-auto gap-2'>
          {servers?.data.map((server: Server) => (
            <Tooltip key={server.id}>
              <TooltipTrigger>
                <div
                  key={server.id}
                  className='flex flex-row gap-4 p-2 items-center rounded-md hover:bg-secondary hover:cursor-pointer h-14 w-14'
                >
                  <Avatar>
                    <AvatarImage src='https://utfs.io/f/b798a2bc-3424-463c-af28-81509ed61caa-o1drm6.png' />
                  </Avatar>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{server.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          <CreateServerButton />
        </div>
      </div>
      <div className='h-full min-w-72 max-w-72 bg-primary-foreground'>
        <div className='flex flex-col justify-between h-full'>
          <div className='flex-grow p-2 flex flex-col overflow-y-auto'>
            <div
              className={`flex flex-row gap-2 items-center py-2 px-4 rounded-md hover:bg-secondary hover:cursor-pointer ${location.pathname === '/friends' ? 'bg-secondary' : ''}`}
              onClick={() => navigate('/friends')}
            >
              <Icons.friends />
              <p>Friends</p>
            </div>
            <div className='text-xs text-muted-foreground mt-2 uppercase p-2'>Direct Messages</div>
            <div className='flex flex-col gap-2 py-3 px-2'>
              {!isLoadingChats && chatList
                ? chatList.map((chat) => (
                    <div
                      key={chat.id}
                      className={`flex flex-row gap-4 p-2 items-center rounded-md hover:bg-secondary hover:cursor-pointer ${location.pathname === `/chat/${chat.id}` ? 'bg-secondary' : ''}`}
                      onClick={() => navigate(`/chat/${chat.id}`)}
                    >
                      <Avatar>
                        <AvatarImage src='https://utfs.io/f/b798a2bc-3424-463c-af28-81509ed61caa-o1drm6.png' />
                      </Avatar>
                      <div>{chat.username}</div>
                    </div>
                  ))
                : null}
            </div>
          </div>
          <div className='bg-secondary h-16 flex flex-shrink items-center px-3 justify-between'>
            <div className='flex flex-row items-center gap-2'>
              <Avatar>
                <AvatarImage src='https://utfs.io/f/b798a2bc-3424-463c-af28-81509ed61caa-o1drm6.png' />
              </Avatar>
              <div className='flex flex-col'>
                <div>{user?.username}</div>
                <div className='text-xs text-muted-foreground'>Online</div>
              </div>
            </div>
            <div className='flex flex-row gap-2 items-center'>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div>
                    <Icons.settings
                      className='hover:cursor-pointer'
                      onClick={() => navigate('/settings/account')}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>

              <AlertDialog>
                <AlertDialogTrigger>
                  <Icons.logout />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will log you out of your account and you will need to log back in to
                      access your data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        signOut().then(() => {
                          dispatch({ type: 'CLEAR_STATE' });
                        });
                      }}
                    >
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col h-full w-full min-w-[70%]'>
        <Outlet />
      </div>
    </>
  );
}
