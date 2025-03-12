import ApplyListPreview from "@/components/ListPreview/ApplyListPreview";
import { HotTopicPreviewList } from "@/components/ListPreview/HotTopicListPreview";
import { TopicPreviewList } from "@/components/ListPreview/TopicListPreview";

export default async function Home() {
  return (
    <div className="min-[1200px]:w-[1200px] flex-col flex w-full h-auto ">
      <div className="w-full flex mb-16 justify-between">
        <HotTopicPreviewList />
        <TopicPreviewList />
      </div>
      <ApplyListPreview />
    </div>
  );
}
