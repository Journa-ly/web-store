export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-2 mb-12 flex max-w-screen-2xl flex-col gap-8 text-black md:flex-row lg:mx-6">
        <div className="min-h-screen w-full p-16">{children}</div>
      </div>
    </>
  );
}
