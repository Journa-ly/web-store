import Menu from 'components/layout/search/menu';

export default function Collections({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-2 flex max-w-screen-2xl flex-col mb-[48px] text-black md:flex-row lg:mx-6 gap-2">
        <div className="order-first h-full w-full md:max-w-[300px] hidden lg:block mb-12">
          <Menu />
        </div>
        <div className="order-last min-h-screen w-full md:order-none">
          {children}
        </div>
      </div>
    </>
  );
}
