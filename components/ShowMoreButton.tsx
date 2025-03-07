import Link from "next/link";

export default function ShowMoreButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="w-full mt-2 h-14  p-5 items-center shadow-lg rounded-md bg-white border-2 flex justify-center"
    >
      더보기
    </Link>
  );
}
