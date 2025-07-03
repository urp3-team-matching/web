import Link from "next/link";

export default function TopHeaderBox() {
  return (
    <div className="justify-center hidden px-6 lg:flex py-1.5 w-full h-10 bg-third">
      <div className="flex justify-between h-full container">
        <span className="text-white mt-0.5 text-[15px] lett font-light tracking-[-0.5px]">
          Inspiring Future, Grand Challenge
        </span>
        <ul className="flex text-[12px] gap-3  text-white tracking-[-0.5px]">
          <div className="flex items-center gap-3">
            <Link href="https://urp3.skku.edu/urp3/index.do">HOME</Link>
            <div className=" bg-white w-[1px] h-[11px]"></div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="https://www.skku.edu/skku/index.do">SKKU</Link>
            <div className=" bg-white w-[1px] h-[11px]"></div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="https://urp3.skku.edu/urp3/sitemap.do">SITEMAP</Link>
          </div>
        </ul>
      </div>
    </div>
  );
}
