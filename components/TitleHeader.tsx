export default function TitleHeader({ title }: { title: string }) {
  return (
    <div className="w-full h-auto break-words text-balance text-4xl font-bold py-3 px-2 border-b-[1px] border-black">
      {title}
    </div>
  );
}
