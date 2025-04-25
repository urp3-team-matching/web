export default function KeywordBadge({ keyword }: { keyword: string }) {
  return (
    <div className="h-5 px-2.5 text-sm font-medium py-1 bg-gray-200 rounded-full inline-flex justify-center items-center gap-2.5">
      {`#` + keyword}
    </div>
  );
}
