import Menu from 'components/layout/search/menu';

export default function Collections({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-2 flex max-w-screen-2xl flex-col gap-8 mb-[48px] text-black md:flex-row lg:mx-6">
        <div className="order-first h-full w-full md:max-w-[300px] hidden md:block mb-12">
          <Menu />
        </div>
        <div className="order-last min-h-screen w-full md:order-none">
          {children}
        </div>
      </div>
    </>
  );
}
