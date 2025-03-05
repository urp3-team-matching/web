import ApplyBadge from "@/components/Badge/ApplyBadge";
import ApplyStatueBadge from "@/components/Badge/ApplyStatueBadge";
import ProposalBadge from "@/components/Badge/ProposalBadge";
import HotTopicCard from "@/components/Card/HotTopicCard";
import TopicCard from "@/components/Card/TopicCard";

export default function Home() {
  return (
    <div className="w-full h-screen ">
      <ApplyBadge active={true} />
      <ApplyStatueBadge status="recruiting" />
      <ProposalBadge proposer="student" />
      <TopicCard
        title="모빌리티/로봇 메타버스 디지털트윈 기반 고장관리 인공지능 에이전트"
        name="김훈모"
        view={1003}
        date={new Date("2025-03-06")}
        proposer="student"
      />
      <HotTopicCard
        title="모빌리티/로봇 메타버스 디지털트윈 기반 고장관리 인공지능 에이전트"
        name="김훈모"
        view={1003}
        date={new Date("2025-03-06")}
        proposer="student"
      />
    </div>
  );
}
