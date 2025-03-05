import BottomHeaderBox from "./BottomHeaderBox";
import TopHeaderBox from "./TopHeaderBox";

export default function Header() {
  return (
    <div className="w-full h-auto flex flex-col">
      <TopHeaderBox />
      <BottomHeaderBox />
    </div>
  );
}
