export default function Footer() {
  return (
    <footer className="w-full bg-[#343338] text-white px-6">
      {/* ✅ 헤더와 동일하게: container로 폭 맞추기 */}
      <div className="container py-10">
        <div className="flex items-start justify-between gap-10">
          {/* Left */}
          <div className="min-w-0">
            <p className="text-[26px] leading-[28px] font-semibold tracking-[0.3px]">
              SUNG KYUN KWAN UNIVERSITY (SKKU)
            </p>

            <p className="mt-[14px] text-[20px] leading-[24px] font-semibold">
              성균관대학교 성균융합원 융합연구학점제
            </p>

            <p className="mt-[12px] text-[12px] leading-[18px]">
              이 홈페이지는 2025학년도 1학기 융합연구학점제 수행팀 &apos;김장순&apos;팀과 성균융합원행정실이
              협업하여 제작하였습니다.
            </p>

            <p className="mt-[10px] text-[12px] leading-[18px]">
              COPYRIGHT © 2024 SKKU Institute for Cross-disciplinary Studies ALL RIGHTS RESERVED
            </p>
          </div>

          {/* Right (TEL만) */}
          <div className="shrink-0 text-right">
            <div className="inline-flex items-center justify-center rounded-full border-2 border-white px-[24px] py-[6px] text-[18px] leading-[24px] font-semibold">
              TEL : 031.290.5703
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
