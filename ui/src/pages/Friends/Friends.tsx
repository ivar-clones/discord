import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FriendRequest } from '@/core/models/get-friend-request.interface';
import { User } from '@/core/models/user.interface';
import { useGetFriends } from '@/core/service/user/use-get-friends';
import { useGetPendingFriendRequests } from '@/core/service/user/use-get-pending-friend-requests';
import { useRemoveFriend } from '@/core/service/user/use-remove-friend';
import { useSendFriendRequest } from '@/core/service/user/use-send-friend-request';
import { useUpdateFriendRequest } from '@/core/service/user/use-update-friend-request';
import { useIsLoggedIn } from '@/hooks/use-is-logged-in';
import { useAppState } from '@/store/provider';
import React from 'react';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Filter = 'all' | 'pending' | 'add-friend';

export default function FriendsPage() {
  useIsLoggedIn();
  const {
    state: { currentUser }
  } = useAppState();
  const navigate = useNavigate();
  const [friendToAdd, setFriendToAdd] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<Filter>('all');

  const { mutate: sendFriendRequest, isError, isSuccess } = useSendFriendRequest();
  const { data: pendingFriendRequests } = useGetPendingFriendRequests(currentUser?.id);
  const { data: friends } = useGetFriends(currentUser?.id);
  const { mutate: updateFriendRequest } = useUpdateFriendRequest();
  const { mutate: removeFriendRequest } = useRemoveFriend();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFriendToAdd(e.target.value);
  };

  const handleSendFriendRequest = () => {
    if (friendToAdd && currentUser && currentUser.username) {
      sendFriendRequest({ usernameA: currentUser.username, usernameB: friendToAdd });
      setFriendToAdd('');
    }
  };

  const handleUpdateFriendRequest = (id: number, accept: boolean) => {
    updateFriendRequest({ id, accept });
  };

  const handleRemoveFriend = (userIdToRemove: string) => {
    if (currentUser && currentUser.id && userIdToRemove) {
      removeFriendRequest({ currentUserId: currentUser.id, toRemoveUserId: userIdToRemove });
    }
  };

  return (
    <div className='flex flex-col h-full justify-start'>
      <div className='flex h-14 items-center shadow-topbar justify-between gap-2'>
        <ToggleGroup
          type='single'
          className='flex flex-row justify-between w-full mx-2'
          onValueChange={(val) => setSelectedFilter(val as Filter)}
        >
          <div className='flex flex-grow gap-2'>
            <ToggleGroupItem
              value='all'
              className={`text-md rounded-sm ${selectedFilter === 'all' ? 'bg-secondary' : 'bg-transparent'}`}
            >
              All
            </ToggleGroupItem>
            <ToggleGroupItem
              value='pending'
              className={`text-md rounded-sm ${selectedFilter === 'pending' ? 'bg-secondary' : 'bg-transparent'}`}
            >
              Pending
            </ToggleGroupItem>
          </div>
          <ToggleGroupItem value='add-friend' variant='outline'>
            Add Friend
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className='flex flex-grow overflow-y-auto my-4 px-4 flex-col'>
        {selectedFilter === 'add-friend' && (
          <React.Fragment>
            <div className='text-md'>ADD FRIEND</div>
            <div className='text-sm text-muted-foreground mt-1'>
              You can add friends with their username
            </div>
            <div className='flex mt-4 gap-2 items-center'>
              <Input
                type='text'
                placeholder='Enter a username to add.'
                className={`flex-grow ${!isError && isSuccess && 'border-green-600'}`}
                value={friendToAdd}
                onChange={handleInputChange}
              />
              <Button size='sm' onClick={handleSendFriendRequest}>
                Send Request
              </Button>
            </div>
            {!isError && isSuccess && (
              <p className='text-green-600 ml-1 mt-1'>Your request was sent successfully</p>
            )}
          </React.Fragment>
        )}
        {selectedFilter === 'pending' && (
          <React.Fragment>
            <React.Fragment>
              <div className='text-sm text-muted-foreground'>
                {pendingFriendRequests?.data?.length && pendingFriendRequests?.data?.length > 0 ? (
                  `PENDING - ${pendingFriendRequests?.data?.length}`
                ) : (
                  <p>There are no pending requests for now.</p>
                )}
              </div>

              <div className='my-4 flex flex-col gap-3'>
                {pendingFriendRequests?.data?.map((item: FriendRequest) => {
                  return (
                    <div className='flex flex-row justify-between items-center' key={item?.id}>
                      <div className='flex flex-row gap-2 items-center'>
                        <Avatar>
                          <AvatarImage src='https://utfs.io/f/b798a2bc-3424-463c-af28-81509ed61caa-o1drm6.png' />
                        </Avatar>
                        <div className='flex flex-col'>
                          <div>
                            {item?.userA.username === currentUser?.username
                              ? item?.userB?.username
                              : item?.userA?.username}
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            {item?.userA?.username === currentUser?.username
                              ? 'Outgoing friend request'
                              : 'Incoming friend request'}
                          </div>
                        </div>
                      </div>
                      <div className='flex flex-row gap-2'>
                        {item?.userA?.username !== currentUser?.username && (
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <Avatar
                                className='bg-primary-foreground items-center justify-center cursor-pointer'
                                onClick={() => handleUpdateFriendRequest(item?.id, true)}
                              >
                                <Icons.check className='hover:text-green-600' aria-label='Accept' />
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>Accept</TooltipContent>
                          </Tooltip>
                        )}

                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <Avatar
                              className='bg-primary-foreground items-center justify-center cursor-pointer'
                              onClick={() =>
                                handleRemoveFriend(
                                  item?.userA?.username === currentUser?.username
                                    ? item?.userB?.id
                                    : item?.userA?.id
                                )
                              }
                            >
                              <Icons.cancel className='hover:text-red-600' aria-label='Cancel' />
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>Cancel</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          </React.Fragment>
        )}
        {selectedFilter === 'all' && (
          <React.Fragment>
            <React.Fragment>
              <div className='text-sm text-muted-foreground'>
                {friends?.data?.length && friends?.data?.length > 0 ? (
                  `FRIENDS - ${friends?.data?.length}`
                ) : (
                  <p>There are no friends for now.</p>
                )}
              </div>

              <div className='my-4 flex flex-col gap-3'>
                {friends?.data?.map((friend: User) => {
                  return (
                    <div
                      className='flex flex-row justify-between items-center hover:bg-secondary rounded-sm p-2'
                      key={friend.id}
                    >
                      <div className='flex flex-row gap-2 items-center'>
                        <Avatar>
                          <AvatarImage src='https://utfs.io/f/b798a2bc-3424-463c-af28-81509ed61caa-o1drm6.png' />
                        </Avatar>
                        <div className='flex flex-col'>
                          <div>{friend.username}</div>
                        </div>
                      </div>
                      <div className='flex flex-row gap-2'>
                        {friend && (
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <Avatar
                                className='bg-primary-foreground items-center justify-center cursor-pointer'
                                onClick={() => navigate(`/chat/${friend.id}`)}
                              >
                                <Icons.message
                                  className='hover:text-muted-foreground'
                                  aria-label='Remove'
                                />
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>Message</TooltipContent>
                          </Tooltip>
                        )}
                        {friend && (
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <Avatar
                                className='bg-primary-foreground items-center justify-center cursor-pointer'
                                onClick={() => handleRemoveFriend(friend.id)}
                              >
                                <Icons.cancel className='hover:text-red-600' aria-label='Remove' />
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>Remove</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
