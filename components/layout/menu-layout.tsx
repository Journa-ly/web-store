import Menu from './search/menu';

interface MenuLayoutProps {
  children: React.ReactNode;
}

export default function MenuLayout({ children }: MenuLayoutProps) {
  return (
    <div className="mx-auto px-2 mb-[48px] flex w-full max-w-screen-2xl flex-col gap-8 text-black md:flex-row lg:px-6">
      <div className="order-first mb-12 hidden h-full w-full md:block md:w-[300px] md:min-w-[300px] md:sticky md:top-4">
        <Menu />
      </div>
      {/* Vertical divider - only visible on md screens and up */}
      <div className="hidden md:block w-px bg-gray-200 h-auto self-stretch"></div>
      <div className="order-last min-h-screen w-full md:order-none md:px-4">{children}</div>
    </div>
  );
} 