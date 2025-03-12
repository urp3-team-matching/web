import ApplyListPreview from "@/components/ListPreview/TeamsListPreview";
import { HotTopicPreviewList } from "@/components/ListPreview/HotTopicListPreview";
import { TopicPreviewList } from "@/components/ListPreview/TopicListPreview";

export default async function Home() {
  return (
    <div className="min-[1200px]:w-[1200px] flex-col flex w-full h-auto ">
      <div className="w-full flex  justify-between">
        <HotTopicPreviewList />
        <TopicPreviewList />
      </div>
      <ApplyListPreview />
    </div>
  );
}
