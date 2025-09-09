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
      <ChatField project={project} />
    </div>
  );
};

export default Chat;
