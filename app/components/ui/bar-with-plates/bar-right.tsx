export function BarRight({ weight }: { weight: number }) {
  return (
    <div className="flex items-center justify-center h-[20px] min-w-[30px] rounded-r-xs text-sm font-medium bg-gray-500">
      {weight}
    </div>
  );
}
