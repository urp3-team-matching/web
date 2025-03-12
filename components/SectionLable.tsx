export default function SectionLable({ title }: { title: string }) {
  return (
    <div className="w-60 h-[120px] text-4xl font-medium flex justify-start px-5 items-center">
      {title}
    </div>
  );
}
