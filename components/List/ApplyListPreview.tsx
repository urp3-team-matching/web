import ApplyCard from "../Card/ApplyCard";
import SectionLable from "../SectionLable";
import ShowMoreButton from "../ShowMoreButton";

export default function ApplyListPreview() {
  return (
    <div className="w-full h-auto">
      <SectionLable title="모집" />
      <div className="flex flex-col gap-2">
        {[...Array(4)].map((_, i) => (
          <ApplyCard
            key={i}
            status="closingSoon"
            title="성균융합원 팀모집 플랫폼 주제로 팀원을 구하고 있습니다."
            active={true}
            name="손장수"
            view={110202}
            date={new Date("2025-03-06")}
            description="프론트/백앤드 경험이 있으신 분 연락주세요"
          />
        ))}
      </div>
      <ShowMoreButton href="/teams" />
    </div>
  );
}
