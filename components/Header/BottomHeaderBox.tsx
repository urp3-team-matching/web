import Image from "next/image";
import Link from "next/link";

export default function BottomHeaderBox() {
  return (
    <div className="flex justify-center w-full h-24">
      <div className="h-full mx-5 flex items-center justify-between w-full container">
        <Link className="flex gap-2 items-center" href="/">
          <Image src="/logo.png" alt="logo" width={200} height={45} />
          <div className="w-[1px] h-5 bg-black" />
          <span className="text-[26px] pb-1 font-semibold text-gray-600 tracking-[-3px]">
            융합연구학점제 팀모집
          </span>
        </Link>
        <ul className="text-xl gap-20 flex">
          <Link href="/">프로젝트</Link>
          <Link href="/notice">공지사항</Link>
        </ul>
      </div>
    </div>
  );
}
