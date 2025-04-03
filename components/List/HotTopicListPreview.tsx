import HotProjectCard from "../Card/HotProjectCard";
import SectionLable from "../SectionLable";

export function HotProjectPreviewList() {
  return (
    <div className="w-[487px] h-auto">
      <SectionLable title="인기" />
      <div className="w-full gap-2 h-auto grid-cols-2 grid-rows-2 grid">
        {[...Array(4)].map((_, i) => (
          <HotProjectCard
            key={i}
            title="모빌리티/로봇 메타버스 디지털트윈 기반 고장관리 인공지능 에이전트"
            name="김훈모"
            view={1003}
            date={new Date("2025-03-06")}
            proposer="student"
          ></HotProjectCard>
        ))}
      </div>
    </div>
  );
}
