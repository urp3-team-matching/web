export default function Footer() {
  return (
    <footer className="w-full bg-[#343338] text-white">
      {/* ✅ 헤더와 동일한 정렬 방식: justify-center + container */}
      <div className="flex w-full justify-center px-6">
        <div className="container py-10">
          <div className="flex items-start justify-between gap-10">
            {/* Left */}
            <div className="min-w-0">
              <p className="text-[26px] leading-[28px] font-semibold tracking-[0.3px]">
                SUNGKYUN KWAN UNIVERSITY (SKKU)
              </p>

              <p className="mt-[14px] text-[20px] leading-[24px] font-semibold">
                성균관대학교 성균융합원 융합연구학점제
              </p>

              <p className="mt-[12px] text-[12px] leading-[18px]">
                이 홈페이지는 2025학년도 1학기 융합연구학점제 수행팀 &apos;김장순&apos;팀과 성균융합원행정실이
                협업하여 제작하였습니다.
              </p>

              <p className="mt-[10px] text-[12px] leading-[18px]">
                COPYRIGHT © 2025 SKKU Institute for Cross-disciplinary Studies ALL RIGHTS RESERVED
              </p>
            </div>

            {/* Right (Email) */}
            <div className="shrink-0 text-right">
              <div className="inline-flex items-center justify-center rounded-full border-2 border-white px-[24px] py-[6px] text-[18px] leading-[24px] font-semibold">
                Email : urp3@skku.edu
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
