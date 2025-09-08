import { logout } from "@/actions/auth";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function TopHeaderBox() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

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
            <div className=" bg-white w-[1px] h-[11px]"></div>
          </div>
          {error || !data?.user ? (
            <div className="flex items-center gap-3">
              <Link href="/login">ADMIN</Link>
            </div>
          ) : (
            <form action={logout} className="flex items-center gap-3">
              <button type="submit" className="hover:cursor-pointer">
                Logout
              </button>
            </form>
          )}
        </ul>
      </div>
    </div>
  );
}
