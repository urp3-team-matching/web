export default function Footer() {
  return (
    <footer className="w-full bg-[#343338] text-white">
      {/* ✅ 헤더와 동일한 정렬 방식: justify-center + container */}
      <div className="flex w-full justify-center px-6">
        <div className="container py-8 md:py-10">
          <div className="flex flex-col items-start gap-8 md:flex-row md:justify-between md:gap-10">
            {/* Left */}
            <div className="min-w-0">
              <p className="text-[20px] leading-[24px] font-semibold tracking-[0.3px] md:text-[26px] md:leading-[28px]">
                SUNGKYUNKWAN UNIVERSITY (SKKU)
              </p>

              <p className="mt-[14px] text-[16px] leading-[22px] font-semibold md:text-[20px] md:leading-[24px]">
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
            <div className="shrink-0 md:text-right">
              <div className="inline-flex items-center justify-center rounded-full border-2 border-white px-5 py-[6px] text-[15px] leading-[24px] font-semibold md:px-[24px] md:text-[18px]">
                Email : urp3@skku.edu
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
