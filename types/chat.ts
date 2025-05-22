export type MessageFromDB = {
  id: string | bigint | number;
  content: string;
  userId: string;
  username: string;
  projectId: number;
  createdDatetime: string;
};

export type ChatMessageContent = {
  id: string | bigint | number;
  text: string;
  time: string;
};

export type ChatItemGroup = {
  name: string;
  userId: string;
  isCurrentUser: boolean;
  content: ChatMessageContent[];
};
