import ApplyBadge from "@/components/Badge/ApplyBadge";
import ApplyStatueBadge from "@/components/Badge/ApplyStatueBadge";
import ProposalBadge from "@/components/Badge/ProposalBadge";

export default function Home() {
  return (
    <div className="w-full h-screen ">
      <ApplyBadge active={true} />
      <ApplyStatueBadge status="recruiting" />
      <ProposalBadge proposer="student" />
    </div>
  );
}
