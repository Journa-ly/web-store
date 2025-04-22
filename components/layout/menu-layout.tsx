import Menu from './search/menu';

interface MenuLayoutProps {
  children: React.ReactNode;
}

export default function MenuLayout({ children }: MenuLayoutProps) {
  return (
    <div className="mb-[48px] flex w-full flex-col gap-2 px-2 text-black lg:flex-row lg:px-6">
      <div className="order-first mb-12 hidden h-full w-full lg:sticky lg:top-4 lg:block lg:w-[300px] lg:min-w-[300px]">
        <Menu />
      </div>
      <>{children}</>
    </div>
  );
}
