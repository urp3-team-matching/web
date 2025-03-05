import ApplyCard from "@/components/Card/ApplyCard";
import { HotTopicPreviewList } from "@/components/List/HotTopicListPreview";
import { TopicPreviewList } from "@/components/List/TopicListPreview";

export default function Home() {
  return (
    <div className="min-[1200px]:w-[1200px] flex-col flex w-full h-screen ">
      <div className="w-full flex mb-16 justify-between">
        <HotTopicPreviewList />
        <TopicPreviewList />
      </div>
      <ApplyCard
        title="모빌리티/로봇 메타버스 디지털트윈 기반 고장관리 인공지능 에이전트"
        name="김훈모"
        view={1003}
        date={new Date("2025-03-06")}
        active={true}
        description="모빌리티/로봇 메타버스 디지털트윈 기반 고장관리 인공지능 에이전트"
        status="recruiting"
      />
    </div>
  );
}
