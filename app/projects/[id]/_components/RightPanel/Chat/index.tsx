import {
  PublicApplicant,
  PublicProjectWithForeignKeys,
} from "@/lib/apiClientHelper";
import { ApplicantStatus } from "@prisma/client";
import ChatField from "./ChatField";

export enum Tab {
  모집관리 = "manageChat",
}

interface ChatProps {
  className?: string;
  project: PublicProjectWithForeignKeys;
  applicants: PublicApplicant[];
  onApplicantStatusChange: (
    applicantId: number,
    status: ApplicantStatus
  ) => void;
}

const Chat = ({ className, project }: ChatProps) => {
  return (
    <div className={className}>
      <div className="w-full *:w-16 *:text-center *:cursor-pointer border-b-2 flex justify-center gap-5 h-10 items-center text-secondary">
        채팅방
      </div>

      <ChatField project={project} />
    </div>
  );
};

export default Chat;
