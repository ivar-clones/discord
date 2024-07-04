import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateServer } from '@/core/service/server/use-create-server';
import { useAppState } from '@/store/provider';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';

export default function CreateServerButton() {
  const {
    state: { currentUser }
  } = useAppState();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string>('');
  const {
    mutate: createServer,
    error: createServerError,
    isSuccess: createServerSuccess
  } = useCreateServer();

  const handleCreateServer = () => {
    if (name) {
      createServer({ name, ownerId: currentUser.id });
    }
  };

  useEffect(() => {
    if (createServerSuccess) {
      setName('');
      setOpen(false);
    }
  }, [createServerSuccess]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className='h-14 w-14 rounded-full bg-primary-foreground flex justify-center items-center cursor-pointer'>
          <Icons.plus className='text-green-500 hover:text-green-600' />
        </div>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] p-0'>
        <div className='flex flex-col justify-between items-center'>
          <div className='text-xl font-bold text-primary p-4'>Customize Your Server</div>
          <div className='text-muted-foreground text-center p-2'>
            Give your new server a personality with a name and an icon. You can always change it
            later.
          </div>
          <div className='flex flex-col mt-4 rounded-full w-24 h-24 border-dashed border-white border-spacing-64 border-2 justify-center items-center'>
            <Label
              htmlFor='picture'
              className='mt-6 flex flex-col justify-center items-center cursor-pointer'
            >
              <Icons.camera />
              <div className='uppercase font-bold text-xs'>Upload</div>
            </Label>
            <Input id='picture' type='file' className='invisible' />
          </div>
          <div className='grid w-full max-w-sm items-center gap-1.5 mt-4'>
            <Label htmlFor='email' className='uppercase font-bold text-xs text-muted-foreground'>
              Server Name
            </Label>
            <Input
              type='text'
              id='name'
              placeholder={`${currentUser.username}'s server`}
              required
              minLength={5}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={createServerError ? 'border-red-500' : ''}
            />
          </div>
          <div className='h-16 mt-4 px-4 bg-primary-foreground w-full flex flex-row justify-end items-center'>
            <Button onClick={handleCreateServer}>Create</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
