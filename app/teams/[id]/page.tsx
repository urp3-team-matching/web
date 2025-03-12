"use client";
import TitleHeader from "@/components/TitleHeader";
import { fakeTeams } from "@/constants/fakeInfo/fakeTeams";
import { useParams } from "next/navigation";

export default function TeamPage() {
  const { id } = useParams();
  const team = fakeTeams.find((teams) => teams.id === id);
  return (
    <div className="min-[1200px]:w-[1200px] w-full flex flex-col gap-5 ">
      <TitleHeader title={team?.title as string}></TitleHeader>
      <span>{team?.name}</span>
      <span>{team?.date.toDateString()}</span>
      <span>{team?.view}</span>
      <p>{team?.leaderIntroduction}</p>
      <p> {team?.qualification}</p>
      <p> {team?.leadingProfessor}</p>
      <p>{team?.extraDescription}</p>
    </div>
  );
}
