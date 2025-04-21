import Menu from './search/menu';

interface MenuLayoutProps {
  children: React.ReactNode;
}

export default function MenuLayout({ children }: MenuLayoutProps) {
  return (
    <div className="mx-auto mb-[48px] flex w-full max-w-screen-2xl flex-col gap-4 px-2 text-black lg:flex-row lg:px-6">
      <div className="order-first mb-12 hidden h-full w-full lg:sticky lg:top-4 lg:block lg:w-[300px] lg:min-w-[300px]">
        <Menu />
      </div>
      {/* Vertical divider - only visible on md screens and up */}
      <div className="hidden h-auto w-px self-stretch bg-gray-200 lg:block"></div>
      <div className="order-last min-h-screen w-full lg:order-none lg:px-4">{children}</div>
    </div>
  );
}
