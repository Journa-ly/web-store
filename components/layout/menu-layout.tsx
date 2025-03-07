import Menu from './search/menu';

interface MenuLayoutProps {
  children: React.ReactNode;
}

export default function MenuLayout({ children }: MenuLayoutProps) {
  return (
    <div className="mx-auto mb-[48px] flex w-full max-w-screen-2xl flex-col gap-8 px-2 text-black md:flex-row lg:px-6">
      <div className="order-first mb-12 hidden h-full w-full md:sticky md:top-4 md:block md:w-[300px] md:min-w-[300px]">
        <Menu />
      </div>
      {/* Vertical divider - only visible on md screens and up */}
      <div className="hidden h-auto w-px self-stretch bg-gray-200 md:block"></div>
      <div className="order-last min-h-screen w-full md:order-none md:px-4">{children}</div>
    </div>
  );
}
