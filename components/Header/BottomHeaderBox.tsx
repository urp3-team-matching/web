import Image from "next/image";
import Link from "next/link";

export default function BottomHeaderBox() {
  return (
    <div className="w-full h-24 flex flex-col">
      <div className="flex justify-center w-full h-full border-b-[1px] border-b-gray-300">
        <div className="w-[1200px] relative h-full max-[1080px]:justify-center flex  items-center">
          <Link className="flex gap-2 items-center" href="/">
            <Image src="/logo.png" alt="logo" width={200} height={45} />
            <div className="w-[1px] h-5 bg-black" />
            <span className="text-[26px] pb-1 font-semibold text-gray-600 tracking-[-3px]">
              융합연구학점제 팀모집
            </span>
          </Link>
          <ul className="max-[1080px]:hidden text-xl gap-20 flex  absolute right-0">
            <Link href="/topics">주제제안</Link>
            <Link href="/teams">팀원모집</Link>
          </ul>
        </div>
      </div>
    </div>
  );
}
