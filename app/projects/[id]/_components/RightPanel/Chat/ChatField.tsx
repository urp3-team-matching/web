import { ScrollArea } from "@/components/ui/scroll-area"; // ShadCN/UI 컴포넌트 경로
import { Textarea } from "@/components/ui/textarea"; // ShadCN/UI 컴포넌트 경로
import { supabase } from "@/lib/supabaseClient"; // Supabase 클라이언트 경로 (실제 경로에 맞게 수정)
import type {
  ChatItemGroup,
  ChatMessageContent,
  MessageFromDB,
} from "@/types/chat"; // 타입 정의 경로 (실제 경로에 맞게 수정)
import { Send } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react"; // KeyboardEvent 추가
import ChatBubble from "./ChatBubble"; // ChatBubble 컴포넌트 경로 (실제 경로에 맞게 수정)

// 가상 쿠키 및 사용자 정보 관리 함수 (실제 프로덕션에서는 더 견고한 방식 고려)
const getOrCreateUserId = (): string => {
  const cookieKey = "chat_user_id";
  let userId = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieKey}=`))
    ?.split("=")[1];
  if (!userId) {
    userId = `usr_${Date.now().toString(36)}${Math.random()
      .toString(36)
      .substring(2, 7)}`;
    const expires = new Date(
      Date.now() + 365 * 24 * 60 * 60 * 1000
    ).toUTCString(); // 1년 후 만료
    document.cookie = `${cookieKey}=${userId}; path=/; expires=${expires}; SameSite=Lax`;
  }
  return userId;
};

const SKKU_MASCOTS_PREFIX = [
  "명륜에서 온",
  "율전에서 온",
  "고뇌하는",
  "열정적인",
  "코딩하는",
];
const SKKU_MASCOTS_SUFFIX = ["킹고", "금잔디", "명륜이", "율전이", "학우"];
const getRandomUsername = (userId: string): string => {
  const prefixIndex = userId.length % SKKU_MASCOTS_PREFIX.length;
  const suffixIndex =
    (userId.charCodeAt(0) + userId.length) % SKKU_MASCOTS_SUFFIX.length;
  const uniquePart = userId.substring(userId.length - 4, userId.length - 1);
  return `${SKKU_MASCOTS_PREFIX[prefixIndex]} ${SKKU_MASCOTS_SUFFIX[suffixIndex]} (${uniquePart})`;
};

// Supabase 메시지 목록을 ChatItemGroup[] 형태로 변환하는 함수
const transformMessagesForDisplay = (
  messages: MessageFromDB[],
  currentUserId: string
): ChatItemGroup[] => {
  if (!messages || messages.length === 0) return [];

  const grouped: ChatItemGroup[] = [];
  let lastGroup: ChatItemGroup | null = null;

  messages.forEach((msg) => {
    const messageContentItem: ChatMessageContent = {
      id: msg.id,
      text: msg.content,
      time: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };

    // 이전 그룹이 있고, 이전 그룹의 사용자와 현재 메시지 사용자가 동일한 경우
    if (lastGroup && lastGroup.userId === msg.userId) {
      lastGroup.content.push(messageContentItem);
    } else {
      // 새 그룹 생성
      const newGroup: ChatItemGroup = {
        name: msg.username,
        userId: msg.userId,
        isCurrentUser: msg.userId === currentUserId,
        content: [messageContentItem],
      };
      grouped.push(newGroup);
      lastGroup = newGroup;
    }
  });
  return grouped;
};

interface ChatFieldProps {
  projectId: number;
}

export default function ChatField({ projectId }: ChatFieldProps) {
  const lastElementRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [rawMessages, setRawMessages] = useState<MessageFromDB[]>([]);
  const [displayedChats, setDisplayedChats] = useState<ChatItemGroup[]>([]);

  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUsername, setCurrentUsername] = useState<string>("");

  // 사용자 ID 및 닉네임 초기 설정 (컴포넌트 마운트 시 1회 실행)
  useEffect(() => {
    const userId = getOrCreateUserId();
    setCurrentUserId(userId);
    setCurrentUsername(getRandomUsername(userId));
  }, []);

  // 메시지 로딩 및 실시간 구독
  useEffect(() => {
    if (!projectId || !currentUserId) return;

    const fetchInitialMessages = async () => {
      const { data, error } = await supabase
        .from("Message")
        .select("id, content, userId, username, projectId, createdAt") // 명시적 컬럼 선택
        .eq("projectId", projectId)
        .order("createdAt", { ascending: true });

      if (error) {
        console.error("Error fetching initial messages:", error.message);
        setRawMessages([]);
      } else {
        setRawMessages((data as MessageFromDB[]) || []);
      }
    };

    fetchInitialMessages();

    const channel = supabase
      .channel(`project-chat-room-${projectId}`)
      .on<MessageFromDB>( // 수신 payload 타입 명시
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `projectId=eq.${projectId}`,
        },
        (payload) => {
          console.log("New message via Supabase:", payload.new);
          // 중복 추가 방지 (옵셔널: 매우 짧은 시간 내 중복 이벤트 발생 시)
          setRawMessages((prevMessages) => {
            if (prevMessages.find((m) => m.id === payload.new.id)) {
              return prevMessages;
            }
            return [...prevMessages, payload.new];
          });
        }
      )
      .subscribe((status, err) => {
        if (status === "SUBSCRIBED") {
          console.log(`Successfully subscribed to project chat: ${projectId}`);
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error(
            `Supabase subscription error for project ${projectId}:`,
            err || status
          );
        }
      });

    return () => {
      supabase.removeChannel(channel).catch(console.error);
    };
  }, [projectId, currentUserId]);

  // rawMessages 또는 currentUserId가 변경될 때마다 displayedChats 업데이트
  useEffect(() => {
    if (currentUserId) {
      // currentUserId가 설정된 후에만 변환 실행
      setDisplayedChats(
        transformMessagesForDisplay(rawMessages, currentUserId)
      );
    }
  }, [rawMessages, currentUserId]);

  // displayedChats가 변경될 때마다 맨 아래로 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [displayedChats]);

  const scrollToBottom = () => {
    lastElementRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  const handleSendMessage = async () => {
    const textarea = textareaRef.current;
    if (!textarea || textarea.value.trim() === "") {
      textarea?.focus();
      return;
    }
    if (!projectId || !currentUserId || !currentUsername) {
      console.error(
        "Chat prerequisites missing (projectId, userId, username)."
      );
      alert(
        "메시지 전송에 필요한 정보가 부족합니다. 페이지를 새로고침하거나 다시 시도해주세요."
      );
      return;
    }

    const messageContent = textarea.value.trim();

    const { error } = await supabase.from("Message").insert([
      {
        content: messageContent,
        userId: currentUserId,
        username: currentUsername,
        projectId: projectId,
      },
    ]);

    if (error) {
      console.error("Error sending message:", error.message);
      alert(`메시지 전송 오류: ${error.message}`);
    } else {
      textarea.value = "";
      // Textarea 높이 자동 조절 (전송 후 초기화)
      textarea.style.height = "auto";
      textarea.focus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaInput = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    // 자동 높이 조절
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  return (
    <div className="w-full h-[460px] flex flex-col bg-white border border-gray-300 rounded-md shadow-sm">
      <ScrollArea className="flex-grow h-[calc(100%-80px)] p-3">
        {" "}
        {/* 전체 높이에서 입력창 높이 제외 */}
        <div className="flex flex-col gap-y-3">
          {" "}
          {/* 메시지 그룹 간 간격 */}
          {displayedChats.map((chatGroup, groupIndex) => (
            <ChatBubble
              key={`${chatGroup.userId}-${groupIndex}`}
              chatGroup={chatGroup}
              ref={
                groupIndex === displayedChats.length - 1 ? lastElementRef : null
              }
            />
          ))}
        </div>
      </ScrollArea>

      <div className="w-full p-2 flex items-end border-t border-gray-200 bg-gray-50">
        <Textarea
          ref={textareaRef}
          name="text"
          className="flex-grow resize-none text-sm text-gray-800 font-medium mr-2 py-2 px-3 border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
          placeholder="메시지를 입력하세요..."
          rows={1}
          onInput={handleTextareaInput}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={handleSendMessage}
          className="p-2 h-10 w-10 flex items-center justify-center bg-sky-500 text-white rounded-full hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-colors"
          aria-label="Send message"
        >
          <Send className="size-5" />
        </button>
      </div>
    </div>
  );
}
