import { Icons } from '@/components/ui/icons';

interface LoaderProps {
  text?: string;
  subtext?: string;
}

export default function Loader({ text, subtext }: LoaderProps) {
  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-row gap-2 place-items-center'>
          <Icons.spinner className='animate-spin h-10'></Icons.spinner>
          {text && <p>{text}</p>}
        </div>
        {subtext && <p className='text-sm text-muted-foreground -ml-4 font-bold'>{subtext}</p>}
      </div>
    </div>
  );
}
