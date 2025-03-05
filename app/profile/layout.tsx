import Menu from 'components/layout/search/menu';

export default function Collections({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-2 mb-[48px] flex max-w-screen-2xl flex-col gap-8 text-black md:flex-row lg:mx-6">
        <div className="order-first mb-12 hidden h-full w-full md:block md:max-w-[300px]">
          <Menu />
        </div>
        <div className="hidden md:block w-px bg-gray-200 h-auto self-stretch"></div>
        <div className="order-last min-h-screen w-full md:order-none">{children}</div>
      </div>
    </>
  );
}
