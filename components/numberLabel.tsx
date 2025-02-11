const NumberLabel = ({ children, label }: { children: string; label?: string }) => (
  <div className="flex items-center gap-3">
    <div className="flex h-[29px] w-[29px] items-center justify-center rounded-full bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      {children}
    </div>
    {label && <span className="text-center text-sm text-gray-500">{label}</span>}
  </div>
);

export default NumberLabel;
