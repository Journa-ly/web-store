import { TruckIcon } from '@heroicons/react/24/outline';

export default function FreeShipping() {
  return (
    <div className="flex items-center text-sm font-bold" style={{ color: '#00B5FF' }}>
      <span className="mr-3">Free Shipping on all orders</span>
      <div className="relative flex items-center pl-3">
        {/* Horizontal speed lines (right-aligned) */}
        <div className="absolute left-0 top-1/2 flex w-3 -translate-y-1/2 flex-col items-end space-y-0.5">
          <div className="h-[1px] w-2 bg-current opacity-30"></div>
          <div className="h-[1px] w-2.5 bg-current opacity-50"></div>
          <div className="h-[1px] w-3 bg-current opacity-70"></div>
        </div>
        <TruckIcon className="relative z-10 h-5 w-5" aria-hidden="true" />
      </div>
    </div>
  );
}
