import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function Account() {
  return (
    <div className='flex flex-col -mt-2 w-full'>
      <div className='text-xl'>My Account</div>
      <div className='flex flex-col h-[30rem] mt-4 rounded-xl'>
        <div className='flex basis-1/4 bg-slate-300 rounded-xl rounded-bl-none rounded-br-none'></div>
        <div className='flex basis-3/4 bg-primary-foreground rounded-xl rounded-tl-none rounded-tr-none'>
          <div className='flex flex-row h-fit w-full justify-between px-2 mt-2'>
            <div className='flex flex-row'>
              <div className='flex flex-col gap-4 p-2 items-center rounded-md relative -top-8 left-2'>
                <Avatar className='h-20 w-20 shadow-avatar'>
                  <AvatarImage src='https://utfs.io/f/b798a2bc-3424-463c-af28-81509ed61caa-o1drm6.png' />
                </Avatar>
              </div>
              <div className='text-xl ml-5 mt-2 font-bold text-white'>Tak1za</div>
            </div>
            <Button size='sm' variant='secondary'>
              Edit User Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
