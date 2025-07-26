import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

export default function BottomHeaderBox() {
  return (
    <div className="w-full h-20 lg:h-24 flex flex-col">
      <div className="flex justify-center w-full h-full border-b-[1px] border-b-gray-300">
        <div className="headerWidth relative h-full lg:mx-5 mx-2 flex max-lg:justify-between items-center">
          <SidebarTrigger className="lg:hidden cursor-pointer" />
          <Link className="flex gap-1 sm:gap-2 items-center" href="/">
            <Image
              src="/skku/signature.png"
              alt="signature"
              className="sm:w-[200px] sm:h-[45px] w-[140px] h-[30px]"
              width={200}
              height={45}
            />
            <div className="w-[1px] h-5 bg-black" />
            <span className="text-[13px] sm:text-[26px] sm:pb-1 font-semibold text-gray-600 tracking-[-3px]">
              융합연구학점제 팀모집
            </span>
          </Link>
          <div></div>
          {/* <ul className="text-xl gap-20 hidden lg:flex lg:absolute right-0">
            <Link href="/">프로젝트</Link>
          </ul> */}
        </div>
      </div>
    </div>
  );
}
