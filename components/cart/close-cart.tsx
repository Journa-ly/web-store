import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function CloseCart({ className }: { className?: string }) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center text-black transition-colors">
      <XMarkIcon className={clsx('h-6 transition-all ease-in-out hover:scale-110', className)} />
    </div>
  );
}
