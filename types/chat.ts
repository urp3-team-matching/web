// components/Chat/chatTypes.ts
export type MessageFromDB = {
  id: bigint | number; // Supabase에서 bigint는 number 또는 string으로 올 수 있음
  content: string;
  userId: string;
  username: string;
  projectId: number;
  createdAt: string; // ISO 문자열 형태
};

export type ChatMessageContent = {
  id: bigint | number | string;
  text: string;
  time: string;
};

export type ChatItemGroup = {
  name: string;
  userId: string;
  isCurrentUser: boolean;
  content: ChatMessageContent[];
};
