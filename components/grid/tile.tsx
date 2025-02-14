import clsx from 'clsx';
import Image from 'next/image';
import Label from '../label';

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: 'bottom' | 'center';
  };
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx('group card h-full w-full bg-base-100 p-2', {
        'transition-shadow duration-300 hover:shadow-sm': isInteractive,
        'border-2 border-accent': active,
        'border border-base-200': !active
      })}
    >
      <figure className="relative aspect-[5/4] w-full">
        {props.src ? (
          <Image
            className={clsx('h-full w-full object-contain transition-transform duration-300', {
              'hover:scale-[1.02]': isInteractive
            })}
            {...props}
          />
        ) : null}
      </figure>

      {label && (
        <div className="p-0 pt-2">
          <div
            className={clsx('flex flex-col', {
              'justify-center text-center': label.position === 'center',
              'justify-start': label.position === 'bottom'
            })}
          >
            <h3 className="line-clamp-2 text-xs font-medium leading-tight text-base-content/80">
              {label.title}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}
