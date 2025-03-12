"use client";
import TitleHeader from "@/components/TitleHeader";

import { fakeTopics } from "@/constants/fakeInfo/fakeTopics";
import { useParams } from "next/navigation";

export default function TopicPage() {
  const { id } = useParams();
  const topic = fakeTopics.find((topic) => topic.id === id);
  return (
    <div className="min-[1200px]:w-[1200px] w-full flex flex-col gap-5 ">
      <TitleHeader title={topic?.title as string}></TitleHeader>
      <span>{topic?.name}</span>
      <span>{topic?.date.toDateString()}</span>
      <span>{topic?.view}</span>
      <p>{topic?.projectType}</p>
      <p> {topic?.background}</p>
      <p> {topic?.goal}</p>
      <p>{topic?.methodology}</p>
    </div>
  );
}
